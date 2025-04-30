export async function initCodeSnippet() {
    const codeEl = document.getElementById('per-code');
    const btn    = document.querySelector('.copy-btn');
  
    // load sketch
    const res = await fetch('/src/code/peripheral.ino');
    const text = await res.text();
    codeEl.textContent = text;
    Prism.highlightElement(codeEl);
  
    // Copy-to-clipboard
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1500);
      } catch {
        btn.textContent = 'Error';
      }
    });
  }