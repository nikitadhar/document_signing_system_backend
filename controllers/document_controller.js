import Document from "../models/document_model.js";

export const uploadDocument = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file",
      });
    }

    const doc = await Document.create({
      title: req.body.title,
      fileUrl: req.file.path, // save uploaded file path
      uploadedBy: req.user.id,
    });

    console.log("DOCUMENT:", doc);

    return res.status(201).json({
      message: "Document uploaded successfully",
      document: doc,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Upload failed",
      cause: error.message,
    });
  }
};
    