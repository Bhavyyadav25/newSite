import * as THREE from "three"

let scene, camera, renderer, cube

export function initSkillsCube() {
  // Remove existing canvas if exists
  const oldCanvas = document.querySelector("#cube-container canvas")
  if (oldCanvas) oldCanvas.remove()

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(400, 400)
  document.getElementById("cube-container").appendChild(renderer.domElement)

  const edgeColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--terminal-green")
    .trim()

  // Create cube with transparent edges
  const geometry = new THREE.BoxGeometry(3, 3, 3)
  const edges = new THREE.EdgesGeometry(geometry)
  const lineMaterial = new THREE.LineBasicMaterial({ color: edgeColor })

  cube = new THREE.Group()
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.2,
      color: 0xffffff,
    })
  )
  const line = new THREE.LineSegments(edges, lineMaterial)

  cube.add(mesh)
  cube.add(line)
  scene.add(cube)

  camera.position.z = 5

  // Add skill labels
  const skills = [
    "Kernel Dev",
    "Cybersecurity",
    "Backend",
    "Standards",
    "Reverse Eng",
    "Cryptography",
  ]

  skills.forEach((skill, i) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = 512
    canvas.height = 512
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue("--dark-bg")
      .trim()
    ctx.fillRect(0, 0, 512, 512)
    ctx.font = '40px "Space Mono"'
    ctx.fillStyle = edgeColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(skill, 256, 256)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    })
    mesh.material[i] = material
  })

  mesh.material.needsUpdate = true
  animate()
}

function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.005
  cube.rotation.y += 0.005
  renderer.render(scene, camera)
}

// Initialize only on skills page
if (window.location.pathname.includes("skills")) {
  initSkillsCube()
}
