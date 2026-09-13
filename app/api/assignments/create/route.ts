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
      files,
    } = body;

    // Generate unique order number (e.g. ASG1028)
    const count = await db.order.count({ where: { serviceType: "ASSIGNMENT" } });
    const orderNumber = `ASG${1000 + count + 1}`;

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

    // Safe Campus Location lookup
    const defaultLoc = await db.campusLocation.findFirst({ where: { active: true } });
    let locationId = defaultLoc?.id;

    if (pickupLocationId && !pickupLocationId.startsWith("loc-")) {
      const validLoc = await db.campusLocation.findUnique({ where: { id: pickupLocationId } });
      if (validLoc) locationId = validLoc.id;
    }

    // Create Order with PAGE_COUNT_PENDING status
    const newOrder = await db.order.create({
      data: {
        orderNumber,
        userId: user.id,
        serviceType: "ASSIGNMENT",
        status: "PAGE_COUNT_PENDING",
        totalAmount: 0, // Pending page count verification
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 48 * 3600 * 1000),
        pickupLocationId: locationId,
        instructions: instructions || "",
        assignmentDetail: {
          create: {
            billablePages: null,
            pricePerPage: 25.0, // base rate from DB
            rushFee: 0,
            additionalFee: 0,
          },
        },
        files: {
          create: (files || []).map((f: { name: string; url: string }) => ({
            fileName: f.name || "Assignment_Doc.pdf",
            fileUrl: f.url || "/uploads/assignment.pdf",
            fileType: "assignment_doc",
          })),
        },
      },
      include: {
        assignmentDetail: true,
        files: true,
        pickupLocation: true,
      },
    });

    // Create initial notification for student
    await db.notification.create({
      data: {
        userId: user.id,
        title: `Assignment ${newOrder.orderNumber} Uploaded`,
        message: "Your assignment file has been uploaded. Our admin team is verifying page count.",
      },
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating assignment order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create assignment order" },
      { status: 500 }
    );
  }
}
