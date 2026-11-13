import React, { useState, useMemo } from 'react';
import { Save, Sliders, MapPin, Users, Target, BarChart2 } from 'lucide-react';
import { IcpDimension, IcpConfiguration } from '../types';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const DIMENSIONS: IcpDimension[] = [
  { id: 'geo', name: 'Geography', options: ['Country', 'State', 'District', 'City', 'Urban', 'Metro', 'Tier 1', 'Tier 2', 'Tier 3', 'Rural'] },
  { id: 'demo', name: 'Demographics', options: ['Age Band', 'Gender', 'Household Structure', 'Life Stage', 'Education'] },
  { id: 'socio', name: 'Socioeconomic', options: ['Occupation', 'Income Band', 'Household Income', 'Disposable Income', 'Affordability'] },
  { id: 'lang', name: 'Language & Culture', options: ['Preferred Language', 'Bilingual', 'Regional Context', 'Festivals', 'Food Culture', 'Purchase Customs'] },
  { id: 'psych', name: 'Psychographics', options: ['Motivations', 'Values', 'Aspirations', 'Risk Tolerance', 'Brand Trust', 'Personality', 'Attitudes'] },
  { id: 'behav', name: 'Behaviour', options: ['Purchase Frequency', 'Channels', 'Brand Loyalty', 'Shopping Habits', 'Digital Behaviour', 'Deal Sensitivity', 'Decision Roles'] },
  { id: 'cat', name: 'Category Engagement', options: ['Unaware', 'Aware', 'Researching', 'Considering', 'First Purchase', 'Repeat Purchase', 'Lapsed', 'Competitor-loyal'] },
  { id: 'emo', name: 'Emotional Factors', options: ['Urgency', 'Excitement', 'Scepticism', 'Convenience', 'Uncertainty', 'Aspiration', 'Situational Needs'] },
  { id: 'media', name: 'Media & Discovery', options: ['Social Media', 'Search', 'YouTube', 'Creators', 'Television', 'Messaging', 'Ecommerce', 'Offline Discovery'] },
  { id: 'prod', name: 'Product Variables', options: ['Use Cases', 'Experience', 'Value', 'Outcomes', 'Objections', 'Switching Triggers'] },
];

export const SyntheticIcpBuilder: React.FC = () => {
  const [name, setName] = useState('New ICP Configuration');
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string[] }>(
    DIMENSIONS.reduce((acc, d) => ({ ...acc, [d.id]: [] }), {})
  );
  const [sampleSize, setSampleSize] = useState(100);

  const stats = useMemo(() => {
    // Simplified stats calculation for now
    const filteredUniverse = DIMENSIONS.reduce((acc, d) => acc * (selectedAttributes[d.id]?.length || 1), 1);
    return { filteredUniverse };
  }, [selectedAttributes]);

  const saveConfiguration = async () => {
    const config: Omit<IcpConfiguration, 'id'> = {
      name,
      attributes: Object.entries(selectedAttributes).flatMap(([dimId, vals]) => (vals as string[]).map(v => ({ dimensionId: dimId, value: v }))),
      sampleSize,
      quotaManagement: {} 
    };
    await addDoc(collection(db, 'icpConfigurations'), config);
    alert('Configuration saved!');
  };

  return (
    <div className="rounded-[24px] bg-[#141416] text-white border border-white/10 p-7">
      <h2 className="text-[24px] font-display mb-6">Synthetic ICP Builder</h2>
      
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 space-y-4">
          <input 
            value={name} onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-4"
            placeholder="Configuration Name"
          />
          <div className="grid grid-cols-2 gap-4">
            {DIMENSIONS.map(dim => (
              <div key={dim.id} className="bg-white/5 rounded-xl p-4">
                <label className="block text-[12px] font-mono mb-2 uppercase text-white/50">{dim.name}</label>
                <div className="flex flex-wrap gap-1">
                  {dim.options.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setSelectedAttributes(prev => ({
                        ...prev,
                        [dim.id]: prev[dim.id].includes(opt) ? prev[dim.id].filter(i => i !== opt) : [...(prev[dim.id] || []), opt]
                      }))}
                      className={`px-2 py-0.5 rounded-full text-[10px] ${selectedAttributes[dim.id]?.includes(opt) ? 'bg-[#FF6B5B] text-black' : 'bg-white/10'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="font-display text-[18px] mb-4">Universe Stats</h3>
          <p className="text-[14px] font-bold text-[#25D366] mb-4">Selected Combinations: {stats.filteredUniverse.toLocaleString()}</p>
          
          <label className="block text-[12px] font-mono mb-2 uppercase text-white/50">Sample Size</label>
          <input type="range" min="10" max="1000" value={sampleSize} onChange={(e) => setSampleSize(Number(e.target.value))} className="w-full mb-4" />
          <p className="text-[14px] mb-6">{sampleSize} personas</p>
          
          <button onClick={saveConfiguration} className="w-full bg-[#FF6B5B] text-black p-3 rounded-xl font-bold flex items-center justify-center gap-2">
            <Save size={18} /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
