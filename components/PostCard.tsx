'use client';

import type { Post } from '@/types';
import ViralityIndicator from './ViralityIndicator';
import CanvaButton from './CanvaButton';
import { motion } from 'framer-motion';

interface PostCardProps {
  post: Post;
  onViewDetails?: (post: Post) => void;
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

export default function PostCard({ post, onViewDetails, canvaConnected = false }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-xl p-4 sm:p-5 border cursor-pointer shadow-md transition-all duration-300"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        borderColor: 'var(--border-primary)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.6)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.4)';
        e.currentTarget.style.borderColor = 'var(--border-primary)';
      }}
      onClick={() => onViewDetails?.(post)}
    >
      <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={getFunnelStageStyle(post.funnelStage)}>
            {funnelStageLabels[post.funnelStage]}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={getPlatformStyle(post.platform)}>
            {platformLabels[post.platform] || post.platform}
          </span>
        </div>
        <ViralityIndicator virality={post.virality} size="sm" />
      </div>
      
      <p className="text-sm sm:text-base line-clamp-3 mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {post.content}
      </p>
      
      <div className="flex items-center justify-between gap-2 flex-wrap pt-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'var(--surface-base)', color: 'var(--text-secondary)' }}>
            {post.category}
          </span>
          <span className="text-xs capitalize" style={{ color: 'var(--text-tertiary)' }}>
            {post.postType}
          </span>
        </div>
        <CanvaButton post={post} isConnected={canvaConnected} />
      </div>
    </motion.div>
  );
}

