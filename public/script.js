const API = '/api/books';
const $ = id => document.getElementById(id);
const grid = $('grid'), stack = $('stack'), kosong = $('kosong'), chips = $('chips');
const dlgForm = $('dlg-form'), dlgHapus = $('dlg-hapus');

let books = [], idHapus = null, genreAktif = 'Semua';

const GENRE = ['Fiksi', 'Fantasi', 'Romantis', 'Anak', 'Sains', 'Teknologi', 'Sejarah', 'Motivasi'];
const rupiah = n => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0
}).format(n);

const PALET = [
  { c1: '#FF8A4C', c2: '#FFD95A', fg: '#1D1B4C' },
  { c1: '#A8EBCB', c2: '#D9CCFF', fg: '#1D1B4C' },
  { c1: '#FFB6D5', c2: '#FF8A4C', fg: '#1D1B4C' },
  { c1: '#1D1B4C', c2: '#5B5990', fg: '#FFFFFF' },
  { c1: '#D9CCFF', c2: '#FFB6D5', fg: '#1D1B4C' },
  { c1: '#FFD95A', c2: '#A8EBCB', fg: '#1D1B4C' }
];

/* ---------- Ilustrasi lucu per genre (SVG) ---------- */
const S = 'stroke="#1D1B4C" stroke-width="2.5" stroke-linejoin="round"';
const face = (x, y, s = 1) => `
  <circle cx="${x - 8 * s}" cy="${y}" r="${2.4 * s}" fill="#1D1B4C"/>
  <circle cx="${x + 8 * s}" cy="${y}" r="${2.4 * s}" fill="#1D1B4C"/>
  <path d="M${x - 4 * s} ${y + 6 * s}q${4 * s} ${4 * s} ${8 * s} 0" stroke="#1D1B4C" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="${x - 14 * s}" cy="${y + 5 * s}" r="${3 * s}" fill="#FF8FB5" opacity=".75"/>
  <circle cx="${x + 14 * s}" cy="${y + 5 * s}" r="${3 * s}" fill="#FF8FB5" opacity=".75"/>`;

const ART = {
  Fiksi: `<path d="M24 40L30 14L47 30ZM76 40L70 14L53 30Z" fill="#fff" ${S}/><ellipse cx="50" cy="55" rx="28" ry="24" fill="#fff" ${S}/>${face(50, 54)}`,
  Sains: `<path d="M50 8C66 22 68 50 64 72H36C32 50 34 22 50 8Z" fill="#fff" ${S}/><path d="M36 58L22 76L38 72ZM64 58L78 76L62 72Z" fill="#FF8A4C" ${S}/><path d="M42 72L50 92L58 72Z" fill="#FFD95A" ${S}/>${face(50, 44, .75)}`,
  Anak: `<circle cx="27" cy="32" r="11" fill="#fff" ${S}/><circle cx="73" cy="32" r="11" fill="#fff" ${S}/><circle cx="50" cy="55" r="27" fill="#fff" ${S}/>${face(50, 52)}`,
  Motivasi: `<g ${S} stroke-linecap="round"><path d="M50 8v10M50 82v10M8 50h10M82 50h10M20 20l7 7M73 73l7 7M80 20l-7 7M27 73l-7 7"/></g><circle cx="50" cy="50" r="24" fill="#FFD95A" ${S}/>${face(50, 50)}`,
  Sejarah: `<path d="M50 12L90 84H10Z" fill="#fff" ${S}/>${face(50, 64, .9)}`,
  Teknologi: `<path d="M50 14V28" ${S} stroke-linecap="round"/><circle cx="50" cy="12" r="5" fill="#FF8A4C" ${S}/><rect x="22" y="28" width="56" height="48" rx="14" fill="#fff" ${S}/>${face(50, 52)}`,
  Romantis: `<path d="M50 84C8 56 16 20 38 26C45 28 50 35 50 35C50 35 55 28 62 26C84 20 92 56 50 84Z" fill="#FFB6D5" ${S}/>${face(50, 50)}`,
  Fantasi: `<circle cx="50" cy="54" r="30" fill="#FFD95A" ${S}/>${face(50, 54)}<path d="M82 12l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#fff" ${S}/>`
};

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function hash(str) {
  let h = 0;
  for (const ch of String(str)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function coverHTML(b) {
  const h = hash(b.judul);
  const p = PALET[h % PALET.length];
  return `
    <div class="cover pat${h % 4}" style="--c1:${p.c1};--c2:${p.c2};--fg:${p.fg}">
      <span class="cover-title">${esc(b.judul)}</span>
      <svg class="cover-art" viewBox="0 0 100 100" aria-hidden="true">${ART[b.genre] || ART.Fiksi}</svg>
      <span class="cover-author">${esc(b.penulis)}</span>
    </div>`;
}

function toast(pesan) {
  const t = $('toast');
  t.textContent = pesan;
  t.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ---------- GET ---------- */
async function muatData() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error();
    books = await res.json();
    render();
  } catch {
    toast('Server tidak merespons. Pastikan npm start sedang berjalan.');
  }
}

function renderChips() {
  const ada = ['Semua', ...GENRE.filter(g => books.some(b => b.genre === g))];
  if (!ada.includes(genreAktif)) genreAktif = 'Semua';
  chips.innerHTML = ada.map(g =>
    `<button type="button" class="gchip${g === genreAktif ? ' on' : ''}" data-g="${g}">${g}</button>`
  ).join('');
  chips.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => { genreAktif = btn.dataset.g; render(); };
  });
}

function render() {
  $('jumlah').textContent = books.length;
  renderChips();

  // Hero: tiga buku terbaru, atau sampul contoh bila rak kosong
  const contoh = [
    { judul: 'Buku pertamamu', penulis: 'Kamu', genre: 'Fiksi' },
    { judul: 'Cerita baru', penulis: 'Penulis favorit', genre: 'Fantasi' },
    { judul: 'Bacaan santai', penulis: 'Siapa saja', genre: 'Anak' }
  ];
  stack.innerHTML = (books.length ? [...books].reverse().slice(0, 3) : contoh)
    .map(coverHTML).join('');

  // Cari + filter genre + urutkan
  const q = $('cari').value.trim().toLowerCase();
  const daftar = books.filter(b =>
    (genreAktif === 'Semua' || b.genre === genreAktif) &&
    (b.judul.toLowerCase().includes(q) || b.penulis.toLowerCase().includes(q)));
  const urut = $('urut').value;
  if (urut === 'judul') daftar.sort((a, b) => a.judul.localeCompare(b.judul, 'id'));
  else if (urut === 'tahun') daftar.sort((a, b) => b.tahun - a.tahun);
  else daftar.sort((a, b) => b.id - a.id);

  grid.innerHTML = '';
  kosong.hidden = daftar.length > 0;
  if (!daftar.length) {
    const adaFilter = books.length && (q || genreAktif !== 'Semua');
    $('kosong-judul').textContent = adaFilter ? 'Buku tidak ditemukan' : 'Rakmu masih kosong';
    $('kosong-teks').textContent = adaFilter
      ? 'Coba kata kunci atau genre lain.'
      : 'Tambahkan buku pertamamu untuk mulai mengisi rak.';
  }

  daftar.forEach(b => {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      ${coverHTML(b)}
      <div class="info">
        <h3>${esc(b.judul)}</h3>
        <p>${esc(b.penulis)}</p>
        <p class="harga">${rupiah(b.harga || 0)}</p>
        <div class="meta">
          <span class="year">${b.tahun}</span>
          <div class="row-actions">
            <button class="chip edit" type="button">Edit</button>
            <button class="chip hapus" type="button">Hapus</button>
          </div>
        </div>
      </div>`;
    el.querySelector('.edit').onclick = () => bukaForm(b);
    el.querySelector('.hapus').onclick = () => bukaHapus(b);
    grid.appendChild(el);
  });
}

/* ---------- Form: POST / PUT ---------- */
$('genre').innerHTML = GENRE.map(g => `<option>${g}</option>`).join('');

function bukaForm(b) {
  $('form-buku').reset();
  $('id').value = b ? b.id : '';
  $('form-judul').textContent = b ? 'Edit buku' : 'Tambah buku';
  if (b) {
    $('judul').value = b.judul;
    $('penulis').value = b.penulis;
    $('tahun').value = b.tahun;
    $('genre').value = b.genre;
    $('harga').value = b.harga;
  }
  dlgForm.showModal();
  $('judul').focus();
}

$('form-buku').addEventListener('submit', async e => {
  e.preventDefault();
  const id = $('id').value;
  const body = {
    judul: $('judul').value.trim(),
    penulis: $('penulis').value.trim(),
    tahun: $('tahun').value,
    genre: $('genre').value,
    harga: $('harga').value
  };
  try {
    const res = await fetch(id ? `${API}/${id}` : API, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error();
    dlgForm.close();
    toast('Buku disimpan');
    muatData();
  } catch {
    toast('Buku belum tersimpan. Periksa isian dan koneksi server.');
  }
});

/* ---------- DELETE ---------- */
function bukaHapus(b) {
  idHapus = b.id;
  $('hapus-teks').textContent = `“${b.judul}” akan dihapus dari rakmu.`;
  dlgHapus.showModal();
}

$('hapus-ok').onclick = async () => {
  try {
    const res = await fetch(`${API}/${idHapus}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    dlgHapus.close();
    toast('Buku dihapus');
    muatData();
  } catch {
    toast('Buku belum terhapus. Coba lagi.');
  }
};

/* ---------- Event lain ---------- */
$('btn-tambah').onclick = () => bukaForm(null);
$('btn-tambah-2').onclick = () => bukaForm(null);
$('btn-batal').onclick = () => dlgForm.close();
$('hapus-batal').onclick = () => dlgHapus.close();
$('cari').addEventListener('input', render);
$('urut').addEventListener('change', render);

muatData();