import { useState, useEffect, useCallback } from 'react';
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

export function useLeaderboard(): UseLeaderboardResult {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isDemo, setIsDemo] = useState(false);

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

      setLeaderboard(board);
      setLastUpdated(new Date());
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
