import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from '@three-ts/orbit-controls';

const clock = new THREE.Clock();
let mixer: THREE.AnimationMixer
let renderer: THREE.WebGLRenderer;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd1dff6);
const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
camera.position.z = 15;
camera.position.y = 15;







const Grid = new THREE.GridHelper(50, 20)

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
const LoadCornModal = async () => {
    const gltf = await GLTFloader.loadAsync('/KERNAL.gltf');
    const model = gltf.scene;
    model.position.y = 1.3
    // model.position.x = -8
    // model.position.z = 8
    model.castShadow = true
    scene.add(model);
    console.log(model)
    const kernel: any = model.getObjectByName("kernel");

    if (kernel) {
        kernel.castShadow = true
        console.log(kernel.material.color.setHex(0xFBEC5D))

    }

    const bbox = new THREE.BoxHelper(gltf.scene, 0xffff00);
    scene.add(bbox)

}
const LoadCarModal = async () => {
    const gltf = await GLTFloader.loadAsync('/car2.glb');
    const model = gltf.scene;
    model.position.y = 0
    model.scale.set(0.5, 0.5, 0.5)
    model.position.x = -2
    model.position.z = 8
    model.castShadow = true
    scene.add(model);
    gltf.scene.traverse(function (child: any) {
        if (child.isMesh) {
            child.castShadow=true
            // child.material.metalness = 0.5;
            // child.material.roughness = 0.2;
        }
    });

    const kernel: any = model.getObjectByName("2011_Ferrari_599XX_Evoobjcleanermaterialmergergles");

    if (kernel) {
        kernel.castShadow = true
        // console.log(kernel.material.color.setHex(0xFBEC5D))
    }
    console.log({ gltf, model })
    // const kernel :any = model.getObjectByName("kernel");
    if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
    }


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

    //LoadCornModal();
    LoadCarModal()


    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (mixer) mixer.update(clock.getDelta());
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

