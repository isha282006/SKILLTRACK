// SkillTrack - Dedicated Skills Controller
const studentController = require('./studentController');
const adminController = require('./adminController');

module.exports = {
  getStudentSkills: studentController.getSkills,
  addStudentSkill: studentController.addSkill,
  removeStudentSkill: studentController.deleteSkill,
  getTaxonomy: adminController.getSkills,
  createTaxonomySkill: adminController.createSkill,
  updateTaxonomySkill: adminController.updateSkill,
  deleteTaxonomySkill: adminController.deleteSkill
};

