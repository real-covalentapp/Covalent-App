
import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center animate-in fade-in duration-700">
      <div className="text-6xl mb-8">📊</div>
      <h1 className="text-5xl font-serif font-bold text-rose-950 dark:text-rose-100 mb-6 italic">Registry Active</h1>
      <p className="text-xl text-slate-600 dark:text-rose-200/70 mb-12 leading-relaxed max-w-2xl mx-auto">
        Your cohort applications are now being captured in the master registry spreadsheet. This centralizes all candidate data for easy sorting and matching.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="p-8 bg-white/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800 rounded-3xl backdrop-blur-sm">
          <h3 className="font-bold text-rose-900 dark:text-rose-100 mb-2">Master Spreadsheet</h3>
          <p className="text-sm text-rose-800 dark:text-rose-300">Access the raw data, time-stamps, and long-form essay responses for all applicants.</p>
        </div>
        <div className="p-8 bg-rose-900 text-rose-50 rounded-3xl shadow-lg border border-rose-800">
          <h3 className="font-bold mb-2">Curatorial Logic</h3>
          <p className="text-sm opacity-80">Use the sheet to highlight "Ambition" signals and mark applicants who have been manually matched.</p>
        </div>
      </div>
      
      <div className="mt-16 flex flex-col items-center gap-4">
        <a 
          href="https://docs.google.com/spreadsheets/d/1eCfnX54ONhm6O6l-ibilTN44H0CZ61RVUUOurWhLRA0/edit?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-gradient-pink text-white px-10 py-4 rounded-full font-bold inline-block shadow-xl"
        >
          Open Response Spreadsheet
        </a>
        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Only authorized curators can access this link</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
