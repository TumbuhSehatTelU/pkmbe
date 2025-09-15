const { Keluarga, User, Anak } = require('../models');

async function getKeluargaLengkap(userId) {
    const currentUser = await User.findByPk(userId);
    if (!currentUser || !currentUser.keluargaId) {
        return null;     }

    const keluarga = await Keluarga.findByPk(currentUser.keluargaId);
    if (!keluarga) return null;

    const parents = await User.findAll({
        where: { keluargaId: currentUser.keluargaId },
        attributes: { exclude: ['password'] }
    });

    const children = await Anak.findAll({
        where: { keluargaId: currentUser.keluargaId }
    });
    
    const kepalaKeluarga = await User.findByPk(keluarga.id_kepala_keluarga);

    const hasilAkhir = {
        uniqueCode: keluarga.kode_keluarga,
        phoneNumber: kepalaKeluarga ? kepalaKeluarga.no_telepon : null,
        parents: parents,
        children: children
    };

    return hasilAkhir;
}

module.exports = {
    getKeluargaLengkap,
};