const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let media = new Image()
let isVideo = false
let videoElement = null
let animationId = null

const controls = {
  pixelSize: document.getElementById("pixelSize"),
  saturation: document.getElementById("saturation"),
  contrast: document.getElementById("contrast"),
  brightness: document.getElementById("brightness"),
  hue: document.getElementById("hue"),
  invert: document.getElementById("invert"),
  grayscale: document.getElementById("grayscale"),
  sepia: document.getElementById("sepia"),
  opacity: document.getElementById("opacity"),
  noise: document.getElementById("noise"),
  scanlines: document.getElementById("scanlines"),
  posterize: document.getElementById("posterize"),
  channelShift: document.getElementById("channelShift"),
  flipX: document.getElementById("flipX"),
  flipY: document.getElementById("flipY"),
  blendMode: document.getElementById("blendMode")
}

document.getElementById("upload").addEventListener("change", e => {
  const file = e.target.files[0]
  cancelAnimationFrame(animationId)
  if (!file) return

  if(file.type.startsWith("video/")) {
    isVideo = true
    if(videoElement) videoElement.remove()
    videoElement = document.createElement("video")
    videoElement.src = URL.createObjectURL(file)
    videoElement.autoplay = true
    videoElement.loop = true
    videoElement.muted = true
    videoElement.play()
    videoElement.addEventListener("loadeddata", renderVideo)
  } else {
    isVideo = false
    media.src = URL.createObjectURL(file)
    media.onload = render
  }
})

Object.values(controls).forEach(c => c.addEventListener("input", () => isVideo ? renderVideo() : render()))

// Image Render
function render() {
  const px = +controls.pixelSize.value
  canvas.width = media.width
  canvas.height = media.height

  const w = Math.ceil(media.width / px)
  const h = Math.ceil(media.height / px)

  const temp = document.createElement("canvas")
  temp.width = w
  temp.height = h
  const tctx = temp.getContext("2d")
  tctx.drawImage(media,0,0,w,h)

  ctx.clearRect(0,0,canvas.width,canvas.height)
  ctx.imageSmoothingEnabled = false
  applyFilters()
  ctx.drawImage(temp,0,0,w,h,0,0,canvas.width,canvas.height)
  ctx.filter = "none"

  drawExtraEffects()
}

// Video Render
function renderVideo() {
  if(!videoElement) return
  const px = +controls.pixelSize.value
  canvas.width = videoElement.videoWidth
  canvas.height = videoElement.videoHeight

  const w = Math.ceil(videoElement.videoWidth / px)
  const h = Math.ceil(videoElement.videoHeight / px)

  const temp = document.createElement("canvas")
  temp.width = w
  temp.height = h
  const tctx = temp.getContext("2d")
  tctx.drawImage(videoElement,0,0,w,h)

  ctx.clearRect(0,0,canvas.width,canvas.height)
  ctx.imageSmoothingEnabled = false
  applyFilters()
  ctx.drawImage(temp,0,0,w,h,0,0,canvas.width,canvas.height)
  ctx.filter = "none"

  drawExtraEffects()
  animationId = requestAnimationFrame(renderVideo)
}

// Apply CSS Filters
function applyFilters() {
  ctx.filter = `
    saturate(${controls.saturation.value}%)
    contrast(${controls.contrast.value}%)
    brightness(${controls.brightness.value}%)
    hue-rotate(${controls.hue.value}deg)
    invert(${controls.invert.value}%)
    grayscale(${controls.grayscale.value}%)
    sepia(${controls.sepia.value}%)
    opacity(${controls.opacity.value}%)
  `
}

// Extra crazy effects: noise, scanlines, posterize, channel shift, flip
function drawExtraEffects() {
  const imgData = ctx.getImageData(0,0,canvas.width,canvas.height)
  const data = imgData.data
  const noise = +controls.noise.value
  const scanlines = +controls.scanlines.value
  const posterize = +controls.posterize.value
  const channelShift = +controls.channelShift.value
  const flipX = controls.flipX.checked
  const flipY = controls.flipY.checked

  for(let y=0;y<canvas.height;y++) {
    for(let x=0;x<canvas.width;x++) {
      let idx = (y*canvas.width + x)*4
      // Noise
      if(noise>0) {
        data[idx] += (Math.random()*2-1)*noise
        data[idx+1] += (Math.random()*2-1)*noise
        data[idx+2] += (Math.random()*2-1)*noise
      }
      // Scanlines
      if(scanlines>0 && y%scanlines===0) {
        data[idx]*=0.7
        data[idx+1]*=0.7
        data[idx+2]*=0.7
      }
      // Posterize
      if(posterize<256) {
        for(let c=0;c<3;c++) {
          data[idx+c] = Math.floor(data[idx+c]/256*posterize)/posterize*255
        }
      }
      // Channel Shift
      if(channelShift>0 && x+channelShift<canvas.width) {
        let r = data[idx], g=data[idx+1], b=data[idx+2]
        let targetIdx = (y*canvas.width + x+channelShift)*4
        data[targetIdx] = r
        data[targetIdx+1] = g
        data[targetIdx+2] = b
      }
    }
  }

  ctx.putImageData(imgData,0,0)

  // Flip
  if(flipX||flipY){
    ctx.save()
    ctx.globalCompositeOperation = controls.blendMode.value
    ctx.translate(flipX?canvas.width:0, flipY?canvas.height:0)
    ctx.scale(flipX?-1:1, flipY?-1:1)
    ctx.drawImage(canvas,0,0)
    ctx.restore()
  }
}

// Export
document.getElementById("export").addEventListener("click", () => {
  if(isVideo){
    alert("Video export not implemented in this basic version yet. Use screen recording for now.")
  }else{
    const link = document.createElement("a")
    link.download = "pixelized.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }
})
