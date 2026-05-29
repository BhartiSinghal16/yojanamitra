import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';
import { z } from 'zod';

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ProfileSchema = z.object({
  age: z.number().min(0).max(120),
  gender: z.enum(['male', 'female', 'other']),
  annual_income: z.number().min(0),
  caste: z.enum(['general', 'obc', 'sc', 'st']),
  state_code: z.string(),
  occupation: z.string(),
  family_size: z.number(),
  has_disability: z.boolean(),
  preferred_language: z.enum(['en', 'hi']),
});

const STATE_NAMES: Record<string, string> = {
  ALL: 'All India', DL: 'Delhi', MH: 'Maharashtra',
  UP: 'Uttar Pradesh', RJ: 'Rajasthan', MP: 'Madhya Pradesh',
  GJ: 'Gujarat', KA: 'Karnataka', TN: 'Tamil Nadu',
  WB: 'West Bengal', BR: 'Bihar', HR: 'Haryana',
  PB: 'Punjab', AP: 'Andhra Pradesh', KL: 'Kerala',
};

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = ProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    }

    const profile = parsed.data;
    const stateName = STATE_NAMES[profile.state_code] || profile.state_code;
    const hi = profile.preferred_language === 'hi';

    const prompt = `
You are an expert on Indian government welfare schemes. Your job is to find ALL central and state government schemes that this citizen qualifies for.

CITIZEN PROFILE:
- Age: ${profile.age} years
- Gender: ${profile.gender}
- Caste Category: ${profile.caste.toUpperCase()}
- State: ${stateName}
- Occupation: ${profile.occupation}
- Annual Income: ₹${profile.annual_income.toLocaleString('en-IN')}
- Family Size: ${profile.family_size} members
- Person with Disability: ${profile.has_disability ? 'Yes' : 'No'}

INSTRUCTIONS:
1. Find ALL schemes this person qualifies for — both central government and ${stateName} state schemes
2. Include schemes from all ministries — agriculture, health, housing, education, finance, women, MSME etc
3. Consider latest schemes — include schemes launched in 2023 and 2024 too
4. For each scheme give complete accurate information
5. Return MINIMUM 8 schemes, MAXIMUM 20 schemes
6. Return response in ${hi ? 'Hindi' : 'English'} language
7. Return ONLY valid JSON — no extra text, no markdown

Return this exact JSON format:
{
  "total_matched": <number>,
  "schemes": [
    {
      "name": "<scheme name in ${hi ? 'Hindi' : 'English'}>",
      "ministry": "<ministry name>",
      "scheme_type": "<central or state>",
      "benefit_type": "<cash/insurance/loan/subsidy/inkind/pension>",
      "benefit_amount": "<benefit description with amount>",
      "eligibility_reasons": ["<reason 1>", "<reason 2>", "<reason 3>"],
      "match_score": <number between 60 and 100>,
      "documents_required": [
        {"name": "<document name>", "mandatory": true}
      ],
      "application_steps": [
        {"step": 1, "title": "<step title>", "detail": "<step detail>", "tip": "<helpful tip>"}
      ],
      "application_url": "<official website url>",
      "application_mode": ["online", "offline", "CSC"],
      "is_ongoing": <true or false>,
      "deadline": "<deadline date or null>",
      "common_mistakes": ["<mistake 1>", "<mistake 2>"],
      "pro_tip": "<one insider tip for this specific person>"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert on Indian government welfare schemes with complete up-to-date knowledge of all central and state schemes. You always return valid JSON only. Never add markdown or extra text.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    const clean = raw.replace(/```json|```/g, '').trim();

    let result;
    try {
      result = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: 'AI returned invalid response. Please try again.' });
    }

    // Add unique IDs to each scheme
    result.schemes = result.schemes.map((scheme: any, index: number) => ({
      ...scheme,
      id: `ai_scheme_${Date.now()}_${index}`,
    }));

    return res.json({
      session_id: `sess_${Date.now()}`,
      total_matched: result.total_matched || result.schemes.length,
      matches: result.schemes.map((scheme: any) => ({
        scheme: {
          id: scheme.id,
          name_en: scheme.name,
          name_hi: scheme.name,
          ministry: scheme.ministry,
          scheme_type: scheme.scheme_type,
          benefit_type: scheme.benefit_type,
          benefit_amount_en: scheme.benefit_amount,
          benefit_amount_hi: scheme.benefit_amount,
          documents_required: scheme.documents_required.map((d: any) => ({
            name_en: d.name,
            name_hi: d.name,
            mandatory: d.mandatory,
          })),
          guide_steps_en: scheme.application_steps.map((s: any) => ({
            step: s.step,
            title_en: s.title,
            desc_en: s.detail,
            tip: s.tip,
          })),
          guide_steps_hi: scheme.application_steps.map((s: any) => ({
            step: s.step,
            title_hi: s.title,
            desc_hi: s.detail,
            tip: s.tip,
          })),
          application_url: scheme.application_url,
          application_mode: scheme.application_mode,
          is_ongoing: scheme.is_ongoing,
          deadline_date: scheme.deadline || null,
          common_mistakes: scheme.common_mistakes,
          pro_tip: scheme.pro_tip,
        },
        score: scheme.match_score,
        reasons: scheme.eligibility_reasons,
      })),
    });

  } catch (err) {
    console.error('Smart match error:', err);
    return res.status(500).json({ error: 'Failed to find schemes. Please try again.' });
  }
});

export default router;