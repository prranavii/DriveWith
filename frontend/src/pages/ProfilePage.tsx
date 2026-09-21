import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Car, MapPin, Plus, Trash2, CheckCircle2, Shield } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAppStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [successMsg, setSuccessMsg] = useState('');

  // Vehicle state
  const [vehicles, setVehicles] = useState(user?.vehicles || [
    { id: 'v1', make: 'Honda', model: 'City VX', transmission: 'AUTOMATIC' as const, licensePlate: 'UP16 AB 1234' },
    { id: 'v2', make: 'Maruti', model: 'Swift ZXi', transmission: 'MANUAL' as const, licensePlate: 'DL01 XY 9876' },
  ]);

  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newTrans, setNewTrans] = useState<'AUTOMATIC' | 'MANUAL'>('AUTOMATIC');
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone, vehicles });
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMake || !newModel || !newPlate) return;

    const added = {
      id: `v-${Date.now()}`,
      make: newMake,
      model: newModel,
      transmission: newTrans,
      licensePlate: newPlate,
    };

    const updated = [...vehicles, added];
    setVehicles(updated);
    updateProfile({ vehicles: updated });
    setNewMake(''); setNewModel(''); setNewPlate('');
    setShowAddVehicle(false);
  };

  const handleDeleteVehicle = (id: string) => {
    const updated = vehicles.filter(v => v.id !== id);
    setVehicles(updated);
    updateProfile({ vehicles: updated });
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
            <h1 className="text-2xl font-black text-black">User Profile & Vehicles</h1>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">Manage your personal details, cars, and saved preferences</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-rose-600 border border-neutral-200 text-xs font-bold rounded-xl transition"
        >
          Log Out
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-neutral-900 text-white text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Personal Info Form */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-base font-black text-black border-b border-neutral-100 pb-3">Personal Details</h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-50 border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-neutral-50 border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Save Personal Details
          </button>
        </form>
      </div>

      {/* Saved Personal Vehicles Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-base font-black text-black">Saved Vehicles</h2>
            <p className="text-xs text-neutral-500">Save your personal cars for fast driver bookings</p>
          </div>
          <button
            onClick={() => setShowAddVehicle(!showAddVehicle)}
            className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Add Vehicle Form */}
        {showAddVehicle && (
          <form onSubmit={handleAddVehicle} className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl space-y-3 animate-fadeIn">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">New Vehicle</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                placeholder="Make (e.g. Honda)"
                required
                value={newMake}
                onChange={(e) => setNewMake(e.target.value)}
                className="bg-white border border-neutral-300 p-2 rounded-xl focus:outline-none text-xs"
              />
              <input
                type="text"
                placeholder="Model (e.g. City)"
                required
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="bg-white border border-neutral-300 p-2 rounded-xl focus:outline-none text-xs"
              />
              <input
                type="text"
                placeholder="License Plate"
                required
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value)}
                className="bg-white border border-neutral-300 p-2 rounded-xl focus:outline-none text-xs"
              />
              <select
                value={newTrans}
                onChange={(e: any) => setNewTrans(e.target.value)}
                className="bg-white border border-neutral-300 p-2 rounded-xl focus:outline-none text-xs font-bold"
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl"
            >
              Save Vehicle
            </button>
          </form>
        )}

        {/* Vehicles List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-black">{v.make} {v.model}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-black border border-neutral-200">
                    {v.transmission}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-mono">{v.licensePlate}</p>
              </div>

              <button
                onClick={() => handleDeleteVehicle(v.id)}
                className="p-2 text-neutral-400 hover:text-rose-600 transition"
                title="Delete Vehicle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
