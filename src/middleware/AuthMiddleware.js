const jwt = require('jsonwebtoken');
const Users = require('../models/UsersModels');

module.exports = async (req, res, next) => {
    try {
        // Ambil token dari header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: 'Token tidak ditemukan'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Format token tidak valid'
            });
        }

        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ambil user dari DB (AMAN)
        const user = await Users.findByPk(decoded.id_users);

        if (!user) {
            return res.status(401).json({
                message: 'User tidak valid'
            });
        }

        // Inject user ke request
        req.user = {
            id_users: user.id_users,
            shift: user.shift,
            shift_detail: user.shift_detail,
            role: user.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Token tidak valid / kadaluarsa',
            error: error.message
        });
    }
};
