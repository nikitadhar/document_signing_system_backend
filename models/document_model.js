import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: String,
  fileUrl: Buffer,
  mimeType: String,

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  originalname: {
    type: String
  },

  signedPdf: {
    type: Buffer,
    default: null,
  },
  signatureImage: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["Pending", "Signed"],
    default: "Pending"
  },
  aiSummary: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Document", documentSchema);