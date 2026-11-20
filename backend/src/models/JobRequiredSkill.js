const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobRequiredSkill = sequelize.define('JobRequiredSkill', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_mandatory: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'job_required_skills'
});

module.exports = JobRequiredSkill;

