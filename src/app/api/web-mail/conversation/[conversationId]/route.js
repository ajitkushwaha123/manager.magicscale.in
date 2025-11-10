import Email from "@/model/Email";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    const { userId } = await auth();
    const { conversationId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    const emails = await Email.find({
      conversationId,
      userId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        emails,
        message: `Emails fetched successfully for conversation ${conversationId}`,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "Server error while fetching conversations",
        details: err.message,
      },
      { status: 500 }
    );
  }
};
