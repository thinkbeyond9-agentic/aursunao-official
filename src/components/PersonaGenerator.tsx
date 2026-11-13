import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, Save, User } from 'lucide-react';
import { SyntheticPersona, IcpConfiguration } from '../types';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export const PersonaGenerator: React.FC = () => {
  const [configurations, setConfigurations] = useState<IcpConfiguration[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<IcpConfiguration | null>(null);
  const [generatedPersona, setGeneratedPersona] = useState<SyntheticPersona | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchConfigs = async () => {
      const querySnapshot = await getDocs(collection(db, 'icpConfigurations'));
      setConfigurations(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IcpConfiguration)));
    };
    fetchConfigs();
  }, []);

  const generatePersona = async () => {
    if (!selectedConfig) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attributes: selectedConfig.attributes }),
      });
      const data = await response.json();
      setGeneratedPersona(data.persona);
    } catch (err) {
      console.error("Failed to generate persona:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="rounded-[24px] bg-[#141416] text-white border border-white/10 p-7">
      <h2 className="text-[24px] font-display mb-6">Synthetic Persona Generator</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[12px] font-mono mb-2 uppercase text-white/50">Select Configuration</label>
          <select 
            onChange={(e) => setSelectedConfig(configurations.find(c => c.id === e.target.value) || null)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-4"
          >
            <option value="">Select an ICP Configuration</option>
            {configurations.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          
          <button 
            onClick={generatePersona} 
            disabled={!selectedConfig || isGenerating}
            className="w-full bg-[#FF6B5B] text-black p-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Bot size={18} />}
            {isGenerating ? 'Generating...' : 'Generate Synthetic Persona'}
          </button>
        </div>

        {generatedPersona && (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="font-display text-[18px] mb-2">{generatedPersona.name}</h3>
            <p className="text-[14px] text-white/70 mb-4">{generatedPersona.bio}</p>
            <div className="text-[12px] font-mono text-white/50">Confidence: {generatedPersona.confidenceScore}%</div>
            <div className="text-[10px] font-mono text-white/30 mt-2">AI-Generated</div>
          </div>
        )}
      </div>
    </div>
  );
};
