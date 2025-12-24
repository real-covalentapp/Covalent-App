
import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const Questionnaire: React.FC<Props> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="mb-12 text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/30">
            Cohort Registry Portal
          </span>
        </div>
        <h1 className="text-5xl font-serif font-bold text-rose-950 dark:text-rose-100 mb-4 italic">The Covalent Application</h1>
        <p className="text-slate-500 dark:text-rose-300 max-w-lg mx-auto leading-relaxed">
          Please complete the form below. Once you've submitted your application through the Google portal, you can return to the home screen.
        </p>
      </header>

      <div className="relative bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-rose-100 dark:border-rose-900/30 rounded-[3rem] overflow-hidden shadow-2xl min-h-[800px]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-rose-950/20 backdrop-blur-sm z-10">
            <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mb-4"></div>
            <p className="text-rose-900 dark:text-rose-200 font-serif italic text-lg">Connecting to Registry...</p>
          </div>
        )}
        
        <iframe 
          src="https://docs.google.com/forms/d/e/1FAIpQLSelnaZmhMvSePHaLZJsQeDHrjSRFJ8eYV0gOGFXrsi9TXiRew/viewform?embedded=true" 
          width="100%" 
          height="3500" 
          frameBorder="0" 
          marginHeight={0} 
          marginWidth={0}
          onLoad={() => setIsLoading(false)}
          className="w-full transition-opacity duration-1000"
          style={{ opacity: isLoading ? 0 : 1 }}
        >
          Loading…
        </iframe>
      </div>

      <div className="mt-12 text-center space-y-6">
        <div className="p-8 bg-rose-950 text-rose-100 rounded-3xl border border-rose-900 shadow-xl inline-block max-w-md">
          <h3 className="font-serif italic text-xl mb-2">Final Step</h3>
          <p className="text-sm text-rose-200/70 leading-relaxed mb-6">
            After clicking "Submit" at the very bottom of the form above, please click the button below to confirm your session is complete.
          </p>
          <button 
            onClick={onComplete}
            className="w-full py-4 bg-white text-rose-950 rounded-2xl font-bold hover:bg-rose-50 transition-colors shadow-lg"
          >
            I have finished applying
          </button>
        </div>
        
        <div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-rose-400 hover:text-rose-600 text-xs font-black uppercase tracking-widest transition-colors"
          >
            Back to top
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
