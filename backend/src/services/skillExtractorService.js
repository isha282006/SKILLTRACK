/**
 * Skill Extraction & NLP Pattern Engine
 * Categorizes extracted tokens into Technical, Aptitude, Soft Skills, Tools, and Frameworks
 */

const SKILL_DICTIONARY = {
  programmingLanguages: [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Go', 'Golang',
    'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'R', 'Scala', 'Dart', 'HTML', 'CSS'
  ],
  frameworks: [
    'React', 'React.js', 'ReactJS', 'Node.js', 'Express.js', 'Express', 'Django',
    'Flask', 'Spring Boot', 'Spring', 'Angular', 'Vue.js', 'Vue', 'Next.js', 'FastAPI',
    'Bootstrap', 'Tailwind CSS', 'Redux', 'PyTorch', 'TensorFlow', 'Scikit-Learn'
  ],
  databases: [
    'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Redis', 'Oracle', 'DynamoDB',
    'Cassandra', 'MariaDB', 'Firebase', 'Supabase', 'SQL'
  ],
  toolsAndDevOps: [
    'Docker', 'Kubernetes', 'Git', 'GitHub', 'GitLab', 'AWS', 'Amazon Web Services',
    'Microsoft Azure', 'Azure', 'Google Cloud Platform', 'GCP', 'Linux', 'Jenkins',
    'Terraform', 'Jira', 'Postman', 'Nginx', 'Webpack', 'Vite'
  ],
  softSkills: [
    'Technical Communication', 'Problem Solving', 'Agile Collaboration', 'Agile',
    'Public Speaking', 'Leadership', 'Critical Thinking', 'Teamwork', 'Time Management',
    'Conflict Resolution', 'Active Listening', 'Scrum'
  ]
};

function extractSkillsFromText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      all: [],
      categorized: {
        programmingLanguages: [],
        frameworks: [],
        databases: [],
        tools: [],
        softSkills: []
      }
    };
  }

  const textLower = rawText.toLowerCase();
  const foundSkills = new Set();
  const categorized = {
    programmingLanguages: [],
    frameworks: [],
    databases: [],
    tools: [],
    softSkills: []
  };

  function matchItems(list, targetCategory) {
    list.forEach(skill => {
      // Escape for regex
      const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
      if (regex.test(textLower)) {
        foundSkills.add(skill);
        targetCategory.push(skill);
      }
    });
  }

  matchItems(SKILL_DICTIONARY.programmingLanguages, categorized.programmingLanguages);
  matchItems(SKILL_DICTIONARY.frameworks, categorized.frameworks);
  matchItems(SKILL_DICTIONARY.databases, categorized.databases);
  matchItems(SKILL_DICTIONARY.toolsAndDevOps, categorized.tools);
  matchItems(SKILL_DICTIONARY.softSkills, categorized.softSkills);

  return {
    all: Array.from(foundSkills),
    categorized
  };
}

module.exports = {
  extractSkillsFromText,
  SKILL_DICTIONARY
};

