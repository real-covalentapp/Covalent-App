
import React from 'react';

interface Props {
  onStart: () => void;
}

const Feature: React.FC<{ title: string; description: string; icon: string }> = ({ title, description, icon }) => (
  <div className="p-8 bg-white/60 dark:bg-rose-950/20 backdrop-blur-sm border border-rose-100/50 dark:border-rose-900/30 rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-rose-950 dark:text-rose-100">{title}</h3>
    <p className="text-slate-600 dark:text-rose-200/70 leading-relaxed">{description}</p>
  </div>
);

const FlowerGraphic: React.FC<{ className?: string; color?: string }> = ({ className, color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C12 12 12 8.5 15 8.5C18 8.5 18 12 15 12C18 12 18 15.5 15 15.5C12 15.5 12 12 12 12ZM12 12C12 12 8.5 12 8.5 15C8.5 18 12 18 12 15C12 18 15.5 18 15.5 15C18 12 12 12 12 12ZM12 12C12 12 12 15.5 9 15.5C6 15.5 6 12 9 12C6 12 6 8.5 9 8.5C12 8.5 12 12 12 12ZM12 12C12 12 15.5 12 15.5 9C18 6 12 6 12 9C12 6 8.5 6 8.5 9C6 12 12 12 12 12Z" fill={color} />
    <circle cx="12" cy="12" r="2" fill="white" />
  </svg>
);

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="animate-in fade-in duration-700 relative overflow-hidden">
      {/* Decorative Flowers */}
      <FlowerGraphic className="flower-decoration top-20 left-[5%] w-24 h-24 text-rose-200 dark:text-rose-900/40 rotate-12" />
      <FlowerGraphic className="flower-decoration top-40 right-[10%] w-16 h-16 text-rose-300 dark:text-rose-800/30 -rotate-12" />
      <FlowerGraphic className="flower-decoration bottom-1/3 left-[15%] w-32 h-32 text-rose-100 dark:text-rose-950/20 rotate-45" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center relative z-10">
        <div className="mb-12">
          <span className="inline-block px-5 py-2 bg-rose-50/50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] border border-rose-100/50 dark:border-rose-900/30">
            ROMANTIC AND AMBITIOUS? US TOO, FAM.
          </span>
        </div>
        
        <h1 className="text-7xl md:text-8xl font-serif font-black text-[#0f172a] dark:text-rose-50 mb-10 leading-[1.05]">
          Life is a project.<br />
          <span className="italic text-[#e11d48] dark:text-rose-400">Start your group.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 dark:text-rose-200/80 max-w-3xl mx-auto mb-16 leading-relaxed font-medium opacity-90">
          We know you're waiting for another A+ student to build a life with. 
          Stop brute-forcing dating. Find someone who adds to your life instead of detracting from it.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button
            onClick={onStart}
            className="w-full sm:w-auto btn-gradient-pink text-white px-12 py-5 rounded-full text-lg font-bold transition-all shadow-2xl"
          >
            Join the Cohort
          </button>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 px-10 py-5 transition-colors font-bold text-lg"
          >
            How it works
          </a>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-rose-50/40 dark:bg-rose-950/30 backdrop-blur-md py-24 border-y border-rose-100/30 dark:border-rose-900/30 relative">
        <FlowerGraphic className="absolute -left-10 top-1/2 w-48 h-48 text-rose-200/30 dark:text-rose-900/10 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif text-rose-900 dark:text-rose-100 mb-8 italic font-bold">
            "It doesn't make sense to brute force dating when you have specific standards."
          </h2>
          <p className="text-rose-700/80 dark:text-rose-300/60 font-semibold text-lg max-w-2xl mx-auto leading-relaxed">
            Most apps reward volume. We reward vision. Finding an academic partner should accelerate your path, not stall it.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-32 relative">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-20 text-slate-900 dark:text-rose-50">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 btn-gradient-pink text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">1</div>
            <h3 className="text-2xl font-bold text-rose-950 dark:text-rose-100">Fill the form</h3>
            <p className="text-slate-600 dark:text-rose-200/70 text-lg">Provide signals of your ambition, background, and what you're building.</p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 btn-gradient-pink text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">2</div>
            <h3 className="text-2xl font-bold text-rose-950 dark:text-rose-100">Hand-picked matching</h3>
            <p className="text-slate-600 dark:text-rose-200/70 text-lg">At the end of our matching cycle, we manually review every profile for compatibility.</p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 btn-gradient-pink text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">3</div>
            <h3 className="text-2xl font-bold text-rose-950 dark:text-rose-100">The Covalent Email</h3>
            <p className="text-slate-600 dark:text-rose-200/70 text-lg">We will hand-email you your match. The rest is up to you. Best of luck.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative">
        <FlowerGraphic className="absolute right-0 bottom-0 w-64 h-64 text-rose-100/50 dark:text-rose-950/20 translate-x-1/2 translate-y-1/2" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Feature 
              icon="⚖️"
              title="End the Infinite Loop"
              description="High achievers don't have time for a second job called swiping. We replace volume with depth."
            />
            <Feature 
              icon="🍷"
              title="Intellectual Chemistry"
              description="We match based on field of study and trajectory. Date someone who understands your 'why'."
            />
            <Feature 
              icon="📜"
              title="Potential Vetted"
              description="Anyone can say they're the next YC founder or industry leader. We review actual trajectories to ensure quality."
            />
            <Feature 
              icon="🕊️"
              title="Curated, Not Coded"
              description="Algorithms lack nuance. Our curators read your open-ended responses to find the 'spark'."
            />
          </div>
        </div>
      </section>

      {/* Final Quote Section */}
      <section className="bg-rose-950/90 dark:bg-black/80 backdrop-blur-md text-rose-50 py-32 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex flex-wrap gap-12 p-10 rotate-12">
          {Array.from({length: 40}).map((_, i) => <span key={i} className="text-5xl">❤️</span>)}
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif italic mb-12 font-bold leading-tight">
            "Life is better as a collaborative project."
          </h2>
          <button 
            onClick={onStart}
            className="bg-white dark:bg-rose-100 text-rose-900 px-12 py-5 rounded-full hover:bg-rose-50 dark:hover:bg-white transition-all font-bold text-xl shadow-2xl"
          >
            Start your application
          </button>
        </div>
      </section>

      {/* Easter Egg Overlay Area */}
      <div className="py-10 text-center opacity-0 hover:opacity-10 transition-opacity duration-1000 select-none">
        <p className="text-[10px] uppercase font-bold text-rose-900 dark:text-rose-100">Vindicatorr1 was here yuh</p>
        <p className="text-[10px] uppercase font-bold text-rose-900 dark:text-rose-100">Iluvthepla was here crodie</p>
      </div>
    </div>
  );
};

export default LandingPage;
