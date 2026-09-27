import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function resumeUploadServerPlugin(): Plugin {
  return {
    name: 'resume-upload-server',
    configureServer(server) {
      server.middlewares.use('/api/upload-resume', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (!data.base64) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Missing base64 data' }));
            }

            const base64Data = data.base64.replace(/^data:application\/pdf;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const filename = (data.filename || 'resume.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');

            const publicDir = path.resolve(import.meta.dirname, 'public');
            const uploadsDir = path.join(publicDir, 'uploads');
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }

            // 1. Overwrite public/resume.pdf so standard URL is immediately updated on disk
            const mainResumePath = path.join(publicDir, 'resume.pdf');
            fs.writeFileSync(mainResumePath, buffer);

            // 2. Save named version in public/uploads/
            const timestamp = Date.now();
            const versionedName = `${timestamp}_${filename}`;
            fs.writeFileSync(path.join(uploadsDir, versionedName), buffer);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                url: `/uploads/${versionedName}`,
                mainUrl: `/resume.pdf?t=${timestamp}`,
                filename,
                size: buffer.length,
                updatedAt: new Date().toISOString(),
              })
            );
          } catch (err: any) {
            console.error('[Upload Middleware] Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Upload failed' }));
          }
        });
      });
    },
  };
}

function supabaseDevHealthEndpointPlugin(): Plugin {
  return {
    name: 'supabase-dev-health-endpoint',
    configureServer(server) {
      // Local dev mock/proxy for /api/supabase-health to match Vercel Serverless behavior
      server.middlewares.use('/api/supabase-health', async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }

        const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xkkwfrwamvictgrhepgg.supabase.co';
        const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2nLc2vuaV6KJQM5VODAAGg_X2NrdvH6';
        const start = Date.now();

        try {
          // Read-only check on storage objects list (touching PostgreSQL)
          const resp = await fetch(`${SUPABASE_URL}/storage/v1/object/list/portfolio-media`, {
            method: 'POST',
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prefix: '', limit: 1 }),
          });

          res.statusCode = resp.ok ? 200 : 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              status: resp.ok ? 'active' : 'degraded',
              project: SUPABASE_URL.replace('https://', '').split('.')[0],
              environment: 'local_dev_server',
              isReadOnly: true,
              result: {
                ok: resp.ok,
                latencyMs: Date.now() - start,
                httpStatus: resp.status,
                operation: 'storage:list(portfolio-media)',
              },
            })
          );
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || 'Local check failed' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), resumeUploadServerPlugin(), supabaseDevHealthEndpointPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
