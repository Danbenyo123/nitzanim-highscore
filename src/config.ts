/**
 * Leaderboard Configuration
 *
 * Customize your leaderboard settings here.
 * Update the Google Sheet URL after publishing your sheet to the web.
 */

export const config = {
  // ===========================================
  // GOOGLE SHEET CONFIGURATION
  // ===========================================

  /**
   * Your published Google Sheet CSV URL
   *
   * To get this URL:
   * 1. Open your Google Sheet
   * 2. Go to File → Share → Publish to web
   * 3. Select the "Log" sheet (or your sheet name)
   * 4. Choose "Comma-separated values (.csv)" format
   * 5. Click "Publish" and copy the URL
   *
   * The URL should look like:
   * https://docs.google.com/spreadsheets/d/e/XXXXX/pub?gid=0&single=true&output=csv
   */
  googleSheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQykVvPYzGgJi5yZW9zYqPJeF3hXeYgcbfoRVuJUpGUXgcmfOKj63Zgu88LDmGeeiGcOvmHL7SOyA7K/pub?gid=0&single=true&output=csv',

  // ===========================================
  // LEADERBOARD DISPLAY SETTINGS
  // ===========================================

  /** Title displayed at the top of the leaderboard */
  title: 'Nitzanim Master Coder',

  /** Subtitle or class name */
  subtitle: 'ישיבת אמי״ת אשדוד',

  /** How often to auto-refresh data (in milliseconds). Set to 0 to disable. */
  autoRefreshInterval: 0, // 60000 = 1 minute

  // ===========================================
  // SCORING CONFIGURATION
  // ===========================================

  /**
   * Points awarded for each difficulty level
   * Adjust these values to change how exercises are scored
   */
  scoring: {
    0: 5,    // Tried
    1: 10,   // Easy
    2: 25,   // Medium-Easy
    3: 50,   // Medium
    4: 80,   // Medium-Hard
    5: 120,  // Hard
  } as Record<number, number>,

  /**
   * Labels for difficulty levels (displayed in stats)
   */
  difficultyLabels: {
    0: 'Tried',
    1: 'Easy',
    2: 'Medium-Easy',
    3: 'Medium',
    4: 'Medium-Hard',
    5: 'Hard',
  } as Record<number, string>,

  // ===========================================
  // BADGE THRESHOLDS (for future badge system)
  // ===========================================

  badges: {
    /** Days needed for "Streak Master" badge */
    streakMasterDays: 7,

    /** Exercises per day for "Speed Demon" badge */
    speedDemonThreshold: 5,

    /** Consecutive days for "Consistent" badge */
    consistentDays: 7,

    /** Bonus points awarded for each badge */
    bonusPoints: {
      'streak-master': 50,   // 🔥 7+ day streak
      'hard-mode': 100,      // 💀 3+ difficulty-5 exercises (rewards quality)
      'speed-demon': 30,     // ⚡ 5+ exercises in one day
      'rising-star': 60,     // 📈 200+ points this week
      'consistent': 70,      // 🎯 Submitted every day this week
    } as Record<string, number>,
  },

  // ===========================================
  // STUDENT AVATARS
  // ===========================================

  /**
   * Map student names to avatar images
   * Place image files in /public/avatars/
   * Use the exact student name as the key (case-sensitive, Hebrew supported)
   *
   * Example:
   *   'עילאי חנוך': '/avatars/ilay.png',
   */
  avatars: {
    'ליאב ביטון': '/avatars/liav.png',
    'יאיר רפאל אטיאס': '/avatars/yair.png',
    'שמעון חיים אלמליח': '/avatars/shimon.png',
    'ישי מינדס אוסונה': '/avatars/yishai-m.png',
    'רועי אלבז': '/avatars/roi.png',
    'אורי מירי': '/avatars/ori.png',
    'נועם מסטריאל': '/avatars/noam.png',
    'טלאור נידם': '/avatars/talor.png',
    'זוהר לוליה': '/avatars/zohar.png',
    'מאיר מלכה': '/avatars/meir.png',
    'אייל האוזי': '/avatars/eyal.png',
    'ישי רם': '/avatars/yishai-r.png',
    'דניאל כהן': '/avatars/daniel.png',
    'עילאי חנוך': '/avatars/ilay.png',
    'אריאל שליו': '/avatars/ariel.png',
    'נבו נעים': '/avatars/nevo.png',
  } as Record<string, string>,

  /** Default avatar for students without a custom image */
  defaultAvatar: '/avatars/default.svg',

  // ===========================================
  // VISUAL CUSTOMIZATION
  // ===========================================

  colors: {
    /** Background color */
    background: '#0a0a0f',

    /** Primary neon color (cyan) */
    neonPrimary: '#00fff5',

    /** Secondary neon color (magenta) */
    neonSecondary: '#ff00ff',

    /** Tertiary neon color (purple) */
    neonTertiary: '#bf00ff',

    /** Gold for #1 */
    gold: '#ffd700',

    /** Silver for #2 */
    silver: '#c0c0c0',

    /** Bronze for #3 */
    bronze: '#cd7f32',
  },
};

// Type export for config
export type Config = typeof config;
