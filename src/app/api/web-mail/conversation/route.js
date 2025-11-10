import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Conversation from "@/model/Conversation";
import dbConnect from "@/lib/dbConnect";

export const GET = async (req) => {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    let conversations = await Conversation.find({ userId })
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(
      {
        conversations,
        message: `Conversations fetched successfully`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching conversations:", err);
    return NextResponse.json(
      {
        error: "Server error while fetching conversations",
        details: err.message,
      },
      { status: 500 }
    );
  }
};
