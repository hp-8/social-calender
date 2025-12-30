'use client';

import { useState } from 'react';
import type { Calendar as CalendarType, Post } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvaExportButtonProps {
  calendar?: CalendarType;
  posts?: Post[];
  date?: string;
  isConnected?: boolean;
  variant?: 'calendar' | 'day';
}

export default function CanvaExportButton({ 
  calendar, 
  posts, 
  date,
  isConnected = false,
  variant = 'day'
}: CanvaExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_CANVA_CLIENT_ID;
    if (!clientId) {
      setError('Canva integration not configured');
      return;
    }
    
    const redirectUri = `${window.location.origin}/api/canva/oauth`;
    const scopes = ['design:read', 'design:write', 'design:content:read', 'design:content:write'].join(' ');
    const authUrl = `https://www.canva.com/api/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
    
    window.location.href = authUrl;
  };

  const handleExport = async (exportType: 'calendar' | 'day') => {
    if (!isConnected) {
      handleConnect();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (exportType === 'calendar' && calendar) {
        // Export entire calendar
        response = await fetch('/api/canva/create-calendar-design', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ calendarId: calendar.id }),
        });
      } else if (exportType === 'day' && posts && date) {
        // Export single day
        response = await fetch('/api/canva/create-day-design', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            postIds: posts.map(p => p.id),
            date 
          }),
        });
      } else {
        throw new Error('Invalid export parameters');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create design');
      }

      if (data.designUrl) {
        window.open(data.designUrl, '_blank');
      }
      
      setShowOptions(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'day' && posts && date) {
    return (
      <div className="flex flex-col gap-1">
        <motion.button
          onClick={() => isConnected ? setShowOptions(!showOptions) : handleConnect()}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          style={{ backgroundColor: '#00C4CC' }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#00B4BC';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#00C4CC';
          }}
        >
          {loading ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Creating...
            </>
          ) : (
            <>
              {isConnected ? 'Export to Canva' : 'Connect Canva'}
          </>
        )}
      </motion.button>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs"
            style={{ color: 'var(--error)' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
    );
  }

  // Calendar export button with options
  return (
    <div className="relative">
      <motion.button
        onClick={() => isConnected ? setShowOptions(!showOptions) : handleConnect()}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.05 }}
        whileTap={{ scale: loading ? 1 : 0.95 }}
        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        style={{ backgroundColor: '#00C4CC' }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = '#00B4BC';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#00C4CC';
        }}
      >
        {loading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            Creating...
          </>
        ) : (
          <>
            {isConnected ? 'Export to Canva' : 'Connect Canva'}
            {isConnected && <span className="text-xs">▼</span>}
          </>
        )}
      </motion.button>
      
      <AnimatePresence>
        {showOptions && isConnected && calendar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setShowOptions(false)}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 rounded-lg shadow-lg z-20 min-w-[220px] border"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: 'var(--border-primary)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              }}
            >
            <button
              onClick={() => handleExport('calendar')}
              className="w-full text-left px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Export Entire Calendar
            </button>
            <div className="border-t" style={{ borderColor: 'var(--border-primary)' }}></div>
            <button
              onClick={() => setShowOptions(false)}
              className="w-full text-left px-4 py-2.5 rounded-b-lg text-sm transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 text-xs"
            style={{ color: 'var(--error)' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

