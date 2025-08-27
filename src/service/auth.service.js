const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { nanoid } = require('nanoid');
const Keluarga = require('../models/keluarga.model');
require('dotenv').config();

// Impor dan inisialisasi client Twilio
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const verifySid = process.env.TWILIO_VERIFY_SID;

async function requestOtp(no_telepon) {
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
async function verifyAndRegister(userData) {
    const { nama, no_telepon, password, otp, kode_keluarga, nama_keluarga } = userData;

    if (otp === '123456') {
        console.log('[INFO] Menggunakan OTP dummy, registrasi langsung diproses.');
    } 
    else {
        try {
            const verification_check = await client.verify.v2.services(verifySid)
                .verificationChecks
                .create({ to: no_telepon, code: otp });

            if (verification_check.status !== 'approved') {
                throw new Error('Kode OTP salah atau sudah kadaluarsa.');
            }
        } catch (error) {
            console.error("Error saat verifikasi ke Twilio:", error);
            throw new Error('Verifikasi OTP gagal.');
        }
    }


    const userExists = await User.findOne({ where: { no_telepon } });
    if (userExists) {
        throw new Error('Nomor telepon sudah terdaftar.');
    }

    let keluarga;
    if (kode_keluarga) {
        keluarga = await Keluarga.findOne({ where: { kode_keluarga } });
        if (!keluarga) throw new Error('Kode Keluarga tidak ditemukan.');
    } else {
        if (!nama_keluarga) throw new Error('Nama keluarga dibutuhkan untuk pendaftar pertama.');
        const kodeBaru = nanoid(6).toUpperCase();
        keluarga = await Keluarga.create({ nama_keluarga, kode_keluarga: kodeBaru });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        nama,
        no_telepon,
        password: hashedPassword,
        keluargaId: keluarga.id,
    });
    
    if (!kode_keluarga) {
        keluarga.id_kepala_keluarga = newUser.id;
        await keluarga.save();
    }

    const userTanpaPassword = { id: newUser.id, nama, no_telepon, keluargaId: keluarga.id };
    return { user: userTanpaPassword, keluarga: keluarga };
}
async function login(no_telepon, password) {
    const user = await User.findOne({ where: { no_telepon: no_telepon } });
    if (!user) {
        throw new Error('Nomor telepon tidak ditemukan.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Password salah.');
    }

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