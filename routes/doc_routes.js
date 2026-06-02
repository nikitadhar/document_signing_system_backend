import { Router } from "express";
import { upload } from "../config/multer_config.js";
import { uploadDocument } from "../controllers/document_controller.js";
import { verifyToken } from "../utils/token_manager.js";
const docRoutes = Router();
docRoutes.post(
  "/upload",
  verifyToken,
  upload.single("pdf"),
  uploadDocument
);
export default docRoutes;