import React from 'react';
import { Eye, EyeOff, RotateCcw, CircleDot } from 'lucide-react';

export function Controls({
  virtualNodeCount,
  showVirtualNodes,
  onVirtualNodeCountChange,
  onToggleVirtualNodes,
  onReset,
  totalVirtualNodes,
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-4">
      <div className="flex flex-wrap items-center gap-6">
        {/* Virtual nodes slider */}
        <div className="flex-1 min-w-[250px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CircleDot className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">Virtual Nodes per Physical Node</span>
            </div>
            <span className="text-sm font-bold text-purple-400">{virtualNodeCount}</span>
          </div>
          <input
            type="range"
            min="1"
            max="500"
            value={virtualNodeCount}
            onChange={(e) => onVirtualNodeCountChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1</span>
            <span>Total: {totalVirtualNodes} virtual nodes</span>
            <span>500</span>
          </div>
        </div>

        {/* Toggle virtual nodes visibility */}
        <button
          onClick={onToggleVirtualNodes}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showVirtualNodes
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
        >
          {showVirtualNodes ? (
            <>
              <Eye className="w-4 h-4" />
              <span className="text-sm">Virtual Nodes Visible</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="text-sm">Virtual Nodes Hidden</span>
            </>
          )}
        </button>

        {/* Reset button */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reset All</span>
        </button>
      </div>
    </div>
  );
}
