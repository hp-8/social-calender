'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { Post } from '@/types';
import CanvaButton from './CanvaButton';
import CanvaExportButton from './CanvaExportButton';
import ViralityIndicator from './ViralityIndicator';

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string | null;
  posts: Post[];
  canvaConnected?: boolean;
}

const getFunnelStageStyle = (stage: 'top' | 'middle' | 'bottom') => {
  const styles = {
    top: { backgroundColor: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)' },
    middle: { backgroundColor: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-secondary)' },
    bottom: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' },
  };
  return styles[stage];
};

const funnelStageLabels = {
  top: 'Awareness',
  middle: 'Nurturing',
  bottom: 'Converting',
};

const platformLabels: Record<string, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  x: 'X',
};

const getPlatformStyle = (platform: string) => {
  const styles: Record<string, { backgroundColor: string; color: string }> = {
    whatsapp: { backgroundColor: 'rgba(37, 211, 102, 0.2)', color: '#25d366' },
    instagram: { backgroundColor: 'rgba(228, 64, 95, 0.2)', color: '#e4405f' },
    facebook: { backgroundColor: 'rgba(24, 119, 242, 0.2)', color: '#1877f2' },
    linkedin: { backgroundColor: 'rgba(10, 102, 194, 0.2)', color: '#0a66c2' },
    x: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' },
  };
  return styles[platform] || styles.instagram;
};

export default function DayModal({ isOpen, onClose, date, posts, canvaConnected = false }: DayModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!date) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'} scheduled
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {posts.length > 0 && (
                    <CanvaExportButton
                      posts={posts}
                      date={date}
                      isConnected={canvaConnected}
                      variant="day"
                    />
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-xl transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <p style={{ color: 'var(--text-secondary)' }}>No posts scheduled for this day</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                      >
                        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-primary)' }}>
                          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={getFunnelStageStyle(post.funnelStage)}>
                                {funnelStageLabels[post.funnelStage]}
                              </span>
                              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={getPlatformStyle(post.platform)}>
                                {platformLabels[post.platform] || post.platform}
                              </span>
                              <span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}>
                                {post.category}
                              </span>
                              <span className="text-xs capitalize" style={{ color: 'var(--text-tertiary)' }}>
                                {post.postType}
                              </span>
                            </div>
                            <ViralityIndicator virality={post.virality} size="md" />
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
                              Topic
                            </h4>
                            <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                              {post.topic}
                            </p>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
                              Content Idea
                            </h4>
                            <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                              {post.content}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                            <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: 'var(--text-tertiary)' }}>
                              <span>Goal: <span className="font-medium capitalize">{post.goal}</span></span>
                              <span>Virality: <span className="font-medium">{post.virality}%</span></span>
                            </div>
                            <div className="flex-shrink-0">
                              <CanvaButton
                                post={post}
                                isConnected={canvaConnected}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

