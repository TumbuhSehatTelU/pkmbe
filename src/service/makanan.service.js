const { Makanan } = require('../models');

async function createMakanan(data) {
    const { nama, nutrisi } = data;
    if (!nama || !nutrisi) throw new Error('Nama dan data nutrisi tidak boleh kosong.');
    return await Makanan.create({ nama, nutrisi });
}

async function getAllMakanan() {
    return await Makanan.findAll();
}

async function getMakananById(id) {
    return await Makanan.findByPk(id);
}

async function updateMakanan(id, dataUpdate) {
    const makanan = await getMakananById(id);
    if (!makanan) throw new Error('Data makanan tidak ditemukan.');
    await makanan.update(dataUpdate);
    return makanan;
}

async function deleteMakanan(id) {
    const makanan = await getMakananById(id);
    if (!makanan) throw new Error('Data makanan tidak ditemukan.');
    await makanan.destroy();
}

module.exports = { createMakanan, getAllMakanan, getMakananById, updateMakanan, deleteMakanan };