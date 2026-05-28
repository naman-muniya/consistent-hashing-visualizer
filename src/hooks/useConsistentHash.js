import { useState, useCallback, useMemo } from 'react';
import { hash, hashToAngle, generateNodeColor, generateRandomKey } from '../utils/hash';

export function useConsistentHash(initialVirtualNodes = 1) {
  const [nodes, setNodes] = useState([]);
  const [keys, setKeys] = useState([]);
  const [virtualNodeCount, setVirtualNodeCount] = useState(initialVirtualNodes);
  const [showVirtualNodes, setShowVirtualNodes] = useState(true);
  const [nodeCounter, setNodeCounter] = useState(0);

  // Generate virtual nodes for all physical nodes
  const virtualNodes = useMemo(() => {
    const vnodes = [];
    nodes.forEach((node) => {
      for (let i = 0; i < virtualNodeCount; i++) {
        const vnodeId = `${node.id}-vn${i}`;
        const hashValue = hash(vnodeId);
        vnodes.push({
          id: vnodeId,
          physicalNodeId: node.id,
          physicalNodeName: node.name,
          color: node.color,
          hashValue,
          angle: hashToAngle(hashValue),
          virtualIndex: i,
        });
      }
    });
    return vnodes.sort((a, b) => a.hashValue - b.hashValue);
  }, [nodes, virtualNodeCount]);

  // Map keys to nodes using consistent hashing (clockwise lookup)
  const keyMappings = useMemo(() => {
    if (virtualNodes.length === 0) {
      return keys.map((key) => ({ ...key, assignedNode: null }));
    }

    return keys.map((key) => {
      const keyHash = hash(key.id);
      // Find the first virtual node with hash >= key hash (clockwise)
      let assignedVNode = virtualNodes.find((vn) => vn.hashValue >= keyHash);
      // If no node found (wrap around), use the first node
      if (!assignedVNode) {
        assignedVNode = virtualNodes[0];
      }
      return {
        ...key,
        hashValue: keyHash,
        angle: hashToAngle(keyHash),
        assignedNode: assignedVNode ? assignedVNode.physicalNodeId : null,
        assignedNodeName: assignedVNode ? assignedVNode.physicalNodeName : null,
        assignedNodeColor: assignedVNode ? assignedVNode.color : null,
        assignedVNodeAngle: assignedVNode ? assignedVNode.angle : null,
      };
    });
  }, [keys, virtualNodes]);

  // Calculate statistics
  const stats = useMemo(() => {
    const distribution = {};
    nodes.forEach((node) => {
      distribution[node.id] = { node, count: 0, keys: [] };
    });

    keyMappings.forEach((km) => {
      if (km.assignedNode && distribution[km.assignedNode]) {
        distribution[km.assignedNode].count++;
        distribution[km.assignedNode].keys.push(km.id);
      }
    });

    const counts = Object.values(distribution).map((d) => d.count);
    const total = counts.reduce((a, b) => a + b, 0);
    const mean = counts.length > 0 ? total / counts.length : 0;
    const variance =
      counts.length > 0
        ? counts.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / counts.length
        : 0;
    const stdDev = Math.sqrt(variance);

    return {
      distribution,
      total,
      mean,
      stdDev,
      balanceScore: mean > 0 ? Math.max(0, 100 - (stdDev / mean) * 100) : 100,
    };
  }, [nodes, keyMappings]);

  // Add a new physical node
  const addNode = useCallback(() => {
    const newNodeIndex = nodeCounter;
    setNodeCounter((c) => c + 1);
    // Generate a unique hash salt for better ring distribution
    const hashSalt = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const newNode = {
      id: `node-${hashSalt}`,
      name: `Node ${String.fromCharCode(65 + (newNodeIndex % 26))}${Math.floor(newNodeIndex / 26) || ''}`,
      color: generateNodeColor(newNodeIndex),
      createdAt: Date.now(),
    };
    setNodes((prev) => [...prev, newNode]);
    return newNode;
  }, [nodeCounter]);

  // Remove a physical node
  const removeNode = useCallback((nodeId) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
  }, []);

  // Add a single key
  const addKey = useCallback((keyName) => {
    const newKey = {
      id: keyName || generateRandomKey(),
      createdAt: Date.now(),
    };
    setKeys((prev) => [...prev, newKey]);
    return newKey;
  }, []);

  // Add multiple random keys
  const addBulkKeys = useCallback((count) => {
    const newKeys = Array.from({ length: count }, (_, i) => ({
      id: generateRandomKey(`key${keys.length + i}`),
      createdAt: Date.now() + i,
    }));
    setKeys((prev) => [...prev, ...newKeys]);
  }, [keys.length]);

  // Remove a key
  const removeKey = useCallback((keyId) => {
    setKeys((prev) => prev.filter((k) => k.id !== keyId));
  }, []);

  // Clear all keys
  const clearKeys = useCallback(() => {
    setKeys([]);
  }, []);

  // Clear all nodes
  const clearNodes = useCallback(() => {
    setNodes([]);
    setNodeCounter(0);
  }, []);

  // Reset everything
  const reset = useCallback(() => {
    setNodes([]);
    setKeys([]);
    setNodeCounter(0);
    setVirtualNodeCount(1);
  }, []);

  return {
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
  };
}
