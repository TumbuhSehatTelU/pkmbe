const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

// Impor dan inisialisasi client Twilio
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const verifySid = process.env.TWILIO_VERIFY_SID;

async function requestOtp(no_telepon) {
    // Cek apakah pengguna sudah ada menggunakan Sequelize
    const userExists = await User.findOne({ where: { no_telepon: no_telepon } });
    if (userExists) {
        throw new Error('Nomor telepon sudah terdaftar.');
    }

    try {
        console.log(`[INFO] Mengirim OTP ke ${no_telepon} via smss...`);
        // Panggil API Twilio Verify untuk mengirim OTP via WhatsApp
        const verification = await client.verify.v2.services(verifySid)
            .verifications
            .create({ to: no_telepon, channel: 'sms' });
        
        console.log(`[INFO] Status pengiriman OTP sms: ${verification.status}`);
        return true;

    } catch (error) {
        console.error("Error saat memanggil API Twilio (requestOtp):", error);
        if (error.code === 60200) {
            throw new Error('Nomor telepon tidak valid.');
        }
        throw new Error('Gagal mengirim OTP.');
    }
}

async function verifyAndRegister(nama, no_telepon, password, otp) {
    try {
        // Panggil API Twilio untuk memeriksa kecocokan OTP
        const verification_check = await client.verify.v2.services(verifySid)
            .verificationChecks
            .create({ to: no_telepon, code: otp });

        if (verification_check.status !== 'approved') {
            throw new Error('Kode OTP salah atau sudah kadaluarsa.');
        }
        
        console.log(`[INFO] Verifikasi OTP untuk ${no_telepon} berhasil.`);

        // Enkripsi password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat pengguna baru menggunakan Sequelize
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

    } catch (error) {
        console.error("Error saat memanggil API Twilio (verifyAndRegister):", error);
        throw new Error(error.message || 'Verifikasi OTP gagal.');
    }
}

async function login(no_telepon, password) {
    // Cari pengguna menggunakan Sequelize
    const user = await User.findOne({ where: { no_telepon: no_telepon } });
    if (!user) {
        throw new Error('Nomor telepon tidak ditemukan.');
    }

    // Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Password salah.');
    }

    // Buat token JWT
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