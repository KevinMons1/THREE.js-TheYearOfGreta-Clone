import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols"
import * as dat from 'dat.gui'

//------------------------
// Base
//------------------------

// Debug
const gui = new dat.GUI()

// canvas
const canvas = document.querySelector(".main-webgl")

// scene
const scene = new THREE.Scene()

// sizes
const sizesCanvas = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener("resize", () => {
    // Update size
    sizesCanvas.width = window.innerWidth
    sizesCanvas.height = window.innerHeight

    // Update camera
    camera.aspect = sizesCanvas.width / sizesCanvas.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizesCanvas.width, sizesCanvas.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//------------------------
// Camera
//------------------------

// camera
const camera = new THREE.PerspectiveCamera(75, sizesCanvas.width / sizesCanvas.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// controls camera
const controls = new OrbitControls(camera, scene)
controls.enableDamping = true

//------------------------
// Renderer
//------------------------

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizesCanvas.width, sizesCanvas.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//------------------------
// Animation
//------------------------

const animation = () => {
    // Update controls
    controls.update()

    // Update renderer
    renderer.render(scene, camera)

    // Call this function
    window.requestAnimationFrame(animation())
}

animation()
