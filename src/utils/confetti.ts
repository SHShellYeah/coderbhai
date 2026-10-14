import confetti from 'canvas-confetti';

export function fireSuccessConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#58CC02', '#FFC800', '#1CB0F6']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#CE82FF', '#FF4B4B', '#FF9600']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#FFD700', '#58CC02']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function fireSmallBurst() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.85 },
    colors: ['#58CC02', '#FFC800', '#1CB0F6'],
    disableForReducedMotion: true
  });
}
