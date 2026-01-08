interface ActivityGraphProps {
  activityByDate: Record<string, number>;
}

export function ActivityGraph({ activityByDate }: ActivityGraphProps) {
  // Generate last 14 days
  const days: { date: string; dayName: string; count: number }[] = [];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    days.push({
      date: dateStr,
      dayName: dayName.substring(0, 2),
      count: activityByDate[dateStr] || 0,
    });
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-[rgba(0,255,245,0.05)]';
    const intensity = count / maxCount;
    if (intensity <= 0.25) return 'bg-[rgba(0,255,245,0.2)]';
    if (intensity <= 0.5) return 'bg-[rgba(0,255,245,0.4)]';
    if (intensity <= 0.75) return 'bg-[rgba(0,255,245,0.6)]';
    return 'bg-[rgba(0,255,245,0.9)] shadow-[0_0_10px_rgba(0,255,245,0.5)]';
  };

  return (
    <div className="flex gap-1 flex-wrap justify-center sm:justify-start">
      {days.map((day, idx) => (
        <div key={idx} className="flex flex-col items-center gap-1">
          <div
            className={`activity-cell w-6 h-6 sm:w-8 sm:h-8 rounded ${getIntensityClass(day.count)} border border-[rgba(0,255,245,0.2)] flex items-center justify-center text-[10px] sm:text-xs cursor-default`}
            title={`${day.date}: ${day.count} exercises`}
          >
            {day.count > 0 && (
              <span className="text-white font-bold">{day.count}</span>
            )}
          </div>
          <span className="text-[8px] sm:text-[10px] text-gray-500">{day.dayName}</span>
        </div>
      ))}
    </div>
  );
}
