const fs = require('fs');
const path = require('path');

module.exports = function saveFaceImage(base64Image, filename) {
    if (!base64Image) {
        throw new Error('Foto wajah tidak ditemukan');
    }

    // hapus header base64 jika ada
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const uploadDir = path.join(__dirname, '../../uploads/attendance');

    // pastikan folder ada
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, base64Data, 'base64');

    // path yang disimpan ke DB
    return `/uploads/attendance/${filename}`;
};
