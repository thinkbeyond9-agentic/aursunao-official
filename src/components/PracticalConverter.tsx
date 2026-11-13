import React, { useState } from 'react';
import { Story, PracticalOutputs } from '../types';
import { Mail, CheckSquare, BookOpen, Copy, Check, Sparkles, RefreshCw, UserCheck, Clock, ShieldCheck } from 'lucide-react';

interface PracticalConverterProps {
  story: Story;
  lang: 'en' | 'hi';
  onUpdateStory?: (updated: Story) => void;
  darkTheme?: boolean;
}

export const PracticalConverter: React.FC<PracticalConverterProps> = ({
  story,
  lang,
  onUpdateStory,
  darkTheme = false
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'professional' | 'habits'>('story');
  const [audience, setAudience] = useState<string>('Client');
  const [loadingMode, setLoadingMode] = useState<'professional' | 'habits' | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [completedHabits, setCompletedHabits] = useState<Record<string, boolean>>({});

  const professionalDraft = story.practicalOutputs?.professionalDraft;
  const habitChecklist = story.practicalOutputs?.habitChecklist;

  const handleFetchProfessionalDraft = async (targetAudience: string = audience) => {
    setLoadingMode('professional');
    try {
      const res = await fetch('/api/practical-transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'professional_draft',
          narrative: story.structured?.narrative || story.transcript,
          transcript: story.transcript,
          title: story.title,
          audience: targetAudience
        })
      });
      const data = await res.json();
      if (data.success && data.output) {
        const updatedOutputs: PracticalOutputs = {
          ...story.practicalOutputs,
          professionalDraft: {
            subject: data.output.subject || 'Follow-up regarding our deliverables and priorities',
            body: data.output.body || '',
            audience: targetAudience
          }
        };
        const updatedStory: Story = {
          ...story,
          practicalOutputs: updatedOutputs
        };
        if (onUpdateStory) {
          onUpdateStory(updatedStory);
        }
      }
    } catch (err) {
      console.error('Error generating professional draft:', err);
    } finally {
      setLoadingMode(null);
    }
  };

  const handleFetchHabitChecklist = async () => {
    setLoadingMode('habits');
    try {
      const res = await fetch('/api/practical-transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'habit_checklist',
          narrative: story.structured?.narrative || story.transcript,
          transcript: story.transcript,
          title: story.title
        })
      });
      const data = await res.json();
      if (data.success && data.output) {
        const updatedOutputs: PracticalOutputs = {
          ...story.practicalOutputs,
          habitChecklist: {
            title: data.output.title || 'Actionable Habit Checklist',
            items: data.output.items || []
          }
        };
        const updatedStory: Story = {
          ...story,
          practicalOutputs: updatedOutputs
        };
        if (onUpdateStory) {
          onUpdateStory(updatedStory);
        }
      }
    } catch (err) {
      console.error('Error generating habit checklist:', err);
    } finally {
      setLoadingMode(null);
    }
  };

  const handleTabChange = (tab: 'story' | 'professional' | 'habits') => {
    setActiveTab(tab);
    if (tab === 'professional' && !professionalDraft) {
      handleFetchProfessionalDraft(audience);
    } else if (tab === 'habits' && !habitChecklist) {
      handleFetchHabitChecklist();
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleHabit = (id: string) => {
    setCompletedHabits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = habitChecklist?.items
    ? habitChecklist.items.filter(item => completedHabits[item.id]).length
    : 0;
  const totalCount = habitChecklist?.items?.length || 0;

  return (
    <div className={`rounded-[20px] border transition-all duration-200 ${
      darkTheme
        ? 'bg-white/[0.04] border-white/15 text-white'
        : 'bg-[#F9F9F7] border-black/10 text-black'
    } p-4 md:p-5 mt-4`}>
      {/* Segmented Mode Selector */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/10">
          <button
            type="button"
            onClick={() => handleTabChange('story')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-sans font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'story'
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <BookOpen size={13} />
            <span>{lang === 'en' ? 'Structured Story' : 'संरचित कहानी'}</span>
          </button>

          <button
            type="button"
            id="tab-professional-draft"
            onClick={() => handleTabChange('professional')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-sans font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'professional'
                ? 'bg-[#FF6B5B] text-black shadow-sm font-bold'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <Mail size={13} />
            <span>{lang === 'en' ? 'Professional Draft' : 'पेशेवर ड्राफ्ट'}</span>
          </button>

          <button
            type="button"
            id="tab-habit-checklist"
            onClick={() => handleTabChange('habits')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-sans font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'habits'
                ? 'bg-[#FFD166] text-black shadow-sm font-bold'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <CheckSquare size={13} />
            <span>{lang === 'en' ? 'Habit Checklist' : 'आदत चेकलिस्ट'}</span>
          </button>
        </div>

        <div className="text-[11px] font-sans opacity-50 flex items-center gap-1">
          <Sparkles size={12} className="text-[#FF6B5B]" />
          <span>{lang === 'en' ? 'Turn rants into action' : 'गुस्से को समाधान में बदलें'}</span>
        </div>
      </div>

      {/* Tab 1: Default Structured Story view */}
      {activeTab === 'story' && (
        <div className="pt-3 fade-up">
          <div className="font-serif text-[16px] leading-[1.5] italic opacity-95">
            "{story.structured?.narrative || story.transcript}"
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 font-sans text-[11px]">
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <span className="opacity-50 text-[10px] uppercase font-mono block">{lang === 'en' ? 'Turning Point' : 'मोड़'}</span>
              <span className="font-semibold mt-0.5 block leading-snug">{story.structured?.turning || 'Spoken out loud'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <span className="opacity-50 text-[10px] uppercase font-mono block">{lang === 'en' ? 'Core Insight' : 'मुख्य सीख'}</span>
              <span className="font-semibold mt-0.5 block leading-snug">{story.structured?.insight || 'Clarity gained'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 col-span-2 sm:col-span-1">
              <span className="opacity-50 text-[10px] uppercase font-mono block">{lang === 'en' ? 'Mood' : 'मूड'}</span>
              <span className="font-semibold mt-0.5 block leading-snug capitalize">{story.mood || story.emotion}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Professional Draft view */}
      {activeTab === 'professional' && (
        <div className="pt-3 fade-up">
          {/* Audience picker */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-[11px] font-sans">
              <span className="opacity-60">{lang === 'en' ? 'Recipient:' : 'प्राप्तकर्ता:'}</span>
              {['Client', 'Manager', 'Colleague', 'Vendor'].map(aud => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => {
                    setAudience(aud);
                    handleFetchProfessionalDraft(aud);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition cursor-pointer ${
                    audience === aud
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>

            {professionalDraft && (
              <button
                type="button"
                onClick={() => handleFetchProfessionalDraft(audience)}
                disabled={loadingMode === 'professional'}
                className="text-[11px] font-sans opacity-60 hover:opacity-100 flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw size={11} className={loadingMode === 'professional' ? 'animate-spin' : ''} />
                <span>{lang === 'en' ? 'Regenerate' : 'फिर बनाएं'}</span>
              </button>
            )}
          </div>

          {loadingMode === 'professional' ? (
            <div className="p-6 rounded-[16px] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 animate-pulse text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-[12px] font-mono text-[#FF6B5B]">
                <Sparkles size={14} className="animate-spin" />
                {lang === 'en' ? 'Translating emotional vent into diplomatic communication...' : 'भावनाओं को औपचारिक संदेश में बदला जा रहा है...'}
              </div>
              <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-1/2 mx-auto" />
              <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-3/4 mx-auto" />
            </div>
          ) : professionalDraft ? (
            <div className="rounded-[16px] bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 p-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/5 text-[12px]">
                <div className="font-mono text-[11px] opacity-60">
                  <span className="font-bold">Subject:</span> {professionalDraft.subject}
                </div>
                <button
                  type="button"
                  id="copy-professional-draft-btn"
                  onClick={() => handleCopy(`Subject: ${professionalDraft.subject}\n\n${professionalDraft.body}`, 'draft')}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-[#FF6B5B] hover:text-black text-[11px] font-sans font-medium flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedText === 'draft' ? (
                    <>
                      <Check size={12} className="text-emerald-500" />
                      <span>{lang === 'en' ? 'Copied' : 'कॉपी हुआ'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>{lang === 'en' ? 'Copy Message' : 'कॉपी करें'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="font-sans text-[13px] leading-relaxed whitespace-pre-line opacity-90">
                {professionalDraft.body}
              </div>

              <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center gap-2 text-[11px] opacity-50 font-sans">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>{lang === 'en' ? 'De-escalated tone • Assertive boundaries • Zero defensive wording' : 'संयमित लहज़ा • स्पष्ट सीमाएं • कोई आक्रामक शब्द नहीं'}</span>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Tab 3: Habit Checklist view */}
      {activeTab === 'habits' && (
        <div className="pt-3 fade-up">
          <div className="flex items-center justify-between mb-3 text-[12px]">
            <div className="font-sans font-semibold flex items-center gap-2">
              <span>{habitChecklist?.title || (lang === 'en' ? 'Burnout & Overwhelm Antidote' : 'तनाव मुक्ति चेकलिस्ट')}</span>
              {totalCount > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
                  {completedCount} / {totalCount} {lang === 'en' ? 'Done' : 'पूर्ण'}
                </span>
              )}
            </div>

            {habitChecklist && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = (habitChecklist.items || [])
                      .map((item, idx) => `${idx + 1}. [${completedHabits[item.id] ? 'X' : ' '}] ${item.action} (${item.timeFrame})`)
                      .join('\n');
                    handleCopy(text, 'checklist');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-[#FFD166] hover:text-black text-[11px] font-sans font-medium flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedText === 'checklist' ? (
                    <>
                      <Check size={12} className="text-emerald-500" />
                      <span>{lang === 'en' ? 'Copied' : 'कॉपी हुआ'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>{lang === 'en' ? 'Copy Checklist' : 'कॉपी करें'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleFetchHabitChecklist}
                  disabled={loadingMode === 'habits'}
                  className="text-[11px] font-sans opacity-60 hover:opacity-100 flex items-center gap-1 transition cursor-pointer"
                >
                  <RefreshCw size={11} className={loadingMode === 'habits' ? 'animate-spin' : ''} />
                </button>
              </div>
            )}
          </div>

          {loadingMode === 'habits' ? (
            <div className="p-6 rounded-[16px] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 animate-pulse text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-[12px] font-mono text-[#FFD166]">
                <Sparkles size={14} className="animate-spin" />
                {lang === 'en' ? 'Extracting actionable micro-habits from emotional vent...' : 'वेंट से व्यावहारिक आदतें निकाली जा रही हैं...'}
              </div>
              <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-1/2 mx-auto" />
              <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-3/4 mx-auto" />
            </div>
          ) : habitChecklist?.items ? (
            <div className="space-y-2">
              {habitChecklist.items.map((item, idx) => {
                const isDone = !!completedHabits[item.id];
                return (
                  <div
                    key={item.id || idx}
                    onClick={() => toggleHabit(item.id)}
                    className={`p-3 rounded-[14px] border transition cursor-pointer flex items-start gap-3 ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/20 opacity-75'
                        : 'bg-white dark:bg-black/30 border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggleHabit(item.id)}
                      className="mt-0.5 accent-emerald-500 w-4 h-4 rounded cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-sans text-[13px] font-medium leading-snug ${
                          isDone ? 'line-through text-emerald-600 dark:text-emerald-400' : ''
                        }`}>
                          {item.action}
                        </span>
                        {item.timeFrame && (
                          <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 opacity-75 flex items-center gap-1">
                            <Clock size={10} />
                            {item.timeFrame}
                          </span>
                        )}
                      </div>
                      {item.why && (
                        <div className="mt-1 font-sans text-[11px] opacity-60 leading-tight">
                          {item.why}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
