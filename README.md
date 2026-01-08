# Python Highscores Leaderboard

A cyberpunk-themed leaderboard web app for tracking Python programming exercise scores. Perfect for classrooms, coding clubs, or any learning environment.

![Cyberpunk Theme](https://img.shields.io/badge/theme-cyberpunk-00fff5?style=flat-square)
![React](https://img.shields.io/badge/react-18+-61dafb?style=flat-square)
![TypeScript](https://img.shields.io/badge/typescript-5+-3178c6?style=flat-square)

## Features

- **Cyberpunk Aesthetic**: Neon glows, scanlines, and futuristic fonts
- **Real-time Scoring**: Automatic calculation from Google Sheets data
- **Streak Tracking**: Track consecutive days of exercise submissions
- **Mobile-Responsive**: Students can check on their phones
- **Hebrew Support**: Full RTL text support for Hebrew names
- **Expandable Stats**: Click on any student to see detailed breakdowns
- **Badge System**: Infrastructure ready for gamification badges
- **Demo Mode**: Works with sample data if no Google Sheet is configured

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Sheet

Open `src/config.ts` and update the `googleSheetUrl` with your published Google Sheet URL (see setup guide below).

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

---

## Google Sheets Setup Guide

### Step 1: Create Your Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it something like "Python Exercises Log"
3. In the first row, add these exact headers (case-insensitive):

| A | B | C | D |
|---|---|---|---|
| date | student | difficulty | notes |

### Step 2: Add Sample Data

Add a few rows to test:

| date | student | difficulty | notes |
|------|---------|------------|-------|
| 2025-01-08 | יוסי | 3 | loops exercise |
| 2025-01-08 | דנה | 5 | recursion |
| 2025-01-08 | יוסי | 2 | |

**Date formats supported:**
- `YYYY-MM-DD` (recommended): `2025-01-08`
- `DD/MM/YYYY`: `08/01/2025`
- `DD.MM.YYYY`: `08.01.2025`

**Difficulty levels:** 1-5 (Easy to Hard)

### Step 3: Publish to Web

1. Click **File** → **Share** → **Publish to web**
2. In the first dropdown, select your sheet name (usually "Sheet1" or rename it to "Log")
3. In the second dropdown, select **Comma-separated values (.csv)**
4. Click **Publish**
5. Copy the URL that appears

The URL will look something like:
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vS.../pub?gid=0&single=true&output=csv
```

### Step 4: Configure the App

Open `src/config.ts` and paste your URL:

```typescript
export const config = {
  googleSheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS.../pub?gid=0&single=true&output=csv',
  // ... rest of config
};
```

---

## Daily Workflow (Adding Entries)

### On Your Phone:
1. Open the Google Sheets app
2. Navigate to your leaderboard sheet
3. Add a new row at the bottom:
   - Date: Today's date
   - Student: Student's name
   - Difficulty: 1-5
   - Notes: Optional
4. Done! The leaderboard updates when students refresh

### Quick Entry Tips:
- You can enter multiple exercises per student per day
- Date can be today or any past date
- Notes are optional - use them for exercise names or topics

---

## Configuration Options

All customization is in `src/config.ts`:

### Leaderboard Settings

```typescript
// Title displayed at top
title: 'Python Highscores',

// Subtitle (supports Hebrew)
subtitle: 'נצנים',

// Auto-refresh interval in milliseconds (0 to disable)
autoRefreshInterval: 0, // Set to 60000 for 1-minute refresh
```

### Scoring System

```typescript
scoring: {
  1: 10,   // Easy
  2: 25,   // Medium-Easy
  3: 50,   // Medium
  4: 80,   // Medium-Hard
  5: 120,  // Hard
},
```

### Difficulty Labels

```typescript
difficultyLabels: {
  1: 'Easy',
  2: 'Medium-Easy',
  3: 'Medium',
  4: 'Medium-Hard',
  5: 'Hard',
},
```

### Badge Thresholds

```typescript
badges: {
  streakMasterDays: 7,      // Days for "Streak Master" badge
  speedDemonThreshold: 5,   // Exercises/day for "Speed Demon"
  consistentDays: 7,        // Days for "Consistent" badge
},
```

### Visual Colors

```typescript
colors: {
  background: '#0a0a0f',
  neonPrimary: '#00fff5',    // Cyan
  neonSecondary: '#ff00ff',  // Magenta
  neonTertiary: '#bf00ff',   // Purple
  gold: '#ffd700',
  silver: '#c0c0c0',
  bronze: '#cd7f32',
},
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Deploy - that's it!

### Netlify

1. Push your code to GitHub
2. Import on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

### GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... other config
   })
   ```
3. Add script to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
4. Run: `npm run deploy`

---

## Project Structure

```
src/
├── components/
│   ├── ActivityGraph.tsx    # 14-day activity visualization
│   ├── AnimatedCounter.tsx  # Score tick-up animation
│   ├── BadgeDisplay.tsx     # Badge progress display
│   ├── Header.tsx           # Title, refresh button
│   ├── Leaderboard.tsx      # Main container
│   ├── LeaderboardRow.tsx   # Individual student row
│   └── StudentDetails.tsx   # Expanded stats view
├── hooks/
│   └── useLeaderboard.ts    # Data fetching hook
├── utils/
│   └── dataUtils.ts         # CSV parsing, scoring logic
├── config.ts                # All customization options
├── types.ts                 # TypeScript interfaces
├── App.tsx                  # Root component
├── main.tsx                 # Entry point
└── index.css                # Tailwind + custom styles
```

---

## Badge System (Future)

The infrastructure for badges is already in place. Currently tracked potential badges:

| Badge | Icon | Requirement |
|-------|------|-------------|
| Streak Master | 🔥 | 7+ day streak |
| Hard Mode | 💀 | 3+ difficulty-5 exercises |
| Speed Demon | ⚡ | 5+ exercises in one day |
| Rising Star | 📈 | 200+ points this week |
| Consistent | 🎯 | Submitted every day this week |

Badges show progress and earned status in the expanded student view.

---

## Troubleshooting

### "Please configure your Google Sheet URL"
You're seeing demo mode. Update `googleSheetUrl` in `src/config.ts`.

### Data not loading
- Check that your Google Sheet is published to web
- Verify the CSV format is selected
- Ensure the column headers match: `date`, `student`, `difficulty`, `notes`

### Hebrew names not displaying correctly
- The app supports RTL text automatically
- Ensure your browser supports Hebrew fonts

### Scores not calculating
- Verify difficulty values are 1-5
- Check date format is valid
- Look for console errors in browser dev tools

---

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **PapaParse** - CSV parsing

---

## License

MIT License - Feel free to use for your classroom or coding club!
