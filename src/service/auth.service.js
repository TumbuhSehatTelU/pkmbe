const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Impor Model User
require('dotenv').config();

async function requestOtp(no_telepon) {
    // Mencari pengguna menggunakan metode Sequelize
    const userExists = await User.findOne({ where: { no_telepon: no_telepon } });
    if (userExists) {
        throw new Error('Nomor telepon sudah terdaftar.');
    }

    // Logika Twilio untuk mengirim OTP tetap sama
    // ... (kode Twilio di sini) ...
    console.log(`[SIMULASI] OTP dikirim ke ${no_telepon}`);
    return true;
}

async function verifyAndRegister(no_telepon, password, otp, nama) {
    // Ganti ini dengan verifikasi Twilio asli
    if (otp !== '123456') { 
        throw new Error('Kode OTP salah.');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat user baru menggunakan metode Sequelize
    const newUser = await User.create({
        nama: nama,
        no_telepon: no_telepon,
        password: hashedPassword
    });
    
    // Kembalikan data tanpa password
    const userWithoutPassword = { 
        id: newUser.id, 
        nama: newUser.nama, 
        no_telepon: newUser.no_telepon 
    };
    return userWithoutPassword;
}

async function login(no_telepon, password) {
    // Mencari pengguna menggunakan metode Sequelize
    const user = await User.findOne({ where: { no_telepon: no_telepon } });
    if (!user) {
        throw new Error('Nomor telepon tidak ditemukan.');
    }

    // Membandingkan password (tetap sama)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Password salah.');
    }

    // Membuat token (tetap sama)
    const payload = { id: user.id, nama: user.nama, no_telepon: user.no_telepon };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    const userWithoutPassword = { id: user.id, nama: user.nama, no_telepon: user.no_telepon };
    return { user: userWithoutPassword, token };
}

module.exports = {
    requestOtp,
    verifyAndRegister,
    login
};