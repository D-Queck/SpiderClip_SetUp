export function initParallaxSections() {
    const sections = Array.from(document.querySelectorAll('.parallax-section'));
    if (!sections.length) return;
  
    let ticking = false;
    function update() {
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        // nur, wenn in Viewport (±screenHeight)
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          // langsamer Versatz, z.B. 20%
          const offset = rect.top * 0.2;
          sec.style.backgroundPosition = `center ${offset}px`;
        }
      });
      ticking = false;
    }
  
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
  
    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // einmal initial
  }
  