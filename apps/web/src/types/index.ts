export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  annual_income: number;
  caste: 'general' | 'obc' | 'sc' | 'st';
  state_code: string;
  occupation: string;
  family_size: number;
  has_disability: boolean;
  preferred_language: 'en' | 'hi';
}

export interface DocumentItem {
  name_en: string;
  name_hi: string;
  mandatory: boolean;
}

export interface GuideStep {
  step: number;
  title_en?: string;
  title_hi?: string;
  desc_en?: string;
  desc_hi?: string;
}

export interface Scheme {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string;
  ministry: string;
  scheme_type: 'central' | 'state';
  state_code: string;
  benefit_type: 'cash' | 'inkind' | 'subsidy' | 'insurance' | 'loan' | 'pension';
  benefit_amount_en: string;
  benefit_amount_hi: string;
  application_url: string;
  application_mode: string[];
  documents_required: DocumentItem[];
  guide_steps_en: GuideStep[];
  guide_steps_hi: GuideStep[];
  is_ongoing: boolean;
  deadline_date: string | null;
}

export interface MatchResult {
  scheme: Scheme;
  score: number;
  reasons: string[];
}

export interface MatchResponse {
  session_id: string;
  total_matched: number;
  matches: MatchResult[];
}