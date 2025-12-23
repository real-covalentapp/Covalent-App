
import React, { useState } from 'react';

interface Props {
  onLogin: (password: string) => boolean;
}

const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-rose-900/5 border border-rose-50 text-center">
        <div className="text-3xl mb-4">🔐</div>
        <h2 className="text-3xl font-serif font-bold text-rose-950 mb-2">Admin Portal</h2>
        <p className="text-slate-500 text-sm mb-8">Enter the covalent key to access cohort data.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Admin Password"
              className={`w-full px-5 py-3 bg-rose-50/30 border rounded-2xl outline-none transition-all text-center font-medium ${
                error ? 'border-red-400 bg-red-50' : 'border-rose-100 focus:ring-2 focus:ring-rose-500'
              }`}
              autoFocus
            />
            {error && <p className="text-xs text-red-500 mt-2 font-medium">Incorrect key. Please try again.</p>}
          </div>
          <button 
            type="submit"
            className="w-full bg-rose-950 text-white py-3 rounded-2xl font-bold hover:bg-black transition-colors"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
