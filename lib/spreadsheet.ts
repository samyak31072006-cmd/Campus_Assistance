import fs from "fs";
import path from "path";
import { db } from "@/lib/db";

// Ensure exports folder exists
const exportsDir = path.join(process.cwd(), "public", "exports");
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

const assignmentCsvPath = path.join(exportsDir, "assignment_orders.csv");
const cadCsvPath = path.join(exportsDir, "cad_orders.csv");

const ASSIGNMENT_HEADERS = [
  "Order Number",
  "Student Name",
  "Email",
  "Phone",
  "Roll Number",
  "Branch",
  "Section",
  "Billable Pages",
  "Price Per Page (INR)",
  "Total Amount (INR)",
  "Status",
  "Pickup Location",
  "Instructions",
  "Created At"
];

const CAD_HEADERS = [
  "Order Number",
  "Student Name",
  "Email",
  "Phone",
  "Roll Number",
  "Branch",
  "Section",
  "CAD Sheet Title",
  "Sheet Category",
  "Price Per Sheet (INR)",
  "Total Amount (INR)",
  "Status",
  "Pickup Location",
  "Instructions",
  "Created At"
];

function escapeCsvField(field: any): string {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Sync order to external Google Sheets Webhook if configured in .env
 */
export async function syncToGoogleSheets(orderData: Record<string, any>, serviceType: "ASSIGNMENT" | "CAD") {
  try {
    const webhookUrl = serviceType === "ASSIGNMENT"
      ? process.env.GOOGLE_SHEETS_ASSIGNMENTS_WEBHOOK
      : process.env.GOOGLE_SHEETS_CAD_WEBHOOK;

    if (!webhookUrl) return;

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
  } catch (err) {
    console.error(`Failed to sync ${serviceType} order to Google Sheets:`, err);
  }
}

/**
 * Append single assignment order row to public/exports/assignment_orders.csv
 */
export async function recordAssignmentOrderInSpreadsheet(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        assignmentDetail: true,
        pickupLocation: true,
      },
    });

    if (!order) return;

    const rowData = [
      order.orderNumber,
      order.user.name,
      order.user.email,
      order.user.phone || "",
      order.user.rollNumber || "",
      order.user.branch || "",
      order.user.section || "",
      order.assignmentDetail?.billablePages || "Pending Verification",
      order.assignmentDetail?.pricePerPage || 25,
      order.totalAmount,
      order.status,
      order.pickupLocation?.name || "Campus Location",
      order.instructions || "",
      new Date(order.createdAt).toLocaleString("en-IN"),
    ];

    const fileExists = fs.existsSync(assignmentCsvPath);
    const csvRow = rowData.map(escapeCsvField).join(",") + "\n";

    if (!fileExists) {
      const headerLine = ASSIGNMENT_HEADERS.map(escapeCsvField).join(",") + "\n";
      fs.writeFileSync(assignmentCsvPath, headerLine + csvRow, "utf8");
    } else {
      fs.appendFileSync(assignmentCsvPath, csvRow, "utf8");
    }

    // Attempt Google Sheets webhook sync
    await syncToGoogleSheets(
      {
        orderNumber: order.orderNumber,
        studentName: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        rollNumber: order.user.rollNumber,
        branch: order.user.branch,
        pages: order.assignmentDetail?.billablePages,
        totalAmount: order.totalAmount,
        status: order.status,
        pickupLocation: order.pickupLocation?.name,
        createdAt: order.createdAt,
      },
      "ASSIGNMENT"
    );
  } catch (err) {
    console.error("Error recording assignment order in spreadsheet:", err);
  }
}

/**
 * Append single CAD order row to public/exports/cad_orders.csv
 */
export async function recordCadOrderInSpreadsheet(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        cadOrderDetail: { include: { cadProduct: true } },
        pickupLocation: true,
      },
    });

    if (!order) return;

    const rowData = [
      order.orderNumber,
      order.user.name,
      order.user.email,
      order.user.phone || "",
      order.user.rollNumber || "",
      order.user.branch || "",
      order.user.section || "",
      order.cadOrderDetail?.cadProduct?.title || "CAD Sheet",
      order.cadOrderDetail?.cadProduct?.category || "Engineering Drawing",
      order.cadOrderDetail?.pricePerSheet || order.totalAmount,
      order.totalAmount,
      order.status,
      order.pickupLocation?.name || "Campus Location",
      order.instructions || "",
      new Date(order.createdAt).toLocaleString("en-IN"),
    ];

    const fileExists = fs.existsSync(cadCsvPath);
    const csvRow = rowData.map(escapeCsvField).join(",") + "\n";

    if (!fileExists) {
      const headerLine = CAD_HEADERS.map(escapeCsvField).join(",") + "\n";
      fs.writeFileSync(cadCsvPath, headerLine + csvRow, "utf8");
    } else {
      fs.appendFileSync(cadCsvPath, csvRow, "utf8");
    }

    // Attempt Google Sheets webhook sync
    await syncToGoogleSheets(
      {
        orderNumber: order.orderNumber,
        studentName: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        rollNumber: order.user.rollNumber,
        branch: order.user.branch,
        sheetTitle: order.cadOrderDetail?.cadProduct?.title,
        totalAmount: order.totalAmount,
        status: order.status,
        pickupLocation: order.pickupLocation?.name,
        createdAt: order.createdAt,
      },
      "CAD"
    );
  } catch (err) {
    console.error("Error recording CAD order in spreadsheet:", err);
  }
}

/**
 * Build full CSV content for all Assignment Orders from Database
 */
export async function getAssignmentOrdersCsv(): Promise<string> {
  const orders = await db.order.findMany({
    where: { serviceType: "ASSIGNMENT" },
    include: {
      user: true,
      assignmentDetail: true,
      pickupLocation: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const lines = [ASSIGNMENT_HEADERS.map(escapeCsvField).join(",")];

  for (const order of orders) {
    const row = [
      order.orderNumber,
      order.user.name,
      order.user.email,
      order.user.phone || "",
      order.user.rollNumber || "",
      order.user.branch || "",
      order.user.section || "",
      order.assignmentDetail?.billablePages || "Pending Verification",
      order.assignmentDetail?.pricePerPage || 25,
      order.totalAmount,
      order.status,
      order.pickupLocation?.name || "Campus Location",
      order.instructions || "",
      new Date(order.createdAt).toLocaleString("en-IN"),
    ];
    lines.push(row.map(escapeCsvField).join(","));
  }

  return lines.join("\n");
}

/**
 * Build full CSV content for all CAD Orders from Database
 */
export async function getCadOrdersCsv(): Promise<string> {
  const orders = await db.order.findMany({
    where: { serviceType: "CAD" },
    include: {
      user: true,
      cadOrderDetail: { include: { cadProduct: true } },
      pickupLocation: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const lines = [CAD_HEADERS.map(escapeCsvField).join(",")];

  for (const order of orders) {
    const row = [
      order.orderNumber,
      order.user.name,
      order.user.email,
      order.user.phone || "",
      order.user.rollNumber || "",
      order.user.branch || "",
      order.user.section || "",
      order.cadOrderDetail?.cadProduct?.title || "CAD Sheet",
      order.cadOrderDetail?.cadProduct?.category || "Engineering Drawing",
      order.cadOrderDetail?.pricePerSheet || order.totalAmount,
      order.totalAmount,
      order.status,
      order.pickupLocation?.name || "Campus Location",
      order.instructions || "",
      new Date(order.createdAt).toLocaleString("en-IN"),
    ];
    lines.push(row.map(escapeCsvField).join(","));
  }

  return lines.join("\n");
}
