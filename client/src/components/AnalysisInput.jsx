import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from './LoadingSpinner';

const MESSAGE_TYPES = ['sms', 'email', 'whatsapp', 'job_offer', 'other'];

export default function AnalysisInput({ onAnalyze, isLoading, sampleFill }) {
  const { t, language } = useLanguage();
  const [message, setMessage] = useState('');
  const [type, setType] = useState('other');

  useEffect(() => {
    if (sampleFill) {
      setMessage(sampleFill.message);
      setType(sampleFill.type || 'other');
    }
  }, [sampleFill]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    onAnalyze(message.trim(), type, language);
  };

  const charCount = message.length;
  const isValid = charCount >= 5 && charCount <= 5000;

  return (
    <section className="glass-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">🔍</span>
        {t.analyzeTitle}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Message type selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {t.messageType}
          </label>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.messageType}>
            {MESSAGE_TYPES.map((mt) => (
              <button
                key={mt}
                type="button"
                role="radio"
                aria-checked={type === mt}
                onClick={() => setType(mt)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  type === mt
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:border-slate-600/60 hover:text-slate-300'
                }`}
              >
                {t.types[mt]}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div>
          <label htmlFor="message-input" className="sr-only">
            {t.analyzeTitle}
          </label>
          <textarea
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.textareaPlaceholder}
            rows={6}
            maxLength={5000}
            className="input-field resize-y min-h-[120px]"
            disabled={isLoading}
            aria-describedby="char-count"
          />
          <div id="char-count" className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{charCount < 5 && charCount > 0 ? 'Minimum 5 characters' : ''}</span>
            <span className={charCount > 4800 ? 'text-amber-400' : ''}>{charCount}/5000</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              {t.analyzingBtn}
            </>
          ) : (
            <>
              <span>⚡</span>
              {t.analyzeBtn}
            </>
          )}
        </button>
      </form>
    </section>
  );
}
