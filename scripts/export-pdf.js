import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const PORT = 3000;
const SITE_DIR = "docs"; // ou "public"
const OUT_DIR = "exports";
const OUT_FILE = path.join(OUT_DIR, "dotnet-modernization-overview.pdf");

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Serve local statique via un petit serveur node (sans dépendance)
  const { createServer } = await import("http");
  const { readFile } = await import("fs/promises");
  const { extname, join } = await import("path");

  const mime = {
    ".html": "text/html",
    ".md": "text/plain",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml"
  };

  const server = createServer(async (req, res) => {
    const urlPath = (req.url || "/").split("?")[0];
    const filePath = join(process.cwd(), SITE_DIR, urlPath === "/" ? "index.html" : urlPath);

    try {
      const data = await readFile(filePath);
      res.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream" });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // "print-pdf" = pagination PDF
  await page.goto(`http://localhost:${PORT}/?print-pdf`, { waitUntil: "networkidle" });

  // Donne un petit temps pour les polices / highlight
  await page.waitForTimeout(500);

  await page.pdf({
    path: OUT_FILE,
    printBackground: true,
    preferCSSPageSize: true
  });

  await browser.close();
  server.close();

  console.log(`PDF exported to: ${OUT_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
