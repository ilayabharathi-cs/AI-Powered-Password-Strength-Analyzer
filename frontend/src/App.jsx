import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PasswordInput from './components/PasswordInput';
import StrengthMeter from './components/StrengthMeter';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { Sparkles } from 'lucide-react';
import logo from './assets/logo.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debounced API call for analysis
  useEffect(() => {
    if (!password) {
      setAnalysis(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${API_URL}/api/analyze`, { password });
        setAnalysis(response.data);
      } catch (error) {
        console.error("Error analyzing password:", error);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [password]);

  const handleGenerate = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/generate?length=16`);
      setPassword(response.data.generated_password);
    } catch (error) {
      console.error("Error generating password:", error);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-gray-100 p-8 font-sans">
      
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-xl border border-cyber-border shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse object-cover" />
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-neonBlue to-cyber-neonPurple tracking-tight">
            AI-Powered Password Strength Analyzer
          </h1>
        </div>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          Advanced cybersecurity tool featuring real-time AI risk prediction, entropy calculation, and breach detection.
        </p>
      </header>

      {/* Main Interactive Section */}
      <main className="max-w-6xl mx-auto">
        <div className="bg-cyber-card/50 border border-cyber-border rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          
          <PasswordInput 
            password={password} 
            setPassword={setPassword} 
            onGenerate={handleGenerate}
          />
          
          <div className="flex justify-center mt-6">
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 bg-gradient-to-r from-cyber-neonPink to-cyber-neonPurple text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(181,0,255,0.4)] hover:shadow-[0_0_25px_rgba(181,0,255,0.7)] uppercase tracking-wider text-xs font-mono"
            >
              <Sparkles size={16} />
              Generate Strong Password
            </button>
          </div>
          
          {password && (
             <StrengthMeter 
               score={analysis?.rule_score || 0} 
               risk={analysis?.ai_risk || 'Analyzing...'} 
             />
          )}

          {loading && password && (
            <div className="text-center mt-4 text-cyber-neonBlue animate-pulse text-sm font-mono uppercase tracking-widest">
              Neural Network Analyzing...
            </div>
          )}

        </div>

        {/* Analytics Section */}
        {analysis && !loading && (
          <AnalyticsDashboard analysis={analysis} />
        )}
        
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-20 text-center text-gray-500 text-sm font-mono space-y-2">
        <p>Security Note: This system performs analysis in-memory. Passwords are never stored.</p>
        <p className="text-gray-600 text-xs">
          Built with: <span className="text-cyber-neonBlue">React</span> • <span className="text-cyber-neonPurple">FastAPI</span> • <span className="text-cyber-neonGreen">Scikit-learn</span> • <span className="text-cyber-neonPink">Tailwind CSS</span>
        </p>
      </footer>

    </div>
  );
}

export default App;
