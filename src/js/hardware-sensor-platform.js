import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initHardwareCanvas() {
  const container = document.getElementById('threejs-canvas-hardware-sensor-platform');
  if (!container) return console.error('Container fehlt.');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,      // nahe Clipping-Ebene
    10000     // ferne Clipping-Ebene
  );
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(0, 10, 10);
  scene.add(dir);

  // GLTF laden
  new GLTFLoader().load(
    '/3D-objects/Hardware-Sensor-Platform-ViveTracker_02.glb',
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      // 1) BoundingBox berechnen
      const bbox = new THREE.Box3().setFromObject(model);
      const size = bbox.getSize(new THREE.Vector3());
      const center = bbox.getCenter(new THREE.Vector3());

      // 2) Modell zentrieren
      model.position.sub(center);

      // 3) Autom. Kamera-Abstand so setzen, dass das größte Modellmaß gut ins Bild passt
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.2; // *1.2 als Puffer

      camera.position.set(0, 0, cameraZ);
      camera.near = maxDim / 100;
      camera.far = maxDim * 100;
      camera.updateProjectionMatrix();

      // 4) OrbitControls Zoom-Begrenzung
      controls.minDistance = maxDim * 0.5;
      controls.maxDistance = maxDim * 5;
    },
    undefined,
    (err) => console.error('Fehler beim Laden des GLB-Modells:', err)
  );

  // Render-Loop
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  // bei Resize anpassen
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
