import { useEffect, useState, memo } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export const AnimatedCounter = memo(function AnimatedCounter({
  value,
  duration = 1000,
  className = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    if (diff === 0) return;

    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentValue = Math.round(startValue + diff * easeOutQuart);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    // Cleanup animation on unmount
    return () => cancelAnimationFrame(animationId);
  }, [value, duration]);

  return (
    <span className={className}>
      {displayValue.toLocaleString()}
    </span>
  );
});
