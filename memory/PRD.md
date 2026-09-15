# PRD - AUTOMOTOS L.P.

## Problem Statement
Directorio dark-mode de talleres y servicios del automotor de La Plata (autos/motos) con datos comunitarios de mapa (radares, cámaras, combustible, desvíos, sitios), Agenda Fierro y rueda flotante "Mach 5". React 19 (CRACO) + FastAPI + MongoDB.
Iteración actual: **Endurecimiento de seguridad** sin cambiar funcionalidad (importado desde ZIP del usuario).

## Architecture
- Frontend: React 19, Tailwind, lucide-react, sonner, Leaflet. Navegación por stack (AppContext). Alias `@`->`src`.
- Backend: FastAPI `/api`, motor async Mongo, ids UUID string, proyecciones `{"_id":0}`, seed por colección vacía.
- Auth: JWT propio (email+password, bcrypt) en cookie httpOnly + SameSite=None + Secure. Rol admin.
- Colecciones: businesses, reviews, radars, fuel_points, events, cameras, places, sites, desvios, users, login_attempts.

## Core Requirements (static)
- Dark theme (#0B0C10 / #12141C / #1F2330 / #FFD60A). Barlow Condensed + Inter.
- Mach 5 wheel, búsqueda global, AUTO/MOTO, grilla de categorías, listado/detalle, reseñas, Suma tu taller, panel admin.

## Implemented
- (2026-06 previo) App completa reconstruida + 5 bloques de backlog.
- **(2026-06) Endurecimiento de seguridad aplicado:**
  - JWT propio email+password (bcrypt) reemplaza el token estático compartido `X-Admin-Token`.
  - JWT en cookie httpOnly + SameSite=None + Secure (no localStorage). Access 30min + refresh 7d. HS256 validado explícito (anti alg:none).
  - Endpoints `/api/admin/*` y `reviews/{id}/reply` protegidos por dependencia `get_current_admin`.
  - Rate limiting (slowapi) login 10/min, submissions 5/min, reviews 10/min, radars 10/min. IP real por X-Forwarded-For.
  - Brute-force lockout: 5 fallos = 15 min (IP+email). Verificado 429 sobre URL pública.
  - CORS restringido por `CORS_ORIGINS` env (no `*`). Validación estricta Pydantic (largos, rangos, whatsapp `^\d{8,15}$`, stars 1-5). Paginación obligatoria en `/businesses` (tope 100).
  - Cabeceras de seguridad (CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy). Handler genérico 500 (sin stacktrace) + docs off en producción.
  - Frontend: `axios withCredentials`, AdminPanel con login email+password + logout, sin token en el bundle.
- Verificado: testing agent 100% frontend / 97% backend inicial → lockout corregido (X-Forwarded-For) → 100%.

## Backlog / Remaining (P2)
- Subida de fotos de talleres (hoy la app no tiene upload; guía de endurecimiento lista en SECURITY_AUDIT.md).
- En despliegue real: usuario Mongo con permisos mínimos, Atlas IP allowlist + TLS, cambiar ADMIN_PASSWORD y rotar JWT_SECRET, setear CORS_ORIGINS al dominio final.

## Credentials
- Admin: admin@automotoslp.com / AutoMotosLP.2026! (env `ADMIN_EMAIL`/`ADMIN_PASSWORD`).
