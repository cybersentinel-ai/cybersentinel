# CyberSentinel Frontend

Autonomous incident reasoning system dashboard.

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Axios
- WebSocket API
- React Router 6
- Lucide React (Icons)

## Features
- **Real-time Updates**: WebSocket integration for live incident monitoring.
- **Decision Timeline**: Visual representation of multi-agent reasoning (Hypothesis → Response → Critic).
- **Hypothesis Panel**: Competing hypotheses with confidence scores and evidence.
- **Action Feed**: Real-time log of agent activities.
- **Multi-Tenant Support**: Built-in architecture for tenant isolation.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Project Structure
- `src/components`: Reusable UI components.
- `src/hooks`: Custom React hooks for data fetching and WebSockets.
- `src/services`: API client and WebSocket connection manager.
- `src/pages`: Page-level components and routing.
- `src/types`: TypeScript interfaces and types.
