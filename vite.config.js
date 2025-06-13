import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/SpiderClip_SetUp/',
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/components', dest: 'src' }, 
        { src: 'src/code', dest: 'src' }  
      ]
    })
  ]
});
