const http = require("http");
const fs = require("fs");
const path = require("path");
const root = "C:/Users/xylt2/Documents/anothereden";
const mime = { ".html": "text/html;charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".vue": "text/plain", ".json": "application/json" };
http.createServer((req, res) => {
  let filePath = path.join(root, req.url === "/" ? "index.html" : req.url);
  filePath = filePath.split("?")[0];
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not Found"); return; }
    res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
    res.end(data);
  });
}).listen(5227, "127.0.0.1", () => console.log("Server: http://127.0.0.1:5227"));
