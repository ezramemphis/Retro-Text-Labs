

console.log("🔥 cd.js LOADED");




/* =========================================================
   CD LIBRARY
========================================================= */

const CD_LIBRARY = {
  cd1: {
    id: "cd1",
    title: "Bach's Greatest Hits", // updated title
    artist: "Johann Sebastian Bach", // artist name
    art: "images/CD/bach.jpg",
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
    title: "Beethoven's Greatest Hits", // updated title
    artist: "Ludwig van Beethoven", 
    art: "images/CD/beethoven.jpg",
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
  title: "Modular Synthesis",
  art: "images/CD/cd3.JPG",
  tracks: [
    { title: "Symphony No. 40 in G Minor", src: "music/cd3/01.mp3" },
    { title: "Eine kleine Nachtmusik", src: "music/cd3/02.mp3" }
  ]
},
  cd4: {
  id: "cd4",
  title: "Jazz with Levi Bennett",
  artist: "Levi Bennett", 
  art: "images/CD/cd4.JPG",
  tracks: [
    { title: "Caravan - featuring Levi Bennett", src: "music/cd4/caravan-retro.mp3" },
    { title: "Bug's Interlude", src: "music/cd4/bugs-interlude-retro.mp3" },
    { title: "Autumn in New York - featuring Levi Bennett", src: "music/cd4/autumn-in-new-york-retro.mp3" },
    { title: "Lady Bird - featuring Levi Bennett", src: "music/cd4/lady-bird-retro.mp3" },
    { title: "Billie's Bounce - featuring Levi Bennett", src: "music/cd4/retro-billies-bounce.mp3" },
    { title: "Some Jazz Piano with Levi", src: "music/cd4/retro-jazz-piano1.mp3" }
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

  el.textContent = String(CDPlayer.currentTrackIndex + 1).padStart(2, "0");
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

  if (!CDPlayer.currentCD || !cdEl || !trackEl || !titleEl || !artistEl) return;

  // Update CD artwork
  cdEl.style.backgroundImage = `url(${CDPlayer.currentCD.art})`;

  // Update CD title
  titleEl.textContent = CDPlayer.currentCD.title;
  titleEl.style.opacity = 0;
  titleEl.offsetHeight; // trigger reflow
  titleEl.style.animation = "fadeIn 0.6s forwards";

  // Update artist name
  artistEl.textContent = CDPlayer.currentCD.artist || "";
  artistEl.style.opacity = 0;
  artistEl.offsetHeight; // trigger reflow
  artistEl.style.animation = "fadeIn 0.6s forwards";

  // Update track info
  const currentTrack = CDPlayer.currentCD.tracks[CDPlayer.currentTrackIndex];
  if (currentTrack) {
    trackEl.textContent = `Track ${CDPlayer.currentTrackIndex + 1}: ${currentTrack.title}`;
    trackEl.style.opacity = 0;
    trackEl.offsetHeight; // trigger reflow
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
