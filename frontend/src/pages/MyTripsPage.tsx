import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Calendar, CheckCircle2, Car, User, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const MOCK_TRIPS = [
  {
    id: 'tr-9941',
    type: 'CAB',
    title: 'DriveWith Cab Transfer',
    route: 'Sector 62, Noida → IGI Airport T3, New Delhi',
    fare: 720,
    status: 'COMPLETED',
    date: '20 Sep 2026',
    time: '06:00 AM',
    driver: 'Rajesh Kumar',
    vehicle: 'DriveWith Fleet Sedan (Honda City)',
  },
  {
    id: 'tr-8820',
    type: 'DRIVER',
    title: 'Personal Driver for Honda City',
    route: 'Sector 62, Noida → DLF Cyber City, Gurgaon',
    fare: 630,
    status: 'COMPLETED',
    date: '18 Sep 2026',
    time: '09:30 AM',
    driver: 'Vikram Yadav',
    vehicle: 'Personal Vehicle (Honda City VX - UP16 AB 1234)',
  },
  {
    id: 'tr-7712',
    type: 'DRIVER',
    title: 'Outstation Personal Driver',
    route: 'Noida → Jaipur Highway',
    fare: 1450,
    status: 'COMPLETED',
    date: '12 Sep 2026',
    time: '05:00 AM',
    driver: 'Sunil Verma',
    vehicle: 'Personal Vehicle (Maruti Swift - DL01 XY 9876)',
  },
];

export const MyTripsPage: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'CABS' | 'DRIVERS'>('ALL');
  const navigate = useNavigate();

  const filteredTrips = MOCK_TRIPS.filter((t) => {
    if (filter === 'CABS') return t.type === 'CAB';
    if (filter === 'DRIVERS') return t.type === 'DRIVER';
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-black">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app')}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-black">My Trips History</h1>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">All your cab bookings and personal driver journeys</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200 font-bold text-xs">
          {(['ALL', 'CABS', 'DRIVERS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-xl transition ${
                filter === tab ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              {tab === 'ALL' ? 'All Trips' : tab === 'CABS' ? 'Cabs 🚕' : 'Drivers 👤'}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white border border-[#E5E7EB] hover:border-black rounded-3xl p-6 shadow-xs transition-all space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                  {trip.type === 'CAB' ? '🚕' : '👤'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-black">{trip.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {trip.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono">Trip ID: #{trip.id}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-black">₹{trip.fare}</span>
                <span className="inline-block ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-black border border-neutral-200">
                  {trip.status}
                </span>
              </div>
            </div>

            {/* Route & Driver Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase">Route & Schedule</p>
                <p className="font-bold text-black">{trip.route}</p>
                <p className="text-[11px] text-neutral-500">{trip.date} at {trip.time}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase">Driver & Vehicle</p>
                <p className="font-bold text-black">Driver: {trip.driver}</p>
                <p className="text-[11px] text-neutral-500">{trip.vehicle}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-100">
              <button
                onClick={() => navigate(trip.type === 'CAB' ? '/cab' : '/driver')}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rebook This Service</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
