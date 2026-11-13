import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Send, RefreshCw, BarChart3, AlertCircle } from 'lucide-react';
import { CreativeVariant, ResearchScenario } from '../types';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface AdReactionLabProps {
  lang?: 'en' | 'hi';
  onSimulationComplete?: (results: any) => void;
}

export const AdReactionLab: React.FC<AdReactionLabProps> = ({ lang = 'en', onSimulationComplete }) => {
  const [experimentName, setExperimentName] = useState('');
  const [creatives, setCreatives] = useState<CreativeVariant[]>([{ id: 'c1', type: 'headline', content: '' }]);
  const [scenario, setScenario] = useState<ResearchScenario>({ id: 's1', title: 'First Exposure', context: 'Standard' });
  const [personas, setPersonas] = useState<any[]>([]);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const fetchPersonas = async () => {
      // Assuming personas are stored in a collection named 'personas'
      const querySnapshot = await getDocs(collection(db, 'personas'));
      setPersonas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPersonas();
  }, []);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const response = await fetch('/api/run-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          personas: personas.filter(p => selectedPersonaIds.includes(p.id)),
          creatives,
          scenario
        }),
      });
      const data = await response.json();
      setResults(data.reactionReport);
      if (onSimulationComplete) onSimulationComplete(data.reactionReport);
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="rounded-[24px] bg-[#141416] text-white border border-white/10 p-7">
      <h2 className="text-[24px] font-display mb-6">Ad Reaction Lab</h2>
      <div className="space-y-4">
        <input 
          placeholder="Experiment Name" 
          value={experimentName} 
          onChange={e => setExperimentName(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
        />
        <textarea 
          placeholder="Creative Content..." 
          value={creatives[0].content}
          onChange={e => setCreatives([{...creatives[0], content: e.target.value}])}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-32"
        />
        
        <div>
          <label className="block text-sm mb-2 text-white/50">Select Personas</label>
          <div className="flex flex-wrap gap-2">
            {personas.map(p => (
              <button 
                key={p.id}
                onClick={() => setSelectedPersonaIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                className={`px-3 py-1 rounded-full text-sm ${selectedPersonaIds.includes(p.id) ? 'bg-[#FF6B5B] text-black' : 'bg-white/10'}`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={runSimulation}
          disabled={isSimulating || selectedPersonaIds.length === 0}
          className="w-full bg-[#FF6B5B] text-black p-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          {isSimulating ? <RefreshCw className="animate-spin" /> : <Sparkles />} Run Simulation
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          <h3 className="font-display text-[18px]">Reaction Reports</h3>
          {Object.entries(results).map(([personaId, report]: [string, any]) => (
            <div key={personaId} className="bg-white/5 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-[#FF6B5B]">Persona: {personaId}</h4>
              <div className="text-sm">Average Score: {(Object.values(report).filter(v => typeof v === 'number') as number[]).reduce((a, b) => a + b, 0) / 10}</div>
              <p className="text-sm text-white/70">{report.rationale}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
