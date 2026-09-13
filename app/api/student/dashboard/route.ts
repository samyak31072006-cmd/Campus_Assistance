import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const studentUser = await db.user.findFirst({
      where: { role: "STUDENT" },
    });

    if (!studentUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const orders = await db.order.findMany({
      where: { userId: studentUser.id },
      orderBy: { createdAt: "desc" },
      include: {
        pickupLocation: true,
        assignmentDetail: true,
        cadOrderDetail: { include: { cadProduct: true } },
        files: true,
      },
    });

    const notifications = await db.notification.findMany({
      where: { userId: studentUser.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      user: studentUser,
      orders,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch student dashboard" },
      { status: 500 }
    );
  }
}
