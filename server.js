const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const os = require("os");
const qrcode = require("qrcode-terminal");

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

const sessions = new Map();
const TTL = 30_000; // 30 seconds

function cleanupSessions() {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActive > TTL) {
      sessions.delete(id);
    }
  }
}

// Socket.IO connection
io.on("connection", (socket) => {
  socket.on("heartbeat", (sessionId) => {
    if (!sessionId) return;
    sessions.set(sessionId, { lastActive: Date.now() });
    cleanupSessions();
    io.emit("onlineCount", sessions.size);
  });

  socket.on("showDebug", () => {
    cleanupSessions();
    io.emit("debugWindow", Array.from(sessions.keys()));
  });
});

// Optional JSON endpoint
app.get("/active-users", (req, res) => {
  cleanupSessions();
  res.json({ count: sessions.size, users: Array.from(sessions.keys()) });
});

// Find local LAN IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const PORT = 3000;
http.listen(PORT, () => {
  const localIP = getLocalIP();
  const url = `http://${localIP}:${PORT}`;
  console.log(`Server running at: ${url}`);
  
  // Show QR code in terminal
  qrcode.generate(url, { small: true });
});
