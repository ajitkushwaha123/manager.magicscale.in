import "pdf-parse/worker";

import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { generateEmailFromText } from "@/services/gemini"; // your AI generator

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userPrompt =
      formData.get("prompt") ||
      "Generate a professional email draft for the attached document.";

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Use the new PDFParse v2 API
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    const extractedText = result.text?.trim();
    if (!extractedText) {
      return NextResponse.json(
        { error: "No readable text found in the PDF." },
        { status: 400 }
      );
    }

    // ✅ Pass extracted text to Gemini email generator
    const aiResult = await generateEmailFromText({
      pdfText: extractedText,
      userPrompt,
    });

    return NextResponse.json({
      data: aiResult,
      message: "✅ Email generated successfully from PDF",
    });
  } catch (err) {
    console.error("AI PDF generation error:", err);
    return NextResponse.json(
      {
        error: "Failed to generate email from PDF",
        details: err.message,
      },
      { status: 500 }
    );
  }
};
