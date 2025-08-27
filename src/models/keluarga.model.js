const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Keluarga = sequelize.define('Keluarga', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    kode_keluarga: { type: DataTypes.STRING, allowNull: false, unique: true },
    nama_keluarga: { type: DataTypes.STRING, allowNull: false },
    id_kepala_keluarga: { type: DataTypes.INTEGER }
}, { tableName: 'keluarga', timestamps: false });

module.exports = Keluarga;