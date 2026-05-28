import React from 'react';
import { BarChart3, Activity, Scale } from 'lucide-react';

export function StatsPanel({ stats, nodes }) {
  const { distribution, total, mean, stdDev, balanceScore } = stats;

  const getBalanceColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBalanceLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-green-400" />
        <h2 className="font-semibold text-white">Distribution Statistics</h2>
      </div>

      {nodes.length === 0 || total === 0 ? (
        <div className="text-slate-500 text-sm text-center py-4">
          Add nodes and keys to see distribution statistics.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Total Keys</div>
              <div className="text-xl font-bold text-white">{total}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Avg per Node</div>
              <div className="text-xl font-bold text-white">{mean.toFixed(1)}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Std Deviation</div>
              <div className="text-xl font-bold text-white">{stdDev.toFixed(2)}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                <Scale className="w-3 h-3" />
                Balance Score
              </div>
              <div className={`text-xl font-bold ${getBalanceColor(balanceScore)}`}>
                {balanceScore.toFixed(0)}%
                <span className="text-xs font-normal ml-1">
                  ({getBalanceLabel(balanceScore)})
                </span>
              </div>
            </div>
          </div>

          {/* Distribution bar chart */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Activity className="w-3 h-3" />
              Keys per Node
            </div>
            <div className="space-y-2">
              {Object.values(distribution).map(({ node, count }) => {
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const idealPercentage = 100 / nodes.length;
                const deviation = Math.abs(percentage - idealPercentage);
                
                return (
                  <div key={node.id} className="flex items-center gap-3">
                    <div className="w-20 flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: node.color }}
                      />
                      <span className="text-sm text-slate-300 truncate">{node.name}</span>
                    </div>
                    <div className="flex-1 h-6 bg-slate-700 rounded overflow-hidden relative">
                      <div
                        className="h-full transition-all duration-500 flex items-center"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: node.color,
                        }}
                      >
                        <span className="text-xs text-white font-medium px-2 whitespace-nowrap">
                          {count}
                        </span>
                      </div>
                      {/* Ideal line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white/30"
                        style={{ left: `${idealPercentage}%` }}
                        title={`Ideal: ${idealPercentage.toFixed(1)}%`}
                      />
                    </div>
                    <div className="w-28 text-right flex-shrink-0">
                      <div className="text-xs text-slate-400">{percentage.toFixed(1)}%</div>
                      {deviation > 5 && (
                        <div className={`text-xs ${deviation > 10 ? 'text-red-400' : 'text-yellow-400'}`}>
                          ({percentage > idealPercentage ? '+' : ''}{(percentage - idealPercentage).toFixed(1)})
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-slate-500 text-center mt-2">
              White line indicates ideal distribution ({(100 / nodes.length).toFixed(1)}% per node)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
