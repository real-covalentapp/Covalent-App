
import React, { useState, useEffect } from 'react';
import { QuestionnaireData } from '../types';
import { db } from '../db';

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<QuestionnaireData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await db.getAllSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError("Failed to reach Global Registry. Check internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const selected = submissions.find(s => s.id === selectedId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-rose-950">Global Cohort Registry</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-slate-500 text-sm">Reviewing {submissions.length} applicants across all devices</p>
            {isLoading && (
              <span className="inline-flex items-center gap-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest animate-pulse">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> Syncing Cloud...
              </span>
            )}
            {error && <span className="text-[10px] font-bold text-red-500 uppercase">{error}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadSubmissions}
            className="px-6 py-2.5 bg-white border border-rose-200 text-rose-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-50 transition-all"
          >
            Sync Data
          </button>
          <button 
            onClick={() => db.clearAll().then(loadSubmissions)}
            className="px-6 py-2.5 bg-rose-50 text-rose-300 rounded-xl text-xs font-bold uppercase tracking-widest hover:text-rose-600 transition-all"
          >
            Clear Registry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* List Panel */}
        <div className="lg:col-span-4 space-y-3 max-h-[75vh] overflow-y-auto pr-3 custom-scrollbar">
          {submissions.length === 0 && !isLoading && (
            <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-rose-100 text-rose-200 italic">
              Registry is empty.
            </div>
          )}
          {submissions.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedId(sub.id)}
              className={`w-full text-left p-6 rounded-[2rem] border transition-all ${
                selectedId === sub.id 
                ? 'bg-rose-950 border-rose-950 text-white shadow-xl translate-x-2' 
                : 'bg-white border-rose-50 hover:border-rose-200 text-slate-900'
              }`}
            >
              <div className="font-serif font-bold text-lg truncate">{sub.fullName}</div>
              <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedId === sub.id ? 'text-rose-400' : 'text-rose-600'}`}>
                {sub.major} • {sub.gradYear}
              </div>
              <div className={`text-[10px] mt-4 opacity-50 font-medium ${selectedId === sub.id ? 'text-rose-100' : 'text-slate-400'}`}>
                {new Date(sub.submittedAt).toLocaleTimeString()} — {new Date(sub.submittedAt).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-8">
          {selected ? (
            <div className="bg-white border border-rose-50 rounded-[3rem] p-10 md:p-14 shadow-sm animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-12 pb-8 border-b border-rose-50">
                <div className="space-y-2">
                  <h2 className="text-5xl font-serif font-bold text-rose-950 leading-tight">{selected.fullName}</h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <span className="text-rose-600 font-semibold">{selected.email}</span>
                    <span className="text-slate-400 font-medium uppercase tracking-tighter text-sm">
                      {selected.age} yrs • {selected.gender} • Seeking {selected.interestedIn.join('/')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-4 py-1.5 bg-rose-50 text-rose-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Cohort {selected.gradYear}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-2">Field of Study</h3>
                    <p className="text-lg font-serif italic text-slate-800">{selected.major}</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-2">Ambition Level</h3>
                    <div className="flex flex-wrap gap-2">
                      {selected.exceptionalTraits.map(t => (
                        <span key={t} className="px-3 py-1 bg-rose-50 text-rose-800 rounded-lg text-[10px] font-bold border border-rose-100">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-2">Professional Path</h3>
                    <p className="font-bold text-slate-700 uppercase tracking-wide text-sm">
                      {selected.careerDirection} {selected.careerOther ? `(${selected.careerOther})` : ''}
                    </p>
                  </div>
                  {selected.linkedinHandle && (
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-2">Connect</h3>
                      <p className="text-blue-500 font-bold text-sm">in/{selected.linkedinHandle}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8 bg-rose-50/20 p-8 rounded-[2.5rem] border border-rose-50">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-3">Goal Alignment</h3>
                  <p className="text-slate-700 italic leading-relaxed">"{selected.lookingFor}"</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-3">Ideal Intellectual Match</h3>
                  <p className="text-slate-700 italic leading-relaxed">"{selected.idealPartner}"</p>
                </div>
                {selected.ambitionContext && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-3">Notable Output</h3>
                    <p className="text-slate-700 leading-relaxed font-medium">"{selected.ambitionContext}"</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex items-center justify-center bg-rose-50/10 border-2 border-dashed border-rose-100 rounded-[3rem] p-12 text-center text-rose-200">
              <div className="max-w-xs">
                <div className="text-7xl mb-6 grayscale opacity-20">🕊️</div>
                <h3 className="font-serif italic text-2xl mb-2">Select a Credential</h3>
                <p className="text-sm opacity-60">Review applicants to form a covalent bond.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
