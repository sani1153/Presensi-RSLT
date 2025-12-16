const express = require('express');
const router = express.Router();

const AttendanceController = require('../controllers/attendance-controllers');

// Presensi masuk
router.post('/public/presensi-masuk', AttendanceController.presensiMasuk);

// Presensi pulang
router.post('/public/presensi-pulang', AttendanceController.presensiPulang);

module.exports = router;
