import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/SpiderClip_SetUp/',
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/components', dest: '' }   // landet als /components/… im dist
      ]
    })
  ]
});
