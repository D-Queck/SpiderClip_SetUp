// src/js/code-snippet.js
import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';
import 'highlight.js/styles/atom-one-dark.css';

// 1️⃣ C++-Support registrieren
hljs.registerLanguage('cpp', cpp);

export async function initCodeSnippet() {
  const wrapper = document.querySelector('.code-block');
  if (!wrapper) return;

  const codeEl  = wrapper.querySelector('#per-code');
  const btnCopy = wrapper.querySelector('.code-block__copy');
  const btnToggle = wrapper.querySelector('.code-block__toggle');

  // 2️⃣ externen Sketch laden
  const text = await fetch('/src/code/peripheral.ino').then(r => r.text());
  codeEl.textContent = text;

  // 3️⃣ Highlight anwenden
  hljs.highlightElement(codeEl);

  // 4️⃣ Copy-Button
  btnCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      btnCopy.textContent = 'Copied!';
    } catch {
      btnCopy.textContent = 'Error';
    }
    setTimeout(() => btnCopy.textContent = 'Copy', 1500);
  });

  // 5️⃣ Toggle-Button
  btnToggle.addEventListener('click', () => {
    const isOpen = wrapper.classList.toggle('open');
    // Wir ändern NICHT den Button-Text, sondern rotieren nur das Icon per CSS.
    // Falls Du doch Text haben willst, könntest Du hier umschalten:
    // btnToggle.setAttribute('aria-label', isOpen ? 'Hide Code' : 'Show Code');
  });
}