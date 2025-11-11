import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    from: {
      userId: { type: String, required: true },
    },

    to: [
      {
        type: String,
        required: true,
      },
    ],

    subject: {
      type: String,
      default: "(no subject)",
    },

    body: {
      text: { type: String },
      html: { type: String },
    },

    attachments: [
      {
        _id: false,
        filename: { type: String, required: true },
        path: { type: String },
        contentType: { type: String, default: "application/octet-stream" },
        href: { type: String },
      },
    ],

    status: {
      type: String,
      enum: ["draft", "sent", "received", "trash", "failed"],
      default: "draft",
    },

    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.models.Email || mongoose.model("Email", emailSchema);

export default Email;
