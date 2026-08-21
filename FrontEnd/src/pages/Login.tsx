import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-[#e2e8f0] shadow-xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#0256c4] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight font-display">WorkPulse Portal</h1>
          <p className="text-xs text-[#0256c4] font-extrabold uppercase tracking-wider mt-1">Enterprise Employee Management</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#0f172a] focus:border-[#0256c4] focus:bg-white focus:outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#0f172a] focus:border-[#0256c4] focus:bg-white focus:outline-none transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#0256c4] hover:bg-[#0145a3] text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#e2e8f0] text-center">
          <button
            onClick={handleDemoFill}
            type="button"
            className="w-full py-2 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cbd5e1] text-[#334155] text-[11px] font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
            <span>Auto-Fill Demo Admin Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
};
