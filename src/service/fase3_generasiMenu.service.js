const dbMakanan = require('../../data/makanan.json');

function pilihMakananDenganPrioritas(daftarMakanan, jumlahOpsi) {
  if (!daftarMakanan || daftarMakanan.length === 0) return [];
  
  const hasil = [];
  const bobot = daftarMakanan.map(item => item.skor_prioritas_variasi);
  const totalBobot = bobot.reduce((sum, w) => sum + w, 0);
  
  const poolMakanan = [...daftarMakanan];

  for (let i = 0; i < Math.min(jumlahOpsi, poolMakanan.length); i++) {
    let random = Math.random() * totalBobot;
    let bobotSaatIni = 0;
    
    for (let j = 0; j < poolMakanan.length; j++) {
      bobotSaatIni += poolMakanan[j].skor_prioritas_variasi;
      if (random < bobotSaatIni) {
        hasil.push(poolMakanan[j]);
        poolMakanan.splice(j, 1); 
        break;
      }
    }
  }
  return hasil;
}

function generateRekomendasiMenu(targetPerSesi, petaPrioritas) {
  const rekomendasiHarian = {};
  
  // Buat map untuk pencarian cepat detail makanan berdasarkan ID
  const dbMap = new Map(dbMakanan.map(item => [item.id, item]));

  const { karbohidrat, protein_hewani, protein_nabati, vitamin_dan_serat } = petaPrioritas;

  for (const sesi in targetPerSesi) {
    const menuSesi = { karbohidrat: [], protein: [], vitamin_dan_serat: [] };

    if (sesi.includes('selingan')) {
      // Logika untuk selingan (contoh: 2 opsi protein nabati)
      const opsiSelingan = pilihMakananDenganPrioritas(protein_nabati, 2);
      opsiSelingan.forEach(item => {
        const urt = dbMap.get(item.food_id)?.urt_standar || {};
        menuSesi.protein.push({
          nama: item.nama_makanan,
          takaran: `${urt.jumlah || ''} ${urt.satuan || ''}`.trim(),
        });
      });
    } else {
      // Logika untuk makan utama
      const opsiKarbo = pilihMakananDenganPrioritas(karbohidrat, 3);
      const opsiHewani = pilihMakananDenganPrioritas(protein_hewani, 2);
      const opsiNabati = pilihMakananDenganPrioritas(protein_nabati, 2);
      const opsiSayuran = pilihMakananDenganPrioritas(vitamin_dan_serat, 3);
      
      const formatDanTambah = (opsi, kategori) => {
          opsi.forEach(item => {
              const urt = dbMap.get(item.food_id)?.urt_standar || {};
              menuSesi[kategori].push({
                  nama: item.nama_makanan,
                  takaran: `${urt.jumlah || ''} ${urt.satuan || ''}`.trim(),
              });
          });
      };
      
      formatDanTambah(opsiKarbo, 'karbohidrat');
      formatDanTambah([...opsiHewani, ...opsiNabati], 'protein');
      formatDanTambah(opsiSayuran, 'vitamin_dan_serat');
    }
    rekomendasiHarian[sesi] = menuSesi;
  }
  return { rekomendasi_menu_harian: rekomendasiHarian };
}

module.exports = { generateRekomendasiMenu };