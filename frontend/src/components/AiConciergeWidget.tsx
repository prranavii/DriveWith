import React, { useState } from 'react';
import { Bot, Send, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { aiApi } from '../api/client';
import { useAppStore } from '../store/useAppStore';

interface AiConciergeWidgetProps {
  onBookingCreated: (booking: any) => void;
  onOpenPassport: (driver: any) => void;
}

export const AiConciergeWidget: React.FC<AiConciergeWidgetProps> = ({ onBookingCreated, onOpenPassport }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { addAgentLog } = useAppStore();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await aiApi.post('/concierge', { message: prompt });
      const data = res.data;
      setResult(data);

      addAgentLog({
        id: `log-${Date.now()}`,
        agent_name: 'Concierge Agent',
        action_name: 'PARSE_INTENT',
        details: data.extractedIntent,
        created_at: new Date().toISOString(),
      });

      if (data.bookingCreated && data.booking) {
        onBookingCreated(data.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Book a driver tomorrow at 9 AM for my automatic Honda City from Noida to Gurgaon.",
    "Need an emergency driver right now for a family medical appointment in Delhi.",
    "Schedule a Safe Return driver tonight at 11:30 PM from Sector 18 Noida to my home.",
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6 text-slate-900">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900">AI Concierge Agent</h3>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 rounded">
              LangGraph Orchestrator
            </span>
          </div>
          <p className="text-xs text-slate-500">Describe your trip naturally. The AI agent extracts parameters and books compatible drivers.</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="space-y-3">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 'I need a driver tomorrow at 9 AM for my automatic Honda City from Noida to Gurgaon...'"
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none shadow-xs"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="absolute right-3 bottom-3 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{loading ? 'Orchestrating...' : 'Book via AI'}</span>
          </button>
        </div>

        {/* Quick Sample Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-500 font-medium">Try asking:</span>
          {samplePrompts.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(s)}
              className="text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 transition"
            >
              "{s.slice(0, 38)}..."
            </button>
          ))}
        </div>
      </form>

      {/* AI Agent Output Result */}
      {result && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 animate-fadeIn">
          
          <div className="flex items-start gap-2 text-xs text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-semibold">{result.summaryMessage}</p>
          </div>

          {/* Selected Driver Recommendation */}
          {result.selectedDriver && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Recommended Match</span>
                  <h4 className="text-sm font-extrabold text-slate-900">{result.selectedDriver.name}</h4>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-slate-900">{result.selectedDriver.compatibilityScore}%</span>
                  <p className="text-[10px] text-slate-500">Match Score</p>
                </div>
              </div>

              {/* Factual Decision Breakdown */}
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-700">Why this driver?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {result.selectedDriver.reasons.map((r: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onOpenPassport(result.selectedDriver)}
                  className="text-xs text-slate-900 hover:underline font-bold flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>View Skill Passport</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
