const KeluargaService = require('../services/keluarga.service');

async function getDetailKeluarga(req, res) {
    try {
        const keluargaDetail = await KeluargaService.getKeluargaLengkap(req.user.id);
        if (!keluargaDetail) {
            return res.status(404).json({ message: 'Data keluarga tidak ditemukan.' });
        }
        res.status(200).json({ data: keluargaDetail });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getDetailKeluarga,
};