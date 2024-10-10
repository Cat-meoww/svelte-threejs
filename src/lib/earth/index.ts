import * as THREE from 'three';
import earthMapImage from '$lib/earth/textures/8081_earthmap4k.jpg'
import earthLightsImage from '$lib/earth/textures/8081_earthlights4k.jpg'
import earthCloudTrasImage from '$lib/earth/textures/earthcloudmaptrans.jpg'
import earthCloudImage from '$lib/earth/textures/earthCloud.png'
import earthBumpImage from '$lib/earth/textures/8081_earthbump4k.jpg'
import earthspecImage from '$lib/earth/textures/8081_earthspec4k.jpg'
import { getFresnelMat } from './src/getFresnelMat';

import { OrbitControls } from '@three-ts/orbit-controls';

let renderer: THREE.WebGLRenderer;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 10);
camera.position.z = 5;

const earthGroup = new THREE.Group();
scene.add(earthGroup);

const geometry = new THREE.IcosahedronGeometry(2.5, 18);
// const geometry = new THREE.SphereGeometry(0.5, 32, 32);




const sunLight = new THREE.DirectionalLight(0xffffff, 3);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);





export function canvas(el: HTMLElement) {
    let animationFrameId: number;

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshPhongMaterial({
        map: loader.load(earthMapImage),
        specularMap: loader.load(earthspecImage), // the reflective areas of the surface
        bumpMap: loader.load(earthBumpImage),
        bumpScale: 1,
    });

    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    new OrbitControls(camera, el);


    const lightsMat = new THREE.MeshBasicMaterial({
        map: loader.load(earthLightsImage),
        blending: THREE.AdditiveBlending,
    });

    const lightsMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(lightsMesh);


    const cloudsMat = new THREE.MeshPhongMaterial({
        map: loader.load(earthCloudImage),
        transparent: true,
         opacity: 0.8,
        blending: THREE.AdditiveBlending,
        alphaMap: loader.load(earthCloudTrasImage),
        // alphaTest: 0.3,
        // alphaTest: 0.3,
    });
    const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
    cloudsMesh.scale.setScalar(1.003);
    earthGroup.add(cloudsMesh);


    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.005);
     earthGroup.add(glowMesh);







    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        earthMesh.rotation.y += 0.002
        lightsMesh.rotation.y += 0.002
        cloudsMesh.rotation.y += 0.0023;
        renderer.render(scene, camera);
    };

    const resize = () => {
        console.log(window.innerWidth, window.innerHeight)
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return {
        destroy() {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            el.removeChild(renderer.domElement);
            renderer.dispose();
        }
    };
}

