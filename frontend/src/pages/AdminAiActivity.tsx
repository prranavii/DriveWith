import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export const AdminAiActivity: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { agentLogs } = useAppStore();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/agent-logs');
      const apiLogs = res.data.logs || [];
      // Combine store logs with API logs
      setLogs([...agentLogs, ...apiLogs]);
    } catch (err) {
      setLogs(agentLogs);
    } finally {
      setLoading(false);
    }
  };

  const sampleDemoActivity = [
    { time: '10:42:15', agent: 'Concierge Agent', action: 'EXTRACTED_BOOKING_INTENT', result: 'Pickup: Sector 62 Noida | Destination: Cyber City Gurgaon | Vehicle: Automatic Sedan' },
    { time: '10:42:17', agent: 'Matching Agent', action: 'QUERY_DETERMINISTIC_ENGINE', result: 'Found 5 compatible candidates (Top match: Rajesh Kumar, 94.8% score)' },
    { time: '10:42:18', agent: 'Matching Agent', action: 'EXPLAINED_RECOMMENDATION', result: '2.1 km away | 98.4% on-time | Certified Automatic SUV & Sedan driver' },
    { time: '10:42:20', agent: 'Booking Engine', action: 'CREATE_BOOKING_SUCCESS', result: 'Booking #b-94812 created | OTP generated: 1234' },
    { time: '10:58:32', agent: 'Driver Dispatch', action: 'DRIVER_CANCELLATION_DETECTED', result: 'Driver #104 cancelled booking due to vehicle emergency' },
    { time: '10:58:33', agent: 'Resolution Agent', action: 'ACTIVATED_AUTONOMOUS_REBOOKING', result: 'Initiating 5 km radius candidate search for automatic sedan driver' },
    { time: '10:58:36', agent: 'Resolution Agent', action: 'REPLACEMENT_DRIVER_SELECTED', result: 'Selected Vinod Saxena (99.0% on-time rate, 5.2 mins ETA)' },
    { time: '10:58:39', agent: 'Notification Tool', action: 'CUSTOMER_REBOOKING_NOTIFIED', result: 'SMS & Push Notification sent to customer with zero price change' },
    { time: '11:15:02', agent: 'Safety Agent', action: 'MONITORED_ROUTE_TELEMETRY', result: 'Vehicle speed: 42 km/h | Route deviation: 12m | Status: NORMAL' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">/admin/ai-activity</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 rounded">
                Live Agentic Activity Feed
              </span>
            </div>
            <p className="text-xs text-slate-500">Auditable state transitions, tool invocations, and agent decision factors</p>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Terminal View */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm font-mono text-xs space-y-3">
        
        <div className="flex items-center gap-2 text-slate-500 border-b border-slate-100 pb-2 text-[11px]">
          <Terminal className="w-4 h-4 text-slate-900" />
          <span>DRIVEWITH MULTI-AGENT STATE TRANSITION AUDIT LOG STREAM</span>
        </div>

        <div className="space-y-3 pt-2">
          {sampleDemoActivity.map((log, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition">
              <div className="flex items-center gap-3">
                <span className="text-slate-900 font-extrabold tracking-wider">{log.time}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                  {log.agent}
                </span>
                <span className="text-slate-400">→</span>
                <span className="text-emerald-700 font-bold">{log.action}</span>
              </div>
              <div className="text-slate-700 text-[11px] mt-1 sm:mt-0 font-sans font-medium">
                {log.result}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
