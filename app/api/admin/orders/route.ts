import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        pickupLocation: true,
        assignmentDetail: true,
        cadOrderDetail: { include: { cadProduct: true } },
        assignments: { include: { creator: { include: { user: true } } } },
        files: true,
      },
    });

    const pricingRule = await db.pricingRule.findFirst({
      where: { serviceType: "ASSIGNMENT", active: true },
      orderBy: { effectiveFrom: "desc" },
    });

    return NextResponse.json({
      success: true,
      orders,
      currentAssignmentRate: pricingRule?.price || 25,
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
