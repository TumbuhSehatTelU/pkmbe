const AuthService = require('../service/auth.service');

// Fungsi untuk meminta OTP
async function requestOtp(req, res) {
    try {
        const { no_telepon } = req.body;
        if (!no_telepon) {
            return res.status(400).json({ message: 'Nomor telepon dibutuhkan.' });
        }
        await AuthService.requestOtp(no_telepon);
        res.status(200).json({ message: 'OTP telah dikirim ke nomor Anda.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Fungsi untuk verifikasi OTP dan registrasi
async function verifyAndRegister(req, res) {
    try {
        const { no_telepon, password, otp } = req.body;
        if (!no_telepon || !password || !otp) {
            return res.status(400).json({ message: 'Nomor telepon, password, dan OTP dibutuhkan.' });
        }
        const user = await AuthService.verifyAndRegister(no_telepon, password, otp);
        res.status(201).json({ message: 'Registrasi berhasil', data: user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Fungsi untuk login
async function login(req, res) {
    try {
        const { no_telepon, password } = req.body;
        if (!no_telepon || !password) {
            return res.status(400).json({ message: 'Nomor telepon dan password dibutuhkan.' });
        }
        
        const data = await AuthService.login(no_telepon, password);
        res.status(200).json({ message: 'Login berhasil', data });

    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

// Fungsi untuk mendapatkan profil (contoh rute terproteksi)
async function getProfile(req, res) {
    // Data pengguna didapat dari token yang sudah diverifikasi oleh middleware
    const userData = req.user;
    
    res.status(200).json({
        message: "Profil berhasil diambil",
        data: userData
    });
}

module.exports = {
    requestOtp,
    verifyAndRegister,
    login,
    getProfile
};