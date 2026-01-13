import { useState, useEffect, useCallback, useRef } from 'react';
import { config } from '../config';
import type { LeaderboardEntry, ExerciseEntry } from '../types';
import {
  fetchLeaderboardData,
  calculateStudentStats,
  createLeaderboard,
  generateDemoData,
} from '../utils/dataUtils';

interface UseLeaderboardResult {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  isDemo: boolean;
}

const PREVIOUS_RANKS_KEY = 'leaderboard_previous_ranks';

function getPreviousRanks(): Record<string, number> {
  try {
    const stored = localStorage.getItem(PREVIOUS_RANKS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function savePreviousRanks(board: LeaderboardEntry[]): void {
  const ranks: Record<string, number> = {};
  for (const entry of board) {
    ranks[entry.name] = entry.rank;
  }
  localStorage.setItem(PREVIOUS_RANKS_KEY, JSON.stringify(ranks));
}

export function useLeaderboard(): UseLeaderboardResult {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const isFirstLoad = useRef(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let entries: ExerciseEntry[];

      // Check if we have a valid URL configured
      if (!config.googleSheetUrl || config.googleSheetUrl === 'YOUR_GOOGLE_SHEET_CSV_URL_HERE') {
        // Use demo data
        entries = generateDemoData();
        setIsDemo(true);
      } else {
        entries = await fetchLeaderboardData();
        setIsDemo(false);
      }

      const stats = calculateStudentStats(entries);
      const board = createLeaderboard(stats);

      // Calculate rank changes based on previous ranks
      const previousRanks = getPreviousRanks();
      const boardWithChanges = board.map((entry) => {
        const prevRank = previousRanks[entry.name];
        // rankChange: positive = moved up (lower rank number), negative = moved down
        const rankChange = prevRank !== undefined ? prevRank - entry.rank : undefined;
        return { ...entry, rankChange };
      });

      // Save current ranks for next comparison (only after first load to establish baseline)
      if (!isFirstLoad.current) {
        savePreviousRanks(board);
      } else {
        // On first load, save ranks if we don't have any stored
        if (Object.keys(previousRanks).length === 0) {
          savePreviousRanks(board);
        }
        isFirstLoad.current = false;
      }

      // Find the most recent submission date from entries
      const mostRecentDate = entries.reduce((latest, entry) => {
        return entry.date > latest ? entry.date : latest;
      }, '');

      setLeaderboard(boardWithChanges);
      setLastUpdated(mostRecentDate ? new Date(mostRecentDate) : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
      console.error('Leaderboard error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh when page is restored from back-forward cache
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        loadData();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [loadData]);

  // Auto-refresh
  useEffect(() => {
    if (config.autoRefreshInterval > 0) {
      const interval = setInterval(loadData, config.autoRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [loadData]);

  return {
    leaderboard,
    isLoading,
    error,
    lastUpdated,
    refresh: loadData,
    isDemo,
  };
}
