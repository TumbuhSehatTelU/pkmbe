const dbMakanan = require('../../data/makanan.json');

function buatPetaPrioritas(historiMakanan, rentangHari = 7) {
  const getKategori = (makanan) => {
    const { golongan_dbmp, sub_golongan_protein } = makanan;
    if (golongan_dbmp === 'Karbohidrat') return 'karbohidrat';
    if (golongan_dbmp === 'Sayuran') return 'vitamin_dan_serat';
    if (golongan_dbmp === 'Protein') {
      if (sub_golongan_protein?.includes('Hewani')) return 'protein_hewani';
      if (sub_golongan_protein?.includes('Nabati')) return 'protein_nabati';
    }
    return null;
  };

  const petaPrioritas = {
    karbohidrat: [],
    protein_hewani: [],
    protein_nabati: [],
    vitamin_dan_serat: [],
  };

  const frekuensiMakanan = {};
  dbMakanan.forEach(item => {
    frekuensiMakanan[item.id] = 0;
  });

  historiMakanan.forEach(log => {
    log.makanan_terdeteksi.forEach(makanan => {
      if (frekuensiMakanan[makanan.food_id] !== undefined) {
        frekuensiMakanan[makanan.food_id]++;
      }
    });
  });

  const batasFrekuensiAtas = rentangHari / 2;
  dbMakanan.forEach(itemMakanan => {
    const frekuensi = frekuensiMakanan[itemMakanan.id] || 0;
    let skor = 1.0;

    if (frekuensi === 0) {
      skor = 1.5; // Prioritaskan makanan baru
    } else if (frekuensi > batasFrekuensiAtas) {
      skor = 0.5; // Turunkan prioritas makanan yang sering dimakan
    }

    const kategori = getKategori(itemMakanan);
    if (petaPrioritas[kategori]) {
      petaPrioritas[kategori].push({
        food_id: itemMakanan.id,
        nama_makanan: itemMakanan.nama_makanan,
        skor_prioritas_variasi: skor,
      });
    }
  });

  return { peta_prioritas_terstruktur: petaPrioritas };
}

module.exports = {
  buatPetaPrioritas,
};