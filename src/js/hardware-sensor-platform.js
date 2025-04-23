// src/js/hardware-sensor-platform.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader }  from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initHardwareCanvas() {
  const container = document.getElementById('threejs-canvas-hardware-sensor-platform');
  if (!container) {
    console.error('Container fehlt.');
    return;
  }

  // Szene, Kamera, Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    10000
  );
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  // *** Ursprüngliches Licht & Material ***
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 10, 10);
  scene.add(dirLight);

  // Arrays für Explosion & Auswahl
  const parts = [];
  let exploded = false;

  function explodeParts() {
    parts.forEach(mesh => {
      const dir = mesh.userData.originalPos.clone().normalize();
      mesh.userData.targetPos = exploded
        ? mesh.userData.originalPos.clone()
        : mesh.userData.originalPos.clone().add(dir.multiplyScalar(mesh.geometry.boundingSphere.radius * 1.5));
    });
    exploded = !exploded;
  }
  function showOnlyPart(name) {
    parts.forEach(mesh => mesh.visible = (!name || mesh.name === name));
  }

  // GLTF laden (Material bleibt erhalten)
  new GLTFLoader().load(
    '/3D-objects/Hardware-Sensor-Platform-ViveTracker_02.glb',
    gltf => {
      const model = gltf.scene;
      // BoundingSphere & Part‐Registration
      model.traverse(child => {
        if (child.isMesh) {
          child.geometry.computeBoundingSphere();
          child.userData.originalPos = child.position.clone();
          parts.push(child);
        }
      });
      scene.add(model);

      // Dropdown füllen
      const sel = document.getElementById('select-part');
      parts.forEach(m => {
        const o = document.createElement('option');
        o.value = m.name;
        o.textContent = m.name || 'unnamed';
        sel.append(o);
      });

      // Auto‐Framing
      const bbox = new THREE.Box3().setFromObject(model);
      const sz   = bbox.getSize(new THREE.Vector3());
      const ctr  = bbox.getCenter(new THREE.Vector3());
      model.position.sub(ctr);
      const maxDim = Math.max(sz.x, sz.y, sz.z);
      const fov    = camera.fov * Math.PI/180;
      const z      = Math.abs(maxDim/2/Math.tan(fov/2)) * 1.2;
      camera.position.set(0, 0, z);
      camera.near = maxDim/100; camera.far = maxDim*100;
      camera.updateProjectionMatrix();
      controls.minDistance = maxDim*0.5;
      controls.maxDistance = maxDim*5;
    },
    undefined,
    err => console.error('Fehler beim Laden des GLB:', err)
  );

  // UI‐Events
  document.getElementById('btn-auto-rotate')
    .addEventListener('click', () => controls.autoRotate = !controls.autoRotate);
  document.getElementById('btn-explode')
    .addEventListener('click', explodeParts);
  document.getElementById('select-part')
    .addEventListener('change', e => showOnlyPart(e.target.value));

  // Render‐Loop (Interpolieren der Explosion)
  function animate() {
    requestAnimationFrame(animate);
    parts.forEach(mesh => {
      if (mesh.userData.targetPos) {
        mesh.position.lerp(mesh.userData.targetPos, 0.1);
      }
    });
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth/container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth,container.clientHeight);
  });
}
