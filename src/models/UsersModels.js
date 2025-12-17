const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Users = db.define('users', {
    id_users: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false
    },

    nikrs: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
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
    }
    
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = Users;
