'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import FloatingLines from '@/components/FloatingLines';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen relative overflow-hidden"
      style={{ 
        background: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      {/* FloatingLines Background */}
      <div 
        className="fixed inset-0"
        style={{ 
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <FloatingLines
          linesGradient={[
            '#6366f1',
            '#8b5cf6',
            '#ec4899',
            '#a855f7',
            '#3b82f6',
            '#6366f1',
          ]}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[5, 7, 5]}
          lineDistance={[4, 3.5, 4]}
          animationSpeed={0.6}
          interactive={true}
          bendRadius={6.0}
          bendStrength={-0.5}
          mouseDamping={0.1}
          parallax={true}
          parallaxStrength={0.12}
          mixBlendMode="screen"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20">
        {/* Hero Section - Asymmetric Layout */}
        <section className="relative min-h-[90vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column - Main Content */}
              <motion.div 
                variants={itemVariants}
                className="lg:col-span-7 space-y-8 lg:space-y-10"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl border"
                  style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>
                    AI-Powered
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Beta
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={itemVariants}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Create Your
                  <br />
                  <span 
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary))',
                    }}
                  >
                    Social Media
                  </span>
                  <br />
                  Content Calendar
                </motion.h1>

                {/* Description */}
                <motion.p
                  variants={itemVariants}
                  className="text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Generate a complete 30-day content strategy tailored to your business. 
                  Powered by AI, optimized for engagement, designed for growth.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Link href="/auth/signup">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative group px-8 py-4 rounded-xl font-semibold text-base cursor-pointer overflow-hidden"
                      style={{ 
                        background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-mid) 50%, var(--gradient-end) 100%)',
                        boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                        color: 'white'
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100"
                        style={{
                          background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        }}
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: 'linear',
                        }}
                      />
                      <span className="relative z-10">Get Started Free</span>
                    </motion.div>
                  </Link>
                  <Link href="/auth/login">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 rounded-xl font-semibold text-base border-2 cursor-pointer backdrop-blur-xl transition-all"
                      style={{ 
                        backgroundColor: 'rgba(36, 36, 51, 0.4)',
                        color: 'var(--text-primary)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                        e.currentTarget.style.backgroundColor = 'rgba(42, 42, 58, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.backgroundColor = 'rgba(36, 36, 51, 0.4)';
                      }}
                    >
                      Sign In
                    </motion.div>
                  </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap gap-8 pt-8"
                >
                  {[
                    { label: 'Content Ideas', value: '30+', suffix: '/month' },
                    { label: 'AI Analysis', value: '100%', suffix: ' automated' },
                    { label: 'Export Formats', value: '3+', suffix: ' options' },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {stat.value}
                        <span className="text-lg font-normal ml-1" style={{ color: 'var(--text-secondary)' }}>
                          {stat.suffix}
                        </span>
                      </div>
                      <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Column - Visual Element / Features Preview */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-5 hidden lg:block"
              >
                <div className="relative">
                  {/* Feature Cards Stack */}
                  <div className="space-y-4">
                    {[
                      { icon: '✨', title: 'AI-Powered', color: 'rgba(99, 102, 241, 0.2)' },
                      { icon: '📊', title: 'Funnel Strategy', color: 'rgba(139, 92, 246, 0.2)' },
                      { icon: '📤', title: 'Export Ready', color: 'rgba(236, 72, 153, 0.2)' },
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                        className="p-6 rounded-2xl backdrop-blur-xl border"
                        style={{
                          backgroundColor: 'rgba(36, 36, 51, 0.4)',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                        whileHover={{
                          scale: 1.02,
                          borderColor: 'rgba(99, 102, 241, 0.5)',
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: feature.color }}
                          >
                            {feature.icon}
                          </div>
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {feature.title}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-16 lg:mb-24"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Everything You Need
              </h2>
              <p className="text-lg lg:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Powerful features to streamline your content planning and maximize engagement
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  title: 'AI-Powered Generation',
                  description: 'Advanced AI analyzes your business and creates personalized content strategies with virality scoring.',
                  color: 'var(--accent-primary)',
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: 'Funnel-Based Strategy',
                  description: 'Content distributed across awareness, nurturing, and conversion stages for maximum impact.',
                  color: 'var(--accent-secondary)',
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                  title: 'Export Ready',
                  description: 'Export to Google Calendar or iCal format. Coming soon: Direct Canva integration for visual content.',
                  color: 'var(--success)',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative p-8 rounded-2xl backdrop-blur-xl border overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(36, 36, 51, 0.4)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = feature.color;
                    e.currentTarget.style.boxShadow = `0 20px 40px ${feature.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${feature.color}20, transparent 70%)`,
                    }}
                  />
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                    style={{ 
                      backgroundColor: `${feature.color}20`,
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 relative z-10" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed relative z-10" style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
