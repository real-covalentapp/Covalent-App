
import React, { useState, useCallback } from 'react';
import { QuestionnaireData, INITIAL_DATA, Importance, Gender } from '../types';

interface Props {
  onComplete: () => void;
}

const STEPS = [
  'Basics',
  'Culture',
  'Path',
  'Ambition',
  'Open Ended',
  'Commitment'
];

const Questionnaire: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuestionnaireData>(INITIAL_DATA);

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

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.max(s - 1, 0));
  };

  const handleSubmit = () => {
    const finalData = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('covalent_submissions') || '[]');
    localStorage.setItem('covalent_submissions', JSON.stringify([...existing, finalData]));
    
    onComplete();
  };

  const isStepValid = useCallback(() => {
    if (step === 0) return data.fullName && data.email && data.age && data.gender && data.interestedIn.length > 0;
    if (step === 1) return true;
    if (step === 2) {
      const careerValid = data.careerDirection !== 'other' || data.careerOther;
      return data.major && data.gradYear && data.careerDirection && careerValid && data.locationCommitted;
    }
    if (step === 4) return data.lookingFor && data.idealPartner && data.firstDate && data.lifeContext && data.excitedToBuild;
    if (step === 5) return data.understandsOneMatch && data.willingToExplore;
    return true;
  }, [step, data]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-in slide-in-from-bottom-4 duration-500">
      {/* Progress */}
      <div className="mb-12">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-4">
          <span>Phase {step + 1} of {STEPS.length}</span>
          <span className="text-rose-900">{STEPS[step]}</span>
        </div>
        <div className="h-1.5 w-full bg-rose-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-rose-600 transition-all duration-500 ease-out shadow-sm" 
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-rose-900/5 border border-rose-50 min-h-[500px] flex flex-col">
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-rose-950 mb-8">The Basics</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input 
                type="text"
                value={data.fullName}
                onChange={e => updateField('fullName', e.target.value)}
                placeholder="Jordan Smith"
                className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <p className="text-xs text-rose-400 mb-2">(Used only to notify you of matches)</p>
              <input 
                type="email"
                value={data.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder="name@university.edu"
                className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                <input 
                  type="number"
                  value={data.age}
                  onChange={e => updateField('age', e.target.value)}
                  placeholder="21"
                  className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Gender</label>
                <select 
                  value={data.gender}
                  onChange={e => updateField('gender', e.target.value)}
                  className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all appearance-none"
                >
                  <option value="">Select</option>
                  <option value="Man">Man</option>
                  <option value="Woman">Woman</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Interested in matching with</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {['Man', 'Woman', 'Non-binary'].map(g => (
                  <button
                    key={g}
                    onClick={() => handleCheckboxChange('interestedIn', g)}
                    className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                      data.interestedIn.includes(g as Gender)
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-rose-700 border-rose-200 hover:border-rose-400'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-rose-950 mb-4">Culture & Context</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cultural background (optional)</label>
                <input 
                  type="text"
                  value={data.culturalBackground}
                  onChange={e => updateField('culturalBackground', e.target.value)}
                  className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Importance of cultural alignment?</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Not important', 'Somewhat important', 'Very important'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => updateField('culturalImportance', opt)}
                      className={`py-2 text-xs font-semibold border rounded-xl transition-all ${
                        data.culturalImportance === opt ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-white border-rose-100 text-slate-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-rose-50">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Religion / Spiritual identity (optional)</label>
                <input 
                  type="text"
                  value={data.religion}
                  onChange={e => updateField('religion', e.target.value)}
                  className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Importance of religious alignment?</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Not important', 'Somewhat important', 'Very important'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => updateField('religiousImportance', opt)}
                      className={`py-2 text-xs font-semibold border rounded-xl transition-all ${
                        data.religiousImportance === opt ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-white border-rose-100 text-slate-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-rose-950 mb-8">Education & Path</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Major(s) / Field(s) of study</label>
              <input 
                type="text"
                value={data.major}
                onChange={e => updateField('major', e.target.value)}
                placeholder="Physics & Philosophy"
                className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Graduation Year</label>
              <input 
                type="text"
                value={data.gradYear}
                onChange={e => updateField('gradYear', e.target.value)}
                placeholder="2025"
                className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Broad Career Direction</label>
              <select 
                value={data.careerDirection}
                onChange={e => updateField('careerDirection', e.target.value)}
                className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none appearance-none"
              >
                <option value="">Select</option>
                <option value="finance">Finance</option>
                <option value="tech">Tech</option>
                <option value="medicine">Medicine</option>
                <option value="law">Law</option>
                <option value="academia">Academia</option>
                <option value="startup">Startup</option>
                <option value="still exploring">Still Exploring</option>
                <option value="other">Other</option>
              </select>
              {data.careerDirection === 'other' && (
                <input 
                  type="text"
                  value={data.careerOther}
                  onChange={e => updateField('careerOther', e.target.value)}
                  placeholder="Please specify..."
                  className="w-full mt-3 px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none animate-in fade-in slide-in-from-top-2 duration-300"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Post-grad location plans?</label>
              <div className="flex gap-3 mb-3">
                {['Yes', 'No', 'Unsure'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => updateField('locationCommitted', opt)}
                    className={`px-6 py-2 rounded-full border text-sm font-medium transition-all ${
                      data.locationCommitted === opt ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-rose-200 text-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-rose-950 mb-2">Ambition Signal</h2>
            <p className="text-slate-500 text-sm mb-6">Signals of excellence help us match you with your intellectual equal.</p>
            
            <div className="space-y-3">
              {[
                'Strong academic performance',
                'Notable work experience or leadership',
                'Research / creative / technical output',
                'Entrepreneurial or independent projects'
              ].map(trait => (
                <div 
                  key={trait}
                  onClick={() => handleCheckboxChange('exceptionalTraits', trait)}
                  className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${
                    data.exceptionalTraits.includes(trait) ? 'bg-rose-50 border-rose-300 shadow-sm' : 'bg-rose-50/30 border-rose-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${data.exceptionalTraits.includes(trait) ? 'bg-rose-600 border-rose-600' : 'bg-white border-rose-200'}`}>
                    {data.exceptionalTraits.includes(trait) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm font-semibold text-rose-950">{trait}</span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contextual Brief (optional)</label>
              <textarea 
                rows={3}
                value={data.ambitionContext}
                onChange={e => updateField('ambitionContext', e.target.value)}
                className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none"
                placeholder="What are you most proud of building?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Resume upload (optional but encouraged)</label>
              <div className="border-2 border-dashed border-rose-200 rounded-2xl p-8 text-center bg-rose-50/10 hover:bg-rose-50/30 transition-colors">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={e => updateField('resumeFileName', e.target.files?.[0]?.name || '')}
                  className="hidden" 
                  id="resume-upload" 
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="text-rose-600 text-2xl mb-2">📄</div>
                  <span className="text-rose-400 text-sm block">
                    {data.resumeFileName || "Click to upload your curriculum vitae (PDF)"}
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-rose-50 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram Handle: Optional but encouraged</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 font-medium">@</span>
                  <input 
                    type="text"
                    value={data.instagramHandle}
                    onChange={e => updateField('instagramHandle', e.target.value.replace(/^@/, ''))}
                    placeholder="username"
                    className="w-full pl-8 pr-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">LinkedIn Handle (optional but encouraged)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 font-medium">in/</span>
                  <input 
                    type="text"
                    value={data.linkedinHandle}
                    onChange={e => updateField('linkedinHandle', e.target.value.replace(/^in\//, ''))}
                    placeholder="yourname"
                    className="w-full pl-11 pr-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-rose-950 mb-2">Open Ended</h2>
            <p className="text-slate-500 text-sm mb-6">Describe your trajectory. We look for shared values and energy.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">What are you looking for right now?</label>
                <textarea 
                  rows={2}
                  value={data.lookingFor}
                  onChange={e => updateField('lookingFor', e.target.value)}
                  className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Describe your ideal partner</label>
                <p className="text-xs text-rose-400 mb-2">Values, ambition level, energy...</p>
                <textarea 
                  rows={2}
                  value={data.idealPartner}
                  onChange={e => updateField('idealPartner', e.target.value)}
                  className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">A great first date (30-90 mins)</label>
                <textarea 
                  rows={2}
                  value={data.firstDate}
                  onChange={e => updateField('firstDate', e.target.value)}
                  className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none"
                  placeholder="Keep it authentic..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">What do you want someone you’re dating to understand about your life right now?</label>
                <textarea 
                  rows={2}
                  value={data.lifeContext}
                  onChange={e => updateField('lifeContext', e.target.value)}
                  className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">One thing you’re excited to build in the next few years</label>
                <p className="text-xs text-rose-400 mb-2">(Career, life, or otherwise)</p>
                <textarea 
                  rows={2}
                  value={data.excitedToBuild}
                  onChange={e => updateField('excitedToBuild', e.target.value)}
                  className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Any dealbreakers or important preferences? (Optional)</label>
                <textarea 
                  rows={2}
                  value={data.dealbreakers}
                  onChange={e => updateField('dealbreakers', e.target.value)}
                  className="w-full px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none"
                  placeholder="Specific requirements..."
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-rose-950 mb-8">Covalent Commitment</h2>
            
            <div className="space-y-4">
              <div 
                onClick={() => updateField('understandsOneMatch', !data.understandsOneMatch)}
                className={`p-6 border rounded-[2rem] cursor-pointer transition-all flex items-start gap-4 ${
                  data.understandsOneMatch ? 'bg-rose-950 text-white border-rose-950 shadow-xl' : 'bg-rose-50/50 border-rose-100'
                }`}
              >
                <div className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 ${data.understandsOneMatch ? 'bg-rose-600 border-rose-600' : 'bg-white border-rose-200'}`}>
                  {data.understandsOneMatch && <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
                <p className="text-sm leading-relaxed">I understand Covalent offers <b>one intentional match at a time</b>. I value quality over the dopamine of swiping.</p>
              </div>

              <div 
                onClick={() => updateField('willingToExplore', !data.willingToExplore)}
                className={`p-6 border rounded-[2rem] cursor-pointer transition-all flex items-start gap-4 ${
                  data.willingToExplore ? 'bg-rose-950 text-white border-rose-950 shadow-xl' : 'bg-rose-50/50 border-rose-100'
                }`}
              >
                <div className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 ${data.willingToExplore ? 'bg-rose-600 border-rose-600' : 'bg-white border-rose-200'}`}>
                  {data.willingToExplore && <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
                <p className="text-sm leading-relaxed">I’m willing to <b>actually explore the match I receive</b>. I understand that intellectual connection takes focus.</p>
              </div>
            </div>

            <div className="p-8 bg-rose-50 rounded-3xl text-center border border-rose-100">
              <p className="text-rose-900 text-sm italic font-serif">
                "By submitting, you enter the next matching cycle. We will hand-email you your match personally. Best of luck."
              </p>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="mt-auto pt-10 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className={`text-sm font-bold px-6 py-2 rounded-full transition-all ${
              step === 0 ? 'text-rose-200 cursor-not-allowed' : 'text-rose-400 hover:text-rose-900'
            }`}
          >
            Back
          </button>
          <button
            onClick={step === STEPS.length - 1 ? handleSubmit : nextStep}
            disabled={!isStepValid()}
            className={`px-10 py-4 rounded-full text-white font-bold transition-all shadow-md ${
              isStepValid() ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-rose-100 text-rose-300 cursor-not-allowed'
            }`}
          >
            {step === STEPS.length - 1 ? 'Submit to the Cohort' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
