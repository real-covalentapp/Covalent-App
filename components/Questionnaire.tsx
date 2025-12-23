import React, { useState, useRef, useEffect } from 'react';
import { QuestionnaireData, INITIAL_DATA, Importance, Gender } from '../types';
import { db } from '../db';

interface Props {
  onComplete: () => void;
}

const Questionnaire: React.FC<Props> = ({ onComplete }) => {
  const [data, setData] = useState<QuestionnaireData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncResult, setSyncResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const updateField = (field: keyof QuestionnaireData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: 'interestedIn' | 'exceptionalTraits', value: string) => {
    setData(prev => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  useEffect(() => {
    const required = [
      data.fullName, data.email, data.age, data.gender, 
      data.interestedIn.length > 0, data.major, data.gradYear,
      data.lookingFor, data.idealPartner,
      data.understandsOneMatch, data.willingToExplore
    ];
    const filledCount = required.filter(Boolean).length;
    setIsValid(filledCount === required.length);
    setProgress((filledCount / required.length) * 100);
  }, [data]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const finalData = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString()
    };
    
    const success = await db.saveSubmission(finalData);
    if (success) {
      setSyncResult('success');
      setTimeout(() => onComplete(), 1200);
    } else {
      setSyncResult('error');
      setTimeout(() => onComplete(), 2000);
    }
  };

  const ImportanceSelector = ({ label, field }: { label: string, field: keyof QuestionnaireData }) => (
    <div className="space-y-3">
      <label className="text-[11px] font-bold uppercase tracking-widest text-rose-400">{label}</label>
      <div className="flex flex-wrap gap-2">
        {['Not important', 'Somewhat important', 'Very important'].map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => updateField(field, opt)}
            className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
              data[field] === opt ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-105' : 'bg-white/50 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Progress Sidebar */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 items-center">
        <div className="h-48 w-1 bg-rose-100 dark:bg-rose-900 rounded-full relative overflow-hidden">
          <div className="absolute top-0 w-full bg-rose-600 transition-all duration-500" style={{ height: `${progress}%` }} />
        </div>
        <span className="text-[10px] font-bold text-rose-400 rotate-90 mt-8 uppercase tracking-widest whitespace-nowrap">
          {Math.round(progress)}% Complete
        </span>
      </div>

      <header className="mb-20 text-center">
        <h1 className="text-5xl font-serif font-bold text-rose-950 dark:text-rose-100 mb-4 italic">Cohort Application</h1>
        <p className="text-slate-500 dark:text-rose-300 max-w-lg mx-auto leading-relaxed">
          The following questions help our curators understand your trajectory and shared ambition.
        </p>
      </header>

      <div ref={formRef} className="space-y-24">
        {/* I. BASICS */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-rose-300 dark:text-rose-700 uppercase tracking-widest">01</span>
            <h2 className="text-2xl font-serif font-bold text-rose-900 dark:text-rose-200">Basics</h2>
            <div className="h-[1px] flex-grow bg-rose-100 dark:bg-rose-900/50" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Full Name</label>
              <input type="text" value={data.fullName} onChange={e => updateField('fullName', e.target.value)} className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100 shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Email</label>
              <input type="email" value={data.email} onChange={e => updateField('email', e.target.value)} className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100 shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Age</label>
              <input type="number" value={data.age} onChange={e => updateField('age', e.target.value)} className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100 shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Gender</label>
              <select value={data.gender} onChange={e => updateField('gender', e.target.value)} className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none appearance-none dark:text-rose-100">
                <option value="">Select</option>
                <option value="Man">Man</option>
                <option value="Woman">Woman</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-rose-300 block">Matching with</label>
            <div className="flex flex-wrap gap-3">
              {['Man', 'Woman', 'Non-binary'].map(g => (
                <button key={g} type="button" onClick={() => handleCheckboxChange('interestedIn', g)} className={`px-6 py-3 rounded-full border text-sm font-medium transition-all ${data.interestedIn.includes(g as Gender) ? 'bg-rose-950 dark:bg-rose-100 text-white dark:text-rose-950 border-rose-950 dark:border-rose-100 shadow-lg' : 'bg-white/70 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'}`}>{g}</button>
              ))}
            </div>
          </div>
        </section>

        {/* II. CULTURE & CONTEXT */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-rose-300 dark:text-rose-700 uppercase tracking-widest">02</span>
            <h2 className="text-2xl font-serif font-bold text-rose-900 dark:text-rose-200">Culture & Depth</h2>
            <div className="h-[1px] flex-grow bg-rose-100 dark:bg-rose-900/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Cultural Background</label>
              <input type="text" value={data.culturalBackground} onChange={e => updateField('culturalBackground', e.target.value)} className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100" />
              <ImportanceSelector label="Cultural Importance" field="culturalImportance" />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Religion / Spiritual Identity</label>
              <input type="text" value={data.religion} onChange={e => updateField('religion', e.target.value)} className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100" />
              <ImportanceSelector label="Religious Importance" field="religiousImportance" />
            </div>
          </div>
        </section>

        {/* III. EDUCATION & PATH */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-rose-300 dark:text-rose-700 uppercase tracking-widest">03</span>
            <h2 className="text-2xl font-serif font-bold text-rose-900 dark:text-rose-200">Education & Path</h2>
            <div className="h-[1px] flex-grow bg-rose-100 dark:bg-rose-900/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Major / Field of Study</label>
              <input type="text" value={data.major} onChange={e => updateField('major', e.target.value)} className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Graduation Year</label>
              <input type="text" value={data.gradYear} onChange={e => updateField('gradYear', e.target.value)} className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100" />
            </div>
          </div>
        </section>

        {/* IV. AMBITION SECTION */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-rose-300 dark:text-rose-700 uppercase tracking-widest">04</span>
            <h2 className="text-2xl font-serif font-bold text-rose-900 dark:text-rose-200">Ambition & Socials</h2>
            <div className="h-[1px] flex-grow bg-rose-100 dark:bg-rose-900/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Strong academic performance', 'Notable leadership experience', 'Research or technical output', 'Entrepreneurial track record'].map(trait => (
              <div key={trait} onClick={() => handleCheckboxChange('exceptionalTraits', trait)} className={`p-6 border rounded-[2rem] cursor-pointer transition-all flex items-center gap-4 ${data.exceptionalTraits.includes(trait) ? 'bg-rose-950 dark:bg-rose-100 text-white dark:text-rose-950 border-rose-950 dark:border-rose-100 shadow-md' : 'bg-white/70 dark:bg-rose-900/10 border-rose-50 dark:border-rose-900/30 text-rose-950 dark:text-rose-200'}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${data.exceptionalTraits.includes(trait) ? 'bg-rose-500 border-rose-500' : 'bg-rose-50 border-rose-100 dark:border-rose-800'}`}><div className={`w-2 h-2 rounded-full ${data.exceptionalTraits.includes(trait) ? 'bg-white' : 'transparent'}`} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest">{trait}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Instagram Handle</label>
              <input type="text" value={data.instagramHandle} onChange={e => updateField('instagramHandle', e.target.value)} placeholder="@handle" className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">LinkedIn Profile</label>
              <input type="text" value={data.linkedinHandle} onChange={e => updateField('linkedinHandle', e.target.value)} placeholder="linkedin.com/in/username" className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Resume Copy Paste (Major Accomplishments List)</label>
            <textarea value={data.resumeAccomplishments} onChange={e => updateField('resumeAccomplishments', e.target.value)} rows={5} placeholder="Paste your major accomplishments or academic CV highlights here..." className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100 shadow-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Hobbies</label>
            <textarea value={data.hobbies} onChange={e => updateField('hobbies', e.target.value)} rows={3} placeholder="What do you do for fun? Tell us about your intellectual or physical pursuits." className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100 shadow-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Tell us more about why you're an exceptional individual</label>
            <textarea value={data.ambitionContext} onChange={e => updateField('ambitionContext', e.target.value)} rows={4} placeholder="Describe your trajectory, what makes you different, and what you aim to achieve." className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100 shadow-sm" />
          </div>
        </section>

        {/* V. OPEN-ENDED & PHILOSOPHY */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-rose-300 dark:text-rose-700 uppercase tracking-widest">05</span>
            <h2 className="text-2xl font-serif font-bold text-rose-900 dark:text-rose-200">Shared Philosophy</h2>
            <div className="h-[1px] flex-grow bg-rose-100 dark:bg-rose-900/50" />
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-rose-950 dark:text-rose-200">What are you looking for right now?</label>
              <textarea rows={2} value={data.lookingFor} onChange={e => updateField('lookingFor', e.target.value)} className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100 shadow-sm" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-rose-950 dark:text-rose-200">Describe your ideal intellectual partner</label>
              <textarea rows={2} value={data.idealPartner} onChange={e => updateField('idealPartner', e.target.value)} className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100 shadow-sm" />
            </div>
          </div>
        </section>

        {/* VI. COMMITMENT */}
        <section className="bg-rose-950 dark:bg-black p-12 md:p-20 rounded-[4rem] text-rose-50 space-y-12 shadow-3xl border border-rose-900 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">💍</div>
          <div className="text-center relative z-10">
            <h2 className="text-4xl font-serif italic mb-4">Honor Code</h2>
            <p className="text-rose-200/60 text-sm max-w-sm mx-auto">We match for depth. Quality requires commitment.</p>
          </div>
          
          <div className="space-y-4 relative z-10">
             <div onClick={() => updateField('understandsOneMatch', !data.understandsOneMatch)} className={`p-8 border rounded-3xl cursor-pointer transition-all flex items-start gap-5 ${data.understandsOneMatch ? 'bg-white text-rose-950 border-white shadow-xl' : 'bg-rose-900/30 border-rose-800 hover:border-rose-600'}`}>
                <div className={`mt-1 w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center ${data.understandsOneMatch ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white'}`}>
                  {data.understandsOneMatch && <span className="text-[10px]">✓</span>}
                </div>
                <p className="text-sm font-bold leading-relaxed">I value quality over quantity and accept one intentional match per cycle.</p>
              </div>
              <div onClick={() => updateField('willingToExplore', !data.willingToExplore)} className={`p-8 border rounded-3xl cursor-pointer transition-all flex items-start gap-5 ${data.willingToExplore ? 'bg-white text-rose-950 border-white shadow-xl' : 'bg-rose-900/30 border-rose-800 hover:border-rose-600'}`}>
                <div className={`mt-1 w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center ${data.willingToExplore ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white'}`}>
                  {data.willingToExplore && <span className="text-[10px]">✓</span>}
                </div>
                <p className="text-sm font-bold leading-relaxed">I will actually explore the match I receive with focus and respect.</p>
              </div>
          </div>
          <button type="button" onClick={handleSubmit} disabled={!isValid || isSubmitting} className={`w-full py-7 rounded-3xl font-black uppercase tracking-widest transition-all relative z-10 ${isValid && !isSubmitting ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-2xl hover:scale-[1.02]' : 'bg-rose-900/50 text-rose-800 cursor-not-allowed'}`}>
            {isSubmitting ? 'Syncing to Registry...' : 
             syncResult === 'success' ? 'Application Received' :
             syncResult === 'error' ? 'Sync Issue (Check Network)' :
             isValid ? 'Submit Application' : 'Fill All Required Fields'}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Questionnaire;