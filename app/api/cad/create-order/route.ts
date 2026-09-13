import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentName,
      studentEmail,
      studentPhone,
      rollNumber,
      branch,
      section,
      pickupLocationId,
      deadline,
      instructions,
      cadProductId,
      price,
      questionFileName,
    } = body;

    // Generate CAD Order ID (e.g. CAD1006)
    const count = await db.order.count({ where: { serviceType: "CAD" } });
    const orderNumber = `CAD${1000 + count + 1}`;

    // Get or create user
    let user = await db.user.findFirst({ where: { email: studentEmail || "rohan.sharma@campus.edu" } });
    if (!user) {
      user = await db.user.create({
        data: {
          name: studentName || "Rohan Sharma",
          email: studentEmail || `student_${Date.now()}@campus.edu`,
          phone: studentPhone || "+91 98765 43210",
          rollNumber: rollNumber || "21BCE1042",
          branch: branch || "Computer Science",
          section: section || "CS-B",
          role: "STUDENT",
        },
      });
    }

    // Default CAD Product lookup
    let targetCadProduct = await db.cadProduct.findFirst();
    if (cadProductId) {
      const found = await db.cadProduct.findFirst({
        where: { OR: [{ id: cadProductId }, { title: { contains: "Orthographic" } }] },
      });
      if (found) targetCadProduct = found;
    }

    const pricePerSheet = price ? parseFloat(price) : targetCadProduct?.price || 149.0;
    const totalAmount = pricePerSheet;

    // Safe Campus Location lookup
    const defaultLoc = await db.campusLocation.findFirst({ where: { active: true } });
    let locationId = defaultLoc?.id;

    if (pickupLocationId && !pickupLocationId.startsWith("loc-")) {
      const validLoc = await db.campusLocation.findUnique({ where: { id: pickupLocationId } });
      if (validLoc) locationId = validLoc.id;
    }

    // Create Order in PAYMENT_PENDING state
    const newOrder = await db.order.create({
      data: {
        orderNumber,
        userId: user.id,
        serviceType: "CAD",
        status: "PAYMENT_PENDING",
        totalAmount,
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 24 * 3600 * 1000),
        pickupLocationId: locationId,
        instructions: instructions || "",
        ...(targetCadProduct ? {
          cadOrderDetail: {
            create: {
              cadProductId: targetCadProduct.id,
              quantity: 1,
              pricePerSheet,
            },
          },
        } : {}),
        files: {
          create: [
            {
              fileName: questionFileName || "CAD_Question_Reference.jpg",
              fileUrl: "/uploads/question_reference.jpg",
              fileType: "question_ref",
            },
          ],
        },
      },
      include: {
        cadOrderDetail: { include: { cadProduct: true } },
        files: true,
        pickupLocation: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating CAD order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create CAD order" },
      { status: 500 }
    );
  }
}
