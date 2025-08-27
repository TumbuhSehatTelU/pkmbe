const Anak = require('../models/anak.model');
const User = require('../models/user.model');

/**
 * Membuat data anak baru untuk keluarga dari user yang login.
 */
async function createAnak(userId, dataAnak) {
    // 1. Cari user yang login untuk mendapatkan ID keluarganya
    const user = await User.findByPk(userId);
    if (!user || !user.keluargaId) {
        throw new Error('User tidak terhubung dengan keluarga manapun.');
    }

    // 2. Buat data anak dengan menghubungkannya ke keluargaId
    return await Anak.create({
        ...dataAnak,
        keluargaId: user.keluargaId
    });
}

/**
 * Mendapatkan semua data anak dari keluarga user yang login.
 */
async function getAllAnak(userId) {
    const user = await User.findByPk(userId);
    if (!user || !user.keluargaId) {
        // Jika user tidak punya keluarga, kembalikan array kosong
        return [];
    }
    
    // Cari semua anak yang memiliki keluargaId yang sama
    return await Anak.findAll({ where: { keluargaId: user.keluargaId } });
}

/**
 * Memperbarui data anak spesifik.
 */
async function updateAnak(userId, anakId, dataUpdate) {
    const user = await User.findByPk(userId);
    if (!user || !user.keluargaId) {
        throw new Error('User tidak valid.');
    }

    // Cari anak berdasarkan ID anak DAN ID keluarga user.
    // Ini adalah cek keamanan agar user tidak bisa mengedit anak dari keluarga lain.
    const anak = await Anak.findOne({
        where: {
            id: anakId,
            keluargaId: user.keluargaId
        }
    });

    if (!anak) {
        throw new Error('Data anak tidak ditemukan atau Anda tidak memiliki akses.');
    }
    
    // Lakukan update
    await anak.update(dataUpdate);
    return anak;
}

/**
 * Menghapus data anak spesifik.
 */
async function deleteAnak(userId, anakId) {
    const user = await User.findByPk(userId);
    if (!user || !user.keluargaId) {
        throw new Error('User tidak valid.');
    }

    // Lakukan cek keamanan yang sama seperti saat update
    const anak = await Anak.findOne({
        where: {
            id: anakId,
            keluargaId: user.keluargaId
        }
    });
    
    if (!anak) {
        throw new Error('Data anak tidak ditemukan atau Anda tidak memiliki akses.');
    }
    
    // Hapus data
    await anak.destroy();
}

module.exports = {
    createAnak,
    getAllAnak,
    updateAnak,
    deleteAnak
};