# Lembar – Toko Buku

## Endpoint API

| Method | Endpoint | Fungsi | Kode Prisma |
|---|---|---|---|
| GET | `/api/books` | Menampilkan seluruh data buku | `findMany()` |
| POST | `/api/books` | Menambah buku baru | `create()` |
| PUT | `/api/books/:id` | Mengubah data buku | `update()` |
| DELETE | `/api/books/:id` | Menghapus buku | `delete()` |

---

## 1. GET: Menampilkan Data

Saat halaman dibuka, front-end memanggil `GET /api/books`. Server mengambil semua baris dari tabel `Book` di Neon lewat Prisma, lalu menampilkannya sebagai kartu buku.

**Tampilan web**

<img width="2880" height="1636" alt="Screenshot 2026-11-10 204901" src="https://github.com/user-attachments/assets/435ad502-75fb-437f-adff-29c7a43132a0" />


**Isi tabel Book di Neon (12 data awal)**

<img width="2880" height="1506" alt="Screenshot 2026-11-10 211922" src="https://github.com/user-attachments/assets/e2260f8a-02da-4abc-b41a-c61e33962444" />


---

## 2. POST: Menambah Data

Tombol **Tambah buku** membuka form. Setelah disimpan, front-end mengirim `POST /api/books` berisi judul, penulis, tahun, genre, dan harga. Server menyimpannya ke database dengan `prisma.book.create()`.

**Database sebelum (12 data)**

<img width="2880" height="1506" alt="Screenshot 2026-11-10 211922" src="https://github.com/user-attachments/assets/306e73b9-5999-40c7-9b2c-1ea2d468886d" />


**Form tambah buku**

<img width="2878" height="1620" alt="Screenshot 2026-11-10 204940" src="https://github.com/user-attachments/assets/7a36dfa1-54f9-4a11-adf0-5858b8f6959a" />


**Tampilan web sesudah**

<img width="2880" height="1526" alt="Screenshot 2026-11-10 204951" src="https://github.com/user-attachments/assets/8dc56c26-9e03-471f-80b5-ebf2c4d96f56" />


**Database sesudah (13 data, buku baru "Lentera Senja" muncul)**

<img width="2880" height="1544" alt="Screenshot 2026-11-10 211848" src="https://github.com/user-attachments/assets/ed9b81ee-7ad0-4279-8811-36456363d6ec" />


---

## 3. PUT: Mengubah Data

Tombol **Edit** membuka form yang sudah terisi data buku. Setelah disimpan, front-end mengirim `PUT /api/books/:id`. Server memperbarui baris yang sesuai dengan `prisma.book.update()`.

Contoh: buku "Lentera Senja" diubah dari tahun 2024 dan genre Fiksi menjadi tahun 2025 dan genre Romantis.

**Database sebelum**

<img width="2880" height="1544" alt="Screenshot 2026-11-10 211848" src="https://github.com/user-attachments/assets/ced79f2f-1e30-4d97-ab31-c5cd2578bd0d" />


**Form edit buku**

<img width="2876" height="1534" alt="Screenshot 2026-11-10 211728" src="https://github.com/user-attachments/assets/55c3d0db-48a3-444a-b07a-124ac40040de" />


**Database sesudah**

<img width="2880" height="1528" alt="Screenshot 2026-11-10 211751" src="https://github.com/user-attachments/assets/05da55d4-0b4c-40f1-b0fc-0d69f85212d9" />


---

## 4. DELETE: Menghapus Data

Tombol **Hapus** menampilkan dialog konfirmasi. Jika dikonfirmasi, front-end mengirim `DELETE /api/books/:id`. Server menghapus baris tersebut dengan `prisma.book.delete()`.

**Database sebelum (13 data)**

<img width="2880" height="1528" alt="Screenshot 2026-11-10 211751" src="https://github.com/user-attachments/assets/3571defd-3f64-45a9-be38-d82d32a87601" />


**Dialog konfirmasi**

<img width="2878" height="1554" alt="Screenshot 2026-11-10 211901" src="https://github.com/user-attachments/assets/120368b1-b641-45aa-8933-4c3b153fe0ee" />


**Tampilan web sesudah (muncul notifikasi "Buku dihapus")**

<img width="2880" height="1522" alt="Screenshot 2026-11-10 211910" src="https://github.com/user-attachments/assets/b59b6b22-f5f2-452a-a403-357995856110" />


**Database sesudah (kembali 12 data)**

<img width="2880" height="1506" alt="Screenshot 2026-11-10 211922" src="https://github.com/user-attachments/assets/557c5e2b-2a3c-449f-9f42-74488d6aa0a1" />
