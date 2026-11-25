import { useState, useCallback, useRef } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { analyzeMessage } from './utils/api';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AnalysisInput from './components/AnalysisInput';
import ResultsPanel from './components/ResultsPanel';
import ScanHistory from './components/ScanHistory';
import SampleMessages from './components/SampleMessages';

export default function App() {
  const { t } = useLanguage();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useLocalStorage('scamshield_history', []);
  const [sampleFill, setSampleFill] = useState(null);
  const resultsRef = useRef(null);

  const scanCount = history.length;
  const threatCount = history.filter((h) => h.risk_level === 'high' || h.risk_level === 'medium').length;

  const handleAnalyze = useCallback(async (message, type, language) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeMessage(message, type, language);
      setResult(data);

      // Save to history (keep last 50)
      const entry = {
        message: message.substring(0, 200),
        type,
        risk_level: data.risk_level,
        risk_score: data.risk_score,
        timestamp: new Date().toISOString(),
      };
      setHistory((prev) => [entry, ...prev].slice(0, 50));

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err.message || t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  }, [setHistory, t.errorGeneric]);

  const handleSampleSelect = useCallback((message, type) => {
    setSampleFill({ message, type, id: Date.now() });
    document.getElementById('message-input')?.focus();
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-navy-950 to-slate-950">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <Dashboard scanCount={scanCount} threatCount={threatCount} />

          <AnalysisInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            sampleFill={sampleFill}
          />

          {/* Error state */}
          {error && (
            <div className="glass-card p-5 border-red-500/30 bg-red-500/5" role="alert">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <span>❌</span> {error}
              </p>
            </div>
          )}

          {/* Results */}
          <div ref={resultsRef}>
            <ResultsPanel result={result} />
          </div>

          <SampleMessages onSelect={handleSampleSelect} />

          <ScanHistory history={history} onClear={handleClearHistory} />

          {/* Footer */}
          <footer className="text-center py-8 border-t border-slate-800/50">
            <p className="text-xs text-slate-500">{t.footer}</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
