// SkillTrack - Dedicated Application Controller
const studentController = require('./studentController');
const adminController = require('./adminController');
const recruiterController = require('./recruiterController');

module.exports = {
  getMyApplications: studentController.getApplications,
  applyToJob: studentController.applyJob,
  adminGetApplications: adminController.getApplications,
  adminUpdateApplicationStatus: adminController.updateApplicationStatus,
  recruiterGetApplicants: recruiterController.getApplicants,
  recruiterUpdateApplicantStatus: recruiterController.updateApplicantStatus
};

