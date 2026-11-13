import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { BrandResearchWorkspace } from '../types';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const ResearchWorkspaceManager: React.FC = () => {
  const [workspace, setWorkspace] = useState<Partial<BrandResearchWorkspace>>({
    brandName: '',
    brandCategory: '',
    productDescription: '',
    targetAudience: '',
    competitors: []
  });
  const [newCompetitor, setNewCompetitor] = useState('');

  const saveWorkspace = async () => {
    if (!workspace.brandName) return;
    await addDoc(collection(db, 'workspaces'), {
      ...workspace,
      userId: 'anonymous' // Placeholder for now
    });
    alert('Workspace saved!');
  };

  const generateFictionalBrand = async () => {
    try {
      const response = await fetch('/api/generate-fictional-brand', { method: 'POST' });
      const data = await response.json();
      setWorkspace({
        brandName: data.brand.brandName,
        brandCategory: data.brand.brandCategory,
        productDescription: data.brand.productDescription,
        targetAudience: data.brand.targetAudience,
        competitors: []
      });
    } catch (err) {
      console.error("Failed to generate brand:", err);
    }
  };

  return (
    <div className="rounded-[24px] bg-[#141416] text-white border border-white/10 p-7">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[24px] font-display">Brand Research Workspace</h2>
        <button onClick={generateFictionalBrand} className="text-[#FF6B5B] text-sm hover:underline">
          Generate Fictional Brand
        </button>
      </div>
      
      <div className="space-y-4">
        <input 
          placeholder="Brand Name" 
          value={workspace.brandName} 
          onChange={e => setWorkspace({...workspace, brandName: e.target.value})}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
        />
        <input 
          placeholder="Brand Category" 
          value={workspace.brandCategory} 
          onChange={e => setWorkspace({...workspace, brandCategory: e.target.value})}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
        />
        <textarea 
          placeholder="Product Description" 
          value={workspace.productDescription} 
          onChange={e => setWorkspace({...workspace, productDescription: e.target.value})}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-24"
        />
        
        <div className="border-t border-white/10 pt-4 mt-4">
          <h3 className="text-lg font-display mb-2">Campaign Variants</h3>
          <div className="flex gap-2">
            <input 
              placeholder="Headline / Tagline" 
              value={newCompetitor} // reusing for now
              onChange={e => setNewCompetitor(e.target.value)}
              className="flex-grow bg-white/5 border border-white/10 rounded-xl p-3"
            />
            <button 
              onClick={() => {
                setWorkspace({...workspace, competitors: [...(workspace.competitors || []), newCompetitor]}); // reusing competitors array for variants for simplicity in this turn
                setNewCompetitor('');
              }}
              className="bg-white/10 p-3 rounded-xl"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <input 
            placeholder="Add Competitor" 
            value={newCompetitor} 
            onChange={e => setNewCompetitor(e.target.value)}
            className="flex-grow bg-white/5 border border-white/10 rounded-xl p-3"
          />
          <button 
            onClick={() => {
              setWorkspace({...workspace, competitors: [...(workspace.competitors || []), newCompetitor]});
              setNewCompetitor('');
            }}
            className="bg-white/10 p-3 rounded-xl"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {workspace.competitors?.map((c, i) => (
            <span key={i} className="flex items-center gap-1 bg-[#FF6B5B]/20 text-[#FF6B5B] px-3 py-1 rounded-full text-sm">
              {c}
              <button onClick={() => setWorkspace({...workspace, competitors: workspace.competitors?.filter((_, idx) => idx !== i)})}>
                <Trash2 size={14} />
              </button>
            </span>
          ))}
        </div>

        <button 
          onClick={saveWorkspace}
          className="w-full bg-[#FF6B5B] text-black p-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Save size={18} /> Save Workspace
        </button>
      </div>
    </div>
  );
};
