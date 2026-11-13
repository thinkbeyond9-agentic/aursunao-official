import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { Story } from '../types';
import { STORY_CATEGORIES, StoryCategory, getStoryCategory, CATEGORY_MAP } from '../data/storyCategories';
import { MOOD_HEX_MAP } from './MoodHeatmap';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Filter, 
  Eye, 
  X, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Layers, 
  Tag, 
  Heart, 
  Sparkles, 
  ArrowUpRight, 
  Info,
  BookOpen
} from 'lucide-react';

interface StoryKnowledgeGraphProps {
  stories: Story[];
  lang: 'en' | 'hi';
  onOpenStory: (story: Story) => void;
  userIsRegistered?: boolean;
  onRequireRegister?: () => void;
}

// Graph simulation node interfaces
interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  type: 'category' | 'story';
  name: string;
  nameHi?: string;
  category: StoryCategory;
  storyData?: Story;
  radius: number;
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  isCrossLink?: boolean;
  theme?: string;
  strength?: number;
}

export const StoryKnowledgeGraph: React.FC<StoryKnowledgeGraphProps> = ({
  stories,
  lang,
  onOpenStory,
  userIsRegistered,
  onRequireRegister
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Layout mode: 'clusters' (orbital category hubs), 'network' (free-floating force mesh), 'matrix' (mood valence)
  const [layoutMode, setLayoutMode] = useState<'clusters' | 'network'>('clusters');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLegend, setShowLegend] = useState<boolean>(true);

  // Pre-calculate category statistics for category cards and pills
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    const moodsPerCategory: Record<string, Record<string, number>> = {};

    STORY_CATEGORIES.forEach(c => {
      counts[c.id] = 0;
      moodsPerCategory[c.id] = {};
    });

    stories.forEach(s => {
      const cat = getStoryCategory(s);
      counts[cat.id] = (counts[cat.id] || 0) + 1;
      const mood = s.mood || 'burnout';
      moodsPerCategory[cat.id] = moodsPerCategory[cat.id] || {};
      moodsPerCategory[cat.id][mood] = (moodsPerCategory[cat.id][mood] || 0) + 1;
    });

    return STORY_CATEGORIES.map(cat => {
      const count = counts[cat.id] || 0;
      const moodDict = moodsPerCategory[cat.id] || {};
      const topMood = Object.entries(moodDict).sort((a, b) => b[1] - a[1])[0]?.[0] || 'burnout';
      return {
        ...cat,
        storyCount: count,
        percentage: stories.length > 0 ? Math.round((count / stories.length) * 100) : 0,
        topMood
      };
    });
  }, [stories]);

  // Build Graph Nodes and Links from stories
  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, GraphNode>();
    const linkList: GraphLink[] = [];

    // 1. Create Category Hub Nodes
    STORY_CATEGORIES.forEach((cat, index) => {
      // If a category is filtered, we still keep or focus on it
      nodeMap.set(`cat-${cat.id}`, {
        id: `cat-${cat.id}`,
        type: 'category',
        name: cat.name,
        nameHi: cat.nameHi,
        category: cat,
        radius: 26,
        color: cat.color
      });
    });

    // 2. Create Story Nodes
    stories.forEach((story) => {
      const cat = getStoryCategory(story);
      const nodeId = `story-${story.id}`;
      const moodColor = MOOD_HEX_MAP[story.mood || 'burnout'] || cat.color;

      nodeMap.set(nodeId, {
        id: nodeId,
        type: 'story',
        name: story.title,
        nameHi: story.titleHi,
        category: cat,
        storyData: story,
        radius: Math.min(13, Math.max(7, Math.sqrt((story.claps || 50) / 2.5))),
        color: moodColor
      });

      // Primary Link: Story -> Category Hub
      linkList.push({
        id: `link-${story.id}-${cat.id}`,
        source: nodeId,
        target: `cat-${cat.id}`,
        isCrossLink: false,
        strength: 0.8
      });
    });

    // 3. Create Cross-Links (Stories sharing key themes or locations)
    // Connect up to 2-3 related stories to create a web structure
    const themeIndex = new Map<string, string[]>();
    stories.forEach(story => {
      (story.themes || []).forEach(th => {
        const key = th.toLowerCase().trim();
        if (key.length > 2) {
          const list = themeIndex.get(key) || [];
          list.push(`story-${story.id}`);
          themeIndex.set(key, list);
        }
      });
    });

    let crossLinksAdded = 0;
    const maxCrossLinks = 90; // Limit so simulation remains fast & visually clean
    themeIndex.forEach((storyIds, themeKey) => {
      if (storyIds.length >= 2 && crossLinksAdded < maxCrossLinks) {
        for (let i = 0; i < Math.min(storyIds.length - 1, 2); i++) {
          linkList.push({
            id: `cross-${storyIds[i]}-${storyIds[i + 1]}-${themeKey}`,
            source: storyIds[i],
            target: storyIds[i + 1],
            isCrossLink: true,
            theme: themeKey,
            strength: 0.15
          });
          crossLinksAdded++;
        }
      }
    });

    return {
      nodes: Array.from(nodeMap.values()),
      links: linkList
    };
  }, [stories]);

  // Main D3 simulation effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = containerRef.current.clientWidth || 900;
    const height = containerRef.current.clientHeight || 620;

    svg.selectAll('*').remove();

    // Setup zoom container group
    const g = svg.append('g').attr('class', 'main-graph-group');

    // Define defs & glowing filters for categories & nodes
    const defs = svg.append('defs');

    // Create radial glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Filter nodes based on selectedCategory / searchQuery / selectedMoodFilter
    const filteredNodes = nodes.filter(node => {
      if (selectedCategory !== 'all') {
        if (node.type === 'category') {
          return node.category.id === selectedCategory;
        }
        if (node.type === 'story') {
          return node.category.id === selectedCategory;
        }
      }
      if (selectedMoodFilter !== 'all' && node.type === 'story') {
        return node.storyData?.mood === selectedMoodFilter;
      }
      if (searchQuery.trim() && node.type === 'story') {
        const query = searchQuery.toLowerCase();
        const titleMatch = (node.name || '').toLowerCase().includes(query);
        const cityMatch = (node.storyData?.location || '').toLowerCase().includes(query);
        const hookMatch = (node.storyData?.hook || '').toLowerCase().includes(query);
        return titleMatch || cityMatch || hookMatch;
      }
      return true;
    });

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredLinks = links.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : (link.source as GraphNode).id;
      const targetId = typeof link.target === 'string' ? link.target : (link.target as GraphNode).id;
      return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
    });

    // Orbital positioning for category hubs
    const centerX = width / 2;
    const centerY = height / 2;
    const orbitRadius = Math.min(width, height) * 0.36;

    STORY_CATEGORIES.forEach((cat, i) => {
      const catNode = filteredNodes.find(n => n.id === `cat-${cat.id}`);
      if (catNode) {
        const angle = (i / STORY_CATEGORIES.length) * 2 * Math.PI - Math.PI / 2;
        if (layoutMode === 'clusters') {
          catNode.fx = centerX + orbitRadius * Math.cos(angle);
          catNode.fy = centerY + orbitRadius * Math.sin(angle);
        } else {
          catNode.fx = null;
          catNode.fy = null;
        }
      }
    });

    // Create D3 Force Simulation
    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force(
        'link',
        d3.forceLink<GraphNode, GraphLink>(filteredLinks)
          .id(d => d.id)
          .distance(d => (d.isCrossLink ? 65 : 85))
          .strength(d => (d.isCrossLink ? 0.2 : 0.7))
      )
      .force('charge', d3.forceManyBody().strength((d: any) => (d.type === 'category' ? -500 : -55)))
      .force('center', d3.forceCenter(centerX, centerY).strength(0.08))
      .force('collision', d3.forceCollide<GraphNode>().radius(d => d.radius + (d.type === 'category' ? 12 : 5)).iterations(2));

    if (layoutMode === 'clusters') {
      // Add custom cluster gravitational pull towards category hub
      simulation.force('cluster', () => {
        filteredNodes.forEach(node => {
          if (node.type === 'story') {
            const hub = filteredNodes.find(n => n.id === `cat-${node.category.id}`);
            if (hub && hub.x !== undefined && hub.y !== undefined && node.x !== undefined && node.y !== undefined) {
              node.vx = (node.vx || 0) + (hub.x - node.x) * 0.045;
              node.vy = (node.vy || 0) + (hub.y - node.y) * 0.045;
            }
          }
        });
      });
    }

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links-layer');
    const link = linkGroup
      .selectAll('line')
      .data(filteredLinks)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        if (d.isCrossLink) return '#ffffff';
        const targetNode = typeof d.target === 'object' ? d.target : filteredNodes.find(n => n.id === d.target);
        return targetNode ? targetNode.color : '#FF6B5B';
      })
      .attr('stroke-opacity', (d: any) => (d.isCrossLink ? 0.12 : 0.28))
      .attr('stroke-width', (d: any) => (d.isCrossLink ? 1 : 1.5))
      .attr('stroke-dasharray', (d: any) => (d.isCrossLink ? '3,3' : 'none'));

    // Draw Category Orbit rings (visual guides)
    if (layoutMode === 'clusters' && selectedCategory === 'all') {
      g.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', orbitRadius)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,0.04)')
        .attr('stroke-dasharray', '4,8')
        .attr('stroke-width', 1);
    }

    // Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes-layer');
    const node = nodeGroup
      .selectAll('g')
      .data(filteredNodes)
      .enter()
      .append('g')
      .attr('class', (d: any) => `node-group node-${d.type}`)
      .attr('cursor', 'pointer');

    // 1. For Category Nodes: Outer ring halo
    node.filter((d: any) => d.type === 'category')
      .append('circle')
      .attr('r', (d: any) => d.radius + 6)
      .attr('fill', 'none')
      .attr('stroke', (d: any) => d.color)
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    // Category node base circle
    node.filter((d: any) => d.type === 'category')
      .append('circle')
      .attr('r', (d: any) => d.radius)
      .attr('fill', '#141418')
      .attr('stroke', (d: any) => d.color)
      .attr('stroke-width', 2.5)
      .style('filter', 'url(#glow)');

    // Category node icon emoji
    node.filter((d: any) => d.type === 'category')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '16px')
      .text((d: any) => d.category.icon);

    // Category node label (below circle)
    node.filter((d: any) => d.type === 'category')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 44)
      .attr('fill', '#F5F5F0')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('font-family', 'var(--font-sans, sans-serif)')
      .text((d: any) => (lang === 'en' ? d.category.shortName : d.category.nameHi.split(' ')[0]));

    // Category count pill below label
    node.filter((d: any) => d.type === 'category')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 58)
      .attr('fill', (d: any) => d.color)
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .text((d: any) => {
        const count = stories.filter(s => getStoryCategory(s).id === d.category.id).length;
        return `${count} ${lang === 'en' ? 'stories' : 'कहानियाँ'}`;
      });

    // 2. For Story Nodes: Outer hover halo
    node.filter((d: any) => d.type === 'story')
      .append('circle')
      .attr('class', 'story-halo')
      .attr('r', (d: any) => d.radius + 4)
      .attr('fill', 'none')
      .attr('stroke', (d: any) => d.color)
      .attr('stroke-opacity', 0)
      .attr('stroke-width', 2);

    // Story node main body
    node.filter((d: any) => d.type === 'story')
      .append('circle')
      .attr('class', 'story-circle')
      .attr('r', (d: any) => d.radius)
      .attr('fill', (d: any) => d.color)
      .attr('fill-opacity', 0.85)
      .attr('stroke', '#0A0A0C')
      .attr('stroke-width', 1.5);

    // Story node tiny core center point
    node.filter((d: any) => d.type === 'story')
      .append('circle')
      .attr('r', 2)
      .attr('fill', '#FFFFFF')
      .attr('fill-opacity', 0.9);

    // Hover & Click Handlers
    node.on('mouseenter', (event: any, d: any) => {
      setHoveredNode(d);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltipPos({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
      }

      // Highlight links connected to this node
      link
        .attr('stroke-opacity', (l: any) => {
          const sId = typeof l.source === 'object' ? l.source.id : l.source;
          const tId = typeof l.target === 'object' ? l.target.id : l.target;
          return sId === d.id || tId === d.id ? 0.9 : 0.08;
        })
        .attr('stroke-width', (l: any) => {
          const sId = typeof l.source === 'object' ? l.source.id : l.source;
          const tId = typeof l.target === 'object' ? l.target.id : l.target;
          return sId === d.id || tId === d.id ? 2.5 : 1;
        });

      // Expand hover halo
      d3.select(event.currentTarget as SVGGElement)
        .select('.story-halo')
        .transition()
        .duration(180)
        .attr('stroke-opacity', 0.8)
        .attr('r', (d as GraphNode).radius + 6);
    });

    node.on('mouseleave', (event: any, d: any) => {
      setHoveredNode(null);
      setTooltipPos(null);

      // Restore link opacity
      link
        .attr('stroke-opacity', (l: any) => (l.isCrossLink ? 0.12 : 0.28))
        .attr('stroke-width', (l: any) => (l.isCrossLink ? 1 : 1.5));

      d3.select(event.currentTarget as SVGGElement)
        .select('.story-halo')
        .transition()
        .duration(180)
        .attr('stroke-opacity', 0)
        .attr('r', (d as GraphNode).radius + 4);
    });

    node.on('click', (event: any, d: any) => {
      event.stopPropagation();
      setSelectedNode(d as GraphNode);
      if (d.type === 'category') {
        // If clicking category, zoom in on this category
        zoomToNode(d as GraphNode, 1.8);
      } else if (d.type === 'story') {
        zoomToNode(d as GraphNode, 2.2);
      }
    });

    // Drag behavior
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        if (d.type === 'category' && layoutMode === 'clusters') {
          // Keep category pinned if dragged in cluster mode
        } else {
          d.fx = null;
          d.fy = null;
        }
      });

    node.call(drag as any);

    // Click on canvas background to deselect
    svg.on('click', () => {
      setSelectedNode(null);
    });

    // Simulation Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x || 0)
        .attr('y1', (d: any) => d.source.y || 0)
        .attr('x2', (d: any) => d.target.x || 0)
        .attr('y2', (d: any) => d.target.y || 0);

      node.attr('transform', (d: any) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Helper: Zoom to specific node
    function zoomToNode(targetNode: GraphNode, scale = 2) {
      if (!targetNode.x || !targetNode.y || !zoomBehaviorRef.current || !svgRef.current) return;
      const t = d3.zoomIdentity
        .translate(width / 2 - targetNode.x * scale, height / 2 - targetNode.y * scale)
        .scale(scale);

      d3.select(svgRef.current)
        .transition()
        .duration(750)
        .call(zoomBehaviorRef.current.transform, t);
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, layoutMode, selectedCategory, selectedMoodFilter, searchQuery, lang, stories]);

  // Zoom control buttons
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.35);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.75);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(600).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    setSelectedNode(null);
  };

  return (
    <div
      id="story-graph"
      ref={containerRef}
      className={`relative w-full rounded-[28px] border border-white/10 bg-[#0C0C0F] text-[#F5F5F0] overflow-hidden transition-all duration-300 shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'min-h-[640px] md:h-[720px]'
      }`}
    >
      {/* Top Controls Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 backdrop-blur-md bg-[#0C0C0F]/85 border-b border-white/10 px-4 md:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Section Title & Eyebrow */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FF6B5B]/15 text-[#FF6B5B] grid place-items-center shrink-0 border border-[#FF6B5B]/30">
            <Network size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#FF6B5B] uppercase font-bold">
                {lang === 'en' ? 'Interactive Knowledge Graph' : 'इंटरैक्टिव नॉलेज ग्राफ'}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-mono">
                {stories.length} {lang === 'en' ? 'Stories Mapped' : 'कहानियाँ'}
              </span>
            </div>
            <h3 className="font-display text-[17px] text-white leading-tight">
              {lang === 'en' ? 'The Unspoken Constellation' : 'अनकही भावनाओं का नक्षत्र'}
            </h3>
          </div>
        </div>

        {/* Center: Search & Filters */}
        <div className="flex items-center gap-2 flex-1 max-w-md justify-center">
          <div className="relative w-full max-w-[240px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? 'Search stories or cities...' : 'कहानी या शहर खोजें...'}
              className="w-full h-8 pl-8 pr-3 rounded-full bg-white/5 border border-white/10 text-[11px] font-sans text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B5B]/50 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Layout Mode Toggle */}
          <div className="inline-flex rounded-full bg-white/5 p-0.5 border border-white/10 text-[11px] font-sans">
            <button
              onClick={() => setLayoutMode('clusters')}
              className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                layoutMode === 'clusters' ? 'bg-[#FF6B5B] text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
              title="Group stories tightly around Category Hubs"
            >
              <Compass size={12} />
              <span className="hidden sm:inline">{lang === 'en' ? 'Category Orbits' : 'कैटगरी समूह'}</span>
            </button>
            <button
              onClick={() => setLayoutMode('network')}
              className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                layoutMode === 'network' ? 'bg-[#FF6B5B] text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
              title="Free-floating interconnected theme mesh"
            >
              <Layers size={12} />
              <span className="hidden sm:inline">{lang === 'en' ? 'Theme Mesh' : 'थीम मेश'}</span>
            </button>
          </div>
        </div>

        {/* Right: Graph Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white grid place-items-center transition cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white grid place-items-center transition cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={handleResetZoom}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white grid place-items-center transition cursor-pointer"
            title="Reset view"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white grid place-items-center transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Category Pills Secondary Subheader */}
      <div className="absolute top-[61px] left-0 right-0 z-20 backdrop-blur-sm bg-[#0C0C0F]/60 px-4 md:px-6 py-2 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-sans border transition cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-white text-black border-white font-bold'
              : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
          }`}
        >
          <span>✨</span>
          <span>{lang === 'en' ? 'All Categories' : 'सभी श्रेणियां'}</span>
          <span className="text-[9px] font-mono opacity-60">({stories.length})</span>
        </button>

        {categoryStats.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-sans border transition cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? `${cat.bgClass} ${cat.borderClass} ${cat.textClass} font-bold shadow-sm`
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{lang === 'en' ? cat.shortName : cat.nameHi.split(' ')[0]}</span>
              <span
                className="text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold"
                style={{ backgroundColor: `${cat.color}25`, color: cat.color }}
              >
                {cat.storyCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* SVG Canvas for D3 Force Network */}
      <svg
        ref={svgRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating Hover Tooltip */}
      {hoveredNode && tooltipPos && (
        <div
          className="pointer-events-none absolute z-40 rounded-[14px] bg-[#141418]/95 backdrop-blur-md border border-white/15 p-3.5 shadow-2xl max-w-[280px] -translate-x-1/2 -translate-y-full -mt-3 text-left transition-all"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          {hoveredNode.type === 'category' ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{hoveredNode.category.icon}</span>
                <div>
                  <div className="font-display text-[14px] text-white">
                    {lang === 'en' ? hoveredNode.category.name : hoveredNode.category.nameHi}
                  </div>
                  <div className="text-[10px] font-mono text-white/50">
                    Category Hub • {categoryStats.find(c => c.id === hoveredNode.category.id)?.storyCount || 0} Stories
                  </div>
                </div>
              </div>
              <p className="font-sans text-[11px] text-white/70 mt-2 leading-relaxed">
                {lang === 'en' ? hoveredNode.category.description : hoveredNode.category.descriptionHi}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1">
                {hoveredNode.category.sampleThemeTags.map((tag, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full font-sans font-bold flex items-center gap-1"
                  style={{ backgroundColor: `${hoveredNode.category.color}25`, color: hoveredNode.category.color }}
                >
                  {hoveredNode.category.icon} {hoveredNode.category.shortName}
                </span>
                <span className="text-[10px] font-mono text-white/50 capitalize">
                  {hoveredNode.storyData?.mood}
                </span>
              </div>
              <h5 className="font-display text-[13px] text-white mt-1.5 leading-snug">
                {lang === 'en' ? hoveredNode.name : (hoveredNode.nameHi || hoveredNode.name)}
              </h5>
              {hoveredNode.storyData?.hook && (
                <p className="font-serif italic text-[11px] text-white/60 mt-1 line-clamp-2">
                  "{lang === 'en' ? hoveredNode.storyData.hook : (hoveredNode.storyData.hookHi || hoveredNode.storyData.hook)}"
                </p>
              )}
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
                <span>📍 {hoveredNode.storyData?.location || 'India'}</span>
                <span>👏 {hoveredNode.storyData?.claps || 42} claps</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Side Inspector Drawer (When Node is Clicked) */}
      {selectedNode && (
        <div className="absolute right-4 bottom-4 top-[105px] z-30 w-[320px] sm:w-[360px] rounded-[22px] bg-[#141418]/95 backdrop-blur-xl border border-white/15 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-200">
          <div>
            {/* Header with Close button */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedNode.category.icon}</span>
                <div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
                    style={{ backgroundColor: `${selectedNode.category.color}25`, color: selectedNode.category.color }}
                  >
                    {selectedNode.type === 'category' ? 'CATEGORY CLUSTER' : selectedNode.category.shortName}
                  </span>
                  <div className="font-mono text-[10px] text-white/40 mt-0.5">
                    {selectedNode.type === 'category'
                      ? `${stories.filter(s => getStoryCategory(s).id === selectedNode.category.id).length} Connected Stories`
                      : `Story Node • ${selectedNode.storyData?.location || 'India'}`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white grid place-items-center transition cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {selectedNode.type === 'category' ? (
              <div className="mt-4">
                <h4 className="font-display text-[20px] text-white leading-tight">
                  {lang === 'en' ? selectedNode.category.name : selectedNode.category.nameHi}
                </h4>
                <p className="font-sans text-[12px] text-white/70 mt-2 leading-relaxed">
                  {lang === 'en' ? selectedNode.category.description : selectedNode.category.descriptionHi}
                </p>

                {/* Category stats breakdown */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-[14px] bg-white/5 p-3 border border-white/5">
                    <div className="text-[10px] font-mono text-white/50 uppercase">Voice Share</div>
                    <div className="font-display text-[18px] text-white mt-0.5">
                      {categoryStats.find(c => c.id === selectedNode.category.id)?.percentage || 0}%
                    </div>
                  </div>
                  <div className="rounded-[14px] bg-white/5 p-3 border border-white/5">
                    <div className="text-[10px] font-mono text-white/50 uppercase">Dominant Mood</div>
                    <div className="font-display text-[14px] text-white mt-1 capitalize flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: MOOD_HEX_MAP[categoryStats.find(c => c.id === selectedNode.category.id)?.topMood || 'burnout'] }}
                      />
                      {categoryStats.find(c => c.id === selectedNode.category.id)?.topMood || 'burnout'}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-[11px] font-sans font-bold text-white/80 mb-2">Core Life Tensions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.category.sampleThemeTags.map((tag, i) => (
                      <span key={i} className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-white/10 text-white/80">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCategory(selectedNode.category.id)}
                  className="mt-5 w-full py-2.5 rounded-full font-sans text-[12px] font-bold text-black transition cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: selectedNode.category.color }}
                >
                  <Filter size={13} />
                  <span>{lang === 'en' ? 'Filter Graph to this Category' : 'इस कैटगरी को फ़िल्टर करें'}</span>
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <h4 className="font-display text-[18px] text-white leading-snug">
                  {lang === 'en' ? selectedNode.name : (selectedNode.nameHi || selectedNode.name)}
                </h4>

                {selectedNode.storyData?.hook && (
                  <blockquote className="font-serif italic text-[12px] text-white/70 mt-2 pl-3 border-l-2 border-[#FF6B5B] leading-relaxed">
                    "{lang === 'en' ? selectedNode.storyData.hook : (selectedNode.storyData.hookHi || selectedNode.storyData.hook)}"
                  </blockquote>
                )}

                {/* Structured narrative excerpt */}
                {selectedNode.storyData?.structured && (
                  <div className="mt-4 space-y-2 text-[11px] font-sans">
                    <div className="rounded-[12px] bg-white/5 p-2.5 border border-white/5">
                      <span className="font-bold text-[#FF6B5B] block mb-0.5">Setting & People</span>
                      <span className="text-white/80">
                        {selectedNode.storyData.structured.setting} • {selectedNode.storyData.structured.people}
                      </span>
                    </div>

                    <div className="rounded-[12px] bg-white/5 p-2.5 border border-white/5">
                      <span className="font-bold text-[#FFD166] block mb-0.5">Turning Point</span>
                      <span className="text-white/80">
                        {selectedNode.storyData.structured.turning}
                      </span>
                    </div>

                    <div className="rounded-[12px] bg-white/5 p-2.5 border border-white/5">
                      <span className="font-bold text-[#25D366] block mb-0.5">Core Realization</span>
                      <span className="text-white/80">
                        {selectedNode.storyData.structured.insight}
                      </span>
                    </div>
                  </div>
                )}

                {/* Story metadata tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    📍 {selectedNode.storyData?.location}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    👤 {selectedNode.storyData?.author?.split('•')[0] || 'Anonymous'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    👏 {selectedNode.storyData?.claps}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer Button */}
          {selectedNode.type === 'story' && selectedNode.storyData && (
            <div className="mt-5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  if (selectedNode.storyData) {
                    onOpenStory(selectedNode.storyData);
                  }
                }}
                className="w-full py-2.5 rounded-full bg-[#FF6B5B] hover:brightness-110 text-black font-sans text-[12px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg"
              >
                <BookOpen size={14} />
                <span>{lang === 'en' ? 'Read Complete Story' : 'पूरी कहानी पढ़ें'}</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Hint / Legend Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-2 text-[11px] font-sans text-white/50">
        <div className="pointer-events-auto bg-[#0C0C0F]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#06B6D4] bg-[#141418]" />
            <span>{lang === 'en' ? 'Large Node = Category Hub' : 'बड़ा नोड = श्रेणी'}</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6B5B]" />
            <span>{lang === 'en' ? 'Dots = Stories (Drag / Click to inspect)' : 'छोटे बिंदु = कहानियां'}</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="hidden sm:inline text-white/40">
            {lang === 'en' ? 'Scroll to zoom • Drag to pan' : 'ज़ूम के लिए स्क्रॉल करें'}
          </span>
        </div>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="pointer-events-auto text-[11px] text-[#FF6B5B] hover:underline bg-[#0C0C0F]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1 cursor-pointer"
          >
            <X size={12} /> {lang === 'en' ? 'Clear category filter' : 'फ़िल्टर हटाएं'}
          </button>
        )}
      </div>
    </div>
  );
};
