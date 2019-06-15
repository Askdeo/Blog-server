const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Profile = sequelize.define('profile', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    sex: {
        type: Sequelize.STRING,
        allowNull: true
    },
    relation: {
        type: Sequelize.STRING,
        allowNull: true
    },
    location: {
        type: Sequelize.STRING,
        allowNull: true
    },
    languages: {
        type: Sequelize.STRING,
        allowNull: true
    },
    education: {
        type: Sequelize.STRING,
        allowNull: true
    },
    job: {
        type: Sequelize.STRING,
        allowNull: true
    },
    bio: {
        type: Sequelize.STRING,
        allowNull: true
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true
    }



});

module.exports = Profile;