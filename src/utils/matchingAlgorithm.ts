import { UserProfile, SkillMatch } from '../types';

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function skillsOverlap(skillA: string, skillB: string, catA?: string, catB?: string): boolean {
  if (catA && catB && catA === catB && (catA === 'Design' || catA === 'Writing')) {
    // category matches strongly for specific domains
  }
  const wordsA = tokenize(skillA);
  const wordsB = tokenize(skillB);
  
  // Direct inclusion
  if (skillA.toLowerCase().includes(skillB.toLowerCase()) || skillB.toLowerCase().includes(skillA.toLowerCase())) {
    return true;
  }
  
  // Word intersection (e.g. "React", "Frontend", "Figma", "Design", "Python", "Speaking")
  const common = wordsA.filter((w) => wordsB.includes(w));
  return common.length > 0;
}

export function computeMatches(currentUser: UserProfile, allUsers: UserProfile[]): SkillMatch[] {
  const otherUsers = allUsers.filter((u) => u.id !== currentUser.id);
  const matches: SkillMatch[] = [];

  for (const partner of otherUsers) {
    const teachSkillsMatched: string[] = []; // skills partner can teach current user
    const learnSkillsMatched: string[] = []; // skills current user can teach partner

    // Check 1: What can partner teach that currentUser wants to learn?
    for (const wantSkill of currentUser.learningSkills) {
      for (const partnerTeach of partner.teachingSkills) {
        if (
          skillsOverlap(wantSkill.name, partnerTeach.name, wantSkill.category, partnerTeach.category) ||
          (wantSkill.category === partnerTeach.category && partnerTeach.proficiency === 'Expert')
        ) {
          if (!teachSkillsMatched.includes(partnerTeach.name)) {
            teachSkillsMatched.push(partnerTeach.name);
          }
        }
      }
    }

    // Check 2: What can currentUser teach that partner wants to learn?
    for (const myTeach of currentUser.teachingSkills) {
      for (const partnerWant of partner.learningSkills) {
        if (
          skillsOverlap(myTeach.name, partnerWant.name, myTeach.category, partnerWant.category) ||
          (myTeach.category === partnerWant.category && myTeach.proficiency === 'Expert')
        ) {
          if (!learnSkillsMatched.includes(myTeach.name)) {
            learnSkillsMatched.push(myTeach.name);
          }
        }
      }
    }

    const hasPartnerCanTeach = teachSkillsMatched.length > 0;
    const hasICanTeach = learnSkillsMatched.length > 0;

    if (hasPartnerCanTeach && hasICanTeach) {
      // Perfect Mutual Skill Swap!
      const score = Math.min(99, 85 + teachSkillsMatched.length * 5 + learnSkillsMatched.length * 4);
      matches.push({
        partner,
        matchType: 'mutual',
        matchScore: score,
        teachSkillsMatched,
        learnSkillsMatched,
        reason: `Perfect 2-way match! ${partner.name.split(' ')[0]} can teach you ${teachSkillsMatched.join(', ')} while you can teach them ${learnSkillsMatched.join(', ')}.`,
      });
    } else if (hasPartnerCanTeach) {
      // Mentor Match (they teach what you want)
      const score = Math.min(88, 72 + teachSkillsMatched.length * 6);
      matches.push({
        partner,
        matchType: 'mentor',
        matchScore: score,
        teachSkillsMatched,
        learnSkillsMatched: [],
        reason: `${partner.name.split(' ')[0]} offers ${teachSkillsMatched.join(', ')} which matches your learning goals.`,
      });
    } else if (hasICanTeach) {
      // Peer Learner Match (you teach what they want)
      const score = Math.min(80, 65 + learnSkillsMatched.length * 5);
      matches.push({
        partner,
        matchType: 'peer-learner',
        matchScore: score,
        teachSkillsMatched: [],
        learnSkillsMatched,
        reason: `${partner.name.split(' ')[0]} is actively seeking to learn ${learnSkillsMatched.join(', ')}, which you teach.`,
      });
    } else {
      // General format / interest affinity match
      const commonFormats = currentUser.preferredFormats.filter((f) =>
        partner.preferredFormats.includes(f)
      );
      const commonInterests = currentUser.interests.filter((i) =>
        partner.interests.includes(i)
      );
      if (commonFormats.length > 0 || commonInterests.length > 0) {
        matches.push({
          partner,
          matchType: 'peer-learner',
          matchScore: 55 + commonFormats.length * 5,
          teachSkillsMatched: partner.teachingSkills.slice(0, 1).map((s) => s.name),
          learnSkillsMatched: [],
          reason: `Shared learning format (${commonFormats.join(', ') || 'Remote'}) and complementary skills.`,
        });
      }
    }
  }

  // Sort matches by match score descending
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
