const jwt = require('jsonwebtoken');
const Users = require('../models/UsersModels');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Users.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Contoh sederhana (jika pakai bcrypt tinggal ganti)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Password salah' });
        }

        // Payload token
        const payload = {
            id_users: user.id_users
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRED }
        );

        res.json({
            message: 'Login berhasil',
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
