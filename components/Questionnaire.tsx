
import React, { useState, useRef, useEffect } from 'react';
import { QuestionnaireData, INITIAL_DATA, Importance, Gender } from '../types';
import { db } from '../db';

interface Props {
  onComplete: () => void;
}

const Questionnaire: React.FC<Props> = ({ onComplete }) => {
  const [data, setData] = useState<QuestionnaireData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
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

  // Calculate progress based on filled required fields
  useEffect(() => {
    const required = [
      data.fullName, data.email, data.age, data.gender, 
      data.interestedIn.length > 0, data.major, data.gradYear,
      data.careerDirection, data.lookingFor, data.idealPartner,
      data.understandsOneMatch, data.willingToExplore
    ];
    const filled = required.filter(Boolean).length;
    setProgress((filled / required.length) * 100);
  }, [data]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const finalData = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        submittedAt: new Date().toISOString()
      };
      await db.saveSubmission(finalData);
      onComplete();
    } catch (err) {
      alert("Connectivity issue. Your data is saved locally but couldn't sync to the cloud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = progress === 100;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Floating Progress Tracker */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 items-center">
        <div className="h-48 w-1 bg-rose-100 dark:bg-rose-900 rounded-full relative overflow-hidden">
          <div 
            className="absolute top-0 w-full bg-rose-600 transition-all duration-500"
            style={{ height: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-rose-400 rotate-90 mt-8 uppercase tracking-widest whitespace-nowrap">
          {Math.round(progress)}% Complete
        </span>
      </div>

      <header className="mb-20 text-center">
        <h1 className="text-5xl font-serif font-bold text-rose-950 dark:text-rose-100 mb-4 italic">The Cohort Application</h1>
        <p className="text-slate-500 dark:text-rose-300 max-w-lg mx-auto leading-relaxed">
          Please provide a high-fidelity signal of your trajectory. We hand-review every application for the upcoming match cycle.
        </p>
      </header>

      <div ref={formRef} className="space-y-24">
        {/* I. IDENTITY */}
        <section className="space-y-10 group">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-rose-300 dark:text-rose-700 uppercase tracking-widest">01</span>
            <h2 className="text-2xl font-serif font-bold text-rose-900 dark:text-rose-200">Identity & Contact</h2>
            <div className="h-[1px] flex-grow bg-rose-100 dark:bg-rose-900/50" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Full Name</label>
              <input 
                type="text"
                value={data.fullName}
                onChange={e => updateField('fullName', e.target.value)}
                className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all outline-none shadow-sm dark:text-rose-100"
                placeholder="Julian Thorne"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Institutional Email</label>
              <input 
                type="email"
                value={data.email}
                onChange={e => updateField('email', e.target.value)}
                className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all outline-none shadow-sm dark:text-rose-100"
                placeholder="name@university.edu"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Age</label>
              <input 
                type="number"
                value={data.age}
                onChange={e => updateField('age', e.target.value)}
                className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Gender</label>
              <select 
                value={data.gender}
                onChange={e => updateField('gender', e.target.value)}
                className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none appearance-none dark:text-rose-100"
              >
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
                <button
                  key={g}
                  onClick={() => handleCheckboxChange('interestedIn', g)}
                  className={`px-6 py-3 rounded-full border text-sm font-medium transition-all ${
                    data.interestedIn.includes(g as Gender) ? 'bg-rose-950 dark:bg-rose-100 text-white dark:text-rose-950 border-rose-950 dark:border-rose-100 shadow-lg' : 'bg-white/70 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* II. TRAJECTORY */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-rose-300 dark:text-rose-700 uppercase tracking-widest">02</span>
            <h2 className="text-2xl font-serif font-bold text-rose-900 dark:text-rose-200">Education & Trajectory</h2>
            <div className="h-[1px] flex-grow bg-rose-100 dark:bg-rose-900/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Primary Field of Study</label>
              <input 
                type="text"
                value={data.major}
                onChange={e => updateField('major', e.target.value)}
                placeholder="Theoretical Physics"
                className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Graduation Year</label>
              <input 
                type="text"
                value={data.gradYear}
                onChange={e => updateField('gradYear', e.target.value)}
                placeholder="2025"
                className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Intended Career Path</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Finance', 'Tech', 'Medicine', 'Law', 'Academia', 'Startup', 'Other'].map(path => (
                <button
                  key={path}
                  onClick={() => updateField('careerDirection', path.toLowerCase())}
                  className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                    data.careerDirection === path.toLowerCase() ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white/70 dark:bg-rose-900/10 text-rose-800 dark:text-rose-300 border-rose-100 dark:border-rose-900/30 hover:border-rose-300'
                  }`}
                >
                  {path}
                </button>
              ))}
            </div>
            {data.careerDirection === 'other' && (
              <input 
                type="text"
                value={data.careerOther}
                onChange={e => updateField('careerOther', e.target.value)}
                placeholder="Specify your field..."
                className="w-full px-5 py-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl outline-none animate-in fade-in slide-in-from-top-2 dark:text-rose-100"
              />
            )}
          </div>
        </section>

        {/* III. AMBITION */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-rose-300 dark:text-rose-700 uppercase tracking-widest">03</span>
            <h2 className="text-2xl font-serif font-bold text-rose-900 dark:text-rose-200">Ambition Signals</h2>
            <div className="h-[1px] flex-grow bg-rose-100 dark:bg-rose-900/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Strong academic performance',
              'Notable leadership experience',
              'Research or technical output',
              'Entrepreneurial track record'
            ].map(trait => (
              <div 
                key={trait}
                onClick={() => handleCheckboxChange('exceptionalTraits', trait)}
                className={`p-5 border rounded-[2rem] cursor-pointer transition-all flex items-center gap-4 ${
                  data.exceptionalTraits.includes(trait) ? 'bg-rose-950 dark:bg-rose-100 text-white dark:text-rose-950 border-rose-950 dark:border-rose-100 shadow-xl scale-[1.02]' : 'bg-white/70 dark:bg-rose-900/10 border-rose-50 dark:border-rose-900/30 text-rose-950 dark:text-rose-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${data.exceptionalTraits.includes(trait) ? 'bg-rose-500 border-rose-500' : 'bg-rose-50 dark:bg-rose-950 border-rose-100 dark:border-rose-800'}`}>
                  {data.exceptionalTraits.includes(trait) && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{trait}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">LinkedIn Profile (URL or handle)</label>
              <input 
                type="text"
                value={data.linkedinHandle}
                onChange={e => updateField('linkedinHandle', e.target.value)}
                className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none dark:text-rose-100"
                placeholder="in/yourprofile"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-rose-300">Trajectory Context</label>
              <p className="text-xs text-rose-400 dark:text-rose-500 mb-2">What is the most impressive thing you've built or achieved?</p>
              <textarea 
                rows={4}
                value={data.ambitionContext}
                onChange={e => updateField('ambitionContext', e.target.value)}
                className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none resize-none dark:text-rose-100"
              />
            </div>
          </div>
        </section>

        {/* IV. PHILOSOPHY */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-rose-300 dark:text-rose-700 uppercase tracking-widest">04</span>
            <h2 className="text-2xl font-serif font-bold text-rose-900 dark:text-rose-200">Values & Depth</h2>
            <div className="h-[1px] flex-grow bg-rose-100 dark:bg-rose-900/50" />
          </div>

          <div className="space-y-10">
            <div className="space-y-3">
              <label className="text-sm font-bold text-rose-950 dark:text-rose-200">What are you looking for right now?</label>
              <textarea 
                rows={3}
                value={data.lookingFor}
                onChange={e => updateField('lookingFor', e.target.value)}
                className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none shadow-inner dark:text-rose-100"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-rose-950 dark:text-rose-200">Describe your ideal intellectual partner</label>
              <textarea 
                rows={3}
                value={data.idealPartner}
                onChange={e => updateField('idealPartner', e.target.value)}
                className="w-full px-5 py-4 bg-white/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl outline-none shadow-inner dark:text-rose-100"
              />
            </div>
          </div>
        </section>

        {/* V. COMMITMENT */}
        <section className="bg-rose-950 dark:bg-black p-10 md:p-16 rounded-[3rem] text-rose-50 space-y-10 shadow-2xl shadow-rose-900/40 border border-rose-900 dark:border-rose-800">
          <div className="text-center">
            <h2 className="text-3xl font-serif italic mb-4">Covalent Honor Code</h2>
            <p className="text-rose-300/80 text-sm max-w-sm mx-auto">We scrap the swiping to give you intentionality. We ask for the same in return.</p>
          </div>

          <div className="space-y-4">
             <div 
                onClick={() => updateField('understandsOneMatch', !data.understandsOneMatch)}
                className={`p-6 border rounded-3xl cursor-pointer transition-all flex items-start gap-4 ${
                  data.understandsOneMatch ? 'bg-white text-rose-950 border-white' : 'bg-rose-900/30 border-rose-800'
                }`}
              >
                <div className={`mt-1 w-5 h-5 rounded-full border-2 shrink-0 ${data.understandsOneMatch ? 'bg-rose-600 border-rose-600' : 'bg-white'}`} />
                <p className="text-sm font-medium">I value quality over quantity and accept one intentional match per cycle.</p>
              </div>
              <div 
                onClick={() => updateField('willingToExplore', !data.willingToExplore)}
                className={`p-6 border rounded-3xl cursor-pointer transition-all flex items-start gap-4 ${
                  data.willingToExplore ? 'bg-white text-rose-950 border-white' : 'bg-rose-900/30 border-rose-800'
                }`}
              >
                <div className={`mt-1 w-5 h-5 rounded-full border-2 shrink-0 ${data.willingToExplore ? 'bg-rose-600 border-rose-600' : 'bg-white'}`} />
                <p className="text-sm font-medium">I will actually explore the match I receive with focus and respect.</p>
              </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`w-full py-6 rounded-2xl font-bold uppercase tracking-widest transition-all ${
              isValid && !isSubmitting 
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-950 dark:shadow-rose-950/20' 
              : 'bg-rose-900/50 text-rose-800 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Syncing to Global Registry...' : (isValid ? 'Submit Application' : 'Complete Required Fields')}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Questionnaire;
