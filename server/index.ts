import express from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { MemStorage } from "./storage";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  const storage = new MemStorage();
  registerRoutes(app, storage);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static("dist/client"));
    app.get(/.*/, (_req, res) => {
      res.sendFile(path.resolve("dist/client", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      configFile: false,
      server: { 
        middlewareMode: true,
        host: true,
        hmr: {
          host: "localhost",
        },
        allowedHosts: [
          '.replit.dev',
          '.repl.co',
          'localhost'
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
      },
      plugins: [
        (await import("@vitejs/plugin-react")).default(),
      ],
    });
    app.use(vite.middlewares);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
