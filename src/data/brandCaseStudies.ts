export interface BrandCaseStudy {
  id: string;
  brandName: string;
  parentCompany: string;
  category: string;
  subcategory: string;
  brandLogoEmoji: string;
  bannerColor: string;
  targetCities: string[];
  studyDuration: string;
  sampleSize: string;
  problemStatement: string;
  methodology: string;
  unfilteredConsumerFriction: string;
  verbatimQuote: {
    speaker: string;
    city: string;
    text: string;
    audioDuration: string;
    emotionalTone: string;
  };
  actionableTurnaround: string;
  businessImpact: string;
  metrics: {
    sentimentBefore: number; // percentage positive
    sentimentAfter: number;
    resonanceScore: number;
    verifiedDataPoints: number;
  };
  templateConfig: {
    brandName: string;
    category: string;
    targetCities: string[];
    objective: string;
    prompt: string;
    durationMonths: number;
  };
}

export const BRAND_CASE_STUDIES: BrandCaseStudy[] = [
  // 1. Amul
  {
    id: 'cs-amul-probiotic',
    brandName: 'Amul',
    parentCompany: 'GCMMF',
    category: 'Dairy & Beverages',
    subcategory: 'Probiotic Buttermilk & Value Milk Pouches',
    brandLogoEmoji: '🥛',
    bannerColor: '#2196F3',
    targetCities: ['Ahmedabad', 'Pune', 'Indore', 'Lucknow'],
    studyDuration: '2 Months',
    sampleSize: '1,420 Audio Stories (580 min)',
    problemStatement: 'Amul needed to understand why Tier-2 consumers resisted moving from traditional loose curd/chaas to packaged single-serve probiotic buttermilk cartons despite heavy TV advertising.',
    methodology: 'Deployed an anonymous voice prompt across morning routine hours (6 AM - 10 AM) in 4 cities asking homemakers and young office-goers to describe their honest curd-making and breakfast drinks rituals.',
    unfilteredConsumerFriction: 'Consumers perceived shelf-stable tetra packs as containing "hidden chemical preservatives" and found the flavor "too artificial/sour" compared to homemade dahi whey water. Furthermore, the ₹30 price point alienated daily drinkers who expected ₹15 pouch parity.',
    verbatimQuote: {
      speaker: 'Sangeeta P., 38, Homemaker',
      city: 'Indore',
      text: 'Packet chaas has this weird metallic sourness aftertaste. If I serve it to my father-in-law, he immediately says it has medicine inside. We want fresh tadka taste, not sterile airline food.',
      audioDuration: '0:38',
      emotionalTone: 'Skeptical / Protective of Family Health'
    },
    actionableTurnaround: 'Amul pivoted away from sterile "probiotic science" jargon toward "Desi Jeera Tadka" flavor profiles in flexible ₹15 cold-chain pouches with transparent churn-line transparency.',
    businessImpact: '+28% regional volume surge in Tier-2 modern trade within 90 days; marketing spend reallocation saved ₹3.4 Cr from ineffective generic health campaigns.',
    metrics: {
      sentimentBefore: 42,
      sentimentAfter: 76,
      resonanceScore: 84,
      verifiedDataPoints: 1420
    },
    templateConfig: {
      brandName: 'Amul',
      category: 'Dairy & Beverages',
      targetCities: ['Ahmedabad', 'Pune', 'Indore', 'Lucknow'],
      objective: 'Voice of Consumer & Shrinkflation / Pack Weight Friction Audit',
      prompt: 'When was the last time you bought packaged buttermilk or lassi instead of making it at home? What made you hesitate or feel unsatisfied with the taste?',
      durationMonths: 2
    }
  },

  // 2. Maggi
  {
    id: 'cs-maggi-hostel',
    brandName: 'Maggi',
    parentCompany: 'Nestlé India',
    category: 'Packaged Foods',
    subcategory: 'Instant Noodles & Seasoning Cubes',
    brandLogoEmoji: '🍜',
    bannerColor: '#E53935',
    targetCities: ['Bengaluru', 'Delhi NCR', 'Pune', 'Kolkata'],
    studyDuration: '3 Months (Longitudinal)',
    sampleSize: '2,150 Audio Stories (890 min)',
    problemStatement: 'Following shrinkflation adjustments from 70g to 60g, Nestlé witnessed a sharp increase in customer churn toward regional spicy competitors among college students and midnight tech workers.',
    methodology: 'Gathered 2 AM - 4 AM voice booth recordings from hostel clusters and IT corridors capturing raw cravings, portion satiety vents, and cooking modifications.',
    unfilteredConsumerFriction: 'A single 60g cake no longer filled an adult appetite after a 10-hour shift, forcing consumers to cook two packets (leaving them feeling guilty and bloated) or add raw eggs/veggies. The milder tastemaker was also losing relevance against spicy Korean ramen trends.',
    verbatimQuote: {
      speaker: 'Tanmay K., 23, Junior Developer',
      city: 'Bengaluru (HSR Layout)',
      text: 'One packet is a joke now—it finishes in three bites. If I make two, it feels greasy. And the masala has lost its punch; I have to throw in red chilli powder and peri-peri to make it taste alive.',
      audioDuration: '0:42',
      emotionalTone: 'Frustrated / Unfulfilled Craving'
    },
    actionableTurnaround: 'Nestlé introduced the "Extra-Spicy Midnight Hunger Pack" with 85g cake grammage and double seasoning sachet targeting solo night owls.',
    businessImpact: '+22% market share recovery in quick commerce 11 PM - 3 AM sales windows across top 6 metro clusters.',
    metrics: {
      sentimentBefore: 36,
      sentimentAfter: 81,
      resonanceScore: 88,
      verifiedDataPoints: 2150
    },
    templateConfig: {
      brandName: 'Maggi',
      category: 'Packaged Foods',
      targetCities: ['Bengaluru', 'Delhi NCR', 'Pune', 'Kolkata'],
      objective: 'Breakfast & Evening Snack Consumption Unfiltered Rituals',
      prompt: 'Describe your last late-night noodle preparation. Did the single pack fill you, and what extra ingredients did you have to mix in to get satisfied?',
      durationMonths: 3
    }
  },

  // 3. Surf Excel
  {
    id: 'cs-surf-excel-water',
    brandName: 'Surf Excel',
    parentCompany: 'Hindustan Unilever (HUL)',
    category: 'Home Care',
    subcategory: 'Laundry Detergents & Liquid Pods',
    brandLogoEmoji: '🫧',
    bannerColor: '#3F51B5',
    targetCities: ['Chennai', 'Bengaluru', 'Jaipur', 'Hyderabad'],
    studyDuration: '2 Months',
    sampleSize: '1,310 Audio Stories (520 min)',
    problemStatement: 'HUL observed high product abandonment and white powder residue complaints in high-TDS hard water borewell neighborhoods across southern metros.',
    methodology: 'Anonymous audio survey focusing on daily laundry frustrations, washing machine tub cleaning habits, and monsoon clothes drying dampness.',
    unfilteredConsumerFriction: 'Detergent powder was clotting into gummy chalk in cold hard water, leaving white streaks on school uniforms and causing children skin itching. Liquid detergents were deemed "too expensive" because domestic workers poured capfuls without measuring.',
    verbatimQuote: {
      speaker: 'Kavitha R., 35, IT Consultant & Parent',
      city: 'Chennai',
      text: 'Our borewell water is so hard that regular Surf leaves a white layer on my daughter’s navy school skirt. My maid puts four caps of liquid because she thinks foam equals cleaning.',
      audioDuration: '0:45',
      emotionalTone: 'Exhausted / Cost Burdened'
    },
    actionableTurnaround: 'Launched specialized "Hard Water Dissolve Formula" with auto-dosing squeeze bottles and water-softening enzymes tailored for southern borewell regions.',
    businessImpact: 'Retention rates rose by 19% in targeted borewell zones; liquid detergent conversion grew by 31% via the measured dosing nozzle innovation.',
    metrics: {
      sentimentBefore: 45,
      sentimentAfter: 79,
      resonanceScore: 82,
      verifiedDataPoints: 1310
    },
    templateConfig: {
      brandName: 'Surf Excel',
      category: 'Home Care',
      targetCities: ['Chennai', 'Bengaluru', 'Jaipur', 'Hyderabad'],
      objective: 'Packaging Usability & Climate Durability (Monsoon / Humidity)',
      prompt: 'How does your detergent behave in your daily washing routine? Do you notice white marks, stiffness in clothes, or excessive foaming issues?',
      durationMonths: 2
    }
  },

  // 4. Tata Tea
  {
    id: 'cs-tata-tea-premium',
    brandName: 'Tata Tea',
    parentCompany: 'Tata Consumer Products',
    category: 'Hot Beverages',
    subcategory: 'Packet Tea & Kadak Chai Leaves',
    brandLogoEmoji: '🫖',
    bannerColor: '#4CAF50',
    targetCities: ['Kolkata', 'Lucknow', 'Patna', 'Delhi NCR'],
    studyDuration: '3 Months',
    sampleSize: '1,890 Audio Stories (740 min)',
    problemStatement: 'Tata Tea wanted to decode why young urban professionals who grew up drinking strong family kadak chai were drifting toward boutique coffee or instant premixes during workday stress moments.',
    methodology: 'Tracked 4 PM "Tea Tapri vs Kitchen Break" audio rants to capture the emotional significance of the mid-afternoon brewing ritual.',
    unfilteredConsumerFriction: 'Consumers felt commercial tea bag brands offered "colored warm water without soul," while preparing authentic boiled leaf tea at office pantries was impossible. They longed for the deep maltiness and bruised adrak aroma of their hometown kitchens.',
    verbatimQuote: {
      speaker: 'Debanjan S., 27, Content Strategist',
      city: 'Kolkata',
      text: 'Office tea machine gives sugary brown syrup that gives me acidity. At 4 PM, I just want a hot cup where I can actually smell crushed ginger and bay leaves like maa used to brew on foggy winter evenings.',
      audioDuration: '0:36',
      emotionalTone: 'Nostalgic / Craving Comfort'
    },
    actionableTurnaround: 'Launched "Tata Tea Gold Care Kadak Brew Bags" utilizing crushed CTC leaves and micro-granulated ginger-clove oils that infuse authentic simmered flavor in boiling water without a stove.',
    businessImpact: 'Achieved ₹38 Cr annualized pipeline in workplace institutional and quick commerce sales channels.',
    metrics: {
      sentimentBefore: 51,
      sentimentAfter: 85,
      resonanceScore: 90,
      verifiedDataPoints: 1890
    },
    templateConfig: {
      brandName: 'Tata Tea',
      category: 'Hot Beverages',
      targetCities: ['Kolkata', 'Lucknow', 'Patna', 'Delhi NCR'],
      objective: 'Brand Authenticity & Generational Sentiment Shift',
      prompt: 'Tell us about your 4 PM tea or coffee break today. Does it give you genuine comfort, or is it just functional caffeine to survive the next meeting?',
      durationMonths: 3
    }
  },

  // 5. Parle-G
  {
    id: 'cs-parle-g-sachet',
    brandName: 'Parle-G',
    parentCompany: 'Parle Products',
    category: 'Biscuits & Bakery',
    subcategory: 'Value Glucose Biscuits',
    brandLogoEmoji: '🍪',
    bannerColor: '#FF9800',
    targetCities: ['Mumbai', 'Jaipur', 'Indore', 'Patna'],
    studyDuration: '1 Month',
    sampleSize: '1,640 Audio Stories (610 min)',
    problemStatement: 'Investigated consumer sentiment when testing psychological price ceilings and biscuit breakage rates in pocket ₹5 and ₹10 packs.',
    methodology: 'Voice booth survey asking chai-tapri visitors and daily wage earners about their biscuit dunking habits and biscuit durability in pocket transport.',
    unfilteredConsumerFriction: 'Consumers noticed that biscuit thickness had reduced over the last decade, causing the biscuit to snap and sink to the bottom of the chai glass during the customary 3-second dunk. Yet, any attempt to raise the ₹5 price point caused severe emotional betrayal.',
    verbatimQuote: {
      speaker: 'Rameshwar J., 41, Auto Driver & Father',
      city: 'Jaipur',
      text: 'Parle-G is the poor man’s almond. But nowadays, the moment you touch it to the hot chai, half the biscuit dissolves and falls to the bottom. Don’t make it thinner; we will gladly pay ₹7 if it holds its strength.',
      audioDuration: '0:34',
      emotionalTone: 'Affectionate / Defensive of Quality'
    },
    actionableTurnaround: 'Reinforced the dough bake profile for structural "dunk density" while preserving the sacred ₹5 and ₹10 price anchors through localized supply chain automation.',
    businessImpact: 'Maintained 99.4% tapri distribution loyalty and halted churn to local unbranded bakery biscuits.',
    metrics: {
      sentimentBefore: 58,
      sentimentAfter: 88,
      resonanceScore: 92,
      verifiedDataPoints: 1640
    },
    templateConfig: {
      brandName: 'Parle-G',
      category: 'Biscuits & Bakery',
      targetCities: ['Mumbai', 'Jaipur', 'Indore', 'Patna'],
      objective: 'Voice of Consumer & Shrinkflation / Pack Weight Friction Audit',
      prompt: 'When you have tea with biscuits, how does your favorite biscuit hold up? Have you noticed any change in size, crunch, or dunking strength lately?',
      durationMonths: 1
    }
  },

  // 6. Britannia Good Day
  {
    id: 'cs-britannia-cookies',
    brandName: 'Britannia Good Day',
    parentCompany: 'Britannia Industries',
    category: 'Biscuits & Bakery',
    subcategory: 'Rich Butter & Nut Cookies',
    brandLogoEmoji: '🧈',
    bannerColor: '#FFB300',
    targetCities: ['Bengaluru', 'Mumbai', 'Ahmedabad', 'Pune'],
    studyDuration: '2 Months',
    sampleSize: '1,250 Audio Stories (490 min)',
    problemStatement: 'Britannia wanted to discover whether consumers felt Good Day was becoming "too sugary" and whether health-conscious families were migrating to digestive biscuits.',
    methodology: 'Analyzed snack box tiffin vents and evening tea snacking diaries across middle-income families.',
    unfilteredConsumerFriction: 'Parents confessed to rationing Good Day for their children due to palm oil and high sugar spikes, while working adults wanted the signature curved smile biscuit with lower sweetness and genuine cashew crunch instead of synthetic cashew essence.',
    verbatimQuote: {
      speaker: 'Aparna V., 32, HR Lead & Mother',
      city: 'Pune',
      text: 'I love the butter taste, but two biscuits leave a thick sugary coating on my teeth. I want to give it to my son without feeling guilty about empty calories.',
      audioDuration: '0:31',
      emotionalTone: 'Health Conscious / Conflicted'
    },
    actionableTurnaround: 'Introduced "Good Day Harmony" featuring 30% less refined sugar, cold-pressed butter notes, and 3x visible almond bits.',
    businessImpact: '+24% incremental sales in Tier-1 quick commerce without cannibalizing standard core SKU volume.',
    metrics: {
      sentimentBefore: 48,
      sentimentAfter: 82,
      resonanceScore: 86,
      verifiedDataPoints: 1250
    },
    templateConfig: {
      brandName: 'Britannia',
      category: 'Biscuits & Bakery',
      targetCities: ['Bengaluru', 'Mumbai', 'Ahmedabad', 'Pune'],
      objective: 'Switching Velocity to Regional / Private Labels',
      prompt: 'What stops you from eating your favorite sweet cookies every day? Do ingredient concerns like palm oil or sugar ever make you put the pack back on the shelf?',
      durationMonths: 2
    }
  },

  // 7. Haldiram's
  {
    id: 'cs-haldirams-namkeen',
    brandName: "Haldiram's",
    parentCompany: "Haldiram's Snacks",
    category: 'Packaged Foods',
    subcategory: 'Traditional Namkeen & Bhujia',
    brandLogoEmoji: '🌶️',
    bannerColor: '#D84315',
    targetCities: ['Delhi NCR', 'Indore', 'Lucknow', 'Jaipur'],
    studyDuration: '2 Months',
    sampleSize: '1,530 Audio Stories (580 min)',
    problemStatement: 'Assessed consumer pushback regarding oiliness and nitrogen pillow pack perception (paying for air) vs local unbranded farsan shops.',
    methodology: 'Recorded spontaneous festive gifting and weekend family chai gathering audio notes across northern Hindi heartland cities.',
    unfilteredConsumerFriction: 'Consumers loved the iconic spice blend but complained that standard 150g foil packs leaked oil onto their fingers when opening, and without a zip-lock seal, the bhujia turned soggy within 48 hours in humid seasons.',
    verbatimQuote: {
      speaker: 'Pooja T., 29, Banking Associate',
      city: 'Lucknow',
      text: 'Half the packet is nitrogen gas. Then when you cut it, oil rubs all over your palm, and by day three, the bhujia loses its crisp snap because there is no ziplock.',
      audioDuration: '0:39',
      emotionalTone: 'Irritated / Practical Friction'
    },
    actionableTurnaround: 'Introduced resealable stand-up zipper pouches with 15% reduced topical surface oil formulation and transparent viewing windows.',
    businessImpact: '+33% repeat pantry purchase frequency and eliminated negative consumer packaging reviews.',
    metrics: {
      sentimentBefore: 54,
      sentimentAfter: 87,
      resonanceScore: 89,
      verifiedDataPoints: 1530
    },
    templateConfig: {
      brandName: "Haldiram's",
      category: 'Packaged Foods',
      targetCities: ['Delhi NCR', 'Indore', 'Lucknow', 'Jaipur'],
      objective: 'Packaging Usability & Climate Durability (Monsoon / Humidity)',
      prompt: 'How long does a packet of namkeen or bhujia stay fresh in your house after opening? What bothers you most about the packet packaging?',
      durationMonths: 2
    }
  },

  // 8. Dettol
  {
    id: 'cs-dettol-soap',
    brandName: 'Dettol',
    parentCompany: 'Reckitt Benckiser',
    category: 'Personal Care',
    subcategory: 'Antiseptic Liquid & Germ Protection Soap',
    brandLogoEmoji: '🧼',
    bannerColor: '#00897B',
    targetCities: ['Mumbai', 'Kolkata', 'Chennai', 'Delhi NCR'],
    studyDuration: '2 Months',
    sampleSize: '1,410 Audio Stories (540 min)',
    problemStatement: 'Following the pandemic hygiene surge, Dettol soap experienced consumer backlash regarding severe winter skin dryness and medicinal hospital fragrance.',
    methodology: 'Gathered post-shower bathroom mirror confessions regarding winter moisturizing struggles and family soap preferences.',
    unfilteredConsumerFriction: 'While mothers trusted Dettol for children playing outside, female family members refused to wash their faces or bodies with it in winter, claiming it stripped natural skin oils and smelled like a clinic ward.',
    verbatimQuote: {
      speaker: 'Meenakshi N., 34, Teacher',
      city: 'Kolkata',
      text: 'Dettol gives peace of mind when kids come back from muddy football. But in winter, my legs look white and scaly like chalk after using it. I have to apply half a bottle of Nivea to stop the itching.',
      audioDuration: '0:41',
      emotionalTone: 'Skin Discomfort / Practical Trade-off'
    },
    actionableTurnaround: 'Formulated "Dettol Aloe & Glycerin Moisture Shield" preserving 99.9% germ protection while clinically elevating epidermal skin hydration by 40%.',
    businessImpact: '+26% household retention during winter quarters and expansion into female personal care basket share.',
    metrics: {
      sentimentBefore: 43,
      sentimentAfter: 80,
      resonanceScore: 85,
      verifiedDataPoints: 1410
    },
    templateConfig: {
      brandName: 'Dettol',
      category: 'Personal Care',
      targetCities: ['Mumbai', 'Kolkata', 'Chennai', 'Delhi NCR'],
      objective: 'Brand Authenticity & Generational Sentiment Shift',
      prompt: 'Do you use germ protection soaps during winter? What makes you switch to moisturizing soaps or body washes when the weather turns dry?',
      durationMonths: 2
    }
  },

  // 9. Colgate-Palmolive
  {
    id: 'cs-colgate-ayurveda',
    brandName: 'Colgate',
    parentCompany: 'Colgate-Palmolive India',
    category: 'Personal Care',
    subcategory: 'Oral Care & Herbal Toothpastes',
    brandLogoEmoji: '🪥',
    bannerColor: '#C62828',
    targetCities: ['Indore', 'Ahmedabad', 'Patna', 'Lucknow'],
    studyDuration: '3 Months',
    sampleSize: '1,670 Audio Stories (670 min)',
    problemStatement: 'Colgate faced intense market share attrition from Patanjali Dant Kanti and herbal alternatives in Tier-2 and Tier-3 traditional consumer strongholds.',
    methodology: 'Conducted early-morning 6 AM - 8 AM voice diary studies on morning freshness rituals, tooth sensitivity complaints, and neem/clove trust.',
    unfilteredConsumerFriction: 'Consumers perceived standard white Colgate fluoride paste as a "cosmetic foaming gel" with no real medicinal power. When Colgate launched herbal extensions, consumers suspected they were merely white paste dyed green with artificial coloring.',
    verbatimQuote: {
      speaker: 'Shailendra V., 46, Government Officer',
      city: 'Patna',
      text: 'If I use regular toothpaste, my gums bleed when chewing hard guava. Herbal pastes should feel astringent and spicy on the gums like real clove oil, not taste like mint bubblegum.',
      audioDuration: '0:44',
      emotionalTone: 'Skeptical / Demanding Traditional Efficacy'
    },
    actionableTurnaround: 'Re-engineered "Colgate Vedshakti" with authentic brown herbal texture, coarse salt scrub particulates, and prominent natural clove tingling action.',
    businessImpact: 'Arrested oral care market share loss in eastern and central India, gaining 3.8% incremental category volume within 6 months.',
    metrics: {
      sentimentBefore: 39,
      sentimentAfter: 78,
      resonanceScore: 83,
      verifiedDataPoints: 1670
    },
    templateConfig: {
      brandName: 'Colgate',
      category: 'Personal Care',
      targetCities: ['Indore', 'Ahmedabad', 'Patna', 'Lucknow'],
      objective: 'Switching Velocity to Regional / Private Labels',
      prompt: 'What toothpaste are you currently using and why did your family switch? Do you believe commercial herbal toothpastes are truly natural?',
      durationMonths: 3
    }
  },

  // 10. Aashirvaad Atta
  {
    id: 'cs-aashirvaad-atta',
    brandName: 'Aashirvaad',
    parentCompany: 'ITC Limited',
    category: 'Staples & Spices',
    subcategory: 'Whole Wheat Chakki Atta',
    brandLogoEmoji: '🌾',
    bannerColor: '#F57C00',
    targetCities: ['Delhi NCR', 'Pune', 'Bengaluru', 'Ahmedabad'],
    studyDuration: '2 Months',
    sampleSize: '1,820 Audio Stories (710 min)',
    problemStatement: 'ITC sought to evaluate why working homemakers complained about rotis turning stiff and dry inside lunch dabbas by 1:30 PM.',
    methodology: 'Prompted working professionals and parents to record audio notes at lunchtime as they opened their stainless steel office tiffins.',
    unfilteredConsumerFriction: 'Rotis cooked at 7:30 AM became rubbery and cracked by midday, forcing employees to order canteen food. Homemakers doubted the "100% whole wheat" claim, assuming bran extraction was occurring at industrial mills.',
    verbatimQuote: {
      speaker: 'Neelam K., 37, Bank Manager',
      city: 'Delhi NCR (Dwarka)',
      text: 'By 1 PM in my office dabba, the roti turns like cardboard leather. You have to tear it like elastic. My husband eats out because he says homemade tiffin is too dry.',
      audioDuration: '0:37',
      emotionalTone: 'Frustrated / Household Guilt'
    },
    actionableTurnaround: 'Pioneered the "4-Step Moisture Lock Chakki Process" and provided transparent water absorption ratio guidelines printed on the front of 5kg and 10kg bags.',
    businessImpact: '+17% consumer preference in double-income household segments and reduced churn to local chakki grain stores.',
    metrics: {
      sentimentBefore: 49,
      sentimentAfter: 84,
      resonanceScore: 87,
      verifiedDataPoints: 1820
    },
    templateConfig: {
      brandName: 'Aashirvaad',
      category: 'Staples & Spices',
      targetCities: ['Delhi NCR', 'Pune', 'Bengaluru', 'Ahmedabad'],
      objective: 'Daily Consumption Rituals (Timing, Family Sharing, Cooking Hacks)',
      prompt: 'How soft do your rotis stay inside your office or school tiffin by lunch hour? Have you switched wheat brands trying to fix dry rotis?',
      durationMonths: 2
    }
  },

  // 11. Mamaearth
  {
    id: 'cs-mamaearth-onion',
    brandName: 'Mamaearth',
    parentCompany: 'Honasa Consumer',
    category: 'Personal Care',
    subcategory: 'D2C Clean Beauty & Hair Oils',
    brandLogoEmoji: '🧅',
    bannerColor: '#43A047',
    targetCities: ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad'],
    studyDuration: '3 Months',
    sampleSize: '1,560 Audio Stories (630 min)',
    problemStatement: 'Mamaearth investigated the growing "cleanwashing" cynicism and post-wash hair dryness complaints among Gen-Z and millennial women using Onion Hair Oil.',
    methodology: 'Gathered post-shower hair care rants, hair-fall comb inspection notes, and D2C influencer credibility audio vents.',
    unfilteredConsumerFriction: 'Consumers felt betrayed when hair-fall did not magically stop within 14 days as promised by Instagram micro-influencers. Furthermore, the strong artificial perfume gave several migraine-prone users headaches while washing.',
    verbatimQuote: {
      speaker: 'Ruchika B., 25, UX Designer',
      city: 'Bengaluru',
      text: 'Every influencer swore this onion oil stopped their hair fall in a week. I spent ₹599 and my shower drain is still clogged with hair, plus the artificial fragrance makes my pillow smell sweet and nauseating.',
      audioDuration: '0:43',
      emotionalTone: 'Betrayed / Influencer Fatigue'
    },
    actionableTurnaround: 'Overhauled packaging claims from dramatic 14-day promises to honest "3-Month Scalp Health Journey," reduced synthetic perfume by 60%, and introduced transparent clinical trial dashboards.',
    businessImpact: 'Repeat customer retention improved from 18% to 32%; cut return/refund ticket volume by half.',
    metrics: {
      sentimentBefore: 35,
      sentimentAfter: 73,
      resonanceScore: 78,
      verifiedDataPoints: 1560
    },
    templateConfig: {
      brandName: 'Custom',
      category: 'Personal Care',
      targetCities: ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad'],
      objective: 'Brand Authenticity & Generational Sentiment Shift',
      prompt: 'Have you purchased viral hair care or skincare products recommended by influencers? Did the real results match the online hype or leave you disappointed?',
      durationMonths: 3
    }
  },

  // 12. Paper Boat
  {
    id: 'cs-paper-boat-nostalgia',
    brandName: 'Paper Boat',
    parentCompany: 'Hector Beverages',
    category: 'Dairy & Beverages',
    subcategory: 'Traditional & Nostalgic Fruit Drinks',
    brandLogoEmoji: '⛵',
    bannerColor: '#00ACC1',
    targetCities: ['Bengaluru', 'Pune', 'Delhi NCR', 'Chennai'],
    studyDuration: '2 Months',
    sampleSize: '1,190 Audio Stories (460 min)',
    problemStatement: 'Paper Boat explored why adult consumers adored the nostalgic storytelling on the pack but hesitated to buy larger 1L family cartons for home dinner tables.',
    methodology: 'Analyzed weekend supermarket trolley confessions and family refrigerator inventory audio logs.',
    unfilteredConsumerFriction: 'While the 200ml pouch was viewed as an emotional solo indulgence during metro commutes, the high sugar content (12g per 100ml) prevented parents from replacing fresh nimbu pani or fruit juices at home.',
    verbatimQuote: {
      speaker: 'Siddharth M., 33, Creative Director',
      city: 'Mumbai',
      text: 'I love their Aam Panna pouch on a flight. But at home with my diabetic parents and 5-year-old daughter, I cannot pour a drink that has 6 teaspoons of refined sugar per glass.',
      audioDuration: '0:35',
      emotionalTone: 'Affectionate but Health-Restricted'
    },
    actionableTurnaround: 'Introduced the "Zero Added Sugar Jaggery & Rock Salt Range" in sustainable glass and family decanters.',
    businessImpact: 'Opened up ₹22 Cr in previously locked family mealtime beverage occasions in Tier-1 metros.',
    metrics: {
      sentimentBefore: 53,
      sentimentAfter: 86,
      resonanceScore: 91,
      verifiedDataPoints: 1190
    },
    templateConfig: {
      brandName: 'Custom',
      category: 'Dairy & Beverages',
      targetCities: ['Bengaluru', 'Pune', 'Delhi NCR', 'Chennai'],
      objective: 'Switching Velocity to Regional / Private Labels',
      prompt: 'What holds you back from serving packaged traditional drinks like Aam Panna or Jaljeera to your family at meal times instead of homemade water or chaas?',
      durationMonths: 2
    }
  },

  // 13. Vim
  {
    id: 'cs-vim-dishwash',
    brandName: 'Vim',
    parentCompany: 'Hindustan Unilever (HUL)',
    category: 'Home Care',
    subcategory: 'Dishwash Bars & Concentrated Gel',
    brandLogoEmoji: '🍋',
    bannerColor: '#C0CA33',
    targetCities: ['Chennai', 'Mumbai', 'Kolkata', 'Hyderabad'],
    studyDuration: '2 Months',
    sampleSize: '1,380 Audio Stories (530 min)',
    problemStatement: 'HUL wanted to resolve the friction between homeowners who buy premium Vim Gel and household domestic workers who prefer coarse green bars with harsh scrub pads.',
    methodology: 'Documented domestic kitchen sink interactions, greasy kadai cleaning battles, and sink drainage clogging vents.',
    unfilteredConsumerFriction: 'Maids complained that liquid gels "slip away with water before cutting through burnt ghee and dal tadka encrusted on aluminium kadais." Meanwhile, dishwash bars melted into a soggy green paste that dissolved down the sink drain.',
    verbatimQuote: {
      speaker: 'Anitha S., 42, Architect',
      city: 'Hyderabad',
      text: 'I buy the ₹150 yellow Vim gel bottle and my maid finishes it in 5 days because she squeezes half a cup on one oily pressure cooker. She insists on the ₹10 green bar because she needs the coarse grit to scrape burned tadka.',
      audioDuration: '0:48',
      emotionalTone: 'Household Disconnect / Wastage Grief'
    },
    actionableTurnaround: 'Engineered "Vim PowerGel Scrubber Pack" featuring a micro-scrubbing sponge that creates high-friction foam with just 3 drops of concentrated gel.',
    businessImpact: 'Reduced product wastage complaints by 44% and drove a 27% upsell from yellow bar users to gel scrub bundles.',
    metrics: {
      sentimentBefore: 47,
      sentimentAfter: 81,
      resonanceScore: 85,
      verifiedDataPoints: 1380
    },
    templateConfig: {
      brandName: 'Custom',
      category: 'Home Care',
      targetCities: ['Chennai', 'Mumbai', 'Kolkata', 'Hyderabad'],
      objective: 'Packaging Usability & Climate Durability (Monsoon / Humidity)',
      prompt: 'Who does the dishes in your house, and how do you handle tough oily tadka stains? Do bars melt away or do gels get wasted too fast?',
      durationMonths: 2
    }
  },

  // 14. Cadbury Dairy Milk
  {
    id: 'cs-cadbury-gifting',
    brandName: 'Cadbury Dairy Milk',
    parentCompany: 'Mondelēz India',
    category: 'Packaged Foods',
    subcategory: 'Confectionery & Festival Gifting Boxes',
    brandLogoEmoji: '🍫',
    bannerColor: '#673AB7',
    targetCities: ['Delhi NCR', 'Lucknow', 'Ahmedabad', 'Jaipur'],
    studyDuration: '3 Months (Diwali Period)',
    sampleSize: '2,040 Audio Stories (810 min)',
    problemStatement: 'Mondelez tracked consumer fatigue around receiving standard Celebrations boxes during Diwali and wedding seasons.',
    methodology: 'Captured anonymous audio confessions around festival gift regifting, chocolate melting in transit, and traditional mithai nostalgia.',
    unfilteredConsumerFriction: 'Consumers admitted that standard ₹150 Celebrations boxes had become "lazy corporate currency" that families passed along to relatives without opening. Younger recipients wanted premium dark chocolate or roasted nut centers rather than standard 5-star and Gems.',
    verbatimQuote: {
      speaker: 'Vivek G., 28, Chartered Accountant',
      city: 'Delhi NCR',
      text: 'Last Diwali, our house received eight Celebrations boxes. We didn’t open a single one—we literally put new gift wrappers on six of them and passed them to neighbors. It feels generic and thoughtless now.',
      audioDuration: '0:36',
      emotionalTone: 'Cynical / Gift Fatigue'
    },
    actionableTurnaround: 'Introduced "Cadbury Silk Artisanal Pralines & Dry Fruit Collections" with personalized printed ribbon cards and temperature-controlled insulated gift carriers.',
    businessImpact: '+38% growth in premium gifting gross merchandise value (GMV) and reduced regifting churn by 29%.',
    metrics: {
      sentimentBefore: 41,
      sentimentAfter: 83,
      resonanceScore: 89,
      verifiedDataPoints: 2040
    },
    templateConfig: {
      brandName: 'Custom',
      category: 'Packaged Foods',
      targetCities: ['Delhi NCR', 'Lucknow', 'Ahmedabad', 'Jaipur'],
      objective: 'Brand Authenticity & Generational Sentiment Shift',
      prompt: 'What did you do with the chocolate gift boxes you received last festive season? Did you eat them with excitement or pass them on to someone else?',
      durationMonths: 3
    }
  },

  // 15. Epigamia
  {
    id: 'cs-epigamia-yogurt',
    brandName: 'Epigamia',
    parentCompany: 'Drums Food International',
    category: 'Dairy & Beverages',
    subcategory: 'Greek Yogurt & High-Protein Smoothies',
    brandLogoEmoji: '🥣',
    bannerColor: '#00BCD4',
    targetCities: ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune'],
    studyDuration: '2 Months',
    sampleSize: '980 Audio Stories (390 min)',
    problemStatement: 'Epigamia wanted to decode why gym enthusiasts and fitness seekers bought one cup of Greek yogurt for Instagram but failed to convert into daily repeat subscribers.',
    methodology: 'Collected post-workout breakfast audio logs and fitness pantry check-ins across premium gym and CrossFit communities.',
    unfilteredConsumerFriction: 'Consumers felt the ₹60 price for an 85g cup was prohibitive for daily consumption (adding ₹1,800/month for minimal protein yield of 6g). Additionally, the tart astringency of plain greek yogurt clashed with the Indian palate accustomed to creamy sweet mishti doi.',
    verbatimQuote: {
      speaker: 'Karan D., 26, Fitness Coach',
      city: 'Bengaluru (Indiranagar)',
      text: 'I cannot tell my clients to spend ₹60 every morning on an 85g cup when 4 boiled eggs give double the protein at one-third the price. It tastes like sour hung curd unless they add mango pulp.',
      audioDuration: '0:40',
      emotionalTone: 'Cost Skeptical / Practical Nutrition'
    },
    actionableTurnaround: 'Launched the 400g "Value Kitchen Tub" at ₹140 delivering 32g total protein with natural Alfonso mango puree swirl for seamless breakfast smoothie blending.',
    businessImpact: 'Daily repeat purchase retention expanded by 42% in quick commerce subscriptions.',
    metrics: {
      sentimentBefore: 46,
      sentimentAfter: 77,
      resonanceScore: 80,
      verifiedDataPoints: 980
    },
    templateConfig: {
      brandName: 'Custom',
      category: 'Dairy & Beverages',
      targetCities: ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune'],
      objective: 'Switching Velocity to Regional / Private Labels',
      prompt: 'Do you buy Greek yogurt or high-protein dairy products? What makes you stop buying them regularly—is it the sour taste, the price, or satiety?',
      durationMonths: 2
    }
  },

  // 16. Fortune Cooking Oil
  {
    id: 'cs-fortune-mustard-oil',
    brandName: 'Fortune',
    parentCompany: 'Adani Wilmar',
    category: 'Staples & Spices',
    subcategory: 'Kachi Ghani Mustard & Refined Oils',
    brandLogoEmoji: '🌻',
    bannerColor: '#FDD835',
    targetCities: ['Kolkata', 'Patna', 'Lucknow', 'Delhi NCR'],
    studyDuration: '2 Months',
    sampleSize: '1,490 Audio Stories (560 min)',
    problemStatement: 'Fortune sought to understand why traditional Eastern Indian households rejected modern light/refined oils and demanded eye-watering pungency (jhal) in mustard oil.',
    methodology: 'Gathered Sunday afternoon fish fry and mutton preparation voice journals across Bengal and Bihar migrant households.',
    unfilteredConsumerFriction: 'Home cooks evaluated mustard oil purely by whether the heated oil fumes brought tears to the eyes (the authentic "jhal" test). If an oil was too bland or processed, cooks suspected it was adulterated with cheap palm oil.',
    verbatimQuote: {
      speaker: 'Subhashish B., 51, School Principal',
      city: 'Kolkata',
      text: 'If mustard oil doesn’t make your eyes water when it hits the hot iron kadai, you cannot make genuine ilish macher jhol. These new light oils have no soul; they taste like warm grease.',
      audioDuration: '0:43',
      emotionalTone: 'Passionate / Culinary Heritage'
    },
    actionableTurnaround: 'Launched "Fortune Kachi Ghani Pure Mustard Oil - Teekha Jhal Assurance" certifying 100% first-cold-press pungency with QR trace back to mustard farm origins.',
    businessImpact: '+21% sales growth in eastern regional corridors, outperforming unbranded local expeller oils.',
    metrics: {
      sentimentBefore: 52,
      sentimentAfter: 85,
      resonanceScore: 88,
      verifiedDataPoints: 1490
    },
    templateConfig: {
      brandName: 'Custom',
      category: 'Staples & Spices',
      targetCities: ['Kolkata', 'Patna', 'Lucknow', 'Delhi NCR'],
      objective: 'Daily Consumption Rituals (Timing, Family Sharing, Cooking Hacks)',
      prompt: 'When cooking traditional curries, what tells you whether your cooking oil is pure? What is your reaction when an oil claims to be low-odor or light?',
      durationMonths: 2
    }
  },

  // 17. Lizol
  {
    id: 'cs-lizol-disinfectant',
    brandName: 'Lizol',
    parentCompany: 'Reckitt Benckiser',
    category: 'Home Care',
    subcategory: 'Surface Disinfectants & Floor Cleaners',
    brandLogoEmoji: '🪣',
    bannerColor: '#E91E63',
    targetCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Chennai'],
    studyDuration: '2 Months',
    sampleSize: '1,280 Audio Stories (490 min)',
    problemStatement: 'Lizol needed to understand why older family elders still demanded pungent white phenyl in bathrooms despite buying floral Lizol for living room tiles.',
    methodology: 'Voice recordings of morning household mop routines, pet owner floor sanitization worries, and elder bathroom cleaning habits.',
    unfilteredConsumerFriction: 'Elders equated sweet citrus and lavender scents with "perfume that hides dirt," believing only the harsh medicinal smell of pine phenyl actually killed germs in bathroom tiles and drain outlets.',
    verbatimQuote: {
      speaker: 'Sharda N., 58, Grandmother',
      city: 'Delhi NCR',
      text: 'This pink floral water smells like a car freshener for half an hour, then flies away. In the bathroom, you need something that smells like hospital phenyl so you know cockroaches won’t climb out of the drain.',
      audioDuration: '0:38',
      emotionalTone: 'Traditional Skepticism / Practical Germ Fear'
    },
    actionableTurnaround: 'Introduced "Lizol Pine Power Clean" pairing hospital-grade 99.9% germicidal action with long-lasting natural pine tar disinfectant resonance.',
    businessImpact: 'Captured 22% of legacy unbranded phenyl market volume in traditional multi-generational homes.',
    metrics: {
      sentimentBefore: 44,
      sentimentAfter: 79,
      resonanceScore: 83,
      verifiedDataPoints: 1280
    },
    templateConfig: {
      brandName: 'Custom',
      category: 'Home Care',
      targetCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Chennai'],
      objective: 'Brand Authenticity & Generational Sentiment Shift',
      prompt: 'What fragrance do you expect when your floors are freshly mopped? Does floral scent feel clean to everyone in your house, or do elders still ask for phenyl?',
      durationMonths: 2
    }
  },

  // 18. Patanjali
  {
    id: 'cs-patanjali-honey',
    brandName: 'Patanjali',
    parentCompany: 'Patanjali Ayurved',
    category: 'Staples & Spices',
    subcategory: 'Ayurvedic Honey & Natural Sweeteners',
    brandLogoEmoji: '🍯',
    bannerColor: '#8D6E63',
    targetCities: ['Jaipur', 'Lucknow', 'Indore', 'Patna'],
    studyDuration: '2 Months',
    sampleSize: '1,340 Audio Stories (510 min)',
    problemStatement: 'Following public controversy around C4/NMR sugar syrup adulteration tests in honey, Patanjali investigated consumer trust erosion in morning warm water rituals.',
    methodology: 'Recorded 6 AM - 7 AM morning detox and warm lemon water preparation audio notes across fitness seekers and diabetic households.',
    unfilteredConsumerFriction: 'Consumers conducted informal water drop and matchstick tests at home and noticed crystallization at the bottom of bottles during winter, prompting panic that the honey was merely inverted sugar syrup with honey flavor.',
    verbatimQuote: {
      speaker: 'Girish C., 44, Pharmacist',
      city: 'Jaipur',
      text: 'Last December, the entire bottom half of the bottle turned into a hard white sugar block. When I burned it on a spoon, it smelled like burnt caramel. If I am giving this to my diabetic father, am I healing him or poisoning him?',
      audioDuration: '0:46',
      emotionalTone: 'Deep Anxiety / Betrayed Trust'
    },
    actionableTurnaround: 'Introduced batch-wise verifiable NMR lab test QR codes on every bottle cap and launched an educational campaign explaining natural raw crystallization in pure unheated honey.',
    businessImpact: 'Rebounded consumer trust score from 31% to 69% and stabilized morning health usage.',
    metrics: {
      sentimentBefore: 31,
      sentimentAfter: 69,
      resonanceScore: 74,
      verifiedDataPoints: 1340
    },
    templateConfig: {
      brandName: 'Custom',
      category: 'Staples & Spices',
      targetCities: ['Jaipur', 'Lucknow', 'Indore', 'Patna'],
      objective: 'Brand Authenticity & Generational Sentiment Shift',
      prompt: 'How do you test whether the honey you buy is 100% pure? Have you ever noticed your honey crystallizing or tasting like sugar syrup?',
      durationMonths: 2
    }
  },

  // 19. Blinkit Private Label
  {
    id: 'cs-blinkit-private-label',
    brandName: 'Blinkit Private Label',
    parentCompany: 'Eternal / Blinkit',
    category: 'Staples & Spices',
    subcategory: 'Quick Commerce White Label Pulses & Dry Fruits',
    brandLogoEmoji: '⚡',
    bannerColor: '#FBC02D',
    targetCities: ['Delhi NCR', 'Bengaluru', 'Mumbai', 'Pune'],
    studyDuration: '3 Months',
    sampleSize: '2,200 Audio Stories (860 min)',
    problemStatement: 'Tracked consumer switching velocity from legacy national brands (Tata Sampann, Fortune) to 10-minute delivery app private labels priced 25% lower.',
    methodology: 'Gathered instant unboxing audio reactions when users inspected 1kg dal packets, kaju (cashew) grade sizes, and kitchen cooking performance.',
    unfilteredConsumerFriction: 'While users loved the 10-minute convenience and low prices, they voiced high suspicion regarding stone debris, insect holes in toor dal, and inconsistent cashew sizing. If one bad batch arrived, they immediately reverted to trusted brands.',
    verbatimQuote: {
      speaker: 'Natasha P., 30, Product Lead',
      city: 'Delhi NCR (Gurugram)',
      text: 'I ordered the app’s own brand moong dal because it was ₹40 cheaper. But while washing it, small black stones floated on top. My mother said: "See, never compromise on food grains just to save 10 minutes."',
      audioDuration: '0:40',
      emotionalTone: 'Disappointed / Cautious'
    },
    actionableTurnaround: 'Implemented optical color-sorter cleaning guarantees with transparent clear packaging panels showing clean, stone-free grain sorting.',
    businessImpact: 'Private label repeat purchase frequency rose from 24% to 51%; pantry share captured from legacy kirana players.',
    metrics: {
      sentimentBefore: 40,
      sentimentAfter: 81,
      resonanceScore: 86,
      verifiedDataPoints: 2200
    },
    templateConfig: {
      brandName: 'Custom',
      category: 'Staples & Spices',
      targetCities: ['Delhi NCR', 'Bengaluru', 'Mumbai', 'Pune'],
      objective: 'Switching Velocity to Regional / Private Labels',
      prompt: 'Do you buy quick commerce store brands for staples like dal, rice, or dry fruits? What makes you trust or distrust app-owned grocery labels?',
      durationMonths: 3
    }
  },

  // 20. Head & Shoulders
  {
    id: 'cs-head-and-shoulders',
    brandName: 'Head & Shoulders',
    parentCompany: 'Procter & Gamble (P&G)',
    category: 'Personal Care',
    subcategory: 'Hair Care & Anti-Dandruff Shampoos',
    brandLogoEmoji: '💆',
    bannerColor: '#1976D2',
    targetCities: ['Bengaluru', 'Chennai', 'Pune', 'Hyderabad'],
    studyDuration: '2 Months',
    sampleSize: '1,450 Audio Stories (570 min)',
    problemStatement: 'P&G investigated why users who successfully eradicated dandruff stopped using Head & Shoulders and switched to cosmetic conditioning shampoos.',
    methodology: 'Analyzed weekly hair wash audio journals, post-dry styling complaints, and hard water scalp flare-up rants in tech corridors.',
    unfilteredConsumerFriction: 'Consumers felt the zinc pyrithione formula left hair feeling like "straw/dry broom bristles" unless followed by an expensive conditioner. Once the visible flakes vanished, they immediately quit out of fear of permanent hair coarseness.',
    verbatimQuote: {
      speaker: 'Arjun M., 27, DevOps Specialist',
      city: 'Pune',
      text: 'It kills dandruff in two washes, but my hair feels so rough and dry afterwards that I can’t run my fingers through it. I only use it like emergency medicine once a month, not as my daily shampoo.',
      audioDuration: '0:37',
      emotionalTone: 'Medicinal Trade-Off / Texture Frustration'
    },
    actionableTurnaround: 'Formulated "Head & Shoulders Smooth & Silky Infusion" blending 3x argan conditioning serum with scalp-soothing zinc protection for daily damage-free washing.',
    businessImpact: '+31% increase in continuous weekly usage compliance and reduced cyclical brand switching.',
    metrics: {
      sentimentBefore: 45,
      sentimentAfter: 83,
      resonanceScore: 87,
      verifiedDataPoints: 1450
    },
    templateConfig: {
      brandName: 'Custom',
      category: 'Personal Care',
      targetCities: ['Bengaluru', 'Chennai', 'Pune', 'Hyderabad'],
      objective: 'Packaging Usability & Climate Durability (Monsoon / Humidity)',
      prompt: 'When you use anti-dandruff shampoos, how does your hair feel once it dries? Do you stop using it as soon as the dandruff stops because of dryness?',
      durationMonths: 2
    }
  }
];
