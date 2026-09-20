import React, { useState, useEffect } from 'react';
import { Power, UserCheck, ShieldCheck, DollarSign, Star, Navigation, Send, Bot, CheckCircle } from 'lucide-react';
import { api, aiApi } from '../api/client';
import { LiveTripTracker } from '../components/LiveTripTracker';

export const DriverDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [driver, setDriver] = useState<any>(null);
  const [incomingBooking, setIncomingBooking] = useState<any>(null);
  const [assistantCmd, setAssistantCmd] = useState('');
  const [assistantRes, setAssistantRes] = useState<any>(null);

  useEffect(() => {
    fetchDriverProfile();
    fetchPendingRequests();
  }, []);

  const fetchDriverProfile = async () => {
    try {
      const res = await api.get('/drivers/drv00000-0000-0000-0000-000000000001');
      setDriver(res.data.driver);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await api.get('/bookings');
      const list = res.data.bookings || [];
      const pending = list.find((b: any) => b.status === 'REQUESTED' || b.status === 'DRIVER_ASSIGNED');
      setIncomingBooking(pending || null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleOnline = async () => {
    try {
      const nextState = !isOnline;
      setIsOnline(nextState);
      await api.put('/drivers/availability', { isOnline: nextState });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptBooking = async () => {
    if (!incomingBooking) return;
    try {
      await api.post(`/bookings/${incomingBooking.id}/accept`);
      fetchPendingRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDriverAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantCmd.trim()) return;
    try {
      const res = await aiApi.post('/driver-assistant', {
        driverId: 'drv00000-0000-0000-0000-000000000001',
        command: assistantCmd,
      });
      setAssistantRes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Top Driver Header & Availability Toggle */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
            {driver?.name ? driver.name[0] : 'R'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{driver?.name || 'Rajesh Kumar'}</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 rounded uppercase">
                {driver?.skills?.badge || 'PLATINUM_PRO'}
              </span>
            </div>
            <p className="text-xs text-slate-500">License: {driver?.license_number || 'DL-1420201000'} • Verified Driver</p>
          </div>
        </div>

        {/* Online/Offline Toggle */}
        <button
          onClick={handleToggleOnline}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition shadow-sm ${
            isOnline
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnline ? 'ONLINE — READY FOR TRIPS' : 'OFFLINE'}</span>
        </button>
      </div>

      {/* Driver Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
          <div className="text-xl font-extrabold text-slate-900">₹14,850</div>
          <p className="text-xs text-slate-500 mt-1">This Week's Earnings</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
          <div className="text-xl font-extrabold text-amber-600 flex items-center justify-center gap-1">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>4.92</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Driver Score</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
          <div className="text-xl font-extrabold text-slate-900">98.4%</div>
          <p className="text-xs text-slate-500 mt-1">On-Time Percentage</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-xs">
          <div className="text-xl font-extrabold text-slate-900">142</div>
          <p className="text-xs text-slate-500 mt-1">Total Trips</p>
        </div>
      </div>

      {/* Active or Incoming Trip Request */}
      {incomingBooking && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-900 text-white uppercase">
              Incoming Trip Dispatch
            </span>
            <span className="text-xs text-slate-900 font-extrabold">Fare: ₹{incomingBooking.estimated_fare}</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900">Pickup: {incomingBooking.pickup_address}</h3>
            <p className="text-xs text-slate-500">Destination: {incomingBooking.destination_address}</p>
          </div>

          {incomingBooking.status === 'REQUESTED' || incomingBooking.status === 'DRIVER_ASSIGNED' ? (
            <button
              onClick={handleAcceptBooking}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition shadow-md"
            >
              Accept Trip & Start Navigation
            </button>
          ) : (
            <LiveTripTracker booking={incomingBooking} onRefresh={fetchPendingRequests} />
          )}
        </div>
      )}

      {/* Driver AI Assistant Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Driver AI Copilot Assistant</h3>
            <p className="text-xs text-slate-500">Speak or type operational updates (e.g. 'I am stuck in traffic')</p>
          </div>
        </div>

        <form onSubmit={handleDriverAssistant} className="flex gap-2">
          <input
            type="text"
            value={assistantCmd}
            onChange={(e) => setAssistantCmd(e.target.value)}
            placeholder="e.g. 'I am stuck in heavy traffic on NH-48...'"
            className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

        {assistantRes && (
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{assistantRes.intent}</span>
            </div>
            <p className="text-slate-700">{assistantRes.response}</p>
          </div>
        )}
      </div>

    </div>
  );
};
