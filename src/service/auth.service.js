const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); 
require('dotenv').config();

async function requestOtp(no_telepon) {
    const userExists = await User.findOne({ where: { no_telepon: no_telepon } });
    if (userExists) {
        throw new Error('Nomor telepon sudah terdaftar.');
    }

    console.log(`[SIMULASI] OTP dikirim ke ${no_telepon}`);
    return true;
}

async function verifyAndRegister(no_telepon, password, otp) {
    if (otp !== '123456') { 
        throw new Error('Kode OTP salah.');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        no_telepon: no_telepon,
        password: hashedPassword
    });
    
    const userWithoutPassword = { id: newUser.id, no_telepon: newUser.no_telepon };
    return userWithoutPassword;
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

    const payload = { id: user.id, no_telepon: user.no_telepon };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    const userWithoutPassword = { id: user.id, no_telepon: user.no_telepon };
    return { user: userWithoutPassword, token };
}

module.exports = {
    requestOtp,
    verifyAndRegister,
    login
};