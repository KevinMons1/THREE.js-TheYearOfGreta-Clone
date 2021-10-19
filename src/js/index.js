import * as THREE from "three"
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader"
import {Text} from 'troika-three-text'
import vertexPlaneShader from "../shaders/planes/vertex.glsl"
import fragmentPlaneShader from "../shaders/planes/fragment.glsl"
import vertexBackgroundShader from "../shaders/background/vertex.glsl"
import fragmentBackgroundShader from "../shaders/background/fragment.glsl"
import vertexParticulesShader from "../shaders/particules/vertex.glsl"
import fragmentParticulesShader from "../shaders/particules/fragment.glsl"

//-------------------------------------------------------------------------------------------------------------------
// Global varibale
//-------------------------------------------------------------------------------------------------------------------

let scrollI = 0.0
let initialPositionMeshY = -1
let initialRotationMeshY = 0.25

let initialRotationGroupY = Math.PI * 0.75

let scrollPlaneI = []

let startFloat = false;

let urlImage = [
    "https://www.youtube.com/watch?v=87MPqPynrXc",
    "https://www.youtube.com/watch?v=FX8rsh83bGk",
    "https://www.youtube.com/watch?v=wxL8bVJhXCM",
    "https://www.youtube.com/watch?v=Ey68aMOV9gc",
    "https://www.youtube.com/watch?v=3vZsVKD8BQg",
    "https://www.youtube.com/watch?v=7Zp66FhjlPU",
    "https://www.youtube.com/watch?v=68vPtAE3cZE",
    "https://www.youtube.com/watch?v=kocd_C2M9RU",
    "https://www.youtube.com/watch?v=k21ONzrwVLY",
    "https://www.youtube.com/watch?v=JucYYmeh_QY"
]

//-------------------------------------------------------------------------------------------------------------------
// Base
//-------------------------------------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------------------------------------------
// Loaders
//-------------------------------------------------------------------------------------------------------------------

const textureLoader = new THREE.TextureLoader()

const imagesLoad1 = textureLoader.load("./images/img1.jpg")
const imagesLoad2 = textureLoader.load("./images/img2.jpg")
const imagesLoad3 = textureLoader.load("./images/img3.jpg")
const imagesLoad4 = textureLoader.load("./images/img4.jpg")
const imagesLoad5 = textureLoader.load("./images/img5.jpg")
const imagesLoad6 = textureLoader.load("./images/img6.jpg")
const imagesLoad7 = textureLoader.load("./images/img7.jpg")
const imagesLoad8 = textureLoader.load("./images/img8.jpg")
const imagesLoad9 = textureLoader.load("./images/img9.jpg")
const imagesLoad10 = textureLoader.load("./images/img10.jpg")
const images = [imagesLoad1, imagesLoad2, imagesLoad3, imagesLoad4, imagesLoad5, imagesLoad6, imagesLoad7, imagesLoad8, imagesLoad9, imagesLoad10]

const gltfLoader = new GLTFLoader()
let models = []

// // Dark Vador
// gltfLoader.load(
//     "models/Dark_vador/scene.gltf",
//     (gltf) => {
//         gltf.scene.scale.set(5, 5, 5)
//         gltf.scene.position.y = initialPositionMeshY
//         gltf.scene.rotation.y = initialRotationMeshY

//         scene.add(gltf.scene)
//         models.push(gltf.scene)

//         scene.traverse((child) =>
//         {
//             if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
//             {
//                 // child.material.envMap = environmentMap
//                 child.material.envMapIntensity = debugObject.envMapIntensity
//                 child.material.needsUpdate = true
//                 child.castShadow = true
//                 child.receiveShadow = true
//             }
//         })
//     },
//     undefined,
//     (err) => {
//         console.log(err)
//     }
// )

// // Rock
gltfLoader.load(
    "models/Rock/scene.gltf",
    (gltf) => {
        gltf.scene.scale.set(3.5, 2, 3.5)
        gltf.scene.position.y = initialPositionMeshY - 1.73
        gltf.scene.rotation.y = initialRotationMeshY
        gltf.scene.visible = false

        scene.add(gltf.scene)
        models.push(gltf.scene)

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
        window.addEventListener("wheel", (e) => animationScroll(e), false)
    },
    undefined,
    (err) => {
        console.log(err)
    }
)

debugObject.envMapIntensity = 5

//-------------------------------------------------------------------------------------------------------------------
// Camera
//-------------------------------------------------------------------------------------------------------------------

// camera
const camera = new THREE.PerspectiveCamera(75, sizesCanvas.width / sizesCanvas.height, 0.1, 100)
camera.position.z = 4.5
scene.add(camera)

// background camera
const backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 0)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableZoom = false

//-------------------------------------------------------------------------------------------------------------------
// Light
//-------------------------------------------------------------------------------------------------------------------

const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.set(0, 3, 5)
scene.add(pointLight)

//-------------------------------------------------------------------------------------------------------------------
// Model
//-------------------------------------------------------------------------------------------------------------------


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

//-------------------------------------------------------------------------------------------------------------------
// Plane and Text
//-------------------------------------------------------------------------------------------------------------------

// group
const groupPlane = new THREE.Group()
const groupText = new THREE.Group()
scene.add(groupPlane, groupText)

// geometry
const planeGeometry = new THREE.PlaneGeometry(1.5, 1, 32, 32)
const planesMaterial = []

// Create planes
for (let i = 0; i < 10; i++) {
    planesMaterial.push(new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: vertexPlaneShader,
        fragmentShader: fragmentPlaneShader,
        uniforms: {
            uScrollI: { value: scrollI },
            uTexture: { value: images[i] },
            uStartFloat: { value: startFloat },
            uTime: { value: 0.0 }
        }
    }))

    const plane = new THREE.Mesh(planeGeometry, planesMaterial[i])

    plane.position.y = i - 13
    plane.rotation.z = - 1

    scrollPlaneI.push(0)
    
    const newText = new Text()
    newText.text = "Hello world"
    newText.fontSize = 0.25
    newText.position.y = plane.position.y
    newText.rotation.z = - plane.rotation.z

    groupText.add(newText)
    groupPlane.add(plane)
}

groupPlane.rotation.y = initialRotationGroupY

//-------------------------------------------------------------------------------------------------------------------
// Particules
//-------------------------------------------------------------------------------------------------------------------

const particuleGeometry = new THREE.BufferGeometry()
const particulesCount = 30
const particulesPositions = new Float32Array(particulesCount * 3)
const particulesScales = new Float32Array(particulesCount)

for (let i = 0; i < particulesCount; i++) {
    const i3 = i * 3

    particulesPositions[i3] = (Math.random() - 0.5) * 10
    particulesPositions[i3 + 1] = (Math.random() * 1.5) - 2
    particulesPositions[i3 + 2] = ((Math.random() - 0.5) * 10) - 2.5

    particulesScales[i] = Math.random()
}

particuleGeometry.setAttribute("position", new THREE.BufferAttribute(particulesPositions, 3))
particuleGeometry.setAttribute("aScale", new THREE.BufferAttribute(particulesScales, 1))

const particulesMaterial = new THREE.ShaderMaterial({
    blanding: THREE.AdditiveBlending,
    vertexShader: vertexParticulesShader,
    fragmentShader: fragmentParticulesShader,
    uniforms: {
        uTime: { value: 0.0 },
        uSize: { value: 10.0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    }
})

const particules = new THREE.Points(particuleGeometry, particulesMaterial)
scene.add(particules)

//-------------------------------------------------------------------------------------------------------------------
// Renderer
//-------------------------------------------------------------------------------------------------------------------

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizesCanvas.width, sizesCanvas.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.autoClear = false

//-------------------------------------------------------------------------------------------------------------------
// Animation
//-------------------------------------------------------------------------------------------------------------------

let isScrolling

const animationScroll = (e) => {

    // Known up or down
    if (e.deltaY < 0 && scrollI > 0) scrollI--

    if (scrollI <= 435 && scrollI >= 0) {
        if (e.deltaY > 0) scrollI++
        const speed = 0.005
    
        window.clearTimeout( isScrolling )
        if (!startFloat) startFloat = true
       
        //------
        // Update mesh
        //------
    
        models.forEach((model, index) => {
            // rotation
            model.rotation.y = (initialRotationMeshY) - scrollI * 0.015
        
            // position
            if (index === 0) model.position.y = (initialPositionMeshY) - scrollI * (speed * 0.8)
            else model.position.y = (initialPositionMeshY - 1.73) - scrollI * (speed * 0.8)
            model.position.z = scrollI * (speed * 0.75) 
        })
    
        //------
        // Update group of planes
        //------
    
        groupPlane.position.y = (scrollI * 0.04) 
        groupText.position.y = (scrollI * 0.04) 
    
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
        
                    // Apply animation according to your scrollPlaneI[i]
                    groupPlane.children[_index].position.z = Math.sin(scrollPlaneI[i] * 0.05) * Math.PI * 0.8
                    groupPlane.children[_index].position.x = Math.cos(scrollPlaneI[i] * 0.05) * Math.PI * 0.8
                    groupPlane.children[_index].rotation.y = Math.sin(scrollPlaneI[i] * 0.007) * Math.PI * 0.5

                    console.log(groupPlane.children[9].position.x)
                    console.log(groupText.children[9].position.x)

                    groupText.children[_index].position.z = Math.sin(scrollPlaneI[i] * 0.05) * Math.PI * 0.8
                    groupText.children[_index].position.x = Math.cos(scrollPlaneI[i] * 0.05) * Math.PI * 0.8
                    groupText.children[_index].rotation.y = Math.sin(scrollPlaneI[i] * 0.007) * Math.PI * 0.5
    
                    if (groupPlane.children[_index].position.x <= 0) {
                        if (e.deltaY < 0 && scrollI > 0) {
                            groupPlane.children[_index].rotation.z -= Math.PI * 0.0065
                            groupText.children[_index].rotation.z -= Math.PI * 0.0065
                        } else if (e.deltaY > 0) {
                            groupPlane.children[_index].rotation.z += Math.PI * 0.0065
                            groupText.children[_index].rotation.z += Math.PI * 0.0065
                        }
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
    planesMaterial.forEach(plane => {
        plane.uniforms.uTime.value = elapsedTime
        plane.uniforms.uScrollI.value = scrollI
    })
    backgroundMaterial.uniforms.uScrollI.value = scrollI
    particulesMaterial.uniforms.uTime.value = elapsedTime

    // Update text
    // texts.forEach(text => text.sync())

    // Update controls
    controls.update()

    // Update renderer
    renderer.render(scene, camera)
    renderer.render(backgroundScene, backgroundCamera)

    // Call this function
    window.requestAnimationFrame(init)
}

init()
