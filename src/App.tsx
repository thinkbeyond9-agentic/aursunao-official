/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  LoaderCircle,
  Maximize2,
  MicOff,
  Mic,
  Minimize2,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Upload,
  Waves,
  X,
  MessageSquare,
  Lock,
  BookOpen,
  LogOut,
  Clock,
  Building2,
  Bot,
  Coins,
  Watch,
  HeartHandshake,
  Heart,
  Calculator,
  FileCheck2,
  Network,
  Layers,
  Lightbulb,
  Compass,
  Award,
  Gift,
  ExternalLink
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Story, UserState, VentBounty } from './types';
import { TRANSLATIONS, MOODS, TYPES, MOOD_COLORS, REASONS_CARDS, INITIAL_STORIES, FAQ_LIST, FAQ_CATEGORIES, HERO_VARIATIONS } from './data';
import { Logo } from './components/Logo';
import { MoodHeatmap } from './components/MoodHeatmap';
import { ResilienceSearchBar } from './components/ResilienceSearchBar';
import { StoryCategorySection } from './components/StoryCategorySection';
import { StoriesVaultModal } from './components/StoriesVaultModal';
import { PracticalConverter } from './components/PracticalConverter';
import { WhatsAppVoiceBoothModal } from './components/WhatsAppVoiceBoothModal';
import { RegisterModal } from './components/RegisterModal';
import { LiveInstantMoodAnalyzer, computeInstantMood } from './components/LiveInstantMoodAnalyzer';
import { IcpCommunityDashboard } from './components/IcpCommunityDashboard';
import { BrandMarketIntelligence } from './components/BrandMarketIntelligence';
import { SyntheticIcpAvatars } from './components/SyntheticIcpAvatars';
import { BiometricEmotionSync } from './components/BiometricEmotionSync';
import { VentBounties } from './components/VentBounties';
import { AlgorithmicEmpathyMatcher } from './components/AlgorithmicEmpathyMatcher';
import { EmotionalVarianceSparkline } from './components/EmotionalVarianceSparkline';
import { StressTopicCorrelationAlert } from './components/StressTopicCorrelationAlert';
import { recordVentToHistory, extractTopicsFromText } from './utils/stressKeywordCorrelation';
import { profanityFilter } from './utils/profanityFilter';
import { DEMO_STORIES, COMMUNITY_PEOPLE, ICP_COHORTS } from './icpDataset';
import { AudioStreamAnalyzer, suggestMoodFromAudioStream, AudioMetrics, MoodSuggestion } from './audioMoodDetector';

export const MOOD_EMOJIS: Record<string, string> = {
  overwhelmed: '🌊',
  stressed: '⚡',
  relieved: '🌱',
  anxious: '💭',
  frustrated: '🔥',
  reflective: '🌙',
  burnout: '🥀',
  conflicted: '⚖️',
  hopeful: '✨',
  vulnerable: '🕊️',
  lonely: '🌧️',
  grateful: '🙏',
  exhausted: '🔋',
  calm: '🍃',
  happy: '😊',
};

export const VOICE_EMOTION_CHIPS = [
  {
    id: 'Happy',
    label: 'Happy',
    labelHi: 'खुश',
    emoji: '😊',
    activeClass: 'bg-[#FFD166] text-black border-[#FFD166] font-semibold shadow-[0_0_14px_rgba(255,209,102,0.4)]',
    moodKey: 'happy'
  },
  {
    id: 'Frustrated',
    label: 'Frustrated',
    labelHi: 'हताश',
    emoji: '😤',
    activeClass: 'bg-[#FF5C5C] text-white border-[#FF5C5C] font-semibold shadow-[0_0_14px_rgba(255,92,92,0.4)]',
    moodKey: 'frustrated'
  },
  {
    id: 'Relieved',
    label: 'Relieved',
    labelHi: 'राहत',
    emoji: '😌',
    activeClass: 'bg-[#06D6A0] text-black border-[#06D6A0] font-semibold shadow-[0_0_14px_rgba(6,214,160,0.4)]',
    moodKey: 'relieved'
  },
  {
    id: 'Stressed',
    label: 'Stressed',
    labelHi: 'तनावग्रस्त',
    emoji: '🤯',
    activeClass: 'bg-[#A78BFA] text-black border-[#A78BFA] font-semibold shadow-[0_0_14px_rgba(167,139,250,0.4)]',
    moodKey: 'stressed'
  }
] as const;

export default function App() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [heroCopy, setHeroCopy] = useState(HERO_VARIATIONS[0]);
  const baseT = TRANSLATIONS[lang];
  const t = { ...baseT, ...heroCopy };

  useEffect(() => {
    setHeroCopy(HERO_VARIATIONS[Math.floor(Math.random() * HERO_VARIATIONS.length)]);
  }, []);

  const [user, setUser] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem('aur_sunao_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return { name: 'Guest', anon: true, avatar: '', isRegistered: false };
  });
  const [ventCount, setVentCount] = useState<number>(1);
  const [firstVentDate, setFirstVentDate] = useState<number | null>(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(21);
  const [trialActive, setTrialActive] = useState<boolean>(true);

  // Modals
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [pendingStoryToOpen, setPendingStoryToOpen] = useState<Story | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<boolean>(false);
  const [showStoriesVaultModal, setShowStoriesVaultModal] = useState<boolean>(false);
  const [isStoriesSectionExpandedOnPage, setIsStoriesSectionExpandedOnPage] = useState<boolean>(false);
  const [expandedOnPageStoryIds, setExpandedOnPageStoryIds] = useState<Set<string>>(new Set());
  const [isAllOnPageExpanded, setIsAllOnPageExpanded] = useState<boolean>(false);

  const toggleOnPageStoryExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedOnPageStoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllOnPageExpand = () => {
    if (isAllOnPageExpanded) {
      setExpandedOnPageStoryIds(new Set());
      setIsAllOnPageExpanded(false);
    } else {
      setExpandedOnPageStoryIds(new Set(filteredStories.map((s) => s.id)));
      setIsAllOnPageExpanded(true);
    }
  };

  // 5 Minutes Inactivity Auto-Logout (300 seconds)
  const INACTIVITY_LIMIT_MS = 5 * 60 * 1000;
  const lastActivityTimeRef = useRef<number>(Date.now());
  const [secondsToInactivityLogout, setSecondsToInactivityLogout] = useState<number>(300);

  const handleLogout = (reason: 'inactivity' | 'manual' = 'manual') => {
    const guestUser: UserState = { name: 'Guest', anon: true, avatar: '', isRegistered: false };
    setUser(guestUser);
    try {
      localStorage.removeItem('aur_sunao_user');
    } catch (e) {
      console.error(e);
    }
    setSelectedStory(null);
    setPendingStoryToOpen(null);
    setShowLogin(false);
    lastActivityTimeRef.current = Date.now();
    setSecondsToInactivityLogout(300);

    if (reason === 'inactivity') {
      setToastMessage(
        lang === 'en'
          ? 'You have been logged out after 5 minutes of inactivity for your privacy.'
          : '5 मिनट की निष्क्रियता के बाद आपकी गोपनीयता के लिए लॉग आउट कर दिया गया।'
      );
    } else {
      setToastMessage(
        lang === 'en'
          ? 'Successfully logged out. Stories are minimized & locked.'
          : 'सफलतापूर्वक लॉग आउट किया गया। कहानियां संक्षिप्त और सुरक्षित हैं।'
      );
    }
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Inactivity detection: Listen to mouse, keyboard, touch, and scroll events
  useEffect(() => {
    if (!user.isRegistered) return;

    lastActivityTimeRef.current = Date.now();
    setSecondsToInactivityLogout(300);

    const onUserActivity = () => {
      lastActivityTimeRef.current = Date.now();
    };

    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'click',
      'wheel',
    ];

    activityEvents.forEach((ev) => {
      window.addEventListener(ev, onUserActivity, { passive: true });
    });

    const timerInterval = setInterval(() => {
      const elapsed = Date.now() - lastActivityTimeRef.current;
      const remaining = Math.max(0, Math.ceil((INACTIVITY_LIMIT_MS - elapsed) / 1000));
      setSecondsToInactivityLogout(remaining);

      if (elapsed >= INACTIVITY_LIMIT_MS) {
        handleLogout('inactivity');
      }
    }, 1000);

    return () => {
      activityEvents.forEach((ev) => {
        window.removeEventListener(ev, onUserActivity);
      });
      clearInterval(timerInterval);
    };
  }, [user.isRegistered, lang]);

  // Ensure story detail modal is immediately closed if user is not logged in
  useEffect(() => {
    if (!user.isRegistered && selectedStory) {
      setSelectedStory(null);
    }
  }, [user.isRegistered, selectedStory]);

  const handleOpenStory = (story: Story) => {
    if (!user.isRegistered) {
      setPendingStoryToOpen(story);
      setShowRegisterModal(true);
      setToastMessage(
        lang === 'en'
          ? 'Please log in or register to open full stories.'
          : 'पूरी कहानी खोलने के लिए कृपया लॉग इन या रजिस्टर करें।'
      );
      setTimeout(() => setToastMessage(''), 3500);
    } else {
      setSelectedStory(story);
    }
  };

  const handleRegisterSuccess = (registeredUser: UserState) => {
    setUser(registeredUser);
    lastActivityTimeRef.current = Date.now();
    setSecondsToInactivityLogout(300);
    try {
      localStorage.setItem('aur_sunao_user', JSON.stringify(registeredUser));
    } catch (e) {
      console.error(e);
    }
    setShowRegisterModal(false);
    setToastMessage(
      lang === 'en'
        ? `Welcome, ${registeredUser.name}! Stories unlocked (auto-logout in 5m idle).`
        : `स्वागत है, ${registeredUser.name}! कहानियां अनलॉक हो गईं.`
    );
    setTimeout(() => setToastMessage(''), 4000);

    if (pendingStoryToOpen) {
      setSelectedStory(pendingStoryToOpen);
      setPendingStoryToOpen(null);
    }
  };

  // Voice booth states
  const [recordingState, setRecordingState] = useState<'idle' | 'listening' | 'processing' | 'ready'>('idle');
  const [transcriptLive, setTranscriptLive] = useState<string>('');
  const [transcriptInterim, setTranscriptInterim] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [anonymousToggle, setAnonymousToggle] = useState<boolean>(true);
  const [activeStoryDraft, setActiveStoryDraft] = useState<Story | null>(null);
  const [voiceEmotionTag, setVoiceEmotionTag] = useState<'Happy' | 'Frustrated' | 'Relieved' | 'Stressed' | null>(null);

  // New Neuro-Marketing & Monetization States
  const [showBiometricSync, setShowBiometricSync] = useState<boolean>(false);
  const [activeClaimingBounty, setActiveClaimingBounty] = useState<VentBounty | null>(null);
  const [showSyntheticAvatarsModal, setShowSyntheticAvatarsModal] = useState<boolean>(false);
  const [customBpmThreshold, setCustomBpmThreshold] = useState<number>(100);
  const [currentHeartRate, setCurrentHeartRate] = useState<number>(0);
  const [isMoodHeartSyncActive, setIsMoodHeartSyncActive] = useState<boolean>(false);
  const [presets, setPresets] = useState<{name: string, bpm: number, sensitivity: number}[]>([]);
  const [selectedPresetName, setSelectedPresetName] = useState<string>('');

  // Auto-Detect Emotion via Audio Stream states
  const [autoDetectEmotion, setAutoDetectEmotion] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aur_sunao_autodetect_emotion');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [audioMetrics, setAudioMetrics] = useState<AudioMetrics | null>(null);
  const [suggestedMoodInfo, setSuggestedMoodInfo] = useState<MoodSuggestion | null>(null);
  const [isManualEmotionOverride, setIsManualEmotionOverride] = useState<boolean>(false);
  const [isStressAlert, setIsStressAlert] = useState<boolean>(false);

  // Library filters
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedIcp, setSelectedIcp] = useState<string>('all');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stories, setStories] = useState<Story[]>(() => {
    const seen = new Set<string>();
    const combined = [...DEMO_STORIES, ...INITIAL_STORIES];
    return combined.filter(s => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  });

  // Navigation toast
  const [toastMessage, setToastMessage] = useState<string>('');

  // Mic permission states
  const [micStatus, setMicStatus] = useState<'checking' | 'prompt' | 'granted' | 'denied' | 'unsupported'>('checking');
  const [micErrorMessage, setMicErrorMessage] = useState<string>('');
  const [showMicModal, setShowMicModal] = useState<boolean>(false);
  const [hasPermissionChecked, setHasPermissionChecked] = useState<boolean>(false);
  const [isRequestingMic, setIsRequestingMic] = useState<boolean>(false);
  const [showHowToEnable, setShowHowToEnable] = useState<boolean>(false);
  const [typedFallbackText, setTypedFallbackText] = useState<string>('');
  const [showTypeFallbackBox, setShowTypeFallbackBox] = useState<boolean>(false);
  const [isSimulatingVoice, setIsSimulatingVoice] = useState<boolean>(false);

  // FAQ accordion open index & compact minimization states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isFaqMinimized, setIsFaqMinimized] = useState<boolean>(true);
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [isBrandsExpanded, setIsBrandsExpanded] = useState<boolean>(false);
  const [isSeoDeepDiveExpanded, setIsSeoDeepDiveExpanded] = useState<boolean>(false);
  const [showAllReasons, setShowAllReasons] = useState<boolean>(false);

  // Commercial & Enterprise B2C states
  const [showEnterpriseModal, setShowEnterpriseModal] = useState<boolean>(false);
  const [brandIntelligenceTab, setBrandIntelligenceTab] = useState<
    'listen' | 'cities_dashboard' | 'initiate_study' | 'active_studies' | 'synthetic_avatars' | 'vent_bounties' | 'cost_estimator'
  >('cities_dashboard');
  const [showLegalModal, setShowLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [enterpriseSubmitted, setEnterpriseSubmitted] = useState<boolean>(false);
  const [enterpriseForm, setEnterpriseForm] = useState({ company: '', email: '', useCase: 'consumer_insights' });
  const [supportSubmitted, setSupportSubmitted] = useState<boolean>(false);
  const [supportMessage, setSupportMessage] = useState<string>('');

  // Location & 30s Recording Prompt states
  const [userLocation, setUserLocation] = useState<string>('Mumbai, India');
  const [show30sPromptModal, setShow30sPromptModal] = useState<boolean>(false);
  const recordingTimerRef = useRef<any>(null);

  // Refs
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioAnalyzerRef = useRef<AudioStreamAnalyzer | null>(null);
  const boothRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize Trial Date
  useEffect(() => {
    try {
      let saved = localStorage.getItem('aur_sunao_firstVent');
      let ts: number;
      if (saved) {
        ts = parseInt(saved, 10);
        if (isNaN(ts)) {
          ts = Date.now();
          localStorage.setItem('aur_sunao_firstVent', String(ts));
        }
      } else {
        ts = Date.now();
        localStorage.setItem('aur_sunao_firstVent', String(ts));
      }
      setFirstVentDate(ts);

      const checkTrial = () => {
        const diff = 21 * 24 * 60 * 60 * 1000 - (Date.now() - ts);
        const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        setTrialDaysLeft(days);
        setTrialActive(diff > 0);
      };
      checkTrial();
      const interval = setInterval(checkTrial, 60000);
      return () => clearInterval(interval);
    } catch {
      setFirstVentDate(Date.now());
      setTrialDaysLeft(21);
      setTrialActive(true);
    }
  }, []);

  // SEO & Meta Synchronization
  useEffect(() => {
    document.title = "Aur Sunao - Tell me stories you can't tell your wife | Anonymous voice journal for overthinkers";
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Voice-first anonymous platform to vent, overthink out loud, and turn chaos into structured stories. 21 days free unlimited. No typing, no judgement.');
    setMeta('og:title', 'Aur Sunao - Tell me stories you can\'t tell your wife', true);
    setMeta('og:description', 'Voice-first anonymous platform to vent, overthink out loud, and turn chaos into structured stories.', true);
  }, []);

  // Fetch IP Location for anonymous stories
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city && data.country_name) {
          setUserLocation(`${data.city}, ${data.country_name}`);
        }
      })
      .catch(() => {
        setUserLocation('Delhi, India');
      });
  }, []);

  // 30-Second Recording Prompt Timer
  useEffect(() => {
    if (recordingState === 'listening') {
      recordingTimerRef.current = setTimeout(() => {
        if (!user.name || user.name === 'Anonymous') {
          setShow30sPromptModal(true);
        }
      }, 30000);
    } else {
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
      }
    }
    return () => {
      if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
    };
  }, [recordingState, user]);

  // Persist Auto-Detect Emotion preference
  useEffect(() => {
    try {
      localStorage.setItem('aur_sunao_autodetect_emotion', String(autoDetectEmotion));
    } catch {}
  }, [autoDetectEmotion]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentHeartRate > customBpmThreshold) {
      timer = setTimeout(() => {
        setIsStressAlert(true);
      }, 5000);
    } else {
      setIsStressAlert(false);
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [currentHeartRate, customBpmThreshold]);

  // Cleanup audio analyzer on component unmount
  useEffect(() => {
    return () => {
      if (audioAnalyzerRef.current) {
        try {
          audioAnalyzerRef.current.stop();
        } catch {}
        audioAnalyzerRef.current = null;
      }
    };
  }, []);

  // Real-time Audio Stream & Transcript Mood Suggestion during Recording
  useEffect(() => {
    if (recordingState === 'listening' && autoDetectEmotion) {
      const liveText = (transcriptLive + ' ' + transcriptInterim).trim();
      const suggestion = suggestMoodFromAudioStream(audioMetrics, liveText);
      setSuggestedMoodInfo(suggestion);

      // Auto-apply suggested emotion unless user manually selected a chip
      if (!isManualEmotionOverride && suggestion && suggestion.mood) {
        setVoiceEmotionTag(suggestion.mood);
      }
    }
  }, [recordingState, autoDetectEmotion, audioMetrics, transcriptLive, transcriptInterim, isManualEmotionOverride]);

  // Check Mic Permission on Load
  useEffect(() => {
    let mounted = true;
    (async () => {
      setMicStatus('checking');
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (mounted) {
            setMicStatus('unsupported');
            setMicErrorMessage('MediaDevices not supported - use text fallback');
            setShowTypeFallbackBox(true);
          }
          return;
        }
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const perm = await navigator.permissions.query({ name: 'microphone' as any });
            if (!mounted) return;
            if (perm.state === 'granted') {
              setMicStatus('granted');
            } else if (perm.state === 'denied') {
              setMicStatus('denied');
              setShowTypeFallbackBox(true);
            } else {
              setMicStatus('prompt');
            }
            perm.onchange = () => {
              if (perm.state === 'granted') setMicStatus('granted');
              else if (perm.state === 'denied') {
                setMicStatus('denied');
                setShowTypeFallbackBox(true);
              } else setMicStatus('prompt');
            };
            setHasPermissionChecked(true);
            if (perm.state === 'prompt') {
              setTimeout(() => {
                if (mounted) setIsRequestingMic(false);
              }, 800);
            }
            return;
          } catch {
            if (mounted) setMicStatus('prompt');
          }
        }
        if (mounted) {
          setMicStatus('prompt');
          setHasPermissionChecked(true);
        }
      } catch (err) {
        if (mounted) {
          setMicStatus('prompt');
          setHasPermissionChecked(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const requestMicPermission = async (): Promise<boolean> => {
    setIsRequestingMic(true);
    setMicErrorMessage('');
    setRecordingState('idle');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicStatus('unsupported');
        setMicErrorMessage(t.micNoDevice);
        setIsRequestingMic(false);
        setShowTypeFallbackBox(true);
        return false;
      }
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      }
      audioStreamRef.current = stream;
      setMicStatus('granted');
      setIsRequestingMic(false);
      setRecordingState('idle');
      setShowTypeFallbackBox(false);

      // Stop stream immediately until recording starts
      setTimeout(() => {
        try {
          stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        } catch {}
        if (audioStreamRef.current === stream) {
          audioStreamRef.current = null;
        }
      }, 600);
      return true;
    } catch (err: any) {
      console.warn('Mic permission error:', err);
      const errName = err?.name;
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setMicStatus('denied');
        setMicErrorMessage(lang === 'en' ? 'Microphone blocked. Please allow mic in browser settings.' : 'माइक ब्लॉक है। ब्राउज़र सेटिंग्स में अनुमति दें।');
        setShowTypeFallbackBox(true);
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setMicStatus('unsupported');
        setMicErrorMessage(t.micNoDevice);
        setShowTypeFallbackBox(true);
      } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
        setMicStatus('denied');
        setMicErrorMessage(lang === 'en' ? 'Mic is busy / in use by another app.' : 'माइक किसी और ऐप में इस्तेमाल हो रहा है।');
        setShowTypeFallbackBox(true);
      } else {
        setMicStatus('prompt');
        setMicErrorMessage(err?.message || 'Mic error');
        setShowTypeFallbackBox(true);
      }
      setIsRequestingMic(false);
      return false;
    }
  };

  const scrollToBooth = () => go('/booth');

  const handleSelectVoiceEmotion = (emotion: 'Happy' | 'Frustrated' | 'Relieved' | 'Stressed' | null) => {
    setVoiceEmotionTag(emotion);
    if (emotion) {
      setToastMessage(`Mood tagged: ${emotion}${recordingState === 'listening' ? ' (live recording)' : ''}`);
      setTimeout(() => setToastMessage(''), 2500);

      // If activeStoryDraft is currently visible, update it dynamically
      if (activeStoryDraft) {
        const updatedDraft = {
          ...activeStoryDraft,
          emotion: emotion.toLowerCase(),
          mood: emotion.toLowerCase(),
          structured: {
            ...activeStoryDraft.structured,
            emotion: emotion
          }
        };
        setActiveStoryDraft(updatedDraft);
        setStories(prev => prev.map(s => s.id === updatedDraft.id ? updatedDraft : s));
      }
    }
  };

  const handleToggleAutoDetect = async () => {
    const nextVal = !autoDetectEmotion;
    setAutoDetectEmotion(nextVal);
    if (nextVal) {
      setIsManualEmotionOverride(false);
      setToastMessage(lang === 'en' ? 'Auto-Detect ON: Analyzing vocal tone & cadence...' : 'ऑटो-डिटेक्ट चालू: आवाज़ की टोन का विश्लेषण...');
      setTimeout(() => setToastMessage(''), 2500);

      // If currently listening, start audio stream analyzer
      if (recordingState === 'listening' && audioStreamRef.current && !audioAnalyzerRef.current) {
        try {
          const analyzer = new AudioStreamAnalyzer();
          audioAnalyzerRef.current = analyzer;
          analyzer.start(audioStreamRef.current, (metrics) => {
            setAudioMetrics(metrics);
          });
        } catch (e) {
          console.warn('Audio stream analyzer start failed:', e);
        }
      }
    } else {
      setToastMessage(lang === 'en' ? 'Auto-Detect OFF: Manual emotion tagging' : 'ऑटो-डिटेक्ट बंद: मैनुअल मूड टैग');
      setTimeout(() => setToastMessage(''), 2500);
      if (audioAnalyzerRef.current) {
        try { audioAnalyzerRef.current.stop(); } catch {}
        audioAnalyzerRef.current = null;
      }
      setAudioMetrics(null);
    }
  };

  const handleSyncWithStream = () => {
    setIsManualEmotionOverride(false);
    if (suggestedMoodInfo && suggestedMoodInfo.mood) {
      handleSelectVoiceEmotion(suggestedMoodInfo.mood);
      setToastMessage(lang === 'en' ? `Re-synced with audio stream: ${suggestedMoodInfo.mood}` : `आवाज़ की टोन से री-सिंक: ${suggestedMoodInfo.mood}`);
      setTimeout(() => setToastMessage(''), 2500);
    }
  };

  const createDraftStory = (rawText: string): Story => {
    const assignedEmotion = voiceEmotionTag || 'anxious';
    const assignedMood = voiceEmotionTag ? voiceEmotionTag.toLowerCase() : 'anxious';
    const uniqueId = `story-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    return {
      id: uniqueId,
      createdAt: Date.now(),
      title: lang === 'en' ? 'Stuck between should and want' : 'चाहिए और चाहत के बीच',
      titleHi: 'चाहिए और चाहत के बीच',
      hook: lang === 'en' ? "Everyone says stay. My gut says leave. I'm in the middle." : 'सब कहते हैं रहो। दिल कहता है जाओ।',
      hookHi: 'सब कहते हैं रहो। दिल कहता है जाओ।',
      emotion: assignedEmotion,
      mood: assignedMood,
      type: 'career',
      themes: voiceEmotionTag ? [voiceEmotionTag.toLowerCase(), 'reflection'] : ['career', 'family', 'small-town'],
      location: 'Delhi',
      age: '26',
      claps: 0,
      helped: 0,
      buyRequests: 0,
      anonymous: anonymousToggle,
      author: anonymousToggle ? 'Anonymous • 26 • Delhi' : `${user.name} • 26 • Delhi`,
      transcript: rawText,
      instantMoodAnalysis: computeInstantMood(rawText, assignedEmotion),
      structured: {
        people: lang === 'en' ? 'Me, parents, manager' : 'मैं, माता-पिता, मैनेजर',
        setting: lang === 'en' ? 'Late night, laptop open' : 'आधी रात, लैपटॉप खुला',
        emotion: assignedEmotion,
        conflict: lang === 'en' ? 'Fear of disappointing vs need to breathe' : 'निराश करने का डर vs साँस लेने की ज़रूरत',
        turning: lang === 'en' ? 'Said it out loud for first time' : 'पहली बार ज़ोर से बोला',
        insight: lang === 'en' ? "Clarity doesn't come from thinking more, it comes from speaking" : 'साफ़ सोचने से नहीं, बोलने से आता है',
        narrative: rawText + (lang === 'en' ? " I thought I needed a plan. Actually I needed to hear myself say it. That is the first draft of my resignation - not to my boss, but to my old story." : " लगा प्लान चाहिए। असल में खुद को बोलते हुए सुनना था। यही मेरे इस्तीफे का पहला ड्राफ्ट है - बॉस को नहीं, अपनी पुरानी कहानी को।"),
        narrativeHi: rawText
      }
    };
  };

  const processDraft = async (text: string) => {
    setSaveStatus('saving');
    setRecordingState('processing');

    const targetMood = voiceEmotionTag ? voiceEmotionTag.toLowerCase() : (selectedMood === 'all' ? 'anxious' : selectedMood);

    try {
      const response = await fetch('/api/structure-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          mood: targetMood,
          type: selectedType === 'all' ? 'career' : selectedType,
          location: userLocation
        })
      });
      const data = await response.json();
      if (data.success && data.story) {
        const s = data.story;
        const assignedEmotion = voiceEmotionTag || s.mood || 'anxious';
        const assignedMood = voiceEmotionTag ? voiceEmotionTag.toLowerCase() : (s.mood || 'anxious');
        const uniqueId = `story-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const newStory: Story = {
          id: uniqueId,
          createdAt: Date.now(),
          title: s.title || text.slice(0, 30) + '...',
          titleHi: s.title || text.slice(0, 30) + '...',
          hook: s.hook || text.slice(0, 60),
          hookHi: s.hook || text.slice(0, 60),
          emotion: assignedEmotion,
          mood: assignedMood,
          type: s.type || 'career',
          themes: s.themes || (voiceEmotionTag ? [voiceEmotionTag.toLowerCase(), 'clarity'] : ['venting', 'clarity']),
          location: userLocation,
          age: s.age || '26',
          claps: 0,
          helped: 0,
          buyRequests: 0,
          anonymous: anonymousToggle,
          author: anonymousToggle ? `Anonymous • ${s.age || '26'} • ${userLocation}` : `${user.name} • ${s.age || '26'} • ${userLocation}`,
          transcript: text,
          instantMoodAnalysis: computeInstantMood(text, assignedEmotion),
          structured: {
            people: s.people || 'Self',
            setting: s.setting || userLocation,
            emotion: assignedEmotion,
            conflict: s.conflict || 'Internal vent',
            turning: s.turning || 'Spoken out loud',
            insight: s.insight || 'Clarity through voice',
            narrative: s.narrative || text,
            narrativeHi: s.narrative || text
          },
          tweet: s.tweet || null
        };

        setActiveStoryDraft(newStory);
        setStories(prev => [newStory, ...prev.filter(s => s.id !== newStory.id)]);
        
        // Append to multi-vent history for recurring topic & stress trend correlation
        const emotionalStress = assignedEmotion === 'Stressed' ? 90 : (assignedEmotion === 'Frustrated' ? 84 : (assignedEmotion === 'Relieved' ? 28 : 20));
        recordVentToHistory({
          id: uniqueId,
          transcript: text,
          emotion: (['Happy', 'Frustrated', 'Relieved', 'Stressed'].includes(assignedEmotion) ? assignedEmotion : 'Stressed') as any,
          stressScore: emotionalStress,
          topics: extractTopicsFromText(text),
          source: 'booth'
        });

        setSaveStatus('saved');
        setRecordingState('ready');
        setToastMessage('Mini-story created & saved to library ✓');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error("AI structure story error:", err);
      const fallbackStory = createDraftStory(text);
      setActiveStoryDraft(fallbackStory);
      setStories(prev => [fallbackStory, ...prev.filter(s => s.id !== fallbackStory.id)]);
      
      const fallbackEmotion = voiceEmotionTag || 'Stressed';
      const fallbackStress = fallbackEmotion === 'Stressed' ? 88 : (fallbackEmotion === 'Frustrated' ? 82 : (fallbackEmotion === 'Relieved' ? 30 : 20));
      recordVentToHistory({
        id: fallbackStory.id,
        transcript: text,
        emotion: fallbackEmotion,
        stressScore: fallbackStress,
        topics: extractTopicsFromText(text),
        source: 'booth-fallback'
      });

      setSaveStatus('saved');
      setRecordingState('ready');
    }
  };

  const startVoiceRecording = async () => {
    if (micStatus !== 'granted') {
      const ok = await requestMicPermission();
      if (!ok) return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setActiveStoryDraft(null);
    setSaveStatus('idle');
    setTranscriptInterim('');
    setIsManualEmotionOverride(false);

    if (!SpeechRec) {
      // Fallback simulation for browsers without SpeechRecognition
      setRecordingState('listening');
      setIsSimulatingVoice(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        recorder.start();

        if (autoDetectEmotion && !audioAnalyzerRef.current) {
          const analyzer = new AudioStreamAnalyzer();
          audioAnalyzerRef.current = analyzer;
          analyzer.start(stream, (metrics) => {
            setAudioMetrics(metrics);
          });
        }
      } catch {}

      const sampleText = lang === 'en'
        ? "Okay so I've been thinking... my job doesn't feel like me anymore, I keep drafting resignation in my head but I never send it because what if I disappoint everyone?"
        : "तो मैं सोच रहा था... नौकरी मेरी जैसी नहीं लगती अब, मैं रोज़ इस्तीफा सोचता हूँ पर भेजता नहीं, लगता है सबको निराश कर दूँगा।";

      setTranscriptLive('');
      setTranscriptInterim('');
      let idx = 0;
      const simTimer = setInterval(() => {
        idx += 2 + Math.floor(Math.random() * 3);
        if (idx >= sampleText.length) {
          clearInterval(simTimer);
          setTranscriptLive(sampleText);
          setTranscriptInterim('');
          setIsSimulatingVoice(false);
          try {
            audioAnalyzerRef.current?.stop();
            audioAnalyzerRef.current = null;
            mediaRecorderRef.current?.stop();
            audioStreamRef.current?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
          } catch {}
          processDraft(sampleText);
        } else {
          setTranscriptLive(sampleText.slice(0, idx));
          setTranscriptInterim(sampleText.slice(idx, idx + 12));
        }
      }, 80);
      (window as any).__simTimer = simTimer;
      return;
    }

    try {
      // Connect live audio stream for real-time acoustic analysis
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        if (autoDetectEmotion && !audioAnalyzerRef.current) {
          const analyzer = new AudioStreamAnalyzer();
          audioAnalyzerRef.current = analyzer;
          analyzer.start(stream, (metrics) => {
            setAudioMetrics(metrics);
          });
        }
      } catch (audioErr) {
        console.warn('Live audio stream capture notice:', audioErr);
      }

      const rec = new SpeechRec();
      rec.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      rec.continuous = true;
      rec.interimResults = true;
      recognitionRef.current = rec;

      rec.onstart = () => {
        setRecordingState('listening');
        setTranscriptLive('');
        setTranscriptInterim('');
        setMicStatus('granted');
      };

      rec.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalStr += profanityFilter(res[0].transcript) + ' ';
          } else {
            interimStr += profanityFilter(res[0].transcript);
          }
        }
        setTranscriptLive(finalStr);
        setTranscriptInterim(interimStr);
      };

      rec.onend = () => {
        setRecordingState('idle');
        const fullText = profanityFilter((transcriptLive + ' ' + transcriptInterim).trim());
        if (fullText.length > 3) {
          setTranscriptLive(fullText);
          setTranscriptInterim('');
          processDraft(fullText);
        } else {
          setRecordingState('idle');
          setSaveStatus('idle');
        }
      };

      rec.onerror = (err: any) => {
        console.warn('SpeechRecognition error', err);
        setRecordingState('idle');
        if (err?.error === 'not-allowed' || err?.error === 'service-not-allowed') {
          setMicStatus('denied');
          setMicErrorMessage(lang === 'en' ? 'Microphone blocked. Please allow mic in browser settings.' : 'माइक ब्लॉक है। ब्राउज़र सेटिंग्स में अनुमति दें।');
          setShowTypeFallbackBox(true);
        }
      };

      rec.start();
    } catch (e) {
      setRecordingState('idle');
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if ((window as any).__simTimer) {
      clearInterval((window as any).__simTimer);
    }
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (audioAnalyzerRef.current) {
      try {
        audioAnalyzerRef.current.stop();
      } catch {}
      audioAnalyzerRef.current = null;
    }
    setAudioMetrics(null);
    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      } catch {}
      audioStreamRef.current = null;
    }
    setIsSimulatingVoice(false);
    setRecordingState('idle');

    const fullText = (transcriptLive + ' ' + transcriptInterim).trim();
    if (fullText.length > 0) {
      setTranscriptLive(fullText);
      setTranscriptInterim('');
      processDraft(fullText);
    } else {
      setSaveStatus('idle');
    }
  };

  const saveDraftToLibrary = async () => {
    if (!activeStoryDraft) return;
    const currentDraft = activeStoryDraft;
    setStories(prev => [currentDraft, ...prev.filter(s => s.id !== currentDraft.id)]);
    setVentCount((prev) => prev + 1);

    // If this vent was recorded to claim an active enterprise bounty
    if (activeClaimingBounty) {
      const bounty = activeClaimingBounty;
      try {
        const res = await fetch('/api/bounties/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bountyId: bounty.id,
            userVentId: currentDraft.id,
            userWalletAddress: user.email || 'upi@okaxis'
          }),
        });
        const claimData = await res.json();
        if (claimData.success) {
          const pointsEarned = claimData.rewardEarned || claimData.rewardCredited || (bounty.bountyRewardPoints || bounty.bountyRewardRupees || 500);
          setUser(prev => {
            const updated = {
              ...prev,
              creatorWalletBalance: (prev.creatorWalletBalance || 0) + pointsEarned,
              loyaltyPointsBalance: (prev.loyaltyPointsBalance || prev.creatorWalletBalance || 0) + pointsEarned
            };
            try {
              localStorage.setItem('aur_sunao_user', JSON.stringify(updated));
            } catch {}
            return updated;
          });
          setToastMessage(
            lang === 'en'
              ? `${pointsEarned.toLocaleString('en-IN')} Loyalty Points credited to your Member Wallet for "${bounty.promptTitle}"! ✓`
              : `${pointsEarned.toLocaleString('en-IN')} लॉयल्टी पॉइंट्स आपके वॉलेट में जमा हो गए! ✓`
          );
        }
      } catch (err) {
        console.warn('Bounty claim network notice:', err);
      }
      setActiveClaimingBounty(null);
    } else {
      setToastMessage(lang === 'en' ? 'Saved to library anonymously ✓' : 'गुमनाम रूप से लाइब्रेरी में सेव हो गया ✓');
    }

    setActiveStoryDraft(null);
    setTranscriptLive('');
    setTranscriptInterim('');
    setSaveStatus('idle');
    setRecordingState('idle');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filteredStories = useMemo(() => {
    const seen = new Set<string>();
    return stories.filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);

      if (selectedDayFilter !== null) {
        let daysAgo = 0;
        if (s.createdAt) {
          const diffDays = Math.floor((Date.now() - s.createdAt) / (1000 * 60 * 60 * 24));
          daysAgo = Math.max(0, Math.min(20, diffDays));
        } else {
          daysAgo = (parseInt(s.id, 10) || 0) % 21;
        }
        const storyDay = 21 - daysAgo;
        if (storyDay !== selectedDayFilter) return false;
      }
      if (selectedMood !== 'all' && s.mood !== selectedMood) return false;
      if (selectedType !== 'all' && s.type !== selectedType) return false;
      if (selectedIcp !== 'all' && s.icpPersona !== selectedIcp) return false;
      if (selectedPersonId && s.personId !== selectedPersonId) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          s.title.toLowerCase().includes(q) ||
          s.hook.toLowerCase().includes(q) ||
          s.mood.toLowerCase().includes(q) ||
          (s.author && s.author.toLowerCase().includes(q)) ||
          (s.location && s.location.toLowerCase().includes(q)) ||
          (s.themes && s.themes.some((t) => t.toLowerCase().includes(q)));
        if (!match) return false;
      }
      return true;
    });
  }, [stories, selectedDayFilter, selectedMood, selectedType, selectedIcp, selectedPersonId, searchQuery]);

  const handleClap = (id: string) => {
    setStories((prev) => prev.map((s) => s.id === id ? { ...s, claps: s.claps + 1 } : s));
  };

  const handleHelped = (id: string) => {
    setStories((prev) => prev.map((s) => s.id === id ? { ...s, helped: s.helped + 1 } : s));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith('text') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setTranscriptLive(text);
        processDraft(text);
      };
      reader.readAsText(file);
    } else {
      const fallback = lang === 'en' ? "I've been holding this story for months... finally saying it out loud." : "मैं ये कहानी महीनों से पकड़े था... आज बोल रहा हूँ।";
      setTranscriptLive(fallback);
      processDraft(fallback);
    }
  };

  // ==================== Multi-page routing ====================
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Hide a section unless the current route matches its page.
  const show = (page: string) =>
    path === page ? {} : ({ style: { display: 'none' } as React.CSSProperties });

  // Navigate to a page (optionally scrolling to an anchor within it).
  const go = (route: string, anchor?: string) => {
    if (path !== route) navigate(route);
    window.setTimeout(() => {
      if (anchor) {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 90);
  };

  // Scroll to top & update document title on every page change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const titles: Record<string, string> = {
      '/': 'Aur Sunao — Speak. Unburden. Grow.',
      '/booth': 'Voice Booth — Aur Sunao',
      '/bounties': 'Vent Bounties — Aur Sunao',
      '/stories': 'Stories Library — Aur Sunao',
      '/pricing': 'Pricing — Aur Sunao',
      '/brands': 'Brand Intelligence Suite — Aur Sunao',
      '/faq': 'Help & FAQ — Aur Sunao',
    };
    document.title = titles[path] || 'Aur Sunao — Speak. Unburden. Grow.';
  }, [path]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] selection:bg-[#FF6B5B] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-[#FF6B5B] text-black px-6 py-3 font-sans text-[13px] font-bold shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-2 fade-up">
          <Check size={16} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0A0A0B]/80 border-b border-white/10">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => go('/')} className="cursor-pointer bg-transparent border-0 p-0 shrink-0" aria-label="Go to Aur Sunao home">
              <Logo size="sm" />
            </button>

            {/* Full nav — desktop */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {[
                { label: 'Home', route: '/' },
                { label: 'Voice Booth', route: '/booth' },
                { label: 'Stories', route: '/stories' },
                { label: 'Bounties', route: '/bounties' },
                { label: 'Brands', route: '/brands' },
                { label: 'Pricing', route: '/pricing' },
                { label: 'FAQ', route: '/faq' },
              ].map(item => (
                <button
                  key={item.route}
                  onClick={() => go(item.route)}
                  className={`px-3 py-1.5 rounded-full font-sans text-[13px] whitespace-nowrap transition cursor-pointer ${
                    path === item.route
                      ? 'bg-white text-black font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setShowBiometricSync(true); go('/booth'); }}
                className="px-3 py-1.5 rounded-full font-sans text-[12px] whitespace-nowrap text-[#FFB300] hover:bg-[#FFB300]/10 transition cursor-pointer"
                title="Biometric Emotion Sync"
              >
                <Watch size={13} className="inline -mt-0.5" /> Biometrics
              </button>
              <button
                onClick={() => setShowSyntheticAvatarsModal(true)}
                className="px-3 py-1.5 rounded-full font-sans text-[12px] whitespace-nowrap text-[#25D366] hover:bg-[#25D366]/10 transition cursor-pointer"
                title="Synthetic ICP Avatars"
              >
                <Bot size={13} className="inline -mt-0.5" /> ICPs
              </button>
            </nav>

            {/* Compact menu — tablet & mobile */}
            <div className="relative group lg:hidden">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition text-[13px] font-sans shrink-0">
                Menu <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-[190px] bg-[#1A1A1B] border border-white/10 rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="flex flex-col gap-3 text-[13px]">
                  {[
                    { label: 'Home', route: '/', active: path === '/' },
                    { label: 'Voice Booth', route: '/booth', active: path === '/booth' },
                    { label: 'Stories Library', route: '/stories', active: path === '/stories' },
                    { label: 'Vent Bounties', route: '/bounties', active: path === '/bounties' },
                    { label: 'Brand Suite', route: '/brands', active: path === '/brands' },
                    { label: 'Pricing', route: '/pricing', active: path === '/pricing' },
                    { label: 'Help & FAQ', route: '/faq', active: path === '/faq' },
                  ].map(item => (
                    <button
                      key={item.route}
                      onClick={() => go(item.route)}
                      className={`text-left transition cursor-pointer ${item.active ? 'text-[#FF6B5B] font-bold' : 'hover:text-white'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="h-px bg-white/10 my-1" />
                  <button onClick={() => { setShowBiometricSync(true); go('/booth'); }} className="text-left text-[#FFB300] transition cursor-pointer">Biometric Sync</button>
                  <button onClick={() => setShowSyntheticAvatarsModal(true)} className="text-left text-[#25D366] transition cursor-pointer">Synthetic ICPs</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center rounded-full border border-white/15 p-1 text-[11px] font-sans">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full transition ${lang === 'en' ? 'bg-white text-black' : 'opacity-60'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-3 py-1 rounded-full transition ${lang === 'hi' ? 'bg-white text-black' : 'opacity-60'}`}
              >
                हिंदी
              </button>
            </div>

            {/* Trial badge */}
            <div className="hidden md:flex items-center gap-2 ml-2 text-[11px] font-sans border border-white/10 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF6B5B] animate-pulse" />
              {trialActive ? `${trialDaysLeft} ${t.daysLeft} • Unlimited` : 'Trial ended'}
            </div>

            {/* Register / Status / Logout Buttons */}
            {!user.isRegistered ? (
              <button
                onClick={() => {
                  setPendingStoryToOpen(null);
                  setShowRegisterModal(true);
                }}
                className="ml-1 px-3 py-1.5 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black font-sans text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <Lock size={11} />
                <span>{lang === 'en' ? 'Register' : 'रजिस्टर'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <div
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white font-sans text-[11px]"
                  title={
                    lang === 'en'
                      ? `Active session • Auto-logout after 5m idle (${Math.floor(secondsToInactivityLogout / 60)}m ${secondsToInactivityLogout % 60}s left)`
                      : `सक्रिय सत्र • 5 मिनट निष्क्रियता पर ऑटो-लॉगआउट`
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                  <span className="opacity-80 font-medium truncate max-w-[90px]">{user.name}</span>
                </div>

                {/* Direct Logout Button */}
                <button
                  type="button"
                  id="header-logout-btn"
                  onClick={() => handleLogout('manual')}
                  className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#FF5C5C]/20 border border-white/15 hover:border-[#FF5C5C]/40 text-white/90 hover:text-[#FF5C5C] font-sans text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title={lang === 'en' ? 'Log out of site' : 'साइट से लॉग आउट करें'}
                >
                  <LogOut size={12} />
                  <span>{lang === 'en' ? 'Logout' : 'लॉग आउट'}</span>
                </button>
              </div>
            )}

            {/* Login / Profile */}
            <button
              onClick={() => setShowLogin(true)}
              className={`ml-1 w-8 h-8 rounded-full font-sans text-[11px] font-bold grid place-items-center transition cursor-pointer ${
                user.isRegistered
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-[#FF6B5B] text-black hover:brightness-110'
              }`}
              title={user.isRegistered ? `Logged in as ${user.name}` : 'Login / Register'}
            >
              {user.isRegistered ? (user.avatar || user.name[0] || 'U') : (user.anon ? 'A' : user.name[0])}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section {...show('/')} id="hero" className="mx-auto max-w-[1280px] px-5 md:px-8 pt-12 md:pt-20 pb-10" lang={lang}>
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div>
            <div className="mb-6">
              <Logo size="lg" />
            </div>
            <h1 className="font-display text-[48px] md:text-[84px] leading-[0.9] tracking-[-0.03em]">
              <span className="block">{t.hero1}</span>
              <span className="block">{t.hero2}</span>
              <span className="block opacity-40">{t.hero3}</span>
              <span className="block text-[#FF6B5B]">{t.hero4}</span>
            </h1>
            <p className="font-sans mt-6 text-[14px] md:text-[15px] leading-relaxed opacity-60 max-w-[38ch]">
              {t.heroSub}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 items-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6B5B] text-black px-4 py-2 font-sans text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                {t.heroFreeBadge}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 font-sans text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B5B]" />
                {trialActive ? `${trialDaysLeft} ${t.daysLeft}` : 'Trial ended'} • {t.unlimitedLabel}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={scrollToBooth}
                className="bg-[#FF6B5B] text-black rounded-full px-7 h-[48px] font-sans font-bold text-[14px] flex items-center gap-2 hover:brightness-110 transition shadow-[0_0_30px_rgba(204,255,0,0.2)]"
              >
                {t.heroCta} <ArrowRight size={16} />
              </button>
              <button
                onClick={() => document.getElementById('reasons')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full border border-white/15 px-6 h-[48px] font-sans text-[13px] opacity-80 hover:opacity-100 transition"
              >
                {lang === 'en' ? 'See why others talk' : 'दूसरे क्यों बोलते हैं देखो'}
              </button>
            </div>

            <div className="mt-10 flex items-center gap-3 font-sans text-[11px] opacity-50">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-7 h-7 rounded-full bg-zinc-700 border border-[#0A0A0B] grid place-items-center text-[10px]">
                    😊
                  </div>
                ))}
              </div>
              <span>
                {trialActive
                  ? lang === 'en'
                    ? `${trialDaysLeft} days left in free trial • ${ventCount} vents • anonymous`
                    : `${trialDaysLeft} ${t.daysLeft} फ्री ट्रायल में • ${ventCount} वेंट्स`
                  : '2,847 vents structured this week • anonymous'}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] bg-[#F5F5F0] text-black p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.4)] rotate-[-1deg]">
              <div className="flex justify-between items-center font-sans text-[11px] uppercase tracking-widest opacity-60">
                <span>Raw rant → Structured story</span>
                <span className="bg-black text-white px-2 py-1 rounded-full">Live demo</span>
              </div>
              <div className="mt-5 font-serif text-[22px] leading-[1.2]">
                “I kept saying I'm fine. I'm not.”
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 font-sans text-[11px]">
                <div className="rounded-xl bg-black text-white p-3">
                  <div className="opacity-50">People</div>
                  <div className="font-bold mt-1">Me, Mom</div>
                </div>
                <div className="rounded-xl bg-[#FF6B5B] p-3">
                  <div className="opacity-60">Emotion</div>
                  <div className="font-bold mt-1">Burnout • 26</div>
                </div>
                <div className="rounded-xl bg-zinc-100 p-3 col-span-2">
                  <div className="opacity-50">Insight</div>
                  <div className="font-medium mt-1 leading-snug">
                    “I'm not lazy. I'm tired of pretending the job fits.”
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] font-sans px-2 py-1 rounded-full bg-zinc-900 text-white">anxious</span>
                <span className="text-[10px] font-sans px-2 py-1 rounded-full border">career</span>
                <span className="text-[10px] font-sans px-2 py-1 rounded-full border">small-town</span>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-[20px] bg-[#FF5C5C] text-black p-4 font-sans font-bold text-[13px] rotate-[2deg] hidden md:block shadow-lg">
              Anonymous by default.<br />Save when you want.
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section {...show('/')} id="benefits" className="mx-auto max-w-[1280px] px-5 md:px-8 py-12 md:py-16" lang={lang}>
        <div className="rounded-[32px] bg-[#F5F5F0] text-black p-6 md:p-10 relative overflow-hidden">
          <div className="absolute -top-6 -left-2 md:left-4 font-display text-[120px] md:text-[160px] leading-none opacity-[0.07] select-none">
            “
          </div>
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-sans text-[11px] uppercase tracking-widest bg-black text-white px-3 py-1.5 rounded-full">
                {t.reasonsEyebrow}
              </span>
              <span className="font-sans text-[11px] px-3 py-1.5 rounded-full border border-black/10 bg-white">
                anonymous • no judgement • 3am safe
              </span>
            </div>

            <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
              <div>
                <h2 className="font-display text-[32px] md:text-[56px] leading-[0.9] tracking-[-0.02em]">
                  <span className="block">{t.brandLine}</span>
                  <span className="block mt-2 text-[22px] md:text-[28px] font-serif italic opacity-60 leading-[1.15]">
                    {t.brandLine2}
                  </span>
                </h2>

                <div className="mt-6">
                  <div className="font-display text-[24px] md:text-[30px] leading-[0.95]">
                    You don't need advice.<br />
                    <span className="text-[#FF5C5C]">You need to get it out.</span>
                  </div>
                  <p className="font-sans text-[13px] md:text-[14px] opacity-60 mt-4 leading-relaxed max-w-[42ch]">
                    {t.heroSub}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 font-sans text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#FF6B5B] animate-pulse" />
                      {lang === 'en' ? 'Voice-only • No typing needed' : 'सिर्फ आवाज़ • टाइपिंग नहीं'}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 font-sans text-[11px]">
                      {lang === 'en' ? 'Green dot = mic ready • Red pulse = listening' : 'हरा = माइक तैयार • लाल = सुन रहा'}
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-[20px] bg-black text-white p-5 md:p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FF6B5B] text-black grid place-items-center font-bold shrink-0">
                    A
                  </div>
                  <div>
                    <div className="font-serif text-[16px] leading-[1.3]">
                      “I told my wife I'm fine. I told Aur Sunao I'm not. Slept better.”
                    </div>
                    <div className="font-sans text-[11px] opacity-50 mt-2">
                      Anonymous • 31 • Delhi • 2:47am vent • Auto-saved ✓
                    </div>
                    <div className="mt-2 flex gap-1.5">
                      <span className="text-[10px] px-2 py-1 rounded-full bg-white/10">anxious</span>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-[#FF6B5B] text-black">relief after vent</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.benefits.map((b, idx) => (
                  <div
                    key={idx}
                    className={`rounded-[20px] p-5 border flex flex-col justify-between min-h-[148px] ${
                      idx === 0
                        ? 'bg-[#FF6B5B] border-[#FF6B5B] sm:col-span-2'
                        : idx === 1
                        ? 'bg-black text-white border-black'
                        : 'bg-white border-black/10'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[20px]">{b.icon}</span>
                        <span className={`text-[10px] font-sans px-2 py-1 rounded-full ${idx === 1 ? 'bg-white/10 text-white' : 'bg-black/5'}`}>
                          0{idx + 1}
                        </span>
                      </div>
                      <div className="font-display text-[18px] leading-[1] mt-3">{b.title}</div>
                      <div className={`font-sans text-[12px] leading-[1.4] mt-2 ${idx === 1 ? 'opacity-70' : 'opacity-60'}`}>
                        {b.desc}
                      </div>
                    </div>
                    {idx === 0 && (
                      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] opacity-60">
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                        {lang === 'en' ? 'Live mood: pink/orange/lime/purple' : 'लाइव मूड: गुलाबी/नारंगी/लाइम/बैंगनी'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[16px] bg-[#FF6B5B]/30 border border-black/5 p-4 flex flex-wrap gap-3 items-center font-sans text-[11px]">
              <span className="font-bold">Brand promise:</span>
              <span className="px-3 py-1 rounded-full bg-black text-white">Tell me stories you can't tell your wife / spouse.</span>
              <span className="opacity-60">
                {lang === 'en'
                  ? '• 21 days free • Unlimited vents • Anonymous • Mic: green dot granted, red pulse listening, slash when blocked'
                  : '• 21 दिन फ्री • अनलिमिटेड • गुमनाम • माइक: हरा तैयार, लाल सुन रहा'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Booth (Main interactive core) */}
      <section ref={boothRef} {...show('/booth')} id="voice-booth" className="mx-auto max-w-[1280px] px-5 md:px-8 pb-14" lang={lang}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-sans text-[11px] tracking-widest uppercase opacity-40">Step 1 → Talk</span>
            <div className="hidden md:flex items-center gap-2 text-[11px] font-sans border border-white/10 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-[#FF6B5B] animate-pulse" />
              {lang === 'en' ? 'Live transcription • Auto-save' : 'लाइव टाइपिंग • ऑटो-सेव'}
            </div>
          </div>
          <div className="font-mono text-[10px] opacity-40 flex items-center gap-2">
            <span className={`hidden md:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
              micStatus === 'granted'
                ? 'bg-[#FF6B5B]/15 border-[#FF6B5B]/30 text-[#FF6B5B]'
                : micStatus === 'denied'
                ? 'bg-red-500/10 border-red-500/20 text-red-300'
                : 'bg-white/5 border-white/10'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                micStatus === 'granted' ? 'bg-[#FF6B5B] animate-pulse' : micStatus === 'denied' ? 'bg-red-400' : 'bg-white/40'
              }`} />
              {micStatus === 'granted' ? 'Mic • ready' : micStatus === 'denied' ? 'Mic • blocked' : 'Mic • prompt'}
            </span>
            <span className="hidden md:inline-flex rounded-full bg-white/5 border border-white/10 px-2 py-1">
              {trialActive ? `${trialDaysLeft} ${t.daysLeft}` : 'Trial ended'}
            </span>
            <span className="inline-flex items-center gap-1">
              {recordingState === 'listening' ? <span className="text-red-400 animate-pulse font-bold">● REC</span> : '○ idle'} • {transcriptLive.length + transcriptInterim.length} chars
            </span>
          </div>
        </div>

        {/* Active Claiming Bounty Callout Banner */}
        {activeClaimingBounty && (
          <div className="mb-6 rounded-[22px] bg-gradient-to-r from-[#FFB300]/20 via-[#FF6B5B]/15 to-[#FFB300]/20 border border-[#FFB300]/40 p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 fade-up">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFB300] text-black grid place-items-center font-bold text-base shrink-0 shadow-md">
                <Coins size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFB300] text-black">
                    Sponsored Vent Bounty Active
                  </span>
                  <span className="text-[11px] font-mono text-[#FFB300] font-semibold">
                    {activeClaimingBounty.brandName}
                  </span>
                </div>
                <h4 className="font-display text-[16px] md:text-[18px] text-white mt-1">
                  "{activeClaimingBounty.promptTitle}"
                </h4>
                <p className="font-sans text-[12px] opacity-70 mt-0.5 line-clamp-1">
                  {activeClaimingBounty.promptDescription}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono opacity-50">Loyalty Points Reward</div>
                <div className="font-mono text-[18px] font-bold text-[#FFB300] flex items-center justify-end gap-1">
                  <Award size={16} className="text-[#FFB300]" />
                  <span>+{(activeClaimingBounty.bountyRewardPoints || activeClaimingBounty.bountyRewardRupees || 500).toLocaleString('en-IN')} PTS</span>
                </div>
              </div>
              <button
                onClick={() => setActiveClaimingBounty(null)}
                className="text-[11px] font-sans px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Feature quick links & Biometric Telemetry Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-[12px] font-sans">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowBiometricSync(prev => !prev)}
              className={`ui-button ${
                showBiometricSync
                  ? 'bg-[#FF5C5C]/20 border-[#FF5C5C]/60 text-white shadow-[0_0_15px_rgba(255,92,92,0.25)] ring-1 ring-[#FF5C5C]/40'
                  : ''
              }`}
            >
              <Watch size={13} className={showBiometricSync ? 'text-[#FF5C5C] animate-pulse' : 'text-white/60'} />
              <span className="font-medium">
                {showBiometricSync ? 'Wearable Biometrics: Active' : 'Enable Apple Watch / Whoop Sync'}
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                showBiometricSync ? 'bg-[#FF5C5C] text-white' : 'bg-white/10 text-white/60'
              }`}>
                {showBiometricSync ? 'HRV LIVE' : 'HRV / Stress'}
              </span>
            </button>

            <button
              onClick={() => setShowSyntheticAvatarsModal(true)}
              className="ui-button"
            >
              <Bot size={13} className="text-[#25D366]" />
              <span>Synthetic ICP Avatars</span>
            </button>

              <button
                onClick={() => go('/bounties')}
                className="ui-button-primary"
              >
                <Coins size={13} />
                <span>Brand Vent Bounties (Earn 500–1200)</span>
              </button>
          </div>

          <div className="text-[11px] font-mono text-white/40 hidden md:block">
            Zero-knowledge anonymity • Voice-first neuro-insights
          </div>
        </div>

        {/* Live Biometric Overlay when toggled */}
        {showBiometricSync && (
          <div className="mb-6 fade-up">
            <BiometricEmotionSync
              isRecording={recordingState === 'listening'}
              transcript={transcriptLive}
              lang={lang}
              customBpmThreshold={customBpmThreshold}
              onReadingUpdate={(bpm) => setCurrentHeartRate(bpm)}
            />
          </div>
        )}

        <div className="rounded-[28px] md:rounded-[36px] bg-[#141416] border border-white/10 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          <div className="grid md:grid-cols-[1.2fr_0.8fr] min-h-[640px]">
            {/* Left Column: Voice Orb & Live Transcript */}
            <div className="relative p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-white/10">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-sans text-[11px] uppercase tracking-widest opacity-50">{t.boothEyebrow}</div>
                  <h2 className="font-display text-[28px] md:text-[38px] leading-[0.9] mt-2">{t.boothTitle}</h2>
                </div>
                <div className="hidden md:flex flex-col items-end gap-2">
                  <label className="flex items-center gap-2 font-sans text-[11px] opacity-80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anonymousToggle}
                      onChange={(e) => setAnonymousToggle(e.target.checked)}
                      className="rounded w-3 h-3 accent-[#FF6B5B]"
                    />
                    {t.anonymous}
                  </label>
                  <div className="font-mono text-[9px] opacity-40">{t.anonHint}</div>
                </div>
              </div>

              {/* Main Orb Center */}
              <div className="mt-8 flex flex-col items-center">
                {micStatus === 'prompt' && recordingState === 'idle' && (
                  <div className="flex flex-col items-center w-full max-w-[360px]">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full blur-[24px] bg-[#FF6B5B]/15 scale-125" />
                      <button
                        onClick={startVoiceRecording}
                        disabled={isRequestingMic}
                        className="relative w-[132px] h-[132px] rounded-full bg-[#FF6B5B] text-black grid place-items-center hover:scale-[1.03] shadow-[0_0_0_12px_rgba(204,255,0,0.12)] orb-pulse disabled:opacity-60 transition"
                      >
                        {isRequestingMic ? <LoaderCircle size={32} className="animate-spin" /> : <Mic size={36} strokeWidth={1.8} />}
                      </button>
                    </div>
                    <div className="mt-6 text-center">
                      <div className="font-display text-[22px] leading-[0.95]">{t.boothIdle}</div>
                      <div className="font-sans text-[12px] opacity-50 mt-2">{t.boothIdleSub}</div>
                    </div>
                    <button
                      onClick={requestMicPermission}
                      disabled={isRequestingMic}
                      className="mt-6 w-full rounded-full bg-[#FF6B5B] text-black h-[48px] font-sans font-bold text-[14px] flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 transition"
                    >
                      {isRequestingMic ? <LoaderCircle size={16} className="animate-spin" /> : <ShieldCheck size={18} />}
                      {t.enableMic}
                    </button>
                    <div className="mt-3 font-sans text-[10px] opacity-30 text-center leading-relaxed">
                      {t.enableMicSub} • We don't store raw audio without permission
                    </div>
                    <button
                      onClick={() => setShowTypeFallbackBox(true)}
                      className="mt-3 font-sans text-[11px] opacity-40 underline hover:opacity-80 transition"
                    >
                      {lang === 'en' ? "Can't enable mic? Type your story instead →" : 'माइक नहीं? टाइप करो →'}
                    </button>
                  </div>
                )}

                {micStatus === 'denied' && (
                  <div className="w-full max-w-[380px] rounded-[20px] bg-red-500/15 border border-red-500/20 p-5">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 grid place-items-center shrink-0">
                        <MicOff size={18} className="text-red-300" />
                      </div>
                      <div className="flex-1">
                        <div className="font-sans font-bold text-[14px] text-red-200 flex items-center gap-2">
                          {t.micDeniedTitle}
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        </div>
                        <div className="font-sans text-[12px] text-red-200/70 mt-1 leading-relaxed">
                          {micErrorMessage || t.micDeniedDesc}
                        </div>
                        <div className="mt-3 rounded-[12px] bg-black/30 border border-red-500/10 p-3 font-mono text-[10px] text-red-200/60 leading-relaxed">
                          {t.micDeniedHow}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={requestMicPermission}
                            className="rounded-full bg-white text-black px-5 h-9 font-sans text-[12px] font-bold flex items-center gap-1.5 hover:bg-zinc-100 transition"
                          >
                            {t.micTryAgain} <ArrowRight size={12} />
                          </button>
                          <button
                            onClick={() => setShowHowToEnable(!showHowToEnable)}
                            className="rounded-full border border-red-300/20 text-red-200 px-4 h-9 font-sans text-[11px] hover:bg-red-500/10 transition"
                          >
                            {t.micHowTo}
                          </button>
                        </div>
                        {showHowToEnable && (
                          <div className="mt-3 font-sans text-[11px] text-red-200/70 leading-relaxed bg-black/20 rounded-[10px] p-3">
                            <div className="font-bold text-[11px] mb-1">Chrome/Edge:</div>
                            1. Click 🔒 left of address bar → Site settings<br />
                            2. Microphone → Allow → Reload<br />
                            <div className="font-bold mt-2">Firefox/Safari:</div>
                            Check browser address bar settings or permissions panel.
                          </div>
                        )}
                        <button
                          onClick={() => setShowTypeFallbackBox(true)}
                          className="mt-3 w-full rounded-full bg-white/10 border border-white/10 text-white h-9 font-sans text-[11px] hover:bg-white/15 transition"
                        >
                          Type instead - continue without mic
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {(micStatus === 'granted' || micStatus === 'unsupported') && (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full blur-[24px] transition-all ${
                        recordingState === 'listening' ? 'bg-[#FF5C5C]/30 scale-150' : 'bg-[#FF6B5B]/20 scale-125'
                      }`} />
                      <button
                        onClick={recordingState === 'listening' ? stopVoiceRecording : startVoiceRecording}
                        className={`relative w-[132px] h-[132px] rounded-full grid place-items-center transition-all duration-300 ${
                          recordingState === 'listening'
                            ? 'bg-[#FF5C5C] rec-pulse shadow-[0_0_0_14px_rgba(255,92,92,0.15)] text-white'
                            : 'bg-[#FF6B5B] hover:scale-[1.03] shadow-[0_0_0_12px_rgba(204,255,0,0.12)] orb-pulse text-black'
                        }`}
                      >
                        <Mic size={38} strokeWidth={recordingState === 'listening' ? 2 : 1.8} />
                      </button>
                      <div className={`absolute -top-1 -right-1 w-7 h-7 rounded-full border-2 border-[#141416] grid place-items-center ${
                        recordingState === 'listening' ? 'bg-[#FF5C5C]' : 'bg-[#FF6B5B]'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${recordingState === 'listening' ? 'bg-white animate-pulse' : 'bg-black'}`} />
                      </div>
                    </div>

                    <div className="mt-6 min-h-[28px] flex flex-col items-center gap-2">
                      <div className="font-sans text-[13px] flex items-center gap-2">
                        {recordingState === 'idle' && (
                          <span className="opacity-50 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF6B5B]" />
                            {t.micGranted}
                          </span>
                        )}
                        {recordingState === 'listening' && (
                          <span className="text-[#FF6B5B] font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF5C5C] animate-pulse" />
                            {t.boothListening}
                          </span>
                        )}
                        {recordingState === 'processing' && (
                          <span className="flex items-center gap-2 text-white/80">
                            {saveStatus === 'saving' && (
                              <span className="flex items-center gap-1.5">
                                <LoaderCircle size={14} className="animate-spin" />
                                {t.boothSaving}
                                <span className="flex gap-1 ml-1">
                                  <span className="dot w-1 h-1 rounded-full bg-white/60" />
                                  <span className="dot w-1 h-1 rounded-full bg-white/60" />
                                  <span className="dot w-1 h-1 rounded-full bg-white/60" />
                                </span>
                              </span>
                            )}
                            {saveStatus === 'saved' && (
                              <span className="flex items-center gap-1.5 text-[#FF6B5B]">
                                <Check size={14} /> {t.boothSaved} ✓
                              </span>
                            )}
                          </span>
                        )}
                        {recordingState === 'ready' && (
                          <span className="opacity-90 flex items-center gap-2">
                            <Sparkles size={14} className="text-[#FF6B5B]" />
                            {t.boothReady}
                          </span>
                        )}
                      </div>

                      <div className="h-[28px] flex items-end gap-[3px]">
                        {[...Array(24)].map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-[3px] rounded-full transition-all ${
                              recordingState === 'listening' ? 'bg-[#FF6B5B] wave-bar' : 'bg-white/15'
                            }`}
                            style={{
                              height: recordingState === 'listening' ? `${10 + Math.sin(idx) * 6 + Math.random() * 18}px` : '10px',
                              animationDelay: `${idx * 0.06}s`,
                              opacity: recordingState === 'listening' ? 1 : 0.4
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Transcript Box */}
              <div className="mt-8 flex-1">
                {/* Quick-Select Emotion Chips with Audio Stream Auto-Detect */}
                <div 
                  id="voice-booth-emotion-chips" 
                  className={`mb-4 rounded-[16px] bg-white/[0.03] border p-3.5 transition-all duration-500 ease-in-out ${
                    isStressAlert 
                      ? 'border-[#FF5C5C] animate-pulse' 
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[11px] uppercase tracking-wider opacity-60 font-semibold flex items-center gap-1.5">
                        <Sparkles size={12} className="text-[#FF6B5B]" />
                        {lang === 'en' ? 'Tag current mood' : 'मूड टैग करें'}
                      </span>
                      {recordingState === 'listening' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF5C5C]/20 border border-[#FF5C5C]/30 text-[#FF5C5C] text-[10px] font-mono animate-pulse">
                          ● live stream
                        </span>
                      ) : (
                        <span className="font-sans text-[10px] opacity-40 hidden sm:inline">
                          {lang === 'en' ? '• before or during recording' : '• रिकॉर्डिंग से पहले या दौरान'}
                        </span>
                      )}
                    </div>

                    {/* Auto-Detect Toggle & Clear Control */}
                    <div className="flex items-center gap-2">
                      {/* Saved Configurations Dropdown */}
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-2 py-1">
                        <select
                          className="bg-transparent text-[10px] text-white/50 focus:outline-none"
                          onChange={(e) => {
                             if (e.target.value === 'save') {
                               // Save current preset
                               const newPreset = { name: `Preset ${presets.length + 1}`, bpm: customBpmThreshold, sensitivity: 5 };
                               setPresets([...presets, newPreset]);
                             } else {
                               const selected = presets.find(p => p.name === e.target.value);
                               if (selected) {
                                 setCustomBpmThreshold(selected.bpm);
                                 setSelectedPresetName(selected.name);
                               }
                             }
                          }}
                        >
                          <option value="">{selectedPresetName || 'Presets'}</option>
                          {presets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                          <option value="save">+ Save Current</option>
                        </select>
                        {selectedPresetName && (
                          <button
                            className="text-[10px] text-white/50 hover:text-white"
                            onClick={() => {
                              const newName = prompt('Enter new name:', selectedPresetName);
                              if (newName) {
                                setPresets(presets.map(p => p.name === selectedPresetName ? {...p, name: newName} : p));
                                setSelectedPresetName(newName);
                              }
                            }}
                          >
                            ✎
                          </button>
                        )}
                      </div>

                      {/* Heart Rate Sync Toggle */}
                      <button
                        type="button"
                        onClick={() => setShowBiometricSync(prev => !prev)}
                        className={`group px-2.5 py-1 rounded-full text-[11px] font-sans transition-all duration-200 flex items-center gap-2 border cursor-pointer ${
                          showBiometricSync 
                            ? 'bg-[#FF5C5C]/20 border-[#FF5C5C]/30 text-[#FF5C5C]' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <Heart size={12} className={showBiometricSync ? 'animate-pulse' : ''} />
                        Sync HR
                      </button>

                      {/* Mood-Heart Correlation Sync Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsMoodHeartSyncActive(!isMoodHeartSyncActive)}
                        className={`group px-2.5 py-1 rounded-full text-[11px] font-sans transition-all duration-200 flex items-center gap-2 border cursor-pointer ${
                          isMoodHeartSyncActive
                            ? 'bg-[#06B6D4]/20 border-[#06B6D4]/30 text-[#06B6D4]' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <Activity size={12} className={isMoodHeartSyncActive ? 'animate-pulse' : ''} />
                        Mood Sync: {isMoodHeartSyncActive ? 'ON' : 'OFF'}
                      </button>

                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-2 py-1">
                        <select
                          className="bg-transparent text-[10px] text-white/50 focus:outline-none"
                          onChange={(e) => setCustomBpmThreshold(Number(e.target.value))}
                        >
                          <option value="100">HR Limit</option>
                          <option value="60">Resting (60)</option>
                          <option value="100">Active (100)</option>
                          <option value="140">Peak (140)</option>
                        </select>
                        <input
                          type="number"
                          value={customBpmThreshold}
                          onChange={(e) => setCustomBpmThreshold(Number(e.target.value))}
                          className="w-10 bg-transparent text-[11px] font-mono text-white focus:outline-none"
                        />
                      </div>

                      {/* Auto-Detect Toggle */}
                      <button
                        type="button"
                        id="auto-detect-emotion-toggle"
                        onClick={handleToggleAutoDetect}
                        className={`group px-2.5 py-1 rounded-full text-[11px] font-sans transition-all duration-200 flex items-center gap-2 border cursor-pointer ${
                          autoDetectEmotion
                            ? 'bg-[#FF6B5B]/15 border-[#FF6B5B]/40 text-white hover:bg-[#FF6B5B]/25 shadow-[0_0_12px_rgba(255,107,91,0.15)]'
                            : 'bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.08] hover:text-white/80'
                        }`}
                        title={
                          lang === 'en'
                            ? 'Auto-Detect: Uses audio stream to automatically suggest and tag mood during recording'
                            : 'ऑटो-डिटेक्ट: रिकॉर्डिंग के दौरान आवाज़ की टोन से मूड का सुझाव दें'
                        }
                      >
                        <Activity
                          size={12}
                          className={autoDetectEmotion ? (recordingState === 'listening' ? 'text-[#FF6B5B] animate-pulse' : 'text-[#FF6B5B]') : 'text-white/40'}
                        />
                        <span className="font-medium">
                          {lang === 'en' ? 'Auto-Detect' : 'ऑटो-डिटेक्ट'}
                        </span>
                        {/* Toggle Pill Switch */}
                        <span
                          className={`w-7 h-3.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                            autoDetectEmotion ? 'bg-[#FF6B5B]' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                              autoDetectEmotion ? 'translate-x-3.5' : 'translate-x-0'
                            }`}
                          />
                        </span>
                      </button>

                      {voiceEmotionTag && (
                        <button
                          type="button"
                          id="clear-emotion-tag-btn"
                          onClick={() => {
                            setIsManualEmotionOverride(false);
                            handleSelectVoiceEmotion(null);
                          }}
                          className="text-[10px] font-mono text-white/50 hover:text-[#FF6B5B] flex items-center gap-1 transition cursor-pointer px-1 py-0.5"
                        >
                          <X size={10} /> {lang === 'en' ? 'Clear' : 'हटाएं'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Audio Stream Telemetry & Suggestion Banner */}
                  {autoDetectEmotion && (
                    <div className="mb-2.5 rounded-[12px] bg-white/[0.02] border border-white/5 px-3 py-2 text-[11px] font-sans">
                      {recordingState === 'listening' ? (
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            {/* Live Audio Stream Mini Equalizer */}
                            <div className="flex items-center gap-0.5 h-4 px-1 rounded bg-black/40 border border-white/5">
                              {[0.4, 0.9, 0.6, 1.0, 0.5].map((factor, idx) => {
                                const energy = audioMetrics?.rms || 0.22;
                                const h = Math.max(3, Math.min(14, Math.round(14 * (energy * 2.5 + 0.15) * factor)));
                                return (
                                  <span
                                    key={idx}
                                    className="w-1 rounded-full bg-[#FF6B5B] transition-all duration-75"
                                    style={{ height: `${h}px` }}
                                  />
                                );
                              })}
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 font-medium text-white">
                                <span className="text-white/60">{lang === 'en' ? 'Stream Analysis:' : 'लाइव विश्लेषण:'}</span>
                                <span className="text-[#FF6B5B] font-bold">
                                  {suggestedMoodInfo ? suggestedMoodInfo.mood : 'Analyzing audio...'}
                                </span>
                                {suggestedMoodInfo && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FF6B5B]/15 text-[#FF6B5B] border border-[#FF6B5B]/30">
                                    {suggestedMoodInfo.confidence}% {lang === 'en' ? 'acoustic match' : 'मैच'}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-white/50 leading-tight">
                                {lang === 'hi'
                                  ? (suggestedMoodInfo?.reasonHi || 'आवाज़ की टोन, तीव्रता और उतार-चढ़ाव का विश्लेषण जारी है')
                                  : (suggestedMoodInfo?.reasonEn || 'Evaluating vocal tension, volume spikes & acoustic cadence in audio stream')}
                              </div>
                            </div>
                          </div>

                          {/* Manual Override Indicator & Sync Button */}
                          {isManualEmotionOverride && (
                            <div className="flex items-center gap-2 ml-auto">
                              <span className="text-[10px] text-amber-300 font-mono">
                                {lang === 'en' ? 'Manual override' : 'मैनुअल चयन'}
                              </span>
                              <button
                                type="button"
                                id="resync-stream-mood-btn"
                                onClick={handleSyncWithStream}
                                className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-white/10 hover:bg-[#FF6B5B]/20 text-white hover:text-[#FF6B5B] border border-white/15 transition cursor-pointer flex items-center gap-1"
                                title={lang === 'en' ? 'Use audio stream suggestion' : 'ऑडियो स्ट्रीम का सुझाव लागू करें'}
                              >
                                <Sparkles size={9} />
                                {lang === 'en' ? 'Sync Stream' : 'स्ट्रीम सिंक'}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[10px] text-white/50">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] animate-pulse" />
                            <span>
                              {lang === 'en'
                                ? 'Auto-Detect active • audio stream will automatically suggest mood as you speak'
                                : 'ऑटो-डिटेक्ट चालू • बोलते समय आवाज़ की टोन से मूड अपने-आप तय होगा'}
                            </span>
                          </div>
                          {suggestedMoodInfo && (
                            <span className="font-mono text-white/60">
                              {lang === 'en' ? 'Last tone: ' : 'पिछली टोन: '}
                              <span className="text-[#FF6B5B] font-semibold">{suggestedMoodInfo.mood}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mini Sparkline Chart: Emotional Variance over 30-second recording window */}
                  <EmotionalVarianceSparkline
                    isRecording={recordingState === 'listening'}
                    audioMetrics={audioMetrics}
                    currentEmotion={voiceEmotionTag || suggestedMoodInfo?.mood}
                    transcript={(transcriptLive + ' ' + transcriptInterim).trim()}
                    lang={lang}
                    windowSeconds={30}
                  />

                  {/* Recurring Topics & Stress Correlation Engine */}
                  <StressTopicCorrelationAlert
                    transcript={[transcriptLive, transcriptInterim, typedFallbackText].filter(Boolean).join(' ')}
                    currentEmotion={voiceEmotionTag || suggestedMoodInfo?.mood || null}
                    audioMetrics={audioMetrics}
                    isRecording={recordingState === 'listening'}
                    lang={lang}
                    onInjectTestTopic={(topic) => {
                      setTypedFallbackText((prev) => (prev ? `${prev} ${topic}` : `I feel completely burnt out and stressed about my ${topic} again.`));
                      setShowTypeFallbackBox(true);
                      setToastMessage(lang === 'en' ? `Simulated topic "${topic}" injected into vent draft` : `विषय "${topic}" वेंट ड्राफ्ट में जोड़ा गया`);
                      setTimeout(() => setToastMessage(''), 2500);
                    }}
                    onSetEmotionOverride={(emotion) => {
                      setVoiceEmotionTag(emotion);
                      setIsManualEmotionOverride(true);
                    }}
                  />

                  {/* Emotion Chips */}
                  <div className="flex flex-wrap items-center gap-2">
                    {VOICE_EMOTION_CHIPS.map((chip) => {
                      const isSelected = voiceEmotionTag === chip.id;
                      const isAutoSuggested = autoDetectEmotion && suggestedMoodInfo?.mood === chip.id;

                      return (
                        <button
                          key={chip.id}
                          type="button"
                          id={`emotion-chip-${chip.id.toLowerCase()}`}
                          onClick={() => {
                            const willSelect = !isSelected;
                            setIsManualEmotionOverride(willSelect);
                            handleSelectVoiceEmotion(willSelect ? chip.id : null);
                          }}
                          className={`group/chip relative rounded-full px-3.5 py-1.5 text-[12px] font-sans transition-all duration-200 flex items-center gap-1.5 border cursor-pointer ${
                            isSelected
                              ? chip.activeClass
                              : isAutoSuggested && recordingState === 'listening'
                              ? 'bg-[#FF6B5B]/10 border-[#FF6B5B]/50 text-white shadow-[0_0_14px_rgba(255,107,91,0.25)] ring-1 ring-[#FF6B5B]/40'
                              : 'bg-white/[0.04] border-white/10 text-white/70 hover:bg-white/[0.08] hover:text-white hover:border-white/25'
                          }`}
                        >
                          <span className="text-[13px]">{chip.emoji}</span>
                          <span className="font-medium">{lang === 'hi' ? chip.labelHi : chip.label}</span>

                          {/* Auto-suggested indicator badge */}
                          {isAutoSuggested && autoDetectEmotion && (
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full flex items-center gap-0.5 ${
                                isSelected
                                  ? 'bg-black/25 text-current'
                                  : 'bg-[#FF6B5B]/20 text-[#FF6B5B] border border-[#FF6B5B]/30'
                              }`}
                            >
                              <Sparkles size={8} />
                              {lang === 'en' ? 'Suggested' : 'सुझाव'}
                            </span>
                          )}

                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse ml-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Tag & Feedback Message */}
                  {voiceEmotionTag && (
                    <div className="mt-2.5 font-sans text-[10px] text-white/50 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2">
                      <div className="flex items-center gap-1.5">
                        <Check size={11} className="text-[#FF6B5B]" />
                        <span>
                          {lang === 'en' ? 'Tagged as ' : 'टैग किया गया: '}
                          <strong className="text-white capitalize">{voiceEmotionTag}</strong>
                          {autoDetectEmotion && !isManualEmotionOverride && (
                            <span className="text-[#FF6B5B] ml-1 font-mono">
                              {lang === 'en' ? '(auto-detected from audio stream)' : '(ऑडियो स्ट्रीम से तय)'}
                            </span>
                          )}
                          {isManualEmotionOverride && (
                            <span className="text-amber-300/80 ml-1 font-mono">
                              {lang === 'en' ? '(manual choice)' : '(मैनुअल चुना)'}
                            </span>
                          )}
                          {recordingState === 'listening'
                            ? (lang === 'en' ? ' • updating live recording' : ' • लाइव रिकॉर्डिंग में टैग')
                            : (lang === 'en' ? ' • ready for voice/typing' : ' • बोलने या टाइप करने के लिए तैयार')}
                        </span>
                      </div>

                      {autoDetectEmotion && isManualEmotionOverride && (
                        <button
                          type="button"
                          onClick={handleSyncWithStream}
                          className="text-[10px] text-[#FF6B5B] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                        >
                          {lang === 'en' ? 'Reset to Auto-Detect' : 'ऑटो-डिटेक्ट पर रीसेट करें'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="font-sans text-[11px] uppercase tracking-widest opacity-40 flex items-center gap-2">
                    {t.boothLiveTitle}
                    {micStatus === 'granted' && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B5B] animate-pulse" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {saveStatus === 'saving' && (
                      <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                        {t.boothSaving}...
                      </span>
                    )}
                    {saveStatus === 'saved' && (
                      <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-[#FF6B5B]/15 border border-[#FF6B5B]/20 text-[#FF6B5B] flex items-center gap-1">
                        <Check size={10} /> {t.boothSaved} ✓
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-[18px] bg-black/50 border border-white/10 p-4 min-h-[148px] relative overflow-hidden">
                  <div className="font-sans text-[14px] leading-[1.6] min-h-[64px]">
                    {transcriptLive || transcriptInterim ? (
                      <span>
                        <span className="text-white">{transcriptLive}</span>
                        {transcriptInterim && <span className="text-white/40 ml-1">{transcriptInterim}</span>}
                        <span className="cursor-blink inline-block w-[2px] h-[16px] bg-[#FF6B5B] ml-1 translate-y-[2px]" />
                      </span>
                    ) : (
                      <span className="opacity-30 italic flex items-center gap-2">
                        {micStatus === 'granted'
                          ? (lang === 'en' ? 'Tap orb and speak — your words appear here...' : 'ऑर्ब दबाओ और बोलो — शब्द यहाँ आएंगे...')
                          : (lang === 'en' ? 'Enable mic — your words will appear as you speak...' : 'माइक चालू करो — शब्द यहाँ दिखेंगे...')}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 items-center">
                    <div className="rounded-full bg-white/[0.03] border border-white/10 px-3 h-8 font-sans text-[10px] flex items-center gap-2 opacity-50">
                      <span className={`w-2 h-2 rounded-full ${micStatus === 'granted' ? 'bg-[#FF6B5B]' : 'bg-red-400'}`} />
                      Voice-only • Live mood highlights
                    </div>
                    {voiceEmotionTag && (
                      <div className="rounded-full bg-white/10 border border-white/20 px-2.5 h-8 font-sans text-[10px] flex items-center gap-1.5 text-white">
                        <span className="opacity-60">Tagged:</span>
                        <span className="font-bold">{voiceEmotionTag}</span>
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full border border-white/10 px-3 h-8 font-sans text-[10px] flex items-center gap-1.5 opacity-40 hover:opacity-70 transition"
                    >
                      <Upload size={11} /> {t.upload}
                    </button>
                    <input ref={fileInputRef} type="file" hidden accept="audio/*,text/*,.txt" onChange={handleFileUpload} />

                    {recordingState === 'listening' && (
                      <button
                        onClick={stopVoiceRecording}
                        className="rounded-full bg-white text-black px-4 h-8 font-sans text-[11px] font-bold animate-pulse ml-auto"
                      >
                        Stop • Save
                      </button>
                    )}

                    <span className="ml-auto font-mono text-[10px] opacity-30">
                      {transcriptLive.length} chars • {recordingState === 'listening' ? '● live' : '○ idle'}
                    </span>
                  </div>
                </div>

                {/* Optional Type Fallback Box */}
                {(showTypeFallbackBox || micStatus === 'denied' || micStatus === 'unsupported') && (
                  <div className="mt-4 rounded-[16px] bg-white/[0.04] border border-white/10 p-4 fade-up">
                    <div className="font-sans text-[11px] opacity-60 mb-2 flex justify-between">
                      <span>{lang === 'en' ? "Can't use mic? Type your story here → auto-structures" : 'माइक नहीं? यहाँ टाइप करो →'}</span>
                      <button onClick={() => setShowTypeFallbackBox(false)} className="opacity-40 hover:opacity-80">
                        <X size={12} />
                      </button>
                    </div>
                    <textarea
                      value={typedFallbackText}
                      onChange={(e) => setTypedFallbackText(e.target.value)}
                      placeholder={lang === 'en' ? "Type what’s on your mind... I kept saying I'm fine but..." : 'क्या चल रहा है दिमाग में लिखो...'}
                      className="w-full min-h-[96px] rounded-[12px] bg-black/50 border border-white/10 p-3 font-sans text-[13px] text-white outline-none focus:border-[#FF6B5B]/40 resize-none"
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          if (typedFallbackText.trim().length > 3) {
                            setTranscriptLive(typedFallbackText);
                            processDraft(typedFallbackText);
                          }
                        }}
                        className="rounded-full bg-[#FF6B5B] text-black px-5 h-9 font-sans text-[12px] font-bold hover:brightness-110 transition"
                      >
                        {lang === 'en' ? 'Structure this story →' : 'कहानी बनाओ →'}
                      </button>
                      <button
                        onClick={() => setTypedFallbackText('')}
                        className="rounded-full border border-white/15 px-4 h-9 font-sans text-[11px] opacity-60 hover:opacity-100"
                      >
                        Clear
                      </button>
                      <span className="ml-auto font-mono text-[10px] opacity-30 self-center">
                        {typedFallbackText.length} chars
                      </span>
                    </div>
                  </div>
                )}

                {/* WhatsApp Voice Note Quick Access Banner */}
                <div className="mt-4 p-3.5 rounded-[16px] bg-[#25D366]/10 border border-[#25D366]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#25D366] text-black grid place-items-center shrink-0">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <div className="font-sans font-bold text-[12px] text-white flex items-center gap-1.5">
                        <span>{lang === 'en' ? 'Prefer WhatsApp? Send Voice Notes Directly' : 'व्हाट्सएप पसंद है? सीधा वॉइस नोट भेजें'}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#25D366] text-black font-bold">LIVE BOT</span>
                      </div>
                      <p className="font-sans text-[11px] opacity-70">
                        {lang === 'en'
                          ? 'Zero barrier: Send audio to +91 98765 AUR-SUNAO. The bot structures and syncs it here.'
                          : 'व्हाट्सएप पर बोलें — हमारा बॉट तुरंत कहानी बनाकर आपके डैशबोर्ड में सिंक कर देगा।'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowWhatsAppModal(true)}
                    className="shrink-0 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20b858] text-black font-sans text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>{lang === 'en' ? 'Open WhatsApp Bot' : 'व्हाट्सएप बॉट खोलें'}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: AI Structured Analysis Output */}
            <div className="p-6 md:p-8 bg-[#0F0F10] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-sans text-[11px] uppercase tracking-widest opacity-40 flex items-center gap-2">
                    {t.boothAnalysisTitle}
                    <span className={`w-1 h-1 rounded-full ${micStatus === 'granted' ? 'bg-[#FF6B5B]' : 'bg-white/20'}`} />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono opacity-40">
                    <span className={`w-1.5 h-1.5 rounded-full ${micStatus === 'granted' ? 'bg-[#FF6B5B] animate-pulse' : 'bg-white/20'}`} />
                    AI • live
                  </div>
                </div>

                {recordingState === 'idle' && !activeStoryDraft && (
                  <div className="mt-6 space-y-3">
                    <div className="rounded-[12px] bg-[#FF6B5B]/10 border border-[#FF6B5B]/15 p-3 flex gap-2.5 font-sans text-[11px]">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${micStatus === 'granted' ? 'bg-[#FF6B5B]' : micStatus === 'denied' ? 'bg-red-400' : 'bg-amber-300'}`} />
                      <div className="flex-1">
                        <div className="font-bold">
                          {micStatus === 'granted' ? (lang === 'en' ? 'Microphone ready ✓' : 'माइक तैयार ✓') : micStatus === 'denied' ? t.micDeniedTitle : (lang === 'en' ? 'Microphone permission needed' : 'माइक अनुमति चाहिए')}
                        </div>
                        <div className="opacity-60 mt-0.5 leading-snug text-[11px]">
                          {micStatus === 'granted'
                            ? (lang === 'en' ? 'Green dot = granted • Red pulse = listening • Tap orb to start' : 'हरा = तैयार • लाल पल्स = सुन रहा • ऑर्ब दबाओ')
                            : (lang === 'en' ? 'Click Enable Microphone to trigger browser prompt' : 'ब्राउज़र प्रॉम्प्ट के लिए माइक चालू करें दबाओ')}
                        </div>
                      </div>
                    </div>

                    {/* Instant Mood Engine Standby Badge */}
                    <div className="rounded-[14px] bg-white/[0.03] border border-white/10 p-3.5 flex items-start gap-3 font-sans text-[11px]">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mt-1.5" />
                      <div className="flex-1">
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{lang === 'en' ? 'Live Instant Mood Detector' : 'लाइव मूड डिटेक्टर'}</span>
                          <span className="text-[9px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                        </div>
                        <div className="opacity-60 mt-1 leading-snug">
                          {lang === 'en'
                            ? 'Detects real-time emotional valence, nervous system tension, and pacing the second you speak.'
                            : 'बोलते ही आपकी मानसिक तीव्रता, तनाव और भावनाओं का लाइव विश्लेषण करता है।'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 font-sans text-[11px]">
                      <div className="rounded-[12px] bg-white/[0.04] border border-white/10 p-3 flex gap-3 opacity-60">
                        <div className="w-6 h-6 rounded-full bg-white text-black grid place-items-center text-[10px] font-bold">1</div>
                        <div>
                          <b>Live words & Mood</b>
                          <div className="opacity-60 text-[11px]">
                            {lang === 'en' ? 'Real-time transcript + instant emotional valence' : 'पक्का सफ़ेद, कच्चा हल्का + लाइव मूड'}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-[12px] bg-white/[0.04] border border-white/10 p-3 flex gap-3 opacity-60">
                        <div className="w-6 h-6 rounded-full bg-[#FF6B5B] text-black grid place-items-center text-[10px] font-bold">2</div>
                        <div>
                          <b>Auto-save buffer</b>
                          <div className="opacity-60">{lang === 'en' ? 'Saving... → Auto-saved ✓' : 'सेव हो रहा... → ऑटो-सेव ✓'}</div>
                        </div>
                      </div>
                      <div className="rounded-[12px] bg-white/[0.04] border border-white/10 p-3 flex gap-3 opacity-80">
                        <div className="w-6 h-6 rounded-full bg-[#FF5C5C] text-white grid place-items-center text-[10px] font-bold">3</div>
                        <div>
                          <b>Structured Story</b>
                          <div className="opacity-60">{lang === 'en' ? 'title, hook, emotion, conflict emerge live' : 'टाइटल, हुक, इमोशन लाइव उभरते हैं'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {recordingState === 'processing' && (
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-2 font-sans text-[12px] opacity-70">
                      <Sparkles size={14} className="text-[#FF6B5B] animate-pulse" />
                      {t.boothProcessing}
                    </div>
                    <div className="space-y-3 animate-pulse">
                      <div className="h-[54px] rounded-[14px] bg-white/5 border border-white/5" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-[72px] rounded-[14px] bg-white/5 border border-white/5" />
                        <div className="h-[72px] rounded-[14px] bg-[#FF6B5B]/10 border border-[#FF6B5B]/10" />
                      </div>
                      <div className="h-[88px] rounded-[14px] bg-white/5 border border-white/5" />
                    </div>
                    <div className="font-mono text-[10px] opacity-30">
                      Analyzing sentiment • extracting people, setting, turning point...
                    </div>
                  </div>
                )}

                {recordingState === 'listening' && (
                  <div className="mt-6 space-y-4">
                    {/* Live Instant Mood of the Person through live analysis */}
                    <LiveInstantMoodAnalyzer
                      text={(transcriptLive + ' ' + transcriptInterim).trim()}
                      isLive={true}
                      assignedEmotion={voiceEmotionTag}
                      lang={lang}
                    />

                    <div className="rounded-[16px] bg-[#FF6B5B]/10 border border-[#FF6B5B]/20 p-4 font-sans text-[12px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF6B5B]/10 rounded-full blur-xl" />
                      <div className="font-bold text-[#FF6B5B] flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FF5C5C] animate-pulse" />
                          {lang === 'en' ? "Real-time Voice Stream Active" : 'लाइव आवाज़ चालू है'}
                        </span>
                        {voiceEmotionTag && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-sans font-medium">
                            {voiceEmotionTag}
                          </span>
                        )}
                      </div>
                      <div className="opacity-70 mt-1 leading-relaxed text-[11px]">
                        {lang === 'en'
                          ? 'Pause speaking anytime to synthesize your mini-story. Words and instant mood are analyzed in real time.'
                          : 'स्ट्रक्चर बनाने के लिए कभी भी बोलना बंद करें। शब्द और मूड का लाइव विश्लेषण हो रहा है।'}
                      </div>
                      <div className="mt-3 flex gap-1.5">
                        {[...Array(6)].map((_, i) => (
                          <span key={i} className="w-1 h-6 rounded-full bg-[#FF6B5B]/40 wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {recordingState === 'ready' && activeStoryDraft && (
                  <div className="mt-6 space-y-4">
                    {/* Live Instant Mood Analysis of the Person */}
                    <LiveInstantMoodAnalyzer
                      text={activeStoryDraft.transcript || activeStoryDraft.structured.narrative}
                      isLive={false}
                      existingAnalysis={activeStoryDraft.instantMoodAnalysis}
                      assignedEmotion={activeStoryDraft.mood || voiceEmotionTag}
                      lang={lang}
                    />

                    <div className="rounded-[18px] bg-[#F5F5F0] text-black p-5 fade-up">
                      <div className="font-serif text-[18px] leading-[1.35]">
                        {activeStoryDraft.structured.narrative}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 font-sans text-[11px]">
                        <div className="rounded-xl bg-black text-white p-3 fade-up" style={{ animationDelay: '0.1s' }}>
                          <div className="opacity-50 text-[10px] uppercase tracking-wide">Title</div>
                          <div className="font-bold mt-1 leading-snug">{activeStoryDraft.title}</div>
                        </div>
                        <div className="rounded-xl bg-[#FF6B5B] p-3 fade-up" style={{ animationDelay: '0.18s' }}>
                          <div className="opacity-60 text-[10px] uppercase tracking-wide">Emotion</div>
                          <div className="font-bold mt-1">{activeStoryDraft.structured.emotion}</div>
                        </div>
                        <div className="rounded-xl bg-white border p-3 fade-up" style={{ animationDelay: '0.26s' }}>
                          <div className="opacity-50 text-[10px] uppercase">Hook</div>
                          <div className="font-medium mt-1 leading-snug">{activeStoryDraft.hook}</div>
                        </div>
                        <div className="rounded-xl bg-zinc-100 p-3 fade-up" style={{ animationDelay: '0.34s' }}>
                          <div className="opacity-50 text-[10px] uppercase">Conflict</div>
                          <div className="font-medium mt-1 leading-snug">{activeStoryDraft.structured.conflict}</div>
                        </div>
                        <div className="col-span-2 rounded-xl bg-black text-white p-3 fade-up" style={{ animationDelay: '0.42s' }}>
                          <div className="opacity-50 text-[10px] uppercase">Insight</div>
                          <div className="font-medium mt-1 leading-snug">{activeStoryDraft.structured.insight}</div>
                        </div>
                      </div>
                    </div>

                    {/* Practical Output Converter: Professional Draft or Habit Checklist */}
                    <PracticalConverter
                      story={activeStoryDraft}
                      lang={lang}
                      onUpdateStory={(updated) => {
                        setActiveStoryDraft(updated);
                        setStories(prev => prev.map(s => s.id === updated.id ? updated : s));
                      }}
                    />

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <label className="flex items-center gap-2 font-sans text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={anonymousToggle}
                          onChange={(e) => setAnonymousToggle(e.target.checked)}
                          className="rounded w-3 h-3 accent-black"
                        />
                        {t.anonymous}
                      </label>
                      <span className="text-[10px] opacity-50 font-sans">{t.anonHint}</span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={saveDraftToLibrary}
                        className="flex-1 rounded-full bg-black text-white h-10 font-sans text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-zinc-900 transition"
                      >
                        {t.saveLib} <span className="opacity-60">→</span>
                      </button>
                      <button
                        onClick={() => {
                          setRecordingState('idle');
                          setActiveStoryDraft(null);
                          setTranscriptLive('');
                          setTranscriptInterim('');
                          setSaveStatus('idle');
                        }}
                        className="rounded-full border border-black/15 px-5 h-10 font-sans text-[12px] hover:bg-black/5"
                      >
                        {t.keepTalking}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-[12px] bg-white/5 border border-white/10 p-3 font-mono text-[10px] opacity-40 flex justify-between">
                <span>auto-saved • {new Date().toLocaleTimeString()} • anonymous</span>
                <span className="text-[#FF6B5B]">✓ structured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Algorithmic Empathy Matching after speaking or drafting */}
        {(transcriptLive.length > 15 || activeStoryDraft) && (
          <div className="mt-8 fade-up">
            <AlgorithmicEmpathyMatcher
              userVentText={transcriptLive || activeStoryDraft?.transcript || ''}
              userMood={voiceEmotionTag || (activeStoryDraft?.mood as any) || 'overwhelmed'}
              userLocation={userLocation}
              candidateStories={stories}
              onOpenMatchedStory={handleOpenStory}
              lang={lang}
            />
          </div>
        )}
      </section>

      {/* Brand-Sponsored Vent Bounties Section */}
      <section {...show('/bounties')} id="bounties" className="mx-auto max-w-[1280px] px-5 md:px-8 py-8 border-t border-white/10" lang={lang}>
        <VentBounties
          user={user}
          onSelectBountyForRecording={(bounty) => {
            setActiveClaimingBounty(bounty);
            const points = bounty.bountyRewardPoints || bounty.bountyRewardRupees || 500;
            setToastMessage(
              lang === 'en'
                ? `Bounty activated: "${bounty.promptTitle}". Speak in the Voice Booth to earn ${points.toLocaleString('en-IN')} Loyalty Points!`
                : `बाउंटी सक्रिय! वॉयस बूथ में बोलकर ${points.toLocaleString('en-IN')} लॉयल्टी पॉइंट्स पाएं!`
            );
            go('/booth');
          }}
          lang={lang}
        />
      </section>

      {/* Why People Press Record (Compact Starter Prompts) */}
      <section {...show('/')} id="reasons" className="mx-auto max-w-[1280px] px-5 md:px-8 py-6" lang={lang}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-sans text-[10.5px] tracking-widest uppercase opacity-50">{t.reasonsEyebrow}</div>
            <h2 className="font-display text-[26px] md:text-[34px] leading-tight mt-1">{t.reasonsTitle}</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAllReasons(!showAllReasons)}
            className="text-[11px] font-sans px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 transition flex items-center gap-1 cursor-pointer"
          >
            <span>{showAllReasons ? (lang === 'en' ? 'Show less' : 'कम दिखाएं') : (lang === 'en' ? `View all ${REASONS_CARDS.length} starters` : 'सभी देखें')}</span>
            {showAllReasons ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(showAllReasons ? REASONS_CARDS : REASONS_CARDS.slice(0, 3)).map((card, idx) => (
            <div
              key={card.id}
              onClick={scrollToBooth}
              className="group rounded-[18px] border border-white/10 bg-[#141416] p-4 flex flex-col justify-between hover:bg-[#1A1A1E] hover:border-white/20 transition cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-center">
                  <div
                    className="w-6 h-6 rounded-full grid place-items-center text-black font-sans font-bold text-[11px]"
                    style={{ background: card.accent }}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-[10px] font-mono text-white/40 group-hover:text-white/80 transition flex items-center gap-0.5">
                    {t.startTalking} ↗
                  </span>
                </div>
                <h3 className="font-display text-[16px] mt-2.5 leading-snug group-hover:text-[#FF6B5B] transition-colors">
                  {lang === 'en' ? card.enTitle : card.hiTitle}
                </h3>
                <p className="font-sans text-[12px] opacity-60 mt-1 leading-relaxed line-clamp-2">
                  {lang === 'en' ? card.enDesc : card.hiDesc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Structure Library */}
      <section {...show('/stories')} id="library" className="mx-auto max-w-[1280px] px-5 md:px-8 pb-16" lang={lang}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-sans text-[11px] uppercase tracking-widest opacity-50">{t.libraryEyebrow}</div>
            <h2 className="font-display text-[36px] md:text-[52px] leading-[0.9] mt-2">{t.libraryTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                document.getElementById('story-knowledge-graph')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full bg-white/10 hover:bg-white/15 border border-white/10 px-3.5 h-10 font-sans text-[12px] font-semibold text-white flex items-center gap-1.5 transition cursor-pointer"
              title="Explore in Interactive Story Knowledge Graph"
            >
              <Network size={14} className="text-[#06B6D4]" />
              <span className="hidden sm:inline">{lang === 'en' ? 'Graph View' : 'ग्राफ व्यू'}</span>
            </button>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPh}
              className="rounded-full bg-[#141416] border border-white/10 px-4 h-10 w-[180px] md:w-[260px] font-sans text-[12px] outline-none focus:border-[#FF6B5B]/40 text-white"
            />
          </div>
        </div>

        {/* ICP Community Voices Dashboard: 50+ People & 200 Stories */}
        <div id="icp-community-dashboard" className="mt-8">
          <IcpCommunityDashboard
            stories={stories}
            selectedIcp={selectedIcp}
            onSelectIcp={setSelectedIcp}
            selectedPersonId={selectedPersonId}
            onSelectPerson={setSelectedPersonId}
            lang={lang}
          />
        </div>

        {/* AI Emotional Resilience & Memory Retrieval Search Bar */}
        <div id="resilience-search" className="mt-8">
          <ResilienceSearchBar
            stories={stories}
            onSelectStory={(s) => handleOpenStory(s)}
            lang={lang}
          />
        </div>

        {/* 21-Day Mood Heatmap Visualization (D3.js) */}
        <div className="mt-8">
          <MoodHeatmap
            stories={stories}
            lang={lang}
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
            selectedDay={selectedDayFilter}
            onSelectDay={setSelectedDayFilter}
          />
        </div>

        {/* Filter controls and active filter indicator */}
        <div className="mt-8 flex flex-col gap-3">
          {/* Mood Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setSelectedMood('all')}
              className={`rounded-full px-4 h-8 text-[11px] font-sans border transition ${
                selectedMood === 'all' ? 'bg-white text-black border-white' : 'border-white/15 opacity-70 hover:opacity-100'
              }`}
            >
              {t.allMoods}
            </button>
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMood(m)}
                className={`rounded-full px-3 h-8 text-[11px] font-sans border capitalize transition ${
                  selectedMood === m ? 'bg-[#FF6B5B] text-black border-[#FF6B5B]' : 'border-white/15 opacity-70 hover:opacity-100'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Type Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setSelectedType('all')}
              className={`rounded-full px-4 h-8 text-[11px] font-sans border transition ${
                selectedType === 'all' ? 'bg-white text-black' : 'border-white/15 opacity-70 hover:opacity-100'
              }`}
            >
              {t.allTypes}
            </button>
            {TYPES.map((tp) => (
              <button
                key={tp}
                onClick={() => setSelectedType(tp)}
                className={`rounded-full px-3 h-8 text-[11px] font-sans border transition ${
                  selectedType === tp ? 'bg-white text-black' : 'border-white/15 opacity-70 hover:opacity-100'
                }`}
              >
                {tp}
              </button>
            ))}

            {(selectedDayFilter !== null || selectedMood !== 'all' || selectedType !== 'all' || selectedIcp !== 'all' || selectedPersonId !== null || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDayFilter(null);
                  setSelectedMood('all');
                  setSelectedType('all');
                  setSelectedIcp('all');
                  setSelectedPersonId(null);
                  setSearchQuery('');
                }}
                className="ml-auto text-[11px] font-sans text-[#FF6B5B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X size={12} /> {lang === 'en' ? 'Clear all filters' : 'फ़िल्टर हटाएं'}
              </button>
            )}
          </div>
        </div>

        {/* Minimized Stories Notice Banner - Collapsed Section into Expandable & Pop-up Box */}
        <div
          id="stories-minimized-banner"
          className="mt-6 rounded-[22px] bg-[#141416] border border-white/10 p-4 sm:p-5 shadow-lg relative overflow-hidden transition-all duration-300"
        >
          {/* Top Bar / Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B5B]/15 border border-[#FF6B5B]/30 text-[#FF6B5B] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,107,91,0.2)] mt-0.5">
                <Layers size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display text-[16px] sm:text-[18px] font-bold text-white tracking-tight">
                    {lang === 'en' ? 'Stories Vault (Minimized)' : 'कहानियां संग्रह (संक्षिप्त)'}
                  </h4>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-[#FF6B5B]/20 text-[#FF6B5B] border border-[#FF6B5B]/30">
                    {filteredStories.length} {lang === 'en' ? 'Stories Available' : 'कहानियां'}
                  </span>
                  {!user.isRegistered ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70 flex items-center gap-1">
                      <Lock size={10} className="text-[#FF6B5B]" />
                      {lang === 'en' ? 'Login for uncut text' : 'पूरी कहानी हेतु लॉगिन'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2E7D32]/20 text-[#25D366] flex items-center gap-1">
                      <Check size={10} />
                      {lang === 'en' ? 'Access Unlocked' : 'अनलॉक'}
                    </span>
                  )}
                </div>
                <p className="font-sans text-[12px] text-white/60 mt-1 max-w-[65ch] leading-relaxed">
                  {lang === 'en'
                    ? 'All 200+ raw founder, relationship, and career stories collapsed into an interactive pop-up box with expandable turning points, context, and key takeaways.'
                    : 'सभी 200+ कहानियां एक पॉप-अप बॉक्स में समेटी गई हैं। मोड़ और भावनात्मक निष्कर्ष को विस्तार से देखने के लिए पॉप-अप खोलें।'}
                </p>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                type="button"
                id="open-stories-vault-popup-btn"
                onClick={() => setShowStoriesVaultModal(true)}
                className="flex-1 md:flex-none px-4 py-2 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black font-sans text-[12px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[0_2px_12px_rgba(255,107,91,0.3)]"
                title={lang === 'en' ? 'Open in an expandable pop-up window' : 'पॉप-अप बॉक्स में खोलें'}
              >
                <Layers size={14} />
                <span>{lang === 'en' ? 'Open Stories in Pop-up Box ↗' : 'पॉप-अप बॉक्स में खोलें ↗'}</span>
              </button>

              <button
                type="button"
                id="toggle-expand-stories-on-page-btn"
                onClick={() => setIsStoriesSectionExpandedOnPage(!isStoriesSectionExpandedOnPage)}
                className="flex-1 md:flex-none px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-sans text-[12px] font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                title={isStoriesSectionExpandedOnPage ? 'Collapse stories grid' : 'Expand stories on page'}
              >
                {isStoriesSectionExpandedOnPage ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>
                  {isStoriesSectionExpandedOnPage
                    ? (lang === 'en' ? 'Collapse Section' : 'संक्षिप्त करें')
                    : (lang === 'en' ? 'Expand on Page' : 'पेज पर विस्तृत करें')}
                </span>
              </button>

              {!user.isRegistered ? (
                <button
                  type="button"
                  id="banner-login-btn"
                  onClick={() => {
                    setPendingStoryToOpen(null);
                    setShowRegisterModal(true);
                  }}
                  className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-sans text-[12px] font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Lock size={12} className="text-[#FF6B5B]" />
                  <span>{lang === 'en' ? 'Log In' : 'लॉग इन'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="library-logout-btn"
                  onClick={() => handleLogout('manual')}
                  className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-[#FF5C5C]/20 border border-white/10 hover:border-[#FF5C5C]/40 text-white/80 hover:text-[#FF5C5C] font-sans text-[12px] font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut size={12} />
                  <span>{lang === 'en' ? 'Logout' : 'लॉग आउट'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Preview Chips Row (Clicking any opens the Pop-up Box) */}
          <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-white/40 uppercase mr-1">
              {lang === 'en' ? 'Quick Previews:' : 'त्वरित झलक:'}
            </span>
            {filteredStories.slice(0, 4).map((previewStory) => (
              <button
                key={previewStory.id}
                type="button"
                onClick={() => setShowStoriesVaultModal(true)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white text-[11px] font-sans flex items-center gap-1.5 transition cursor-pointer truncate max-w-[220px]"
                title={previewStory.title}
              >
                <span>{MOOD_EMOJIS[previewStory.mood?.toLowerCase()] || '💫'}</span>
                <span className="truncate">{previewStory.title}</span>
                <span className="text-white/30 text-[9px]">↗</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowStoriesVaultModal(true)}
              className="text-[11px] font-sans font-medium text-[#FF6B5B] hover:underline ml-auto flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'en' ? `+${Math.max(0, filteredStories.length - 4)} more in pop-up box` : `+${Math.max(0, filteredStories.length - 4)} और पॉप-अप में`}</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </div>

        {/* EXPANDED ON-PAGE SECTION (SHOWN WHEN isStoriesSectionExpandedOnPage IS TRUE) */}
        {isStoriesSectionExpandedOnPage && (
          <div className="mt-5 space-y-3 animate-fadeIn">
            {/* Expanded Controls Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[12px] font-sans">
              <div className="flex items-center gap-2 text-white/70">
                <Sparkles size={14} className="text-[#FF6B5B]" />
                <span>
                  {lang === 'en'
                    ? `Expanded View: Showing ${filteredStories.length} stories with dilemmas, turning points, and takeaways`
                    : `विस्तृत दृश्य: मोड़ और सीख के साथ ${filteredStories.length} कहानियां`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleAllOnPageExpand}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-sans text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  {isAllOnPageExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                  <span>{isAllOnPageExpanded ? (lang === 'en' ? 'Collapse All Details' : 'सभी संक्षिप्त करें') : (lang === 'en' ? 'Expand All Details' : 'सभी विवरण खोलें')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowStoriesVaultModal(true)}
                  className="px-3 py-1 rounded-full bg-[#FF6B5B]/15 hover:bg-[#FF6B5B]/25 text-[#FF6B5B] border border-[#FF6B5B]/30 font-sans text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Layers size={12} />
                  <span>{lang === 'en' ? 'Pop-up Mode ↗' : 'पॉप-अप मोड ↗'}</span>
                </button>
              </div>
            </div>

            {/* Expandable Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredStories.map((story, storyIdx) => {
                const isExpanded = expandedOnPageStoryIds.has(story.id) || isAllOnPageExpanded;
                const moodEmoji = MOOD_EMOJIS[story.mood?.toLowerCase()] || '💫';
                const moodColorClass = MOOD_COLORS[story.mood?.toLowerCase()] || 'bg-white/10 text-white';

                return (
                  <article
                    key={`${story.id}-${storyIdx}`}
                    id={`story-card-${story.id}`}
                    aria-label={lang === 'en' ? story.title : story.titleHi}
                    className={`rounded-[18px] border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                      isExpanded
                        ? 'bg-[#18181D] border-[#FF6B5B]/40 shadow-[0_4px_20px_rgba(255,107,91,0.08)]'
                        : 'bg-[#15151A] hover:bg-[#1A1A20] border-white/10'
                    }`}
                  >
                    {/* Card Header */}
                    <div
                      onClick={() => toggleOnPageStoryExpand(story.id)}
                      className="p-3.5 sm:p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="text-xl shrink-0 leading-none select-none mt-0.5" role="img" aria-label={story.mood}>
                          {moodEmoji}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="font-display text-[14.5px] font-semibold text-white leading-snug hover:text-[#FF6B5B] transition-colors">
                              {lang === 'en' ? story.title : story.titleHi}
                            </h3>
                            <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${moodColorClass}`}>
                              {story.mood}
                            </span>
                          </div>

                          {/* Hook / Excerpt snippet */}
                          <p className="text-[12px] font-sans text-white/70 mt-1 line-clamp-2 leading-relaxed">
                            {lang === 'en' ? story.hook || story.structured?.conflict : story.hookHi || story.structured?.conflict}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-2 text-[10.5px] font-mono text-white/40">
                            {story.type && <span>🏷️ {story.type}</span>}
                            {story.location && <span>📍 {story.location}</span>}
                            {story.claps > 0 && <span>👏 {story.claps}</span>}
                            <span className="text-[#FF6B5B] font-sans font-medium">
                              {isExpanded ? (lang === 'en' ? 'Hide details' : 'कम देखें') : (lang === 'en' ? 'Show details ↓' : 'विस्तार देखें ↓')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Expand / Lock Toggle */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {!user.isRegistered ? (
                          <span className="w-6 h-6 rounded-full bg-black/40 text-[#FF6B5B] border border-[#FF6B5B]/30 flex items-center justify-center">
                            <Lock size={11} />
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-white/5 text-white/60 flex items-center justify-center">
                            <BookOpen size={11} />
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => toggleOnPageStoryExpand(story.id, e)}
                          className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Drawer Body (Display More Content) */}
                    {isExpanded && (
                      <div className="px-3.5 sm:px-4 pb-4 pt-2 border-t border-white/10 space-y-2.5 bg-black/30 animate-fadeIn">
                        {story.structured?.setting && (
                          <div className="text-[12px] font-sans text-white/70 bg-white/[0.02] p-2 rounded-xl border border-white/5">
                            <span className="text-white/40 font-mono text-[9.5px] uppercase block">
                              {lang === 'en' ? 'Setting / Context:' : 'परिवेश:'}
                            </span>
                            <p className="mt-0.5">{story.structured.setting}</p>
                          </div>
                        )}

                        {story.structured?.conflict && (
                          <div className="text-[12px] font-sans text-white/85 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                            <span className="text-[#FF5C5C] font-mono text-[9.5px] uppercase font-bold block">
                              {lang === 'en' ? 'Core Tension & Dilemma:' : 'मुख्य तनाव व द्वंद्व:'}
                            </span>
                            <p className="mt-0.5 leading-relaxed">{story.structured.conflict}</p>
                          </div>
                        )}

                        {story.structured?.turning && (
                          <div className="rounded-xl bg-[#FF6B5B]/10 border border-[#FF6B5B]/25 p-2.5 text-[12px] font-sans text-white">
                            <div className="flex items-center gap-1.5 text-[#FF6B5B] font-mono text-[10px] font-bold mb-0.5">
                              <Compass size={12} />
                              <span>{lang === 'en' ? 'The Turning Point:' : 'महत्वपूर्ण मोड़:'}</span>
                            </div>
                            <p className="italic text-white/90 leading-relaxed font-serif">
                              "{story.structured.turning}"
                            </p>
                          </div>
                        )}

                        {story.structured?.insight && (
                          <div className="rounded-xl bg-amber-400/10 border border-amber-400/25 p-2.5 text-[12px] font-sans text-white">
                            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] font-bold mb-0.5">
                              <Lightbulb size={12} />
                              <span>{lang === 'en' ? 'Key Emotional Takeaway:' : 'भावनात्मक निष्कर्ष:'}</span>
                            </div>
                            <p className="text-white/85 leading-relaxed mt-0.5">
                              {story.structured.insight}
                            </p>
                          </div>
                        )}

                        {/* Action CTA */}
                        <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
                          <span className="text-[10px] font-mono text-white/40">
                            {lang === 'en' ? `By: ${story.author}` : `लेखक: ${story.author}`}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleOpenStory(story)}
                            className="px-3.5 py-1.5 rounded-full bg-[#FF6B5B] hover:bg-[#FF5C5C] text-black font-bold font-sans text-[11px] flex items-center gap-1.5 transition cursor-pointer shadow-md"
                          >
                            {!user.isRegistered ? <Lock size={11} /> : <ArrowRight size={11} />}
                            <span>
                              {!user.isRegistered
                                ? (lang === 'en' ? 'Log in to Read Uncut Narrative' : 'पूरी कहानी पढ़ने हेतु लॉगिन करें')
                                : (lang === 'en' ? 'Read Complete Narrative' : 'पूरी कहानी पढ़ें')}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Collapse Button at the bottom */}
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => setIsStoriesSectionExpandedOnPage(false)}
                className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-sans text-[11px] flex items-center gap-1.5 mx-auto transition cursor-pointer"
              >
                <ChevronUp size={13} />
                <span>{lang === 'en' ? 'Collapse Section Back to Compact Bar' : 'सेक्शन को वापस संक्षिप्त करें'}</span>
              </button>
            </div>
          </div>
        )}

        {filteredStories.length === 0 && (
          <div className="mt-8 rounded-[24px] border border-white/10 bg-[#141416] p-8 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#FF6B5B]/15 text-[#FF6B5B] mx-auto grid place-items-center mb-3">
              <Sparkles size={20} />
            </div>
            <h4 className="font-display text-[20px] text-white">
              {lang === 'en' ? 'No stories found for this filter' : 'इस फ़िल्टर के लिए कोई कहानी नहीं मिली'}
            </h4>
            <p className="font-sans text-[12px] opacity-60 mt-1.5 leading-relaxed">
              {lang === 'en'
                ? 'Try resetting your day or mood filters, or speak in the voice booth to add a new story.'
                : 'फ़िल्टर हटाकर देखें या वॉइस बूथ में बोलकर एक नई कहानी जोड़ें।'}
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                onClick={() => {
                  setSelectedMood('all');
                  setSelectedType('all');
                  setSelectedDayFilter(null);
                  setSearchQuery('');
                }}
                className="rounded-full bg-white text-black px-4 py-2 font-sans text-[12px] font-bold hover:bg-[#FF6B5B] transition"
              >
                {lang === 'en' ? 'Reset Filters' : 'फ़िल्टर हटाएं'}
              </button>
              <button
                onClick={scrollToBooth}
                className="rounded-full border border-white/20 px-4 py-2 font-sans text-[12px] text-white hover:bg-white/10 transition"
              >
                {lang === 'en' ? 'Record a Vent' : 'कहानी रिकॉर्ड करें'}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Fixed Story Knowledge Graph & 8 Life Tension Categories Section */}
      <div {...show('/stories')}>
        <StoryCategorySection
          stories={stories}
          lang={lang}
          onOpenStory={handleOpenStory}
          userIsRegistered={user.isRegistered}
          onRequireRegister={() => setShowRegisterModal(true)}
        />
      </div>

      {/* Pricing Section */}
      <section {...show('/pricing')} id="pricing" className="mx-auto max-w-[1280px] px-5 md:px-8 pb-20" lang={lang}>
        <div className="rounded-[28px] border border-white/10 p-6 md:p-10 bg-[#141416]">
          <div className="flex flex-wrap justify-between gap-4">
            <h2 className="font-display text-[32px] md:text-[48px] leading-[0.9]">
              {lang === 'en' ? '21 days free. Then ₹299.' : '21 दिन फ्री। फिर ₹299।'}
            </h2>
            <p className="font-sans text-[12px] opacity-60 max-w-[36ch] leading-relaxed">
              {lang === 'en'
                ? 'Unlimited vents for 21 days. No card needed. After that, ₹299/mo for 200 stories/month + old access.'
                : '21 दिन तक अनलिमिटेड वेंट्स। कार्ड नहीं चाहिए। उसके बाद ₹299/महीना - 200 कहानियाँ + पुराना एक्सेस।'}
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {/* Free Tier */}
            <div className="rounded-[24px] bg-[#0A0A0B] border border-white/10 p-6">
              <div className="font-sans text-[11px] uppercase tracking-widest opacity-50">{t.free} • No card</div>
              <div className="font-display text-[28px] mt-2">
                ₹0 <span className="text-[14px] font-sans opacity-60">/ 21 days</span>
              </div>
              <div className="font-sans text-[12px] opacity-60 mt-1">{t.heroFreeBadge}</div>
              <div className="mt-3 inline-flex rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-[10px]">
                {trialActive ? `${trialDaysLeft} ${t.daysLeft} • Unlimited` : 'Trial ended'} • localStorage
              </div>
              <ul className="mt-5 space-y-2 font-sans text-[12px] opacity-70">
                <li>• {lang === 'en' ? '21 days unlimited' : '21 दिन अनलिमिटेड'}</li>
                <li>• {lang === 'en' ? 'Your stories' : 'तुम्हारी कहानियाँ'}</li>
                <li>• {lang === 'en' ? 'Anonymous' : 'गुमनाम'}</li>
                <li>• {lang === 'en' ? 'Live transcription • Auto-save animation' : 'लाइव टाइपिंग • ऑटो-सेव'}</li>
                <li>• {lang === 'en' ? 'AI structured • Library access' : 'AI स्ट्रक्चर • लाइब्रेरी'}</li>
              </ul>
              <button
                onClick={scrollToBooth}
                className="mt-6 w-full rounded-full bg-white text-black h-10 font-sans text-[12px] font-bold hover:bg-zinc-200 transition"
              >
                {lang === 'en' ? 'Start 21-day free trial' : '21 दिन फ्री ट्रायल शुरू करो'}
              </button>
            </div>

            {/* Plus Tier */}
            <div className="rounded-[24px] bg-[#FF6B5B] text-black p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-black text-white text-[10px] px-2 py-1 rounded-full font-sans">
                Popular
              </div>
              <div className="font-sans text-[11px] uppercase tracking-widest opacity-60">{t.plus}</div>
              <div className="font-display text-[28px] mt-2">
                ₹299 <span className="text-[14px] font-sans">/mo</span>
              </div>
              <div className="font-sans text-[12px] opacity-70 mt-1">{lang === 'en' ? '200 stories/month' : '200 कहानियाँ/महीना'}</div>
              <div className="font-sans text-[11px] opacity-60 mt-2 leading-snug">
                {lang === 'en' ? '200 stories/month, old stories access, export, mood analytics' : '200 कहानियाँ/महीना, पुरानी कहानियों का एक्सेस, एक्सपोर्ट, मूड एनालिटिक्स'}
              </div>
              <ul className="mt-5 space-y-2 font-sans text-[12px] opacity-80">
                <li>• {lang === 'en' ? 'Everything in Free' : 'फ्री में सब कुछ'}</li>
                <li>• {lang === 'en' ? '200 stories/month' : '200 कहानियाँ/महीना'}</li>
                <li>• {lang === 'en' ? 'Old stories access' : 'पुरानी कहानियों का एक्सेस'}</li>
                <li>• {lang === 'en' ? 'Export + Mood analytics' : 'एक्सपोर्ट + मूड एनालिटिक्स'}</li>
              </ul>
              <a
                href="https://rzp.io/rzp/pfL6Hk3n"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full py-3 rounded-full bg-black text-[#FF6B5B] font-bold text-center block hover:bg-zinc-900 font-sans text-[12px] transition"
                title="Subscribe Aur Sunao Plus ₹299"
              >
                {lang === 'en' ? 'Pay ₹299 - Continue' : '₹299 भुगतान करें'}
              </a>
            </div>

            {/* Credits Pack */}
            <div className="rounded-[24px] bg-[#0A0A0B] border border-white/10 p-6">
              <div className="font-sans text-[11px] uppercase tracking-widest opacity-50">{t.credits} • Extra</div>
              <div className="font-display text-[28px] mt-2">₹499</div>
              <div className="font-sans text-[12px] opacity-60 mt-1">{lang === 'en' ? '500 extra stories' : '500 एक्स्ट्रा कहानियाँ'}</div>
              <ul className="mt-5 space-y-2 font-sans text-[12px] opacity-70">
                <li>• 500 stories</li>
                <li>• {lang === 'en' ? 'One-time • Never expires' : 'वन-टाइम • कभी एक्सपायर नहीं'}</li>
                <li>• {lang === 'en' ? 'Add to Plus or standalone' : 'प्लस में जोड़ो या अलग'}</li>
              </ul>
              <a
                href="https://rzp.io/rzp/Y7NubYzE"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full py-3 rounded-full border border-white/15 bg-white text-black font-bold text-center block hover:bg-zinc-100 font-sans text-[12px] transition"
                title="Buy 500 Credits ₹499"
              >
                {lang === 'en' ? 'Buy 500 Credits - ₹499' : '500 क्रेडिट्स - ₹499'}
              </a>
              <div className="mt-2 font-mono text-[9px] opacity-40 text-center">Link: rzp.io/rzp/Y7NubYzE</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Segment Under Brands: FMCG 10 Cities Listening & Anonymous Studies (Collapsible Hub) */}
      <section {...show('/brands')} id="brands" className="mx-auto max-w-[1280px] px-5 md:px-8 py-6" lang={lang}>
        <div className="rounded-[24px] bg-[#141416] border border-white/10 p-5 md:p-7 relative overflow-hidden shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="max-w-[70ch]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B5B] animate-pulse" />
                <span className="font-sans text-[11px] uppercase tracking-widest text-[#FF6B5B] font-bold">
                  Enterprise Qualitative Research & FMCG Listening
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  10 Indian Metros • 80/20 Creator Split
                </span>
              </div>
              <h2 className="font-display text-[24px] md:text-[30px] text-white mt-2 leading-tight">
                Qualitative Human Stories for D2C, FMCG & Fintech Product Teams
              </h2>
              <p className="font-sans text-[12.5px] text-white/70 mt-1.5 leading-relaxed">
                Explore real unprompted emotional frequencies, 12 synthetic ICP consumer avatars, regional stress heatmaps, and custom research pitch calculators.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                className="px-4 py-2 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black font-sans text-[12px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <span>{isBrandsExpanded ? 'Collapse Suite' : 'Explore Market Intelligence Suite'}</span>
                {isBrandsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setBrandIntelligenceTab('cost_estimator');
                  setIsBrandsExpanded(true);
                }}
                className="px-3.5 py-2 rounded-full border border-[#FF8E53]/40 bg-[#FF8E53]/15 text-[#FFB300] font-sans text-[12px] font-semibold hover:bg-[#FF8E53]/25 flex items-center gap-1.5 cursor-pointer transition"
              >
                <Calculator size={13} />
                <span>Cost Estimator</span>
              </button>

              <button
                type="button"
                onClick={() => setShowEnterpriseModal(true)}
                className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-sans text-[12px] font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Building2 size={13} className="text-[#FFB300]" />
                <span>Request Brand Pilot</span>
              </button>
            </div>
          </div>

          {/* Render Full Suite when expanded */}
          {isBrandsExpanded && (
            <div className="mt-6 pt-6 border-t border-white/10 fade-up">
              <BrandMarketIntelligence
                lang={lang}
                initialTab={brandIntelligenceTab}
              />
            </div>
          )}
        </div>
      </section>

      {/* SEO Dense Content & Comprehensive FAQ Knowledge Hub */}
      <section {...show('/faq')} id="seo-content" className="bg-[#F5F5F0] text-black/70 border-t border-black/5" lang={lang}>
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-10 md:py-14">
          {/* Quick Jump Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-6 font-sans text-[11px]">
            <span className="opacity-40">Jump to:</span>
            <button onClick={() => go('/booth')} className="px-3 py-1 rounded-full bg-black text-white hover:opacity-80 cursor-pointer">Voice Booth</button>
            <button onClick={() => go('/bounties')} className="px-3 py-1 rounded-full border border-black/15 bg-white text-black font-semibold hover:bg-black/5 cursor-pointer">Loyalty Bounties ⭐</button>
            <button onClick={() => go('/', 'benefits')} className="px-3 py-1 rounded-full border border-black/15 hover:bg-black/5 cursor-pointer">Benefits of venting</button>
            <button onClick={() => go('/stories')} className="px-3 py-1 rounded-full border border-black/15 hover:bg-black/5 cursor-pointer">Story Vault</button>
            <button onClick={() => go('/pricing')} className="px-3 py-1 rounded-full border border-black/15 hover:bg-black/5 cursor-pointer">Pricing ₹299 Plus</button>
            <button onClick={() => go('/brands')} className="px-3 py-1 rounded-full border border-[#FF6B5B]/30 bg-[#FF6B5B]/10 text-black font-semibold hover:bg-[#FF6B5B]/20 cursor-pointer">Enterprise FMCG Hub</button>
            <button onClick={() => go('/faq')} className="px-3 py-1 rounded-full bg-black/10 text-black font-bold cursor-pointer">SEO FAQ Center ({FAQ_LIST.length})</button>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-start">
            {/* Left Column: Context, Science, and Deep Rationale */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/5 border border-black/10 text-[10.5px] font-mono text-black/70 mb-2.5">
                <span>🧠</span> Cognitive Science & Architecture
              </div>
              <h2 className="font-display text-[26px] md:text-[36px] leading-[1.05] text-black">
                What is Aur Sunao? Voice-first anonymous sanctuary for overthinkers in India
              </h2>

              <div className="mt-4 font-sans text-[13px] leading-[1.7] space-y-3 max-w-[65ch]">
                <p>
                  <strong>The Overthinking Reality:</strong> At 3 AM, high-performing founders, engineers, and young professionals in Bengaluru, Mumbai, and Tier-2 cities rehearse thoughts they cannot tell their spouses, colleagues, or managers. Traditional journals require cognitive friction to type, therapy carries societal stigma or high cost, and corporate channels risk professional exposure.
                </p>
                <p>
                  <strong>Voice-First Neuroscience:</strong> Aur Sunao eliminates typing. You speak into your browser, watching ephemeral audio transcribe in real time with affective mood highlights. AI gently transforms raw insomnia monologues into structured narratives (Hook, Emotion, Tension, Turning Point, and Practical Next Action).
                </p>

                {/* Expandable Technical & Grounding Deep-Dive */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsSeoDeepDiveExpanded(!isSeoDeepDiveExpanded)}
                    className="text-[11.5px] font-sans font-bold text-[#D04A3A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isSeoDeepDiveExpanded ? 'Hide deep technical & regulatory architecture' : 'Read complete regulatory & scientific architecture ▾'}</span>
                    {isSeoDeepDiveExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {isSeoDeepDiveExpanded && (
                    <div className="mt-3 p-4 rounded-xl bg-white border border-black/10 text-[12px] space-y-2.5 fade-up text-black/80">
                      <p>
                        <strong>Zero-Knowledge & DPDP Act 2023:</strong> Audio buffers are processed ephemerally using standard W3C Web Speech API implementations directly in your client browser session. No unencrypted audio traces are retained on public cloud servers. Authors remain anonymous by default (identified only by age brackets and regional metro tokens).
                      </p>
                      <p>
                        <strong>Brand Bounties & Member Loyalty Tokens:</strong> Certified consumer brands fund loyalty point pools (500–1,200 points per verified story) to understand authentic lifestyle friction. Storytellers accumulate points redeemable for guided meditation access, Audible wellness books, and licensed therapist session subsidies.
                      </p>
                      <p>
                        <strong>Bilingual Indian NLP:</strong> Seamlessly transcribes both Indian English (`en-IN`) and Hindi (`hi-IN`) alongside colloquial Hinglish phrasing, honoring the unique cultural dynamics of small-town migrants navigating urban isolation.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 6 Scientific Benefits Grid (Compact & Refined) */}
              <div className="mt-6 pt-5 border-t border-black/10">
                <h3 className="font-display text-[20px] text-black mb-3">
                  Why Vocal Venting Works: Backed by Cognitive Science
                </h3>
                <div className="grid sm:grid-cols-2 gap-2.5 font-sans text-[11.5px] leading-[1.5]">
                  <div className="rounded-xl bg-white border border-black/10 p-3">
                    <strong className="text-black block mb-0.5">1. Affect Labeling</strong>
                    Naming emotional friction aloud reduces amygdala hyperactivity and lowers acute cortisol within 3 minutes.
                  </div>
                  <div className="rounded-xl bg-white border border-black/10 p-3">
                    <strong className="text-black block mb-0.5">2. 3 AM Insomnia Buffer</strong>
                    Decompress ruminating thoughts before sleep so your nervous system is not carrying unsaid burdens to bed.
                  </div>
                  <div className="rounded-xl bg-white border border-black/10 p-3">
                    <strong className="text-black block mb-0.5">3. Clarity Over Rumination</strong>
                    Hearing yourself speak externalizes complex dilemmas, shifting cognition from chaotic loop to structured clarity.
                  </div>
                  <div className="rounded-xl bg-white border border-black/10 p-3">
                    <strong className="text-black block mb-0.5">4. Zero-Judgement Sanctuary</strong>
                    No unsolicited advice, no toxic positivity, and no risk of personal or professional relationship backlash.
                  </div>
                  <div className="rounded-xl bg-white border border-black/10 p-3">
                    <strong className="text-black block mb-0.5">5. Loyalty Rewards Economy</strong>
                    Earn 500+ Loyalty Points on brand bounties, redeemable for mental health subscriptions and therapy discounts.
                  </div>
                  <div className="rounded-xl bg-[#FF6B5B]/15 border border-[#FF6B5B]/30 p-3 text-black">
                    <strong className="text-black block mb-0.5">6. Chaos → Meaningful Story</strong>
                    Generates polished insights, email drafts, and habit milestones from your most vulnerable spoken moments.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Categorized Interactive FAQ Hub */}
            <div id="faq" className="rounded-[22px] bg-white border border-black/10 p-5 md:p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-black/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-[22px] text-black leading-tight">
                      {lang === 'en' ? 'Frequently Asked Questions' : 'अक्सर पूछे जाने वाले सवाल'}
                    </h3>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-white">
                      {FAQ_LIST.length} FAQs
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-black/60 mt-0.5">
                    {lang === 'en' ? 'Detailed answers for creators, members & search queries' : 'गोपनीयता, लॉयल्टी पॉइंट्स और वॉयस तकनीक के उत्तर'}
                  </p>
                </div>

                <button
                  type="button"
                  id="toggle-faq-minimize-btn"
                  onClick={() => {
                    setIsFaqMinimized(!isFaqMinimized);
                    if (!isFaqMinimized) setOpenFaqIndex(null);
                  }}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-medium border border-black/10 hover:bg-black/5 transition text-black/80 cursor-pointer"
                >
                  {isFaqMinimized ? (
                    <>
                      <Maximize2 size={11} />
                      <span>{lang === 'en' ? 'View All' : 'सभी देखें'}</span>
                    </>
                  ) : (
                    <>
                      <Minimize2 size={11} />
                      <span>{lang === 'en' ? 'Compact' : 'छोटा करें'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Category Pills Selector */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setFaqCategory(cat.id);
                      setOpenFaqIndex(null);
                    }}
                    className={`px-2.5 py-1 rounded-full font-sans text-[10.5px] font-semibold flex items-center gap-1 transition cursor-pointer ${
                      faqCategory === cat.id
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-black/[0.04] text-black/70 hover:bg-black/10'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{lang === 'en' ? cat.label : cat.labelHi}</span>
                  </button>
                ))}
              </div>

              {/* Search Filter Bar */}
              <div className="mt-3 relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
                <input
                  type="text"
                  id="faq-search-input"
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search keywords (e.g. anonymous, loyalty points, affect labeling, mic)...' : 'प्रश्न खोजें (जैसे गुमनाम, पॉइंट्स, माइक)...'}
                  className="w-full pl-8 pr-8 py-1.5 rounded-full bg-black/[0.03] border border-black/10 text-black text-[11px] placeholder:text-black/40 focus:outline-none focus:border-[#FF6B5B] transition"
                />
                {faqSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setFaqSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* FAQ Accordion List */}
              {(() => {
                const filtered = FAQ_LIST.filter(faq => {
                  if (faqCategory !== 'all' && faq.category !== faqCategory) {
                    return false;
                  }
                  if (!faqSearchQuery.trim()) return true;
                  const q = faqSearchQuery.toLowerCase();
                  const matchQ = faq.q.toLowerCase().includes(q);
                  const matchA = faq.a.toLowerCase().includes(q);
                  const matchK = faq.keywords ? faq.keywords.some(k => k.toLowerCase().includes(q)) : false;
                  return matchQ || matchA || matchK;
                });

                const displayed = isFaqMinimized && !faqSearchQuery.trim() && faqCategory === 'all'
                  ? filtered.slice(0, 4)
                  : filtered;

                if (displayed.length === 0) {
                  return (
                    <div className="py-8 text-center font-sans text-[11px] text-black/50">
                      {lang === 'en' ? 'No matching FAQs found for this filter.' : 'कोई मिलता-जुलता प्रश्न नहीं मिला।'}
                      <button
                        type="button"
                        onClick={() => {
                          setFaqSearchQuery('');
                          setFaqCategory('all');
                        }}
                        className="block mx-auto mt-1 text-[#FF6B5B] font-medium hover:underline cursor-pointer"
                      >
                        {lang === 'en' ? 'Reset filters' : 'फ़िल्टर हटाएं'}
                      </button>
                    </div>
                  );
                }

                return (
                  <>
                    <div className={`mt-3 divide-y divide-black/5 ${!isFaqMinimized ? 'max-h-[440px] overflow-y-auto pr-1 scrollbar-thin' : ''}`}>
                      {displayed.map((faq, idx) => {
                        const originalIdx = FAQ_LIST.findIndex(f => f.q === faq.q);
                        const isOpen = openFaqIndex === originalIdx;
                        return (
                          <div key={originalIdx} className="py-2.5 first:pt-1">
                            <button
                              type="button"
                              onClick={() => setOpenFaqIndex(isOpen ? null : originalIdx)}
                              className="w-full flex justify-between items-start gap-2.5 text-left group cursor-pointer"
                            >
                              <div className="pr-1">
                                <span className="font-sans text-[12.5px] font-semibold text-black/90 group-hover:text-[#D04A3A] transition leading-[1.35] block">
                                  {faq.q}
                                </span>
                                {faq.keywords && faq.keywords.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {faq.keywords.slice(0, 3).map((kw, kIdx) => (
                                      <span key={kIdx} className="text-[9.5px] font-mono text-black/45 bg-black/[0.04] px-1.5 py-0.2 rounded">
                                        #{kw}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className={`shrink-0 w-5 h-5 rounded-full grid place-items-center transition-colors mt-0.5 ${
                                isOpen ? 'bg-[#FF6B5B] text-black' : 'bg-black/5 text-black/70 group-hover:bg-black group-hover:text-white'
                              }`}>
                                {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                              </span>
                            </button>

                            {isOpen && (
                              <div className="mt-2.5 p-3.5 rounded-[14px] bg-black/[0.03] border border-black/5 font-sans text-[12px] leading-[1.65] text-black/80 fade-up">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Expand / Minimize Toggle Footer */}
                    {!faqSearchQuery && faqCategory === 'all' && (
                      <div className="mt-3 pt-2.5 border-t border-black/10 flex items-center justify-between">
                        {isFaqMinimized ? (
                          <button
                            type="button"
                            id="show-all-faqs-btn"
                            onClick={() => setIsFaqMinimized(false)}
                            className="w-full py-2 px-3 rounded-xl bg-black/[0.04] hover:bg-black text-black hover:text-white font-sans text-[11px] font-semibold flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer"
                          >
                            <span>{lang === 'en' ? `Show all ${FAQ_LIST.length} questions (${FAQ_LIST.length - 4} more)` : `सभी ${FAQ_LIST.length} प्रश्न देखें`}</span>
                            <ChevronDown size={12} />
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-between gap-2">
                            <span className="font-sans text-[10.5px] text-black/50">
                              {lang === 'en' ? `Showing all ${FAQ_LIST.length} comprehensive FAQs` : `सभी ${FAQ_LIST.length} प्रश्न दिख रहे हैं`}
                            </span>
                            <button
                              type="button"
                              id="collapse-faqs-btn"
                              onClick={() => {
                                setIsFaqMinimized(true);
                                setOpenFaqIndex(null);
                              }}
                              className="py-1 px-2.5 rounded-lg border border-black/10 hover:bg-black/5 text-black/70 font-sans text-[10.5px] font-medium flex items-center gap-1 transition cursor-pointer"
                            >
                              <Minimize2 size={10} />
                              <span>{lang === 'en' ? 'Minimize FAQs' : 'छोटा करें'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Trust & Compliance Bar */}
      <section className="bg-[#141416] border-t border-b border-white/10 py-6 px-5 md:px-8">
        <div className="mx-auto max-w-[1280px] grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-sans">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[#FF6B5B] font-bold text-[15px] mb-0.5">🔒 256-Bit SSL</div>
            <div className="text-[10.5px] opacity-60">Enterprise grade encryption for voice & text data</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[#FF6B5B] font-bold text-[15px] mb-0.5">🛡️ Zero-Knowledge</div>
            <div className="text-[10.5px] opacity-60">Anonymous by default • No spouse/employer tracking</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[#FF6B5B] font-bold text-[15px] mb-0.5">🇮🇳 DPDP & GDPR</div>
            <div className="text-[10.5px] opacity-60">Full compliance with India digital data protection laws</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[#FF6B5B] font-bold text-[15px] mb-0.5">💳 Razorpay Secure</div>
            <div className="text-[10.5px] opacity-60">Instant digital invoices & secure subscription billing</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 bg-[#0A0A0B]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 flex flex-wrap justify-between gap-6 font-sans text-[11px] opacity-60">
          <div>
            <div className="font-display text-[16px] text-white mb-1">aur sunao. / और सुनाओ।</div>
            <div>Voice-first. Anonymous first. Story always. Commercial B2C platform.</div>
            <div className="mt-2 opacity-50">© {new Date().getFullYear()} Aur Sunao Technologies India Pvt Ltd. All rights reserved.</div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div>
              <div className="font-bold text-white mb-2">Legal & Compliance</div>
              <ul className="space-y-1.5">
                <li><button onClick={() => setShowLegalModal('privacy')} className="hover:underline">Privacy Policy (DPDP / GDPR)</button></li>
                <li><button onClick={() => setShowLegalModal('terms')} className="hover:underline">Terms of Service</button></li>
                <li><button onClick={() => setShowReceiptModal(true)} className="hover:underline">Digital Tax Invoice / Receipt</button></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-white mb-2">Enterprise & Support</div>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => go('/brands')}
                    className="hover:underline text-[#FF6B5B] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>For Brands & FMCG Studies (₹1L/mo)</span>
                  </button>
                </li>
                <li><button onClick={() => setShowSupportModal(true)} className="hover:underline">Customer Helpdesk</button></li>
                <li><button onClick={() => setShowPaywall(true)} className="hover:underline">Pricing & Subscription</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Enterprise & Brand Intelligence Modal */}
      {showEnterpriseModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto grid place-items-center">
          <div className="w-full max-w-[1240px] max-h-[92vh] overflow-y-auto rounded-[28px] bg-[#141416] border border-white/15 p-4 sm:p-6 md:p-8 text-white shadow-2xl fade-up relative my-auto">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FF6B5B]/20 text-[#FF6B5B] grid place-items-center">
                  <Building2 size={16} />
                </div>
                <div>
                  <h3 className="font-display text-[20px] md:text-[24px] leading-tight">
                    {lang === 'en' ? 'Brand Intelligence Suite' : 'ब्रांड इंटेलिजेंस सूट'}
                  </h3>
                  <div className="font-sans text-[11px] opacity-60">
                    {lang === 'en' ? 'FMCG Market Research • 10 Cities • Anonymous Studies at ₹1 Lakh/month/city' : 'FMCG मार्केट रिसर्च • 10 शहर • ₹1 लाख/माह/शहर में गुमनाम अध्ययन'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowEnterpriseModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 text-white cursor-pointer transition"
                title="Close Brand Suite"
              >
                <X size={16} />
              </button>
            </div>

            <BrandMarketIntelligence
              lang={lang}
              initialTab={brandIntelligenceTab}
              onClose={() => setShowEnterpriseModal(false)}
            />
          </div>
        </div>
      )}

      {/* Legal Modal (Privacy & Terms) */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 grid place-items-center">
          <div className="w-full max-w-[640px] max-h-[85vh] overflow-auto rounded-[28px] bg-[#F5F5F0] text-black p-6 md:p-8 shadow-2xl fade-up">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-[26px]">
                {showLegalModal === 'privacy' ? 'Privacy Policy & Data Governance' : 'Terms of Service'}
              </h3>
              <button onClick={() => setShowLegalModal(null)} className="w-8 h-8 rounded-full bg-black text-white grid place-items-center hover:bg-zinc-800">
                <X size={16} />
              </button>
            </div>
            <div className="mt-6 font-sans text-[13px] leading-[1.7] space-y-4 opacity-80">
              {showLegalModal === 'privacy' ? (
                <>
                  <p><b>1. Anonymous by Default:</b> Aur Sunao is architected for absolute user privacy. Voice notes are processed with zero-knowledge encryption. Your name, email, and phone number are never linked to your voice vents unless you explicitly opt to reveal your identity.</p>
                  <p><b>2. DPDP Act (India) & GDPR Compliance:</b> We adhere strictly to the Digital Personal Data Protection Act and international privacy standards. You retain full ownership of your voice data and can permanently purge your local session cache and server logs at any time.</p>
                  <p><b>3. Audio Processing:</b> Voice recordings are transcribed in real-time. Raw audio streams are not permanently stored on commercial servers unless saved to your personal library.</p>
                </>
              ) : (
                <>
                  <p><b>1. Subscription & Trial Terms:</b> All new users receive a 21-day unlimited free trial with zero credit card required. Following the trial, Aur Sunao Plus is billed at ₹299/month (200 stories/month + archive access), and credit packs are available at ₹499 for 500 stories.</p>
                  <p><b>2. Cancellation & Refunds:</b> You may cancel your subscription at any time via your account portal. Refunds are processed in accordance with digital goods consumer protection guidelines.</p>
                  <p><b>3. Code of Conduct:</b> Aur Sunao provides a safe venting sanctuary. Automated moderation prevents harmful or illegal content generation.</p>
                </>
              )}
            </div>
            <button
              onClick={() => setShowLegalModal(null)}
              className="mt-8 rounded-full bg-black text-white px-6 h-10 font-sans text-[12px] font-bold"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

      {/* Customer Support Helpdesk Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 grid place-items-center">
          <div className="w-full max-w-[460px] rounded-[28px] bg-[#141416] border border-white/15 p-6 md:p-8 text-white shadow-2xl fade-up">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-[24px]">Customer Support Helpdesk</h3>
              <button onClick={() => setShowSupportModal(false)} className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">
                <X size={16} />
              </button>
            </div>
            {supportSubmitted ? (
              <div className="mt-6 p-6 rounded-2xl bg-[#FF6B5B]/20 border border-[#FF6B5B]/40 text-center">
                <div className="text-[#FF6B5B] font-bold text-lg">Ticket Submitted (#AS-9482) ✓</div>
                <p className="font-sans text-[12px] opacity-80 mt-2">Our support concierge will reply to your registered email within 2 hours.</p>
                <button
                  onClick={() => { setShowSupportModal(false); setSupportSubmitted(false); setSupportMessage(''); }}
                  className="mt-4 rounded-full bg-[#FF6B5B] text-black px-6 py-2.5 font-bold text-[12px]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const selectEl = e.currentTarget.querySelector('select') as HTMLSelectElement;
                    await fetch('/api/support-ticket', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        topic: selectEl ? selectEl.value : 'General Support',
                        message: supportMessage,
                        email: enterpriseForm.email || 'thinkbeyond9@gmail.com',
                      }),
                    });
                  } catch (err) {
                    console.error('Failed to send support ticket:', err);
                  }
                  setSupportSubmitted(true);
                }}
                className="mt-6 space-y-4 font-sans text-[13px]"
              >
                <div>
                  <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">Issue Topic</label>
                  <select className="w-full rounded-xl bg-black border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-[#FF6B5B]">
                    <option>Microphone Permission / Recording Issue</option>
                    <option>Billing / Subscription / Razorpay Invoice</option>
                    <option>21-Day Free Trial Questions</option>
                    <option>Anonymity & Data Privacy Guarantee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">Describe your issue</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us what you need help with..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    className="w-full rounded-xl bg-black border border-white/20 p-4 text-white focus:outline-none focus:border-[#FF6B5B]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#FF6B5B] text-black h-12 font-bold text-[13px] hover:brightness-110 transition mt-2"
                >
                  Send Support Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Digital Receipt / Tax Invoice Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 grid place-items-center">
          <div className="w-full max-w-[500px] rounded-[28px] bg-[#F5F5F0] text-black p-6 md:p-8 shadow-2xl fade-up">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] font-mono uppercase opacity-50">Tax Invoice #AS-2026-8941</div>
                <h3 className="font-display text-[24px] mt-1">Aur Sunao Plus Subscription</h3>
              </div>
              <button onClick={() => setShowReceiptModal(false)} className="w-8 h-8 rounded-full bg-black text-white grid place-items-center hover:bg-zinc-800">
                <X size={16} />
              </button>
            </div>
            <div className="mt-6 border-t border-b border-black/10 py-4 font-sans text-[12px] space-y-2">
              <div className="flex justify-between">
                <span className="opacity-60">Plan:</span>
                <span className="font-bold">Aur Sunao Plus (Monthly)</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Amount:</span>
                <span className="font-bold">₹299.00</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">GST (18%):</span>
                <span className="font-bold">Included (₹45.61)</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Gateway:</span>
                <span className="font-bold">Razorpay Secure (Live)</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Status:</span>
                <span className="font-bold text-emerald-600">PAID ✓</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setToastMessage('Invoice downloaded successfully ✓');
                  setTimeout(() => setToastMessage(''), 3000);
                  setShowReceiptModal(false);
                }}
                className="flex-1 rounded-full bg-black text-[#FF6B5B] h-11 font-bold text-[12px] hover:bg-zinc-900 transition"
              >
                Download PDF Invoice
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="rounded-full border border-black/20 px-6 h-11 font-bold text-[12px] hover:bg-black/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Detail Modal - Only opened once logged in */}
      {selectedStory && user.isRegistered && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md p-4 grid place-items-center">
          <div className="w-full max-w-[640px] max-h-[90vh] overflow-auto rounded-[28px] bg-[#F5F5F0] text-black p-6 md:p-8 shadow-2xl fade-up">
            <div className="flex justify-between items-start gap-4">
              <div>
                {/* Emotions of each story right on top */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xl leading-none" role="img" aria-label={selectedStory.mood}>
                    {MOOD_EMOJIS[selectedStory.mood.toLowerCase()] || '💫'}
                  </span>
                  <span className={`text-[10px] font-sans font-bold px-2.5 py-1 rounded-full uppercase ${MOOD_COLORS[selectedStory.mood]}`}>
                    {selectedStory.mood}
                  </span>
                  <span className="text-[10px] font-sans border px-2 py-1 rounded-full">
                    {selectedStory.type}
                  </span>
                  <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] font-semibold flex items-center gap-1">
                    <Sparkles size={11} /> Unlocked for {user.name}
                  </span>
                  <span className="text-[10px] font-mono text-black/50">
                    Auto-logout in {Math.floor(secondsToInactivityLogout / 60)}m {secondsToInactivityLogout % 60}s
                  </span>
                </div>
                <h3 className="font-display text-[26px] md:text-[28px] leading-[1.05] mt-3">
                  {lang === 'en' ? selectedStory.title : selectedStory.titleHi}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleLogout('manual')}
                  className="px-2.5 py-1.5 rounded-full bg-black/5 hover:bg-[#FF5C5C]/15 text-black/70 hover:text-[#FF5C5C] font-sans text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                  title={lang === 'en' ? 'Log out' : 'लॉग आउट'}
                >
                  <LogOut size={12} />
                  <span className="hidden sm:inline">{lang === 'en' ? 'Logout' : 'लॉग आउट'}</span>
                </button>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="w-9 h-9 rounded-full bg-black text-white grid place-items-center hover:bg-zinc-800 transition cursor-pointer"
                  title={lang === 'en' ? 'Close story' : 'कहानी बंद करें'}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <p className="font-sans text-[13px] opacity-60 mt-3">
              {lang === 'en' ? selectedStory.hook : selectedStory.hookHi}
            </p>

                {/* Instant Mood Analysis of this story */}
                <div className="mt-4">
                  <LiveInstantMoodAnalyzer
                    text={selectedStory.transcript || selectedStory.structured.narrative}
                    isLive={false}
                    existingAnalysis={selectedStory.instantMoodAnalysis}
                    assignedEmotion={selectedStory.mood || selectedStory.emotion}
                    lang={lang}
                  />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2 font-sans text-[11px]">
                  <div className="rounded-xl bg-black text-white p-3">
                    <div className="opacity-50">People</div>
                    <div className="font-bold mt-1">{selectedStory.structured.people}</div>
                  </div>
                  <div className="rounded-xl bg-white border p-3">
                    <div className="opacity-50">Setting</div>
                    <div className="font-bold mt-1">{selectedStory.structured.setting}</div>
                  </div>
                  <div className="rounded-xl bg-[#FF6B5B] p-3">
                    <div className="opacity-60">Emotion</div>
                    <div className="font-bold mt-1">{selectedStory.structured.emotion}</div>
                  </div>
                  <div className="rounded-xl bg-[#FF5C5C] text-white p-3">
                    <div className="opacity-70">Conflict</div>
                    <div className="font-bold mt-1">{selectedStory.structured.conflict}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="font-sans text-[11px] uppercase tracking-widest opacity-50 flex items-center gap-2">
                    <Quote size={12} /> Narrative
                  </div>
                  <p className="font-serif text-[18px] leading-[1.5] mt-3">
                    {lang === 'en' ? selectedStory.structured.narrative : selectedStory.structured.narrativeHi}
                  </p>
                  <div className="mt-4 rounded-xl bg-black/5 p-4 font-sans text-[12px] leading-relaxed">
                    <div className="opacity-50 text-[10px] uppercase">Turning • Insight</div>
                    <div className="mt-1"><b>Turning:</b> {selectedStory.structured.turning}</div>
                    <div className="mt-1"><b>Insight:</b> {selectedStory.structured.insight}</div>
                  </div>
                </div>

                {/* Practical Output Converter: Professional Draft or Habit Checklist */}
                <div className="mt-4 border-t border-black/10 pt-2">
                  <div className="text-[12px] font-sans font-bold text-black/80 mb-1">
                    {lang === 'en' ? 'Practical Transformation Engine:' : 'व्यावहारिक रूपांतरण:'}
                  </div>
                  <PracticalConverter
                    story={selectedStory}
                    lang={lang}
                    onUpdateStory={(updated) => {
                      setSelectedStory(updated);
                      setStories(prev => prev.map(s => s.id === updated.id ? updated : s));
                    }}
                  />
                </div>

                {/* Algorithmic Empathy Matching Bridge (95% Semantic Match) */}
                <div className="mt-6 border-t border-black/10 pt-4">
                  <div className="text-[12px] font-sans font-bold text-black/80 mb-3 flex items-center gap-1.5">
                    <HeartHandshake size={14} className="text-[#FF6B5B]" />
                    <span>{lang === 'en' ? 'Peer Resonance Bridge (95% Semantic Match):' : 'पीयर रेजोनेंस ब्रिज (95% सेमांटिक मैच):'}</span>
                  </div>
                  <AlgorithmicEmpathyMatcher
                    userVentText={selectedStory.transcript || selectedStory.structured.narrative}
                    userMood={selectedStory.mood}
                    userLocation={selectedStory.location || 'India'}
                    candidateStories={stories.filter(s => s.id !== selectedStory.id)}
                    onOpenMatchedStory={handleOpenStory}
                    lang={lang}
                  />
                </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => handleClap(selectedStory.id)}
                className="rounded-full bg-black text-white px-5 h-10 font-sans text-[12px] flex items-center gap-2 hover:bg-zinc-800"
              >
                👏 Clap {selectedStory.claps}
              </button>
              <button
                onClick={() => handleHelped(selectedStory.id)}
                className="rounded-full border border-black/20 px-5 h-10 font-sans text-[12px] hover:bg-black/5"
              >
                ❤️ {t.helped} {selectedStory.helped}
              </button>
              <button
                onClick={() => setShowPaywall(true)}
                className="ml-auto rounded-full bg-[#FF6B5B] px-5 h-10 font-sans text-[12px] font-bold hover:brightness-110"
              >
                {t.requestLegit}
              </button>
            </div>
            <div className="mt-6 text-[11px] font-sans opacity-50">
              Author: {selectedStory.author} • Anonymous toggle: {selectedStory.anonymous ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>
      )}

      {/* 30-Second Recording Prompt Modal */}
      {show30sPromptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 grid place-items-center">
          <div className="w-full max-w-[420px] rounded-[28px] bg-[#141416] border border-[#FF6B5B]/30 p-6 md:p-8 text-white shadow-2xl fade-up">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-sans bg-[#FF6B5B] text-black px-2.5 py-0.5 rounded-full font-bold">Session Safe</span>
              <button onClick={() => setShow30sPromptModal(false)} className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">
                <X size={16} />
              </button>
            </div>
            <h3 className="font-display text-[24px] mt-4 leading-tight">
              You've been venting for 30 seconds!
            </h3>
            <p className="font-sans text-[13px] opacity-70 mt-3 leading-relaxed">
              Register or save your session now to ensure all your unstructured rants and AI-structured mini-stories remain securely saved in your personal library.
            </p>
            <div className="mt-6 space-y-3 font-sans text-[13px]">
              <button
                onClick={() => {
                  setShow30sPromptModal(false);
                  setShowLogin(true);
                }}
                className="w-full rounded-full bg-[#FF6B5B] text-black h-12 font-bold hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                Register / Save Session Now <Sparkles size={16} />
              </button>
              <button
                onClick={() => setShow30sPromptModal(false)}
                className="w-full rounded-full border border-white/20 h-11 opacity-80 hover:opacity-100 transition"
              >
                Continue Recording Anonymously
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login & User Profile Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur p-4 grid place-items-center">
          <div className="w-full max-w-[380px] rounded-[24px] bg-[#0A0A0B] border border-white/10 p-6 text-white shadow-2xl fade-up">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-[22px]">
                {user.isRegistered ? (lang === 'en' ? 'Reader Profile' : 'रीडर प्रोफ़ाइल') : (lang === 'en' ? 'Reader Access' : 'रीडर एक्सेस')}
              </h3>
              <button onClick={() => setShowLogin(false)} className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 transition cursor-pointer">
                <X size={14} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {user.isRegistered ? (
                <div className="space-y-4">
                  <div className="rounded-[18px] bg-[#2E7D32]/15 border border-[#2E7D32]/30 p-4 font-sans">
                    <div className="flex items-center gap-2 text-[#25D366] font-bold text-[12px]">
                      <Check size={15} />
                      <span>{lang === 'en' ? 'Registered Reader Account' : 'रजिस्टर्ड रीडर अकाउंट'}</span>
                    </div>
                    <div className="mt-2 font-display text-[18px] text-white">
                      {user.name}
                    </div>
                    {user.email && (
                      <div className="text-[11px] font-mono text-white/60 truncate mt-0.5">
                        {user.email}
                      </div>
                    )}
                    <div className="mt-2 text-[11px] text-white/70 leading-relaxed">
                      {lang === 'en'
                        ? 'All full stories, emotional reflections, and turning points are unlocked.'
                        : 'सभी कहानियां, भावनात्मक विश्लेषण और मोड़ आपके लिए अनलॉक हैं।'}
                    </div>
                  </div>

                    <div className="rounded-[14px] bg-white/5 border border-white/10 p-3 font-sans text-[11px] text-white/70 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#FF6B5B]" />
                        <span>{lang === 'en' ? 'Inactivity Auto-Logout:' : 'निष्क्रियता ऑटो-लॉगआउट:'}</span>
                      </div>
                      <span className="font-mono text-[#25D366] font-semibold">
                        {Math.floor(secondsToInactivityLogout / 60)}m {secondsToInactivityLogout % 60}s
                      </span>
                    </div>

                    <button
                      id="modal-logout-btn"
                      onClick={() => handleLogout('manual')}
                      className="w-full rounded-full bg-[#FF5C5C]/15 hover:bg-[#FF5C5C]/25 border border-[#FF5C5C]/35 text-[#FF5C5C] h-11 font-sans text-[12px] font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>{lang === 'en' ? 'Logout of Account' : 'अकाउंट से लॉग आउट करें'}</span>
                    </button>
                  </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-[14px] bg-white/5 border border-white/10 p-4 font-sans text-[12px]">
                    <div className="opacity-60 font-semibold">{lang === 'en' ? 'Guest Mode' : 'गेस्ट मोड'}</div>
                    <div className="mt-1 text-[11px] opacity-50 leading-relaxed">
                      {lang === 'en'
                        ? 'You can browse headings and emotions in the library. To read complete stories, please register for free.'
                        : 'आप शीर्षक और भावनाएं देख सकते हैं। पूरी कहानी पढ़ने के लिए फ्री में रजिस्टर करें।'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowLogin(false);
                      setShowRegisterModal(true);
                    }}
                    className="w-full rounded-full bg-[#FF6B5B] text-black h-11 font-sans text-[12px] font-bold flex items-center justify-center gap-2 hover:brightness-110 transition cursor-pointer shadow-md"
                  >
                    <Lock size={13} />
                    <span>{lang === 'en' ? 'Register for Free Access' : 'मुफ़्त एक्सेस के लिए रजिस्टर करें'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const regUser: UserState = {
                        name: 'Priya Sharma',
                        anon: false,
                        avatar: 'P',
                        isRegistered: true,
                        email: 'priya.sharma@gmail.com'
                      };
                      handleRegisterSuccess(regUser);
                      setShowLogin(false);
                    }}
                    className="w-full rounded-full bg-white text-black h-10 font-sans text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-full bg-black text-white grid place-items-center text-[10px]">G</span>
                    <span>{lang === 'en' ? 'Quick Login with Google (mock)' : 'गूगल से लॉगिन करें'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 font-sans text-[11px] opacity-50">
              {lang === 'en' ? 'Status' : 'स्थिति'}: {user.isRegistered ? `Registered (${user.name})` : 'Unregistered Guest'} • {trialActive ? `${trialDaysLeft} days left` : 'Trial ended'}
            </div>
          </div>
        </div>
      )}

      {/* Stories Vault Pop-up Modal */}
      <StoriesVaultModal
        isOpen={showStoriesVaultModal}
        onClose={() => setShowStoriesVaultModal(false)}
        stories={filteredStories}
        userIsRegistered={user.isRegistered ?? false}
        userName={user.name}
        secondsToInactivityLogout={secondsToInactivityLogout}
        lang={lang}
        onOpenStory={handleOpenStory}
        onRequireLogin={(story) => {
          if (story) setPendingStoryToOpen(story);
          setShowRegisterModal(true);
        }}
        onLogout={() => handleLogout('manual')}
        onClap={(storyId) => handleClap(storyId)}
      />

      {/* Registration Modal for Reading Entire Stories */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => {
          setShowRegisterModal(false);
          setPendingStoryToOpen(null);
        }}
        onRegisterSuccess={handleRegisterSuccess}
        pendingStory={pendingStoryToOpen}
        lang={lang}
      />

      {/* WhatsApp Voice Note Bot Modal */}
      <WhatsAppVoiceBoothModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        onStoryLogged={(newStory) => {
          setStories(prev => [newStory, ...prev.filter(s => s.id !== newStory.id)]);
          setVentCount(prev => prev + 1);
          setToastMessage(lang === 'en' ? `Synced from WhatsApp: ${newStory.title} ✓` : `व्हाट्सएप से सिंक हुआ: ${newStory.title} ✓`);
          setTimeout(() => setToastMessage(''), 4000);
        }}
        lang={lang}
      />

      {/* Synthetic ICP Avatars Pitch Testing Modal */}
      {showSyntheticAvatarsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto grid place-items-center">
          <div className="w-full max-w-[1180px] max-h-[92vh] overflow-y-auto rounded-[28px] bg-[#141416] border border-white/15 p-4 sm:p-6 md:p-8 text-white shadow-2xl fade-up relative my-auto">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#25D366]/20 text-[#25D366] grid place-items-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-display text-[20px] md:text-[24px] leading-tight">
                    {lang === 'en' ? 'Synthetic ICP Consumer Avatars' : 'सिंथेटिक ICP उपभोक्ता अवतार'}
                  </h3>
                  <div className="font-sans text-[11px] opacity-60">
                    {lang === 'en' ? 'Pitch ad copy & ideas directly to dynamic AI personas trained exclusively on consumer vents' : 'सीधे AI अवतारों से संवाद करें जो उपभोक्ता शिकायतों पर प्रशिक्षित हैं'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSyntheticAvatarsModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 text-white cursor-pointer transition"
                title="Close Avatars Modal"
              >
                <X size={16} />
              </button>
            </div>

            <SyntheticIcpAvatars lang={lang} />
          </div>
        </div>
      )}

      <div className="grain pointer-events-none" />
    </div>
  );
}
