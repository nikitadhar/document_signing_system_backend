import Document from "../models/document_model.js";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import mongoose from "mongoose";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file",
      });
    }

    const doc = await Document.create({
      title: req.body.title,
      fileUrl: req.file.buffer, // save uploaded file path
      originalname: req.file.originalname,
      mimeType: req.file.mimetype,
      uploadedBy: req.params.userId,
    });
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

// SINGING DOCUMENT 
export const saveSignature = async (
  req,
  res
) => {
  try {
    const documentId = new mongoose.Types.ObjectId(req.params.id);
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }
    document.signatureImage = req.body.signature;
    const pdfDoc = await PDFDocument.load(
      document.fileUrl
    );

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    firstPage.drawText(
      document.signatureImage,
      {
        x: 50,
        y: 50,
        size: 20,
      }
    );
  
    const signedPdfBytes = await pdfDoc.save();
    document.signedPdf = Buffer.from(signedPdfBytes);
    document.status = "Signed";
    await document.save();
    return res.status(200).json({
      message: "Document signed successfully",
      document,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to sign document",
      cause: error.message,
    });
  }
}


  // Get Documents by user Id
  export const getMyDocuments = async (
    req,
    res
  ) => {
    try {
      const userId = res.locals.jwtData.id;

      const documents = await Document.find({
        uploadedBy: userId,
      }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        documents,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  // VIEW DOCUMENT BY ITS ID
  export const viewDocument = async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return res.status(404).json({
      message: "Document not found",
    });
  }
console.log("document...",document)
  const pdfData =
    document.signedPdf || document.fileUrl;

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": "inline",
  });

  return res.send(pdfData);
};
  // Downoad Document
  export const downloadDocument = async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({
          message: "Document not found",
        });
      }

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${document.originalname}"`,
      });

      return res.send(document.signedPdf);
    } catch (error) {
      return res.status(500).json({
        message: "Download failed",
        cause: error.message,
      });
    }
  };
  // GET COUNT OF DOCUMENT
  export const getDocumentStats = async (
    req,
    res
  ) => {
    try {
      const userId = res.locals.jwtData.id;
      const objectUserId = new mongoose.Types.ObjectId(userId);
      const [totalDocuments, statusCounts] =
        await Promise.all([
          Document.countDocuments({
            uploadedBy: userId,
          }),

          Document.aggregate([
            {
              $match: {
                uploadedBy: objectUserId,
              },
            },
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ]),
        ]);

      const stats = {
        totalDocuments,
        pending: 0,
        signed: 0,
      };
      statusCounts.forEach((item) => {
        stats[item._id.toLowerCase()] =
          item.count;
      });

      return res.status(200).json(stats);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };