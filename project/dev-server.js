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
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent((urlPath || "/").split("?")[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return path.join(root, normalized);
}

function send(res, file, range) {
  const type = types[path.extname(file).toLowerCase()] || "application/octet-stream";

  // Media needs byte ranges — Safari refuses to play video served without them.
  if (range && /^video\//.test(type)) {
    fs.stat(file, (err, stat) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }
      const m = /^bytes=(\d*)-(\d*)$/.exec(range);
      const start = m && m[1] ? Number(m[1]) : 0;
      const end = m && m[2] ? Number(m[2]) : stat.size - 1;
      if (start >= stat.size || end >= stat.size || start > end) {
        res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
        res.end();
        return;
      }
      res.writeHead(206, {
        "Content-Type": type,
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Cache-Control": "no-store",
      });
      fs.createReadStream(file, { start, end }).pipe(res);
    });
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const headers = { "Content-Type": type, "Cache-Control": "no-store" };
    if (/^video\//.test(type)) headers["Accept-Ranges"] = "bytes";
    res.writeHead(200, headers);
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

/* /api and /uploads are forwarded to the Nest backend so the site can be served
   through a single origin — a tunnel, a phone on the LAN, anything that is not
   this machine. Without it the browser would be asked to call
   http://localhost:4000 from an https page: the wrong host for the visitor, and
   blocked as mixed content besides. Same origin also means no CORS pre-flight
   to configure, and it lets media URLs be stored relative. */
const API_TARGET = process.env.API_TARGET || "http://127.0.0.1:4000";
const PROXIED = ["/api", "/uploads"];

function proxyApi(req, res) {
  const t = new URL(API_TARGET);
  const up = http.request(
    {
      hostname: t.hostname,
      port: t.port || 80,
      path: req.url,
      method: req.method,
      // The upstream must see its own host, not the tunnel's.
      headers: Object.assign({}, req.headers, { host: t.host }),
    },
    (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res); }
  );
  up.on("error", (e) => {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "api_unreachable", target: API_TARGET, detail: e.message }));
  });
  req.pipe(up);
}

http
  .createServer((req, res) => {
    if (PROXIED.some((p) => req.url === p || req.url.startsWith(p + "/"))) {
      proxyApi(req, res);
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Method not allowed");
      return;
    }
    const file = resolveFile(req.url);
    send(res, file, req.headers.range);
  })
  .listen(port, () => {
    console.log(`SOI.UZ static server running at http://127.0.0.1:${port}`);
  });
