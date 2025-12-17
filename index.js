require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');

const db = require('./src/config/db');

// =======================
// INIT APP
// =======================
const app = express();
const PORT = process.env.PORT || 3600;
const HOST = '0.0.0.0';

// =======================
// ROUTES
// =======================
const userRoutes = require('./src/routes/UserRoutes');
const attendanceRoutes = require('./src/routes/AttendanceRoutes');

// =======================
// MIDDLEWARE GLOBAL
// =======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder (foto presensi)
app.use(
    '/presensi',
    express.static(path.join(__dirname, 'src/presensi'))
);

// Logger request (debug aman)
app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );
    next();
});

// =======================
// API ROUTES
// =======================
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);

// =======================
// ROOT CHECK
// =======================
app.get('/', (req, res) => {
    res.send('✅ Sistem Presensi Berbasis Web & Face Verification Aktif');
});

// =======================
// CRON JOB (LOGICAL RESET)
// =======================

// Reset logika shift PAGI & SIANG (00:00)
cron.schedule('0 0 * * *', () => {
    console.log('🕛 [CRON] Reset logika presensi shift pagi & siang');
});

// Reset logika shift MALAM (12:00 siang)
cron.schedule('0 12 * * *', () => {
    console.log('🕛 [CRON] Reset logika presensi shift malam');
});

// NOTE:
// Tidak menghapus data!
// Helper getTanggalAbsensi() yang mengontrol validasi tanggal

// =======================
// DATABASE INIT
// =======================
(async () => {
    try {
        await db.authenticate();
        console.log('✅ Database terkoneksi');

        await db.sync({ alter: false });
        console.log('✅ Database tersinkron');

    } catch (error) {
        console.error('❌ Gagal koneksi database:', error);
    }
})();

// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
    console.error('❌ Unhandled Error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});

// =======================
// START SERVER
// =======================
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server presensi berjalan di port ${PORT}`);
});
