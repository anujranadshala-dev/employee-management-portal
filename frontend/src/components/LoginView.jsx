import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';
import { login, selectAuth } from '../store/slices/authSlice';

export default function LoginView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector(selectAuth);

  // --- Default credentials for easy testing ---
  // Ensure you have a user in your database with this email and password.
  // For production, these should start as empty strings.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        id="login-container"
        className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 rounded-2xl text-white shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Enterprise Portal</h2>
            <p className="text-xs text-slate-500 font-medium font-mono">Employee Directory Command</p>
          </div>
        </div>

        <div className="space-y-2 border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-800 text-sm">Secure Authentication</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please enter your corporate credentials to access the portal.
          </p>
        </div>

        {/* REAL LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-600">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 mt-1 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 mt-1 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>
          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          <button type="submit" disabled={status === 'loading'} className="w-full p-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
            {status === 'loading' ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-400 font-mono">
          Secure Sandbox Environment
        </p>
      </motion.div>
    </div>
  );
}