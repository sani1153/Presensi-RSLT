/**
 * Tentukan tanggal absensi
 */
exports.getTanggalAbsensi = (shift) => {
    const now = new Date();
    const jam = now.getHours();

    if (shift === 'malam' && jam < 12) {
        now.setDate(now.getDate() - 1);
    }

    return now.toISOString().slice(0, 10);
};

/**
 * Tentukan status tepat waktu / terlambat (MASUK)
 */
exports.cekStatusMasuk = (shift) => {
    const now = new Date();
    const waktuSekarang = now.getHours() * 60 + now.getMinutes();

    let batasMasuk;

    switch (shift) {
        case 'pagi':
            batasMasuk = 7 * 60 + 30;
            break;
        case 'siang':
            batasMasuk = 14 * 60;
            break;
        case 'malam':
            batasMasuk = 20 * 60;
            break;
        default:
            return 'tepat_waktu';
    }

    return waktuSekarang > batasMasuk ? 'terlambat' : 'tepat_waktu';
};

/**
 * Validasi waktu presensi (BUKA / TUTUP)
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

    const [mulai, selesai] = rules[shift][mode];

    return menitSekarang >= mulai && menitSekarang <= selesai;
};
