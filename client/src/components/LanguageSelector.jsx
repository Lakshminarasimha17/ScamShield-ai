import { useLanguage } from '../context/LanguageContext';

const LANGS = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'हि', full: 'हिंदी' },
  { code: 'te', label: 'తె', full: 'తెలుగు' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-800/60 rounded-xl p-1" role="radiogroup" aria-label="Language selector">
      {LANGS.map(({ code, label, full }) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          role="radio"
          aria-checked={language === code}
          aria-label={full}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            language === code
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

