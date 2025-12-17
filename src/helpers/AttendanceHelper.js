/**
 * =========================
 * Tentukan tanggal absensi
 * =========================
 * Shift malam:
 * - masuk malam hari
 * - pulang pagi BESOK
 * - tanggal_absensi tetap tanggal MASUK
 */
exports.getTanggalAbsensi = (shift, mode) => {
    const now = new Date();

    if (shift === 'malam' && mode === 'pulang') {
        // pulang pagi → tarik ke tanggal masuk
        now.setDate(now.getDate() - 1);
    }

    return now.toISOString().slice(0, 10);
};


/**
 * =========================
 * Cek status MASUK
 * =========================
 */
exports.cekStatusMasuk = (shift, shift_detail) => {
    const now = new Date();
    const menitSekarang = now.getHours() * 60 + now.getMinutes();

    let batasMasuk = 0;

    switch (shift) {
        case 'pagi':
            batasMasuk = 7 * 60 + 30; // 07:30
            break;
        case 'siang':
            batasMasuk = 14 * 60;     // 14:00
            break;
        case 'malam':
            batasMasuk = 20 * 60;     // 20:00
            break;
        default:
            return 'tepat_waktu';
    }

    return menitSekarang > batasMasuk
        ? 'terlambat'
        : 'tepat_waktu';
};


/**
 * =========================
 * Validasi waktu presensi
 * =========================
 */
exports.isWaktuPresensiValid = (shift, mode) => {
    const now = new Date();
    const menitSekarang = now.getHours() * 60 + now.getMinutes();

    const rules = {
        pagi: {
            masuk: [6 * 60, 9 * 60],
            pulang: [14 * 60, 24 * 60]
        },
        siang: {
            masuk: [13 * 60, 15 * 60],
            pulang: [20 * 60, 24 * 60]
        },
        malam: {
            masuk: [19 * 60, 22 * 60],
            pulang: [8 * 60, 10 * 60]
        }
    };

    // khusus shift malam pulang (pagi hari)
    if (shift === 'malam' && mode === 'pulang') {
        return menitSekarang >= rules.malam.pulang[0]
            && menitSekarang <= rules.malam.pulang[1];
    }

    const [mulai, selesai] = rules[shift][mode];
    return menitSekarang >= mulai && menitSekarang <= selesai;
};
