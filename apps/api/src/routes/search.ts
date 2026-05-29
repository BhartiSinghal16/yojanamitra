import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req: Request, res: Response) => {
  try {
    const { query, language } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const hi = language === 'hi';

    const prompt = hi ? `
आप भारतीय सरकारी कल्याण योजनाओं के विशेषज्ञ हैं।

उपयोगकर्ता ने खोजा: "${query}"

इसका मतलब समझें:
- "kheti" या "kisan" या "किसान" या "खेती" = कृषि योजनाएं
- "padhai" या "education" या "पढ़ाई" या "शिक्षा" या "scholarship" = शिक्षा योजनाएं
- "mahila" या "women" या "महिला" या "लड़की" = महिला योजनाएं
- "health" या "sehat" या "स्वास्थ्य" या "बीमारी" = स्वास्थ्य योजनाएं
- "ghar" या "house" या "घर" या "आवास" = आवास योजनाएं
- "business" या "loan" या "व्यापार" या "ऋण" = व्यापार योजनाएं
- "pension" या "budhapa" या "पेंशन" या "बुढ़ापा" = पेंशन योजनाएं
- "disabled" या "divyang" या "विकलांग" या "दिव्यांग" = विकलांगता योजनाएं
- "student" या "chhatr" या "छात्र" = छात्र योजनाएं
- "rozgar" या "job" या "रोजगार" या "नौकरी" = रोजगार योजनाएं

इस खोज से संबंधित सभी सरकारी योजनाएं खोजें।

महत्वपूर्ण: सभी जानकारी केवल हिंदी में दें।

केवल valid JSON लौटाएं, कोई markdown नहीं:

{
  "search_intent": "<हिंदी में बताएं क्या खोजा>",
  "total_found": <संख्या>,
  "schemes": [
    {
      "id": "scheme_1",
      "name": "<योजना का नाम हिंदी में>",
      "ministry": "<मंत्रालय का नाम हिंदी में>",
      "benefit_type": "<cash/loan/insurance/subsidy/inkind/pension>",
      "benefit_amount": "<लाभ की जानकारी हिंदी में>",
      "who_can_apply": {
        "age": "<आयु सीमा हिंदी में>",
        "gender": "<पुरुष/महिला/सभी>",
        "caste": "<सामान्य/OBC/SC/ST/सभी>",
        "income": "<आय सीमा हिंदी में>",
        "occupation": "<व्यवसाय हिंदी में>"
      },
      "eligibility_summary": "<एक लाइन में पात्रता हिंदी में>",
      "documents_required": ["<दस्तावेज 1 हिंदी में>", "<दस्तावेज 2 हिंदी में>"],
      "how_to_apply": ["<चरण 1 हिंदी में>", "<चरण 2 हिंदी में>"],
      "application_url": "<official url>",
      "pro_tip": "<एक खास सलाह हिंदी में>"
    }
  ]
}` : `
You are an expert on Indian government welfare schemes.

A user searched for: "${query}"

Understand the intent:
- "kheti" or "kisan" or "farmer" = agriculture schemes
- "padhai" or "education" or "scholarship" = education schemes
- "mahila" or "women" or "ladki" = women schemes
- "health" or "sehat" or "bimari" = health schemes
- "ghar" or "house" or "home" = housing schemes
- "business" or "loan" or "vyapar" = business/loan schemes
- "pension" or "budhapa" or "old age" = pension schemes
- "disabled" or "divyang" or "viklang" = disability schemes
- "student" or "chhatr" = student schemes
- "rozgar" or "job" or "employment" = employment schemes

Find ALL government schemes related to this search.

Return ONLY valid JSON, no markdown:

{
  "search_intent": "<what user is looking for>",
  "total_found": <number>,
  "schemes": [
    {
      "id": "scheme_1",
      "name": "<scheme name in English>",
      "ministry": "<ministry name>",
      "benefit_type": "<cash/loan/insurance/subsidy/inkind/pension>",
      "benefit_amount": "<benefit description>",
      "who_can_apply": {
        "age": "<age range or All ages>",
        "gender": "<Male/Female/All>",
        "caste": "<General/OBC/SC/ST/All>",
        "income": "<income limit or No limit>",
        "occupation": "<farmer/student/all etc>"
      },
      "eligibility_summary": "<one line who qualifies>",
      "documents_required": ["<doc1>", "<doc2>"],
      "how_to_apply": ["<step1>", "<step2>", "<step3>"],
      "application_url": "<official url>",
      "pro_tip": "<one helpful tip>"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: hi
            ? 'आप भारतीय सरकारी योजनाओं के विशेषज्ञ हैं। केवल हिंदी में valid JSON लौटाएं।'
            : 'You are an expert on Indian government schemes. Return only valid JSON in English.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 3000,
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    const clean = raw.replace(/```json|```/g, '').trim();

    let result;
    try {
      result = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: 'Could not parse AI response' });
    }

    return res.json(result);

  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ error: 'Search failed. Please try again.' });
  }
});

export default router;