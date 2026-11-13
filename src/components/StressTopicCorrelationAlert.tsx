import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  X,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Compass,
  History,
  Activity,
  Zap,
  CheckCircle2
} from 'lucide-react';
import {
  getVentHistory,
  computeTopicStressCorrelations,
  evaluateRealtimeStressCorrelation,
  TopicStressCorrelation,
  CurrentStressAlert,
  VentHistoryItem,
  resetVentHistoryToDefaults
} from '../utils/stressKeywordCorrelation';
import { AudioMetrics, VoiceEmotionType } from '../audioMoodDetector';

interface StressTopicCorrelationAlertProps {
  transcript: string;
  currentEmotion: VoiceEmotionType | null;
  audioMetrics: AudioMetrics | null;
  isRecording: boolean;
  lang: 'en' | 'hi';
  onInjectTestTopic?: (topic: string) => void;
  onSetEmotionOverride?: (emotion: VoiceEmotionType) => void;
}

export const StressTopicCorrelationAlert: React.FC<StressTopicCorrelationAlertProps> = ({
  transcript,
  currentEmotion,
  audioMetrics,
  isRecording,
  lang = 'en',
  onInjectTestTopic,
  onSetEmotionOverride
}) => {
  // Historical vents & calculated correlations
  const [ventHistory, setVentHistory] = useState<VentHistoryItem[]>(() => getVentHistory());
  const [showDeepDiveModal, setShowDeepDiveModal] = useState<boolean>(false);
  const [selectedTopicForDetail, setSelectedTopicForDetail] = useState<TopicStressCorrelation | null>(null);
  const [isAlertCollapsed, setIsAlertCollapsed] = useState<boolean>(false);
  const [searchTopicQuery, setSearchTopicQuery] = useState<string>('');

  // Re-calculate correlations whenever vent history changes
  const { correlations, baselineStress, totalVents } = useMemo(() => {
    return computeTopicStressCorrelations(ventHistory);
  }, [ventHistory]);

  // Evaluate real-time correlation with the voice booth's current live state
  const alertState: CurrentStressAlert = useMemo(() => {
    return evaluateRealtimeStressCorrelation({
      currentText: transcript,
      currentEmotion,
      audioMetrics,
      correlations,
      baselineStress,
      lang: lang === 'hi' ? 'hi' : 'en'
    });
  }, [transcript, currentEmotion, audioMetrics, correlations, baselineStress, lang]);

  // Top high-stress topics across all vents
  const topStressTriggers = useMemo(() => {
    return correlations.filter(c => c.stressDelta > 10).slice(0, 4);
  }, [correlations]);

  // Restorative topics (calming impact)
  const restorativeTopics = useMemo(() => {
    return correlations.filter(c => c.stressDelta < -10).slice(0, 3);
  }, [correlations]);

  // Reload history when localStorage updates
  const handleRefreshHistory = () => {
    setVentHistory(getVentHistory());
  };

  const handleResetDefaults = () => {
    const fresh = resetVentHistoryToDefaults();
    setVentHistory([...fresh]);
  };

  const handleTopicClick = (topic: TopicStressCorrelation) => {
    setSelectedTopicForDetail(topic);
    setShowDeepDiveModal(true);
  };

  return (
    <div id="voice-booth-stress-correlation-wrapper" className="my-3 transition-all duration-300">
      {/* 1. ACTIVE STRESS CORRELATION ALERT BANNER */}
      {alertState.isActive && alertState.highestCorrelatedTopic && (
        <div
          id="stress-correlation-active-alert"
          className="rounded-[14px] bg-gradient-to-br from-[#FF5C5C]/15 via-black/60 to-black/80 border border-[#FF5C5C]/40 p-3 sm:p-3.5 relative overflow-hidden shadow-[0_0_24px_rgba(255,92,92,0.18)] transition-all animate-fadeIn"
        >
          {/* Subtle Ambient Pulse Background */}
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-[#FF5C5C]/10 blur-3xl pointer-events-none" />

          {/* Alert Header */}
          <div className="flex items-start justify-between gap-2.5 mb-2">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FF5C5C]/20 border border-[#FF5C5C]/50 flex items-center justify-center text-[#FF5C5C] shrink-0 mt-0.5 shadow-[0_0_10px_rgba(255,92,92,0.3)]">
                <AlertTriangle size={15} className="animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-sans text-[12px] sm:text-[13px] font-bold text-white tracking-tight flex items-center gap-1.5">
                    {lang === 'en' ? alertState.alertHeadlineEn : alertState.alertHeadlineHi}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider bg-[#FF5C5C]/20 text-[#FF5C5C] border border-[#FF5C5C]/30 flex items-center gap-1">
                    <Zap size={9} />
                    {alertState.highestCorrelatedTopic.trendDirection === 'escalating'
                      ? (lang === 'en' ? '↗ Escalating' : '↗ बढ़ रहा है')
                      : (lang === 'en' ? '🔴 Consistent Spike' : '🔴 लगातार उच्च तनाव')}
                  </span>
                </div>
                <p className="text-[11px] text-white/80 font-sans mt-0.5 leading-relaxed">
                  {lang === 'en' ? alertState.alertDetailEn : alertState.alertDetailHi}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAlertCollapsed(!isAlertCollapsed)}
              className="text-white/40 hover:text-white p-1 rounded-md transition cursor-pointer shrink-0"
              title={isAlertCollapsed ? 'Expand details' : 'Collapse details'}
            >
              {isAlertCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

          {!isAlertCollapsed && (
            <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-2.5">
              {/* Stress Visual Gauge: Baseline vs Topic Historical vs Current Vent */}
              <div className="bg-black/40 rounded-xl p-2.5 border border-white/5">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/60 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Activity size={10} className="text-[#FF6B5B]" />
                    {lang === 'en' ? 'Stress Level Trend Benchmark' : 'तनाव स्तर तुलना'}
                  </span>
                  <span className="text-[#FF5C5C] font-bold">
                    +{alertState.highestCorrelatedTopic.stressDelta}% {lang === 'en' ? 'correlation uplift' : 'वृद्धि'}
                  </span>
                </div>

                <div className="space-y-1.5 text-[10px] font-sans">
                  {/* Current vent stress */}
                  <div>
                    <div className="flex justify-between text-white/80 mb-0.5 font-medium">
                      <span>{lang === 'en' ? 'Current Voice / Tag State' : 'वर्तमान स्वर / टैग'}</span>
                      <span className="text-[#FF5C5C] font-mono font-bold">{alertState.currentEstimatedStress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#FF5C5C] transition-all duration-500"
                        style={{ width: `${alertState.currentEstimatedStress}%` }}
                      />
                    </div>
                  </div>

                  {/* Topic historical average */}
                  <div>
                    <div className="flex justify-between text-white/60 mb-0.5">
                      <span>
                        {lang === 'en'
                          ? `Historical Avg for "${alertState.highestCorrelatedTopic.topic}" (${alertState.highestCorrelatedTopic.occurrenceCount} vents)`
                          : `"${alertState.highestCorrelatedTopic.topicHi}" का पुराना औसत (${alertState.highestCorrelatedTopic.occurrenceCount} सत्र)`}
                      </span>
                      <span className="text-[#FF6B5B] font-mono font-semibold">{alertState.highestCorrelatedTopic.avgStressScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#FF6B5B] opacity-80"
                        style={{ width: `${alertState.highestCorrelatedTopic.avgStressScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Baseline stress */}
                  <div>
                    <div className="flex justify-between text-white/40 mb-0.5">
                      <span>{lang === 'en' ? `Your Overall Baseline (${totalVents} vents)` : `आपका सामान्य आधार (${totalVents} सत्र)`}</span>
                      <span className="font-mono">{baselineStress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white/30"
                        style={{ width: `${baselineStress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cognitive Grounding Reframe Anchor */}
              <div className="rounded-xl bg-[#FF6B5B]/10 border border-[#FF6B5B]/20 p-2.5 text-[11px] font-sans flex items-start gap-2">
                <Compass size={14} className="text-[#FF6B5B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white/90 font-semibold block mb-0.5">
                    {lang === 'en' ? 'Targeted Cognitive Reframe:' : 'सुझाया गया दृष्टिकोण:'}
                  </span>
                  <span className="text-white/70 italic leading-relaxed">
                    "{lang === 'en' ? alertState.recommendedAnchorEn : alertState.recommendedAnchorHi}"
                  </span>
                </div>
              </div>

              {/* Correlated Topic Pills & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-white/50">{lang === 'en' ? 'Detected Topics:' : 'विषय:'}</span>
                  {alertState.matchedTopics.map((topic) => (
                    <button
                      key={topic.topic}
                      type="button"
                      onClick={() => handleTopicClick(topic)}
                      className="px-2 py-0.5 rounded-md bg-[#FF5C5C]/20 hover:bg-[#FF5C5C]/35 text-[#FF5C5C] text-[10px] font-mono border border-[#FF5C5C]/40 transition cursor-pointer flex items-center gap-1"
                      title={lang === 'en' ? 'Click to inspect vent history for this topic' : 'इतिहास देखें'}
                    >
                      <span>#{lang === 'en' ? topic.topic : topic.topicHi}</span>
                      <span className="font-bold">+{topic.stressDelta}%</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  id="view-correlation-deep-dive-btn"
                  onClick={() => setShowDeepDiveModal(true)}
                  className="text-[11px] font-sans text-white/70 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition cursor-pointer ml-auto"
                >
                  <History size={11} className="text-[#FF6B5B]" />
                  <span>{lang === 'en' ? 'Inspect All Topics' : 'सभी विषय देखें'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. COMPACT RECURRING TOPIC MONITOR BAR (Always available when no critical alert is active) */}
      {!alertState.isActive && (
        <div
          id="recurring-topic-monitor-bar"
          className="rounded-[12px] bg-white/[0.02] border border-white/10 p-2.5 sm:px-3 sm:py-2 text-[11px] font-sans transition-all hover:bg-white/[0.04]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-[#FF6B5B] shrink-0">
                <Brain size={12} />
              </div>
              <span className="text-white/80 font-medium">
                {lang === 'en' ? 'Recurring Topic Stress Monitor' : 'विषय-तनाव ट्रेंड मॉनिटर'}
              </span>
              <span className="text-[10px] font-mono text-white/40 hidden md:inline">
                • {totalVents} {lang === 'en' ? 'vents analyzed' : 'सत्र विश्लेषित'}
              </span>

              {/* Recurring high-stress pills */}
              <div className="flex flex-wrap items-center gap-1 ml-1">
                {topStressTriggers.map((t) => (
                  <button
                    key={t.topic}
                    type="button"
                    onClick={() => handleTopicClick(t)}
                    className="px-2 py-0.5 rounded-full bg-white/[0.06] hover:bg-[#FF5C5C]/20 text-white/70 hover:text-[#FF5C5C] text-[10px] font-mono border border-white/10 transition cursor-pointer flex items-center gap-1"
                    title={lang === 'en' ? `Spikes stress by +${t.stressDelta}%` : `तनाव में +${t.stressDelta}% वृद्धि`}
                  >
                    <span>{lang === 'en' ? t.topic : t.topicHi}</span>
                    <span className="text-[#FF5C5C] font-semibold">+{t.stressDelta}%</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                id="open-correlation-matrix-btn"
                onClick={() => setShowDeepDiveModal(true)}
                className="text-[10px] font-sans text-white/60 hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer flex items-center gap-1"
              >
                <TrendingUp size={10} className="text-[#FF6B5B]" />
                <span>{lang === 'en' ? 'Correlation Matrix' : 'सहसंबंध मैट्रिक्स'}</span>
              </button>
            </div>
          </div>

          {/* Quick simulation pills for instant testing / verification */}
          <div className="mt-2 pt-1.5 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[10px] font-sans text-white/40">
            <span>{lang === 'en' ? 'Test correlation triggers:' : 'ट्रिगर टेस्ट करें:'}</span>
            {['manager', 'deadline', 'in-laws', 'appraisal'].map((keyword) => (
              <button
                key={keyword}
                type="button"
                id={`simulate-trigger-${keyword}`}
                onClick={() => {
                  if (onInjectTestTopic) {
                    onInjectTestTopic(keyword);
                  }
                  if (onSetEmotionOverride) {
                    onSetEmotionOverride('Stressed');
                  }
                }}
                className="px-2 py-0.5 rounded bg-[#FF6B5B]/10 hover:bg-[#FF6B5B]/25 text-white/80 hover:text-white border border-[#FF6B5B]/20 transition cursor-pointer"
              >
                +{keyword}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. COMPREHENSIVE "RECURRING TOPICS & STRESS CORRELATION DEEP DIVE" MODAL */}
      {showDeepDiveModal && (
        <div
          id="topic-stress-correlation-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowDeepDiveModal(false)}
        >
          <div
            className="bg-[#121217] border border-white/15 rounded-[20px] max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF6B5B]/15 border border-[#FF6B5B]/30 flex items-center justify-center text-[#FF6B5B]">
                  <Brain size={18} />
                </div>
                <div>
                  <h3 className="font-sans text-[16px] font-bold text-white tracking-tight">
                    {lang === 'en' ? 'Recurring Topics & Stress Correlation Engine' : 'बार-बार आने वाले विषय एवं तनाव सहसंबंध'}
                  </h3>
                  <p className="font-sans text-[11px] text-white/50">
                    {lang === 'en'
                      ? `Analyzing ${totalVents} vents across voice history • Baseline stress: ${baselineStress}%`
                      : `${totalVents} पिछले सत्रों का विश्लेषण • आधार तनाव: ${baselineStress}%`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="close-correlation-modal-btn"
                onClick={() => setShowDeepDiveModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 font-sans">
              {/* Stat Bento Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                  <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1">
                    {lang === 'en' ? 'Baseline Emotional Index' : 'आधारभूत तनाव सूचकांक'}
                  </div>
                  <div className="text-[20px] font-mono font-bold text-white flex items-baseline gap-1">
                    {baselineStress}%
                    <span className="text-[10px] text-white/40 font-sans">{lang === 'en' ? 'avg over all vents' : 'औसत'}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 p-3">
                  <div className="text-[10px] font-mono text-[#FF5C5C] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertTriangle size={11} />
                    {lang === 'en' ? 'High-Stress Triggers' : 'उच्च-तनाव ट्रिगर्स'}
                  </div>
                  <div className="text-[20px] font-mono font-bold text-[#FF5C5C] flex items-baseline gap-1">
                    {topStressTriggers.length}
                    <span className="text-[10px] text-white/60 font-sans">{lang === 'en' ? 'recurring topics' : 'पहचाने गए विषय'}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#06D6A0]/10 border border-[#06D6A0]/30 p-3">
                  <div className="text-[10px] font-mono text-[#06D6A0] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    {lang === 'en' ? 'Restorative Anchors' : 'शांत करने वाले विषय'}
                  </div>
                  <div className="text-[20px] font-mono font-bold text-[#06D6A0] flex items-baseline gap-1">
                    {restorativeTopics.length}
                    <span className="text-[10px] text-white/60 font-sans">{lang === 'en' ? 'soothing topics' : 'राहत देने वाले'}</span>
                  </div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchTopicQuery}
                  onChange={(e) => setSearchTopicQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search recurring keyword or topic...' : 'विषय या कीवर्ड खोजें...'}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B5B]"
                />
                {searchTopicQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchTopicQuery('')}
                    className="text-white/40 hover:text-white text-[11px] px-2 py-1"
                  >
                    {lang === 'en' ? 'Clear' : 'साफ करें'}
                  </button>
                )}
              </div>

              {/* Topic Cards List */}
              <div className="space-y-3">
                <h4 className="text-[12px] font-mono uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-[#FF6B5B]" />
                  {lang === 'en' ? 'Topics Ranked by Stress Uplift' : 'तनाव प्रभाव के आधार पर विषय'}
                </h4>

                {correlations
                  .filter((c) =>
                    !searchTopicQuery ||
                    c.topic.toLowerCase().includes(searchTopicQuery.toLowerCase()) ||
                    c.topicHi.toLowerCase().includes(searchTopicQuery.toLowerCase())
                  )
                  .map((item) => {
                    const isSelected = selectedTopicForDetail?.topic === item.topic;
                    const isSpike = item.stressDelta > 0;

                    return (
                      <div
                        key={item.topic}
                        className={`rounded-xl p-3.5 border transition-all ${
                          isSelected
                            ? 'bg-white/[0.08] border-[#FF6B5B]/60 shadow-[0_0_15px_rgba(255,107,91,0.15)]'
                            : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[14px] font-bold text-white capitalize">
                              #{lang === 'en' ? item.topic : item.topicHi}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-white/70">
                              {item.occurrenceCount} {lang === 'en' ? 'vents' : 'सत्र'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                isSpike
                                  ? 'bg-[#FF5C5C]/20 text-[#FF5C5C] border border-[#FF5C5C]/40'
                                  : 'bg-[#06D6A0]/20 text-[#06D6A0] border border-[#06D6A0]/40'
                              }`}
                            >
                              {isSpike ? `+${item.stressDelta}% stress spike` : `${item.stressDelta}% calming`}
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-white/50">
                            {lang === 'en' ? 'Topic Avg: ' : 'औसत: '}
                            <strong className="text-white">{item.avgStressScore}%</strong>
                          </div>
                        </div>

                        {/* Visual bar */}
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-2.5">
                          <div
                            className={`h-full rounded-full ${
                              isSpike ? 'bg-gradient-to-r from-amber-400 to-[#FF5C5C]' : 'bg-[#06D6A0]'
                            }`}
                            style={{ width: `${item.avgStressScore}%` }}
                          />
                        </div>

                        {/* Cognitive Reframe */}
                        <div className="text-[11px] text-white/70 bg-black/40 rounded-lg p-2.5 border border-white/5 mb-2">
                          <span className="text-[#FF6B5B] font-semibold mr-1">
                            {lang === 'en' ? 'Cognitive Anchor:' : 'मानसिक दृष्टि:'}
                          </span>
                          {lang === 'en' ? item.cognitiveReframeEn : item.cognitiveReframeHi}
                        </div>

                        {/* Sample Quotes Excerpts from Vents */}
                        {item.sampleQuotes.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-white/40 block">
                              {lang === 'en' ? 'Excerpts from your vents:' : 'पिछले सत्रों से अंश:'}
                            </span>
                            {item.sampleQuotes.map((q, idx) => (
                              <p key={idx} className="text-[11px] text-white/60 italic border-l-2 border-white/20 pl-2 leading-relaxed">
                                "{q.length > 140 ? q.slice(0, 140) + '...' : q}"
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02] text-[11px] font-sans">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-white/40 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                title="Reset sample vent dataset to default values"
              >
                <RefreshCw size={12} />
                <span>{lang === 'en' ? 'Reset Sample Vents' : 'डेटा रीसेट करें'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeepDiveModal(false)}
                className="px-4 py-1.5 rounded-full bg-[#FF6B5B] hover:bg-[#FF5C5C] text-white font-medium transition cursor-pointer"
              >
                {lang === 'en' ? 'Close Inspector' : 'बंद करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
