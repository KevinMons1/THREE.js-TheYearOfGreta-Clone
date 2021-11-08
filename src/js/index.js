import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader"
import { Text } from 'troika-three-text'
import { gsap, Power1 } from "gsap"
import vertexPlaneShader from "../shaders/planes/vertex.glsl"
import fragmentPlaneShader from "../shaders/planes/fragment.glsl"
import vertexBackgroundShader from "../shaders/background/vertex.glsl"
import fragmentBackgroundShader from "../shaders/background/fragment.glsl"
import vertexParticulesShader from "../shaders/particules/vertex.glsl"
import fragmentParticulesShader from "../shaders/particules/fragment.glsl"

//-------------------------------------------------------------------------------------------------------------------
// Global varibale
//-------------------------------------------------------------------------------------------------------------------

const player = document.querySelector(".player")
const playerClose = document.querySelector(".player-close")
const playerSource = document.querySelector(".player-source")
const counterLoading = document.querySelector(".counterLoading")
const header = document.querySelector("header")
const h1 = document.querySelector("h1")
const footer = document.querySelector("footer")
const loading = document.querySelector(".loading")
const started = document.querySelector(".started")
const startedBtn = document.querySelector(".started-btn")
let touchValue = 1
let videoLook = false
let scrollI = 0.0
let initialPositionMeshY = -1
let initialRotationMeshY = Math.PI * 0.9
let planeClickedIndex = -1
let isLoading = false
let lastPosition = {
    px: null,
    py: null,
    pz: null,
    rx: null,
    ry: null,
    rz: null
}
let detailsImage = [
    {
        url: "https://www.youtube.com/watch?v=87MPqPynrXc",
        name: "Transformation Dark Vador\n - Anakin devient Dark Vador"
    },
    {
        url: "https://www.youtube.com/watch?v=FX8rsh83bGk",
        name: "Arrivée Dark Vador\n Étoile de la Mort"
    },
    {
        url: "https://www.youtube.com/watch?v=wxL8bVJhXCM",
        name: "Darth Vader's rage"
    },
    {
        url: "https://www.youtube.com/watch?v=Ey68aMOV9gc",
        name: "VADER EPISODE 1: SHARDS\n OF THE PAST"
    },
    {
        url: "https://www.youtube.com/watch?v=3vZsVKD8BQg",
        name: "Je suis ton père!"
    },
    {
        url: "https://www.youtube.com/watch?v=7Zp66FhjlPU",
        name: "Darth Vader Goes Shopping"
    },
    {
        url: "https://www.youtube.com/watch?v=68vPtAE3cZE",
        name: "Votre manque de foi\n me consterne"
    },
    {
        url: "https://www.youtube.com/watch?v=kocd_C2M9RU",
        name: "LA SOUFFRANCE MÈNE\n AU CÔTÉ OBSCUR"
    },
    {
        url: "https://www.youtube.com/watch?v=k21ONzrwVLY",
        name: "Lord Vader: A Star\n Wars Story"
    },
    {
        url: "https://www.youtube.com/watch?v=JucYYmeh_QY",
        name: 'Dark vador "Hommage"'
    }
]

//-------------------------------------------------------------------------------------------------------------------
// Base
//-------------------------------------------------------------------------------------------------------------------

// Debug
const debugObject = {}

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

// Raycaster
const raycatser = new THREE.Raycaster()
let currentIntersect = null

// Mouse move
let mouse = new THREE.Vector2()

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX / sizesCanvas.width * 2 - 1
    mouse.y = - (e.clientY / sizesCanvas.height) * 2 + 1
})

// Audio

const music = new Audio("sounds/music.mp3")
music.volume = 0.05

const respiration = new Audio("sounds/respiration.mp3")
respiration.volume = 0.01

//-------------------------------------------------------------------------------------------------------------------
// Loaders
//-------------------------------------------------------------------------------------------------------------------

const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        window.setTimeout(() => {
            gsap.to(header, 0.5, {
                top: 10,
                left: 10,
                transform: "translate(0, 0)",
                ease: Power1.easeIn
            })

            gsap.to(h1, 0.5, {
                fontSize: 25,
                top: 10,
                left: 10,
                transform: "translate(0, 0)",
                width: 150,
                ease: Power1.easeIn
            })

            gsap.to(footer, 0.5, {
                delay: 0.4,
                opacity: 1,
                ease: Power1.easeIn
            })

            gsap.to(footer, 0.5, {
                delay: 0.4,
                opacity: 1,
                ease: Power1.easeIn
            })

            gsap.to(counterLoading, 0.5, {
                delay: 0.4,
                opacity: 0,
                ease: Power1.easeIn
            })

            gsap.to(started, 0.5, {
                delay: 0.9,
                opacity: 1
            })

            startedBtn.addEventListener("click", () => continueAnimation())
        }, 50)
    },
    (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal

        counterLoading.innerHTML = `${(progressRatio * 100).toFixed(0)}%`
        header.style.width = `${(progressRatio * 550).toFixed(0)}px`
    }
)

// Continue animation loading
const continueAnimation = () => {
    music.play()
    respiration.play()

    gsap.to(started, 0.5, {
        opacity: 0
    })

    gsap.to(loading, 0.5, {
        opacity: 0
    })

    gsap.from(camera.position, 1.5, {
        x: 4.0,
        z: - 8.5,
        y: 3.0
    })

    setTimeout(() => {
        loading.style.visibility = "hidden"
        started.style.visibility = "hidden"
        groupPlane.visible = true
        groupText.visible = true
        isLoading = true
    }, 250);
}

const textureLoader = new THREE.TextureLoader(loadingManager)

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

const gltfLoader = new GLTFLoader(loadingManager)
let models = []

// Dark Vador
gltfLoader.load(
    "models/Dark_vador/scene.gltf",
    (gltf) => {
        gltf.scene.scale.set(5, 5, 5)
        gltf.scene.position.y = initialPositionMeshY
        gltf.scene.rotation.y = initialRotationMeshY

        scene.add(gltf.scene)
        models.push(gltf.scene)

        scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
                child.material.envMapIntensity = debugObject.envMapIntensity
                child.material.needsUpdate = true
            }
        })
    },
    undefined,
    (err) => {
        console.log(err)
    }
)

let startTouch = 0

// Rock
gltfLoader.load(
    "models/Rock/scene.gltf",
    (gltf) => {
        gltf.scene.scale.set(2.5, 2, 2.5)
        gltf.scene.position.y = initialPositionMeshY - 1.73
        gltf.scene.rotation.y = initialRotationMeshY

        scene.add(gltf.scene)
        models.push(gltf.scene)

        scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
                child.material.envMapIntensity = debugObject.envMapIntensity
                child.material.needsUpdate = true
            }
        })

        // Event Animation
        if("ontouchstart" in window) {

            window.addEventListener('touchstart', (e) => {
                startTouch = e.touches[0].clientY
            }, false)

            window.addEventListener('touchmove', (e) => {
                // animationScroll(e)
                if (e.touches[0].clientY < startTouch) {
                    startTouch = e.touches[0].clientY
                    animationScroll(e, true, startTouch, "up")
                } else {
                    startTouch = e.touches[0].clientY
                    animationScroll(e, true, startTouch, "down")
                }
            }, false)

         } else window.addEventListener("wheel", (e) => animationScroll(e), false)
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
camera.position.x = 0
camera.position.y = 0
camera.position.z = - 5
scene.add(camera)

// background camera
const backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 0)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enabled = false
controls.enableZoom = false

//-------------------------------------------------------------------------------------------------------------------
// Light
//-------------------------------------------------------------------------------------------------------------------

const ambientLight = new THREE.AmbientLight(0xff0000, 1.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 15)
pointLight.position.set(-5.5, 5.5, -5)
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
        uResoltion: { value: new THREE.Vector2(sizesCanvas.width, sizesCanvas.height) },
        uTime: { value: 0.0 }
    }
})

backgroundScene.add(new THREE.Mesh(backgroundPlane, backgroundMaterial))

//-------------------------------------------------------------------------------------------------------------------
// Plane and Text
//-------------------------------------------------------------------------------------------------------------------

// group
const groupPlane = new THREE.Group()
const groupText = new THREE.Group()
groupPlane.visible = false
groupText.visible = false
scene.add(groupPlane, groupText)

// geometry
const planeGeometry = new THREE.PlaneGeometry(2, 1.25, 32, 32)
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
            uTime: { value: 0.0 },
            uTouch: { value: touchValue }
        }
    }))

    // Plane
    const plane = new THREE.Mesh(planeGeometry, planesMaterial[i])
    plane.position.y = i - 14.2
    plane.position.x = - Math.cos(i) * Math.PI
    plane.position.z = - Math.sin(i) * Math.PI
    plane.lookAt(0, plane.position.y, 0)
    
    groupPlane.add(plane)

    // Text
    const newText = new Text()
    newText.text = detailsImage[i].name
    newText.fontSize = 0.1
    newText.position.y = plane.position.y
    newText.position.x = plane.position.x
    newText.position.z = plane.position.z
        
    groupText.add(newText)
}

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
    particulesPositions[i3 + 2] = ((Math.random() - 0.5) * 10) + 2.5

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

const animationScroll = (e, touchEvent, value, downOrUp) => {
    let deltaY

    if (touchEvent) deltaY = value
    else deltaY = e.deltaY

    if (videoLook === false && isLoading) {
        // Known up or down
        if (touchEvent && downOrUp === "down" && scrollI > 0) scrollI--
        else if (!touchEvent && deltaY < 0 && scrollI > 0) scrollI--
    
        if (scrollI <= 435 && scrollI >= 0 && models.length === 2) {
            if (touchEvent && downOrUp === "up") scrollI++
            else if (!touchEvent && deltaY > 0) scrollI++
            const speed = 0.005
        
            //------
            // Update mesh
            //------
        
            models.forEach((model, index) => {
                // rotation
                model.rotation.y = (initialRotationMeshY) - scrollI * 0.01355 // End front of camera
            
                // position
                if (index === 0) model.position.y = (initialPositionMeshY) - scrollI * (speed * 0.8)
                else if (index === 1) model.position.y = (initialPositionMeshY - 1.73) - scrollI * (speed * 0.8)
    
                model.position.z = - scrollI * (speed * 0.75)
            })
        
            //------
            // Update group of planes
            //------
            
            for (let i = 0; i < groupPlane.children.length; i++) {
                const plane = groupPlane.children[i]
                const text = groupText.children[i]
    
                // Planes -------
                // Position
                plane.position.z = - Math.sin(i + 1 * scrollI * (speed * 10)) * Math.PI
                plane.position.x = - Math.cos(i + 1 * scrollI * (speed * 10)) * Math.PI
                plane.position.y = (i - 14.2) + (scrollI * (speed * 10))
    
                // Rotation
                plane.lookAt(0, plane.position.y, 0)
    
                // Text -------
                // Position
                text.position.z = plane.position.z - 0.5
                text.position.x = plane.position.x
                text.position.y = plane.position.y - 0.3

                // Rotation
                text.lookAt(plane.position.x * 2, plane.position.y - 0.3, plane.position.z * 2)
            }
        }
    }
}

function getVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}

window.addEventListener("click", () => {
    handlePlane()
})

const handlePlane = () => {
    if (currentIntersect && videoLook === false && isLoading) {
        for (let i = 0; i < groupPlane.children.length; i++) {
            if (groupPlane.children[i] === currentIntersect.object) {
                planeClickedIndex = i
                music.pause()
                respiration.pause()

                lastPosition = {
                    px: groupPlane.children[i].position.x,
                    py: groupPlane.children[i].position.y,
                    pz: groupPlane.children[i].position.z,
                    rx: groupPlane.children[i].rotation.x,
                    ry: groupPlane.children[i].rotation.y,
                    rz: groupPlane.children[i].rotation.z
                }

                gsap.to(groupPlane.children[i].position, 0.5, {
                    z: camera.position.z + 0.5,
                    x: camera.position.x,
                    y: camera.position.y,
                    ease: Power1.easeIn
                })

                gsap.to(groupPlane.children[i].rotation, 0.5, {
                    z: 0,
                    x: 0,
                    y: 0,
                    ease: Power1.easeIn
                })

                const videoId = getVideoId(detailsImage[i].url);
                playerSource.src = "https://www.youtube.com/embed/" + videoId
                
                setTimeout(() => {
                    player.style.visibility = "visible"

                    gsap.to(player, 0.5, {
                        opacity: 1,
                        ease: Power1.easeIn
                    }) 
                }, 400);

                videoLook = true
            }
        }
    }
}

playerClose.addEventListener("click", () => {
    playerSource.src = ""
    music.play()
    respiration.play()

    gsap.to(player, 0.5, {
        opacity: 0,
        ease: Power1.easeIn
    }) 
    player.style.visibility = "hidden"

    gsap.to(groupPlane.children[planeClickedIndex].position, 0.5, {
        x: lastPosition.px,
        y: lastPosition.py,
        z: lastPosition.pz,
        ease: Power1.easeIn
    }) 

    gsap.to(groupPlane.children[planeClickedIndex].rotation, 0.5, {
        x: lastPosition.rx,
        y: lastPosition.ry,
        z: lastPosition.rz,
        ease: Power1.easeIn
    }) 

    planeClickedIndex = -1

    setTimeout(() => {
        videoLook = false
    }, 500);
})

// Animation hover plane black and white to color
let goalValue = 0

const changeTouchValue = (index) => {
    if (index >= 0) {
        const interval = setInterval(() => {
            if (goalValue === 1) touchValue += 0.01
            else if (goalValue === 0) touchValue -= 0.01
    
            groupPlane.children[index].material.uniforms.uTouch.value = touchValue
    
            if (parseFloat(touchValue.toFixed(1)) === goalValue) {
                clearInterval(interval)
                goalValue = goalValue === 0 ? 1 : 0
            }
        }, 7);
    }
}

const clock = new THREE.Clock()

let callChangeTouchValue = 0
let touchI = - 1

const init = () => {
    const elapsedTime = clock.getElapsedTime()
        
    // Update shaders
    planesMaterial.forEach(plane => {
        plane.uniforms.uTime.value = elapsedTime
        plane.uniforms.uScrollI.value = scrollI
    })
    backgroundMaterial.uniforms.uScrollI.value = scrollI
    backgroundMaterial.uniforms.uTime.value = elapsedTime
    particulesMaterial.uniforms.uTime.value = elapsedTime

    // Upadate raycaster
    if(!("ontouchstart" in window)) raycatser.setFromCamera(mouse, camera)
    const intersects = raycatser.intersectObjects(groupPlane.children)

    // black and white to colo animation with raycaster
    if (isLoading) {
        if (intersects.length === 1) {
            if (currentIntersect === null) {
                currentIntersect = intersects[0]
            } else {
                for (let i = 0; i < groupPlane.children.length; i++) {
                    if (groupPlane.children[i] === currentIntersect.object) {
                        if (callChangeTouchValue === 0) {
                            touchI = i
                            changeTouchValue(i)
                            callChangeTouchValue = 1
                            document.body.style.cursor = "pointer"               
                        }
                    }
                }
            }
        } else {
            if (callChangeTouchValue === 1 && touchI >= 0) {
                changeTouchValue(touchI)
                callChangeTouchValue = 0
                document.body.style.cursor = "auto" 
                currentIntersect = null
                touchI = - 1
            }
        }
    }

    // Update renderer
    renderer.render(scene, camera)
    renderer.render(backgroundScene, backgroundCamera)

    // Call this function
    window.requestAnimationFrame(init)
}

init()