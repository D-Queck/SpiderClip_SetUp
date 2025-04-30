import './css/main.scss';
import { initParallaxHero } from './js/parallax-hero.js';
import { initParallaxSections } from './js/parallax-sections.js';
import { initCodeSnippet } from './js/code-snippet.js';

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

  // statische Sektionen
  await loadComponent('hero',    '/src/components/hero.html');
  await loadComponent('about',   '/src/components/about.html');
  await loadComponent('system',  '/src/components/system.html');
  await loadComponent('resources','/src/components/resources.html');

  // Hardware
  await loadComponent('hardware','/src/components/hardware.html',
    async () => {
      const { initHardwareCanvas } = await import('./js/hardware-sensor-platform.js');
      initHardwareCanvas();
    }
  );

  // VR-Wearable
  await loadComponent('vr', '/src/components/vr-wearable.html',
    async () => {
      const { initVRCanvas } = await import('./js/vr-wearable.js');
      initVRCanvas();
    }
  );

  // Publications + Footer
  await loadComponent('publications','/src/components/publications.html');
  await loadComponent('footer',      '/src/components/footer.html');

  // Parallax-effect
  initParallaxHero();
  initParallaxSections();
  initCodeSnippet();

}

init();
