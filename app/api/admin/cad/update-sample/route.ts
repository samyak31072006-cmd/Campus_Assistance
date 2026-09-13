import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cadProductId, preparedSampleUrl } = body;

    if (!cadProductId || !preparedSampleUrl) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const updatedProduct = await db.cadProduct.update({
      where: { id: cadProductId },
      data: { preparedSampleUrl },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating prepared sheet sample:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update prepared sample image" },
      { status: 500 }
    );
  }
}
