require('dotenv').config(); // Load .env

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./src/config/db');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// =======================
// IMPORT ROUTES
// =======================
const userRoutes = require('./src/routes/user-routes');
const attendanceRoutes = require('./src/routes/attendance-routes');

// =======================
// MIDDLEWARE GLOBAL
// =======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// STATIC FILE (FOTO PRESENSI)
// =======================
app.use(
    '/presensi',
    express.static(path.join(__dirname, 'src/public/presensi'))
);

// =======================
// LOGGING REQUEST
// =======================
app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );
    next();
});

// =======================
// ROUTES
// =======================
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);

// =======================
// ROOT
// =======================
app.get('/', (req, res) => {
    res.send('Sistem Presensi Berbasis Web & Face Verification Aktif');
});

// =======================
// CRON JOB (OPTIONAL)
// Reset logika / validasi harian jika dibutuhkan
// =======================
cron.schedule('0 0 * * *', () => {
    console.log('🕛 Reset presensi shift pagi & siang (00:00)');
});

// Reset khusus shift malam (12:00 siang)
cron.schedule('0 12 * * *', () => {
    console.log('🕛 Reset presensi shift malam (12:00 siang)');
});

// =======================
// DATABASE SYNC
// =======================
(async () => {
    try {
        await db.authenticate();
        console.log('✅ Database terkoneksi');

        await db.sync();
        console.log('✅ Database tersinkron');

    } catch (error) {
        console.error('❌ Gagal koneksi database:', error);
    }
})();

// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});

// =======================
// SERVER LISTEN
// =======================
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server presensi berjalan di port ${PORT}`);
});
