import React, { useState, useEffect, useRef } from 'react';
import { BiometricReading, BiometricSyncSession, WearableDeviceType } from '../types';
import { 
  Activity, 
  Heart, 
  Zap, 
  Watch, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  ShieldCheck, 
  Play, 
  Pause, 
  RefreshCw,
  Info,
  TrendingDown,
  Sparkles,
  BarChart2
} from 'lucide-react';

interface BiometricEmotionSyncProps {
  transcript?: string;
  isRecording?: boolean;
  recordingSeconds?: number;
  onSyncSpikeDetected?: (spike: BiometricReading) => void;
  onReadingUpdate?: (bpm: number) => void;
  lang?: 'en' | 'hi';
  customBpmThreshold: number;
}

const SAMPLE_TRANSCRIPT_SEGMENTS = [
  { time: 3, text: "I woke up at 3:15 AM again to check if that Slack notification had come in.", spike: false, bpm: 72, hrv: 58, stress: 32 },
  { time: 9, text: "My manager casually moved our review meeting to 8:30 PM on a Friday evening.", spike: true, bpm: 104, hrv: 34, stress: 78, reason: "Sudden boundary violation trigger" },
  { time: 17, text: "I smiled and said 'sure, absolutely no problem', but my chest felt completely constricted.", spike: true, bpm: 119, hrv: 21, stress: 92, reason: "Severe emotional dissonance / repressed anger" },
  { time: 26, text: "Nobody asks what happened to our weekends; we just normalize working through fever.", spike: true, bpm: 114, hrv: 26, stress: 85, reason: "Corporate gaslighting frustration" },
  { time: 35, text: "Taking a deep breath now... just putting this into Aur Sunao makes my hands stop shaking.", spike: false, bpm: 81, hrv: 49, stress: 45, reason: "Vocal release catharsis" },
];

export const BiometricEmotionSync: React.FC<BiometricEmotionSyncProps> = ({
  transcript,
  isRecording = false,
  recordingSeconds = 0,
  onSyncSpikeDetected,
  onReadingUpdate,
  lang = 'en',
  customBpmThreshold
}) => {
  const [device, setDevice] = useState<WearableDeviceType>('apple_watch');
  const [isConnected, setIsConnected] = useState(true);
  const [isPairing, setIsPairing] = useState(false);
  
  // Real-time live readings
  const [currentBpm, setCurrentBpm] = useState(84);
  const [currentHrv, setCurrentHrv] = useState(48);
  const [currentStress, setCurrentStress] = useState(42);
  const [recentReadings, setRecentReadings] = useState<BiometricReading[]>([]);
  const [stressSpikesCount, setStressSpikesCount] = useState(3);

  // Pulse alert check
  const isPulseAlert = currentBpm > customBpmThreshold;

  // Active simulated timer during recording
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      // Fluctuate realistically based on recording state
      const targetBpm = isRecording 
        ? Math.floor(95 + Math.sin(Date.now() / 2000) * 22)
        : Math.floor(74 + Math.sin(Date.now() / 3000) * 8);

      const targetHrv = isRecording
        ? Math.floor(32 + Math.cos(Date.now() / 2500) * 14)
        : Math.floor(54 + Math.cos(Date.now() / 4000) * 10);

      const targetStress = isRecording
        ? Math.min(100, Math.max(10, Math.floor((targetBpm - 60) * 1.5)))
        : Math.floor(30 + Math.random() * 15);

      const isSpike = targetBpm > 105 && targetHrv < 28;

      setCurrentBpm(targetBpm);
      setCurrentHrv(targetHrv);
      setCurrentStress(targetStress);
      
      if (onReadingUpdate) onReadingUpdate(targetBpm);

      const newReading: BiometricReading = {
        timeSec: recordingSeconds || Math.floor(Date.now() / 1000) % 60,
        heartRate: targetBpm,
        hrv: targetHrv,
        stressIndex: targetStress,
        isStressSpike: isSpike,
        spikeReason: isSpike ? "Physiological arousal during verbal conflict description" : undefined
      };

      if (isSpike && onSyncSpikeDetected) {
        onSyncSpikeDetected(newReading);
      }

      setRecentReadings(prev => [...prev.slice(-24), newReading]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isConnected, isRecording, recordingSeconds, onSyncSpikeDetected]);

  const handlePairDevice = (newDevice: WearableDeviceType) => {
    setIsPairing(true);
    // Simulate Bluetooth discovery and pairing handshake
    setTimeout(() => {
      setDevice(newDevice);
      setIsConnected(true);
      setIsPairing(false);
      // In a real app, this would initiate a BLE connection request
    }, 2000);
  };

  const getStressColor = (stress: number) => {
    if (stress > 75) return 'text-[#FF5C5C] bg-[#FF5C5C]/15 border-[#FF5C5C]/30';
    if (stress > 50) return 'text-[#F57C00] bg-[#F57C00]/15 border-[#F57C00]/30';
    return 'text-[#25D366] bg-[#25D366]/15 border-[#25D366]/30';
  };

  const getDeviceLabel = (dev: WearableDeviceType) => {
    switch (dev) {
      case 'apple_watch': return 'Apple Watch Ultra / Series 10';
      case 'whoop': return 'Whoop 4.0 Strap';
      case 'fitbit': return 'Fitbit Sense 2';
      case 'simulated': return 'HealthKit Live Telemetry Stream';
    }
  };

  return (
    <div className="rounded-[24px] bg-[#141416] text-white border border-white/10 p-5 sm:p-7 shadow-2xl">
      {/* Header & Wearable Connection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#FF5C5C]/20 text-[#FF5C5C] grid place-items-center">
              <Activity size={18} />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5C5C] font-semibold">
              {lang === 'en' ? 'Biometric Emotion Sync' : 'बायोमेट्रिक इमोशन सिंक'}
            </span>
          </div>
          <h3 className="font-display text-[22px] sm:text-[26px] mt-1 text-white">
            {lang === 'en' ? 'Wearable Neuro-Marketing Sync' : 'वेयरेबल न्यूरो-मार्केटिंग सिंक'}
          </h3>
          <p className="font-sans text-[12px] text-white/60 max-w-[62ch] mt-0.5">
            {lang === 'en'
              ? 'Ties consumer wearables (Apple Watch / Whoop) directly to speech transcripts, pinpointing exact physiological stress spikes during verbal frustration.'
              : 'उपभोक्ता वेयरेबल्स को सीधे वॉयस ट्रांसक्रिप्ट से जोड़ता है, जिससे वास्तविक शारीरिक तनाव स्पाइक्स सटीक रूप से ट्रैक होते हैं।'}
          </p>
        </div>

        {/* Pairing/Device Switcher */}
        <div className="flex items-center gap-3">
          {isPairing && (
             <span className="text-[11px] font-mono text-[#FFB300] animate-pulse">Pairing...</span>
          )}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 shrink-0">
            <Watch size={16} className={isConnected ? "text-[#25D366]" : "text-white/60"} />
            <select
              aria-label="Select Wearable Device"
              value={device}
              onChange={(e) => handlePairDevice(e.target.value as WearableDeviceType)}
              className="bg-transparent text-white font-sans text-[12px] font-semibold focus:outline-none cursor-pointer pr-2"
            >
              <option value="apple_watch" className="bg-[#141416] text-white">Apple Watch Ultra / S10</option>
              <option value="whoop" className="bg-[#141416] text-white">Whoop 4.0 Strap</option>
              <option value="fitbit" className="bg-[#141416] text-white">Fitbit Sense 2</option>
              <option value="simulated" className="bg-[#141416] text-white">Demo Telemetry Feed</option>
            </select>
            {isConnected && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[#25D366] bg-[#25D366]/15 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" />
                Live
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live Telemetry KPI Cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Heart Rate */}
        <div className={`rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between transition-colors ${isPulseAlert ? 'ring-2 ring-[#FF5C5C]/50' : ''}`}>
          <div>
            <div className="text-[10px] font-mono uppercase text-white/50 flex items-center gap-1">
              <Heart size={12} className={isPulseAlert ? 'text-[#FF5C5C] animate-pulse' : 'text-[#FF5C5C]'} />
              <span>Instant Heart Rate</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`font-display text-[28px] font-bold text-white leading-none ${isPulseAlert ? 'animate-bounce' : ''}`}>
                {currentBpm}
              </span>
              <span className="text-[11px] font-mono text-white/60">BPM</span>
            </div>
            <div className="text-[10px] font-sans text-white/40 mt-1">
              {isPulseAlert ? <span className="text-[#FF5C5C] font-bold">⚠️ Threshold Exceeded</span> : `Baseline: 72 BPM (+${Math.max(0, currentBpm - 72)})`}
            </div>
          </div>
          <div className={`w-10 h-10 rounded-full bg-[#FF5C5C]/15 text-[#FF5C5C] grid place-items-center ${isPulseAlert ? 'animate-ping' : 'animate-pulse'}`}>
            <Activity size={20} />
          </div>
        </div>

        {/* HRV */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-white/50 flex items-center gap-1">
              <TrendingDown size={12} className="text-[#4A90E2]" />
              <span>HRV (Autonomic Tone)</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-display text-[28px] font-bold text-white leading-none">
                {currentHrv}
              </span>
              <span className="text-[11px] font-mono text-white/60">ms RMSSD</span>
            </div>
            <div className="text-[10px] font-sans text-white/40 mt-1">
              {currentHrv < 30 ? '⚠️ Acute Stress Depression' : 'Normal Autonomic Recovery'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#4A90E2]/15 text-[#4A90E2] grid place-items-center">
            <Zap size={20} />
          </div>
        </div>

        {/* Stress Index */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-white/50 flex items-center gap-1">
              <Sparkles size={12} className="text-[#FFB300]" />
              <span>Physiological Stress Index</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-display text-[28px] font-bold text-white leading-none">
                {currentStress}
              </span>
              <span className="text-[11px] font-mono text-white/60">/ 100</span>
            </div>
            <div className="text-[10px] font-sans text-white/40 mt-1">
              {stressSpikesCount} Confirmed Stress Spikes
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${getStressColor(currentStress)}`}>
            {currentStress > 75 ? 'High Agitation' : currentStress > 50 ? 'Moderate Tension' : 'Calm State'}
          </div>
        </div>
      </div>

      {/* Sparkline Visualizer */}
      <div className="mt-4 rounded-2xl bg-black/40 border border-white/10 p-3.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-2">
          <span>Continuous {getDeviceLabel(device)} Pulse Waveform</span>
          <span className="text-[#25D366]">Sampling Rate: 1.2 Hz via BLE</span>
        </div>
        <div className="h-10 flex items-end gap-1 overflow-hidden">
          {recentReadings.map((r, idx) => {
            const heightPct = Math.min(100, Math.max(15, (r.heartRate - 55) * 1.5));
            return (
              <div
                key={idx}
                style={{ height: `${heightPct}%` }}
                className={`flex-1 rounded-t-sm transition-all duration-300 ${
                  r.isStressSpike ? 'bg-[#FF5C5C]' : 'bg-[#FF6B5B]/40'
                }`}
                title={`${r.heartRate} BPM | HRV ${r.hrv}ms`}
              />
            );
          })}
        </div>
      </div>

      {/* Transcript with Biometric Stress Spike Overlay */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/70">
              Verbal-Physiological Synchronized Transcript
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#FF5C5C]/20 text-[#FF5C5C] text-[10px] font-mono font-bold">
              3 Physiological Spikes Detected
            </span>
          </div>
          <span className="text-[10px] font-mono text-white/40">Timestamped Overlay</span>
        </div>

        <div className="space-y-2.5">
          {SAMPLE_TRANSCRIPT_SEGMENTS.map((seg, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-3.5 border transition-all ${
                seg.spike
                  ? 'bg-[#FF5C5C]/8 border-[#FF5C5C]/35'
                  : 'bg-white/4 border-white/8'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5 flex-1">
                  <span className="font-mono text-[11px] text-white/40 shrink-0 mt-0.5">
                    00:{seg.time < 10 ? `0${seg.time}` : seg.time}
                  </span>
                  <p className="font-sans text-[13px] text-white/90 leading-relaxed">
                    "{seg.text}"
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
                  <span className="font-mono text-[11px] font-bold text-white px-2 py-0.5 rounded-md bg-white/10">
                    {seg.bpm} BPM
                  </span>
                  <span className="font-mono text-[10px] text-white/60">
                    HRV: {seg.hrv}ms
                  </span>
                  {seg.spike ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF5C5C]/20 text-[#FF5C5C] border border-[#FF5C5C]/30">
                      <Zap size={10} /> Stress Spike
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-white/40">Normal</span>
                  )}
                </div>
              </div>

              {/* Spike Physiological Insight */}
              {seg.spike && seg.reason && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#FF5C5C]">
                  <AlertTriangle size={12} className="shrink-0" />
                  <span className="font-mono">Neuro-Marketing Insight: {seg.reason}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise Neuro-Marketing Summary Card */}
      <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-[#25D366]" />
            <h4 className="font-display text-[15px] text-white font-semibold">
              Enterprise Client Neuro-Marketing Intelligence
            </h4>
          </div>
          <span className="text-[10px] font-mono text-white/40">Aur Sunao Biometric Engine v2.4</span>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px] font-sans">
          <div>
            <span className="text-[10px] font-mono uppercase text-white/40 block">Verbal-Physio Correlation</span>
            <span className="font-display text-[20px] font-bold text-[#25D366] mt-0.5 block">88.4% Match</span>
            <p className="text-white/60 text-[11px] mt-1 leading-snug">
              Verbal frustration closely matches sympathetic autonomic nervous spikes.
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-white/40 block">Latent Emotional Dissonance</span>
            <span className="font-display text-[20px] font-bold text-[#FF6B5B] mt-0.5 block">High Discrepancy</span>
            <p className="text-white/60 text-[11px] mt-1 leading-snug">
              Participant sounded polite while heart rate surged 35 BPM higher, indicating high suppressed anger.
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-white/40 block">Peak Vulnerability Point</span>
            <span className="font-display text-[20px] font-bold text-white mt-0.5 block">00:17 - 00:26</span>
            <p className="text-white/60 text-[11px] mt-1 leading-snug">
              Directly triggered by corporate boundary violations and weekend cancelation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
