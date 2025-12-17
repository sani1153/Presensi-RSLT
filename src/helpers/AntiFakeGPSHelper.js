exports.validasiAccuracy = (accuracy) => {
    if (!accuracy) return false;

    // Gedung RS normal: 5m – 100m
    if (accuracy < 5) return false;
    if (accuracy > 100) return false;

    return true;
};
