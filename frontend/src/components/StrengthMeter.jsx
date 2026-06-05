import React from 'react';
import { motion } from 'framer-motion';

export default function StrengthMeter({ score, risk }) {
  // Determine color based on risk
  let color = 'bg-gray-600';
  let textColor = 'text-gray-400';
  let glow = '';

  switch (risk) {
    case 'Weak':
      color = 'bg-red-500';
      textColor = 'text-red-500';
      glow = 'shadow-[0_0_15px_rgba(239,68,68,0.5)]';
      break;
    case 'Medium':
      color = 'bg-yellow-500';
      textColor = 'text-yellow-500';
      glow = 'shadow-[0_0_15px_rgba(234,179,8,0.5)]';
      break;
    case 'Strong':
      color = 'bg-cyber-neonBlue';
      textColor = 'text-cyber-neonBlue';
      glow = 'shadow-[0_0_15px_rgba(0,240,255,0.5)]';
      break;
    case 'Very Strong':
      color = 'bg-cyber-neonGreen';
      textColor = 'text-cyber-neonGreen';
      glow = 'shadow-[0_0_15px_rgba(0,255,157,0.5)]';
      break;
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Security Level</span>
        <span className={`text-sm font-bold uppercase tracking-wider ${textColor}`}>
          {risk || 'None'}
        </span>
      </div>
      
      <div className="h-3 w-full bg-cyber-card rounded-full overflow-hidden border border-cyber-border relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${color} ${glow}`}
        />
      </div>
      
      <div className="text-right mt-1">
        <span className="text-xs text-gray-500 font-mono">{score}/100</span>
      </div>
    </div>
  );
}
