// src/js/scroll-highlight.js

/**
 * Initialisiert das manuelle Highlighting der Navbar-Links
 * basierend auf den gerade sichtbaren Sections.
 *
 * @param {object} opts
 * @param {string} opts.linkSelector    CSS-Selektor für alle .nav-link
 * @param {string} opts.sectionSelector CSS-Selektor für alle Sektionen (mit IDs)
 * @param {string} opts.activeClass     Name der Klasse, die zum Highlighten genutzt wird
 * @param {object} [opts.options]       IntersectionObserver-Optionen
 */
export function initScrollHighlight({
  linkSelector      = '.nav-link',
  sectionSelector   = 'div[id]',
  activeClass       = 'active',
  options           = { rootMargin: '-50% 0px -50% 0px' }
}) {
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
      const id = entry.target.id;
      const link = idToLink.get(id);
      if (!link) return;
      if (entry.isIntersecting) {
        // alle anderen de-aktivieren
        links.forEach(l => l.classList.remove(activeClass));
        // diesen hier aktivieren
        link.classList.add(activeClass);
      }
    });
  }, options);

  sections.forEach(sec => observer.observe(sec));
}
