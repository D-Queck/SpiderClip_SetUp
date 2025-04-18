import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const container = document.getElementById('threejs-canvas-hardware-sensor-platform');
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
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
container.appendChild(renderer.domElement);

// OrbitControls aktivieren
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enableRotate = true;
controls.enablePan = true;

// Licht hinzufügen
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// Optional: Environment Map laden
/*const rgbeLoader = new RGBELoader();
rgbeLoader.setDataType(THREE.UnsignedByteType);
rgbeLoader.load('/images/hdr/environment.hdr', (texture) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.environment = envMap;
  scene.background = envMap; // falls gewünscht
  texture.dispose();
  pmremGenerator.dispose();
});*/

// Modell laden
const loader = new FBXLoader();
loader.load('/3D-objects/hardware-sensor-platform.fbx', (object) => {
  object.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: child.material.color || new THREE.Color(0xffffff),
        roughness: 0.5,
        metalness: 0.2,
      });
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  object.scale.set(1, 1, 1); // ggf. anpassen
  scene.add(object);
}, undefined, (err) => {
  console.error('Fehler beim Laden:', err);
});


// Render-Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Bei Fenstergröße ändern
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
