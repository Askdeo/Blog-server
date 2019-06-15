const Sequelize = require('sequelize');

const sequelize = new Sequelize('mern', 'root', 'avokado1', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;