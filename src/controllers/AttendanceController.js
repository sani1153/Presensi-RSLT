const Attendance = require('../models/AttendanceModels');
const { isDalamRadiusRS } = require('../helpers/LocationHelper');
const { validasiLiveness } = require('../helpers/FaceLivenessHelper');
const saveFaceImage = require('../utils/saveFaceImage');

const {
    getTanggalAbsensi,
    cekStatusMasuk,
    isWaktuPresensiValid
} = require('../helpers/AttendanceHelper');

/**
 * =========================
 * PRESENSI MASUK
 * =========================
 */
exports.presensiMasuk = async (req, res) => {
    try {
        // 🔐 Data user dari JWT
        const { id_users, nikrs, shift, shift_detail } = req.user;

        const {
            foto_base64,
            liveness_score,
            latitude,
            longitude
        } = req.body;

        // 0. Validasi liveness (anti foto / video)
        const live = validasiLiveness(liveness_score);
        if (!live.valid) {
            return res.status(403).json({
                message: 'Verifikasi wajah gagal',
                reason: live.reason
            });
        }

        // 1. Validasi lokasi RS
        const lokasi = isDalamRadiusRS(latitude, longitude);
        if (!lokasi.valid) {
            return res.status(403).json({
                message: 'Anda berada di luar area Rumah Sakit',
                jarak_meter: lokasi.jarak
            });
        }

        // 2. Validasi waktu presensi masuk
        if (!isWaktuPresensiValid(shift, 'masuk')) {
            return res.status(400).json({
                message: 'Belum waktunya presensi masuk'
            });
        }

        // 3. Tentukan tanggal absensi
        const tanggal_absensi = getTanggalAbsensi(shift, 'masuk');

        // 4. Cegah presensi masuk dobel
        const sudahMasuk = await Attendance.findOne({
            where: {
                id_users,
                tanggal_absensi,
                mode: 'masuk'
            }
        });

        if (sudahMasuk) {
            return res.status(400).json({
                message: 'Presensi masuk sudah dilakukan'
            });
        }

        // 5. Hitung status masuk
        const status = cekStatusMasuk(shift, shift_detail);
        const waktu = new Date().toTimeString().slice(0, 8);

        // 6. Simpan foto (masuk_<nikrs>.png)
        const foto_path = saveFaceImage(foto_base64, nikrs, 'masuk');

        // 7. Simpan presensi masuk
        await Attendance.create({
            id_users,
            tanggal_absensi,
            shift,
            shift_detail,
            mode: 'masuk',
            waktu,
            status,
            foto_path
        });

        res.json({
            message: 'Presensi masuk berhasil',
            status
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * =========================
 * PRESENSI PULANG
 * =========================
 */
exports.presensiPulang = async (req, res) => {
    try {
        // 🔐 Data user dari JWT
        const { id_users, nikrs, shift, shift_detail } = req.user;

        const {
            foto_base64,
            liveness_score,
            latitude,
            longitude
        } = req.body;

        // 0. Validasi liveness
        const live = validasiLiveness(liveness_score);
        if (!live.valid) {
            return res.status(403).json({
                message: 'Verifikasi wajah gagal',
                reason: live.reason
            });
        }

        // 1. Validasi lokasi RS
        const lokasi = isDalamRadiusRS(latitude, longitude);
        if (!lokasi.valid) {
            return res.status(403).json({
                message: 'Anda berada di luar area Rumah Sakit',
                jarak_meter: lokasi.jarak
            });
        }

        // 2. Validasi waktu presensi pulang
        if (!isWaktuPresensiValid(shift, 'pulang')) {
            return res.status(400).json({
                message: 'Belum waktunya presensi pulang'
            });
        }

        // 3. Tentukan tanggal absensi
        const tanggal_absensi = getTanggalAbsensi(shift, 'pulang');

        // 4. Wajib sudah presensi masuk
        const sudahMasuk = await Attendance.findOne({
            where: {
                id_users,
                tanggal_absensi,
                mode: 'masuk'
            }
        });

        if (!sudahMasuk) {
            return res.status(400).json({
                message: 'Belum melakukan presensi masuk'
            });
        }

        // 5. Cegah presensi pulang dobel
        const sudahPulang = await Attendance.findOne({
            where: {
                id_users,
                tanggal_absensi,
                mode: 'pulang'
            }
        });

        if (sudahPulang) {
            return res.status(400).json({
                message: 'Presensi pulang sudah dilakukan'
            });
        }

        const waktu = new Date().toTimeString().slice(0, 8);

        // 6. Simpan foto (pulang_<nikrs>.png)
        const foto_path = saveFaceImage(foto_base64, nikrs, 'pulang');

        // 7. Simpan presensi pulang
        await Attendance.create({
            id_users,
            tanggal_absensi,
            shift,
            shift_detail,
            mode: 'pulang',
            waktu,
            status: 'tepat_waktu',
            foto_path
        });

        res.json({
            message: 'Presensi pulang berhasil'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
