
import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const Questionnaire: React.FC<Props> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="mb-12 text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/30">
            Cohort Registry Portal
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-rose-950 dark:text-rose-100 mb-4 italic">The Covalent Application</h1>
        <p className="text-slate-500 dark:text-rose-300 max-w-lg mx-auto leading-relaxed text-sm md:text-base px-4">
          The registry is a multi-page process. Use your native phone scroller to navigate.
        </p>
      </header>

      {/* 
          MOBILE SCROLL PERFORMANCE FIX: 
          - Height increased to 10000 to accommodate multi-page Google Forms.
          - Removed backdrop-blur-xl (This was the cause of 'lag' on long scrolls).
          - 'overflow-visible' ensures the parent doesn't clip the iframe.
      */}
      <div className="relative bg-white/90 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-[2rem] md:rounded-[3rem] shadow-xl transition-all overflow-visible">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-rose-950/90 z-10 rounded-[2rem] md:rounded-[3rem] h-[600px]">
            <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mb-4"></div>
            <p className="text-rose-900 dark:text-rose-200 font-serif italic text-lg text-center px-6">Connecting to Registry...</p>
          </div>
        )}
        
        <iframe 
          src="https://docs.google.com/forms/d/e/1FAIpQLSelnaZmhMvSePHaLZJsQeDHrjSRFJ8eYV0gOGFXrsi9TXiRew/viewform?embedded=true" 
          width="100%" 
          height="10000" 
          frameBorder="0" 
          marginHeight={0} 
          marginWidth={0}
          scrolling="no"
          onLoad={() => {
            setIsLoading(false);
            // Scroll to top of the form area on load for a clean start
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full transition-opacity duration-1000 block"
          style={{ 
            opacity: isLoading ? 0 : 1,
            pointerEvents: isLoading ? 'none' : 'auto',
            border: 'none',
            overflow: 'hidden',
            display: 'block',
            // Forces iOS to respect the height and not create an internal scroll
            minHeight: '10000px'
          }}
        >
          Loading…
        </iframe>
      </div>

      <div className="mt-12 text-center space-y-6 pb-20 relative z-20">
        <div className="p-8 bg-rose-950 text-rose-100 rounded-3xl border border-rose-900 shadow-2xl inline-block w-full max-w-md">
          <h3 className="font-serif italic text-xl mb-2 text-rose-100">Application Submitted?</h3>
          <p className="text-sm text-rose-200/70 leading-relaxed mb-6">
            If you've reached the "Thank You" page in the form above, your data is secure. Confirm below to exit.
          </p>
          <button 
            onClick={onComplete}
            className="w-full py-4 bg-white text-rose-950 rounded-2xl font-bold hover:bg-rose-50 transition-colors shadow-lg active:scale-95 transform"
          >
            I have finished applying
          </button>
        </div>
        
        <div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-rose-400 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest transition-colors block mx-auto py-4"
          >
            Back to top
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
