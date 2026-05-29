import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  theme: 'dark' | 'light';
  language: 'en' | 'hi';
}

const SUGGESTIONS = [
  { en: 'Farmer', hi: 'किसान', icon: '🌾' },
  { en: 'Education', hi: 'पढ़ाई', icon: '🎓' },
  { en: 'Women', hi: 'महिला', icon: '👩' },
  { en: 'Health', hi: 'स्वास्थ्य', icon: '🏥' },
  { en: 'Housing', hi: 'घर', icon: '🏠' },
  { en: 'Business', hi: 'व्यापार', icon: '💼' },
  { en: 'Pension', hi: 'पेंशन', icon: '👴' },
  { en: 'Student', hi: 'छात्र', icon: '📚' },
];

export const Search: React.FC<Props> = ({ theme, language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const dark = theme === 'dark';
  const hi = language === 'hi';

  const tc = {
    bg:      dark ? '#111118' : '#ffffff',
    bg2:     dark ? '#1a1a24' : '#f5f3ee',
    border:  dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text:    dark ? '#ffffff' : '#111118',
    muted:   dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)',
    gold:    dark ? '#f5c842' : '#c47f0a',
    teal:    dark ? '#00d4aa' : '#0a8c70',
    input:   dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    inputBorder: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
  };

  const search = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/search`,
        { query: q, language },
        { timeout: 30000 }
      );
      setResults(data);
    } catch (err: any) {
      setError(hi ? 'कुछ गलत हुआ। दोबारा कोशिश करें।' : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefitColors: Record<string, { bg: string; text: string }> = {
    cash:      { bg: 'rgba(34,197,94,0.15)',  text: dark ? '#4ade80' : '#16a34a' },
    insurance: { bg: 'rgba(59,130,246,0.15)', text: dark ? '#60a5fa' : '#2563eb' },
    loan:      { bg: 'rgba(168,85,247,0.15)', text: dark ? '#c084fc' : '#9333ea' },
    subsidy:   { bg: 'rgba(245,200,66,0.15)', text: dark ? '#f5c842' : '#ca8a04' },
    inkind:    { bg: 'rgba(251,146,60,0.15)', text: dark ? '#fb923c' : '#ea580c' },
    pension:   { bg: 'rgba(236,72,153,0.15)', text: dark ? '#f472b6' : '#db2777' },
  };

  return (
    <div style={{ width: '100%' }}>

      {/* Search box */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search(query)}
          placeholder={hi ? 'खोजें: किसान, पढ़ाई, महिला, स्वास्थ्य...' : 'Search: farmer, education, women, health...'}
          style={{
            flex: 1, background: tc.input, border: `1px solid ${tc.inputBorder}`,
            borderRadius: 14, padding: '14px 18px', fontSize: 15,
            color: tc.text, outline: 'none', fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        />
        <button
          onClick={() => search(query)}
          disabled={loading || !query.trim()}
          style={{
            padding: '14px 22px', borderRadius: 14, border: 'none',
            background: loading ? `${tc.gold}60` : tc.gold,
            color: '#0a0a0f', fontWeight: 700, fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'IBM Plex Sans', sans-serif",
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s', flexShrink: 0,
          }}>
          {loading ? (
            <>
              <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </>
          ) : '🔍'}
          {loading ? (hi ? 'खोज रहे हैं...' : 'Searching...') : (hi ? 'खोजें' : 'Search')}
        </button>
      </div>

      {/* Quick suggestions */}
      {!results && !loading && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {SUGGESTIONS.map(s => (
            <button key={s.en}
              onClick={() => { setQuery(hi ? s.hi : s.en); search(hi ? s.hi : s.en); }}
              style={{
                padding: '7px 14px', borderRadius: 100, border: `1px solid ${tc.border}`,
                background: tc.bg2, color: tc.muted, cursor: 'pointer',
                fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif",
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = tc.gold; (e.currentTarget as HTMLElement).style.color = tc.gold; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = tc.border; (e.currentTarget as HTMLElement).style.color = tc.muted; }}>
              {s.icon} {hi ? s.hi : s.en}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#f87171', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: 18, color: tc.gold }}>
                {results.total_found} {hi ? 'योजनाएं मिलीं' : 'Schemes Found'}
              </div>
              <div style={{ fontSize: 13, color: tc.muted, marginTop: 2 }}>
                {hi ? 'खोज:' : 'For:'} "{results.search_intent}"
              </div>
            </div>
            <button
              onClick={() => { setResults(null); setQuery(''); }}
              style={{ background: 'none', border: `1px solid ${tc.border}`, color: tc.muted, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {hi ? '✕ साफ करें' : '✕ Clear'}
            </button>
          </div>

          {/* Scheme cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {results.schemes?.map((scheme: any, i: number) => {
              const color = benefitColors[scheme.benefit_type] || benefitColors.cash;
              const isOpen = expanded === scheme.id;

              return (
                <div key={scheme.id || i} style={{
                  background: tc.bg, border: `1px solid ${tc.border}`,
                  borderRadius: 18, overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${tc.gold}60`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = tc.border)}>

                  {/* Card header */}
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${tc.gold}20`, color: tc.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: tc.text, lineHeight: 1.3 }}>{scheme.name}</div>
                          <div style={{ fontSize: 12, color: tc.muted, marginTop: 3 }}>{scheme.ministry}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: color.bg, color: color.text, flexShrink: 0 }}>
                        {scheme.benefit_type}
                      </span>
                    </div>

                    {/* Benefit */}
                    <div style={{ marginTop: 12, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10, padding: '8px 14px' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: dark ? '#4ade80' : '#15803d' }}>
                        💰 {scheme.benefit_amount}
                      </div>
                    </div>

                    {/* Who can apply pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {[
                        { label: `👤 ${scheme.who_can_apply?.gender || 'All'}` },
                        { label: `🎂 ${scheme.who_can_apply?.age || 'All ages'}` },
                        { label: `💰 ${scheme.who_can_apply?.income || 'No limit'}` },
                        { label: `🏷️ ${scheme.who_can_apply?.caste || 'All'}` },
                      ].map((p, j) => (
                        <span key={j} style={{ fontSize: 11, background: `${tc.gold}12`, color: tc.gold, padding: '3px 10px', borderRadius: 100, border: `1px solid ${tc.gold}25` }}>
                          {p.label}
                        </span>
                      ))}
                    </div>

                    {/* Eligibility summary */}
                    <div style={{ marginTop: 10, fontSize: 13, color: tc.muted, lineHeight: 1.5 }}>
                      ✓ {scheme.eligibility_summary}
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : scheme.id)}
                    style={{
                      width: '100%', padding: '11px', fontSize: 13,
                      color: tc.muted, background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      border: 'none', borderTop: `1px solid ${tc.border}`,
                      cursor: 'pointer', fontFamily: "'IBM Plex Sans', sans-serif",
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = tc.gold)}
                    onMouseLeave={e => (e.currentTarget.style.color = tc.muted)}>
                    {isOpen ? `▲ ${hi ? 'छुपाएं' : 'Hide Details'}` : `▼ ${hi ? 'दस्तावेज + कैसे करें आवेदन' : 'Documents + How to Apply'}`}
                  </button>

                  {/* Expanded */}
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${tc.border}` }}>

                      {/* Documents */}
                      {scheme.documents_required?.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', marginBottom: 8 }}>
                            📄 {hi ? 'जरूरी दस्तावेज' : 'Documents Required'}
                          </div>
                          {scheme.documents_required.map((doc: string, j: number) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)', marginBottom: 6 }}>
                              <span style={{ color: '#f87171', fontSize: 8 }}>●</span> {doc}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* How to apply */}
                      {scheme.how_to_apply?.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', marginBottom: 10 }}>
                            🪜 {hi ? 'आवेदन कैसे करें' : 'How to Apply'}
                          </div>
                          {scheme.how_to_apply.map((step: string, j: number) => (
                            <div key={j} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                              <div style={{ width: 20, height: 20, borderRadius: '50%', background: tc.gold, color: '#0a0a0f', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                {j + 1}
                              </div>
                              <div style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)', lineHeight: 1.5 }}>{step}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pro tip */}
                      {scheme.pro_tip && (
                        <div style={{ marginTop: 14, padding: '10px 14px', background: dark ? 'rgba(0,212,170,0.06)' : 'rgba(10,140,112,0.05)', border: `1px solid ${dark ? 'rgba(0,212,170,0.2)' : 'rgba(10,140,112,0.2)'}`, borderRadius: 10, fontSize: 12, color: dark ? '#00d4aa' : '#0a8c70' }}>
                          🎯 <strong>{hi ? 'खास सलाह:' : 'Pro tip:'}</strong> {scheme.pro_tip}
                        </div>
                      )}

                      {/* Apply button */}
                      {scheme.application_url && (
                        <a href={scheme.application_url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'block', textAlign: 'center', background: tc.gold, color: '#0a0a0f', fontWeight: 700, padding: '12px', borderRadius: 12, marginTop: 16, textDecoration: 'none', fontSize: 14 }}>
                          {hi ? 'अभी आवेदन करें →' : 'Apply Now →'}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};