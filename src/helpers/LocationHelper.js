/**
 * Hitung jarak dua koordinat (meter) - Haversine
 */
function hitungJarak(lat1, lon1, lat2, lon2) {
    const R = 6371000; // meter
    const toRad = deg => deg * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Validasi radius RS
 */
exports.isDalamRadiusRS = (userLat, userLng) => {
    const rsLat = parseFloat(process.env.RS_LAT);
    const rsLng = parseFloat(process.env.RS_LNG);
    const radius = parseFloat(process.env.RS_RADIUS || 100);

    const jarak = hitungJarak(
        userLat,
        userLng,
        rsLat,
        rsLng
    );

    return {
        valid: jarak <= radius,
        jarak: Math.round(jarak)
    };
};
