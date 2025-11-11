import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Email",
    },
  },
  { timestamps: true }
);

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;
