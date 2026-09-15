import { NextResponse } from "next/server";
import { getCadOrdersCsv } from "@/lib/spreadsheet";

export async function GET() {
  try {
    const csvContent = await getCadOrdersCsv();

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="CAD_Orders_Spreadsheet.csv"',
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error exporting CAD orders spreadsheet:", error);
    return NextResponse.json({ error: "Failed to generate CAD spreadsheet" }, { status: 500 });
  }
}
