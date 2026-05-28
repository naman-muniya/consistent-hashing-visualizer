import React from 'react';
import { Plus, Trash2, Server, X } from 'lucide-react';

export function NodePanel({ nodes, stats, onAddNode, onRemoveNode, onClearNodes }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-white">Nodes</h2>
          <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full">
            {nodes.length}
          </span>
        </div>
        {nodes.length > 0 && (
          <button
            onClick={onClearNodes}
            className="text-slate-400 hover:text-red-400 transition-colors p-1"
            title="Clear all nodes"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <button
        onClick={onAddNode}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-lg transition-colors font-medium mb-4"
      >
        <Plus className="w-4 h-4" />
        Add Node
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {nodes.length === 0 ? (
          <div className="text-slate-500 text-sm text-center py-8">
            No nodes added yet.
            <br />
            <span className="text-xs">Click "Add Node" to get started.</span>
          </div>
        ) : (
          nodes.map((node) => {
            const nodeStats = stats.distribution[node.id];
            const keyCount = nodeStats?.count || 0;
            const percentage = stats.total > 0 ? ((keyCount / stats.total) * 100).toFixed(1) : 0;

            return (
              <div
                key={node.id}
                className="bg-slate-700/50 rounded-lg p-3 group hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                    <span className="font-medium text-white">{node.name}</span>
                  </div>
                  <button
                    onClick={() => onRemoveNode(node.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all p-1"
                    title="Remove node"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{keyCount} keys</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: node.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
