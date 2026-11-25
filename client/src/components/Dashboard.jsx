import { useLanguage } from '../context/LanguageContext';

const ICONS = ['🔬', '🌐', '⚡', '🔒'];

export default function Dashboard({ scanCount, threatCount }) {
  const { t } = useLanguage();

  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          {t.tagline}
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
          {t.heroTitle}
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {t.heroDescription}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
        {[
          { label: t.statsScanned, value: scanCount, color: 'text-blue-400' },
          { label: t.statsThreats, value: threatCount, color: 'text-red-400' },
          { label: t.statsLanguages, value: 3, color: 'text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {t.features.map((feature, i) => (
          <div key={i} className="glass-card p-5 hover:border-blue-500/30 transition-colors group">
            <div className="text-2xl mb-3">{ICONS[i]}</div>
            <h3 className="font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

