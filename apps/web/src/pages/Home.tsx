import React, { useState, useRef } from 'react';
import { ProfileWizard } from '../components/profile/ProfileWizard';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { matchSchemes } from '../lib/api';
import { MatchResponse, UserProfile } from '../types';

type Page = 'landing' | 'form' | 'results';
type Theme = 'dark' | 'light';
type Lang = 'en' | 'hi';

const TICKER_SCHEMES = [
  { icon: '🌾', name: 'PM Kisan', benefit: '₹6,000/yr', tag: 'Farmers' },
  { icon: '🏥', name: 'Ayushman Bharat', benefit: '₹5L health', tag: 'All families' },
  { icon: '🔥', name: 'PM Ujjwala', benefit: 'Free LPG', tag: 'Women' },
  { icon: '🏠', name: 'PM Awas Yojana', benefit: '₹1.2L', tag: 'Housing' },
  { icon: '💼', name: 'MUDRA Loan', benefit: '₹10L loan', tag: 'Business' },
  { icon: '👧', name: 'Sukanya Samriddhi', benefit: '8.2% interest', tag: 'Girl child' },
  { icon: '🛡️', name: 'PM Suraksha Bima', benefit: '₹2L cover', tag: '₹20/yr only' },
  { icon: '👴', name: 'Atal Pension', benefit: '₹5K/month', tag: 'Retirement' },
  { icon: '🎓', name: 'NSP Scholarship', benefit: '₹20K/yr', tag: 'Students' },
  { icon: '⚒️', name: 'PM Vishwakarma', benefit: '₹15K grant', tag: 'Artisans' },
  { icon: '💧', name: 'MGNREGS', benefit: '100 days work', tag: 'Rural' },
  { icon: '🧵', name: 'Free Silai Machine', benefit: 'Free machine', tag: 'Women' },
];

const T = {
  dark: {
    bg: '#0a0a0f', bg2: '#111118', bg3: '#1a1a24',
    border: 'rgba(255,255,255,0.08)', text: '#ffffff',
    muted: 'rgba(255,255,255,0.45)', gold: '#f5c842',
    gold2: '#e8a020', teal: '#00d4aa', card: '#111118',
    input: 'rgba(255,255,255,0.05)', inputBorder: 'rgba(255,255,255,0.12)',
    nav: 'rgba(10,10,15,0.9)', pillName: '#ffffff',
    footerCredit: 'rgba(255,255,255,0.2)',
    schemePillBg: '#1a1a24',
  },
  light: {
    bg: '#f5f3ee', bg2: '#ffffff', bg3: '#ece9e2',
    border: 'rgba(0,0,0,0.08)', text: '#111118',
    muted: 'rgba(0,0,0,0.5)', gold: '#c47f0a',
    gold2: '#a66a08', teal: '#0a8c70', card: '#ffffff',
    input: 'rgba(0,0,0,0.04)', inputBorder: 'rgba(0,0,0,0.12)',
    nav: 'rgba(245,243,238,0.92)', pillName: '#111118',
    footerCredit: 'rgba(0,0,0,0.25)',
    schemePillBg: '#ece9e2',
  },
};

const ThemeBtn: React.FC<{ theme: Theme; toggle: () => void; t: typeof T.dark }> = ({ theme, toggle, t }) => (
  <button onClick={toggle}
    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    style={{
      width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.border}`,
      background: t.bg3, cursor: 'pointer', fontSize: 17,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.2s', flexShrink: 0,
    }}>
    {theme === 'dark' ? '☀️' : '🌙'}
  </button>
);

const LangToggle: React.FC<{ lang: Lang; setLang: (l: Lang) => void; t: typeof T.dark }> = ({ lang, setLang, t }) => (
  <div style={{ display: 'flex', background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 10, padding: 3, gap: 2 }}>
    {(['en', 'hi'] as Lang[]).map(l => (
      <button key={l} onClick={() => setLang(l)}
        style={{
          border: 'none', background: lang === l ? t.gold : 'transparent',
          color: lang === l ? '#0a0a0f' : t.muted,
          fontSize: 12, fontWeight: 600, padding: '5px 12px',
          borderRadius: 7, cursor: 'pointer', transition: 'all 0.2s',
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}>
        {l === 'en' ? 'EN' : 'हि'}
      </button>
    ))}
  </div>
);

export const Home: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('en');
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('ym-theme') as Theme) || 'dark'
  );
  const tickerRef = useRef<HTMLDivElement>(null);

  const t = T[theme];
  const hi = lang === 'hi';

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('ym-theme', next);
  };

  const handleSubmit = async (profile: UserProfile) => {
    setLoading(true);
    setError(null);
    setLang(profile.preferred_language as Lang);
    (window as any).__ym_profile = profile;
    try {
      const data = await matchSchemes(profile);
      setResults(data);
      setPage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(245,200,66,0.35); }
      70% { box-shadow: 0 0 0 14px rgba(245,200,66,0); }
      100% { box-shadow: 0 0 0 0 rgba(245,200,66,0); }
    }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
    @keyframes glow { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .fade-up   { animation: fadeUp 0.65s ease both; }
    .fade-up-1 { animation: fadeUp 0.65s 0.10s ease both; }
    .fade-up-2 { animation: fadeUp 0.65s 0.20s ease both; }
    .fade-up-3 { animation: fadeUp 0.65s 0.35s ease both; }
    .fade-up-4 { animation: fadeUp 0.65s 0.50s ease both; }
    .cta-btn {
      font-weight: 700; border: none; cursor: pointer;
      animation: pulse-ring 2.5s infinite;
      transition: transform 0.18s, opacity 0.18s;
      font-family: 'IBM Plex Sans', sans-serif;
    }
    .cta-btn:hover { transform: scale(1.04); opacity: 0.92; }
    .mesh { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
    @media (max-width: 640px) {
      .hero-title { font-size: 30px !important; }
      .grid-3 { grid-template-columns: 1fr !important; }
      .grid-2 { grid-template-columns: 1fr !important; }
      .stat-grid { grid-template-columns: repeat(3,1fr) !important; }
      .hide-sm { display: none !important; }
      .form-pad { padding: 20px 16px !important; }
    }
  `;

  const Nav = ({ back }: { back?: Page }) => (
    <nav style={{
      borderBottom: `1px solid ${t.border}`, background: t.nav,
      backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => setPage(back || 'landing')}
          style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 18 }}>
          {back && <span style={{ color: t.muted, fontWeight: 400 }}>←</span>}
          <span>🇮🇳 YojanaMitra</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeBtn theme={theme} toggle={toggleTheme} t={t} />
          <LangToggle lang={lang} setLang={setLang} t={t} />
          {!back && (
            <button className="cta-btn"
              style={{ padding: '9px 20px', borderRadius: 10, fontSize: 14, background: t.gold, color: '#0a0a0f' }}
              onClick={() => setPage('form')}>
              {hi ? 'शुरू करें' : 'Get Started'}
            </button>
          )}
          {back === 'form' && (
            <button onClick={() => setPage('form')}
              style={{ background: 'none', border: `1px solid ${t.border}`, color: t.muted, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {hi ? '← बदलें' : '← Edit'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );

  // ════════════════════════════════════════
  // LANDING
  // ════════════════════════════════════════
  if (page === 'landing') return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: t.bg, minHeight: '100vh', color: t.text, transition: 'background 0.3s, color 0.3s' }}>
      <style>{globalStyles}</style>
      <Nav />

      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 20px 56px' }}>
        <div className="mesh" style={{ width: 520, height: 520, background: theme === 'dark' ? 'rgba(245,200,66,0.1)' : 'rgba(196,127,10,0.08)', top: -120, left: -120 }} />
        <div className="mesh" style={{ width: 380, height: 380, background: theme === 'dark' ? 'rgba(0,212,170,0.07)' : 'rgba(10,140,112,0.06)', top: 60, right: -80 }} />

        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: theme === 'dark' ? 'rgba(245,200,66,0.1)' : 'rgba(196,127,10,0.1)', border: `1px solid ${t.gold}40`, borderRadius: 100, padding: '6px 16px', marginBottom: 26 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.gold, animation: 'glow 2s infinite', display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: t.gold, fontWeight: 600 }}>
              {hi ? '3,000+ सरकारी योजनाएं — एक जगह' : '3,000+ Government Schemes — One Place'}
            </span>
          </div>

          <h1 className="fade-up-1 hero-title" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 50, lineHeight: 1.1, marginBottom: 20, color: t.text }}>
            {hi
              ? <><span>वो लाभ पाएं </span><span style={{ color: t.gold }}>जिनके आप हकदार हैं</span></>
              : <><span>Find Every Scheme </span><span style={{ color: t.gold }}>You Qualify For</span></>}
          </h1>

          <p className="fade-up-2" style={{ color: t.muted, fontSize: 17, lineHeight: 1.75, maxWidth: 530, margin: '0 auto 34px' }}>
            {hi
              ? 'करोड़ों भारतीय सरकारी लाभ से वंचित रहते हैं — सिर्फ इसलिए क्योंकि उन्हें पता नहीं होता। 2 मिनट में जानें।'
              : "Millions of Indians miss benefits they deserve — simply because no one told them. Know yours in 2 minutes."}
          </p>

          <div className="fade-up-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="cta-btn"
              style={{ padding: '14px 32px', borderRadius: 14, fontSize: 16, background: t.gold, color: '#0a0a0f' }}
              onClick={() => setPage('form')}>
              {hi ? '🔍 अपनी योजनाएं खोजें' : '🔍 Find My Schemes'}
            </button>
            <button
              style={{ padding: '14px 28px', borderRadius: 14, fontSize: 15, background: 'transparent', border: `1px solid ${t.border}`, color: t.muted, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'IBM Plex Sans', sans-serif" }}
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
              {hi ? 'यह कैसे काम करता है? ↓' : 'How it works ↓'}
            </button>
          </div>

          <div className="fade-up-4 stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 48, maxWidth: 460, margin: '48px auto 0' }}>
            {[
              { num: '3K+', label: hi ? 'योजनाएं' : 'Schemes' },
              { num: '2 min', label: hi ? 'में परिणाम' : 'Results' },
              { num: '100%', label: hi ? 'मुफ्त' : 'Free' },
            ].map((s, i) => (
              <div key={i} style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20, textAlign: 'center', animation: `float 4s ${i * 0.4}s ease-in-out infinite` }}>
                <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 26, fontWeight: 700, color: t.gold }}>{s.num}</div>
                <div style={{ fontSize: 12, color: t.muted, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker 1 */}
      <section style={{ padding: '4px 0 28px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 12, animation: 'ticker 28s linear infinite' }} ref={tickerRef}>
          {[...TICKER_SCHEMES, ...TICKER_SCHEMES].map((s, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: t.schemePillBg, border: `1px solid ${t.border}`, borderRadius: 100, padding: '10px 18px', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.pillName }}>{s.name}</div>
                <div style={{ fontSize: 11, color: t.gold }}>{s.benefit}</div>
              </span>
              <span style={{ fontSize: 10, background: `${t.gold}18`, color: t.gold, padding: '2px 8px', borderRadius: 100 }}>{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 34, marginBottom: 8, color: t.text }}>
            {hi ? 'कैसे काम करता है' : 'How It Works'}
          </h2>
          <p style={{ color: t.muted, fontSize: 15 }}>{hi ? 'सिर्फ 3 आसान चरण' : '3 simple steps to your benefits'}</p>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { icon: '📋', num: '01', title: hi ? 'प्रोफाइल भरें' : 'Fill Profile', desc: hi ? 'आयु, आय, जाति, राज्य और व्यवसाय — 2 मिनट में।' : 'Age, income, caste, state, occupation. Takes 2 minutes.' },
            { icon: '⚡', num: '02', title: hi ? 'AI मिलान करता है' : 'AI Matches', desc: hi ? 'हर केंद्र और राज्य योजना से तुरंत पात्रता जांच।' : 'Instant eligibility check against every central + state scheme.' },
            { icon: '✅', num: '03', title: hi ? 'आवेदन करें' : 'Apply & Win', desc: hi ? 'चरण-दर-चरण गाइड, दस्तावेज सूची, सीधे आवेदन लिंक।' : 'Step-by-step guide, document checklist, direct apply links.' },
          ].map((s, i) => (
            <div key={i} style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 20, padding: 28, transition: 'border-color 0.3s, transform 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.teal; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: 11, color: t.teal, fontWeight: 700, letterSpacing: 2, marginBottom: 14 }}>{s.num}</div>
              <div style={{ fontSize: 30, marginBottom: 12 }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 17, marginBottom: 8, color: t.text }}>{s.title}</h3>
              <p style={{ color: t.muted, fontSize: 14, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '48px 20px', background: t.bg2, transition: 'background 0.3s' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 30, textAlign: 'center', marginBottom: 36, color: t.text }}>
            {hi ? 'YojanaMitra क्यों?' : 'Why YojanaMitra?'}
          </h2>
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
            {[
              { icon: '🎯', title: hi ? 'सटीक मिलान' : 'Precise Matching', desc: hi ? 'नियम-आधारित इंजन — कोई अनुमान नहीं।' : 'Rule-based engine — no hallucinations, full transparency.' },
              { icon: '🌐', title: hi ? 'हिंदी + English' : 'Hindi + English', desc: hi ? 'पूरी तरह द्विभाषी अनुभव।' : 'Fully bilingual — form, results, guides.' },
              { icon: '📄', title: hi ? 'दस्तावेज सूची' : 'Document Checklist', desc: hi ? 'हर योजना के लिए क्या चाहिए।' : 'Know exactly what to bring for each scheme.' },
              { icon: '🔒', title: hi ? 'निजी और सुरक्षित' : 'Private & Secure', desc: hi ? 'आपका डेटा कहीं नहीं बेचा जाता।' : 'Your data is never sold or shared.' },
              { icon: '📱', title: hi ? 'WhatsApp रिमाइंडर' : 'WhatsApp Reminders', desc: hi ? 'समय सीमा WhatsApp पर याद दिलाएं।' : 'Never miss a deadline — get reminded on WhatsApp.' },
              { icon: '⚡', title: hi ? 'तुरंत परिणाम' : 'Instant Results', desc: hi ? '2 मिनट में पूरी सूची।' : 'Full match list in under 2 minutes.' },
            ].map((f, i) => (
              <div key={i} style={{ background: t.bg3, border: `1px solid ${t.border}`, borderRadius: 18, padding: 22, display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'border-color 0.25s, transform 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.gold; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: t.text }}>{f.title}</div>
                  <div style={{ color: t.muted, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker 2 reverse */}
      <section style={{ padding: '28px 0', overflow: 'hidden', background: t.bg, transition: 'background 0.3s' }}>
        <div style={{ display: 'flex', gap: 12, animation: 'ticker 22s linear infinite reverse' }}>
          {[...TICKER_SCHEMES.slice(6), ...TICKER_SCHEMES.slice(0, 6), ...TICKER_SCHEMES.slice(6), ...TICKER_SCHEMES.slice(0, 6)].map((s, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: t.schemePillBg, border: `1px solid ${t.border}`, borderRadius: 100, padding: '10px 18px', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.pillName }}>{s.name}</span>
              <span style={{ fontSize: 11, color: t.teal }}>{s.benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="mesh" style={{ width: 600, height: 500, background: theme === 'dark' ? 'rgba(245,200,66,0.07)' : 'rgba(196,127,10,0.06)', top: -200, left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 36, marginBottom: 12, color: t.text }}>
            {hi ? 'अपने अधिकार जानें' : 'Know Your Rights'}
          </h2>
          <p style={{ color: t.muted, fontSize: 16, marginBottom: 28 }}>
            {hi ? 'बिल्कुल मुफ्त — अभी शुरू करें।' : 'Completely free — start in 2 minutes.'}
          </p>
          <button className="cta-btn"
            style={{ padding: '15px 40px', borderRadius: 14, fontSize: 16, background: t.gold, color: '#0a0a0f' }}
            onClick={() => setPage('form')}>
            {hi ? '🔍 अपनी योजनाएं खोजें' : '🔍 Find My Schemes'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: '28px 20px', textAlign: 'center', background: t.bg2, transition: 'background 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 20 }}>🇮🇳</span>
          <span style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 16, color: t.text }}>YojanaMitra</span>
        </div>
        <p style={{ color: t.muted, fontSize: 13 }}>Built with ❤️ for every Indian citizen</p>
        <p style={{ color: t.footerCredit, fontSize: 12, marginTop: 4 }}>
          Crafted by <span style={{ color: t.gold }}>Bharti Singhal</span> · Data from myscheme.gov.in
        </p>
      </footer>
    </div>
  );

  // ════════════════════════════════════════
  // FORM PAGE
  // ════════════════════════════════════════
  if (page === 'form') return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: t.bg, minHeight: '100vh', color: t.text, transition: 'background 0.3s, color 0.3s' }}>
      <style>{globalStyles}</style>
      <Nav back="landing" />
      <main style={{ maxWidth: 560, margin: '0 auto', padding: '32px 16px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 26, marginBottom: 6, color: t.text }}>
            {hi ? 'अपना प्रोफाइल भरें' : 'Tell Us About Yourself'}
          </h2>
          <p style={{ color: t.muted, fontSize: 14 }}>
            {hi ? 'सटीक जानकारी = बेहतर मिलान' : 'Accurate info = better matches'}
          </p>
        </div>
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 14, color: '#f87171' }}>
            {error}
          </div>
        )}
        <div className="form-pad" style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 24, padding: '28px 32px', transition: 'background 0.3s' }}>
          <ProfileWizard onSubmit={handleSubmit} loading={loading} theme={theme} language={lang} />
        </div>
      </main>
    </div>
  );

  // ════════════════════════════════════════
  // RESULTS PAGE
  // ════════════════════════════════════════
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: t.bg, minHeight: '100vh', color: t.text, transition: 'background 0.3s, color 0.3s' }}>
      <style>{globalStyles}</style>
      <Nav back="form" />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 60px' }}>
        <div style={{ background: theme === 'dark' ? 'linear-gradient(135deg, rgba(245,200,66,0.13), rgba(0,212,170,0.07))' : 'linear-gradient(135deg, rgba(196,127,10,0.1), rgba(10,140,112,0.06))', border: `1px solid ${t.gold}40`, borderRadius: 20, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 38 }}>🎉</div>
          <div>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 22, color: t.gold }}>
              {results?.total_matched} {hi ? 'योजनाएं मिलीं!' : 'Schemes Found!'}
            </div>
            <div style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>
              {hi ? 'आपके प्रोफाइल के अनुसार सर्वश्रेष्ठ मिलान' : 'Best matches · sorted by score'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {results?.matches.map((match, i) => (
            <SchemeCard key={match.scheme.id} match={match} language={lang} rank={i + 1} theme={theme} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40, color: t.footerCredit, fontSize: 12 }}>
          Crafted by <span style={{ color: t.gold }}>Bharti Singhal</span>
        </div>
      </main>
    </div>
  );
};
