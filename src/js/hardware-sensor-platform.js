// src/js/hardware-sensor-platform.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initHardwareCanvas() {
  const container = document.getElementById('threejs-canvas-hardware-sensor-platform');
  if (!container) return console.error('Container fehlt.');

  // 0) Overlay für Namen + Next-Button
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:absolute; top:16px; left:50%; transform:translateX(-50%);
    display:flex; align-items:center; gap:8px; z-index:10;
    background:rgba(0,0,0,0.5); padding:4px 8px; border-radius:4px;
    color:#fff; font-family:sans-serif;
  `;
  const nameEl = document.createElement('span');
  nameEl.textContent = '…';
  const btnNext = document.createElement('button');
  btnNext.textContent = 'Next ▶';
  btnNext.style.cssText = `
    background:transparent; border:1px solid #fff; color:#fff;
    padding:2px 6px; cursor:pointer; border-radius:3px;
  `;
  overlay.append(nameEl, btnNext);
  container.style.position = 'relative';
  container.appendChild(overlay);

  // Szene, Kamera, Renderer
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 10000);
  camera.position.set(0,0,10);
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  // Licht-Grundsetup
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(15,20,20);
  scene.add(dirLight);

  // UI-Elemente: Explode, Auto-Rotate, Part-Select
  const btnExpl  = document.getElementById('btn-explode');
  const btnAuto  = document.getElementById('btn-auto-rotate');
  const selPart  = document.getElementById('select-part');
  [btnExpl, btnAuto, selPart].forEach(el => el && (el.disabled = true));
  btnExpl.addEventListener('click', explodeParts);
  btnAuto.addEventListener('click', () => controls.autoRotate = !controls.autoRotate);
  selPart.addEventListener('change', e => showOnlyPart(e.target.value));

  // Modelle zur Auswahl
  const models = [
    { url:'/3D-objects/Hardware-Sensor-Platform-ViveTracker_02.glb', name:'Sensor Platform V2' },
    { url:'/3D-objects/Prototype_1.glb',                               name:'Sensor Platform V3' },
  ];
  let current = 0;
  let root     = null;
  const loader = new GLTFLoader();

  // explode/select Daten
  const parts    = [];
  let exploded   = false;

  // Funktion: Modell laden, skalieren, zentrieren, Parts extrahieren, Kamera fram’en
  function loadModel(idx) {
    // altes Modell entfernen
    if (root) {
      scene.remove(root);
      root.traverse(c => c.geometry?.dispose());
      parts.length = 0;
      exploded = false;
    }

    const { url, name } = models[idx];
    nameEl.textContent = name;
    btnExpl.disabled = btnAuto.disabled = selPart.disabled = true;

    loader.load(url, gltf => {
      // benutze jetzt die äußere Variable!
      root = gltf.scene;
    
      // 1) zentriere und füge hinzu
      const bbox   = new THREE.Box3().setFromObject(root);
      const center = bbox.getCenter(new THREE.Vector3());
      root.position.sub(center);
      scene.add(root);
    
      // 2) Ein-Level-Unwrapping
      let partRoots = root.children;
      if (partRoots.length === 1) {
        partRoots = partRoots[0].children;
      }
    
      // 3) Nur direkte Parts extrahieren
      parts.length = 0;
      partRoots.forEach((child, idx) => {
        const hasMesh = child.isMesh || !!child.getObjectByProperty('isMesh', true);
        if (!hasMesh) return;
    
        const box    = new THREE.Box3().setFromObject(child);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        child.userData.originalPos      = child.position.clone();
        child.userData.direction        = child.position.clone().normalize();
        child.userData.dispenseDistance = sphere.radius * 2;
    
        const displayName = child.name || `Part ${idx + 1}`;
        child.userData.displayName = displayName;
        parts.push(child);
      });
    
      // 4) Dropdown neu befüllen
      selPart.innerHTML = '<option value="">Alle Teile</option>';
      parts.forEach(m => {
        const o = document.createElement('option');
        o.value       = m.userData.displayName;
        o.textContent = m.userData.displayName;
        selPart.append(o);
      });
    
      // 5) UI freischalten
      btnExpl.disabled = btnAuto.disabled = false;
      selPart.disabled = false;
    
      // 6) Kamera fram’en
      const box2   = new THREE.Box3().setFromObject(root);
      const size   = box2.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov    = camera.fov * Math.PI / 180;
      const camZ   = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.2;
      camera.position.set(0, 0, camZ);
      camera.near = maxDim / 100;
      camera.far  = maxDim * 100;
      camera.updateProjectionMatrix();
      controls.minDistance = maxDim * 0.5;
      controls.maxDistance = maxDim * 5;
    });
    
  }

  // Explode-Funktion
  function explodeParts() {
    parts.forEach(m => {
      const target = exploded
        ? m.userData.originalPos.clone()
        : m.userData.originalPos.clone().add(
            m.userData.direction.clone().multiplyScalar(m.userData.dispenseDistance)
          );
      m.userData.targetPos = target;
    });
    exploded = !exploded;
  }

  // Show-only-Part-Funktion
  function showOnlyPart(name) {
    parts.forEach(m => m.visible = !name || m.userData.displayName === name);
  }

  // Next-Button
  btnNext.addEventListener('click', () => {
    current = (current + 1) % models.length;
    loadModel(current);
  });

  // Lade initial
  loadModel(current);

  // Render-Loop
  (function animate() {
    requestAnimationFrame(animate);
    parts.forEach(m => {
      if (m.userData.targetPos) m.position.lerp(m.userData.targetPos, 0.1);
    });
    controls.update();
    renderer.render(scene, camera);
  })();

  // Resize-Handler
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth/container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
