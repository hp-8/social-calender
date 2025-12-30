'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div 
        className={`${sizeClasses[size]} border-4 rounded-full animate-spin`}
        style={{
          borderColor: 'var(--border-primary)',
          borderTopColor: 'var(--accent-primary)'
        }}
      ></div>
      {text && (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</p>
      )}
    </div>
  );
}

