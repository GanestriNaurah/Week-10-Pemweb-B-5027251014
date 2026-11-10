require('dotenv').config();
const express = require('express');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET: tampilkan seluruh data
app.get('/api/books', async (req, res) => {
  try {
    const books = await prisma.book.findMany({ orderBy: { id: 'asc' } });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
});

// POST: tambah data
app.post('/api/books', async (req, res) => {
  const { judul, penulis, tahun, genre, harga } = req.body;
  if (!judul || !penulis || !tahun) {
    return res.status(400).json({ message: 'Judul, penulis, dan tahun wajib diisi' });
  }
  try {
    const baru = await prisma.book.create({
      data: {
        judul,
        penulis,
        tahun: Number(tahun),
        genre: genre || 'Fiksi',
        harga: Number(harga) || 0
      }
    });
    res.status(201).json(baru);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambah data' });
  }
});

// PUT: ubah data
app.put('/api/books/:id', async (req, res) => {
  const { judul, penulis, tahun, genre, harga } = req.body;
  try {
    const ubah = await prisma.book.update({
      where: { id: Number(req.params.id) },
      data: {
        judul,
        penulis,
        tahun: Number(tahun),
        genre: genre || 'Fiksi',
        harga: Number(harga) || 0
      }
    });
    res.json(ubah);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Data tidak ditemukan' });
    console.error(err);
    res.status(500).json({ message: 'Gagal mengubah data' });
  }
});

// DELETE: hapus data
app.delete('/api/books/:id', async (req, res) => {
  try {
    await prisma.book.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Data tidak ditemukan' });
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus data' });
  }
});

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));