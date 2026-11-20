const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  job_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'Full-time'
  },
  location: {
    type: DataTypes.STRING(100),
    defaultValue: 'Bengaluru'
  },
  salary_package: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  min_cgpa: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 6.50
  },
  max_backlogs: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  allowed_departments: {
    type: DataTypes.STRING(255),
    defaultValue: 'All'
  },
  openings: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'jobs'
});

module.exports = Job;

