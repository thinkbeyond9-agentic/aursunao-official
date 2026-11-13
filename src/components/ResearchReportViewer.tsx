import React, { useState } from 'react';
import { FileCheck2, RefreshCw, Download } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface ResearchReportViewerProps {
  simulationResults: any;
  experimentId: string;
}

export const ResearchReportViewer: React.FC<ResearchReportViewerProps> = ({ simulationResults, experimentId }) => {
  const [report, setReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experimentId, simulationResults }),
      });
      const data = await response.json();
      setReport(data.report);
      
      // Save report
      await addDoc(collection(db, 'reports'), {
        ...data.report,
        experimentId,
        createdAt: Date.now()
      });
    } catch (err) {
      console.error("Failed to generate report:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="rounded-[24px] bg-[#141416] text-white border border-white/10 p-7">
      <h2 className="text-[24px] font-display mb-6">Research Report</h2>
      
      {!report && (
        <button 
          onClick={generateReport}
          disabled={isGenerating}
          className="w-full bg-[#FF6B5B] text-black p-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          {isGenerating ? <RefreshCw className="animate-spin" /> : <FileCheck2 size={18} />}
          {isGenerating ? 'Synthesizing Insights...' : 'Generate Executive Report'}
        </button>
      )}

      {report && (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-bold text-[#FF6B5B] mb-2">Executive Summary</h3>
            <p className="text-white/80">{report.summary}</p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-[#FF6B5B] mb-2">Key Insights</h3>
            <ul className="list-disc pl-5 space-y-1">
              {report.topInsights.map((i: string, idx: number) => <li key={idx} className="text-white/80">{i}</li>)}
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-bold text-[#FF6B5B] mb-2">Recommendations</h3>
            <ul className="list-decimal pl-5 space-y-1">
              {report.recommendations.map((r: string, idx: number) => <li key={idx} className="text-white/80">{r}</li>)}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};
