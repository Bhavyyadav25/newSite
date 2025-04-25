// Matrix Background
function createMatrix() {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  canvas.classList.add("matrix-bg")
  document.body.prepend(canvas)

  const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ@%&"
  const fontSize = 14
  let columns = 0

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    columns = canvas.width / fontSize
  }

  window.addEventListener("resize", resize)
  resize()

  const drops = Array(Math.floor(columns)).fill(0)

  function draw() {
    ctx.fillStyle = "rgba(15, 23, 42, 0.05)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(
      "--terminal-green"
    )
    ctx.font = `${fontSize}px "Space Mono"`

    drops.forEach((drop, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)]
      ctx.fillText(char, i * fontSize, drop * fontSize)

      if (drop * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    })

    requestAnimationFrame(draw)
  }

  draw()
}

// Real Network Latency Measurement
function measureLatency() {
  return new Promise((resolve) => {
    const start = performance.now()

    // Use a small transparent pixel image for measurement
    const img = new Image()
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" +
      "?cache=" +
      Date.now()

    img.onload = function () {
      const latency = performance.now() - start
      resolve(Math.round(latency))
    }

    img.onerror = function () {
      resolve(null)
    }
  })
}

async function updateLatency() {
  try {
    const latency = await measureLatency()
    if (latency) {
      document.getElementById("latency").textContent = `LATENCY: ${latency}ms ▼`
      // Store latency for connection quality indicator
      localStorage.setItem("lastLatency", latency)
    }
  } catch (error) {
    console.error("Latency measurement error:", error)
  }
}

// Connection Quality Monitoring
function startLatencyMonitoring() {
  // Initial measurement
  updateLatency()

  // Update every 5 seconds
  setInterval(updateLatency, 5000)

  // Add connection quality indicator
  const latencyIndicator = document.createElement("div")
  latencyIndicator.id = "connection-quality"
  document.body.appendChild(latencyIndicator)

  // Update indicator color based on latency
  setInterval(() => {
    const latency = localStorage.getItem("lastLatency") || 100
    const indicator = document.getElementById("connection-quality")

    indicator.style.backgroundColor =
      latency < 50 ? "#00ff00" : latency < 100 ? "#ffd700" : "#ff0000"

    indicator.title = `Network Quality: ${
      latency < 50 ? "Excellent" : latency < 100 ? "Good" : "Poor"
    } (${latency}ms)`
  }, 1000)
}

// Show Error Messages
function showError(message, containerId) {
  const container = document.getElementById(containerId)
  container.innerHTML = `<div class="error">${message}</div>`
}

// CSRF Token Handling
async function getCSRFToken() {
  try {
    const response = await fetch("/api/csrf-token")
    if (!response.ok) throw new Error("Failed to get CSRF token")
    const { token } = await response.json()
    return token
  } catch (error) {
    console.error("CSRF Token Error:", error)
    return "invalid-csrf-token"
  }
}

// Cyber Cursor Animation
function initCyberCursor() {
  const cursor = document.getElementById("cursor")
  const trail = document.getElementById("trail")
  let mouseX = 0,
    mouseY = 0
  let trailX = 0,
    trailY = 0
  const speed = 0.2 // Trail follow speed

  // Update cursor position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    cursor.style.left = `${mouseX - 12}px`
    cursor.style.top = `${mouseY - 12}px`
  })

  // Trail animation loop
  function animate() {
    // Calculate trail position with easing
    const dx = mouseX - trailX
    const dy = mouseY - trailY
    trailX += dx * speed
    trailY += dy * speed

    trail.style.left = `${trailX - 24}px`
    trail.style.top = `${trailY - 24}px`
    trail.style.opacity = Math.sqrt(dx * dx + dy * dy) * 0.1

    requestAnimationFrame(animate)
  }
  animate()

  // Click animation
  document.addEventListener("click", () => {
    cursor.classList.add("click-effect")
    setTimeout(() => cursor.classList.remove("click-effect"), 500)
  })

  // Hover effects
  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(1.5)"
      trail.style.transform = "scale(1.8)"
    })
    element.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1)"
      trail.style.transform = "scale(1)"
    })
  })

  // Hide cursor on mobile
  if ("ontouchstart" in window) {
    cursor.style.display = "none"
    trail.style.display = "none"
  }
  // Add hardware-accelerated transforms
  cursor.style.willChange = "transform"
  trail.style.willChange = "transform"

  // Add dynamic size based on movement speed
  let lastPos = { x: mouseX, y: mouseY }
  setInterval(() => {
    const dx = mouseX - lastPos.x
    const dy = mouseY - lastPos.y
    const speed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.3, 30)

    cursor.style.width = `${24 - speed}px`
    cursor.style.height = `${24 - speed}px`

    lastPos = { x: mouseX, y: mouseY }
  }, 50)

  // Add trail particles
  document.addEventListener("mousemove", () => {
    if (Math.random() > 0.7) {
      const particle = document.createElement("div")
      particle.className = "cursor-particle"
      particle.style.cssText = `
                left: ${mouseX}px;
                top: ${mouseY}px;
                background: ${
                  Math.random() > 0.5
                    ? "var(--terminal-green)"
                    : "var(--electric-blue)"
                };
            `
      document.body.appendChild(particle)

      setTimeout(() => particle.remove(), 500)
    }
  })
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  createMatrix()
  startLatencyMonitoring()
  initCyberCursor()
})

// Handle client-side navigation
document.addEventListener("click", (e) => {
  if (
    e.target.tagName === "A" &&
    e.target.getAttribute("href").startsWith("/")
  ) {
    e.preventDefault()
    const path = e.target.getAttribute("href")
    window.history.pushState({}, "", path)
    handleRouteChange()
  }
})

// Handle route changes
async function handleRouteChange() {
  const path = window.location.pathname
  try {
    const response = await fetch(path)
    if (!response.ok) throw new Error("Page not found")

    const html = await response.text()
    document.documentElement.innerHTML = html
    window.scrollTo(0, 0)

    // Re-initialize scripts
    if (typeof createMatrix === "function") createMatrix()
    if (typeof initSkillsCube === "function" && path === "/skills")
      initSkillsCube()
  } catch (error) {
    window.location.href = "/"
  }
}

// Handle browser navigation
window.addEventListener("popstate", handleRouteChange)

// Scroll handling for navigation
let lastScroll = 0
const scrollThreshold = 100 // Pixels to scroll before hiding nav

function handleNavScroll() {
  const currentScroll = window.pageYOffset
  const nav = document.querySelector("nav")

  if (currentScroll > scrollThreshold && currentScroll > lastScroll) {
    nav.classList.add("hidden")
  } else {
    nav.classList.remove("hidden")
  }
  lastScroll = currentScroll
}

window.addEventListener("scroll", handleNavScroll)
