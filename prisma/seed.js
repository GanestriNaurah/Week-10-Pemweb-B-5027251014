require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const buku = [
  ['Laskar Pelangi', 'Andrea Hirata', 2005, 'Fiksi', 89000],
  ['Laut Bercerita', 'Leila S. Chudori', 2017, 'Fiksi', 99000],
  ['Bumi Manusia', 'Pramoedya Ananta Toer', 1980, 'Sejarah', 110000],
  ['Sapiens', 'Yuval Noah Harari', 2011, 'Sejarah', 135000],
  ['Filosofi Teras', 'Henry Manampiring', 2018, 'Motivasi', 98000],
  ['Atomic Habits', 'James Clear', 2018, 'Motivasi', 108000],
  ['Cosmos', 'Carl Sagan', 1980, 'Sains', 120000],
  ['Harry Potter dan Batu Bertuah', 'J.K. Rowling', 1997, 'Fantasi', 95000],
  ['Bintang', 'Tere Liye', 2017, 'Fantasi', 94000],
  ['Pangeran Kecil', 'Antoine de Saint-Exupéry', 1943, 'Anak', 65000],
  ['Dilan 1990', 'Pidi Baiq', 2014, 'Romantis', 79000],
  ['Clean Code', 'Robert C. Martin', 2008, 'Teknologi', 450000]
];

(async () => {
  const jumlah = await prisma.book.count();
  if (jumlah > 0) {
    console.log(`Tabel sudah berisi ${jumlah} buku, seed dilewati.`);
  } else {
    await prisma.book.createMany({
      data: buku.map(([judul, penulis, tahun, genre, harga]) => ({ judul, penulis, tahun, genre, harga }))
    });
    console.log('Seed selesai:', buku.length, 'buku');
  }
  await prisma.$disconnect();
})();