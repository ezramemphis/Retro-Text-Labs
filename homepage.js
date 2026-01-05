const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 640;
canvas.height = 360;

let t = 0;

function draw() {
  // Background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Main rotating circle
  ctx.strokeStyle = "hsl(" + (t % 360) + ", 80%, 60%)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(
    cx,
    cy,
    100 + Math.sin(t * 0.02) * 20,
    0,
    Math.PI * 2
  );
  ctx.stroke();

  // Minimal addition 1: Pulsating inner circle
  ctx.strokeStyle = "hsl(" + ((t + 180) % 360) + ", 60%, 50%)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    cx,
    cy,
    50 + Math.sin(t * 0.05) * 15,
    0,
    Math.PI * 2
  );
  ctx.stroke();

  // Minimal addition 2: Radial lines rotating around center
  for (let i = 0; i < 8; i++) {
    const angle = (t * 0.03 + i * Math.PI / 4);
    const x = cx + Math.cos(angle) * 120;
    const y = cy + Math.sin(angle) * 120;

    ctx.strokeStyle = "hsl(" + ((t + i * 30) % 360) + ", 70%, 55%)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  t++;
  requestAnimationFrame(draw);
}

draw();

// Navigation
document.getElementById("startBtn").onclick = () => {
  window.location.href = "index.html";
};

document.getElementById("shopBtn").onclick = () => {
  window.location.href = "shop.html";
};
