import React, { useEffect } from "react"

function Skills() {
  useEffect(() => {
    const scriptShim = document.createElement("script")
    scriptShim.src =
      "https://unpkg.com/es-module-shims@1.6.3/dist/es-module-shims.js"
    scriptShim.async = true
    document.head.appendChild(scriptShim)

    const importmap = document.createElement("script")
    importmap.type = "importmap"
    importmap.innerHTML = JSON.stringify({
      imports: {
        three: "https://unpkg.com/three@0.136.0/build/three.module.js",
      },
    })
    document.head.appendChild(importmap)
  }, [])

  return (
    <div>
      <h1>Skills</h1>
      <p>Some content about your skills...</p>
    </div>
  )
}

export default Skills
