const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RiwayatMakan = sequelize.define('RiwayatMakan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tanggalMakan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'tanggal_makan'
    },
    sesiMakan: {
        type: DataTypes.ENUM('sarapan', 'makan_siang', 'makan_malam', 'selingan'),
        allowNull: false,
        field: 'sesi_makan'
    },
    jumlahG: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'jumlah_g'
    }
    // Kolom 'anakId' dan 'makananId' akan otomatis ditambahkan oleh Sequelize
    // saat kita mendefinisikan relasi di server.js
}, {
    tableName: 'riwayat_makan',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at'
});

module.exports = RiwayatMakan;