import React, { useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = [
  '#2f81f7', '#a371f7', '#39c5cf', '#3fb950', '#f85149',
  '#d29922', '#ff79c6', '#50fa7b', '#ff5555',
];

function Particle({ x, color, delay, drift, size, rotation, borderRadius, duration }) {
  const startY = -20;
  const endY = typeof window !== 'undefined' ? window.innerHeight + 20 : 1000;

  return (
    <motion.div
      className="confetti-particle"
      style={{
        left: x,
        top: startY,
        width: size,
        height: size,
        background: color,
        borderRadius,
      }}
      initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
      animate={{
        y: endY,
        x: drift,
        rotate: rotation,
        opacity: [1, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

export default function ConfettiEffect() {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 200,
      size: 4 + Math.random() * 8,
      rotation: Math.random() * 720 - 360,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      duration: 2 + Math.random() * 1.5,
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200 }}
    >
      {particles.map((p) => (
        <Particle
          key={p.id}
          x={p.x}
          color={p.color}
          delay={p.delay}
          drift={p.drift}
          size={p.size}
          rotation={p.rotation}
          borderRadius={p.borderRadius}
          duration={p.duration}
        />
      ))}
    </motion.div>
  );
}
