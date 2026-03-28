import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { simulatorConfigs } from '../utils/simulatorConfig';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Clock } from 'lucide-react';

function SimulatorCard({ simulator, onClick, index }) {
  const Icon = simulator.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card 
        className="flex flex-col h-full border-border/50 bg-card/60 backdrop-blur-md hover:border-[color:var(--accent-glow)] transition-colors overflow-hidden cursor-pointer group"
        onClick={onClick}
        style={{ '--accent-glow': simulator.colorGlow }}
      >
        <CardHeader className="p-5 pb-4">
          <div className="flex justify-between items-start mb-2">
            <div
              className="flex items-center justify-center rounded-xl w-12 h-12 text-white shrink-0"
              style={{
                background: `linear-gradient(135deg, ${simulator.color} 0%, ${simulator.colorDim} 100%)`,
                boxShadow: `0 4px 16px ${simulator.colorGlow}`,
              }}
            >
              <Icon size={24} />
            </div>
            <Badge variant="outline" className="font-mono text-[10px] uppercase font-semibold" style={{
              borderColor: simulator.color,
              color: simulator.color,
              backgroundColor: `${simulator.color}15`
            }}>
              {simulator.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">{simulator.title}</CardTitle>
          <CardDescription className="text-sm line-clamp-2 mt-1 min-h-[40px] leading-relaxed text-muted-foreground">
            {simulator.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 p-5 pt-0">
          <ul className="space-y-2.5">
            {simulator.features.map((feature, i) => (
              <li key={i} className="flex items-center text-sm text-card-foreground/80">
                <Check size={16} className="mr-2" style={{ color: simulator.color }} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="p-5 pt-4 border-t border-border/50 mt-auto flex items-center justify-between bg-black/10">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Clock size={14} />
            {simulator.estimatedTime}
          </span>
          <Button 
            className="group-hover:translate-x-1 transition-transform shadow-lg border-0 text-white"
            style={{ 
              background: `linear-gradient(135deg, ${simulator.color}, ${simulator.colorDim})`,
              boxShadow: `0 4px 12px ${simulator.colorGlow}`
            }}
          >
            Launch
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </CardFooter>
      </Card>
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
