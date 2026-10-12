// Data & konstanta Kawan Tutor (ganti dengan database/API bila memakai backend)
const TODAY = new Date().toISOString().slice(0, 10);
const SUBJ = [
  'Matematika',
  'Fisika',
  'Kimia',
  'Biologi',
  'Bahasa Inggris',
  'Pemrograman',
  'Akuntansi',
];
const SLOTS = ['08:00', '10:00', '13:00', '15:00', '19:00'];
// Data awal (disimpan di localStorage dengan kunci 'kt1' setelah ada perubahan)
// role: admin | mentor | pengunjung. Status sesi: menunggu | diterima | selesai | ditolak | dibatalkan
let D = {
  users: [
    { id: 1, name: 'Admin Kawan', role: 'admin' },
    {
      id: 2,
      name: 'Rina Maharani',
      role: 'mentor',
      subj: ['Matematika', 'Fisika'],
      price: 60000,
      rate: 4.9,
      bio: 'Lulusan Teknik ITB, 5 tahun mengajar SMA & UTBK.',
      ok: true,
      on: true,
    },
    {
      id: 3,
      name: 'Dimas Prakoso',
      role: 'mentor',
      subj: ['Pemrograman'],
      price: 90000,
      rate: 4.8,
      bio: 'Software engineer, sabar mengajar dari nol.',
      ok: true,
      on: true,
    },
    {
      id: 4,
      name: 'Sari Wulandari',
      role: 'mentor',
      subj: ['Bahasa Inggris'],
      price: 55000,
      rate: 4.7,
      bio: 'IELTS 8.0, fokus speaking dan writing.',
      ok: true,
      on: true,
    },
    {
      id: 5,
      name: 'Budi Santoso',
      role: 'mentor',
      subj: ['Kimia', 'Biologi'],
      price: 50000,
      rate: 4.6,
      bio: 'Mahasiswa Kedokteran, jago olimpiade sains.',
      ok: true,
      on: false,
    },
    {
      id: 6,
      name: 'Lia Anggraini',
      role: 'mentor',
      subj: ['Akuntansi'],
      price: 70000,
      rate: 0,
      bio: 'Akuntan publik, menunggu verifikasi.',
      ok: false,
      on: true,
    },
    { id: 7, name: 'Andi Pengunjung', role: 'pengunjung' },
  ],
  bk: [
    {
      id: 1,
      m: 2,
      u: 7,
      subj: 'Matematika',
      date: '2026-10-14',
      t: '10:00',
      note: 'Latihan integral',
      st: 'menunggu',
    },
  ],
  nid: 10,
};
// Ulasan contoh di beranda (m = id mentor)
const REV = [
  {
    n: 'Nadia, Mahasiswa Teknik',
    m: 2,
    t: 'Dijelasin pelan-pelan sampai paham integral. Nilai kalkulus naik dari C ke A.',
  },
  {
    n: 'Fajar, Mahasiswa Manajemen',
    m: 3,
    t: 'Belajar Python dari nol, sekarang sudah bisa bikin proyek akhir sendiri.',
  },
  {
    n: 'Mega, Calon Mahasiswa',
    m: 4,
    t: 'Skor speaking IELTS saya naik dua band dalam sebulan latihan.',
  },
];

// Kode voucher yang berlaku (pct = persen diskon dari tarif per jam)
const VOUCHERS = {
  KAWAN50: { pct: 50, label: 'Diskon 50% sesi pertama' },
  HEMAT4: { pct: 20, label: 'Hemat 20% paket 4 sesi' },
  GRATIS15: { pct: 100, label: 'Gratis konsultasi 15 menit' },
};