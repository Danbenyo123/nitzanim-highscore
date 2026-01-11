import { useState } from 'react';
import type { PotentialBadge } from '../types';

interface BadgeDisplayProps {
  badges: PotentialBadge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  const handleBadgeClick = (badgeId: string) => {
    setOpenTooltip(openTooltip === badgeId ? null : badgeId);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`badge ${badge.earned ? 'earned' : 'not-earned'} cursor-pointer relative`}
          onClick={() => handleBadgeClick(badge.id)}
        >
          <span className="text-base">{badge.icon}</span>
          <span className={badge.earned ? 'neon-text-cyan' : 'text-gray-500'}>
            {badge.name}
          </span>
          {badge.earned ? (
            <span className="text-[10px] neon-text-magenta font-bold">
              +{badge.bonusPoints}
            </span>
          ) : badge.progress !== undefined ? (
            <span className="text-gray-500 text-[10px]">
              {Math.round(badge.progress)}%
            </span>
          ) : null}

          {/* Tooltip */}
          {openTooltip === badge.id && (
            <div
              className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-[90vw] text-center sm:absolute sm:bottom-full sm:top-auto sm:translate-y-0 sm:mb-2 sm:max-w-none sm:whitespace-nowrap px-3 py-2 border border-[var(--neon-cyan)] rounded text-xs text-white z-50"
              style={{ backgroundColor: '#000000ff', boxShadow: '0 0 10px #00fff5' }}
            >
              {badge.description}
              <div className="hidden sm:block absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--neon-cyan)]"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
