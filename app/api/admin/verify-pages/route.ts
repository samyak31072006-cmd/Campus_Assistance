import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, billablePages, pricePerPage, rushFee, additionalFee } = body;

    if (!orderId || billablePages === undefined) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const pages = parseInt(billablePages);
    const rate = parseFloat(pricePerPage || 25);
    const rush = parseFloat(rushFee || 0);
    const additional = parseFloat(additionalFee || 0);
    const totalAmount = pages * rate + rush + additional;

    // Find order
    const order = await db.order.findFirst({
      where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Update assignment details
    await db.assignmentDetails.upsert({
      where: { orderId: order.id },
      update: {
        billablePages: pages,
        pricePerPage: rate,
        rushFee: rush,
        additionalFee: additional,
      },
      create: {
        orderId: order.id,
        billablePages: pages,
        pricePerPage: rate,
        rushFee: rush,
        additionalFee: additional,
      },
    });

    // Update order status and total amount
    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: {
        totalAmount,
        status: "PAGE_COUNT_VERIFIED",
      },
      include: {
        assignmentDetail: true,
        user: true,
      },
    });

    // Create Notification for Student
    await db.notification.create({
      data: {
        userId: order.userId,
        title: `Assignment Reviewed — #${order.orderNumber}`,
        message: `Our team verified your assignment: ${pages} pages × ₹${rate} = ₹${totalAmount}. Please proceed to payment.`,
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error verifying assignment page count:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
