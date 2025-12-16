const Users = require('../models/UsersModels');
const bcrypt = require('bcrypt');

/**
 * GET ALL USERS
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: { exclude: ['password'] }
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * CREATE USER
 */
exports.createUser = async (req, res) => {
    try {
        const {
            username,
            nikrs,
            password,
            shift_jenis,
            shift_detail
        } = req.body;

        const cekNik = await Users.findOne({ where: { nikrs } });
        if (cekNik) {
            return res.status(400).json({
                message: 'NIK RS sudah terdaftar'
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await Users.create({
            username,
            nikrs,
            password: hashPassword,
            shift_jenis,
            shift_detail
        });

        res.status(201).json({
            message: 'User berhasil ditambahkan'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
    try {
        const { nikrs, password } = req.body;

        const user = await Users.findOne({ where: { nikrs } });
        if (!user) {
            return res.status(401).json({ message: 'NIK RS tidak ditemukan' });
        }

        if (!user.is_active) {
            return res.status(403).json({ message: 'Akun tidak aktif' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Password salah' });
        }

        res.json({
            message: 'Login berhasil',
            data: {
                id_users: user.id_users,
                username: user.username,
                nikrs: user.nikrs,
                shift_jenis: user.shift_jenis,
                shift_detail: user.shift_detail
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
