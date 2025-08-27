const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reply = sequelize.define('Reply', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    isi: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'replies', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

module.exports = Reply;