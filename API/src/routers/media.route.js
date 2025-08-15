const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const URL_BASE = "/api/media/";
const publicDir = path.join(__dirname, "../public");

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, publicDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ cho phép upload file ảnh (PNG, JPG, ...)!'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn file 5MB
    }
});

const router = express.Router();

router.post('/upload', (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('Lỗi từ multer:', err.message);
            return res.status(400).json({ error: err.message });
        }
        console.log('Nhận yêu cầu upload:', {
            body: req.body,
            file: req.file
        });
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        res.status(200).json({ filename: `${URL_BASE}${req.file.filename}` });
    });
});

router.get("/:filename", (req, res) => {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(__dirname, "../public", filename);
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }
    res.status(404).json({ message: "Image not found" });
});

module.exports = router;