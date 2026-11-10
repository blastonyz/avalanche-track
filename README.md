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

## Roles, equipos y entrega

- `User.access`: `user` (default) o `admin`. Ninguna ruta lo modifica: para hacer admin a alguien, cambiá `access` a `"admin"` en Atlas (colección `users`). Un valor inválido no da acceso.
- Un builder, un equipo: `haveTeam` + `team` se mueven juntos en `lib/team.ts` (`createTeam`, `joinTeam`, `leaveTeam`) con un update atómico. Máximo por equipo: `MAX_TEAM` en `lib/rules.ts`.
- Modelos: `User` -> `Team` (members con mail y nombre) -> `Project` (pitch, video, demo, código, completed).
- `/panel` usa rutas paralelas: `@builder` (equipo y entrega) y `@admin` (listas paginadas con mongoose-paginate-v2).

## Versiones fijas (seguridad)

`next`, `react` y `react-dom` están fijados sin `^` (Next 16.4.6, que incluye los fixes del
November 2026 Security Release). `.npmrc` tiene `save-exact=true` para que nuevas dependencias
también queden exactas. Antes de entregar: `npm audit`.

## Deploy en Vercel y login con Google

Login con next-auth v4 (sesión JWT en cookie httpOnly, sin adapter). El usuario y su rol viven en Mongo; el rol se lee en cada request.

1. Subí el repo a GitHub e importalo en Vercel.
2. Google Cloud Console > Credenciales > ID de cliente OAuth > Aplicación web > **URIs de redireccionamiento autorizados**:
   - `https://avalanche-track.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
3. Pantalla de consentimiento: publicala (o agregá los emails de prueba).
4. Vercel > Settings > Environment Variables (Production): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL=https://avalanche-track.vercel.app`, `NEXTAUTH_SECRET`, `MONGO_URI`, `MONGO_DB`. Redeploy.
   - `NEXTAUTH_SECRET` (o `SESSION_SECRET`, sirve el mismo): `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
5. Local: copiá `.env.example` a `.env.local`.
6. Los previews de Vercel tienen otra URL y Google no la acepta: el login anda en el dominio de producción.
