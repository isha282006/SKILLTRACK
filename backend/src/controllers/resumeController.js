const fs = require('fs');
const path = require('path');
const { Student, Skill, StudentSkill } = require('../models');
const { parseResume } = require('../services/resumeParserService');
const { calculateStudentReadiness } = require('../services/readinessService');

function formatExtractedSkills(parsedData) {
  const formattedSkills = [];
  const seen = new Set();
  const catMap = {
    programmingLanguages: 'Programming Languages',
    frameworks: 'Frameworks & Libraries',
    databases: 'Databases',
    tools: 'Developer Tools & Cloud',
    softSkills: 'Soft Skills'
  };

  if (parsedData?.skills?.categorized) {
    for (const [key, list] of Object.entries(parsedData.skills.categorized)) {
      list.forEach(skillName => {
        const lower = skillName.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          formattedSkills.push({
            name: skillName,
            category: catMap[key] || 'Technical Skills',
            proficiency_level: 'Intermediate',
            proficiency: 'Intermediate',
            years_of_experience: 1.0,
            selected: true
          });
        }
      });
    }
  }

  if (formattedSkills.length === 0 && Array.isArray(parsedData?.skills?.all)) {
    parsedData.skills.all.forEach(skillName => {
      const lower = skillName.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        formattedSkills.push({
          name: skillName,
          category: 'Technical Skills',
          proficiency_level: 'Intermediate',
          proficiency: 'Intermediate',
          years_of_experience: 1.0,
          selected: true
        });
      }
    });
  }

  return formattedSkills;
}

// Upload Resume & Extract Information for Student Review
async function uploadAndParseResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume file uploaded.' });
    }

    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    // Save uploaded file name
    student.resume_path = req.file.filename;
    await student.save();

    // Parse resume with NLP and extract entities
    const parsedData = await parseResume(req.file.path);
    parsedData.allSkills = formatExtractedSkills(parsedData);

    res.json({
      success: true,
      message: 'Resume parsed successfully! Please review the extracted skills and profile data before saving.',
      filename: req.file.filename,
      fileUrl: `/uploads/resumes/${req.file.filename}`,
      parsedData,
      data: {
        filename: req.file.filename,
        fileUrl: `/uploads/resumes/${req.file.filename}`,
        parsedData
      }
    });
  } catch (error) {
    next(error);
  }
}

// Preview / Demonstration parser (works for visitors or testing with sample/upload)
async function parseResumePreview(req, res, next) {
  try {
    let targetPath = null;

    if (req.file) {
      targetPath = req.file.path;
    } else {
      // Find a sample PDF in uploads
      const uploadsDir = path.join(__dirname, '../../uploads/resumes');
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.pdf') || f.endsWith('.docx'));
        if (files.length > 0) {
          targetPath = path.join(uploadsDir, files[0]);
        }
      }
    }

    if (!targetPath || !fs.existsSync(targetPath)) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded or sample resume available.'
      });
    }

    const parsedData = await parseResume(targetPath);
    parsedData.allSkills = formatExtractedSkills(parsedData);

    res.json({
      success: true,
      message: 'Document successfully tokenized and analyzed by JavaScript NLP engine.',
      filename: path.basename(targetPath),
      fileUrl: `/uploads/resumes/${path.basename(targetPath)}`,
      parsedData,
      data: {
        filename: path.basename(targetPath),
        fileUrl: `/uploads/resumes/${path.basename(targetPath)}`,
        parsedData
      }
    });
  } catch (error) {
    next(error);
  }
}

// Confirm Extracted Skills & Merge into Profile (MySQL persistence)
async function confirmAndSaveParsedSkills(req, res, next) {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const rawSkills = req.body.approvedSkills || req.body.skills || [];
    const updateProfileData = req.body.updateProfileData;

    if (updateProfileData) {
      if (updateProfileData.cgpa && !student.cgpa) student.cgpa = parseFloat(updateProfileData.cgpa);
      if (updateProfileData.phone && !student.phone) student.phone = updateProfileData.phone;
      if (updateProfileData.linkedin_url && !student.linkedin_url) student.linkedin_url = updateProfileData.linkedin_url;
      if (updateProfileData.github_url && !student.github_url) student.github_url = updateProfileData.github_url;
      await student.save();
    }

    let addedCount = 0;
    if (Array.isArray(rawSkills) && rawSkills.length > 0) {
      for (const item of rawSkills) {
        if (!item.name) continue;
        const skillName = item.name.trim();
        const category = item.category || 'Technical Skills';
        const prof = item.proficiency_level || item.proficiency || 'Intermediate';
        const years = parseFloat(item.years_of_experience || 1.0);

        const [skill] = await Skill.findOrCreate({
          where: { name: skillName },
          defaults: {
            category: category,
            description: 'Verified via Resume Extraction'
          }
        });

        const [stSkill, created] = await StudentSkill.findOrCreate({
          where: { student_id: student.id, skill_id: skill.id },
          defaults: {
            proficiency: prof,
            proficiency_level: prof,
            years_of_experience: years,
            verified: true
          }
        });

        stSkill.proficiency = prof;
        stSkill.proficiency_level = prof;
        stSkill.years_of_experience = years;
        stSkill.verified = true;
        await stSkill.save();

        addedCount++;
      }
    }

    // Recalculate readiness score with new student skills
    const refreshed = await Student.findByPk(student.id, {
      include: [
        { model: StudentSkill, as: 'skills', include: [{ model: Skill, as: 'skill' }] },
        { model: require('../models').AssessmentResult, as: 'assessment_results' }
      ]
    });
    const updatedReadiness = calculateStudentReadiness(refreshed);

    res.json({
      success: true,
      message: `Successfully verified and saved ${addedCount} skills to your Skills Matrix!`,
      data: {
        addedCount,
        readiness: updatedReadiness,
        skillsCount: (refreshed.skills || []).length
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadAndParseResume,
  parseResumePreview,
  confirmAndSaveParsedSkills
};

