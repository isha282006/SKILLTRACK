const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssessmentResult = sequelize.define('AssessmentResult', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assessment_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  total_marks: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  passed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  time_taken_seconds: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'assessment_results'
});

module.exports = AssessmentResult;

