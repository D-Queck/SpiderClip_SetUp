
export function initScrollHighlight({
  linkSelector      = '.nav-link',
  sectionSelector   = 'section[id]',  
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

        if (link) {
          links.forEach(l => l.classList.remove(activeClass));
          link.classList.add(activeClass);

        } else {
          links.forEach(l => l.classList.remove(activeClass));
        }
      }
    });
  }, options);

  sections.forEach(sec => observer.observe(sec));
}
