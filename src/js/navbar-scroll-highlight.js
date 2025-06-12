// src/js/navbar-scroll-highlight.js

export function initScrollHighlight({
  linkSelector      = '.nav-link',
  sectionSelector   = 'section[id]',       // wieder alle Section-Tags beobachten
  activeClass       = 'active',
  options           = { rootMargin: '-50% 0px -50% 0px' }
} = {}) {
  const links    = Array.from(document.querySelectorAll(linkSelector));
  const sections = Array.from(document.querySelectorAll(sectionSelector));
  const idToLink = new Map(
    links.map(link => {
      const href = link.getAttribute('href') || '';
      return [href.replace(/^#/, ''), link];
    })
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id   = entry.target.id;
      const link = idToLink.get(id);

      if (entry.isIntersecting) {
        // Wenn es einen Link für diese Section gibt: highlighten
        if (link) {
          links.forEach(l => l.classList.remove(activeClass));
          link.classList.add(activeClass);

        // Wenn es KEINEN Link gibt (z.B. hero): alle Highlights entfernen
        } else {
          links.forEach(l => l.classList.remove(activeClass));
        }
      }
    });
  }, options);

  sections.forEach(sec => observer.observe(sec));
}
