# Consistent Hashing with Virtual Nodes Visualizer

An interactive web application that visualizes how consistent hashing works with virtual nodes.

## Features

- **Interactive Hash Ring**: Visual representation of the hash ring with nodes and keys
- **Node Management**: Add/remove physical nodes and see how keys redistribute
- **Key Management**: Add single keys or bulk add (10, 50, 100 keys at once)
- **Virtual Nodes**: Adjust the number of virtual nodes per physical node (1-500)
- **Toggle Visibility**: Show/hide virtual nodes on the ring
- **Live Statistics**: See key distribution, balance score, and deviation metrics

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## How Consistent Hashing Works

1. **Hash Ring**: The hash space is visualized as a circle (0 to 2^32)
2. **Nodes**: Physical servers are placed on the ring at positions determined by their hash
3. **Virtual Nodes**: Each physical node has multiple virtual nodes spread across the ring
4. **Key Assignment**: Keys are hashed and assigned to the first node found clockwise
5. **Rebalancing**: When nodes are added/removed, only keys between affected positions move

## Tech Stack

- React 18
- Vite
- TailwindCSS
- Lucide React (icons)

## License

MIT
