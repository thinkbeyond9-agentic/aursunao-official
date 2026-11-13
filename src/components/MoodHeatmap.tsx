import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Story } from '../types';
import { MOOD_COLORS, MOODS } from '../data';
import { Calendar, Sparkles, Filter, X, TrendingUp, Heart, Activity } from 'lucide-react';

interface MoodHeatmapProps {
  stories: Story[];
  lang: 'en' | 'hi';
  selectedMood: string;
  onSelectMood: (mood: string) => void;
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
}

// Visual color mapping for D3 fills
export const MOOD_HEX_MAP: Record<string, string> = {
  anxious: '#FF5C5C',
  burnout: '#71717A',
  lonely: '#FF6B5B',
  hopeful: '#F5F5F0',
  angry: '#EF4444',
  love: '#F472B6',
  grief: '#3F3F46',
  ambition: '#FB923C',
  failure: '#A1A1AA',
  family: '#FDBA74',
  migration: '#C084FC',
  'small-town': '#FCD34D'
};

// Valence score for emotional trend line (-2 heavy/distress to +2 clarity/peace)
const MOOD_VALENCE: Record<string, number> = {
  angry: -1.8,
  burnout: -1.5,
  anxious: -1.2,
  grief: -1.4,
  failure: -1.3,
  lonely: -1.0,
  migration: -0.2,
  family: 0.5,
  'small-town': 0.8,
  ambition: 1.2,
  love: 1.5,
  hopeful: 1.8
};

export interface DayData {
  dayNumber: number; // 1 to 21
  date: Date;
  dateLabel: string;
  dayOfWeek: string;
  isToday: boolean;
  vents: Story[];
  count: number;
  dominantMood: string | null;
  dominantColor: string;
  moodCounts: Record<string, number>;
  valenceScore: number; // Average emotional valence on that day
}

export const MoodHeatmap: React.FC<MoodHeatmapProps> = ({
  stories,
  lang,
  selectedMood,
  onSelectMood,
  selectedDay,
  onSelectDay
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const trendSvgRef = useRef<SVGSVGElement | null>(null);

  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');

  // Generate 21 calendar days ending today
  const daysData: DayData[] = useMemo(() => {
    const now = new Date();
    const result: DayData[] = [];

    // Map each story to a day index between 1 and 21
    // If story has createdAt, use it; otherwise spread deterministically
    const dayMap = new Map<number, Story[]>();
    for (let i = 1; i <= 21; i++) {
      dayMap.set(i, []);
    }

    stories.forEach((story, idx) => {
      let targetDay = 21;
      if (story.createdAt) {
        const diffMs = now.getTime() - story.createdAt;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        targetDay = Math.max(1, Math.min(21, 21 - diffDays));
      } else {
        // Pre-seed sample stories realistically across the 21 days
        const preseededDays = [2, 5, 9, 13, 17, 20];
        targetDay = preseededDays[idx % preseededDays.length];
      }
      dayMap.get(targetDay)?.push(story);
    });

    for (let d = 1; d <= 21; d++) {
      const dayDate = new Date(now);
      dayDate.setDate(now.getDate() - (21 - d));

      const ventsOnDay = dayMap.get(d) || [];
      const moodCounts: Record<string, number> = {};
      let totalValence = 0;

      ventsOnDay.forEach((v) => {
        moodCounts[v.mood] = (moodCounts[v.mood] || 0) + 1;
        totalValence += MOOD_VALENCE[v.mood] ?? 0;
      });

      let dominantMood: string | null = null;
      let maxCount = 0;
      Object.entries(moodCounts).forEach(([m, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantMood = m;
        }
      });

      const avgValence = ventsOnDay.length > 0 ? totalValence / ventsOnDay.length : (d / 21) * 0.8 - 0.4;
      const dominantColor = dominantMood ? (MOOD_HEX_MAP[dominantMood] || '#FF6B5B') : '#27272A';

      result.push({
        dayNumber: d,
        date: dayDate,
        dateLabel: dayDate.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
          month: 'short',
          day: 'numeric'
        }),
        dayOfWeek: dayDate.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' }),
        isToday: d === 21,
        vents: ventsOnDay,
        count: ventsOnDay.length,
        dominantMood,
        dominantColor,
        moodCounts,
        valenceScore: avgValence
      });
    }

    return result;
  }, [stories, lang]);

  // Summary statistics for the 21-day period
  const totalVents21Days = useMemo(() => {
    return daysData.reduce((acc, d) => acc + d.count, 0);
  }, [daysData]);

  const activeDaysCount = useMemo(() => {
    return daysData.filter((d) => d.count > 0).length;
  }, [daysData]);

  const topMood = useMemo(() => {
    const counts: Record<string, number> = {};
    daysData.forEach((d) => {
      Object.entries(d.moodCounts).forEach(([m, c]) => {
        counts[m] = (counts[m] || 0) + c;
      });
    });
    let top = 'burnout';
    let max = -1;
    Object.entries(counts).forEach(([m, c]) => {
      if (c > max) {
        max = c;
        top = m;
      }
    });
    return top;
  }, [daysData]);

  // Primary D3 Heatmap Grid Rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 800;
    const isMobile = containerWidth < 640;

    // Grid config: 3 rows x 7 cols (21 days)
    const cols = 7;
    const rows = 3;
    const padding = isMobile ? 6 : 10;
    const availableWidth = containerWidth - 32;
    const cellWidth = Math.min(isMobile ? 42 : 84, Math.floor((availableWidth - (cols - 1) * padding) / cols));
    const cellHeight = isMobile ? 54 : 68;

    const totalGridWidth = cols * cellWidth + (cols - 1) * padding;
    const totalGridHeight = rows * cellHeight + (rows - 1) * padding;
    const startX = Math.max(0, (availableWidth - totalGridWidth) / 2) + 16;
    const startY = 16;

    svg
      .attr('width', '100%')
      .attr('height', totalGridHeight + startY * 2)
      .attr('viewBox', `0 0 ${containerWidth} ${totalGridHeight + startY * 2}`);

    const g = svg.append('g').attr('transform', `translate(${startX}, ${startY})`);

    // Defs for gradients & filters
    const defs = svg.append('defs');

    // Create glow filter for selected day
    const glowFilter = defs.append('filter').attr('id', 'cell-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    glowFilter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    // Render cells
    daysData.forEach((day, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = col * (cellWidth + padding);
      const y = row * (cellHeight + padding);

      const isSelected = selectedDay === day.dayNumber;
      const matchesMood = selectedMood === 'all' || (day.dominantMood === selectedMood);
      const hasVents = day.count > 0;

      const cellGroup = g
        .append('g')
        .attr('class', `day-cell day-${day.dayNumber}`)
        .attr('transform', `translate(${x}, ${y})`)
        .style('cursor', 'pointer');

      // Cell background
      const rect = cellGroup
        .append('rect')
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('rx', 12)
        .attr('ry', 12)
        .attr('stroke', isSelected ? '#FF6B5B' : day.isToday ? '#FF6B5B' : '#27272A')
        .attr('stroke-width', isSelected ? 2.5 : day.isToday ? 1.5 : 1)
        .attr('stroke-dasharray', day.isToday && !isSelected ? '3,3' : 'none')
        .attr('fill', () => {
          if (!hasVents) return '#141416';
          if (!matchesMood) return '#1A1A1E';
          return '#1A1A1E';
        })
        .attr('opacity', matchesMood ? 1 : 0.35)
        .style('transition', 'all 0.2s ease');

      if (isSelected) {
        rect.attr('filter', 'url(#cell-glow)');
      }

      // If has vents, add filled mood color accent bar or subtle fill
      if (hasVents && matchesMood) {
        cellGroup
          .append('rect')
          .attr('x', 4)
          .attr('y', 4)
          .attr('width', cellWidth - 8)
          .attr('height', cellHeight - 8)
          .attr('rx', 8)
          .attr('ry', 8)
          .attr('fill', day.dominantColor)
          .attr('opacity', isSelected ? 0.35 : 0.18);

        // Indicator pill in corner
        cellGroup
          .append('circle')
          .attr('cx', cellWidth - (isMobile ? 10 : 14))
          .attr('cy', isMobile ? 12 : 14)
          .attr('r', isMobile ? 3 : 4)
          .attr('fill', day.dominantColor);
      }

      // Day of week label
      cellGroup
        .append('text')
        .attr('x', isMobile ? 8 : 12)
        .attr('y', isMobile ? 16 : 20)
        .attr('font-size', isMobile ? '9px' : '11px')
        .attr('font-family', 'sans-serif')
        .attr('font-weight', '500')
        .attr('fill', isSelected ? '#FF6B5B' : '#A1A1AA')
        .text(day.dayOfWeek);

      // Day number label
      cellGroup
        .append('text')
        .attr('x', isMobile ? 8 : 12)
        .attr('y', isMobile ? 34 : 42)
        .attr('font-size', isMobile ? '13px' : '18px')
        .attr('font-family', 'display, sans-serif')
        .attr('font-weight', 'bold')
        .attr('fill', isSelected ? '#FFFFFF' : day.isToday ? '#FF6B5B' : '#FFFFFF')
        .text(day.dayNumber);

      // Bottom info: vent count badge or dot
      if (hasVents) {
        cellGroup
          .append('text')
          .attr('x', isMobile ? 8 : 12)
          .attr('y', isMobile ? 47 : 58)
          .attr('font-size', isMobile ? '8px' : '10px')
          .attr('font-family', 'sans-serif')
          .attr('fill', day.dominantColor)
          .attr('font-weight', '600')
          .text(`${day.count} ${day.count === 1 ? 'vent' : 'vents'}`);
      } else {
        cellGroup
          .append('text')
          .attr('x', isMobile ? 8 : 12)
          .attr('y', isMobile ? 47 : 58)
          .attr('font-size', isMobile ? '8px' : '9px')
          .attr('font-family', 'sans-serif')
          .attr('fill', '#52525B')
          .text(day.isToday ? (lang === 'en' ? 'Today' : 'आज') : '—');
      }

      // Mouse interactive events
      cellGroup
        .on('mouseenter', (event) => {
          rect
            .transition()
            .duration(150)
            .attr('transform', 'scale(1.04)')
            .attr('stroke', '#FF6B5B');

          const target = event.currentTarget as SVGGElement;
          const bounds = target.getBoundingClientRect();
          const containerBounds = containerRef.current?.getBoundingClientRect();
          if (containerBounds) {
            setTooltipPos({
              x: bounds.left - containerBounds.left + bounds.width / 2,
              y: bounds.top - containerBounds.top
            });
          }
          setHoveredDay(day);
        })
        .on('mouseleave', () => {
          rect
            .transition()
            .duration(150)
            .attr('transform', 'scale(1)')
            .attr('stroke', isSelected ? '#FF6B5B' : day.isToday ? '#FF6B5B' : '#27272A');
          setHoveredDay(null);
        })
        .on('click', () => {
          if (selectedDay === day.dayNumber) {
            onSelectDay(null);
          } else {
            onSelectDay(day.dayNumber);
          }
        });
    });
  }, [daysData, selectedDay, selectedMood, lang]);

  // Secondary D3 Emotional Clarity & Frequency Curve
  useEffect(() => {
    if (!trendSvgRef.current || !containerRef.current) return;

    const svg = d3.select(trendSvgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current.clientWidth || 800;
    const height = 90;
    const margin = { top: 12, right: 24, bottom: 24, left: 32 };

    svg.attr('width', '100%').attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    // X Scale: Day 1 to 21
    const xScale = d3
      .scaleLinear()
      .domain([1, 21])
      .range([0, innerWidth]);

    // Y Scale: Emotional Clarity / Valence Score
    const yScale = d3
      .scaleLinear()
      .domain([-2, 2])
      .range([innerHeight, 0]);

    // Gradient for area fill
    const defs = svg.append('defs');
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'valence-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#FF6B5B').attr('stop-opacity', 0.4);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#FF6B5B').attr('stop-opacity', 0.0);

    // Area generator
    const areaGenerator = d3
      .area<DayData>()
      .x((d) => xScale(d.dayNumber))
      .y0(innerHeight)
      .y1((d) => yScale(d.valenceScore))
      .curve(d3.curveMonotoneX);

    // Line generator
    const lineGenerator = d3
      .line<DayData>()
      .x((d) => xScale(d.dayNumber))
      .y((d) => yScale(d.valenceScore))
      .curve(d3.curveMonotoneX);

    // Baseline (Zero valence line)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#3F3F46')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-width', 1);

    // Render Area
    g.append('path')
      .datum(daysData)
      .attr('fill', 'url(#valence-area-gradient)')
      .attr('d', areaGenerator);

    // Render Line
    g.append('path')
      .datum(daysData)
      .attr('fill', 'none')
      .attr('stroke', '#FF6B5B')
      .attr('stroke-width', 2.5)
      .attr('d', lineGenerator);

    // Plot circles for days with active vents
    daysData.forEach((d) => {
      if (d.count > 0) {
        g.append('circle')
          .attr('cx', xScale(d.dayNumber))
          .attr('cy', yScale(d.valenceScore))
          .attr('r', selectedDay === d.dayNumber ? 6 : 4)
          .attr('fill', d.dominantColor)
          .attr('stroke', '#0A0A0B')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .on('click', () => {
            onSelectDay(selectedDay === d.dayNumber ? null : d.dayNumber);
          });
      }
    });

    // Axis labels
    g.append('text')
      .attr('x', 0)
      .attr('y', innerHeight + 16)
      .attr('fill', '#71717A')
      .attr('font-size', '10px')
      .attr('font-family', 'sans-serif')
      .text(lang === 'en' ? 'Day 1 (Start)' : 'दिन 1 (शुरुआत)');

    g.append('text')
      .attr('x', innerWidth)
      .attr('y', innerHeight + 16)
      .attr('text-anchor', 'end')
      .attr('fill', '#FF6B5B')
      .attr('font-size', '10px')
      .attr('font-family', 'sans-serif')
      .text(lang === 'en' ? 'Day 21 (Today)' : 'दिन 21 (आज)');
  }, [daysData, selectedDay, lang]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-[28px] border border-white/10 bg-[#0E0E10] p-5 md:p-7 text-white shadow-xl transition overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[#FF6B5B]/15 border border-[#FF6B5B]/30 px-3 py-0.5 text-[10px] font-sans font-bold text-[#FF6B5B] uppercase tracking-wider">
              <Calendar size={11} />
              {lang === 'en' ? '21-Day Journey' : '21 दिनों का सफ़र'}
            </span>
            <span className="text-[11px] font-sans text-white/50">
              {activeDaysCount}/21 {lang === 'en' ? 'Active Days' : 'दिन बोले'}
            </span>
          </div>
          <h3 className="font-display text-[22px] md:text-[28px] leading-tight mt-2 flex items-center gap-2">
            {lang === 'en' ? 'Mood Heatmap & Emotional Trends' : 'मूड हीटमैप और भावनात्मक रुझान'}
            <Sparkles size={18} className="text-[#FF6B5B]" />
          </h3>
          <p className="font-sans text-[12px] md:text-[13px] text-white/60 mt-1 max-w-[65ch] leading-relaxed">
            {lang === 'en'
              ? 'Every anonymous voice rant tracked across your 21-day trial. Click any day to isolate that day’s structured stories in your library.'
              : 'आपके 21 दिनों के फ्री ट्रायल की हर रिकॉर्डिंग। किसी भी दिन पर क्लिक करके उस दिन की कहानियाँ लाइब्रेरी में देखें।'}
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-center min-w-[90px]">
            <div className="text-[10px] uppercase font-sans text-white/40">
              {lang === 'en' ? 'Total Vents' : 'कुल वेंट्स'}
            </div>
            <div className="font-display text-[20px] text-white mt-0.5">{totalVents21Days}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-center min-w-[100px]">
            <div className="text-[10px] uppercase font-sans text-white/40">
              {lang === 'en' ? 'Top Emotion' : 'प्रमुख मूड'}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: MOOD_HEX_MAP[topMood] || '#FF6B5B' }}
              />
              <span className="font-sans text-[12px] font-bold capitalize">{topMood}</span>
            </div>
          </div>
          {selectedDay && (
            <button
              onClick={() => onSelectDay(null)}
              className="rounded-full bg-white/10 border border-white/15 px-3 py-2 text-[11px] font-sans text-white hover:bg-white/20 flex items-center gap-1.5 transition"
            >
              <X size={13} />
              {lang === 'en' ? `Clear Day ${selectedDay}` : `दिन ${selectedDay} हटाएं`}
            </button>
          )}
        </div>
      </div>

      {/* Mood Filter Chips & Legend */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-sans uppercase tracking-widest text-white/40 flex items-center gap-1">
            <Filter size={10} /> {lang === 'en' ? 'Highlight Mood:' : 'मूड चुनें:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onSelectMood('all')}
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-sans border transition ${
                selectedMood === 'all'
                  ? 'bg-white text-black border-white font-bold'
                  : 'border-white/15 text-white/70 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'All Moods' : 'सभी'}
            </button>
            {['burnout', 'anxious', 'lonely', 'hopeful', 'angry', 'love', 'grief', 'ambition'].map((m) => {
              const color = MOOD_HEX_MAP[m] || '#FF6B5B';
              const isSelected = selectedMood === m;
              return (
                <button
                  key={m}
                  onClick={() => onSelectMood(isSelected ? 'all' : m)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-sans border flex items-center gap-1.5 transition ${
                    isSelected
                      ? 'border-white text-white font-bold bg-white/15'
                      : 'border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="capitalize">{m}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Alert Pill */}
        {selectedDay && (
          <div className="rounded-full bg-[#FF6B5B]/20 border border-[#FF6B5B]/40 px-3 py-1 text-[11px] font-sans text-[#FF6B5B] flex items-center gap-2">
            <span>
              {lang === 'en'
                ? `Showing Day ${selectedDay} stories only (${daysData[selectedDay - 1]?.dateLabel})`
                : `केवल दिन ${selectedDay} की कहानियाँ (${daysData[selectedDay - 1]?.dateLabel})`}
            </span>
            <button onClick={() => onSelectDay(null)} className="hover:text-white">
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* D3 Calendar Heatmap Matrix SVG */}
      <div className="mt-4 relative overflow-x-auto select-none">
        <svg ref={svgRef} className="w-full min-w-[620px] md:min-w-0" />

        {/* Interactive Floating Hover Tooltip */}
        {hoveredDay && tooltipPos && (
          <div
            className="pointer-events-none absolute z-20 w-64 rounded-2xl bg-[#18181B] border border-white/20 p-3.5 shadow-2xl text-white transform -translate-x-1/2 -translate-y-full mb-2"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`
            }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-display text-[15px] text-white">
                {lang === 'en' ? `Day ${hoveredDay.dayNumber}` : `दिन ${hoveredDay.dayNumber}`}
                {hoveredDay.isToday && <span className="ml-1 text-[#FF6B5B] text-[11px] font-sans">(Today)</span>}
              </span>
              <span className="text-[11px] font-sans text-white/60">{hoveredDay.dateLabel}</span>
            </div>

            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[11px] font-sans">
                <span className="text-white/60">{lang === 'en' ? 'Recordings:' : 'रिकॉर्डिंग्स:'}</span>
                <span className="font-bold text-white">
                  {hoveredDay.count} {hoveredDay.count === 1 ? 'vent' : 'vents'}
                </span>
              </div>

              {hoveredDay.dominantMood && (
                <div className="mt-1.5 flex items-center justify-between text-[11px] font-sans">
                  <span className="text-white/60">{lang === 'en' ? 'Dominant Mood:' : 'प्रमुख अहसास:'}</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                    style={{
                      background: hoveredDay.dominantColor,
                      color: ['hopeful', 'family', 'small-town'].includes(hoveredDay.dominantMood) ? '#000' : '#FFF'
                    }}
                  >
                    {hoveredDay.dominantMood}
                  </span>
                </div>
              )}

              {hoveredDay.vents.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-white/5">
                  <div className="text-[10px] uppercase font-sans text-white/40 mb-1">
                    {lang === 'en' ? 'Stories Recorded:' : 'दर्ज कहानियाँ:'}
                  </div>
                  <ul className="space-y-1">
                    {hoveredDay.vents.slice(0, 2).map((v, idx) => (
                      <li key={`${v.id}-${idx}`} className="text-[11px] font-sans truncate text-white/80">
                        • {lang === 'en' ? v.title : v.titleHi}
                      </li>
                    ))}
                    {hoveredDay.vents.length > 2 && (
                      <li className="text-[10px] font-sans text-white/40">
                        +{hoveredDay.vents.length - 2} more...
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="mt-2.5 text-[10px] font-sans text-[#FF6B5B] flex items-center gap-1 font-semibold">
                {selectedDay === hoveredDay.dayNumber
                  ? (lang === 'en' ? '✓ Currently filtering this day' : '✓ इस दिन की कहानियाँ फ़िल्टर हैं')
                  : (lang === 'en' ? 'Click cell to filter stories' : 'कहानियाँ देखने के लिए क्लिक करें')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Secondary Emotional Clarity Trend Line (D3 Area Sparkline) */}
      <div className="mt-4 border-t border-white/5 pt-4">
        <div className="flex items-center justify-between mb-1 text-[11px] font-sans text-white/60">
          <span className="flex items-center gap-1.5">
            <Activity size={12} className="text-[#FF6B5B]" />
            {lang === 'en'
              ? 'Emotional Trajectory Curve (Overthinking → Clarity over 21 Days)'
              : 'भावनात्मक स्पष्टता वक्र (21 दिनों में उलझन से शांति की ओर)'}
          </span>
          <span className="text-[10px] text-white/40">
            {lang === 'en' ? 'D3.js dynamic spline' : 'D3.js कर्व'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <svg ref={trendSvgRef} className="w-full min-w-[620px] md:min-w-0" />
        </div>
      </div>
    </div>
  );
};
export default MoodHeatmap;
