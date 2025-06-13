
import hljs from 'highlight.js/lib/core';
import cpp  from 'highlight.js/lib/languages/cpp';
import 'highlight.js/styles/atom-one-dark.css';

const base = import.meta.env.BASE_URL;

hljs.registerLanguage('cpp', cpp);

export async function initCodeSnippets() {
  document.querySelectorAll('.code-block').forEach(async wrapper => {
    const codeEl    = wrapper.querySelector('code[data-snippet]');
    const name      = codeEl.getAttribute('data-snippet');  
    const btnCopy   = wrapper.querySelector('.code-block__copy');
    const btnToggle = wrapper.querySelector('.code-block__toggle');
    if (!codeEl || !btnCopy || !btnToggle) return;

    // 1) fetch the right file via BASE_URL
    const path = `${base}src/code/${name}.ino`;
    const txt  = await fetch(path).then(r => {
      if (!r.ok) throw new Error(`Failed to load snippet: ${path}`);
      return r.text();
    });
    codeEl.textContent = txt;

    // 2) highlight
    hljs.highlightElement(codeEl);

    wrapper.classList.add('open');
    btnToggle.setAttribute('aria-expanded', 'true');

    // 3) copy
    btnCopy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(txt);
        btnCopy.textContent = 'Copied!';
      } catch {
        btnCopy.textContent = 'Error';
      }
      setTimeout(() => (btnCopy.textContent = 'Copy'), 1500);
    });

    // 4) toggle
    btnToggle.addEventListener('click', () => {
      wrapper.classList.toggle('open');
    });
  });
}
