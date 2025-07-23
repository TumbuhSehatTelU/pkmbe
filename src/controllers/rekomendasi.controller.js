const RekomendasiService = require('../service/rekomendasi.service');


async function getRekomendasi(req, res) {
  try {
    const { data_pengguna, histori_makanan } = req.body;

    if (!data_pengguna || !histori_makanan) {
      return res.status(400).json({ message: 'Input data_pengguna dan histori_makanan dibutuhkan.' });
    }

    const hasilRekomendasi = await RekomendasiService.generateFullRekomendasi(
      data_pengguna,
      histori_makanan
    );

    res.status(200).json(hasilRekomendasi);

  } catch (error) {
    console.error("Error di controller getRekomendasi:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
}

module.exports = {
  getRekomendasi,
};