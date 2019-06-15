const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Comment = sequelize.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = Comment;