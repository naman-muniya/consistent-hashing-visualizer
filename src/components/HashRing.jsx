import React, { useMemo, useState } from 'react';
import { angleToPosition, hash, hashToAngle } from '../utils/hash';

export function HashRing({
  virtualNodes,
  keyMappings,
  nodes,
  showVirtualNodes,
  size = 500,
}) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  const center = size / 2;
  const ringRadius = size * 0.38;
  const nodeRadius = size * 0.42;
  const keyRadius = size * 0.32;

  // Get unique virtual node positions (sample for display to avoid clutter)
  const displayVirtualNodes = useMemo(() => {
    if (!showVirtualNodes || virtualNodes.length === 0) return [];
    
    // If too many virtual nodes, sample them evenly
    const maxDisplay = 100;
    if (virtualNodes.length <= maxDisplay) return virtualNodes;
    
    const step = Math.ceil(virtualNodes.length / maxDisplay);
    return virtualNodes.filter((_, i) => i % step === 0);
  }, [virtualNodes, showVirtualNodes]);

  // Get physical node positions - use hash of node name for fixed position
  const physicalNodePositions = useMemo(() => {
    const positions = {};
    nodes.forEach((node) => {
      // Hash the node name with a salt for better distribution
      const nodeHash = hash(`physical_${node.name}_${node.id}_position`);
      const angle = hashToAngle(nodeHash);
      positions[node.id] = {
        ...node,
        angle,
        ...angleToPosition(angle, nodeRadius, center, center),
      };
    });
    return positions;
  }, [nodes, nodeRadius, center]);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="drop-shadow-2xl"
        style={{ overflow: 'visible' }}
      >
        {/* Background glow */}
        <defs>
          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow background */}
        <circle cx={center} cy={center} r={ringRadius + 30} fill="url(#ringGlow)" />

        {/* Main ring */}
        <circle
          cx={center}
          cy={center}
          r={ringRadius}
          fill="none"
          stroke="#334155"
          strokeWidth="3"
          className="transition-all duration-300"
        />

        {/* Tick marks for hash space */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15);
          const innerPos = angleToPosition(angle, ringRadius - 8, center, center);
          const outerPos = angleToPosition(angle, ringRadius + 8, center, center);
          return (
            <line
              key={`tick-${i}`}
              x1={innerPos.x}
              y1={innerPos.y}
              x2={outerPos.x}
              y2={outerPos.y}
              stroke="#475569"
              strokeWidth={i % 6 === 0 ? 2 : 1}
              opacity={i % 6 === 0 ? 0.8 : 0.4}
            />
          );
        })}

        {/* Connection lines from keys to assigned virtual nodes */}
        {keyMappings.map((km) => {
          if (!km.assignedNode) return null;
          const keyPos = angleToPosition(km.angle, keyRadius, center, center);
          const vnodePos = angleToPosition(km.assignedVNodeAngle, ringRadius, center, center);
          const isSelected = selectedKey === km.id;
          
          return (
            <line
              key={`conn-${km.id}`}
              x1={keyPos.x}
              y1={keyPos.y}
              x2={vnodePos.x}
              y2={vnodePos.y}
              stroke={km.assignedNodeColor}
              strokeWidth={isSelected ? 2 : 1}
              opacity={isSelected ? 0.8 : 0.2}
              strokeDasharray={isSelected ? "none" : "4,4"}
              className="transition-all duration-200"
            />
          );
        })}

        {/* Virtual nodes on the ring */}
        {displayVirtualNodes.map((vnode) => {
          const pos = angleToPosition(vnode.angle, ringRadius, center, center);
          const isHovered = hoveredItem?.id === vnode.physicalNodeId;
          
          return (
            <circle
              key={vnode.id}
              cx={pos.x}
              cy={pos.y}
              r={isHovered ? 5 : 3}
              fill={vnode.color}
              opacity={isHovered ? 1 : 0.6}
              className="transition-all duration-200"
              onMouseEnter={() => setHoveredItem({ type: 'vnode', id: vnode.physicalNodeId, data: vnode })}
              onMouseLeave={() => setHoveredItem(null)}
            />
          );
        })}

        {/* Keys inside the ring */}
        {keyMappings.map((km) => {
          const pos = angleToPosition(km.angle, keyRadius, center, center);
          const isSelected = selectedKey === km.id;
          
          return (
            <g key={km.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 8 : 6}
                fill={km.assignedNodeColor || '#64748b'}
                stroke={isSelected ? '#fff' : 'none'}
                strokeWidth={2}
                opacity={isSelected ? 1 : 0.8}
                className="cursor-pointer transition-all duration-200"
                filter={isSelected ? "url(#glow)" : "none"}
                onMouseEnter={() => {
                  setHoveredItem({ type: 'key', id: km.id, data: km });
                  setSelectedKey(km.id);
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setSelectedKey(null);
                }}
              />
            </g>
          );
        })}

        {/* Physical node labels */}
        {Object.values(physicalNodePositions).map((node) => {
          const labelPos = angleToPosition(node.angle, nodeRadius + 25, center, center);
          
          return (
            <g key={`label-${node.id}`}>
              <circle
                cx={labelPos.x}
                cy={labelPos.y}
                r={16}
                fill={node.color}
                className="transition-all duration-300"
                filter="url(#glow)"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="11"
                fontWeight="bold"
              >
                {node.name.replace('Node ', '')}
              </text>
            </g>
          );
        })}

        {/* Center info */}
        <text
          x={center}
          y={center - 15}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="12"
        >
          Hash Ring
        </text>
        <text
          x={center}
          y={center + 5}
          textAnchor="middle"
          fill="#e2e8f0"
          fontSize="20"
          fontWeight="bold"
        >
          {keyMappings.length}
        </text>
        <text
          x={center}
          y={center + 22}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="11"
        >
          keys
        </text>
      </svg>

      {/* Tooltip */}
      {hoveredItem && (
        <div
          className="absolute bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm shadow-xl z-50 pointer-events-none"
          style={{
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {hoveredItem.type === 'key' && (
            <div>
              <div className="font-semibold text-white">{hoveredItem.data.id}</div>
              <div className="text-slate-400 text-xs mt-1">
                Hash: {hoveredItem.data.hashValue?.toLocaleString()}
              </div>
              <div className="text-slate-400 text-xs">
                Angle: {hoveredItem.data.angle?.toFixed(2)}°
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-slate-400 text-xs">Assigned to:</span>
                <span
                  className="text-xs font-medium"
                  style={{ color: hoveredItem.data.assignedNodeColor }}
                >
                  {hoveredItem.data.assignedNodeName || 'None'}
                </span>
              </div>
            </div>
          )}
          {hoveredItem.type === 'vnode' && (
            <div>
              <div className="font-semibold" style={{ color: hoveredItem.data.color }}>
                {hoveredItem.data.physicalNodeName}
              </div>
              <div className="text-slate-400 text-xs mt-1">
                Virtual Node #{hoveredItem.data.virtualIndex}
              </div>
              <div className="text-slate-400 text-xs">
                Hash: {hoveredItem.data.hashValue?.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
