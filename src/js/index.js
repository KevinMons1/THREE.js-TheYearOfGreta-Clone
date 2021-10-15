import * as THREE from "three"
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader"
import vertexPlaneShader from "../shaders/planes/vertex.glsl"
import fragmentPlaneShader from "../shaders/planes/fragment.glsl"
import vertexBackgroundShader from "../shaders/background/vertex.glsl"
import fragmentBackgroundShader from "../shaders/background/fragment.glsl"

//------------------------
// Global varibale
//------------------------

let scrollI = 0.0
let initialPositionMeshY = -1
let initialRotationMeshY = 0.25

let initialRotationGroupY = Math.PI * 0.75

let scrollPlaneI = []

let startFloat = false;

//------------------------
// Base
//------------------------

// Debug
const debugObject = {}
const gui = new dat.GUI()

// canvas
const canvas = document.querySelector(".main-webgl")

// scene
const scene = new THREE.Scene()
scene.background = new THREE.Color("#fff")

// background scene
const backgroundScene = new THREE.Scene()

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
// Loaders
//------------------------

const textureLoader = new THREE.TextureLoader()
const imageTest = textureLoader.load("images/cat.jpg")
const gltfLoader = new GLTFLoader()

// console.log(darkVadorModel)

gltfLoader.load(
    "models/scene.gltf",
    (gltf) => {
        gltf.scene.scale.set(5, 5, 5)
        gltf.scene.position.y = initialPositionMeshY
        gltf.scene.rotation.y = initialRotationMeshY

        scene.add(gltf.scene)

        scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
                // child.material.envMap = environmentMap
                child.material.envMapIntensity = debugObject.envMapIntensity
                child.material.needsUpdate = true
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        // Animation
        window.addEventListener("wheel", (e) => animationScroll(e, gltf.scene), false)

    },
    undefined,
    (err) => {
        console.log(err)
    }
)

debugObject.envMapIntensity = 5

//------------------------
// Camera
//------------------------

// camera
const camera = new THREE.PerspectiveCamera(75, sizesCanvas.width / sizesCanvas.height, 0.1, 100)
camera.position.z = 4.5
scene.add(camera)

// background camera
const backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 0)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableZoom = false

//------------------------
// Light
//------------------------

const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.set(0, 3, 5)
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

gui.add(pointLight.position, "x").min(-5).max(10).step(0.01).name("pointLight x")
gui.add(pointLight.position, "y").min(-5).max(10).step(0.01).name("pointLight y")
gui.add(pointLight.position, "z").min(-5).max(10).step(0.01).name("pointLight z")

//------------------------
// Model
//------------------------

// geometry
const boxGeometry = new THREE.BoxGeometry(1.5, 6, 1.5)

// material
const boxMaterial = new THREE.MeshStandardMaterial()
// const boxMaterial = new THREE.MeshBasicMaterial({ map: imageTest })

// mesh
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
boxMesh.visible = false
boxMesh.position.y = initialPositionMeshY
boxMesh.rotation.y = initialRotationMeshY
boxMesh.position.z = 0

scene.add(boxMesh)

// mesh background
const backgroundPlane = new THREE.PlaneBufferGeometry(2, 2)
const backgroundMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexBackgroundShader,
    fragmentShader: fragmentBackgroundShader,
    uniforms: {
        uScrollI: { value: scrollI },
        uResoltion: { value: new THREE.Vector2(sizesCanvas.width, sizesCanvas.height) }
    }
})

backgroundScene.add(new THREE.Mesh(backgroundPlane, backgroundMaterial))

//------------------------
// Plane
//------------------------

// group
const groupPlane = new THREE.Group()
scene.add(groupPlane)

// geometry
const planeGeometry = new THREE.PlaneGeometry(1.5, 1, 32, 32)

// material
const planeMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    vertexShader: vertexPlaneShader,
    fragmentShader: fragmentPlaneShader,
    uniforms: {
        uScrollI: { value: scrollI },
        uTexture: { value: imageTest },
        uStartFloat: { value: startFloat },
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
renderer.autoClear = false

//------------------------
// Animation
//------------------------

let isScrolling

const animationScroll = (e, darkVador) => {
    if (scrollI <= 435 && scrollI >= 0) {
        const speed = 0.005
    
        window.clearTimeout( isScrolling )
        if (!startFloat) startFloat = true
    
        // Known up or down
        if (e.deltaY < 0 && scrollI > 0) scrollI--
        else if (e.deltaY > 0) scrollI++
        
        //------
        // Update mesh
        //------
    
        // rotation
        darkVador.rotation.y = (initialRotationMeshY) - scrollI * 0.015
    
        // position
        darkVador.position.y = (initialPositionMeshY) - scrollI * (speed * 0.8)
        darkVador.position.z = scrollI * (speed * 0.75) 
    
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
    
        // Known when user stop scroll
        isScrolling = setTimeout(() => {
            console.log("stop scroll")
            startFloat = false
        }, 80);
    }
}

const clock = new THREE.Clock()

const init = () => {
    const elapsedTime = clock.getElapsedTime()
    
    // Update shaders
    planeMaterial.uniforms.uTime.value = elapsedTime
    planeMaterial.uniforms.uScrollI.value = scrollI
    backgroundMaterial.uniforms.uScrollI.value = scrollI
    planeMaterial.uniforms.uStartFloat.value = startFloat

    // Update controls
    controls.update()

    // Update renderer
    renderer.render(scene, camera)
    renderer.render(backgroundScene, backgroundCamera)

    // Call this function
    window.requestAnimationFrame(init)
}

init()
