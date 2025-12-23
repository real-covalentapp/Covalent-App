
import React, { useState, useEffect } from 'react';
import { QuestionnaireData } from '../types';
import { db } from '../db';

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<QuestionnaireData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const data = await db.getAllSubmissions();
      setSubmissions(data);
      setLastSynced(new Date());
      setIsOnline(true);
    } catch (err) {
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    if (submissions.length === 0) return;
    const headers = [
      "ID", "Name", "Email", "Age", "Gender", "Interests", 
      "Culture", "Religion", "Politics", "Major", "GradYear",
      "Career", "LocCommit", "LocDetail", "Traits", "Instagram", "LinkedIn", "Resume", "Hobbies",
      "LookingFor", "IdealPartner", "BuildGoal", "Dealbreakers", "Trajectory"
    ];
    const rows = submissions.map(s => [
      s.id, s.fullName, s.email, s.age, s.gender, s.interestedIn.join('|'),
      s.culturalBackground, s.religion, s.politicalIdentity, s.major, s.gradYear,
      s.careerDirection, s.locationCommitted, s.locationDetail, s.exceptionalTraits.join('|'),
      s.instagramHandle, s.linkedinHandle, 
      `"${(s.resumeAccomplishments || '').replace(/"/g, '""')}"`,
      `"${(s.hobbies || '').replace(/"/g, '""')}"`,
      `"${(s.lookingFor || '').replace(/"/g, '""')}"`, 
      `"${(s.idealPartner || '').replace(/"/g, '""')}"`, 
      `"${(s.excitedToBuild || '').replace(/"/g, '""')}"`,
      `"${(s.dealbreakers || '').replace(/"/g, '""')}"`,
      `"${(s.ambitionContext || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `covalent_registry_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const selected = submissions.find(s => s.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-serif font-bold text-rose-950 dark:text-rose-100">Cohort Registry</h1>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${isOnline ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {isOnline ? 'Global Online' : 'Local Only'}
            </div>
          </div>
          <p className="text-slate-400 dark:text-rose-400/60 text-sm font-medium">
            Reviewing {submissions.length} candidates • Last synced {lastSynced?.toLocaleTimeString() || 'Never'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={loadSubmissions} disabled={isLoading} className="px-6 py-3 bg-white dark:bg-rose-950 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:shadow-lg transition-all">
            {isLoading ? 'Syncing...' : 'Refresh Registry'}
          </button>
          <button onClick={exportCSV} className="px-6 py-3 bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-rose-100 transition-all">
            Export to Google Sheets (CSV)
          </button>
          <button onClick={() => { if(confirm("Permanently clear registry?")) db.clearAll().then(loadSubmissions) }} className="px-6 py-3 bg-rose-900 text-rose-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest">
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4 space-y-4 max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
          {submissions.length === 0 && !isLoading && (
            <div className="p-16 text-center border-2 border-dashed border-rose-100 dark:border-rose-900 rounded-[3rem] text-rose-300 italic">No applicants found.</div>
          )}
          {submissions.map(sub => (
            <button key={sub.id} onClick={() => setSelectedId(sub.id)} className={`w-full text-left p-6 rounded-[2.5rem] border transition-all relative overflow-hidden group ${selectedId === sub.id ? 'bg-rose-950 dark:bg-rose-100 border-rose-950 dark:border-rose-100 text-white dark:text-rose-950 shadow-2xl scale-[1.02]' : 'bg-white/70 dark:bg-rose-950/20 border-rose-50 dark:border-rose-900/30 text-slate-900 dark:text-rose-100 hover:border-rose-200'}`}>
              <div className="font-serif font-bold text-xl mb-1">{sub.fullName}</div>
              <div className={`text-[10px] font-black uppercase tracking-widest ${selectedId === sub.id ? 'text-rose-400' : 'text-rose-500'}`}>
                {sub.major} • {sub.gradYear}
              </div>
              <div className={`absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-20 transition-opacity text-2xl`}>✨</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8">
          {selected ? (
            <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md border border-rose-50 dark:border-rose-900/30 rounded-[4rem] p-12 md:p-16 shadow-2xl animate-in zoom-in-95 duration-300 h-full overflow-y-auto max-h-[85vh] custom-scrollbar">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-rose-50 dark:border-rose-900/30 pb-12 mb-12">
                <div>
                  <h2 className="text-5xl font-serif font-bold text-rose-950 dark:text-rose-100 mb-2">{selected.fullName}</h2>
                  <p className="text-rose-600 dark:text-rose-400 font-black tracking-widest uppercase text-xs">{selected.email} • {selected.age} yrs • {selected.gender}</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                  <span className="text-xs font-bold text-slate-400">Match Preferences</span>
                  <div className="flex gap-2">
                    {selected.interestedIn.map(g => <span key={g} className="px-3 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-black uppercase">{g}</span>)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
                <section className="space-y-8">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4">Values & Context</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-end border-b border-rose-50 dark:border-rose-900/20 pb-2">
                        <span className="text-xs font-bold text-rose-800 dark:text-rose-300">Culture</span>
                        <span className="text-xs text-slate-500">{selected.culturalBackground} ({selected.culturalImportance})</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-rose-50 dark:border-rose-900/20 pb-2">
                        <span className="text-xs font-bold text-rose-800 dark:text-rose-300">Religion</span>
                        <span className="text-xs text-slate-500">{selected.religion} ({selected.religiousImportance})</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-rose-50 dark:border-rose-900/20 pb-2">
                        <span className="text-xs font-bold text-rose-800 dark:text-rose-300">Politics</span>
                        <span className="text-xs text-slate-500">{selected.politicalIdentity} ({selected.politicalImportance})</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4">Trajectory</h3>
                    <div className="space-y-3">
                      <p className="text-sm font-bold dark:text-rose-100">Moving to {selected.locationDetail || 'TBD'}</p>
                      <p className="text-xs text-slate-500 italic">Committed? {selected.locationCommitted}</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-8">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4">Ambition Signals</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selected.exceptionalTraits.map(t => <span key={t} className="px-3 py-1.5 bg-rose-950 dark:bg-rose-100 text-white dark:text-rose-950 rounded-xl text-[9px] font-bold uppercase tracking-widest">{t}</span>)}
                    </div>
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-rose-500">IG: {selected.instagramHandle || 'N/A'}</p>
                      <p className="font-bold text-blue-500">LI: {selected.linkedinHandle || 'N/A'}</p>
                      <p className="font-bold text-emerald-500">Hobbies: {selected.hobbies || 'N/A'}</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-10 bg-rose-50/20 dark:bg-rose-950/30 p-12 rounded-[3.5rem] border border-rose-100 dark:border-rose-900/20 shadow-inner">
                {[
                  { label: "The Build Goal", val: selected.excitedToBuild },
                  { label: "Ideal Partner", val: selected.idealPartner },
                  { label: "Accomplishments", val: selected.resumeAccomplishments },
                  { label: "Exceptional individual details", val: selected.ambitionContext },
                  { label: "Dealbreakers", val: selected.dealbreakers }
                ].map(item => item.val && (
                  <div key={item.label}>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-3">{item.label}</h4>
                    <p className="text-slate-800 dark:text-rose-100 text-lg font-serif italic leading-relaxed">"{item.val}"</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex items-center justify-center border-2 border-dashed border-rose-100 dark:border-rose-900 rounded-[4rem] text-center p-12 text-rose-200">
              <div className="max-w-xs space-y-4">
                <div className="text-6xl opacity-20">🕊️</div>
                <h3 className="text-2xl font-serif italic">Select an Applicant</h3>
                <p className="text-sm opacity-50">Review the global cohort registry to find the perfect covalent bond.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
