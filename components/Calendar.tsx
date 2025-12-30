'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import type { Post, Calendar as CalendarType } from '@/types';
import PostCard from './PostCard';
import ViralityIndicator from './ViralityIndicator';
import CanvaExportButton from './CanvaExportButton';
import DayModal from './DayModal';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarProps {
  calendar: CalendarType;
  onExport?: () => void;
  canvaConnected?: boolean;
}

export default function Calendar({ calendar, onExport, canvaConnected = false }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Find the earliest post date to set initial month view
  const getInitialMonth = () => {
    if (calendar.posts.length === 0) return new Date();
    const dates = calendar.posts.map(p => new Date(p.date)).sort((a, b) => a.getTime() - b.getTime());
    return dates[0] || new Date();
  };
  
  const [currentMonth, setCurrentMonth] = useState(getInitialMonth());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group posts by date
  const postsByDate = calendar.posts.reduce((acc, post) => {
    if (!acc[post.date]) {
      acc[post.date] = [];
    }
    acc[post.date].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  const selectedPosts = selectedDate ? postsByDate[selectedDate] || [] : [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto p-4 sm:p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateMonth('prev')}
            className="p-2 sm:p-2.5 rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateMonth('next')}
            className="p-2 sm:p-2.5 rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onExport && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExport}
              className="flex-1 sm:flex-none px-4 py-2.5 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-md flex items-center justify-center gap-2"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export</span>
            </motion.button>
          )}
          <CanvaExportButton 
            calendar={calendar} 
            isConnected={canvaConnected}
            variant="calendar"
          />
        </div>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl shadow-lg border p-4 sm:p-6 mb-6"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border-primary)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs sm:text-sm font-semibold p-2 uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
              {day}
            </div>
          ))}
        {daysInMonth.map((day, index) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayPosts = postsByDate[dateStr] || [];
          const isSelected = selectedDate === dateStr;
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.01 }}
              whileHover={dayPosts.length > 0 ? { scale: 1.05, y: -2 } : {}}
              whileTap={dayPosts.length > 0 ? { scale: 0.95 } : {}}
              className="min-h-[4.5rem] sm:min-h-[5.5rem] p-2 sm:p-3 rounded-xl border-2 transition-all duration-200"
              style={{
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-primary)',
                backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                opacity: !isCurrentMonth ? 0.4 : 1,
                boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.4)' : 'none',
                cursor: dayPosts.length > 0 ? 'pointer' : 'default'
              }}
              onMouseEnter={(e) => {
                if (dayPosts.length > 0 && !isSelected) {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              onClick={() => {
                if (dayPosts.length > 0) {
                  setSelectedDate(dateStr);
                  setIsModalOpen(true);
                }
              }}
            >
              <div className="text-sm sm:text-base font-semibold mb-1.5" style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                {format(day, 'd')}
              </div>
              {dayPosts.length > 0 && (
                <div className="space-y-1.5">
                  {dayPosts.slice(0, 2).map(post => (
                    <div key={post.id} className="flex items-center gap-1.5">
                      <ViralityIndicator virality={post.virality} size="sm" showPercentage={false} />
                      <span className="text-xs truncate font-medium capitalize" style={{ color: 'var(--text-tertiary)' }}>
                        {post.platform}
                      </span>
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>+{dayPosts.length - 2} more</div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
        </div>
      </motion.div>

      {/* Day Modal */}
      <DayModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDate(null);
        }}
        date={selectedDate}
        posts={selectedPosts}
        canvaConnected={canvaConnected}
      />
    </motion.div>
  );
}

