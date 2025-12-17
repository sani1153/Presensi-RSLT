const express = require('express');
const router = express.Router();

const AttendanceController = require('../controllers/AttendanceController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.post('/masuk', authMiddleware, AttendanceController.presensiMasuk);
router.post('/pulang', authMiddleware, AttendanceController.presensiPulang);

module.exports = router;
