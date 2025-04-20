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

// Network Latency Simulation
function simulateLatency() {
  setInterval(() => {
    document.getElementById("latency").textContent = `LATENCY: ${Math.floor(
      Math.random() * 50 + 20
    )}ms ▼`
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

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  createMatrix()
  simulateLatency()
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
