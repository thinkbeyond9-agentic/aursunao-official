import React, { useState } from 'react';
import { X, Lock, CheckCircle2, Sparkles, Shield, User, Mail, ArrowRight } from 'lucide-react';
import { Story, UserState } from '../types';
import { MOOD_COLORS } from '../data';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (user: UserState) => void;
  pendingStory: Story | null;
  lang: 'en' | 'hi';
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  pendingStory,
  lang,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'form' | 'fast'>('form');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Reader ' + Math.floor(100 + Math.random() * 900);
    const finalEmail = email.trim() || `${finalName.toLowerCase().replace(/\s+/g, '')}@example.com`;
    onRegisterSuccess({
      name: finalName,
      anon: false,
      avatar: finalName.charAt(0).toUpperCase(),
      isRegistered: true,
      email: finalEmail,
    });
  };

  const handleGoogleRegister = () => {
    onRegisterSuccess({
      name: 'Priya Sharma',
      anon: false,
      avatar: 'P',
      isRegistered: true,
      email: 'priya.sharma@gmail.com',
    });
  };

  const handleInstantAnonRegister = () => {
    const anonId = Math.floor(1000 + Math.random() * 9000);
    onRegisterSuccess({
      name: `Anonymous #${anonId}`,
      anon: true,
      avatar: 'A',
      isRegistered: true,
      email: `anon-${anonId}@aursunao.internal`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 grid place-items-center overflow-y-auto">
      <div className="w-full max-w-[460px] rounded-[28px] bg-[#141416] border border-white/15 p-6 md:p-8 text-white shadow-2xl relative fade-up my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 transition cursor-pointer"
          aria-label="Close"
        >
          <X size={15} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FF6B5B]/20 text-[#FF6B5B] grid place-items-center">
            <Lock size={16} />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF6B5B] font-bold">
            {lang === 'en' ? 'Free Reader Access' : 'मुफ़्त रीडर एक्सेस'}
          </span>
        </div>

        <h3 className="font-display text-[26px] leading-[1.1] mt-3">
          {lang === 'en' ? 'Register to Read Entire Story' : 'पूरी कहानी पढ़ने के लिए रजिस्टर करें'}
        </h3>
        <p className="font-sans text-[13px] opacity-70 mt-2 leading-relaxed">
          {lang === 'en'
            ? 'Headings and emotions are free to browse. Create a free account in 5 seconds to unlock the full narrative, turning point, and reflection.'
            : 'लाइब्रेरी में सिर्फ शीर्षक और भावनाएं दिखती हैं। पूरी कहानी, मोड़ और विचार पढ़ने के लिए 5 सेकंड में फ्री रजिस्टर करें।'}
        </p>

        {/* Targeted Story Preview Banner */}
        {pendingStory && (
          <div className="mt-4 p-3.5 rounded-[18px] bg-white/5 border border-white/10 flex items-start gap-3">
            <span className={`shrink-0 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full uppercase mt-0.5 ${MOOD_COLORS[pendingStory.mood] || 'bg-black text-white'}`}>
              {pendingStory.mood}
            </span>
            <div className="overflow-hidden">
              <div className="text-[10px] font-mono opacity-50 uppercase">
                {lang === 'en' ? 'Story waiting to unlock:' : 'अनलॉक होने वाली कहानी:'}
              </div>
              <div className="font-display text-[15px] truncate mt-0.5 text-white">
                {lang === 'en' ? pendingStory.title : pendingStory.titleHi}
              </div>
            </div>
          </div>
        )}

        {/* 1-Click Google Registration */}
        <div className="mt-5 space-y-3 font-sans">
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full h-11 rounded-full bg-white hover:bg-zinc-100 text-black font-sans text-[12px] font-bold flex items-center justify-center gap-2.5 transition cursor-pointer shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{lang === 'en' ? 'Continue with Google (1-Click)' : 'गूगल के साथ जारी रखें (1-क्लिक)'}</span>
          </button>

          <div className="relative py-1 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative px-3 bg-[#141416] text-[11px] uppercase tracking-wider opacity-40 font-mono">
              {lang === 'en' ? 'Or Quick Email Register' : 'या ईमेल से रजिस्टर करें'}
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">
                {lang === 'en' ? 'Your Name or Alias' : 'आपका नाम या उपनाम'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={lang === 'en' ? 'e.g. Rahul Verma or Midnight Thinker' : 'उदा. राहुल या गुप्त पाठक'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 rounded-xl bg-black border border-white/20 pl-9 pr-4 text-white text-[13px] placeholder:opacity-40 focus:outline-none focus:border-[#FF6B5B]"
                />
                <User size={14} className="absolute left-3 top-3.5 opacity-50" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">
                {lang === 'en' ? 'Email Address' : 'ईमेल पता'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-xl bg-black border border-white/20 pl-9 pr-4 text-white text-[13px] placeholder:opacity-40 focus:outline-none focus:border-[#FF6B5B]"
                />
                <Mail size={14} className="absolute left-3 top-3.5 opacity-50" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black font-bold text-[12px] transition cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <span>{lang === 'en' ? 'Register & Open Story' : 'रजिस्टर करें और कहानी खोलें'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* 1-Click Anonymous Guest Register */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleInstantAnonRegister}
              className="w-full py-2 text-center text-[11px] text-[#FFD166] hover:underline font-mono opacity-80 hover:opacity-100 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Shield size={12} />
              <span>
                {lang === 'en'
                  ? 'Want 100% privacy? 1-Click Anonymous Registration'
                  : 'पूरी गोपनीयता चाहते हैं? 1-क्लिक अनाम रजिस्ट्रेशन'}
              </span>
            </button>
          </div>
        </div>

        {/* Benefits checklist */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-sans opacity-70">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-[#FF6B5B] shrink-0" />
            <span>{lang === 'en' ? 'Instant unlimited reading' : 'असीमित कहानियां पढ़ें'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-[#FF6B5B] shrink-0" />
            <span>{lang === 'en' ? 'No spam guarantee' : 'शून्य स्पैम गारंटी'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-[#FF6B5B] shrink-0" />
            <span>{lang === 'en' ? 'Save favorites & claps' : 'पसंदीदा सेव करें'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-[#FF6B5B] shrink-0" />
            <span>{lang === 'en' ? 'Free 21-day trial access' : '21 दिन फ्री एक्सेस'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
