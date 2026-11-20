const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recruiter = sequelize.define('Recruiter', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  designation: {
    type: DataTypes.STRING(100),
    defaultValue: 'HR Talent Acquisition Lead'
  },
  phone: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'recruiters'
});

module.exports = Recruiter;

