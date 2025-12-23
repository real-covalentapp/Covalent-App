
import React, { useState, useEffect } from 'react';
import { QuestionnaireData } from '../types';
import { db } from '../db';

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<QuestionnaireData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const loadSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await db.getAllSubmissions();
      setSubmissions(data);
      setLastSynced(new Date());
    } catch (err) {
      setError("Sync issue. Displaying local data.");
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
          <h1 className="text-4xl font-serif font-bold text-rose-950 dark:text-rose-100">Global Cohort Registry</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-slate-500 dark:text-rose-400 text-sm">Reviewing {submissions.length} applicants</p>
            {isLoading && (
              <span className="inline-flex items-center gap-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest animate-pulse">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> Syncing...
              </span>
            )}
            {lastSynced && !isLoading && (
              <span className="text-[10px] text-rose-300 font-bold uppercase tracking-widest">
                Last Synced: {lastSynced.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={loadSubmissions} disabled={isLoading} className="px-6 py-2.5 bg-white dark:bg-rose-950 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-100 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-50 transition-all">
            {isLoading ? 'Syncing...' : 'Sync Registry'}
          </button>
          <button onClick={() => { if(confirm("Reset entire registry?")) db.clearAll().then(loadSubmissions) }} className="px-6 py-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-300 rounded-xl text-xs font-bold uppercase tracking-widest hover:text-rose-600 transition-all">
            Clear Registry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-3 max-h-[75vh] overflow-y-auto pr-3 custom-scrollbar">
          {submissions.length === 0 && !isLoading && <div className="p-12 text-center bg-white/40 dark:bg-rose-950/20 rounded-3xl border-2 border-dashed border-rose-100 text-rose-200">Registry is empty.</div>}
          {submissions.map((sub) => (
            <button key={sub.id} onClick={() => setSelectedId(sub.id)} className={`w-full text-left p-6 rounded-[2rem] border transition-all ${selectedId === sub.id ? 'bg-rose-950 dark:bg-rose-100 border-rose-950 dark:border-rose-100 text-white dark:text-rose-950 shadow-xl translate-x-2' : 'bg-white/70 dark:bg-rose-950/20 border-rose-50 dark:border-rose-900/30 text-slate-900 dark:text-rose-100'}`}>
              <div className="font-serif font-bold text-lg truncate">{sub.fullName}</div>
              <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedId === sub.id ? 'text-rose-400' : 'text-rose-600'}`}>{sub.major} • {sub.gradYear}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8">
          {selected ? (
            <div className="bg-white/80 dark:bg-black/60 backdrop-blur-sm border border-rose-50 dark:border-rose-900/30 rounded-[3rem] p-10 md:p-14 shadow-sm animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-12 pb-8 border-b border-rose-50 dark:border-rose-900/30">
                <div className="space-y-2">
                  <h2 className="text-5xl font-serif font-bold text-rose-950 dark:text-rose-100 leading-tight">{selected.fullName}</h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">{selected.email}</span>
                    <span className="text-slate-400 dark:text-rose-300 font-medium uppercase tracking-tighter">
                      {selected.age} yrs • {selected.gender} • Seeking {selected.interestedIn.join('/')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-2">Socials</h3>
                    <div className="space-y-1">
                      {selected.instagramHandle && <p className="text-sm font-bold text-rose-500">IG: {selected.instagramHandle}</p>}
                      {selected.linkedinHandle && <p className="text-sm font-bold text-blue-500">LI: {selected.linkedinHandle}</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-2">Identity Context</h3>
                    <div className="space-y-1 text-sm font-medium dark:text-rose-200">
                      {selected.culturalBackground && <p>Culture: {selected.culturalBackground}</p>}
                      {selected.religion && <p>Religion: {selected.religion}</p>}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-2">Resume / Education</h3>
                    <p className="text-sm font-bold text-slate-700 dark:text-rose-100">{selected.major} ({selected.gradYear})</p>
                    {selected.resumeFileName && <p className="text-xs text-rose-400 mt-1 italic">File: {selected.resumeFileName}</p>}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-2">Ambition</h3>
                    <div className="flex flex-wrap gap-2">
                      {selected.exceptionalTraits.map(t => <span key={t} className="px-2 py-1 bg-rose-50 dark:bg-rose-900/50 text-rose-800 dark:text-rose-100 rounded-lg text-[9px] font-bold border border-rose-100 dark:border-rose-900">{t}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 bg-rose-50/20 dark:bg-rose-950/10 p-8 rounded-[2.5rem] border border-rose-50 dark:border-rose-900/20">
                {[
                  { label: "Goals", val: selected.lookingFor },
                  { label: "Ideal Partner", val: selected.idealPartner },
                  { label: "Trajectory", val: selected.ambitionContext },
                  { label: "Dealbreakers", val: selected.dealbreakers }
                ].map(item => item.val && (
                  <div key={item.label}>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-2">{item.label}</h3>
                    <p className="text-slate-700 dark:text-rose-200 text-sm leading-relaxed italic">"{item.val}"</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex items-center justify-center bg-rose-50/10 dark:bg-rose-950/5 border-2 border-dashed border-rose-100 dark:border-rose-900/30 rounded-[3rem] p-12 text-center text-rose-200">
              <div className="max-w-xs"><div className="text-7xl mb-6 opacity-20">🕊️</div><h3 className="font-serif italic text-2xl mb-2 dark:text-rose-100/30">Select an Applicant</h3></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
