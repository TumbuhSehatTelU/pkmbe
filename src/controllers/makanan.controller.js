const MakananService = require('../service/makanan.service');

async function createMakanan(req, res) {
    try {
        const makanan = await MakananService.createMakanan(req.body);
        res.status(201).json({ message: 'Data makanan berhasil ditambahkan', data: makanan });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAllMakanan(req, res) {
    try {
        const daftarMakanan = await MakananService.getAllMakanan();
        res.status(200).json({ data: daftarMakanan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//
async function getMakananById(req, res) {
    try {
        const makanan = await MakananService.getMakananById(req.params.id);
        if (!makanan) return res.status(404).json({ message: 'Data makanan tidak ditemukan.' });
        res.status(200).json({ data: makanan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateMakanan(req, res) {
    try {
        const makanan = await MakananService.updateMakanan(req.params.id, req.body);
        res.status(200).json({ message: 'Data makanan berhasil diperbarui', data: makanan });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteMakanan(req, res) {
    try {
        await MakananService.deleteMakanan(req.params.id);
        res.status(200).json({ message: 'Data makanan berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { createMakanan, getAllMakanan, getMakananById, updateMakanan, deleteMakanan };