import { useLanguage } from '../context/LanguageContext';

export default function WarningSignsList({ signs }) {
  const { t } = useLanguage();

  if (!signs || signs.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
        <span>⚠️</span> {t.warningSignsTitle}
      </h3>
      <ul className="space-y-2" role="list">
        {signs.map((sign, i) => (
          <li
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30"
          >
            <span className="text-amber-400 mt-0.5 shrink-0">●</span>
            <span className="text-slate-300 text-sm">{sign}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

