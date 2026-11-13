export interface PracticalOutputs {
  professionalDraft?: {
    subject: string;
    body: string;
    audience: string;
  };
  habitChecklist?: {
    title: string;
    items: { id: string; action: string; timeFrame: string; why: string; completed?: boolean }[];
  };
}

export interface InstantMoodData {
  state?: string;
  intensity?: number;
  primaryMood: string;
  primaryMoodEmoji: string;
  intensityScore: number; // 0 - 100
  secondaryMood?: string;
  valence: 'negative' | 'cathartic' | 'neutral' | 'positive';
  activationLevel: 'high' | 'moderate' | 'low';
  somaticIndicators: string[]; // e.g. "Rapid speech tempo", "Vocal constriction"
  detectedKeywords: string[];
  instantInsight: string;
  instantInsightHi?: string;
  calmingAnchor: string;
}

export interface IcpPerson {
  id: string;
  name: string;
  icpCategory: string; // 'founder' | 'tech' | 'medical' | 'aspirant' | 'creative' | 'migrant' | 'relationship' | 'manager'
  age: string;
  city: string;
  occupation: string;
  avatarColor: string;
  bio: string;
  storyCount: number;
}

export interface IcpCohort {
  id: string;
  name: string;
  nameHi: string;
  icon: string;
  badgeColor: string;
  description: string;
}

export interface Story {
  id: string;
  createdAt?: number;
  title: string;
  titleHi: string;
  hook: string;
  hookHi: string;
  emotion: string;
  mood: string;
  type: string;
  themes: string[];
  location: string;
  age: string;
  claps: number;
  helped: number;
  buyRequests: number;
  anonymous: boolean;
  author: string;
  transcript: string;
  structured: {
    people: string;
    setting: string;
    emotion: string;
    conflict: string;
    turning: string;
    insight: string;
    narrative: string;
    narrativeHi: string;
  };
  tweet?: string;
  source?: 'web' | 'whatsapp';
  practicalOutputs?: PracticalOutputs;
  icpPersona?: string;
  personId?: string;
  instantMoodAnalysis?: InstantMoodData;
}

export interface UserState {
  name: string;
  anon: boolean;
  avatar: string;
  isRegistered?: boolean;
  email?: string;
  loyaltyPointsBalance?: number;
  creatorWalletBalance?: number;
  completedBountiesCount?: number;
}

// 1. Synthetic ICP Avatar Types
export interface AvatarVentStory {
  id: string;
  title: string;
  situation: string;
  timestamp: string;
  audioDuration: string;
  transcript: string;
  emotionalTension: string;
  brandTrigger: string;
  acceptedTones: string[];
  pushbackTones: string[];
}

export interface SyntheticAvatar {
  id: string;
  name: string;
  cohortId: string;
  cohortName: string;
  city: string;
  age: number;
  occupation: string;
  avatarEmoji: string;
  accentColor: string;
  bio: string;
  trainedVentsCount: number;
  sampleVentSnippets: string[];
  tone: string;
  culturalFrictions: string[];
  buyingRituals: string[];
  incomeTier?: string;
  lifestyleConstraint?: string;
  stories?: AvatarVentStory[];
  pitchAcceptanceCriteria?: {
    mustHave: string[];
    dealBreakers: string[];
    winningSlogans: string[];
    pushbackSlogans: string[];
  };
}

export interface AvatarFeedback {
  resonanceScore: number; // 0 - 100
  verdict: 'High Resonance' | 'Skeptical / Needs Work' | 'Strong Cultural Pushback' | 'Alienating';
  avatarQuote: string;
  pushbackPoints: string[];
  authenticReframing: string;
  culturalInsight: string;
  emotionalTriggers: string[];
  acceptanceSignals?: string[];
  recommendedSlogans?: {
    style: string;
    slogan: string;
    rationale: string;
  }[];
  socialMediaReaction?: {
    platform: string;
    simulatedComment: string;
    sentiment: 'positive' | 'negative' | 'mixed';
  }[];
}

// 2. Biometric Emotion Sync Types
export type WearableDeviceType = 'apple_watch' | 'whoop' | 'fitbit' | 'simulated';

export interface BiometricReading {
  timeSec: number;
  heartRate: number; // BPM
  hrv: number; // HRV in ms (SDNN / RMSSD)
  stressIndex: number; // 0 - 100
  isStressSpike: boolean;
  spikeReason?: string;
}

export interface BiometricSyncSession {
  device: WearableDeviceType;
  deviceName: string;
  connected: boolean;
  baselineHeartRate: number;
  peakHeartRate: number;
  averageHrv: number;
  totalStressSpikes: number;
  readings: BiometricReading[];
  neuromarketingScore: {
    verbalPhysioCorrelation: number; // 0 - 100%
    latentEmotionalIntensity: 'High' | 'Moderate' | 'Low';
    peakVulnerabilityTimestamp: string;
    actionableAdInsight: string;
  };
}

// 3. Brand-Sponsored Vent Bounties
export interface VentBounty {
  id: string;
  brandName: string;
  brandCategory: string;
  brandLogo: string;
  bountyRewardPoints: number;
  bountyRewardRupees?: number;
  targetEmotion: string;
  promptTitle: string;
  promptDescription: string;
  targetCities: string[];
  maxQuota: number;
  claimedQuota: number;
  sponsoredByCorporate: boolean;
  status: 'active' | 'closing_soon' | 'completed';
  sampleQuestion: string;
  payoutTimeframe: string;
}

// 4. Algorithmic Empathy Matching
export interface EmpathyMatchResult {
  matchScore: number; // e.g. 96%
  matchedStory: Story;
  sharedEmotionalTheme: string;
  sharedTurningPoint: string;
  survivorWisdom: string;
  empathyBridgeQuote: string;
  resonanceDimensions: string[];
  timeGapInMonths: number;
  peerCity: string;
}

// 5. Synthetic ICP Research Engine Types
export interface IcpDimension {
  id: string;
  name: string;
  options: string[];
}

export interface IcpAttribute {
  dimensionId: string;
  value: string;
}

export interface IcpConfiguration {
  id: string;
  name: string;
  attributes: IcpAttribute[];
  sampleSize: number;
  quotaManagement: { [key: string]: number };
}

export interface IcpSegment {
  id: string;
  name: string;
  configuration: IcpConfiguration;
}

export interface SyntheticPersona {
  id: string;
  name: string;
  attributes: { [key: string]: string };
  bio: string;
  generationSeed: number;
  confidenceScore: number;
  provenance: PersonaProvenance;
}

export interface PersonaProvenance {
  model: string;
  timestamp: number;
  seed: number;
}

export interface BrandResearchWorkspace {
  id: string;
  brandName: string;
  brandCategory: string;
  productDescription: string;
  targetAudience: string;
}

export interface CreativeVariant {
  id: string;
  type: 'headline' | 'copy' | 'cta';
  content: string;
}

export interface ResearchScenario {
  id: string;
  title: string;
  context: string;
}

export interface ExperimentConfiguration {
  id: string;
  name: string;
  workspaceId: string;
  targetSegments: IcpSegment[];
  creativeVariants: CreativeVariant[];
  scenario: ResearchScenario;
}

export interface SimulationRun {
  id: string;
  experimentId: string;
  timestamp: number;
  results: PersonaReaction[];
}

export interface PersonaReaction {
  personaId: string;
  reactionScore: number;
  rationale: string;
  objections: string[];
}

export interface SegmentInsight {
  segmentId: string;
  theme: string;
}

export interface ResearchReport {
  id: string;
  experimentId: string;
  summary: string;
  insights: SegmentInsight[];
}


