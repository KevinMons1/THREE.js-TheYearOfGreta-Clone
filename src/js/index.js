import * as THREE from "three"
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexPlaneShader from "../shaders/planes/vertex.glsl"
import fragmentPlaneShader from "../shaders/planes/fragment.glsl"

//------------------------
// Global varibale
//------------------------

let scrollI = 0
let initialPositionMeshY = 0.5
let initialRotationMeshY = 0.25

let initialRotationGroupY = Math.PI * 0.75

let scrollPlaneI = []

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
camera.position.z = 4.5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableZoom = false

//------------------------
// Model
//------------------------

// geometry
const boxGeometry = new THREE.BoxGeometry(1.5, 6, 1.5)

// material
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

// mesh
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
boxMesh.position.y = initialPositionMeshY
boxMesh.rotation.y = initialRotationMeshY

scene.add(boxMesh)

//------------------------
// Plane
//------------------------

// group
const groupPlane = new THREE.Group()
scene.add(groupPlane)

// geometry
const planeGeometry = new THREE.PlaneGeometry(1.5, 1)

// material
const planeMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    vertexShader: vertexPlaneShader,
    fragmentShader: fragmentPlaneShader,
    uniforms: {
        uTime: { value: 0.0 }
    }
})

// Create planes
for (let i = 0; i < 10; i++) {
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.position.y = i - 13
    plane.rotation.z = - 1

    scrollPlaneI.push(0)
    groupPlane.add(plane)
}

groupPlane.rotation.y = initialRotationGroupY

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

window.addEventListener("wheel", e => {
    const speed = 0.005

    // Known up or down
    if (e.deltaY < 0 && scrollI > 0) scrollI--
    else if (e.deltaY > 0) scrollI++
    
    //------
    // Update mesh
    //------

    // rotation
    boxMesh.rotation.y = (initialRotationMeshY) - scrollI * 0.01

    // position
    boxMesh.position.y = (initialPositionMeshY) - scrollI * (speed * 1.25)
    boxMesh.position.z = scrollI * (speed * 0.5) 

    //------
    // Update group of planes
    //------

    groupPlane.position.y = (scrollI * 0.04) 

    // Animation each plane
    for (let i = 0; i < groupPlane.children.length; i++) {
        const _index = groupPlane.children.length - (i + 1) // Get index reverse

        // Start animation
        if (groupPlane.position.y >= 0) {
            // Start one plane when it position are good value
            if (scrollI >= (i + 1) * 25) {
    
                // Know up or down
                if (e.deltaY < 0 && scrollI > 0)  scrollPlaneI[i]--
                else if (e.deltaY > 0)  scrollPlaneI[i]++
    
                // To visible
                if (!groupPlane.children[_index].visible) {
                    groupPlane.children[_index].visible = true
                }

                // Apply animation according to your scrollPlaneI[i]
                groupPlane.children[_index].position.z = Math.sin(scrollPlaneI[i] * 0.05) * Math.PI * 0.8
                groupPlane.children[_index].position.x = Math.cos(scrollPlaneI[i] * 0.05) * Math.PI * 0.8
                groupPlane.children[_index].rotation.y = Math.sin(scrollPlaneI[i] * 0.007) * Math.PI * 0.5

                if (groupPlane.children[_index].position.x <= 0) {
                    if (e.deltaY < 0 && scrollI > 0) {
                        groupPlane.children[_index].rotation.z -= Math.PI * 0.0065
                    } else if (e.deltaY > 0) {
                        groupPlane.children[_index].rotation.z += Math.PI * 0.0065
                    }
                }

            } else {
                // To hidden
                if (groupPlane.children[_index].visible) {
                    groupPlane.children[_index].visible = false
                }
            }
        }
    }

})

const clock = new THREE.Clock()

const init = () => {
    let elapsedTime = clock.getElapsedTime()
    
    // Update shaders
    planeMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Update renderer
    renderer.render(scene, camera)

    // Call this function
    window.requestAnimationFrame(init)
}

init()
