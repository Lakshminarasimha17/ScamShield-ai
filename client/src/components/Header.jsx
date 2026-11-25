import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
            🛡️
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t.appName}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">{t.tagline}</p>
          </div>
        </div>
        <LanguageSelector />
      </div>
    </header>
  );
}

