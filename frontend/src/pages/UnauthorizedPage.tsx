import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center text-black">
      <div className="w-16 h-16 rounded-3xl bg-black text-white flex items-center justify-center mb-6 shadow-md">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight mb-2">Access Restricted</h1>
      <p className="text-xs sm:text-sm text-neutral-500 font-medium max-w-md mb-8 leading-relaxed">
        You do not have administrative or authorized permissions to view this section.
      </p>
      <Link
        to="/app"
        className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Application</span>
      </Link>
    </div>
  );
};
