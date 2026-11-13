/**
 * Stress & Recurring Keyword Topic Correlation Engine
 * Analyzes multiple vents to detect recurrent topics and measures whether
 * stress levels (acoustic strain, self-reported emotion, physiological intensity)
 * systematically spike or escalate when these specific topics are vocalized.
 */

export interface VentHistoryItem {
  id: string;
  timestamp: number;
  transcript: string;
  emotion: 'Happy' | 'Frustrated' | 'Relieved' | 'Stressed';
  stressScore: number; // 0 to 100
  topics: string[];
  acousticStrain?: number; // 0 to 100
  source?: string;
}

export interface TopicStressCorrelation {
  topic: string;
  topicHi: string;
  category: 'workplace' | 'relationships' | 'finances' | 'academic' | 'health' | 'life';
  occurrenceCount: number;
  totalVentsCount: number;
  avgStressScore: number; // 0 - 100
  baselineStressScore: number; // 0 - 100
  stressDelta: number; // e.g. +34 or -22
  correlationStrength: number; // 0.0 to 1.0
  trendDirection: 'escalating' | 'consistently_high' | 'easing' | 'stable';
  recentScores: number[];
  sampleQuotes: string[];
  historicalVentIds: string[];
  cognitiveReframeEn: string;
  cognitiveReframeHi: string;
  riskSeverity: 'critical' | 'elevated' | 'moderate' | 'restorative';
}

export interface CurrentStressAlert {
  isActive: boolean;
  severity: 'critical' | 'elevated' | 'moderate' | 'none';
  currentEstimatedStress: number; // 0 - 100
  baselineStress: number; // 0 - 100
  matchedTopics: TopicStressCorrelation[];
  highestCorrelatedTopic: TopicStressCorrelation | null;
  alertHeadlineEn: string;
  alertHeadlineHi: string;
  alertDetailEn: string;
  alertDetailHi: string;
  recommendedAnchorEn: string;
  recommendedAnchorHi: string;
}

// Stop words for keyword filtering (English + Hinglish common tokens)
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his',
  'how', 'i', 'i\'m', 'i\'ve', 'i\'d', 'i\'ll', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its', 'itself', 'just',
  'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought',
  'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'were', 'weren\'t', 'what', 'when', 'where', 'which',
  'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  // Hinglish & common conversational fillers
  'hai', 'tha', 'thi', 'the', 'bhi', 'kuch', 'mera', 'meri', 'mere', 'mai', 'main', 'mujhe', 'hum', 'humein', 'tera',
  'teri', 'tere', 'tujhe', 'apna', 'apne', 'yeh', 'woh', 'kya', 'kyun', 'kaise', 'kab', 'kahan', 'aur', 'par', 'lekin',
  'toh', 'ho', 'hoga', 'hogi', 'raha', 'rahi', 'rahe', 'karna', 'kar', 'karo', 'karte', 'wala', 'wali', 'wale', 'baat',
  'chiz', 'saal', 'din', 'aaj', 'kal', 'time', 'like', 'really', 'literally', 'actually', 'feel', 'feeling'
]);

// Topic dictionary mapping with translations, category, and cognitive reframing anchors
const TOPIC_METADATA: Record<string, {
  nameHi: string;
  category: TopicStressCorrelation['category'];
  reframeEn: string;
  reframeHi: string;
}> = {
  manager: {
    nameHi: 'मैनेजर',
    category: 'workplace',
    reframeEn: 'Separate their micromanagement from your core worth. Focus purely on what is within your locus of control today.',
    reframeHi: 'उनके दबाव को अपनी योग्यता से अलग रखें। केवल उन चीजों पर ध्यान दें जो आज आपके नियंत्रण में हैं।'
  },
  boss: {
    nameHi: 'बॉस',
    category: 'workplace',
    reframeEn: 'A manager\'s anxiety is often their own failure to plan. Don\'t absorb organizational chaos as personal inadequacy.',
    reframeHi: 'बॉस का तनाव अक्सर उनकी अपनी अनिश्चितता होती है। संस्थागत अव्यवस्था को अपनी कमी न समझें।'
  },
  deadline: {
    nameHi: 'डेडलाइन',
    category: 'workplace',
    reframeEn: 'Artificial urgency is not an emergency. Take three measured breaths and renegotiate one deliverable scope.',
    reframeHi: 'काल्पनिक जल्दबाज़ी कोई आपात स्थिति नहीं है। तीन गहरी सांसें लें और काम की प्राथमिकताओं को स्पष्ट करें।'
  },
  appraisal: {
    nameHi: 'अप्रेज़ल / रेटिंग',
    category: 'workplace',
    reframeEn: 'Performance ratings reflect departmental budget politics as much as your effort. Your self-respect remains intact.',
    reframeHi: 'अप्रेज़ल रेटिंग अक्सर कंपनी के बजट और राजनीति पर निर्भर होती है। अपने आत्मसम्मान को इससे न तोलें।'
  },
  salary: {
    nameHi: 'वेतन / सैलरी',
    category: 'finances',
    reframeEn: 'Money anxiety triggers primal safety alarms. Write down concrete fixed numbers vs catastrophic emotional projections.',
    reframeHi: 'आर्थिक चिंता सीधे असुरक्षा की भावना लाती है। डरावनी कल्पनाओं के बजाय वास्तविक आंकड़ों पर ध्यान दें।'
  },
  'in-laws': {
    nameHi: 'ससुराल / सास-ससुर',
    category: 'relationships',
    reframeEn: 'You cannot renovate someone else\'s generational conditioning. Protect your inner peace with polite, firm emotional distance.',
    reframeHi: 'आप दूसरों की पुरानी सोच नहीं बदल सकते। अपनी मानसिक शांति के लिए शालीनता से भावनात्मक दूरी बनाए रखें।'
  },
  family: {
    nameHi: 'परिवार',
    category: 'relationships',
    reframeEn: 'Duty does not require self-destruction. Loving your family does not mean erasing your personal boundaries.',
    reframeHi: 'पारिवारिक कर्तव्य का मतलब खुद को मिटाना नहीं है। प्यार और अपनी सीमाओं के बीच संतुलन जरूरी है।'
  },
  pip: {
    nameHi: 'पीआईपी (PIP)',
    category: 'workplace',
    reframeEn: 'A PIP is an administrative ritual, not a verdict on your career. Start quietly preparing your next chapter.',
    reframeHi: 'पीआईपी सिर्फ एक कॉर्पोरेट प्रक्रिया है, आपके भविष्य का फैसला नहीं। शांति से अपने अगले कदम की तैयारी करें।'
  },
  promotion: {
    nameHi: 'प्रमोशन',
    category: 'workplace',
    reframeEn: 'Delayed recognition stings, but career progression is non-linear. The skills you built remain yours forever.',
    reframeHi: 'प्रमोशन में देरी दुख देती है, पर आपका अनुभव और हुनर हमेशा आपके साथ रहेगा।'
  },
  sleep: {
    nameHi: 'नींद / अनिद्रा',
    category: 'health',
    reframeEn: 'Insomnia amplifies catastrophic thoughts by 300%. Remind yourself: tonight\'s problems can wait until daylight.',
    reframeHi: 'नींद न आने पर परेशानियां तीन गुना बड़ी लगती हैं। खुद को याद दिलाएं: सुबह से पहले कुछ हल नहीं होगा।'
  },
  rent: {
    nameHi: 'किराया / मकान किराया',
    category: 'finances',
    reframeEn: 'Urban living costs are systemic, not an individual moral failing. Take one step at a time.',
    reframeHi: 'बढ़ता किराया एक व्यवस्थागत समस्या है, आपकी नाकामी नहीं। धैर्यपूर्वक समाधान खोजें।'
  },
  client: {
    nameHi: 'क्लाइंट',
    category: 'workplace',
    reframeEn: 'Clients vent their own pressures on you. Stick to written contracts and avoid taking rude tones personally.',
    reframeHi: 'क्लाइंट अक्सर अपना तनाव आप पर निकालते हैं। लिखित शर्तों पर टिके रहें और बातों को दिल पर न लें।'
  },
  exam: {
    nameHi: 'परीक्षा / कॉम्पिटिशन',
    category: 'academic',
    reframeEn: 'An exam measures preparation for a single test on a single Sunday, not your total intelligence or life ceiling.',
    reframeHi: 'परीक्षा सिर्फ एक दिन की तैयारी का टेस्ट है, यह आपके पूरे जीवन या प्रतिभा का पैमाना नहीं है।'
  },
  rejection: {
    nameHi: 'अस्वीकृति / रिजेक्शन',
    category: 'life',
    reframeEn: 'Rejection is redirection. It is proof that you stepped into the arena instead of playing safe from the sidelines.',
    reframeHi: 'रिजेक्शन सिर्फ दिशा बदलने का संकेत है। यह सबूत है कि आपने कोशिश की, न कि पीछे हटे।'
  },
  loneliness: {
    nameHi: 'अकेलापन',
    category: 'life',
    reframeEn: 'Solitude can feel hollow in modern cities. Acknowledge the feeling without shaming yourself for feeling disconnected.',
    reframeHi: 'शहरों में अकेलापन भारी लग सकता है। इसे स्वीकार करें और खुद को दोषी ठहराने से बचें।'
  },
  chai: {
    nameHi: 'चाय का समय',
    category: 'life',
    reframeEn: 'A restorative sensory ritual that anchors the present moment.',
    reframeHi: 'एक सुकून भरा पल जो आपको वर्तमान में स्थिर करता है।'
  },
  running: {
    nameHi: 'दौड़ / व्यायाम',
    category: 'health',
    reframeEn: 'Physical movement metabolizes cortisol and resets acoustic vocal strain.',
    reframeHi: 'दौड़ना और कसरत तनाव के हार्मोन्स को कम कर मन को शांत करता है।'
  }
};

// Seed realistic historical vents representing multiple past vent sessions
export const DEFAULT_INITIAL_VENTS: VentHistoryItem[] = [
  {
    id: 'vent-seed-1',
    timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
    transcript: 'My manager moved the goalposts again right before the sprint review. Every single deadline he creates artificial panic and then questions why the team is tired.',
    emotion: 'Frustrated',
    stressScore: 89,
    topics: ['manager', 'deadline', 'sprint'],
    acousticStrain: 85
  },
  {
    id: 'vent-seed-2',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    transcript: 'Can not sleep at all tonight. The client keeps pinging on Slack about the launch deadline and my chest feels so tight when I hear that notification chime.',
    emotion: 'Stressed',
    stressScore: 84,
    topics: ['deadline', 'sleep', 'client'],
    acousticStrain: 82
  },
  {
    id: 'vent-seed-3',
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    transcript: 'Weekly 1-on-1 sync with manager was completely demoralizing. He brought up an appraisal rating rumor and hinted at a PIP if numbers do not double.',
    emotion: 'Stressed',
    stressScore: 94,
    topics: ['manager', 'appraisal', 'pip'],
    acousticStrain: 92
  },
  {
    id: 'vent-seed-4',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    transcript: 'In-laws are visiting next week and the expectation to host while managing overtime is suffocating. Family comparisons always trigger so much guilt.',
    emotion: 'Frustrated',
    stressScore: 87,
    topics: ['in-laws', 'family', 'overtime'],
    acousticStrain: 80
  },
  {
    id: 'vent-seed-5',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    transcript: 'Went for a 5km evening run around the park. Feeling relieved and the chest tightness finally eased up after having chai in silence.',
    emotion: 'Relieved',
    stressScore: 24,
    topics: ['running', 'chai'],
    acousticStrain: 18
  },
  {
    id: 'vent-seed-6',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    transcript: 'Landlord called about a 15% rent hike and my salary appraisal has been postponed again. The math just does not work out this month.',
    emotion: 'Stressed',
    stressScore: 91,
    topics: ['rent', 'salary', 'appraisal'],
    acousticStrain: 88
  },
  {
    id: 'vent-seed-7',
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    transcript: 'Another late evening confrontation with manager over deliverables. Demanded I stay online until midnight for an unnecessary client update.',
    emotion: 'Frustrated',
    stressScore: 93,
    topics: ['manager', 'client', 'deadline'],
    acousticStrain: 90
  }
];

const STORAGE_KEY = 'aur_sunao_vent_history';

/**
 * Load all historical vents from localStorage or initialize with seed data
 */
export function getVentHistory(): VentHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_VENTS));
      return DEFAULT_INITIAL_VENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_INITIAL_VENTS;
  } catch (err) {
    console.error('Error loading vent history:', err);
    return DEFAULT_INITIAL_VENTS;
  }
}

/**
 * Append a newly recorded or typed vent to the user's persistent vent history
 */
export function recordVentToHistory(vent: Omit<VentHistoryItem, 'id' | 'timestamp'> & { id?: string; timestamp?: number }): VentHistoryItem[] {
  try {
    const current = getVentHistory();
    const newItem: VentHistoryItem = {
      id: vent.id || `vent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: vent.timestamp || Date.now(),
      transcript: vent.transcript,
      emotion: vent.emotion,
      stressScore: vent.stressScore,
      topics: vent.topics && vent.topics.length > 0 ? vent.topics : extractTopicsFromText(vent.transcript),
      acousticStrain: vent.acousticStrain
    };

    const updated = [newItem, ...current.filter(item => item.id !== newItem.id)].slice(0, 50); // keep up to 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving vent to history:', err);
    return DEFAULT_INITIAL_VENTS;
  }
}

/**
 * Reset vent history back to clean defaults
 */
export function resetVentHistoryToDefaults(): VentHistoryItem[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_VENTS));
    return DEFAULT_INITIAL_VENTS;
  } catch {
    return DEFAULT_INITIAL_VENTS;
  }
}

/**
 * Extract meaningful recurring topics and keywords from text
 */
export function extractTopicsFromText(text: string): string[] {
  if (!text) return [];
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  const tokens = normalized.split(/\s+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));

  const detectedTopics = new Set<string>();

  // Direct check for curated dictionary keys
  Object.keys(TOPIC_METADATA).forEach(topic => {
    if (normalized.includes(topic)) {
      detectedTopics.add(topic);
    }
  });

  // Also include frequent high-signal nouns
  tokens.forEach(token => {
    if (token.length >= 4 && !STOP_WORDS.has(token)) {
      if (['interview', 'meeting', 'commute', 'fatigue', 'colleague', 'burnout', 'expectation', 'marriage'].includes(token)) {
        detectedTopics.add(token);
      }
    }
  });

  return Array.from(detectedTopics);
}

/**
 * Compute topic vs stress correlations across all multiple vents
 */
export function computeTopicStressCorrelations(vents: VentHistoryItem[]): {
  correlations: TopicStressCorrelation[];
  baselineStress: number;
  totalVents: number;
} {
  if (!vents || vents.length === 0) {
    return { correlations: [], baselineStress: 50, totalVents: 0 };
  }

  // Calculate baseline average stress across all vents
  const totalStress = vents.reduce((acc, v) => acc + (v.stressScore || 50), 0);
  const baselineStress = Math.round(totalStress / vents.length);

  // Group vents by topic
  const topicMap: Record<string, { vents: VentHistoryItem[]; scores: number[] }> = {};

  vents.forEach(vent => {
    const topics = vent.topics && vent.topics.length > 0 ? vent.topics : extractTopicsFromText(vent.transcript);
    topics.forEach(topic => {
      const cleanTopic = topic.toLowerCase().trim();
      if (!cleanTopic) return;
      if (!topicMap[cleanTopic]) {
        topicMap[cleanTopic] = { vents: [], scores: [] };
      }
      topicMap[cleanTopic].vents.push(vent);
      topicMap[cleanTopic].scores.push(vent.stressScore || 50);
    });
  });

  const results: TopicStressCorrelation[] = [];

  Object.entries(topicMap).forEach(([topic, data]) => {
    // Only consider recurring topics appearing in at least 2 vents (or 1 if total vents is very small)
    if (data.vents.length < 2 && vents.length >= 4) return;

    const avgStress = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length);
    const delta = avgStress - baselineStress;

    // Determine trend direction across chronological vents (older to newer)
    const sortedChronological = [...data.vents].sort((a, b) => a.timestamp - b.timestamp);
    const recentScores = sortedChronological.map(v => v.stressScore);

    let trend: TopicStressCorrelation['trendDirection'] = 'stable';
    if (recentScores.length >= 2) {
      const half = Math.floor(recentScores.length / 2);
      const earlyAvg = recentScores.slice(0, half).reduce((a, b) => a + b, 0) / half;
      const lateAvg = recentScores.slice(half).reduce((a, b) => a + b, 0) / (recentScores.length - half);

      if (lateAvg - earlyAvg >= 6) {
        trend = 'escalating';
      } else if (lateAvg - earlyAvg <= -6) {
        trend = 'easing';
      } else if (avgStress >= 80) {
        trend = 'consistently_high';
      }
    } else if (avgStress >= 80) {
      trend = 'consistently_high';
    }

    // Risk classification
    let severity: TopicStressCorrelation['riskSeverity'] = 'moderate';
    if (delta >= 25 || avgStress >= 88) {
      severity = 'critical';
    } else if (delta >= 12 || avgStress >= 75) {
      severity = 'elevated';
    } else if (delta <= -15 || avgStress <= 35) {
      severity = 'restorative';
    }

    // Sample quotes
    const quotes = data.vents
      .map(v => v.transcript)
      .filter(Boolean)
      .slice(0, 3);

    const meta = TOPIC_METADATA[topic] || {
      nameHi: topic,
      category: 'life',
      reframeEn: 'Identify what parts of this trigger are within your direct agency vs external noise.',
      reframeHi: 'पहचानें कि इस तनाव का कौन सा हिस्सा आपके नियंत्रण में है और कौन सा सिर्फ बाहरी दबाव।'
    };

    results.push({
      topic,
      topicHi: meta.nameHi,
      category: meta.category,
      occurrenceCount: data.vents.length,
      totalVentsCount: vents.length,
      avgStressScore: avgStress,
      baselineStressScore: baselineStress,
      stressDelta: delta,
      correlationStrength: Math.min(1.0, Math.max(0.1, Math.abs(delta) / 45)),
      trendDirection: trend,
      recentScores,
      sampleQuotes: quotes,
      historicalVentIds: data.vents.map(v => v.id),
      cognitiveReframeEn: meta.reframeEn,
      cognitiveReframeHi: meta.reframeHi,
      riskSeverity: severity
    });
  });

  // Sort by highest stress uplift first
  results.sort((a, b) => b.stressDelta - a.stressDelta);

  return {
    correlations: results,
    baselineStress,
    totalVents: vents.length
  };
}

/**
 * Real-time evaluator: Checks if current voice booth state (spoken text,
 * selected emotion tag, and acoustic metrics) correlates with high-stress recurring topics.
 */
export function evaluateRealtimeStressCorrelation({
  currentText,
  currentEmotion,
  audioMetrics,
  correlations,
  baselineStress,
  lang = 'en'
}: {
  currentText: string;
  currentEmotion: 'Happy' | 'Frustrated' | 'Relieved' | 'Stressed' | null;
  audioMetrics: { rms?: number; pitchTension?: number; jitter?: number } | null;
  correlations: TopicStressCorrelation[];
  baselineStress: number;
  lang?: 'en' | 'hi';
}): CurrentStressAlert {
  // 1. Calculate current estimated stress
  let baseStress = baselineStress || 50;

  if (currentEmotion === 'Stressed') {
    baseStress = 88;
  } else if (currentEmotion === 'Frustrated') {
    baseStress = 82;
  } else if (currentEmotion === 'Relieved') {
    baseStress = 26;
  } else if (currentEmotion === 'Happy') {
    baseStress = 18;
  }

  // Incorporate acoustic strain from live mic if present
  if (audioMetrics) {
    const pitchStrain = (audioMetrics.pitchTension || 0.2) * 100;
    const jitterStrain = (audioMetrics.jitter || 0.15) * 100;
    const acousticBoost = (pitchStrain * 0.6 + jitterStrain * 0.4) * 0.35;
    baseStress = Math.min(98, Math.max(15, Math.round(baseStress * 0.65 + acousticBoost * 0.35)));
  }

  // 2. Detect matching topics in current text
  const currentTokens = extractTopicsFromText(currentText);
  const matchedTopics = correlations.filter(c => currentTokens.includes(c.topic));

  // If no words matched yet, but user has selected Stressed or Frustrated,
  // proactively surface the user's top recurring high-stress trigger topics
  const isHighStressState = currentEmotion === 'Stressed' || currentEmotion === 'Frustrated' || baseStress >= 75;
  const candidateTopics = matchedTopics.length > 0
    ? matchedTopics
    : (isHighStressState ? correlations.filter(c => c.stressDelta >= 15).slice(0, 3) : []);

  const highestCorrelated = candidateTopics.length > 0 ? candidateTopics[0] : null;

  // 3. Determine alert activation and severity
  let isActive = false;
  let severity: CurrentStressAlert['severity'] = 'none';

  if (highestCorrelated && (matchedTopics.length > 0 || isHighStressState)) {
    if (highestCorrelated.avgStressScore >= 85 || highestCorrelated.stressDelta >= 25 || (isHighStressState && matchedTopics.length > 0)) {
      isActive = true;
      severity = 'critical';
    } else if (highestCorrelated.stressDelta >= 12 || isHighStressState) {
      isActive = true;
      severity = 'elevated';
    } else if (highestCorrelated.stressDelta > 0) {
      isActive = true;
      severity = 'moderate';
    }
  }

  if (!isActive) {
    return {
      isActive: false,
      severity: 'none',
      currentEstimatedStress: baseStress,
      baselineStress,
      matchedTopics: [],
      highestCorrelatedTopic: null,
      alertHeadlineEn: 'No Stress Trend Alert',
      alertHeadlineHi: 'कोई तनाव अलर्ट नहीं',
      alertDetailEn: 'Current speech cadence and topics align with your baseline emotional stability.',
      alertDetailHi: 'आपकी वर्तमान आवाज़ और विषय सामान्य भावनात्मक स्तर के अनुरूप हैं।',
      recommendedAnchorEn: 'Continue speaking freely.',
      recommendedAnchorHi: 'बिना किसी संकोच के बोलना जारी रखें।'
    };
  }

  // Build localized headline & detail
  const topicName = lang === 'en' ? highestCorrelated!.topic : highestCorrelated!.topicHi;
  const deltaFormatted = highestCorrelated!.stressDelta >= 0 ? `+${highestCorrelated!.stressDelta}%` : `${highestCorrelated!.stressDelta}%`;

  const headlineEn = matchedTopics.length > 0
    ? `Stress Trend Alert: Recurring Topic "${topicName}" Detected`
    : `High-Stress Pattern: Correlating with Past "${topicName}" Vents`;

  const headlineHi = matchedTopics.length > 0
    ? `तनाव ट्रेंड अलर्ट: बार-बार आने वाला विषय "${topicName}" पाया गया`
    : `उच्च-तनाव पैटर्न: पिछले "${topicName}" सत्रों से सहसंबंध`;

  const detailEn = `Across ${highestCorrelated!.occurrenceCount} previous vents, talking about "${topicName}" pushed your stress level to ${highestCorrelated!.avgStressScore}% (${deltaFormatted} above your ${baselineStress}% baseline).`;
  const detailHi = `पिछले ${highestCorrelated!.occurrenceCount} सत्रों में, "${topicName}" पर बात करते समय आपका तनाव ${highestCorrelated!.avgStressScore}% तक पहुंचा (${baselineStress}% के आधार से ${deltaFormatted} अधिक)।`;

  return {
    isActive: true,
    severity,
    currentEstimatedStress: baseStress,
    baselineStress,
    matchedTopics: candidateTopics,
    highestCorrelatedTopic: highestCorrelated,
    alertHeadlineEn: headlineEn,
    alertHeadlineHi: headlineHi,
    alertDetailEn: detailEn,
    alertDetailHi: detailHi,
    recommendedAnchorEn: highestCorrelated!.cognitiveReframeEn,
    recommendedAnchorHi: highestCorrelated!.cognitiveReframeHi
  };
}
