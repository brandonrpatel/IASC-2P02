import * as THREE from "three"
import { GLTFLoader } from "GLTFLoader"

/**SETUP ***/


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

let xDistance = 2
let meshSize = 1


if(sizes.aspectRatio < 1){
    xDistance = 1
    meshSize = 1
}


window.addEventListener('resize', () =>
{
    
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight
    
    
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/* SCENE **/


const canvas = document.querySelector('.webgl')


const scene = new THREE.Scene()


const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)

camera.position.set(0, 0, 5)
scene.add(camera)


const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})

renderer.setSize(sizes.width, sizes.height)

/* LIGHTS */


const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/** MESHES **/

const cubeGeometry = new THREE.BoxGeometry(meshSize, meshSize, meshSize)
const cubeMaterial = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

cube.position.set(-xDistance, 0, -3)


/* GLTF MODELS */

const loader = new GLTFLoader()
let model = null

loader.load(


    'source/scene.gltf',
    
    function(gltf){
        model = gltf.scene

        model.position.set(-xDistance, 0, 0)
        model.scale.set(meshSize, meshSize, meshSize)

        scene.add(model)
    },

   
    function(xhr){
        console.log('loading 3d model')
    },
   
    function(error){
        console.log('Error loading 3d model')
    }

)

/**DOM INTERACTIONS */

const domObject = {
    part: 1
}


document.querySelector('#click1').onclick = function(){
    document.querySelector('#first').classList.add('hidden')
    document.querySelector('#second').classList.remove('hidden')
    domObject.part = 2
}



document.querySelector('#click2').onclick = function(){
    document.querySelector('#second').classList.add('hidden')
    document.querySelector('#third').classList.remove('hidden')
    domObject.part = 3
}


document.querySelector('#click3').onclick = function() {
    document.querySelector('#third').classList.add('hidden')
    document.querySelector('#first').classList.remove('hidden')
    domObject.part = 1
}

/* CURSOR */
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', () =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -event.clientY / sizes.height + 0.5
    
})

/**ANIMATION LOOP **/

const clock = new THREE.Clock()


const animation = () => {

    const elapsedTime = clock.getElapsedTime()

    
    if(model)
    {
        model.rotation.y = cursor.x * 2
        model.rotation.x = cursor.y + .25
    }


    renderer.render(scene, camera)


    window.requestAnimationFrame(animation)
}

animation()
