function distribusikanKebutuhanHarian(outputFase1) {
  const { target_gizi_harian, status_gizi_terdiagnosis, user_id } = outputFase1;

  // 1. Tentukan Pola Distribusi
  let distribusi = {
    sarapan: 0.30,
    makan_siang: 0.40,
    makan_malam: 0.30,
  }; // Pola default (3x makan)

  const kondisiKhusus = status_gizi_terdiagnosis?.stunting?.status !== 'normal' ||
                        status_gizi_terdiagnosis?.wasting?.status !== 'normal';

  if (kondisiKhusus) {
    // Pola 5x makan untuk anak dengan stunting
    distribusi = {
      sarapan: 0.25,
      selingan_pagi: 0.10,
      makan_siang: 0.30,
      selingan_sore: 0.10,
      makan_malam: 0.25,
    };
  }

  // 2. Hitung Target untuk Setiap Sesi Makan
  const targetPerSesi = {};
  for (const sesi in distribusi) {
    const persentase = distribusi[sesi];
    targetPerSesi[sesi] = target_gizi_harian.map(nutrisi => {
      let kuantitasSesi = nutrisi.kuantitas * persentase;

      // Pembulatan agar angka rapi
      if (nutrisi.nama === 'energi') {
        kuantitasSesi = Math.round(kuantitasSesi);
      } else {
        // Bulatkan ke 2 angka desimal
        kuantitasSesi = parseFloat(kuantitasSesi.toFixed(2));
      }

      return {
        nama: nutrisi.nama,
        kuantitas: kuantitasSesi,
        satuan: nutrisi.satuan,
      };
    });
  }

  return {
    user_id: user_id,
    target_per_sesi_makan: targetPerSesi,
  };
}

module.exports = { distribusikanKebutuhanHarian };