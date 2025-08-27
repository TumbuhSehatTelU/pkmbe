const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    judul: { type: DataTypes.STRING, allowNull: false },
    isi: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'posts', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

module.exports = Post;