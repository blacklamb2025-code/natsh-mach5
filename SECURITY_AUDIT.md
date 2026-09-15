# Informe de Endurecimiento de Seguridad — AUTOMOTOS La Plata

Fecha: Junio 2026 · Stack: React + FastAPI + MongoDB
Postura: directorio de contacto público → foco en abuso de endpoints, scraping, spam e inyección.
Regla: **sin cambiar funcionalidad**; se blindó lo existente.

## Resumen del estado ANTES
- **No existía JWT ni usuarios/contraseñas.** El "admin" era un único token estático compartido
  (`X-Admin-Token: recolp-admin-2025`) comparado en texto plano, con **fallback hardcodeado en el código**
  y guardado en `localStorage` del navegador.
- CORS abierto con `*` **junto a** `allow_credentials=True`.
- Listado de profesionales sin paginación (`.to_list(1000)`) → volcado masivo posible.
- Sin rate limiting, sin cabeceras de seguridad, sin validación de largo/formato en los formularios.
- Endpoint `POST /reviews/{id}/reply` ("Respuesta del taller") **público y sin auth**.

---

## Checklist (OK / corregido)

### 1. Autenticación (JWT propio)
| Ítem | Estado |
|---|---|
| Secret JWT solo en env var, nunca en código/repo | ✅ CORREGIDO (`JWT_SECRET` en `.env`) |
| Access token corto (30 min) + refresh (7 días) | ✅ CORREGIDO |
| Algoritmo fijo `HS256` validado explícito (bloquea `alg:none`) | ✅ CORREGIDO (`algorithms=[HS256]`) |
| Hash con bcrypt (nunca texto plano/MD5) | ✅ CORREGIDO (bcrypt `$2b$`) |
| Endpoints admin protegidos por dependencia de auth (no solo ocultos en el front) | ✅ CORREGIDO (`Depends(get_current_admin)`) |

> Antes NO había login. Se reemplazó el token estático compartido por login email+contraseña con JWT.

### 2. Protección de endpoints y API
| Ítem | Estado |
|---|---|
| Rate limiting en login/registro/formularios | ✅ CORREGIDO (slowapi: login 10/min, submissions 5/min, reviews 10/min, radars 10/min) |
| CORS restringido al dominio real (no `*`) | ✅ CORREGIDO (por `CORS_ORIGINS` env var) |
| Validación estricta Pydantic (tipos, largos, email/teléfono) | ✅ CORREGIDO (min/max_length, rangos, `EmailStr`, whatsapp `^\d{8,15}$`, stars 1–5) |
| Paginación obligatoria en listado | ✅ CORREGIDO (`limit`/`skip`, tope duro 100) |

### 3. Base de datos (MongoDB)
| Ítem | Estado |
|---|---|
| Queries parametrizadas del driver (no armar filtros con strings del usuario) | ✅ OK (filtros dict tipados; params tipados como `str` → no admite operadores `$`) |
| Usuario Mongo con permisos mínimos | ⚠️ RECOMENDADO en despliegue (crear user con rol solo sobre la base de la app) |
| Credenciales en env + Atlas IP allowlist + TLS | ⚠️ RECOMENDADO al pasar a Atlas |

### 4. Frontend React
| Ítem | Estado |
|---|---|
| JWT NO en localStorage → cookie httpOnly + SameSite | ✅ CORREGIDO (cookies `httpOnly; Secure; SameSite=None`; `axios withCredentials`) |
| Sanitizar/escapar contenido dinámico (XSS) | ✅ OK (React escapa por defecto; **no** se usa `dangerouslySetInnerHTML`) |
| No exponer claves/endpoints internos en el bundle | ✅ OK (solo `REACT_APP_BACKEND_URL`; se removió el token admin del front) |

### 5. Cabeceras y transporte
| Ítem | Estado |
|---|---|
| HTTPS obligatorio | ✅ OK (TLS terminado en el ingress; se agregó HSTS) |
| CSP, X-Content-Type-Options, X-Frame-Options, HSTS | ✅ CORREGIDO (middleware de cabeceras) |
| Sin stacktraces en producción | ✅ CORREGIDO (handler genérico 500 + docs deshabilitados con `ENV=production`) |

### 6. Subida de imágenes
| Ítem | Estado |
|---|---|
| Validar MIME+extensión+tamaño / renombrar / carpeta sin ejecución | ➖ N/A hoy: **la app no tiene subida de archivos** (las fotos son URLs). Guía lista para cuando se agregue (ver Backlog). |

---

## Casos borde
- Token expirado/manipulado → **401 "No autenticado"** sin filtrar el motivo. ✅
- Registro/submission con datos basura o whatsapp inválido → **422 Pydantic**. ✅
- Spam del formulario (mismo IP) → **429 rate limit**. ✅
- Editar recurso ajeno → sin cuentas por-taller; se cerró el punto abierto: `reply` de reseñas ahora **requiere admin** (antes público). ✅
- Brute force en login → **lockout 15 min tras 5 fallos** (IP+email). ✅

---

## Cambios aplicados (archivos)
- `backend/server.py` — JWT+bcrypt, cookies httpOnly, auth deps, rate limit, paginación, validación Pydantic, cabeceras, handler de errores, CORS restringido, admin seeding.
- `backend/.env` — `JWT_SECRET`, `ADMIN_EMAIL/PASSWORD`, `CORS_ORIGINS`, `ENV`.
- `frontend/src/lib/api.js` — `withCredentials`, auth por cookie, sin token en localStorage.
- `frontend/src/components/modals/AdminPanel.jsx` — login email+contraseña, verificación de sesión, logout.

## Recomendaciones de despliegue (fuera del código)
- Crear usuario de MongoDB con permisos mínimos sobre la base de la app; en Atlas: IP allowlist + TLS.
- Cambiar `ADMIN_PASSWORD` por una fuerte y única; rotar `JWT_SECRET` periódicamente.
- Setear `CORS_ORIGINS` al dominio final cuando exista (hoy usa el preview, configurable por env).
- Servir el frontend con las mismas cabeceras de seguridad (CSP/HSTS) desde su host/CDN.

## Backlog (P2, no pedido)
- Si se agrega subida de fotos: endpoint con validación MIME real + extensión + tamaño máx, renombrado (uuid), carpeta sin permiso de ejecución, y servir como estático.
- Origin-check explícito en requests mutantes (defensa extra CSRF) si se pasa a cross-site real.
