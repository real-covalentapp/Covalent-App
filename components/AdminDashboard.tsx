
import React, { useState, useEffect } from 'react';
import { QuestionnaireData } from '../types';

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<QuestionnaireData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('covalent_submissions');
    if (saved) {
      setSubmissions(JSON.parse(saved));
    }
  }, []);

  const clearSubmissions = () => {
    if (window.confirm('Are you sure you want to delete all submissions? This cannot be undone.')) {
      localStorage.removeItem('covalent_submissions');
      setSubmissions([]);
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(submissions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `covalent_submissions_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const selected = submissions.find(s => s.id === selectedId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-rose-950">Cohort Submissions</h1>
          <p className="text-slate-500 mt-2">Manage and review potential covalent bonds ({submissions.length})</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportData}
            className="px-4 py-2 bg-white border border-rose-200 text-rose-700 rounded-lg text-sm font-semibold hover:bg-rose-50 transition-colors"
          >
            Export JSON
          </button>
          <button 
            onClick={clearSubmissions}
            className="px-4 py-2 bg-white border border-rose-100 text-rose-300 rounded-lg text-sm font-semibold hover:text-rose-600 hover:border-rose-200 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {submissions.length === 0 && (
            <div className="p-8 text-center bg-white border border-rose-50 rounded-3xl text-slate-400 italic">
              No submissions yet.
            </div>
          )}
          {submissions.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedId(sub.id)}
              className={`w-full text-left p-6 rounded-3xl border transition-all ${
                selectedId === sub.id 
                ? 'bg-rose-950 border-rose-950 text-white shadow-lg' 
                : 'bg-white border-rose-50 hover:border-rose-200 text-slate-900'
              }`}
            >
              <div className="font-bold truncate">{sub.fullName}</div>
              <div className={`text-xs mt-1 ${selectedId === sub.id ? 'text-rose-200' : 'text-slate-400'}`}>
                {sub.major} • {sub.gradYear}
              </div>
              <div className={`text-[10px] uppercase tracking-widest mt-3 font-bold ${selectedId === sub.id ? 'text-rose-400' : 'text-rose-600'}`}>
                {new Date(sub.submittedAt).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>

        {/* Details View */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white border border-rose-50 rounded-[2.5rem] p-8 md:p-12 shadow-sm animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start mb-10 pb-6 border-b border-rose-50">
                <div>
                  <h2 className="text-4xl font-serif font-bold text-rose-950">{selected.fullName}</h2>
                  <div className="flex flex-wrap gap-4">
                    <p className="text-rose-600 font-medium">{selected.email}</p>
                    {selected.instagramHandle && (
                      <p className="text-slate-400 font-medium">IG: @{selected.instagramHandle}</p>
                    )}
                    {selected.linkedinHandle && (
                      <p className="text-slate-400 font-medium">LI: in/{selected.linkedinHandle}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selected.age} yrs • {selected.gender}
                  </span>
                </div>
              </div>

              <div className="space-y-12 pb-10">
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Trajectory</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-rose-300 uppercase mb-1">Study</label>
                      <p className="font-semibold text-slate-800">{selected.major} ({selected.gradYear})</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-rose-300 uppercase mb-1">Path</label>
                      <p className="font-semibold text-slate-800 capitalize">
                        {selected.careerDirection === 'other' ? `Other: ${selected.careerOther}` : selected.careerDirection}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Ambition Signals</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selected.exceptionalTraits.map(t => (
                      <span key={t} className="px-3 py-1 bg-rose-50 text-rose-800 rounded-lg text-xs font-medium border border-rose-100">{t}</span>
                    ))}
                  </div>
                  {selected.ambitionContext && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-slate-600 text-sm leading-relaxed italic">"{selected.ambitionContext}"</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4">
                    {selected.resumeFileName && (
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Resume: {selected.resumeFileName}</p>
                    )}
                    {selected.instagramHandle && (
                      <p className="text-[10px] font-bold text-rose-400 uppercase">IG: @{selected.instagramHandle}</p>
                    )}
                    {selected.linkedinHandle && (
                      <p className="text-[10px] font-bold text-blue-400 uppercase">LI: in/{selected.linkedinHandle}</p>
                    )}
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Open Responses</h3>
                  <div className="space-y-4">
                    <div className="p-6 bg-rose-50/30 rounded-2xl">
                      <label className="block text-[10px] font-bold text-rose-400 uppercase mb-2">The Goal</label>
                      <p className="text-slate-700 leading-relaxed italic">"{selected.lookingFor}"</p>
                    </div>
                    <div className="p-6 bg-rose-50/30 rounded-2xl">
                      <label className="block text-[10px] font-bold text-rose-400 uppercase mb-2">The Ideal Partner</label>
                      <p className="text-slate-700 leading-relaxed italic">"{selected.idealPartner}"</p>
                    </div>
                    <div className="p-6 bg-rose-50/30 rounded-2xl">
                      <label className="block text-[10px] font-bold text-rose-400 uppercase mb-2">First Date Vision</label>
                      <p className="text-slate-700 leading-relaxed italic">"{selected.firstDate}"</p>
                    </div>
                    <div className="p-6 bg-rose-50/30 rounded-2xl">
                      <label className="block text-[10px] font-bold text-rose-400 uppercase mb-2">Life Context</label>
                      <p className="text-slate-700 leading-relaxed italic">"{selected.lifeContext}"</p>
                    </div>
                    <div className="p-6 bg-rose-50/30 rounded-2xl">
                      <label className="block text-[10px] font-bold text-rose-400 uppercase mb-2">Excited to Build</label>
                      <p className="text-slate-700 leading-relaxed italic">"{selected.excitedToBuild}"</p>
                    </div>
                    {selected.dealbreakers && (
                      <div className="p-6 bg-red-50/30 rounded-2xl border border-red-100">
                        <label className="block text-[10px] font-bold text-red-400 uppercase mb-2">Dealbreakers</label>
                        <p className="text-slate-700 leading-relaxed italic">"{selected.dealbreakers}"</p>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Values & Intent</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-rose-50 rounded-xl">
                      <label className="block text-[10px] font-bold text-rose-300 uppercase mb-1">Culture Imp.</label>
                      <p className="text-sm font-semibold">{selected.culturalImportance || 'Not specified'}</p>
                    </div>
                    <div className="p-4 border border-rose-50 rounded-xl">
                      <label className="block text-[10px] font-bold text-rose-300 uppercase mb-1">Religious Imp.</label>
                      <p className="text-sm font-semibold">{selected.religiousImportance || 'Not specified'}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-rose-50/20 border-2 border-dashed border-rose-100 rounded-[2.5rem] p-12 text-center text-rose-200">
              <div>
                <div className="text-6xl mb-4">🔍</div>
                <p className="font-serif italic text-xl">Select an applicant to review their credentials.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
