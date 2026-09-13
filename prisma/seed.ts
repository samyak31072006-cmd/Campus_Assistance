import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with updated CAD prepared sheet samples...");

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.creatorOrderAssignment.deleteMany();
  await prisma.orderFile.deleteMany();
  await prisma.assignmentDetails.deleteMany();
  await prisma.cadOrderDetails.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cadProduct.deleteMany();
  await prisma.pricingRule.deleteMany();
  await prisma.campusLocation.deleteMany();
  await prisma.college.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create College
  const college = await prisma.college.create({
    data: {
      name: "Main Campus Institute of Technology",
      code: "MCIT",
      active: true,
    },
  });

  // 2. Create Campus Pickup Locations
  const locations = await Promise.all([
    prisma.campusLocation.create({
      data: {
        collegeId: college.id,
        name: "Central Library (Ground Floor Desk)",
        description: "Main entrance counter near reference section",
        hours: "9:00 AM - 8:00 PM",
        active: true,
      },
    }),
    prisma.campusLocation.create({
      data: {
        collegeId: college.id,
        name: "Academic Block 1 (A-Block Canteen)",
        description: "Next to Nescafe kiosk",
        hours: "10:00 AM - 6:00 PM",
        active: true,
      },
    }),
    prisma.campusLocation.create({
      data: {
        collegeId: college.id,
        name: "Hostel Complex (Block A Reception)",
        description: "Student security desk",
        hours: "4:00 PM - 10:00 PM",
        active: true,
      },
    }),
    prisma.campusLocation.create({
      data: {
        collegeId: college.id,
        name: "Mechanical Engineering Dept Lab",
        description: "Room M-104 CAD Lab",
        hours: "11:00 AM - 5:00 PM",
        active: true,
      },
    }),
    prisma.campusLocation.create({
      data: {
        collegeId: college.id,
        name: "Sports Complex Pavilion",
        description: "Near student lounge",
        hours: "3:00 PM - 7:00 PM",
        active: true,
      },
    }),
  ]);

  // 3. Pricing Rule
  await prisma.pricingRule.create({
    data: {
      collegeId: college.id,
      serviceType: "ASSIGNMENT",
      price: 25.0, // ₹25 per page
      rushFee: 50.0,
      active: true,
    },
  });

  // 4. Users (Students, Creators, Admin)
  const student1 = await prisma.user.create({
    data: {
      id: "user-student-1",
      name: "Rohan Sharma",
      email: "rohan.sharma@campus.edu",
      phone: "+91 98765 43210",
      collegeId: college.id,
      branch: "Computer Science",
      section: "CS-B",
      rollNumber: "21BCE1042",
      role: "STUDENT",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      id: "user-student-2",
      name: "Ananya Sen",
      email: "ananya.sen@campus.edu",
      phone: "+91 98765 11111",
      collegeId: college.id,
      branch: "Electrical Engineering",
      section: "EE-A",
      rollNumber: "22BEE1015",
      role: "STUDENT",
    },
  });

  const student3 = await prisma.user.create({
    data: {
      id: "user-student-3",
      name: "Priyanshu Patel",
      email: "priyanshu.patel@campus.edu",
      phone: "+91 98765 22222",
      collegeId: college.id,
      branch: "Mechanical Engineering",
      section: "ME-C",
      rollNumber: "21BME1088",
      role: "STUDENT",
    },
  });

  const student4 = await prisma.user.create({
    data: {
      id: "user-student-4",
      name: "Vikramaditya Singh",
      email: "vikram.singh@campus.edu",
      phone: "+91 98765 33333",
      collegeId: college.id,
      branch: "Civil Engineering",
      section: "CE-A",
      rollNumber: "23BCE1004",
      role: "STUDENT",
    },
  });

  const student5 = await prisma.user.create({
    data: {
      id: "user-student-5",
      name: "Sneha Roy",
      email: "sneha.roy@campus.edu",
      phone: "+91 98765 44444",
      collegeId: college.id,
      branch: "Chemical Engineering",
      section: "CH-B",
      rollNumber: "22BCH1029",
      role: "STUDENT",
    },
  });

  // Creators
  const creatorUser1 = await prisma.user.create({
    data: {
      id: "user-creator-1",
      name: "Aman Verma",
      email: "aman.creator@campus.edu",
      phone: "+91 98123 45678",
      collegeId: college.id,
      role: "CREATOR",
    },
  });

  const creatorProfile1 = await prisma.creatorProfile.create({
    data: {
      userId: creatorUser1.id,
      availability: true,
      rating: 4.9,
      totalOrders: 42,
      totalEarnings: 7560,
    },
  });

  const creatorUser2 = await prisma.user.create({
    data: {
      id: "user-creator-2",
      name: "Priya Nair",
      email: "priya.creator@campus.edu",
      phone: "+91 98123 99999",
      collegeId: college.id,
      role: "CREATOR",
    },
  });

  await prisma.creatorProfile.create({
    data: {
      userId: creatorUser2.id,
      availability: true,
      rating: 4.8,
      totalOrders: 28,
      totalEarnings: 4800,
    },
  });

  // Admin
  await prisma.user.create({
    data: {
      id: "user-admin-1",
      name: "Campus Ops Admin",
      email: "admin@campusassistance.in",
      phone: "+91 99999 88888",
      collegeId: college.id,
      role: "ADMIN",
    },
  });

  // 5. CAD Products Catalogue with Admin-Uploaded Final Prepared Sheet Samples
  const cadProducts = await Promise.all([
    prisma.cadProduct.create({
      data: {
        id: "cad-1",
        title: "Orthographic Projection — Sheet 03",
        description: "First & Third Angle Projections of Complex Machine Blocks. Includes front, top, and side elevation views with exact IS standard dimensioning.",
        category: "Orthographic Projection",
        price: 149.0,
        turnaroundHours: 24,
        difficulty: "Intermediate",
        availability: "Available",
        sampleImages: JSON.stringify([
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
        ]),
        preparedSampleUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        active: true,
      },
    }),
    prisma.cadProduct.create({
      data: {
        id: "cad-2",
        title: "Isometric Projection — Sheet 01",
        description: "3D Isometric view layout of stepped cylinder and slotted prism. Features isometric scale construction and hidden line representations.",
        category: "Isometric Projection",
        price: 129.0,
        turnaroundHours: 18,
        difficulty: "Basic",
        availability: "Available",
        sampleImages: JSON.stringify([
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
        ]),
        preparedSampleUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
        active: true,
      },
    }),
    prisma.cadProduct.create({
      data: {
        id: "cad-3",
        title: "Sectional View — Assembly Sheet 05",
        description: "Full Sectional and Half Sectional Views of Flange Coupling assembly. Shows hatch patterns, centerlines, and bill of materials.",
        category: "Sectional Views",
        price: 169.0,
        turnaroundHours: 24,
        difficulty: "Advanced",
        availability: "High Demand",
        sampleImages: JSON.stringify([
          "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
        ]),
        preparedSampleUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80",
        active: true,
      },
    }),
    prisma.cadProduct.create({
      data: {
        id: "cad-4",
        title: "Development of Surfaces — Sheet 02",
        description: "Radial line and Parallel line developments for truncated cone, pyramid, and elbow pipe transitions.",
        category: "Development of Surfaces",
        price: 159.0,
        turnaroundHours: 24,
        difficulty: "Intermediate",
        availability: "Available",
        sampleImages: JSON.stringify([
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
        ]),
        preparedSampleUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        active: true,
      },
    }),
    prisma.cadProduct.create({
      data: {
        id: "cad-5",
        title: "Projection of Lines & Planes — Sheet 04",
        description: "True length determination, inclinations (HP/VP), traces (HT/VT), and auxiliary plane projections.",
        category: "Projection of Lines",
        price: 119.0,
        turnaroundHours: 12,
        difficulty: "Basic",
        availability: "Available",
        sampleImages: JSON.stringify([
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
        ]),
        preparedSampleUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
        active: true,
      },
    }),
    prisma.cadProduct.create({
      data: {
        id: "cad-6",
        title: "AutoCAD 2D Mechanical Component Layout",
        description: "Professional AutoCAD .dwg layout print with title block, layers, line weights, and dimensioning standards.",
        category: "AutoCAD",
        price: 199.0,
        turnaroundHours: 36,
        difficulty: "Advanced",
        availability: "Available",
        sampleImages: JSON.stringify([
          "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
        ]),
        preparedSampleUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80",
        active: true,
      },
    }),
  ]);

  // 6. Sample Orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ASG1024",
      userId: student1.id,
      serviceType: "ASSIGNMENT",
      status: "IN_PROGRESS",
      totalAmount: 300.0,
      deadline: new Date(Date.now() + 24 * 3600 * 1000),
      pickupLocationId: locations[0].id,
      instructions: "Please make sure to write neatly with blue ballpoint pen.",
      assignmentDetail: {
        create: {
          billablePages: 12,
          pricePerPage: 25.0,
        },
      },
      files: {
        create: [
          {
            fileName: "Engineering_Physics_Assignment.pdf",
            fileUrl: "/uploads/sample_assignment_1.pdf",
            fileType: "assignment_doc",
          },
        ],
      },
      payments: {
        create: [
          {
            provider: "DEMO",
            razorpayPaymentId: "pay_demo_99812",
            razorpayOrderId: "order_demo_99812",
            amount: 300.0,
            status: "CAPTURED",
          },
        ],
      },
    },
  });

  await prisma.creatorOrderAssignment.create({
    data: {
      orderId: order1.id,
      creatorId: creatorProfile1.id,
      payoutAmount: 180.0,
      status: "IN_PROGRESS",
    },
  });

  console.log("Database seeded successfully with updated prepared sheet samples!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
