import React, { useState, useRef } from 'react';
import { Search, Mic, MicOff, Sparkles, ArrowRight, Check, History, Heart, Shield, RefreshCw } from 'lucide-react';
import { Story } from '../types';

interface MatchedStory {
  id?: string;
  title?: string;
  timeframe?: string;
  initialFeeling?: string;
  howResolved?: string;
  keyInsight?: string;
}

interface ResilienceData {
  summary: string;
  matchedStories?: MatchedStory[];
  keyResilienceTakeaway?: string;
  actionableReminder?: string;
}

interface ResilienceSearchBarProps {
  stories: Story[];
  onSelectStory?: (story: Story) => void;
  lang: 'en' | 'hi';
}

const SAMPLE_QUESTIONS = [
  {
    en: "When was the last time I felt this anxious about money, and how did I resolve it?",
    hi: "पिछली बार मुझे पैसों को लेकर इतनी चिंता कब हुई थी, और मैंने इसे कैसे सुलझाया था?"
  },
  {
    en: "When did I last experience acute career burnout, and what helped me through?",
    hi: "मुझे आखिरी बार करियर बर्नआउट कब महसूस हुआ था, और क्या मददगार साबित हुआ?"
  },
  {
    en: "What helped me overcome imposter syndrome and self-doubt in past vents?",
    hi: "पिछली बार आत्मविश्वास की कमी और डर से निकलने में मुझे क्या समझ आया था?"
  }
];

export const ResilienceSearchBar: React.FC<ResilienceSearchBarProps> = ({ stories, onSelectStory, lang }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResilienceData | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [copiedTakeaway, setCopiedTakeaway] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'en' ? 'Voice recognition is not supported in this browser.' : 'इस ब्राउज़र में वॉइस रिकग्निशन समर्थित नहीं है।');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSearch = async (overrideQuery?: string) => {
    const activeQuery = (overrideQuery || query).trim();
    if (!activeQuery) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/resilience-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeQuery, stories })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      }
    } catch (err) {
      console.error('Error fetching resilience search:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTakeaway = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTakeaway(true);
    setTimeout(() => setCopiedTakeaway(false), 2000);
  };

  return (
    <div className="rounded-[22px] bg-black text-white p-5 md:p-6 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient subtle glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#FF6B5B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#FFD166]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B5B] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#FF6B5B] font-semibold">
              {lang === 'en' ? 'AI Emotional Memory & Resilience Search' : 'एआई रेजिलिएंस और मेमोरी सर्च'}
            </span>
          </div>
          <h3 className="font-serif text-[20px] md:text-[23px] font-bold mt-1 text-white leading-tight">
            {lang === 'en'
              ? 'Find when you overcame this feeling before'
              : 'खोजें कि आपने पहले इस भावना को कैसे पार किया'}
          </h3>
          <p className="font-sans text-[12px] opacity-60 mt-0.5 max-w-2xl">
            {lang === 'en'
              ? 'Type or speak a question to retrieve past vents, analyze how you resolved similar pressure, and remember your own innate resilience.'
              : 'प्रश्न लिखें या बोलें — एआई आपके पुराने वेंट्स से ढूँढकर दिखाएगा कि आपने इसी तरह की मुश्किल को पहले कैसे सुलझाया था।'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 flex items-center gap-1.5">
            <Shield size={12} className="text-[#FF6B5B]" />
            {stories.length} {lang === 'en' ? 'Entries Indexed' : 'वेंट्स इंडेक्स'}
          </span>
        </div>
      </div>

      {/* Input search bar */}
      <div className="relative mt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative flex items-center"
        >
          <Search size={18} className="absolute left-4 text-white/40 pointer-events-none" />
          <input
            type="text"
            id="resilience-query-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'en'
                ? 'Ask: "When was the last time I felt this anxious about money, and how did I resolve it?"'
                : 'पूछें: "पिछली बार पैसों की चिंता को मैंने कैसे सुलझाया था?"'
            }
            className="w-full pl-12 pr-28 py-3.5 rounded-full bg-white/[0.07] border border-white/20 text-white placeholder:text-white/35 text-[13px] md:text-[14px] focus:outline-none focus:border-[#FF6B5B] focus:bg-white/[0.1] transition shadow-inner"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="button"
              id="resilience-mic-btn"
              onClick={isListening ? stopListening : startListening}
              className={`p-2 rounded-full transition cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={isListening ? 'Stop listening' : 'Speak your query'}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <button
              type="submit"
              id="resilience-search-submit-btn"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2 rounded-full bg-[#FF6B5B] hover:bg-[#ff5543] disabled:opacity-40 disabled:hover:bg-[#FF6B5B] text-black font-sans text-[12px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              {isLoading ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : (
                <>
                  <span>{lang === 'en' ? 'Synthesize' : 'सर्च करें'}</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>
        </form>

        {isListening && (
          <div className="mt-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 font-mono text-[11px] flex items-center gap-2 animate-pulse w-fit">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            {lang === 'en' ? 'Listening... speak your emotional reflection query now' : 'सुन रहा हूँ... अपना सवाल बोलें'}
          </div>
        )}
      </div>

      {/* Suggested Queries */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-sans text-[11px] opacity-40">
          {lang === 'en' ? 'Try asking:' : 'सुझाए गए सवाल:'}
        </span>
        {SAMPLE_QUESTIONS.map((q, idx) => {
          const text = lang === 'hi' ? q.hi : q.en;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(text);
                handleSearch(text);
              }}
              className="font-sans text-[11px] px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 text-white/80 hover:text-white transition cursor-pointer truncate max-w-md text-left"
            >
              "{text}"
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-6 p-5 rounded-[18px] bg-white/[0.04] border border-white/10 animate-pulse space-y-3">
          <div className="flex items-center gap-2 text-[#FF6B5B] text-[12px] font-mono">
            <Sparkles size={14} className="animate-spin" />
            {lang === 'en'
              ? 'Analyzing past journal reflections and turning points...'
              : 'पुरानी डायरी वेंट्स और समाधानों का विश्लेषण हो रहा है...'}
          </div>
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-white/10 rounded w-5/6" />
          <div className="h-4 bg-white/10 rounded w-2/3" />
        </div>
      )}

      {/* Search Result Card */}
      {result && !isLoading && (
        <div className="mt-6 rounded-[18px] bg-white/[0.05] border border-white/15 p-5 md:p-6 fade-up">
          {/* Top Takeaway Banner */}
          {result.keyResilienceTakeaway && (
            <div className="mb-4 p-4 rounded-[14px] bg-[#FF6B5B]/15 border border-[#FF6B5B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF6B5B] text-black grid place-items-center shrink-0 font-bold">
                  <Heart size={15} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#FF6B5B] font-bold">
                    {lang === 'en' ? 'Proven Resilience Factor' : 'आपकी साबित हुई मजबूती'}
                  </div>
                  <div className="font-serif text-[15px] md:text-[16px] italic text-white mt-0.5 leading-snug">
                    "{result.keyResilienceTakeaway}"
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyTakeaway(result.keyResilienceTakeaway || '')}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] font-sans text-white/90 flex items-center gap-1.5 transition cursor-pointer self-end sm:self-center"
              >
                {copiedTakeaway ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span>{lang === 'en' ? 'Saved' : 'कॉपी हुआ'}</span>
                  </>
                ) : (
                  <span>{lang === 'en' ? 'Copy Reminder' : 'कॉपी करें'}</span>
                )}
              </button>
            </div>
          )}

          {/* Narrative Synthesis */}
          <div className="font-sans text-[13px] md:text-[14px] leading-relaxed text-white/90 whitespace-pre-line">
            {result.summary}
          </div>

          {/* Actionable reminder */}
          {result.actionableReminder && (
            <div className="mt-4 p-3.5 rounded-[12px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 font-sans text-[12px] flex items-start gap-2.5">
              <Shield size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-emerald-300">
                  {lang === 'en' ? 'What worked for you last time:' : 'पिछली बार आपके लिए क्या कारगर रहा:'}
                </strong>{' '}
                {result.actionableReminder}
              </div>
            </div>
          )}

          {/* Matched Past Stories */}
          {result.matchedStories && result.matchedStories.length > 0 && (
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="font-mono text-[11px] uppercase tracking-wider opacity-50 flex items-center gap-1.5 mb-3">
                <History size={13} />
                {lang === 'en' ? 'Evidence from your past entries:' : 'आपके पुराने वेंट्स के प्रमाण:'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.matchedStories.map((match, i) => {
                  const matchingLocalStory = stories.find(s => s.id === match.id || s.title === match.title);
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-[14px] bg-black/40 border border-white/10 hover:border-white/20 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] opacity-60">
                          <span>{match.timeframe || 'Past entry'}</span>
                          {match.initialFeeling && (
                            <span className="font-mono text-[#FFD166]">{match.initialFeeling}</span>
                          )}
                        </div>
                        <h4 className="font-serif text-[14px] font-bold text-white mt-1">
                          {match.title || 'Untitled Entry'}
                        </h4>
                        {match.howResolved && (
                          <div className="mt-2 text-[12px] font-sans text-white/80 leading-snug">
                            <span className="text-[#FF6B5B] font-medium">
                              {lang === 'en' ? 'Resolution:' : 'समाधान:'}{' '}
                            </span>
                            {match.howResolved}
                          </div>
                        )}
                        {match.keyInsight && (
                          <div className="mt-1.5 text-[11px] font-sans text-white/60 italic">
                            "{match.keyInsight}"
                          </div>
                        )}
                      </div>

                      {matchingLocalStory && onSelectStory && (
                        <button
                          type="button"
                          onClick={() => onSelectStory(matchingLocalStory)}
                          className="mt-3 inline-flex items-center gap-1 text-[11px] font-sans text-[#FF6B5B] hover:underline font-semibold cursor-pointer"
                        >
                          <span>{lang === 'en' ? 'Re-read this story' : 'यह कहानी फिर पढ़ें'}</span>
                          <ArrowRight size={11} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
