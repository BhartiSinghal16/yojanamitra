import React, { useState } from 'react';
import { MatchResult } from '../../types';

interface Props {
  match: MatchResult;
  language: 'en' | 'hi';
  rank: number;
  theme: 'dark' | 'light';
}

const benefitColors: Record<string, { bg: string; text: string }> = {
  cash:      { bg: 'rgba(34,197,94,0.15)',  text: '#16a34a' },
  insurance: { bg: 'rgba(59,130,246,0.15)', text: '#2563eb' },
  loan:      { bg: 'rgba(168,85,247,0.15)', text: '#9333ea' },
  subsidy:   { bg: 'rgba(234,179,8,0.15)',  text: '#ca8a04' },
  inkind:    { bg: 'rgba(249,115,22,0.15)', text: '#ea580c' },
  pension:   { bg: 'rgba(236,72,153,0.15)', text: '#db2777' },
};

const benefitColorsDark: Record<string, { bg: string; text: string }> = {
  cash:      { bg: 'rgba(34,197,94,0.15)',  text: '#4ade80' },
  insurance: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
  loan:      { bg: 'rgba(168,85,247,0.15)', text: '#c084fc' },
  subsidy:   { bg: 'rgba(245,200,66,0.15)', text: '#f5c842' },
  inkind:    { bg: 'rgba(251,146,60,0.15)', text: '#fb923c' },
  pension:   { bg: 'rgba(236,72,153,0.15)', text: '#f472b6' },
};

export const SchemeCard: React.FC<Props> = ({ match, language, rank, theme }) => {

  // ── ALL hooks must be at the top, inside the component ──
  const [expanded, setExpanded] = useState(false);
  const [guide, setGuide] = useState<any>(null);
  const [guideLoading, setGuideLoading] = useState(false);
  const [guideError, setGuideError] = useState<string | null>(null);

  const { scheme, score, reasons } = match;
  const hi   = language === 'hi';
  const dark = theme === 'dark';

  const name   = hi ? scheme.name_hi           : scheme.name_en;
  const amount = hi ? scheme.benefit_amount_hi  : scheme.benefit_amount_en;
  const steps  = hi ? scheme.guide_steps_hi     : scheme.guide_steps_en;
  const docs   = scheme.documents_required || [];

  const colors = dark ? benefitColorsDark : benefitColors;
  const color  = colors[scheme.benefit_type] || colors.cash;

  const tc = {
    card:         dark ? '#111118'                 : '#ffffff',
    border:       dark ? 'rgba(255,255,255,0.07)'  : 'rgba(0,0,0,0.08)',
    borderHover:  dark ? 'rgba(245,200,66,0.35)'   : 'rgba(196,127,10,0.4)',
    text:         dark ? '#ffffff'                 : '#111118',
    muted:        dark ? 'rgba(255,255,255,0.4)'   : 'rgba(0,0,0,0.45)',
    gold:         dark ? '#f5c842'                 : '#c47f0a',
    teal:         dark ? '#00d4aa'                 : '#0a8c70',
    rankBg:       dark ? 'rgba(245,200,66,0.15)'   : 'rgba(196,127,10,0.1)',
    scoreBg:      dark ? 'rgba(255,255,255,0.1)'   : 'rgba(0,0,0,0.08)',
    benefitBg:    dark ? 'rgba(34,197,94,0.08)'    : 'rgba(22,163,74,0.07)',
    benefitBorder:dark ? 'rgba(34,197,94,0.2)'     : 'rgba(22,163,74,0.2)',
    benefitText:  dark ? '#4ade80'                 : '#15803d',
    reasonBg:     dark ? 'rgba(245,200,66,0.08)'   : 'rgba(196,127,10,0.08)',
    reasonBorder: dark ? 'rgba(245,200,66,0.18)'   : 'rgba(196,127,10,0.2)',
    toggleBg:     dark ? 'rgba(255,255,255,0.03)'  : 'rgba(0,0,0,0.03)',
    toggleBorder: dark ? 'rgba(255,255,255,0.06)'  : 'rgba(0,0,0,0.07)',
    divider:      dark ? 'rgba(255,255,255,0.06)'  : 'rgba(0,0,0,0.07)',
    docText:      dark ? 'rgba(255,255,255,0.75)'  : 'rgba(0,0,0,0.75)',
    sectionLabel: dark ? 'rgba(255,255,255,0.6)'   : 'rgba(0,0,0,0.6)',
    stepTitle:    dark ? '#ffffff'                 : '#111118',
    stepDesc:     dark ? 'rgba(255,255,255,0.45)'  : 'rgba(0,0,0,0.5)',
    applyBg:      dark ? '#f5c842'                 : '#c47f0a',
    applyHover:   dark ? '#e8a020'                 : '#a66a08',
    guideBg:      dark ? 'rgba(245,200,66,0.05)'   : 'rgba(196,127,10,0.04)',
    guideBorder:  dark ? 'rgba(245,200,66,0.2)'    : 'rgba(196,127,10,0.15)',
    guideIntroBg: dark ? 'rgba(245,200,66,0.1)'    : 'rgba(196,127,10,0.08)',
    mistakeBg:    dark ? 'rgba(239,68,68,0.06)'    : 'rgba(239,68,68,0.05)',
    tipBg:        dark ? 'rgba(0,212,170,0.06)'    : 'rgba(10,140,112,0.05)',
    tipColor:     dark ? '#00d4aa'                 : '#0a8c70',
    tipBorder:    dark ? 'rgba(0,212,170,0.2)'     : 'rgba(10,140,112,0.2)',
  };

  // ── AI Guide fetcher ──
  const fetchGuide = async () => {
    if (guide) return;
    setGuideLoading(true);
    setGuideError(null);
    try {
      const res = await fetch('http://localhost:5000/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheme_id: scheme.id,
          profile: (window as any).__ym_profile,
        }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setGuide(data.guide);
    } catch {
      setGuideError('Could not generate guide. Please try again.');
    } finally {
      setGuideLoading(false);
    }
  };

  return (
    <div
      style={{
        background: tc.card, border: `1px solid ${tc.border}`,
        borderRadius: 20, overflow: 'hidden',
        transition: 'border-color 0.2s, background 0.3s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = tc.borderHover)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = tc.border)}>

      {/* ── Header ── */}
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: tc.rankBg, color: tc.gold,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              {rank}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: tc.text, lineHeight: 1.3 }}>{name}</div>
              <div style={{ fontSize: 12, color: tc.muted, marginTop: 3 }}>{scheme.ministry}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: color.bg, color: color.text }}>
              {scheme.benefit_type}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 52, height: 4, background: tc.scoreBg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${score}%`, background: tc.gold, borderRadius: 4, transition: 'width 0.6s ease' }} />
              </div>
              <span style={{ fontSize: 11, color: tc.muted }}>{score}%</span>
            </div>
          </div>
        </div>

        {/* Benefit */}
        <div style={{ marginTop: 14, background: tc.benefitBg, border: `1px solid ${tc.benefitBorder}`, borderRadius: 12, padding: '10px 14px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: tc.benefitText }}>💰 {amount}</div>
        </div>

        {/* Reasons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {reasons.map((r, i) => (
            <span key={i} style={{ fontSize: 11, background: tc.reasonBg, color: tc.gold, padding: '3px 10px', borderRadius: 100, border: `1px solid ${tc.reasonBorder}` }}>
              ✓ {r}
            </span>
          ))}
        </div>
      </div>

      {/* ── Toggle ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', padding: '12px', fontSize: 13,
          color: tc.muted, background: tc.toggleBg, border: 'none',
          borderTop: `1px solid ${tc.toggleBorder}`,
          cursor: 'pointer', transition: 'color 0.2s',
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = tc.gold)}
        onMouseLeave={e => (e.currentTarget.style.color = tc.muted)}>
        {expanded ? '▲ Hide Details' : '▼ Documents + How to Apply'}
      </button>

      {/* ── Expanded ── */}
      {expanded && (
        <div style={{ padding: '0 20px 22px', borderTop: `1px solid ${tc.divider}` }}>

          {/* Documents */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: tc.sectionLabel, marginBottom: 10 }}>📄 Documents Required</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {docs.map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <span style={{ color: doc.mandatory ? '#f87171' : tc.muted, fontSize: 8 }}>●</span>
                  <span style={{ color: tc.docText }}>{hi ? doc.name_hi : doc.name_en}</span>
                  {doc.mandatory && (
                    <span style={{ fontSize: 10, color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '1px 6px', borderRadius: 4 }}>required</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Static steps */}
          {steps && steps.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: tc.sectionLabel, marginBottom: 12 }}>🪜 How to Apply</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: tc.gold, color: '#0a0a0f', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: tc.stepTitle }}>{hi ? s.title_hi : s.title_en}</div>
                      <div style={{ fontSize: 12, color: tc.stepDesc, marginTop: 2 }}>{hi ? s.desc_hi : s.desc_en}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── AI Guide button ── */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={fetchGuide}
              disabled={guideLoading}
              style={{
                width: '100%', padding: '12px', borderRadius: 12,
                border: `1px solid ${tc.gold}40`,
                background: guideLoading ? `${tc.gold}25` : `${tc.gold}14`,
                color: tc.gold, fontWeight: 600, fontSize: 14,
                cursor: guideLoading ? 'not-allowed' : 'pointer',
                fontFamily: "'IBM Plex Sans', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
              }}>
              {guideLoading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', width: 15, height: 15 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  Generating AI Guide...
                </>
              ) : guide ? '✨ AI Guide Generated ↓' : '🤖 Generate My Personal AI Guide'}
            </button>

            {guideError && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#f87171', textAlign: 'center' }}>{guideError}</div>
            )}
          </div>

          {/* ── AI Guide content ── */}
          {guide && (
            <div style={{ marginTop: 16, background: tc.guideBg, border: `1px solid ${tc.guideBorder}`, borderRadius: 14, padding: 18 }}>

              {guide.intro && (
                <div style={{ fontSize: 13, color: tc.gold, fontWeight: 600, marginBottom: 16, lineHeight: 1.6, padding: '10px 14px', background: tc.guideIntroBg, borderRadius: 10, borderLeft: `3px solid ${tc.gold}` }}>
                  ✨ {guide.intro}
                </div>
              )}

              {guide.steps?.map((s: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: tc.gold, color: '#0a0a0f', fontSize: 11, fontWeight: 700, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    {s.step}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: tc.stepTitle }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: tc.stepDesc, marginTop: 3, lineHeight: 1.6 }}>{s.detail}</div>
                    {s.tip && (
                      <div style={{ fontSize: 11, color: tc.teal, marginTop: 5, padding: '4px 8px', background: 'rgba(0,212,170,0.08)', borderRadius: 6, display: 'inline-block' }}>
                        💡 {s.tip}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {guide.time_required && (
                <div style={{ fontSize: 12, color: tc.muted, marginBottom: 12, marginTop: 4 }}>
                  ⏱ <strong style={{ color: tc.text }}>Time required:</strong> {guide.time_required}
                </div>
              )}

              {guide.common_mistakes?.length > 0 && (
                <div style={{ padding: '12px 14px', background: tc.mistakeBg, border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#f87171', marginBottom: 8 }}>⚠️ Common Mistakes to Avoid</div>
                  {guide.common_mistakes.map((m: string, i: number) => (
                    <div key={i} style={{ fontSize: 12, color: tc.muted, marginBottom: 4 }}>• {m}</div>
                  ))}
                </div>
              )}

              {guide.pro_tip && (
                <div style={{ padding: '10px 14px', background: tc.tipBg, border: `1px solid ${tc.tipBorder}`, borderRadius: 10, fontSize: 12, color: tc.tipColor }}>
                  🎯 <strong>Pro tip:</strong> {guide.pro_tip}
                </div>
              )}
            </div>
          )}

          {/* Apply button */}
          {scheme.application_url && (
            <a
              href={scheme.application_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textAlign: 'center', background: tc.applyBg, color: '#0a0a0f', fontWeight: 700, padding: '13px', borderRadius: 12, marginTop: 20, textDecoration: 'none', fontSize: 14, transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = tc.applyHover)}
              onMouseLeave={e => (e.currentTarget.style.background = tc.applyBg)}>
              Apply Now →
            </a>
          )}
        </div>
      )}
    </div>
  );
};

