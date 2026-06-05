import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Brain } from 'lucide-react';

export default function AnalyticsDashboard({ analysis }) {
  if (!analysis) return null;

  // Prepare data for Radar Chart
  const radarData = [
    { subject: 'Length', A: Math.min(100, analysis.length * 5), fullMark: 100 },
    { subject: 'Entropy', A: Math.min(100, analysis.entropy), fullMark: 100 },
    { subject: 'Rules', A: analysis.rule_score, fullMark: 100 },
    { subject: 'AI Score', A: analysis.ai_risk === 'Very Strong' ? 100 : analysis.ai_risk === 'Strong' ? 75 : analysis.ai_risk === 'Medium' ? 50 : 25, fullMark: 100 },
  ];

  // Crack time representation (logarithmic scale representation)
  const getCrackTimeValue = (timeStr) => {
    if (!timeStr) return 0;
    if (timeStr.includes('second')) return 10;
    if (timeStr.includes('minute')) return 30;
    if (timeStr.includes('hour')) return 50;
    if (timeStr.includes('day')) return 70;
    if (timeStr.includes('year') && !timeStr.includes('million')) return 90;
    if (timeStr.includes('million')) return 100;
    return 0;
  };

  const crackData = [
    { name: 'Crack Resistance', value: getCrackTimeValue(analysis.crack_time) }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Radar Chart for Overall Metrics */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-lg lg:col-span-1">
        <h3 className="text-cyber-neonBlue text-lg font-semibold mb-4 uppercase tracking-wider">Metrics Analysis</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#1f1f3a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Password" dataKey="A" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.3} />
              <Tooltip contentStyle={{ backgroundColor: '#0d0d1f', borderColor: '#1f1f3a', color: '#fff' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Risk Analysis Panel */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-lg relative overflow-hidden group lg:col-span-1">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-neonPurple opacity-5 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
        <div className="flex items-center gap-2 mb-4 border-b border-cyber-border pb-3">
          <Brain className="text-cyber-neonPurple animate-pulse" size={24} />
          <h3 className="text-cyber-neonPurple text-lg font-semibold uppercase tracking-wider">AI Risk Analysis</h3>
        </div>
        <div className="space-y-4 font-mono text-sm">
          <div className="flex justify-between border-b border-cyber-border/30 pb-2">
            <span className="text-gray-400">Pattern Type:</span>
            <span className="text-white font-semibold">{analysis.ai_details?.pattern_type || 'Analyzing...'}</span>
          </div>
          <div className="flex justify-between border-b border-cyber-border/30 pb-2">
            <span className="text-gray-400">Risk Level:</span>
            <span className={`font-bold uppercase ${
              analysis.ai_details?.risk_level === 'Low' ? 'text-cyber-neonGreen' :
              analysis.ai_details?.risk_level === 'Medium' ? 'text-cyber-neonBlue' :
              analysis.ai_details?.risk_level === 'High' ? 'text-yellow-500' : 'text-red-500'
            }`}>{analysis.ai_details?.risk_level || 'Analyzing...'}</span>
          </div>
          <div className="flex justify-between border-b border-cyber-border/30 pb-2">
            <span className="text-gray-400">Attack Vector:</span>
            <span className="text-white text-right font-semibold">{analysis.ai_details?.attack_vector || 'Analyzing...'}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-gray-400">Confidence:</span>
            <span className="text-cyber-neonBlue font-bold">{analysis.ai_details?.confidence || '0%'}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-col gap-4 lg:col-span-1">
        
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyber-neonPink opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Est. Crack Time</h3>
          <p className="text-3xl font-mono text-cyber-neonPink">{analysis.crack_time || 'N/A'}</p>
        </div>

        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyber-neonGreen opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Entropy Score</h3>
          <p className="text-3xl font-mono text-cyber-neonGreen">{analysis.entropy ? analysis.entropy.toFixed(1) : '0.0'} <span className="text-sm text-gray-500">bits</span></p>
        </div>

        <div className="bg-cyber-card border border-red-900/50 rounded-xl p-6 shadow-lg relative overflow-hidden">
           <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Breach Status</h3>
           {analysis.breached ? (
             <div>
                <p className="text-xl font-bold text-red-500">COMPROMISED</p>
                <p className="text-sm text-red-400 mt-1">Found {analysis.breach_count.toLocaleString()} times in leaks</p>
             </div>
           ) : (
             <p className="text-xl font-bold text-green-500">SAFE (No known breaches)</p>
           )}
        </div>

      </div>

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="col-span-1 lg:col-span-3 bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-lg">
          <h3 className="text-yellow-500 text-lg font-semibold mb-4 uppercase tracking-wider">Security Recommendations</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2 font-mono text-sm">
            {analysis.recommendations.map((rec, idx) => (
              <li key={idx} className={rec.includes("CRITICAL") ? "text-red-400 font-bold" : ""}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
