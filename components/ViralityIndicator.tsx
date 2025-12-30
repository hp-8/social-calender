'use client';

interface ViralityIndicatorProps {
  virality: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export default function ViralityIndicator({ 
  virality, 
  size = 'md',
  showPercentage = true 
}: ViralityIndicatorProps) {
  // Calculate color based on virality (red to green gradient)
  const getColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-1">
      <div
        className={`${sizeClasses[size]} ${getColor(virality)} rounded-full`}
        title={`Virality: ${virality}%`}
      />
      {showPercentage && (
        <span className={textSizeClasses[size]} style={{ color: 'var(--text-secondary)' }}>
          {virality}%
        </span>
      )}
    </div>
  );
}

