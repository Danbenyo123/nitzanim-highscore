import { useState } from 'react';
import type { LeaderboardEntry } from '../types';
import { config } from '../config';
import { AnimatedCounter } from './AnimatedCounter';
import { StudentDetails } from './StudentDetails';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  index: number;
}

export function LeaderboardRow({ entry, index }: LeaderboardRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRankStyle = () => {
    switch (entry.rank) {
      case 1:
        return 'rank-gold animate-pulse-neon';
      case 2:
        return 'rank-silver';
      case 3:
        return 'rank-bronze';
      default:
        return 'text-gray-400';
    }
  };

  const getCardStyle = () => {
    switch (entry.rank) {
      case 1:
        return 'glow-gold';
      case 2:
        return 'glow-silver';
      case 3:
        return 'glow-bronze';
      default:
        return '';
    }
  };

  const getRankIcon = () => {
    switch (entry.rank) {
      case 1:
        return '👑';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const getAvatar = () => {
    return config.avatars[entry.name] || config.defaultAvatar;
  };

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className={`leaderboard-card ${entry.rank <= 3 ? 'top-3' : ''} ${getCardStyle()} rounded-lg p-4 mb-3 cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Rank */}
          <div className={`flex items-center justify-center w-8 sm:w-12 ${getRankStyle()}`}>
            <span className="cyber-title text-lg sm:text-2xl font-bold">
              {getRankIcon() || `#${entry.rank}`}
            </span>
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={getAvatar()}
              alt={entry.name}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = config.defaultAvatar;
              }}
            />
          </div>

          {/* Student Name */}
          <div className="flex-1 min-w-0 text-center">
            <h3 className="rtl-text text-lg sm:text-2xl font-semibold text-white truncate">
              {entry.name}
            </h3>
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400">
              <span>{entry.exerciseCount} exercises</span>
              {entry.currentStreak > 0 && (
                <span className="flex items-center gap-1">
                  <span className="fire-icon">🔥</span>
                  <span className="neon-text-magenta">{entry.currentStreak}</span>
                </span>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="text-right">
            <div className="neon-text-cyan cyber-title text-lg sm:text-2xl font-bold">
              <AnimatedCounter value={entry.totalScore} duration={1500} />
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">
              points
            </div>
          </div>

          {/* Expand indicator */}
          <div className={`text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && <StudentDetails entry={entry} />}
    </div>
  );
}
