import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extensao = path.extname(file.originalname);
        cb(null, `img-${uniqueSuffix}${extensao}`);
    }
});


const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const mimetypesPermitidos = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    
    const extensao = path.extname(file.originalname).toLowerCase();
    const extensoesPermitidas = [".jpg", ".jpeg", ".png", ".webp"];
    
    if (mimetypesPermitidos.includes(file.mimetype) || extensoesPermitidas.includes(extensao)) {
        cb(null, true);
    } else {
        console.log(`Arquivo bloqueado! Mimetype: ${file.mimetype} | Extensão: ${extensao}`);
        cb(new Error("Formato de arquivo inválido. Apenas JPEG, PNG e WEBP são aceitos."));
    }
};

export const uploadMiddleware = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter
});