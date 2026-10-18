import confetti from 'canvas-confetti';

let activeConfettiTimer: ReturnType<typeof setTimeout> | null = null;

// Create a main-thread confetti instance (useWorker: false) to prevent
// worker thread desync and frozen confetti particles when changing lessons
const mainThreadConfetti = typeof window !== 'undefined'
  ? confetti.create(undefined, {
      resize: true,
      useWorker: false,
      disableForReducedMotion: true,
    })
  : confetti;

/**
 * Immediately stops all confetti animations and removes any confetti canvas elements
 * from the DOM so they never linger or get stuck when switching lessons.
 */
export function stopConfetti() {
  if (activeConfettiTimer) {
    clearTimeout(activeConfettiTimer);
    activeConfettiTimer = null;
  }

  try {
    mainThreadConfetti.reset();
  } catch {
    // fallback
  }

  try {
    confetti.reset();
  } catch {
    // fallback
  }

  // Double check and remove any lingering confetti canvas elements attached to document.body
  if (typeof document !== 'undefined') {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach((c) => {
      const isConfettiCanvas =
        c.style.pointerEvents === 'none' &&
        (c.style.position === 'fixed' || c.style.position === 'absolute');
      if (isConfettiCanvas && c.parentNode) {
        c.parentNode.removeChild(c);
      }
    });
  }
}

/**
 * Fires celebration confetti for lesson completion, rewards, or level ups.
 * Automatically stops and cleans up after 2.2 seconds so it never persists across screens.
 */
export function fireSuccessConfetti() {
  // Clear any existing confetti before firing a new batch
  stopConfetti();

  const count = 180;
  const defaults: confetti.Options = {
    origin: { y: 0.65 },
    ticks: 110,
    decay: 0.89,
    gravity: 1.1,
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    try {
      mainThreadConfetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    } catch {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }
  }

  fire(0.25, {
    spread: 30,
    startVelocity: 50,
    colors: ['#58CC02', '#FFC800', '#1CB0F6'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#CE82FF', '#FF4B4B', '#FF9600'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.90,
    scalar: 0.85,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 28,
    decay: 0.90,
    colors: ['#FFD700', '#58CC02'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 42,
  });

  // Automatically reset and remove canvas after 2.2s so it never overlaps the next screen
  activeConfettiTimer = setTimeout(() => {
    stopConfetti();
  }, 2200);
}

/**
 * Quick, lightweight dopamine burst for combo streaks during lessons.
 */
export function fireSmallBurst() {
  try {
    mainThreadConfetti({
      particleCount: 30,
      spread: 55,
      ticks: 60,
      decay: 0.88,
      origin: { y: 0.8 },
      colors: ['#58CC02', '#FFC800', '#1CB0F6'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });
  } catch {
    confetti({
      particleCount: 30,
      spread: 55,
      ticks: 60,
      decay: 0.88,
      origin: { y: 0.8 },
      colors: ['#58CC02', '#FFC800', '#1CB0F6'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });
  }
}
