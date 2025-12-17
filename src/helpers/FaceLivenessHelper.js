exports.validasiLiveness = (livenessScore) => {
    if (typeof livenessScore !== 'number') {
        return {
            valid: false,
            reason: 'Data liveness tidak valid'
        };
    }

    if (livenessScore < 0.80) {
        return {
            valid: false,
            reason: 'Liveness rendah'
        };
    }

    return { valid: true };
};
