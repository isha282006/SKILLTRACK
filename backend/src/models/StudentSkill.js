const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentSkill = sequelize.define('StudentSkill', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  proficiency: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert'),
    defaultValue: 'Intermediate'
  },
  years_of_experience: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 1.0
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'student_skills'
});

module.exports = StudentSkill;

