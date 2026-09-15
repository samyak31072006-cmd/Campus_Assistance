import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      internalOrderId,
      orderId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      provider,
    } = body;

    const targetId = internalOrderId || orderId;

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "Missing internalOrderId" },
        { status: 400 }
      );
    }

    // 1. Fetch internal order with details and payment attempts
    const order = await db.order.findFirst({
      where: {
        OR: [{ orderNumber: targetId }, { id: targetId }],
      },
      include: {
        user: true,
        payments: true,
        assignments: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Internal Order not found" },
        { status: 404 }
      );
    }

    const isDemo = provider === "DEMO" || !razorpaySignature;

    // 2. Perform Server-Side Signature Verification for Razorpay payments
    if (!isDemo) {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json(
          { success: false, error: "Missing Razorpay payment parameters" },
          { status: 400 }
        );
      }

      const isValid = verifyRazorpaySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isValid) {
        console.warn(`[SECURITY WARNING] Invalid payment signature attempt for order #${order.orderNumber}`);
        
        // Record failed attempt
        await db.payment.create({
          data: {
            orderId: order.id,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            amount: order.totalAmount,
            status: "FAILED",
            provider: "RAZORPAY",
          },
        });

        return NextResponse.json(
          { success: false, error: "Invalid payment signature" },
          { status: 400 }
        );
      }
    }

    // 3. Database Transaction: Update Payment & Order Status to CAPTURED / PAID
    const paymentTxnId = razorpayPaymentId || `pay_demo_${Date.now()}`;
    const paymentRzpOrderId = razorpayOrderId || order.razorpayOrderId || `order_demo_${Date.now()}`;

    // Update existing payment or create captured record
    const existingPayment = order.payments.find(
      (p) => p.razorpayOrderId === paymentRzpOrderId
    );

    if (existingPayment) {
      await db.payment.update({
        where: { id: existingPayment.id },
        data: {
          razorpayPaymentId: paymentTxnId,
          razorpaySignature: razorpaySignature || "demo_sig",
          status: "CAPTURED",
          provider: isDemo ? "DEMO" : "RAZORPAY",
        },
      });
    } else {
      await db.payment.create({
        data: {
          orderId: order.id,
          razorpayOrderId: paymentRzpOrderId,
          razorpayPaymentId: paymentTxnId,
          razorpaySignature: razorpaySignature || "demo_sig",
          amount: order.totalAmount,
          currency: "INR",
          status: "CAPTURED",
          provider: isDemo ? "DEMO" : "RAZORPAY",
        },
      });
    }

    // Update Order to PAID
    await db.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });

    // 4. Idempotent Creator Assignment (Requirement 20 & 24)
    let creatorAssigned = false;
    if (order.assignments.length === 0) {
      // Find an available campus creator profile
      const availableCreator = await db.creatorProfile.findFirst({
        where: { availability: true },
        orderBy: { totalOrders: "asc" },
      });

      if (availableCreator) {
        const creatorPayout =
          order.serviceType === "ASSIGNMENT"
            ? order.totalAmount * 0.6
            : order.totalAmount * 0.67;

        await db.creatorOrderAssignment.create({
          data: {
            orderId: order.id,
            creatorId: availableCreator.id,
            payoutAmount: creatorPayout,
            status: "ASSIGNED",
          },
        });

        // Transition status to CREATOR_ASSIGNED
        await db.order.update({
          where: { id: order.id },
          data: { status: "CREATOR_ASSIGNED" },
        });

        creatorAssigned = true;

        // Notify Creator
        await db.notification.create({
          data: {
            userId: availableCreator.userId,
            title: `New Paid Order Assigned: #${order.orderNumber}`,
            message: `You have been assigned to ${order.serviceType} #${order.orderNumber}. Payout: ₹${creatorPayout}.`,
          },
        });
      }
    }

    // 5. Create Student Notification
    await db.notification.create({
      data: {
        userId: order.userId,
        title: `Payment Successful — #${order.orderNumber}`,
        message: `Payment of ₹${order.totalAmount} confirmed. Your order has been verified and a creator is working on it.`,
      },
    });

    // Update spreadsheet row with updated status (PAID/CREATOR_ASSIGNED)
    try {
      const { recordAssignmentOrderInSpreadsheet, recordCadOrderInSpreadsheet } = await import("@/lib/spreadsheet");
      if (order.serviceType === "ASSIGNMENT") {
        await recordAssignmentOrderInSpreadsheet(order.id);
      } else {
        await recordCadOrderInSpreadsheet(order.id);
      }
    } catch (e) {
      console.error("Spreadsheet status update error:", e);
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      status: creatorAssigned ? "CREATOR_ASSIGNED" : "PAID",
      paymentId: paymentTxnId,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, error: "Payment verification error" },
      { status: 500 }
    );
  }
}
