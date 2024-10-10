
export default /* glsl */`
varying vec3 vPosition;
varying vec2 vUv;
void main() {
    gl_FragColor = vec4(vUv.xxx, 1.0);
}`