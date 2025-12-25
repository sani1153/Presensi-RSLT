const fs = require('fs');
const path = require('path');

/**
 * @param {string} base64Image  - foto wajah base64
 * @param {string|number} nikrs
 * @param {string} mode        - 'masuk' | 'pulang'
 */
module.exports = function saveFaceImage(base64Image, nikrs, mode) {
    if (!base64Image) {
        throw new Error('Foto wajah tidak ditemukan');
    }

    if (!nikrs) {
        throw new Error('NIK RS tidak valid');
    }

    if (!mode || !['masuk', 'pulang'].includes(mode)) {
        throw new Error('Mode presensi tidak valid');
    }

    // hapus header base64 jika ada
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const uploadDir = path.join(__dirname, '../uploads/attendance');

    // pastikan folder ada
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 🔐 nama file berdasarkan mode + nikrs
    const filename = `${mode}_${nikrs}.png`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, base64Data, 'base64');

    // path yang disimpan ke database
    return `/uploads/attendance/${filename}`;
};
