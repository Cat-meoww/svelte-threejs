import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import { OrbitControls } from '@three-ts/orbit-controls';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
const clock = new THREE.Clock();

let mixer: THREE.AnimationMixer
const mixers: THREE.AnimationMixer[] = [];
let renderer: THREE.WebGLRenderer;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd1dff6);
const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
camera.position.z = 30;
camera.position.y = 10;







const Grid = new THREE.GridHelper(100, 40)

scene.add(Grid)


const AmbienceLight = new THREE.AmbientLight(0xffffff, 2);
AmbienceLight.position.set(0, 10, 0);
scene.add(AmbienceLight)


const Light = new THREE.DirectionalLight(0xffffff, 4);
Light.position.set(50, 50, 50)
Light.castShadow = true
// Light.shadow.camera.bottom = -15
scene.add(Light)

const SpotLight = new THREE.HemisphereLight(0xffffff, 4);
SpotLight.position.set(-50, 50, 50)

// SpotLight.shadow.camera.bottom = -15
scene.add(SpotLight)

const LightHelper = new THREE.DirectionalLightHelper(Light, 1);
scene.add(LightHelper)
const SLightHelper = new THREE.CameraHelper(Light.shadow.camera);
scene.add(SLightHelper)



const axestHelper = new THREE.AxesHelper(30);
scene.add(axestHelper)

const planeGeometry = new THREE.PlaneGeometry(30, 50);
const PlaneMaterial = new THREE.MeshStandardMaterial({
    color: 0x0FFFFFF,
    side: THREE.DoubleSide
});
const PlaneMesh = new THREE.Mesh(planeGeometry, PlaneMaterial)
PlaneMesh.receiveShadow = true
PlaneMesh.rotation.x = -0.5 * Math.PI
scene.add(PlaneMesh)


const GLTFloader = new GLTFLoader();
const objLoader = new OBJLoader();

const BunnyModal = async () => {
    const gltf = await GLTFloader.loadAsync('/glitchtrap/scene.gltf');
    const model = gltf.scene;
    model.castShadow = true
    scene.add(model);
    console.log({ model, gltf })

    if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
    }
}
const textureLoader = new THREE.TextureLoader();

const SwordManModal = async () => {
    const matcapTexture = textureLoader.load('/origami/2.jpeg');
    const gltf = await GLTFloader.loadAsync('/Swordman/scene.gltf');
    const originalModel = gltf.scene;
    originalModel.traverse(function (child) {
        if (child.isMesh) {
            // Replace the material with a new one
            child.material = new THREE.MeshMatcapMaterial({

                matcap: matcapTexture,
            });
        }
    });


    console.log({ originalModel, gltf })

    if (gltf.animations && gltf.animations.length > 0) {
        console.log("Hello")
        let row = 0



        gltf.animations.forEach((clip, index) => {

            const clonedModel = SkeletonUtils.clone(originalModel);
            const multipler = index * 2.5
            const module = multipler % 12.5


            clonedModel.position.set(module, 0, row)
            if (module == 10) {
                row += 5
            }
            console.log(clip.name, index, { X: module, y: row })
            scene.add(clonedModel);


            const mixer = new THREE.AnimationMixer(clonedModel);
            mixers.push(mixer);
            scene.add(clonedModel);
            const action = mixer.clipAction(clip);
            action.play();
        });

        // originalModel.position.set(0,0,0)
        // scene.add(originalModel);

    } else {
        originalModel.position.set(0, 0, 0)
        originalModel.castShadow = true

        originalModel.traverse(function (child) {
            if (child.isMesh) {
                // Replace the material with a new one
                child.material = new THREE.MeshMatcapMaterial({

                    matcap: matcapTexture,
                });
            }
        });
        scene.add(originalModel);
    }
}


const StatueModal = async () => {
    const matcapTexture = textureLoader.load('/origami/2.jpeg');
    const model = await objLoader.loadAsync('/Alexander_noHole_OBJ.obj');

    model.traverse(function (child: any) {
        if (child.isMesh) {
            // Replace the material with a new one
            child.material = new THREE.MeshMatcapMaterial({
               
                matcap: matcapTexture,
            });
        }
    });


    console.log({ model })


    model.position.set(0, 0, 0)
    model.scale.set(0.1, 0.1, 0.1)
    model.castShadow = true


    scene.add(model);

}


export function canvas(el: HTMLElement) {
    let animationFrameId: number;

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.shadowMap.enabled = true;



    new OrbitControls(camera, el);


    //BunnyModal()
    //SwordManModal()
    StatueModal()

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        // Update animations
        const delta = clock.getDelta();
        // if (mixer) mixer.update(clock.getDelta());

        mixers.forEach(mixer => mixer.update(delta));



        renderer.render(scene, camera);
    };


    const resize = () => {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight)
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return {
        destroy() {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);

            // el.removeChild(renderer.domElement);
            renderer.dispose();
        }
    };
}

