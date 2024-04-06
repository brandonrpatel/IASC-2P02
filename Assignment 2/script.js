import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/* SETUP */

// Sizes
const sizes = {
    width: window.innerWidth / 2.5,
    height: window.innerWidth / 2.5,
    aspectRatio: 1
}

/* SCENE */

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('gray')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)

camera.position.set(0, 0, 20)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*LIGHTS */

// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/* MESHES */

// Dodecahedron Geometry
const dodecahedronGeometry = new THREE.DodecahedronGeometry(0.5)

// Dodecahedron Materials
const redMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('brown')
})
const greenMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('beige')
})
const blueMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('yellow')
})

const drawDodecahedron = (i, material) =>
{
    const dodecahedron = new THREE.Mesh(dodecahedronGeometry, material)
    dodecahedron.position.x = (Math.random() - 0.5) * 10
    dodecahedron.position.z = (Math.random() - 0.5) * 10
    dodecahedron.position.y = i - 10

    dodecahedron.rotation.x = Math.random() * 2 * Math.PI
    dodecahedron.rotation.y = Math.random() * 2 * Math.PI
    dodecahedron.rotation.z = Math.random() * 2 * Math.PI

    scene.add(dodecahedron)
}

/* TEXT PARSERS & UI */

let preset = {}

const uiobj = {
    text: '',
    textArray: [],
    term1: 'summers',
    term2: 'hutchinson',
    term3: 'graves',
    rotateCamera: false
}


// Parse Text and Terms
const parseTextandTerms = () =>
{
    // Strip periods and downcase text
    const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()

    // Tokenize text
    uiobj.textArray = parsedText.split(/[^\w']+/)

    // Find term 1
    findTermInParsedText(uiobj.term1, redMaterial)

    // Find term 2
    findTermInParsedText(uiobj.term2, greenMaterial)

    // Find term 3
    findTermInParsedText(uiobj.term3, blueMaterial)

}

const findTermInParsedText = (term, material) =>
{
    for (let i=0; i < uiobj.textArray.length; i++)
    {
        if(uiobj.textArray[i] === term)
        {
         const n = (100 / uiobj.textArray.length) * i * 0.2
         
         for(let a=0; a < 5; a++)
         {
            drawDodecahedron(n, material)
         }

        }
    }
}

// Load source text
fetch("The Lottery.txt")
    .then(response => response.text())
    .then((data) =>
    {
        uiobj.text = data
        parseTextandTerms()
    })

// UI
const ui = new dat.GUI({
    container: document.querySelector('#parent1')
})

// Interaction Folders

    // Dodecahedrons Folder
    const dodecahedronsFolder = ui.addFolder('Filter Terms')

    dodecahedronsFolder
        .add(redMaterial, 'visible')
        .name(`${uiobj.term1}`)

    dodecahedronsFolder
        .add(greenMaterial, 'visible')
        .name(`${uiobj.term2}`)

    dodecahedronsFolder
        .add(blueMaterial, 'visible')
        .name(`${uiobj.term3}`)

    // Camera Folder
    const cameraFolder = ui.addFolder('Camera')

    cameraFolder
        .add(uiobj, 'rotateCamera')
        .name('Rotate Camera')

/* ANIMATION LOOP */
const clock = new THREE.Clock()

// Animate
const animation = () =>
{
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    if(uiobj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime * 0.2) * 16
        camera.position.z = Math.cos(elapsedTime * 0.2) * 16
    }

    renderer.render(scene, camera)

    window.requestAnimationFrame(animation)
}

animation()
