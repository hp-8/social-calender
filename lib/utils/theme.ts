// Theme utility functions for consistent dark theme styling

export const themeStyles = {
  // Backgrounds
  bgPrimary: { backgroundColor: 'var(--bg-primary)' },
  bgSecondary: { backgroundColor: 'var(--bg-secondary)' },
  bgTertiary: { backgroundColor: 'var(--bg-tertiary)' },
  bgElevated: { backgroundColor: 'var(--surface-elevated)' },
  bgHover: { backgroundColor: 'var(--surface-hover)' },
  
  // Text colors
  textPrimary: { color: 'var(--text-primary)' },
  textSecondary: { color: 'var(--text-secondary)' },
  textTertiary: { color: 'var(--text-tertiary)' },
  
  // Borders
  borderPrimary: { borderColor: 'var(--border-primary)' },
  borderAccent: { borderColor: 'var(--border-accent)' },
  
  // Shadows
  shadowMd: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)' },
  shadowLg: { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' },
  shadowXl: { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6)' },
  shadowGlow: { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
  
  // Gradients
  gradientPrimary: {
    background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-mid) 50%, var(--gradient-end) 100%)'
  },
  
  // Platform colors
  platformColors: {
    whatsapp: { backgroundColor: 'rgba(37, 211, 102, 0.2)', color: '#25d366' },
    instagram: { backgroundColor: 'rgba(228, 64, 95, 0.2)', color: '#e4405f' },
    facebook: { backgroundColor: 'rgba(24, 119, 242, 0.2)', color: '#1877f2' },
    linkedin: { backgroundColor: 'rgba(10, 102, 194, 0.2)', color: '#0a66c2' },
    x: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' },
  },
  
  // Funnel stage colors
  funnelColors: {
    top: { backgroundColor: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)' },
    middle: { backgroundColor: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-secondary)' },
    bottom: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' },
  },
};

