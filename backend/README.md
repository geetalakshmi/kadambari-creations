# Kadambari Creations — Backend (FastAPI)

## Quickstart
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # edit ADMIN_TOKEN and CORS origins
./run.sh
```
The API will run on: http://localhost:8000

## Endpoints
- `GET /api/health`
- `GET /api/categories`
- `GET /api/products?category=women&q=kurti`
- `POST /api/admin/products` (multipart form: name, price, category, description, image) — header `x-admin-token: <ADMIN_TOKEN>`
- `PUT /api/admin/products/{id}` (JSON ProductIn) — header `x-admin-token`
- `DELETE /api/admin/products/{id}` — header `x-admin-token`

Uploaded images are served at `/static/uploads/...`.
