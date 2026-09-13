import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const creatorUser = await db.user.findFirst({
      where: { role: "CREATOR" },
      include: { creator: true },
    });

    // Fetch assigned orders
    const orders = await db.order.findMany({
      where: {
        status: { in: ["PAID", "CREATOR_ASSIGNED", "IN_PROGRESS", "QUALITY_CHECK", "READY_FOR_PICKUP", "DELIVERED"] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        pickupLocation: true,
        assignmentDetail: true,
        cadOrderDetail: { include: { cadProduct: true } },
        files: true,
        assignments: true,
      },
    });

    return NextResponse.json({
      success: true,
      creatorProfile: creatorUser?.creator || {
        rating: 4.9,
        totalOrders: 42,
        totalEarnings: 7560,
      },
      orders,
    });
  } catch (error) {
    console.error("Error fetching creator orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch creator data" },
      { status: 500 }
    );
  }
}
