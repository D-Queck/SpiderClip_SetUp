
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const base = import.meta.env.BASE_URL;

export function initVRCanvas() {
  const container = document.getElementById('threejs-canvas-vr-wearable');
  if (!container) {
    console.error('VR-Container fehlt.');
    return;
  }

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
  renderer.domElement.style.position = 'relative';
  renderer.domElement.style.zIndex = '0';
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  scene.add(new THREE.AmbientLight(0xffffff, 1.5));

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
  hemiLight.position.set(0, 10, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(15, 20, 20);
  scene.add(dirLight);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight2.position.set(-15, -20, -20);
  scene.add(dirLight2);


  container.style.position = 'relative';
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
    font-size: 0.9rem;
  `;
  const nameEl = document.createElement('span');
  nameEl.textContent = '';
  overlayCenter.appendChild(nameEl);
  container.appendChild(overlayCenter);

  const overlayRight = document.createElement('div');
  overlayRight.style.cssText = `
    position: absolute;
    top: 16px; right: 16px;
    display: flex; align-items: center;
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
    font-size: 0.9rem;
  `;
  overlayRight.appendChild(btnAuto);
  container.appendChild(overlayRight);

  const parts = [];
  const loader = new GLTFLoader();

  loader.load(
    `${base}3D-objects/vr-wearable.glb`,
    gltf => {
      const model = gltf.scene || gltf;
      nameEl.textContent = 'VR Wearable';

      model.traverse(node => {
        if (node.isMesh) {
          node.geometry.computeBoundingSphere();
          parts.push(node);
        }
      });
      scene.add(model);

      const texLoader = new THREE.TextureLoader();
      texLoader.load(
        `${base}images/Watch.png`,
        hudTex => {
          hudTex.encoding = THREE.sRGBEncoding;
          hudTex.generateMipmaps = true;
          hudTex.minFilter = THREE.LinearMipMapLinearFilter;
          hudTex.magFilter = THREE.LinearFilter;
          hudTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

          const mat = new THREE.MeshBasicMaterial({
            map: hudTex,
            transparent: true,
            opacity: 0.7,
            emissive: new THREE.Color(0xffffff),
            emissiveMap: hudTex,
            depthTest: true
          });

          const W = 0.5;
          const ratio = hudTex.image.height / hudTex.image.width;
          const H = W * ratio;
          const geo = new THREE.PlaneGeometry(W, H);

          const dbg = new THREE.Mesh(geo, mat);
          dbg.scale.set(0.09, 0.09, 1);
          dbg.name = 'DEBUG_HUD';
          dbg.position.set(0, 0.013, 0.03);
          dbg.frustumCulled = false;
          scene.add(dbg);

          renderer.toneMappingExposure = 1.3;
        },
        undefined,
        err => console.error('🚨 HUD-Texture konnte nicht geladen werden:', err)
      );

      btnAuto.addEventListener('click', () => {
        controls.autoRotate = !controls.autoRotate;
        btnAuto.style.opacity = controls.autoRotate ? '0.7' : '1';
      });

      const bbox = new THREE.Box3().setFromObject(model);
      const size = bbox.getSize(new THREE.Vector3());
      const center = bbox.getCenter(new THREE.Vector3());
      model.position.sub(center);

      const maxD = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * Math.PI / 180;
      const z = Math.abs((maxD / 2) / Math.tan(fov / 2)) * 1.2;
      camera.position.set(0, 0, z);
      camera.near = maxD / 100;
      camera.far = maxD * 100;
      camera.updateProjectionMatrix();

      controls.minDistance = maxD * 0.5;
      controls.maxDistance = maxD * 5;
    },
    undefined,
    err => console.error('Fehler beim Laden VR-Modell:', err)
  );

  (function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
