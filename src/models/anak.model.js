
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Anak = sequelize.define('Anak', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false,
    },
    tanggalLahir: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'tanggal_lahir'
    },
    tinggiBadan: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'tinggi_badan'
    },
    beratBadan: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'berat_badan'
    }
}, {
    tableName: 'anak',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports = Anak;