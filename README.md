# Irigasi Cerdas Lahan Toraja

Dashboard React + Vite dengan API Node.js dan database MySQL.

## Menjalankan MySQL lokal

1. Install MySQL Server 8 atau jalankan MySQL melalui XAMPP/Docker.
2. Pastikan service MySQL berjalan pada port `3306`.
3. Salin `.env.example` menjadi `.env`, lalu isi `MYSQL_USER` dan `MYSQL_PASSWORD` sesuai konfigurasi MySQL.
4. Jalankan `npm install`.
5. Jalankan migrasi data awal dengan `npm run db:seed`.
6. Jalankan `npm run dev`.
7. Buka `http://localhost:5173`.

API akan otomatis membuat database `irigasi_cerdas`, tabel relasional, dan data awal dari file data aplikasi saat pertama kali dijalankan. Schema manual tersedia di [server/schema.sql](./server/schema.sql).

User dummy setelah `npm run db:reset`:

```text
Username: admin
Password: admin123
```

Login dan registrasi menggunakan API database; password user disimpan sebagai hash di tabel `users`.

Perintah `npm run db:seed` memindahkan data yang sebelumnya berada di file `src/data/*.js` ke MySQL. Perintah ini aman dijalankan ulang karena hanya mengisi tabel yang masih kosong.

## Simulasi data

- Edit data melalui halaman Zona, Jadwal, Notifikasi, atau Pengaturan; perubahan disimpan ke MySQL.
- Untuk mengubah data langsung, gunakan MySQL Workbench/phpMyAdmin pada database `irigasi_cerdas`.
- Data utama tidak lagi disimpan sebagai array dalam satu kolom. Riwayat, zona, sensor, jadwal, notifikasi, foto zona, dan histori kelembapan memiliki tabel/kolom relasional masing-masing.
- Untuk menghapus dan membuat ulang database beserta seluruh data awal, jalankan `npm run db:reset`.

Perintah `npm run api` menjalankan API saja di port `3001`. Frontend menggunakan endpoint `/api` melalui proxy Vite.

## Export dan restore SQL

Snapshot database tersedia di [database/irigasi_cerdas_export.sql](./database/irigasi_cerdas_export.sql).
Dump ini berisi struktur dan data aplikasi, tetapi tidak menyertakan baris tabel `users` agar hash password tidak ikut dipublikasikan. Saat API dijalankan, user admin akan dibuat otomatis jika tabel user masih kosong.

Export ulang dari XAMPP:

```powershell
New-Item -ItemType Directory -Force database
& 'C:\xampp\mysql\bin\mysqldump.exe' --host=127.0.0.1 --port=3306 --user=root --databases irigasi_cerdas --single-transaction --routines --events --triggers --ignore-table-data=irigasi_cerdas.users --result-file='database/irigasi_cerdas_export.sql'
```

Restore melalui phpMyAdmin atau terminal MySQL:

```powershell
& 'C:\xampp\mysql\bin\mysql.exe' --host=127.0.0.1 --port=3306 --user=root < database/irigasi_cerdas_export.sql
```
