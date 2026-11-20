const sequelize = require('../config/database');
const User = require('./User');
const Student = require('./Student');
const Recruiter = require('./Recruiter');
const Company = require('./Company');
const Skill = require('./Skill');
const StudentSkill = require('./StudentSkill');
const Assessment = require('./Assessment');
const Question = require('./Question');
const AssessmentResult = require('./AssessmentResult');
const Job = require('./Job');
const JobRequiredSkill = require('./JobRequiredSkill');
const Application = require('./Application');
const Placement = require('./Placement');
const Notification = require('./Notification');

// User Relationships
User.hasOne(Student, { foreignKey: 'user_id', as: 'student', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Recruiter, { foreignKey: 'user_id', as: 'recruiter', onDelete: 'CASCADE' });
Recruiter.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Company & Recruiter
Company.hasMany(Recruiter, { foreignKey: 'company_id', as: 'recruiters', onDelete: 'SET NULL' });
Recruiter.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Company & Job
Company.hasMany(Job, { foreignKey: 'company_id', as: 'jobs', onDelete: 'CASCADE' });
Job.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Student & Skills
Student.hasMany(StudentSkill, { foreignKey: 'student_id', as: 'skills', onDelete: 'CASCADE' });
StudentSkill.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Skill.hasMany(StudentSkill, { foreignKey: 'skill_id', as: 'student_skills', onDelete: 'CASCADE' });
StudentSkill.belongsTo(Skill, { foreignKey: 'skill_id', as: 'skill' });

// Assessment & Questions
Assessment.hasMany(Question, { foreignKey: 'assessment_id', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Assessment, { foreignKey: 'assessment_id', as: 'assessment' });

Assessment.hasMany(AssessmentResult, { foreignKey: 'assessment_id', as: 'results', onDelete: 'CASCADE' });
AssessmentResult.belongsTo(Assessment, { foreignKey: 'assessment_id', as: 'assessment' });

Student.hasMany(AssessmentResult, { foreignKey: 'student_id', as: 'assessment_results', onDelete: 'CASCADE' });
AssessmentResult.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Job & Skills
Job.hasMany(JobRequiredSkill, { foreignKey: 'job_id', as: 'required_skills', onDelete: 'CASCADE' });
JobRequiredSkill.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

Skill.hasMany(JobRequiredSkill, { foreignKey: 'skill_id', as: 'job_skills', onDelete: 'CASCADE' });
JobRequiredSkill.belongsTo(Skill, { foreignKey: 'skill_id', as: 'skill' });

// Applications
Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

Student.hasMany(Application, { foreignKey: 'student_id', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Placements
Student.hasMany(Placement, { foreignKey: 'student_id', as: 'placements', onDelete: 'CASCADE' });
Placement.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Company.hasMany(Placement, { foreignKey: 'company_id', as: 'placements', onDelete: 'CASCADE' });
Placement.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Job.hasMany(Placement, { foreignKey: 'job_id', as: 'placements', onDelete: 'SET NULL' });
Placement.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

const {
  getIsMySQLConnected,
  MockUser,
  MockStudent,
  MockRecruiter,
  MockCompany,
  MockSkill,
  MockStudentSkill,
  MockAssessment,
  MockQuestion,
  MockAssessmentResult,
  MockJob,
  MockJobRequiredSkill,
  MockApplication,
  MockPlacement,
  MockNotification
} = require('../config/memoryStore');

function createDispatcher(realModel, mockModel) {
  return new Proxy(realModel, {
    get(target, prop, receiver) {
      if (!getIsMySQLConnected()) {
        if (mockModel && prop in mockModel) {
          const val = mockModel[prop];
          return typeof val === 'function' ? val.bind(mockModel) : val;
        }
      }
      const realVal = Reflect.get(target, prop, receiver);
      return typeof realVal === 'function' ? realVal.bind(target) : realVal;
    }
  });
}

const DispatchedUser = createDispatcher(User, MockUser);
const DispatchedStudent = createDispatcher(Student, MockStudent);
const DispatchedRecruiter = createDispatcher(Recruiter, MockRecruiter);
const DispatchedCompany = createDispatcher(Company, MockCompany);
const DispatchedSkill = createDispatcher(Skill, MockSkill);
const DispatchedStudentSkill = createDispatcher(StudentSkill, MockStudentSkill);
const DispatchedAssessment = createDispatcher(Assessment, MockAssessment);
const DispatchedQuestion = createDispatcher(Question, MockQuestion);
const DispatchedAssessmentResult = createDispatcher(AssessmentResult, MockAssessmentResult);
const DispatchedJob = createDispatcher(Job, MockJob);
const DispatchedJobRequiredSkill = createDispatcher(JobRequiredSkill, MockJobRequiredSkill);
const DispatchedApplication = createDispatcher(Application, MockApplication);
const DispatchedPlacement = createDispatcher(Placement, MockPlacement);
const DispatchedNotification = createDispatcher(Notification, MockNotification);

module.exports = {
  sequelize,
  User: DispatchedUser,
  Student: DispatchedStudent,
  Recruiter: DispatchedRecruiter,
  Company: DispatchedCompany,
  Skill: DispatchedSkill,
  StudentSkill: DispatchedStudentSkill,
  Assessment: DispatchedAssessment,
  Question: DispatchedQuestion,
  AssessmentResult: DispatchedAssessmentResult,
  Job: DispatchedJob,
  JobRequiredSkill: DispatchedJobRequiredSkill,
  Application: DispatchedApplication,
  Placement: DispatchedPlacement,
  Notification: DispatchedNotification
};

