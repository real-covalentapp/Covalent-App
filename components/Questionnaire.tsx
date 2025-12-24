
import React, { useState } from 'react';
import { QuestionnaireData, INITIAL_DATA, Gender, Importance } from '../types';
import { db } from '../db';

interface Props {
  onComplete: () => void;
}

const Questionnaire: React.FC<Props> = ({ onComplete }) => {
  const [formData, setFormData] = useState<QuestionnaireData>({
    ...INITIAL_DATA,
    id: crypto.randomUUID(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof QuestionnaireData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckbox = (field: 'interestedIn' | 'exceptionalTraits', value: string) => {
    const current = (formData[field] as string[]) || [];
    if (current.includes(value)) {
      updateField(field, current.filter(v => v !== value));
    } else {
      updateField(field, [...current, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submission = {
      ...formData,
      submittedAt: new Date().toISOString()
    };

    const success = await db.saveSubmission(submission);
    setIsSubmitting(false);
    
    if (success) {
      onComplete();
    } else {
      alert("There was an issue saving your application. Please try again.");
    }
  };

  const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="mb-8 mt-12 first:mt-0">
      <h2 className="text-3xl font-serif font-bold text-rose-900 dark:text-rose-100 italic">{title}</h2>
      {subtitle && <p className="text-sm text-rose-800/60 dark:text-rose-400/60 mt-1">{subtitle}</p>}
      <div className="h-px w-full bg-rose-100 dark:bg-rose-900/30 mt-4"></div>
    </div>
  );

  // Fix: Made children optional to resolve TypeScript "missing children" errors when used in JSX
  const Label = ({ children, required }: { children?: React.ReactNode; required?: boolean }) => (
    <label className="block text-xs font-black uppercase tracking-widest text-rose-900/70 dark:text-rose-300/70 mb-2">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );

  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
      {...props}
      className="w-full bg-white/50 dark:bg-black/20 border border-rose-100 dark:border-rose-900/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400 transition-all text-rose-950 dark:text-rose-50"
    />
  );

  const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea 
      {...props}
      rows={4}
      className="w-full bg-white/50 dark:bg-black/20 border border-rose-100 dark:border-rose-900/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400 transition-all text-rose-950 dark:text-rose-50 resize-none"
    />
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="mb-16 text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/30">
            Cohort Registry Portal
          </span>
        </div>
        <h1 className="text-5xl font-serif font-bold text-rose-950 dark:text-rose-100 mb-4 italic">The Covalent Application</h1>
        <p className="text-slate-500 dark:text-rose-300 max-w-lg mx-auto leading-relaxed">
          Applications are reviewed manually for intentionality, ambition, and cultural depth.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* I. BASICS */}
        <section className="bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-rose-100 dark:border-rose-900/20 p-8 md:p-12 rounded-[3rem] shadow-xl shadow-rose-900/5">
          <SectionHeader title="I. The Basics" subtitle="Identity and Contact" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label required>Full Name</Label>
              <Input 
                value={formData.fullName} 
                onChange={e => updateField('fullName', e.target.value)} 
                required 
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <Label required>Email</Label>
              <Input 
                type="email" 
                value={formData.email} 
                onChange={e => updateField('email', e.target.value)} 
                required 
                placeholder="jane@university.edu"
              />
            </div>
            <div>
              <Label required>Age</Label>
              <Input 
                value={formData.age} 
                onChange={e => updateField('age', e.target.value)} 
                required 
                placeholder="21"
              />
            </div>
            <div>
              <Label required>Gender</Label>
              <select 
                value={formData.gender}
                onChange={e => updateField('gender', e.target.value as Gender)}
                required
                className="w-full bg-white/50 dark:bg-black/20 border border-rose-100 dark:border-rose-900/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="">Select...</option>
                <option value="Man">Man</option>
                <option value="Woman">Woman</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <Label required>Interested In Matching With</Label>
            <div className="flex flex-wrap gap-4 mt-2">
              {['Man', 'Woman', 'Non-binary'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleCheckbox('interestedIn', g)}
                  className={`px-6 py-2 rounded-full border text-xs font-bold transition-all ${
                    formData.interestedIn.includes(g as Gender)
                      ? 'bg-rose-900 text-white border-rose-950'
                      : 'bg-white/50 text-rose-900 border-rose-100 hover:border-rose-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* II. CONTEXT */}
        <section className="bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-rose-100 dark:border-rose-900/20 p-8 md:p-12 rounded-[3rem] shadow-xl shadow-rose-900/5">
          <SectionHeader title="II. Culture & Context" subtitle="Understanding your roots and values." />
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <Label>Cultural Background</Label>
                <Input value={formData.culturalBackground} onChange={e => updateField('culturalBackground', e.target.value)} placeholder="e.g. East Asian, Mediterranean..." />
              </div>
              <div>
                <Label>Importance</Label>
                <select value={formData.culturalImportance} onChange={e => updateField('culturalImportance', e.target.value as Importance)} className="w-full bg-white/50 dark:bg-black/20 border border-rose-100 dark:border-rose-900/50 rounded-xl px-4 py-3">
                  <option value="">Select Importance...</option>
                  <option value="Not important">Not important</option>
                  <option value="Somewhat important">Somewhat important</option>
                  <option value="Very important">Very important</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <Label>Religion / Spirituality</Label>
                <Input value={formData.religion} onChange={e => updateField('religion', e.target.value)} placeholder="e.g. Catholic, Atheist, Buddhist..." />
              </div>
              <div>
                <Label>Importance</Label>
                <select value={formData.religiousImportance} onChange={e => updateField('religiousImportance', e.target.value as Importance)} className="w-full bg-white/50 dark:bg-black/20 border border-rose-100 dark:border-rose-900/50 rounded-xl px-4 py-3">
                  <option value="">Select Importance...</option>
                  <option value="Not important">Not important</option>
                  <option value="Somewhat important">Somewhat important</option>
                  <option value="Very important">Very important</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* III. PATH */}
        <section className="bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-rose-100 dark:border-rose-900/20 p-8 md:p-12 rounded-[3rem] shadow-xl shadow-rose-900/5">
          <SectionHeader title="III. Education & Path" subtitle="Your intellectual and professional trajectory." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label required>Major / Field of Study</Label>
              <Input value={formData.major} onChange={e => updateField('major', e.target.value)} required placeholder="Computer Science & Philosophy" />
            </div>
            <div>
              <Label required>Graduation Year</Label>
              <Input value={formData.gradYear} onChange={e => updateField('gradYear', e.target.value)} required placeholder="2025" />
            </div>
          </div>
          <div className="mt-6">
            <Label>Where are you moving post-grad?</Label>
            <Input value={formData.locationDetail} onChange={e => updateField('locationDetail', e.target.value)} placeholder="New York City / San Francisco / Research in Zurich" />
          </div>
        </section>

        {/* IV. AMBITION */}
        <section className="bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-rose-100 dark:border-rose-900/20 p-8 md:p-12 rounded-[3rem] shadow-xl shadow-rose-900/5">
          <SectionHeader title="IV. Ambition & Signal" subtitle="Show us what makes you exceptional." />
          <div className="space-y-6">
            <div>
              <Label required>Exceptional Traits (Select all that apply)</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {[
                  'Strong academic performance',
                  'Notable leadership experience',
                  'Research or technical output',
                  'Entrepreneurial track record',
                  'Creative/Artistic depth'
                ].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleCheckbox('exceptionalTraits', t)}
                    className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.exceptionalTraits.includes(t)
                        ? 'bg-rose-900 text-white border-rose-950 shadow-md'
                        : 'bg-white/50 text-rose-900 border-rose-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Instagram Handle</Label>
                <Input value={formData.instagramHandle} onChange={e => updateField('instagramHandle', e.target.value)} placeholder="@username" />
              </div>
              <div>
                <Label>LinkedIn Link</Label>
                <Input value={formData.linkedinHandle} onChange={e => updateField('linkedinHandle', e.target.value)} placeholder="linkedin.com/in/..." />
              </div>
            </div>
            <div>
              <Label required>Major Accomplishments (Resume Snippet)</Label>
              <TextArea 
                value={formData.resumeAccomplishments} 
                onChange={e => updateField('resumeAccomplishments', e.target.value)} 
                required 
                placeholder="Bullet points of your trajectory highlights..."
              />
            </div>
            <div>
              <Label required>Why are you an exceptional individual?</Label>
              <p className="text-[10px] text-rose-400 mb-2 uppercase font-bold tracking-tighter">This is our most important field.</p>
              <TextArea 
                value={formData.ambitionContext} 
                onChange={e => updateField('ambitionContext', e.target.value)} 
                required 
                placeholder="Describe your vision, what makes you different, and what you aim to achieve in this decade."
              />
            </div>
          </div>
        </section>

        {/* V. PHILOSOPHY */}
        <section className="bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-rose-100 dark:border-rose-900/20 p-8 md:p-12 rounded-[3rem] shadow-xl shadow-rose-900/5">
          <SectionHeader title="V. Philosophy & Partner" subtitle="The chemistry of a covalent bond." />
          <div className="space-y-6">
            <div>
              <Label required>Ideal Intellectual Partner</Label>
              <TextArea value={formData.idealPartner} onChange={e => updateField('idealPartner', e.target.value)} required placeholder="Describe the energy and ambition profile of your match." />
            </div>
            <div>
              <Label required>Ideal First Date</Label>
              <TextArea value={formData.firstDate} onChange={e => updateField('firstDate', e.target.value)} required placeholder="Where do two high-achievers go to spark?" />
            </div>
          </div>
        </section>

        {/* VI. HONOR CODE */}
        <section className="bg-rose-950 text-rose-100 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-rose-900">
          <SectionHeader title="VI. The Covalent Honor Code" />
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <input 
                type="checkbox" 
                checked={formData.understandsOneMatch} 
                onChange={e => updateField('understandsOneMatch', e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-rose-800"
                required
              />
              <p className="text-sm opacity-80 italic">I value quality over quantity and accept one intentional match per cycle.</p>
            </div>
            <div className="flex gap-4 items-start">
              <input 
                type="checkbox" 
                checked={formData.willingToExplore} 
                onChange={e => updateField('willingToExplore', e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-rose-800"
                required
              />
              <p className="text-sm opacity-80 italic">I will actually explore the match I receive with focus and respect.</p>
            </div>
          </div>
        </section>

        <div className="pt-8 pb-20 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-16 py-6 rounded-full text-xl font-bold btn-gradient-pink text-white shadow-2xl transition-all ${
              isSubmitting ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105 active:scale-95'
            }`}
          >
            {isSubmitting ? 'Syncing with Registry...' : 'Submit Application'}
          </button>
          <p className="mt-4 text-xs text-rose-400 font-bold uppercase tracking-widest opacity-60">Submission is final for this cohort cycle.</p>
        </div>
      </form>
    </div>
  );
};

export default Questionnaire;
