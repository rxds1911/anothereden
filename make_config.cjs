const fs = require("fs");
const content = `import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
});
`;
fs.writeFileSync("C:/Users/xylt2/Documents/anothereden/vite.config.js", content, "utf-8");
console.log("done");
