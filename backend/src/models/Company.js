const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  industry: {
    type: DataTypes.STRING(100),
    defaultValue: 'Technology'
  },
  website: {
    type: DataTypes.STRING(255)
  },
  location: {
    type: DataTypes.STRING(150),
    defaultValue: 'Bengaluru, India'
  },
  contact_email: {
    type: DataTypes.STRING(120)
  },
  contact_phone: {
    type: DataTypes.STRING(20)
  },
  description: {
    type: DataTypes.TEXT
  },
  logo_path: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'companies'
});

module.exports = Company;

