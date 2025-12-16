const Attendance = require('../models/attendance-models');

const {
    getTanggalAbsensi,
    cekStatusMasuk,
    isWaktuPresensiValid
} = require('../helpers/attendanceHelper');

/**
 * =========================
 * PRESENSI MASUK
 * =========================
 */
exports.presensiMasuk = async (req, res) => {
    try {
        const { id_users, shift, shift_detail, foto_path } = req.body;

        // 1. Validasi waktu presensi masuk
        if (!isWaktuPresensiValid(shift, 'masuk')) {
            return res.status(400).json({
                message: 'Belum waktunya presensi masuk'
            });
        }

        // 2. Tentukan tanggal absensi
        const tanggal_absensi = getTanggalAbsensi(shift);

        // 3. Cegah presensi dobel
        const cek = await Attendance.findOne({
            where: {
                id_users,
                tanggal_absensi,
                mode: 'masuk'
            }
        });

        if (cek) {
            return res.status(400).json({
                message: 'Presensi masuk sudah dilakukan'
            });
        }

        // 4. Tentukan status (tepat / terlambat)
        const status = cekStatusMasuk(shift, shift_detail);
        const waktu = new Date().toTimeString().slice(0, 8);

        // 5. Simpan presensi
        await Attendance.create({
            id_users,
            tanggal_absensi,
            shift,
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
        const { id_users, shift, foto_path } = req.body;

        // 1. Validasi waktu presensi pulang
        if (!isWaktuPresensiValid(shift, 'pulang')) {
            return res.status(400).json({
                message: 'Belum waktunya presensi pulang'
            });
        }

        // 2. Tentukan tanggal absensi
        const tanggal_absensi = getTanggalAbsensi(shift);

        // 3. Cegah presensi dobel
        const cek = await Attendance.findOne({
            where: {
                id_users,
                tanggal_absensi,
                mode: 'pulang'
            }
        });

        if (cek) {
            return res.status(400).json({
                message: 'Presensi pulang sudah dilakukan'
            });
        }

        const waktu = new Date().toTimeString().slice(0, 8);

        // 4. Simpan presensi pulang
        await Attendance.create({
            id_users,
            tanggal_absensi,
            shift,
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
