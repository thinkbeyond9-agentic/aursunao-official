import { SyntheticAvatar, AvatarFeedback } from '../types';

export interface PrebuiltAgencyPitch {
  id: string;
  category: string;
  categoryBadge: string;
  label: string;
  adCopy: string;
  coreHypothesis: string;
  targetEmotion: string;
  riskFactor: string;
}

export const PREBUILT_AGENCY_PITCHES: PrebuiltAgencyPitch[] = [
  {
    id: 'pitch-hustle-energy',
    category: 'Energy Drinks & Supplements',
    categoryBadge: 'Hustle Culture',
    label: 'Urban Hustle / Energy Drink Pitch',
    adCopy: 'Sleep when you are dead! Unleash the unstoppable 24/7 warrior in you with NitroBlast. Because in this city, winners never slow down.',
    coreHypothesis: 'Urban youth are motivated by extreme ambition and status pride.',
    targetEmotion: 'Aggressive Ambition',
    riskFactor: 'Triggers severe burnout cynicism among overworked tech and gig workers.'
  },
  {
    id: 'pitch-nostalgia-tea',
    category: 'Hot Beverages & Tea',
    categoryBadge: 'Nostalgia & Heritage',
    label: 'Heritage Chai / Hometown Comfort Pitch',
    adCopy: 'Remember dadi ke haath ki adrak chai? Pahadi Chai brings the quiet misty hills right to your high-rise balcony. Breathe in, slow down, and feel at home.',
    coreHypothesis: 'Migrants in metros crave emotional grounding and nostalgic sensory warmth.',
    targetEmotion: 'Nostalgic Longing & Calm',
    riskFactor: 'High-rise balcony trope can alienate shared-flat room renters.'
  },
  {
    id: 'pitch-shared-chores',
    category: 'Home Care & Laundry',
    categoryBadge: 'Social Equality',
    label: 'Home Detergent / Shared Chores Pitch',
    adCopy: 'Why should laundry only be mom’s job? SmartWash removes tough collar stains in 1 cycle so the whole family shares the load equally and happily.',
    coreHypothesis: 'Progressive homemakers want recognition and equal distribution of domestic labor.',
    targetEmotion: 'Validation & Respect',
    riskFactor: 'Can feel preachily performative if depicted unrealistically in joint families.'
  },
  {
    id: 'pitch-burnout-sleep',
    category: 'Wellness & Sleep Care',
    categoryBadge: 'Mental Health',
    label: 'Sleep & Burnout Wellness Pitch',
    adCopy: 'Turn off your work brain at 10 PM. Our Melatonin + Ashwagandha sleep gummies dissolve screen stress so you wake up refreshed, not groggy.',
    coreHypothesis: 'Knowledge workers with chronic insomnia seek non-habit-forming, functional solutions.',
    targetEmotion: 'Relief & Recovery',
    riskFactor: 'High skepticism towards supplement hype and fear of next-morning lethargy.'
  },
  {
    id: 'pitch-quick-commerce',
    category: 'Quick Commerce & Delivery',
    categoryBadge: 'Modern Convenience',
    label: 'Instant Delivery / Speed Pitch',
    adCopy: 'Groceries delivered in 7 minutes flat! Why waste time parking and haggling at the dusty sabzi mandi when you have life goals to conquer?',
    coreHypothesis: 'Consumers prioritize time savings over relationship with local kiranas.',
    targetEmotion: 'Efficiency & Modernity',
    riskFactor: 'Can feel condescending towards traditional vendors and exploitative of delivery riders.'
  },
  {
    id: 'pitch-clean-beauty',
    category: 'Beauty & Skincare',
    categoryBadge: 'Clean Label',
    label: '100% Toxin-Free Clean Beauty Pitch',
    adCopy: 'Stop poisoning your skin with synthetic parabens! Our 100% Ayurvedic Cold-Pressed Kumkumadi Elixir reveals your radiant virgin glow in just 7 days.',
    coreHypothesis: 'Fear of toxic chemicals drives willingness to pay premium for clean beauty.',
    targetEmotion: 'Purity & Anxiety Relief',
    riskFactor: 'Over-dramatic "7-day miracle" claims trigger acute influencer marketing fatigue.'
  },
  {
    id: 'pitch-edtech-elite',
    category: 'EdTech & Career Prep',
    categoryBadge: 'Social Mobility',
    label: 'Career Elite / ₹45L Package Fellowship',
    adCopy: 'Stop wasting years in tier-3 colleges. Join our elite Full-Stack AI Fellowship. 45 LPA guaranteed placement or 100% fees refunded. Build your future today!',
    coreHypothesis: 'Youth and parents will take educational loans for high-salary security.',
    targetEmotion: 'Desperation for Social Mobility',
    riskFactor: 'Exploitative pressure triggers extreme pushback among stressed aspirants.'
  },
  {
    id: 'pitch-budget-atta',
    category: 'Staples & Packaged Atta',
    categoryBadge: 'Household Value',
    label: 'Anti-Inflation Value Atta Pitch',
    adCopy: 'Mehengai ki no chinta! Pure MP Sharbati wheat chakki atta with 1.5 kg extra free in every 10 kg bag. Rotis stay soft till dinner without butter.',
    coreHypothesis: 'Middle-class homemakers want tangible inflation relief and dependable soft rotis.',
    targetEmotion: 'Budget Security & Warmth',
    riskFactor: 'Suspicion that "free extra weight" means lower flour grade or high bran mix.'
  },
  {
    id: 'pitch-child-nutrition',
    category: 'Health Food Drinks (HFD)',
    categoryBadge: 'Parental Anxiety',
    label: 'Child Stamina & Immunity Malt Pitch',
    adCopy: 'Is your child falling behind in height and school sports? NutriBoost packs 37 vital micronutrients and DHA to build champions from within.',
    coreHypothesis: 'Mothers carry deep maternal guilt regarding child growth milestones.',
    targetEmotion: 'Protective Maternal Aspiration',
    riskFactor: 'Backlash against hidden 40% sugar content in malt health drinks.'
  },
  {
    id: 'pitch-diabetic-snack',
    category: 'Healthy Snacking',
    categoryBadge: 'Senior & Diabetic Wellness',
    label: 'Diabetic Friendly Chai Cookie Pitch',
    adCopy: 'Never give up your evening chai dunk! 100% sugar-free, stevia-sweetened whole grain cookies that won’t spike your blood glucose. Verified by doctors.',
    coreHypothesis: 'Diabetic elders miss sweet chai dunking rituals and seek guilt-free treats.',
    targetEmotion: 'Dignified Indulgence',
    riskFactor: 'Stevia chemical aftertaste and skepticism around "hidden maltodextrin" on labels.'
  },
  {
    id: 'pitch-midnight-snack',
    category: 'Snacks & Noodles',
    categoryBadge: 'Solo Comfort Food',
    label: 'Late-Night Solo Indulgence Pitch',
    adCopy: 'When midnight hunger strikes and the world is asleep, 2 minutes is all it takes. Cheesy garlic butter noodles for your private movie binge.',
    coreHypothesis: 'Solo night owls seek decadent, judgment-free comfort food.',
    targetEmotion: 'Guilty Pleasure & Solitude',
    riskFactor: 'Heavy grease and midnight acidity worries for working professionals.'
  },
  {
    id: 'pitch-quick-trading',
    category: 'Fintech & Trading',
    categoryBadge: 'Get Rich Fast',
    label: 'F&O Trading / Financial Freedom Pitch',
    adCopy: 'Break free from the 9-to-5 trap! Trade options with zero brokerage from your smartphone. Your first ₹1 Lakh month is just a tap away.',
    coreHypothesis: 'Desire for passive income and escaping corporate grind.',
    targetEmotion: 'Faux Financial Independence',
    riskFactor: 'Acute moral repulsion; seen as irresponsible gambling targeting vulnerable youth.'
  }
];

export const SYNTHETIC_ICP_AVATARS: SyntheticAvatar[] = [
  // 1. Priya Verma (Tier-2 Migrant)
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
    bio: 'Lives in a 3-BHK shared flat in BTM Layout. Sends ₹22,000 home monthly to support younger brother’s college fees. Balances guilt over ₹350 cold brews with deep longing for mother’s sattu paratha.',
    trainedVentsCount: 382,
    incomeTier: '₹55,000 / month (Remits 40%)',
    lifestyleConstraint: 'Tight discretionary budget, small rental kitchen, public transit commuter',
    sampleVentSnippets: [
      'My flatmate orders Swiggy Gourmet every evening like it is pocket change; I wash plastic dabbas to reuse them.',
      'Mom thinks working in Bengaluru means I am rich. She does not know how much security deposit took away.',
      'I pretend I love artisanal espresso at office, but 6 PM tea tapri with ₹10 adrak chai is the only thing keeping me sane.'
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
    ],
    stories: [
      {
        id: 'priya-story-1',
        title: 'The ₹450 Salad vs The Mustard Fish Memory',
        situation: 'Ordering food after a 12-hour sprint release',
        timestamp: 'Thursday, 9:45 PM',
        audioDuration: '0:52',
        transcript: 'My colleagues were ordering these fancy quinoa power bowls from Swiggy Gourmet. I looked at the cart—₹485 for some raw leaves with four pomegranate seeds. I closed the app. I walked down to the small roadside cart run by an Odia uncle and had a ₹40 plate of dal chawal. I sat on my rental bed and cried because I missed the pungent mustard fish my dadi cooked in a small brass kadai. When brands advertise health food with white models in linen aprons, they make me feel like my food culture was poor and backwards.',
        emotionalTension: 'Cultural Alienation & Economic Dissonance',
        brandTrigger: 'Overpriced minimalist packaging and health food snobbery',
        acceptedTones: ['Warm hometown grounding', 'Transparent honest pricing', 'No-nonsense kitchen reality'],
        pushbackTones: ['Pretentious wellness preaching', 'Hustle celebration', 'Ignoring family remittance realities']
      },
      {
        id: 'priya-story-2',
        title: 'Sending the Salary SMS to Papa',
        situation: 'End-of-month salary day remittance',
        timestamp: '1st of the Month, 11:15 AM',
        audioDuration: '0:44',
        transcript: 'Every month when salary lands, before paying rent, I transfer ₹22,000 to Papa. He texts back: "Received beta. Don’t cut your food to save money." But I do cut. I buy the ₹15 shampoo sachet pack instead of the pump bottle. When I see an ad saying "Treat yourself to a luxury weekend getaway because you deserve it," I think: who are these people who don’t have parents with medicine bills? You cannot sell me luxury indulgence when my priority is my brother’s engineering tuition.',
        emotionalTension: 'Duty vs Self-Care Guilt',
        brandTrigger: 'Hedonistic "treat yourself" marketing',
        acceptedTones: ['Family sacrifice validation', 'High durability value', 'Refill economic options'],
        pushbackTones: ['Carefree individualistic consumerism', 'Faux empowerment']
      },
      {
        id: 'priya-story-3',
        title: 'The 6 PM Tapri Sanity Check',
        situation: 'Midday corporate burnout escape',
        timestamp: 'Tuesday, 6:10 PM',
        audioDuration: '0:39',
        transcript: 'In our glass building, the pantry has this automated Nespresso machine that spits out burnt frothy foam. It feels like drinking liquid plastic. At 6 PM, four of us sneak downstairs through the fire exit to Ramu bhaiya’s tapri. He crushes fresh ginger on a wooden block right in front of you. That ₹10 cutting glass chai hot in your hand is the only five minutes where nobody is judging your English grammar or asking for Jira updates.',
        emotionalTension: 'Corporate Imposter Exhaustion',
        brandTrigger: 'Sterile automated lifestyle products',
        acceptedTones: ['Sensory street realism', 'Crushed ginger aromatics', 'Grounded camaraderie'],
        pushbackTones: ['Sterile corporate efficiency', 'Cold automated solutions']
      }
    ],
    pitchAcceptanceCriteria: {
      mustHave: ['Affordable value sizing', 'Authentic regional roots', 'Respect for family remittance'],
      dealBreakers: ['"Crush it 24/7" slogans', 'Fake luxury aesthetic markup', 'Mocking traditional Indian habits'],
      winningSlogans: [
        'Ghar ke swaad jaisa kadak, bina kisi fuzool kharche ke.',
        'Small joys that remind you why you started.'
      ],
      pushbackSlogans: [
        'Sleep when you are dead! Winners don’t pause.',
        'Why visit dusty mandis when you can tap an app?'
      ]
    }
  },

  // 2. Rohan Deshmukh (Burnt-out Startup Techie)
  {
    id: 'avatar-startup-burnout',
    name: 'Rohan Deshmukh',
    cohortId: 'tech',
    cohortName: 'Burnt-Out IT / Startup Engineers',
    city: 'Pune / Bengaluru (HSR Layout)',
    age: 29,
    occupation: 'Senior Backend Engineer',
    avatarEmoji: '💻',
    accentColor: '#4A90E2',
    bio: 'Earns 28 LPA but suffers from chronic insomnia and Sunday evening dread. Constantly checks Slack under the dinner table. Cynical about corporate "wellness sessions" that get scheduled between emergency release calls.',
    trainedVentsCount: 419,
    incomeTier: '₹1,85,000 / month',
    lifestyleConstraint: 'High disposable income, zero free time, severe sleep fragmentation',
    sampleVentSnippets: [
      'We had a "mental health webinar" on Thursday and on Friday my director scheduled an 11 PM production deployment.',
      'My Apple Watch pinged a 115 BPM resting heart rate alert while I was silently reading an escalation email.',
      'I buy expensive noise-canceling headphones just to not hear the hum of my own racing thoughts.'
    ],
    tone: 'Sardonic, dry tech humor, exhausted, appreciative of genuine no-BS transparency.',
    culturalFrictions: [
      'Hates "hustle hard" and "crush it" slogans with visceral passion.',
      'Cynical about health drinks promising instant energy without fixing sleep.',
      'Prefers functional specs and clinical ingredients over emotional marketing fluff.'
    ],
    buyingRituals: [
      'Researches Reddit (r/developersIndia, r/bangalore) before buying anything over ₹2,000.',
      'Buys high-end sleep hygiene items (weighted blankets, magnesium bisglycinate, blackout curtains).'
    ],
    stories: [
      {
        id: 'rohan-story-1',
        title: 'The Sunday 7 PM Stomach Drop',
        situation: 'Anticipatory dread before Monday sprint planning',
        timestamp: 'Sunday, 7:15 PM',
        audioDuration: '0:48',
        transcript: 'Every Sunday at 7 PM, like clockwork, this heavy iron ball forms in my stomach. The weekend is over, even though I worked on Saturday finishing Jira tickets. My director sends a Slack message at 8:30 PM: "Quick sync tomorrow at 8:30 AM before standup." I stare at the screen. I earn 28 LPA, but I sleep 4 hours. And then brands try to sell me energy drinks with skull logos telling me to "fuel my beast." I don’t want to fuel my beast; I want my beast to lie down and sleep for 14 hours.',
        emotionalTension: 'Chronic Anxiety & Workplace Encroachment',
        brandTrigger: 'Aggressive energy drink & toxic hustle advertising',
        acceptedTones: ['Quiet decompression', 'Clinical ingredient honesty', 'No-nonsense utility'],
        pushbackTones: ['"Unstoppable 24/7 warrior"', 'Gamified productivity hacks']
      },
      {
        id: 'rohan-story-2',
        title: 'The ₹1,400 Sleep Gummy Experiment',
        situation: 'Late night online health shopping',
        timestamp: 'Wednesday, 1:40 AM',
        audioDuration: '0:36',
        transcript: 'I spent ₹1,400 on these pastel blue sleep gummies that Instagram kept serving me. The ad said "turn off your brain in 20 minutes." I took two, waited. At 3 AM, my heart was pounding, my brain was running distributed lock race condition simulations, and my teeth felt coated in sticky corn syrup. Most D2C wellness brands are just sugar candy with 0.5mg melatonin and 200% venture capital markup.',
        emotionalTension: 'Disillusionment with Lifestyle Wellness Hacks',
        brandTrigger: 'Vague holistic claims without clinical dosage disclosure',
        acceptedTones: ['Pharmacological transparency', 'Non-habit-forming clarity', 'Subtle natural aesthetics'],
        pushbackTones: ['Miracle cure promises', 'Cutesy candy wellness']
      }
    ],
    pitchAcceptanceCriteria: {
      mustHave: ['Exact milligram dosage breakdown', 'No toxic hustle culture', 'Honest sleep hygiene focus'],
      dealBreakers: ['"Hustle harder" / "Sleep when you die"', 'Excessive sugar/corn syrup', 'Corporate motivational speak'],
      winningSlogans: [
        'Turn off your Slack brain. Clean sleep without morning fog.',
        'Engineered for deep recovery, not hollow stimulation.'
      ],
      pushbackSlogans: [
        'Sleep when you are dead! Unleash the 24/7 beast.',
        'Crush your goals while your competitors are sleeping.'
      ]
    }
  },

  // 3. Ananya Ghosh (Tier-2 FMCG Homemaker)
  {
    id: 'avatar-tier2-homemaker',
    name: 'Ananya Ghosh',
    cohortId: 'homemaker',
    cohortName: 'Tier-2 FMCG Homemakers & Shoppers',
    city: 'Indore / Lucknow',
    age: 34,
    occupation: 'Home Manager & Part-Time Micro-Blogger',
    avatarEmoji: '🧺',
    accentColor: '#2E7D32',
    bio: 'Manages a joint household of six (in-laws, husband, two kids). The ultimate FMCG gatekeeper who balances tight household grocery budgets with aspirational health products for her children.',
    trainedVentsCount: 295,
    incomeTier: 'Household: ₹75,000 / month',
    lifestyleConstraint: 'Morning cooking rush for 6 people, in-law traditional scrutiny, sensitive to food chemicals',
    sampleVentSnippets: [
      'Everyone eats fresh hot rotis while mine get cold on the side. Nobody asks what I felt like eating today.',
      'I bought a ₹450 organic floor cleaner and my mother-in-law asked if phenyl had expired in our city.',
      'My 10-minute luxury is locking the bathroom door after school bus departure to put on aloe face gel in peace.'
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
    ],
    stories: [
      {
        id: 'ananya-story-1',
        title: 'Cold Rotis at 2:30 PM',
        situation: 'Finishing lunch alone after serving the joint family',
        timestamp: 'Daily, 2:30 PM',
        audioDuration: '0:41',
        transcript: 'Every single day, from 6 AM I am on my feet. Tiffin for kids, tea for pitaji, breakfast for husband, lunch prep for mataji. Everyone gets hot, puffed rotis directly from the tawa. When I finally sit at 2:30 PM, the leftover rotis in the casserole are rubbery and cold. And then television ads show this glamorous mother wearing silk sarees while washing dishes with a smile. If a brand wants my respect, show the real sweat of cooking for six people, and show my husband making the evening tea without needing an award ceremony.',
        emotionalTension: 'Unseen Domestic Exhaustion & Resentment',
        brandTrigger: 'Glamorized, spotless homemaker tropes in soap/detergent ads',
        acceptedTones: ['Authentic domestic partnership', 'Effortless stain release', 'No patronizing lectures'],
        pushbackTones: ['Smiling martyr housewife imagery', 'Impractical time-consuming rituals']
      },
      {
        id: 'ananya-story-2',
        title: 'The Hidden Sugar in Child Health Drinks',
        situation: 'Reading ingredients at the supermarket aisle',
        timestamp: 'Saturday, 5:30 PM',
        audioDuration: '0:47',
        transcript: 'For years I bought those brown chocolate malt jars because cricket stars on TV said it builds strong bones. One day my nephew who studies biology turned the jar around and showed me: 38% sugar! Sugar is the second ingredient! I was feeding my 7-year-old two spoons of refined sugar every morning before school thinking I was being a good mother. I felt cheated. Now, if a brand writes "Natural" on the front, I immediately flip it to read the fine print in Hindi.',
        emotionalTension: 'Betrayed Maternal Trust & Ingredient Vigilance',
        brandTrigger: 'Misleading health claims on children health drinks',
        acceptedTones: ['Zero hidden refined sugar', 'Natural jaggery or ragi base', 'Clear vernacular labels'],
        pushbackTones: ['"Make your child an Olympic gold winner" hype', 'Fake lab animations']
      }
    ],
    pitchAcceptanceCriteria: {
      mustHave: ['Tangible household stain/cleaning efficacy', 'No hidden chemical sugars', 'Respectful portrayal of family labor'],
      dealBreakers: ['Depicting homemakers as helpless or backward', 'Shrinkflation without warning', 'Single-serve plastic waste'],
      winningSlogans: [
        'Asli saafai jo mehnath kam kare, jashn nahi mangti.',
        'Healthy kids start with honest ingredients, no hidden sugar.'
      ],
      pushbackSlogans: [
        'Why should laundry only be mom’s job? Teach your family to share!',
        'Make your child a genius with our double-malt power formula.'
      ]
    }
  },

  // 4. Vikramaditya Chauhan (Exam Aspirant)
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
    bio: 'Spends 12 hours a day in a windowless 8x10 cubicle room in Kota. Father is a retired schoolteacher who mortgaged land to pay coaching fees. Carries the silent weight of an entire family’s future.',
    trainedVentsCount: 310,
    incomeTier: '₹8,000 / month hostel allowance',
    lifestyleConstraint: 'Extreme financial frugality, 14-hour study blocks, acute performance dread',
    sampleVentSnippets: [
      'Every Sunday mock test ranking sheet feels like a public death sentence.',
      'I skipped dinner because I had only solved 38 physics problems instead of my 60 problem daily quota.',
      'I turn off my phone during family weddings so distant uncles cannot ask "aur beta, selection kab hoga?"'
    ],
    tone: 'Earnest, emotionally fragile, fiercely determined, deeply allergic to patronizing motivational slogans.',
    culturalFrictions: [
      'Disgusted by ed-tech ads boasting about ₹1 Crore salary packages.',
      'Feels isolated; wants empathy rather than aggressive cheerleading.',
      'Extremely low disposable income; allergic to sneaky subscription auto-debit traps.'
    ],
    buyingRituals: [
      'Consumes high-volume instant noodles, energy biscuits, and affordable sachet coffee.',
      'Values extreme durability (backpacks that carry 12kg books, pens that do not leak).'
    ],
    stories: [
      {
        id: 'vikram-story-1',
        title: 'The Sunday Rank Board at Coaching',
        situation: 'Looking at weekly test results pasted on the glass wall',
        timestamp: 'Sunday, 4:00 PM',
        audioDuration: '0:45',
        transcript: 'They print the ranks of 4,000 students on these long dot-matrix sheets and pin them in the central lobby. My name was at 2,840 this week. I stood there looking at the paper while my hands were shaking. Papa called at 4:30. I lied. I told him I got top 500. He said "Khana theek se khana beta, hum log yahan sab theek hain." Then I see these EdTech YouTube ads with flashing neon lights shouting: "Do you want a 1.2 Crore salary or do you want to die a loser?" That ad made me want to throw my phone against the wall.',
        emotionalTension: 'Crushing Familial Duty & Shame',
        brandTrigger: 'Predatory ed-tech fear-mongering and package flaunting',
        acceptedTones: ['Quiet companionate empathy', 'Long-battery durability', 'Transparent low-cost options'],
        pushbackTones: ['Aggressive package boasting', 'Toxic motivational shaming']
      }
    ],
    pitchAcceptanceCriteria: {
      mustHave: ['Durability and high endurance', 'Accessible sachet price points (₹5 - ₹20)', 'Grounded moral encouragement'],
      dealBreakers: ['Salary package bragging', 'Recurring credit card subscription traps', 'Shaming failure'],
      winningSlogans: [
        'Saath chalte hain, har lambi raat mein.',
        'Bharosa jo thakne na de. Har ghante ka sachha saathi.'
      ],
      pushbackSlogans: [
        'Stop wasting years in tier-3 colleges! 45 LPA guaranteed or refund!',
        'Sleep when you die! Only 1% winners survive.'
      ]
    }
  },

  // 5. Suraj Paswan (Gig Worker / Delivery Rider)
  {
    id: 'avatar-gig-delivery',
    name: 'Suraj Paswan',
    cohortId: 'gig-worker',
    cohortName: 'Quick Commerce & Gig Delivery Riders',
    city: 'Gurugram / Delhi NCR',
    age: 24,
    occupation: 'Quick-Commerce Delivery Partner',
    avatarEmoji: '🛵',
    accentColor: '#FFB300',
    bio: 'Rides a 125cc bike 13 hours a day through blistering 45°C summer heat and waterlogged monsoon streets. Lives in a shared room in Kapashera. Survives on instant payouts, cutting chai, and roadside parathas.',
    trainedVentsCount: 340,
    incomeTier: '₹22,000 - ₹26,000 / month (net of fuel & bike EMI)',
    lifestyleConstraint: 'No air conditioning, bathroom access denials in gated societies, customer rating anxiety',
    sampleVentSnippets: [
      'Gated society security guards make me leave my bike 500 meters outside in the rain and take the service lift.',
      'Customer gave a 1-star rating because ice-cream melted while I was stuck in a 40-minute traffic jam on NH-48.',
      'Brands show riders smiling in raincoats with heroic music. In reality, wet socks give you fungal foot rot.'
    ],
    tone: 'Raw, pragmatic, street-smart Hindi/Hinglish, weary of corporate savior narratives, focused on real rupee earnings.',
    culturalFrictions: [
      'Deeply hates ads depicting delivery workers as "caped heroes who love serving you".',
      'Allergic to products that mock physical labor or portray physical shopping as "wasting life".',
      'High friction regarding phone battery drain and low-end smartphone overheating.'
    ],
    buyingRituals: [
      'Relies on ₹10 - ₹20 sachet snacks, glucose biscuits, and cheap energy drinks for quick stamina.',
      'Invests heavily in phone power banks and waterproof mobile covers.'
    ],
    stories: [
      {
        id: 'suraj-story-1',
        title: 'The Service Lift and the 10-Minute Timer',
        situation: 'Delivering an order to a 24th-floor penthouse',
        timestamp: 'Friday, 8:45 PM',
        audioDuration: '0:50',
        transcript: 'It was raining heavily in Gurugram. My phone had 12% battery left, and the app timer had 3 minutes remaining for on-time delivery. The security guard at the gate stopped me, made me write my name in four registers, and told me: "Delivery boys only take service lift." The service lift was carrying construction debris and stopped at every floor. When I handed the bag to the madam on the 24th floor, water was dripping from my helmet. She looked at me with disgust and said, "Why did you touch the door handle with wet hands?" Then I see TV ads where tech executives say "We deliver happiness in 10 minutes." It is not happiness; it is my heart rate at 140 BPM hoping I don’t crash into an open manhole.',
        emotionalTension: 'Loss of Basic Dignity in Gated Metros',
        brandTrigger: 'Hero-washing gig workers while ignoring harsh field conditions',
        acceptedTones: ['Direct functional stamina', 'Weather-proof utility', 'Fair compensation respect'],
        pushbackTones: ['"Superhero rider" patronizing marketing', 'Mocking local street shopping']
      }
    ],
    pitchAcceptanceCriteria: {
      mustHave: ['Pocket-friendly sachet pricing', 'Weatherproof durability', 'Authentic respect for street labor'],
      dealBreakers: ['Faux superhero romanticization', 'Disparaging physical kirana markets', 'Luxury price tags'],
      winningSlogans: [
        'Asli taakat jo dhoop aur baarish mein saath nibhaye.',
        'Hard work deserves real energy, not fake praise.'
      ],
      pushbackSlogans: [
        'Why waste time in dusty mandis when you have life goals to conquer?',
        'Our caped delivery heroes bring happiness to your sofa!'
      ]
    }
  },

  // 6. Tanvi Kulkarni (Gen-Z Creator & Student)
  {
    id: 'avatar-genz-creator',
    name: 'Tanvi Kulkarni',
    cohortId: 'gen-z',
    cohortName: 'Gen-Z College Students & Micro-Creators',
    city: 'Mumbai / Navi Mumbai',
    age: 20,
    occupation: 'Mass Media Student & Content Creator',
    avatarEmoji: '✨',
    accentColor: '#AB47BC',
    bio: 'Commutes via Mumbai local trains from Vashi to Bandra. Thrift stores for aesthetic outfits, uses ingredient scanner apps before buying skincare, and calls out "greenwashing" on her Instagram stories.',
    trainedVentsCount: 265,
    incomeTier: '₹6,000 pocket allowance + ₹8,000 freelance reels',
    lifestyleConstraint: 'Budget conscious, aesthetic obsessed, hyper-aware of influencer deceit and algorithm burnout',
    sampleVentSnippets: [
      'Every brand is suddenly "100% eco-friendly and clean" until you check the third chemical on the back.',
      'I spent ₹800 on a viral Korean glass skin serum that broke me out in cystic acne before my college fest.',
      'My FYP is 90% sponsored ads disguised as "girls, I found the holy grail." No one tells the truth anymore.'
    ],
    tone: 'Hyper-articulate Gen-Z slang, cynical about performative brand activism, values aesthetic honesty.',
    culturalFrictions: [
      'Instantly detects scripted influencer sponsorships.',
      'Hates "How do you do fellow kids" corporate Gen-Z lingo.',
      'Boycotts brands that test on animals or exploit sweatshop labor.'
    ],
    buyingRituals: [
      'Checks Reddit (r/IndianSkincareAddicts) and barcode apps before buying personal care.',
      'Splits purchases with friends using BNPL or group discounts.'
    ],
    stories: [
      {
        id: 'tanvi-story-1',
        title: 'The Viral Influencer Betrayal',
        situation: 'Washing off a broken-out face after trying a viral serum',
        timestamp: 'Monday, 11:30 PM',
        audioDuration: '0:43',
        transcript: 'Three different beauty creators with 500k followers posted the exact same talking points about this "miracle saffron oil." They all used the phrase "literally changed my skin barrier in three days." I saved money for three weeks to buy that ₹699 bottle. By day four, my cheeks were covered in red fungal bumps. Later I found out the brand pays ₹50,000 per reel with strict contracts forbidding negative remarks. Brands don’t want creators; they want human billboards. If your product is actually good, why do you need 40 influencers to lie for you?',
        emotionalTension: 'Distrust of Paid Authenticity & Peer Betrayal',
        brandTrigger: 'Scripted micro-influencer campaigns and instant cure claims',
        acceptedTones: ['Scientific transparency', 'Radical ingredient honesty', 'Clean minimalist design'],
        pushbackTones: ['Fake aesthetic buzzwords', 'Boomer corporate slang attempts', 'Dramatic 7-day cures']
      }
    ],
    pitchAcceptanceCriteria: {
      mustHave: ['Third-party certified clean ingredients', 'Cruelty-free proof', 'No cringe slang'],
      dealBreakers: ['"Reveal your virgin glow in 7 days"', 'Plastic heavy packaging', 'Over-dramatic fear of chemicals'],
      winningSlogans: [
        'Clinically proven barrier support. No buzzwords, no filters.',
        'Honest skincare that doesn’t need 40 influencers to convince you.'
      ],
      pushbackSlogans: [
        'Stop poisoning your skin with synthetic parabens! 100% virgin glow in 7 days.',
        'Be a boss babe with our slay-worthy glam kit!'
      ]
    }
  },

  // 7. Col. Harish Nambiar (Retd.) (Diabetic Senior)
  {
    id: 'avatar-retired-senior',
    name: 'Col. Harish Nambiar (Retd.)',
    cohortId: 'senior',
    cohortName: 'Retirees & Diabetic Senior Citizens',
    city: 'Kochi / Bengaluru',
    age: 67,
    occupation: 'Retired Army Officer & Resident Welfare Secretary',
    avatarEmoji: '🎖️',
    accentColor: '#5C6BC0',
    bio: 'Manages Type-2 diabetes for 14 years. Walks 5 km every morning at 5:45 AM. Deeply loyal to institutional Indian heritage brands (Tata, Amul, Hamdard) and highly suspicious of modern venture-funded D2C wellness.',
    trainedVentsCount: 220,
    incomeTier: 'Defense Pension: ₹58,000 / month',
    lifestyleConstraint: 'Strict glycemic index monitoring, medication compliance, values peace and institutional integrity',
    sampleVentSnippets: [
      'These modern D2C health packets write "Sugar Free" on the front in bold, but hide maltodextrin in microscopic font on the back.',
      'My grandson ordered a bottle of health juice that arrived in three layers of plastic wrap. Utter criminal waste.',
      'I don’t want fancy packaging. Give me pure whole grain that keeps my fasting blood sugar below 110.'
    ],
    tone: 'Dignified, articulate, rigorous, values discipline and clinical proof over trendy lifestyle branding.',
    culturalFrictions: [
      'Disgusted by gimmicky Western wellness fads repackaging Indian haldi and neem at 10x prices.',
      'Frustrated by illegible tiny fonts on medicine and grocery packaging.',
      'Distrusts startups that have no physical office or factory heritage.'
    ],
    buyingRituals: [
      'Inspects nutritional tables with a magnifying glass.',
      'Buys monthly staples from traditional cooperative stores or trusted chemist networks.'
    ],
    stories: [
      {
        id: 'nambiar-story-1',
        title: 'The Hidden Sugar Trap at Morning Tea',
        situation: 'Checking blood sugar after eating "diabetic friendly" biscuits',
        timestamp: 'Tuesday, 8:15 AM',
        audioDuration: '0:46',
        transcript: 'I take pride in my discipline. For 14 years my HbA1c was 6.4. Last month, my daughter bought these expensive "special diabetic oat biscuits" priced at ₹250 a box. The packaging had a picture of a stethoscope and claimed zero sugar. Two days later, my post-prandial reading jumped to 198! I took my magnifying glass to the box: Maltodextrin, high fructose corn syrup, and palm fat disguised under code numbers! This is criminal negligence. In the army, misleading a patrol on terrain is a court-martial offense. Brands that play with the blood sugar of elderly citizens for profit should face legal sanctions.',
        emotionalTension: 'Violated Health Vigilance & Betrayed Dignity',
        brandTrigger: 'Deceptive "Diabetic Friendly" front-of-pack claims',
        acceptedTones: ['Laboratory verified glycemic data', 'Clear bold typography', 'Longstanding institutional pedigree'],
        pushbackTones: ['Faux medical gimmicks', 'Youthful dismissive jargon', 'Excessive packaging waste']
      }
    ],
    pitchAcceptanceCriteria: {
      mustHave: ['Verifiable glycemic index metrics', 'Large legible nutritional labels', 'Subtle natural taste without artificial sweeteners'],
      dealBreakers: ['Hidden maltodextrin/invert syrup', 'Excessive plastic blister waste', 'Condescending elderly tropes'],
      winningSlogans: [
        'Zero added sugar, clinically measured glycemic impact you can verify.',
        'Purity tested for decades. Trust that speaks through numbers.'
      ],
      pushbackSlogans: [
        'Live active at 60 like you did at 20 with our miracle stevia bites!',
        'No added sugar! Indulge without consequence.'
      ]
    }
  },

  // 8. Dr. Sneha Roy (Working Pediatric Mother)
  {
    id: 'avatar-new-parent',
    name: 'Dr. Sneha Roy',
    cohortId: 'working-mother',
    cohortName: 'Working Mothers & Healthcare Professionals',
    city: 'Kolkata',
    age: 31,
    occupation: 'Pediatric Resident & Mother of a 2-Year-Old',
    avatarEmoji: '🩺',
    accentColor: '#00897B',
    bio: 'Navigates 36-hour hospital emergency duty rotations while constantly agonizing over toddler nutrition and daycare safety. Exhausted by conflicting online parenting advice and predatory baby brand melodrama.',
    trainedVentsCount: 285,
    incomeTier: '₹82,000 / month',
    lifestyleConstraint: 'Extreme sleep deficit, erratic duty shifts, acute maternal separation guilt',
    sampleVentSnippets: [
      'I was reviving an infant in the NICU while my mother called saying my own child refused to drink his milk.',
      'Baby food brands use soft violin music in ads to imply that if you feed formula or bottled purees, you don’t love your child.',
      'I don’t have time to boil organic ragi porridge for 45 minutes at 6 AM before my hospital shift.'
    ],
    tone: 'Clinically sharp, emotionally vulnerable, protective, exhausted by guilt-inducing advertising.',
    culturalFrictions: [
      'Fiercely pushes back against ads that guilt working mothers for relying on convenience products.',
      'Skeptical of "organic" marketing that lacks pediatric clinical safety trials.',
      'Hates leaky baby wipes and noisy diaper tape that wakes up a sleeping toddler.'
    ],
    buyingRituals: [
      'Subscribes to baby care essentials on auto-replenishment via quick commerce.',
      'Reads pediatric clinical pharmacology journals rather than parenting Instagram influencers.'
    ],
    stories: [
      {
        id: 'sneha-story-1',
        title: 'The NICU Shift and the Leaky Diaper',
        situation: 'Coming home at 7:00 AM after a grueling 24-hour pediatric rotation',
        timestamp: 'Wednesday, 7:15 AM',
        audioDuration: '0:51',
        transcript: 'I stepped into our flat after a 24-hour emergency shift. My scrubs were soaked in antiseptic. I found my 2-year-old son crying because his diaper had leaked right through his pyjamas and mattress sheet. The brand claimed "12-hour leak lock protection." He had severe redness on his inner thighs. I sat on the floor and cried with him. As a pediatrician, I treat sick children all day, but as a mother, I felt like a failure because a brand’s taped seal failed. Don’t tell me your diaper makes my baby smile—tell me the exact absorption capacity in milliliters and whether the elastic cuffs leave pressure welts.',
        emotionalTension: 'Maternal Guilt Compounded by Product Failure',
        brandTrigger: 'Fluffy emotional diaper ads that fail in basic overnight leak proofing',
        acceptedTones: ['Clinical pediatric safety', 'Honest time-saving utility', 'Zero guilt induction'],
        pushbackTones: ['Maternal guilt tripping', 'Melodramatic emotional manipulation']
      }
    ],
    pitchAcceptanceCriteria: {
      mustHave: ['Dermatologist and pediatric safety certifications', 'High-absorbency technical specs', 'Time-saving single-handed packaging'],
      dealBreakers: ['Shaming working mothers', 'Leaky packaging closures', 'Strong artificial perfumes in baby products'],
      winningSlogans: [
        'Pediatrician approved gentle protection. Designed for real working nights.',
        'Nutritious meals in 3 minutes because quality time matters more than kitchen guilt.'
      ],
      pushbackSlogans: [
        'Is your child falling behind? Give them the Olympic gold champion edge!',
        'Nothing replaces a mother’s slow-cooked touch.'
      ]
    }
  }
];

// Pre-computed dynamic evaluation engine for instant high-fidelity avatar feedback
export function getPrecomputedAvatarFeedback(avatar: SyntheticAvatar, pitch: string): AvatarFeedback {
  const pitchLower = pitch.toLowerCase();

  // Test 1: Toxic hustle / "sleep when you are dead"
  if (pitchLower.includes('sleep when you') || pitchLower.includes('24/7') || pitchLower.includes('warrior') || pitchLower.includes('hustle')) {
    if (avatar.id === 'avatar-startup-burnout' || avatar.id === 'avatar-gig-delivery' || avatar.id === 'avatar-tier2-migrant' || avatar.id === 'avatar-aspirant-pressure') {
      return {
        resonanceScore: 14,
        verdict: 'Strong Cultural Pushback',
        avatarQuote: `Bhai, this sounds like an executive in an air-conditioned cabin lecturing someone working a 14-hour shift. We don't want to be "unstoppable 24/7 warriors"—we want our heart rates under 100 BPM and 7 hours of uninterrupted sleep without Slack notifications.`,
        pushbackPoints: [
          'Romanticizes chronic sleep deprivation and cardiac strain as personal virtues.',
          'Tone-deaf to the reality of white-collar burnout and blue-collar gig fatigue.',
          'Triggers immediate cynical eye-rolls and brand boycott sentiment.'
        ],
        acceptanceSignals: [
          'The font and visual design might catch attention for 2 seconds before the copy repels.'
        ],
        authenticReframing: `Focus on restorative energy—calm sustained stamina that protects health, rather than hollow adrenaline spikes. Speak of quiet recovery and restful boundaries.`,
        culturalInsight: `In metro India, the 2020-2026 era marked the collapse of "hustle pride." Tech workers and gig riders now view 24/7 glorification as systemic exploitation.`,
        emotionalTriggers: ['Burnout Rage', 'Hustle Fatigue', 'Cynicism'],
        recommendedSlogans: [
          {
            style: 'High-Empathy Recovery Variant',
            slogan: 'Calm sustained energy that powers your workday without stealing your night sleep.',
            rationale: 'Validates stamina needs without encouraging destructive insomnia.'
          },
          {
            style: 'Grounded Vernacular Variant',
            slogan: 'Dimaag thanda, kaam pakka. Sachi taakat jo thakne na de.',
            rationale: 'Replaces aggressive warrior jargon with traditional calm endurance.'
          }
        ],
        socialMediaReaction: [
          {
            platform: 'Reddit (r/developersIndia)',
            simulatedComment: 'Peak toxic corporate cringe. Next they will add caffeine to our office water dispensers so we don’t leave our desks.',
            sentiment: 'negative'
          },
          {
            platform: 'Instagram Comments',
            simulatedComment: 'Bro my resting heart rate is already 110 at 29, please stop promoting cardiac arrest as a lifestyle 💀',
            sentiment: 'negative'
          }
        ]
      };
    }
  }

  // Test 2: Heritage / Dadi ke haath ki adrak chai / Nostalgia
  if (pitchLower.includes('dadi') || pitchLower.includes('adrak') || pitchLower.includes('pahadi') || pitchLower.includes('nostalgia') || pitchLower.includes('chai')) {
    if (avatar.id === 'avatar-tier2-migrant' || avatar.id === 'avatar-retired-senior' || avatar.id === 'avatar-tier2-homemaker') {
      return {
        resonanceScore: 89,
        verdict: 'High Resonance',
        avatarQuote: `This hits right in the chest. When you live in a rented flat 1,500 kilometers away from home, that crushed ginger aroma is the only thing that anchors you. Just please don't charge ₹450 for a tiny tin can!`,
        pushbackPoints: [
          'The "high-rise balcony" line assumes everyone in the metro lives in a luxury apartment; many of us share cramped rooms.',
          'Price point must remain accessible to everyday tea drinkers.'
        ],
        acceptanceSignals: [
          'Genuine sensory triggers: crushed fresh ginger, misty mountain morning, sensory warmth.',
          'Honors traditional tea rituals rather than pushing artificial quick-dissolve powders.'
        ],
        authenticReframing: `Ground the visual in real rental flats and shared kitchen stoves, not just elite gated high-rise penthouses. Highlight affordable daily packet sizes.`,
        culturalInsight: `Tea is not a beverage in urban India; it is an emotional shock absorber and surrogate for maternal warmth among displaced migrants.`,
        emotionalTriggers: ['Nostalgic Longing', 'Comfort', 'Home Sickness'],
        recommendedSlogans: [
          {
            style: 'High-Empathy Sensory Variant',
            slogan: 'Ghar ke chulhe jaisi adrak ki khushboo, har uss shehar mein jahan aap naya aashiyana bana rahe hain.',
            rationale: 'Acknowledges the migrant journey of making a home in an unfamiliar city.'
          },
          {
            style: 'Daily Ritual Variant',
            slogan: 'Pahadi Chai: 5 minutes of quiet mountain peace before your morning rush begins.',
            rationale: 'Positions the tea as an accessible daily sanctuary.'
          }
        ],
        socialMediaReaction: [
          {
            platform: 'WhatsApp Family Group',
            simulatedComment: 'Reminded me of winter mornings in Dehradun. Shared this ad with my daughter in Bengaluru.',
            sentiment: 'positive'
          },
          {
            platform: 'Twitter / X',
            simulatedComment: 'Finally a tea brand that doesn’t use British tea-cup imagery. This feels like real Indian chai.',
            sentiment: 'positive'
          }
        ]
      };
    }
  }

  // Test 3: Clean Beauty / Toxin Free / Virgin glow in 7 days
  if (pitchLower.includes('toxin') || pitchLower.includes('glow') || pitchLower.includes('7 days') || pitchLower.includes('organic') || pitchLower.includes('ayurvedic')) {
    if (avatar.id === 'avatar-genz-creator' || avatar.id === 'avatar-new-parent') {
      return {
        resonanceScore: 32,
        verdict: 'Skeptical / Needs Work',
        avatarQuote: `"Virgin glow in 7 days"? Come on, who wrote this copy? Skin barrier cell turnover takes 28 days minimum. Any product promising a 7-day miracle is either bleaching your skin or paying creators to use heavy beauty filters.`,
        pushbackPoints: [
          'Uses fear-mongering words like "stop poisoning your skin" which Gen-Z sees through.',
          'The phrase "virgin glow" feels creepy, outdated, and morally charged.',
          'Dramatic 7-day timeline triggers immediate influencer-scam alarm bells.'
        ],
        acceptanceSignals: [
          'Interest in cold-pressed Kumkumadi and natural formulations remains high if substantiated.'
        ],
        authenticReframing: `Drop the purity shame and unrealistic timelines. Frame it as "Skin Barrier Nourishment" with third-party clinical trial percentages and cruelty-free certification.`,
        culturalInsight: `Indian Gen-Z and millennial women have transitioned from aspirational fairness dreams to rigorous dermatological label-reading.`,
        emotionalTriggers: ['Skepticism', 'Influencer Fatigue', 'Desire for Real Science'],
        recommendedSlogans: [
          {
            style: 'Clinical Botanical Variant',
            slogan: 'Pure cold-pressed Kumkumadi that strengthens your skin barrier over 4 honest weeks.',
            rationale: 'Replaces dramatic overnight promises with credible clinical timelines.'
          },
          {
            style: 'Transparent Clean Variant',
            slogan: 'No synthetic fillers. 100% disclosed botanicals. Your skin at its calmest.',
            rationale: 'Appeals directly to ingredient scanner app users.'
          }
        ],
        socialMediaReaction: [
          {
            platform: 'Reddit (r/IndianSkincareAddicts)',
            simulatedComment: '"Virgin glow in 7 days" lmaooo which marketing uncle approved this copy? Hard pass.',
            sentiment: 'negative'
          },
          {
            platform: 'Instagram Reel Audio',
            simulatedComment: 'Check the barcode scanner guys, bet it has fragrance listed as the 4th ingredient.',
            sentiment: 'mixed'
          }
        ]
      };
    }
  }

  // Test 4: Quick Commerce / "Why haggle with dusty kiranas"
  if (pitchLower.includes('haggling') || pitchLower.includes('dusty') || pitchLower.includes('mandi') || pitchLower.includes('7 minutes') || pitchLower.includes('kirana')) {
    return {
      resonanceScore: 38,
      verdict: 'Alienating',
      avatarQuote: `Why are tech startups always so disrespectful towards local sabzi mandis and kiranas? My local Gupta ji gives me fresh coriander for free and lets my mother buy on monthly credit. Don't insult our street vendors just to sell your 7-minute app.`,
      pushbackPoints: [
        'Disparaging local street culture as "dusty and wasteful" creates moral repulsion.',
        'Ignoring that kiranas provide interest-free credit and community trust to Indian households.',
        'Consumers feel guilty about delivery riders racing dangerously in rain for minor convenience.'
      ],
      acceptanceSignals: [
        'Speed is genuinely valued for emergencies (late-night milk, medicine, sudden guests).'
      ],
      authenticReframing: `Highlight the emergency convenience of instant delivery without attacking traditional local vendors. Position it as a lifesaver when you are in a pinch.`,
      culturalInsight: `Urban Indians love quick commerce efficiency, but carry strong emotional loyalty towards neighborhood grocers. Insulting kiranas triggers immediate brand backlash.`,
      emotionalTriggers: ['Moral Discomfort', 'Community Loyalty', 'Defensiveness'],
      recommendedSlogans: [
        {
          style: 'Emergency Lifesaver Variant',
          slogan: 'When the milk boils over or guests arrive unannounced—groceries in minutes.',
          rationale: 'Focuses purely on situational relief without demeaning traditional retail.'
        },
        {
          style: 'Respectful Modern Variant',
          slogan: 'More time for family dinner, zero compromise on fresh kitchen staples.',
          rationale: 'Frames the benefit around family time rather than elitist speed.'
        }
      ],
      socialMediaReaction: [
        {
          platform: 'Twitter / X',
          simulatedComment: 'Another VC app acting like neighborhood kirana shops are our enemies. I will always support my local bhaiya.',
          sentiment: 'negative'
        },
        {
          platform: 'LinkedIn Pulse',
          simulatedComment: 'Tone-deaf marketing. Convenience should elevate Indian commerce, not demean the unorganized retail backbone.',
          sentiment: 'mixed'
        }
      ]
    };
  }

  // Default deep contextual evaluation
  return {
    resonanceScore: 64,
    verdict: 'Skeptical / Needs Work',
    avatarQuote: `Dekho, the idea is fine, but it sounds like someone in a plush Bandra conference room wrote it without ever experiencing our daily routine. If you want us to believe you, speak to our real problems, not an idealized commercial script.`,
    pushbackPoints: [
      'The pitch relies on generic advertising vocabulary that fails to stand out from category competitors.',
      `Does not address the primary friction of ${avatar.name}: ${avatar.culturalFrictions[0]}`,
      'Needs clearer value justification for middle-income Indian households.'
    ],
    acceptanceSignals: [
      'The core category intent is relevant to everyday lifestyle needs.'
    ],
    authenticReframing: `Reframe with localized colloquial resonance. Anchor the promise in ${avatar.buyingRituals[0] || 'clear price transparency and dependable daily performance'}.`,
    culturalInsight: `${avatar.cohortName} consumers prioritize authenticity, value parity, and emotional respect over flashy Western marketing templates.`,
    emotionalTriggers: ['Hesitation', 'Desire for Transparency', 'Value Consciousness'],
    recommendedSlogans: [
      {
        style: 'High-Resonance Empathetic Variant',
        slogan: `${avatar.pitchAcceptanceCriteria?.winningSlogans[0] || 'Quality you can trust every single day, without compromise.'}`,
        rationale: 'Aligns directly with this persona’s core lived emotional expectations.'
      },
      {
        style: 'Transparent Value Variant',
        slogan: 'Honest ingredients, honest pricing, for real Indian homes.',
        rationale: 'Removes corporate fluff in favor of grounded functional clarity.'
      }
    ],
    socialMediaReaction: [
      {
        platform: 'Instagram Comments',
        simulatedComment: 'Decent product idea, but the caption feels copy-pasted from an international campaign.',
        sentiment: 'mixed'
      },
      {
        platform: 'WhatsApp Shared Story',
        simulatedComment: 'Would try it once if they offer a sample trial size at the local store.',
        sentiment: 'positive'
      }
    ]
  };
}
