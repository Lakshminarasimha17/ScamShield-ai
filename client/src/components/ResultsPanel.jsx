import { useLanguage } from '../context/LanguageContext';
import WarningSignsList from './WarningSignsList';

const RISK_COLORS = {
  high: { bg: 'from-red-500/20 to-red-900/10', border: 'border-red-500/30', bar: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500/20' },
  medium: { bg: 'from-amber-500/20 to-amber-900/10', border: 'border-amber-500/30', bar: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  low: { bg: 'from-emerald-500/20 to-emerald-900/10', border: 'border-emerald-500/30', bar: 'bg-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
};

export default function ResultsPanel({ result }) {
  const { t } = useLanguage();

  if (!result) return null;

  const level = result.risk_level || 'low';
  const colors = RISK_COLORS[level] || RISK_COLORS.low;

  return (
    <section className="glass-card overflow-hidden" aria-label={t.resultsTitle}>
      {/* Risk Header */}
      <div className={`p-6 sm:p-8 bg-gradient-to-r ${colors.bg} border-b ${colors.border}`}>
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          {t.resultsTitle}
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Risk Level Badge */}
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">{t.riskLevel}</div>
            <span className={`risk-badge ${level === 'high' ? 'risk-high' : level === 'medium' ? 'risk-medium' : 'risk-low'} text-lg px-5 py-2`}>
              {t.riskLabels[level]}
            </span>
          </div>

          {/* Risk Score */}
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">{t.riskScore}</span>
              <span className={`font-bold text-lg ${colors.text}`}>{result.risk_score}/100</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${colors.bar} rounded-full transition-all duration-1000 ease-out shadow-lg ${colors.glow}`}
                style={{ width: `${result.risk_score}%` }}
                role="progressbar"
                aria-valuenow={result.risk_score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${t.riskScore}: ${result.risk_score} out of 100`}
              />
            </div>
          </div>
        </div>

        {/* Analysis Method */}
        {result.analysis_method && (
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span>🔧</span>
            <span>{t.analysisMethod}: </span>
            <span className="text-slate-300 font-medium">
              {result.analysis_method === 'gemini_ai' ? t.methodAI : t.methodFallback}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Warning Signs */}
        <WarningSignsList signs={result.warning_signs} />

        {/* Explanation */}
        {result.explanation && (
          <div>
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span>🧠</span> {t.explanationTitle}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
              {result.explanation}
            </p>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div>
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span>✅</span> {t.recommendationsTitle}
            </h3>
            <ol className="space-y-2" role="list">
              {result.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10"
                >
                  <span className="bg-blue-600/30 text-blue-300 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-slate-300 text-sm">{rec}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Disclaimer */}
        {result.disclaimer && (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <p className="text-xs text-slate-500 flex items-start gap-2">
              <span className="shrink-0">ℹ️</span>
              <span><strong className="text-slate-400">{t.disclaimer}:</strong> {result.disclaimer}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

