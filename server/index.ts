import express from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

(async () => {
  if (process.env.NODE_ENV === "production") {
    const httpServer = await registerRoutes(app, storage);
    
    // Serve static assets with long cache headers (1 year for hashed assets)
    app.use(express.static("dist/client", {
      maxAge: '1y',
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        // Cache immutable assets with hashes for 1 year
        if (filePath.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|webp|avif|gif|ico)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
        // HTML files should not be cached
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      }
    }));
    
    app.get(/.*/, (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.resolve("dist/client", "index.html"));
    });
    
    const PORT = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } else {
    // Register API routes FIRST, before Vite middleware
    const httpServer = await registerRoutes(app, storage);
    
    const vite = await createViteServer({
      configFile: false,
      server: { 
        middlewareMode: true,
        host: true,
        hmr: {
          protocol: 'wss',
          clientPort: 443,
        },
        allowedHosts: [
          '.replit.dev',
          '.repl.co',
          'localhost',
          '.spock.replit.dev'
        ],
      },
      appType: "spa",
      root: "client",
      resolve: {
        alias: {
          "@": path.resolve(process.cwd(), "./client/src"),
          "@shared": path.resolve(process.cwd(), "./shared"),
          "@assets": path.resolve(process.cwd(), "./attached_assets"),
        },
        dedupe: ['react', 'react-dom'],
      },
      optimizeDeps: {
        include: ['react', 'react-dom'],
      },
      plugins: [
        (await import("@vitejs/plugin-react")).default(),
      ],
    });
    app.use(vite.middlewares);
    
    const PORT = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
})();
