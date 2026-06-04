# Jomoro Koffee - Backend System

Sistem backend untuk platform Jomoro Koffee, sebuah perusahaan coffee chain yang sedang berkembang. Sistem ini dibangun menggunakan arsitektur **Microservice** dengan **NestJS Framework**.

---

## 📌 Tentang Project

Jomoro Koffee membutuhkan sistem backend yang modern dan skalabel untuk menangani:
- Manajemen produk (kopi, minuman non-kopi, dan pastri)
- Sistem autentikasi pengguna dengan tiga role berbeda
- Proses transaksi seperti cart, checkout, dan riwayat order

Project ini dibuat sebagai bagian dari tugas Project Lab mata kuliah **COSC6093 - Software Architecture**.

---

## 🏗️ Arsitektur Sistem

Sistem dibagi menjadi **3 service terpisah**, masing-masing berjalan di port yang berbeda:

| Service | Port | Fungsi |
|---|---|---|
| **Auth Service** | 3001 | Registrasi, login, dan autentikasi JWT |
| **Product Service** | 3002 | Manajemen produk, kategori, dan stok |
| **Transaction Service** | 3003 | Cart, checkout, order, dan profil pengguna |

---

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MySQL (via XAMPP)
- **ORM**: Prisma Client v5
- **Autentikasi**: JWT (JSON Web Token) + Passport
- **Dokumentasi API**: Swagger (OpenAPI 3.0)
- **Komunikasi antar service**: Axios
- **Runtime**: Node.js v22.16.0

---

## 👥 User Roles

| Role | Akses |
|---|---|
| **Guest** (tidak login) | Melihat produk, kategori, register, login |
| **Customer** (login) | Profil, cart, orders, checkout |
| **Admin** (login) | CRUD produk |

---

## 📁 Struktur Project

```
jomoro-koffee/
├── auth-service/          # Service autentikasi (port 3001)
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── auth/
│       │   ├── dto/
│       │   │   ├── register.dto.ts
│       │   │   └── login.dto.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── jwt.guard.ts
│       │   └── jwt.strategy.ts
│       ├── prisma/
│       │   ├── prisma.module.ts
│       │   └── prisma.service.ts
│       ├── app.module.ts
│       └── main.ts
│
├── product-service/       # Service produk (port 3002)
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── product/
│       │   ├── dto/
│       │   │   ├── create-product.dto.ts
│       │   │   └── reduce-stock.dto.ts
│       │   ├── product.controller.ts
│       │   ├── product.module.ts
│       │   ├── product.service.ts
│       │   ├── jwt.guard.ts
│       │   ├── jwt.strategy.ts
│       │   ├── roles.guard.ts
│       │   └── roles.decorator.ts
│       ├── prisma/
│       │   ├── prisma.module.ts
│       │   └── prisma.service.ts
│       ├── app.module.ts
│       └── main.ts
│
├── transaction-service/   # Service transaksi (port 3003)
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── transaction/
│       │   ├── dto/
│       │   │   ├── add-cart.dto.ts
│       │   │   └── update-cart.dto.ts
│       │   ├── transaction.controller.ts
│       │   ├── transaction.module.ts
│       │   ├── transaction.service.ts
│       │   ├── jwt.guard.ts
│       │   └── jwt.strategy.ts
│       ├── prisma/
│       │   ├── prisma.module.ts
│       │   └── prisma.service.ts
│       ├── app.module.ts
│       └── main.ts
│
├── jomoro_koffee.sql      # File SQL untuk setup database
└── README.md
```

---

## 🗄️ Database Schema

Semua service menggunakan satu database `jomoro_koffee`.

### Auth Service
**Tabel `users`**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT | Primary Key |
| first_name | VARCHAR(255) | Nama depan |
| last_name | VARCHAR(255) | Nama belakang |
| email | VARCHAR(255) | Email unik |
| password | VARCHAR(255) | Password (plain text) |
| role | VARCHAR(25) | "ADMIN" atau "CUSTOMER" |

### Product Service
**Tabel `categories`**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT | Primary Key |
| name | VARCHAR(255) | Nama kategori |

**Tabel `products`**
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT | Primary Key |
| name | VARCHAR(255) | Nama produk |
| description | VARCHAR(255) | Deskripsi produk |
| price | DOUBLE | Harga produk |
| stock | INT | Stok tersedia |
| image_url | VARCHAR(255) | URL gambar (nullable) |
| category_id | INT | FK ke categories |

### Transaction Service
**Tabel `carts`**: `id`, `user_id`

**Tabel `cart_items`**: `id`, `cart_id`, `product_id`, `quantity`

**Tabel `orders`**: `id`, `user_id`, `created_at`

**Tabel `order_details`**: `id`, `order_id`, `product_id`, `price`, `quantity`

---

## ⚙️ Cara Setup & Menjalankan Project

### Prasyarat
Pastikan software berikut sudah terinstall:
- Node.js v22.16.0
- XAMPP v8.2.12 (MySQL + phpMyAdmin)
- Visual Studio Code
- Git

### Langkah 1 — Clone Repository
```bash
git clone https://github.com/SunHokk/Jomoro-Koffee.git
cd jomoro-koffee
```

### Langkah 2 — Setup Database
1. Jalankan XAMPP dan aktifkan **Apache** dan **MySQL**
2. Buka **phpMyAdmin** di `http://localhost/phpmyadmin`
3. Klik tab **Import**
4. Pilih file `jomoro_koffee.sql` dari root folder project
5. Klik **Go** untuk mengimport

### Langkah 3 — Setup Auth Service
```bash
cd auth-service
npm install
npx prisma generate
npm run start:dev
```

### Langkah 4 — Setup Product Service
```bash
cd ../product-service
npm install
npx prisma generate
npm run start:dev
```

### Langkah 5 — Setup Transaction Service
```bash
cd ../transaction-service
npm install
npx prisma generate
npm run start:dev
```

> ⚠️ **Penting**: Jalankan ketiga service secara bersamaan di terminal yang berbeda.

---

## 📡 API Endpoints

### Auth Service (`http://localhost:3001`)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | /auth/register | Guest | Registrasi user baru |
| POST | /auth/login | Guest | Login dan mendapatkan token JWT |
| GET | /auth/profile | Customer/Admin | Melihat profil user |

### Product Service (`http://localhost:3002`)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | /products | Guest | Daftar semua produk |
| GET | /products/:id | Guest | Detail produk |
| GET | /categories | Guest | Daftar semua kategori |
| GET | /categories/:categoryId/products | Guest | Produk berdasarkan kategori |
| POST | /admin/products | Admin | Tambah produk baru |
| POST | /admin/products/:id/update | Admin | Update produk |
| POST | /admin/products/:id/reduce | Admin | Kurangi stok produk |
| POST | /admin/products/:id/delete | Admin | Hapus produk |

### Transaction Service (`http://localhost:3003`)

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | /cart | Customer | Lihat isi cart |
| POST | /cart | Customer | Tambah item ke cart |
| POST | /cart/:product_id/update | Customer | Update quantity item di cart |
| POST | /cart/:product_id/delete | Customer | Hapus item dari cart |
| POST | /cart/clear | Customer | Kosongkan cart |
| GET | /orders | Customer | Riwayat order |
| POST | /orders | Customer | Checkout |
| POST | /orders/:id | Customer | Detail order |
| GET | /profiles | Customer | Profil user |

---

## 🔐 Autentikasi

Sistem menggunakan **JWT Bearer Token** untuk autentikasi.

1. Login via `POST /auth/login` untuk mendapatkan token
2. Sertakan token di header setiap request ke endpoint yang dilindungi:
```
Authorization: Bearer <your_token>
```
3. JWT payload berisi `id` dan `role` pengguna

---

## 📝 Validasi

### Register
- `first_name` & `last_name`: hanya boleh huruf (tidak boleh angka atau karakter spesial)
- `email`: harus diakhiri dengan domain `.com`, `.net`, `.org`, atau `.id`
- `password`: minimal 8 karakter, minimal 2 angka, tidak boleh mengandung spasi

### Produk (Admin)
- `name`: minimal 3 kata
- `description`: minimal 20 karakter
- `price`: bilangan positif (minimal 1)
- `stock`: antara 0 dan 999
- `category_id`: harus merujuk ke kategori yang ada

---

## 🧪 Cara Testing API (via Swagger)

Setelah semua service berjalan, buka Swagger UI di browser:

| Service | URL Swagger |
|---|---|
| Auth Service | `http://localhost:3001/api` |
| Product Service | `http://localhost:3002/api` |
| Transaction Service | `http://localhost:3003/api` |

**Langkah testing endpoint yang membutuhkan autentikasi:**
1. Buka Swagger Auth Service (`http://localhost:3001/api`)
2. Login via `POST /auth/login`
3. Copy nilai `access_token` dari response
4. Buka Swagger service yang ingin ditest
5. Klik tombol **Authorize** di pojok kanan atas
6. Paste token di kolom **Value**
7. Klik **Authorize** lalu **Close**
8. Test endpoint yang diinginkan

---

## 👨‍💻 Developer

**Nama**: Gilbert, Stawin, Nabil

**Mata Kuliah**: COSC6093 - Software Architecture  

**Tahun**: 2026
