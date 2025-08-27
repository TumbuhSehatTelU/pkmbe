const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostVote = sequelize.define('PostVote', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    vote_type: { type: DataTypes.ENUM('like', 'dislike'), allowNull: false }
}, { tableName: 'post_votes', timestamps: false });

module.exports = PostVote;