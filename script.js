const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
resize()
window.addEventListener("resize", resize)

// Hex to HSL Helper

function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if(max !== min){
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return { h, s, l };
}



//Background image 

const bgType = document.getElementById("bgType")
const bgColor = document.getElementById("bgColor")
const bgGradient = document.getElementById("bgGradient")
const bgImageInput = document.getElementById("bgImage")
let bgImage = null

bgImageInput.addEventListener("change", e => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = function(evt) {
    const img = new Image()
    img.src = evt.target.result
    img.onload = () => { bgImage = img }
  }
  reader.readAsDataURL(file)
})

function drawBackground() {
  const w = canvas.width;
  const h = canvas.height;

  // Base colors
  let color1 = bgColor.value;
  const color2 = bgGradient.value;

  // Apply LFO 0 to primary color hue
  const lfo = lfos[0]; // first LFO controls hue
  const baseHSL = hexToHSL(color1);
  const hueShift = (lfo.value + 1) / 2; // map [-1,1] → [0,1]
  const modHue = (baseHSL.h + hueShift) % 1;
  color1 = `hsl(${modHue*360}, ${baseHSL.s*100}%, ${baseHSL.l*100}%)`;

  switch(bgType.value) {
    case "solidColor":
      ctx.fillStyle = color1
      ctx.fillRect(0, 0, w, h)
      break

    case "gradient":
      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, color1)
      grad.addColorStop(1, color2)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
      break

    // Patterns
    case "checkerboard":
      const size = 50
      for(let y=0; y<h; y+=size){
        for(let x=0; x<w; x+=size){
          ctx.fillStyle = ((x/size + y/size) % 2 === 0) ? color1 : color2
          ctx.fillRect(x,y,size,size)
        }
      }
      break

    case "stripes":
      const stripeH = 20
      for(let i=0;i<h;i+=stripeH){
        ctx.fillStyle = (i/stripeH % 2 === 0) ? color1 : color2
        ctx.fillRect(0,i,w,stripeH)
      }
      break

    case "dots":
      const dotSpacing = 30
      ctx.fillStyle = color2
      ctx.fillRect(0,0,w,h)
      ctx.fillStyle = color1
      for(let x=0;x<w;x+=dotSpacing){
        for(let y=0;y<h;y+=dotSpacing){
          ctx.beginPath()
          ctx.arc(x,y,5,0,Math.PI*2)
          ctx.fill()
        }
      }
      break

    case "diagonalLines":
      ctx.fillStyle = color2
      ctx.fillRect(0,0,w,h)
      ctx.strokeStyle = color1
      ctx.lineWidth = 2
      for(let i=-h;i<w;i+=20){
        ctx.beginPath()
        ctx.moveTo(i,0)
        ctx.lineTo(i+h,h)
        ctx.stroke()
      }
      break

    case "grid":
      ctx.fillStyle = color2
      ctx.fillRect(0,0,w,h)
      ctx.strokeStyle = color1
      ctx.lineWidth = 1
      for(let i=0;i<w;i+=40){
        ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,h); ctx.stroke()
      }
      for(let j=0;j<h;j+=40){
        ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(w,j); ctx.stroke()
      }
      break

    case "waves":
      ctx.fillStyle = color2
      ctx.fillRect(0,0,w,h)
      ctx.strokeStyle = color1
      ctx.lineWidth = 2
      for(let y=0;y<h;y+=20){
        ctx.beginPath()
        for(let x=0;x<w;x+=5){
          ctx.lineTo(x, y + Math.sin(x/20 + time*2)*10)
        }
        ctx.stroke()
      }
      break

    case "radialRays":
      ctx.fillStyle = color2
      ctx.fillRect(0,0,w,h)
      ctx.strokeStyle = color1
      for(let i=0;i<360;i+=10){
        ctx.beginPath()
        ctx.moveTo(w/2,h/2)
        const angle = i*Math.PI/180
        ctx.lineTo(w/2 + Math.cos(angle)*w, h/2 + Math.sin(angle)*h)
        ctx.stroke()
      }
      break

    case "hexagon":
      const hexSize = 40
      ctx.fillStyle = color2
      ctx.fillRect(0,0,w,h)
      ctx.strokeStyle = color1
      ctx.lineWidth = 2
      for(let y=0;y<h+hexSize;y+=hexSize*1.5){
        for(let x=0;x<w+hexSize;x+=hexSize*Math.sqrt(3)){
          ctx.beginPath()
          for(let k=0;k<6;k++){
            const angle = Math.PI/3*k
            const px = x + hexSize*Math.cos(angle)
            const py = y + hexSize*Math.sin(angle)
            if(k===0) ctx.moveTo(px,py)
            else ctx.lineTo(px,py)
          }
          ctx.closePath()
          ctx.stroke()
        }
      }
      break

    case "spiral":
      ctx.fillStyle = color2
      ctx.fillRect(0,0,w,h)
      ctx.strokeStyle = color1
      ctx.lineWidth = 2
      ctx.beginPath()
      for(let i=0;i<360*5;i+=5){
        const angle = i*Math.PI/180
        const r = i*2
        ctx.lineTo(w/2 + Math.cos(angle)*r, h/2 + Math.sin(angle)*r)
      }
      ctx.stroke()
      break

      case "triangles":
  const triSize = 60;
  for(let y=0;y<h;y+=triSize){
    for(let x=0;x<w;x+=triSize){
      ctx.fillStyle = (Math.random()<0.5)?color1:color2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + triSize, y);
      ctx.lineTo(x + triSize/2, y + triSize);
      ctx.closePath();
      ctx.fill();
    }
  }
  break;

case "zigzag":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1;
  ctx.lineWidth = 2;
  for(let y=0;y<h;y+=20){
    ctx.beginPath();
    for(let x=0;x<w;x+=20){
      ctx.lineTo(x, y + ((x/20)%2===0?0:10));
    }
    ctx.stroke();
  }
  break;

case "concentricCircles":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1;
  for(let r=20;r<Math.max(w,h);r+=40){
    ctx.beginPath();
    ctx.arc(w/2,h/2,r,0,Math.PI*2);
    ctx.stroke();
  }
  break;

case "nestedSquares":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1;
  for(let s=0;s<Math.min(w,h)/2;s+=30){
    ctx.strokeRect(w/2-s, h/2-s, s*2, s*2);
  }
  break;

case "crosshatch":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1;
  for(let i=0;i<w+h;i+=20){
    ctx.beginPath();
    ctx.moveTo(i,0);
    ctx.lineTo(0,i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w-i,0);
    ctx.lineTo(w,h-i);
    ctx.stroke();
  }
  break;

case "diamondGrid":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1;
  for(let y=0;y<h;y+=40){
    for(let x=0;x<w;x+=40){
      ctx.beginPath();
      ctx.moveTo(x, y+20);
      ctx.lineTo(x+20,y);
      ctx.lineTo(x+40,y+20);
      ctx.lineTo(x+20,y+40);
      ctx.closePath();
      ctx.stroke();
    }
  }
  break;

case "radialDots":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.fillStyle = color1;
  for(let r=20;r<Math.max(w,h);r+=40){
    for(let a=0;a<360;a+=30){
      const rad = a*Math.PI/180;
      ctx.beginPath();
      ctx.arc(w/2 + Math.cos(rad)*r, h/2 + Math.sin(rad)*r, 5, 0, Math.PI*2);
      ctx.fill();
    }
  }
  break;

case "curvedStripes":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1;
  ctx.lineWidth = 2;
  for(let i=0;i<w;i+=40){
    ctx.beginPath();
    for(let y=0;y<h;y+=5){
      ctx.lineTo(i + Math.sin(y/20)*20, y);
    }
    ctx.stroke();
  }
  break;

case "mesh":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1;
  ctx.lineWidth = 1;
  for(let i=0;i<w;i+=20){
    for(let j=0;j<h;j+=20){
      ctx.beginPath();
      ctx.moveTo(i,j);
      ctx.lineTo(i+10,j+20);
      ctx.stroke();
    }
  }
  break;

case "starburst":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1;
  for(let i=0;i<360;i+=10){
    ctx.beginPath();
    ctx.moveTo(w/2,h/2);
    const angle = i*Math.PI/180;
    ctx.lineTo(w/2 + Math.cos(angle)*w, h/2 + Math.sin(angle)*h);
    ctx.stroke();
  }
  break;

case "maze":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1;
  ctx.lineWidth = 2;
  for(let y=0;y<h;y+=40){
    for(let x=0;x<w;x+=40){
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(x+Math.random()*40, y);
      ctx.lineTo(x+Math.random()*40, y+40);
      ctx.stroke();
    }
  }
  break;

case "waveGrid":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1;
  ctx.lineWidth = 2;
  for(let y=0;y<h;y+=40){
    ctx.beginPath();
    for(let x=0;x<w;x+=5){
      ctx.lineTo(x, y + Math.sin(x/20)*10);
    }
    ctx.stroke();
  }
  break;

case "circuit":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1;
  ctx.lineWidth = 1;
  for(let i=0;i<100;i++){
    const x = Math.random()*w;
    const y = Math.random()*h;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x + Math.random()*50, y + Math.random()*50);
    ctx.stroke();
  }
  break;

case "randomTriangles":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  for(let i=0;i<50;i++){
    ctx.fillStyle = (Math.random()<0.5)?color1:color2;
    const x = Math.random()*w;
    const y = Math.random()*h;
    const size = 20 + Math.random()*40;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+size,y);
    ctx.lineTo(x+size/2, y+size);
    ctx.closePath();
    ctx.fill();
  }
  break;

case "overlappingCircles":
  ctx.fillStyle = color2;
  ctx.fillRect(0,0,w,h);
  ctx.fillStyle = color1;
  for(let i=0;i<50;i++){
    const x = Math.random()*w;
    const y = Math.random()*h;
    const r = 10 + Math.random()*30;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  }
  break;

  case "sineGrid":
  ctx.fillStyle = color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = color1; ctx.lineWidth = 1;
  for(let y=0;y<h;y+=20){
    ctx.beginPath();
    for(let x=0;x<w;x+=5){
      ctx.lineTo(x, y + Math.sin(x/10 + y/20)*10);
    }
    ctx.stroke();
  }
  break;

case "hexWave":
  const hexS = 30;
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1; ctx.lineWidth=1;
  for(let y=0;y<h+hexS;y+=hexS*1.5){
    for(let x=0;x<w+hexS;x+=hexS*Math.sqrt(3)){
      ctx.beginPath();
      for(let k=0;k<6;k++){
        const a=Math.PI/3*k;
        const px = x+hexS*Math.cos(a);
        const py = y+hexS*Math.sin(a)+Math.sin(time+k)*5;
        if(k===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  break;

case "circlesOverlap":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.fillStyle=color1;
  for(let i=0;i<60;i++){
    const x=Math.random()*w, y=Math.random()*h, r=5+Math.random()*40;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  }
  break;

case "triangleMesh":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  for(let i=0;i<60;i++){
    ctx.fillStyle=(Math.random()<0.5)?color1:color2;
    const x=Math.random()*w, y=Math.random()*h, size=20+Math.random()*40;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+size,y);
    ctx.lineTo(x+size/2,y+size);
    ctx.closePath();
    ctx.fill();
  }
  break;

case "radialGrid":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1;
  for(let r=20;r<Math.max(w,h);r+=40){
    for(let a=0;a<360;a+=20){
      const rad=a*Math.PI/180;
      ctx.beginPath();
      ctx.moveTo(w/2,h/2);
      ctx.lineTo(w/2+Math.cos(rad)*r,h/2+Math.sin(rad)*r);
      ctx.stroke();
    }
  }
  break;

case "concentricPolygons":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1;
  for(let s=10;s<Math.min(w,h)/2;s+=30){
    const sides = 3 + (s/10|0);
    ctx.beginPath();
    for(let k=0;k<sides;k++){
      const angle=(Math.PI*2/sides)*k;
      ctx.lineTo(w/2+Math.cos(angle)*s,h/2+Math.sin(angle)*s);
    }
    ctx.closePath();
    ctx.stroke();
  }
  break;

case "checkerLines":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1; ctx.lineWidth=2;
  for(let y=0;y<h;y+=40){
    ctx.beginPath();
    for(let x=0;x<w;x+=40){
      ctx.moveTo(x,y); ctx.lineTo(x+40,y+40);
      ctx.moveTo(x+40,y); ctx.lineTo(x,y+40);
    }
    ctx.stroke();
  }
  break;

case "wobbleStripes":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1; ctx.lineWidth=2;
  for(let i=0;i<h;i+=20){
    ctx.beginPath();
    for(let x=0;x<w;x+=5){
      ctx.lineTo(x, i + Math.sin(x/10+time)*10);
    }
    ctx.stroke();
  }
  break;

case "pixelMaze":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.fillStyle=color1;
  for(let y=0;y<h;y+=20){
    for(let x=0;x<w;x+=20){
      if(Math.random()<0.5) ctx.fillRect(x,y,20,20);
    }
  }
  break;

case "spiralDots":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.fillStyle=color1;
  for(let i=0;i<360*5;i+=10){
    const angle=i*Math.PI/180, r=i*2;
    ctx.beginPath();
    ctx.arc(w/2 + Math.cos(angle)*r, h/2 + Math.sin(angle)*r, 4,0,Math.PI*2);
    ctx.fill();
  }
  break;

case "diamondRipples":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1; ctx.lineWidth=2;
  for(let y=0;y<h;y+=40){
    for(let x=0;x<w;x+=40){
      ctx.beginPath();
      ctx.moveTo(x+20,y); ctx.lineTo(x+40,y+20);
      ctx.lineTo(x+20,y+40); ctx.lineTo(x,y+20);
      ctx.closePath();
      ctx.stroke();
    }
  }
  break;

case "circleRings":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1;
  for(let r=20;r<Math.max(w,h);r+=40){
    ctx.beginPath();
    ctx.arc(w/2,h/2,r,0,Math.PI*2);
    ctx.stroke();
  }
  break;

case "zigDots":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.fillStyle=color1;
  for(let y=0;y<h;y+=20){
    for(let x=0;x<w;x+=20){
      if((x+y)/20%2===0){
        ctx.beginPath();
        ctx.arc(x,y,5,0,Math.PI*2);
        ctx.fill();
      }
    }
  }
  break;

case "hexStars":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1;
  for(let y=0;y<h;y+=60){
    for(let x=0;x<w;x+=60){
      ctx.beginPath();
      for(let k=0;k<6;k++){
        const angle=Math.PI/3*k;
        ctx.lineTo(x+30+Math.cos(angle)*20, y+30+Math.sin(angle)*20);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  break;

case "waveTriangles":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1;
  ctx.lineWidth=2;
  for(let i=0;i<h;i+=20){
    for(let x=0;x<w;x+=20){
      ctx.beginPath();
      ctx.moveTo(x,i+Math.sin(x/20)*10);
      ctx.lineTo(x+10,i+20);
      ctx.lineTo(x+20,i+Math.sin(x/20)*10);
      ctx.closePath();
      ctx.stroke();
    }
  }
  break;

case "randomLines":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1;
  for(let i=0;i<100;i++){
    ctx.beginPath();
    ctx.moveTo(Math.random()*w, Math.random()*h);
    ctx.lineTo(Math.random()*w, Math.random()*h);
    ctx.stroke();
  }
  break;

case "tunnel":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1; ctx.lineWidth=1;
  for(let i=0;i<360;i+=10){
    ctx.beginPath();
    const angle=i*Math.PI/180, r=i*3;
    ctx.arc(w/2,h/2,r,0,Math.PI*2);
    ctx.stroke();
  }
  break;

case "nestedCircles":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1;
  for(let r=20;r<Math.min(w,h)/2;r+=20){
    ctx.beginPath();
    ctx.arc(w/2,h/2,r,0,Math.PI*2);
    ctx.stroke();
  }
  break;

case "diamondWaves":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=color1;
  ctx.lineWidth=2;
  for(let y=0;y<h;y+=40){
    ctx.beginPath();
    for(let x=0;x<w;x+=5){
      ctx.lineTo(x, y + Math.sin(x/15 + time)*10);
    }
    ctx.stroke();
  }
  break;

case "glitchSquares":
  ctx.fillStyle=color2; ctx.fillRect(0,0,w,h);
  for(let i=0;i<50;i++){
    ctx.fillStyle=(Math.random()<0.5)?color1:color2;
    const x=Math.random()*w, y=Math.random()*h;
    const s=10+Math.random()*30;
    ctx.fillRect(x+Math.random()*5,y+Math.random()*5,s,s);
  }
  break;


    case "image":
      if(bgImage) ctx.drawImage(bgImage,0,0,w,h)
      else ctx.fillStyle=color1
      ctx.fillRect(0,0,w,h)
      break

    default:
      ctx.fillStyle = color1
      ctx.fillRect(0,0,w,h)
  }
}

// ================= LFO SYSTEM =================

const LFO_COUNT = 5;

const lfos = Array.from({ length: LFO_COUNT }, () => ({
  rate: 1.0,             // default 1 Hz
  waveform: "sine",
  phase: 0,
  value: 0,
  scope: null
}));


let lastLFOTime = performance.now();

function lfoWave(wave, phase) {
  const t = phase % 1;

  switch (wave) {
    case "sine":     return Math.sin(t * Math.PI * 2);
    case "triangle": return 1 - 4 * Math.abs(t - 0.5);
    case "saw":      return 2 * t - 1;
    case "square":   return t < 0.5 ? 1 : -1;
    default:         return 0;
  }
}

function updateLFOs(ts) {
  const delta = (ts - lastLFOTime) / 1000;
  lastLFOTime = ts;

  lfos.forEach(lfo => {
    lfo.phase += delta * lfo.rate;
    lfo.value = lfoWave(lfo.waveform, lfo.phase);
  });
}


// Controls
const textInput = document.getElementById("textInput")
const fontSelect = document.getElementById("fontSelect")
const colorInput = document.getElementById("colorInput")
const speedInput = document.getElementById("speedInput")
const depthInput = document.getElementById("depthInput")
const wobbleInput = document.getElementById("wobbleInput")
const pixelInput = document.getElementById("pixelInput")
const fpsInput = document.getElementById("fpsInput")
const toggleSpin = document.getElementById("toggleSpin")
const modeSelect = document.getElementById("modeSelect")

let time = 0
let running = true
let lastFrame = 0

// ====== ANIMATION MODES ======
const modes = {
  orbit: (i, t, d) => ({
    x: Math.cos(t + i) * d,
    y: Math.sin(t + i) * d,
    z: Math.sin(t + i) * d
  }),

  sphere: (i, t, d) => ({
    x: Math.cos(t + i) * Math.cos(i) * d,
    y: Math.sin(i) * d,
    z: Math.sin(t + i) * Math.cos(i) * d
  }),

  helix: (i, t, d) => ({
    x: Math.cos(t + i) * d,
    y: (i - 5) * 20,
    z: Math.sin(t + i) * d
  }),

  wave: (i, t, d) => ({
    x: (i - 4) * 60,
    y: Math.sin(t * 2 + i) * d,
    z: Math.cos(t + i) * d
  }),

  spiral: (i, t, d) => {
    const r = d * (i / 6)
    return {
      x: Math.cos(t + i) * r,
      y: Math.sin(t + i) * r,
      z: r
    }
  },

  jitter: (i, t, d) => ({
    x: (i - 4) * 60 + Math.random() * 20,
    y: Math.random() * 20,
    z: Math.random() * d
  }),

  collapse: (i, t, d) => ({
    x: Math.cos(t) * (d - i * 20),
    y: Math.sin(t) * (d - i * 20),
    z: d - i * 30
  }),

  explode: (i, t, d) => ({
    x: Math.cos(i) * t * d,
    y: Math.sin(i) * t * d,
    z: t * d
  }),

  tunnel: (i, t, d) => ({
    x: Math.cos(i) * d,
    y: Math.sin(i) * d,
    z: (t * 200 + i * 80) % 400
  }),

  orbitStack: (i, t, d) => ({
    x: Math.cos(t + i) * d,
    y: Math.sin(i * 2) * 40,
    z: Math.sin(t + i) * d
  })
}

// Populate dropdown (20+ by cloning variants)
Object.keys(modes).forEach(m => {
  const opt = document.createElement("option")
  opt.value = m
  opt.textContent = m
  modeSelect.appendChild(opt)
})

// Get effect controls
const bgDepthInput = document.getElementById("bgDepth")
const glowBlurInput = document.getElementById("glowBlur")
const enableTrails = document.getElementById("enableTrails")
const trailAlphaInput = document.getElementById("trailAlpha")
const rotationAmountInput = document.getElementById("rotationAmount")

function drawText3D() {
  const text = textInput.value
  const cx = canvas.width / 2
  const cy = canvas.height / 2
  const depth = parseInt(depthInput.value)
  const wobble = parseInt(wobbleInput.value)
  const depthShadow = parseInt(bgDepthInput.value)
  const glowBlur = parseInt(glowBlurInput.value)
  const rotationAmount = parseFloat(rotationAmountInput.value)
  const trailAlpha = parseFloat(trailAlphaInput.value)
  const trailsEnabled = enableTrails.checked

  ctx.font = `72px ${fontSelect.value}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  const letters = []

  for (let i = 0; i < text.length; i++) {
    const pos = modes[modeSelect.value](i, time, depth)
    letters.push({
      char: text[i],
      x: pos.x,
      y: pos.y + Math.sin(time * 3 + i) * wobble,
      z: pos.z
    })
  }

  // Depth sort
  letters.sort((a, b) => a.z - b.z)

  // Trailing / fade effect
  if (trailsEnabled) {
    ctx.fillStyle = `rgba(0,0,0,${trailAlpha})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  letters.forEach(l => {
    const scale = 1 + l.z / 400
    ctx.save()
    ctx.translate(cx + l.x, cy + l.y)
    ctx.scale(scale, scale)

    // Global alpha for depth effect
    const alpha = Math.max(0.2, Math.min(1, scale))
    ctx.globalAlpha = alpha

    // -------------------------
    // GLOW / DEPTH SHADOW
    // -------------------------
    ctx.shadowColor = colorInput.value
    ctx.shadowBlur = glowBlur
    ctx.fillStyle = colorInput.value
    ctx.fillText(l.char, depthShadow / 50, depthShadow / 50) // depth offset
    ctx.fillText(l.char, 0, 0)
    ctx.shadowBlur = 0

    // -------------------------
    // EXTRA WOBBLE / ROTATION
    // -------------------------
    ctx.rotate(Math.sin(time * 2 + l.z / 50) * rotationAmount)
    ctx.restore()
  })
}


// CRT AND VHS EFFECTS

// Get the controls
const enableCRT = document.getElementById("enableCRT")
const crtStepInput = document.getElementById("crtStep")
const rgbShiftProbInput = document.getElementById("rgbShiftProb")
const scanlineDarkInput = document.getElementById("scanlineDark")
const distortAmountInput = document.getElementById("distortAmount")

const hJitterInput = document.getElementById("hJitter")
const vRollInput = document.getElementById("vRoll")
const colorBleedInput = document.getElementById("colorBleed")
const vhsNoiseInput = document.getElementById("vhsNoise")
const tapeWarpInput = document.getElementById("tapeWarp")
const lineTearInput = document.getElementById("lineTear")
const chromaOffsetInput = document.getElementById("chromaOffset")
const signalDropInput = document.getElementById("signalDrop")


function crtEffect() {
  if (!enableCRT.checked) return

  const step = parseInt(crtStepInput.value)
  const rgbProb = parseFloat(rgbShiftProbInput.value)
  const scanDark = parseFloat(scanlineDarkInput.value)
  const distort = parseFloat(distortAmountInput.value)

  const hJitter = parseFloat(hJitterInput.value)
  const vRoll = parseFloat(vRollInput.value)
  const bleed = parseFloat(colorBleedInput.value)
  const noise = parseFloat(vhsNoiseInput.value)
  const warp = parseFloat(tapeWarpInput.value)
  const tearProb = parseFloat(lineTearInput.value)
  const chroma = parseFloat(chromaOffsetInput.value)
  const dropout = parseFloat(signalDropInput.value)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const w = canvas.width

  for (let i = 0; i < data.length; i += step) {
    const px = i / 4
    const x = px % w
    const y = Math.floor(px / w)

    // -----------------------
    // SCANLINES
    // -----------------------
    if (y % 2 === 0) {
      data[i] *= 1 - scanDark
      data[i+1] *= 1 - scanDark
      data[i+2] *= 1 - scanDark
    }

    // -----------------------
    // RGB RANDOM SHIFT
    // -----------------------
    if (Math.random() < rgbProb) {
      data[i] = data[i + 1]
    }

    // -----------------------
    // COLOR BLEED (horizontal smear)
    // -----------------------
    if (x > bleed) {
      data[i] = (data[i] + data[i - 4 * bleed]) * 0.5
    }

    // -----------------------
    // VHS NOISE
    // -----------------------
    if (Math.random() < noise) {
      const n = (Math.random() - 0.5) * 255
      data[i] += n
      data[i+1] += n
      data[i+2] += n
    }

    // -----------------------
    // CHROMATIC OFFSET
    // -----------------------
    if (x + chroma < w) {
      data[i] = data[i + 4 * chroma] || data[i]
    }

    // -----------------------
    // SIGNAL DROPOUT
    // -----------------------
    if (Math.random() < dropout) {
      data[i] *= 0.1
      data[i+1] *= 0.1
      data[i+2] *= 0.1
    }

    // -----------------------
    // RANDOM DISTORTION
    // -----------------------
    data[i] += (Math.random() - 0.5) * distort
  }

  ctx.putImageData(imageData, 0, vRoll)

  // -----------------------
  // HORIZONTAL JITTER + TAPE WARP
  // -----------------------
  ctx.save()
  ctx.globalAlpha = 1
  ctx.translate(
    Math.sin(time * 10) * hJitter,
    Math.sin(time * 2) * warp
  )
  ctx.drawImage(canvas, 0, 0)
  ctx.restore()

  // -----------------------
  // LINE TEARS
  // -----------------------
  if (Math.random() < tearProb) {
    const tearY = Math.random() * canvas.height
    ctx.drawImage(
      canvas,
      0, tearY, canvas.width, 5,
      Math.random() * 30 - 15, tearY, canvas.width, 5
    )
  }
}



// ====== RETRO POST FX ======
function pixelate() {
  const p = parseInt(pixelInput.value)
  if (p <= 1) return

  const w = canvas.width / p
  const h = canvas.height / p

  const temp = document.createElement("canvas")
  temp.width = w
  temp.height = h
  const tctx = temp.getContext("2d")
  tctx.imageSmoothingEnabled = false
  tctx.drawImage(canvas, 0, 0, w, h)

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(temp, 0, 0, canvas.width, canvas.height)
}


// Background Music

// === Elements ===
const bgMusic = document.getElementById("bgMusic");
const mobileMusic = document.getElementById("mobileMusic");

// === Track List ===
const backgroundTracks = [
  "./music/Life-at-sea-Knobs.mp3", // Always first
  "./music/neptune.wav",
  "./music/10-Fax.mp3",
  "./music/Transmitter-Spacetime-Continuum.mp3",
  "./music/Amygdala-JakoJako.mp3"
];

// === Mobile Detection ===
const isMobileBlocked = window.matchMedia("(max-width: 1024px)").matches;

// === Background Music Logic ===
let isFirstTrack = true;

function playBackgroundMusic() {
  let track;

  if (isFirstTrack) {
    track = backgroundTracks[0]; // Always play first
    isFirstTrack = false;
  } else {
    const remainingTracks = backgroundTracks.slice(1);
    track = remainingTracks[Math.floor(Math.random() * remainingTracks.length)];
  }

  bgMusic.src = track;
  bgMusic.volume = 0.25;
  bgMusic.loop = false;

  bgMusic.play().catch(() => {
    // Autoplay blocked until user interaction
    document.addEventListener("click", resumeBgMusic, { once: true });
  });

  bgMusic.onended = playBackgroundMusic;
}

function resumeBgMusic() {
  bgMusic.play().catch(() => {});
}

// === Mobile Music Logic ===
function playMobileMusic() {
  mobileMusic.volume = 0.3;
  mobileMusic.loop = true;
  mobileMusic.src = "./music/Antibes-RTF-July-1963-autumn-leaves.mp3";

  mobileMusic.play().catch(() => {
    document.addEventListener("click", () => {
      mobileMusic.play().catch(() => {});
    }, { once: true });
  });
}

// === Decide what to play ===
if (isMobileBlocked) {
  playMobileMusic();
} else {
  playBackgroundMusic();
}


const muteBtn = document.getElementById("muteBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

// Load saved mute status from localStorage
let isMuted = localStorage.getItem("retroTextLabMuted") === "true";

// Apply mute status immediately
bgMusic.volume = isMuted ? 0 : 0.25;
mobileMusic.volume = isMuted ? 0 : 0.3;
muteBtn.textContent = isMuted ? "🔇" : "🔈";

// Mute / Unmute toggle
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;

  // Apply volume
  bgMusic.volume = isMuted ? 0 : 0.25;
  mobileMusic.volume = isMuted ? 0 : 0.3;

  // Save to localStorage
  localStorage.setItem("retroTextLabMuted", isMuted);

  // Update button icon
  muteBtn.textContent = isMuted ? "🔇" : "🔈";
});

// Shuffle next track
shuffleBtn.addEventListener("click", () => {
  if (!isMobileBlocked) {
    // Stop current music immediately
    bgMusic.pause();

    // Play a random track (excluding first track if needed)
    let remainingTracks = backgroundTracks.slice(1);
    let track = remainingTracks[Math.floor(Math.random() * remainingTracks.length)];
    bgMusic.src = track;
    bgMusic.volume = isMuted ? 0 : 0.25;
    bgMusic.play();
  }
});

const bgColorInput = document.getElementById("bgColor");
const bgGradientInput = document.getElementById("bgGradient");
const swapBtn = document.getElementById("swapColors");

swapBtn.addEventListener("click", () => {
  const temp = bgColorInput.value;
  bgColorInput.value = bgGradientInput.value;
  bgGradientInput.value = temp;

  // Hue Shift function

  function hexToHSL(hex) {
  let r = parseInt(hex.substr(1,2),16)/255;
  let g = parseInt(hex.substr(3,2),16)/255;
  let b = parseInt(hex.substr(5,2),16)/255;

  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min) / 2;

  if (max === min) h = s = 0;
  else {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h=(g-b)/d+(g<b?6:0); break;
      case g: h=(b-r)/d+2; break;
      case b: h=(r-g)/d+4; break;
    }
    h /= 6;
  }

  return { h, s, l };
}


  // If you already have a background update function, call it here
  updateBackground?.();
});


// ================= LFO UI =================

const lfoList = document.getElementById("lfoList");

lfos.forEach((lfo, i) => {
  const el = document.createElement("div");
  el.className = "lfo";

  el.innerHTML = `
  <h4>LFO ${i + 1}</h4>

  <canvas width="120" height="40" class="lfo-scope"></canvas>

  <label>
    Rate (<span class="rateVal">${lfo.rate.toFixed(2)}</span> Hz)
    <input type="range" min="0.01" max="20" step="0.01" value="${lfo.rate}">
  </label>

  <label>
    Wave
    <select>
      <option value="sine">Sine</option>
      <option value="triangle">Triangle</option>
      <option value="saw">Saw</option>
      <option value="square">Square</option>
    </select>
  </label>
`;

  const rate = el.querySelector("input");
  const rateSpan = el.querySelector(".rateVal");
  const wave = el.querySelector("select");
  const scope = el.querySelector("canvas");

  rate.oninput = e => {
  lfo.rate = +e.target.value;
  rateSpan.textContent = lfo.rate.toFixed(2); // update the text
};


  wave.onchange = e => lfo.waveform = e.target.value;

  lfo.scope = scope.getContext("2d");

  lfoList.appendChild(el);
});


function drawLFOScope(lfo) {
  if (!lfo.scope) return;

  const ctx = lfo.scope;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = "#ffcc66";
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let x = 0; x < w; x++) {
    const t = x / w;
    const y = lfoWave(lfo.waveform, t + lfo.phase);
    const py = h / 2 - y * (h / 2 - 2);

    if (x === 0) ctx.moveTo(x, py);
    else ctx.lineTo(x, py);
  }

  ctx.stroke();
}





// ====== LOOP ======
function animate(ts) {
  const fps = parseInt(fpsInput.value);

  if (ts - lastFrame < 1000 / fps) {
    requestAnimationFrame(animate);
    return;
  }

  lastFrame = ts;

  // ✅ update LFOs (time-accurate)
  updateLFOs(ts);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawText3D();
  pixelate();
  crtEffect();

  // ✅ draw LFO scopes
  lfos.forEach(drawLFOScope);

  if (running) time += parseFloat(speedInput.value);

  requestAnimationFrame(animate);
}

toggleSpin.onclick = () => running = !running;

requestAnimationFrame(animate);

