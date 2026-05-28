/**
 * cyrb53 hash - excellent distribution, fast, and collision resistant
 * Returns a number between 0 and MAX_HASH
 */
export const MAX_HASH = 2 ** 32 - 1;

export function hash(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x85ebca77);
    h2 = Math.imul(h2 ^ ch, 0xc2b2ae3d);
  }
  
  h1 ^= Math.imul(h1 ^ (h2 >>> 15), 0x735a2d97);
  h2 ^= Math.imul(h2 ^ (h1 >>> 15), 0xcaf649a9);
  h1 ^= h2 >>> 16;
  h2 ^= h1 >>> 16;
  
  // Return full 32-bit range
  return (2097152 * (h2 >>> 0) + (h1 >>> 11)) % MAX_HASH;
}

/**
 * Convert hash value to angle in degrees (0-360)
 */
export function hashToAngle(hashValue) {
  return (hashValue / MAX_HASH) * 360;
}

/**
 * Convert angle to position on a circle
 */
export function angleToPosition(angle, radius, centerX, centerY) {
  const radians = ((angle - 90) * Math.PI) / 180; // Start from top
  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
  };
}

/**
 * Generate a random string for key generation
 */
export function generateRandomKey(prefix = 'key') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a unique color based on index
 */
export function generateNodeColor(index) {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#22c55e', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#84cc16', // lime
    '#6366f1', // indigo
  ];
  return colors[index % colors.length];
}
