import { Router, Request, Response } from "express";
import multer from "multer";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

const router = Router();

// Configurar multer para upload em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens são permitidas"));
    }
  },
});

// Endpoint de upload
router.post("/upload", upload.single("file"), async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    // Gerar nome único
    const filename = `${nanoid()}-${req.file.originalname}`;
    const fileKey = `uploads/${filename}`;

    // Upload para S3
    const { url } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);

    res.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Erro ao fazer upload" });
  }
});

export default router;
