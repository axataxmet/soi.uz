// Precompiles project/app/*.jsx into project/dist/app/*.js.
//
// The site has no bundler and no import/export: 35 files run as separate
// global <script> tags and rely on cross-file globals — e.g. app/news.jsx
// uses a bare `useState` that it never declares itself, expecting it to
// leak from the `const { useState } = React` in header.jsx/home-page.jsx/
// certificates.jsx. That only worked at runtime because babel.js's default
// preset downlevels `const`/`let` to `var`: `var` redeclarations across
// separate <script> tags are legal (unlike `const`/`let`, which throw
// "already declared" the instant a second script redeclares the same
// top-level name), and `var` at the top of a real <script> tag becomes a
// `window` property, which is how the leak happens.
//
// esbuild can strip JSX but (as of 0.28) refuses to downlevel const/let to
// var for old targets, so this uses @babel/core directly — the same
// transform babel.js was doing in-browser, just run once here instead of
// on every visit.
const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

const root = path.join(__dirname, "..", "project");
const srcDir = path.join(root, "app");
const outDir = path.join(root, "dist", "app");

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".jsx"));

for (const file of files) {
  const srcPath = path.join(srcDir, file);
  const { code } = babel.transformFileSync(srcPath, {
    presets: [
      ["@babel/preset-env", { targets: "ie 11" }],
      ["@babel/preset-react", { runtime: "classic" }],
    ],
    envName: "production",
    babelrc: false,
    configFile: false,
    comments: false,
    minified: true,
  });
  const outPath = path.join(outDir, file.replace(/\.jsx$/, ".js"));
  fs.writeFileSync(outPath, code);
}

console.log(`Built ${files.length} files into ${path.relative(process.cwd(), outDir)}/`);
