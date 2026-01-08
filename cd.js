

console.log("🔥 cd.js LOADED");




/* =========================================================
   CD LIBRARY
========================================================= */

const CD_LIBRARY = {
  cd1: {
    id: "cd1",
    title: "Bach's Greatest Hits", // updated title
    artist: "Johann Sebastian Bach", // artist name
    genre: "Classical", // genre
    art: "images/CD/bach.jpg",
    color: "#db8000ff", // warm classical gold
    startupSound: "assets/cd-start.wav",
    tracks: [
      { title: "Preludium in E Major", src: "music/cd1/01.mp3" },
      { title: "Orchestral Suite No. 3 in D Major, BMV 1068: Air", src: "music/cd1/02.mp3" },
      { title: "Sleepers Awake from Cantata No. 140", src: "music/cd1/03.mp3" },
      { title: "Little Suite (From The Anna Magdalena Notebook)", src: "music/cd1/04.mp3" },
      { title: "Toccata And Fugue In D Minor", src: "music/cd1/05.mp3" },
      { title: "Jesu, Joy Of Man's Desiring", src: "music/cd1/06.mp3" },
      { title: "A Mighty Fortress Is Our God", src: "music/cd1/07.mp3" },
      { title: "Final Movement From Brandenburg Concerto No. 3, In G Major", src: "music/cd1/08.mp3" },      
    ]
  },
  cd2: {
    id: "cd2",
    title: "Chopin's Greatest Hits", // updated title
    artist: "Frédéric Chopin", 
    genre: "Classical",
    art: "images/CD/chopin.jpg",
    color: "#a42b60ff", // warm classical gold
    tracks: [
      { title: "Military Polonaise, Op. 40, No. 1", src: "music/cd2/01.mp3" },
      { title: "Minute Waltz In D-Flat Major, Op. 64, No. 1", src: "music/cd2/02.mp3" },
      { title: "Waltz In C-Sharp Minor, Op. 64, No. 2", src: "music/cd2/03.mp3" },
      { title: "Mazurka In D Major Op. 33, No. 2", src: "music/cd2/04.mp3" },
      { title: "Nocturne In E-Flat Major, Op. 9, No. 2", src: "music/cd2/05.mp3" },
      { title: "Fantasie-Impromptu, Op. 66", src: "music/cd2/06.mp3" },
      { title: "Waltz In G-Flat Major, Op. 70, No. 1", src: "music/cd2/07.mp3" },
      { title: "Prelude In A Major, Op. 28, No. 7", src: "music/cd2/08.mp3" },
      { title: "Polonaise In A-Flat Major, Op. 53", src: "music/cd2/09.mp3" },
      { title: "Etude In E Major, Op. 10, No. 3", src: "music/cd2/10.mp3" },
      { title: "Grande Valse Brillante In E-Flat Major, Op. 18", src: "music/cd2/11.mp3" }
    ]
  },
  cd3: {
  id: "cd3",
  title: "Modular Synthesis Explorations",
  artist: "Ezra Bennett", 
  genre: "Electronic/Alternative",
  art: "images/CD/modular.JPG",
  color: "#71fff3ff", // neon green
  tracks: [
    { title: "Runex", src: "music/cd3/runex.mp3" },
    { title: "Honey Suckle", src: "music/cd3/honey-suckle.mp3" },
    { title: "Lost Again", src: "music/cd3/lost-again.mp3" },
    { title: "Heinous Harry - The Wicked One", src: "music/cd3/harry.mp3" }
  ]
},
  cd4: {
  id: "cd4",
  title: "Jazz with Levi Bennett",
  artist: "Levi Bennett", 
  genre: "Jazz",
  art: "images/CD/levi-cd-cover1.JPG",
  color: "#d4b36a", 
  tracks: [
    { title: "Caravan - featuring Levi Bennett", src: "music/cd4/caravan-retro.mp3" },
    { title: "Bug's Interlude", src: "music/cd4/bugs-interlude-retro.mp3" },
    { title: "Autumn in New York - featuring Levi Bennett", src: "music/cd4/autumn-in-new-york-retro.mp3" },
    { title: "Lady Bird - featuring Levi Bennett", src: "music/cd4/lady-bird-retro.mp3" },
    { title: "Billie's Bounce - featuring Levi Bennett", src: "music/cd4/retro-billies-bounce.mp3" },
    { title: "Some Jazz Piano with Levi", src: "music/cd4/retro-jazz-piano1.mp3" }
    ]
  },
  cd5: {
  id: "cd5",
  title: "Natural Light",
  artist: "Isaac Lourie", 
  genre: "R&B/Indie",
  art: "images/CD/natural-light-cover.png",
  color: "#dedcb5ff", 
  tracks: [
    { title: "Natural Light", src: "music/cd5/01.mp3" },
    { title: "I Wanna Take You There (feat. Jazz Cuti)", src: "music/cd5/02.mp3" },
    { title: "Meadow (Łąka) (feat. Karolina Wilgus)", src: "music/cd5/03.mp3" },
    { title: "Pillars (feat. Srushti Gubbi)", src: "music/cd5/04.mp3" },
    { title: "I'm Good (feat. RICARDO)", src: "music/cd5/05.mp3" },
    { title: "Take Your Time", src: "music/cd5/06.mp3" }
    ]
  },
  cd6: {
  id: "cd6",
  title: "The Road To Hell Is Paved With Good Intentions",
  artist: "Vegyn", 
  genre: "Dance/Electronic",
  art: "images/CD/vegyn.jpg",
  color: "#4fd592ff", 
  tracks: [
    { title: "A Dream Goes On Forever", src: "music/cd6/01.mp3" },
    { title: "Another 9 Days", src: "music/cd6/02.mp3" },
    { title: "Turn Me Inside", src: "music/cd6/03.mp3" },
    { title: "Halo Flip", src: "music/cd6/04.mp3" },
    { title: "Everything Is the Same", src: "music/cd6/05.mp3" },
    { title: "The Path Less Travelled", src: "music/cd6/06.mp3" },
    { title: "Makeshift Tourniquet", src: "music/cd6/07.mp3" },
    { title: "Time Well Spent", src: "music/cd6/08.mp3" },
    { title: "In the Front", src: "music/cd6/09.mp3" },
    { title: "Trust", src: "music/cd6/10.mp3" },
    { title: "Stress Test", src: "music/cd6/11.mp3" },
    { title: "Last Night I Dreamt I Was Alone", src: "music/cd6/12.mp3" },
    { title: "Unlucky for Some...", src: "music/cd6/13.mp3" }
    ]
  },
  cd7: {
  id: "cd7",
  title: "Wave",
  artist: "Antônio Carlos Jobim", 
  genre: "Bossa Nova/Jazz",
  art: "images/CD/wave.jpg",
  color: "#72d184ff", 
  tracks: [
    { title: "Wave", src: "music/cd7/01.mp3" },
    { title: "The Red Blouse", src: "music/cd7/02.mp3" },
    { title: "Look To The Sky", src: "music/cd7/03.mp3" },
    { title: "Batidinha", src: "music/cd7/04.mp3" },
    { title: "Triste", src: "music/cd7/05.mp3" },
    { title: "Mojave", src: "music/cd7/06.mp3" },
    { title: "Dialogo", src: "music/cd7/07.mp3" },
    { title: "Lamento", src: "music/cd7/08.mp3" },
    { title: "Antigua", src: "music/cd7/09.mp3" },
    { title: "Captain Bacardi", src: "music/cd7/10.mp3" }
    ]
  }
};



/* =========================================================
   GLOBAL PLAYER ENGINE
========================================================= */

const CDPlayer = {
  currentCD: null,
  currentTrackIndex: 0,
  isPlaying: false,
  repeat: false,
  trackDelayMs: 2000,
  audio: new Audio(),

  // GLOBAL VOLUME CONTROL (0.0 to 1.0)
  volumeMultiplier: 1.0, // 1.0 is normal volume

  

  loadCD(cdId, startTrack = 0) {
    const cd = CD_LIBRARY[cdId];
    if (!cd) {
      console.warn(`CD "${cdId}" not found in library`);
      return;
    }
    this.currentCD = cd;
    this.currentTrackIndex = startTrack;
    updateTrackDisplay();
    updatePlayerView();
  },

  playTrack(index) {
    if (!this.currentCD) return;

    const track = this.currentCD.tracks[index];
    if (!track) return;

    this.currentTrackIndex = index;
    this.audio.src = track.src;

    // Set volume here
  this.audio.volume = 1.0 * this.volumeMultiplier; // 1.0 is normal volume

    this.audio.play();

    this.isPlaying = true;
    updateTrackDisplay();
    updateTransportUI();
    updatePlayerView();
  },

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    updateTransportUI();
  },

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    updateTransportUI();
  },

  resume() {
  if (!this.currentCD) return;
  this.audio.play();
  this.isPlaying = true;
  updateTransportUI();
},


  nextTrack() {
  if (!this.currentCD) return;

  let next = this.currentTrackIndex + 1;

  if (next >= this.currentCD.tracks.length) {
    if (this.repeat) next = 0;
    else return this.stop();
  }

  this.playTrack(next); // play immediately, no delay
},


  prevTrack() {
    if (!this.currentCD) return;

    let prev = this.currentTrackIndex - 1;
    if (prev < 0) prev = this.currentCD.tracks.length - 1;
    this.playTrack(prev);
  }
};

CDPlayer.audio.addEventListener("ended", () => CDPlayer.nextTrack());

const cdView = document.getElementById("cdPlayerView");
cdView?.classList.add("active");
updatePlayerView();

// Where I wanna control the volume
CDPlayer.volumeMultiplier = 0.5; // 50% volume for all CDs



/* =========================================================
   UTILITIES (SAFE, NO-OP FRIENDLY)
========================================================= */

function playSound(src) {
  if (!src) return;
  const sfx = new Audio(src);
  sfx.play();
}

function animateCDLift() {
  // hook for later animation
}

function closeCDInspector() {
  document.querySelector(".cd-active")?.classList.remove("cd-active");
  document.querySelector(".cd-binder")?.classList.remove("dimmed");
}

function updateTransportUI() {
  const btn = document.getElementById("playPauseBtn");
  if (!btn) return;

  const img = btn.querySelector("img");
  if (!img) return;

  img.src = CDPlayer.isPlaying ? "images/pause-button.PNG" : "images/play-button.PNG";
}


/* =========================================================
   TRACK LIST + DISPLAY
========================================================= */

function renderTrackList(cdId) {
  const list = document.getElementById("trackList");
  if (!list) return;

  list.innerHTML = "";

  const cd = CD_LIBRARY[cdId];
  if (!cd) return;

  cd.tracks.forEach((track, i) => {
    const li = document.createElement("li");
    li.textContent = `Track ${i + 1}`;
    li.onclick = () => startPlaybackSequence(cdId, i);
    list.appendChild(li);
  });
}

function updateTrackDisplay() {
  const el = document.getElementById("trackDisplay");
  if (!el || !CDPlayer.currentCD) return;

  // Get the track number and pad with 0 for single digits
  const numStr = String(CDPlayer.currentTrackIndex + 1).padStart(2, "0");

  // Wrap each digit in a span for fixed spacing
  el.innerHTML = numStr
    .split("")
    .map(digit => `<span class="digit">${digit}</span>`)
    .join("");
}


/* =========================================================
   PLAYBACK SEQUENCE
========================================================= */

function startPlaybackSequence(cdId, trackIndex) {
  const cd = CD_LIBRARY[cdId];
  if (!cd) return;

  playSound(cd.startupSound);
  animateCDLift();

  setTimeout(() => {
    closeCDInspector();
    CDPlayer.loadCD(cdId, trackIndex);
    CDPlayer.playTrack(trackIndex);
  }, 2000);
}

/* =========================================================
   CD PLAYER VIEW + DOM BOOTSTRAP
========================================================= */

function updatePlayerView() {
  const cdEl = document.getElementById("playerCD");
  const trackEl = document.getElementById("playerTrackText");
  const titleEl = document.getElementById("playerCDTitle");
  const artistEl = document.getElementById("playerArtistName");
  const genreEl = document.getElementById("playerGenre");
  const viewEl = document.getElementById("cdPlayerView");

  if (!CDPlayer.currentCD || !viewEl) return;

  // 🎨 Apply CD accent color
  viewEl.style.setProperty(
    "--cd-accent",
    CDPlayer.currentCD.color || "#ffd27d"
  );

  // Artwork
  cdEl.style.backgroundImage = `url(${CDPlayer.currentCD.art})`;

  // Title
  titleEl.textContent = CDPlayer.currentCD.title;
  titleEl.style.animation = "fadeIn 0.6s forwards";

  // Artist
  artistEl.textContent = CDPlayer.currentCD.artist || "";
  artistEl.style.animation = "fadeIn 0.6s forwards";

  // 🎼 Genre
  if (genreEl) {
    genreEl.textContent = CDPlayer.currentCD.genre || "";
    genreEl.style.animation = "fadeIn 0.6s forwards";
  }

  // Track
  const track = CDPlayer.currentCD.tracks[CDPlayer.currentTrackIndex];
  if (track) {
    trackEl.textContent = `Track ${CDPlayer.currentTrackIndex + 1}: ${track.title}`;
    trackEl.style.animation = "fadeIn 0.6s forwards";
  }
}



document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM READY");

  const cds = document.querySelectorAll("[data-cd]");
  let activeCD = null;

  function resetCDs() {
    if (!activeCD) return;
    activeCD.classList.remove("cd-forward");
    cds.forEach(cd => cd.classList.remove("cd-dimmed"));
    activeCD = null;
  }

  // CD click
  cds.forEach(cd => {
    cd.addEventListener("click", e => {
      e.stopPropagation();
      const cdId = cd.dataset.cd;
      if (!CD_LIBRARY[cdId]) return;
      if (activeCD === cd) return;

      resetCDs();
      activeCD = cd;
      cd.classList.add("cd-forward");
      cds.forEach(other => { if (other !== cd) other.classList.add("cd-dimmed"); });

      // Load CD and render tracks
      CDPlayer.loadCD(cdId, 0); // start at first track
      renderTrackList(cdId);
    });
  });

  // Clicking outside closes active CD
  document.addEventListener("click", e => {
    const trackList = document.getElementById("trackList");
    if (!activeCD) return;
    if (activeCD.contains(e.target) || (trackList && trackList.contains(e.target))) return;
    resetCDs();
  });

  /* =====================
     Transport buttons
  ===================== */
  document.getElementById("playPauseBtn")?.addEventListener("click", () => {
    CDPlayer.isPlaying
      ? CDPlayer.pause()
      : CDPlayer.playTrack(CDPlayer.currentTrackIndex);
  });

  document.getElementById("fwdBtn")?.addEventListener("click", () => CDPlayer.nextTrack());
  document.getElementById("rewBtn")?.addEventListener("click", () => CDPlayer.prevTrack());

  document.getElementById("repeatBtn")?.addEventListener("click", e => {
    CDPlayer.repeat = !CDPlayer.repeat;
    e.currentTarget.classList.toggle("active", CDPlayer.repeat);
  });

  // Open CD Player view
  document.getElementById("cdPlayerViewBtn")?.addEventListener("click", () => {
    document.getElementById("cdPlayerView")?.classList.add("show");
  });

  // Close CD Player view
  document.getElementById("closeCdPlayerView")?.addEventListener("click", () => {
    document.getElementById("cdPlayerView")?.classList.remove("show");
  });
});

// Update view automatically whenever a track changes
CDPlayer.audio.addEventListener("ended", () => {
  CDPlayer.nextTrack();
  updatePlayerView();
});

// Ensure view updates when playing or loading CD
["loadCD", "playTrack"].forEach(fn => {
  const orig = CDPlayer[fn];
  CDPlayer[fn] = function(...args) {
    orig.apply(this, args);
    updatePlayerView();
  };
});







/* =========================================================
   PROGRESS BAR LOGIC
========================================================= */

const progressBar = document.getElementById("playerProgressBar");
const progressFill = document.getElementById("playerProgressFill");
const currentTimeEl = document.getElementById("progressCurrentTime");
const durationEl = document.getElementById("progressDuration");

// Update progress while playing
CDPlayer.audio.addEventListener("timeupdate", () => {
  if (!CDPlayer.audio.duration) return;

  const percent =
    (CDPlayer.audio.currentTime / CDPlayer.audio.duration) * 100;

  progressFill.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(CDPlayer.audio.currentTime);
  durationEl.textContent = formatTime(CDPlayer.audio.duration);
});

// Seek when clicking the bar
progressBar.addEventListener("click", e => {
  if (!CDPlayer.audio.duration) return;

  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = clickX / rect.width;

  CDPlayer.audio.currentTime = percent * CDPlayer.audio.duration;
});

// Reset when track changes
CDPlayer.audio.addEventListener("loadedmetadata", () => {
  progressFill.style.width = "0%";
  durationEl.textContent = formatTime(CDPlayer.audio.duration);
  currentTimeEl.textContent = "0:00";
});

// Helper
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}



/* =========================================================
   CD COLLECTION PAGINATION (SAFE VERSION)
========================================================= */

const TOTAL_CDS = 40;
const CDS_PER_PAGE = 8;
const TOTAL_PAGES = Math.ceil(TOTAL_CDS / CDS_PER_PAGE);

let currentPage = 0;

// All CDs that actually exist
const filledCDs = Object.keys(CD_LIBRARY); // ["cd1","cd2",...]

// Grab existing DOM (NO creation)
const allSlots = document.querySelectorAll(".cd-grid .cd");
const pageIndicator = document.getElementById("pageIndicator");
const cdCountIndicator = document.getElementById("cdCountIndicator");

function renderPage(pageIndex) {
  const start = pageIndex * CDS_PER_PAGE;

  allSlots.forEach((cdEl, slotIndex) => {
    const cdNumber = start + slotIndex + 1;
    const cdId = `cd${cdNumber}`;

    if (filledCDs.includes(cdId)) {
      cdEl.dataset.cd = cdId;
    } else {
      cdEl.dataset.cd = "";
    }
  });

  updateIndicators();
}

function updateIndicators() {
  pageIndicator.textContent = `${currentPage + 1} / ${TOTAL_PAGES}`;
  cdCountIndicator.textContent = `${filledCDs.length} / ${TOTAL_CDS} CDs`;
}

/* =====================
   Navigation buttons
===================== */

document.getElementById("pagePrev")?.addEventListener("click", e => {
  e.stopPropagation();
  if (currentPage > 0) {
    currentPage--;
    renderPage(currentPage);
  }
});

document.getElementById("pageNext")?.addEventListener("click", e => {
  e.stopPropagation();
  if (currentPage < TOTAL_PAGES - 1) {
    currentPage++;
    renderPage(currentPage);
  }
});

/* =====================
   Init
===================== */

renderPage(currentPage);



/* =========================================================
   ENHANCED BOTTOM VISUALIZER (CDPlayer.audio) with toggle
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const vizCanvas = document.getElementById("simpleVisualizer");
  const vizCtx = vizCanvas.getContext("2d");

  if (!vizCanvas) {
    console.warn("Visualizer canvas not found");
    return;
  }

  // Start OFF
  let visualizerEnabled = false;
  vizCanvas.style.display = "none";

  const toggleBtn = document.getElementById("toggleVisualizerBtn");

  // Toggle logic
  toggleBtn?.addEventListener("click", () => {
    visualizerEnabled = !visualizerEnabled;
    vizCanvas.style.display = visualizerEnabled ? "block" : "none";
    toggleBtn.textContent = visualizerEnabled ? "Visualizer: On" : "Visualizer: Off";
    toggleBtn.classList.toggle("active", visualizerEnabled);
    resizeViz(); // ensure canvas fits
  });

  // Resize function
  function resizeViz() {
    vizCanvas.width = window.innerWidth;
    vizCanvas.height = vizCanvas.offsetHeight || 60;
  }
  resizeViz();
  window.addEventListener("resize", resizeViz);

  // Web Audio setup
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioCtx();

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;

  const sourceNode = audioCtx.createMediaElementSource(CDPlayer.audio);
  sourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Resume audio context on first user interaction
  function resumeAudioContext() {
    if (audioCtx.state === "suspended") audioCtx.resume();
    window.removeEventListener("click", resumeAudioContext);
  }
  window.addEventListener("click", resumeAudioContext);

  // Helper: CD color
  function getCDColor() {
    return CDPlayer.currentCD?.color || "#ff88ff";
  }

  // Force resize on CD player open or track start
  function forceVizResize() {
    requestAnimationFrame(resizeViz);
  }
  document.getElementById("cdPlayerViewBtn")?.addEventListener("click", forceVizResize);
  const originalPlay = CDPlayer.playTrack;
  CDPlayer.playTrack = function (...args) {
    originalPlay.apply(this, args);
    forceVizResize();
  };

  // Main draw loop
  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    if (!visualizerEnabled) return; // skip if disabled

    analyser.getByteFrequencyData(dataArray);
    vizCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);

    const barWidth = vizCanvas.width / bufferLength;
    let x = 0;

    const color = getCDColor();

    for (let i = 0; i < bufferLength; i++) {
      const boost = 1 + i / bufferLength; // high-end boost
      const value = dataArray[i] * boost;
      const barHeight = Math.min((value / 255) * vizCanvas.height, vizCanvas.height);

      const alpha = 0.25 + (value / 255) * 0.75;
      vizCtx.fillStyle = `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},${alpha})`;
      vizCtx.fillRect(x, vizCanvas.height - barHeight, barWidth - 1, barHeight);

      x += barWidth;
    }
  }

  // Start the loop
  drawVisualizer();
});

