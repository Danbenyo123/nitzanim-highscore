import type { LeaderboardEntry } from '../types';
import { config } from '../config';
import { ActivityGraph } from './ActivityGraph';
import { BadgeDisplay } from './BadgeDisplay';

interface StudentDetailsProps {
  entry: LeaderboardEntry;
}

export function StudentDetails({ entry }: StudentDetailsProps) {
  const difficulties = [1, 2, 3, 4, 5];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="details-panel rounded-b-lg p-4 mb-3 -mt-3 border border-t-0 border-[rgba(0,255,245,0.2)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Breakdown */}
        <div>
          <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <span className="neon-text-purple">◆</span>
            Score Breakdown
          </h4>
          <div className="space-y-2">
            {difficulties.map((diff) => {
              const count = entry.exercisesByDifficulty[diff] || 0;
              const score = entry.scoresByDifficulty[diff] || 0;
              const maxScore = entry.totalScore || 1;
              const percentage = (score / maxScore) * 100;

              return (
                <div key={diff} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-400">
                    {config.difficultyLabels[diff]}
                  </div>
                  <div className="flex-1 progress-bar h-4 rounded">
                    <div
                      className="progress-fill h-full rounded"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm">
                    <span className="neon-text-cyan">{score}</span>
                    <span className="text-gray-500 ml-1">({count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <span className="neon-text-purple">◆</span>
            Stats
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[rgba(0,255,245,0.05)] border border-[rgba(0,255,245,0.2)] rounded p-3">
              <div className="text-2xl font-bold neon-text-cyan cyber-title">
                {entry.currentStreak}
              </div>
              <div className="text-xs text-gray-400 uppercase">Current Streak</div>
            </div>
            <div className="bg-[rgba(0,255,245,0.05)] border border-[rgba(0,255,245,0.2)] rounded p-3">
              <div className="text-2xl font-bold neon-text-magenta cyber-title">
                {entry.longestStreak}
              </div>
              <div className="text-xs text-gray-400 uppercase">Best Streak</div>
            </div>
            <div className="bg-[rgba(0,255,245,0.05)] border border-[rgba(0,255,245,0.2)] rounded p-3">
              <div className="text-2xl font-bold neon-text-purple cyber-title">
                {entry.weeklyScore}
              </div>
              <div className="text-xs text-gray-400 uppercase">This Week</div>
            </div>
            <div className="bg-[rgba(0,255,245,0.05)] border border-[rgba(0,255,245,0.2)] rounded p-3">
              <div className="text-2xl font-bold text-white cyber-title">
                {entry.badgeBonusPoints > 0 ? `+${entry.badgeBonusPoints}` : '0'}
              </div>
              <div className="text-xs text-gray-400 uppercase">Badge Bonus</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Graph */}
      <div className="mt-6">
        <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
          <span className="neon-text-purple">◆</span>
          Activity (Last 14 Days)
        </h4>
        <ActivityGraph activityByDate={entry.activityByDate} />
      </div>

      {/* Badges */}
      <div className="mt-6">
        <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
          <span className="neon-text-purple">◆</span>
          Badges
        </h4>
        <BadgeDisplay badges={entry.potentialBadges} />
      </div>

      {/* Recent Exercises */}
      <div className="mt-6">
        <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
          <span className="neon-text-purple">◆</span>
          Recent Exercises
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {entry.recentExercises.slice(0, 5).map((exercise, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm bg-[rgba(0,0,0,0.3)] rounded p-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500">{formatDate(exercise.date)}</span>
                <span className="text-gray-400">
                  Difficulty {exercise.difficulty}
                </span>
              </div>
              <span className="neon-text-cyan">
                +{config.scoring[exercise.difficulty]} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
