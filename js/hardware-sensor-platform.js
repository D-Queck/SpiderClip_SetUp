
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';


  // Basis-Szene, Kamera und Renderer initialisieren
  const container = document.getElementById('threejs-canvas');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x141414); // Hintergrundfarbe der Szene

  // Kamera: FOV, Aspect Ratio, nahe und ferne Clipping-Ebene
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
  camera.position.set(0, 3, 10);

  // Renderer erstellen und zum Container hinzufügen
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // OrbitControls hinzufügen, damit der Nutzer die Szene drehen kann
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Licht hinzufügen: Ambient und Directional
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 10, 10);
  scene.add(directionalLight);

  // FBXLoader initialisieren, um das 3D-Modell zu laden
  const fbxLoader = new FBXLoader();
  // Ersetze 'images/hardware-sensor-platform.fbx' durch den Pfad zu deinem FBX-Modell
  fbxLoader.load('images/hardware-sensor-platform.fbx', (fbx) => {
    // Modell skalieren und positionieren (anpassen, falls nötig)
    fbx.scale.set(0.01, 0.01, 0.01);
    fbx.position.set(0, 0, 0);
    scene.add(fbx);
  }, undefined, (error) => {
    console.error('Fehler beim Laden des FBX-Modells:', error);
  });

  // Animation / Render-Loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Anpassen der Renderer-Größe bei Fensteränderung
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
