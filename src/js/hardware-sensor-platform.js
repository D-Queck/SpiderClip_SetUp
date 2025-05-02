// src/js/hardware-sensor-platform.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initHardwareCanvas() {
  const container = document.getElementById('threejs-canvas-hardware-sensor-platform');
  if (!container) return console.error('Container fehlt.');

  // ─────────────────────────────────────────────────────────────
  // Three.js Setup (Canvas ganz vorne anhängen, z-index 0)
  // ─────────────────────────────────────────────────────────────
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    10000
  );
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Canvas als erstes anfügen und ganz nach hinten legen
  renderer.domElement.style.position = 'relative';
  renderer.domElement.style.zIndex = '0';
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(15, 20, 20);
  scene.add(dirLight);

  // ─────────────────────────────────────────────────────────────
  // 0) Überlagerungen anlegen
  // ─────────────────────────────────────────────────────────────
  container.style.position = 'relative';

  // 0a) Top-Mitte: Name + Next
  const overlayCenter = document.createElement('div');
  overlayCenter.style.cssText = `
    position: absolute;
    top: 16px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 8px;
    z-index: 10;
    background: rgba(0,0,0,0.5);
    padding: 4px 8px;
    border-radius: 4px;
    color: #fff;
    font-family: sans-serif;
  `;
  const nameEl = document.createElement('span');
  nameEl.textContent = '…'; // wird in loadModel gesetzt
  const btnNext = document.createElement('button');
  btnNext.textContent = 'Next ▶';
  btnNext.style.cssText = `
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
    padding: 2px 6px;
    cursor: pointer;
    border-radius: 3px;
  `;
  overlayCenter.append(nameEl, btnNext);
  container.appendChild(overlayCenter);

  // 0b) Top-Rechts: Auto-Rotate + Parts-Select
  const overlayRight = document.createElement('div');
  overlayRight.style.cssText = `
    position: absolute;
    top: 16px; right: 16px;
    display: flex; align-items: center; gap: 8px;
    flex-wrap: nowrap; white-space: nowrap;
    z-index: 10;
    background: rgba(0,0,0,0.5);
    padding: 4px 8px;
    border-radius: 4px;
  `;
  const btnAuto = document.createElement('button');
  btnAuto.textContent = '⟳';
  btnAuto.style.cssText = `
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
    padding: 2px 6px;
    cursor: pointer;
    border-radius: 3px;
  `;
  btnAuto.disabled = true;
  const selPart = document.createElement('select');
  selPart.classList.add('scene-ui-select','form-select','form-select-sm');
  selPart.disabled = true;
  selPart.style.cssText = `
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
    padding: 2px 6px;
    cursor: pointer;
    border-radius: 3px;
  `;
  selPart.appendChild(new Option('Show All', ''));
  overlayRight.append(btnAuto, selPart);
  container.appendChild(overlayRight);

  // ─────────────────────────────────────────────────────────────
  // Model Loading & UI-Logik
  // ─────────────────────────────────────────────────────────────
  const models = [
    { url: '/3D-objects/Hardware-Sensor-Platform-ViveTracker_02.glb', name: 'Sensor Platform V2' },
    { url: '/3D-objects/Prototype_1.glb', name: 'Sensor Platform V3' },
  ];
  let current = 0, root = null;
  const loader = new GLTFLoader();
  const parts = [];

  function loadModel(idx) {
    if (root) {
      scene.remove(root);
      root.traverse(c => c.geometry?.dispose());
      parts.length = 0;
    }
    const { url, name } = models[idx];
    nameEl.textContent = name;
    btnAuto.disabled = selPart.disabled = true;

    loader.load(url, gltf => {
      root = gltf.scene;
      const box = new THREE.Box3().setFromObject(root);
      const center = box.getCenter(new THREE.Vector3());
      root.position.sub(center);
      scene.add(root);

      // Parts extrahieren
      let children = root.children.length === 1 ? root.children[0].children : root.children;
      children.forEach((c, i) => {
        if (c.isMesh || c.getObjectByProperty('isMesh', true)) {
          c.userData.displayName = c.name || `Part ${i+1}`;
          parts.push(c);
        }
      });

      // Dropdown befüllen
      selPart.innerHTML = '';
      selPart.append(new Option('Show All', ''));
      parts.forEach(p => selPart.append(new Option(p.userData.displayName, p.userData.displayName)));

      btnAuto.disabled = selPart.disabled = false;

      // Kamera framing
      const fbox = new THREE.Box3().setFromObject(root);
      const size = fbox.getSize(new THREE.Vector3());
      const maxD = Math.max(size.x, size.y, size.z);
      const fov  = camera.fov * Math.PI / 180;
      const z    = Math.abs(maxD / 2 / Math.tan(fov/2)) * 1.2;
      camera.position.set(0, 0, z);
      camera.near = maxD / 100;
      camera.far  = maxD * 100;
      camera.updateProjectionMatrix();
      controls.minDistance = maxD * 0.5;
      controls.maxDistance = maxD * 5;
    });
  }

  // Event-Handler
  btnAuto.addEventListener('click', () => controls.autoRotate = !controls.autoRotate);
  selPart.addEventListener('change', e => {
    const nm = e.target.value;
    parts.forEach(p => p.visible = !nm || p.userData.displayName === nm);
  });
  btnNext.addEventListener('click', () => {
    current = (current + 1) % models.length;
    loadModel(current);
  });

  loadModel(current);

  // Animation
  (function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  })();

  // Resize-Handler
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
