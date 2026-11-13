import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  Lock,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Check,
  LogOut,
  ExternalLink,
  Compass,
  Lightbulb,
  Heart,
  Tag,
  Layers,
  Filter
} from 'lucide-react';
import { Story } from '../types';
import { MOOD_COLORS } from '../data';
import { MOOD_EMOJIS } from '../App';

interface StoriesVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  userIsRegistered: boolean;
  userName?: string;
  secondsToInactivityLogout?: number;
  lang: 'en' | 'hi';
  onOpenStory: (story: Story) => void;
  onRequireLogin: (story?: Story) => void;
  onLogout?: () => void;
  onClap?: (storyId: string) => void;
}

export const StoriesVaultModal: React.FC<StoriesVaultModalProps> = ({
  isOpen,
  onClose,
  stories,
  userIsRegistered,
  userName = 'Member',
  secondsToInactivityLogout = 300,
  lang = 'en',
  onOpenStory,
  onRequireLogin,
  onLogout,
  onClap
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedStoryIds, setExpandedStoryIds] = useState<Set<string>>(new Set());
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(30);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Unique types from current dataset
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    stories.forEach((s) => {
      if (s.type) types.add(s.type);
    });
    return Array.from(types);
  }, [stories]);

  // Unique moods
  const availableMoods = useMemo(() => {
    const moods = new Set<string>();
    stories.forEach((s) => {
      if (s.mood) moods.add(s.mood.toLowerCase());
    });
    return Array.from(moods);
  }, [stories]);

  // Filtered stories
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle =
          story.title?.toLowerCase().includes(q) ||
          story.titleHi?.toLowerCase().includes(q);
        const matchesHook =
          story.hook?.toLowerCase().includes(q) ||
          story.hookHi?.toLowerCase().includes(q);
        const matchesConflict = story.structured?.conflict?.toLowerCase().includes(q);
        const matchesThemes = story.themes?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesHook && !matchesConflict && !matchesThemes) {
          return false;
        }
      }

      // Mood
      if (selectedMood !== 'all' && story.mood?.toLowerCase() !== selectedMood.toLowerCase()) {
        return false;
      }

      // Type
      if (selectedType !== 'all' && story.type?.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [stories, searchQuery, selectedMood, selectedType]);

  // Toggle individual card expansion
  const toggleExpandStory = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedStoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle expand all
  const handleToggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedStoryIds(new Set());
      setIsAllExpanded(false);
    } else {
      const allIds = new Set(filteredStories.map((s) => s.id));
      setExpandedStoryIds(allIds);
      setIsAllExpanded(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="stories-vault-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="stories-vault-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stories-vault-modal-title"
        className="bg-[#121217] border border-white/15 rounded-[22px] max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.02] flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B5B]/15 border border-[#FF6B5B]/30 flex items-center justify-center text-[#FF6B5B] shrink-0 shadow-[0_0_15px_rgba(255,107,91,0.2)]">
                <Layers size={20} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 id="stories-vault-modal-title" className="font-display text-[18px] sm:text-[22px] font-bold text-white tracking-tight">
                    {lang === 'en' ? 'Anonymous Stories Vault' : 'गुमनाम कहानियां संग्रह'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6B5B]/20 text-[#FF6B5B] border border-[#FF6B5B]/30">
                    {stories.length} {lang === 'en' ? 'Stories' : 'कहानियां'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-white/70">
                    {lang === 'en' ? 'Expandable Cards' : 'विस्तार योग्य'}
                  </span>
                </div>
                <p className="font-sans text-[12px] text-white/60 mt-0.5">
                  {lang === 'en'
                    ? 'Explore unfiltered personal narratives with expandable turning points, dilemmas, and emotional insights.'
                    : 'निजी संघर्ष, मोड़ और सीख के साथ सभी अनफिल्टर्ड कहानियों को विस्तार से पढ़ें।'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="close-stories-vault-btn"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition cursor-pointer"
                title={lang === 'en' ? 'Close (ESC)' : 'बंद करें (ESC)'}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* SEARCH & CONTROLS TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-white/5">
            {/* Search input */}
            <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'Search by title, conflict, topic, or keyword...'
                    : 'शीर्षक, संघर्ष या कीवर्ड द्वारा खोजें...'
                }
                className="w-full bg-black/40 border border-white/10 rounded-full pl-9 pr-3 py-1.5 text-[12px] font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B5B]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-[11px]"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Quick Actions: Expand All / Collapse All */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleToggleExpandAll}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-sans text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer"
                title={isAllExpanded ? 'Collapse all story cards' : 'Expand all story cards to show details'}
              >
                {isAllExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                <span>{isAllExpanded ? (lang === 'en' ? 'Collapse All' : 'सभी संक्षिप्त करें') : (lang === 'en' ? 'Expand All Details' : 'सभी विवरण खोलें')}</span>
              </button>
            </div>
          </div>

          {/* FILTER PILLS */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-sans">
            <span className="text-white/40 font-mono text-[10px] mr-1 flex items-center gap-1">
              <Filter size={10} />
              {lang === 'en' ? 'Mood:' : 'मूड:'}
            </span>
            <button
              type="button"
              onClick={() => setSelectedMood('all')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono transition cursor-pointer ${
                selectedMood === 'all'
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'All Moods' : 'सभी मूड'}
            </button>
            {availableMoods.slice(0, 7).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMood(m === selectedMood ? 'all' : m)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono capitalize transition cursor-pointer flex items-center gap-1 ${
                  selectedMood === m
                    ? 'bg-[#FF6B5B] text-black font-bold'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                <span>{MOOD_EMOJIS[m] || '•'}</span>
                <span>{m}</span>
              </button>
            ))}

            {/* Category / Type separator */}
            <span className="text-white/20 mx-1 hidden sm:inline">|</span>
            <span className="text-white/40 font-mono text-[10px] mr-1 hidden sm:inline">
              {lang === 'en' ? 'Category:' : 'श्रेणी:'}
            </span>
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono transition cursor-pointer hidden sm:inline ${
                selectedType === 'all'
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'All' : 'सभी'}
            </button>
            {availableTypes.slice(0, 4).map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => setSelectedType(tp === selectedType ? 'all' : tp)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono capitalize transition cursor-pointer hidden sm:inline ${
                  selectedType === tp
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {tp}
              </button>
            ))}
          </div>
        </div>

        {/* LOGIN / MEMBERSHIP BANNER INSIDE MODAL */}
        <div className="px-4 sm:px-5 py-2.5 bg-black/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-[12px] font-sans">
          {!userIsRegistered ? (
            <>
              <div className="flex items-center gap-2 text-white/80">
                <span className="w-6 h-6 rounded-full bg-[#FF6B5B]/15 text-[#FF6B5B] flex items-center justify-center shrink-0">
                  <Lock size={12} />
                </span>
                <span>
                  {lang === 'en'
                    ? 'Story previews, turning points & insights are readable for free. Log in to open complete uncut narratives.'
                    : 'संक्षिप्त विवरण, मोड़ और सीख सभी के लिए खुली हैं। पूरी कहानी पढ़ने के लिए मुफ्त लॉग इन करें।'}
                </span>
              </div>
              <button
                type="button"
                id="vault-modal-login-btn"
                onClick={() => onRequireLogin()}
                className="px-3.5 py-1 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer shrink-0 ml-auto"
              >
                <Lock size={11} />
                <span>{lang === 'en' ? 'Free Log In / Register' : 'लॉग इन / रजिस्टर'}</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[#25D366]">
                <span className="w-5 h-5 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                  <Check size={12} />
                </span>
                <span className="text-white/90">
                  {lang === 'en'
                    ? `Logged in as ${userName}. Full narratives unlocked.`
                    : `${userName} के रूप में लॉग इन हैं। सभी कहानियां अनलॉक हैं।`}
                </span>
                <span className="text-[10px] font-mono text-white/50 hidden sm:inline">
                  (auto-lock in {Math.floor(secondsToInactivityLogout / 60)}m {secondsToInactivityLogout % 60}s)
                </span>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white/80 text-[11px] flex items-center gap-1 transition cursor-pointer ml-auto"
                >
                  <LogOut size={11} />
                  <span>{lang === 'en' ? 'Logout' : 'लॉग आउट'}</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* MODAL BODY: EXPANDABLE STORIES LIST */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 font-sans">
          {filteredStories.length === 0 ? (
            <div className="py-16 text-center text-white/60">
              <Sparkles size={24} className="mx-auto text-[#FF6B5B] mb-2" />
              <p className="font-display text-[16px] text-white">
                {lang === 'en' ? 'No matching stories found' : 'कोई कहानी नहीं मिली'}
              </p>
              <p className="text-[12px] text-white/40 mt-1">
                {lang === 'en' ? 'Try adjusting your search query or filters.' : 'कृपया फ़िल्टर या खोज शब्द बदलें।'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMood('all');
                  setSelectedType('all');
                }}
                className="mt-3 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white text-[11px]"
              >
                {lang === 'en' ? 'Clear Filters' : 'फ़िल्टर हटाएं'}
              </button>
            </div>
          ) : (
            filteredStories.slice(0, visibleCount).map((story, idx) => {
              const isExpanded = expandedStoryIds.has(story.id) || isAllExpanded;
              const moodEmoji = MOOD_EMOJIS[story.mood?.toLowerCase()] || '💫';
              const moodColorClass = MOOD_COLORS[story.mood?.toLowerCase()] || 'bg-white/10 text-white';

              return (
                <div
                  key={`${story.id}-${idx}`}
                  id={`vault-story-${story.id}`}
                  className={`rounded-[16px] border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-white/[0.05] border-[#FF6B5B]/50 shadow-[0_4px_20px_rgba(255,107,91,0.12)]'
                      : 'bg-[#18181D] hover:bg-[#1E1E24] border-white/10'
                  }`}
                >
                  {/* STORY CARD HEADER (ALWAYS VISIBLE & CLICKABLE TO EXPAND) */}
                  <div
                    onClick={() => toggleExpandStory(story.id)}
                    className="p-3 sm:p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Mood Emoji */}
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0 mt-0.5">
                        {moodEmoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Title & Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-display text-[14px] sm:text-[15.5px] font-semibold text-white leading-snug hover:text-[#FF6B5B] transition-colors">
                            {lang === 'en' ? story.title : story.titleHi}
                          </h4>
                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${moodColorClass}`}
                          >
                            {story.mood}
                          </span>
                          {story.type && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                              {story.type}
                            </span>
                          )}
                        </div>

                        {/* Hook / Excerpt Preview */}
                        <p className="text-[12px] font-sans text-white/70 mt-1 line-clamp-2 leading-relaxed">
                          {lang === 'en' ? story.hook || story.structured?.conflict : story.hookHi || story.structured?.conflict}
                        </p>

                        {/* Quick metadata chips */}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] font-mono text-white/40">
                          {story.location && (
                            <span>📍 {story.location}</span>
                          )}
                          {story.claps > 0 && (
                            <span>👏 {story.claps}</span>
                          )}
                          {story.helped > 0 && (
                            <span>❤️ {story.helped} {lang === 'en' ? 'helped' : 'मदद मिली'}</span>
                          )}
                          <span className="text-[#FF6B5B] font-sans font-medium">
                            {isExpanded
                              ? (lang === 'en' ? 'Hide details' : 'विवरण छिपाएं')
                              : (lang === 'en' ? 'Click to expand turning point & insight ↓' : 'मोड़ व सीख देखने के लिए खोलें ↓')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side controls: Expand Chevron + Lock status */}
                    <div className="flex items-center gap-2 shrink-0 self-center">
                      {!userIsRegistered ? (
                        <span
                          className="w-7 h-7 rounded-full bg-black/40 border border-[#FF6B5B]/30 text-[#FF6B5B] flex items-center justify-center"
                          title={lang === 'en' ? 'Login required for full story' : 'पूरी कहानी के लिए लॉगिन आवश्यक'}
                        >
                          <Lock size={12} />
                        </span>
                      ) : (
                        <span
                          className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-white/70 flex items-center justify-center"
                          title={lang === 'en' ? 'Unlocked' : 'अनलॉक'}
                        >
                          <BookOpen size={12} />
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => toggleExpandStory(story.id, e)}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition cursor-pointer"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDABLE BODY CONTENT ("DISPLAY MORE CONTENT MAKE IT EXPANDABLE") */}
                  {isExpanded && (
                    <div className="px-3 sm:px-4 pb-4 pt-2 border-t border-white/10 space-y-3 bg-black/25 animate-fadeIn">
                      {/* 1. Situation & Setting */}
                      {story.structured?.setting && (
                        <div className="text-[12px] font-sans text-white/70 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                          <span className="text-white/40 font-mono text-[10px] uppercase block mb-0.5">
                            {lang === 'en' ? 'Context & Setting:' : 'संदर्भ एवं परिवेश:'}
                          </span>
                          <p>{story.structured.setting}</p>
                        </div>
                      )}

                      {/* 2. The Core Conflict / Dilemma */}
                      {story.structured?.conflict && (
                        <div className="text-[12px] font-sans text-white/80 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                          <span className="text-[#FF5C5C] font-mono text-[10px] uppercase font-bold block mb-0.5">
                            {lang === 'en' ? 'Core Tension & Dilemma:' : 'मुख्य द्वंद्व एवं तनाव:'}
                          </span>
                          <p className="leading-relaxed">{story.structured.conflict}</p>
                        </div>
                      )}

                      {/* 3. The Turning Point (High-Contrast Accent Box) */}
                      {story.structured?.turning && (
                        <div className="rounded-xl bg-[#FF6B5B]/10 border border-[#FF6B5B]/30 p-3 text-[12px] font-sans text-white">
                          <div className="flex items-center gap-1.5 text-[#FF6B5B] font-mono text-[11px] font-bold mb-1">
                            <Compass size={13} />
                            <span>{lang === 'en' ? 'The Turning Point:' : 'महत्वपूर्ण मोड़:'}</span>
                          </div>
                          <p className="italic text-white/90 leading-relaxed font-serif">
                            "{story.structured.turning}"
                          </p>
                        </div>
                      )}

                      {/* 4. Emotional Insight & Reflection */}
                      {story.structured?.insight && (
                        <div className="rounded-xl bg-amber-400/10 border border-amber-400/25 p-3 text-[12px] font-sans text-white">
                          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold mb-1">
                            <Lightbulb size={13} />
                            <span>{lang === 'en' ? 'Key Emotional Takeaway:' : 'भावनात्मक सीख / निष्कर्ष:'}</span>
                          </div>
                          <p className="text-white/85 leading-relaxed">
                            {story.structured.insight}
                          </p>
                        </div>
                      )}

                      {/* 5. Themes & Tags */}
                      {story.themes && story.themes.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-mono text-white/40">{lang === 'en' ? 'Themes:' : 'थीम:'}</span>
                          {story.themes.map((theme, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/60 text-[10px] font-mono"
                            >
                              #{theme}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 6. Action Bar: Open Full Story / Login Gate */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/5">
                        <div className="flex items-center gap-3 text-[11px] font-mono text-white/50">
                          {onClap && (
                            <button
                              type="button"
                              onClick={() => onClap(story.id)}
                              className="hover:text-[#FF6B5B] flex items-center gap-1 transition cursor-pointer"
                            >
                              👏 {story.claps} {lang === 'en' ? 'Claps' : 'तालियां'}
                            </button>
                          )}
                          <span>
                            {lang === 'en' ? `Author: ${story.author}` : `लेखक: ${story.author}`}
                          </span>
                        </div>

                        {userIsRegistered ? (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenStory(story);
                            }}
                            className="px-4 py-1.5 rounded-full bg-[#FF6B5B] hover:bg-[#FF5C5C] text-black font-bold font-sans text-[11px] flex items-center gap-1.5 transition cursor-pointer shadow-md"
                          >
                            <span>{lang === 'en' ? 'Read Complete Uncut Narrative' : 'पूरी कहानी पढ़ें'}</span>
                            <ArrowRight size={13} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onRequireLogin(story);
                            }}
                            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-[#FF6B5B] text-white hover:text-black font-semibold font-sans text-[11px] flex items-center gap-1.5 transition cursor-pointer border border-white/15"
                          >
                            <Lock size={12} className="text-[#FF6B5B]" />
                            <span>{lang === 'en' ? 'Unlock Full 5-Min Story (Free)' : 'पूरी कहानी अनलॉक करें (फ्री)'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Load More Button if filtered stories exceed visibleCount */}
          {filteredStories.length > visibleCount && (
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 30)}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-sans text-[12px] font-medium transition cursor-pointer"
              >
                {lang === 'en'
                  ? `Load More Stories (${visibleCount} of ${filteredStories.length})`
                  : `और कहानियां लोड करें (${visibleCount} / ${filteredStories.length})`}
              </button>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] font-sans">
          <span className="text-white/50">
            {lang === 'en'
              ? `Showing ${Math.min(visibleCount, filteredStories.length)} of ${filteredStories.length} stories`
              : `${filteredStories.length} में से ${Math.min(visibleCount, filteredStories.length)} कहानियां दिखाई जा रही हैं`}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer"
          >
            {lang === 'en' ? 'Close Vault' : 'बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
};
