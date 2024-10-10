import * as THREE from 'three';
let renderer: THREE.WebGLRenderer;




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 100 / 2, 0.1, 10);
camera.position.z = 5;


const geometry = new THREE.CapsuleGeometry();
const material = new THREE.MeshStandardMaterial({
    color: 0x0066ff,
    flatShading: true,
    transparent: true,
    opacity: 1.0
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
})
const wireMesh = new THREE.Mesh(geometry, wireMat);
wireMesh.scale.setScalar(1.001);

// scene.add(cube);
cube.add(wireMesh)



const hemiLight = new THREE.HemisphereLight(0xffffff, 0xff0000);
scene.add(hemiLight);



const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
};

const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};
export function canvas(el: HTMLElement) {
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });

    resize();
    animate();
    window.addEventListener('resize', resize);
}

