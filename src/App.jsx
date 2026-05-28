import React, { useState } from 'react';
import { HashRing } from './components/HashRing';
import { NodePanel } from './components/NodePanel';
import { KeyPanel } from './components/KeyPanel';
import { Controls } from './components/Controls';
import { StatsPanel } from './components/StatsPanel';
import { DemoMode } from './components/DemoMode';
import { useConsistentHash } from './hooks/useConsistentHash';
import { CircleDot } from 'lucide-react';

function App() {
  const {
    nodes,
    keys,
    virtualNodes,
    keyMappings,
    virtualNodeCount,
    showVirtualNodes,
    stats,
    setVirtualNodeCount,
    setShowVirtualNodes,
    addNode,
    removeNode,
    addKey,
    addBulkKeys,
    removeKey,
    clearKeys,
    clearNodes,
    reset,
  } = useConsistentHash();

  const [demoActive, setDemoActive] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <CircleDot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Consistent Hashing Visualizer</h1>
                <p className="text-xs text-slate-400">Interactive visualization with virtual nodes</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <DemoMode
                onAddNode={addNode}
                onRemoveNode={removeNode}
                onAddBulkKeys={addBulkKeys}
                onSetVirtualNodeCount={setVirtualNodeCount}
                onReset={reset}
                nodes={nodes}
                isActive={demoActive}
                onToggleActive={() => setDemoActive(!demoActive)}
              />
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>{nodes.length} Nodes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>{keys.length} Keys</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>{virtualNodes.length} Virtual Nodes</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Left panel - Nodes */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <NodePanel
                nodes={nodes}
                stats={stats}
                onAddNode={addNode}
                onRemoveNode={removeNode}
                onClearNodes={clearNodes}
              />
            </div>
          </div>

          {/* Center - Hash Ring */}
          <div className="col-span-12 md:col-span-6 lg:col-span-8">
            <div className="space-y-4">
              {/* Hash Ring Visualization */}
              <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-6 flex items-center justify-center min-h-[520px]">
                <HashRing
                  virtualNodes={virtualNodes}
                  keyMappings={keyMappings}
                  nodes={nodes}
                  showVirtualNodes={showVirtualNodes}
                  size={480}
                />
              </div>

              {/* Controls */}
              <Controls
                virtualNodeCount={virtualNodeCount}
                showVirtualNodes={showVirtualNodes}
                onVirtualNodeCountChange={setVirtualNodeCount}
                onToggleVirtualNodes={() => setShowVirtualNodes(!showVirtualNodes)}
                onReset={reset}
                totalVirtualNodes={virtualNodes.length}
              />

              {/* Stats */}
              <StatsPanel stats={stats} nodes={nodes} />
            </div>
          </div>

          {/* Right panel - Keys */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <KeyPanel
                keyMappings={keyMappings}
                onAddKey={addKey}
                onAddBulkKeys={addBulkKeys}
                onRemoveKey={removeKey}
                onClearKeys={clearKeys}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/30 border-t border-slate-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-center text-xs text-slate-500">
            <p className="mb-2">
              <strong className="text-slate-400">How it works:</strong> Keys are hashed and placed on the ring. 
              Each key is assigned to the first node found clockwise from its position.
            </p>
            <p>
              Virtual nodes distribute each physical node across multiple points on the ring, 
              improving load balance and reducing hotspots during node changes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
