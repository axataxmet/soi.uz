const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 3456);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/babel; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent((urlPath || "/").split("?")[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return path.join(root, normalized);
}

function send(res, file) {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
}

function resolveFile(reqUrl) {
  const url = new URL(reqUrl, `http://localhost:${port}`);
  let file = safePath(url.pathname);

  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    const indexFile = path.join(file, "index.html");
    if (fs.existsSync(indexFile)) return indexFile;
  }

  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;

  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
    return path.join(root, "admin.html");
  }

  if (!path.extname(url.pathname)) {
    return path.join(root, "index.html");
  }

  return file;
}

http
  .createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Method not allowed");
      return;
    }
    const file = resolveFile(req.url);
    send(res, file);
  })
  .listen(port, () => {
    console.log(`SOI.UZ static server running at http://127.0.0.1:${port}`);
  });
