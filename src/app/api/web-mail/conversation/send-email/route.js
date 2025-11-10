import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import Conversation from "@/model/Conversation";
import Email from "@/model/Email";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { uploadToS3 } from "@/lib/uploadToS3";

export const runtime = "nodejs";

export const POST = async (req) => {
  try {
    await dbConnect();

    const { userId } = await auth();
    if (!userId)
      return NextResponse.json(
        { success: false, error: "Unauthorized request." },
        { status: 401 }
      );

    const contentType = req.headers.get("content-type") || "";
    let from, to, subject, text, html;
    let attachments = [];

    if (contentType.includes("application/json")) {
      const body = await req.json();
      from = body.from;
      to = body.to || [];
      subject = body.subject || "(no subject)";
      text = body.text || "";
      html = body.html || "";
      attachments = (body.attachments || []).map((att) => ({
        filename: att.filename || att.name || "file",
        path: att.path || att.href,
        contentType: att.contentType || att.type || "application/octet-stream",
      }));
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      from = formData.get("from");
      to = JSON.parse(formData.get("to") || "[]");
      subject = formData.get("subject") || "(no subject)";
      text = formData.get("text") || "";
      html = formData.get("html") || "";

      for (const [, value] of formData.entries()) {
        if (value instanceof File) {
          try {
            const uploaded = await uploadToS3(value);
            attachments.push({
              filename: uploaded.filename,
              path: uploaded.path,
              contentType:
                uploaded.contentType ||
                uploaded.type ||
                "application/octet-stream",
            });
          } catch (err) {
            console.error(`❌ Failed to upload ${value.name}:`, err);
          }
        }
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Unsupported Content-Type." },
        { status: 415 }
      );
    }

    if (!from)
      return NextResponse.json(
        { success: false, error: "Missing sender email." },
        { status: 400 }
      );

    if (!to?.length)
      return NextResponse.json(
        { success: false, error: "Missing recipients." },
        { status: 400 }
      );

    const results = [];

    for (const recipient of to) {
      try {
        const sent = await sendMail({
          from,
          to: recipient,
          subject,
          text,
          html,
          attachments,
        }).catch((err) => ({ success: false, error: err.message }));

        let conversation = await Conversation.findOne({
          userId,
          email: recipient,
        });

        if (!conversation) {
          conversation = await Conversation.create({
            userId,
            email: recipient,
          });
        }

        const emailDoc = await Email.create({
          userId,
          conversationId: conversation._id,
          from: { userId, email: from },
          to: [recipient],
          subject,
          body: { text, html },
          attachments,
          status: sent?.success ? "sent" : "failed",
          sentAt: new Date(),
        });

        conversation.lastMessage = emailDoc._id;
        await conversation.save();

        results.push({
          recipient,
          status: sent?.success ? "sent" : "failed",
          messageId: sent?.messageId || null,
          emailId: emailDoc._id,
        });
      } catch (err) {
        console.error(`❌ Failed to send to ${recipient}:`, err);
        results.push({ recipient, status: "failed", error: err.message });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "📨 Email sending completed.",
        results,
        attachments,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Email route error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process email",
        details: err?.message,
      },
      { status: 500 }
    );
  }
};
