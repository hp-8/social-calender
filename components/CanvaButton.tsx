'use client';

import { useState } from 'react';
import type { Post } from '@/types';
import { motion } from 'framer-motion';

interface CanvaButtonProps {
  post: Post;
  isConnected?: boolean;
}

export default function CanvaButton({ post, isConnected = false }: CanvaButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateDesign = async () => {
    if (!isConnected) {
      // Redirect to Canva OAuth
      const clientId = process.env.NEXT_PUBLIC_CANVA_CLIENT_ID;
      if (!clientId) {
        setError('Canva integration not configured');
        return;
      }
      
      const redirectUri = `${window.location.origin}/api/canva/oauth`;
      const scopes = ['design:read', 'design:write', 'design:content:read', 'design:content:write'].join(' ');
      const authUrl = `https://www.canva.com/api/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
      
      window.location.href = authUrl;
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/canva/create-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: post.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create design');
      }

      if (data.designUrl) {
        window.open(data.designUrl, '_blank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <motion.button
        onClick={handleCreateDesign}
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
            {isConnected ? 'Create in Canva' : 'Connect Canva'}
          </>
        )}
      </motion.button>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs"
          style={{ color: 'var(--error)' }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

