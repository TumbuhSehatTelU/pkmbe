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
    tanggal_lahir: {
        type: DataTypes.DATEONLY, 
        allowNull: false,
    },
    berat_badan: {
        type: DataTypes.DECIMAL(5, 2), 
    },
    tinggi_badan: {
        type: DataTypes.DECIMAL(5, 2), 
    }
}, {
    tableName: 'anak',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at'
});

module.exports = Anak;