import React, { useState } from 'react';
import { Story } from '../types';
import { StoryKnowledgeGraph } from './StoryKnowledgeGraph';
import { STORY_CATEGORIES, StoryCategory, getStoryCategory } from '../data/storyCategories';
import { MOOD_HEX_MAP } from './MoodHeatmap';
import { Network, Sparkles, Filter, ChevronRight, Layers, PieChart, Activity, Users } from 'lucide-react';

interface StoryCategorySectionProps {
  stories: Story[];
  lang: 'en' | 'hi';
  onOpenStory: (story: Story) => void;
  userIsRegistered?: boolean;
  onRequireRegister?: () => void;
}

export const StoryCategorySection: React.FC<StoryCategorySectionProps> = ({
  stories,
  lang,
  onOpenStory,
  userIsRegistered,
  onRequireRegister
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Compute stats per category
  const categoryStats = STORY_CATEGORIES.map(cat => {
    const matchingStories = stories.filter(s => getStoryCategory(s).id === cat.id);
    const count = matchingStories.length;
    const percentage = stories.length > 0 ? Math.round((count / stories.length) * 100) : 0;
    
    // Top mood
    const moodCounts: Record<string, number> = {};
    matchingStories.forEach(s => {
      const m = s.mood || 'burnout';
      moodCounts[m] = (moodCounts[m] || 0) + 1;
    });
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'burnout';

    return {
      ...cat,
      count,
      percentage,
      topMood
    };
  });

  return (
    <section id="story-knowledge-graph" className="mx-auto max-w-[1280px] px-5 md:px-8 pb-20" lang={lang}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B5B] animate-pulse" />
            <span className="font-sans text-[11px] uppercase tracking-widest text-[#FF6B5B] font-bold">
              {lang === 'en' ? 'Interactive Knowledge Graph & Categories' : 'कहानियों का ज्ञान ग्राफ व 8 श्रेणियां'}
            </span>
          </div>
          <h2 className="font-display text-[32px] md:text-[46px] leading-[0.95] mt-2 text-white">
            {lang === 'en' ? 'The Unspoken Story Constellation' : 'अनकही भावनाओं का ज्ञान नक्षत्र'}
          </h2>
          <p className="font-sans text-[13px] text-white/60 mt-2 max-w-[68ch] leading-relaxed">
            {lang === 'en'
              ? 'Every human vent is connected. Explore all 200+ anonymous stories mapped across 8 core life tension categories. Pan, zoom, drag nodes, and click any story to trace real emotional turning points.'
              : 'हर अनकही कहानी किसी न किसी धागे से जुड़ी है। 8 प्रमुख जीवन श्रेणियों में 200+ गुमनाम कहानियों को देखें। ज़ूम करें, नोड्स को ड्रैग करें और किसी भी कहानी पर क्लिक करके वास्तविक भावनात्मक मोड़ पढ़ें।'}
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 flex items-center gap-2 text-[11px] font-sans">
            <Network size={13} className="text-[#FF6B5B]" />
            <span className="text-white font-bold">{stories.length}</span>
            <span className="text-white/50">{lang === 'en' ? 'Story Nodes' : 'कहानियां'}</span>
          </div>
          <div className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 flex items-center gap-2 text-[11px] font-sans">
            <Layers size={13} className="text-[#06B6D4]" />
            <span className="text-white font-bold">{STORY_CATEGORIES.length}</span>
            <span className="text-white/50">{lang === 'en' ? 'Categories' : 'श्रेणियां'}</span>
          </div>
          <div className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 flex items-center gap-2 text-[11px] font-sans">
            <Activity size={13} className="text-[#10B981]" />
            <span className="text-white font-bold">12</span>
            <span className="text-white/50">{lang === 'en' ? 'Emotional Moods' : 'मूड्स'}</span>
          </div>
        </div>
      </div>

      {/* Main D3 Knowledge Graph Component */}
      <StoryKnowledgeGraph
        stories={stories}
        lang={lang}
        onOpenStory={onOpenStory}
        userIsRegistered={userIsRegistered}
        onRequireRegister={onRequireRegister}
      />

      {/* Category Taxonomy Breakdown Cards (Bento Grid) */}
      <div className="mt-12">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display text-[22px] text-white">
              {lang === 'en' ? 'Story Categories & Collective Voice Share' : 'कहानियों की 8 श्रेणियां और जन-आवाज़'}
            </h3>
            <p className="font-sans text-[12px] text-white/60 mt-0.5">
              {lang === 'en'
                ? 'Systematic classification of all stories by life friction domain, emotional intensity, and recurring themes.'
                : 'जीवन की चुनौतियों, भावनात्मक तीव्रता और विषयों के आधार पर कहानियों का व्यवस्थित वर्गीकरण।'}
            </p>
          </div>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {categoryStats.map((cat) => {
            return (
              <div
                key={cat.id}
                className="rounded-[20px] bg-[#141418] border border-white/10 p-4 flex flex-col justify-between hover:border-white/20 transition group relative overflow-hidden"
              >
                {/* Accent Top Glow Line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition"
                  style={{ backgroundColor: cat.color }}
                />

                <div>
                  {/* Top Bar: Icon, Category Name, Story Count */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-[12px] grid place-items-center text-lg shrink-0 border"
                        style={{
                          backgroundColor: `${cat.color}15`,
                          borderColor: `${cat.color}35`,
                          color: cat.color
                        }}
                      >
                        {cat.icon}
                      </div>
                      <div>
                        <h4 className="font-display text-[15px] text-white leading-tight group-hover:text-[#FF6B5B] transition">
                          {lang === 'en' ? cat.shortName : cat.nameHi.split(' ')[0]}
                        </h4>
                        <span className="text-[10px] font-mono text-white/40 block">
                          {cat.percentage}% of all stories
                        </span>
                      </div>
                    </div>

                    <span
                      className="text-[11px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      {cat.count}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-[11px] text-white/65 mt-3 leading-relaxed line-clamp-2">
                    {lang === 'en' ? cat.description : cat.descriptionHi}
                  </p>

                  {/* Theme Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {cat.sampleThemeTags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-sans px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-white/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Dominant Mood & Jump Action */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-sans">
                  <div className="flex items-center gap-1.5 text-white/60">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: MOOD_HEX_MAP[cat.topMood] || cat.color }}
                    />
                    <span className="capitalize text-[10px] font-mono text-white/50">{cat.topMood}</span>
                  </div>

                  <button
                    onClick={() => {
                      const el = document.getElementById('story-graph');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-[11px] font-sans text-white/60 hover:text-white flex items-center gap-0.5 transition cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'View in graph' : 'ग्राफ में देखें'}</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
