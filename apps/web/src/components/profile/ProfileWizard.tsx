import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { VoiceInput } from '../ui/VoiceInput';

const STATES = [
  { code: 'ALL', name: 'All India' }, { code: 'DL', name: 'Delhi' },
  { code: 'MH', name: 'Maharashtra' }, { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'RJ', name: 'Rajasthan' }, { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'GJ', name: 'Gujarat' }, { code: 'KA', name: 'Karnataka' },
  { code: 'TN', name: 'Tamil Nadu' }, { code: 'WB', name: 'West Bengal' },
  { code: 'BR', name: 'Bihar' }, { code: 'HR', name: 'Haryana' },
  { code: 'PB', name: 'Punjab' }, { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'KL', name: 'Kerala' },
];

const OCCUPATIONS = [
  { value: 'farmer',            label: '🌾 Farmer / Kisan' },
  { value: 'daily_wage_worker', label: '🔨 Daily Wage Worker' },
  { value: 'self_employed',     label: '🏪 Self Employed' },
  { value: 'salaried',          label: '💼 Salaried Employee' },
  { value: 'student',           label: '🎓 Student' },
  { value: 'homemaker',         label: '🏠 Homemaker' },
  { value: 'artisan',           label: '🧵 Artisan / Craftsperson' },
  { value: 'domestic_worker',   label: '🧹 Domestic Worker' },
  { value: 'unemployed',        label: '🔍 Unemployed' },
  { value: 'small_business',    label: '📦 Small Business Owner' },
];

const defaultProfile: UserProfile = {
  age: 25, gender: 'male', annual_income: 100000,
  caste: 'general', state_code: 'UP', occupation: 'farmer',
  family_size: 4, has_disability: false, preferred_language: 'en',
};

interface Props {
  onSubmit: (profile: UserProfile) => void;
  loading: boolean;
  theme: 'dark' | 'light';
  language?: 'en' | 'hi';
}

const steps = ['Personal', 'Financial', 'Location & Work', 'Review'];

export const ProfileWizard: React.FC<Props> = ({ onSubmit, loading, theme, language }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const update = (field: keyof UserProfile, value: any) =>
    setProfile(prev => ({ ...prev, [field]: value }));

  const dark = theme === 'dark';
  const lang = language || 'en';
  const hi = lang === 'hi';

  const tc = {
    text:           dark ? '#ffffff'                   : '#111118',
    muted:          dark ? 'rgba(255,255,255,0.45)'    : 'rgba(0,0,0,0.5)',
    mutedLight:     dark ? 'rgba(255,255,255,0.25)'    : 'rgba(0,0,0,0.25)',
    input:          dark ? 'rgba(255,255,255,0.05)'    : 'rgba(0,0,0,0.04)',
    inputBorder:    dark ? 'rgba(255,255,255,0.12)'    : 'rgba(0,0,0,0.14)',
    selectBg:       dark ? '#1a1a28'                   : '#f0ede6',
    chipBg:         dark ? 'rgba(255,255,255,0.03)'    : 'rgba(0,0,0,0.03)',
    chipBorder:     dark ? 'rgba(255,255,255,0.10)'    : 'rgba(0,0,0,0.10)',
    checkboxBg:     dark ? 'rgba(255,255,255,0.03)'    : 'rgba(0,0,0,0.03)',
    checkboxBorder: dark ? 'rgba(255,255,255,0.08)'    : 'rgba(0,0,0,0.08)',
    reviewBg:       dark ? 'rgba(245,200,66,0.06)'     : 'rgba(196,127,10,0.06)',
    reviewBorder:   dark ? 'rgba(245,200,66,0.15)'     : 'rgba(196,127,10,0.2)',
    reviewLine:     dark ? 'rgba(255,255,255,0.05)'    : 'rgba(0,0,0,0.06)',
    gold:           dark ? '#f5c842'                   : '#c47f0a',
    stepDone:       dark ? '#f5c842'                   : '#c47f0a',
    stepLine:       dark ? 'rgba(255,255,255,0.08)'    : 'rgba(0,0,0,0.1)',
    backBtn:        dark ? 'rgba(255,255,255,0.12)'    : 'rgba(0,0,0,0.1)',
    backColor:      dark ? 'rgba(255,255,255,0.7)'     : 'rgba(0,0,0,0.6)',
    backDisabled:   dark ? 'rgba(255,255,255,0.2)'     : 'rgba(0,0,0,0.2)',
  };

  const label: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: tc.muted, marginBottom: 8,
    letterSpacing: 1.2, textTransform: 'uppercase',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: tc.input, border: `1px solid ${tc.inputBorder}`,
    borderRadius: 12, padding: '12px 14px', fontSize: 15,
    color: tc.text, outline: 'none',
    fontFamily: "'IBM Plex Sans', sans-serif", transition: 'border-color 0.2s',
  };

  const selectStyle: React.CSSProperties = {
    width: '100%', background: tc.selectBg, border: `1px solid ${tc.inputBorder}`,
    borderRadius: 12, padding: '12px 14px', fontSize: 15,
    color: tc.text, outline: 'none', fontFamily: "'IBM Plex Sans', sans-serif",
  };

  const chip = (active: boolean): React.CSSProperties => ({
    padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600,
    border: `1.5px solid ${active ? tc.gold : tc.chipBorder}`,
    background: active ? `${tc.gold}18` : tc.chipBg,
    color: active ? tc.gold : tc.muted,
    cursor: 'pointer', transition: 'all 0.18s',
    fontFamily: "'IBM Plex Sans', sans-serif",
  });

  const occChip = (active: boolean): React.CSSProperties => ({
    padding: '10px 12px', borderRadius: 10, fontSize: 12, fontWeight: 500,
    border: `1.5px solid ${active ? tc.gold : tc.chipBorder}`,
    background: active ? `${tc.gold}14` : tc.chipBg,
    color: active ? tc.gold : tc.muted,
    cursor: 'pointer', transition: 'all 0.18s',
    textAlign: 'left', fontFamily: "'IBM Plex Sans', sans-serif",
  });

  const parseNumber = (text: string): number | null => {
    const num = parseInt(text.replace(/[^0-9]/g, ''));
    return isNaN(num) ? null : num;
  };

  const parseIncome = (text: string): number | null => {
    let num = parseInt(text.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return null;
    const lower = text.toLowerCase();
    if (lower.includes('lakh') || lower.includes('lac')) num = num * 100000;
    else if (lower.includes('thousand')) num = num * 1000;
    return num;
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif", color: tc.text }}>

      {/* ── Step indicator ── */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        {steps.map((name, i) => (
          <React.Fragment key={name}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                background: i < step ? tc.stepDone : i === step ? `${tc.gold}20` : tc.chipBg,
                color: i < step ? '#0a0a0f' : i === step ? tc.gold : tc.mutedLight,
                border: `1.5px solid ${i === step ? tc.gold : 'transparent'}`,
                transition: 'all 0.3s',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 11, fontWeight: i === step ? 600 : 400,
                color: i <= step ? tc.gold : tc.mutedLight,
                display: window.innerWidth < 480 ? 'none' : 'block',
                transition: 'color 0.3s',
              }}>
                {name}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1, margin: '0 8px',
                background: i < step ? tc.gold : tc.stepLine,
                transition: 'background 0.3s',
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Step 0 — Personal ── */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Age with voice */}
            <div>
              <label style={label}>Age 🎤</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="number"
                  style={{ ...inputStyle, flex: 1 }}
                  value={profile.age}
                  onChange={e => update('age', parseInt(e.target.value))}
                  min={0} max={120}
                />
                <VoiceInput
                  language={lang}
                  theme={theme}
                  onResult={text => {
                    const num = parseNumber(text);
                    if (num !== null) update('age', num);
                  }}
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label style={label}>Gender</label>
              <select style={selectStyle} value={profile.gender}
                onChange={e => update('gender', e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Caste */}
          <div>
            <label style={label}>Caste Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {['general', 'obc', 'sc', 'st'].map(c => (
                <button key={c} style={chip(profile.caste === c)}
                  onClick={() => update('caste', c)}>
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Family Size with voice */}
          <div>
            <label style={label}>Family Size 🎤</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                style={{ ...inputStyle, flex: 1 }}
                value={profile.family_size}
                onChange={e => update('family_size', parseInt(e.target.value))}
                min={1} max={20}
              />
              <VoiceInput
                language={lang}
                theme={theme}
                onResult={text => {
                  const num = parseNumber(text);
                  if (num !== null) update('family_size', num);
                }}
              />
            </div>
          </div>

          {/* Disability */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: tc.checkboxBg, border: `1px solid ${tc.checkboxBorder}`,
            borderRadius: 12, padding: '14px 16px',
          }}>
            <input type="checkbox" id="pwd" checked={profile.has_disability}
              onChange={e => update('has_disability', e.target.checked)}
              style={{ width: 16, height: 16, accentColor: tc.gold }} />
            <label htmlFor="pwd" style={{ fontSize: 14, color: tc.muted, cursor: 'pointer' }}>
              {hi ? 'विकलांग व्यक्ति (PwD)' : 'Person with disability (PwD)'}
            </label>
          </div>

          {/* Language */}
          <div>
            <label style={label}>{hi ? 'पसंदीदा भाषा' : 'Preferred Language'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[{ v: 'en', l: 'English' }, { v: 'hi', l: 'हिंदी' }].map(({ v, l }) => (
                <button key={v} style={chip(profile.preferred_language === v)}
                  onClick={() => update('preferred_language', v)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1 — Financial ── */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Annual Income with voice */}
          <div>
            <label style={label}>{hi ? 'वार्षिक आय (₹) 🎤' : 'Annual Income (₹) 🎤'}</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                style={{ ...inputStyle, flex: 1 }}
                value={profile.annual_income}
                onChange={e => update('annual_income', parseInt(e.target.value))}
                min={0}
              />
              <VoiceInput
                language={lang}
                theme={theme}
                onResult={text => {
                  const num = parseIncome(text);
                  if (num !== null) update('annual_income', num);
                }}
              />
            </div>
            <div style={{ fontSize: 13, color: tc.gold, marginTop: 8, fontWeight: 600 }}>
              ₹{profile.annual_income.toLocaleString('en-IN')} / {hi ? 'वर्ष' : 'year'}
            </div>
            <div style={{ fontSize: 11, color: tc.mutedLight, marginTop: 4 }}>
              💡 {hi ? 'बोलें: "एक लाख" या "पचास हजार"' : 'Say: "one lakh" or "fifty thousand"'}
            </div>
          </div>

          {/* Quick Select */}
          <div>
            <label style={label}>{hi ? 'जल्दी चुनें' : 'Quick Select'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[
                { l: 'Below ₹1L', v: 80000 },
                { l: '₹1L–2.5L',  v: 175000 },
                { l: '₹2.5L–5L',  v: 375000 },
                { l: '₹5L–10L',   v: 750000 },
                { l: '₹10L–18L',  v: 1400000 },
                { l: 'Above ₹18L',v: 2500000 },
              ].map(o => (
                <button key={o.l} style={chip(profile.annual_income === o.v)}
                  onClick={() => update('annual_income', o.v)}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2 — Location & Work ── */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={label}>{hi ? 'राज्य' : 'State'}</label>
            <select style={selectStyle} value={profile.state_code}
              onChange={e => update('state_code', e.target.value)}>
              {STATES.map(st => (
                <option key={st.code} value={st.code}>{st.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={label}>{hi ? 'व्यवसाय' : 'Occupation'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {OCCUPATIONS.map(o => (
                <button key={o.value} style={occChip(profile.occupation === o.value)}
                  onClick={() => update('occupation', o.value)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3 — Review ── */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: tc.reviewBg, border: `1px solid ${tc.reviewBorder}`,
            borderRadius: 16, padding: 20,
          }}>
            {[
              [hi ? 'आयु' : 'Age',                     `${profile.age} ${hi ? 'वर्ष' : 'years'}`],
              [hi ? 'लिंग' : 'Gender',                  profile.gender],
              [hi ? 'जाति' : 'Caste',                   profile.caste.toUpperCase()],
              [hi ? 'वार्षिक आय' : 'Annual Income',     `₹${profile.annual_income.toLocaleString('en-IN')}`],
              [hi ? 'राज्य' : 'State',                  STATES.find(s => s.code === profile.state_code)?.name],
              [hi ? 'व्यवसाय' : 'Occupation',           OCCUPATIONS.find(o => o.value === profile.occupation)?.label],
              [hi ? 'परिवार का आकार' : 'Family Size',   `${profile.family_size} ${hi ? 'सदस्य' : 'members'}`],
              [hi ? 'विकलांगता' : 'Disability',         profile.has_disability ? (hi ? 'हाँ' : 'Yes') : (hi ? 'नहीं' : 'No')],
              [hi ? 'भाषा' : 'Language',                profile.preferred_language === 'en' ? 'English' : 'हिंदी'],
            ].map(([lbl, val]) => (
              <div key={lbl as string} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '9px 0', borderBottom: `1px solid ${tc.reviewLine}`,
              }}>
                <span style={{ fontSize: 13, color: tc.muted }}>{lbl}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: tc.text, textTransform: 'capitalize' }}>{val}</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: tc.mutedLight }}>
            {hi
              ? 'हम आपको हर योजना से मिलाएंगे जिसके आप हकदार हैं।'
              : "We'll match you to every scheme you qualify for."}
          </p>
        </div>
      )}

      {/* ── Navigation ── */}
      <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          style={{
            padding: '12px 22px', borderRadius: 12,
            border: `1px solid ${tc.backBtn}`,
            background: 'transparent',
            color: step === 0 ? tc.backDisabled : tc.backColor,
            cursor: step === 0 ? 'not-allowed' : 'pointer',
            fontSize: 14, fontFamily: "'IBM Plex Sans', sans-serif",
            transition: 'all 0.2s',
          }}>
          ← {hi ? 'वापस' : 'Back'}
        </button>

        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            style={{
              flex: 1, padding: '12px 28px', borderRadius: 12, border: 'none',
              background: tc.gold, color: '#0a0a0f',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              fontFamily: "'IBM Plex Sans', sans-serif", transition: 'opacity 0.2s',
            }}>
            {hi ? 'आगे →' : 'Next →'}
          </button>
        ) : (
          <button
            onClick={() => onSubmit(profile)}
            disabled={loading}
            style={{
              flex: 1, padding: '12px 28px', borderRadius: 12, border: 'none',
              background: loading ? `${tc.gold}70` : tc.gold,
              color: '#0a0a0f', fontWeight: 700, fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'IBM Plex Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'opacity 0.2s',
            }}>
            {loading ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                {hi ? 'योजनाएं खोज रहे हैं... (15 सेकंड)' : 'Finding Schemes... (15 sec)'}
              </>
            ) : (
              hi ? '🔍 मेरी योजनाएं खोजें' : '🔍 Find My Schemes'
            )}
          </button>
        )}
      </div>
    </div>
  );
};
