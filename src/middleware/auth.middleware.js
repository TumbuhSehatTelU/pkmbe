const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>

    if (token == null) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ada.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid atau sudah kadaluarsa.' });
        }
        
        // Simpan data pengguna dari token ke object request agar bisa diakses oleh controller
        req.user = user;
        
        // Lanjutkan ke fungsi controller berikutnya
        next();
    });
}

module.exports = {
    authenticateToken,
};