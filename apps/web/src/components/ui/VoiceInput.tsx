import React, { useState, useRef } from 'react';

interface Props {
  onResult: (text: string) => void;
  language: 'en' | 'hi';
  theme: 'dark' | 'light';
}

// Extend window type for SpeechRecognition
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const VoiceInput: React.FC<Props> = ({ onResult, language, theme }) => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const dark = theme === 'dark';

  const gold = dark ? '#f5c842' : '#c47f0a';
  const bg   = dark ? 'rgba(245,200,66,0.1)' : 'rgba(196,127,10,0.08)';
  const border = dark ? 'rgba(245,200,66,0.25)' : 'rgba(196,127,10,0.2)';

  const start = () => {
    setError(null);
    if (!SpeechRecognition) {
      setError('Voice not supported in this browser. Use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      onResult(transcript);
      setListening(false);
    };

    recognition.onerror = (e: any) => {
      setError(`Error: ${e.error}`);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <button
        onClick={listening ? stop : start}
        title={listening ? 'Stop listening' : `Speak in ${language === 'hi' ? 'Hindi' : 'English'}`}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          border: `1.5px solid ${listening ? '#ef4444' : border}`,
          background: listening ? 'rgba(239,68,68,0.15)' : bg,
          color: listening ? '#ef4444' : gold,
          cursor: 'pointer', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
          animation: listening ? 'pulse-mic 1.2s infinite' : 'none',
          flexShrink: 0,
        }}>
        {listening ? '⏹' : '🎤'}
      </button>
      <style>{`
        @keyframes pulse-mic {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
      `}</style>
      {error && (
        <div style={{ fontSize: 10, color: '#f87171', maxWidth: 80, textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  );
};