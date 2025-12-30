'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

import type { Platform } from '@/types';

const PLATFORMS: { value: Platform; label: string; icon: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'x', label: 'X (Twitter)', icon: '🐦' },
];

export default function GeneratePage() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError('Please describe your business or situation');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText: inputText.trim(),
          platforms: selectedPlatforms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate calendar');
      }

      // Redirect to dashboard with the new calendar
      router.push(`/dashboard?calendar=${data.calendar.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const characterCount = inputText.length;
  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      style={{ background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%)' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>
            Create Your Social Media Calendar
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Tell us about your business, goals, and situation. We'll generate a complete 30-day content calendar powered by AI.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="border-l-4 px-4 py-3 rounded-r-lg shadow-sm"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'var(--error)',
                  color: 'var(--error)'
                }}
              >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl shadow-lg border p-6 sm:p-8 space-y-6"
            style={{ 
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border-primary)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Select Platforms <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                Choose one or more social media platforms for your content calendar
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {PLATFORMS.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.value);
                  return (
                    <motion.button
                      key={platform.value}
                      type="button"
                      onClick={() => togglePlatform(platform.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 rounded-xl border-2 transition-all duration-200 text-center"
                      style={{
                        borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-primary)',
                        backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.4)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--border-accent)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--border-primary)';
                        }
                      }}
                    >
                      <div className="text-2xl mb-2">{platform.icon}</div>
                      <div className="text-sm font-medium" style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {platform.label}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Business Description */}
            <div>
              <label htmlFor="input" className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Describe your business, goals, and situation <span style={{ color: 'var(--error)' }}>*</span>
              </label>
                <textarea
                  id="input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={14}
                  placeholder="Example: I run a fitness coaching business targeting busy professionals aged 30-45. I want to grow my Instagram following and convert followers into clients. I focus on quick workout tips, nutrition advice, and success stories. My account is new with about 200 followers. I post 3-4 times per week and want to increase engagement..."
                  className="w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 resize-none transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-primary)',
                    backgroundColor: 'var(--surface-base)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent-primary)'
                  } as React.CSSProperties & { '--tw-ring-color': string }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  disabled={loading}
                />
                <div className="mt-3 flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <p className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }}></span>
                    The more details you provide, the better your calendar will be
                  </p>
                  <div className="flex items-center gap-4">
                    <span>{wordCount} words</span>
                    <span>{characterCount} characters</span>
                  </div>
                </div>
              </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading || !inputText.trim()}
            whileHover={{ scale: loading || !inputText.trim() ? 1 : 1.02, y: -2 }}
            whileTap={{ scale: loading || !inputText.trim() ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full text-white py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base shadow-lg flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-mid) 50%, var(--gradient-end) 100%)',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading && inputText.trim()) {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)';
            }}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Generating your calendar...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Calendar</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

