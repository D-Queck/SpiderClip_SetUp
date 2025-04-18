import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const container = document.getElementById('threejs-canvas-vr-wearable'); // Stelle sicher, dass deine neue Section ein eindeutiges Container-Element besitzt
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Komplett schwarz

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  1,
  1000
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// OrbitControls aktivieren
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enableRotate = true;
controls.enablePan = true;

// Licht hinzufügen
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

// Modell laden mit OBJLoader
const loader = new OBJLoader();
loader.load(
  '/3D-objects/vr-wearable.obj', // Pfad zu deinem OBJ-Modell
  (object) => {
    // Passe Skalierung und Positionierung je nach Bedarf an:
    object.scale.set(1, 1, 1);
    object.position.set(0, 0, 0);
    scene.add(object);
  },
  undefined,
  (err) => {
    console.error('Error loading OBJ model:', err);
  }
);

// Render-Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize-Handling
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
