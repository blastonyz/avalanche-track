# avax-track

Sitio de ruta del Track Blockchain (Avalanche) del hackathon Argentina Space, Salta 2026.
Next.js 16 (App Router) + TypeScript, sin base de datos.

## Correr

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verificación de producción
```

## Qué hay

- `/` hero, entregables, categorías (Geoespacial, RWA, Agentes, Libre), criterios, docs de Avalanche con el link de referido.
- `/dashboard` catálogo de APIs con filtros por acceso y tema, botón "Probar ahora" (datos reales desde el navegador), checklist.
- `/guia` once pasos del problema a la entrega, con test de blockchain, deck, canvas y prompt para IA.
- `/geoespacial` herramientas para ver y mostrar datos, patrón de seguros on-chain.
- `/blockchain` Core Wallet, faucet, botón para agregar Fuji, patrones de oráculo, L1 propia.

## Configurar

- `lib/links.ts`: fecha del countdown (13/11/2026 09:00 ART), link de referido, herramientas de IA, datos de Fuji.
- `lib/data.ts`: contenido (APIs, categorías, pasos).
- `.env.local`: `NEXT_PUBLIC_SKILLS_REPO=<link del repo de skills>`.
- `public/brand/`: poné `team1-avalanche.svg` (logo oficial); ver README ahí.

## MongoDB

No hace falta para este sitio. Si se suma (por ejemplo para guardar proyectos por equipo), agregar una ruta `app/api/` y `MONGODB_URI` en `.env.local`.

## Versiones fijas (seguridad)

`next`, `react` y `react-dom` están fijados sin `^` (Next 16.4.6, que incluye los fixes del
November 2026 Security Release). `.npmrc` tiene `save-exact=true` para que nuevas dependencias
también queden exactas. Antes de entregar: `npm audit`.

## Deploy en Vercel y login con Google

1. Subí el repo a GitHub e importalo en Vercel (framework: Next.js, sin configuración extra).
2. En Google Cloud Console: APIs y servicios > Credenciales > ID de cliente de OAuth > Aplicación web.
   - **Orígenes autorizados de JavaScript:** `https://<tu-proyecto>.vercel.app` (y el dominio propio si lo hay; `http://localhost:3000` para desarrollo).
   - No hace falta URI de redireccionamiento: se usa Google Identity Services (botón de ID token).
3. En Vercel > Settings > Environment Variables: `NEXT_PUBLIC_GOOGLE_CLIENT_ID=<client id>` (Production y Preview) y redeploy.
4. Los previews de Vercel tienen una URL distinta por deploy: Google solo acepta orígenes registrados, así que el login va a andar en el dominio fijo de producción.
5. Seguridad: hoy el token de Google solo se decodifica en el navegador (no se verifica la firma). Antes de guardar datos reales, verificalo en el servidor (`google-auth-library`, `verifyIdToken`).
