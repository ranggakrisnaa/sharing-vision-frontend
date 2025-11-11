# Post Articles Frontend (React + Vite)

Frontend untuk aplikasi Post Articles yang terhubung ke API Fiber + MySQL.

## Struktur Folder

- `src/pages/articles/ArticlesDashboard.tsx` — halaman utama dashboard (filter, list, create, update, delete).
- `src/routes/router.tsx` — definisi router dengan layout sidebar responsif.
- `src/components/ui/` — komponen UI berbasis shadcn-style (Button, Input, Textarea, Select, Label).
- `src/services/articles.ts` — pemanggilan API (`list`, `create`, `update`, `delete`).
- `src/types/article.ts` — tipe data untuk article dan bentuk response API.
- `src/lib/` — helper umum (`api.ts`, `queryClient.ts`, `utils.ts`).
- `tailwind.config.cjs`, `postcss.config.cjs` — konfigurasi styling.
- `components.json` — konfigurasi shadcn/ui.

## Dependensi Utama

- `react-router-dom` — routing.
- `@tanstack/react-query` — data fetching & caching + devtools.
- `zod` + `react-hook-form` + `@hookform/resolvers` — validasi form.
- `tailwindcss` v3 + `tailwindcss-animate` — styling utilitas.
- `class-variance-authority`, `clsx`, `tailwind-merge` — util kelas untuk komponen UI.

## Menjalankan Aplikasi

1. Masuk ke direktori frontend dan instal dependensi:
   ```bash
   cd frontend
   pnpm install
   ```
2. Set environment base URL API (opsional jika backend lokal di `8080`):
   - Buat `.env` atau `.env.local` dengan isi:
     ```bash
     VITE_API_BASE_URL=http://localhost:8080
     ```
3. Jalankan development server:
   ```bash
   pnpm dev
   ```
   Buka `http://localhost:5173/`.

## Build & Preview

```bash
pnpm build
pnpm preview
```

## Routing

- Halaman utama: `/` (ArticlesDashboard).
- Dashboard Articles: `/dashboard/articles`.
- Create Article: `/dashboard/articles/create`.
- Update Article: `/dashboard/articles/update/:id`.
- Delete Article: `/dashboard/articles/delete/:id`.

## Fitur UI

- Filter daftar artikel berdasarkan judul, kategori, dan status.
- List artikel dengan informasi kategori, status, dan waktu update.
- Create artikel baru dengan validasi Zod:
  - `title`: min 20 karakter
  - `content`: min 200 karakter
  - `category`: min 3 karakter
  - `status`: `publish | draft | thrash`
- Update artikel (prefill form dari item yang dipilih).
- Delete artikel dengan konfirmasi.
- Caching & refetch otomatis via TanStack Query.
- Responsif: grid 1 kolom (mobile) dan 2 kolom (desktop).

## Integrasi API Backend

Pastikan backend berjalan (default `:8080`). Endpoint yang digunakan:

- `GET /articles` — daftar artikel dengan pagination dan filter.
- `POST /articles` — membuat artikel.
- `GET /articles/:id` — detail artikel.
- `PUT /articles/:id` — update artikel.
- `DELETE /articles/:id` — hapus artikel.

Atur `VITE_API_BASE_URL` agar pemanggilan menggunakan base URL yang tepat.
