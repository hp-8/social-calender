'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl shadow-xl border p-8 sm:p-10" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-primary)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6)' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Create Account
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Start planning your social media content
            </p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="border px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--error)', color: 'var(--error)' }}>
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200"
                style={{
                  borderColor: 'var(--border-primary)',
                  backgroundColor: 'var(--surface-base)',
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200"
                style={{
                  borderColor: 'var(--border-primary)',
                  backgroundColor: 'var(--surface-base)',
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200"
                style={{
                  borderColor: 'var(--border-primary)',
                  backgroundColor: 'var(--surface-base)',
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3.5 px-4 rounded-xl active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold shadow-lg flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-mid) 50%, var(--gradient-end) 100%)',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)';
              }}
            >
              {loading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
          
          <p className="mt-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--accent-primary)' }} className="hover:opacity-80 transition-opacity">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

