import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Headphones,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Building2,
  MapPin,
  TrendingUp,
  BarChart3,
  Activity,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  FileText,
  Calculator,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
  Network,
  Users,
  Check,
  X,
  Radio,
  Share2,
  SlidersHorizontal,
  Flame,
  PieChart,
  Bot,
  User,
  Coins,
  FileCheck2,
  Dice5,
  RefreshCw,
  Layers
} from 'lucide-react';
import { SyntheticIcpAvatars } from './SyntheticIcpAvatars';
import { SyntheticIcpBuilder } from './SyntheticIcpBuilder';
import { AdReactionLab } from './AdReactionLab';
import { VentBounties } from './VentBounties';
import { BrandResearchCostEstimator } from './BrandResearchCostEstimator';
import { PersonaGenerator } from './PersonaGenerator';
import { ResearchWorkspaceManager } from './ResearchWorkspaceManager';
import { ScenarioSimulator } from './ScenarioSimulator';
import { AlgorithmicEmpathyMatcher } from './AlgorithmicEmpathyMatcher';
import { BiometricEmotionSync } from './BiometricEmotionSync';
import { StoryKnowledgeGraph } from './StoryKnowledgeGraph';
import { LiveInstantMoodAnalyzer } from './LiveInstantMoodAnalyzer';
import { ResearchReportViewer } from './ResearchReportViewer';

// ==========================================
// 10 CITIES FMCG DUMMY DATA DEFINITIONS
// ==========================================

export interface CityFmcgData {
  id: string;
  cityName: string;
  state: string;
  dataPointsCount: number; // e.g. 3,420
  dataThresholdMet: boolean; // >= 1,000 threshold for statistical study
  sentiment: {
    positive: number;
    neutral: number;
    criticalVenting: number;
  };
  dominantBrands: {
    name: string;
    category: string;
    shareScore: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  topThemes: string[];
  keyInsight: string;
  studyScopeUnits: number; // Calculated dynamic research intelligence units
}

export interface BrandAudioStory {
  id: string;
  brand: string;
  category: 'Dairy & Beverages' | 'Packaged Foods' | 'Home Care' | 'Personal Care' | 'Biscuits & Snacks';
  city: string;
  speaker: {
    demographic: string;
    age: number;
    archetype: string;
  };
  title: string;
  emotion: 'Nostalgia' | 'Friction / Vent' | 'Brand Affection' | 'Price Shock' | 'Daily Ritual';
  sentiment: 'positive' | 'neutral' | 'critical';
  audioDurationSeconds: number;
  transcriptEn: string;
  transcriptHi?: string;
  brandManagerAction: string;
  claps: number;
  date: string;
}

export interface ActiveAnonymousStudy {
  id: string;
  brandName: string;
  category: string;
  targetCities: string[];
  durationMonths: number;
  studyUnitsPerCity: number;
  totalStudyUnits: number;
  objective: string;
  anonymousPrompt: string;
  status: 'In Fieldwork' | 'Data Synthesizing' | 'Dossier Ready';
  incomingDataPoints: number;
  targetDataPoints: number;
  startDate: string;
  endDate: string;
}

// Ten Indian Cities talking about multiple FMCG brands
export const TEN_CITIES_FMCG_DATA: CityFmcgData[] = [
  {
    id: 'mumbai',
    cityName: 'Mumbai',
    state: 'Maharashtra',
    dataPointsCount: 3420,
    dataThresholdMet: true,
    sentiment: { positive: 61, neutral: 21, criticalVenting: 18 },
    dominantBrands: [
      { name: 'Amul', category: 'Dairy', shareScore: 89, trend: 'up' },
      { name: 'Parle-G', category: 'Biscuits', shareScore: 84, trend: 'stable' },
      { name: 'Surf Excel', category: 'Home Care', shareScore: 78, trend: 'up' },
      { name: 'Tata Tea', category: 'Beverages', shareScore: 76, trend: 'stable' },
      { name: 'Britannia', category: 'Bakery', shareScore: 71, trend: 'up' },
    ],
    topThemes: ['Local Kirana credit trust', 'Cutting chai pairing ritual', 'Late night snack hoarding', 'Packaging spill complaints on suburban trains'],
    keyInsight: 'Mumbai consumers voice intense loyalty to legacy dairy and biscuit brands during local commuting rituals, but voice severe friction on pack durability in humid weather.',
    studyScopeUnits: 31200,
  },
  {
    id: 'delhi',
    cityName: 'Delhi NCR',
    state: 'Delhi / NCR',
    dataPointsCount: 3180,
    dataThresholdMet: true,
    sentiment: { positive: 54, neutral: 24, criticalVenting: 22 },
    dominantBrands: [
      { name: 'Maggi', category: 'Packaged Foods', shareScore: 92, trend: 'up' },
      { name: 'Mother Dairy', category: 'Dairy', shareScore: 86, trend: 'stable' },
      { name: 'Dettol', category: 'Personal Care', shareScore: 81, trend: 'up' },
      { name: 'Haldiram\'s', category: 'Snacks & Sweets', shareScore: 79, trend: 'up' },
      { name: 'Colgate', category: 'Oral Care', shareScore: 74, trend: 'down' },
    ],
    topThemes: ['Midnight Maggi variations in PGs', 'Air pollution hygiene rituals with Dettol', 'Festive gifting trust', 'Shrinkflation sensitivity in ₹10 packs'],
    keyInsight: 'Delhi NCR student and young workforce cohorts use Maggi and Haldiram\'s as social anchors, but show high switching velocity when ₹10-20 snack weights shrink.',
    studyScopeUnits: 29200,
  },
  {
    id: 'bengaluru',
    cityName: 'Bengaluru',
    state: 'Karnataka',
    dataPointsCount: 2750,
    dataThresholdMet: true,
    sentiment: { positive: 59, neutral: 25, criticalVenting: 16 },
    dominantBrands: [
      { name: 'Nandini', category: 'Dairy', shareScore: 93, trend: 'up' },
      { name: 'Tata Tea', category: 'Beverages', shareScore: 82, trend: 'up' },
      { name: 'Maggi', category: 'Packaged Foods', shareScore: 80, trend: 'stable' },
      { name: 'Britannia', category: 'Bakery', shareScore: 77, trend: 'up' },
      { name: 'Dettol', category: 'Personal Care', shareScore: 72, trend: 'stable' },
    ],
    topThemes: ['Regional pride in Nandini ghee & milk', 'Tech park late-night quick-cooks', 'Clean ingredient awareness', 'Filter coffee vs packet tea shifts'],
    keyInsight: 'Bengaluru demonstrates intense state brand advocacy (Nandini) coupled with high clean-label scrutiny among millennial tech workers.',
    studyScopeUnits: 25600,
  },
  {
    id: 'kolkata',
    cityName: 'Kolkata',
    state: 'West Bengal',
    dataPointsCount: 2240,
    dataThresholdMet: true,
    sentiment: { positive: 66, neutral: 20, criticalVenting: 14 },
    dominantBrands: [
      { name: 'Britannia', category: 'Bakery & Biscuits', shareScore: 88, trend: 'up' },
      { name: 'Tata Tea', category: 'Beverages', shareScore: 85, trend: 'up' },
      { name: 'Sunrise Spices', category: 'Staples & Spices', shareScore: 79, trend: 'stable' },
      { name: 'Lifebuoy', category: 'Personal Care', shareScore: 74, trend: 'down' },
      { name: 'Frooti', category: 'Beverages', shareScore: 70, trend: 'stable' },
    ],
    topThemes: ['Cha and biscuit Adda conversations', 'Mustard oil aroma debates', 'Durga Puja bulk household orders', 'Sub-brand loyalty over generational lines'],
    keyInsight: 'Adda culture powers disproportionate conversational volume for tea and premium cookies. Changing long-standing recipes triggers explosive community pushback.',
    studyScopeUnits: 21300,
  },
  {
    id: 'lucknow',
    cityName: 'Lucknow',
    state: 'Uttar Pradesh',
    dataPointsCount: 1890,
    dataThresholdMet: true,
    sentiment: { positive: 62, neutral: 23, criticalVenting: 15 },
    dominantBrands: [
      { name: 'Ghari Detergent', category: 'Home Care', shareScore: 87, trend: 'up' },
      { name: 'Parle-G', category: 'Biscuits', shareScore: 85, trend: 'stable' },
      { name: 'Amul', category: 'Dairy', shareScore: 78, trend: 'up' },
      { name: 'Bikaji', category: 'Snacks & Namkeen', shareScore: 75, trend: 'up' },
      { name: 'Dabur Red', category: 'Oral Care', shareScore: 73, trend: 'up' },
    ],
    topThemes: ['Value-for-money detergent loyalty', 'Traditional namkeen hospitality', 'Ayurvedic trust in Dabur', 'Kirana store shopkeeper recommendations'],
    keyInsight: 'Deep distributor trust and shopkeeper nudges heavily influence brand retention. Ghari and Dabur hold multi-generational emotional footholds in household budgets.',
    studyScopeUnits: 18400,
  },
  {
    id: 'ahmedabad',
    cityName: 'Ahmedabad',
    state: 'Gujarat',
    dataPointsCount: 1960,
    dataThresholdMet: true,
    sentiment: { positive: 68, neutral: 19, criticalVenting: 13 },
    dominantBrands: [
      { name: 'Amul', category: 'Dairy & Ice Cream', shareScore: 95, trend: 'up' },
      { name: 'Balaji Wafers', category: 'Snacks', shareScore: 88, trend: 'up' },
      { name: 'Wagh Bakri', category: 'Tea', shareScore: 86, trend: 'up' },
      { name: 'Nirma', category: 'Home Care', shareScore: 77, trend: 'stable' },
      { name: 'Haldiram\'s', category: 'Savory Snacks', shareScore: 72, trend: 'stable' },
    ],
    topThemes: ['Fierce local pride in Gujarati FMCG titans', 'Snack freshness & crispness standards', 'Tea strength & aroma expectations', 'Purity assurance in ghee & butter'],
    keyInsight: 'Regional titans (Amul, Balaji, Wagh Bakri) outperform national conglomerates by 2x in consumer sentiment and spontaneous pantry affection.',
    studyScopeUnits: 18900,
  },
  {
    id: 'jaipur',
    cityName: 'Jaipur',
    state: 'Rajasthan',
    dataPointsCount: 1620,
    dataThresholdMet: true,
    sentiment: { positive: 64, neutral: 22, criticalVenting: 14 },
    dominantBrands: [
      { name: 'Saras', category: 'Dairy', shareScore: 89, trend: 'up' },
      { name: 'Bikaji', category: 'Namkeen & Bhujia', shareScore: 86, trend: 'up' },
      { name: 'Tata Salt', category: 'Staples', shareScore: 82, trend: 'stable' },
      { name: 'Surf Excel', category: 'Home Care', shareScore: 76, trend: 'up' },
      { name: 'Parle-G', category: 'Biscuits', shareScore: 75, trend: 'stable' },
    ],
    topThemes: ['Hard water washing powder performance', 'Bikaji bhujia as compulsory tea companion', 'Authentic ghee vs adulterated market fear', 'Tourist vs resident staple buying'],
    keyInsight: 'Hard water issues create heavy discussion around detergent solvency and lather retention, with Surf Excel maintaining premium positioning over discount powders.',
    studyScopeUnits: 16100,
  },
  {
    id: 'indore',
    cityName: 'Indore',
    state: 'Madhya Pradesh',
    dataPointsCount: 1540,
    dataThresholdMet: true,
    sentiment: { positive: 67, neutral: 21, criticalVenting: 12 },
    dominantBrands: [
      { name: 'Haldiram\'s', category: 'Snacks & Sev', shareScore: 87, trend: 'up' },
      { name: 'Aashirvaad', category: 'Atta & Staples', shareScore: 83, trend: 'up' },
      { name: 'Maggi', category: 'Packaged Foods', shareScore: 81, trend: 'stable' },
      { name: 'Tide', category: 'Home Care', shareScore: 76, trend: 'up' },
      { name: 'Frooti', category: 'Beverages', shareScore: 71, trend: 'stable' },
    ],
    topThemes: ['Culinary critique of packaged namkeen vs local Chappan street sev', 'Atta softness & roti puffing', 'Cleanliness conscious packaging', 'Youth hostel midnight cooking'],
    keyInsight: 'Indore has the highest palate discernment for savory snacks; packaged FMCG brands are constantly benchmarked against fresh local artisanal sev makers.',
    studyScopeUnits: 15200,
  },
  {
    id: 'patna',
    cityName: 'Patna',
    state: 'Bihar',
    dataPointsCount: 1380,
    dataThresholdMet: true,
    sentiment: { positive: 58, neutral: 25, criticalVenting: 17 },
    dominantBrands: [
      { name: 'Sudha', category: 'Dairy', shareScore: 91, trend: 'up' },
      { name: 'Ghari Detergent', category: 'Home Care', shareScore: 88, trend: 'up' },
      { name: 'Parle-G', category: 'Biscuits', shareScore: 86, trend: 'stable' },
      { name: 'Dabur', category: 'Healthcare & Honey', shareScore: 79, trend: 'up' },
      { name: 'Britannia', category: 'Bakery', shareScore: 74, trend: 'stable' },
    ],
    topThemes: ['Sudha dairy booth early morning rush', 'Price sensitivity in ₹5 / ₹10 SKUs', 'Nutritional fortification trust for school children', 'Rural-urban family pantry transfers'],
    keyInsight: 'Sudha and Ghari dominate household share. Patna voice stories reveal high emotional sensitivity to price hikes at standard coin price-points.',
    studyScopeUnits: 13900,
  },
  {
    id: 'kochi',
    cityName: 'Kochi',
    state: 'Kerala',
    dataPointsCount: 1290,
    dataThresholdMet: true,
    sentiment: { positive: 65, neutral: 23, criticalVenting: 12 },
    dominantBrands: [
      { name: 'Milma', category: 'Dairy', shareScore: 94, trend: 'up' },
      { name: 'Eastern Condiments', category: 'Spices & Mixes', shareScore: 89, trend: 'up' },
      { name: 'Tata Tea Kanan Devan', category: 'Beverages', shareScore: 85, trend: 'up' },
      { name: 'Surf Excel', category: 'Home Care', shareScore: 79, trend: 'up' },
      { name: 'Dettol', category: 'Personal Care', shareScore: 75, trend: 'stable' },
    ],
    topThemes: ['Milma milk freshness test', 'Spice authenticity and chemical-free assurance', 'Monsoon dampness & soap dissolving issues', 'Expat NRI family pantry stocking'],
    keyInsight: 'Highest premium paid for verified chemical-free certifications and spice purity. Coastal humidity raises heavy complaints on biscuit dampness and powder clumping.',
    studyScopeUnits: 13200,
  },
];

// ==========================================
// FMCG BRAND AUDIO STORIES
// ==========================================
export const DUMMY_BRAND_STORIES: BrandAudioStory[] = [
  {
    id: 'story-amul-1',
    brand: 'Amul',
    category: 'Dairy & Beverages',
    city: 'Mumbai',
    speaker: { demographic: 'Homemaker', age: 34, archetype: 'Daily Breakfast Caretaker' },
    title: 'The Yellow Butter Paper Tear Battle Every Morning',
    emotion: 'Daily Ritual',
    sentiment: 'positive',
    audioDurationSeconds: 46,
    transcriptEn: "Every morning at 7:15 AM before packing school tiffin for my two boys, the Amul butter block comes out of the fridge. If you leave it for two minutes it melts in Mumbai humidity, if you cut it cold it breaks the Pav. But that salted taste? Nothing on earth replaces it. My husband once bought an imported European brand on sale; both kids refused to touch their sandwiches. But honestly, please make the butter foil easier to peel without butter sticking into the paper crevices!",
    transcriptHi: "रोज सुबह 7:15 पर बच्चों के टिफिन के लिए अमूल बटर निकलता है। अगर 2 मिनट बाहर छोड़ दो तो मुंबई की गर्मी में पिघल जाता है, ठंडा काटो तो पाव टूट जाता है। लेकिन वो नमकीन स्वाद? दुनिया में कोई और मक्खन उसकी जगह नहीं ले सकता!",
    brandManagerAction: "Develop a peel-and-reseal tub packaging format for coastal humid metros to resolve foil sticking friction while preserving signature salt-fat formulation.",
    claps: 342,
    date: 'Yesterday'
  },
  {
    id: 'story-maggi-1',
    brand: 'Maggi',
    category: 'Packaged Foods',
    city: 'Delhi NCR',
    speaker: { demographic: 'Engineering Student', age: 21, archetype: 'Midnight Hostel Cook' },
    title: 'Hostel Room 304 Midnight Chemistry Lab',
    emotion: 'Nostalgia',
    sentiment: 'positive',
    audioDurationSeconds: 58,
    transcriptEn: "During exam week at 2:30 AM in North Campus, the electric kettle turns into a holy shrine. We pool in two Maggi packets, break them into four blocks, add a pinch of chili powder from the canteen, and let it simmer. The aroma wakes up three other rooms and suddenly five people are eating from one plastic bowl with broken forks. Maggi isn't fast food for us; it’s an unspoken therapy session for burnout engineering brains.",
    transcriptHi: "नॉर्थ कैंपस में एग्जाम के दौरान रात 2:30 बजे हमारा इलेक्ट्रिक केतली जादू की मशीन बन जाती है। दो मैगी पैकेट और पाँच दोस्त एक ही कटोरे से खा रहे होते हैं। मैगी हमारे लिए खाना नहीं, तनाव भगाने वाली थेरेपी है।",
    brandManagerAction: "Introduce 'Hostel Edition' jumbo shareable packs with extra seasoning sachet options tailored for student micro-kitchens and kettles.",
    claps: 512,
    date: '2 days ago'
  },
  {
    id: 'story-parleg-1',
    brand: 'Parle-G',
    category: 'Biscuits & Snacks',
    city: 'Lucknow',
    speaker: { demographic: 'Delivery Partner', age: 28, archetype: 'Roadside Chai Believer' },
    title: 'Dipping Time is Exactly 2.4 Seconds',
    emotion: 'Brand Affection',
    sentiment: 'positive',
    audioDurationSeconds: 42,
    transcriptEn: "Between 11 AM and 4 PM riding around Hazratganj delivering orders in 42° heat, my energy savior is a ₹5 glass of hot cutting chai and a ₹5 packet of Parle-G. There is a precise science to it: dip for exactly two seconds. If you hesitate, it sinks to the bottom of the glass. For five rupees, you get glucose, memory of childhood, and the strength to finish the next ten deliveries. Never stop making the five rupee pack.",
    transcriptHi: "हज़रतगंज में 42 डिग्री धूप में डिलीवरी करते समय मेरी असली ऊर्जा है ₹5 की कटिंग चाय और ₹5 का पार्ले-जी। ठीक 2 सेकंड डुबोना होता है। ₹5 में बचपन की याद और अगले 10 ऑर्डर पहुँचाने की ताक़त मिलती है।",
    brandManagerAction: "Protect the core ₹5 coin price-point distribution in Tier-2/3 transit hubs; it anchors working-class consumer brand trust.",
    claps: 684,
    date: '3 days ago'
  },
  {
    id: 'story-surf-1',
    brand: 'Surf Excel',
    category: 'Home Care',
    city: 'Bengaluru',
    speaker: { demographic: 'Senior Project Manager', age: 36, archetype: 'Working Parent' },
    title: 'The Yellow Mud of Bangalore Playgrounds',
    emotion: 'Daily Ritual',
    sentiment: 'positive',
    audioDurationSeconds: 52,
    transcriptEn: "My daughter plays football on the wet red clay grounds of HSR Layout every Saturday. Her white jersey looks like it fought a mud war. When I put two scoops of Surf Excel Matic in the top-loader, it genuinely removes the red stains without scrubbing for twenty minutes. But my complaint is the plastic scoop inside—why can't it be biodegradable or paper-based? We are trying to cut down single-use plastics.",
    transcriptHi: "मेरी बेटी हर शनिवार लाल मिट्टी के मैदान पर फुटबॉल खेलती है। उसकी सफ़ेद जर्सी पहचान में नहीं आती। सर्फ एक्सेल मैटिक से साफ़ तो हो जाता है, लेकिन अंदर का प्लास्टिक स्कूप बंद करके इको-फ्रेंडली विकल्प दीजिए!",
    brandManagerAction: "Evaluate replacing virgin plastic dosing scoops with compressed sugarcane bagasse or compostable cardboard dosing caps.",
    claps: 298,
    date: '4 days ago'
  },
  {
    id: 'story-tatatea-1',
    brand: 'Tata Tea',
    category: 'Dairy & Beverages',
    city: 'Kolkata',
    speaker: { demographic: 'Retired Bank Officer', age: 63, archetype: 'Morning Adda Veteran' },
    title: 'The Unforgiving Gold Standard of First Morning Kadak',
    emotion: 'Daily Ritual',
    sentiment: 'positive',
    audioDurationSeconds: 64,
    transcriptEn: "At 6:30 in the morning in Salt Lake, if the tea leaves do not impart that deep amber hue within four minutes of boiling with fresh ginger, the entire morning newspaper session is spoiled. Tata Tea Gold has that specific aroma blend that stands up to full-cream milk. My grandson brought some herbal green tea bag packets last month; I told him tea is meant to awaken the revolutionary spirit, not wash down water!",
    transcriptHi: "सुबह 6:30 बजे अगर चाय की पत्ती अदरक के साथ खौलते ही गहरा बादामी रंग न दे, तो अखबार पढ़ने का मज़ा खराब हो जाता है। टाटा टी गोल्ड का वो गहरा स्वाद ही सुबह की असली शुरुआत कराता है।",
    brandManagerAction: "Leverage regional CTC-to-orthodox leaf aroma balance in regional advertising to reinforce cultural authenticity in eastern metros.",
    claps: 419,
    date: '5 days ago'
  },
  {
    id: 'story-haldiram-1',
    brand: 'Haldiram\'s',
    category: 'Biscuits & Snacks',
    city: 'Indore',
    speaker: { demographic: 'Food Blogger & Trader', age: 29, archetype: 'Critical Palate Connoisseur' },
    title: 'Testing Aloo Bhujia Against Chappan Dukan Standards',
    emotion: 'Friction / Vent',
    sentiment: 'neutral',
    audioDurationSeconds: 55,
    transcriptEn: "Living in Indore, our standards for sev and namkeen are merciless. Haldiram's Aloo Bhujia has the crunch and the spice balance, but lately the oil aftertaste in the 200g family pouch lingers a bit too heavily on the tongue. In summer, you can sense the difference in oil batch quality. If you want Indore foodies to respect your packaged namkeen, the oil cleanliness must be spotless like fresh morning kadhai.",
    transcriptHi: "इंदौर में हमारा सेंव और नमकीन का पैमाना बहुत सख्त है। हल्दीराम आलू भुजिया में क्रंच तो है, लेकिन हाल ही में तेल का आफ्टरटेस्ट भारी लग रहा है। गर्मियों में तेल की ताज़गी पर ध्यान दीजिए।",
    brandManagerAction: "Audit oil turnover and antioxidant formulation in central India manufacturing plants to eliminate rancidity perception in hot months.",
    claps: 310,
    date: '6 days ago'
  },
  {
    id: 'story-dettol-1',
    brand: 'Dettol',
    category: 'Personal Care',
    city: 'Kochi',
    speaker: { demographic: 'Nurse & Mother', age: 39, archetype: 'Hygiene Custodian' },
    title: 'Two Caps in the Rainwater Bucket: The Scent of Pure Protection',
    emotion: 'Brand Affection',
    sentiment: 'positive',
    audioDurationSeconds: 49,
    transcriptEn: "During Kerala monsoons when waterlogged streets bring fungal infections, two amber caps of Dettol in the warm bath water is a non-negotiable household law. That milky cloud that blooms the instant liquid hits water? That to me is psychological peace of mind. You could bring twenty organic floral antiseptic washes, but nothing smells like sterile maternal protection the way Dettol does.",
    transcriptHi: "केरल की बारिश में जब सड़कों पर गंदा पानी भर जाता है, तो नहाने के गुनगुने पानी में दो ढक्कन डेटॉल डालना घर का कानून है। वो सफ़ेद बादल जैसा मिलना ही मन को तसल्ली देता है।",
    brandManagerAction: "Anchor monsoon hygiene marketing around the visual and olfactory trigger of the 'milky bloom' dispersion in water.",
    claps: 521,
    date: '1 week ago'
  },
  {
    id: 'story-shrinkflation-1',
    brand: 'Britannia',
    category: 'Biscuits & Snacks',
    city: 'Patna',
    speaker: { demographic: 'College Lecturer', age: 44, archetype: 'Budget Conscious Educator' },
    title: 'Where Did the Fifth Cashew Go in Good Day?',
    emotion: 'Price Shock',
    sentiment: 'critical',
    audioDurationSeconds: 62,
    transcriptEn: "I have been buying Britannia Good Day Butter Cashew for our department faculty room since 2012. We don't mind if you charge ₹25 instead of ₹20, but please don't reduce the biscuit thickness and replace cashew chunks with cashew powder dust! The joy was biting into that visible roasted nut piece. When companies practice stealth shrinkflation, we notice immediately. Be honest with price rather than subtracting substance.",
    transcriptHi: "हम 2012 से गुड डे बटर काजू खरीद रहे हैं। दाम 20 का 25 कर दीजिए लेकिन बिस्किट पतला करके काजू के टुकड़े गायब मत करिए! ईमानदारी से दाम बढ़ाइए, अंदर की चीज़ मत घटाइए।",
    brandManagerAction: "Highlight 'Visible Whole Nut Pieces' on premium line SKUs to combat shrinkflation sentiment; test transparent window packaging.",
    claps: 742,
    date: '1 week ago'
  }
];

export const INITIAL_ACTIVE_STUDIES: ActiveAnonymousStudy[] = [
  {
    id: 'AS-FMCG-2026-MUM-DEL',
    brandName: 'Amul Dairy & Spreads',
    category: 'Dairy & Beverages',
    targetCities: ['Mumbai', 'Delhi NCR', 'Ahmedabad'],
    durationMonths: 2,
    studyUnitsPerCity: 26400,
    totalStudyUnits: 79200,
    objective: 'Explore packaging peel frustrations, breakfast table butter softening rituals, and plant-based milk switching threats.',
    anonymousPrompt: 'Tell us your real, unfiltered struggle when using butter or milk in your morning rush. What makes you yell at the packaging?',
    status: 'In Fieldwork',
    incomingDataPoints: 480,
    targetDataPoints: 750,
    startDate: '01 Sep 2026',
    endDate: '31 Oct 2026',
  },
  {
    id: 'AS-FMCG-2026-LKO-PAT',
    brandName: 'Ghari Detergent (RSPL)',
    category: 'Home Care',
    targetCities: ['Lucknow', 'Patna', 'Indore'],
    durationMonths: 1,
    studyUnitsPerCity: 15800,
    totalStudyUnits: 47400,
    objective: 'Investigate sachet packaging usability, weight elasticity, and hard-water foam perception against Surf Excel and Tide.',
    anonymousPrompt: 'How do you decide which detergent powder to buy when you visit your local kirana? Did you recently switch brands?',
    status: 'Dossier Ready',
    incomingDataPoints: 340,
    targetDataPoints: 300,
    startDate: '15 Aug 2026',
    endDate: '15 Sep 2026',
  }
];

// ==========================================
// COMPONENT PROPS & VIEW
// ==========================================
interface BrandMarketIntelligenceProps {
  onClose?: () => void;
  lang?: 'en' | 'hi';
  initialTab?: 'listen' | 'cities_dashboard' | 'initiate_study' | 'active_studies' | 'synthetic_avatars' | 'vent_bounties' | 'cost_estimator' | 'synthetic_builder' | 'ad_reaction_lab' | 'synthetic_persona_generator' | 'research_workspace' | 'scenario_simulator' | 'algorithmic_empathy_matcher' | 'biometric_emotion_sync' | 'story_knowledge_graph' | 'live_instant_mood_analyzer' | 'research_report';
}

export const BrandMarketIntelligence: React.FC<BrandMarketIntelligenceProps> = ({
  onClose,
  lang = 'en',
  initialTab = 'cities_dashboard',
}) => {
  // Navigation tabs within Brand Segment
  const [activeTab, setActiveTab] = useState<
    'listen' | 'cities_dashboard' | 'initiate_study' | 'active_studies' | 'synthetic_avatars' | 'vent_bounties' | 'cost_estimator' | 'synthetic_builder' | 'ad_reaction_lab' | 'synthetic_persona_generator' | 'research_workspace' | 'scenario_simulator' | 'algorithmic_empathy_matcher' | 'biometric_emotion_sync' | 'story_knowledge_graph' | 'live_instant_mood_analyzer' | 'research_report'
  >(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, []); // Changed dependency from [initialTab] to []

  // Audio Player State for Story Listening
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const audioIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Filters for Story Listening
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected City in the 10 Cities Dashboard
  const [selectedCityId, setSelectedCityId] = useState<string>('mumbai');

  // Study Initiator Wizard Form State
  const [studyBrand, setStudyBrand] = useState<string>('Amul');
  const [customBrandName, setCustomBrandName] = useState<string>('');
  const [studyCategory, setStudyCategory] = useState<string>('Dairy & Beverages');
  const [selectedStudyCities, setSelectedStudyCities] = useState<string[]>(['mumbai', 'delhi', 'bengaluru']);
  const [studyDurationMonths, setStudyDurationMonths] = useState<number>(1);
  const [studyObjective, setStudyObjective] = useState<string>('Voice of Consumer & Shrinkflation Friction Audit');
  const [customPrompt, setCustomPrompt] = useState<string>('Share what frustrates or delights you about our product when buying from local shops vs apps.');
  const [contactCorporateEmail, setContactCorporateEmail] = useState<string>('');
  const [isDeployingStudy, setIsDeployingStudy] = useState<boolean>(false);
  const [studySuccessNotification, setStudySuccessNotification] = useState<string | null>(null);

  // Active Studies List
  const [activeStudies, setActiveStudies] = useState<ActiveAnonymousStudy[]>(INITIAL_ACTIVE_STUDIES);
  const [lastSimulationResults, setLastSimulationResults] = useState<any>(null);
  const [lastSimulationExperimentId, setLastSimulationExperimentId] = useState<string>('');

  // Dynamic random calculation generator based on no. of cities & stories covered
  const [randomCalcSeed, setRandomCalcSeed] = useState<number>(() => Math.floor(Math.random() * 9999) + 1);

  const handleRerollCalculations = () => {
    setRandomCalcSeed(Math.floor(Math.random() * 99999) + 1);
  };

  // Computed stories covered across selected study cities
  const totalStoriesCovered = useMemo(() => {
    return selectedStudyCities.reduce((acc, cId) => {
      const city = TEN_CITIES_FMCG_DATA.find((item) => item.id === cId);
      return acc + (city ? city.dataPointsCount : 1500);
    }, 0);
  }, [selectedStudyCities]);

  // Dynamic random number calculations based upon the number of cities & number of stories covered
  const dynamicStudyCalculation = useMemo(() => {
    const numCities = selectedStudyCities.length;
    const numStories = totalStoriesCovered;

    // Deterministic pseudo-random variation using trigonometric seed hash
    const seedHash = Math.sin(randomCalcSeed * 17.38 + numCities * 29.1 + numStories * 0.0031) * 0.5 + 0.5;
    const secondaryHash = Math.cos(randomCalcSeed * 31.17 + numCities * 41.5 + numStories * 0.0073) * 0.5 + 0.5;

    // Dynamic multipliers influenced by cities and story depth
    const cityScaleFactor = 1 + (numCities - 1) * 0.18; // sublinear city scale
    const storyDensityFactor = Math.sqrt(numStories) * 48; // square-root story scaling for statistical saturation
    const randomVariance = 0.88 + seedHash * 0.32; // +/- 16% dynamic randomness

    const acousticIntelligenceVectors = Math.round(numStories * (6.4 + secondaryHash * 3.8));
    const phoneticStressSignals = Math.round(numStories * (2.1 + seedHash * 1.8));
    const crossCityDialectNodes = Math.round(numCities * (340 + seedHash * 180));

    // Total Research Intelligence Units (RIU)
    const baseStudyUnits = Math.round(storyDensityFactor * cityScaleFactor * randomVariance * 18.5 * studyDurationMonths);
    const totalCalculatedUnits = baseStudyUnits + crossCityDialectNodes;

    const unitsPerStory = Number((totalCalculatedUnits / Math.max(numStories, 1)).toFixed(2));
    const statisticalConfidencePct = Number((94.2 + Math.min(numCities * 0.45, 4.2) + seedHash * 1.4).toFixed(1));

    return {
      numCities,
      numStories,
      totalCalculatedUnits,
      unitsPerCity: Math.round(totalCalculatedUnits / Math.max(numCities, 1)),
      acousticIntelligenceVectors,
      phoneticStressSignals,
      crossCityDialectNodes,
      unitsPerStory,
      statisticalConfidencePct,
      seedHash,
    };
  }, [selectedStudyCities, totalStoriesCovered, studyDurationMonths, randomCalcSeed]);

  // Selected story for deep modal view
  const [detailModalStory, setDetailModalStory] = useState<BrandAudioStory | null>(null);

  // Sound synthesis on play
  const playSimulatedVoiceNote = (story: BrandAudioStory) => {
    if (playingStoryId === story.id) {
      // Pause
      setPlayingStoryId(null);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      return;
    }

    setPlayingStoryId(story.id);
    setAudioProgress(0);

    // Simulated audio speech / synth sound
    try {
      if ('speechSynthesis' in window && !isAudioMuted) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(story.transcriptEn);
        utterance.rate = playbackSpeed;
        utterance.pitch = 1.0;
        utterance.lang = 'en-IN';
        utterance.onend = () => {
          setPlayingStoryId(null);
          setAudioProgress(100);
        };
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis not available', e);
    }

    // Progress tick
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    const totalMs = story.audioDurationSeconds * 1000;
    const intervalMs = 200;
    let elapsed = 0;

    audioIntervalRef.current = setInterval(() => {
      elapsed += intervalMs * playbackSpeed;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setAudioProgress(pct);
      if (pct >= 100) {
        clearInterval(audioIntervalRef.current);
        setPlayingStoryId(null);
      }
    }, intervalMs);
  };

  const handleStopAudio = () => {
    setPlayingStoryId(null);
    setAudioProgress(0);
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  };

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {}
    };
  }, []);

  // Filtered stories
  const filteredStories = DUMMY_BRAND_STORIES.filter((st) => {
    if (brandFilter !== 'all' && st.brand.toLowerCase() !== brandFilter.toLowerCase()) return false;
    if (cityFilter !== 'all' && st.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (sentimentFilter !== 'all' && st.sentiment !== sentimentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        st.brand.toLowerCase().includes(q) ||
        st.title.toLowerCase().includes(q) ||
        st.transcriptEn.toLowerCase().includes(q) ||
        st.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Toggle city in study initiator
  const toggleStudyCity = (cityId: string) => {
    if (selectedStudyCities.includes(cityId)) {
      if (selectedStudyCities.length > 1) {
        setSelectedStudyCities(selectedStudyCities.filter((c) => c !== cityId));
      }
    } else {
      setSelectedStudyCities([...selectedStudyCities, cityId]);
    }
  };

  // Launch Study Action
  const handleDeployAnonymousStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeployingStudy(true);

    const actualBrand = studyBrand === 'Custom' ? (customBrandName || 'Custom FMCG Brand') : studyBrand;
    const studyId = `AS-FMCG-${Date.now().toString().slice(-4)}-${selectedStudyCities.map(c => c.slice(0, 3).toUpperCase()).join('-')}`;

    const newStudy: ActiveAnonymousStudy = {
      id: studyId,
      brandName: actualBrand,
      category: studyCategory,
      targetCities: selectedStudyCities.map((c) => TEN_CITIES_FMCG_DATA.find((item) => item.id === c)?.cityName || c),
      durationMonths: studyDurationMonths,
      studyUnitsPerCity: dynamicStudyCalculation.unitsPerCity,
      totalStudyUnits: dynamicStudyCalculation.totalCalculatedUnits,
      objective: studyObjective,
      anonymousPrompt: customPrompt,
      status: 'In Fieldwork',
      incomingDataPoints: 24, // starts collecting immediately
      targetDataPoints: selectedStudyCities.length * 150 * studyDurationMonths,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      endDate: new Date(Date.now() + studyDurationMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    try {
      await fetch('/api/enterprise-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: actualBrand,
          email: contactCorporateEmail || 'brand-manager@fmcg.com',
          useCase: `Anonymous Study: ${studyObjective} across [${newStudy.targetCities.join(', ')}] for ${studyDurationMonths} month(s). Dynamic Scope: ${dynamicStudyCalculation.totalCalculatedUnits.toLocaleString('en-IN')} Units across ${dynamicStudyCalculation.numStories.toLocaleString('en-IN')} stories.`,
        }),
      });
    } catch (err) {
      console.warn('Backend log completed:', err);
    }

    setTimeout(() => {
      setActiveStudies([newStudy, ...activeStudies]);
      setIsDeployingStudy(false);
      setStudySuccessNotification(
        `Study ${studyId} initiated for ${actualBrand} across ${selectedStudyCities.length} cities (${dynamicStudyCalculation.totalCalculatedUnits.toLocaleString('en-IN')} Research Intelligence Units across ${dynamicStudyCalculation.numStories.toLocaleString('en-IN')} stories)!`
      );
      setActiveTab('active_studies');
      setTimeout(() => setStudySuccessNotification(null), 7000);
    }, 800);
  };

  const currentCityData = TEN_CITIES_FMCG_DATA.find((c) => c.id === selectedCityId) || TEN_CITIES_FMCG_DATA[0];

  return (
    <div id="brand-intelligence-suite" className="w-full text-white font-sans">
      {/* Top Banner Header */}
      <div className="rounded-[28px] bg-gradient-to-b from-[#18181B] to-[#0D0D0F] border border-white/10 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-[450px] h-[350px] bg-[#FF6B5B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#FF6B5B] text-black font-sans font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Building2 size={13} />
                For FMCG Brands
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono text-[11px]">
                10-City Real-Voice Intelligence
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#2E7D32]/20 text-[#25D366] font-mono text-[11px] font-semibold flex items-center gap-1">
                <ShieldCheck size={12} /> DPDP-Compliant Voice Stream
              </span>
            </div>

            <h2 className="font-display text-[28px] md:text-[40px] leading-[1.05] tracking-tight text-white">
              Brand Voice Listening & City Research Studio
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-white/70 max-w-[75ch] mt-2 leading-relaxed">
              Listen to authentic, unfiltered stories from real consumers talking about FMCG brands during their daily rituals.
              Initiate anonymous market research studies across 10 target Indian cities with high data point density.
            </p>
          </div>

          {/* Dynamic Research Scope Highlight Card */}
          <div className="shrink-0 rounded-[22px] bg-black/60 border border-[#FF6B5B]/30 p-4 md:p-5 flex flex-col justify-between max-w-[320px] shadow-lg">
            <div className="flex items-center justify-between text-[11px] font-mono text-white/60 mb-1">
              <span>Dynamic Research Scope</span>
              <span className="text-[#25D366] flex items-center gap-1">
                <CheckCircle2 size={11} /> {dynamicStudyCalculation.statisticalConfidencePct}% Confidence
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[26px] md:text-[30px] text-[#FF6B5B] font-bold">
                {dynamicStudyCalculation.totalCalculatedUnits.toLocaleString('en-IN')}
              </span>
              <span className="font-sans text-[12px] text-white/70">
                Units
              </span>
            </div>
            <p className="font-sans text-[11px] text-white/50 mt-1.5 leading-snug">
              Dynamic scope calculation derived from {dynamicStudyCalculation.numCities} monitored cities and {dynamicStudyCalculation.numStories.toLocaleString('en-IN')} voice stories.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => setActiveTab('initiate_study')}
                className="flex-1 py-2 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black font-sans text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles size={12} />
                <span>Configure Study</span>
              </button>
              <button
                type="button"
                onClick={handleRerollCalculations}
                title="Randomize calculation parameters based on cities & stories"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center cursor-pointer"
              >
                <Dice5 size={14} className="text-[#FF6B5B]" />
              </button>
            </div>
          </div>
        </div>

        {/* Segment Tabs Navigation */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-black/50 border border-white/10">
            <button
              onClick={() => setActiveTab('cities_dashboard')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'cities_dashboard'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 size={14} />
              <span>10 Cities FMCG Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('listen')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'listen'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Headphones size={14} />
              <span>Listen to Brand Stories ({DUMMY_BRAND_STORIES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('initiate_study')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'initiate_study'
                  ? 'bg-[#FF6B5B] text-black shadow-md font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calculator size={14} />
              <span>Initiate Anonymous Study</span>
            </button>
            <button
              onClick={() => setActiveTab('synthetic_builder')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'synthetic_builder'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Synthetic ICP Builder</span>
            </button>
            <button
              onClick={() => setActiveTab('synthetic_avatars')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'synthetic_avatars'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bot size={14} />
              <span>Synthetic ICP Avatars</span>
            </button>
            <button
              onClick={() => setActiveTab('ad_reaction_lab')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'ad_reaction_lab'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={14} />
              <span>Ad Reaction Lab</span>
            </button>
            <button
              onClick={() => setActiveTab('synthetic_persona_generator')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'synthetic_persona_generator'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <User size={14} />
              <span>Synthetic Persona Generator</span>
            </button>
            <button
              onClick={() => setActiveTab('research_workspace')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'research_workspace'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 size={14} />
              <span>Research Workspace</span>
            </button>
            <button
              onClick={() => setActiveTab('scenario_simulator')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'scenario_simulator'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={14} />
              <span>Scenario Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('algorithmic_empathy_matcher')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'algorithmic_empathy_matcher'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <HeartHandshake size={14} />
              <span>Algorithmic Empathy Matcher</span>
            </button>
            <button
              onClick={() => setActiveTab('biometric_emotion_sync')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'biometric_emotion_sync'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity size={14} />
              <span>Biometric Emotion Sync</span>
            </button>
            <button
              onClick={() => setActiveTab('story_knowledge_graph')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'story_knowledge_graph'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Network size={14} />
              <span>Story Knowledge Graph</span>
            </button>
            <button
              onClick={() => setActiveTab('live_instant_mood_analyzer')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'live_instant_mood_analyzer'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={14} />
              <span>Instant Mood Analyzer</span>
            </button>
            <button
              onClick={() => setActiveTab('research_report')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'research_report'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCheck2 size={14} />
              <span>Research Report</span>
            </button>

            <button
              onClick={() => setActiveTab('cost_estimator')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'cost_estimator'
                  ? 'bg-gradient-to-r from-[#FF6B5B] to-[#FF8E53] text-black shadow-lg font-bold ring-2 ring-white/30'
                  : 'text-white/80 hover:text-white hover:bg-white/5 border border-[#FF6B5B]/30'
              }`}
            >
              <FileCheck2 size={14} className={activeTab === 'cost_estimator' ? 'text-black' : 'text-[#FF6B5B]'} />
              <span>Research Cost Estimator & Pitch</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'cost_estimator' ? 'bg-black text-white' : 'bg-[#FF6B5B]/20 text-[#FF6B5B]'
              }`}>
                Model & Print
              </span>
            </button>

            <button
              onClick={() => setActiveTab('active_studies')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'active_studies'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity size={14} />
              <span>Active Studies Tracker ({activeStudies.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('synthetic_avatars')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'synthetic_avatars'
                  ? 'bg-[#FF6B5B] text-black shadow-md font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bot size={14} />
              <span>Synthetic ICP Avatars</span>
            </button>

            <button
              onClick={() => setActiveTab('vent_bounties')}
              className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'vent_bounties'
                  ? 'bg-[#FFB300] text-black shadow-md font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Coins size={14} />
              <span>Brand Vent Bounties</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-white/50">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>10 Cities Live Listening • 20,470 Total FMCG Data Points</span>
          </div>
        </div>

        {/* Global Toast if study initiated */}
        {studySuccessNotification && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#2E7D32]/20 border border-[#2E7D32]/50 text-[#25D366] font-sans text-[12px] flex items-center gap-2.5 fade-up">
            <CheckCircle2 size={16} className="shrink-0" />
            <span className="font-semibold">{studySuccessNotification}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 10 CITIES FMCG DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'cities_dashboard' && (
        <div className="mt-6 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="rounded-[20px] bg-[#141416] border border-white/10 p-4">
              <div className="text-[11px] font-mono text-white/50 uppercase">Cities Monitored</div>
              <div className="font-display text-[28px] text-white mt-1">10 Indian Metros</div>
              <div className="text-[11px] text-[#25D366] mt-1 flex items-center gap-1 font-mono">
                <Check size={11} /> 100% Data Threshold Met
              </div>
            </div>

            <div className="rounded-[20px] bg-[#141416] border border-white/10 p-4">
              <div className="text-[11px] font-mono text-white/50 uppercase">Verified FMCG Data Points</div>
              <div className="font-display text-[28px] text-white mt-1">20,470 Stories</div>
              <div className="text-[11px] text-white/60 mt-1 font-mono">
                Avg. 2,047 points / city
              </div>
            </div>

            <div className="rounded-[20px] bg-[#141416] border border-white/10 p-4">
              <div className="text-[11px] font-mono text-white/50 uppercase flex items-center justify-between">
                <span>Scope Unit Density</span>
                <button
                  type="button"
                  onClick={handleRerollCalculations}
                  title="Randomize calculation parameters based on cities & stories"
                  className="text-white/40 hover:text-white transition cursor-pointer"
                >
                  <Dice5 size={12} className="text-[#FF6B5B]" />
                </button>
              </div>
              <div className="font-display text-[26px] text-[#FF6B5B] mt-1">
                {dynamicStudyCalculation.unitsPerStory} Units/Story
              </div>
              <div className="text-[11px] text-white/60 mt-1 font-mono">
                {dynamicStudyCalculation.acousticIntelligenceVectors.toLocaleString('en-IN')} acoustic vectors
              </div>
            </div>

            <div className="rounded-[20px] bg-[#141416] border border-white/10 p-4">
              <div className="text-[11px] font-mono text-white/50 uppercase">Dominant FMCG Sectors</div>
              <div className="font-display text-[24px] text-white mt-1 truncate">Dairy, Snacks & Care</div>
              <div className="text-[11px] text-white/60 mt-1 font-mono">
                12+ National & Regional brands
              </div>
            </div>
          </div>

          {/* City Selection Bar (10 Cities) */}
          <div className="rounded-[24px] bg-[#141416] border border-white/10 p-4 md:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="font-display text-[18px] text-white flex items-center gap-2">
                  <MapPin size={16} className="text-[#FF6B5B]" />
                  Select Target City ({TEN_CITIES_FMCG_DATA.length} Cities Talking About Brands)
                </h3>
                <p className="font-sans text-[12px] text-white/60">
                  Click any city below to inspect voice volume, sentiment polarity, brand rankings, and data point thresholds.
                </p>
              </div>
              <div className="text-[11px] font-mono text-white/50">
                Data Threshold standard: &ge;1,000 points
              </div>
            </div>

            {/* 10 City Pill Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2">
              {TEN_CITIES_FMCG_DATA.map((city) => {
                const isSelected = city.id === selectedCityId;
                return (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCityId(city.id)}
                    className={`p-3 rounded-[16px] text-left transition border cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-md'
                        : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[13px]">{city.cityName}</span>
                      {city.dataThresholdMet && (
                        <span
                          className={`w-4 h-4 rounded-full grid place-items-center text-[10px] ${
                            isSelected ? 'bg-black text-[#25D366]' : 'bg-[#2E7D32]/30 text-[#25D366]'
                          }`}
                          title="Threshold satisfied (&gt;1,000 points)"
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] font-mono mt-2 ${isSelected ? 'text-black/70' : 'text-white/50'}`}>
                      {city.dataPointsCount.toLocaleString('en-IN')} stories
                    </div>
                    <div className={`text-[10px] font-sans mt-0.5 truncate ${isSelected ? 'text-black/80 font-medium' : 'text-white/60'}`}>
                      Top: {city.dominantBrands[0].name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected City Deep Dive */}
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
            {/* Left: City Deep Profile */}
            <div className="rounded-[24px] bg-[#141416] border border-white/10 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-[26px] text-white">
                      {currentCityData.cityName}, {currentCityData.state}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2E7D32]/20 text-[#25D366] text-[10px] font-mono font-bold">
                      {currentCityData.dataPointsCount.toLocaleString('en-IN')} Data Points ✓
                    </span>
                  </div>
                  <p className="font-sans text-[12px] text-white/60 mt-1">
                    Sufficient data volume confirmed for targeted qualitative & quantitative FMCG study.
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-mono text-white/50">City Scope Allocation</div>
                  <div className="font-display text-[20px] text-[#FF6B5B] font-bold">
                    {currentCityData.studyScopeUnits.toLocaleString('en-IN')} <span className="font-sans text-[11px] font-normal text-white/70">Units</span>
                  </div>
                </div>
              </div>

              {/* Sentiment Polarity Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-sans mb-1.5">
                  <span className="font-semibold text-white/80">Sentiment Polarity Across FMCG Stories</span>
                  <span className="text-white/50 font-mono">
                    {currentCityData.sentiment.positive}% Pos • {currentCityData.sentiment.neutral}% Neut • {currentCityData.sentiment.criticalVenting}% Vent
                  </span>
                </div>
                <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-white/10">
                  <div
                    style={{ width: `${currentCityData.sentiment.positive}%` }}
                    className="bg-[#25D366] h-full"
                    title={`Positive: ${currentCityData.sentiment.positive}%`}
                  />
                  <div
                    style={{ width: `${currentCityData.sentiment.neutral}%` }}
                    className="bg-amber-400 h-full"
                    title={`Neutral: ${currentCityData.sentiment.neutral}%`}
                  />
                  <div
                    style={{ width: `${currentCityData.sentiment.criticalVenting}%` }}
                    className="bg-[#FF6B5B] h-full"
                    title={`Critical / Venting: ${currentCityData.sentiment.criticalVenting}%`}
                  />
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-white/60 mt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#25D366]" /> Positive Affection ({currentCityData.sentiment.positive}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Daily Habit / Neutral ({currentCityData.sentiment.neutral}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B5B]" /> Friction & Venting ({currentCityData.sentiment.criticalVenting}%)
                  </span>
                </div>
              </div>

              {/* Dominant FMCG Brands Table */}
              <div>
                <h4 className="font-sans text-[13px] font-bold text-white mb-2.5 flex items-center justify-between">
                  <span>Top Discussed FMCG Brands in {currentCityData.cityName}</span>
                  <span className="text-[11px] font-normal text-white/50">Voice Share Index (0-100)</span>
                </h4>
                <div className="space-y-2">
                  {currentCityData.dominantBrands.map((brand, idx) => (
                    <div
                      key={brand.name}
                      className="p-2.5 rounded-[14px] bg-black/40 border border-white/5 flex items-center justify-between gap-3 font-sans text-[12px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white/10 text-white/70 font-mono text-[10px] grid place-items-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white">{brand.name}</div>
                          <div className="text-[10px] text-white/50 font-mono">{brand.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-24 sm:w-32 bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${brand.shareScore}%` }}
                            className="bg-[#FF6B5B] h-full rounded-full"
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold w-7 text-right">
                          {brand.shareScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* City Qualitative Insight Box */}
              <div className="p-4 rounded-[18px] bg-white/5 border border-white/10">
                <div className="text-[10px] font-mono text-[#FF6B5B] uppercase font-bold flex items-center gap-1 mb-1">
                  <Sparkles size={11} /> Synthesized City Ground Reality
                </div>
                <p className="font-sans text-[12px] text-white/80 leading-relaxed italic">
                  "{currentCityData.keyInsight}"
                </p>
              </div>

              {/* Action Button for this City */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-[11px] font-mono text-white/60">
                  Ready to deploy study across {currentCityData.cityName} ({currentCityData.dataPointsCount.toLocaleString('en-IN')} voice stories)?
                </div>
                <button
                  onClick={() => {
                    setSelectedStudyCities([currentCityData.id]);
                    setActiveTab('initiate_study');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black font-sans text-[12px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Calculator size={13} />
                  <span>Configure Study for {currentCityData.cityName}</span>
                </button>
              </div>
            </div>

            {/* Right: Key City Themes & Audio Snippets */}
            <div className="space-y-4">
              {/* City Recurring Themes */}
              <div className="rounded-[24px] bg-[#141416] border border-white/10 p-5">
                <h4 className="font-sans text-[13px] font-bold text-white mb-3 flex items-center gap-2">
                  <Flame size={14} className="text-[#FF6B5B]" />
                  Active Cultural Themes & Pantry Friction
                </h4>
                <div className="space-y-2">
                  {currentCityData.topThemes.map((theme, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-[12px] bg-white/5 border border-white/5 font-sans text-[12px] text-white/80 flex items-start gap-2"
                    >
                      <span className="text-[#FF6B5B] font-bold">#</span>
                      <span>{theme}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Audio Voice Sample from this City */}
              <div className="rounded-[24px] bg-[#141416] border border-white/10 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] font-mono text-white/50 uppercase">Voice Sample from {currentCityData.cityName}</div>
                  <button
                    onClick={() => {
                      setCityFilter(currentCityData.cityName);
                      setActiveTab('listen');
                    }}
                    className="text-[11px] text-[#FF6B5B] hover:underline flex items-center gap-0.5 cursor-pointer font-sans"
                  >
                    View all stories →
                  </button>
                </div>

                {(() => {
                  const cityStory = DUMMY_BRAND_STORIES.find((s) => s.city.toLowerCase() === currentCityData.cityName.toLowerCase()) || DUMMY_BRAND_STORIES[0];
                  const isPlaying = playingStoryId === cityStory.id;

                  return (
                    <div className="p-4 rounded-[18px] bg-black/50 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded-full bg-[#FF6B5B]/20 text-[#FF6B5B] text-[10px] font-bold font-mono">
                            {cityStory.brand}
                          </span>
                          <h5 className="font-display text-[15px] text-white mt-1">
                            {cityStory.title}
                          </h5>
                          <div className="text-[10px] font-sans text-white/50">
                            {cityStory.speaker.demographic} • {cityStory.speaker.age} yrs • {cityStory.city}
                          </div>
                        </div>

                        <button
                          onClick={() => playSimulatedVoiceNote(cityStory)}
                          className="w-10 h-10 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black grid place-items-center transition shrink-0 cursor-pointer shadow-md"
                          title={isPlaying ? 'Pause voice' : 'Listen to voice story'}
                        >
                          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                        </button>
                      </div>

                      <p className="font-sans text-[11px] text-white/70 line-clamp-3 italic">
                        "{cityStory.transcriptEn}"
                      </p>

                      {isPlaying && (
                        <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                          <div className="flex-1 bg-white/15 h-1.5 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${audioProgress}%` }}
                              className="bg-[#FF6B5B] h-full transition-all duration-200"
                            />
                          </div>
                          <span className="font-mono text-[10px] text-white/60">
                            {audioProgress}%
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Data Points Threshold Guarantee Banner */}
              <div className="p-4 rounded-[20px] bg-gradient-to-r from-[#18231C] to-[#141416] border border-[#2E7D32]/40 text-[11px] font-sans text-white/80 space-y-1.5">
                <div className="font-bold text-[#25D366] flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Data Adequacy Guarantee for 10 Cities
                </div>
                <p className="text-white/60 text-[11px] leading-relaxed">
                  Every city in this dashboard has passed the minimum threshold (&gt;1,000 raw voice stories).
                  At the standard ₹1,00,000 / month / city pricing, studies are guaranteed to harvest 250+ targeted, anonymized voice transcripts with statistical validity.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LISTEN TO BRAND STORIES (AUDIO & TRANSCRIPTS) */}
      {/* ========================================================================= */}
      {activeTab === 'listen' && (
        <div className="mt-6 space-y-6">
          {/* Audio Player Controls Bar */}
          <div className="p-4 rounded-[22px] bg-[#141416] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF6B5B]/20 text-[#FF6B5B] grid place-items-center shrink-0">
                <Headphones size={18} />
              </div>
              <div>
                <h3 className="font-display text-[16px] text-white">
                  Brand Voice Story Player
                </h3>
                <p className="font-sans text-[11px] text-white/50">
                  {playingStoryId
                    ? `Playing audio story: "${DUMMY_BRAND_STORIES.find((s) => s.id === playingStoryId)?.title}"`
                    : 'Select any story below to listen to authentic consumer speech & read unedited transcripts'}
                </p>
              </div>
            </div>

            {/* Global Audio Controls */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              {playingStoryId && (
                <button
                  onClick={handleStopAudio}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans text-[11px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Pause size={12} />
                  <span>Stop</span>
                </button>
              )}

              {/* Speed Toggle */}
              <div className="flex items-center rounded-full bg-black/60 border border-white/10 p-0.5 text-[11px] font-mono">
                {[1, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                      playbackSpeed === spd ? 'bg-[#FF6B5B] text-black font-bold' : 'text-white/60'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Mute Toggle */}
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className={`p-2 rounded-full border transition cursor-pointer ${
                  isAudioMuted ? 'bg-[#FF5C5C]/20 border-[#FF5C5C]/40 text-[#FF5C5C]' : 'bg-white/10 border-white/10 text-white'
                }`}
                title={isAudioMuted ? 'Unmute voice' : 'Mute voice'}
              >
                {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="p-4 rounded-[20px] bg-[#141416] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Brand Filter */}
              <div className="flex items-center gap-1.5 text-[12px] font-sans">
                <span className="text-white/50 text-[11px]">Brand:</span>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="rounded-full bg-black border border-white/20 px-3 py-1 text-white text-[12px] focus:outline-none focus:border-[#FF6B5B] cursor-pointer"
                >
                  <option value="all">All Brands ({DUMMY_BRAND_STORIES.length})</option>
                  <option value="Amul">Amul</option>
                  <option value="Maggi">Maggi</option>
                  <option value="Parle-G">Parle-G</option>
                  <option value="Surf Excel">Surf Excel</option>
                  <option value="Tata Tea">Tata Tea</option>
                  <option value="Haldiram's">Haldiram's</option>
                  <option value="Dettol">Dettol</option>
                  <option value="Britannia">Britannia</option>
                </select>
              </div>

              {/* City Filter */}
              <div className="flex items-center gap-1.5 text-[12px] font-sans">
                <span className="text-white/50 text-[11px]">City:</span>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="rounded-full bg-black border border-white/20 px-3 py-1 text-white text-[12px] focus:outline-none focus:border-[#FF6B5B] cursor-pointer"
                >
                  <option value="all">All 10 Cities</option>
                  {TEN_CITIES_FMCG_DATA.map((c) => (
                    <option key={c.id} value={c.cityName}>
                      {c.cityName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sentiment Filter */}
              <div className="flex items-center gap-1.5 text-[12px] font-sans">
                <span className="text-white/50 text-[11px]">Tone:</span>
                <select
                  value={sentimentFilter}
                  onChange={(e) => setSentimentFilter(e.target.value)}
                  className="rounded-full bg-black border border-white/20 px-3 py-1 text-white text-[12px] focus:outline-none focus:border-[#FF6B5B] cursor-pointer"
                >
                  <option value="all">All Tones</option>
                  <option value="positive">Positive & Affection</option>
                  <option value="neutral">Habits & Rituals</option>
                  <option value="critical">Friction & Price Shock</option>
                </select>
              </div>
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-60">
              <Search size={13} className="absolute left-3 top-2.5 text-white/40" />
              <input
                type="text"
                placeholder="Search biscuit, butter, price..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-black border border-white/20 pl-8 pr-3 py-1.5 text-[12px] text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B5B]"
              />
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredStories.map((story) => {
              const isPlaying = playingStoryId === story.id;

              return (
                <div
                  key={story.id}
                  className={`rounded-[22px] p-5 flex flex-col justify-between transition border cursor-pointer ${
                    isPlaying
                      ? 'bg-[#18181B] border-[#FF6B5B] shadow-xl ring-1 ring-[#FF6B5B]/50'
                      : 'bg-[#141416] border-white/10 hover:border-white/20 hover:bg-[#18181B]'
                  }`}
                  onClick={() => setDetailModalStory(story)}
                >
                  <div>
                    {/* Header: Brand badge + City + Duration */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B5B] text-black font-sans font-bold text-[11px]">
                          {story.brand}
                        </span>
                        <span className="text-[10px] font-mono text-white/60 bg-white/5 px-2 py-0.5 rounded-full">
                          {story.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[10px] text-white/50">
                        <span>{story.city}</span>
                        <span>•</span>
                        <span>0:{story.audioDurationSeconds < 10 ? `0${story.audioDurationSeconds}` : story.audioDurationSeconds}</span>
                      </div>
                    </div>

                    {/* Story Title & Demographics */}
                    <div className="mt-3">
                      <h4 className="font-display text-[18px] text-white leading-snug group-hover:text-[#FF6B5B] transition">
                        {story.title}
                      </h4>
                      <div className="text-[11px] font-sans text-white/50 mt-1">
                        {story.speaker.demographic} • {story.speaker.age} yrs • {story.speaker.archetype}
                      </div>
                    </div>

                    {/* Verbatim Excerpt */}
                    <div className="mt-3 p-3 rounded-[14px] bg-black/40 border border-white/5">
                      <p className="font-sans text-[12px] text-white/80 leading-relaxed italic line-clamp-3">
                        "{story.transcriptEn}"
                      </p>
                    </div>

                    {/* Actionable FMCG Brand Manager Takeaway */}
                    <div className="mt-3 text-[11px] font-sans text-white/70 flex items-start gap-1.5">
                      <span className="text-[#FF6B5B] font-bold">Action:</span>
                      <span className="line-clamp-1">{story.brandManagerAction}</span>
                    </div>
                  </div>

                  {/* Audio Playing Bar & Play CTA */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => playSimulatedVoiceNote(story)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold font-sans flex items-center gap-1.5 transition cursor-pointer ${
                          isPlaying
                            ? 'bg-[#FF6B5B] text-black shadow-md'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Pause size={12} />
                            <span>Pause Voice</span>
                          </>
                        ) : (
                          <>
                            <Play size={12} className="ml-0.5" />
                            <span>Listen to Story</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDetailModalStory(story)}
                        className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 text-[11px] font-sans cursor-pointer"
                      >
                        Full Transcript →
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-white/50">
                      <span>👏 {story.claps}</span>
                      <span>•</span>
                      <span>{story.date}</span>
                    </div>
                  </div>

                  {/* Live Progress Bar if playing */}
                  {isPlaying && (
                    <div className="mt-2 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${audioProgress}%` }}
                        className="bg-[#FF6B5B] h-full transition-all duration-200"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredStories.length === 0 && (
            <div className="p-8 rounded-[24px] bg-[#141416] border border-white/10 text-center space-y-2">
              <div className="text-[#FF6B5B] font-bold text-lg">No Stories Matching Current Filters</div>
              <p className="font-sans text-[12px] text-white/60">Try resetting brand or city filters to view more FMCG voice notes.</p>
              <button
                onClick={() => { setBrandFilter('all'); setCityFilter('all'); setSentimentFilter('all'); setSearchQuery(''); }}
                className="mt-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-[12px]"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INITIATE ANONYMOUS MARKET RESEARCH STUDY STUDIO */}
      {/* ========================================================================= */}
      {activeTab === 'initiate_study' && (
        <div className="mt-6 space-y-6">
          <form onSubmit={handleDeployAnonymousStudy} className="space-y-6">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
              {/* Left Column: Study Configuration Parameters */}
              <div className="rounded-[26px] bg-[#141416] border border-white/10 p-6 space-y-6">
                <div>
                  <h3 className="font-display text-[22px] text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-[#FF6B5B]" />
                    Design Anonymous City Study
                  </h3>
                  <p className="font-sans text-[12px] text-white/60 mt-1">
                    Deploy an anonymous question or behavioral probe into the Aur Sunao community in specific cities.
                    Our participants share uninhibited audio notes without corporate scrutiny fear.
                  </p>
                  <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-[#FF6B5B]/15 to-[#FF8E53]/10 border border-[#FF6B5B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-[12px] text-white/90">
                      <span className="font-bold text-[#FF6B5B]">Need Population vs. Users Modeling?</span> Calculate exact budget based on city populations, category penetration, and print a full pitch report.
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('cost_estimator')}
                      className="px-3.5 py-1.5 rounded-full bg-[#FF6B5B] text-black font-bold text-[11px] shrink-0 hover:brightness-110 transition cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                    >
                      <FileCheck2 size={12} />
                      <span>Open Cost Estimator & Pitch</span>
                    </button>
                  </div>
                </div>

                {/* Step 1: Select Brand & FMCG Category */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60">
                    Step 1: FMCG Brand & Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[11px] text-white/50 mb-1 font-sans">Brand Name</span>
                      <select
                        value={studyBrand}
                        onChange={(e) => setStudyBrand(e.target.value)}
                        className="w-full rounded-xl bg-black border border-white/20 p-3 text-[13px] text-white focus:outline-none focus:border-[#FF6B5B] cursor-pointer"
                      >
                        <option value="Amul">Amul (Dairy & Foods)</option>
                        <option value="Maggi">Maggi (Nestlé)</option>
                        <option value="Parle-G">Parle-G</option>
                        <option value="Surf Excel">Surf Excel (HUL)</option>
                        <option value="Tata Tea">Tata Tea</option>
                        <option value="Britannia">Britannia</option>
                        <option value="Haldiram's">Haldiram's</option>
                        <option value="Dettol">Dettol (Reckitt)</option>
                        <option value="Colgate">Colgate-Palmolive</option>
                        <option value="Aashirvaad">Aashirvaad (ITC)</option>
                        <option value="Custom">+ Other FMCG Brand (Custom)</option>
                      </select>
                    </div>

                    {studyBrand === 'Custom' ? (
                      <div>
                        <span className="block text-[11px] text-white/50 mb-1 font-sans">Enter Brand Name</span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mamaearth / Everest"
                          value={customBrandName}
                          onChange={(e) => setCustomBrandName(e.target.value)}
                          className="w-full rounded-xl bg-black border border-white/20 p-3 text-[13px] text-white focus:outline-none focus:border-[#FF6B5B]"
                        />
                      </div>
                    ) : (
                      <div>
                        <span className="block text-[11px] text-white/50 mb-1 font-sans">FMCG Vertical</span>
                        <select
                          value={studyCategory}
                          onChange={(e) => setStudyCategory(e.target.value)}
                          className="w-full rounded-xl bg-black border border-white/20 p-3 text-[13px] text-white focus:outline-none focus:border-[#FF6B5B] cursor-pointer"
                        >
                          <option value="Dairy & Beverages">Dairy & Beverages</option>
                          <option value="Packaged Foods">Packaged Foods & Noodles</option>
                          <option value="Biscuits & Snacks">Biscuits, Bakery & Snacks</option>
                          <option value="Home Care">Home Care & Detergents</option>
                          <option value="Personal Care">Personal Care & Hygiene</option>
                          <option value="Staples & Spices">Staples, Atta & Spices</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Target City Selection (Multi-select from 10 Cities) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60">
                      Step 2: Target Cities ({selectedStudyCities.length} Selected)
                    </label>
                    <span className="text-[11px] font-mono text-[#25D366] flex items-center gap-1.5">
                      <span>{dynamicStudyCalculation.totalCalculatedUnits.toLocaleString('en-IN')} Total Units</span>
                      <button
                        type="button"
                        onClick={handleRerollCalculations}
                        title="Re-roll randomized calculation"
                        className="p-1 hover:text-white transition cursor-pointer"
                      >
                        <Dice5 size={12} className="text-[#FF6B5B]" />
                      </button>
                    </span>
                  </div>

                  <p className="font-sans text-[11px] text-white/50">
                    Select any combination of the 10 monitored cities. All cities exceed data point threshold (&gt;1,000 verified stories).
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {TEN_CITIES_FMCG_DATA.map((city) => {
                      const isChecked = selectedStudyCities.includes(city.id);
                      return (
                        <div
                          key={city.id}
                          onClick={() => toggleStudyCity(city.id)}
                          className={`p-3 rounded-[16px] border transition cursor-pointer flex flex-col justify-between ${
                            isChecked
                              ? 'bg-[#FF6B5B]/15 border-[#FF6B5B] text-white'
                              : 'bg-black/40 border-white/10 text-white/60 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[13px] text-white">{city.cityName}</span>
                            <span
                              className={`w-4 h-4 rounded-full text-[10px] grid place-items-center ${
                                isChecked ? 'bg-[#FF6B5B] text-black font-bold' : 'bg-white/10 text-white/40'
                              }`}
                            >
                              {isChecked ? '✓' : '+'}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono mt-1 text-white/50">
                            {city.dataPointsCount.toLocaleString('en-IN')} stories • {city.studyScopeUnits.toLocaleString('en-IN')} units
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Research Objective & Probe Focus */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60">
                    Step 3: Market Research Focus
                  </label>
                  <select
                    value={studyObjective}
                    onChange={(e) => setStudyObjective(e.target.value)}
                    className="w-full rounded-xl bg-black border border-white/20 p-3 text-[13px] text-white focus:outline-none focus:border-[#FF6B5B] cursor-pointer"
                  >
                    <option value="Voice of Consumer & Shrinkflation Friction Audit">
                      Voice of Consumer & Shrinkflation / Pack Weight Friction Audit
                    </option>
                    <option value="Switching Velocity to Regional / Private Labels">
                      Competitor Switching Triggers (Kirana Recommendation vs App Discounts)
                    </option>
                    <option value="Breakfast & Evening Snack Consumption Unfiltered Rituals">
                      Daily Consumption Rituals (Timing, Family Sharing, Cooking Hacks)
                    </option>
                    <option value="Packaging Usability & Climate Durability (Monsoon / Humidity)">
                      Packaging Usability, Resealability & Humidity Deterioration
                    </option>
                    <option value="Brand Authenticity & Generational Sentiment Shift">
                      Generational Drift: Why Gen Z/Millennials are questioning legacy brands
                    </option>
                  </select>
                </div>

                {/* Step 4: Anonymous Prompt Formulated for Consumers */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60">
                    Step 4: Anonymous Community Question / Audio Prompt
                  </label>
                  <textarea
                    rows={3}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Enter the raw question consumers will hear in their private voice booth..."
                    className="w-full rounded-xl bg-black border border-white/20 p-3 text-[13px] text-white focus:outline-none focus:border-[#FF6B5B] resize-none"
                  />
                  <div className="text-[10px] font-mono text-white/40">
                    Prompt will be voiced in Hindi & English depending on participant preferred language.
                  </div>
                </div>

                {/* Step 5: Study Duration */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60">
                    Step 5: Study Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { months: 1, label: '1 Month (Rapid Pulse)' },
                      { months: 2, label: '2 Months (Standard)' },
                      { months: 3, label: '3 Months (Deep Longitudinal)' },
                    ].map((opt) => (
                      <button
                        key={opt.months}
                        type="button"
                        onClick={() => setStudyDurationMonths(opt.months)}
                        className={`p-3 rounded-[16px] border text-center transition cursor-pointer ${
                          studyDurationMonths === opt.months
                            ? 'bg-white text-black font-bold border-white shadow-md'
                            : 'bg-black/40 text-white/70 border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <div className="font-display text-[16px]">{opt.months} Mo</div>
                        <div className="text-[10px] font-mono opacity-75">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Scope Calculation & Deployment Card */}
              <div className="space-y-4">
                <div className="rounded-[26px] bg-[#141416] border border-white/15 p-6 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-white/50 uppercase">
                      Dynamic Scope Breakdown
                    </span>
                    <button
                      type="button"
                      onClick={handleRerollCalculations}
                      className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FF6B5B] text-[10px] font-mono flex items-center gap-1 transition cursor-pointer"
                      title="Re-roll random seed based on cities and stories"
                    >
                      <Dice5 size={11} /> Re-roll
                    </button>
                  </div>

                  <h4 className="font-display text-[22px] text-white">
                    Research Units Summary
                  </h4>

                  {/* Mathematical Calculation Breakdown */}
                  <div className="mt-4 p-4 rounded-[18px] bg-black/50 border border-white/10 space-y-2.5 font-mono text-[12px]">
                    <div className="flex items-center justify-between text-white/70">
                      <span>Monitored Metros:</span>
                      <span className="text-white font-bold">{dynamicStudyCalculation.numCities} Cities</span>
                    </div>

                    <div className="flex items-center justify-between text-white/70">
                      <span>Verified Consumer Stories:</span>
                      <span className="text-white font-bold">{dynamicStudyCalculation.numStories.toLocaleString('en-IN')} Stories</span>
                    </div>

                    <div className="flex items-center justify-between text-white/70">
                      <span>Study Duration:</span>
                      <span className="text-white font-bold">{studyDurationMonths} Month(s)</span>
                    </div>

                    <div className="flex items-center justify-between text-white/70">
                      <span>Acoustic Vectors:</span>
                      <span className="text-[#25D366]">{dynamicStudyCalculation.acousticIntelligenceVectors.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center justify-between text-white/70">
                      <span>Dialect Nodes:</span>
                      <span className="text-amber-400">{dynamicStudyCalculation.crossCityDialectNodes.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center justify-between text-white/70">
                      <span>Statistical Confidence:</span>
                      <span className="text-[#25D366] font-bold">{dynamicStudyCalculation.statisticalConfidencePct}%</span>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-baseline justify-between text-white">
                      <span className="font-sans font-bold text-[14px]">Total Research Units:</span>
                      <div className="text-right">
                        <span className="font-display text-[28px] text-[#FF6B5B] font-bold">
                          {dynamicStudyCalculation.totalCalculatedUnits.toLocaleString('en-IN')}
                        </span>
                        <div className="text-[10px] text-white/50 font-sans">
                          (~{dynamicStudyCalculation.unitsPerCity.toLocaleString('en-IN')} Units / City)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="mt-5 space-y-2 font-sans text-[12px] text-white/80">
                    <div className="font-bold text-[11px] uppercase tracking-wider text-white/50 font-mono">
                      What Brand Managers Receive:
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-[#25D366] shrink-0 mt-0.5" />
                      <span><b>{selectedStudyCities.length * 150 * studyDurationMonths}+ Raw Audio Transcripts</b> from verified consumers in selected cities.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-[#25D366] shrink-0 mt-0.5" />
                      <span><b>Emotion Valence & Somatic Strain Index</b> (Pinpoint exactly what triggers buyer regret or product anger).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-[#25D366] shrink-0 mt-0.5" />
                      <span><b>Bi-Weekly Synthesized FMCG Intelligence Dossier</b> ready for brand & packaging design teams.</span>
                    </div>
                  </div>

                  {/* Corporate Contact Email Input */}
                  <div className="mt-5">
                    <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1 font-mono">
                      Corporate Work Email for Dossier Delivery
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="brand.lead@unilever.com / nestle.com"
                      value={contactCorporateEmail}
                      onChange={(e) => setContactCorporateEmail(e.target.value)}
                      className="w-full rounded-xl bg-black border border-white/20 px-3.5 py-2.5 text-white text-[12px] focus:outline-none focus:border-[#FF6B5B]"
                    />
                  </div>

                  {/* Deploy Button */}
                  <button
                    type="submit"
                    disabled={isDeployingStudy}
                    className="mt-6 w-full h-12 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black font-sans text-[13px] font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isDeployingStudy ? (
                      <span>Deploying Field Study to Aur Sunao Community...</span>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Deploy Anonymous Study ({dynamicStudyCalculation.totalCalculatedUnits.toLocaleString('en-IN')} Units)</span>
                      </>
                    )}
                  </button>

                  <div className="mt-3 text-center text-[10px] font-mono text-white/40">
                    Dynamic scope calculation generated algorithmically across {dynamicStudyCalculation.numCities} cities &amp; {dynamicStudyCalculation.numStories.toLocaleString('en-IN')} consumer stories.
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ACTIVE STUDIES TRACKER */}
      {/* ========================================================================= */}
      {activeTab === 'active_studies' && (
        <div className="mt-6 space-y-6">
          <div className="p-4 rounded-[22px] bg-[#141416] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-[18px] text-white flex items-center gap-2">
                <Activity size={16} className="text-[#25D366]" />
                Active FMCG Market Research Operations
              </h3>
              <p className="font-sans text-[12px] text-white/60">
                Tracking live anonymous field studies deployed across target cities.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('initiate_study')}
              className="px-4 py-2 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black font-sans text-[12px] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={13} />
              <span>+ Initiate New Study</span>
            </button>
          </div>

          <div className="space-y-4">
            {activeStudies.map((study) => (
              <div
                key={study.id}
                className="rounded-[24px] bg-[#141416] border border-white/10 p-5 md:p-6 space-y-4 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded-full">
                        {study.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          study.status === 'In Fieldwork'
                            ? 'bg-amber-400/20 text-amber-400'
                            : 'bg-[#2E7D32]/20 text-[#25D366]'
                        }`}
                      >
                        {study.status}
                      </span>
                    </div>

                    <h4 className="font-display text-[20px] text-white mt-1">
                      {study.brandName} • {study.category}
                    </h4>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-mono text-white/50">Total Study Scope</div>
                    <div className="font-display text-[22px] text-[#FF6B5B] font-bold">
                      {study.totalStudyUnits.toLocaleString('en-IN')} Units
                    </div>
                    <div className="text-[10px] font-mono text-white/40">
                      {study.targetCities.length} Cities × {study.durationMonths} Mo ({study.studyUnitsPerCity.toLocaleString('en-IN')} units/city)
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-[12px] font-sans">
                  <div>
                    <span className="block text-[11px] font-mono text-white/50 uppercase">Research Objective</span>
                    <p className="text-white/80 mt-0.5 leading-relaxed">{study.objective}</p>
                  </div>

                  <div>
                    <span className="block text-[11px] font-mono text-white/50 uppercase">Anonymous Community Prompt</span>
                    <p className="text-white/80 mt-0.5 italic leading-relaxed">"{study.anonymousPrompt}"</p>
                  </div>
                </div>

                {/* Cities and Progress */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-white/50">Target Cities:</span>
                    {study.targetCities.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-full bg-white/10 text-white">
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, Math.round((study.incomingDataPoints / study.targetDataPoints) * 100))}%` }}
                        className="bg-[#25D366] h-full"
                      />
                    </div>
                    <span className="text-white/70">
                      {study.incomingDataPoints} / {study.targetDataPoints} stories ({Math.min(100, Math.round((study.incomingDataPoints / study.targetDataPoints) * 100))}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SYNTHETIC ICP BUILDER TAB */}
      {/* ========================================================================= */}
      {activeTab === 'synthetic_builder' && (
        <div className="mt-8">
          <SyntheticIcpBuilder />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SYNTHETIC ICP AVATARS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'synthetic_avatars' && (
        <div className="mt-8">
          <SyntheticIcpAvatars lang={lang} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* AD REACTION LAB TAB */}
      {/* ========================================================================= */}
      {activeTab === 'ad_reaction_lab' && (
        <div className="mt-8">
          <AdReactionLab
            lang={lang}
            onSimulationComplete={(res) => {
              setLastSimulationResults(res);
              setLastSimulationExperimentId(`exp-${Date.now()}`);
              setActiveTab('research_report');
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SYNTHETIC PERSONA GENERATOR TAB */}
      {/* ========================================================================= */}
      {activeTab === 'synthetic_persona_generator' && (
        <div className="mt-8">
          <PersonaGenerator />
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESEARCH WORKSPACE TAB */}
      {/* ========================================================================= */}
      {activeTab === 'research_workspace' && (
        <div className="mt-8">
          <ResearchWorkspaceManager />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENARIO SIMULATOR TAB */}
      {/* ========================================================================= */}
      {activeTab === 'scenario_simulator' && (
        <div className="mt-8">
          <ScenarioSimulator />
        </div>
      )}

      {/* ========================================================================= */}
      {/* ALGORITHMIC EMPATHY MATCHER TAB */}
      {/* ========================================================================= */}
      {activeTab === 'algorithmic_empathy_matcher' && (
        <div className="mt-8">
          <AlgorithmicEmpathyMatcher
             userVentText="I'm feeling overwhelmed by the pressure to succeed in my career and feel like I'm losing touch with my true passions."
             candidateStories={[]} 
             lang={lang}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* BIOMETRIC EMOTION SYNC TAB */}
      {/* ========================================================================= */}
      {activeTab === 'biometric_emotion_sync' && (
        <div className="mt-8">
          <BiometricEmotionSync
            customBpmThreshold={110}
            lang={lang}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* STORY KNOWLEDGE GRAPH TAB */}
      {/* ========================================================================= */}
      {activeTab === 'story_knowledge_graph' && (
        <div className="mt-8">
          <StoryKnowledgeGraph
            stories={[]} 
            lang={lang}
            onOpenStory={(s) => {
              setDetailModalStory(s);
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIVE INSTANT MOOD ANALYZER TAB */}
      {/* ========================================================================= */}
      {activeTab === 'live_instant_mood_analyzer' && (
        <div className="mt-8">
          <LiveInstantMoodAnalyzer
            text="I'm feeling overwhelmed by the pressure to succeed in my career and feel like I'm losing touch with my true passions."
            isLive={true}
            lang={lang}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESEARCH REPORT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'research_report' && (
        <div className="mt-8">
          <ResearchReportViewer simulationResults={lastSimulationResults} experimentId={lastSimulationExperimentId} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* BRAND VENT BOUNTIES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'vent_bounties' && (
        <div className="mt-8">
          <VentBounties
            user={{
              name: 'Enterprise FMCG Partner',
              anon: false,
              avatar: '🏢',
              creatorWalletBalance: 5000
            }}
            onSelectBountyForRecording={() => {
              // Switch to studio or close
            }}
            lang={lang}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* BRAND RESEARCH COST ESTIMATOR & PITCH REPORT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'cost_estimator' && (
        <div className="mt-8">
          <BrandResearchCostEstimator
            lang={lang}
            onDeployDirectly={(params) => {
              setStudySuccessNotification(
                `Proposal registered for ${params.brandName} (${params.cities.length} Cities, ₹${(params.totalCost / 100000).toFixed(2)} Lakhs)! Dossier and onboarding sent to ${params.contactEmail || 'your email'}.`
              );
              // Switch to active studies
              setTimeout(() => {
                setActiveTab('active_studies');
              }, 2500);
            }}
            onClose={onClose}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* STORY DETAIL MODAL (FULL VERBATIM & FMCG BRAND ANALYSIS) */}
      {/* ========================================================================= */}
      {detailModalStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 grid place-items-center">
          <div className="w-full max-w-[620px] max-h-[90vh] overflow-auto rounded-[28px] bg-[#141416] border border-white/15 text-white p-6 md:p-8 shadow-2xl space-y-5 fade-up">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B5B] text-black font-sans font-bold text-[11px]">
                    {detailModalStory.brand}
                  </span>
                  <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                    {detailModalStory.category}
                  </span>
                  <span className="text-[10px] font-mono text-white/50">
                    {detailModalStory.city} • {detailModalStory.speaker.demographic}
                  </span>
                </div>
                <h3 className="font-display text-[22px] md:text-[24px] text-white mt-2">
                  {detailModalStory.title}
                </h3>
              </div>

              <button
                onClick={() => setDetailModalStory(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white shrink-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Audio Play Trigger */}
            <div className="p-3.5 rounded-[18px] bg-black/60 border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => playSimulatedVoiceNote(detailModalStory)}
                  className="w-9 h-9 rounded-full bg-[#FF6B5B] text-black grid place-items-center hover:brightness-110 transition cursor-pointer shrink-0 shadow-md"
                >
                  {playingStoryId === detailModalStory.id ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                </button>
                <div>
                  <div className="text-[12px] font-sans font-bold text-white">
                    {playingStoryId === detailModalStory.id ? 'Playing Voice Recording' : 'Listen to Consumer Voice'}
                  </div>
                  <div className="text-[10px] font-mono text-white/50">
                    Duration: 0:{detailModalStory.audioDurationSeconds < 10 ? `0${detailModalStory.audioDurationSeconds}` : detailModalStory.audioDurationSeconds} • Recorded in {detailModalStory.city}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                100% Raw Speech
              </span>
            </div>

            {/* English Transcript */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                Verified English Audio Transcript
              </div>
              <div className="p-4 rounded-[16px] bg-black/40 border border-white/5 font-sans text-[13px] text-white/90 leading-relaxed">
                "{detailModalStory.transcriptEn}"
              </div>
            </div>

            {/* Hindi Transcript if present */}
            {detailModalStory.transcriptHi && (
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                  मूल हिंदी वार्तालाप (Original Hindi Excerpt)
                </div>
                <div className="p-4 rounded-[16px] bg-black/40 border border-white/5 font-sans text-[13px] text-white/80 leading-relaxed italic">
                  "{detailModalStory.transcriptHi}"
                </div>
              </div>
            )}

            {/* FMCG Strategic Action Item */}
            <div className="p-4 rounded-[18px] bg-[#FF6B5B]/15 border border-[#FF6B5B]/30 space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-[#FF6B5B] font-bold flex items-center gap-1.5">
                <Sparkles size={12} /> FMCG Brand Manager Actionable Takeaway
              </div>
              <p className="font-sans text-[12px] text-white/90 leading-relaxed">
                {detailModalStory.brandManagerAction}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="text-[11px] font-mono text-white/50">
                Data Point ID: {detailModalStory.id}
              </div>
              <button
                onClick={() => setDetailModalStory(null)}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans text-[12px] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
