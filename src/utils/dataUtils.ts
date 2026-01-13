import Papa from 'papaparse';
import { config } from '../config';
import type { ExerciseEntry, ParsedRow, StudentStats, LeaderboardEntry, PotentialBadge } from '../types';

/**
 * Fetch and parse CSV data from Google Sheets
 */
export async function fetchLeaderboardData(): Promise<ExerciseEntry[]> {
  const url = config.googleSheetUrl;

  if (!url || url === 'YOUR_GOOGLE_SHEET_CSV_URL_HERE') {
    throw new Error('Please configure your Google Sheet URL in src/config.ts');
  }

  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const csvText = await response.text();
  return parseCSV(csvText);
}

/**
 * Parse CSV text into exercise entries
 */
export function parseCSV(csvText: string): ExerciseEntry[] {
  const result = Papa.parse<ParsedRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase(),
  });

  if (result.errors.length > 0) {
    console.warn('CSV parsing warnings:', result.errors);
  }

  const entries: ExerciseEntry[] = [];

  for (const row of result.data) {
    const date = normalizeDate(row.date);
    const difficulty = parseInt(row.difficulty, 10);

    if (!date || !row.student || isNaN(difficulty) || difficulty < 0 || difficulty > 5) {
      continue;
    }

    const entry: ExerciseEntry = {
      date,
      student: row.student.trim(),
      difficulty,
    };

    if (row.notes?.trim()) {
      entry.notes = row.notes.trim();
    }

    entries.push(entry);
  }

  return entries;
}

/**
 * Normalize date to YYYY-MM-DD format
 */
function normalizeDate(dateStr: string): string | null {
  if (!dateStr) return null;

  const cleaned = dateStr.trim();

  // Try YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  // Try DD/MM/YYYY format
  const ddmmyyyy = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Try DD/MM/YY format (2-digit year)
  const ddmmyy = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (ddmmyy) {
    const [, day, month, shortYear] = ddmmyy;
    // Assume 20xx for 2-digit years
    const year = `20${shortYear}`;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Try DD.MM.YYYY format
  const dotFormat = cleaned.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotFormat) {
    const [, day, month, year] = dotFormat;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return null;
}

/**
 * Calculate score for a difficulty level
 */
export function calculateScore(difficulty: number): number {
  return config.scoring[difficulty] || 0;
}

/**
 * Calculate current streak (consecutive days with submissions)
 */
function calculateStreak(dates: string[]): { current: number; longest: number } {
  if (dates.length === 0) return { current: 0, longest: 0 };

  // Get unique sorted dates in descending order
  const uniqueDates = [...new Set(dates)].sort((a, b) => b.localeCompare(a));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  // Check if streak is active (last submission was today or yesterday)
  const lastSubmission = uniqueDates[0];
  const streakActive = lastSubmission === todayStr || lastSubmission === yesterdayStr;

  // Calculate streaks
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        if (i === 1 || currentStreak > 0) {
          // This was the current streak
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  // Current streak only counts if active
  if (streakActive) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { current: currentStreak, longest: longestStreak };
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get start of current week (Sunday)
 */
function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const weekStart = new Date(now);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

/**
 * Calculate potential badges for a student
 */
function calculateBadges(stats: Omit<StudentStats, 'potentialBadges' | 'badgeBonusPoints' | 'baseScore'>): PotentialBadge[] {
  const badges: PotentialBadge[] = [];
  const bonusPoints = config.badges.bonusPoints;

  // Streak Master - 7+ day streak
  badges.push({
    id: 'streak-master',
    name: 'Streak Master',
    icon: '🔥',
    description: `Submit exercises ${config.badges.streakMasterDays} days in a row to earn +${bonusPoints['streak-master']} bonus points!`,
    earned: stats.currentStreak >= config.badges.streakMasterDays,
    progress: Math.min(100, (stats.currentStreak / config.badges.streakMasterDays) * 100),
    bonusPoints: bonusPoints['streak-master'],
  });

  // Hard Mode - most difficulty-5 exercises
  const hardExercises = stats.exercisesByDifficulty[5] || 0;
  badges.push({
    id: 'hard-mode',
    name: 'Hard Mode',
    icon: '💀',
    description: `Complete 3 exercises at difficulty level 5 to earn +${bonusPoints['hard-mode']} bonus points!`,
    earned: hardExercises >= 3,
    progress: Math.min(100, (hardExercises / 3) * 100),
    bonusPoints: bonusPoints['hard-mode'],
  });

  // Speed Demon - most exercises in single day
  const maxDailyExercises = Math.max(...Object.values(stats.activityByDate), 0);
  badges.push({
    id: 'speed-demon',
    name: 'Speed Demon',
    icon: '⚡',
    description: `Complete ${config.badges.speedDemonThreshold} exercises in a single day to earn +${bonusPoints['speed-demon']} bonus points!`,
    earned: maxDailyExercises >= config.badges.speedDemonThreshold,
    progress: Math.min(100, (maxDailyExercises / config.badges.speedDemonThreshold) * 100),
    bonusPoints: bonusPoints['speed-demon'],
  });

  // Rising Star - high weekly score
  badges.push({
    id: 'rising-star',
    name: 'Rising Star',
    icon: '📈',
    description: `Earn 200+ points in a single week to earn +${bonusPoints['rising-star']} bonus points!`,
    earned: stats.weeklyScore >= 200,
    progress: Math.min(100, (stats.weeklyScore / 200) * 100),
    bonusPoints: bonusPoints['rising-star'],
  });

  // Consistent - submitted every day this week
  const weekStart = getWeekStart();
  const today = new Date();
  const daysSinceWeekStart = Math.floor((today.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysWithSubmissions = Object.keys(stats.activityByDate).filter((dateStr) => {
    const date = new Date(dateStr);
    return date >= weekStart && date <= today;
  }).length;

  badges.push({
    id: 'consistent',
    name: 'Consistent',
    icon: '🎯',
    description: `Submit at least one exercise every day this week to earn +${bonusPoints['consistent']} bonus points!`,
    earned: daysWithSubmissions >= daysSinceWeekStart && daysSinceWeekStart >= 3,
    progress: Math.min(100, (daysWithSubmissions / Math.max(daysSinceWeekStart, 1)) * 100),
    bonusPoints: bonusPoints['consistent'],
  });

  return badges;
}

/**
 * Calculate stats for all students from exercise entries
 */
export function calculateStudentStats(entries: ExerciseEntry[]): StudentStats[] {
  const studentMap = new Map<string, ExerciseEntry[]>();

  // Group entries by student
  for (const entry of entries) {
    const existing = studentMap.get(entry.student) || [];
    existing.push(entry);
    studentMap.set(entry.student, existing);
  }

  const weekStart = getWeekStart();
  const weekStartStr = formatDate(weekStart);
  const todayStr = formatDate(new Date());

  const stats: StudentStats[] = [];

  for (const [name, studentEntries] of studentMap) {
    // Sort entries by date (newest first)
    const sortedEntries = [...studentEntries].sort((a, b) => b.date.localeCompare(a.date));

    // Calculate totals
    let totalScore = 0;
    const exercisesByDifficulty: Record<number, number> = {};
    const scoresByDifficulty: Record<number, number> = {};
    const activityByDate: Record<string, number> = {};

    let weeklyScore = 0;
    let weeklyExerciseCount = 0;
    let exercisesToday = 0;

    for (const entry of studentEntries) {
      const score = calculateScore(entry.difficulty);
      totalScore += score;

      exercisesByDifficulty[entry.difficulty] = (exercisesByDifficulty[entry.difficulty] || 0) + 1;
      scoresByDifficulty[entry.difficulty] = (scoresByDifficulty[entry.difficulty] || 0) + score;
      activityByDate[entry.date] = (activityByDate[entry.date] || 0) + 1;

      // Weekly stats
      if (entry.date >= weekStartStr) {
        weeklyScore += score;
        weeklyExerciseCount++;
      }

      // Today's stats
      if (entry.date === todayStr) {
        exercisesToday++;
      }
    }

    // Calculate streaks
    const dates = studentEntries.map((e) => e.date);
    const { current: currentStreak, longest: longestStreak } = calculateStreak(dates);

    const baseStats = {
      name,
      totalScore, // Will be updated after badge calculation
      exerciseCount: studentEntries.length,
      currentStreak,
      longestStreak,
      lastSubmissionDate: sortedEntries[0]?.date || '',
      exercisesByDifficulty,
      scoresByDifficulty,
      recentExercises: sortedEntries.slice(0, 10),
      weeklyScore,
      weeklyExerciseCount,
      exercisesToday,
      activityByDate,
    };

    // Calculate badges and bonus points
    const potentialBadges = calculateBadges(baseStats);
    const badgeBonusPoints = potentialBadges
      .filter((badge) => badge.earned)
      .reduce((sum, badge) => sum + badge.bonusPoints, 0);

    stats.push({
      ...baseStats,
      baseScore: totalScore,
      badgeBonusPoints,
      totalScore: totalScore + badgeBonusPoints,
      potentialBadges,
    });
  }

  return stats;
}

/**
 * Create leaderboard from student stats
 */
export function createLeaderboard(stats: StudentStats[]): LeaderboardEntry[] {
  // Sort by total score (descending), then by exercise count, then by name
  const sorted = [...stats].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.exerciseCount !== a.exerciseCount) return b.exerciseCount - a.exerciseCount;
    return a.name.localeCompare(b.name);
  });

  return sorted.map((student, index) => ({
    ...student,
    rank: index + 1,
  }));
}

/**
 * Generate demo data for testing
 */
export function generateDemoData(): ExerciseEntry[] {
  const students = ['יוסי', 'דנה', 'מיכל', 'אבי', 'שרה', 'דוד', 'רחל', 'יעקב'];
  const entries: ExerciseEntry[] = [];

  const today = new Date();

  for (const student of students) {
    // Random number of exercises per student
    const numExercises = Math.floor(Math.random() * 15) + 5;

    for (let i = 0; i < numExercises; i++) {
      // Random date within last 14 days
      const daysAgo = Math.floor(Math.random() * 14);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);

      entries.push({
        date: formatDate(date),
        student,
        difficulty: Math.floor(Math.random() * 6), // 0-5
        notes: Math.random() > 0.7 ? 'practice exercise' : undefined,
      });
    }
  }

  return entries;
}
