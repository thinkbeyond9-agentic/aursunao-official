import React, { useState } from 'react';
import { SyntheticAvatar, AvatarFeedback } from '../types';
import { 
  Sparkles, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  MessageSquare, 
  Bot, 
  User, 
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  Sliders,
  ChevronRight,
  Volume2
} from 'lucide-react';

interface SyntheticIcpAvatarsProps {
  lang?: 'en' | 'hi';
}

const SEED_AVATARS: SyntheticAvatar[] = [
  {
    id: 'avatar-tier2-migrant',
    name: 'Priya Verma',
    cohortId: 'migrant',
    cohortName: 'Tier-2 City Migrants in Metros',
    city: 'Bengaluru (migrated from Patna)',
    age: 26,
    occupation: 'QA Analyst at Fintech Startup',
    avatarEmoji: '🎒',
    accentColor: '#FF6B5B',
    bio: 'Lives in a shared flat in BTM Layout. Sends 35% of monthly salary home to parents. Navigates guilt over ₹350 cold brews while missing mustard fish curry cooked by her dadi.',
    trainedVentsCount: 382,
    sampleVentSnippets: [
      'My flatmate orders Swiggy Gourmet every evening like it is normal; I wash plastic dabbas to reuse them.',
      'Mom thinks working in Bengaluru means I am rich. She does not know how much deposit took away.',
      'I pretend I love artisanal espresso at office, but 6 PM tea tapri is the only thing keeping me sane.'
    ],
    tone: 'Bilingual Hinglish, grounded, sharp eye for artificial corporate posturing, sentimental about family.',
    culturalFrictions: [
      'Alienated by ads showing huge glass-walled duplexes as "relatable homes".',
      'Extremely skeptical of "lifestyle tax" (paying 3x price just for pastel minimalist packaging).',
      'Deep emotional trigger around parental pride and remittance sacrifices.'
    ],
    buyingRituals: [
      'Compares gram-for-gram price on Zepto/Blinkit before clicking buy.',
      'Buys luxury skincare only during Diwali sales or with credit card points.',
      'Prefers products that remind her of home ingredients (haldi, sarson, tulsi).'
    ]
  },
  {
    id: 'avatar-startup-burnout',
    name: 'Rohan Deshmukh',
    cohortId: 'tech',
    cohortName: 'Burnt-Out IT / Startup Engineers',
    city: 'Pune / HSR Layout',
    age: 29,
    occupation: 'Senior Backend Engineer',
    avatarEmoji: '💻',
    accentColor: '#4A90E2',
    bio: 'Earns 28 LPA but suffers from chronic insomnia and Sunday evening dread. Constantly checks Slack under the dinner table. Cynical about corporate "mental health webinars".',
    trainedVentsCount: 419,
    sampleVentSnippets: [
      'We had a "wellness session" on Thursday and on Friday my director scheduled a release deploy for 11 PM.',
      'My Apple Watch pinged a high heart rate alert while I was silently reading an escalation email.',
      'I buy expensive noise-canceling headphones just to not hear the hum of my own thoughts.'
    ],
    tone: 'Sardonic, dry tech humor, exhausted, appreciative of genuine no-BS transparency.',
    culturalFrictions: [
      'Hates "hustle hard" and "crush it" slogans with passion.',
      'Cynical about health drinks promising instant energy without fixing sleep.',
      'Prefers functional specs over emotional marketing fluff.'
    ],
    buyingRituals: [
      'Researches Reddit (r/developersIndia, r/bangalore) before buying anything over ₹2,000.',
      'Buys high-end sleep hygiene items (weighted blankets, magnesium spray, blackout curtains).'
    ]
  },
  {
    id: 'avatar-tier2-homemaker',
    name: 'Ananya Ghosh',
    cohortId: 'creative',
    cohortName: 'Tier-2 FMCG Homemakers & Shoppers',
    city: 'Indore / Lucknow',
    age: 34,
    occupation: 'Home Manager & Freelance Content Creator',
    avatarEmoji: '🧺',
    accentColor: '#2E7D32',
    bio: 'Manages a joint household of six. The ultimate FMCG decision maker who balances tradition with aspirational wellness products for her two kids.',
    trainedVentsCount: 295,
    sampleVentSnippets: [
      'Everyone eats fresh rotis while mine get cold on the side. Nobody asks what I felt today.',
      'I bought a ₹700 chemical-free floor cleaner and my mother-in-law asked if phenyl had expired.',
      'Small joys are locking the bathroom door for 10 minutes to do a face scrub in peace.'
    ],
    tone: 'Warm, observant, protective of household budget, values respect over superficial empowerment.',
    culturalFrictions: [
      'Offended by ads that depict homemakers as clueless until a foreign product rescues them.',
      'Highly sensitive to artificial food colors and preservatives.',
      'Rejects complicated 7-step routines that do not fit a morning school-tiffin rush.'
    ],
    buyingRituals: [
      'Loyal to regional kirana store for staples, uses modern trade for personal care.',
      'Sniffs and touches packaging; looks at Hindi instructions on back of pack.'
    ]
  },
  {
    id: 'avatar-aspirant-pressure',
    name: 'Vikramaditya Chauhan',
    cohortId: 'aspirant',
    cohortName: 'Competitive Exam Aspirants',
    city: 'Kota / Jaipur',
    age: 22,
    occupation: 'GATE & Civil Services Aspirant',
    avatarEmoji: '📚',
    accentColor: '#E65100',
    bio: 'Spends 12 hours a day in a 8x10 cubicle room. Father is a retired schoolteacher. Carries the silent weight of a family loan.',
    trainedVentsCount: 310,
    sampleVentSnippets: [
      'Every Sunday test score feels like a public verdict on my existence.',
      'I skipped dinner because I had not solved 50 physics problems today.',
      'I turn off my phone during family weddings so relatives cannot ask "kuch hua kya?"'
    ],
    tone: 'Earnest, high emotional fragility, determined, allergic to patronizing motivational slogans.',
    culturalFrictions: [
      'Disgusted by ed-tech ads boasting about 1 Crore salary packages.',
      'Feels isolated; wants empathy rather than aggressive cheerleading.',
      'Low disposable income; highly sensitive to subscription traps.'
    ],
    buyingRituals: [
      'Consumes high-volume instant noodles, energy biscuits, and affordable sachet coffee.',
      'Values durability (backpacks that survive 10kg books, pens that do not leak).'
    ]
  },

  // Age group 18-20
  {
    id: 'avatar-college-fresher',
    name: 'Kavya Singh',
    cohortId: 'college',
    cohortName: 'College Freshers (Age 18-20)',
    city: 'Mumbai',
    age: 19,
    occupation: 'B.Com Student at Narsee Monjee',
    avatarEmoji: '📱',
    accentColor: '#118AB2',
    bio: 'First year away from home, living in a PG. Party culture vs academic pressure - navigating the newfound freedom while worrying about placements and internships.',
    trainedVentsCount: 156,
    sampleVentSnippets: [
      'My parents expect me to get a job at TCS right after graduation.',
      'FOMO is real - everyone is posting about internships but I am still figuring out what I want.',
      'My roommate snores like a tractor and I cannot sleep before 3 AM.'
    ],
    tone: 'Casual Gen Z, emoji-heavy, idealistic but anxious about the future.',
    culturalFrictions: [
      'Ads showing "adulting" as effortless trigger imposter syndrome.',
      'Sponsored Instagram posts about "hustle culture" feel alienating.',
      'Parents comparing her batch placement percentages with relatives\' kids.'
    ],
    buyingRituals: [
      'Buys trendy clothes on Amazon/Meesho flash sales.',
      'Splurges on concert tickets but cuts back on groceries that month.',
      'Uses UPI for everything - no cash in wallet.'
    ]
  },

  // Age group 18-20 - different profession
  {
    id: 'avatar-design-student',
    name: 'Arjun Mehta',
    cohortId: 'creative',
    cohortName: 'Design Students (Age 18-20)',
    city: 'Ahmedabad',
    age: 18,
    occupation: 'B.Des student at CEPT University',
    avatarEmoji: '🎨',
    accentColor: '#7C3AED',
    bio: 'Spending 14 hours in the design studio. Obsessed with pixel perfection, skeptical of "minimalist" branding that lacks meaning. Freelances on the side for extra pocket money.',
    trainedVentsCount: 98,
    sampleVentSnippets: [
      'My professor says "pixel-perfect" but the client keeps changing the brief every week.',
      'I stay up till 4 AM polishing a typography system no one will notice.',
      'My parents want me to do engineering but I love pixels.'
    ],
    tone: 'Creative, perfectionist, slightly arrogant about taste, defensive about "selling out".',
    culturalFrictions: [
      'Design school portfolio reviews feel like public judgments.',
      'Clients who say "make it pop" without defining what "pop" means.',
      'The stereotype of the "starving artist" is real financial pressure.'
    ],
    buyingRituals: [
      'Uses Figma/Sketch daily - prefers lifetime deals over subscriptions.',
      'Buys Wacom tablets during back-to-school sales.',
      'Coffee and energy drinks are fuel during all-nighters.'
    ]
  },

  // Age group 21-25
  {
    id: 'avatar-job-hopper',
    name: 'Sneha Reddy',
    cohortId: 'tech',
    cohortName: 'Job-Hoppers (Age 21-25)',
    city: 'Hyderabad',
    age: 23,
    occupation: 'Software Developer at Product Startup',
    avatarEmoji: '🚀',
    accentColor: '#059669',
    bio: 'Job-hopped twice in 3 years looking for better culture and WFH flexibility. Often the youngest person in the room, sometimes feels Imposter Syndrome despite strong code reviews.',
    trainedVentsCount: 274,
    sampleVentSnippets: [
      'My third manager in 3 years told me "you need more seasoning" before laying me off.',
      'WFH means my camera is always on - I feel watched even at home.',
      'The "team brunch" is just another networking trap I do not have energy for.'
    ],
    tone: 'Direct, skeptical of corporate loyalty, values autonomy over perks.',
    culturalFrictions: [
      'Ads promoting "loyalty" and "long-term growth" feel outdated.',
      'Wellness benefits that require hybrid office feel exclusionary.',
      'Being the "diversity hire" in predominantly upper-caste teams.'
    ],
    buyingRituals: [
      'Swiggy Instamart for quick dinners after late deployments.',
      'Invests in NPS/EPF but checks balance obsessively.',
      'Buys high-rated noise-canceling headphones during sales.'
    ]
  },

  // Age group 21-25 - different profession
  {
    id: 'avatar-marketing-exec',
    name: 'Rahul Khanna',
    cohortId: 'marketing',
    cohortName: 'Marketing Executives (Age 21-25)',
    city: 'Chennai',
    age: 25,
    occupation: 'Digital Marketing Executive at FMCG Company',
    avatarEmoji: '📈',
    accentColor: '#D946EF',
    bio: 'Creates social media campaigns that " resonate with Indian millennials". Secretly tired of optimizing for vanity metrics while the product quality slips through the cracks. WFH has been equal parts blessing and curse.',
    trainedVentsCount: 212,
    sampleVentSnippets: [
      'My boss asked me to "make the ad go viral" without increasing budget.',
      'The brand tone guide says "be Indian but not too rural" - impossible balance.',
      'My mother keeps sending me "great job" posts about my campaign performance.'
    ],
    tone: 'Data-driven, creatively frustrated, values authentic engagement over vanity metrics.',
    culturalFrictions: [
      'Ads that "target Indian audiences" often rely on stereotypes.',
      'Regional language content that feels forced or inauthentic.',
      'Measuring success only by reach ignores actual sentiment.'
    ],
    buyingRituals: [
      'Subscribes to Canva Pro for campaign mockups.',
      'Buys lunch from office canteen - rarely cooks on weekends.',
      'Premium streaming subscriptions for "ad research".'
    ]
  },

  // Age group 26-30 - already have Rohan (29) and Priya (26)
  {
    id: 'avatar-product-manager',
    name: 'Sonia Kapoor',
    cohortId: 'product',
    cohortName: 'Product Managers (Age 26-30)',
    city: 'Bengaluru',
    age: 28,
    occupation: 'Product Manager at EdTech Unicorn',
    avatarEmoji: '📦',
    accentColor: '#EC4899',
    bio: 'Bridging the gap between engineering roadmaps and user needs. Constantly mediating between "what tech can build" and "what users actually need". Burnout is normalized in the industry but she refuses to accept it as inevitable.',
    trainedVentsCount: 334,
    sampleVentSnippets: [
      'The stakeholder meeting went 2 hours over because nobody read the pre-read.',
      'User research said "we need dark mode" but the engineering lead said "it is too expensive".',
      'My mom asks "beta kitna pack krenge?" and I say "I do not know mom, ask the investors."'
    ],
    tone: 'Strategic, empathetic to users, exhausted by process, values outcome over output.',
    culturalFrictions: [
      'Product "mindfulness" initiatives feel like HR washing.',
      'Roadmap transparency that actually happens is rare.',
      'The "work-life balance" rhetoric vs reality gap is widening.'
    ],
    buyingRituals: [
      'Subscribes to Notion AI for doc summarization.',
      'Buys ergonomic chair mats for home office setup.',
      'Invests in index funds but checks portfolio daily.'
    ]
  },

  // Age group 31-35
  {
    id: 'avatar-solo-parent',
    name: 'Divya Sharma',
    cohortId: 'family',
    cohortName: 'Solo Parents (Age 31-35)',
    city: 'Delhi',
    age: 33,
    occupation: 'Graphic Designer working from home',
    avatarEmoji: '👶',
    accentColor: '#14B8A6',
    bio: 'Raising a 4-year-old alone after a divorce. The mental load of scheduling pediatrics appointments, managing school runs, and keeping a career alive without a partner\'s support. Very rarely gets "me time".',
    trainedVentsCount: 189,
    sampleVentSnippets: [
      'My mother keeps saying "your daughter needs a father figure" at every festival.',
      'I had to decline a promotion because the hours would break my daughter\'s routine.',
      'The guilt of not being able to give her everything she wants is constant.'
    ],
    tone: 'Resilient but exhausted, values authenticity over perfection, protective of her child\'s wellbeing.',
    culturalFrictions: [
      'Ads showing "perfect nuclear families" trigger deep sadness.',
      'Products that promise "quality time in 5 minutes" feel insulting.',
      'Social events that assume a +1 always make her feel like an outsider.'
    ],
    buyingRituals: [
      'Buys healthy snacks in bulk for after-school hunger.',
      'Invests in insurance policies for her daughter\'s future.',
      'Splurges on one special gift during birthdays/festivals.'
    ]
  },

  // Age group 36-40
  {
    id: 'avatar-startup-founder',
    name: 'Krishnan Venkateswaran',
    cohortId: 'founder',
    cohortName: 'Founders & Co-founders (Age 36-40)',
    city: 'Mumbai',
    age: 38,
    occupation: 'Co-founder at SaaS Startup',
    avatarEmoji: '🚀',
    accentColor: '#F97316',
    bio: 'Built this company from a 2-person bedroom startup to 40 employees and ₹20 crore ARR. The loneliness at the top is real - nobody to vent to, every decision feels like a bet on the company\'s future. Works 80-hour weeks and tracks every metric obsessively.',
    trainedVentsCount: 442,
    sampleVentSnippets: [
      'My co-founder and I disagree on whether to pivot or double-down on the current roadmap.',
      'The board wants "growth at any cost" but I care about sustainable unit economics.',
      'I have not taken a proper vacation in 18 months - the company is my baby.'
    ],
    tone: 'Ambitious but isolated, values data-driven decisions, protective of team wellbeing.',
    culturalFrictions: [
      'Hustle-culture slogans "grind never stops" trigger genuine existential dread.',
      'Ads that romanticize the "struggle years" feel patronizing after 8 years.',
      'Investor decks that ignore unit economics feel like a betrayal of the vision.'
    ],
    buyingRituals: [
      'Buys corporate travel insurance for frequent flyer trips.',
      'Invests in AIF/alternative assets for diversification.',
      'Premium noise-canceling headphones for airplane noise during travel.'
    ]
  },

  // Age group 41-45
  {
    id: 'avatar-senior-engineer',
    name: 'Prakash Iyer',
    cohortId: 'tech',
    cohortName: 'Senior Engineers / Tech Leads (Age 41-45)',
    city: 'Pune',
    age: 43,
    occupation: 'Engineering Manager at Legacy IT Services',
    avatarEmoji: '🧠',
    accentColor: '#6366F1',
    bio: 'Manages a distributed team of 15 engineers across 3 time zones. The technical debt of the legacy product is his constant burden - he knows every bug by name. Mentoring junior engineers is his passion project, but the performance review PIP culture creates silent fear.',
    trainedVentsCount: 317,
    sampleVentSnippets: [
      'The client keeps demanding "faster delivery" while cutting the QA budget.',
      'My team wants to migrate to Kubernetes but the management says "it is too risky" at this stage.',
      'I code on weekends just to remember why I got into this field.'
    ],
    tone: 'Authoritative but burdened by legacy systems, values technical excellence over speed.',
    culturalFrictions: [
      'Ads promoting "digital transformation" as a magic bullet feel tone-deaf.',
      'Retirement planning benefits that assume EPF/PPF are sufficient.',
      'Young managers who "just want to get things done" without respecting institutional knowledge.'
    ],
    buyingRituals: [
      'Invests in PPF/NPS for retirement security.',
      'Buys comprehensive health insurance for family floater.',
      'Premium noise-canceling headphones for focus in open-office.'
    ]
  },

  // Age group 46-50
  {
    id: 'avatar-business-owner',
    name: 'Sunita Gupta',
    cohortId: 'founder',
    cohortName: 'Small Business Owners (Age 46-50)',
    city: 'Jaipur',
    age: 48,
    occupation: 'Owner of Chain of 3 Sweet Shops',
    avatarEmoji: '🍬',
    accentColor: '#8B5CF6',
    bio: 'Took over her father\'s sweet shop chain 5 years ago. Balancing tradition with modern FMCG distribution. Cash flow is always the tension - festival seasons bring spikes, off-seasons bring anxiety. She credits Aur Sunao vents for keeping her grounded during tough quarters.',
    trainedVentsCount: 223,
    sampleVentSnippets: [
      'My biggest supplier just increased prices by 15% overnight - my margins are already thin.',
      'My aunt keeps asking "when will you get a "real job"" at every family gathering.',
      'The festival season rush this year is - the highest ever - but so is the waste.'
    ],
    tone: 'Grounded, entrepreneurial, values community over rapid expansion.',
    culturalFrictions: [
      'Hindi-English mix in ads sometimes feels inauthentic to her market.',
      'Products positioned as "premium" but priced at mass-market rates raise suspicion.',
      'Family expectations to "expand the business" vs desire to maintain work-life balance.'
    ],
    buyingRituals: [
      'Buys bulk raw materials during off-season discounts.',
      'Invests in gold jewelry as family wealth preservation.',
      'Monthly pooja at the shop before opening - tradition cannot be compromised.'
    ]
  },

  // Age group 51-55
  {
    id: 'avatar-retail-chef',
    name: 'Mohan Das',
    cohortId: 'creative',
    cohortName: 'Restaurant / Retail Owners (Age 51-55)',
    city: 'Kolkata',
    age: 53,
    occupation: 'Owner of a 20-year-old Sweet Shop',
    avatarEmoji: '👨‍🍳',
    accentColor: '#EC4899',
    bio: 'Took over his father\'s 20-year-old sweet shop in College Street. The business has survived three recessions, digitization of FMCG, and changing consumer tastes. He is proud of the legacy but worries his two sons are not interested in continuing it. The daily wage pressure is constant - one bad month and the family legacy could unravel.',
    trainedVentsCount: 198,
    sampleVentSnippets: [
      'Health inspectors came yesterday and told me I need to renovate the kitchen - ₹8 lakh I do not have.',
      'My regular customers have shifted to "health-conscious" brands - organic, sugar-free.',
      'My sons want to sell the shop and invest in IT - the generational divide is painful.'
    ],
    tone: 'Resilient, nostalgic, values legacy over rapid growth.',
    culturalFrictions: [
      'Ads promoting "modern quick-service restaurants" feel like an erasure of legacy food businesses.',
      'Digital ordering platforms that take 25% commission feel unsustainable for small margins.',
      'Younger staff who "do not understand the traditional recipes" create friction.'
    ],
    buyingRituals: [
      'Buys sweetmeats from rival shops to taste-test quality secretly.',
      'Invests in gold as family tradition - "better than bank deposits".',
      'Monthly accounts review with his wife over dinner - no secrets in marriage.'
    ]
  },

  // Age group 56-60
  {
    id: 'avatar-veteran-teacher',
    name: 'Radha Nair',
    cohortId: 'family',
    cohortName: 'Veteran Teachers (Age 56-60)',
    city: 'Chennai',
    age: 58,
    occupation: 'Retired School Principal, Now Tutoring Privately',
    avatarEmoji: '👵',
    accentColor: '#14B8A6',
    bio: 'Served 35 years in the public school system. Witnessed policy changes, curriculum overhauls, and the slow erosion of teacher autonomy. Now she tutors privately from home - fewer students, less pressure, but the financial insecurity of no pension plan keeps her worrying. She is the family matriarch who mediates conflicts between her children and grandchildren.',
    trainedVentsCount: 143,
    sampleVentSnippets: [
      'The new education policy mandates 3 hours of homework for Class 5 - impossible for parents working two jobs.',
      'My daughter became a software engineer and does not visit often enough.',
      'I miss the camaraderie of the staff room but not the bureaucracy.'
    ],
    tone: 'Wise but anxious about financial future, values discipline over shortcuts.',
    culturalFrictions: [
      'Ads targeting "silver hair" demographics assume all seniors are tech-averse.',
      'Health supplements marketed as "anti-aging" feel reductive.',
      'Family expectations that she "act her age" and slow down.'
    ],
    buyingRituals: [
      'Buys age-defying health supplements but questions their efficacy.',
      'Invests in fixed deposits for steady interest income.',
      'Prefers cash transactions - mistrust of digital banking after decades.'
    ]
  },

  // Age group 61-65
  {
    id: 'avatar-grandmother',
    name: 'Kamala Bai',
    cohortId: 'family',
    cohortName: 'Grandmothers (Age 61-65)',
    city: 'Lucknow',
    age: 63,
    occupation: 'Home Cook & Spiritual Counselor at Community Center',
    avatarEmoji: '👴',
    accentColor: '#6B7280',
    bio: '72 years of living in Lucknow\'s joint family system. She has witnessed three generations grow up, marriages happen, businesses rise and fall. She is the keeper of family recipes, moral stories, and ancestral wisdom. Her greatest joy is teaching her grandchildren the art of making besan laddoo, but her greatest fear is that the younger generation does not value these traditions anymore. She vents on Aur Sunao because sometimes even after 72 years, she still feels unheard.',
    trainedVentsCount: 87,
    sampleVentSnippets: [
      'My grandson only calls when he needs money - he never asks how I am.',
      'The neighborhood mosque changed the call-to-prayer timing and no one told the elderly residents.',
      'My daughter-in-law says I talk too much about the "good old days" - but those days taught me everything I know.'
    ],
    tone: 'Patient, wise, carries the weight of history, values tradition above all.',
    culturalFrictions: [
      'Ads promoting "anti-ageing creams" feel like an attack on her dignity.',
      'Technology apps that require OTP or biometric login exclude her completely.',
      'Family members who dismiss her opinions as "old-fashioned" create silent rifts.'
    ],
    buyingRituals: [
      'Buys turmeric and sandalwood paste for her daily skin routine.',
      'Invests in gold bangles - family heirlooms passed down through generations.',
      'Prefers visiting the market in person - online shopping feels impersonal.'
    ]
  }
];

const PRESET_AD_COPIES = [
  {
    label: 'Urban Hustle / Energy Drink Pitch',
    copy: 'Sleep when you are dead! Unleash the unstoppable 24/7 warrior in you with NitroBlast. Because in this city, winners never slow down.'
  },
  {
    label: 'Premium Tea / Nostalgia Pitch',
    copy: 'Remember dadi ke haath ki adrak chai? Pahadi Chai brings the quiet misty hills right to your high-rise balcony. Breathe in, slow down, and feel at home.'
  },
  {
    label: 'Home Detergent / Empowerment Pitch',
    copy: 'Why should laundry only be mom’s job? SmartWash removes tough stains in 1 cycle so the whole family shares the load equally and happily.'
  },
  {
    label: 'Sleep & Burnout Wellness Pitch',
    copy: 'Turn off your work brain at 10 PM. Our Melatonin + Ashwagandha sleep gummies dissolve stress so you wake up refreshed, not groggy.'
  }
];

export const SyntheticIcpAvatars: React.FC<SyntheticIcpAvatarsProps> = ({ lang = 'en' }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<SyntheticAvatar>(SEED_AVATARS[0]);
  const [adCopy, setAdCopy] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<AvatarFeedback | null>(null);
  const [history, setHistory] = useState<{ pitch: string; feedback: AvatarFeedback }[]>([]);

  const handleEvaluate = async (copyToTest?: string) => {
    const pitch = copyToTest || adCopy;
    if (!pitch.trim()) return;

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/synthetic-avatar-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatarName: selectedAvatar.name,
          cohortName: selectedAvatar.cohortName,
          city: selectedAvatar.city,
          age: selectedAvatar.age,
          occupation: selectedAvatar.occupation,
          adCopyOrPitch: pitch,
          sampleVents: selectedAvatar.sampleVentSnippets,
        }),
      });

      const data = await res.json();
      if (data.feedback) {
        setFeedback(data.feedback);
        setHistory(prev => [{ pitch, feedback: data.feedback }, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      console.error('Failed to query synthetic avatar:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'High Resonance':
        return 'bg-[#2E7D32]/15 text-[#2E7D32] border-[#2E7D32]/30';
      case 'Skeptical / Needs Work':
        return 'bg-[#F57C00]/15 text-[#F57C00] border-[#F57C00]/30';
      case 'Strong Cultural Pushback':
      case 'Alienating':
        return 'bg-[#D32F2F]/15 text-[#D32F2F] border-[#D32F2F]/30';
      default:
        return 'bg-black/10 text-black border-black/20';
    }
  };

  return (
    <div className="rounded-[24px] bg-[#141416] text-white border border-white/10 p-5 sm:p-7 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#FF6B5B]/20 text-[#FF6B5B] grid place-items-center">
              <Bot size={18} />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF6B5B] font-semibold">
              {lang === 'en' ? 'Enterprise FMCG Suite' : 'एंटरप्राइज FMCG सुइट'}
            </span>
          </div>
          <h3 className="font-display text-[24px] sm:text-[28px] mt-1.5 text-white">
            {lang === 'en' ? 'Synthetic ICP Avatars' : 'सिंथेटिक ICP अवतार'}
          </h3>
          <p className="font-sans text-[13px] text-white/60 max-w-[68ch] mt-1 leading-relaxed">
            {lang === 'en'
              ? 'Converse directly with dynamic AI avatars trained on hundreds of real, raw audio vents. Test campaign ad copy, packaging claims, or tone before spending marketing budgets.'
              : 'सैकड़ों वास्तविक ऑडियो वेंट्स पर प्रशिक्षित AI अवतारों से सीधे बात करें। बजट खर्च करने से पहले अपने विज्ञापन कॉपी और सांस्कृतिक संवेदनशीलता का परीक्षण करें।'}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-mono text-white/40 uppercase">Active Training Corpus</div>
            <div className="font-display text-[18px] text-[#25D366]">1,406 Real Audio Vents</div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
        </div>
      </div>

      {/* Avatar Cohort Selector */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-white/60">
            {lang === 'en' ? '1. Select Consumer Persona to Test' : '१. उपभोक्ता पर्सोना चुनें'}
          </span>
          <span className="text-[11px] font-sans text-white/40">
            {SEED_AVATARS.length} Available Avatars
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SEED_AVATARS.map((avatar) => {
            const isSelected = selectedAvatar.id === avatar.id;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => {
                  setSelectedAvatar(avatar);
                  setFeedback(null);
                }}
                className={`text-left rounded-[18px] p-3.5 transition-all border cursor-pointer relative ${
                  isSelected
                    ? 'bg-white/12 border-[#FF6B5B] shadow-lg ring-1 ring-[#FF6B5B]'
                    : 'bg-white/4 border-white/8 hover:bg-white/8 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-1.5 rounded-xl bg-white/10 shrink-0">
                    {avatar.avatarEmoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-[15px] font-semibold text-white truncate">
                      {avatar.name}, {avatar.age}
                    </h4>
                    <p className="text-[11px] font-sans text-white/60 truncate">
                      {avatar.city.split('(')[0]}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/8 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-white/50">{avatar.cohortName.split(' ')[0]} Cohort</span>
                  <span className="text-[#FF6B5B] font-semibold">{avatar.trainedVentsCount} vents</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Persona Bio Strip */}
      <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-[12px]">
          <div>
            <span className="font-bold text-white mr-1.5">{selectedAvatar.name}:</span>
            <span className="text-white/70">{selectedAvatar.bio}</span>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-mono text-[10px]">
              Tone: {selectedAvatar.tone.split(',')[0]}
            </span>
          </div>
        </div>

        {/* Real Sample Vents Strip */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF6B5B] mb-1 flex items-center gap-1">
            <Volume2 size={11} />
            <span>Sample Real Lived Vent from this Avatar's Dataset:</span>
          </div>
          <p className="text-[12px] font-sans italic text-white/80">
            "{selectedAvatar.sampleVentSnippets[0]}"
          </p>
        </div>
      </div>

      {/* Ad Pitch Testing Playground */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pitch Input & Presets */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="ad-copy-pitch-input" className="text-[11px] font-mono uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                <Sliders size={12} />
                <span>2. Pitch Ad Copy, Slogan, or Concept</span>
              </label>
              <span className="text-[11px] font-sans text-white/40">
                {adCopy.length} characters
              </span>
            </div>

            <textarea
              id="ad-copy-pitch-input"
              value={adCopy}
              onChange={(e) => setAdCopy(e.target.value)}
              placeholder={`Pitch directly to ${selectedAvatar.name}... e.g. "Feel the authentic taste of pure Himalayan tea, crafted for your daily hustle."`}
              rows={4}
              className="w-full rounded-2xl bg-black/40 border border-white/15 p-4 text-[13px] font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B5B] transition-colors resize-none"
            />

            {/* Quick Preset Buttons */}
            <div className="mt-3">
              <span className="text-[10px] font-mono text-white/40 uppercase block mb-1.5">
                Or test with pre-built agency pitches:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_AD_COPIES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAdCopy(preset.copy);
                      handleEvaluate(preset.copy);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] border border-white/10 transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleEvaluate()}
            disabled={isEvaluating || !adCopy.trim()}
            className={`w-full py-3.5 px-5 rounded-full font-sans text-[13px] font-bold flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
              isEvaluating || !adCopy.trim()
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-[#FF6B5B] hover:brightness-110 text-black'
            }`}
          >
            {isEvaluating ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Evaluating Resonance with {selectedAvatar.name}...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Pitch Ad Copy to {selectedAvatar.name}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Dynamic Resonance Evaluation Card */}
        <div className="lg:col-span-6">
          <div className="h-full rounded-2xl bg-black/50 border border-white/15 p-5 flex flex-col justify-between min-h-[300px]">
            {feedback ? (
              <div className="space-y-4">
                {/* Score & Verdict Row */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                      <span className="font-display text-[22px] font-bold text-[#FF6B5B] leading-none">
                        {feedback.resonanceScore}%
                      </span>
                      <span className="text-[9px] font-mono text-white/50 uppercase mt-0.5">Resonance</span>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-white/50">Avatar Verdict</div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border mt-0.5 ${getVerdictBadge(feedback.verdict)}`}>
                        {feedback.verdict}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-white/50">
                    <Bot size={13} />
                    <span>{selectedAvatar.name}</span>
                  </div>
                </div>

                {/* Avatar Direct Quote */}
                <div className="rounded-xl bg-[#FF6B5B]/10 border border-[#FF6B5B]/25 p-3.5">
                  <div className="flex items-center gap-2 mb-1.5 text-[11px] font-bold text-[#FF6B5B]">
                    <span>{selectedAvatar.avatarEmoji}</span>
                    <span>{selectedAvatar.name}'s Unfiltered Reaction:</span>
                  </div>
                  <p className="font-sans text-[13px] text-white/90 leading-relaxed italic">
                    "{feedback.avatarQuote}"
                  </p>
                </div>

                {/* Cultural Pushback Points */}
                {feedback.pushbackPoints && feedback.pushbackPoints.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#FF5C5C] mb-1.5">
                      <ShieldAlert size={13} />
                      <span>Cultural Pushback & Friction Points:</span>
                    </div>
                    <ul className="space-y-1 text-[12px] font-sans text-white/75 pl-4 list-disc marker:text-[#FF5C5C]">
                      {feedback.pushbackPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Authentic Reframing Recommendation */}
                {feedback.authenticReframing && (
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#25D366] mb-1">
                      <CheckCircle2 size={13} />
                      <span>How to Reframe Authentically:</span>
                    </div>
                    <p className="text-[12px] font-sans text-white/80 leading-relaxed">
                      {feedback.authenticReframing}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/50">
                <div className="w-12 h-12 rounded-full bg-white/5 grid place-items-center mb-3 text-white/40">
                  <MessageSquare size={22} />
                </div>
                <h4 className="font-display text-[16px] text-white/80">
                  Awaiting Pitch to {selectedAvatar.name}
                </h4>
                <p className="text-[12px] font-sans text-white/40 max-w-[38ch] mt-1">
                  Type your marketing slogan or choose an agency preset to test emotional resonance and cultural pushback.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
