const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.width = 640
canvas.height = 360

// Placeholder animation (replace with weekly preset logic)
let t = 0
function draw() {
  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = "hsl(" + (t % 360) + ", 80%, 60%)"
  ctx.lineWidth = 3

  ctx.beginPath()
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    100 + Math.sin(t * 0.02) * 20,
    0,
    Math.PI * 2
  )
  ctx.stroke()

  t++
  requestAnimationFrame(draw)
}

draw()

// Navigation
document.getElementById("startBtn").onclick = () => {
  window.location.href = "index.html"
}

document.getElementById("shopBtn").onclick = () => {
  window.location.href = "shop.html"
}
