
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Questionnaire from './components/Questionnaire';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

type View = 'landing' | 'questionnaire' | 'success' | 'admin-login' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleAdminLogin = (password: string) => {
    if (password === 'covalent') {
      setIsAdminAuthenticated(true);
      setView('admin');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setView('landing');
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen flex flex-col relative bg-transparent transition-colors duration-300 ${isDarkMode ? 'dark text-rose-100' : 'text-slate-900'}`}>
      <nav className="border-b border-rose-100 dark:border-rose-900/30 bg-white/40 dark:bg-black/40 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => setView('landing')}
            className="text-3xl font-serif font-bold tracking-tight text-rose-900 dark:text-rose-100"
          >
            Covalent
          </button>
          <div className="flex items-center gap-4 sm:gap-8">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            {view === 'landing' && (
              <>
                <button
                  onClick={() => setView(isAdminAuthenticated ? 'admin' : 'admin-login')}
                  className="text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 font-semibold text-sm transition-colors"
                >
                  {isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
                </button>
                <button
                  onClick={() => setView('questionnaire')}
                  className="btn-gradient-pink text-white px-5 sm:px-7 py-2.5 rounded-full font-bold transition-all text-sm shadow-lg"
                >
                  Start Questionnaire
                </button>
              </>
            )}
            {(view === 'admin' || view === 'admin-login') && (
              <button
                onClick={handleLogout}
                className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 font-bold text-sm"
              >
                Exit Admin
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {view === 'landing' && (
          <LandingPage onStart={() => setView('questionnaire')} />
        )}
        {view === 'questionnaire' && (
          <Questionnaire onComplete={() => setView('success')} />
        )}
        {view === 'admin-login' && (
          <AdminLogin onLogin={handleAdminLogin} />
        )}
        {view === 'admin' && isAdminAuthenticated && (
          <AdminDashboard />
        )}
        {view === 'success' && (
          <div className="max-w-2xl mx-auto px-6 py-24 text-center">
            <div className="text-4xl mb-6">💌</div>
            <h1 className="text-5xl font-serif mb-6 text-rose-900 dark:text-rose-100">Application Received</h1>
            <p className="text-xl text-slate-600 dark:text-rose-200/70 mb-8 leading-relaxed">
              We've received your data. Our team is currently hand-picking your first intentional match for this cycle. 
              Keep an eye on your inbox.
            </p>
            <div className="inline-block p-6 bg-white/60 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl text-left backdrop-blur-sm">
              <h3 className="font-semibold text-rose-900 dark:text-rose-100 mb-2">The Match Cycle</h3>
              <ul className="space-y-2 text-rose-800 dark:text-rose-300 text-sm">
                <li>• Manual review of your academic and career goals</li>
                <li>• Verification of your intentionality and values</li>
                <li>• A hand-crafted email sent personally to you and your match</li>
              </ul>
            </div>
            <div className="mt-12">
              <button 
                onClick={() => setView('landing')}
                className="text-rose-400 hover:text-rose-600 text-sm font-medium transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-rose-100/30 dark:border-rose-900/30 mt-20 bg-white/20 dark:bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4 text-center text-rose-300 text-sm">
          <p className="font-medium text-rose-400">© 2024 Covalent. For the intentional and the ambitious.</p>
          <div className="space-y-1 opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-[9px] uppercase tracking-widest font-bold">Vindicatorr1 was here yuh</p>
            <p className="text-[9px] uppercase tracking-widest font-bold">Iluvthepla was here crodie</p>
          </div>
          <button 
            onClick={() => setView(isAdminAuthenticated ? 'admin' : 'admin-login')}
            className="text-[10px] uppercase tracking-widest font-bold hover:text-rose-600 transition-colors mt-2"
          >
            Admin Access
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
