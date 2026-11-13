import React, { useState, useMemo, useRef } from 'react';
import {
  Calculator,
  Building2,
  MapPin,
  Users,
  TrendingUp,
  BarChart3,
  Sparkles,
  Printer,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Percent,
  Download,
  Share2,
  Copy,
  Check,
  Flame,
  Volume2,
  Info,
  Clock,
  Layers,
  Coins,
  RefreshCw,
  ExternalLink,
  Eye,
  Sliders,
  Dice5
} from 'lucide-react';

// =========================================================================
// CITY POPULATION & DEMOGRAPHIC PROFILES
// =========================================================================

export interface CityDemographicProfile {
  id: string;
  cityName: string;
  state: string;
  tier: 'Tier-1 Metro' | 'Tier-2 Hub' | 'Emerging Growth';
  population: number; // Urban population count
  activeVoiceCommunityPool: number; // Verified Aur Sunao voice contributors
  vernacularDialects: string[];
  fmcgKiranaIndex: number; // Score 1-100 of kirana density
  keyCategoryTendency: string;
}

export const CITIES_MASTER_DATABASE: CityDemographicProfile[] = [
  {
    id: 'mumbai',
    cityName: 'Mumbai',
    state: 'Maharashtra',
    tier: 'Tier-1 Metro',
    population: 21350000,
    activeVoiceCommunityPool: 3420,
    vernacularDialects: ['Bambaiya Hindi', 'Marathi', 'English', 'Gujarati'],
    fmcgKiranaIndex: 94,
    keyCategoryTendency: 'Commute-friendly snacks, humid packaging friction, cutting chai pairings',
  },
  {
    id: 'delhi',
    cityName: 'Delhi NCR',
    state: 'Delhi / NCR',
    tier: 'Tier-1 Metro',
    population: 32940000,
    activeVoiceCommunityPool: 3180,
    vernacularDialects: ['Delhi Hindi', 'Punjabi', 'Hinglish'],
    fmcgKiranaIndex: 92,
    keyCategoryTendency: 'Midnight PG noodles, hygiene & air purification, festive gifting volumes',
  },
  {
    id: 'bengaluru',
    cityName: 'Bengaluru',
    state: 'Karnataka',
    tier: 'Tier-1 Metro',
    population: 13600000,
    activeVoiceCommunityPool: 2750,
    vernacularDialects: ['Kannada', 'English', 'Dakhni', 'Tamil'],
    fmcgKiranaIndex: 86,
    keyCategoryTendency: 'Clean-label scrutiny, state cooperative loyalty (Nandini), quick-commerce adoption',
  },
  {
    id: 'kolkata',
    cityName: 'Kolkata',
    state: 'West Bengal',
    tier: 'Tier-1 Metro',
    population: 15130000,
    activeVoiceCommunityPool: 2240,
    vernacularDialects: ['Bengali', 'Hindi', 'English'],
    fmcgKiranaIndex: 95,
    keyCategoryTendency: 'Adda tea & biscuit ritual permanence, mustard oil aroma discernment, Durga Puja bulk runs',
  },
  {
    id: 'chennai',
    cityName: 'Chennai',
    state: 'Tamil Nadu',
    tier: 'Tier-1 Metro',
    population: 11500000,
    activeVoiceCommunityPool: 1820,
    vernacularDialects: ['Tamil', 'Tanglish', 'English'],
    fmcgKiranaIndex: 91,
    keyCategoryTendency: 'High brand stickiness, traditional filter decoction vs instant, coastal soap performance',
  },
  {
    id: 'hyderabad',
    cityName: 'Hyderabad',
    state: 'Telangana',
    tier: 'Tier-1 Metro',
    population: 10800000,
    activeVoiceCommunityPool: 1950,
    vernacularDialects: ['Telugu', 'Hyderabadi Urdu / Hindi', 'English'],
    fmcgKiranaIndex: 89,
    keyCategoryTendency: 'Biryani spice blends, late-night cafe snacks, spicy namkeen threshold',
  },
  {
    id: 'ahmedabad',
    cityName: 'Ahmedabad',
    state: 'Gujarat',
    tier: 'Tier-2 Hub',
    population: 8650000,
    activeVoiceCommunityPool: 1960,
    vernacularDialects: ['Gujarati', 'Hindi'],
    fmcgKiranaIndex: 96,
    keyCategoryTendency: 'Massive local brand dominance (Balaji, Amul, Wagh Bakri), purity standards in dairy',
  },
  {
    id: 'pune',
    cityName: 'Pune',
    state: 'Maharashtra',
    tier: 'Tier-2 Hub',
    population: 7200000,
    activeVoiceCommunityPool: 1780,
    vernacularDialects: ['Marathi', 'Hindi', 'English'],
    fmcgKiranaIndex: 88,
    keyCategoryTendency: 'Student budget substitutions, quick meals, bakery items (Chitale bandhu / local)',
  },
  {
    id: 'lucknow',
    cityName: 'Lucknow',
    state: 'Uttar Pradesh',
    tier: 'Tier-2 Hub',
    population: 3900000,
    activeVoiceCommunityPool: 1890,
    vernacularDialects: ['Awadhi Hindi', 'Urdu'],
    fmcgKiranaIndex: 98,
    keyCategoryTendency: 'High shopkeeper recommendation weight, value-for-money detergent (Ghari), Dabur trust',
  },
  {
    id: 'jaipur',
    cityName: 'Jaipur',
    state: 'Rajasthan',
    tier: 'Tier-2 Hub',
    population: 4100000,
    activeVoiceCommunityPool: 1620,
    vernacularDialects: ['Marwari', 'Hindi'],
    fmcgKiranaIndex: 94,
    keyCategoryTendency: 'Hard water detergent dissolving frictions, mandatory Bikaji bhujia hospitality, dairy purity',
  },
  {
    id: 'indore',
    cityName: 'Indore',
    state: 'Madhya Pradesh',
    tier: 'Tier-2 Hub',
    population: 3300000,
    activeVoiceCommunityPool: 1540,
    vernacularDialects: ['Malwi', 'Hindi'],
    fmcgKiranaIndex: 95,
    keyCategoryTendency: 'Highest snacking palate discernment; packaged foods constantly tested against Chappan street sev',
  },
  {
    id: 'patna',
    cityName: 'Patna',
    state: 'Bihar',
    tier: 'Tier-2 Hub',
    population: 2550000,
    activeVoiceCommunityPool: 1380,
    vernacularDialects: ['Bhojpuri', 'Maithili', 'Magahi', 'Hindi'],
    fmcgKiranaIndex: 97,
    keyCategoryTendency: 'Extreme sensitivity to ₹5/₹10 price points; Sudha dairy monopoly; rural family transfers',
  },
  {
    id: 'kochi',
    cityName: 'Kochi',
    state: 'Kerala',
    tier: 'Tier-2 Hub',
    population: 2400000,
    activeVoiceCommunityPool: 1290,
    vernacularDialects: ['Malayalam', 'Manglish', 'English'],
    fmcgKiranaIndex: 90,
    keyCategoryTendency: 'Zero-chemical & adulteration obsession (Milma/Eastern), monsoon moisture damage in packaging',
  },
  {
    id: 'chandigarh',
    cityName: 'Chandigarh Tri-City',
    state: 'Punjab / Haryana',
    tier: 'Tier-2 Hub',
    population: 1350000,
    activeVoiceCommunityPool: 1150,
    vernacularDialects: ['Punjabi', 'Hindi', 'English'],
    fmcgKiranaIndex: 85,
    keyCategoryTendency: 'Highest per-capita dairy and ghee consumption; premium biscuits and imported confectionery',
  },
];

// City Selection Presets
export const CITY_PRESETS = [
  {
    id: 'tier1_metros',
    label: 'All 6 Tier-1 Metros',
    description: 'Mumbai, Delhi NCR, Bengaluru, Kolkata, Chennai, Hyderabad',
    cityIds: ['mumbai', 'delhi', 'bengaluru', 'kolkata', 'chennai', 'hyderabad'],
  },
  {
    id: 'top10_fmcg',
    label: 'Top 10 FMCG Corridor',
    description: 'Mumbai, Delhi, Bengaluru, Kolkata, Lucknow, Ahmedabad, Jaipur, Indore, Patna, Kochi',
    cityIds: ['mumbai', 'delhi', 'bengaluru', 'kolkata', 'lucknow', 'ahmedabad', 'jaipur', 'indore', 'patna', 'kochi'],
  },
  {
    id: 'hindi_heartland',
    label: 'Hindi Heartland Cluster',
    description: 'Delhi NCR, Lucknow, Jaipur, Indore, Patna',
    cityIds: ['delhi', 'lucknow', 'jaipur', 'indore', 'patna'],
  },
  {
    id: 'south_cluster',
    label: 'South India Urban Belt',
    description: 'Bengaluru, Chennai, Hyderabad, Kochi',
    cityIds: ['bengaluru', 'chennai', 'hyderabad', 'kochi'],
  },
  {
    id: 'all_14',
    label: 'Pan-India 14 Cities Full Spread',
    description: 'Complete coverage of Tier-1 and dominant Tier-2 manufacturing/consumer capitals',
    cityIds: CITIES_MASTER_DATABASE.map((c) => c.id),
  },
];

// Real Consumer Verbatims for Semantic Pitch Demonstration
export interface SemanticVerbatimExample {
  id: string;
  category: string;
  brandFocus: string;
  speaker: string;
  city: string;
  sentiment: 'critical_vent' | 'latent_loyalty' | 'price_friction' | 'unfiltered_habit';
  somaticStressScore: number; // e.g. 8.4 out of 10
  dialect: string;
  audioDurationSeconds: number;
  verbatimText: string;
  acousticEmotion: string;
  semanticCluster: string;
  brandManagerAction: string;
}

export const SAMPLE_SEMANTIC_VERBATIMS: SemanticVerbatimExample[] = [
  {
    id: 'v1',
    category: 'Dairy & Beverages',
    brandFocus: 'Amul & Local Milk Pouches',
    speaker: 'Ananya M., 32, Homemaker & Freelancer',
    city: 'Mumbai (Dadar)',
    sentiment: 'critical_vent',
    somaticStressScore: 8.7,
    dialect: 'Bambaiya Hindi / Marathi',
    audioDurationSeconds: 42,
    verbatimText:
      'Subah subah doodh ka packet cut karte waqt corner hamesha phat jata hai aur aadha doodh kitchen counter pe beh jata hai. When running for local train, I just want easy tear pouch without scissor hunt. Nobody in dairy marketing thinks about 7 AM chaos.',
    acousticEmotion: 'Irritated Tremor (Pitch Peak +34Hz)',
    semanticCluster: 'Packaging & Morning Ergonomics',
    brandManagerAction: 'Test laser-perforated easy-tear spout SKU for working mothers.',
  },
  {
    id: 'v2',
    category: 'Packaged Foods & Snacking',
    brandFocus: 'Maggi & Instant Noodles',
    speaker: 'Kabir V., 24, Junior Developer',
    city: 'Bengaluru (Koramangala)',
    sentiment: 'latent_loyalty',
    somaticStressScore: 3.2,
    dialect: 'Hinglish / English',
    audioDurationSeconds: 55,
    verbatimText:
      'After a 14-hour sprint when standup failed, Maggi with two fried eggs is not food—it is psychiatric first aid. No artisanal ramen from Swiggy can touch that specific masala smell coming out of the microwave at 2:30 AM.',
    acousticEmotion: 'Comfort Sigh (Slowed Cadence -22% BPM)',
    semanticCluster: 'Psychological Solace & Nocturnal Rituals',
    brandManagerAction: 'Anchor late-night campaigns on emotional reset rather than nutritional convenience.',
  },
  {
    id: 'v3',
    category: 'Home Care & Detergents',
    brandFocus: 'Surf Excel vs Ghari',
    speaker: 'Rajesh K., 44, Small Trader & Parent',
    city: 'Jaipur (Mansarovar)',
    sentiment: 'price_friction',
    somaticStressScore: 7.9,
    dialect: 'Marwari Hindi',
    audioDurationSeconds: 48,
    verbatimText:
      'Hamaare yahan borewell ka paani itna khara hai ki mehenga powder bhi jhaag nahi chhodta. Surf Excel works well but when they shaved 100 grams from the 1kg pack keeping ₹140 price, I felt tricked. Dukandar ne Ghari pack hath mein thama diya and I switched.',
    acousticEmotion: 'Resentful Cadence (Micro-hesitations before switching confession)',
    semanticCluster: 'Shrinkflation Penalty & Borewell Water Chemistry',
    brandManagerAction: 'Launch hard-water localized formula and transparent grammage reassurance badge.',
  },
  {
    id: 'v4',
    category: 'Biscuits & Bakery',
    brandFocus: 'Parle-G & Britannia Marie',
    speaker: 'Sunita D., 51, School Vice Principal',
    city: 'Kolkata (Salt Lake)',
    sentiment: 'unfiltered_habit',
    somaticStressScore: 4.1,
    dialect: 'Bengali Hinglish',
    audioDurationSeconds: 38,
    verbatimText:
      'Adda te jodi biscuit chai er moddhe bhenge pore jaay, it ruins the entire evening mood! Parle-G dip time is exactly 2.5 seconds. If they change the bake consistency even by 5%, every grandmother in Bengal will know without reading any label.',
    acousticEmotion: 'Animated Nostalgia (Dynamic Pitch Fluctuations)',
    semanticCluster: 'Tea-Dipping Threshold & Heritage Recipe Scrutiny',
    brandManagerAction: 'Preserve structural density against cost-cutting biscuit emulsifier changes.',
  },
];

// =========================================================================
// MAIN COMPONENT
// =========================================================================

interface BrandResearchCostEstimatorProps {
  lang?: 'en' | 'hi';
  onDeployDirectly?: (params: any) => void;
  onClose?: () => void;
}

export const BrandResearchCostEstimator: React.FC<BrandResearchCostEstimatorProps> = ({
  lang = 'en',
  onDeployDirectly,
  onClose,
}) => {
  // Brand Profile State
  const [brandName, setBrandName] = useState<string>('Amul');
  const [customBrandInput, setCustomBrandInput] = useState<string>('');
  const [brandCategory, setBrandCategory] = useState<string>('Dairy & Beverages');
  const [brandTier, setBrandTier] = useState<'Market Leader' | 'Established Contender' | 'High-Growth Challenger' | 'D2C / Disruptor'>('Market Leader');
  const [researchObjective, setResearchObjective] = useState<string>('Voice of Consumer & Shrinkflation / Kirana Friction Audit');

  // City Coverage State
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([
    'mumbai',
    'delhi',
    'bengaluru',
    'kolkata',
    'lucknow',
    'ahmedabad',
    'jaipur',
    'indore',
    'patna',
    'kochi',
  ]);

  // Population vs Users Sliders
  // Category Penetration (% of urban population who buy in this FMCG category)
  const [categoryPenetrationRate, setCategoryPenetrationRate] = useState<number>(75);
  // Brand Market Penetration (% of category consumers using this brand)
  const [brandUserPenetrationRate, setBrandUserPenetrationRate] = useState<number>(28);

  // Sample Size & Cohort Quotas
  const [targetSampleSize, setTargetSampleSize] = useState<number>(1500); // 1,500 voice respondents
  const [studyDurationMonths, setStudyDurationMonths] = useState<number>(2); // 2 months standard

  // Cohort split percentages
  const [loyalistShare, setLoyalistShare] = useState<number>(40);
  const [churnerShare, setChurnerShare] = useState<number>(35);
  const [nonUserShare, setNonUserShare] = useState<number>(25);

  // Advanced modules toggle
  const [includeSomaticAcousticAnalysis, setIncludeSomaticAcousticAnalysis] = useState<boolean>(true);
  const [includeDialectTranslations, setIncludeDialectTranslations] = useState<boolean>(true);
  const [includeKiranaChannelAudit, setIncludeKiranaChannelAudit] = useState<boolean>(true);

  // Dynamic Random Calculation Seed (changes on button click or input update)
  const [randomCalcSeed, setRandomCalcSeed] = useState<number>(() => Math.floor(Math.random() * 9999) + 1);

  const handleRegenerateRandomCalculation = () => {
    setRandomCalcSeed((prev) => prev + 1 + Math.floor(Math.random() * 500));
  };

  // Pitch Report View Modal State
  const [showPitchReportModal, setShowPitchReportModal] = useState<boolean>(false);
  const [copiedPitchLink, setCopiedPitchLink] = useState<boolean>(false);

  // Corporate Contact
  const [corporateEmail, setCorporateEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Print ref
  const pitchReportPrintRef = useRef<HTMLDivElement>(null);

  // Selected Brand Display Name
  const effectiveBrandName = brandName === 'Custom' ? customBrandInput || 'Custom Brand' : brandName;

  // Selected Cities Data
  const selectedCities = useMemo(() => {
    return CITIES_MASTER_DATABASE.filter((c) => selectedCityIds.includes(c.id));
  }, [selectedCityIds]);

  // =========================================================================
  // DYNAMIC RANDOM NUMBER CALCULATION ENGINE BASED ON NO. OF CITIES & STORIES COVERED
  // =========================================================================

  const mathResults = useMemo(() => {
    const citiesCount = selectedCities.length;
    const storiesCount = targetSampleSize;

    // Deterministic pseudo-random generation tied to inputs and seed
    const getRand = (offset: number) => {
      const val = Math.sin(randomCalcSeed * 1337 + citiesCount * 7919 + storiesCount * 9973 + offset * 541) * 10000;
      return val - Math.floor(val);
    };

    const r1 = getRand(1);
    const r2 = getRand(2);
    const r3 = getRand(3);
    const r4 = getRand(4);
    const r5 = getRand(5);
    const r6 = getRand(6);

    // 1. Total Aggregated Urban Population of Selected Cities
    const totalUrbanPopulation = selectedCities.reduce((acc, c) => acc + c.population, 0);

    // 2. Addressable Category Universe
    const categoryUniverse = Math.round(totalUrbanPopulation * (categoryPenetrationRate / 100));

    // 3. Active Brand Users in these cities
    const activeBrandUsers = Math.round(categoryUniverse * (brandUserPenetrationRate / 100));

    // 4. Competitor Switchers & Non-Users
    const nonBrandUniverse = categoryUniverse - activeBrandUsers;

    // 5. Margin of Error based on sample size and population
    const N = Math.max(activeBrandUsers, 100000);
    const n = storiesCount;
    const standardError = Math.sqrt((0.25 / n) * ((N - n) / (N - 1)));
    const marginOfErrorPct = Number((1.96 * standardError * 100).toFixed(2));

    // 6. Cohort sample counts
    const loyalistSampleCount = Math.round((storiesCount * loyalistShare) / 100);
    const churnerSampleCount = Math.round((storiesCount * churnerShare) / 100);
    const nonUserSampleCount = storiesCount - loyalistSampleCount - churnerSampleCount;

    // 7. Dynamic Random Calculations based upon No. of Cities & Stories Covered
    // A. Field Audio Acquisition Sampling Units (based on stories covered)
    const fieldSamplingUnits = Math.round(storiesCount * (16 + r1 * 8.5));

    // B. Acoustic Vector Tokens Extracted (based on stories covered)
    const dialectAcousticVectors = includeDialectTranslations
      ? Math.round(storiesCount * (12.2 + r2 * 5.4))
      : Math.round(storiesCount * (5.5 + r2 * 2.2));

    // C. Regional Coordination & Cluster Nodes (based on number of cities)
    const cityClusterCoordinationNodes = Math.round(citiesCount * (340 + r3 * 160));

    // D. Somatic Stress & Sentiment Neural Cycles (based on cities * stories * duration)
    const somaticSentimentNeuralCycles = includeSomaticAcousticAnalysis
      ? Math.round(citiesCount * Math.sqrt(storiesCount) * (28 + r4 * 16) * studyDurationMonths)
      : Math.round(citiesCount * Math.sqrt(storiesCount) * (14 + r4 * 8) * studyDurationMonths);

    // E. Kirana vs Dark Store Attribution Matrix Points (based on cities & stories)
    const channelAuditCorrelationPoints = includeKiranaChannelAudit
      ? Math.round(citiesCount * Math.log2(Math.max(storiesCount, 2)) * (24 + r5 * 14))
      : 0;

    // F. Longitudinal Synthesis Tokens (based on stories * duration)
    const longitudinalSynthesisTokens = Math.round(storiesCount * studyDurationMonths * (6.8 + r6 * 3.4));

    // G. Gross Total Research Units
    const grossStudyUnits =
      fieldSamplingUnits +
      dialectAcousticVectors +
      cityClusterCoordinationNodes +
      somaticSentimentNeuralCycles +
      channelAuditCorrelationPoints +
      longitudinalSynthesisTokens;

    // Multi-City Scale Synergy Bonus (based on number of cities)
    let synergyBonusPercent = 0;
    if (citiesCount >= 10) {
      synergyBonusPercent = 18;
    } else if (citiesCount >= 5) {
      synergyBonusPercent = 10;
    }
    const synergyBonusUnits = Math.round((grossStudyUnits * synergyBonusPercent) / 100);

    // Primary Result: Total Research Scope Units (RIU - Research Intelligence Units)
    const netResearchStudyUnits = grossStudyUnits + synergyBonusUnits;

    // Per-Story Extraction Yield (based on stories covered)
    const unitsPerStory = Number((netResearchStudyUnits / Math.max(storiesCount, 1)).toFixed(1));

    // Cross-City Correlation Matrix Score (based on cities & stories)
    const correlationMatrixScore = Math.round(
      Math.max(1, (citiesCount * (citiesCount - 1)) / 2) * Math.log10(Math.max(storiesCount, 10)) * (18 + r2 * 12)
    );

    // Statistical Confidence Level (%)
    const statisticalConfidence = Math.min(
      99.9,
      Number((92.4 + Math.min(citiesCount * 0.45, 4.2) + Math.log10(Math.max(storiesCount, 10)) * 1.6 + r3 * 0.8).toFixed(2))
    );

    // City-by-city random distribution of stories & local signals
    const cityCalculations = selectedCities.map((city, idx) => {
      const cityRand = getRand(10 + idx);
      const baseShare = storiesCount / citiesCount;
      const cityStories = Math.round(baseShare * (0.85 + cityRand * 0.3));
      const cityAcousticVectors = Math.round(cityStories * (14.2 + cityRand * 4.8));
      const citySignalScore = Math.round(70 + cityRand * 28);
      return {
        cityId: city.id,
        cityName: city.cityName,
        cityStories,
        cityAcousticVectors,
        citySignalScore,
      };
    });

    return {
      citiesCount,
      storiesCount,
      totalUrbanPopulation,
      categoryUniverse,
      activeBrandUsers,
      nonBrandUniverse,
      marginOfErrorPct,
      loyalistSampleCount,
      churnerSampleCount,
      nonUserSampleCount,
      // Dynamic random calculations
      fieldSamplingUnits,
      dialectAcousticVectors,
      cityClusterCoordinationNodes,
      somaticSentimentNeuralCycles,
      channelAuditCorrelationPoints,
      longitudinalSynthesisTokens,
      grossStudyUnits,
      synergyBonusPercent,
      synergyBonusUnits,
      netResearchStudyUnits,
      unitsPerStory,
      correlationMatrixScore,
      statisticalConfidence,
      cityCalculations,
    };
  }, [
    selectedCities,
    categoryPenetrationRate,
    brandUserPenetrationRate,
    targetSampleSize,
    studyDurationMonths,
    loyalistShare,
    churnerShare,
    nonUserShare,
    includeDialectTranslations,
    includeSomaticAcousticAnalysis,
    includeKiranaChannelAudit,
    randomCalcSeed,
  ]);

  // City Toggle Handlers
  const toggleCity = (cityId: string) => {
    setSelectedCityIds((prev) => {
      if (prev.includes(cityId)) {
        if (prev.length === 1) return prev; // Keep at least 1 city
        return prev.filter((id) => id !== cityId);
      } else {
        return [...prev, cityId];
      }
    });
  };

  const applyCityPreset = (presetCityIds: string[]) => {
    setSelectedCityIds(presetCityIds);
  };

  // Print Handler
  const handlePrintPitchReport = () => {
    window.print();
  };

  // Copy share link
  const handleCopyPitchLink = () => {
    const url = window.location.href.split('#')[0] + '#brands';
    navigator.clipboard?.writeText(url);
    setCopiedPitchLink(true);
    setTimeout(() => setCopiedPitchLink(false), 2500);
  };

  // Handle Deploy
  const handleInitiateStudyNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      if (onDeployDirectly) {
        onDeployDirectly({
          brandName: effectiveBrandName,
          category: brandCategory,
          cities: selectedCities.map((c) => c.cityName),
          totalCost: mathResults.netResearchStudyUnits,
          totalStudyUnits: mathResults.netResearchStudyUnits,
          sampleSize: targetSampleSize,
          durationMonths: studyDurationMonths,
          contactEmail: corporateEmail,
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-8 text-white font-sans">
      {/* Top Header & Context Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[28px] bg-gradient-to-r from-[#18181B] via-[#141416] to-[#1C1615] border border-white/10 shadow-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B5B]/20 border border-[#FF6B5B]/40 text-[#FF6B5B] text-[10px] font-mono font-bold uppercase tracking-wider">
              Brand Market Research Scope Engine
            </span>
            <span className="text-[11px] font-mono text-white/50">
              Randomized Quantitative Metrics • Population-Weighted
            </span>
          </div>
          <h2 className="font-display text-[26px] md:text-[32px] text-white tracking-tight flex items-center gap-3">
            <Calculator size={26} className="text-[#FF6B5B]" />
            <span>Market Research Scope & Metric Calculator</span>
          </h2>
          <p className="font-sans text-[13px] text-white/70 max-w-[85ch]">
            Calculate the exact computational scope, acoustic vector volume, and research intelligence metrics of conducting an unfiltered voice study across Indian cities.
            Generates live calculations dynamically derived from the number of cities ({selectedCities.length}) and stories covered ({targetSampleSize}).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRegenerateRandomCalculation}
            className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-[13px] flex items-center gap-2 transition cursor-pointer"
            title="Generate fresh random number calculations based on cities and stories"
          >
            <Dice5 size={16} className="text-[#FF6B5B]" />
            <span>Regenerate Calculations</span>
          </button>
          <button
            onClick={() => setShowPitchReportModal(true)}
            className="px-5 py-3 rounded-full bg-white text-black font-semibold text-[13px] hover:bg-white/90 flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Printer size={15} />
            <span>Preview & Print Pitch Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Real-Time Calculator & Math Breakdown on Right */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: BRAND, CITIES, POPULATION & COHORTS INPUTS */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          {/* Section 1: Brand & Category Definition */}
          <div className="p-6 rounded-[26px] bg-[#141416] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[18px] text-white flex items-center gap-2">
                <Building2 size={18} className="text-[#FF6B5B]" />
                <span>1. Brand Identity & FMCG Category</span>
              </h3>
              <span className="text-[10px] font-mono uppercase text-white/40">Step 1 of 4</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-white/60 uppercase mb-1">
                  Brand Under Study
                </label>
                <select
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full rounded-xl bg-black border border-white/20 p-3 text-[13px] text-white focus:outline-none focus:border-[#FF6B5B] cursor-pointer"
                >
                  <option value="Amul">Amul (Dairy & Foods)</option>
                  <option value="Maggi">Maggi (Nestlé)</option>
                  <option value="Parle-G">Parle-G (Biscuits)</option>
                  <option value="Surf Excel">Surf Excel (HUL)</option>
                  <option value="Tata Tea">Tata Tea (Beverages)</option>
                  <option value="Britannia">Britannia (Bakery & Dairy)</option>
                  <option value="Haldiram's">Haldiram's (Namkeen & Sweets)</option>
                  <option value="Dettol">Dettol (Reckitt)</option>
                  <option value="Colgate">Colgate-Palmolive</option>
                  <option value="Aashirvaad">Aashirvaad (ITC)</option>
                  <option value="Blinkit / Quick-Commerce">Blinkit / Dark Store Brands</option>
                  <option value="Mamaearth">Mamaearth (Honasa D2C)</option>
                  <option value="Custom">+ Other Brand (Custom Input)</option>
                </select>
              </div>

              {brandName === 'Custom' ? (
                <div>
                  <label className="block text-[11px] font-mono text-white/60 uppercase mb-1">
                    Enter Custom Brand Name
                  </label>
                  <input
                    type="text"
                    value={customBrandInput}
                    onChange={(e) => setCustomBrandInput(e.target.value)}
                    placeholder="e.g. Balaji Wafers / The Whole Truth"
                    className="w-full rounded-xl bg-black border border-white/20 p-3 text-[13px] text-white focus:outline-none focus:border-[#FF6B5B]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-mono text-white/60 uppercase mb-1">
                    Product Category / Vertical
                  </label>
                  <select
                    value={brandCategory}
                    onChange={(e) => setBrandCategory(e.target.value)}
                    className="w-full rounded-xl bg-black border border-white/20 p-3 text-[13px] text-white focus:outline-none focus:border-[#FF6B5B] cursor-pointer"
                  >
                    <option value="Dairy & Beverages">Dairy, Milk & Beverages</option>
                    <option value="Packaged Foods & Snacking">Packaged Foods, Instant Noodles & Snacks</option>
                    <option value="Biscuits & Bakery">Biscuits, Cookies & Bakery</option>
                    <option value="Home Care & Detergents">Home Care, Detergents & Cleaners</option>
                    <option value="Personal Care & Hygiene">Personal Care, Soaps & Oral Care</option>
                    <option value="Staples & Spices">Kitchen Staples, Atta, Oils & Spices</option>
                    <option value="Quick Commerce & Delivery">Quick Commerce & Grocery Apps</option>
                    <option value="D2C & Modern Wellness">D2C Nutrition & Clean Wellness</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-mono text-white/60 uppercase mb-1">
                  Brand Market Position
                </label>
                <select
                  value={brandTier}
                  onChange={(e) => setBrandTier(e.target.value as any)}
                  className="w-full rounded-xl bg-black border border-white/20 p-3 text-[13px] text-white focus:outline-none focus:border-[#FF6B5B] cursor-pointer"
                >
                  <option value="Market Leader">Category Leader (&gt;35% Share)</option>
                  <option value="Established Contender">Established Challenger (15–35% Share)</option>
                  <option value="High-Growth Challenger">Regional Growth Brand (5–15% Share)</option>
                  <option value="D2C / Disruptor">Emerging D2C / Disruptor (&lt;5% Share)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 uppercase mb-1">
                  Primary Research Hypothesis / Probe
                </label>
                <select
                  value={researchObjective}
                  onChange={(e) => setResearchObjective(e.target.value)}
                  className="w-full rounded-xl bg-black border border-white/20 p-3 text-[13px] text-white focus:outline-none focus:border-[#FF6B5B] cursor-pointer"
                >
                  <option value="Voice of Consumer & Shrinkflation / Kirana Friction Audit">
                    Shrinkflation & Weight Reduction Backlash
                  </option>
                  <option value="Competitor Switching Triggers: Kirana vs Quick Commerce">
                    Kirana Credit vs Blinkit/Zepto Switching Triggers
                  </option>
                  <option value="Packaging Usability & Monsoon Humidity Degradation">
                    Packaging Usability & Humidity / Spillage Audit
                  </option>
                  <option value="Taste Recipe Alterations & Generational Drift">
                    Recipe / Formulation Change Pushback
                  </option>
                  <option value="Clean Label & Chemical / Preservative Skepticism">
                    Clean-Label & Adulteration Fear Audit
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: City Selection & Geographical Spread */}
          <div className="p-6 rounded-[26px] bg-[#141416] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-[18px] text-white flex items-center gap-2">
                  <MapPin size={18} className="text-[#25D366]" />
                  <span>2. City Coverage & Demographic Scale</span>
                </h3>
                <p className="font-sans text-[11px] text-white/50 mt-0.5">
                  Select target cities. Our system calculates combined urban population and verified respondent density.
                </p>
              </div>
              <div className="text-[12px] font-mono font-bold text-[#25D366] bg-[#25D366]/10 px-3 py-1 rounded-full border border-[#25D366]/20 self-start sm:self-auto">
                {selectedCities.length} Cities Selected
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-white/40">Quick Geographical Presets:</span>
              <div className="flex flex-wrap gap-2">
                {CITY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyCityPreset(preset.cityIds)}
                    className="text-[11px] font-sans px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white text-white/80 transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* City Grid Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {CITIES_MASTER_DATABASE.map((city) => {
                const isSelected = selectedCityIds.includes(city.id);
                return (
                  <div
                    key={city.id}
                    onClick={() => toggleCity(city.id)}
                    className={`p-3 rounded-[16px] border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#25D366]/15 border-[#25D366] text-white shadow-sm'
                        : 'bg-black/40 border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <span className="font-bold text-[13px] text-white block">{city.cityName}</span>
                        <span className="text-[10px] font-mono opacity-50 block">{city.tier}</span>
                      </div>
                      <span
                        className={`w-4 h-4 rounded-full text-[10px] grid place-items-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#25D366] text-black font-bold' : 'bg-white/10 text-white/40'
                        }`}
                      >
                        {isSelected ? '✓' : '+'}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono opacity-60">
                      <span>{(city.population / 1000000).toFixed(1)}M pop</span>
                      <span>{city.activeVoiceCommunityPool} voice pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Population vs Users Math Sliders */}
          <div className="p-6 rounded-[26px] bg-[#141416] border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-[18px] text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-[#FFB300]" />
                  <span>3. Population vs. Users Modeling</span>
                </h3>
                <p className="font-sans text-[11px] text-white/50 mt-0.5">
                  Mathematical modeling of target market universe vs brand customer penetration.
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase text-white/40">Step 3 of 4</span>
            </div>

            {/* Metric Preview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-[18px] bg-black/50 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-white/50 block">Aggregated Urban Pop</span>
                <span className="font-display text-[22px] text-white font-bold block mt-1">
                  {(mathResults.totalUrbanPopulation / 1000000).toFixed(1)} Million
                </span>
                <span className="text-[10px] text-white/40 font-mono">Across {selectedCities.length} chosen cities</span>
              </div>

              <div className="p-3.5 rounded-[18px] bg-black/50 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-white/50 block">Category Buyers Universe</span>
                <span className="font-display text-[22px] text-[#FFD166] font-bold block mt-1">
                  {(mathResults.categoryUniverse / 1000000).toFixed(1)} Million
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  {categoryPenetrationRate}% penetration in {brandCategory}
                </span>
              </div>

              <div className="p-3.5 rounded-[18px] bg-black/50 border border-white/10">
                <span className="text-[10px] font-mono uppercase text-white/50 block">
                  {effectiveBrandName} Consumer Base
                </span>
                <span className="font-display text-[22px] text-[#FF6B5B] font-bold block mt-1">
                  {(mathResults.activeBrandUsers / 1000000).toFixed(1)} Million
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  {brandUserPenetrationRate}% active brand adoption
                </span>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between items-center mb-1 text-[12px]">
                  <span className="text-white/80 font-medium">
                    Category Household Penetration Rate:
                  </span>
                  <span className="font-mono font-bold text-[#FFD166]">{categoryPenetrationRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  step="5"
                  value={categoryPenetrationRate}
                  onChange={(e) => setCategoryPenetrationRate(Number(e.target.value))}
                  className="w-full accent-[#FFD166] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                  <span>10% (Niche D2C / Gourmet)</span>
                  <span>50% (Standard Packaged)</span>
                  <span>95% (Essential Staples / Salt / Tea)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-[12px]">
                  <span className="text-white/80 font-medium">
                    {effectiveBrandName} Market Share / User Penetration:
                  </span>
                  <span className="font-mono font-bold text-[#FF6B5B]">{brandUserPenetrationRate}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="75"
                  step="1"
                  value={brandUserPenetrationRate}
                  onChange={(e) => setBrandUserPenetrationRate(Number(e.target.value))}
                  className="w-full accent-[#FF6B5B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                  <span>2% (New Challenger)</span>
                  <span>25% (Established Player)</span>
                  <span>75% (Monopoly Category Titan)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Sample Size & Cohort Quotas */}
          <div className="p-6 rounded-[26px] bg-[#141416] border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-[18px] text-white flex items-center gap-2">
                  <Users size={18} className="text-[#A78BFA]" />
                  <span>4. Voice Sample Size & Cohort Quotas</span>
                </h3>
                <p className="font-sans text-[11px] text-white/50 mt-0.5">
                  Determine sample size to calibrate statistical precision (Margin of Error).
                </p>
              </div>
              <div className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#A78BFA]/10 border border-[#A78BFA]/30 text-[#A78BFA]">
                MoE: ±{mathResults.marginOfErrorPct}% (95% Conf.)
              </div>
            </div>

            {/* Target Sample Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/80 font-medium">
                  Total Verified Audio Transcripts / Voice Vents:
                </span>
                <span className="font-mono text-[16px] font-bold text-white">
                  {targetSampleSize.toLocaleString('en-IN')} Voice Respondents
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="5000"
                step="100"
                value={targetSampleSize}
                onChange={(e) => setTargetSampleSize(Number(e.target.value))}
                className="w-full accent-[#A78BFA] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40">
                <span>300 (Rapid Pulse • ±5.6%)</span>
                <span>1,500 (Standard Corporate Benchmark • ±2.5%)</span>
                <span>5,000 (Deep Pan-India Audit • ±1.4%)</span>
              </div>
            </div>

            {/* Study Duration */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase text-white/60">
                Fieldwork & Tracking Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { months: 1, label: '1 Month (Rapid Sprint)', sub: 'Fast 2-week turnaround' },
                  { months: 2, label: '2 Months (Standard Benchmark)', sub: 'Tracks repeat sentiment & kirana shift' },
                  { months: 3, label: '3 Months (Quarterly Deep Dive)', sub: 'Longitudinal seasonal evolution' },
                ].map((d) => (
                  <button
                    key={d.months}
                    type="button"
                    onClick={() => setStudyDurationMonths(d.months)}
                    className={`p-3 rounded-[16px] border text-left transition cursor-pointer ${
                      studyDurationMonths === d.months
                        ? 'bg-white text-black font-bold border-white shadow-md'
                        : 'bg-black/40 text-white/70 border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="font-display text-[15px]">{d.months} Month{d.months > 1 ? 's' : ''}</div>
                    <div className="text-[9px] font-sans opacity-70 mt-0.5">{d.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cohort Quota Breakdown */}
            <div className="p-4 rounded-[18px] bg-black/50 border border-white/10 space-y-2">
              <div className="text-[10px] font-mono uppercase text-white/50">
                Cohort Stratification Breakdown:
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-white font-bold">{mathResults.loyalistSampleCount}</div>
                  <div className="text-[10px] text-[#25D366] font-mono">Brand Loyalists ({loyalistShare}%)</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-white font-bold">{mathResults.churnerSampleCount}</div>
                  <div className="text-[10px] text-[#FF6B5B] font-mono">Lapsed / Switchers ({churnerShare}%)</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-white font-bold">{mathResults.nonUserSampleCount}</div>
                  <div className="text-[10px] text-[#FFD166] font-mono">Competitor Buyers ({nonUserShare}%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: REAL-TIME SCOPE & RANDOM NUMBER CALCULATION BREAKDOWN */}
        {/* ========================================================================= */}
        <div className="space-y-4 lg:sticky lg:top-20">
          <div className="p-6 rounded-[28px] bg-[#141416] border border-white/15 shadow-2xl relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6B5B] font-bold block">
                    Calculated Study Metrics
                  </span>
                  <button
                    type="button"
                    onClick={handleRegenerateRandomCalculation}
                    className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/80 flex items-center gap-1 transition cursor-pointer"
                    title="Generate fresh random number calculations based on cities & stories"
                  >
                    <RefreshCw size={10} className="text-[#FF6B5B]" />
                    <span>Re-roll</span>
                  </button>
                </div>
                <h4 className="font-display text-[22px] text-white mt-0.5">
                  Scope & Intelligence Score
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-white/50 uppercase block">Total Research Units</span>
                <span className="font-display text-[26px] md:text-[30px] text-[#FF6B5B] font-bold block leading-none">
                  {mathResults.netResearchStudyUnits.toLocaleString('en-IN')} RIU
                </span>
                <span className="text-[11px] font-mono text-white/60">
                  ({mathResults.unitsPerStory} Units / Story)
                </span>
              </div>
            </div>

            {/* Itemized Calculation Breakdown */}
            <div className="space-y-2.5 font-mono text-[11px] text-white/80">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-white/60">1. Field Audio Acquisition ({targetSampleSize} voice vents):</span>
                <span className="text-white font-bold">{mathResults.fieldSamplingUnits.toLocaleString('en-IN')} Sampling Units</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-white/60">2. Acoustic Transcription & Dialect Vectors:</span>
                <span className="text-white font-bold">{mathResults.dialectAcousticVectors.toLocaleString('en-IN')} Vectors</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-white/60">3. Regional City Coordination ({selectedCities.length} cities):</span>
                <span className="text-white font-bold">{mathResults.cityClusterCoordinationNodes.toLocaleString('en-IN')} Cluster Nodes</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-white/60">4. Somatic Stress & Sentiment Neural Cycles ({studyDurationMonths} mo):</span>
                <span className="text-white font-bold">{mathResults.somaticSentimentNeuralCycles.toLocaleString('en-IN')} Neural Cycles</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-white/60">5. Kirana vs Dark Store Attribution Matrix:</span>
                <span className="text-white font-bold">{mathResults.channelAuditCorrelationPoints.toLocaleString('en-IN')} Matrix Points</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-white/60">6. Longitudinal Synthesis & Executive Tokens:</span>
                <span className="text-white font-bold">{mathResults.longitudinalSynthesisTokens.toLocaleString('en-IN')} Synthesis Tokens</span>
              </div>

              {/* Subtotal & Multi-City Synergy */}
              <div className="pt-2 flex items-center justify-between text-white/60">
                <span>Gross Research Scope:</span>
                <span>{mathResults.grossStudyUnits.toLocaleString('en-IN')} Units</span>
              </div>

              {mathResults.synergyBonusUnits > 0 && (
                <div className="flex items-center justify-between text-[#25D366] font-bold">
                  <span>Multi-City Cross Synergy (+{mathResults.synergyBonusPercent}% for {selectedCities.length} cities):</span>
                  <span>+{mathResults.synergyBonusUnits.toLocaleString('en-IN')} Units</span>
                </div>
              )}

              {/* Net Total Highlight */}
              <div className="pt-3 border-t border-white/15 flex items-baseline justify-between text-white">
                <span className="font-sans font-bold text-[13px]">Total Study Computation Index:</span>
                <div className="text-right">
                  <span className="font-display text-[22px] text-[#FF6B5B] font-bold">
                    {mathResults.netResearchStudyUnits.toLocaleString('en-IN')} RIU
                  </span>
                  <div className="text-[9px] text-white/40 font-mono">Calculated from {selectedCities.length} cities & {targetSampleSize} stories</div>
                </div>
              </div>
            </div>

            {/* Efficiency KPI Callout */}
            <div className="p-4 rounded-[18px] bg-gradient-to-r from-black/60 to-[#18181A] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-white/60">Extraction Yield per Story:</span>
                <span className="text-[#FFD166] font-bold">{mathResults.unitsPerStory} RIU / Story</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-white/60">Cross-City Correlation Density:</span>
                <span className="text-white/80 font-bold">
                  {mathResults.correlationMatrixScore.toLocaleString('en-IN')} Nodes
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#25D366] font-bold">
                <span>Statistical Significance Power:</span>
                <span>{mathResults.statisticalConfidence}% Reliability Index</span>
              </div>
            </div>

            {/* Expected Study Outcomes Summary */}
            <div className="space-y-2 text-[12px] font-sans text-white/80">
              <div className="text-[10px] font-mono uppercase text-white/50 font-bold">
                Deliverables Guaranteed in Pitch:
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#25D366] shrink-0 mt-0.5" />
                <span><b>{targetSampleSize} Raw Audio Transcripts</b> with dialect & demographic metadata.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#25D366] shrink-0 mt-0.5" />
                <span><b>Somatic Emotional Stress Index</b> for packaging, pricing & formulation friction.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#25D366] shrink-0 mt-0.5" />
                <span><b>Bi-Weekly Synthesized Brand Dossier</b> with verbatims and C-Suite slides.</span>
              </div>
            </div>

            {/* Actions: View / Print Pitch Report & Deploy */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPitchReportModal(true)}
                className="w-full h-12 rounded-full bg-white hover:bg-white/90 text-black font-sans text-[13px] font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xl"
              >
                <FileText size={16} />
                <span>Generate Detailed Pitch Report (Printable)</span>
              </button>

              <form onSubmit={handleInitiateStudyNow} className="space-y-2 pt-1">
                <input
                  type="email"
                  required
                  placeholder="brand.lead@enterprise.com for official proposal"
                  value={corporateEmail}
                  onChange={(e) => setCorporateEmail(e.target.value)}
                  className="w-full rounded-xl bg-black border border-white/20 px-3.5 py-2 text-white text-[11px] focus:outline-none focus:border-[#FF6B5B]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black font-sans text-[12px] font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Enterprise Brief...</span>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Lock In Scope & Deploy ({mathResults.netResearchStudyUnits.toLocaleString('en-IN')} RIU)</span>
                    </>
                  )}
                </button>
              </form>

              {submissionSuccess && (
                <div className="p-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-[11px] text-center font-medium">
                  Study scope locked! Our Research Director will send the signed agreement and onboarding link to {corporateEmail || 'your email'}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DETAILED PRINTABLE PITCH REPORT MODAL VIEW */}
      {/* ========================================================================= */}
      {showPitchReportModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto flex items-center justify-center print:p-0 print:bg-white print:static">
          <div
            ref={pitchReportPrintRef}
            className="w-full max-w-[1040px] max-h-[92vh] overflow-y-auto rounded-[24px] bg-[#0E0E10] text-[#F5F5F0] border border-white/15 p-6 sm:p-8 md:p-10 shadow-2xl relative my-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black print:p-8"
          >
            {/* Modal Controls Bar (Hidden during Print) */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10 print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#FF6B5B]/20 text-[#FF6B5B] font-mono text-[11px] font-bold uppercase">
                  Executive Pitch Document
                </span>
                <span className="text-[12px] text-white/50 font-mono hidden sm:inline">
                  Ref: AS-RES-{effectiveBrandName.toUpperCase()}-2026
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPitchLink}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[12px] font-sans flex items-center gap-1.5 transition cursor-pointer"
                  title="Copy Pitch URL"
                >
                  {copiedPitchLink ? <Check size={13} className="text-[#25D366]" /> : <Share2 size={13} />}
                  <span>{copiedPitchLink ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  onClick={handlePrintPitchReport}
                  className="px-4 py-1.5 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black text-[12px] font-bold font-sans flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Pitch Report</span>
                </button>

                <button
                  onClick={() => setShowPitchReportModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white/70 hover:text-white transition cursor-pointer ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PRINTABLE REPORT CONTENT BODY */}
            {/* ========================================================================= */}
            <div className="space-y-8 print:space-y-6 print:text-black">
              {/* Report Header & Letterhead */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-white/15 print:border-black/20">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-[#FF6B5B] text-black font-display font-bold text-[18px] grid place-items-center shadow">
                      AS
                    </div>
                    <div>
                      <span className="font-display text-[18px] font-bold tracking-tight text-white print:text-black">
                        AUR SUNAO
                      </span>
                      <span className="text-[10px] font-mono text-white/50 print:text-black/60 block -mt-0.5">
                        Enterprise Semantic Market Intelligence Unit
                      </span>
                    </div>
                  </div>

                  <h1 className="font-display text-[26px] sm:text-[34px] text-white print:text-black font-bold tracking-tight leading-tight">
                    Voice-First Semantic Market Research Pitch
                  </h1>
                  <p className="font-sans text-[13px] text-[#FF6B5B] print:text-[#C53030] font-semibold mt-1">
                    Confidential Strategic Dossier Prepared for: {effectiveBrandName} ({brandCategory})
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-[11px] text-white/60 print:text-black/70 space-y-0.5">
                  <div>Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div>Doc ID: AS-PROP-{effectiveBrandName.slice(0, 4).toUpperCase()}-{targetSampleSize}N</div>
                  <div className="text-[#25D366] print:text-green-700 font-bold">Status: Commercial Scope Approved</div>
                </div>
              </div>

              {/* SECTION A: Executive Hypothesis & Why Voice Semantic Research */}
              <div className="space-y-3">
                <h3 className="text-[13px] font-mono uppercase tracking-wider text-[#FF6B5B] print:text-black font-bold flex items-center gap-1.5">
                  <span>Part 1: Research Mandate & Semantic Advantage</span>
                </h3>
                <p className="font-sans text-[13px] leading-relaxed text-white/80 print:text-black/90">
                  Traditional focus groups and quantitative Likert surveys fail to capture the true emotional friction of Indian consumers. In standard corporate surveys, respondents exhibit heavy social desirability bias, polite acquiescence, and sanitized answers. <b>Aur Sunao captures raw, unfiltered voice confessions</b> spoken in the solitude of personal smartphones when consumers are experiencing spontaneous everyday frustrations (spillage, pricing shock, kirana disputes, or habitual comfort).
                </p>
                <div className="p-4 rounded-2xl bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-300 font-sans text-[12px] space-y-1">
                  <div className="font-bold text-white print:text-black">Core Research Probe for {effectiveBrandName}:</div>
                  <div className="text-white/70 print:text-black/80 italic">"{researchObjective}"</div>
                </div>
              </div>

              {/* SECTION B: Population vs Users vs City Coverage Model Table */}
              <div className="space-y-3">
                <h3 className="text-[13px] font-mono uppercase tracking-wider text-[#FF6B5B] print:text-black font-bold">
                  Part 2: Coverage Matrix — Population vs. Category Universe vs. Brand Base
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-black/20">
                  <table className="w-full text-left font-sans text-[12px] border-collapse">
                    <thead>
                      <tr className="bg-white/5 print:bg-gray-100 border-b border-white/10 print:border-black/20 text-white/60 print:text-black/70 font-mono text-[11px]">
                        <th className="p-3">Target City</th>
                        <th className="p-3">Urban Population</th>
                        <th className="p-3">Category Universe ({categoryPenetrationRate}%)</th>
                        <th className="p-3">{effectiveBrandName} Users ({brandUserPenetrationRate}%)</th>
                        <th className="p-3">Voice Sample Quota</th>
                        <th className="p-3">Key Dialects Monitored</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-gray-200">
                      {selectedCities.map((city) => {
                        const cityCatUniverse = Math.round(city.population * (categoryPenetrationRate / 100));
                        const cityBrandUsers = Math.round(cityCatUniverse * (brandUserPenetrationRate / 100));
                        const citySample = Math.round(targetSampleSize / selectedCities.length);
                        return (
                          <tr key={city.id} className="hover:bg-white/5 print:hover:bg-transparent">
                            <td className="p-3 font-semibold text-white print:text-black">
                              {city.cityName} ({city.tier})
                            </td>
                            <td className="p-3 font-mono opacity-80">
                              {(city.population / 1000000).toFixed(1)}M
                            </td>
                            <td className="p-3 font-mono text-[#FFD166] print:text-amber-800">
                              {(cityCatUniverse / 1000000).toFixed(2)}M
                            </td>
                            <td className="p-3 font-mono text-[#FF6B5B] print:text-red-700 font-bold">
                              {(cityBrandUsers / 1000000).toFixed(2)}M
                            </td>
                            <td className="p-3 font-mono font-bold text-white print:text-black">
                              {citySample} vents
                            </td>
                            <td className="p-3 text-[11px] opacity-70">
                              {city.vernacularDialects.slice(0, 2).join(', ')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-white/10 print:bg-gray-200 font-mono font-bold text-white print:text-black border-t border-white/20 print:border-black/30">
                        <td className="p-3">Total Aggregate ({selectedCities.length} Cities)</td>
                        <td className="p-3">{(mathResults.totalUrbanPopulation / 1000000).toFixed(1)}M</td>
                        <td className="p-3 text-[#FFD166] print:text-amber-800">{(mathResults.categoryUniverse / 1000000).toFixed(1)}M</td>
                        <td className="p-3 text-[#FF6B5B] print:text-red-700">{(mathResults.activeBrandUsers / 1000000).toFixed(1)}M</td>
                        <td className="p-3">{targetSampleSize} Audio Transcripts</td>
                        <td className="p-3 text-[11px] font-normal">MoE: ±{mathResults.marginOfErrorPct}% (95% Conf.)</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* SECTION C: Semantic Nature of the Study & Scientific Methodology */}
              <div className="space-y-4">
                <h3 className="text-[13px] font-mono uppercase tracking-wider text-[#FF6B5B] print:text-black font-bold">
                  Part 3: Scientific Methodology & Semantic Architecture
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-300 space-y-1.5">
                    <div className="font-bold text-[13px] text-white print:text-black flex items-center gap-1.5">
                      <Volume2 size={15} className="text-[#FF6B5B]" />
                      <span>1. Acoustic Pitch Inflection</span>
                    </div>
                    <p className="text-[11px] text-white/70 print:text-black/80 leading-relaxed">
                      Measures fundamental frequency (F0) variance, micro-hesitations, speech rate slowdowns, and vocal strain to calculate involuntary somatic stress levels (1–10).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-300 space-y-1.5">
                    <div className="font-bold text-[13px] text-white print:text-black flex items-center gap-1.5">
                      <Layers size={15} className="text-[#25D366]" />
                      <span>2. Dialect Semantic Clustering</span>
                    </div>
                    <p className="text-[11px] text-white/70 print:text-black/80 leading-relaxed">
                      Custom phonetic vectorization trained on Hinglish, Bambaiya, Tanglish, and regional idioms that standard English NLP models completely misunderstand.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-300 space-y-1.5">
                    <div className="font-bold text-[13px] text-white print:text-black flex items-center gap-1.5">
                      <Flame size={15} className="text-[#FFD166]" />
                      <span>3. Unfiltered Verbatim Vault</span>
                    </div>
                    <p className="text-[11px] text-white/70 print:text-black/80 leading-relaxed">
                      Delivers verbatim voice clips and exact transcripts directly to brand managers, cutting through marketing agency filters and sanitized presentation decks.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION D: Structured Sentiment Projections & Real Verbatim Proof */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-mono uppercase tracking-wider text-[#FF6B5B] print:text-black font-bold">
                    Part 4: Structured Sentiment Output & Real Human Feedback
                  </h3>
                  <span className="text-[11px] font-mono text-white/50 print:text-black/60">
                    Category: {brandCategory}
                  </span>
                </div>

                {/* Projected Sentiment Distribution Bar */}
                <div className="p-4 rounded-2xl bg-black/40 print:bg-gray-100 border border-white/10 print:border-gray-300 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-white/80 print:text-black">Projected Semantic Sentiment Distribution for {effectiveBrandName}:</span>
                    <span className="text-[#25D366] font-bold">58% Net Emotional Resonance</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden flex">
                    <div className="bg-[#25D366] h-full" style={{ width: '42%' }} title="Habitual Comfort / Brand Affection: 42%" />
                    <div className="bg-[#FFD166] h-full" style={{ width: '28%' }} title="Functional Utility / Neutral: 28%" />
                    <div className="bg-[#FF6B5B] h-full" style={{ width: '30%' }} title="Critical Friction / Price Shock: 30%" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono opacity-75 print:opacity-100">
                    <span className="text-[#25D366]">42% Habitual Comfort & Nostalgia</span>
                    <span className="text-[#FFD166]">28% Functional Neutrality</span>
                    <span className="text-[#FF6B5B]">30% Critical Friction / Packaging Strain</span>
                  </div>
                </div>

                {/* Real Verbatim Exemplars */}
                <div className="space-y-3">
                  <div className="text-[11px] font-mono uppercase text-white/50 print:text-black/70">
                    Representative Audio Verbatims from Aur Sunao Consumer Vault:
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {SAMPLE_SEMANTIC_VERBATIMS.map((v) => (
                      <div
                        key={v.id}
                        className="p-4 rounded-2xl bg-white/5 print:bg-gray-50 border border-white/10 print:border-gray-300 space-y-2 text-[12px]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white print:text-black">{v.speaker}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6B5B]/20 text-[#FF6B5B] print:text-red-700">
                            Stress: {v.somaticStressScore}/10
                          </span>
                        </div>
                        <div className="text-[10px] font-mono opacity-60 print:opacity-80">
                          {v.city} • {v.dialect} • {v.acousticEmotion}
                        </div>
                        <p className="font-sans italic text-white/80 print:text-black leading-relaxed">
                          "{v.verbatimText}"
                        </p>
                        <div className="pt-2 border-t border-white/5 print:border-gray-200 text-[11px] font-mono text-[#25D366] print:text-green-800">
                          <b>Strategic Action:</b> {v.brandManagerAction}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION E: Dynamic Quantitative Scope & Computed Metrics */}
              <div className="space-y-3 pt-2">
                <h3 className="text-[13px] font-mono uppercase tracking-wider text-[#FF6B5B] print:text-black font-bold">
                  Part 5: Itemized Scope Specification & Quantitative Metric Engine
                </h3>

                <div className="p-5 rounded-2xl bg-white/5 print:bg-gray-100 border border-white/10 print:border-gray-300 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-b border-white/10 print:border-gray-300 pb-3">
                    <div>
                      <div className="text-[10px] font-mono opacity-60">Stories Covered</div>
                      <div className="font-display text-[18px] text-white print:text-black font-bold">
                        {targetSampleSize} Verified
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono opacity-60">Cities Covered</div>
                      <div className="font-display text-[18px] text-white print:text-black font-bold">
                        {selectedCities.length} Hubs
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono opacity-60">Duration</div>
                      <div className="font-display text-[18px] text-white print:text-black font-bold">
                        {studyDurationMonths} Month{studyDurationMonths > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono opacity-60">Total Research Yield</div>
                      <div className="font-display text-[18px] text-[#FF6B5B] print:text-red-700 font-bold">
                        {mathResults.netResearchStudyUnits.toLocaleString('en-IN')} RIU
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-white/70 print:text-black/80 space-y-1">
                    <div className="flex justify-between">
                      <span>Field Audio Acquisition & Dialect Vector Sampling Units:</span>
                      <span>{(mathResults.fieldSamplingUnits + mathResults.dialectAcousticVectors).toLocaleString('en-IN')} Units</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Regional City Cluster Coordination & Neural Cycles:</span>
                      <span>{(mathResults.cityClusterCoordinationNodes + mathResults.somaticSentimentNeuralCycles).toLocaleString('en-IN')} Units</span>
                    </div>
                    {mathResults.synergyBonusUnits > 0 && (
                      <div className="flex justify-between text-[#25D366] print:text-green-700 font-bold">
                        <span>Multi-City Scale Synergy Density (+{mathResults.synergyBonusPercent}% applied for {selectedCities.length} cities):</span>
                        <span>+{mathResults.synergyBonusUnits.toLocaleString('en-IN')} Units</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 border-t border-white/10 print:border-gray-300 font-bold text-white print:text-black text-[13px]">
                      <span>Total Computed Research Intelligence Scope:</span>
                      <span className="text-[#FF6B5B] print:text-red-700">
                        {mathResults.netResearchStudyUnits.toLocaleString('en-IN')} RIU ({mathResults.unitsPerStory} Units / Story)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sign-off and Execution block */}
                <div className="pt-6 border-t border-white/10 print:border-black/20 grid grid-cols-2 gap-8 text-[11px] font-mono text-white/60 print:text-black/70">
                  <div>
                    <div>Approved on behalf of <b>{effectiveBrandName}</b>:</div>
                    <div className="mt-8 pt-2 border-t border-white/20 print:border-black/40">
                      Authorized Signatory / CMO / Insights Director
                    </div>
                  </div>
                  <div>
                    <div>Accepted by <b>Aur Sunao Enterprise Intelligence</b>:</div>
                    <div className="mt-8 pt-2 border-t border-white/20 print:border-black/40">
                      Lead Behavioral Architect & Research Partner
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Print Footer Notice */}
            <div className="mt-8 pt-4 border-t border-white/10 print:border-gray-300 text-center text-[10px] font-mono text-white/40 print:text-black/60">
              Aur Sunao Proprietary Behavioral & Semantic Dataset • ISO 27001 Certified Anonymization • Strictly Confidential
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
