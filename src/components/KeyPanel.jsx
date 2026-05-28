import React, { useState } from 'react';
import { Plus, Trash2, Key, X, Layers } from 'lucide-react';

export function KeyPanel({
  keyMappings,
  onAddKey,
  onAddBulkKeys,
  onRemoveKey,
  onClearKeys,
}) {
  const [newKeyName, setNewKeyName] = useState('');

  const handleAddKey = (e) => {
    e.preventDefault();
    if (newKeyName.trim()) {
      onAddKey(newKeyName.trim());
      setNewKeyName('');
    } else {
      onAddKey();
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-400" />
          <h2 className="font-semibold text-white">Keys</h2>
          <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full">
            {keyMappings.length}
          </span>
        </div>
        {keyMappings.length > 0 && (
          <button
            onClick={onClearKeys}
            className="text-slate-400 hover:text-red-400 transition-colors p-1"
            title="Clear all keys"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Add single key */}
      <form onSubmit={handleAddKey} className="flex gap-2 mb-3">
        <input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="Key name (optional)"
          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
        />
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-lg transition-colors"
          title="Add key"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* Bulk add buttons */}
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-400">Bulk:</span>
        {[10, 50, 100].map((count) => (
          <button
            key={count}
            onClick={() => onAddBulkKeys(count)}
            className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-2 py-1 rounded transition-colors"
          >
            +{count}
          </button>
        ))}
      </div>

      {/* Key list */}
      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
        {keyMappings.length === 0 ? (
          <div className="text-slate-500 text-sm text-center py-8">
            No keys added yet.
            <br />
            <span className="text-xs">Add keys to see distribution.</span>
          </div>
        ) : (
          keyMappings.map((km) => (
            <div
              key={km.id}
              className="bg-slate-700/30 rounded-lg px-3 py-2 group hover:bg-slate-700/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: km.assignedNodeColor || '#64748b' }}
                />
                <span className="text-sm text-slate-300 truncate">{km.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-medium flex-shrink-0"
                  style={{ color: km.assignedNodeColor || '#64748b' }}
                >
                  {km.assignedNodeName || 'None'}
                </span>
                <button
                  onClick={() => onRemoveKey(km.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all p-0.5"
                  title="Remove key"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
