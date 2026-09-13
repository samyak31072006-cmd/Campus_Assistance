import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status") || "ALL";
    const query = searchParams.get("query") || "";

    const whereClause: any = {};
    if (statusFilter !== "ALL") {
      whereClause.status = statusFilter;
    }

    const payments = await db.payment.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          include: {
            user: true,
            pickupLocation: true,
          },
        },
      },
    });

    const filteredPayments = payments.filter((p) => {
      if (!query) return true;
      const search = query.toLowerCase();
      return (
        p.order.orderNumber.toLowerCase().includes(search) ||
        (p.order.user?.name || "").toLowerCase().includes(search) ||
        (p.razorpayPaymentId || "").toLowerCase().includes(search) ||
        (p.razorpayOrderId || "").toLowerCase().includes(search)
      );
    });

    return NextResponse.json({
      success: true,
      payments: filteredPayments,
    });
  } catch (error) {
    console.error("Error fetching admin payments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
