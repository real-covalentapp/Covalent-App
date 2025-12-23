
import React from 'react';

interface Props {
  onStart: () => void;
}

const Feature: React.FC<{ title: string; description: string; icon: string }> = ({ title, description, icon }) => (
  <div className="p-8 bg-white border border-rose-50 rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-rose-950">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-rose-100">
          romantic and ambitious? us too, fam.
        </span>
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-tight">
          Life is a project.<br />
          <span className="italic text-rose-600">Start your group.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          We know you're waiting for another A+ student to build a life with. 
          Stop brute-forcing dating. Find someone who adds to your life instead of detracting from it.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto bg-rose-600 text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-rose-700 transform hover:-translate-y-0.5 transition-all shadow-xl shadow-rose-200"
          >
            Join the Cohort
          </button>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto text-rose-600 hover:text-rose-800 px-10 py-4 transition-colors font-medium"
          >
            How it works
          </a>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-rose-50 py-20 border-y border-rose-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-rose-900 mb-6 italic">
            "It doesn't make sense to brute force dating when you have specific standards."
          </h2>
          <p className="text-rose-700/70 font-medium">
            Most apps reward volume. We reward vision. Finding an academic partner should accelerate your path, not stall it.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-serif font-bold text-center mb-16 text-slate-900">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">1</div>
            <h3 className="text-xl font-bold">Fill the form</h3>
            <p className="text-slate-600">Provide signals of your ambition, background, and what you're building.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">2</div>
            <h3 className="text-xl font-bold">Hand-picked matching</h3>
            <p className="text-slate-600">At the end of our matching cycle, we manually review every profile for compatibility.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">3</div>
            <h3 className="text-xl font-bold">The Covalent Email</h3>
            <p className="text-slate-600">We will hand-email you your match. The rest is up to you. Best of luck.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              description="anyone can say they're the next YC combinator or Wolf of Wall Street. Upload a resume so we can verify the smoke."
            />
            <Feature 
              icon="🕊️"
              title="Curated, Not Coded"
              description="Algorithms lack nuance. Our curators read your open-ended responses to find the 'spark'."
            />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-rose-950 text-rose-50 py-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none flex flex-wrap gap-10 p-10 rotate-12">
          {Array.from({length: 20}).map((_, i) => <span key={i} className="text-4xl">❤️</span>)}
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif italic mb-8">
            "Life is better as a collaborative project."
          </h2>
          <button 
            onClick={onStart}
            className="text-rose-200 border border-rose-200/30 px-8 py-3 rounded-full hover:bg-rose-900 transition-all font-medium"
          >
            Start your application
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
