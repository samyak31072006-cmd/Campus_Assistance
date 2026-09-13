import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-razorpay-signature");

    // CRITICAL: Read RAW request body text before any JSON parsing
    const rawBody = await request.text();

    // 1. Verify Webhook Signature if RAZORPAY_WEBHOOK_SECRET is configured
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      if (!signature) {
        return NextResponse.json(
          { success: false, error: "Missing x-razorpay-signature header" },
          { status: 400 }
        );
      }

      const isValid = verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        console.warn("[SECURITY WARNING] Invalid Razorpay webhook signature");
        return NextResponse.json(
          { success: false, error: "Invalid webhook signature" },
          { status: 400 }
        );
      }
    }

    // 2. Parse event payload after signature verification
    const eventPayload = JSON.parse(rawBody);
    const event = eventPayload.event;
    const paymentEntity = eventPayload.payload?.payment?.entity;
    const orderEntity = eventPayload.payload?.order?.entity;

    const razorpayPaymentId = paymentEntity?.id;
    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const amountInPaise = paymentEntity?.amount || orderEntity?.amount;
    const amountInInr = amountInPaise ? amountInPaise / 100 : 0;
    const paymentMethod = paymentEntity?.method || "upi";

    console.log(`[RAZORPAY WEBHOOK] Processing event '${event}' for Order '${razorpayOrderId}' Payment '${razorpayPaymentId}'`);

    if (!razorpayOrderId) {
      return NextResponse.json({ success: true, message: "No razorpayOrderId in payload" });
    }

    // Find Order in DB by razorpayOrderId or notes.internalOrderId
    const internalOrderNumber = paymentEntity?.notes?.internalOrderId || orderEntity?.notes?.internalOrderId;
    const order = await db.order.findFirst({
      where: {
        OR: [
          { razorpayOrderId },
          ...(internalOrderNumber ? [{ orderNumber: internalOrderNumber }] : []),
        ],
      },
      include: {
        payments: true,
        assignments: true,
      },
    });

    if (!order) {
      console.warn(`[RAZORPAY WEBHOOK] Order not found for razorpayOrderId '${razorpayOrderId}'`);
      return NextResponse.json({ success: true, message: "Order not found in system" });
    }

    // 3. EVENT HANDLERS WITH IDEMPOTENCY PROTECTION

    if (event === "payment.captured" || event === "order.paid") {
      // IDEMPOTENCY CHECK: If already captured, skip to prevent double processing
      const existingPayment = order.payments.find(
        (p) => p.razorpayPaymentId === razorpayPaymentId && p.status === "CAPTURED"
      );

      if (existingPayment && (order.status === "PAID" || order.status === "CREATOR_ASSIGNED")) {
        console.log(`[WEBHOOK IDEMPOTENCY] Event '${event}' for #${order.orderNumber} already processed. Skipping.`);
        return NextResponse.json({ success: true, message: "Event already processed (idempotent)" });
      }

      // Record / Update Payment to CAPTURED
      if (razorpayPaymentId) {
        await db.payment.upsert({
          where: { razorpayPaymentId },
          update: {
            status: "CAPTURED",
            method: paymentMethod,
            amount: amountInInr > 0 ? amountInInr : order.totalAmount,
          },
          create: {
            orderId: order.id,
            razorpayOrderId,
            razorpayPaymentId,
            amount: amountInInr > 0 ? amountInInr : order.totalAmount,
            currency: "INR",
            method: paymentMethod,
            provider: "RAZORPAY",
            status: "CAPTURED",
          },
        });
      }

      // Update Order Status to PAID
      await db.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          totalAmount: amountInInr > 0 ? amountInInr : order.totalAmount,
        },
      });

      // Idempotent Creator Assignment
      if (order.assignments.length === 0) {
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

          await db.order.update({
            where: { id: order.id },
            data: { status: "CREATOR_ASSIGNED" },
          });

          await db.notification.create({
            data: {
              userId: availableCreator.userId,
              title: `New Paid Order Assigned: #${order.orderNumber}`,
              message: `You have been assigned to ${order.serviceType} #${order.orderNumber}. Payout: ₹${creatorPayout}.`,
            },
          });
        }
      }

      // Send Student Notification
      await db.notification.create({
        data: {
          userId: order.userId,
          title: `Payment Successful — #${order.orderNumber}`,
          message: `Razorpay webhook confirmed payment of ₹${order.totalAmount}. Creator assignment in progress.`,
        },
      });
    } else if (event === "payment.failed") {
      // Record Payment Failure
      if (razorpayPaymentId) {
        await db.payment.upsert({
          where: { razorpayPaymentId },
          update: {
            status: "FAILED",
          },
          create: {
            orderId: order.id,
            razorpayOrderId,
            razorpayPaymentId,
            amount: amountInInr > 0 ? amountInInr : order.totalAmount,
            currency: "INR",
            method: paymentMethod,
            provider: "RAZORPAY",
            status: "FAILED",
          },
        });
      }

      // Keep Order.status as PAYMENT_PENDING so student can retry
      await db.order.update({
        where: { id: order.id },
        data: { status: "PAYMENT_PENDING" },
      });

      // Send Notification
      await db.notification.create({
        data: {
          userId: order.userId,
          title: `Payment Attempt Failed — #${order.orderNumber}`,
          message: "Your payment attempt failed. You can safely retry payment from your checkout page.",
        },
      });
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
