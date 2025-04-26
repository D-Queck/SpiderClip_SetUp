// src/js/vr-wearable.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader }    from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initVRCanvas() {
  const container = document.getElementById('threejs-canvas-vr-wearable');
  if (!container) {
    console.error('VR-Container fehlt.');
    return;
  }

  // Szene, Kamera, Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1, 10000
  );
  camera.position.set(0,0,10);

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  // Licht
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dir = new THREE.DirectionalLight(0xffffff,1);
  dir.position.set(0,10,10);
  scene.add(dir);

  // Explosion & Auswahl wie Hardware
  const parts = [];
  let exploded = false;
  function explodeParts() {
    parts.forEach(mesh => {
      const dir = mesh.userData.originalPos.clone().normalize();
      mesh.userData.targetPos = exploded
        ? mesh.userData.originalPos.clone()
        : mesh.userData.originalPos.clone().add(
            dir.multiplyScalar(mesh.geometry.boundingSphere.radius * 1.5)
          );
    });
    exploded = !exploded;
  }
  function showOnlyPart(name) {
    parts.forEach(m => m.visible = (!name || m.userData.displayName === name));
  }

  // UI referenzen
  const btnExpl = document.getElementById('btn-explode-vr');
  const btnAuto = document.getElementById('btn-auto-rotate-vr');
  const selPart = document.getElementById('select-part-vr');
  [btnExpl, btnAuto, selPart].forEach(el => el && (el.disabled = true));

  // GLTF laden
  new GLTFLoader().load(
    '/3D-objects/vr-wearable.glb', // oder .glb
    gltf => {
      const model = gltf.scene || gltf; // je nach Format

      // Mesh registration
      model.traverse(node => {
        if (node.isMesh) {
          node.geometry.computeBoundingSphere();
          node.userData.originalPos = node.position.clone();
          parts.push(node);
        }
      });
      scene.add(model);

      // Dropdown füllen
      selPart.innerHTML = '<option value="">Show All Parts</option>';
      parts.forEach((m,i) => {
        const opt = document.createElement('option');
        opt.value = m.name || `Part ${i+1}`;
        opt.textContent = m.name || `Part ${i+1}`;
        selPart.append(opt);
      });
      selPart.disabled = false;
      selPart.addEventListener('change', e => showOnlyPart(e.target.value));

      // Button-Listeners
      btnExpl.disabled = btnAuto.disabled = false;
      btnExpl.addEventListener('click', explodeParts);
      btnAuto.addEventListener('click', () => controls.autoRotate = !controls.autoRotate);

      // Auto-Framing
      const bbox = new THREE.Box3().setFromObject(model);
      const size = bbox.getSize(new THREE.Vector3());
      const ctr  = bbox.getCenter(new THREE.Vector3());
      model.position.sub(ctr);
      const maxDim = Math.max(size.x,size.y,size.z);
      const fov = camera.fov * Math.PI/180;
      const z   = Math.abs((maxDim/2)/Math.tan(fov/2))*1.2;
      camera.position.set(0,0,z);
      camera.near = maxDim/100; camera.far = maxDim*100;
      camera.updateProjectionMatrix();
      controls.minDistance = maxDim*0.5;
      controls.maxDistance = maxDim*5;
    },
    undefined,
    err => console.error('Fehler beim Laden VR-Modell:', err)
  );

  // Render-Loop
  (function animate() {
    requestAnimationFrame(animate);
    parts.forEach(m => {
      if (m.userData.targetPos) m.position.lerp(m.userData.targetPos, 0.1);
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
