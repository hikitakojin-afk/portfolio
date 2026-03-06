import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom Vite plugin to handle POST requests and write to the local JSON file
const portfolioSavePlugin = (): Plugin => {
  return {
    name: 'portfolio-save-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-portfolio', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              // Ensure the JSON is valid before parsing/writing
              const jsonData = JSON.parse(body);

              const targetPath = path.resolve(__dirname, 'src/data/portfolio.json');
              fs.writeFileSync(targetPath, JSON.stringify(jsonData, null, 2), 'utf-8');

              console.log(`[Portfolio Editor] Successfully saved to ${targetPath}`);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Saved successfully' }));
            } catch (err: any) {
              console.error('[Portfolio Editor] Save failed:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          res.statusCode = 405; // Method not allowed
          res.end();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), portfolioSavePlugin()],
})
