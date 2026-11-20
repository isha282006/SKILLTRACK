const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
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
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  roll_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    defaultValue: 7
  },
  cgpa: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 7.50
  },
  graduation_year: {
    type: DataTypes.INTEGER,
    defaultValue: 2026
  },
  backlogs: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  bio: {
    type: DataTypes.TEXT
  },
  resume_path: {
    type: DataTypes.STRING(255)
  },
  linkedin_url: {
    type: DataTypes.STRING(255)
  },
  github_url: {
    type: DataTypes.STRING(255)
  },
  placement_status: {
    type: DataTypes.ENUM('Not Placed', 'Shortlisted', 'Placed'),
    defaultValue: 'Not Placed'
  }
}, {
  tableName: 'students'
});

module.exports = Student;

