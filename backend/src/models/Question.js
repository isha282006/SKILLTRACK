const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  assessment_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  option_a: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  option_b: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  option_c: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  option_d: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  correct_option: {
    type: DataTypes.CHAR(1),
    allowNull: false
  },
  marks: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  explanation: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'questions'
});

module.exports = Question;

