const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { extractSkillsFromText } = require('./skillExtractorService');

/**
 * Extracts plain text from a PDF or DOCX file
 */
async function extractRawTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text || '';
  } else if (ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  } else {
    // Plain text fallback
    return fs.readFileSync(filePath, 'utf-8');
  }
}

/**
 * Parses resume text into structured academic, experience, and skill entities
 */
async function parseResume(filePath) {
  const rawText = await extractRawTextFromFile(filePath);

  // 1. Contact & Socials extraction
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const emails = rawText.match(emailRegex) || [];
  const primaryEmail = emails[0] || null;

  const phoneRegex = /(?:(?:\+?91|0)?[\s-]?)?[6-9]\d{9}/g;
  const phones = rawText.match(phoneRegex) || [];
  const primaryPhone = phones[0] || null;

  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/gi;
  const linkedinMatch = rawText.match(linkedinRegex);
  const linkedinUrl = linkedinMatch ? linkedinMatch[0] : null;

  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/gi;
  const githubMatch = rawText.match(githubRegex);
  const githubUrl = githubMatch ? githubMatch[0] : null;

  // 2. CGPA extraction
  const cgpaRegex = /(?:cgpa|gpa)[\s:]*([0-9]\.[0-9]{1,2})/i;
  const cgpaMatch = rawText.match(cgpaRegex);
  const detectedCgpa = cgpaMatch ? parseFloat(cgpaMatch[1]) : null;

  // 3. Education Sections
  const educationEntries = [];
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  const degreeKeywords = ['b.tech', 'b.e.', 'm.tech', 'bachelor', 'master', 'diploma', 'computer science', 'information technology'];
  lines.forEach(line => {
    const lower = line.toLowerCase();
    if (degreeKeywords.some(deg => lower.includes(deg))) {
      educationEntries.push(line);
    }
  });

  // 4. Projects & Experience heuristics
  const projects = [];
  const experience = [];
  const certifications = [];

  let currentSection = null;
  lines.forEach(line => {
    const lower = line.toLowerCase();
    if (lower.includes('project')) {
      currentSection = 'projects';
    } else if (lower.includes('experience') || lower.includes('internship') || lower.includes('employment')) {
      currentSection = 'experience';
    } else if (lower.includes('certification') || lower.includes('licenses') || lower.includes('achievements')) {
      currentSection = 'certifications';
    } else if (lower.includes('skills') || lower.includes('education')) {
      currentSection = null;
    } else if (currentSection && line.length > 10 && line.length < 150) {
      if (currentSection === 'projects' && projects.length < 5) projects.push(line);
      if (currentSection === 'experience' && experience.length < 5) experience.push(line);
      if (currentSection === 'certifications' && certifications.length < 5) certifications.push(line);
    }
  });

  // 5. Skills extraction via NLP dictionary
  const skillsData = extractSkillsFromText(rawText);

  return {
    rawTextLength: rawText.length,
    contact: {
      email: primaryEmail,
      phone: primaryPhone,
      linkedin: linkedinUrl,
      github: githubUrl
    },
    education: {
      cgpa: detectedCgpa,
      detectedDegrees: educationEntries.slice(0, 3)
    },
    projects: projects.slice(0, 4),
    experience: experience.slice(0, 4),
    certifications: certifications.slice(0, 4),
    skills: skillsData
  };
}

module.exports = {
  extractRawTextFromFile,
  parseResume
};

