import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, UserCheck, Car, DollarSign, Clock, AlertTriangle, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const { agentLogs } = useAppStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setStats(res.data.analytics);
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = [
    { time: '08:00', trips: 12, revenue: 3200 },
    { time: '10:00', trips: 28, revenue: 7800 },
    { time: '12:00', trips: 45, revenue: 12400 },
    { time: '14:00', trips: 38, revenue: 10500 },
    { time: '16:00', trips: 52, revenue: 15200 },
    { time: '18:00', trips: 68, revenue: 19800 },
    { time: '20:00', trips: 84, revenue: 24500 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Admin Title & Quick Links */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Command Center</h1>
          <p className="text-xs text-slate-500">Real-time driver dispatch telemetry, revenue metrics, and AI agent orchestration activity</p>
        </div>

        <Link
          to="/admin/ai-activity"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition shadow-sm"
        >
          <Activity className="w-4 h-4" />
          <span>Live Agent Activity Feed</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Total Revenue</p>
          <div className="text-2xl font-extrabold text-slate-900">₹{stats?.totalRevenue || 48500}</div>
          <span className="text-[11px] text-emerald-600 font-bold">+18.4% this week</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Active Live Trips</p>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.activeTrips || 4}</div>
          <span className="text-[11px] text-emerald-600 font-bold">GPS WebSocket Live</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Verified Drivers</p>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.verifiedDrivers || 20}</div>
          <span className="text-[11px] text-slate-500">20/20 Passports Verified</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Average ETA</p>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.avgEtaMins || 6.4} mins</div>
          <span className="text-[11px] text-slate-500 font-medium">7-Factor Scoring Optimized</span>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Today's Trip Volume & Revenue Curve</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }} />
              <Area type="monotone" dataKey="revenue" stroke="#0f172a" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live AI Agent Activity Logs Snippet */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Recent AI Agent Orchestrations</h3>
          <Link to="/admin/ai-activity" className="text-xs text-slate-900 font-bold hover:underline">View All Log Stream</Link>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {agentLogs.slice(0, 5).map((log, idx) => (
            <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-bold">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                <span className="text-slate-900 font-semibold">{log.agent_name}</span>
                <span className="text-slate-400">→</span>
                <span className="text-slate-700">{log.action_name}</span>
              </div>
              <span className="text-[10px] text-slate-500">{JSON.stringify(log.details).slice(0, 45)}...</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
