import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, onSkip }) => {
  // Animation phases:
  // Phase 1 (0.0s - 0.8s): Fade in & scale from 0.92 to 1.0
  // Phase 2 (0.8s - 1.4s): Shimmer light sweep & subtle floating pulse
  // Phase 3 (1.4s - 1.8s): Crisp hold
  // Phase 4 (1.8s - 2.2s): Smooth zoom inward & cross-fade exit
  const [phase, setPhase] = useState<'fadeIn' | 'shimmer' | 'hold' | 'exit'>('fadeIn');

  useEffect(() => {
    // 0.8s: Start shimmer phase
    const t1 = setTimeout(() => {
      setPhase('shimmer');
    }, 800);

    // 1.4s: Hold phase
    const t2 = setTimeout(() => {
      setPhase('hold');
    }, 1400);

    // 1.8s: Exit cross-fade phase
    const t3 = setTimeout(() => {
      setPhase('exit');
    }, 1800);

    // 2.2s: Complete and unmount
    const t4 = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="splash-screen"
        initial={{ opacity: 1, scale: 1 }}
        animate={
          phase === 'exit'
            ? { opacity: 0, scale: 1.05 }
            : { opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 z-50 min-h-screen flex items-center justify-center bg-[#0D7C66] text-white overflow-hidden select-none"
      >
        {/* Subtle ambient radial glow behind the wordmark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: phase === 'shimmer' ? 0.35 : 0.2,
            scale: phase === 'shimmer' ? 1.15 : 1.0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white/20 blur-3xl pointer-events-none"
        />

        {/* Centerpiece Container */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Logo Wordmark: "Tazku." */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={
              phase === 'fadeIn'
                ? { opacity: 1, scale: 1, y: 0 }
                : phase === 'shimmer'
                ? {
                    opacity: 1,
                    scale: [1, 1.025, 1],
                    y: [0, -3, 0],
                  }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={
              phase === 'fadeIn'
                ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                : phase === 'shimmer'
                ? { duration: 0.6, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
            className="relative inline-block overflow-hidden px-4 py-2"
          >
            {/* The crisp white wordmark text */}
            <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans text-white drop-shadow-sm inline-flex items-baseline">
              <span>Tazku</span>
              <span className="text-white inline-block">.</span>
            </span>

            {/* Diagonal Radiant White Shimmer / Light Sweep Overlay (triggers during 0.8s - 1.4s) */}
            {phase === 'shimmer' && (
              <motion.div
                initial={{ x: '-120%', opacity: 0 }}
                animate={{ x: '180%', opacity: [0, 0.9, 0.9, 0] }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-22deg]"
                style={{ mixBlendMode: 'overlay' }}
              />
            )}
          </motion.div>

          {/* Minimalist Fiqh indicator / subtitle that fades in synchronously */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{
              opacity: phase === 'exit' ? 0 : 0.85,
              y: 0,
            }}
            transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
            className="mt-3 flex items-center gap-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal-200 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-teal-100 font-semibold">
              Community Zakat & Mahallu Platform
            </span>
          </motion.div>
        </div>

        {/* Optional Skip button in bottom-right for instant development bypass */}
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="absolute bottom-6 right-6 text-[11px] text-teal-200/60 hover:text-white px-3 py-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-all font-medium tracking-wide"
          >
            Skip Intro →
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
