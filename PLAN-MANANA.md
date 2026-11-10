# Plan para mañana a primera hora

Síntoma: la sesión no persiste, el guardado del perfil falla ("No se pudo guardar") y `/panel` (rutas paralelas) no carga. Los tres cuelgan de lo mismo: si `/api/me` o el layout no ven la sesión, el perfil da 401 y `/panel` te manda al inicio.

## 0. Diagnóstico (15 min, antes de tocar código)
1. Entrar con Google. En DevTools > Application > Cookies, ¿existe `session` en `avalanche-track.vercel.app`? (httpOnly, Secure, Lax).
2. DevTools > Network: ¿qué status devuelve `GET /api/me` justo después del login? ¿Y `PATCH /api/me` al guardar (401 = sin sesión, 403 = chequeo de origen, 400 = validación)?
3. Vercel > Logs: buscar `[auth] getUser` y `[api]`.
4. Verificar en Atlas que el documento del usuario exista en `builders.users`.

Decisión:
- Cookie NO existe -> el problema está en `/callback` o en cómo se emite la cookie. Pasar al paso 2 (Auth.js).
- Cookie existe y `/api/me` da 401 -> bug puntual en `lib/auth.ts` (hoy `getUser` devuelve null en silencio ante cualquier error). Se arregla en 20 min, sin migrar.
- Cookie existe y `/api/me` da 200 pero el PATCH da 403 -> chequeo de `Origin`; se ajusta.

## 1. Cambios ya hechos esta noche
- Categoría fuera del perfil de usuario (modelo, API, formulario y tabla admin).
- GitHub obligatorio (formulario y API; en el esquema no, para no romper los usuarios recién creados).

## 2. Migración a Auth.js (next-auth v5), solo si el paso 0 lo justifica
Honesto: hoy el flujo propio ya hace lo mismo (PKCE, state, nonce, verificación de firma). Auth.js suma una dependencia y su v5 se instala con el tag beta; hay que confirmar la versión estable y que soporte Next 16.4 antes de adoptarla. Lo que sí da es manejo de sesión probado.

Pasos:
1. `npm i --save-exact next-auth@<versión confirmada>` y `npm audit` en 0.
2. Variables nuevas en Vercel: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_TRUST_HOST=true`. Sin `NEXT_PUBLIC_`. Se pueden reusar los valores de Google actuales.
3. Google Cloud Console: agregar la URI `https://avalanche-track.vercel.app/api/auth/callback/google` (más la de localhost). La `/callback` actual queda de reserva hasta que funcione.
4. `auth.ts` en la raíz: provider Google, sesión JWT (sin adapter), callbacks `signIn` (upsert del usuario con Mongoose) y `jwt`/`session` (guardar `uid` y `access` desde Mongo).
5. `app/api/auth/[...nextauth]/route.ts`.
6. Reemplazar `lib/session.ts` y `lib/auth.ts` por `auth()`. Mantener `requireUser/requireBuilder/requireAdmin` con la misma interfaz, así las rutas y el panel no cambian.
7. Botón "Continuar con Google": `signIn("google", { redirectTo: "/perfil" })`.
8. Borrar `app/api/auth/google`, `app/callback` y `app/api/auth/logout` (reemplazados por Auth.js).
9. El rol (`user`/`admin`) se sigue leyendo de Mongo en cada request, no del token, para que cambiarlo en Atlas surta efecto sin reloguear.

## 3. Verificación
- Login > recargar > sigue logueado > cerrar y abrir pestaña > sigue.
- Guardar perfil con GitHub vacío (debe rechazar) y completo (debe guardar).
- `/panel` como `user` (ve equipo y entrega) y como `admin` (ve listas paginadas).
- Crear equipo, unirse con un segundo usuario, intentar un segundo equipo (debe dar 409).
- `npm audit` en 0 y build limpio.

## 4. Pendiente chico
- Ruta `/api/iss` con caché para el mapa en vivo (el WiFi del evento comparte IP).
- Confirmar con la organización el máximo de integrantes y la hora de entrega.

---
## Estado (actualizado)
Se migró a next-auth v4.24.15 (mismo patrón que parkapp). Quedó fijada exacta; la 4.24.14 trae vulnerabilidades. `npm audit` en 0.
Se borraron `/callback`, `/api/auth/google`, `/api/auth/logout`, `/api/debug` y `lib/session.ts`.
