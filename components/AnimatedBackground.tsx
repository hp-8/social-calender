'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Animated gradient mesh background
export function GradientMesh() {
  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .gradient-mesh {
          animation: gradientShift 15s ease infinite;
        }
      `}</style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          className="absolute inset-0 gradient-mesh"
          style={{
            background: `
              radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
              radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%),
              radial-gradient(at 0% 100%, rgba(99, 102, 241, 0.15) 0px, transparent 50%)
            `,
            backgroundSize: '200% 200%',
          }}
        />
      </div>
    </>
  );
}

// Floating animated shapes
export function FloatingShapes() {
  const shapes = Array.from({ length: 6 }, (_, i) => i);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {shapes.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            background: i % 3 === 0 
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.4))'
              : i % 3 === 1
              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4))'
              : 'linear-gradient(135deg, rgba(236, 72, 153, 0.4), rgba(99, 102, 241, 0.4))',
            left: `${10 + i * 15}%`,
            top: `${10 + i * 20}%`,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Particle system
export function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(99, 102, 241, 0.5)',
      'rgba(139, 92, 246, 0.5)',
      'rgba(236, 72, 153, 0.5)',
    ];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ opacity: 0.6 }}
    />
  );
}

// Grid pattern overlay
export function GridPattern() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
    />
  );
}

// Dot pattern background (React Bits inspired)
export function DotPattern() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 opacity-5"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    />
  );
}

// Animated noise texture (React Bits inspired)
export function NoiseTexture() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }}
    />
  );
}

// Animated radial gradient (React Bits inspired)
export function RadialGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '50% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
        }}
      />
    </div>
  );
}

// Animated lines pattern (React Bits inspired)
export function AnimatedLines() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-px opacity-10"
          style={{
            background: `linear-gradient(to right, transparent, rgba(99, 102, 241, 0.5), transparent)`,
            top: `${20 + i * 20}%`,
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
}

