import { config } from '../config';

interface HeaderProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  isDemo: boolean;
  onRefresh: () => void;
}

export function Header({ lastUpdated, isLoading, isDemo, onRefresh }: HeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <header className="text-center mb-8">
      {/* Demo mode banner */}
      {isDemo && (
        <div className="demo-banner rounded-lg p-3 mb-6 text-center">
          <span className="neon-text-magenta font-bold">DEMO MODE</span>
          <span className="text-gray-300 ml-2">
            Configure your Google Sheet URL in src/config.ts
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="cyber-title text-2xl sm:text-4xl md:text-5xl mb-2 neon-text-cyan animate-flicker">
        {config.title}
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-gray-400 rtl-text mb-4 font-bold">
        {config.subtitle}
      </p>

      {/* Decorative line */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--neon-cyan)]" />
        <div className="w-2 h-2 rotate-45 bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--neon-cyan)]" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="cyber-button flex items-center gap-2 disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>

        {lastUpdated && (
          <span className="text-sm text-gray-500">
            Last updated: {formatTime(lastUpdated)}
          </span>
        )}
      </div>
    </header>
  );
}
