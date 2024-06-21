const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Tag = sequelize.define('tag', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true, // Ensure that tag names are unique
            fields: ['name'] // Index on name for faster lookup
        }
    ]
})

module.exports = Tag
