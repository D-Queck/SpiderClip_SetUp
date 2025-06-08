import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/SpiderClip_SetUp/',           // bleibt so
  plugins: [
    viteStaticCopy({
      targets: [
        // kopiert src/components 1-zu-1 nach dist/src/components
        { src: 'src/components', dest: 'src' }
      ]
    })
  ]
});
