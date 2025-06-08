import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/SpiderClip_SetUp/',     // oder './' – je nachdem, welche Variante du wählst
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/components', dest: '' }   // ⇽ kopiert nach dist/components
      ]
    })
  ]
});
