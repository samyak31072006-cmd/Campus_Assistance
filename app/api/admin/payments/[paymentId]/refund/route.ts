import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { razorpayInstance } from "@/lib/razorpay";

export async function POST(
  request: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    const paymentId = params.paymentId;
    const body = await request.json();
    const { amount, reason } = body;

    // Find payment record in DB
    const payment = await db.payment.findFirst({
      where: {
        OR: [{ id: paymentId }, { razorpayPaymentId: paymentId }],
      },
      include: { order: true },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment record not found" },
        { status: 404 }
      );
    }

    if (payment.status === "REFUNDED") {
      return NextResponse.json(
        { success: false, error: "Payment has already been refunded" },
        { status: 400 }
      );
    }

    const refundAmount = amount ? parseFloat(amount) : payment.amount;
    let razorpayRefundId = `ref_demo_${Date.now()}`;

    // Invoke Razorpay Refund API if Razorpay SDK active & live payment ID present
    if (razorpayInstance && payment.razorpayPaymentId && !payment.razorpayPaymentId.startsWith("pay_demo_")) {
      try {
        const rzpRefund = await razorpayInstance.payments.refund(payment.razorpayPaymentId, {
          amount: Math.round(refundAmount * 100),
          notes: {
            reason: reason || "Admin requested refund",
            orderId: payment.order.orderNumber,
          },
        });
        razorpayRefundId = rzpRefund.id;
      } catch (err: any) {
        console.error("Razorpay API refund error:", err);
        return NextResponse.json(
          { success: false, error: "Razorpay refund failed: " + (err.description || err.message) },
          { status: 500 }
        );
      }
    }

    // Update DB Payment & Order state to REFUNDED
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: "REFUNDED",
        refundId: razorpayRefundId,
        refundAmount,
      },
    });

    await db.order.update({
      where: { id: payment.orderId },
      data: { status: "REFUNDED" },
    });

    // Notify Student
    await db.notification.create({
      data: {
        userId: payment.order.userId,
        title: `Refund Processed for #${payment.order.orderNumber}`,
        message: `Refund of ₹${refundAmount} has been processed back to your original payment account (ID: ${razorpayRefundId}).`,
      },
    });

    return NextResponse.json({
      success: true,
      refundId: razorpayRefundId,
      amount: refundAmount,
      status: "REFUNDED",
    });
  } catch (error) {
    console.error("Error processing admin refund:", error);
    return NextResponse.json(
      { success: false, error: "Refund processing failed" },
      { status: 500 }
    );
  }
}
