# Cargar muchos negocios de una vez

## 1. Armar la planilla
Abrí `negocios_modelo.csv` con Excel o Google Sheets, borrá las 2 filas de ejemplo y completá **una fila por negocio**.

| Columna | Qué poner | Ejemplo |
|---|---|---|
| nombre | Nombre del negocio | Taller El Fierro |
| categoria | Una de la lista de abajo (tal cual, en minúscula) | mecanica |
| vehiculos | `auto`, `moto` o `auto,moto` | auto,moto |
| zona | Barrio o localidad | City Bell |
| whatsapp | Solo números, con 549 + código de área + número | 5492211234567 |
| descripcion | Texto corto (opcional) | Service completo |
| servicios | Separados por coma (opcional) | Service, Frenos |

**Categorías válidas:** mecanica, chapa_pintura, neumaticos, electrica, optica, soldadura, grua, lavadero, personalizacion, gnc, importadores, papeles_vtv, asesoria_legal, cascos, seguridad_airbag

Guardá como **CSV (delimitado por comas)**.

## 2. Probar sin guardar nada
```
cd backend
python import_negocios.py negocios.csv
```
Te dice cuántas filas están bien y cuáles tienen error (con el número de fila).

## 3. Cargar de verdad
Necesita el archivo `backend/.env` con `MONGO_URL` y `DB_NAME` (los mismos del servidor).
```
python import_negocios.py negocios.csv --guardar
```
- Los negocios quedan **pendientes**: los revisás y aprobás en el panel admin.
- Si confiás en la planilla, agregá `--aprobar` para publicarlos directo.
- Si lo corrés dos veces, **no duplica** los que ya existen (mismo nombre y WhatsApp).
