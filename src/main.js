// src/main.js
import './style.css';

async function loadComponent(id, path, initFn = null) {
  const res  = await fetch(path);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
  if (initFn) await initFn();
}

async function init() {
  // Header + blur
  await loadComponent('header', '/src/components/header.html');
  await import('./js/header-blur.js');

  // Statische Sections
  await loadComponent('hero', '/src/components/hero.html');
  await loadComponent('about', '/src/components/about.html');
  await loadComponent('system', '/src/components/system.html');
  await loadComponent('resources', '/src/components/resources.html');

  // Hardware-Sensor-Platform + ThreeJS
  await loadComponent(
    'hardware',
    '/src/components/hardware.html',
    async () => {
      const mod = await import('./js/hardware-sensor-platform.js');
      mod.initHardwareCanvas();
    }
  );

  // VR-Wearable + ThreeJS
  await loadComponent(
    'vr',
    '/src/components/vr-wearable.html',
    async () => {
      const mod = await import('./js/vr-wearable.js');
      mod.initVrCanvas();
    }
  );

  // Publications + Footer
  await loadComponent('publications', '/src/components/publications.html');
  await loadComponent('footer', '/src/components/footer.html');
}

init();
