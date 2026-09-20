import React, { useState } from 'react';
import { Camera, ShieldAlert, Sparkles, CheckCircle, FileText } from 'lucide-react';
import { aiApi } from '../api/client';

export const VehicleInspectionWidget: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const sampleAngles = ['Front Bumper', 'Rear Bumper', 'Left Side', 'Right Side', 'Dashboard', 'Odometer'];

  const handleRunInspection = async () => {
    setAnalyzing(true);
    try {
      const res = await aiApi.post('/inspection', {
        beforeImages: ['sample_front.jpg', 'sample_rear.jpg'],
        afterImages: ['sample_front_post.jpg', 'sample_rear_post.jpg'],
      });
      setReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Vehicle Inspection AI</h3>
            <p className="text-xs text-slate-500">OpenCV Pre/Post Trip Image Visual Difference Analysis</p>
          </div>
        </div>

        <button
          onClick={handleRunInspection}
          disabled={analyzing}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-xs"
        >
          {analyzing ? <Sparkles className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          <span>{analyzing ? 'Processing Vision Model...' : 'Run Vision Inspection'}</span>
        </button>
      </div>

      {/* 6 Photo Upload Slots */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {sampleAngles.map((angle, idx) => (
          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-2 hover:border-slate-300 transition">
            <div className="w-full h-16 rounded-lg bg-white flex items-center justify-center border border-slate-200 text-slate-400">
              <Camera className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-semibold text-slate-700">{angle}</p>
            <span className="text-[9px] text-emerald-600 font-mono">Uploaded ✓</span>
          </div>
        ))}
      </div>

      {/* Generated Report Output */}
      {report && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Inspection Report #{report.inspectionReportId}</h4>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              report.potentialDamageDetected ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {report.potentialDamageDetected ? 'POTENTIAL DIFFERENCE FLAG' : 'CLEAR — NO DIFFERENCE'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {report.findings.length > 0 ? (
              report.findings.map((f: any, i: number) => (
                <div key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{f.angle}: </span>
                    <span>{f.finding}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Zero visual differences detected between pre-trip and post-trip photographs.</span>
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-500 italic mt-2">{report.disclaimer}</p>
        </div>
      )}

    </div>
  );
};
