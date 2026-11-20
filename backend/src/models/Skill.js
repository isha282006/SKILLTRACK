const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.ENUM('Technical', 'Aptitude', 'Soft Skill'),
    allowNull: false,
    defaultValue: 'Technical'
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'skills'
});

module.exports = Skill;

