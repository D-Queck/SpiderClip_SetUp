// src/js/hardware-sensor-platform.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initHardwareCanvas() {
  const container = document.getElementById('threejs-canvas-hardware-sensor-platform');
  if (!container) {
    console.error('Container fehlt.');
    return;
  }

  // Szene, Kamera, Renderer
  const scene = new THREE.Scene();
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

  // Licht (oben + Grundausleuchtung)
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(15, 20, 20);
  scene.add(dirLight);



  // Explode/Select
  const parts = [];
  let exploded = false;

  function explodeParts() {
    parts.forEach(obj => {
      obj.userData.targetPos = exploded
        ? obj.userData.originalPos.clone()
        : obj.userData.originalPos.clone().add(
            obj.userData.direction.clone().multiplyScalar(obj.userData.dispenseDistance)
          );
    });
    exploded = !exploded;
  }

  function showOnlyPart(name) {
    parts.forEach(obj => {
      obj.visible = !name || obj.userData.displayName === name;
    });
  }

  // UI-Elemente initial deaktivieren
  const btnExpl = document.getElementById('btn-explode');
  const btnAuto = document.getElementById('btn-auto-rotate');
  const selPart = document.getElementById('select-part');
  [btnExpl, btnAuto, selPart].forEach(el => { if (el) el.disabled = true; });

  // Modell laden
  new GLTFLoader().load(
    '/3D-objects/Hardware-Sensor-Platform-ViveTracker_02.glb',
    gltf => {
      const root = gltf.scene;
      // zentriere Gruppe um Ursprung
      const bbox = new THREE.Box3().setFromObject(root);
      const center = bbox.getCenter(new THREE.Vector3());
      root.position.sub(center);
      scene.add(root);

      // Ein-Level-Unwrapping, falls Wrapper-Node
      let partRoots = root.children;
      if (partRoots.length === 1) {
        partRoots = partRoots[0].children;
      }

      // Direkte Parts: Gruppen oder Meshes mit mindestens einem Mesh-Descendant
      partRoots.forEach((child, idx) => {
        // Prüfe, ob in diesem Node (oder tief darunter) mindestens ein Mesh existiert
        const hasMesh = child.isMesh || !!child.getObjectByProperty('isMesh', true);
        if (hasMesh) {
          // Berechne Explode-Parameter aus BoundingSphere
          const box = new THREE.Box3().setFromObject(child);
          const sphere = box.getBoundingSphere(new THREE.Sphere());

          child.userData.originalPos = child.position.clone();
          child.userData.direction = child.position.clone().normalize();
          child.userData.dispenseDistance = sphere.radius * 2;

          // Anzeigename
          const displayName = child.name || `Part ${idx + 1}`;
          child.userData.displayName = displayName;
          parts.push(child);
        }
      });

      // Dropdown füllen
      if (selPart) {
        selPart.disabled = false;
        selPart.innerHTML = '';
        const allOpt = document.createElement('option');
        allOpt.value = '';
        allOpt.textContent = 'Alle Teile';
        selPart.append(allOpt);
        parts.forEach(obj => {
          const opt = document.createElement('option');
          opt.value = obj.userData.displayName;
          opt.textContent = obj.userData.displayName;
          selPart.append(opt);
        });
        selPart.addEventListener('change', e => showOnlyPart(e.target.value));
      }

      // UI-Listener aktivieren
      if (btnExpl) {
        btnExpl.disabled = false;
        btnExpl.addEventListener('click', explodeParts);
      }
      if (btnAuto) {
        btnAuto.disabled = false;
        btnAuto.addEventListener('click', () => { controls.autoRotate = !controls.autoRotate; });
      }

      // Kamera anpassen
      const size = bbox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = (camera.fov * Math.PI) / 180;
      const camZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.2;
      camera.position.set(0, 0, camZ);
      camera.near = maxDim / 100;
      camera.far = maxDim * 100;
      camera.updateProjectionMatrix();
      controls.minDistance = maxDim * 0.5;
      controls.maxDistance = maxDim * 5;
    },
    undefined,
    err => console.error('Fehler beim Laden des GLB:', err)
  );

  // Render-Loop
  (function animate() {
    requestAnimationFrame(animate);
    parts.forEach(obj => {
      if (obj.userData.targetPos) obj.position.lerp(obj.userData.targetPos, 0.1);
    });
    controls.update();
    renderer.render(scene, camera);
  })();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
