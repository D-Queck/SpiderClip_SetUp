// src/js/vr-wearable.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader }     from 'three/examples/jsm/loaders/OBJLoader.js';

export function initVrCanvas() {
  const container = document.getElementById('threejs-canvas-vr-wearable');
  if (!container) {
    console.error('VR-Canvas-Container nicht gefunden!');
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

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

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(0, 10, 10);
  scene.add(dir);

  const loader = new OBJLoader();
  loader.load(
    '/3D-objects/vr-wearable.obj',
    (obj) => {
      obj.scale.set(1,1,1);
      scene.add(obj);
    },
    undefined,
    err => console.error('Error loading OBJ model:', err)
  );

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
