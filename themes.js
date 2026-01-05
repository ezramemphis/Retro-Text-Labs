// ===============================
// Grab DOM elements
// ===============================
const themeSelect = document.getElementById('themeSelect');
const cdPlayerView = document.getElementById('cdPlayerView');
const staticModeBtn = document.getElementById('staticModeBtn');

let staticMode = false;

// ===============================
// Visual layers
// ===============================
const PIXEL_LAYER = `
  repeating-linear-gradient(
    0deg,
    rgba(255,255,255,0.12) 0px,
    rgba(255,255,255,0.12) 1px,
    transparent 1px,
    transparent 6px
  ),
  repeating-linear-gradient(
    90deg,
    rgba(0,0,0,0.18) 0px,
    rgba(0,0,0,0.18) 2px,
    transparent 2px,
    transparent 11px
  ),
  repeating-linear-gradient(
    37deg,
    rgba(255,255,255,0.05) 0px,
    rgba(255,255,255,0.05) 1px,
    transparent 1px,
    transparent 8px
  )
`;

const ANALOG_OVERLAY = `
  repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.18) 0px,
    rgba(0,0,0,0.18) 1px,
    transparent 1px,
    transparent 4px
  ),
  radial-gradient(
    circle at center,
    rgba(0,0,0,0) 45%,
    rgba(0,0,0,0.45) 100%
  )
`;

// ===============================
// Themes
// ===============================
const themes = {
  'neon-nights': {
    background: `${PIXEL_LAYER}, ${ANALOG_OVERLAY}, radial-gradient(circle at center, rgba(10,10,30,0.95) 0%, rgba(0,0,0,0.98) 100%)`,
    textColor: '#ffffffff',
    trackTextShadow: '0 0 12px #fff, 0 0 24px #0ff, 0 0 40px #f0f'
  },
  

  'retro-wave': {
    background: `${PIXEL_LAYER}, ${ANALOG_OVERLAY}, linear-gradient(135deg, #7e275d, #262375)`,
    textColor: '#ffffff',
    trackTextShadow: '0 0 14px #fff, 0 0 32px #ff6ec7'
  },

  'solar-flare': {
    background: `${PIXEL_LAYER}, ${ANALOG_OVERLAY}, radial-gradient(circle at top, #ffcb6b, #ff5722, #b71c1c)`,
    textColor: '#000',
    trackTextShadow: '0 0 14px #000, 0 0 32px #ff9800'
  },

  'deep-space': {
    background: `${PIXEL_LAYER}, ${ANALOG_OVERLAY}, radial-gradient(circle, #000011, #0a1a2b)`,
    textColor: '#00ffea',
    trackTextShadow: '0 0 18px #00ffea, 0 0 38px #0ff'
  },

  'aurora-glow': {
    background: `${PIXEL_LAYER}, ${ANALOG_OVERLAY}, linear-gradient(180deg, #567c75, #152c52)`,
    textColor: '#fff3da',
    trackTextShadow: '0 0 16px #23211b, 0 0 36px #59432c'
  },

  'rainbow-shift': {
    background: `${PIXEL_LAYER}, ${ANALOG_OVERLAY}, linear-gradient(100deg,
      #8c2a2a,#7c4a18,#888f23,#2e631c,#2f5965,#201d5b,#971095,#901b1b)`,
    textColor: '#ffffff',
    trackTextShadow: '0 0 12px #fff, 0 0 24px #ff0'
  }
};

// ===============================
// Apply theme
// ===============================
function applyTheme(themeKey) {
  const theme = themes[themeKey];
  if (!theme) return;

  cdPlayerView.style.background = theme.background;

  if (staticMode) {
    // 🔥 STATIC / LOW POWER MODE
    cdPlayerView.style.animation = 'none';
    cdPlayerView.style.backgroundSize = '100% 100%';
    cdPlayerView.style.backgroundPosition = '50% 50%';
    cdPlayerView.style.filter = 'none';
    cdPlayerView.style.transform = 'none';
  } else {
    // 🌈 FULL ANIMATED MODE
    cdPlayerView.style.backgroundSize = '200% 200%';

    let animations =
      'breathing 5s ease-in-out infinite,' +
      'drift 400s linear infinite,' +
      'wobble 12s ease-in-out infinite';

    if (themeKey === 'rainbow-shift') {
      animations += ', rainbowFlow 75s linear infinite';
    }

    cdPlayerView.style.animation = animations;
  }

  const trackText = document.getElementById('playerTrackText');
  if (trackText) {
    trackText.style.color = theme.textColor;
    trackText.style.textShadow = theme.trackTextShadow;
  }

  const closeBtn = document.getElementById('closeCdPlayerView');
  if (closeBtn) {
    closeBtn.style.color = theme.textColor;
  }
}

// ===============================
// Static mode toggle
// ===============================
staticModeBtn.addEventListener('click', () => {
  staticMode = !staticMode;
  staticModeBtn.classList.toggle('active', staticMode);
  staticModeBtn.textContent = staticMode ? 'STATIC ON' : 'STATIC';
  applyTheme(themeSelect.value);
});

// ===============================
// Theme selector
// ===============================
themeSelect.addEventListener('change', (e) => {
  applyTheme(e.target.value);
});

// Init
applyTheme(themeSelect.value);

// ===============================
// Animations
// ===============================
const style = document.createElement('style');
style.textContent = `
@keyframes breathing {
  0% { filter: brightness(1) contrast(1) saturate(1); }
  50% { filter: brightness(1.25) contrast(1.1) saturate(1.2); }
  100% { filter: brightness(1) contrast(1) saturate(1); }
}

@keyframes drift {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}

@keyframes wobble {
  0% { transform: translate(0,0); }
  50% { transform: translate(0.4px,-0.4px); }
  100% { transform: translate(0,0); }
}

@keyframes rainbowFlow {
  0% { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
}
`;
document.head.appendChild(style);
