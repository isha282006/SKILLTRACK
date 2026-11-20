const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Technical', 'Aptitude', 'Communication'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  time_limit_mins: {
    type: DataTypes.INTEGER,
    defaultValue: 15
  },
  passing_score: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  total_marks: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'assessments'
});

module.exports = Assessment;

