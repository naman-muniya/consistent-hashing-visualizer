import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Zap, AlertCircle } from 'lucide-react';

const DEMO_STEPS = [
  // Part 1: Setup - The Basics
  { 
    action: 'message', 
    delay: 2500, 
    title: '📚 Part 1: The Basics',
    description: 'Let\'s start by setting up a simple distributed system with 3 servers.',
    highlight: true 
  },
  { action: 'addNode', delay: 1000, description: 'Adding Server A to the hash ring...' },
  { action: 'addNode', delay: 1000, description: 'Adding Server B to the hash ring...' },
  { action: 'addNode', delay: 1000, description: 'Adding Server C to the hash ring...' },
  { action: 'addKeys', count: 50, delay: 1500, description: 'Adding 50 keys (like cache entries or data shards)...' },
  { 
    action: 'message', 
    delay: 3000, 
    title: '✅ Initial Setup Complete',
    description: 'Notice: ~17 keys per server. Each key is assigned to the first server found clockwise from its position.',
    highlight: false 
  },

  // Part 2: The Key Insight - Adding a Node
  { 
    action: 'message', 
    delay: 3000, 
    title: '📚 Part 2: Adding a Server',
    description: 'Now watch what happens when we add a 4th server. In traditional hashing, ALL keys would remap!',
    highlight: true 
  },
  { action: 'addNode', delay: 2000, description: '➕ Adding Server D... Watch which keys move!' },
  { 
    action: 'message', 
    delay: 4000, 
    title: '🎯 Key Insight!',
    description: 'Only ~25% of keys moved (those between D and the next server). In traditional hash(key) % N, adding a server would remap almost ALL keys!',
    highlight: true 
  },

  // Part 3: Node Failure - Removing a Node  
  { 
    action: 'message', 
    delay: 3000, 
    title: '📚 Part 3: Server Failure',
    description: 'What if Server B crashes? Let\'s simulate a server going offline.',
    highlight: true 
  },
  { action: 'removeNode', index: 1, delay: 2000, description: '💥 Server B failed! Removing from ring...' },
  { 
    action: 'message', 
    delay: 4000, 
    title: '🛡️ Graceful Degradation!',
    description: 'Only Server B\'s keys moved to the next server clockwise. Other servers are completely unaffected - no cache stampede!',
    highlight: true 
  },

  // Part 4: Virtual Nodes Impact
  { 
    action: 'message', 
    delay: 3000, 
    title: '📚 Part 4: Virtual Nodes',
    description: 'Now let\'s see why virtual nodes matter for load balancing.',
    highlight: true 
  },
  { action: 'adjustVNodes', value: 1, delay: 2000, description: 'Setting virtual nodes to 1 (no virtual nodes)...' },
  { action: 'addKeys', count: 50, delay: 1500, description: 'Adding 50 more keys to see the imbalance...' },
  { 
    action: 'message', 
    delay: 3500, 
    title: '⚠️ Poor Balance!',
    description: 'With only 1 virtual node per server, distribution is uneven. Some servers may have 2-3x more keys than others!',
    highlight: true 
  },
  { action: 'adjustVNodes', value: 150, delay: 2000, description: 'Increasing to 150 virtual nodes per server...' },
  { 
    action: 'message', 
    delay: 4000, 
    title: '✨ Much Better Balance!',
    description: 'With 150 virtual nodes, each server is spread across the ring, resulting in near-equal distribution. This is the standard in production systems!',
    highlight: true 
  },

  // Conclusion
  { 
    action: 'message', 
    delay: 5000, 
    title: '🎓 Demo Complete!',
    description: 'Key takeaways: 1) Minimal key movement on changes, 2) Graceful failure handling, 3) Virtual nodes improve balance. Try experimenting yourself!',
    highlight: true 
  },
];

export function DemoMode({
  onAddNode,
  onRemoveNode,
  onAddBulkKeys,
  onSetVirtualNodeCount,
  onReset,
  nodes,
  isActive,
  onToggleActive,
}) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepTitle, setStepTitle] = useState('');
  const [stepDescription, setStepDescription] = useState('');
  const [isHighlight, setIsHighlight] = useState(false);
  const timeoutRef = useRef(null);

  const executeStep = (stepIndex) => {
    if (stepIndex >= DEMO_STEPS.length) {
      setIsPlaying(false);
      setCurrentStep(-1);
      setStepTitle('');
      setStepDescription('Demo complete! Try experimenting yourself.');
      setIsHighlight(false);
      return;
    }

    const step = DEMO_STEPS[stepIndex];
    setCurrentStep(stepIndex);
    setStepTitle(step.title || '');
    setStepDescription(step.description);
    setIsHighlight(step.highlight || false);

    switch (step.action) {
      case 'addNode':
        onAddNode();
        break;
      case 'removeNode':
        if (nodes.length > step.index) {
          onRemoveNode(nodes[step.index].id);
        }
        break;
      case 'addKeys':
        onAddBulkKeys(step.count);
        break;
      case 'adjustVNodes':
        onSetVirtualNodeCount(step.value);
        break;
      case 'message':
        // Just display the message, no action needed
        break;
    }

    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        executeStep(stepIndex + 1);
      }, step.delay);
    }
  };

  useEffect(() => {
    if (isPlaying && currentStep === -1) {
      onReset();
      setTimeout(() => executeStep(0), 500);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      setIsPlaying(true);
      if (currentStep >= 0) {
        executeStep(currentStep + 1);
      }
    }
  };

  const handleSkip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (currentStep < DEMO_STEPS.length - 1) {
      executeStep(currentStep + 1);
    }
  };

  const handleRestart = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsPlaying(false);
    setCurrentStep(-1);
    setStepTitle('');
    setStepDescription('');
    setIsHighlight(false);
    onReset();
  };

  if (!isActive) {
    return (
      <button
        onClick={onToggleActive}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/25"
      >
        <Zap className="w-4 h-4" />
        <span className="text-sm font-medium">Demo Mode</span>
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 backdrop-blur rounded-xl border border-emerald-700/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-white">Demo Mode</h3>
          {isPlaying && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Running
            </span>
          )}
        </div>
        <button
          onClick={onToggleActive}
          className="text-slate-400 hover:text-white text-xs transition-colors"
        >
          Exit Demo
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-700 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / DEMO_STEPS.length) * 100}%`,
          }}
        />
      </div>

      {/* Step title and description */}
      <div className={`mb-3 min-h-[40px] p-2 rounded-lg transition-all duration-300 ${
        isHighlight 
          ? 'bg-emerald-800/50 border border-emerald-600/50' 
          : ''
      }`}>
        {stepTitle && (
          <div className="font-semibold text-white text-sm mb-1">{stepTitle}</div>
        )}
        <div className="text-sm text-emerald-200">
          {stepDescription || 'Click Play to start the educational demo'}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePlayPause}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span className="text-sm">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span className="text-sm">{currentStep >= 0 ? 'Resume' : 'Play'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleSkip}
          disabled={currentStep >= DEMO_STEPS.length - 1}
          className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors"
        >
          <SkipForward className="w-4 h-4" />
          <span className="text-sm">Skip</span>
        </button>

        <button
          onClick={handleRestart}
          className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Restart</span>
        </button>

        <div className="ml-auto text-xs text-slate-400">
          Step {Math.max(0, currentStep + 1)} / {DEMO_STEPS.length}
        </div>
      </div>
    </div>
  );
}
