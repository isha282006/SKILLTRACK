/**
 * Placement Readiness Score Service
 * Formula:
 *  - Technical Skills: 35%
 *  - Aptitude Assessment: 25%
 *  - Communication Skills: 20%
 *  - Academic Performance: 20%
 */

function calculateStudentReadiness(student) {
  if (!student) {
    return {
      totalScore: 0,
      category: 'Needs Improvement',
      categoryClass: 'danger',
      badgeColor: '#ef4444',
      components: {},
      tips: ['Complete your profile to generate your readiness score.']
    };
  }

  // 1. Technical Skills (35% weight)
  const assessmentResults = student.assessment_results || [];
  const studentSkills = student.skills || [];

  const techResults = assessmentResults.filter(
    r => r.assessment && r.assessment.category === 'Technical'
  );
  const techAssessmentAvg = techResults.length > 0
    ? techResults.reduce((acc, r) => acc + parseFloat(r.percentage || 0), 0) / techResults.length
    : null;

  const techSkills = studentSkills.filter(
    s => s.skill && s.skill.category === 'Technical'
  );
  const profWeights = { Beginner: 40, Intermediate: 70, Advanced: 90, Expert: 100 };
  const techSkillsAvg = techSkills.length > 0
    ? techSkills.reduce((acc, s) => acc + (profWeights[s.proficiency] || 60), 0) / techSkills.length
    : null;

  let techScore100 = 0.0;
  if (techAssessmentAvg !== null && techSkillsAvg !== null) {
    techScore100 = (techAssessmentAvg * 0.65) + (techSkillsAvg * 0.35);
  } else if (techAssessmentAvg !== null) {
    techScore100 = techAssessmentAvg;
  } else if (techSkillsAvg !== null) {
    techScore100 = techSkillsAvg * 0.8;
  }
  const techPoints = Math.round((techScore100 / 100.0) * 35.0 * 10) / 10;

  // 2. Aptitude Assessment (25% weight)
  const aptResults = assessmentResults.filter(
    r => r.assessment && r.assessment.category === 'Aptitude'
  );
  let aptScore100 = 0.0;
  if (aptResults.length > 0) {
    aptScore100 = aptResults.reduce((acc, r) => acc + parseFloat(r.percentage || 0), 0) / aptResults.length;
  } else {
    const aptSkills = studentSkills.filter(s => s.skill && s.skill.category === 'Aptitude');
    if (aptSkills.length > 0) {
      aptScore100 = (aptSkills.reduce((acc, s) => acc + (profWeights[s.proficiency] || 50), 0) / aptSkills.length) * 0.5;
    }
  }
  const aptPoints = Math.round((aptScore100 / 100.0) * 25.0 * 10) / 10;

  // 3. Communication Skills (20% weight)
  const commResults = assessmentResults.filter(
    r => r.assessment && r.assessment.category === 'Communication'
  );
  const commTestAvg = commResults.length > 0
    ? commResults.reduce((acc, r) => acc + parseFloat(r.percentage || 0), 0) / commResults.length
    : null;

  const softSkills = studentSkills.filter(
    s => s.skill && s.skill.category === 'Soft Skill'
  );
  const softSkillsAvg = softSkills.length > 0
    ? softSkills.reduce((acc, s) => acc + (profWeights[s.proficiency] || 60), 0) / softSkills.length
    : null;

  let commScore100 = 0.0;
  if (commTestAvg !== null && softSkillsAvg !== null) {
    commScore100 = (commTestAvg * 0.6) + (softSkillsAvg * 0.4);
  } else if (commTestAvg !== null) {
    commScore100 = commTestAvg;
  } else if (softSkillsAvg !== null) {
    commScore100 = softSkillsAvg * 0.75;
  }
  const commPoints = Math.round((commScore100 / 100.0) * 20.0 * 10) / 10;

  // 4. Academic Performance (20% weight)
  const cgpa = parseFloat(student.cgpa || 0.0);
  let academicPct = Math.min(100.0, Math.max(0.0, (cgpa / 10.0) * 100.0));
  const backlogs = parseInt(student.backlogs || 0, 10);
  academicPct = Math.max(0.0, academicPct - (backlogs * 5.0));
  const academicPoints = Math.round((academicPct / 100.0) * 20.0 * 10) / 10;

  // Total Score
  let totalScore = Math.round((techPoints + aptPoints + commPoints + academicPoints) * 10) / 10;
  totalScore = Math.min(100.0, Math.max(0.0, totalScore));

  let category = 'Needs Improvement';
  let categoryClass = 'danger';
  let badgeColor = '#ef4444';

  if (totalScore >= 80.0) {
    category = 'Excellent';
    categoryClass = 'success';
    badgeColor = '#10b981';
  } else if (totalScore >= 60.0) {
    category = 'Good';
    categoryClass = 'primary';
    badgeColor = '#4f46e5';
  } else if (totalScore >= 40.0) {
    category = 'Average';
    categoryClass = 'warning';
    badgeColor = '#f59e0b';
  }

  const tips = [];
  if (techPoints < 25.0) {
    tips.push('Take more Technical Quizzes (Python, SQL, DSA) to verify competencies and unlock up to 35 points.');
  }
  if (aptPoints < 18.0) {
    tips.push('Attempt Quantitative and Logical Reasoning tests to boost your 25% Aptitude component.');
  }
  if (commPoints < 14.0) {
    tips.push('Complete the Professional Communication quiz and tag certified soft skills.');
  }
  if (academicPoints < 15.0) {
    tips.push('Maintain a CGPA >= 7.5 and clear active backlogs for top-tier eligibility cutoffs.');
  }
  if (!student.resume_path) {
    tips.push('Upload your verified PDF resume to complete recruiter profile verification.');
  }
  if (tips.length === 0) {
    tips.push('Outstanding profile! Maintain interview practice and apply for tier-1 campus drives.');
  }

  return {
    totalScore,
    score: totalScore,
    category,
    categoryClass,
    badgeColor,
    components: {
      technical: {
        name: 'Technical Skills',
        points: techPoints,
        maxPoints: 35.0,
        percentage: Math.round(techScore100 * 10) / 10,
        weight: 35
      },
      aptitude: {
        name: 'Aptitude Assessment',
        points: aptPoints,
        maxPoints: 25.0,
        percentage: Math.round(aptScore100 * 10) / 10,
        weight: 25
      },
      communication: {
        name: 'Communication Skills',
        points: commPoints,
        maxPoints: 20.0,
        percentage: Math.round(commScore100 * 10) / 10,
        weight: 20
      },
      academic: {
        name: 'Academic Performance',
        points: academicPoints,
        maxPoints: 20.0,
        percentage: Math.round(academicPct * 10) / 10,
        weight: 20
      }
    },
    breakdown: {
      technical: { earned: techPoints, max: 35, percentage: Math.round(techScore100 * 10) / 10 },
      aptitude: { earned: aptPoints, max: 25, percentage: Math.round(aptScore100 * 10) / 10 },
      communication: { earned: commPoints, max: 20, percentage: Math.round(commScore100 * 10) / 10 },
      academic: { earned: academicPoints, max: 20, percentage: Math.round(academicPct * 10) / 10 }
    },
    tips,
    disclaimer: 'This is an indicative score computed from current skills, assessments, and academics, not a guaranteed placement prediction.'
  };
}

module.exports = {
  calculateStudentReadiness
};
