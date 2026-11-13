import React, { useMemo } from 'react';
import { Sparkles, Activity, Heart, ShieldAlert, Zap, Compass, RefreshCw } from 'lucide-react';
import { InstantMoodData } from '../types';

interface LiveInstantMoodAnalyzerProps {
  text: string;
  isLive?: boolean;
  assignedEmotion?: string;
  existingAnalysis?: InstantMoodData;
  lang?: 'en' | 'hi';
}

const MOOD_EMOJIS: Record<string, string> = {
  overwhelmed: '🌊',
  anxious: '⚡',
  burnout: '🔥',
  frustrated: '💥',
  hopeful: '🌱',
  reflective: '💭',
  lonely: '🌙',
  relieved: '🕊️',
  vulnerable: '🥀',
  calm: '🍃',
  conflicted: '⚖️',
  exhausted: '⏳'
};

export function computeInstantMood(text: string, assignedEmotion?: string): InstantMoodData {
  const lower = (text || '').toLowerCase();

  // Emotional keyword dictionaries
  const anxietyWords = ['anxious', 'scared', 'fear', 'panic', 'nervous', 'heart', 'chest', 'worry', 'shaking', 'dar', 'ghabrahat', 'chinta', 'pressure', 'deadline', 'boss', 'pip'];
  const burnoutWords = ['tired', 'burnout', 'exhausted', 'can\'t anymore', 'thak', 'quit', 'resign', 'sleep', 'soya nahi', 'heavy', 'empty', 'numb', 'pointless'];
  const overwhelmedWords = ['too much', 'overwhelmed', 'drowning', 'chaos', 'crying', 'handle', 'sab kuch', 'ro diya', 'phat gaya', 'collapse', 'breaking'];
  const frustratedWords = ['angry', 'screamed', 'unfair', 'hate', 'shouted', 'gussa', 'client', 'money', 'unpaid', 'ruined', 'disrespect', 'chilla'];
  const hopefulWords = ['hope', 'better', 'future', 'smile', 'built', 'passed', 'first sale', 'made it', 'ummeed', 'khushi', 'shanti', 'peace', 'relief'];
  const lonelyWords = ['alone', 'nobody', 'isolated', 'single', 'silence', 'akela', 'room', 'dark', 'stranger', 'no one understands'];

  const countMatches = (words: string[]) => words.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);

  const scores = {
    anxious: countMatches(anxietyWords),
    burnout: countMatches(burnoutWords),
    overwhelmed: countMatches(overwhelmedWords),
    frustrated: countMatches(frustratedWords),
    hopeful: countMatches(hopefulWords),
    lonely: countMatches(lonelyWords)
  };

  let dominant = 'anxious';
  let maxScore = scores.anxious;

  if (assignedEmotion && scores[assignedEmotion.toLowerCase() as keyof typeof scores] !== undefined) {
    dominant = assignedEmotion.toLowerCase();
    maxScore = Math.max(scores[assignedEmotion.toLowerCase() as keyof typeof scores], 1);
  } else {
    (Object.keys(scores) as (keyof typeof scores)[]).forEach((key) => {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        dominant = key;
      }
    });
  }

  // Dynamic word-count intensity calibration
  const wordCount = (text || '').trim() ? (text || '').trim().split(/\s+/).length : 0;
  const baseIntensity = Math.min(95, Math.max(45, 50 + maxScore * 12 + Math.min(25, wordCount * 0.8)));

  const formatDict: Record<string, { title: string; emoji: string; valence: 'negative' | 'cathartic' | 'neutral' | 'positive'; activation: 'high' | 'moderate' | 'low'; insightEn: string; insightHi: string; keywords: string[]; pacing: string }> = {
    overwhelmed: {
      title: 'Cognitive & Emotional Overload',
      emoji: '🌊',
      valence: 'negative',
      activation: 'high',
      insightEn: 'You are juggling more cognitive demands than your nervous system can balance right now.',
      insightHi: 'आप इस समय नर्वस सिस्टम की क्षमता से ज़्यादा मानसिक दबाव झेल रहे हैं।',
      keywords: ['overloaded', 'high-tempo', 'boundary-loss'],
      pacing: 'Rapid, breath-clipped cadence'
    },
    anxious: {
      title: 'Anticipatory Hyper-Vigilance',
      emoji: '⚡',
      valence: 'negative',
      activation: 'high',
      insightEn: 'Your mind is projecting forward into worst-case outcomes to protect you from being blindsided.',
      insightHi: 'आपका दिमाग आपको झटके से बचाने के लिए लगातार अनहोनी का अंदेशा लगा रहा है।',
      keywords: ['uncertainty', 'hyper-vigilant', 'protective-fear'],
      pacing: 'Accelerated, tense pitch'
    },
    burnout: {
      title: 'Acute Depletion & Emotional Blunting',
      emoji: '🔥',
      valence: 'negative',
      activation: 'low',
      insightEn: 'You have given beyond your capacity for too long; your body is demanding a hard shutdown.',
      insightHi: 'आप बहुत लंबे समय से क्षमता से अधिक खिंच रहे हैं; अब शरीर पूरी तरह आराम की मांग कर रहा है।',
      keywords: ['depleted', 'chronic-strain', 'disillusioned'],
      pacing: 'Heavy, decelerated tone'
    },
    frustrated: {
      title: 'Suppressed Indignation & Boundary Defense',
      emoji: '💥',
      valence: 'cathartic',
      activation: 'high',
      insightEn: 'Your sense of fairness or dignity was compromised; vocalizing it is actively restoring your self-respect.',
      insightHi: 'आपके आत्मसम्मान या निष्पक्षता पर चोट हुई है; इसे बोलकर आप अपना सम्मान वापस पा रहे हैं।',
      keywords: ['injustice', 'assertive-rage', 'boundary-trigger'],
      pacing: 'Sharp, emphatic vocal thrusts'
    },
    hopeful: {
      title: 'Quiet Resilience & Perspective Re-alignment',
      emoji: '🌱',
      valence: 'positive',
      activation: 'moderate',
      insightEn: 'A glimpse of clarity or validation has broken through the fog; relief is beginning to register.',
      insightHi: 'धुंध के बीच स्पष्टता की एक किरण नज़र आई है; राहत का अहसास शुरू हो चुका है।',
      keywords: ['clarity', 'grounded-optimism', 'relief'],
      pacing: 'Gentle, balanced respiration'
    },
    lonely: {
      title: 'Relational Isolation & Silent Longing',
      emoji: '🌙',
      valence: 'negative',
      activation: 'low',
      insightEn: 'Surrounded by people or routine, yet feeling deeply unseen in your internal reality.',
      insightHi: 'आसपास लोग होने पर भी भीतर से कोई समझने वाला न होने का खालीपन है।',
      keywords: ['unseen', 'interiority', 'ache-for-attunement'],
      pacing: 'Quiet, hesitant pauses'
    }
  };

  const details = formatDict[dominant] || formatDict.anxious;

  return {
    state: dominant,
    intensity: Math.round(baseIntensity),
    primaryMood: details.title,
    primaryMoodEmoji: details.emoji,
    intensityScore: Math.round(baseIntensity),
    valence: details.valence,
    activationLevel: details.activation,
    somaticIndicators: [
      `Vocal Pacing: ${details.pacing}`,
      `Cortical Arousal: ${Math.round(baseIntensity)}% activation`,
      `Nervous System: ${details.activation === 'high' ? 'Sympathetic Spike (Fight/Flight)' : 'Dorsal Vagal Shutdown / Low Energy'}`
    ],
    detectedKeywords: details.keywords,
    instantInsight: details.insightEn,
    instantInsightHi: details.insightHi,
    calmingAnchor: 'Affect labeling active: naming your emotion drops amygdala reactivity by ~40%.'
  };
}

export const LiveInstantMoodAnalyzer: React.FC<LiveInstantMoodAnalyzerProps> = ({
  text,
  isLive = false,
  assignedEmotion,
  existingAnalysis,
  lang = 'en'
}) => {
  // Real-time heuristic lexical emotion detector
  const liveAnalysis: InstantMoodData = useMemo(() => {
    if (existingAnalysis) {
      return existingAnalysis;
    }
    return computeInstantMood(text, assignedEmotion);
  }, [text, assignedEmotion, existingAnalysis]);

  const intensityPercent = liveAnalysis.intensityScore;

  return (
    <div className="rounded-[18px] bg-gradient-to-br from-[#18181B] to-[#121214] border border-white/15 p-4 text-white shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Background ambient aura */}
      <div
        className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          backgroundColor:
            liveAnalysis.valence === 'positive'
              ? '#10B981'
              : liveAnalysis.valence === 'cathartic'
              ? '#F59E0B'
              : '#FF6B5B'
        }}
      />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FF6B5B]/20 text-[#FF6B5B] grid place-items-center">
            <Activity size={13} className={isLive ? 'animate-pulse' : ''} />
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-wider uppercase opacity-60 flex items-center gap-1.5">
              <span>{lang === 'en' ? 'Live Instant Mood Analysis' : 'लाइव मूड विश्लेषण'}</span>
              {isLive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
          <span className="opacity-50">{lang === 'en' ? 'Intensity:' : 'तीव्रता:'}</span>
          <span className="font-bold text-[#FF6B5B]">{intensityPercent}%</span>
        </div>
      </div>

      {/* Primary Mood Callout */}
      <div className="mt-3.5 flex items-start gap-3">
        <div className="text-3xl leading-none select-none filter drop-shadow-md">
          {liveAnalysis.primaryMoodEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-display text-[16px] md:text-[18px] text-white tracking-tight leading-snug">
              {liveAnalysis.primaryMood}
            </h4>
            <span
              className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                liveAnalysis.valence === 'positive'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : liveAnalysis.valence === 'cathartic'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}
            >
              {liveAnalysis.valence}
            </span>
          </div>

          <p className="font-serif italic text-[13px] text-white/80 leading-relaxed mt-1">
            "{lang === 'en' ? liveAnalysis.instantInsight : (liveAnalysis.instantInsightHi || liveAnalysis.instantInsight)}"
          </p>
        </div>
      </div>

      {/* Telemetry Gauge Bars */}
      <div className="mt-3.5 space-y-2 font-sans">
        <div>
          <div className="flex justify-between items-center text-[10px] font-mono text-white/60 mb-1">
            <span>{lang === 'en' ? 'Emotional Activation' : 'मानसिक सक्रियता'}</span>
            <span className="capitalize">{liveAnalysis.activationLevel}</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#FF6B5B] to-[#FF5C5C]"
              style={{ width: `${intensityPercent}%` }}
            />
          </div>
        </div>

        {/* Somatic & Vocal Diagnostics */}
        <div className="mt-2.5 pt-2.5 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px] text-white/70">
          {liveAnalysis.somaticIndicators.map((ind, idx) => (
            <div key={idx} className="flex items-center gap-1.5 truncate">
              <span className="w-1 h-1 rounded-full bg-[#FF6B5B] shrink-0" />
              <span className="truncate">{ind}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Grounding Anchor */}
      <div className="mt-3 rounded-[12px] bg-white/[0.04] border border-white/5 p-2.5 flex items-start gap-2 text-[11px] font-sans text-white/70">
        <Sparkles size={13} className="text-[#FF6B5B] shrink-0 mt-0.5" />
        <span className="leading-snug">
          {liveAnalysis.calmingAnchor}
        </span>
      </div>
    </div>
  );
};
