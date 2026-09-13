import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Search by orderNumber (e.g. ASG1024) or by database UUID
    const order = await db.order.findFirst({
      where: {
        OR: [{ orderNumber: orderId }, { id: orderId }],
      },
      include: {
        user: true,
        pickupLocation: true,
        assignmentDetail: true,
        cadOrderDetail: {
          include: { cadProduct: true },
        },
        files: true,
        payments: true,
        assignments: {
          include: { creator: { include: { user: true } } },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
