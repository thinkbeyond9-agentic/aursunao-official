import { Story } from './types';

export const MOODS = [
  'anxious',
  'burnout',
  'lonely',
  'hopeful',
  'angry',
  'love',
  'grief',
  'ambition',
  'failure',
  'family',
  'migration',
  'small-town'
];

export const HERO_VARIATIONS = [
  { brandLine: "Tell me stories you can't tell your wife.", brandLine2: "Those 3am thoughts you rehearse but never say? Say them here.", hero1: 'Your brain has', hero2: '47 tabs open.', hero3: "Don't organise them.", hero4: 'Just talk.', heroSub: "Voice-first, anonymous, no judgement. Just talk — we structure the chaos." },
  { brandLine: "Let the 3am chaos out.", brandLine2: "You don't need to hold it all. Just let it out.", hero1: 'Your mind is', hero2: 'full of noise.', hero3: "Don't let it stay.", hero4: 'Just talk.', heroSub: "A safe place for the thoughts you can't say out loud." },
  { brandLine: "Your secrets are safe here.", brandLine2: "No one will know. Just you and the mic.", hero1: 'Your thoughts are', hero2: 'getting heavy.', hero3: "Don't carry them.", hero4: 'Just talk.', heroSub: "No one knows, no one judges. Just vent." },
  { brandLine: "Clarity over overthinking.", brandLine2: "Talking out loud is the best way to think.", hero1: 'You’re overthinking', hero2: 'again.', hero3: "Don't analyse it.", hero4: 'Just talk.', heroSub: "Speak it, hear it, clear it." },
  { brandLine: "Your brain, decluttered.", brandLine2: "We make sense of the noise for you.", hero1: 'Your brain is', hero2: 'so loud.', hero3: "Don't hold it.", hero4: 'Just talk.', heroSub: "Chaos in, structured story out." },
  { brandLine: "Venting, refined.", brandLine2: "Because sometimes you just need to say it.", hero1: 'You have things', hero2: 'to say.', hero3: "Don't keep them.", hero4: 'Just talk.', heroSub: "Your story, structured." },
  { brandLine: "It's okay to feel.", brandLine2: "Whatever it is, you can say it here.", hero1: 'Your feelings are', hero2: 'racing.', hero3: "Don't stop them.", hero4: 'Just talk.', heroSub: "Anonymous, safe, and just for you." },
  { brandLine: "Break the cycle.", brandLine2: "Stop the looping thoughts now.", hero1: 'Your mind is', hero2: 'looping.', hero3: "Don't follow it.", hero4: 'Just talk.', heroSub: "Stop the loop. Get clarity." },
  { brandLine: "Unspoken thoughts, spoken.", brandLine2: "A place for everything left unsaid.", hero1: 'You have unsaid', hero2: 'words.', hero3: "Don't hide them.", hero4: 'Just talk.', heroSub: "Speak the unspoken." },
  { brandLine: "From chaos to calm.", brandLine2: "We help you turn your mess into meaning.", hero1: 'Your chaos is', hero2: 'piling up.', hero3: "Don't keep it.", hero4: 'Just talk.', heroSub: "Turn chaos into stories." },
  { brandLine: "A safe space for you.", brandLine2: "No judgment. Just listening.", hero1: 'You need a', hero2: 'space.', hero3: "Don't look for it.", hero4: 'Just talk.', heroSub: "We listen, we structure." },
  { brandLine: "Hear yourself think.", brandLine2: "Sometimes you need to hear your own voice.", hero1: 'You need to', hero2: 'be heard.', hero3: "Don't hold back.", hero4: 'Just talk.', heroSub: "Hear yourself clearly." },
  { brandLine: "3am, sorted.", brandLine2: "Get the thoughts out of your head and into the library.", hero1: 'It’s 3am and', hero2: 'you’re up.', hero3: "Don't overthink.", hero4: 'Just talk.', heroSub: "Sort the 3am thoughts." },
  { brandLine: "Your voice matters.", brandLine2: "Even when only you hear it.", hero1: 'Your voice is', hero2: 'needed.', hero3: "Don't stay quiet.", hero4: 'Just talk.', heroSub: "Your story is worth telling." },
  { brandLine: "Everything is temporary.", brandLine2: "Your thoughts are just temporary guests.", hero1: 'Your mind is', hero2: 'a busy place.', hero3: "Don't be a host.", hero4: 'Just talk.', heroSub: "Let the thoughts go." }
];

export const TYPES = [
  'career',
  'relationships',
  'family',
  'money',
  'identity',
  'coming-of-age',
  'entrepreneurship'
];

export const MOOD_COLORS: Record<string, string> = {
  anxious: 'bg-[#FF5C5C] text-black',
  burnout: 'bg-zinc-700 text-white',
  lonely: 'bg-[#FF6B5B] text-white',
  hopeful: 'bg-white text-black',
  angry: 'bg-[#FF5C5C] text-white',
  love: 'bg-pink-200 text-black',
  grief: 'bg-zinc-800 text-white',
  ambition: 'bg-[#FF6B5B] text-white',
  failure: 'bg-zinc-600 text-white',
  family: 'bg-orange-200 text-black',
  migration: 'bg-violet-200 text-black',
  'small-town': 'bg-amber-200 text-black',
  happy: 'bg-[#FFD166] text-black',
  frustrated: 'bg-[#FF5C5C] text-white',
  relieved: 'bg-[#06D6A0] text-black',
  stressed: 'bg-[#A78BFA] text-black'
};

export const TRANSLATIONS = {
  en: {
    brand: 'aur sunao.',
    brandLine: "Tell me stories you can't tell your wife.",
    brandLine2: "Those 3am thoughts you rehearse but never say? Say them here.",
    brandLineHiShort: 'वो कहानियाँ जो बीवी को भी नहीं बता सकते',
    navLibrary: 'Library',
    navFlow: 'How it works',
    navPricing: 'Pricing',
    hero1: 'Your brain has',
    hero2: '47 tabs open.',
    hero3: "Don't organise them.",
    hero4: 'Just talk.',
    heroCta: 'Tell me more.',
    heroSub: "Tell me stories you can't tell your wife. Voice-first, anonymous, no judgement. Just talk — we structure the chaos.",
    heroFreeBadge: '21 days free • Unlimited • No card needed',
    reasonsEyebrow: 'Why people press record →',
    reasonsTitle: 'Pick a reason. Any reason.',
    startTalking: 'Start talking →',
    flowEyebrow: 'Creator economy',
    boothEyebrow: 'Voice booth • Anonymous by default',
    boothFreeBadge: '21 days free • Unlimited • No card needed',
    boothTitle: "What's on your mind?",
    boothIdle: 'Enable mic to start talking',
    boothIdleSub: "Voice-only • We don't judge drafts.",
    boothListening: 'Listening... Speak now',
    boothProcessing: 'Finding the structure in your chaos...',
    boothReady: "I think I understand what you're trying to say. Want me to show you the story?",
    boothLiveTitle: 'Live transcript',
    boothAnalysisTitle: 'Structured analysis',
    boothSaving: 'Saving',
    boothSaved: 'Auto-saved',
    showMe: 'Save to library',
    keepTalking: 'Keep talking',
    upload: 'Upload audio / text',
    anonymous: 'Stay Anonymous',
    saveLib: 'Save to my library',
    anonHint: 'Anonymous • Until you choose to reveal. Creator can request legit version.',
    enableMic: 'Enable Microphone',
    enableMicSub: 'We need mic access to hear your story',
    micGranted: 'Mic ready • Tap orb to speak',
    micDeniedTitle: 'Microphone blocked',
    micDeniedDesc: 'Please allow mic in browser settings to continue.',
    micDeniedHow: 'Click the lock icon in address bar → Site settings → Microphone → Allow',
    micPrompt: 'Waiting for permission...',
    micNoDevice: 'No microphone found',
    micTryAgain: 'Try again',
    micHowTo: 'How to enable mic?',
    fallbackMsg: "Your browser doesn't support live transcription, but we can record audio",
    benefits: [
      {
        title: 'Brain feels lighter',
        desc: 'Saying it out loud reduces cortisol. 80% feel calmer after 3 mins of venting.',
        icon: '🧠'
      },
      {
        title: 'No judgement, no advice',
        desc: "Not your wife, not your boss, not your therapist. Just a space that listens.",
        icon: '🤫'
      },
      {
        title: 'You hear yourself clearly',
        desc: 'When you speak, you finally understand what you actually feel. Clarity > overthinking.',
        icon: '💡'
      },
      {
        title: 'Anonymous forever',
        desc: 'Start anonymous. Stay anonymous until YOU choose to reveal. Your spouse never has to know.',
        icon: '👤'
      },
      {
        title: 'Chaos → Story',
        desc: 'AI turns your rant into title, hook, emotion, conflict & insight. Your mess becomes meaning.',
        icon: '✨'
      },
      {
        title: 'Sleep better tonight',
        desc: "The thought that kept you up at 3am? Put it here. Don't carry it to bed.",
        icon: '🌙'
      }
    ],
    libraryEyebrow: 'Structure Library',
    libraryTitle: 'Real stories, structured.',
    searchPh: 'Filter by feeling...',
    allMoods: 'All moods',
    allTypes: 'All types',
    clap: 'Clap',
    helped: 'It helped',
    requestLegit: 'Request legit story',
    paywallTitle: 'Your 21-day free trial ended.',
    paywallDesc: 'Your 21-day free trial ended. Continue with ₹299/mo for 200 stories/month + access to old stories',
    paywallDescFull: 'You had unlimited vents for 21 days. Continue with Aur Sunao+ at ₹299/mo for 200 stories/month + access to old stories, or buy 500 credits for ₹499.',
    free: '21 Days Free',
    plus: 'Plus • ₹299',
    credits: 'Credits',
    login: 'Login',
    logout: 'Anonymous',
    ventsLeft: 'trial • unlimited vents',
    trialBadge: '21 days • Unlimited',
    trialActiveLabel: 'Trial active',
    unlimitedLabel: 'Unlimited vents',
    daysLeft: 'days left',
    freeTierTitle: 'Free',
    freeTierSub: '21 days unlimited, your stories, anonymous',
    plusTierDesc: '200 stories/month • Old access • Export • Analytics',
    creditsTierDesc: '500 extra stories'
  },
  hi: {
    brand: 'और सुनाओ।',
    brandLine: 'वो कहानियाँ जो बीवी को भी नहीं बता सकते, मुझे बताओ।',
    brandLine2: 'जो 3 बजे रात को सोचते हो पर बोलते नहीं? यहाँ बोलो।',
    brandLineHiShort: 'वो कहानियाँ जो बीवी को भी नहीं बता सकते',
    navLibrary: 'लाइब्रेरी',
    navFlow: 'क्यों बोलते हैं',
    navPricing: 'कीमत',
    hero1: 'दिमाग में',
    hero2: '47 टैब खुले हैं।',
    hero3: 'उन्हें ठीक मत करो।',
    hero4: 'बस बोलो।',
    heroCta: 'और सुनाओ।',
    heroSub: 'वो कहानियाँ जो बीवी को भी नहीं बता सकते, मुझे बताओ। वॉइस-फर्स्ट, गुमनाम, बिना जजमेंट। बस बोलो — हम तरतीब बना देंगे।',
    heroFreeBadge: '21 दिन फ्री • अनलिमिटेड • कोई कार्ड नहीं',
    reasonsEyebrow: 'लोग रिकॉर्ड क्यों दबाते हैं →',
    reasonsTitle: 'एक वजह चुनो। कोई भी वजह।',
    startTalking: 'बोलना शुरू करो →',
    flowEyebrow: 'क्रिएटर इकॉनमी',
    boothEyebrow: 'वॉइस बूथ • शुरू में गुमनाम',
    boothFreeBadge: '21 दिन फ्री • अनलिमिटेड • कोई कार्ड नहीं',
    boothTitle: 'क्या चल रहा है दिमाग में?',
    boothIdle: 'माइक चालू करो बात शुरू करने के लिए',
    boothIdleSub: 'सिर्फ़ आवाज़ • हम ड्राफ्ट जज नहीं करते।',
    boothListening: 'सुन रहा हूँ... बोलो',
    boothProcessing: 'तुम्हारी उलझन में कहानी ढूंढ रहा हूँ...',
    boothReady: 'लगता है समझ गया, कहानी दिखाऊँ?',
    boothLiveTitle: 'लाइव ट्रांसक्रिप्ट',
    boothAnalysisTitle: 'कहानी का नक्शा',
    boothSaving: 'सेव हो रहा है',
    boothSaved: 'ऑटो-सेव हो गया',
    showMe: 'लाइब्रेरी में सेव करो',
    keepTalking: 'और बोलो',
    upload: 'ऑडियो / टेक्स्ट अपलोड',
    anonymous: 'गुमनाम रहो',
    saveLib: 'मेरी लाइब्रेरी में सेव करो',
    anonHint: 'गुमनाम • जब तक तुम चाहो। क्रिएटर असली वर्जन मांग सकता है।',
    enableMic: 'माइक चालू करें',
    enableMicSub: 'कहानी सुनने के लिए माइक चाहिए',
    micGranted: 'माइक तैयार • बोलने के लिए दबाओ',
    micDeniedTitle: 'माइक ब्लॉक है',
    micDeniedDesc: 'जारी रखने के लिए ब्राउज़र सेटिंग्स में माइक अनुमति दें।',
    micDeniedHow: 'एड्रेस बार में लॉक आइकन → साइट सेटिंग्स → माइक्रोफोन → अनुमति दें',
    micPrompt: 'अनुमति का इंतज़ार...',
    micNoDevice: 'माइक्रोफ़ोन नहीं मिला',
    micTryAgain: 'फिर से कोशिश करो',
    micHowTo: 'माइक कैसे चालू करें?',
    fallbackMsg: 'इस ब्राउज़र में लाइव ट्रांसक्रिप्शन नहीं है, पर ऑडियो रिकॉर्ड कर सकते हैं',
    benefits: [
      {
        title: 'दिमाग हल्का',
        desc: 'बोलने से cortisol कम होता है। 3 मिनट भड़ास के बाद 80% लोग हल्का महसूस करते हैं।',
        icon: '🧠'
      },
      {
        title: 'न जजमेंट, न सलाह',
        desc: 'न बीवी, न बॉस, न थेरापिस्ट। बस एक जगह जो सुनती है।',
        icon: '🤫'
      },
      {
        title: 'खुद को साफ़ सुनोगे',
        desc: 'बोलोगे तो समझोगे असल में महसूस क्या कर रहे हो। clarity > overthinking.',
        icon: '💡'
      },
      {
        title: 'हमेशा गुमनाम',
        desc: 'शुरू में गुमनाम। हमेशा गुमनाम जब तक तुम चाहो। बीवी को पता भी नहीं चलेगा।',
        icon: '👤'
      },
      {
        title: 'उलझन → कहानी',
        desc: 'AI तुम्हारी भड़ास को टाइटल, हुक, इमोशन, conflict में बदल देता है।',
        icon: '✨'
      },
      {
        title: 'आज रात नींद आएगी',
        desc: 'जो सोच 3 बजे जगाए रखती है? यहीं छोड़ दो। बिस्तर पर मत ले जाओ।',
        icon: '🌙'
      }
    ],
    libraryEyebrow: 'स्ट्रक्चर लाइब्रेरी',
    libraryTitle: 'असली कहानियाँ, तरतीब में।',
    searchPh: 'एहसास से फ़िल्टर करो...',
    allMoods: 'सभी मूड',
    allTypes: 'सभी प्रकार',
    clap: 'ताली',
    helped: 'काम आया',
    requestLegit: 'असली कहानी मांगो',
    paywallTitle: 'तुम्हारा 21 दिन का फ्री ट्रायल खत्म हुआ।',
    paywallDesc: 'Your 21-day free trial ended. Continue with ₹299/mo for 200 stories/month + access to old stories',
    paywallDescFull: '21 दिन तक अनलिमिटेड वेंट्स थे। अब Aur Sunao+ लो ₹299/महीना - 200 कहानियाँ/महीना + पुरानी कहानियों का एक्सेस, या ₹499 में 500 क्रेडिट्स।',
    free: '21 दिन फ्री',
    plus: 'प्लस • ₹299',
    credits: 'क्रेडिट्स',
    login: 'लॉगिन',
    logout: 'गुमनाम',
    ventsLeft: 'ट्रायल • अनलिमिटेड वेंट',
    trialBadge: '21 दिन • अनलिमिटेड',
    trialActiveLabel: 'ट्रायल चालू',
    unlimitedLabel: 'अनलिमिटेड वेंट्स',
    daysLeft: 'दिन बाकी',
    freeTierTitle: 'फ्री',
    freeTierSub: '21 दिन अनलिमिटेड, तुम्हारी कहानियाँ, गुमनाम',
    plusTierDesc: '200 कहानियाँ/महीना • पुराना एक्सेस • एक्सपोर्ट • एनालिटिक्स',
    creditsTierDesc: '500 एक्स्ट्रा कहानियाँ'
  }
};

export const REASONS_CARDS = [
  {
    id: 'overthinker',
    enTitle: 'The Overthinker',
    hiTitle: 'ज़्यादा सोचने वाला',
    enDesc: "You don't need advice. You need to get it out.",
    hiDesc: 'सलाह नहीं, बस निकालना है।',
    accent: '#FF6B5B'
  },
  {
    id: 'career',
    enTitle: 'The Career Crossroads',
    hiTitle: 'करियर का मोड़',
    enDesc: 'Your resignation draft starts here.',
    hiDesc: 'इस्तीफा यहीं से शुरू होता है।',
    accent: '#FF5C5C'
  },
  {
    id: 'rant',
    enTitle: 'The Relationship Rant',
    hiTitle: 'रिश्तों की भड़ास',
    enDesc: "Say what you wish you'd said.",
    hiDesc: 'वो जो कहना रह गया।',
    accent: '#F5F5F0'
  },
  {
    id: 'storyteller',
    enTitle: 'The Storyteller',
    hiTitle: 'कहानीकार',
    enDesc: 'Your life already has stories. We help you find them.',
    hiDesc: 'तुम्हारी ज़िंदगी में ही कहानियाँ हैं।',
    accent: '#FF6B5B'
  },
  {
    id: 'founder',
    enTitle: 'The Founder',
    hiTitle: 'फाउंडर',
    enDesc: 'Your brain is the strategy document.',
    hiDesc: 'तुम्हारा दिमाग ही strategy है।',
    accent: '#FF5C5C'
  },
  {
    id: 'memory',
    enTitle: 'The Memory Keeper',
    hiTitle: 'यादों का रखवाला',
    enDesc: "Don't let the stories disappear.",
    hiDesc: 'कहानियाँ गायब मत होने दो।',
    accent: '#F5F5F0'
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: '1',
    createdAt: Date.now() - 19 * 86400000,
    title: 'I quit on a Tuesday',
    titleHi: 'मैंने मंगल को इस्तीफा दिया',
    hook: '3 years of saying yes, one afternoon of finally saying no.',
    hookHi: '3 साल हाँ बोलते-बोलते, एक दोपहर ना बोला।',
    emotion: 'burnout',
    mood: 'burnout',
    type: 'career',
    themes: ['quit', 'office', 'Delhi'],
    location: 'Delhi',
    age: '26',
    claps: 234,
    helped: 89,
    buyRequests: 12,
    anonymous: true,
    author: 'Anonymous • 26 • Delhi',
    transcript: 'I kept drafting resignation...',
    structured: {
      people: 'Me, my manager Rohit',
      setting: 'Gurgaon office, 7pm',
      emotion: 'Burnout + relief',
      conflict: 'I was scared to disappoint',
      turning: 'My junior asked me why I stay',
      insight: "Resignation is not failure, it's editing",
      narrative: "I had the resignation draft open for 47 days. Not because I didn't know what to write, but because I kept rewriting who I was if I wasn't this job. On Tuesday, my intern asked me - why do you stay if you're tired? I didn't have an answer. So I sent it.",
      narrativeHi: "इस्तीफे का ड्राफ्ट 47 दिन खुला था। इसलिए नहीं कि लिखना नहीं आता था, इसलिए कि समझ नहीं आ रहा था नौकरी के बिना मैं कौन हूँ। मंगल को इंटर्न ने पूछा - थके हो तो रुके क्यों हो? मेरे पास जवाब नहीं था। भेज दिया।"
    }
  },
  {
    id: '2',
    createdAt: Date.now() - 16 * 86400000,
    title: 'Papa never said sorry',
    titleHi: 'पापा ने कभी Sorry नहीं बोला',
    hook: 'But he fixed my cycle every Sunday.',
    hookHi: 'पर हर रविवार मेरी साइकिल ठीक करते थे।',
    emotion: 'family',
    mood: 'family',
    type: 'family',
    themes: ['father', 'silence', 'small-town'],
    location: 'Small-town UP',
    age: '22',
    claps: 512,
    helped: 203,
    buyRequests: 34,
    anonymous: true,
    author: 'Anonymous • 22 • Small-town',
    transcript: '',
    structured: {
      people: 'Papa, me (12 then)',
      setting: 'Kanpur, 2013',
      emotion: 'Grief + love',
      conflict: 'We never talked feelings',
      turning: 'He oiled my chain instead of hugging',
      insight: 'Some love is in actions, not words',
      narrative: 'In my house, sorry was a foreign word. But every Sunday morning, without me asking, my cycle would be clean, oiled, ready. After he passed, I realized that was his apology for every time he was harsh. That was his love letter.',
      narrativeHi: 'हमारे घर में सॉरी कोई कहता ही नहीं था। पर हर रविवार सुबह बिना बोले मेरी साइकिल साफ, तेल लगी हुई तैयार मिलती। उनके जाने के बाद समझा, वो ही उनका Sorry था, हर डांट के लिए। वही उनका प्रेम पत्र था।'
    }
  },
  {
    id: '3',
    createdAt: Date.now() - 12 * 86400000,
    title: 'Love in the time of Jio',
    titleHi: 'Jio वाले प्यार में',
    hook: 'We fell in love on 2G, broke up on unlimited data.',
    hookHi: '2G पर प्यार हुआ, अनलिमिटेड डेटा पर ब्रेकअप।',
    emotion: 'love',
    mood: 'love',
    type: 'relationships',
    themes: ['love', 'phone', 'migration'],
    location: 'Mumbai',
    age: '24',
    claps: 321,
    helped: 112,
    buyRequests: 18,
    anonymous: false,
    author: 'Aisha • 24 • Mumbai',
    transcript: '',
    structured: {
      people: 'Me, Z',
      setting: 'Video calls, 2019-2022',
      emotion: 'Hopeful, then lonely',
      conflict: 'We grew but in different cities',
      turning: 'We stopped sending memes',
      insight: "Internet connects, it doesn't hold",
      narrative: 'We met before Jio. One WhatsApp message a day because data was expensive. Then data became free and so did our fights. We could talk all day and say nothing. The day we stopped sending memes, I knew it was over.',
      narrativeHi: 'हम Jio से पहले मिले थे। दिन में एक मैसेज क्योंकि डेटा महंगा था। फिर डेटा फ्री हुआ और झगड़े भी। अब पूरा दिन बात करके भी कुछ नहीं कहते थे। जिस दिन मीम भेजने बंद हुए, समझ गई खत्म।'
    }
  },
  {
    id: '4',
    createdAt: Date.now() - 8 * 86400000,
    title: 'My shop failed in 11 months',
    titleHi: 'मेरी दुकान 11 महीने में बंद',
    hook: 'Everyone clapped at launch, no one came after.',
    hookHi: 'लॉन्च पर सबने ताली बजाई, बाद में कोई नहीं आया।',
    emotion: 'failure',
    mood: 'failure',
    type: 'entrepreneurship',
    themes: ['shop', 'failure', 'family'],
    location: 'Rajasthan',
    age: '31',
    claps: 189,
    helped: 95,
    buyRequests: 7,
    anonymous: true,
    author: 'Anonymous • 31 • Rajasthan',
    transcript: '',
    structured: {
      people: 'Me, my father',
      setting: 'Jaipur market shop',
      emotion: 'Shame + ambition',
      conflict: 'Wanted to prove',
      turning: 'Last customer left',
      insight: "Business is not idea, it's everyday",
      narrative: 'I opened with so much pride. Instagram, lights, friends came. Day 30, real customers didn’t. I sat alone for 11 months counting footfall. I closed quietly. My father didn’t say "I told you so". He just helped me pack. That’s when I understood failure.',
      narrativeHi: 'बड़े गर्व से खोली थी। इंस्टा, लाइटें, दोस्त आए। 30वें दिन असली ग्राहक नहीं आए। 11 महीने अकेले बैठकर लोगों को गिनता रहा। चुपचाप बंद की। पापा ने "बोला था" नहीं कहा। बस पैकिंग में मदद की। तब फेलियर समझा।'
    }
  },
  {
    id: '5',
    createdAt: Date.now() - 4 * 86400000,
    title: "I moved but my mother didn't",
    titleHi: 'मैं चला गया, माँ वहीं रह गई',
    hook: 'Every city has her kitchen smell missing.',
    hookHi: 'हर शहर में उसकी रसोई की खुशबू नहीं है।',
    emotion: 'grief',
    mood: 'grief',
    type: 'migration',
    themes: ['mother', 'city', 'lonely'],
    location: 'Bangalore',
    age: '28',
    claps: 445,
    helped: 167,
    buyRequests: 29,
    anonymous: true,
    author: 'Anonymous • 28 • Bangalore',
    transcript: '',
    structured: {
      people: 'Me, Maa',
      setting: 'PG in Bangalore',
      emotion: 'Lonely + guilty',
      conflict: 'I wanted big city, she wanted me near',
      turning: 'She learned video call',
      insight: 'Migration is not moving, it\'s splitting',
      narrative: 'First month in Bangalore I ordered food 3 times a day. Not because I couldn’t cook, because her kitchen sound was missing. Now she video calls me while cooking so I can hear the tadka. I am here but I never left.',
      narrativeHi: 'बैंगलोर में पहले महीने दिन में 3 बार खाना ऑर्डर किया। बनाना नहीं आता इसलिए नहीं, उसकी रसोई की आवाज़ नहीं थी इसलिए। अब वो वीडियो कॉल पर तड़का लगाती है ताकि मैं सुन सकूं। मैं यहाँ हूँ पर गया ही नहीं।'
    }
  },
  {
    id: '6',
    createdAt: Date.now() - 1 * 86400000,
    title: 'Anger at 3am',
    titleHi: 'रात 3 बजे का गुस्सा',
    hook: "I wasn't angry at him. I was angry at myself for staying.",
    hookHi: 'गुस्सा उस पर नहीं, खुद पर था कि रुका क्यों।',
    emotion: 'angry',
    mood: 'angry',
    type: 'relationships',
    themes: ['anger', 'night'],
    location: 'Delhi',
    age: '27',
    claps: 278,
    helped: 134,
    buyRequests: 11,
    anonymous: true,
    author: 'Anonymous • 27 • Delhi',
    transcript: '',
    structured: {
      people: 'Me, ex',
      setting: '3am bedroom',
      emotion: 'Angry',
      conflict: 'Could not leave',
      turning: 'Realized anger was shield',
      insight: 'Anger protects from grief',
      narrative: 'At 3am I was shouting. Not about dishes. About 3 years of not saying what I needed. Anger was easier than saying "I am scared you don\'t love me anymore".',
      narrativeHi: 'रात 3 बजे चिल्ला रहा था। बर्तन पर नहीं, 3 साल से जो नहीं बोला उस पर। गुस्सा आसान था, ये बोलने से कि "डर लगता है तुम प्यार नहीं करते अब"।'
    }
  },
  {
    id: '7',
    createdAt: Date.now() - 18 * 86400000,
    title: 'The Promotion Trap',
    titleHi: 'प्रमोशन या पिंजरा',
    hook: 'Got the title change, lost my appetite.',
    hookHi: 'नया पद मिला, भूख चली गई।',
    emotion: 'anxious',
    mood: 'anxious',
    type: 'career',
    themes: ['promotion', 'anxious', 'corporate'],
    location: 'Mumbai',
    age: '29',
    claps: 312,
    helped: 145,
    buyRequests: 19,
    anonymous: true,
    author: 'Anonymous • 29 • Mumbai',
    transcript: '',
    structured: {
      people: 'Self, VP',
      setting: 'Office corner room',
      emotion: 'Anxious',
      conflict: 'Wanted success, received exhaustion',
      turning: 'Skipped lunch 5 days in a row',
      insight: 'A promotion without boundaries is just extra pressure',
      narrative: 'Everyone said congratulations on LinkedIn. Nobody asked if I can sleep past 4 AM without checking Slack. I traded peace for a certificate.',
      narrativeHi: 'लिंक्डइन पर सबने बधाई दी। किसी ने नहीं पूछा कि क्या सुबह 4 बजे बिना स्लैक देखे नींद आती है।'
    }
  },
  {
    id: '8',
    createdAt: Date.now() - 14 * 86400000,
    title: 'Sunday Evening Fog',
    titleHi: 'रविवार की शाम का सन्नाटा',
    hook: 'The apartment gets so quiet you can hear the fan squeak.',
    hookHi: 'कमरे में इतनी शांति कि पंखे की आवाज़ भी भारी लगती है।',
    emotion: 'lonely',
    mood: 'lonely',
    type: 'unspoken',
    themes: ['sunday', 'solitude', 'silence'],
    location: 'Pune',
    age: '25',
    claps: 419,
    helped: 201,
    buyRequests: 22,
    anonymous: true,
    author: 'Anonymous • 25 • Pune',
    transcript: '',
    structured: {
      people: 'Self',
      setting: 'Balcony overlooking highway',
      emotion: 'Lonely',
      conflict: 'Craving connection without wanting to explain myself',
      turning: 'Turned off TV and just breathed',
      insight: 'Loneliness is just your thoughts wanting company',
      narrative: 'Sunday 6 PM is the hardest hour in any city. You realize you haven’t spoken aloud since Friday night. Saying one sentence into this mic made the room feel occupied again.',
      narrativeHi: 'रविवार शाम 6 बजे किसी भी शहर में सबसे भारी वक्त होता है। एक वाक्य रिकॉर्ड करने से कमरा फिर भरा-भरा लगा।'
    }
  },
  {
    id: '9',
    createdAt: Date.now() - 10 * 86400000,
    title: 'First Morning Without Checking',
    titleHi: 'पहली सुबह बिना उनका प्रोफाइल देखे',
    hook: 'It took 122 days, but today the screen stayed locked.',
    hookHi: '122 दिन लगे, लेकिन आज स्क्रीन बंद ही रही।',
    emotion: 'hopeful',
    mood: 'hopeful',
    type: 'relationships',
    themes: ['healing', 'breakup', 'hope'],
    location: 'Kolkata',
    age: '23',
    claps: 580,
    helped: 310,
    buyRequests: 42,
    anonymous: false,
    author: 'Rhea • 23 • Kolkata',
    transcript: '',
    structured: {
      people: 'Rhea, ex',
      setting: 'Bedroom window tea',
      emotion: 'Hopeful',
      conflict: 'Habit vs self-respect',
      turning: 'Poured hot tea instead of scrolling',
      insight: 'Healing is quiet. It doesn’t announce itself.',
      narrative: 'I woke up and reached for my phone like muscle memory. Stopped midway. Poured chai. Looked outside. The world didn’t stop because we ended. For the first time, that was comforting.',
      narrativeHi: 'नींद खुली तो हाथ अपने आप फोन की तरफ बढ़ा। बीच में रुका। चाय बनाई। खिड़की से बाहर देखा। दुनिया नहीं रुकी।'
    }
  },
  {
    id: '10',
    createdAt: Date.now() - 6 * 86400000,
    title: 'The 2 AM Pitch Deck',
    titleHi: 'रात 2 बजे का पिच डेक',
    hook: 'Slide 14 was a lie. Slide 15 was pure desperation. But we sent it.',
    hookHi: 'स्लाइड 14 झूठ थी, 15 मजबूरी। फिर भी भेज दिया।',
    emotion: 'ambition',
    mood: 'ambition',
    type: 'entrepreneurship',
    themes: ['startup', 'founder', 'late-night'],
    location: 'Hyderabad',
    age: '27',
    claps: 345,
    helped: 180,
    buyRequests: 16,
    anonymous: true,
    author: 'Anonymous • 27 • Hyderabad',
    transcript: '',
    structured: {
      people: 'Co-founder and me',
      setting: 'Shared 1BHK, instant coffee',
      emotion: 'Ambition + caffeine',
      conflict: 'Running out of runway vs believing the idea',
      turning: 'We deleted the corporate jargon slide',
      insight: 'Conviction is what investors buy, not spreadsheets',
      narrative: 'We were down to 42 days of runway. My parents thought I was at an MNC. At 2 AM we stopped pretending we were McKinsey and wrote what we actually built. That was the deck that got funded.',
      narrativeHi: 'हमारे पास 42 दिन का रनवे बचा था। रात 2 बजे बनावटी भाषा हटाई और सच लिखा। उसी डेक को फंडिंग मिली।'
    }
  },
  {
    id: '11',
    createdAt: Date.now() - 2 * 3600000,
    title: 'Saying it here before I say it at home',
    titleHi: 'घर बोलने से पहले यहाँ बोल रहा हूँ',
    hook: 'If I practice it once out loud, my voice won’t shake tonight.',
    hookHi: 'एक बार ज़ोर से बोल लूँ तो आज शाम आवाज़ नहीं काँपेगी।',
    emotion: 'burnout',
    mood: 'burnout',
    type: '3am',
    themes: ['confession', 'family', 'courage'],
    location: 'Mumbai',
    age: '28',
    claps: 120,
    helped: 64,
    buyRequests: 9,
    anonymous: true,
    author: 'Anonymous • 28 • Mumbai',
    transcript: '',
    structured: {
      people: 'Me, wife, parents',
      setting: 'Parked car outside building',
      emotion: 'Vulnerable',
      conflict: 'Admitting I need a break',
      turning: 'Heard my own voice in the car',
      insight: 'Saying the truth out loud is half the bravery',
      narrative: 'I have been sitting in the parked car for 25 minutes. Engine off. AC cooling down. I need to tell her I cannot take the promotion transfer. Hearing myself say it into this microphone proves I’m not crazy.',
      narrativeHi: 'गाड़ी में 25 मिनट से बैठा हूँ। इंजन बंद। उसे बताना है कि मैं ट्रांसफर नहीं ले सकता। आवाज़ सुनी तो लगा मैं पागल नहीं हूँ।'
    }
  }
];

export interface FAQItem {
  q: string;
  a: string;
  category: 'privacy' | 'rewards' | 'science' | 'workplace' | 'voice' | 'membership' | 'enterprise';
  keywords?: string[];
}

export const FAQ_CATEGORIES: { id: string; label: string; labelHi: string; icon: string }[] = [
  { id: 'all', label: 'All FAQs', labelHi: 'सभी प्रश्न', icon: '🔍' },
  { id: 'privacy', label: 'Anonymity & Privacy', labelHi: 'गोपनीयता', icon: '🔒' },
  { id: 'rewards', label: 'Loyalty Points & Bounties', labelHi: 'लॉयल्टी रिवॉर्ड्स', icon: '⭐' },
  { id: 'science', label: 'Science & Emotional Health', labelHi: 'मानसिक स्वास्थ्य विज्ञान', icon: '🧠' },
  { id: 'workplace', label: 'Workplace & Founder Pressures', labelHi: 'कार्यक्षेत्र और तनाव', icon: '💼' },
  { id: 'voice', label: 'Voice & Microphone Tech', labelHi: 'वॉयस तकनीक', icon: '🎙️' },
  { id: 'membership', label: 'Trial & Memberships', labelHi: 'ट्रायल और प्लान्स', icon: '💳' },
  { id: 'enterprise', label: 'Brand Research & Insights', labelHi: 'ब्रांड और रिसर्च', icon: '🏢' },
];

export const FAQ_LIST: FAQItem[] = [
  {
    category: 'privacy',
    q: 'Is Aur Sunao completely anonymous and untraceable?',
    a: 'Yes, Aur Sunao is engineered with strict zero-knowledge architecture. By default, every author is identified only by a randomized alias, age bracket, and metro region (e.g., "Anonymous • 29 • Bengaluru"). Your real identity, phone number, email address, and IP address are never exposed publicly. You never have to worry about your spouse, partner, boss, or colleagues discovering your vents. You retain 100% sovereign control to keep stories private or share them as anonymized narratives.',
    keywords: ['anonymous venting', 'zero knowledge', 'privacy', 'untraceable audio journal', 'confidentiality']
  },
  {
    category: 'privacy',
    q: 'Are raw audio recordings stored or uploaded to public servers?',
    a: 'No. Your raw voice audio is transcribed locally in real-time within your browser using modern Web Speech APIs. The audio buffer is processed ephemerally and discarded immediately after transcription completes. We do not maintain unencrypted permanent audio recordings on public cloud buckets, ensuring complete compliance with the Digital Personal Data Protection (DPDP) Act 2023 and international GDPR guidelines.',
    keywords: ['audio privacy', 'browser speech api', 'ephemeral audio', 'data protection', 'DPDP compliance']
  },
  {
    category: 'rewards',
    q: 'How do Loyalty Points work on Brand-Sponsored Vent Bounties?',
    a: 'Loyalty Points are member reward tokens earned when you contribute authentic anonymous vents to brand-sponsored bounty categories. Enterprise partners (such as sleep wellness brands, FMCG beverages, and workplace labs) sponsor specific prompt topics to understand real consumer friction. When you record a 60-second vent addressing an active bounty, you instantly earn between 500 and 1,200 Loyalty Points credited to your Aur Sunao Member Wallet.',
    keywords: ['loyalty points', 'vent bounties', 'earn points venting', 'creator rewards', 'consumer insights']
  },
  {
    category: 'rewards',
    q: 'What can I redeem my Aur Sunao Loyalty Points for?',
    a: 'Loyalty Points can be redeemed directly from your member dashboard for real mental health and lifestyle benefits. Current redemption partners include 1-month guided meditation subscriptions, ₹500 Audible/Kindle audio wellness book credits, subsidized ₹1,000 co-pay vouchers for certified online therapy sessions, and lifetime Aur Sunao Creator Badges with unlimited audio narrative export capabilities.',
    keywords: ['redeem loyalty points', 'meditation pass', 'therapy subsidy', 'audible credits', 'wellness perks']
  },
  {
    category: 'rewards',
    q: 'Can brands sponsor new Vent Bounties for consumer research?',
    a: 'Yes. Consumer brands, D2C startups, and market research agencies can sponsor custom vent bounties by defining a target emotional tension (e.g., 3 AM insomnia, domestic chore fatigue, corporate micromanagement) and funding a loyalty points reward pool. Brands receive aggregated, anonymized neuro-linguistic summaries and emotional frequency heatmaps without ever accessing identifiable user data.',
    keywords: ['brand sponsor bounty', 'consumer research', 'emotional intelligence', 'd2c insights', 'loyalty pool']
  },
  {
    category: 'science',
    q: 'What is "affect labeling" and why is voice venting more effective than typing?',
    a: 'Affect labeling is a clinically validated cognitive neuroscience phenomenon where vocalizing and naming unexpressed emotional states (e.g., "I feel suffocated by my manager\'s micromanagement") triggers prefrontal cortex activation while dampening amygdala reactivity. Brain imaging studies demonstrate that speaking aloud dissipates emotional charge 4x faster than silent overthinking. Typing engages logical editorial filters, whereas raw vocal venting bypasses self-censorship to produce measurable cortisol drops in under 3 minutes.',
    keywords: ['affect labeling', 'cortisol reduction', 'neuroscience of venting', 'amygdala calming', 'voice therapy']
  },
  {
    category: 'science',
    q: 'Is Aur Sunao a replacement for clinical psychiatric therapy?',
    a: 'No. Aur Sunao is an emotional decompression and self-reflection utility, not a licensed medical provider or crisis intervention service. It acts as an affordable, accessible everyday emotional buffer for unburdening workplace frustration, relational friction, and 3 AM ruminations before they compound into clinical burnout. If you are experiencing acute psychiatric crisis or severe depression, we always encourage consulting a licensed psychiatrist or calling national helplines like Tele-MANAS (14416).',
    keywords: ['mental health disclaimer', 'therapy alternative', 'emotional buffer', 'burnout prevention', 'tele-manas']
  },
  {
    category: 'workplace',
    q: 'Why is Aur Sunao particularly popular with Indian tech workers and startup founders?',
    a: 'In the Indian startup and corporate tech ecosystem (across Bengaluru, Gurugram, Hyderabad, and Pune), high-performing professionals face immense societal pressure, appraisal anxiety, volatile funding environments, and 70-hour workweek cultures. Admitting self-doubt on professional networks like LinkedIn is career suicide, while burdening parents or spouses creates domestic stress. Aur Sunao provides a neutral, non-judgmental sanctuary where founders, engineers, and product managers can vent unfiltered without risking their professional reputations.',
    keywords: ['startup founder burnout', 'indian tech workers', 'bengaluru tech stress', 'toxic workplace vent', 'corporate anxiety']
  },
  {
    category: 'workplace',
    q: 'Can migrants from Tier-2 and Tier-3 cities share their cultural adjustment struggles?',
    a: 'Absolutely. A substantial portion of our storytelling community consists of small-town migrants living in metros like Mumbai, Delhi NCR, and Bengaluru. Stories frequently navigate the emotional friction between traditional familial expectations and urban isolation—the quiet loneliness of flat-shares, domestic obligations, parental health worries back home, and cultural displacement. Aur Sunao is designed with deep empathy for regional Indian realities.',
    keywords: ['tier 2 migrants', 'urban loneliness', 'ghar ki yaad', 'family pressure', 'indian cultural nuance']
  },
  {
    category: 'voice',
    q: 'Does Aur Sunao support Hindi and mixed Hinglish speech recognition?',
    a: 'Yes. Aur Sunao features native bilingual transcription tuned for both standard English (`en-IN`) and Hindi (`hi-IN`). You can switch languages instantaneously using the header toggle or speak in natural colloquial Hinglish. The underlying natural language processing pipeline recognizes Indian colloquialisms, cultural idioms, and code-switching seamlessly, translating spoken reflections into structured insights and practical action drafts.',
    keywords: ['hindi voice journal', 'hinglish transcription', 'indian speech recognition', 'bilingual venting', 'hi-in support']
  },
  {
    category: 'voice',
    q: 'What should I do if my browser blocks microphone permissions?',
    a: 'Modern browsers require explicit user permission to access audio input. If you see a microphone warning: 1) Click the padlock or settings icon in your browser URL bar; 2) Set "Microphone" to "Allow"; 3) Refresh the tab. Our real-time permission sensor immediately turns green once access is granted. If your microphone hardware is unavailable or blocked by system policies, Aur Sunao automatically provides a quick-typing keyboard fallback so your vent is never lost.',
    keywords: ['microphone permission', 'browser audio troubleshoot', 'enable mic chrome', 'audio input fix', 'keyboard fallback']
  },
  {
    category: 'membership',
    q: 'How does the 21-Day Free Trial work? Is a credit card required?',
    a: 'The 21-day trial is 100% free with no credit card or payment authorization required. From your first recorded vent, you enjoy unrestricted access to the Voice Booth, live sentiment labeling, automated AI emotional structuring, bilingual transcripts, and full browsing of our community story library. Trial status is securely stored in your local browser storage.',
    keywords: ['free trial', 'no credit card required', '21 days free', 'voice booth access', 'unlimited venting']
  },
  {
    category: 'membership',
    q: 'What is included in the Aur Sunao Plus subscription after the trial?',
    a: 'Aur Sunao Plus (priced at an affordable ₹299/month, or ₹499 for 500 lifetime credits via Razorpay) unlocks up to 200 high-definition structured stories per month, permanent audio history archives, biometric wearable synchronization, automated WhatsApp voice booth ingestion, downloadable emotional analytics reports, and exportable professional email drafts and habit checklists.',
    keywords: ['aur sunao plus', 'pricing 299', 'razorpay subscription', 'story exports', 'mood analytics']
  },
  {
    category: 'enterprise',
    q: 'How do FMCG, D2C, and fintech brands utilize Aur Sunao for qualitative market intelligence?',
    a: 'Traditional consumer focus groups suffer from observer bias and polite consensus. Aur Sunao provides enterprise consumer researchers with unprompted, anonymized qualitative narrative intelligence across 10 major Indian metros. Brands leverage our 12 synthetic ICP consumer avatars to stress-test campaign copy, spot emergent emotional trends (such as domestic burnout or financial anxiety), and optimize product messaging with 80/20 revenue transparency.',
    keywords: ['qualitative research', 'consumer intelligence', 'synthetic personas', 'fmcg consumer insights', 'market research india']
  }
];
