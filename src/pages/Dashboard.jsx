import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { simulatorConfigs } from '../utils/simulatorConfig';

function SimulatorCard({ simulator, onClick, index }) {
  return (
    <motion.div
      className="simulator-card"
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="card-icon"
        style={{
          background: `linear-gradient(135deg, ${simulator.color} 0%, ${simulator.colorDim} 100%)`,
          boxShadow: `0 4px 16px ${simulator.colorGlow}`,
        }}
      >
        <span className="card-icon-emoji">{simulator.icon}</span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{simulator.title}</h3>
        <p className="card-description">{simulator.description}</p>
      </div>

      <div className="card-meta">
        <span className="card-difficulty" style={{ color: simulator.color }}>
          {simulator.difficulty}
        </span>
        <span className="card-time">~{simulator.estimatedTime}</span>
      </div>

      <button
        className="card-button"
        style={{ background: `linear-gradient(135deg, ${simulator.color}, ${simulator.colorDim})` }}
      >
        Launch Simulator
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" />
        </svg>
      </button>

      <ul className="card-features">
        {simulator.features.map((feature, i) => (
          <li key={i}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill={simulator.color}>
              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <motion.header
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="dashboard-title">Memory Management Simulators</h1>
        <p className="dashboard-subtitle">
          Master operating system memory concepts through interactive visualization
        </p>
      </motion.header>

      <div className="simulator-grid">
        {simulatorConfigs.map((sim, i) => (
          <SimulatorCard
            key={sim.id}
            simulator={sim}
            onClick={() => navigate(sim.path)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
