import { useLeaderboard } from '../hooks/useLeaderboard';
import { Header } from './Header';
import { LeaderboardRow } from './LeaderboardRow';

export function Leaderboard() {
  const { leaderboard, isLoading, error, lastUpdated, refresh, isDemo } = useLeaderboard();

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Background effects */}
      <div className="circuit-bg" />
      <div className="scanlines" />

      <div className="max-w-3xl mx-auto relative z-10">
        <Header
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          isDemo={isDemo}
          onRefresh={refresh}
        />

        {/* Error state */}
        {error && (
          <div className="neon-border-magenta rounded-lg p-4 mb-6 text-center bg-[rgba(255,0,255,0.1)]">
            <p className="neon-text-magenta">{error}</p>
            <button
              onClick={refresh}
              className="cyber-button mt-3 text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && leaderboard.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loading-spinner" />
            <p className="mt-4 text-gray-400 animate-pulse">Loading rankings...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && leaderboard.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-xl text-gray-400 mb-2">No data yet</h2>
            <p className="text-gray-500">
              Add some exercise entries to your Google Sheet to see the leaderboard.
            </p>
          </div>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="space-y-1">
            {leaderboard.map((entry, index) => (
              <LeaderboardRow key={entry.name} entry={entry} index={index} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 py-6 border-t border-[rgba(0,255,245,0.1)]">
          <p className="text-gray-600 text-sm">
            <span className="neon-text-purple">◆</span>
            {' '}Made with Claude Code for Nitzanim Pro{' '}
            <span className="neon-text-purple">◆</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
