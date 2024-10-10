import * as THREE from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';

// Constants
const CANVAS_BACKGROUND_COLOR = 0xd1dff6;
const AMBIENT_LIGHT_COLOR = 0xffffff;
const AMBIENT_LIGHT_INTENSITY = 2;
const HEMISPHERE_LIGHT_COLOR = 0xffffff;
const HEMISPHERE_LIGHT_INTENSITY = 4;
const FIELD_TEXTURE_PATH = '/field/map-field-diffuse-combined.png';
const PLANE_SIZE = 10;
const GLASS_COLOR = new THREE.Color(0.7, 0.85, 1.0); // Light blue tint for glass
const SHADER_TRANSPARENCY = 0.5;

// Create scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(CANVAS_BACKGROUND_COLOR);

const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
camera.position.set(0, 15, 15);

// Set up renderer
let renderer: THREE.WebGLRenderer;

export function canvas(el: HTMLElement) {
    let animationFrameId: number;

    // Initialize renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.shadowMap.enabled = true;

    // Initialize controls
    new OrbitControls(camera, el);

    // Add lights
    addLights();

    // Load texture and create glass field
    const glassField = createGlassField();
    scene.add(glassField);

    // Start animation loop
    animate();

    // Resize handling
    window.addEventListener('resize', onResize);

    return {
        destroy() {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
        }
    };

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
}

function addLights() {
    const ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(HEMISPHERE_LIGHT_COLOR, HEMISPHERE_LIGHT_INTENSITY);
    hemisphereLight.position.set(-50, 50, 50);
    scene.add(hemisphereLight);
}

function createGlassField(): THREE.Mesh {
    const textureLoader = new THREE.TextureLoader();
    const fieldDiffuseTexture = textureLoader.load(
        FIELD_TEXTURE_PATH,
        () => { console.log('Texture loaded successfully!'); },
        undefined,
        (err) => { console.error('Error loading texture:', err); }
    );


    const planeGeometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            diffuseTexture: { value: fieldDiffuseTexture },
            cameraPosition: { value: camera.position }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
    });
    // Log shader compilation status
    material.onBeforeCompile = (shader) => {
        console.log("Vertex Shader:", shader.vertexShader);
        console.log("Fragment Shader:", shader.fragmentShader);
    };

    const glassField = new THREE.Mesh(planeGeometry, material);
    glassField.rotation.x = -0.5 * Math.PI;
    return glassField;
}

// Vertex Shader
const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv = uv; // Pass UV coordinates to fragment shader
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;



// Fragment Shader
const fragmentShader = `
  uniform sampler2D diffuseTexture;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    // Sample the diffuse texture using the UV coordinates
    vec4 diffuseColor = texture2D(diffuseTexture, vUv);
    
    // Simple color output for debugging
    gl_FragColor = diffuseColor; // Output the texture color directly
  }
`;

