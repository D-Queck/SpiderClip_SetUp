// src/js/parallax-hero.js

export function initParallaxHero() {
  // 1) Parallax für Elemente mit .parallax (inkl. Hero nach Hinzufügen der Klasse)
  const parallaxSections = document.querySelectorAll('.parallax');

  function onScrollBackground() {
    parallaxSections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const speed = 0.3;
      const yPos = -rect.top * speed;
      sec.style.backgroundPosition = `center ${yPos}px`;
    });
  }

  // 2) Video-/Overlay-Parallax
  const heroVideo = document.querySelector('.hero__video');
  const heroOverlay = document.querySelector('.hero__overlay');

  function onScrollVideo() {
    if (!heroVideo) return;

    const scrollY = window.scrollY;
    const parallaxFactor = 0.7;

    heroVideo.style.transform = `translate(-50%, calc(-50% + ${scrollY * parallaxFactor}px))`;
    if (heroOverlay) {
      heroOverlay.style.transform = `translateY(${scrollY * parallaxFactor}px)`;
    }
  }

  // Falls weder Elemente mit .parallax noch das Hero-Video existieren, nichts tun
  if (!parallaxSections.length && !heroVideo) return;

  window.addEventListener(
    'scroll',
    () => {
      onScrollBackground();
      onScrollVideo();
    },
    { passive: true }
  );

  // Beim Laden einmalig aufrufen, damit Positionen initial gesetzt werden
  onScrollBackground();
  onScrollVideo();
}
