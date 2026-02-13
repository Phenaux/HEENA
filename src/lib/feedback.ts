export const HAPTICS = {
  light: () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  },

  medium: () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  },

  strong: () => {
    if (navigator.vibrate) {
      navigator.vibrate([30, 40, 30]);
    }
  },

  celebration: () => {
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50, 100, 100]);
    }
  },

  doubleTap: () => {
    if (navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
  },

  warning: () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  },
};

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  }
  return audioContext;
};

export const SOUNDS = {
  focus: {
    play: () => playTone(400, 0.1, 0.15),
    levelUp: () => playSequence([400, 600], 0.1),
  },

  health: {
    play: () => playTone(300, 0.08, 0.2),
    levelUp: () => playSequence([300, 500], 0.1),
  },

  knowledge: {
    play: () => playTone(800, 0.06, 0.25),
    levelUp: () => playSequence([800, 1000], 0.1),
  },

  creativity: {
    play: () => playTone(600, 0.1, 0.12),
    levelUp: () => playSequence([600, 800, 1000], 0.08),
  },

  universal: {
    levelUp: () => playSequence([400, 600, 800], 0.15),
    achievement: () => playSequence([800, 900, 1000], 0.2),
    error: () => playTone(200, 0.15, 0.1),
    notification: () => playTone(500, 0.08, 0.12),
  },
};

function playTone(frequency: number, volume: number = 0.1, duration: number = 0.1) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Audio playback not supported:", e);
  }
}

function playSequence(
  frequencies: number[],
  duration: number = 0.1,
  spacing: number = 0.05
) {
  try {
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.15, duration);
      }, i * (duration + spacing) * 1000);
    });
  } catch (e) {
    console.warn("Audio sequence not supported:", e);
  }
}

export const FEEDBACK = {
  habitComplete: (path: "focus" | "health" | "knowledge" | "creativity") => {
    HAPTICS.medium();
    SOUNDS[path].play();
  },

  levelUp: (path: "focus" | "health" | "knowledge" | "creativity") => {
    HAPTICS.celebration();
    SOUNDS[path].levelUp();
  },

  achievement: () => {
    HAPTICS.strong();
    SOUNDS.universal.achievement();
  },

  duoSync: () => {
    HAPTICS.doubleTap();
    SOUNDS.universal.notification();
  },

  streakWarning: () => {
    HAPTICS.warning();
    SOUNDS.universal.error();
  },

  tap: () => {
    HAPTICS.light();
  },

  error: () => {
    HAPTICS.warning();
    SOUNDS.universal.error();
  },

  notification: () => {
    HAPTICS.light();
    SOUNDS.universal.notification();
  },
};

export const useSensoryFeedback = () => {
  return {
    habitComplete: (path: "focus" | "health" | "knowledge" | "creativity") => {
      FEEDBACK.habitComplete(path);
    },
    levelUp: (path: "focus" | "health" | "knowledge" | "creativity") => {
      FEEDBACK.levelUp(path);
    },
    achievement: () => FEEDBACK.achievement(),
    duoSync: () => FEEDBACK.duoSync(),
    streakWarning: () => FEEDBACK.streakWarning(),
    tap: () => FEEDBACK.tap(),
    error: () => FEEDBACK.error(),
    notification: () => FEEDBACK.notification(),
  };
};

export default FEEDBACK;
