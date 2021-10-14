import * as THREE from "three"
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//------------------------
// Global varibale
//------------------------

let scrollI = 0
let initialPositionMeshY = 0.5
let initialRotationMeshY = 0.25

let initialRotationGroupY = Math.PI * 0.75

let scrollObjectI = []

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
    
    // const positionZ = Math.sin(i) * 2.5
    // const positionX = Math.cos(i) * 2.5
    // const rotationY = Math.PI * Math.abs(positionZ, positionX)
    
    // object.position.x = positionX
    // object.position.z = positionZ
    // object.position.y = i - 10

    // // object.rotation.y = - Math.abs(positionZ, positionX) * Math.PI * 0.5  // a garder car on se rapproche
    // object.rotation.y = rotationY

    object.position.y = i - 13

    groupObject.add(object)
    scrollObjectI.push(0)
}

groupObject.rotation.y = initialRotationGroupY

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
    if (e.deltaY < 0 && scrollI > 0) scrollI--
    else if (e.deltaY > 0) scrollI++
    
    //------
    // Update mesh
    //------

    // rotation
    boxMesh.rotation.y = (initialRotationMeshY) - scrollI * 0.01

    // position
    boxMesh.position.y = (initialPositionMeshY) - scrollI * (speed * 2.5)
    boxMesh.position.z = scrollI * speed 

    //------
    // Update group of objects
    //------

    // groupObject.rotation.y = (initialRotationGroupY) - (Math.sin(scrollI * 0.005) * Math.PI * 0.55) * 10
    // groupObject.position.y = (scrollI * 0.08) 
    groupObject.position.y = (scrollI * 0.04) 

    groupObject.children.forEach((child, index) => {
        console.log(scrollI)
        if (groupObject.position.y >= 0) {
            if (scrollI >= (index + 1) * 25) {
                if (e.deltaY < 0 && scrollI > 0)  scrollObjectI[index]--
                else if (e.deltaY > 0)  scrollObjectI[index]++

                console.log(scrollObjectI[index])

                const _index = groupObject.children.length - (index + 1)
                groupObject.children[_index].position.z = Math.sin(scrollObjectI[index] * 0.05) * Math.PI * 0.6
                groupObject.children[_index].position.x = Math.cos(scrollObjectI[index] * 0.05) * Math.PI * 0.6
                groupObject.children[_index].rotation.y = Math.sin(scrollObjectI[index] * 0.007) * Math.PI * 0.5
            }
        }
        // const _index = groupObject.children.length - (index + 1)
        // groupObject.children[_index].position.z = Math.sin(scrollI * 0.05) * Math.PI * 0.6
        // groupObject.children[_index].position.x = Math.cos(scrollI * 0.05) * Math.PI * 0.6
        // groupObject.children[_index].rotation.y = Math.sin(scrollI * 0.007) * Math.PI * 0.5
    })

})



const init = () => {
    // Update controls
    controls.update()

    // Update renderer
    renderer.render(scene, camera)

    // Call this function
    window.requestAnimationFrame(init)
}

init()
