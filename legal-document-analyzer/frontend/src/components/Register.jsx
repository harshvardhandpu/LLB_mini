import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ onLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center bg-mesh">
      <div className="glass-panel rounded-xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-primary/50 blur-md"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-display-lg text-primary mb-2 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[32px]">gavel</span>
            LexiCore AI
          </h1>
          <p className="font-body-fixed text-body-fixed text-on-surface-variant uppercase tracking-widest">Request Credentials</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-error text-center font-body-ui bg-error/10 border border-error/20 p-2 rounded">{error}</div>}
          
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2" htmlFor="username">
              <span className="w-1.5 h-1.5 rounded-full bg-primary ai-pulse inline-block"></span>
              Counsel ID
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">badge</span>
              <input 
                id="username" 
                type="text" 
                placeholder="Choose credentials..." 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-surface-container border border-outline-variant rounded bg-opacity-50 px-10 py-3 font-data-tabular text-data-tabular text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-on-surface-variant/50" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2" htmlFor="email">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary inline-block"></span>
              Secure Comm Link (Email)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">mail</span>
              <input 
                id="email" 
                type="email" 
                placeholder="counsel@firm.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface-container border border-outline-variant rounded bg-opacity-50 px-10 py-3 font-data-tabular text-data-tabular text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-on-surface-variant/50" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2" htmlFor="password">
              <span className="w-1.5 h-1.5 rounded-full bg-surface-variant inline-block"></span>
              Security Key
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">key</span>
              <input 
                id="password" 
                type="password" 
                placeholder="••••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-container border border-outline-variant rounded bg-opacity-50 px-10 py-3 font-data-tabular text-data-tabular text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-on-surface-variant/50" 
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary font-label-caps text-label-caps py-4 rounded transition-all duration-200 flex items-center justify-center gap-2 ai-pulse disabled:opacity-50"
            >
              {loading ? 'Provisioning Access...' : 'Request Access'}
              {!loading && <span className="material-symbols-outlined text-[16px]">how_to_reg</span>}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <Link to="/login" className="font-body-fixed text-body-fixed text-secondary hover:text-primary transition-colors underline decoration-secondary/30 underline-offset-4">
              Return to Login
            </Link>
          </div>
        </form>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
          <p className="font-data-tabular text-data-tabular text-on-surface-variant/70 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            Encrypted & Secure | RBAC Level 4
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
