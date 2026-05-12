import { UserProfile, Scheme, MatchResult } from '../types';

export function matchSchemes(profile: UserProfile, schemes: Scheme[]): MatchResult[] {
  const results: MatchResult[] = [];

  for (const scheme of schemes) {
    const { eligible, score, reasons } = evaluateEligibility(profile, scheme);
    if (eligible) {
      results.push({ scheme, score, reasons });
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

function evaluateEligibility(
  profile: UserProfile,
  scheme: Scheme
): { eligible: boolean; score: number; reasons: string[] } {
  const e = scheme.eligibility;
  const reasons: string[] = [];
  let score = 50; // base score
  let disqualified = false;

  // ── Age check ──
  if (e.min_age !== null && profile.age < e.min_age) {
    disqualified = true;
  }
  if (e.max_age !== null && profile.age > e.max_age) {
    disqualified = true;
  }
  if (!disqualified && e.min_age !== null) {
    reasons.push(`Age ${profile.age} meets requirement`);
    score += 10;
  }

  // ── Income check ──
  if (e.max_annual_income !== null) {
    if (profile.annual_income > e.max_annual_income) {
      disqualified = true;
    } else {
      const incomeRatio = 1 - (profile.annual_income / e.max_annual_income);
      score += Math.round(incomeRatio * 20);
      reasons.push(`Income ₹${profile.annual_income.toLocaleString()} within limit`);
    }
  }

  // ── Caste check ──
  if (e.castes && e.castes.length > 0) {
    if (!e.castes.includes(profile.caste)) {
      disqualified = true;
    } else {
      // SC/ST/OBC schemes score higher for those categories
      if (['sc', 'st', 'obc'].includes(profile.caste) &&
          e.castes.length < 4) {
        score += 15;
        reasons.push(`${profile.caste.toUpperCase()} category benefit`);
      } else {
        score += 5;
      }
    }
  }

  // ── Gender check ──
  if (e.genders && e.genders.length > 0) {
    if (!e.genders.includes(profile.gender)) {
      disqualified = true;
    } else {
      if (e.genders.length === 1) {
        score += 10;
        reasons.push(`Scheme specifically for ${profile.gender}`);
      }
    }
  }

  // ── Occupation check ──
  if (e.occupations && e.occupations.length > 0) {
    const match = e.occupations.some((occ: string) =>
      profile.occupation.toLowerCase().includes(occ.toLowerCase()) ||
      occ.toLowerCase().includes(profile.occupation.toLowerCase())
    );
    if (!match) {
      disqualified = true;
    } else {
      score += 15;
      reasons.push(`Occupation matches scheme criteria`);
    }
  }

  // ── State check ──
  if (scheme.state_code !== 'ALL' && scheme.state_code !== profile.state_code) {
    disqualified = true;
  }
  if (scheme.state_code === profile.state_code) {
    score += 10;
    reasons.push(`State-specific scheme for your state`);
  }

  // ── Disability bonus ──
  if (e.disability_required === true && !profile.has_disability) {
    disqualified = true;
  }
  if (profile.has_disability && e.disability_required === true) {
    score += 20;
    reasons.push(`Disability benefit applicable`);
  }

  // ── Family size bonus ──
  if (e.min_family_size !== null && profile.family_size >= e.min_family_size) {
    score += 5;
    reasons.push(`Family size qualifies`);
  }

  return {
    eligible: !disqualified,
    score: Math.min(score, 100),
    reasons,
  };
}