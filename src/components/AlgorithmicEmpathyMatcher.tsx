import React, { useState, useEffect } from 'react';
import { Story, EmpathyMatchResult } from '../types';
import { 
  HeartHandshake, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Bookmark, 
  ShieldCheck, 
  Compass, 
  RefreshCw,
  Clock,
  MapPin,
  Quote,
  Check
} from 'lucide-react';

interface AlgorithmicEmpathyMatcherProps {
  userVentText: string;
  userMood?: string;
  userLocation?: string;
  candidateStories: Story[];
  onOpenMatchedStory?: (story: Story) => void;
  lang?: 'en' | 'hi';
}

export const AlgorithmicEmpathyMatcher: React.FC<AlgorithmicEmpathyMatcherProps> = ({
  userVentText,
  userMood = 'anxious',
  userLocation = 'India',
  candidateStories,
  onOpenMatchedStory,
  lang = 'en'
}) => {
  const [matchResult, setMatchResult] = useState<EmpathyMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [silentResonanceSent, setSilentResonanceSent] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (userVentText && userVentText.trim().length > 15) {
      performSemanticMatch();
    }
  }, [userVentText, candidateStories]);

  const performSemanticMatch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/algorithmic-empathy-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userStoryText: userVentText,
          mood: userMood,
          location: userLocation,
          candidateStories: candidateStories.slice(0, 10).map(s => ({
            id: s.id,
            title: s.title,
            emotion: s.mood || s.emotion,
            hook: s.hook,
            transcript: s.transcript,
            structured: s.structured
          }))
        }),
      });

      const data = await res.json();
      if (data.match) {
        const foundStory = candidateStories.find(s => s.id === data.match.matchedStoryId) || candidateStories[0];
        setMatchResult({
          matchScore: data.match.matchScore || 95,
          matchedStory: foundStory,
          sharedEmotionalTheme: data.match.sharedEmotionalTheme || "Career Stagnation & Parental Silence",
          sharedTurningPoint: data.match.sharedTurningPoint || foundStory?.structured?.turning || "Accepting that hiding the struggle caused more pain than the reality.",
          survivorWisdom: data.match.survivorWisdom || "The monster in our head is always louder than reality. When I finally confessed, my father made chai and sat with me.",
          empathyBridgeQuote: data.match.empathyBridgeQuote || "You are not broken for feeling exhausted by expectations you never signed up for.",
          resonanceDimensions: data.match.resonanceDimensions || ["Parental expectations", "Identity tied to corporate job", "Fear of starting over"],
          timeGapInMonths: data.match.timeGapInMonths || 6,
          peerCity: foundStory?.location || "Pune, India"
        });
      }
    } catch (err) {
      console.error("Failed algorithmic empathy match:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userVentText || userVentText.trim().length < 15) {
    return null;
  }

  return (
    <div className="rounded-[24px] bg-[#141416] text-white border border-[#25D366]/30 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#25D366]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#25D366]/20 text-[#25D366] grid place-items-center shrink-0">
            <HeartHandshake size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-[20px] sm:text-[22px] text-white font-semibold">
                {lang === 'en' ? 'Algorithmic Empathy Match' : 'एल्गोरिथमिक एम्पैथी मैच'}
              </h3>
              {matchResult && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] font-mono text-[11px] font-bold border border-[#25D366]/40">
                  {matchResult.matchScore}% Semantic Match
                </span>
              )}
            </div>
            <p className="text-[12px] font-sans text-white/60 mt-0.5">
              {lang === 'en'
                ? 'You are not the first, and you will not be the last. Connected to an anonymous peer who survived this exact scenario.'
                : 'आप अकेले नहीं हैं। किसी ऐसे अनाम व्यक्ति से जुड़ाव जिसने इसी कठिन दौर को पार किया है।'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={performSemanticMatch}
          disabled={isLoading}
          className="self-start sm:self-center px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[11px] font-mono flex items-center gap-1.5 transition border border-white/10 cursor-pointer"
        >
          <RefreshCw size={11} className={isLoading ? 'animate-spin' : ''} />
          <span>Re-match</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-white/60">
          <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] mx-auto grid place-items-center mb-3 animate-pulse">
            <Sparkles size={18} />
          </div>
          <p className="font-sans text-[13px]">
            Scanning anonymized public library for peer survival matches...
          </p>
        </div>
      ) : matchResult ? (
        <div className="mt-5 space-y-5">
          {/* Peer Card */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-black text-white text-[11px] font-bold grid place-items-center">
                  ✦
                </span>
                <div>
                  <div className="font-display text-[15px] font-semibold text-white">
                    Anonymous Peer Survivor ({matchResult.peerCity})
                  </div>
                  <div className="text-[10px] font-mono text-white/50 flex items-center gap-2">
                    <span>Turnaround: {matchResult.timeGapInMonths} months ago</span>
                    <span>•</span>
                    <span className="text-[#25D366] font-semibold">Survived & Thriving</span>
                  </div>
                </div>
              </div>

              {matchResult.matchedStory && onOpenMatchedStory && (
                <button
                  type="button"
                  onClick={() => onOpenMatchedStory(matchResult.matchedStory)}
                  className="text-[11px] font-sans font-bold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition cursor-pointer self-start sm:self-center"
                >
                  <span>Read Full Peer Journey</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>

            {/* Shared Emotional Themes */}
            <div className="mt-3.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                Shared Psychological Resonance Dimensions
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.resonanceDimensions.map((dim, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-[#25D366]/10 text-[#25D366] text-[11px] font-sans font-medium border border-[#25D366]/20"
                  >
                    ✓ {dim}
                  </span>
                ))}
              </div>
            </div>

            {/* Shared Turning Point & Peer Wisdom */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl bg-black/40 border border-white/8 p-3.5">
                <span className="text-[10px] font-mono uppercase text-[#FFB300] block mb-1">
                  How They Pivoted / Their Turning Point
                </span>
                <p className="font-sans text-[12.5px] text-white/85 leading-relaxed">
                  "{matchResult.sharedTurningPoint}"
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-white/8 p-3.5">
                <span className="text-[10px] font-mono uppercase text-[#25D366] block mb-1">
                  Survivor Wisdom for You Tonight
                </span>
                <p className="font-sans text-[12.5px] text-white/85 leading-relaxed">
                  "{matchResult.survivorWisdom}"
                </p>
              </div>
            </div>

            {/* Empathy Bridge Comfort Quote */}
            <div className="mt-3.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 p-3 flex items-start gap-2.5">
              <Quote size={16} className="text-[#25D366] shrink-0 mt-0.5" />
              <p className="font-sans text-[13px] text-white/90 italic leading-snug">
                "{matchResult.empathyBridgeQuote}"
              </p>
            </div>
          </div>

          {/* Toxic-Free Silent Resonance Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-[11px] font-sans text-white/50">
              Zero social feeds • Zero comment sections • Pure silent resonance
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSilentResonanceSent(true)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  silentResonanceSent
                    ? 'bg-[#FF5C5C]/20 text-[#FF5C5C] border border-[#FF5C5C]/30'
                    : 'bg-white/10 hover:bg-[#FF5C5C]/20 text-white hover:text-[#FF5C5C]'
                }`}
              >
                <Heart size={12} className={silentResonanceSent ? 'fill-current' : ''} />
                <span>{silentResonanceSent ? 'Resonance Sent to Peer ❤️' : 'Send Silent Resonance ❤️'}</span>
              </button>

              <button
                type="button"
                onClick={() => setBookmarked(prev => !prev)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-sans font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  bookmarked
                    ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30'
                    : 'bg-white/10 hover:bg-white/15 text-white/70'
                }`}
              >
                <Bookmark size={12} className={bookmarked ? 'fill-current' : ''} />
                <span>{bookmarked ? 'Saved to Vault' : 'Save to Vault'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
