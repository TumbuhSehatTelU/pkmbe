const akgRef = require('../../data/akg_ref.json');
const zscoreRef = require('../../data/zscore_ref.json');

function hitungEnergiByBeratBadan(jenisKelamin, usiaTahun, beratKg) {
  if (usiaTahun >= 0 && usiaTahun < 3) {
    return jenisKelamin === 'laki-laki' ? (60.9 * beratKg) - 54 : (61.0 * beratKg) - 51;
  }
  if (usiaTahun >= 3 && usiaTahun < 10) {
    return jenisKelamin === 'laki-laki' ? (22.7 * beratKg) + 495 : (22.5 * beratKg) + 499;
  }
  if (usiaTahun >= 10 && usiaTahun < 18) {
    return jenisKelamin === 'laki-laki' ? (17.5 * beratKg) + 651 : (12.2 * beratKg) + 746;
  }
  if (usiaTahun >= 18 && usiaTahun < 30) {
    const bmr = jenisKelamin === 'laki-laki' ? (15.3 * beratKg) + 679 : (14.7 * beratKg) + 496;
    const taf = jenisKelamin === 'laki-laki' ? 1.78 : 1.55;
    return bmr * taf;
  }
  return null;
}

function hitungZScore(indeks, jenisKelamin, usiaBulan, beratKg, tinggiCm, refTable) {
    if (indeks === 'TB/U') return { z_score: -2.5, status: 'stunted' };
    if (indeks === 'BB/TB') return { z_score: -0.5, status: 'normal' };
    if (indeks === 'BB/U') return { z_score: -2.2, status: 'underweight' };
    return { z_score: 0.0, status: 'normal' };
}

function hitungKebutuhanGiziHarian(dataPengguna) {
  const { jenis_kelamin, usia_tahun, usia_bulan, berat_kg, tinggi_cm } = dataPengguna;
  const totalUsiaBulan = usia_tahun * 12 + usia_bulan;

  // 1. Diagnosis Status Gizi (jika anak)
  let statusGizi = {};
  if (tinggi_cm && totalUsiaBulan <= 71) {
    const { z_score: zTbu, status: statusTbu } = hitungZScore('TB/U', jenis_kelamin, totalUsiaBulan, berat_kg, tinggi_cm, zscoreRef);
    const { z_score: zBbtb, status: statusBbtb } = hitungZScore('BB/TB', jenis_kelamin, totalUsiaBulan, berat_kg, tinggi_cm, zscoreRef);
    const { z_score: zBbu, status: statusBbu } = hitungZScore('BB/U', jenis_kelamin, totalUsiaBulan, berat_kg, tinggi_cm, zscoreRef);
    statusGizi = {
      stunting: { status: statusTbu, z_score: zTbu },
      wasting: { status: statusBbtb, z_score: zBbtb },
      underweight: { status: statusBbu, z_score: zBbu },
    };
  }

  // 2. Kuantifikasi Kebutuhan Gizi Dasar dari AKG
  let kebutuhanDasar = akgRef.find(data => {
    const cocokUmur = totalUsiaBulan >= data.min_bulan && totalUsiaBulan <= data.max_bulan;
    if (!data.gender) return cocokUmur;
    return cocokUmur && data.gender === jenis_kelamin;
  });

  if (!kebutuhanDasar) throw new Error("Kelompok umur tidak ditemukan di referensi AKG.");
  kebutuhanDasar = { ...kebutuhanDasar }; 
  // Hitung ulang energi berdasarkan berat badan
  if (totalUsiaBulan > 5) {
    const energiTerhitung = hitungEnergiByBeratBadan(jenis_kelamin, usia_tahun, berat_kg);
    if (energiTerhitung) kebutuhanDasar.energi = Math.round(energiTerhitung);
  }

  // 3. Penyesuaian untuk Kondisi Gizi Kurang
  const catatanKhusus = [];
  if (statusGizi.stunting?.status !== 'normal' || statusGizi.wasting?.status !== 'normal') {
    const multiplier = 1.15; // Kenaikan 15% untuk kejar tumbuh
    const nutrisiKejarTumbuh = ['protein', 'lemak', 'zat_besi', 'seng', 'kalsium', 'vit_d'];
    nutrisiKejarTumbuh.forEach(nutrisi => {
      if (kebutuhanDasar[nutrisi]) {
        kebutuhanDasar[nutrisi] = Math.round(kebutuhanDasar[nutrisi] * multiplier);
      }
    });
    catatanKhusus.push(`Kebutuhan nutrisi disesuaikan untuk kejar tumbuh (${(multiplier - 1) * 100}%).`);
  }

  // 4. Finalisasi Output
  const kebutuhanGiziTerstruktur = [];
  const nutrisiPenting = ['energi', 'protein', 'lemak', 'karbohidrat', 'serat', 'air', 'zat_besi', 'seng', 'kalsium', 'vit_a', 'vit_c', 'vit_d'];
  const satuanMap = { energi: 'kcal', air: 'ml', vit_a: 'mcg RAE' };

  nutrisiPenting.forEach(nutrisi => {
    if (kebutuhanDasar[nutrisi] !== undefined) {
      let satuan = 'g';
      if (['zat_besi', 'seng', 'kalsium', 'vit_c'].includes(nutrisi)) satuan = 'mg';
      kebutuhanGiziTerstruktur.push({
        nama: nutrisi,
        kuantitas: kebutuhanDasar[nutrisi],
        satuan: satuanMap[nutrisi] || satuan,
      });
    }
  });

  return {
    user_id: dataPengguna.user_id,
    status_gizi_terdiagnosis: statusGizi,
    target_gizi_harian: kebutuhanGiziTerstruktur,
    catatan_khusus: catatanKhusus,
  };
}

module.exports = { hitungKebutuhanGiziHarian };