
export function initParallaxHero() {

  const parallaxSections = document.querySelectorAll('.parallax');

  function onScrollBackground() {
    parallaxSections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const speed = 0.3;
      const yPos = -rect.top * speed;
      sec.style.backgroundPosition = `center ${yPos}px`;
    });
  }

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

  if (!parallaxSections.length && !heroVideo) return;

  window.addEventListener(
    'scroll',
    () => {
      onScrollBackground();
      onScrollVideo();
    },
    { passive: true }
  );

  onScrollBackground();
  onScrollVideo();
}
