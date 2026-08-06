import confetti from "canvas-confetti";

/**
 * Triggers a premium multi-stage celebratory confetti animation.
 */
export function triggerCelebrationConfetti() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 9999,
  };

  // 1. Initial Powerful Side Cannon Shot (Left & Right)
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 70,
    origin: { x: 0.05, y: 0.7 },
    colors: ["#fbbf24", "#818cf8", "#34d399", "#f43f5e", "#a855f7"],
    zIndex: 9999,
  });

  confetti({
    particleCount: 80,
    angle: 120,
    spread: 70,
    origin: { x: 0.95, y: 0.7 },
    colors: ["#fbbf24", "#818cf8", "#34d399", "#f43f5e", "#a855f7"],
    zIndex: 9999,
  });

  // 2. Golden Star Burst from Center
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 100,
      origin: { y: 0.4 },
      shapes: ["star"],
      colors: ["#ffd700", "#ffa500", "#ffffff", "#fbbf24"],
      scalar: 1.2,
      zIndex: 9999,
    });
  }, 250);

  // 3. Sustained Firework Pops
  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    // Random pops across upper screen
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.2, 0.8), y: randomInRange(0.2, 0.5) },
      colors: ["#818cf8", "#fbbf24", "#34d399", "#c084fc", "#38bdf8"],
    });
  }, 350);
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
