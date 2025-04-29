// src/js/parallax.js
export function initParallaxHero() {
    const sections = document.querySelectorAll('.parallax');
    if (!sections.length) return;
  
    function onScroll() {
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const speed = 0.3; // <--- langsamer oder schneller
        // invertiere rect.top, damit beim Scrollen nach unten der BG nach oben rutscht
        const yPos = -rect.top * speed;
        sec.style.backgroundPosition = `center ${yPos}px`;
      });
    }
  
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // direkt einmal initial setzen
  }
  