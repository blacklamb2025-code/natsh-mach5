# Auth Testing Playbook — AUTOMOTOS L.P.

Custom JWT (email+password, bcrypt), token in httpOnly cookie.

## MongoDB
```
mongosh
use test_database
db.users.findOne({role:"admin"}, {password_hash:1})   # hash debe empezar con $2b$
db.users.getIndexes()                                  # unique en email
```

## API (usar la URL externa /api)
```
BASE=https://63aaf55e-7df8-4892-9ed5-5f02986799d6.preview.emergentagent.com/api

# login OK -> setea cookies
curl -c c.txt -X POST $BASE/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@automotoslp.com","password":"AutoMotosLP.2026!"}'

# me con cookie
curl -b c.txt $BASE/auth/me

# admin protegido SIN cookie -> 401
curl -i $BASE/admin/submissions

# admin protegido CON cookie -> 200
curl -b c.txt $BASE/admin/submissions

# login mal -> 401 "Credenciales invalidas"
curl -i -X POST $BASE/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@automotoslp.com","password":"mal"}'
```

## Casos borde
- Token manipulado/expirado → 401 "No autenticado" (sin detalle del motivo).
- 6+ logins fallidos mismo IP+email → 429 (lockout 15 min).
- Submission con whatsapp no numérico o campos fuera de largo → 422 Pydantic.
- >5 submissions/min mismo IP → 429 rate limit.
- reply a reseña sin sesión admin → 401/403.
