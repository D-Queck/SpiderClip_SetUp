import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/SpiderClip_SetUp/',   // wichtig für GitHub Pages
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/components', dest: 'src' },   // Kopiere src/components in dist/src
        { src: 'src/code', dest: 'src' }          // Kopiere src/code in dist/src
      ]
    })
  ]
});
