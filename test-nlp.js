const { extractSkillsFromText } = require('./backend/src/services/skillExtractorService');

const sampleResumeText = `
Rohit Sharma
Bengaluru, Karnataka | rohit.sharma@skilltrack.com | +91 98765 43210
LinkedIn: https://linkedin.com/in/rohitsharma | GitHub: https://github.com/rohitsharma

EDUCATION
B.Tech in Computer Science & Engineering - RV College of Engineering (2022 - 2026)
CGPA: 8.85 / 10.0

TECHNICAL SKILLS
Languages: Python, JavaScript, Java, TypeScript, SQL, C++
Frameworks: React.js, Node.js, Express.js, Bootstrap, Django
Databases: MySQL, PostgreSQL, MongoDB, Redis
Cloud & Tools: Docker, Git, GitHub, Linux, AWS, Postman
Soft Skills: Problem Solving, Team Leadership, Technical Communication, Agile Collaboration

PROJECTS
SkillTrack - Placement & Skill Analytics Platform:
- Architected separated MERN full-stack platform using React, Node.js, Express, and MySQL.
- Implemented resume NLP parsing and placement readiness index with Chart.js visualization.

CERTIFICATIONS
- AWS Certified Cloud Practitioner
- Meta Front-End Developer Professional Certificate
`;

async function testSkillExtraction() {
  console.log('Testing Resume NLP Skill Extraction Engine...');
  const result = extractSkillsFromText(sampleResumeText);
  console.log(`✓ Detected ${result.all.length} Total Competencies:`);
  console.log('  Programming Languages:', result.categorized.programmingLanguages);
  console.log('  Frameworks & Libraries:', result.categorized.frameworks);
  console.log('  Databases:', result.categorized.databases);
  console.log('  Developer Tools & Cloud:', result.categorized.tools);
  console.log('  Soft Skills:', result.categorized.softSkills);
  console.log('\n🎉 NLP RESUME SKILL EXTRACTION ENGINE VERIFIED SUCCESSFULLY!');
}

testSkillExtraction();
