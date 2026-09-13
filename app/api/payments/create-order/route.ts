import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { razorpayInstance, getRazorpayKeyId } from "@/lib/razorpay";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { internalOrderId } = body;

    if (!internalOrderId) {
      return NextResponse.json(
        { success: false, error: "Internal Order ID is required" },
        { status: 400 }
      );
    }

    // 1. Fetch internal order from database
    const order = await db.order.findFirst({
      where: {
        OR: [{ orderNumber: internalOrderId }, { id: internalOrderId }],
      },
      include: {
        user: true,
        assignmentDetail: true,
        cadOrderDetail: true,
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // 2. Verify order eligibility for payment
    const allowedStatuses = ["PAGE_COUNT_VERIFIED", "PAYMENT_PENDING"];
    if (!allowedStatuses.includes(order.status)) {
      if (order.status === "PAID" || order.status === "CREATOR_ASSIGNED" || order.status === "IN_PROGRESS") {
        return NextResponse.json(
          { success: false, error: "Order has already been paid and confirmed" },
          { status: 400 }
        );
      }
      if (order.status === "PAGE_COUNT_PENDING") {
        return NextResponse.json(
          { success: false, error: "Order is pending admin page count verification" },
          { status: 400 }
        );
      }
    }

    // 3. CRITICAL SECURITY RULE: Calculate exact total amount from DB records
    let calculatedAmount = 0;
    let subtotal = 0;
    let rushFee = 0;
    let additionalFee = 0;
    let discount = order.discount || 0;

    if (order.serviceType === "ASSIGNMENT" && order.assignmentDetail) {
      const pages = order.assignmentDetail.billablePages || 1;
      const pricePerPage = order.assignmentDetail.pricePerPage || 25;
      rushFee = order.assignmentDetail.rushFee || 0;
      additionalFee = order.assignmentDetail.additionalFee || 0;
      subtotal = pages * pricePerPage;
      calculatedAmount = subtotal + rushFee + additionalFee - discount;
    } else if (order.serviceType === "CAD" && order.cadOrderDetail) {
      const quantity = order.cadOrderDetail.quantity || 1;
      const pricePerSheet = order.cadOrderDetail.pricePerSheet || 149;
      rushFee = order.cadOrderDetail.rushFee || 0;
      additionalFee = order.cadOrderDetail.additionalFee || 0;
      subtotal = quantity * pricePerSheet;
      calculatedAmount = subtotal + rushFee + additionalFee - discount;
    } else {
      calculatedAmount = order.totalAmount > 0 ? order.totalAmount : 149;
    }

    // Ensure non-zero positive amount
    calculatedAmount = Math.max(1, calculatedAmount);

    // Update order amounts in DB
    await db.order.update({
      where: { id: order.id },
      data: {
        subtotal,
        rushFee,
        additionalFee,
        totalAmount: calculatedAmount,
      },
    });

    const amountInPaise = Math.round(calculatedAmount * 100);
    const keyId = getRazorpayKeyId();

    // 4. Prevent duplicate Razorpay orders: Reuse existing active unpaid order if present
    const existingActivePayment = order.payments.find(
      (p) => p.status === "CREATED" && p.razorpayOrderId
    );

    if (existingActivePayment && existingActivePayment.razorpayOrderId) {
      return NextResponse.json({
        success: true,
        key: keyId,
        razorpayOrderId: existingActivePayment.razorpayOrderId,
        amount: amountInPaise,
        currency: "INR",
        internalOrderId: order.orderNumber,
        provider: existingActivePayment.provider,
      });
    }

    // 5. Create new Razorpay order via Razorpay SDK (or fallback for demo environment)
    let razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    let provider: "RAZORPAY" | "DEMO" = "DEMO";

    if (razorpayInstance) {
      try {
        const rzpOrder = await razorpayInstance.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: order.orderNumber,
          notes: {
            internalOrderId: order.orderNumber,
            serviceType: order.serviceType,
            userId: order.userId,
          },
        });
        razorpayOrderId = rzpOrder.id;
        provider = "RAZORPAY";
      } catch (err) {
        console.error("Razorpay SDK order creation error, falling back to Demo mode:", err);
      }
    }

    // 6. Record Payment in DB with CREATED status
    await db.payment.create({
      data: {
        orderId: order.id,
        razorpayOrderId,
        amount: calculatedAmount,
        currency: "INR",
        provider,
        status: "CREATED",
      },
    });

    // Update Order with razorpayOrderId
    await db.order.update({
      where: { id: order.id },
      data: { razorpayOrderId },
    });

    return NextResponse.json({
      success: true,
      key: keyId,
      razorpayOrderId,
      amount: amountInPaise,
      currency: "INR",
      internalOrderId: order.orderNumber,
      provider,
    });
  } catch (error) {
    console.error("Error creating Razorpay payment order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
