/**
 * Raw exercise entry from the Google Sheet CSV
 */
export interface ExerciseEntry {
  date: string;      // Format: YYYY-MM-DD or DD/MM/YYYY
  student: string;   // Student name (supports Hebrew)
  difficulty: number; // 1-5
  notes?: string;    // Optional notes about the exercise
}

/**
 * Calculated stats for a single student
 */
export interface StudentStats {
  name: string;
  totalScore: number;
  baseScore: number;           // Score from exercises only
  badgeBonusPoints: number;    // Bonus points from badges
  exerciseCount: number;
  currentStreak: number;
  longestStreak: number;
  lastSubmissionDate: string;

  // Breakdown by difficulty
  exercisesByDifficulty: Record<number, number>;
  scoresByDifficulty: Record<number, number>;

  // Recent activity
  recentExercises: ExerciseEntry[];

  // Weekly stats (for badges)
  weeklyScore: number;
  weeklyExerciseCount: number;
  exercisesToday: number;

  // Activity data for calendar/graph
  activityByDate: Record<string, number>; // date -> exercise count

  // For potential badges
  potentialBadges: PotentialBadge[];
}

/**
 * Badge calculation data
 */
export interface PotentialBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  progress?: number; // 0-100
  bonusPoints: number; // Points awarded when earned
}

/**
 * Leaderboard entry for display
 */
export interface LeaderboardEntry extends StudentStats {
  rank: number;
  rankChange?: number; // Positive = moved up, negative = moved down
}

/**
 * Parsed row from CSV
 */
export interface ParsedRow {
  date: string;
  student: string;
  difficulty: string;
  notes?: string;
}
