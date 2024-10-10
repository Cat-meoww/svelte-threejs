import * as THREE from 'three';


import { OrbitControls } from '@three-ts/orbit-controls';
import vertexShader from './shades/vertex.glsl.js'
import fragmentShader from './shades/fragment.glsl.js'

let renderer: THREE.WebGLRenderer;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 10);
camera.position.z = 5;

const earthGroup = new THREE.Group();
scene.add(earthGroup);

// const geometry = new THREE.IcosahedronGeometry(2.5, 18);
const geometry = new THREE.PlaneGeometry(5, 5);
// const geometry = new THREE.SphereGeometry(0.5, 32, 32);




const sunLight = new THREE.DirectionalLight(0xffffff, 3);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);





export function canvas(el: HTMLElement) {
    let animationFrameId: number;

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;


    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: {
                value: 0
            }
        },
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide
    });

    const blobMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(blobMesh);

    new OrbitControls(camera, el);

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        blobMesh.rotation.y += 0.002
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

