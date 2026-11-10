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

Base `builders`, colección `users` (modelo en `lib/models/User.ts`). Variables: `MONGO_URI` y `MONGO_DB=builders`.
En Atlas: Database Access > usuario con rol `readWrite` solo sobre `builders`; Network Access > `0.0.0.0/0`
(Vercel no tiene IP fija). Si la clave tiene caracteres raros, codificala (`@` -> `%40`).

## Versiones fijas (seguridad)

`next`, `react` y `react-dom` están fijados sin `^` (Next 16.4.6, que incluye los fixes del
November 2026 Security Release). `.npmrc` tiene `save-exact=true` para que nuevas dependencias
también queden exactas. Antes de entregar: `npm audit`.

## Deploy en Vercel y login con Google

Flujo OAuth en el servidor (código + PKCE + state + nonce). El id_token se verifica con la clave pública
de Google y la sesión es una cookie httpOnly firmada.

1. Subí el repo a GitHub e importalo en Vercel.
2. Google Cloud Console > Credenciales > ID de cliente OAuth > Aplicación web > **URIs de redireccionamiento autorizados**:
   - `https://avalanche-track.vercel.app/callback`
   - `http://localhost:3000/callback` (desarrollo)
3. Pantalla de consentimiento: publicala (o agregá los emails de prueba) o solo entrarán usuarios de test.
4. Vercel > Settings > Environment Variables (Production): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CALLBACK_URL`,
   `MONGO_URI`, `MONGO_DB`, `SESSION_SECRET`. Redeploy.
   - `SESSION_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
5. Local: copiá `.env.example` a `.env.local` y completalo. Nunca subas secretos al repo.
6. Los previews de Vercel tienen otra URL y Google no la acepta: el login anda en el dominio de producción.
