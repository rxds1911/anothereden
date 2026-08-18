import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Dev-only endpoint: /api/bilibili/view?bvid=... -> bilibili video info.
// Avoids browser CORS by fetching server-side. Not available in static builds.
function bilibiliTitleProxy() {
  return {
    name: "bilibili-title-proxy",
    configureServer(server) {
      server.middlewares.use("/api/bilibili", async (req, res, next) => {
        try {
          const url = new URL(req.url, "http://localhost")
          const bvid = (url.searchParams.get("bvid") || "").trim()
          if (!/^BV[0-9A-Za-z]{10}$/.test(bvid)) {
            res.statusCode = 400
            res.end(JSON.stringify({ code: -1, message: "invalid bvid" }))
            return
          }
          const upstream = await fetch(
            `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
            {
              headers: {
                "Referer": "https://www.bilibili.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
              }
            }
          )
          const data = await upstream.json()
          res.setHeader("Content-Type", "application/json; charset=utf-8")
          res.setHeader("Cache-Control", "no-store")
          res.end(JSON.stringify(data))
        } catch (error) {
          res.statusCode = 502
          res.end(JSON.stringify({ code: -1, message: "upstream fetch failed" }))
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), bilibiliTitleProxy()],
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
});
