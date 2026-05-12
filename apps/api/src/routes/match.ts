import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../db/supabase';
import { matchSchemes } from '../services/matchingEngine';
import { UserProfile } from '../types';

const router = Router();

const ProfileSchema = z.object({
  age: z.number().min(0).max(120),
  gender: z.enum(['male', 'female', 'other']),
  annual_income: z.number().min(0),
  caste: z.enum(['general', 'obc', 'sc', 'st']),
  state_code: z.string().min(2).max(3),
  occupation: z.string().min(1),
  family_size: z.number().min(1).max(20),
  has_disability: z.boolean(),
  preferred_language: z.enum(['en', 'hi']).default('en'),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate input
    const parsed = ProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid profile data',
        details: parsed.error.flatten(),
      });
    }

    const profileData = parsed.data;

    // Generate session ID
    const session_id = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save profile to DB
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({ ...profileData, session_id });

    if (profileError) {
      console.error('Profile save error:', profileError);
    }

    // Fetch all active schemes
    const { data: schemes, error: schemesError } = await supabase
      .from('schemes')
      .select('*')
      .eq('is_active', true);

    if (schemesError || !schemes) {
      return res.status(500).json({ error: 'Failed to fetch schemes' });
    }

    // Run rule-based matching
    const profile: UserProfile = { ...profileData, session_id };
    const matches = matchSchemes(profile, schemes as any);

    // Save matches to DB
    if (matches.length > 0) {
      await supabase.from('scheme_matches').insert(
        matches.map(m => ({
          session_id,
          scheme_id: m.scheme.id,
          match_score: m.score,
        }))
      );
    }

    return res.json({
      session_id,
      total_matched: matches.length,
      matches: matches.map(m => ({
        scheme: m.scheme,
        score: m.score,
        reasons: m.reasons,
      })),
    });

  } catch (err) {
    console.error('Match error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;