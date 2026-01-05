let frameEnabled = false;

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

  let color1 = bgColor.value;
  const color2 = bgGradient.value;

  // To help the image color burn effect
function safeHexToRGB(hex) {
  if (!hex || hex[0] !== "#" || hex.length !== 7) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}

  // Apply LFO patches
lfos.forEach(lfo => {
  if (!lfo.patch || !lfo.patch.paramSelect) return;

  const target = lfo.patch.paramSelect.value;
  const range = parseFloat(lfo.patch.rangeInput.value);
  const offset = parseFloat(lfo.patch.offsetInput.value);
  const lfoVal = (lfo.value + 1) / 2; // convert [-1,1] → [0,1]
  const modVal = offset + lfoVal * range; // scaled by range and offset

  switch(target) {
    case "Hue: Primary Color":
      const baseHSL = hexToHSL(color1);
      const modHue = (baseHSL.h + modVal) % 1;
      color1 = `hsl(${modHue*360}, ${baseHSL.s*100}%, ${baseHSL.l*100}%)`;
      break;

    case "Hue: Secondary Color":
      const baseHSL2 = hexToHSL(color2);
      const modHue2 = (baseHSL2.h + modVal) % 1;
      color2 = `hsl(${modHue2*360}, ${baseHSL2.s*100}%, ${baseHSL2.l*100}%)`;
      break;

    case "Effects: Glow Strength":
      glowStrength = modVal;
      break;

    case "Animation: Speed":
      animSpeed = modVal;
      break;

    case "Animation: Depth":
      animDepth = modVal;
      break;

    case "Animation: Wobble":
      animWobble = modVal;
      break;

    case "Animation: Pixelation":
      pixelation = modVal;
      break;

    // add more parameters here if needed
  }
});


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

  case "binaryThreshold":
  if (!bgImage) {
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, w, h);
    break;
  }

  // draw image
  ctx.drawImage(bgImage, 0, 0, w, h);

  // read pixels
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const c1 = safeHexToRGB(color1);
  const c2 = safeHexToRGB(color2);

  const threshold = 128;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const brightness =
      0.2126 * r +
      0.7152 * g +
      0.0722 * b;

    if (brightness > threshold) {
      data[i]     = c1.r;
      data[i + 1] = c1.g;
      data[i + 2] = c1.b;
    } else {
      data[i]     = c2.r;
      data[i + 1] = c2.g;
      data[i + 2] = c2.b;
    }
  }

  ctx.putImageData(imgData, 0, 0);
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

    /* === Classic === */
    case "sine":
      return Math.sin(t * Math.PI * 2);

    case "triangle":
      return 1 - 4 * Math.abs(t - 0.5);

    case "saw":
      return 2 * t - 1;

    case "square":
      return t < 0.5 ? 1 : -1;

    /* === New === */

    // 90/10 pulse width (sharp, gated feel)
    case "pulse90":
      return t < 0.9 ? 1 : -1;

    // Exponential curve (slow rise, fast fall)
    case "expo":
      return Math.pow(t, 3) * 2 - 1;

    // Bounce / elastic feel
    case "bounce": {
      const b = Math.abs(Math.sin(t * Math.PI));
      return (1 - Math.pow(b, 3)) * 2 - 1;
    }

    // Granular Saw/ stepped with jitter
    case "granular_saw": {
      const steps = 8; // increase for smoother, lower for choppier
      const stepped = Math.floor(t * steps) / steps;
      const jitter = (Math.random() - 0.5) * 0.15;
      return (stepped + jitter) * 2 - 1;
    }

    case "granular_sine": {
  const wobble = (Math.random() - 0.5) * 0.2;   // phase instability
  const ampJitter = 1 + (Math.random() - 0.5) * 0.1;
  const sine = Math.sin((t + wobble) * Math.PI * 2);
  return sine * ampJitter;
}

case "granular_chaos": {
  const chaos = Math.random() * 2 - 1;
  const smear = Math.sin(t * Math.PI * 2) * 0.3;
  return chaos + smear;
  return (Math.random() - 0.5) * 4; // intentionally exceeds ±1
}



    default:
      return 0;
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

/// We need one universal LFO processor that reads wave types, applies wave-specific params, applies gain & bias, supports modultation inputs. This is the sauce

const LFO = {
  wave: "sine",
  phase: 0,
  rate: 0.1,

  params: {
    pulseWidth: 0.9,
    pump: 3,
    tension: 2,
    chaos: 0.1,
    steps: 8,
    density: 0.05
  },

  gain: 5,   // volts
  bias: 0,   // volts

  modInput: null // for AM / Ring Mod
};

function applyGainBias(signal, gain = 5, bias = 0) {
  return signal * gain + bias;
}

function fourQuadrantVCA(carrier, modulator, mode = "ring") {
  if (!modulator) return carrier;

  switch (mode) {
    case "am":
      return carrier * ((modulator + 1) / 2);
    case "ring":
      return carrier * modulator;
    default:
      return carrier;
  }
}

function processLFO(lfo, deltaTime) {
  lfo.phase += lfo.rate * deltaTime;

  let signal = baseWave(
    lfo.wave,
    lfo.phase,
    lfo.params
  );

  // VCA / modulation
  if (lfo.modInput) {
    signal = fourQuadrantVCA(
      signal,
      lfo.modInput.value,
      lfo.modInput.mode
    );
  }

  // Gain + bias
  return applyGainBias(signal, lfo.gain, lfo.bias);
}



// Visual Patch Cable System Cuz I'm Down wit the sickness

const Cable = {
  from: "LFO_1",
  to: "LFO_2",
  mode: "ring" // or "am"
};

function resolveConnections(lfos, cables) {
  cables.forEach(cable => {
    const source = lfos[cable.from];
    const target = lfos[cable.to];

    target.modInput = {
      value: source.output,
      mode: cable.mode
    };
  });
}

// Dynamic panel that changes per waweform type

const waveParamMap = {
  pulse90: [
    { key: "pulseWidth", label: "Pulse Width", min: 0.05, max: 0.95 }
  ],

  expo: [
    { key: "pump", label: "Pump", min: 0.5, max: 5 }
  ],

  bounce: [
    { key: "tension", label: "Tension", min: 0.5, max: 5 }
  ],

  granular_saw: [
    { key: "steps", label: "Steps", min: 2, max: 32, step: 1 },
    { key: "chaos", label: "Chaos", min: 0, max: 1 }
  ],

  granular_sine: [
    { key: "chaos", label: "Chaos", min: 0, max: 1 }
  ],

  granular_chaos: [
    { key: "density", label: "Density", min: 0, max: 1 }
  ]
};





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


// ===============================
// MUSIC CONTROLLER
// ===============================

// === Elements ===
const bgMusic = document.getElementById("bgMusic");
const mobileMusic = document.getElementById("mobileMusic");
const muteBtn = document.getElementById("muteBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

// === Config ===
const BG_VOLUME = 0.2;       // real quiet background level
const MOBILE_VOLUME = 0.15;

const backgroundTracks = [
  "./music/honey-sucle.mp3", // always first
  "./music/retro-billies-bounce.mp3",
  "./music/mouthful-retro.mp3"
];

const MOBILE_TRACK =
  "./music/Antibes-RTF-July-1963-autumn-leaves.mp3";

// === State ===
const isMobileBlocked = window.matchMedia("(max-width: 1024px)").matches;
let isFirstTrack = true;
let isMuted = localStorage.getItem("retroTextLabMuted") === "true";

// ===============================
// INIT
// ===============================

// Apply base volumes ONCE
bgMusic.volume = BG_VOLUME;
mobileMusic.volume = MOBILE_VOLUME;

// Apply mute ONCE
bgMusic.muted = isMuted;
mobileMusic.muted = isMuted;

// Update button text
muteBtn.textContent = isMuted ? "UNMUTE" : "MUTE";

// ===============================
// DESKTOP BACKGROUND MUSIC
// ===============================
function getNextTrack() {
  if (isFirstTrack) {
    isFirstTrack = false;
    return backgroundTracks[0];
  }

  const remaining = backgroundTracks.slice(1);
  return remaining[Math.floor(Math.random() * remaining.length)];
}

function playBackgroundMusic() {
  bgMusic.src = getNextTrack();
  bgMusic.loop = false;

  // Re-lock mute after src change
  bgMusic.muted = isMuted;

  bgMusic.play().catch(() => {
    document.addEventListener("click", resumeBgMusic, { once: true });
  });
}

function resumeBgMusic() {
  bgMusic.muted = isMuted;
  bgMusic.play().catch(() => {});
}

// Auto-play next track
bgMusic.addEventListener("ended", playBackgroundMusic);

// ===============================
// MOBILE HOLD MUSIC
// ===============================
function playMobileMusic() {
  mobileMusic.src = MOBILE_TRACK;
  mobileMusic.loop = true;
  mobileMusic.muted = isMuted;

  mobileMusic.play().catch(() => {
    document.addEventListener(
      "click",
      () => mobileMusic.play().catch(() => {}),
      { once: true }
    );
  });
}

// ===============================
// START CORRECT SYSTEM
// ===============================
if (isMobileBlocked) {
  playMobileMusic();
} else {
  playBackgroundMusic();
}

// ===============================
// CONTROLS
// ===============================

// Mute toggle
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;

  bgMusic.muted = isMuted;
  mobileMusic.muted = isMuted;

  localStorage.setItem("retroTextLabMuted", isMuted);
  muteBtn.textContent = isMuted ? "UNMUTE" : "MUTE";
});

// Shuffle (desktop only)
shuffleBtn.addEventListener("click", () => {
  if (isMobileBlocked) return;

  bgMusic.pause();
  playBackgroundMusic();
});



// CD Open/Close modal

const cdCollectionBtn = document.getElementById("cdCollectionBtn");
const cdCollectionModal = document.getElementById("cdCollectionModal");
const cdModalClose = cdCollectionModal.querySelector(".close");

cdCollectionBtn.addEventListener("click", () => {
  cdCollectionModal.style.display = "block";
});

cdModalClose.addEventListener("click", () => {
  cdCollectionModal.style.display = "none";
});

// Close modal by clicking outside
window.addEventListener("click", e => {
  if (e.target === cdCollectionModal) cdCollectionModal.style.display = "none";
});



// Show / hide CD burn window
// Grab the CD burn window and the header button
const cdBurnWindow = document.getElementById("cdBurnWindow");
const burnCdBtn = document.getElementById("burnCdBtn");

// Open the CD burn window when header button is clicked
burnCdBtn.addEventListener("click", () => {
  cdBurnWindow.classList.remove("hidden");
});

// Close button inside CD burn window
document.querySelector(".close-cd-window").addEventListener("click", () => {
  cdBurnWindow.classList.add("hidden");
});

// Optional: close the window if you click outside the content (nice touch)
cdBurnWindow.addEventListener("click", e => {
  if (e.target === cdBurnWindow) {
    cdBurnWindow.classList.add("hidden");
  }
});


// Advanced toggle
document.querySelectorAll(".advanced-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const adv = btn.nextElementSibling;
    adv.classList.toggle("hidden");
  });
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
      <option value="pulse90">Pulse 90%</option>
      <option value="expo">Exponential</option>
      <option value="bounce">Bounce</option>
      <option value="granular_saw">Granular Saw</option>
      <option value="granular_sine">Granular Sine</option>
      <option value="granular_chaos">Granular Chaos</option>

    </select>
  </label>

  <div class="wave-params">
    <div class="wave-params-title">Wave Parameters</div>
  </div>
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


// LFO Matrix
const lfoMatrixBody = document.querySelector("#lfoMatrix tbody");

// Single target for now
const targets = ["Primary Color Hue"];

lfos.forEach((lfo, i) => {
  const row = document.createElement("tr");

  // LFO label
  const lfoLabel = document.createElement("td");
  lfoLabel.textContent = `LFO ${i + 1}`;
  row.appendChild(lfoLabel);

  // Parameter select dropdown (replaces checkbox)
  const paramCell = document.createElement("td");
  const paramSelect = document.createElement("select");

  // Default "None" option
  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.textContent = "None";
  paramSelect.appendChild(noneOption);

// Match these exactly to your switch statement
const options = [
  "Hue: Primary Color",
  "Hue: Secondary Color",
  "Effects: Glow Strength",
  "Animation: Speed",
  "Animation: Depth",
  "Animation: Wobble",
  "Animation: Pixelation"
];

options.forEach(opt => {
  const optionEl = document.createElement("option");
  optionEl.value = opt;
  optionEl.textContent = opt;
  paramSelect.appendChild(optionEl);
});

  // Default to "None"
  paramSelect.value = "";

  paramCell.appendChild(paramSelect);
  row.appendChild(paramCell);

  // Range slider
  const rangeCell = document.createElement("td");
  const rangeInput = document.createElement("input");
  rangeInput.type = "range";
  rangeInput.min = 0;
  rangeInput.max = 1;
  rangeInput.step = 0.01;
  rangeInput.value = 1; // full spectrum
  rangeCell.appendChild(rangeInput);
  row.appendChild(rangeCell);

  // Offset slider
  const offsetCell = document.createElement("td");
  const offsetInput = document.createElement("input");
  offsetInput.type = "range";
  offsetInput.min = 0;
  offsetInput.max = 1;
  offsetInput.step = 0.01;
  offsetInput.value = 0; // start
  offsetCell.appendChild(offsetInput);
  row.appendChild(offsetCell);

  // Save references
  lfo.patch = {
    paramSelect,
    rangeInput,
    offsetInput
  };

  lfoMatrixBody.appendChild(row);
});

// Update wave parameters UI when waveform changes

function renderWaveParams(lfo, el) {
  const container = el.querySelector(".wave-params");

  // Clear everything except title
  container.innerHTML = `<div class="wave-params-title">Wave Parameters</div>`;

  const params = waveParamMap[lfo.wave];
  if (!params) return;

  params.forEach(p => {
    const wrap = document.createElement("label");
    wrap.className = "wave-param";

    const span = document.createElement("span");
    span.textContent = p.label;

    const input = document.createElement("input");
    input.type = "range";
    input.min = p.min;
    input.max = p.max;
    input.step = p.step ?? 0.01;
    input.value = lfo.params[p.key] ?? p.min;

    input.oninput = e => {
      lfo.params[p.key] = +e.target.value;
    };

    wrap.appendChild(span);
    wrap.appendChild(input);
    container.appendChild(wrap);
  });
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






// Dev Notes Script 

const devBtn = document.getElementById("devNotesBtn")
const modal = document.getElementById("devNotesModal")
const closeBtn = document.getElementById("closeDevNotes")
const textarea = document.getElementById("devNotesTextarea")

const STORAGE_KEY = "devNotes"

// Load saved notes on startup
textarea.value = localStorage.getItem(STORAGE_KEY) || ""

// Open modal
devBtn.addEventListener("click", () => {
  modal.classList.remove("hidden")
  textarea.focus()
})

// Close modal
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden")
})

// Auto-save as you type
textarea.addEventListener("input", () => {
  localStorage.setItem(STORAGE_KEY, textarea.value)
})



// Export and Import Script

function collectPreset() {
  return {
    version: 1,

    text: {
      value: textInput.value,
      font: fontSelect.value,
      mode: modeSelect.value,
      color: colorInput.value
    },

    background: {
      type: bgType.value,
      primary: bgColor.value,
      secondary: bgGradient.value
    },

    effects: {
      glow: glowBlur.value,
      depth: bgDepth.value,
      trails: enableTrails.checked,
      trailAlpha: trailAlpha.value
    },

    animation: {
      speed: speedInput.value,
      depth: depthInput.value,
      wobble: wobbleInput.value,
      pixelation: pixelInput.value,
      fps: fpsInput.value
    },

    lfos: lfos.map(lfo => ({
      rate: lfo.rate,
      wave: lfo.wave,
      params: { ...lfo.params },

      patch: {
        target: lfo.patch?.paramSelect?.value ?? "none",
        range: lfo.patch?.rangeInput?.value ?? 0,
        offset: lfo.patch?.offsetInput?.value ?? 0
      }
    }))
  };
}


document.getElementById("exportPresetBtn").onclick = () => {
  const preset = collectPreset();
  const blob = new Blob([JSON.stringify(preset, null, 2)], {
    type: "application/json"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "retro-text-lab-preset.json";
  a.click();
};

document
  .getElementById("importPresetInput")
  .addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const preset = JSON.parse(evt.target.result);
        applyPreset(preset);
      } catch (err) {
        alert("Invalid preset file");
      }
    };
    reader.readAsText(file);
  });


  function applyPreset(preset) {
  if (!preset || preset.version !== 1) return;

  // TEXT
  textInput.value = preset.text.value;
  fontSelect.value = preset.text.font;
  modeSelect.value = preset.text.mode;
  colorInput.value = preset.text.color;

  // BACKGROUND
  bgType.value = preset.background.type;
  bgColor.value = preset.background.primary;
  bgGradient.value = preset.background.secondary;

  // EFFECTS
  glowBlur.value = preset.effects.glow;
  bgDepth.value = preset.effects.depth;
  enableTrails.checked = preset.effects.trails;
  trailAlpha.value = preset.effects.trailAlpha;

  // ANIMATION
  speedInput.value = preset.animation.speed;
  depthInput.value = preset.animation.depth;
  wobbleInput.value = preset.animation.wobble;
  pixelInput.value = preset.animation.pixelation;
  fpsInput.value = preset.animation.fps;

  // LFOs
  preset.lfos.forEach((p, i) => {
    const lfo = lfos[i];
    if (!lfo) return;

    lfo.rate = p.rate;
    lfo.wave = p.wave;
    lfo.params = { ...p.params };

    if (lfo.patch) {
      lfo.patch.paramSelect.value = p.patch.target;
      lfo.patch.rangeInput.value = p.patch.range;
      lfo.patch.offsetInput.value = p.patch.offset;
    }
  });
}

const PRESET_CATEGORIES = [
  "Ambient",
  "Glitch",
  "Minimal",
  "Psychedelic",
  "Typography",
  "Motion",
  "Experimental"
];



const categoryContainer = document.querySelector(".preset-categories");
const presetList = document.querySelector(".preset-list");


const PRESET_INDEX = {
  Ambient: [
    { name: "Slow Drift", file: "slow-drift.json" },
    { name: "Q P", file: "qp.json" },
    { name: "Air Static", file: "air-static.json" },
    { name: "Low Tide", file: "low-tide.json" },
    { name: "Distant Rooms", file: "distant-rooms.json" },
    { name: "Fog Memory", file: "fog-memory.json" },
    { name: "Still Light", file: "still-light.json" },
    { name: "Afterimage", file: "afterimage.json" },
    { name: "Quiet Bloom", file: "quiet-bloom.json" },
    { name: "Night Floor", file: "night-floor.json" }
  ],

  Glitch: [
    { name: "Glitch Helix", file: "glitch-helix.json" },
    { name: "Buffer Collapse", file: "buffer-collapse.json" },
    { name: "Signal Tear", file: "signal-tear.json" },
    { name: "Data Shards", file: "data-shards.json" },
    { name: "Phase Error", file: "phase-error.json" },
    { name: "Frame Skip", file: "frame-skip.json" },
    { name: "Bit Rot", file: "bit-rot.json" },
    { name: "Compression Ghost", file: "compression-ghost.json" },
    { name: "Memory Leak", file: "memory-leak.json" },
    { name: "Artifact Bloom", file: "artifact-bloom.json" }
  ],

  Minimal: [
    { name: "Pale Drift", file: "pale-drift.json" },
    { name: "Single Line", file: "single-line.json" },
    { name: "Empty Measure", file: "empty-measure.json" },
    { name: "Soft Click", file: "soft-click.json" },
    { name: "Quiet Grid", file: "quiet-grid.json" },
    { name: "Bare Signal", file: "bare-signal.json" },
    { name: "Thin Space", file: "thin-space.json" },
    { name: "Reduced Form", file: "reduced-form.json" },
    { name: "Still Axis", file: "still-axis.json" },
    { name: "White Interval", file: "white-interval.json" }
  ],

  Psychedelic: [
    { name: "Liquid Bloom", file: "liquid-bloom.json" },
    { name: "Color Melt", file: "color-melt.json" },
    { name: "Neon Mirage", file: "neon-mirage.json" },
    { name: "Optic Spiral", file: "optic-spiral.json" },
    { name: "Magic Ring", file: "magic-ring.json" },
    { name: "Chromatic Pulse", file: "chromatic-pulse.json" },
    { name: "Dream Fractals", file: "dream-fractals.json" },
    { name: "Electric Bloom", file: "electric-bloom.json" },
    { name: "Prism Wake", file: "prism-wake.json" },
    { name: "Hallucination Field", file: "hallucination-field.json" }
  ],

  Typography: [
    { name: "Bold Serif Glow", file: "bold-serif-glow.json" },
    { name: "Mono Terminal", file: "mono-terminal.json" },
    { name: "Scanline Type", file: "scanline-type.json" },
    { name: "Broken Headline", file: "broken-headline.json" },
    { name: "Digital Poster", file: "digital-poster.json" },
    { name: "Kinetic Letters", file: "kinetic-letters.json" },
    { name: "Outline Stack", file: "outline-stack.json" },
    { name: "Type Echo", file: "type-echo.json" },
    { name: "Raster Font", file: "raster-font.json" },
    { name: "Glitch Title", file: "glitch-title.json" }
  ],

  Motion: [
    { name: "Slow Pan", file: "slow-pan.json" },
    { name: "Vertical Sweep", file: "vertical-sweep.json" },
    { name: "Elastic Drift", file: "elastic-drift.json" },
    { name: "Orbit Pass", file: "orbit-pass.json" },
    { name: "Pulse Zoom", file: "pulse-zoom.json" },
    { name: "Frame Glide", file: "frame-glide.json" },
    { name: "Axis Shift", file: "axis-shift.json" },
    { name: "Micro Shake", file: "micro-shake.json" },
    { name: "Time Stretch", file: "time-stretch.json" },
    { name: "Momentum Fade", file: "momentum-fade.json" }
  ],

  Experimental: [
    { name: "Unknown State", file: "unknown-state.json" },
    { name: "Recursive Field", file: "recursive-field.json" },
    { name: "Noise Logic", file: "noise-logic.json" },
    { name: "Broken System", file: "broken-system.json" },
    { name: "Feedback Loop", file: "feedback-loop.json" },
    { name: "Synthetic Chaos", file: "synthetic-chaos.json" },
    { name: "Emergent Shape", file: "emergent-shape.json" },
    { name: "Ghost Math", file: "ghost-math.json" },
    { name: "Unstable Model", file: "unstable-model.json" },
    { name: "Black Box", file: "black-box.json" }
  ]
};



// Build category buttons
PRESET_CATEGORIES.forEach(cat => {
  const el = document.createElement("div");
  el.className = "preset-category";
  el.textContent = cat;
  el.onclick = () => selectCategory(cat, el);
  categoryContainer.appendChild(el);
});

function selectCategory(category, el) {
  document
    .querySelectorAll(".preset-category")
    .forEach(c => c.classList.remove("active"));

  el.classList.add("active");
  renderPresetList(category);
}

function renderPresetList(category) {
  presetList.innerHTML = "";

  const presets = PRESET_INDEX[category] || [];

  if (!presets.length) {
    presetList.innerHTML =
      `<div class="preset-placeholder">No presets yet</div>`;
    return;
  }

  presets.forEach(preset => {
    const p = document.createElement("div");
    p.className = "preset-item";
    p.textContent = preset.name;

    p.onclick = () => {
      loadPresetFromFile(category, preset.file);
    };

    presetList.appendChild(p);
  });
}

async function loadPresetFromFile(category, filename) {
  const path = `presets/${category.toLowerCase()}/${filename}`;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Fetch failed");

    const preset = await res.json();
    applyPreset(preset);

    console.log("Preset loaded:", path);
  } catch (err) {
    console.error("Preset load error:", err);
    alert("Could not load preset.");
  }
}

// ================= RESTORE DEFAULT PRESET =================
const restoreBtn = document.getElementById("restoreDefaultBtn");

// Create confirm panel once
const restoreConfirm = document.createElement("div");
restoreConfirm.className = "restore-confirm";
restoreConfirm.innerHTML = `
  <h4>Confirm: Restore Default Preset</h4>
  <div class="buttons">
    <button id="restoreCancelBtn">Cancel</button>
    <button id="restoreYesBtn">Yes</button>
  </div>
`;
document.body.appendChild(restoreConfirm);

const restoreCancelBtn = restoreConfirm.querySelector("#restoreCancelBtn");
const restoreYesBtn = restoreConfirm.querySelector("#restoreYesBtn");

// Open panel
restoreBtn.addEventListener("click", () => {
  restoreConfirm.classList.add("show");
});

// Cancel
restoreCancelBtn.addEventListener("click", () => {
  restoreConfirm.classList.remove("show");
});

// Confirm restore
restoreYesBtn.addEventListener("click", async () => {
  restoreConfirm.classList.remove("show");

  try {
    const res = await fetch("presets/default.json");
    if (!res.ok) throw new Error("Failed to load default preset");

    const preset = await res.json();
    applyPreset(preset);
  } catch (err) {
    console.error("Restore default failed:", err);
    alert("Could not restore default preset.");
  }
});




// ================= PRESET EXPORT MODAL =================
const exportPresetBtn = document.getElementById("exportPresetBtn");

// Create modal container
const exportModal = document.createElement("div");
exportModal.className = "export-modal"; // hidden by default via CSS
exportModal.innerHTML = `
  <div class="export-modal-content">
    <h3>Export Preset</h3>
    <label>
      Name
      <input id="presetNameInput" type="text" placeholder="Enter preset name" />
    </label>
    <div id="presetFileNamePreview" style="font-size: 0.8em; color: #888; margin-bottom: 8px;">File will be called: .json</div>
    <label>
      Creator
      <input id="presetCreatorInput" type="text" placeholder="Your name" />
    </label>
    <label>
      Notes
      <textarea id="presetNotesInput" placeholder="Optional notes about this preset"></textarea>
    </label>
    <div style="text-align: right; margin-top: 10px;">
      <button id="exportPresetConfirm">Export</button>
      <button id="exportPresetCancel">Cancel</button>
    </div>
  </div>
`;
document.body.appendChild(exportModal);

// Elements inside modal
const presetNameInput = exportModal.querySelector("#presetNameInput");
const presetCreatorInput = exportModal.querySelector("#presetCreatorInput");
const presetNotesInput = exportModal.querySelector("#presetNotesInput");
const presetFileNamePreview = exportModal.querySelector("#presetFileNamePreview");
const exportPresetConfirm = exportModal.querySelector("#exportPresetConfirm");
const exportPresetCancel = exportModal.querySelector("#exportPresetCancel");

// Open modal
exportPresetBtn.addEventListener("click", () => {
  presetNameInput.value = "";
  presetCreatorInput.value = "";
  presetNotesInput.value = "";
  presetFileNamePreview.textContent = "File will be called: .json";
  exportModal.style.display = "flex"; // show modal
  presetNameInput.focus();
});

// Update file name preview dynamically
presetNameInput.addEventListener("input", () => {
  const kebabName = presetNameInput.value.trim().toLowerCase().replace(/\s+/g, "-");
  presetFileNamePreview.textContent = `File will be called: ${kebabName || ""}.json`;
});

// Cancel button closes modal
exportPresetCancel.addEventListener("click", () => {
  exportModal.style.display = "none";
});

// Also close modal if clicking outside content
exportModal.addEventListener("click", e => {
  if (e.target === exportModal) exportModal.style.display = "none";
});

// Confirm export
exportPresetConfirm.addEventListener("click", () => {
  const name = presetNameInput.value.trim();
  const creator = presetCreatorInput.value.trim() || "Unknown";
  const notes = presetNotesInput.value.trim();

  if (!name) {
    alert("Please enter a preset name.");
    return;
  }

  // Generate file name
  const kebabName = name.toLowerCase().replace(/\s+/g, "-");
  const date = new Date().toISOString();

  // Build preset JSON
  const presetData = {
    meta: { creator, created: date, notes },
    text: {
      value: textInput.value,
      font: fontSelect.value,
      mode: modeSelect.value,
      color: colorInput.value
    },
    background: {
      type: bgType.value,
      primary: bgColor.value,
      secondary: bgGradient.value
    },
    effects: {
      glow: glowBlur.value,
      depth: bgDepth.value,
      trails: enableTrails.checked,
      trailAlpha: trailAlpha.value
    },
    animation: {
      speed: speedInput.value,
      depth: depthInput.value,
      wobble: wobbleInput.value,
      pixelation: pixelInput.value,
      fps: fpsInput.value
    },
    lfos: lfos.map(lfo => ({
      rate: lfo.rate,
      params: lfo.params || {},
      patch: {
        target: lfo.patch?.paramSelect?.value || "",
        range: lfo.patch?.rangeInput?.value || "1",
        offset: lfo.patch?.offsetInput?.value || "0"
      }
    }))
  };

  // Export as JSON file
  const blob = new Blob([JSON.stringify(presetData, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${kebabName}.json`;
  link.click();

  // Close modal after export
  exportModal.style.display = "none";
});


// Script for random light glints on CDs 

function generateCDLights() {
  const passes = [];
  const count = Math.floor(Math.random() * 3) + 8;

  for (let i = 0; i < count; i++) {
    const start = Math.random() * 360;
    const width = Math.random() * 28 + 6;
    const alpha = Math.random() * 0.18 + 0.04;

    passes.push(
      `conic-gradient(
        from ${start}deg,
        rgba(255,255,255,${alpha}) 0deg,
        rgba(255,255,255,${alpha * 0.4}) ${width * 0.6}deg,
        rgba(255,255,255,0) ${width}deg,
        rgba(255,255,255,0) 360deg
      )`
    );
  }

  return passes.join(", ");
}

document.querySelectorAll("[data-cd]").forEach(cd => {
  cd.style.setProperty("--cd-lights", generateCDLights());
});



// Export Videos and Screenshots Easy

function captureScreenshot(scale = 1) {
  requestAnimationFrame(() => {
    const out = document.createElement("canvas");
    out.width  = 1192 * scale;
    out.height = 766  * scale;


    const octx = out.getContext("2d");
    octx.setTransform(scale, 0, 0, scale, 0, 0);
    octx.drawImage(canvas, 0, 0, out.width, out.height);

    out.toBlob(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "visualizer.png";
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  });
}



let recorder;
let chunks = [];


function startRecording({ fps = 60, bitrate = 45_000_000 } = {}) {

  // ✅ FORCE VIDEO RESOLUTION
  canvas.width  = 1192;
  canvas.height = 766;

  const stream = canvas.captureStream(fps);

  recorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
    videoBitsPerSecond: bitrate
  });

  chunks = [];

  recorder.ondataavailable = e => {
    if (e.data.size) chunks.push(e.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "visualizer.webm";
    a.click();

    URL.revokeObjectURL(url);
  };

  recorder.start();
}


function stopRecording() {
  recorder?.stop();
}





let captureScale = 1;

function setCaptureScale(scale) {
  renderCanvas.width  = PRESETS["4K"][0] * scale;
  renderCanvas.height = PRESETS["4K"][1] * scale;
}


if (frameEnabled) {
  rctx.drawImage(
    frameImage,
    0,
    0,
    renderCanvas.width,
    renderCanvas.height
  );
}

const PRESETS = {
  "1080p": [1920, 1080],
  "1440p": [2560, 1440],
  "4K":    [3840, 2160]
};

function setPreset(name) {
  const [w, h] = PRESETS[name];
  renderCanvas.width = w;
  renderCanvas.height = h;
}




// ============================
// Advanced Panel Controls
// ============================
const advancedPanel = document.getElementById("advancedPanel");
const panelColorPicker = document.getElementById("panelColorPicker");
const textureSelect = document.getElementById("panelTextureSelect");
const accentColorPicker = document.getElementById("accentColorPicker");
const panelOpacity = document.getElementById("panelOpacity");

const controls = document.getElementById("controls");
const textures = document.querySelectorAll(".controls-texture");

// Panel textures
const panelTextures = {
  none: 'none',
  concrete: 'url("images/concrete-1.jpeg")',
  plastic: 'url("images/plastic-1.jpeg")',
  plastic2: 'url("images/plastic-2.jpg")'
};

// ----------------------
// Toggle advanced panel
// ----------------------
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.metaKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    advancedPanel.classList.toggle("visible");
  }
});

// ----------------------
// Panel color update
// ----------------------
panelColorPicker.addEventListener("input", (e) => {
  document.documentElement.style.setProperty("--panel", e.target.value);
});

// ----------------------
// Panel texture update
// ----------------------
textureSelect.addEventListener("change", (e) => {
  const value = e.target.value;
  const texture = panelTextures[value];

  // Update CSS variable
  document.documentElement.style.setProperty("--panel-texture", texture);

  // Update all .controls-texture layers
  textures.forEach(tex => {
    tex.style.backgroundImage = texture !== "none" ? texture : "";
  });
});

// ----------------------
// Accent color update
// ----------------------
accentColorPicker?.addEventListener("input", (e) => {
  document.documentElement.style.setProperty("--accent", e.target.value);
});

// ----------------------
// Panel opacity update
// ----------------------
panelOpacity?.addEventListener("input", (e) => {
  const value = e.target.value;
  controls.style.background = `rgba(20,20,20,${value})`;
});

// ----------------------
// Adjust texture height to match content
// ----------------------
function updateTextureHeight() {
  textures.forEach(tex => {
    tex.style.height = controls.scrollHeight + "px";
  });
}

// Initial set
updateTextureHeight();

// Update on resize
window.addEventListener("resize", updateTextureHeight);


// ============================
// Side Menu / CD Volume
// ============================
const menuBtn = document.getElementById("menuBtn");
const sideMenuPanel = document.getElementById("sideMenuPanel");
const cdVolume = document.getElementById("cdVolume");
const themeSelect = document.getElementById("themeSelect");

// Toggle side menu
menuBtn?.addEventListener("click", () => {
  sideMenuPanel.classList.toggle("visible");
});

// CD Volume control (link to actual CD player audio if needed)
cdVolume?.addEventListener("input", (e) => {
  const volume = e.target.value / 100;
  console.log("CD Volume:", volume);
  // Example: myCdPlayerAudio.volume = volume;
});

// Theme selector
themeSelect?.addEventListener("change", (e) => {
  const theme = e.target.value;
  console.log("Selected theme:", theme);
  // Example: update CSS variables or classes here
});

// To make home button work
const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {
  window.location.href = "homepage.html"; // redirect to homepage
});
