// src/js/parallax.js
export function initParallax() {
    const sections = document.querySelectorAll('.parallax');
    if (!sections.length) return;
  
    // Setze alle erst einmal auf den CSS-Default
    sections.forEach(sec => {
      sec.style.backgroundPosition = 'center center';
    });
  
    function onScroll() {
      const scrollY = window.scrollY;
      sections.forEach(sec => {
        const offsetTop = sec.offsetTop;
        // wie stark der Hintergrund verschoben werden soll (Faktor anpassen)
        const speed = 0.3;
        const yPos = (scrollY - offsetTop) * speed;
        sec.style.backgroundPosition = `center ${yPos}px`;
      });
    }
  
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  