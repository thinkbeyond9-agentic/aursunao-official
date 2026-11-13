export interface AudioMetrics {
  rms: number; // 0.0 to 1.0 (Root Mean Square volume)
  peakVolume: number; // 0.0 to 1.0
  pitchTension: number; // 0.0 to 1.0 (High-frequency ratio & tension)
  spectralCentroid: number; // 0.0 to 1.0 (Acoustic brightness)
  speechActivity: boolean; // whether voice is actively detected
  jitter: number; // variation in energy over time
}

export type VoiceEmotionType = 'Happy' | 'Frustrated' | 'Relieved' | 'Stressed';

export interface MoodSuggestion {
  mood: VoiceEmotionType;
  confidence: number; // 0 - 100
  reasonEn: string;
  reasonHi: string;
  acousticSummary: string;
}

export class AudioStreamAnalyzer {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private animFrameId: number | null = null;
  private recentRms: number[] = [];
  private isRunning: boolean = false;

  start(stream: MediaStream, onMetrics: (metrics: AudioMetrics) => void): boolean {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;

      this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      this.source = this.audioCtx.createMediaStreamSource(stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.4;
      this.source.connect(this.analyser);

      const freqData = new Uint8Array(this.analyser.frequencyBinCount);
      const timeData = new Uint8Array(this.analyser.fftSize);

      this.isRunning = true;
      this.recentRms = [];

      const loop = () => {
        if (!this.isRunning || !this.analyser) return;

        this.analyser.getByteFrequencyData(freqData);
        this.analyser.getByteTimeDomainData(timeData);

        // 1. Compute RMS (Volume Energy)
        let sumSquares = 0;
        let peak = 0;
        for (let i = 0; i < timeData.length; i++) {
          const normalized = (timeData[i] - 128) / 128;
          sumSquares += normalized * normalized;
          const abs = Math.abs(normalized);
          if (abs > peak) peak = abs;
        }
        const rms = Math.min(1, Math.sqrt(sumSquares / timeData.length) * 2.8);

        // Track rolling RMS for jitter / cadence spikes
        this.recentRms.push(rms);
        if (this.recentRms.length > 24) this.recentRms.shift();

        let variance = 0;
        if (this.recentRms.length > 2) {
          const mean = this.recentRms.reduce((a, b) => a + b, 0) / this.recentRms.length;
          variance = this.recentRms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / this.recentRms.length;
        }
        const jitter = Math.min(1, Math.sqrt(variance) * 4);

        // 2. Frequency bands analysis
        // Frequency bins: 128 bins across ~22050 Hz (each bin ~ 172 Hz)
        // Low: bins 0-2 (0 - 500 Hz)
        // Mid: bins 3-8 (500 - 1500 Hz)
        // High: bins 9-28 (1500 - 4800 Hz)
        let lowSum = 0, midSum = 0, highSum = 0, totalEnergy = 0, weightedSum = 0;

        for (let i = 0; i < freqData.length; i++) {
          const val = freqData[i] / 255;
          totalEnergy += val;
          weightedSum += val * i;
          if (i <= 2) lowSum += val;
          else if (i <= 8) midSum += val;
          else if (i <= 28) highSum += val;
        }

        const spectralCentroid = totalEnergy > 0 ? (weightedSum / totalEnergy) / freqData.length : 0;
        const pitchTension = (midSum + 0.01) > 0 ? Math.min(1, (highSum / (midSum + 0.05)) * 0.8) : 0;
        const speechActivity = rms > 0.04;

        onMetrics({
          rms,
          peakVolume: peak,
          pitchTension,
          spectralCentroid: Math.min(1, spectralCentroid * 3),
          speechActivity,
          jitter
        });

        this.animFrameId = requestAnimationFrame(loop);
      };

      this.animFrameId = requestAnimationFrame(loop);
      return true;
    } catch (err) {
      console.warn('AudioStreamAnalyzer initialization failed:', err);
      return false;
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.source) {
      try { this.source.disconnect(); } catch {}
      this.source = null;
    }
    if (this.analyser) {
      try { this.analyser.disconnect(); } catch {}
      this.analyser = null;
    }
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch {}
      this.audioCtx = null;
    }
    this.recentRms = [];
  }
}

/**
 * Evaluates live acoustic metrics and transcript tokens to suggest
 * the most fitting emotion among: 'Happy' | 'Frustrated' | 'Relieved' | 'Stressed'.
 */
export function suggestMoodFromAudioStream(
  metrics: AudioMetrics | null,
  transcript: string
): MoodSuggestion {
  const text = (transcript || '').toLowerCase();

  // Word scoring maps
  const happyWords = ['happy', 'excited', 'grateful', 'good', 'great', 'smile', 'laugh', 'passed', 'built', 'loved', 'enjoyed', 'khush', 'accha', 'mazza', 'celebrate', 'finally worked', 'win', 'proud'];
  const frustratedWords = ['angry', 'screamed', 'unfair', 'hate', 'shouted', 'gussa', 'irritated', 'annoyed', 'stupid', 'ridiculous', 'client', 'money', 'ruined', 'disrespect', 'bakwas', 'chilla', 'boss', 'fired'];
  const relievedWords = ['relieved', 'calm', 'sigh', 'peace', 'better now', 'glad', 'worked out', 'shanti', 'sukoon', 'theek ho gaya', 'bach gaya', 'breathe', 'weight off', 'relaxed', 'resolved'];
  const stressedWords = ['stressed', 'anxious', 'overwhelmed', 'deadline', 'pressure', 'heart', 'panic', 'worry', 'cant', "can't", 'too much', 'dar', 'chinta', 'tension', 'fatigue', 'shaking', 'scared', 'heavy', 'pip', 'resign'];

  const countHits = (arr: string[]) => arr.reduce((acc, w) => acc + (text.includes(w) ? 1.5 : 0), 0);

  let scoreHappy = countHits(happyWords);
  let scoreFrustrated = countHits(frustratedWords);
  let scoreRelieved = countHits(relievedWords);
  let scoreStressed = countHits(stressedWords);

  // Acoustic Weighting from Live Audio Stream
  if (metrics && metrics.speechActivity) {
    // 1. Stressed: High pitch tension, elevated jitter/irregularity, breathless bursts
    if (metrics.pitchTension > 0.38) scoreStressed += 1.8;
    if (metrics.jitter > 0.28) scoreStressed += 1.2;

    // 2. Frustrated: Sustained high RMS volume, peak bursts, emphatic vocal thrusts
    if (metrics.rms > 0.22) scoreFrustrated += 1.6;
    if (metrics.peakVolume > 0.45 && metrics.jitter > 0.22) scoreFrustrated += 1.4;

    // 3. Relieved: Low-moderate RMS, low pitch tension, steady cadence
    if (metrics.rms < 0.15 && metrics.pitchTension < 0.3) scoreRelieved += 1.8;
    if (metrics.jitter < 0.15) scoreRelieved += 1.0;

    // 4. Happy: High spectral centroid (acoustic brightness), moderate dynamic range
    if (metrics.spectralCentroid > 0.32) scoreHappy += 1.5;
    if (metrics.rms > 0.12 && metrics.rms < 0.28 && metrics.pitchTension < 0.35) scoreHappy += 1.2;
  } else if (!metrics && text.length < 5) {
    // Default initial gentle probe
    return {
      mood: 'Stressed',
      confidence: 60,
      reasonEn: 'Analyzing vocal tone & cadence...',
      reasonHi: 'आवाज़ की टोन और गति का विश्लेषण हो रहा है...',
      acousticSummary: 'Audio stream calibrating'
    };
  }

  // Find dominant emotion
  const candidates: { mood: VoiceEmotionType; score: number }[] = [
    { mood: 'Stressed', score: scoreStressed },
    { mood: 'Frustrated', score: scoreFrustrated },
    { mood: 'Relieved', score: scoreRelieved },
    { mood: 'Happy', score: scoreHappy }
  ];

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  // Base confidence on score delta & acoustic clarity
  const hasAcoustic = metrics && metrics.speechActivity;
  const rawConf = 55 + (best.score * 12) + (hasAcoustic ? 15 : 0);
  const confidence = Math.min(96, Math.max(62, Math.round(rawConf)));

  const reasons: Record<VoiceEmotionType, { en: string; hi: string; summary: string }> = {
    Stressed: {
      en: 'Acoustic tension, rapid breath pacing & high vigilance frequency detected in stream',
      hi: 'ऑडियो स्ट्रीम में मानसिक खिंचाव और तीव्र साँसों की गति पकड़ी गई',
      summary: 'High tension & cadence velocity'
    },
    Frustrated: {
      en: 'Elevated vocal energy bursts & emphatic pressure spikes in audio stream',
      hi: 'ऑडियो स्ट्रीम में तेज़ आवाज़ और तीखे दबाव का अहसास',
      summary: 'High RMS volume bursts & vocal thrusts'
    },
    Relieved: {
      en: 'Gentle deceleration, relaxed vocal chords & calm acoustic exhalation',
      hi: 'धीमी आवाज़, शांत श्वास और राहत भरी टोन',
      summary: 'Low-tension deceleration & steady cadence'
    },
    Happy: {
      en: 'Bright harmonic spectral centroid & buoyant dynamic inflection',
      hi: 'खुशनुमा आवाज़, चमकीली टोन और सकारात्मक ऊर्जा',
      summary: 'Bright spectral harmonics & upbeat tone'
    }
  };

  const info = reasons[best.mood];

  return {
    mood: best.mood,
    confidence,
    reasonEn: info.en,
    reasonHi: info.hi,
    acousticSummary: info.summary
  };
}
