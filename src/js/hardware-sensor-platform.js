// src/js/hardware-sensor-platform.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader }   from 'three/examples/jsm/loaders/FBXLoader.js';

export function initHardwareCanvas() {
  const container = document.getElementById('threejs-canvas-hardware-sensor-platform');
  if (!container) {
    console.error('Hardware-Canvas-Container nicht gefunden!');
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

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(0, 10, 10);
  scene.add(dir);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  hemi.position.set(0, 20, 0);
  scene.add(hemi);

  const loader = new FBXLoader();
  loader.load(
    '/3D-objects/hardware-sensor-platform.fbx',
    (obj) => {
      obj.traverse(child => {
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
      obj.scale.set(1,1,1);
      scene.add(obj);
    },
    undefined,
    err => console.error('Fehler beim Laden:', err)
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
