const AnakService = require('../service/anak.service');

// Menambah anak
async function createAnak(req, res) {
    try {
        const userId = req.user.id; // Ambil ID user dari token
        const dataAnak = req.body;
        const anak = await AnakService.createAnak(userId, dataAnak);
        res.status(201).json({ message: 'Data anak berhasil ditambahkan', data: anak });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Mendapatkan semua anak milik user yang login
async function getAllAnak(req, res) {
    try {
        const userId = req.user.id;
        const daftarAnak = await AnakService.getAllAnak(userId);
        res.status(200).json({ data: daftarAnak });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Mengupdate data anak
async function updateAnak(req, res) {
    try {
        const userId = req.user.id;
        const anakId = req.params.id;
        const dataUpdate = req.body;
        const anak = await AnakService.updateAnak(userId, anakId, dataUpdate);
        res.status(200).json({ message: 'Data anak berhasil diperbarui', data: anak });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Menghapus data anak
async function deleteAnak(req, res) {
     try {
        const userId = req.user.id;
        const anakId = req.params.id;
        await AnakService.deleteAnak(userId, anakId);
        res.status(200).json({ message: 'Data anak berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { createAnak, getAllAnak, updateAnak, deleteAnak };