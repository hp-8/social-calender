'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Calendar from '@/components/Calendar';
import type { Calendar as CalendarType } from '@/types';
import { downloadICalendar } from '@/lib/calendar/export';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [calendars, setCalendars] = useState<CalendarType[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [canvaConnected, setCanvaConnected] = useState(false);

  useEffect(() => {
    loadUserAndCalendars();
  }, []);

  useEffect(() => {
    const calendarId = searchParams.get('calendar');
    if (calendarId && calendars.length > 0) {
      const calendar = calendars.find(c => c.id === calendarId);
      if (calendar) {
        setSelectedCalendar(calendar);
      }
    } else if (calendars.length > 0 && !selectedCalendar) {
      setSelectedCalendar(calendars[0]);
    }
  }, [searchParams, calendars]);

  const loadUserAndCalendars = async () => {
    const supabase = createClient();
    
    // Get user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);

    // Check Canva connection
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('canva_access_token')
      .eq('id', currentUser.id)
      .single();
    
    setCanvaConnected(!!profile?.canva_access_token);

    // Load calendars
    const { data: calendarsData, error } = await supabase
      .from('calendars')
      .select(`
        *,
        posts (*)
      `)
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading calendars:', error);
    } else if (calendarsData) {
      const transformedCalendars: CalendarType[] = calendarsData.map((cal: any) => ({
        id: cal.id,
        userId: cal.user_id,
        inputText: cal.input_text,
        businessType: cal.business_type,
        targetAudience: cal.target_audience,
        platforms: cal.platforms || [],
        contentPillars: cal.content_pillars || [],
        funnelDistribution: cal.funnel_distribution,
        posts: cal.posts.map((post: any) => ({
          id: post.id,
          calendarId: post.calendar_id,
          date: post.date,
          content: post.content,
          postType: post.post_type,
          category: post.category,
          topic: post.topic,
          goal: post.goal,
          funnelStage: post.funnel_stage,
          virality: post.virality,
          platform: post.platform || 'instagram',
          createdAt: post.created_at,
        })),
        createdAt: cal.created_at,
        updatedAt: cal.updated_at,
      }));
      
      setCalendars(transformedCalendars);
      if (transformedCalendars.length > 0 && !selectedCalendar) {
        setSelectedCalendar(transformedCalendars[0]);
      }
    }
    
    setLoading(false);
  };

  const handleExport = () => {
    if (selectedCalendar) {
      downloadICalendar(selectedCalendar, `social-calendar-${selectedCalendar.id}.ics`);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <LoadingSpinner size="lg" text="Loading your calendars..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="border-b shadow-sm"
        style={{ 
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border-primary)',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Social Calendar
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Your AI-powered content planning hub
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/generate')}
                className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-md flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-mid) 50%, var(--gradient-end) 100%)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.4)';
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Calendar</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {calendars.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="text-center py-16 sm:py-20"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)' }}
                >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-bold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  No calendars yet
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-8 leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Create your first AI-powered social media calendar and start planning your content strategy
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/generate')}
                  className="px-8 py-3.5 text-white rounded-xl font-semibold shadow-lg flex items-center gap-2 mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-mid) 50%, var(--gradient-end) 100%)',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                  }}
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Your First Calendar</span>
              </motion.button>
            </div>
          </motion.div>
          ) : (
          <>
            {/* Calendar Selector */}
            {calendars.length > 1 && (
              <div className="mb-6 rounded-xl shadow-sm border p-4" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-primary)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)' }}>
                <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Select Calendar
                </label>
                <select
                  value={selectedCalendar?.id || ''}
                  onChange={(e) => {
                    const cal = calendars.find(c => c.id === e.target.value);
                    setSelectedCalendar(cal || null);
                  }}
                  className="w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-200 font-medium"
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
                >
                  {calendars.map(cal => (
                    <option key={cal.id} value={cal.id}>
                      {new Date(cal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {cal.businessType || 'Content Calendar'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <AnimatePresence mode="wait">
              {selectedCalendar && (
                <motion.div
                  key={selectedCalendar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                >
                  <Calendar calendar={selectedCalendar} onExport={handleExport} canvaConnected={canvaConnected} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

