const Fase0Service = require('./fase0_prioritas.service');
const Fase1Service = require('./fase1_kebutuhan.service');
const Fase2Service = require('./fase2_distribusi.service');
const Fase3Service = require('./fase3_generasiMenu.service');

async function generateFullRekomendasi(dataPengguna, historiMakanan) {
  // Fase 0: Menganalisis histori untuk membuat peta prioritas variasi.
  const petaPrioritas = Fase0Service.buatPetaPrioritas(historiMakanan);

  // Fase 1: Mendiagnosis status gizi dan menghitung kebutuhan harian.
  const targetGiziHarian = Fase1Service.hitungKebutuhanGiziHarian(dataPengguna);

  // Fase 2: Mendistribusikan kebutuhan harian ke dalam sesi-sesi makan.
  const targetPerSesi = Fase2Service.distribusikanKebutuhanHarian(targetGiziHarian);

  // Fase 3: Menghasilkan menu berdasarkan target sesi dan prioritas makanan.
  const rekomendasiMenu = Fase3Service.generateRekomendasiMenu(
    targetPerSesi.target_per_sesi_makan,
    petaPrioritas.peta_prioritas_terstruktur
  );

  return rekomendasiMenu;
}

module.exports = {
  generateFullRekomendasi,
};