import { useLanguage } from '../context/LanguageContext';

const SAMPLES = [
  {
    type: 'sms',
    label: '🏦 Bank Phishing SMS',
    message:
      'URGENT: Your bank account has been suspended due to suspicious activity. Click here immediately to verify your identity and restore access: http://bit.ly/3xFk9z2. If not done within 24 hours, your account will be permanently closed.',
  },
  {
    type: 'job_offer',
    label: '💼 Fake Job Offer',
    message:
      'Dear Candidate, Congratulations! You have been selected for a Data Entry position at Google. Work from home and earn $5000 per week. No experience required. To start immediately, pay a registration fee of $99 via Western Union to confirm your slot. Contact us on WhatsApp: +1-555-0123.',
  },
  {
    type: 'whatsapp',
    label: '🎁 Prize Scam',
    message:
      'Congratulations! You have won ₹50,00,000 in the WhatsApp Annual Lottery! To claim your prize, send your name, bank account number, and a copy of your ID card to our processing agent. Pay a small processing fee of ₹2,999 via Paytm to receive your winnings. This is 100% guaranteed!',
  },
  {
    type: 'email',
    label: '📧 Legitimate Newsletter',
    message:
      'Hi, Thanks for subscribing to our weekly tech newsletter. This week we cover the latest trends in AI and cybersecurity. Read the full article on our blog. If you no longer wish to receive these emails, click unsubscribe at the bottom. Best regards, TechDigest Team.',
  },
];

export default function SampleMessages({ onSelect }) {
  const { t } = useLanguage();

  return (
    <section className="glass-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span className="text-2xl">📝</span>
        {t.sampleTitle}
      </h2>
      <p className="text-sm text-slate-400 mb-5">{t.sampleDescription}</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {SAMPLES.map((sample, i) => (
          <button
            key={i}
            onClick={() => onSelect(sample.message, sample.type)}
            className="text-left p-4 rounded-xl bg-slate-800/40 border border-slate-700/30 
                       hover:border-blue-500/30 hover:bg-slate-800/60 transition-all duration-200 group"
            aria-label={`${t.tryThis}: ${sample.label}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-white group-hover:text-blue-300 transition-colors">
                {sample.label}
              </span>
              <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {t.tryThis} →
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">{sample.message}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

