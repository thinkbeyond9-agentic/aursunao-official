import React, { useState, useRef } from 'react';
import { Story } from '../types';
import { MessageSquare, Mic, MicOff, Send, X, QrCode, Sparkles, Check, ArrowRight, ShieldCheck, ExternalLink, Play, Pause } from 'lucide-react';

interface WhatsAppVoiceBoothModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryLogged: (newStory: Story) => void;
  lang: 'en' | 'hi';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  type: 'voice' | 'text';
  text?: string;
  duration?: string;
  timestamp: string;
}

const PRESET_VOICE_NOTES = [
  {
    label: "Midnight career anxiety",
    labelHi: "देर रात करियर की चिंता",
    text: "It's 2 AM and I can't stop checking Slack. My manager didn't reply to my project proposal and I'm convinced I'm going to get fired. Everyone else seems so confident, and I'm just faking my way through."
  },
  {
    label: "Family expectations vs personal goals",
    labelHi: "पारिवारिक अपेक्षाएं बनाम निजी सपने",
    text: "Parents called today asking when I'm settling down and buying a house. I'm 27 and I still haven't figured out if I want to live in this city. Every Sunday phone call leaves me feeling like a failure."
  },
  {
    label: "Feeling burned out and invisible",
    labelHi: "बर्नआउट और अकेलापन",
    text: "Worked 14 hours straight today without eating properly. Nobody noticed the extra effort, and the sprint goals just moved further away. I don't know how to step off this treadmill without letting everyone down."
  }
];

export const WhatsAppVoiceBoothModal: React.FC<WhatsAppVoiceBoothModalProps> = ({
  isOpen,
  onClose,
  onStoryLogged,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'connect'>('simulator');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      type: 'text',
      text: lang === 'en'
        ? "👋 Welcome to Aur Sunao on WhatsApp.\n\nSend me a voice note or vent anytime you need to speak your truth. I'll transcribe, structure, and securely sync it to your anonymous web dashboard."
        : "👋 और सुनाओ व्हाट्सएप बॉट में आपका स्वागत है।\n\nजब भी मन हल्का करना हो, बेझिझक वॉइस नोट भेजें। हम इसे सुरक्षित रूप से ट्रांसक्राइब करके आपके वेब डैशबोर्ड में सिंक कर देंगे।",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [lastSyncedStory, setLastSyncedStory] = useState<Story | null>(null);
  const [presets, setPresets] = useState(PRESET_VOICE_NOTES);
  const [editingPresetIndex, setEditingPresetIndex] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const scrollToBottom = () => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'en' ? 'Voice input is not supported in this browser. You can type or use sample notes.' : 'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e: any) => {
        let t = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          t += e.results[i][0].transcript;
        }
        setInputText(t);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSendVoiceNote = async (textToSend: string = inputText) => {
    const text = textToSend.trim();
    if (!text) return;

    setInputText('');
    const userMsgId = 'user-' + Date.now();
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      type: 'voice',
      text,
      duration: '0:28',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setIsBotTyping(true);
    scrollToBottom();

    try {
      const res = await fetch('/api/whatsapp/receive-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, duration: '0:28' })
      });
      const data = await res.json();

      setIsBotTyping(false);
      if (data.success && data.story) {
        const botMsg: ChatMessage = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          type: 'text',
          text: data.whatsappReply || `🎙️ *Aur Sunao Bot* — We heard you.\n\n*${data.story.title}*\n"${data.story.hook}"\n\n💡 *Insight:* ${data.story.structured?.insight}\n\n🔒 *Logged to your Web Dashboard ✓*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
        setLastSyncedStory(data.story);
        onStoryLogged(data.story);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Error sending whatsapp note:', err);
      setIsBotTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4 bg-black/80 backdrop-blur-md fade-up">
      <div className="relative w-full max-w-3xl rounded-[24px] bg-[#111b21] text-white border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#202c33] px-5 py-3.5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-black grid place-items-center font-bold">
                <MessageSquare size={20} />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#202c33]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-bold text-[15px] text-white">Aur Sunao WhatsApp Bot</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30">
                  Verified Bot
                </span>
              </div>
              <p className="text-[11px] font-sans opacity-60">
                +91 98765 AUR-SUNAO • {lang === 'en' ? 'Online • End-to-end encrypted' : 'ऑनलाइन • पूर्णतः सुरक्षित'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-black/30 p-0.5 border border-white/10 text-[11px] font-sans">
              <button
                type="button"
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1 rounded-md transition cursor-pointer ${
                  activeTab === 'simulator' ? 'bg-[#25D366] text-black font-bold' : 'text-white/70 hover:text-white'
                }`}
              >
                {lang === 'en' ? 'Live Simulator' : 'सिम्युलेटर'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('connect')}
                className={`px-3 py-1 rounded-md transition cursor-pointer ${
                  activeTab === 'connect' ? 'bg-[#25D366] text-black font-bold' : 'text-white/70 hover:text-white'
                }`}
              >
                {lang === 'en' ? 'Scan & Connect' : 'कनेक्ट करें'}
              </button>
            </div>

            <button
              type="button"
              id="close-whatsapp-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white grid place-items-center transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab 1: Live Interactive WhatsApp Simulator */}
        {activeTab === 'simulator' && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#0b141a]">
            {/* Sync banner alert if a story was just logged */}
            {lastSyncedStory && (
              <div className="bg-[#25D366]/15 border-b border-[#25D366]/30 px-4 py-2 flex items-center justify-between text-[11px] text-white">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#25D366]" />
                  <span>
                    <strong>{lastSyncedStory.title}</strong>{' '}
                    {lang === 'en' ? 'was logged into your Web Dashboard!' : 'आपके वेब डैशबोर्ड में दर्ज हो गया!'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#25D366] underline font-bold hover:opacity-80 cursor-pointer"
                >
                  {lang === 'en' ? 'View in Library' : 'लाइब्रेरी में देखें'}
                </button>
              </div>
            )}

            {/* Chat message thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              <div className="text-center my-2">
                <span className="text-[10px] font-mono px-3 py-1 rounded-lg bg-[#182229] text-white/60 shadow-sm border border-white/5 inline-flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-[#25D366]" />
                  {lang === 'en'
                    ? 'Messages & voice notes are end-to-end encrypted. Anonymous session.'
                    : 'वॉइस नोट्स पूर्णतः एन्क्रिप्टेड और गुमनाम हैं।'}
                </span>
              </div>

              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={`${msg.id}-${idx}`}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} fade-up`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-[14px] p-3 text-[13px] leading-relaxed shadow-md ${
                        isUser
                          ? 'bg-[#005c4b] text-white rounded-tr-none'
                          : 'bg-[#202c33] text-white rounded-tl-none border border-white/5'
                      }`}
                    >
                      {msg.type === 'voice' ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                              className="w-8 h-8 rounded-full bg-[#25D366] text-black grid place-items-center shrink-0 cursor-pointer"
                            >
                              {isPlayingAudio ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-1 h-5">
                                {[3, 7, 12, 18, 9, 14, 20, 10, 16, 8, 15, 6, 12, 4].map((h, idx) => (
                                  <span
                                    key={idx}
                                    className={`w-1 rounded-full ${
                                      isPlayingAudio ? 'bg-[#25D366] animate-pulse' : 'bg-white/40'
                                    }`}
                                    style={{ height: `${h}px` }}
                                  />
                                ))}
                              </div>
                              <div className="flex justify-between text-[10px] opacity-60 font-mono mt-0.5">
                                <span>Voice Note ({msg.duration || '0:28'})</span>
                                <span>{msg.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-[12px] opacity-80 italic border-t border-white/10 pt-1.5">
                            "{msg.text}"
                          </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-line font-sans">
                          {msg.text}
                          <div className="text-right text-[10px] opacity-40 font-mono mt-1">
                            {msg.timestamp}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isBotTyping && (
                <div className="flex justify-start fade-up">
                  <div className="bg-[#202c33] rounded-[14px] rounded-tl-none px-4 py-2.5 text-[12px] text-white/70 flex items-center gap-2 border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
                    <span>Aur Sunao Bot is structuring your voice note...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick preset suggestions */}
            <div className="px-4 py-2 bg-[#182229] border-t border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-sans opacity-40 shrink-0">
                {lang === 'en' ? 'Quick audio presets:' : 'नमूना वॉइस नोट्स:'}
              </span>
              {presets.map((preset, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  {editingPresetIndex === idx ? (
                    <input
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      onBlur={() => {
                        const updated = [...presets];
                        updated[idx].label = editingLabel;
                        setPresets(updated);
                        setEditingPresetIndex(null);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingPresetIndex(null)}
                      className="bg-white text-black text-[11px] px-1 rounded w-24"
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendVoiceNote(preset.text)}
                      className="shrink-0 text-[11px] font-sans px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#25D366] hover:text-black border border-white/10 text-white/80 transition cursor-pointer"
                    >
                      🎙️ {lang === 'hi' ? preset.labelHi : preset.label}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingPresetIndex(idx);
                      setEditingLabel(preset.label);
                    }}
                    className="text-[9px] opacity-40 hover:opacity-100 px-1"
                  >
                    ✎
                  </button>
                </div>
              ))}
            </div>

            {/* Chat input controls */}
            <div className="p-3 bg-[#202c33] border-t border-white/5 flex items-center gap-2">
              <button
                type="button"
                id="wa-mic-btn"
                onClick={isRecording ? stopListening : startListening}
                className={`p-2.5 rounded-full transition cursor-pointer shrink-0 ${
                  isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-[#25D366] hover:bg-white/20'
                }`}
                title={isRecording ? 'Stop Recording' : 'Record voice note'}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <input
                type="text"
                id="wa-message-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendVoiceNote();
                }}
                placeholder={
                  isRecording
                    ? (lang === 'en' ? 'Listening to voice note...' : 'सुन रहा हूँ...')
                    : (lang === 'en' ? 'Type or speak your voice vent...' : 'अपनी बात बोलें या लिखें...')
                }
                className="flex-1 bg-[#2a3942] border border-white/5 rounded-full px-4 py-2.5 text-white text-[13px] placeholder:text-white/40 focus:outline-none focus:border-[#25D366]"
              />

              <button
                type="button"
                id="wa-send-btn"
                onClick={() => handleSendVoiceNote()}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-full bg-[#25D366] hover:bg-[#20b858] disabled:opacity-40 text-black transition cursor-pointer shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Connect real WhatsApp via QR or Link */}
        {activeTab === 'connect' && (
          <div className="p-6 md:p-8 bg-[#0b141a] space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <h4 className="font-serif text-[22px] font-bold text-white">
                {lang === 'en' ? 'Connect Directly on WhatsApp' : 'सीधे व्हाट्सएप पर जुड़ें'}
              </h4>
              <p className="font-sans text-[13px] opacity-70 mt-1">
                {lang === 'en'
                  ? 'Send a voice note straight from your phone. Our bot instantly transcribes and replies with your structured reflection.'
                  : 'अपने फोन से सीधा वॉइस नोट भेजें। बॉट तुरंत ट्रांसक्राइब करके आपको सीख और कहानी वापस भेजेगा।'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-2xl mx-auto">
              {/* QR Code Container */}
              <div className="p-6 rounded-[20px] bg-white text-black text-center flex flex-col items-center justify-center shadow-lg">
                <div className="w-44 h-44 rounded-xl bg-black/5 p-3 grid place-items-center border border-black/10">
                  {/* Stylized QR representation */}
                  <div className="grid grid-cols-6 gap-1.5 w-full h-full p-2 bg-white">
                    {[...Array(36)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          (i % 2 === 0 || i % 7 === 0 || i < 7 || i > 28)
                            ? 'bg-black'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="font-mono text-[11px] font-semibold text-black/70 mt-3 flex items-center gap-1">
                  <QrCode size={14} /> Scan with WhatsApp camera
                </span>
              </div>

              {/* Direct actions */}
              <div className="space-y-4">
                <div className="p-4 rounded-[16px] bg-[#202c33] border border-white/5 space-y-2">
                  <div className="font-bold text-[14px] text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#25D366] text-black text-[12px] font-bold grid place-items-center">
                      1
                    </span>
                    {lang === 'en' ? 'Click or Tap to Chat' : 'चैट शुरू करने के लिए क्लिक करें'}
                  </div>
                  <p className="text-[12px] opacity-70">
                    {lang === 'en'
                      ? 'Opens WhatsApp with our verified Aur Sunao assistant.'
                      : 'व्हाट्सएप में हमारा बॉट खुल जाएगा।'}
                  </p>
                  <a
                    href="https://wa.me/919876528778?text=Hi%20Aur%20Sunao%2C%20here%20is%20my%20voice%20note"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-black font-sans font-bold text-[13px] transition cursor-pointer shadow-md"
                  >
                    <span>{lang === 'en' ? 'Open WhatsApp Chat' : 'व्हाट्सएप में खोलें'}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                <div className="p-4 rounded-[16px] bg-[#202c33] border border-white/5 space-y-2">
                  <div className="font-bold text-[14px] text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white/10 text-white text-[12px] font-bold grid place-items-center">
                      2
                    </span>
                    {lang === 'en' ? 'Anonymous Web Sync Code' : 'गुमनाम वेब सिंक कोड'}
                  </div>
                  <p className="text-[12px] opacity-70">
                    {lang === 'en'
                      ? 'Text this pairing code in WhatsApp to link your notes to this browser:'
                      : 'इस कोड को व्हाट्सएप में भेजें ताकि आपके नोट्स इस ब्राउज़र से जुड़ जाएं:'}
                  </p>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/10 font-mono text-[13px] text-[#25D366] font-bold">
                    <span>PAIR-SUNAO-8921</span>
                    <span className="text-[10px] text-white/50 font-normal">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
