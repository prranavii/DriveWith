import React, { useState } from 'react';
import { HelpCircle, Send, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import { aiApi } from '../api/client';

interface RagPolicyModalProps {
  onClose: () => void;
}

export const RagPolicyModal: React.FC<RagPolicyModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const res = await aiApi.post('/rag/query', { query });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "What happens if my driver cancels?",
    "How is the fare calculated for night trips?",
    "What is the policy for vehicle damage inspection?",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">DriveWith RAG Knowledge Base</h3>
              <p className="text-xs text-slate-500">Ground-truth retrieval from 8 verified platform policy documents</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
            ✕
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask any policy question (e.g. 'What happens if my driver cancels?')"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-2 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : 'Retrieve Policy'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">Popular:</span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(q)}
                className="text-slate-600 hover:text-slate-900 underline"
              >
                "{q.slice(0, 32)}..."
              </button>
            ))}
          </div>
        </form>

        {/* Result */}
        {result && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Policy Answer</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
              {result.answer}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>Source Documents:</span>
              {result.retrievedDocs?.map((d: string, i: number) => (
                <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-700">
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
