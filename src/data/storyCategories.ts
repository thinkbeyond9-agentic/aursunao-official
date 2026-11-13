import { Story } from '../types';

export interface StoryCategory {
  id: string;
  name: string;
  nameHi: string;
  shortName: string;
  icon: string;
  color: string; // Hex color for D3 nodes & edges
  bgClass: string;
  borderClass: string;
  textClass: string;
  description: string;
  descriptionHi: string;
  keywords: string[];
  sampleThemeTags: string[];
}

export const STORY_CATEGORIES: StoryCategory[] = [
  {
    id: 'career-burnout',
    name: 'Career, Hustle & Workplace Burnout',
    nameHi: 'करियर, ऑफिस व कॉरपोरेट बर्नआउट',
    shortName: 'Workplace Burnout',
    icon: '💼',
    color: '#06B6D4', // Cyan
    bgClass: 'bg-cyan-500/15',
    borderClass: 'border-cyan-500/30',
    textClass: 'text-cyan-400',
    description: 'Tech sprint fatigue, PIP dread, office politics, AI displacement anxiety, toxic managers, and resignation dilemmas.',
    descriptionHi: 'ऑफिस पॉलिटिक्स, पीआईपी का डर, 14 घंटे की शिफ्ट, छंटनी की चिंता और इस्तीफा देने की कशमकश।',
    keywords: ['career', 'office', 'quit', 'manager', 'job', 'salary', 'resignation', 'tech', 'startup', 'pip', 'boss', 'hustle', 'promotion', 'engineer', 'client', 'founder', 'sprint'],
    sampleThemeTags: ['Office Politics', 'Resignation', 'PIP Dread', 'Overwork']
  },
  {
    id: 'family-duty',
    name: 'Family Duty, Elders & Remittance',
    nameHi: 'पारिवारिक कर्तव्य व माता-पिता का ऋण',
    shortName: 'Family & Duty',
    icon: '🏡',
    color: '#F59E0B', // Amber
    bgClass: 'bg-amber-500/15',
    borderClass: 'border-amber-500/30',
    textClass: 'text-amber-400',
    description: 'Aging parents, monthly remittances, joint family friction, parental sacrifices, and living up to family honor.',
    descriptionHi: 'बुजुर्ग माता-पिता, हर महीने घर पैसे भेजना, संयुक्त परिवार का दबाव और उम्मीदों का बोझ।',
    keywords: ['family', 'papa', 'father', 'mother', 'maa', 'remittance', 'in-laws', 'parents', 'sister', 'brother', 'duty', 'sacrifice', 'home', 'guilt'],
    sampleThemeTags: ['Remittance Guilt', 'Aging Parents', 'Filial Duty', 'Joint Family']
  },
  {
    id: 'solitude-insomnia',
    name: '3 AM Solitude, Grief & Overthinking',
    nameHi: '3 AM अकेलापन, शोक व गहरी रात की सोच',
    shortName: '3 AM Solitude',
    icon: '🌙',
    color: '#8B5CF6', // Violet/Purple
    bgClass: 'bg-purple-500/15',
    borderClass: 'border-purple-500/30',
    textClass: 'text-purple-400',
    description: 'Midnight insomnia, silent grief, existential drift, loneliness in big cities, and memories you cannot voice out loud.',
    descriptionHi: 'देर रात की घबराहट, शोक, अनकहा अकेलापन और वो बातें जो किसी से साझा नहीं हो पातीं।',
    keywords: ['lonely', 'night', '3am', 'grief', 'insomnia', 'silence', 'tears', 'crying', 'death', 'loss', 'memory', 'existential', 'alone', 'overthinking'],
    sampleThemeTags: ['Midnight Panic', 'Silent Grief', 'Loneliness', 'Existential Drift']
  },
  {
    id: 'relationships-marriage',
    name: 'Marriage, Love & Relationship Friction',
    nameHi: 'विवाह, दांपत्य व रिश्तों की उलझन',
    shortName: 'Marriage & Love',
    icon: '💍',
    color: '#EC4899', // Pink
    bgClass: 'bg-pink-500/15',
    borderClass: 'border-pink-500/30',
    textClass: 'text-pink-400',
    description: 'Marital silence, boundary friction with in-laws, emotional disconnect, unspoken domestic labor, and longing for warmth.',
    descriptionHi: 'शादी में बढ़ता फासला, सास-ससुर के साथ सीमाएं, घर के अदृश्य काम और अपनेपन की तलाश।',
    keywords: ['relationships', 'marriage', 'wife', 'husband', 'love', 'in-law', 'wedding', 'divorce', 'breakup', 'partner', 'domestic', 'affair', 'compromise'],
    sampleThemeTags: ['Marital Silence', 'In-law Boundaries', 'Domestic Labor', 'Emotional Distance']
  },
  {
    id: 'aspirations-failure',
    name: 'Exam Stakes, Ambition & Fear of Failure',
    nameHi: 'प्रतियोगी परीक्षाएं, महत्वाकांक्षा व असफलता का भय',
    shortName: 'Exams & Ambition',
    icon: '📚',
    color: '#EF4444', // Red
    bgClass: 'bg-red-500/15',
    borderClass: 'border-red-500/30',
    textClass: 'text-red-400',
    description: 'UPSC/GATE/IIT aspirants, Kota study cubicles, social comparison, repeat attempts, and terror of disappointing everyone.',
    descriptionHi: 'UPSC/GATE के अनगिनत प्रयास, कोटा के छोटे कमरे, रिश्तेदारों के ताने और पीछे छूट जाने का खौफ।',
    keywords: ['aspirant', 'exam', 'upsc', 'gate', 'study', 'kota', 'failure', 'rank', 'attempt', 'coaching', 'preparation', 'ambition', 'interview', 'student'],
    sampleThemeTags: ['Kota Pressure', 'UPSC Attempts', 'Fear of Disappointment', 'Exam Stakes']
  },
  {
    id: 'migration-identity',
    name: 'Tier-2 Migration, Identity & Belonging',
    nameHi: 'मेट्रो प्रवास, जड़ें व सांस्कृतिक पहचान',
    shortName: 'Migration & Roots',
    icon: '🏙️',
    color: '#10B981', // Emerald
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500/30',
    textClass: 'text-emerald-400',
    description: 'Small-town youth adjusting to metro alienation, English imposter syndrome, missing regional food, and dual identity struggle.',
    descriptionHi: 'छोटे शहर से बड़े महानगर का सफर, अंग्रेजी की झिझक, मां के हाथ के खाने की याद और परायापन।',
    keywords: ['migration', 'migrant', 'small-town', 'metro', 'bengaluru', 'mumbai', 'delhi', 'language', 'english', 'hometown', 'roots', 'identity', 'alienation', 'sattu', 'chai'],
    sampleThemeTags: ['Metro Alienation', 'Language Barrier', 'Hometown Nostalgia', 'Small Town Roots']
  },
  {
    id: 'healthcare-crisis',
    name: 'Healthcare Frontlines & Maternal Vigilance',
    nameHi: 'स्वास्थ्य सेवा फ्रंटलाइन व मातृत्व का तनाव',
    shortName: 'Healthcare & Caregiving',
    icon: '🩺',
    color: '#14B8A6', // Teal
    bgClass: 'bg-teal-500/15',
    borderClass: 'border-teal-500/30',
    textClass: 'text-teal-400',
    description: 'Medical residents in 36-hr shifts, ER emergencies, patient death, pediatric anxiety, and mothers bearing caregiving guilt.',
    descriptionHi: 'रेजिडेंट डॉक्टर्स की 36 घंटे की ड्यूटी, अस्पताल का तनाव और बच्चों की सेहत को लेकर मां की चिंता।',
    keywords: ['medical', 'doctor', 'resident', 'hospital', 'patient', 'pediatric', 'motherhood', 'toddler', 'nicu', 'emergency', 'shift', 'health', 'medicine', 'diabetic'],
    sampleThemeTags: ['Hospital Shifts', 'Patient Grief', 'Maternal Guilt', 'Caregiver Burnout']
  },
  {
    id: 'labor-dignity',
    name: 'Gig Economy, Labor & Financial Anxiety',
    nameHi: 'गिग इकोनॉमी, श्रम का सम्मान व आर्थिक संघर्ष',
    shortName: 'Labor & Money',
    icon: '🛵',
    color: '#FF6B5B', // Coral
    bgClass: 'bg-[#FF6B5B]/15',
    borderClass: 'border-[#FF6B5B]/30',
    textClass: 'text-[#FF6B5B]',
    description: 'Delivery partners in blistering heat, service lift indignity, rating anxiety, fuel costs, rent hikes, and real rupee survival.',
    descriptionHi: 'डिलीवरी राइडर्स, ट्रैफिक की मार, ईएमआई का तनाव और बड़े शहरों में बुनियादी सम्मान की लड़ाई।',
    keywords: ['gig-worker', 'rider', 'delivery', 'money', 'rent', 'debt', 'emi', 'bike', 'labor', 'society', 'guard', 'rating', 'monsoon', 'fuel', 'dignity'],
    sampleThemeTags: ['Delivery Riders', 'Rent & Debt', 'Service Lift Indignity', 'Dignity of Labor']
  }
];

export const CATEGORY_MAP: Record<string, StoryCategory> = STORY_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  },
  {} as Record<string, StoryCategory>
);

/**
 * Classifies a story into its best-fitting Category based on story attributes.
 */
export function getStoryCategory(story: Story): StoryCategory {
  // 1. Check direct cohort / icpPersona
  if (story.icpPersona) {
    if (story.icpPersona === 'tech' || story.icpPersona === 'founder' || story.icpPersona === 'manager' || story.icpPersona === 'creative') {
      return CATEGORY_MAP['career-burnout'];
    }
    if (story.icpPersona === 'aspirant') {
      return CATEGORY_MAP['aspirations-failure'];
    }
    if (story.icpPersona === 'migrant') {
      return CATEGORY_MAP['migration-identity'];
    }
    if (story.icpPersona === 'medical') {
      return CATEGORY_MAP['healthcare-crisis'];
    }
    if (story.icpPersona === 'relationship') {
      return CATEGORY_MAP['relationships-marriage'];
    }
    if (story.icpPersona === 'gig-worker') {
      return CATEGORY_MAP['labor-dignity'];
    }
  }

  // 2. Check type
  if (story.type === 'career' || story.type === 'entrepreneurship') {
    return CATEGORY_MAP['career-burnout'];
  }
  if (story.type === 'relationships') {
    return CATEGORY_MAP['relationships-marriage'];
  }
  if (story.type === 'family') {
    return CATEGORY_MAP['family-duty'];
  }
  if (story.type === 'money') {
    return CATEGORY_MAP['labor-dignity'];
  }

  // 3. Check mood / emotion
  if (story.mood === 'lonely' || story.emotion === 'lonely' || story.mood === 'grief' || story.emotion === 'grief') {
    return CATEGORY_MAP['solitude-insomnia'];
  }
  if (story.mood === 'migration' || story.mood === 'small-town') {
    return CATEGORY_MAP['migration-identity'];
  }

  // 4. Keyword scan across title, hook, themes, transcript
  const textBlob = `${story.title} ${story.hook} ${(story.themes || []).join(' ')} ${story.transcript || ''} ${story.structured?.emotion || ''} ${story.structured?.setting || ''}`.toLowerCase();

  for (const cat of STORY_CATEGORIES) {
    for (const kw of cat.keywords) {
      if (textBlob.includes(kw)) {
        return cat;
      }
    }
  }

  // Default fallback
  if (story.mood === 'burnout') return CATEGORY_MAP['career-burnout'];
  if (story.mood === 'anxious') return CATEGORY_MAP['solitude-insomnia'];

  return CATEGORY_MAP['career-burnout'];
}
