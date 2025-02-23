import { NextResponse } from "next/server";
import { generateSearchReport } from "@/lib/reports/searchReport";
import { sendDailyReport } from "@/lib/email/sendEmail";

export async function POST() {
  try {
    const report = await generateSearchReport();
    console.log(report);
    await sendDailyReport(report);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error generating/sending report:", error);
    return NextResponse.json(
      { error: "Failed to generate/send report" },
      { status: 500 }
    );
  }
}
