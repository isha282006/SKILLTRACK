const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Placement = sequelize.define('Placement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  package_lpa: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  placement_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  offer_letter_ref: {
    type: DataTypes.STRING(100)
  },
  status: {
    type: DataTypes.ENUM('Accepted', 'Pending'),
    defaultValue: 'Accepted'
  }
}, {
  tableName: 'placements'
});

module.exports = Placement;

