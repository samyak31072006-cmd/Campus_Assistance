import { NextResponse } from "next/server";
import { getAssignmentOrdersCsv } from "@/lib/spreadsheet";

export async function GET() {
  try {
    const csvContent = await getAssignmentOrdersCsv();

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="Assignment_Orders_Spreadsheet.csv"',
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error exporting assignment orders spreadsheet:", error);
    return NextResponse.json({ error: "Failed to generate assignment spreadsheet" }, { status: 500 });
  }
}
