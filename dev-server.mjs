import { createServer } from "vite";
import vue from "@vitejs/plugin-vue";

const server = await createServer({
  plugins: [vue()],
  resolve: { alias: { vue: "vue/dist/vue.esm-bundler.js" } },
  server: { port: 5238, host: "127.0.0.1", strictPort: true }
});
await server.listen();
console.log("RUNNING:" + JSON.stringify({ port: 5238 }));
setInterval(() => {}, 60000);
