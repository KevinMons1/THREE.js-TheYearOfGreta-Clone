import * as THREE from "three"
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//------------------------
// Global varibale
//------------------------

let meshI = 0
let initialPositionMeshY = 0.5
let initialRotationMeshY = 0.25
let groupObjectMemo = []

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
camera.position.z = 5
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)

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
// Object
//------------------------

// group
const groupObject = new THREE.Group()
scene.add(groupObject)

// geometry
const objectGeometry = new THREE.BoxGeometry(1.25, 0.75, 0.01)

// material
const objectMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })

// Create object and memo those positions
for (let i = 0; i < 10; i++) {
    const object = new THREE.Mesh(objectGeometry, objectMaterial)

    const positionX = Math.cos(i) * Math.PI * 0.5
    const positionZ = Math.sin(i) * Math.PI * 0.5
    const positionY = i - 8
    const rotationY = (initialRotationMeshY) * Math.PI * (- i)

    object.position.x = positionX
    object.position.z = positionZ
    object.position.y = positionY
    object.rotation.y = rotationY

    // object.rotation.z = - 0.05

    groupObject.add(object)

    // Copy object for not reference
    groupObjectMemo.push({
        position: {
            x: positionX,
            z: positionZ,
            y: positionY,
        },
        rotation: {
            y: rotationY
        }
    })
}

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

    // Known down or up
    if (e.deltaY < 0 && meshI > 0) meshI--
    else if (e.deltaY > 0) meshI++
    
    //------
    // Update mesh
    //------

    // rotation
    boxMesh.rotation.y = (initialRotationMeshY) - meshI * 0.01

    // position
    boxMesh.position.y = (initialPositionMeshY) - meshI * speed
    boxMesh.position.z = meshI * speed * 0.5

    //------
    // Update element on group
    //------
    
    console.log(groupObjectMemo[0].position.x, Math.cos(meshI * 0.05))
    groupObject.children.forEach((object, index) => {
        // rotation
        object.rotation.y = (groupObjectMemo[index].rotation.y) - meshI * 0.01 * 2
        
        // position
        object.position.z = (groupObjectMemo[index].position.z) - Math.sin(meshI * 0.05) * Math.PI * 0.5 
        object.position.x = (groupObjectMemo[index].position.x) - Math.cos(meshI * 0.05)
        object.position.y = (groupObjectMemo[index].position.y) + (meshI * 0.05) 
    })
    console.log((groupObjectMemo[0].position.x))
})

const animation = () => {
    // Update controls
    // controls.update()

    // Update renderer
    renderer.render(scene, camera)

    // Call this function
    window.requestAnimationFrame(animation)
}

animation()
