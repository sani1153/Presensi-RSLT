const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Attendance = db.define('attendance', {
    id_attendance: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_users: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    tanggal_absensi: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    shift: {
        type: DataTypes.ENUM('pagi', 'siang', 'malam'),
        allowNull: false
    },

    shift_detail: {
        type: DataTypes.STRING,
        allowNull: false
        // contoh: pagi_1, pagi_2, pagi_3, siang_1, malam_1
    },

    mode: {
        type: DataTypes.ENUM('masuk', 'pulang'),
        allowNull: false
    },

    waktu: {
        type: DataTypes.TIME,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM('tepat_waktu', 'terlambat'),
        allowNull: false
    },

    foto_path: {
        type: DataTypes.STRING,
        allowNull: false
    },

    liveness_score: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    challenge: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = Attendance;
