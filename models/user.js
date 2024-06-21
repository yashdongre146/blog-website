const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        indexes: [{ unique: true, fields: ['email'] }]
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
})

module.exports = User;