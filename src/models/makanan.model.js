const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Makanan = sequelize.define('Makanan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Sequelize mendukung tipe data JSON
    nutrisi: {
        type: DataTypes.JSON,
        allowNull: false,
    }
}, {
    tableName: 'makanan',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Makanan;