const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Applied', 'Shortlisted', 'Interview Scheduled', 'Placed', 'Rejected'),
    defaultValue: 'Applied'
  },
  applied_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT
  },
  interview_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'applications'
});

module.exports = Application;

