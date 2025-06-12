// src/main.js

import './css/main.scss';
import { initParallaxHero } from './js/parallax-hero.js';
import { initParallaxSections } from './js/parallax-sections.js';
import { initCodeSnippets } from './js/code-snippet.js';
import { initScrollHighlight }  from './js/navbar-scroll-highlight.js';

const base = import.meta.env.BASE_URL;  // Basispräfix für alle Ressourcen

async function loadComponent(id, path, initFn = null) {
  const res  = await fetch(path);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
  if (initFn) await initFn();
}

async function init() {
  await loadComponent('header', `${base}src/components/header.html`);
  await import('./js/header-blur.js');

  initScrollHighlight({
    linkSelector:    '#navbar-links .nav-link',
    sectionSelector: 'div[id]',
    activeClass:     'active'
  });

  await loadComponent('hero',        `${base}src/components/hero.html`);
  await loadComponent('about',       `${base}src/components/about.html`);
  await loadComponent('system',      `${base}src/components/system.html`);
  await loadComponent('resources',   `${base}src/components/resources.html`);

  await loadComponent('hardware',    `${base}src/components/hardware.html`,
    async () => {
      const { initHardwareCanvas } = await import('./js/hardware-sensor-platform.js');
      initHardwareCanvas();
    }
  );

  await loadComponent('communication', `${base}src/components/communication.html`);

  await loadComponent('vr', `${base}src/components/vr-wearable.html`,
    async () => {
      const { initVRCanvas } = await import('./js/vr-wearable.js');
      initVRCanvas();
    }
  );

  await loadComponent('publications', `${base}src/components/publications.html`);
  await loadComponent('footer',       `${base}src/components/footer.html`);

  // Parallax-Effekte initialisieren
  initParallaxHero();
  initParallaxSections();
  await initCodeSnippets();
}

init();
