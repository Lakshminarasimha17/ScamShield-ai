import { useLanguage } from '../context/LanguageContext';

export default function ScanHistory({ history, onClear }) {
  const { t } = useLanguage();

  if (!history || history.length === 0) {
    return (
      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          {t.historyTitle}
        </h2>
        <p className="text-slate-500 text-sm text-center py-8">{t.noHistory}</p>
      </section>
    );
  }

  return (
    <section className="glass-card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">📋</span>
          {t.historyTitle}
        </h2>
        <button
          onClick={onClear}
          className="text-sm text-slate-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
          aria-label={t.clearHistory}
        >
          {t.clearHistory}
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {history.map((item, i) => {
          const level = item.risk_level || 'low';
          return (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/40 transition-colors"
            >
              <span
                className={`risk-badge ${
                  level === 'high' ? 'risk-high' : level === 'medium' ? 'risk-medium' : 'risk-low'
                }`}
              >
                {t.riskLabels[level]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate">{item.message}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(item.timestamp).toLocaleString()} • {t.riskScore}: {item.risk_score}/100
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

