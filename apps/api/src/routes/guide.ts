import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';
import { supabase } from '../db/supabase';
import { z } from 'zod';

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GuideSchema = z.object({
  scheme_id: z.string().uuid(),
  profile: z.object({
    age: z.number(),
    gender: z.string(),
    caste: z.string(),
    state_code: z.string(),
    occupation: z.string(),
    annual_income: z.number(),
    has_disability: z.boolean(),
    preferred_language: z.enum(['en', 'hi']),
  }),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = GuideSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    }

    const { scheme_id, profile } = parsed.data;

    // Fetch scheme
    const { data: scheme, error } = await supabase
      .from('schemes')
      .select('*')
      .eq('id', scheme_id)
      .single();

    if (error || !scheme) {
      return res.status(404).json({ error: 'Scheme not found' });
    }

    const isHindi = profile.preferred_language === 'hi';

    const prompt = isHindi
      ? `
तुम एक सरकारी योजना विशेषज्ञ हो जो भारतीय नागरिकों की मदद करते हो।

नागरिक की जानकारी:
- उम्र: ${profile.age} साल
- लिंग: ${profile.gender}
- जाति: ${profile.caste.toUpperCase()}
- राज्य: ${profile.state_code}
- व्यवसाय: ${profile.occupation}
- वार्षिक आय: ₹${profile.annual_income.toLocaleString('en-IN')}
- विकलांगता: ${profile.has_disability ? 'हाँ' : 'नहीं'}

योजना: ${scheme.name_hi}
लाभ: ${scheme.benefit_amount_hi}
आवेदन का तरीका: ${scheme.application_mode?.join(', ')}
आवेदन लिंक: ${scheme.application_url}

इस नागरिक के लिए एक व्यक्तिगत चरण-दर-चरण आवेदन गाइड लिखो।
- सरल हिंदी में लिखो
- इस व्यक्ति की जाति, राज्य और व्यवसाय के अनुसार विशेष सलाह दो
- बताओ कि कहाँ जाना है, क्या लेकर जाना है, कितना समय लगेगा
- आम गलतियाँ बताओ जो लोग करते हैं
- JSON format में दो:
{
  "intro": "एक लाइन में क्यों यह योजना इनके लिए सही है",
  "steps": [{"step": 1, "title": "...", "detail": "...", "tip": "..."}],
  "documents": ["दस्तावेज 1", "दस्तावेज 2"],
  "time_required": "...",
  "common_mistakes": ["गलती 1", "गलती 2"],
  "pro_tip": "एक खास सलाह"
}
केवल JSON दो, कोई अतिरिक्त text नहीं।`
      : `
You are a government scheme expert helping Indian citizens navigate welfare applications.

Citizen profile:
- Age: ${profile.age} years
- Gender: ${profile.gender}
- Caste: ${profile.caste.toUpperCase()}
- State: ${profile.state_code}
- Occupation: ${profile.occupation}
- Annual income: ₹${profile.annual_income.toLocaleString('en-IN')}
- Disability: ${profile.has_disability ? 'Yes' : 'No'}

Scheme: ${scheme.name_en}
Benefit: ${scheme.benefit_amount_en}
Application mode: ${scheme.application_mode?.join(', ')}
Application URL: ${scheme.application_url}

Write a PERSONALIZED step-by-step application guide for this specific citizen.
- Use their caste, state, and occupation to give specific advice
- Tell them exactly where to go, what to bring, how long it takes
- Include common mistakes people make
- Return ONLY valid JSON:
{
  "intro": "One line why this scheme is perfect for them",
  "steps": [{"step": 1, "title": "...", "detail": "...", "tip": "..."}],
  "documents": ["doc1", "doc2"],
  "time_required": "...",
  "common_mistakes": ["mistake1", "mistake2"],
  "pro_tip": "One insider tip"
}
Return ONLY the JSON object, no extra text.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content || '{}';

    // Strip markdown code fences if present
    const clean = raw.replace(/```json|```/g, '').trim();
    const guide = JSON.parse(clean);

    return res.json({ guide, scheme_name: isHindi ? scheme.name_hi : scheme.name_en });

  } catch (err) {
    console.error('Guide generation error:', err);
    return res.status(500).json({ error: 'Failed to generate guide' });
  }
});

export default router;