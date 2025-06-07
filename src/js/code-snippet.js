// src/js/code-snippet.js
import hljs from 'highlight.js/lib/core';
import cpp  from 'highlight.js/lib/languages/cpp';
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('cpp', cpp);

export async function initCodeSnippets() {
  // find every code-block on the page
  document.querySelectorAll('.code-block').forEach(async wrapper => {
    const codeEl    = wrapper.querySelector('code[data-snippet]');
    const name      = codeEl.getAttribute('data-snippet');  // "peripheral" or "central"
    const btnCopy   = wrapper.querySelector('.code-block__copy');
    const btnToggle = wrapper.querySelector('.code-block__toggle');
    if (!codeEl || !btnCopy || !btnToggle) return;

    // 1) fetch the right file
    const txt = await fetch(`/src/code/${name}.ino`).then(r => r.text());
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
