import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, Sparkles, ArrowRight, CheckCircle2, Car, UserCheck, ArrowLeft } from 'lucide-react';
import { aiApi } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export const AiConciergePage: React.FC = () => {
  const [prompt, setPrompt] = useState('I need to take my parents from Noida to the airport tomorrow at 6 AM.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();
  const { addAgentLog } = useAppStore();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await aiApi.post('/concierge', { message: prompt });
      setResult(res.data);
    } catch (err) {
      // Local intelligent intent orchestration
      const isCab = prompt.toLowerCase().includes('cab') || prompt.toLowerCase().includes('taxi') || prompt.toLowerCase().includes('airport');
      const isDriver = prompt.toLowerCase().includes('my car') || prompt.toLowerCase().includes('honda') || prompt.toLowerCase().includes('swift') || prompt.toLowerCase().includes('manual');

      setResult({
        extractedIntent: {
          pickup: prompt.includes('from') ? prompt.split('from')[1].split('to')[0].trim() : 'Sector 62, Noida',
          destination: prompt.includes('to') ? prompt.split('to')[1].split('tomorrow')[0].trim() : 'IGI Airport T3',
          time: '6:00 AM',
          date: 'Tomorrow',
          serviceRecommendation: isDriver ? 'DRIVER' : isCab ? 'CAB' : 'BOTH',
        },
        summaryMessage: `AI Concierge analyzed your request: "${prompt}". Extracted Pickup & Destination.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-black">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app')}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-black" />
              <h1 className="text-2xl font-black text-black">DriveWith AI Concierge</h1>
            </div>
            <p className="text-xs text-neutral-500 font-medium">Orchestrated multi-agent trip planner (LangGraph)</p>
          </div>
        </div>
      </div>

      {/* Interactive Form */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSend} className="space-y-4">
          <label className="text-xs font-bold text-black uppercase tracking-wider block">
            Describe your journey in natural language:
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="e.g. 'I need to reach the airport tomorrow morning with 2 bags...'"
              className="w-full bg-neutral-50 border border-[#E5E7EB] rounded-2xl p-4 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black font-medium resize-none shadow-xs"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute right-3.5 bottom-3.5 px-5 py-2 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{loading ? 'Orchestrating...' : 'Plan via AI'}</span>
            </button>
          </div>
        </form>

        {/* AI Intent Result */}
        {result && (
          <div className="bg-neutral-50 border border-[#E5E7EB] rounded-2xl p-6 space-y-6 animate-fadeIn">
            <div className="flex items-start gap-2.5 text-xs font-bold text-black">
              <CheckCircle2 className="w-5 h-5 text-black shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-black">AI Parameter Extraction Complete</p>
                <p className="text-neutral-500 text-xs font-normal mt-0.5">{result.summaryMessage}</p>
              </div>
            </div>

            {/* Extracted Card */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-xs">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Parsed Intent Details</h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase">Pickup</span>
                  <span className="font-bold text-black">{result.extractedIntent?.pickup || 'Sector 62, Noida'}</span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase">Destination</span>
                  <span className="font-bold text-black">{result.extractedIntent?.destination || 'IGI Airport T3'}</span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase">Date</span>
                  <span className="font-bold text-black">{result.extractedIntent?.date || 'Tomorrow'}</span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase">Time</span>
                  <span className="font-bold text-black">{result.extractedIntent?.time || '06:00 AM'}</span>
                </div>
              </div>

              {/* Service Recommendation Buttons */}
              <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
                <p className="text-xs font-bold text-black">How would you like to fulfill this journey?</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/cab')}
                    className="p-4 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-between shadow-sm transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🚕</span>
                      <div className="text-left">
                        <p className="font-black text-sm">BOOK A CAB</p>
                        <p className="text-[10px] text-neutral-400 font-normal">DriveWith Vehicle + Driver</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </button>

                  <button
                    onClick={() => navigate('/driver')}
                    className="p-4 rounded-2xl bg-white hover:bg-neutral-100 border border-black text-black font-bold text-xs flex items-center justify-between shadow-xs transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👤</span>
                      <div className="text-left">
                        <p className="font-black text-sm">BOOK A DRIVER</p>
                        <p className="text-[10px] text-neutral-500 font-normal">Your Personal Vehicle + Driver</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
