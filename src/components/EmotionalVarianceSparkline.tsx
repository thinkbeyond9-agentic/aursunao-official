import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Activity, TrendingUp, Sparkles, Clock, Zap } from 'lucide-react';
import { AudioMetrics, VoiceEmotionType } from '../audioMoodDetector';

interface DataPoint {
  time: number; // in seconds (0 - 30)
  variance: number; // normalized 0.0 - 1.0
  emotion?: VoiceEmotionType | null;
  note?: string;
}

interface EmotionalVarianceSparklineProps {
  isRecording: boolean;
  audioMetrics: AudioMetrics | null;
  currentEmotion?: VoiceEmotionType | null;
  transcript?: string;
  lang?: 'en' | 'hi';
  windowSeconds?: number; // default 30
}

export const EmotionalVarianceSparkline: React.FC<EmotionalVarianceSparklineProps> = ({
  isRecording,
  audioMetrics,
  currentEmotion,
  transcript = '',
  lang = 'en',
  windowSeconds = 30,
}) => {
  // Elapsed time in seconds within recording window
  const [elapsed, setElapsed] = useState<number>(0);
  // Time-series variance samples across the window
  const [samples, setSamples] = useState<DataPoint[]>([]);
  // Hovered sample index for interactive inspection
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const previousRmsRef = useRef<number>(0.1);
  const rollingSamplesRef = useRef<DataPoint[]>([]);

  // Baseline calibration curve when idle before first recording
  const idleBaselinePoints: DataPoint[] = useMemo(() => {
    const pts: DataPoint[] = [];
    const count = 30;
    for (let i = 0; i <= count; i++) {
      const t = (i / count) * windowSeconds;
      // Gentle ambient sine fluctuation between 0.12 and 0.22
      const v = 0.16 + Math.sin(i * 0.4) * 0.04 + Math.cos(i * 0.7) * 0.02;
      pts.push({ time: t, variance: Math.max(0.05, Math.min(0.95, v)) });
    }
    return pts;
  }, [windowSeconds]);

  // Start / Reset / Sample loop when recording state changes
  useEffect(() => {
    if (isRecording) {
      startTimeRef.current = Date.now();
      setElapsed(0);
      rollingSamplesRef.current = [{ time: 0, variance: 0.15, emotion: currentEmotion || 'Relieved' }];
      setSamples(rollingSamplesRef.current);

      // High-frequency sampling (every 300ms) for ultra-smooth 30s sparkline
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const rawSec = (now - startTimeRef.current) / 1000;
        const currentSec = Math.min(windowSeconds, Math.round(rawSec * 10) / 10);
        setElapsed(currentSec);

        // Derive emotional variance
        let variance = 0.2;
        if (audioMetrics) {
          const deltaRms = Math.abs((audioMetrics.rms || 0) - previousRmsRef.current);
          previousRmsRef.current = audioMetrics.rms || 0;

          // Emotional variance synthesized from vocal jitter, pitch strain, and volume spikes
          const acousticVariance =
            (audioMetrics.jitter || 0.15) * 0.45 +
            (audioMetrics.pitchTension || 0.2) * 0.35 +
            Math.min(0.4, deltaRms * 1.6);

          variance = Math.min(0.95, Math.max(0.08, acousticVariance));

          // Boost variance if speech exhibits emotional tension
          if (currentEmotion === 'Frustrated' || currentEmotion === 'Stressed') {
            variance = Math.min(0.96, variance * 1.25 + 0.1);
          } else if (currentEmotion === 'Relieved') {
            variance = Math.max(0.08, variance * 0.75);
          }
        } else {
          // If in speech simulation or waiting for mic packets
          const seed = Math.sin(rawSec * 1.8) * 0.22 + Math.cos(rawSec * 3.1) * 0.14;
          variance = Math.min(0.85, Math.max(0.12, 0.32 + seed));
        }

        const newPoint: DataPoint = {
          time: currentSec,
          variance: Math.round(variance * 100) / 100,
          emotion: currentEmotion || null,
        };

        rollingSamplesRef.current = [...rollingSamplesRef.current, newPoint];
        setSamples([...rollingSamplesRef.current]);

        if (rawSec >= windowSeconds) {
          // Window complete
          clearInterval(timerRef.current);
        }
      }, 350);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, windowSeconds]);

  // Continuously incorporate live audioMetrics while recording
  useEffect(() => {
    if (!isRecording || !audioMetrics) return;

    // Update the latest point's variance dynamically between intervals
    setSamples((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      const deltaRms = Math.abs((audioMetrics.rms || 0) - previousRmsRef.current);
      const instantVariance = Math.min(
        0.95,
        Math.max(
          0.08,
          (audioMetrics.jitter || 0.15) * 0.45 +
            (audioMetrics.pitchTension || 0.2) * 0.35 +
            Math.min(0.3, deltaRms * 1.4)
        )
      );
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...last,
        variance: Math.round(instantVariance * 100) / 100,
        emotion: currentEmotion || last.emotion,
      };
      return updated;
    });
  }, [audioMetrics, isRecording, currentEmotion]);

  // Points to display: active recorded samples, or fallback to baseline if empty
  const displayPoints = samples.length > 1 ? samples : idleBaselinePoints;
  const isUsingRealData = samples.length > 1;

  // Key metrics calculation
  const latestVariance = isUsingRealData && samples.length > 0 ? samples[samples.length - 1].variance : 0.18;
  const maxVariancePoint = useMemo(() => {
    if (!isUsingRealData) return { time: 14, variance: 0.22 };
    return samples.reduce((max, pt) => (pt.variance > max.variance ? pt : max), samples[0]);
  }, [samples, isUsingRealData]);

  const avgVariance = useMemo(() => {
    if (!isUsingRealData) return 0.18;
    const sum = samples.reduce((acc, pt) => acc + pt.variance, 0);
    return Math.round((sum / samples.length) * 100) / 100;
  }, [samples, isUsingRealData]);

  // SVG coordinate transformation
  const svgWidth = 420;
  const svgHeight = 68;
  const paddingX = 14;
  const paddingY = 8;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  // Convert (time, variance) into SVG (x, y) coordinates
  const getCoordinates = (point: DataPoint) => {
    const x = paddingX + (point.time / windowSeconds) * usableWidth;
    // higher variance = closer to top (lower y)
    const y = paddingY + usableHeight - point.variance * usableHeight;
    return { x, y };
  };

  // Build smooth SVG path
  const pathD = useMemo(() => {
    if (displayPoints.length === 0) return '';
    const coords = displayPoints.map(getCoordinates);

    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

    let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      // Midpoint bezier smoothing
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      d += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
    }
    const last = coords[coords.length - 1];
    d += ` T ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
    return d;
  }, [displayPoints, windowSeconds]);

  // Area fill under the sparkline curve
  const areaD = useMemo(() => {
    if (displayPoints.length === 0) return '';
    const coords = displayPoints.map(getCoordinates);
    const first = coords[0];
    const last = coords[coords.length - 1];
    const bottomY = paddingY + usableHeight;

    let d = pathD;
    d += ` L ${last.x.toFixed(1)} ${bottomY.toFixed(1)}`;
    d += ` L ${first.x.toFixed(1)} ${bottomY.toFixed(1)} Z`;
    return d;
  }, [pathD, displayPoints]);

  // Active head point
  const currentHeadCoord = useMemo(() => {
    if (displayPoints.length === 0) return null;
    return getCoordinates(displayPoints[displayPoints.length - 1]);
  }, [displayPoints]);

  // Peak point coordinate
  const peakCoord = useMemo(() => {
    if (!maxVariancePoint) return null;
    return getCoordinates(maxVariancePoint);
  }, [maxVariancePoint]);

  // Variance severity classification
  const getVarianceTier = (val: number) => {
    if (val < 0.25) return { label: lang === 'en' ? 'Steady Cadence' : 'स्थिर आवाज़', color: '#06D6A0' };
    if (val < 0.5) return { label: lang === 'en' ? 'Moderate Dynamic' : 'संतुलित उतार-चढ़ाव', color: '#FFD166' };
    if (val < 0.72) return { label: lang === 'en' ? 'Elevated Strain' : 'तीव्र खिंचाव', color: '#FF8E53' };
    return { label: lang === 'en' ? 'High Emotional Burst' : 'अत्यधिक भावुकता', color: '#FF5C5C' };
  };

  const currentTier = getVarianceTier(latestVariance);

  return (
    <div
      id="voice-booth-sparkline-container"
      className="mb-3 rounded-[12px] bg-black/40 border border-white/10 p-2.5 sm:p-3 relative overflow-hidden transition-all duration-300"
    >
      {/* Background ambient glow */}
      <div
        className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full pointer-events-none blur-2xl opacity-20 transition-all duration-500"
        style={{
          background: isRecording ? '#FF6B5B' : '#06D6A0',
        }}
      />

      {/* Header bar with labels, live timer, and variance score */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5 text-[11px] font-sans">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-[#FF6B5B]/15 border border-[#FF6B5B]/30 flex items-center justify-center text-[#FF6B5B]">
            <TrendingUp size={11} />
          </div>
          <div>
            <span className="font-semibold text-white/90 flex items-center gap-1">
              <span>{lang === 'en' ? '30s Emotional Variance' : '30-सेकंड भावुक उतार-चढ़ाव'}</span>
              {isRecording ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-[#FF5C5C]/20 border border-[#FF5C5C]/40 text-[#FF5C5C] text-[9px] font-mono animate-pulse">
                  ● {elapsed.toFixed(1)}s / {windowSeconds}s
                </span>
              ) : (
                <span className="text-[10px] text-white/40 font-mono">
                  ({windowSeconds}s {lang === 'en' ? 'window' : 'विंडो'})
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Real-time telemetry badges */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Variance tier tag */}
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all duration-200 flex items-center gap-1"
            style={{
              color: currentTier.color,
              borderColor: `${currentTier.color}40`,
              backgroundColor: `${currentTier.color}15`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTier.color }} />
            <span>{currentTier.label}</span>
          </span>

          {/* Numerical variance score */}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/80" title="Emotional Variance Index (0-100%)">
            σ <strong className="text-white">{(latestVariance * 100).toFixed(0)}%</strong>
          </span>
        </div>
      </div>

      {/* Mini SVG Sparkline Canvas */}
      <div className="relative w-full h-[70px] bg-black/50 rounded-[8px] border border-white/5 overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full block"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            {/* Soft vertical gradient beneath variance curve */}
            <linearGradient id="sparklineAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6B5B" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#FF8E53" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FF8E53" stopOpacity="0.0" />
            </linearGradient>

            {/* Line stroke gradient for high emotional fidelity */}
            <linearGradient id="sparklineStrokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06D6A0" />
              <stop offset="45%" stopColor="#FFD166" />
              <stop offset="80%" stopColor="#FF8E53" />
              <stop offset="100%" stopColor="#FF6B5B" />
            </linearGradient>

            {/* Pulsing glow filter */}
            <filter id="glowHead" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Reference baseline grid lines */}
          {/* High threshold (75%) */}
          <line
            x1={paddingX}
            y1={paddingY + usableHeight * 0.25}
            x2={svgWidth - paddingX}
            y2={paddingY + usableHeight * 0.25}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          {/* Mid threshold (50%) */}
          <line
            x1={paddingX}
            y1={paddingY + usableHeight * 0.5}
            x2={svgWidth - paddingX}
            y2={paddingY + usableHeight * 0.5}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          {/* Baseline threshold (25%) */}
          <line
            x1={paddingX}
            y1={paddingY + usableHeight * 0.75}
            x2={svgWidth - paddingX}
            y2={paddingY + usableHeight * 0.75}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Area under the curve */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#sparklineAreaGradient)"
              className="transition-all duration-150"
            />
          )}

          {/* The main sparkline stroke */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="url(#sparklineStrokeGradient)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-150"
            />
          )}

          {/* Elapsed time vertical cursor indicator when recording */}
          {isRecording && currentHeadCoord && (
            <g>
              <line
                x1={currentHeadCoord.x}
                y1={paddingY}
                x2={currentHeadCoord.x}
                y2={paddingY + usableHeight}
                stroke="#FF6B5B"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                className="opacity-80"
              />
              {/* Head circular indicator with glow */}
              <circle
                cx={currentHeadCoord.x}
                cy={currentHeadCoord.y}
                r="4.5"
                fill="#FF6B5B"
                filter="url(#glowHead)"
                className="animate-pulse"
              />
              <circle cx={currentHeadCoord.x} cy={currentHeadCoord.y} r="2" fill="#FFFFFF" />
            </g>
          )}

          {/* Peak variance marker */}
          {isUsingRealData && peakCoord && maxVariancePoint.variance > 0.4 && (
            <g className="opacity-90">
              <circle
                cx={peakCoord.x}
                cy={peakCoord.y}
                r="3"
                fill="#FF5C5C"
                stroke="#000"
                strokeWidth="1"
              />
              <line
                x1={peakCoord.x}
                y1={peakCoord.y}
                x2={peakCoord.x}
                y2={peakCoord.y - 6}
                stroke="#FF5C5C"
                strokeWidth="1"
              />
            </g>
          )}

          {/* Interactive invisible hover columns across the 30s timeline */}
          {displayPoints.map((pt, idx) => {
            const coord = getCoordinates(pt);
            return (
              <rect
                key={idx}
                x={coord.x - 6}
                y={paddingY}
                width={12}
                height={usableHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredIndex(idx)}
              />
            );
          })}

          {/* Hover highlight dot */}
          {hoveredIndex !== null && displayPoints[hoveredIndex] && (
            <g>
              {(() => {
                const pt = displayPoints[hoveredIndex];
                const c = getCoordinates(pt);
                return (
                  <>
                    <line
                      x1={c.x}
                      y1={paddingY}
                      x2={c.x}
                      y2={paddingY + usableHeight}
                      stroke="#FFFFFF"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      className="opacity-60"
                    />
                    <circle cx={c.x} cy={c.y} r="4" fill="#FFD166" stroke="#000000" strokeWidth="1.5" />
                  </>
                );
              })()}
            </g>
          )}
        </svg>

        {/* Hovered Tooltip Overlay */}
        {hoveredIndex !== null && displayPoints[hoveredIndex] && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full px-2 py-1 rounded bg-black/90 border border-white/20 text-[10px] font-mono text-white whitespace-nowrap shadow-xl"
            style={{
              left: `${(displayPoints[hoveredIndex].time / windowSeconds) * 100}%`,
              top: '40%',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[#FFD166] font-bold">{displayPoints[hoveredIndex].time.toFixed(1)}s</span>
              <span>•</span>
              <span>σ {(displayPoints[hoveredIndex].variance * 100).toFixed(0)}%</span>
              {displayPoints[hoveredIndex].emotion && (
                <span className="text-[#FF6B5B]">({displayPoints[hoveredIndex].emotion})</span>
              )}
            </div>
          </div>
        )}

        {/* Status prompt when idle and awaiting voice stream */}
        {!isRecording && !isUsingRealData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-sans text-[10px] text-white/40 px-2.5 py-0.5 rounded-full bg-black/40 border border-white/5 flex items-center gap-1.5 backdrop-blur-sm">
              <Sparkles size={10} className="text-[#06D6A0]" />
              {lang === 'en'
                ? 'Ready • Speak to plot acoustic emotional variance over 30s'
                : 'तैयार • 30-सेकंड आवाज़ के उतार-चढ़ाव को ट्रैक करने के लिए बोलें'}
            </span>
          </div>
        )}
      </div>

      {/* 30-Second Timeline Axis Labels */}
      <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-white/40 px-0.5">
        <span className="flex items-center gap-0.5">
          <Clock size={9} /> 0s
        </span>
        <span>10s</span>
        <span className="text-white/60 font-semibold">15s (Midpoint)</span>
        <span>20s</span>
        <span className="text-[#FF6B5B] font-semibold">30s (Limit)</span>
      </div>

      {/* Summary Footer bar with acoustic variance insights */}
      {isUsingRealData && (
        <div className="mt-1.5 pt-1.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-sans text-white/60">
          <div className="flex items-center gap-2">
            <span>
              {lang === 'en' ? 'Average Variance:' : 'औसत विचलन:'}{' '}
              <strong className="text-white font-mono">{(avgVariance * 100).toFixed(0)}%</strong>
            </span>
            <span className="text-white/20">•</span>
            <span>
              {lang === 'en' ? 'Peak Spike:' : 'उच्चतम मोड़:'}{' '}
              <strong className="text-[#FF5C5C] font-mono">
                {(maxVariancePoint.variance * 100).toFixed(0)}%
              </strong>{' '}
              <span className="text-white/40 font-mono">(@{maxVariancePoint.time.toFixed(1)}s)</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[9px] font-mono text-white/40 ml-auto">
            <Zap size={9} className="text-[#FF8E53]" />
            <span>{lang === 'en' ? 'Jitter + Pitch Tension + Centroid' : 'आवाज़ की तीव्रता और खिंचाव'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
