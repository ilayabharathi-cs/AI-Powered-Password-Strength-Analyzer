import React, { useState } from 'react';
import { Eye, EyeOff, RefreshCcw } from 'lucide-react';

export default function PasswordInput({ password, setPassword, onGenerate }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password..."
        className="w-full bg-cyber-card border border-cyber-border rounded-xl px-6 py-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-neonBlue focus:ring-1 focus:ring-cyber-neonBlue transition-all font-mono"
      />
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-cyber-neonBlue transition-colors"
          title="Toggle visibility"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        <button
          onClick={onGenerate}
          className="text-gray-400 hover:text-cyber-neonPink transition-colors"
          title="Generate strong password"
        >
          <RefreshCcw size={20} />
        </button>
      </div>
    </div>
  );
}
