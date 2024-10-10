import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from '@three-ts/orbit-controls';

let renderer: THREE.WebGLRenderer;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
camera.position.z = 15;
camera.position.y = 15;

// const helper = new THREE.CameraHelper(camera);
//scene.add(helper);

const earthGroup = new THREE.Group();
scene.add(earthGroup);

// const geometry = new THREE.IcosahedronGeometry(2.5, 18);
const Spheregeometry = new THREE.SphereGeometry(0.5, 32, 32);

const SphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0CAF95,
    side: THREE.DoubleSide
});

const SphereMesh = new THREE.Mesh(Spheregeometry, SphereMaterial)
SphereMesh.castShadow = true
SphereMesh.position.y = 0.5
scene.add(SphereMesh)



const Grid = new THREE.GridHelper(100, 40)

scene.add(Grid)


const AmbienceLight = new THREE.AmbientLight(0x333333, 8);
AmbienceLight.position.set(0, 10, 0);
scene.add(AmbienceLight)


const Light = new THREE.DirectionalLight(0xffffff, 4);
Light.position.set(-2, 10, 10);
Light.castShadow = true
// Light.shadow.camera.bottom = -15
scene.add(Light)

const LightHelper = new THREE.DirectionalLightHelper(Light, 1);
scene.add(LightHelper)
const SLightHelper = new THREE.CameraHelper(Light.shadow.camera);
scene.add(SLightHelper)



const axestHelper = new THREE.AxesHelper(5);
scene.add(axestHelper)

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const PlaneMaterial = new THREE.MeshStandardMaterial({
    color: 0x0FFFFFF,
    side: THREE.DoubleSide
});
const PlaneMesh = new THREE.Mesh(planeGeometry, PlaneMaterial)
PlaneMesh.receiveShadow = true
PlaneMesh.rotation.x = -0.5 * Math.PI
scene.add(PlaneMesh)


const GLTFloader = new GLTFLoader();
const TextLoader = async () => {
    const gltf = await GLTFloader.loadAsync('/car.glb');
    const model = gltf.scene;
    scene.add(model);

    const bbox = new THREE.BoxHelper(gltf.scene, 0xffff00);
    scene.add(bbox)

}
const PotLoader = async () => {
    const gltf = await GLTFloader.loadAsync('/KERNAL.gltf');
    const model = gltf.scene;
    model.position.y = 1.5
    model.castShadow = true

    scene.add(model);

    const bbox = new THREE.BoxHelper(gltf.scene, 0xffff00);
    scene.add(bbox)

}


export function canvas(el: HTMLElement) {
    let animationFrameId: number;

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.shadowMap.enabled = true;



    new OrbitControls(camera, el);

    // TextLoader();
    // PotLoader();
    // GLTFloader.load('/car.glb', function (gltf) {
    //     const model = gltf.scene;
    //     scene.add(model);
    // }, undefined, function (error) {

    //     console.error(error);

    // })










    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

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

