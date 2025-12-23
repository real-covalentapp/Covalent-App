
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Questionnaire from './components/Questionnaire';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

type View = 'landing' | 'questionnaire' | 'success' | 'admin-login' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleAdminLogin = (password: string) => {
    // Simple hardcoded password for the prototype
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

  return (
    <div className="min-h-screen bg-romantic-canvas flex flex-col">
      <nav className="border-b border-rose-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => setView('landing')}
            className="text-2xl font-serif font-bold tracking-tight text-rose-900"
          >
            Covalent
          </button>
          <div className="flex items-center gap-6">
            {view === 'landing' && (
              <>
                <button
                  onClick={() => setView(isAdminAuthenticated ? 'admin' : 'admin-login')}
                  className="text-rose-400 hover:text-rose-700 font-medium text-sm transition-colors"
                >
                  {isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
                </button>
                <button
                  onClick={() => setView('questionnaire')}
                  className="bg-rose-600 text-white px-5 py-2 rounded-full font-medium hover:bg-rose-700 transition-colors text-sm shadow-sm"
                >
                  Start Questionnaire
                </button>
              </>
            )}
            {(view === 'admin' || view === 'admin-login') && (
              <button
                onClick={handleLogout}
                className="text-rose-600 hover:text-rose-800 font-medium text-sm"
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
            <h1 className="text-5xl font-serif mb-6 text-rose-900">Application Received</h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              We've received your data. Our team is currently hand-picking your first intentional match for this cycle. 
              Keep an eye on your inbox.
            </p>
            <div className="inline-block p-6 bg-rose-50 border border-rose-100 rounded-2xl text-left">
              <h3 className="font-semibold text-rose-900 mb-2">The Match Cycle</h3>
              <ul className="space-y-2 text-rose-800 text-sm">
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

      <footer className="py-12 border-t border-rose-100 mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4 text-center text-rose-300 text-sm">
          <p>© 2024 Covalent. For the intentional and the ambitious.</p>
          <button 
            onClick={() => setView(isAdminAuthenticated ? 'admin' : 'admin-login')}
            className="text-[10px] uppercase tracking-widest font-bold hover:text-rose-600 transition-colors opacity-30 hover:opacity-100"
          >
            Admin Access
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
