import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const emailSchema = {
  type: Type.OBJECT,
  properties: {
    subject: {
      type: Type.STRING,
      description: "A concise and professional subject line for the email.",
    },
    body: {
      type: Type.STRING,
      description:
        "The full body of the email, written in a professional tone. Use newline characters (\\n) for paragraphs and line breaks.",
    },
  },
  required: ["subject", "body"],
};

export const generateEmailFromText = async ({ pdfText, userPrompt }) => {
  const model = "gemini-2.5-flash";

  const fullPrompt = `
USER PROMPT:
${userPrompt}

---
PDF TEXT CONTENT:
${pdfText}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: emailSchema,
        temperature: 0.5,
      },
    });

    const output = response.text ?? response.output_text ?? "";

    if (!output) {
      throw new Error("Empty response received from Gemini.");
    }

    const parsed = JSON.parse(output);

    if (!parsed.subject || !parsed.body) {
      throw new Error("Incomplete email data received from Gemini.");
    }

    return {
      subject: parsed.subject.trim(),
      body: parsed.body.trim(),
    };
  } catch (error) {
    console.error("Gemini email generation error:", error);
    throw new Error("Failed to generate email content from Gemini API.");
  }
};
