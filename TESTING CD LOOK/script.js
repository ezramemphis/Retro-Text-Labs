function generateCDLights() {
  const passes = [];
  const count = Math.floor(Math.random() * 3) + 8; // 8–10 passes

  for (let i = 0; i < count; i++) {
    const start = Math.random() * 360;
    const width = Math.random() * 28 + 6; // tighter glints
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
