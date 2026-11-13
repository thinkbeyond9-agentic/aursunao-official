import React, { useState } from 'react';
import { Bot, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { ResearchScenario } from '../types';

interface ScenarioSimulatorProps {
  lang?: 'en' | 'hi';
}

const SCENARIO_TEMPLATES: ResearchScenario[] = [
  { id: 'first_exposure', title: 'First-Time Brand Exposure', context: 'User encounters the brand for the first time via social ad.' },
  { id: 'familiar_repeat', title: 'Familiar Brand & Repeat Purchase', context: 'User has purchased before and is re-evaluating loyalty.' },
  { id: 'competitor_switch', title: 'Competitive Comparison', context: 'User is comparing the brand directly against a market leader.' },
  { id: 'promo_test', title: 'Promotional Offer Testing', context: 'User is evaluating a discount or bundled offer.' },
  { id: 'crisis_response', title: 'Crisis Response Simulation', context: 'User is reacting to negative sentiment or brand news.' },
];

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ lang = 'en' }) => {
  const [selectedScenario, setSelectedScenario] = useState<ResearchScenario>(SCENARIO_TEMPLATES[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    // Simulation would call the /api/run-simulation endpoint with the selected scenario context
    try {
      const response = await fetch('/api/run-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          personas: [], // Would fetch selected cohort
          creatives: [], // Selected creative
          scenario: selectedScenario
        }),
      });
      const data = await response.json();
      setResults(data.reactionReport);
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="rounded-[24px] bg-[#141416] text-white border border-white/10 p-7">
      <h2 className="text-[24px] font-display mb-6">Scenario Simulator</h2>
      <div className="space-y-4">
        <label className="block text-sm text-white/50">Select Scenario Template</label>
        <select 
          onChange={e => setSelectedScenario(SCENARIO_TEMPLATES.find(s => s.id === e.target.value) || SCENARIO_TEMPLATES[0])}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
        >
          {SCENARIO_TEMPLATES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <div className="bg-white/5 p-4 rounded-xl text-sm text-white/70">
          {selectedScenario.context}
        </div>
        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className="w-full bg-[#FF6B5B] text-black p-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          {isSimulating ? <RefreshCw className="animate-spin" /> : <Layers />} Run Scenario Simulation
        </button>
      </div>
      
      {results && (
        <div className="mt-6 space-y-4">
          <h3 className="font-display text-[18px]">Simulation Results</h3>
          <pre className="bg-white/5 p-4 rounded-xl text-[12px] overflow-auto">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
