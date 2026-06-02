import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Signed"],
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Document", documentSchema);