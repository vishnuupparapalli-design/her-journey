import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Sign in with your Supabase Admin account
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;

      // 2. Verify that this user ID exists in the public.admins table
      const { data: adminRows, error: adminError } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', authData.user.id);

      if (adminError || !adminRows || adminRows.length === 0) {
        await supabase.auth.signOut();
        throw new Error('Access denied: You are not registered as an authorized Admin.');
      }

      onLoginSuccess(authData.user);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0B0E1A] text-[#EDEAE0]">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#1B1F3B]/80 border border-[#EDEAE0]/15 shadow-2xl space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono text-[#E8A857] uppercase tracking-widest">
            Restricted Portal
          </span>
          <h1 className="text-2xl font-serif font-light text-[#EDEAE0]">
            Admin Access
          </h1>
          <p className="text-xs text-[#EDEAE0]/60 font-light">
            Enter your credentials to access her responses and journey progress.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#EDEAE0]/70 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vishnuupparapalli@gmail.com"
              className="w-full p-3 rounded-xl bg-[#0B0E1A]/80 border border-[#EDEAE0]/15 text-[#EDEAE0] text-sm focus:outline-none focus:border-[#E8A857] transition-all font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#EDEAE0]/70 mb-1">
              Master Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl bg-[#0B0E1A]/80 border border-[#EDEAE0]/15 text-[#EDEAE0] text-sm focus:outline-none focus:border-[#E8A857] transition-all"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-300 bg-red-950/40 border border-red-800/40 p-2.5 rounded-lg">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#E8A857] text-[#0B0E1A] font-medium text-sm hover:bg-[#E8A857]/90 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In as Admin →'}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-[#EDEAE0]/10">
          <Link to="/" className="text-xs text-[#EDEAE0]/40 hover:text-[#EDEAE0]/80 transition-colors">
            ← Return to Journey
          </Link>
        </div>
      </div>
    </main>
  );
}