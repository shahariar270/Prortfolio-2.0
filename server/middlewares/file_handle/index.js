const multer = require('multer');
const path = require('path');
const fs = require('fs');

const TEMP_DIR = path.resolve(__dirname, '..', '..', 'public', 'tem');
fs.mkdirSync(TEMP_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TEMP_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, safeName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${ext} not allowed. Allowed: ${allowed.join(', ')}`), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = {
    upload
}
