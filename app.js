// ===== State aplikasi =====
// me = akun yang sedang masuk, view = halaman aktif (home | cat | dash)
let S = { me: null, q: '', f: '', tab: 'login', voucher: null };
try {
  const x = localStorage.getItem('kt1');
  if (x) D = JSON.parse(x);
} catch (e) {}
// ===== Penyimpanan & helper =====
const save = () => {
  try {
    localStorage.setItem('kt1', JSON.stringify(D));
  } catch (e) {}
};
const $ = (s) => document.querySelector(s);
const U = (id) => D.users.find((u) => u.id == id);
const rp = (n) => 'Rp' + n.toLocaleString('id-ID');
const ini = (n) =>
  n
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
const av = (u) => /* HTML */ `
  <div class="av">${ini(u.name)}</div>
`;
// ===== UI umum: toast, modal, header, navigasi =====
function toast(t) {
  const e = document.createElement('div');
  e.className = 'toast';
  e.textContent = t;
  document.body.append(e);
  setTimeout(() => e.remove(), 2200);
}
function close() {
  $('#ov').innerHTML = '';
}
function modal(h) {
  $('#ov').innerHTML = /* HTML */ `
    <div class="modal" onclick="if(event.target===this)close()"><div class="box">${h}</div></div>
  `;
}
function head() {
  const m = S.me;
  const nav = (v, t, f) =>
    `<button class="nav ${S.view == v ? 'on' : ''}" onclick="${f}">${t}</button>`;
  const right = m
    ? `<span class="who"><b>${m.name}</b><span class="tag">${m.role}</span></span>
       <button class="btn ghost sm" onclick="dash()">Dashboard</button>
       <button class="btn sm" onclick="out()">Keluar</button>`
    : `<button class="btn ghost sm" onclick="auth('login')">Masuk</button>
       <button class="btn sm" onclick="auth('daftar')">Daftar</button>`;
  $('#hd').innerHTML = /* HTML */ `
    <div class="hd-in">
      <div class="logo" onclick="go()">
        <i>K</i>
        Kawan Tutor
      </div>
      <nav>${nav('home', 'Beranda', 'go()')}${nav('cat', 'Cari tutor', 'cat()')}</nav>
      <div class="hd-r">${right}</div>
    </div>
  `;
}
function go() {
  S.view = 'home';
  render();
}
function dash() {
  S.view = 'dash';
  render();
}
function out() {
  S.me = null;
  go();
  toast('Kamu sudah keluar');
}
function render() {
  head();
  S.view == 'dash' && S.me ? dashboard() : S.view == 'cat' ? catalog() : home();
}
// ===== Halaman publik: Beranda (promo, rating, ulasan) & Cari tutor =====
function applyVoucher(kode) {
  const c = String(kode || '')
    .trim()
    .toUpperCase();
  if (!c) return toast('Masukkan kode voucher dulu');
  if (!VOUCHERS[c]) return toast('Kode voucher tidak valid');
  S.voucher = c;
  render();
  toast('Voucher ' + c + ' aktif: ' + VOUCHERS[c].label);
}
function removeVoucher() {
  S.voucher = null;
  render();
  toast('Voucher dihapus');
}
function claim(c) {
  S.voucher = c;
  cat();
  toast('Voucher ' + c + ' aktif. Pilih tutormu.');
}
// Harga per jam setelah diskon voucher (kalau ada)
const harga = (m) => Math.round(m.price * (1 - (VOUCHERS[S.voucher]?.pct || 0) / 100));
const hargaHtml = (m) =>
  S.voucher ? `<s class="mut">${rp(m.price)}</s> ${rp(harga(m))}` : rp(m.price);
function cat() {
  S.view = 'cat';
  render();
  scrollTo(0, 0);
}
// Kartu mentor (dipakai di beranda & halaman Cari tutor)
const mentorCard = (m) => /* HTML */ `
  <div class="card mc">
    <div class="row">
      ${av(m)}
      <div class="grow">
        <b>${m.name}</b>
        <div class="mut">
          <span class="star">★</span>
          ${m.rate || 'Baru'} · ${m.on ? 'Tersedia' : 'Sedang penuh'}
        </div>
      </div>
    </div>
    <p class="mut">${m.bio}</p>
    <div>${m.subj.map((x) => `<span class="tag">${x}</span>`).join('')}</div>
    <div class="row sp mc-f">
      <b>
        ${hargaHtml(m)}
        <span class="mut">/jam</span>
      </b>
      <button class="btn sm" onclick="book(${m.id})">Pesan sesi</button>
    </div>
  </div>
`;
const voucherNote = () =>
  S.voucher
    ? `<p class="vact">Voucher aktif: <b>${S.voucher}</b> (${VOUCHERS[S.voucher].label})
        <button class="btn ghost sm" onclick="removeVoucher()">Hapus</button></p>`
    : '';
function home() {
  const mt = D.users.filter((u) => u.role == 'mentor' && u.ok && u.rate > 0);
  const top = [...mt].sort((a, b) => b.rate - a.rate).slice(0, 3);
  const avg = (mt.reduce((s, u) => s + u.rate, 0) / mt.length).toFixed(1);
  $('#app').innerHTML = /* HTML */ `
    <section class="sec">
      <div class="wrap">
        <div class="promo">
          <div>
            <span class="pill">Promo terbatas</span>
            <h1>Diskon 50% untuk sesi pertamamu</h1>
            <p>
              Belajar bareng tutor terverifikasi untuk mata kuliah apa pun, dengan harga lebih
              ringan.
            </p>
            <div class="row" style="flex-wrap:wrap">
              <button class="btn lg" onclick="claim('KAWAN50')">Klaim diskon</button>
              <span class="code">
                Kode:
                <b>KAWAN50</b>
              </span>
            </div>
          </div>
          <div class="promo-v" aria-hidden="true">
            <span class="orb o1"></span>
            <span class="orb o2"></span>
            <div class="big50">
              50
              <small>%</small>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="sec white">
      <div class="wrap about">
        <div>
          <h2>Apa itu Kawan Tutor?</h2>
          <p>
            Kawan Tutor adalah platform belajar privat online yang menghubungkan mahasiswa dan
            pelajar dengan tutor terverifikasi. Pilih mata kuliah yang kamu butuhkan, atur jadwal
            sesuai waktumu, lalu belajar bareng tutor yang sabar dan berpengalaman.
          </p>
        </div>
        <ol class="steps">
          <li>
            <span class="num">1</span>
            <div>
              <b>Pilih tutor</b>
              <span class="mut">Cari berdasarkan mata kuliah, rating, dan tarif.</span>
            </div>
          </li>
          <li>
            <span class="num">2</span>
            <div>
              <b>Pesan jadwal</b>
              <span class="mut">Tentukan tanggal dan jam, lalu tunggu konfirmasi mentor.</span>
            </div>
          </li>
          <li>
            <span class="num">3</span>
            <div>
              <b>Belajar bareng</b>
              <span class="mut">Mulai sesi, lalu beri nilai setelah selesai.</span>
            </div>
          </li>
        </ol>
      </div>
    </section>
    <section class="sec alt">
      <div class="wrap">
        <div class="proof">
          <div>
            <b>${avg}</b>
            <span class="mut">Rata-rata rating</span>
          </div>
          <div>
            <b>${mt.length}</b>
            <span class="mut">Mentor terverifikasi</span>
          </div>
          <div>
            <b>${SUBJ.length}</b>
            <span class="mut">Mata kuliah</span>
          </div>
        </div>
        <h2>Mentor dengan rating tertinggi</h2>
        <p class="sub">Dipilih berdasarkan penilaian mahasiswa yang sudah belajar.</p>
        <div class="grid">${top.map(mentorCard).join('')}</div>
        <p class="center" style="margin:26px 0 0">
          <button class="btn ghost" onclick="cat()">Lihat semua tutor</button>
        </p>
      </div>
    </section>
    <section class="sec white">
      <div class="wrap">
        <h2>Kata mereka yang sudah belajar</h2>
        <p class="sub">Cerita nyata dari mahasiswa Kawan Tutor.</p>
        <div class="grid">
          ${REV.map(
            (r) => /* HTML */ `
              <div class="card rev">
                <span class="star" role="img" aria-label="Rating 5 dari 5">★★★★★</span>
                <p>“${r.t}”</p>
                <div class="row">
                  <div class="av sm">${ini(r.n)}</div>
                  <div>
                    <b>${r.n}</b>
                    <div class="mut">Belajar bareng ${U(r.m).name}</div>
                  </div>
                </div>
              </div>
            `,
          ).join('')}
        </div>
      </div>
    </section>
    <section class="sec alt">
      <div class="wrap">
        <div class="voucher">
          <div>
            <h2>Punya kode voucher?</h2>
            <p class="mut">
              Masukkan kodenya di sini. Diskon langsung berlaku saat kamu memesan tutor.
            </p>
          </div>
          <div class="vform">
            <input
              id="vc"
              placeholder="Contoh: KAWAN50"
              aria-label="Kode voucher"
              maxlength="20"
              value="${S.voucher || ''}"
              onkeydown="if(event.key==='Enter')applyVoucher(this.value)"
            />
            <button class="btn" onclick="applyVoucher($('#vc').value)">Pakai kode</button>
          </div>
          ${voucherNote()}
        </div>
      </div>
    </section>
    <footer>© Kawan Tutor · Belajar jadi lebih mudah bareng kawan sendiri</footer>
  `;
}
function catalog() {
  const ms = D.users.filter(
    (u) =>
      u.role == 'mentor' &&
      u.ok &&
      (!S.f || u.subj.includes(S.f)) &&
      (!S.q || (u.name + u.subj.join()).toLowerCase().includes(S.q.toLowerCase())),
  );
  $('#app').innerHTML = /* HTML */ `
    <div class="head-sec">
      <div class="wrap">
        <h1>Cari tutor</h1>
        <p class="mut" style="margin:0">
          Pilih mata kuliah, lalu temukan tutor terverifikasi yang cocok untukmu.
        </p>
        <div class="fbar">
          <input
            id="q"
            placeholder="Cari nama tutor atau mata kuliah"
            value="${S.q}"
            aria-label="Cari tutor"
          />
          <button class="btn" onclick="S.q=$('#q').value;catalog()">Cari</button>
        </div>
        <div class="chips">
          <button class="chip ${!S.f ? 'on' : ''}" onclick="S.f='';catalog()">Semua</button>
          ${SUBJ.map((x) => `<button class="chip ${S.f == x ? 'on' : ''}" onclick="S.f='${x}';catalog()">${x}</button>`).join('')}
        </div>
        ${voucherNote()}
      </div>
    </div>
    <div class="wrap pg">
      <div class="grid">
        ${ms.map(mentorCard).join('') || '<div class="empty">Belum ada tutor yang cocok. Coba kata kunci lain.</div>'}
      </div>
    </div>
  `;
  const q = $('#q');
  q.onkeydown = (e) => {
    if (e.key == 'Enter') {
      S.q = q.value;
      catalog();
    }
  };
}
// ===== Autentikasi: masuk & daftar =====
function auth(t) {
  S.tab = t;
  modal(
    /* HTML */ `<div class="tabs"><button class="${t == 'login' ? 'on' : ''}" onclick="auth('login')">Masuk</button><button class="${t == 'daftar' ? 'on' : ''}" onclick="auth('daftar')">Daftar</button></div>` +
      (t == 'login'
        ? /* HTML */ `
            <p class="mut">Ini versi demo. Pilih akun contoh untuk masuk.</p>
            ${[1, 2, 7]
              .map(
                (i) => /* HTML */ `
                  <button
                    class="btn ghost"
                    style="width:100%;margin-bottom:8px;text-align:left"
                    onclick="login(${i})"
                  >
                    ${U(i).name} — ${U(i).role}
                  </button>
                `,
              )
              .join('')}
          `
        : /* HTML */ `
            <label>Nama lengkap</label>
            <input id="rn" />
            <label>Daftar sebagai</label>
            <select id="rr">
              <option value="pengunjung">Pengunjung (cari tutor)</option>
              <option value="mentor">Mentor (jadi tutor)</option>
            </select>
            <label>Mata pelajaran (khusus mentor)</label>
            <select id="rs">
              ${SUBJ.map(
                (s) => /* HTML */ `
                  <option>${s}</option>
                `,
              ).join('')}
            </select>
            <button class="btn" style="width:100%;margin-top:16px" onclick="reg()">
              Buat akun
            </button>
          `),
  );
}
function login(i) {
  S.me = U(i);
  close();
  S.view = S.me.role == 'pengunjung' ? 'home' : 'dash';
  render();
  toast('Selamat datang, ' + S.me.name);
}
function reg() {
  const n = $('#rn').value.trim(),
    r = $('#rr').value;
  if (!n) return toast('Isi nama lengkap dulu');
  const u = { id: D.nid++, name: n, role: r };
  if (r == 'mentor')
    Object.assign(u, {
      subj: [$('#rs').value],
      price: 50000,
      rate: 0,
      bio: 'Mentor baru di Kawan Tutor.',
      ok: false,
      on: true,
    });
  D.users.push(u);
  save();
  login(u.id);
  if (r == 'mentor') toast('Akun dibuat. Tunggu verifikasi admin.');
}
// ===== Pemesanan sesi =====
function book(id) {
  if (!S.me) return auth('login');
  if (S.me.role != 'pengunjung') return toast('Hanya pengunjung yang bisa memesan sesi');
  const m = U(id);
  if (!m.on) return toast('Tutor ini sedang penuh');
  modal(/* HTML */ `
    <div class="row">
      ${av(m)}
      <div>
        <b>${m.name}</b>
        <div class="mut">${hargaHtml(m)}/jam</div>
      </div>
    </div>
    <label>Mata pelajaran</label>
    <select id="bs">
      ${m.subj
        .map(
          (s) => /* HTML */ `
            <option>${s}</option>
          `,
        )
        .join('')}
    </select>
    <label>Tanggal</label>
    <input id="bd" type="date" min="${TODAY}" value="${TODAY}" />
    <label>Jam</label>
    <select id="bt">
      ${SLOTS.map(
        (s) => /* HTML */ `
          <option>${s}</option>
        `,
      ).join('')}
    </select>
    <label>Materi yang ingin dipelajari</label>
    <textarea id="bn" rows="2"></textarea>
    <div class="row" style="margin-top:16px">
      <button class="btn ghost" onclick="close()">Batal</button>
      <button class="btn" style="flex:1" onclick="sendBk(${id})">Kirim permintaan</button>
    </div>
  `);
}
function sendBk(m) {
  if (!$('#bd').value) return toast('Pilih tanggal dulu');
  D.bk.push({
    id: D.nid++,
    m,
    v: S.voucher,
    u: S.me.id,
    subj: $('#bs').value,
    date: $('#bd').value,
    t: $('#bt').value,
    note: $('#bn').value,
    st: 'menunggu',
  });
  save();
  close();
  toast('Permintaan terkirim' + (S.voucher ? ' dengan voucher ' + S.voucher : ''));
  S.voucher = null;
  dash();
}
function setBk(id, st) {
  D.bk.find((b) => b.id == id).st = st;
  save();
  dashboard();
  toast('Status: ' + st);
}
// Beri label kolom pada tiap sel tabel (dipakai CSS agar tabel tampil sebagai kartu di HP)
function labelTables() {
  document.querySelectorAll('.tbl').forEach((t) => {
    const heads = [...t.querySelectorAll('th')].map((h) => h.textContent.trim());
    t.querySelectorAll('tr').forEach((r) =>
      [...r.children].forEach((c, i) => {
        if (c.tagName == 'TD') c.dataset.label = heads[i] || '';
      }),
    );
  });
}
// ===== Dashboard: pengunjung, mentor, admin =====
const bd = (s) => /* HTML */ `
  <span
    class="badge ${s == 'menunggu' ? 'b-wait' : s == 'diterima' || s == 'selesai' ? 'b-ok' : 'b-bad'}"
  >
    ${s}
  </span>
`;
function dashboard() {
  const m = S.me;
  let h = /* HTML */ `
    <h2 style="margin-top:0">Dashboard ${m.role}</h2>
  `;
  if (m.role == 'pengunjung') {
    const l = D.bk.filter((b) => b.u == m.id);
    h += /* HTML */ `
      <div class="card">
        <b>Sesi belajarmu</b>
        ${
          l.length
            ? /* HTML */ `
                <div class="scroll">
                  <table class="tbl">
                    <tr>
                      <th>Tutor</th>
                      <th>Mapel</th>
                      <th>Jadwal</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                    ${l
                      .map(
                        (b) => /* HTML */ `
                          <tr>
                            <td>${U(b.m).name}</td>
                            <td>${b.subj}</td>
                            <td>${b.date} ${b.t}</td>
                            <td>${bd(b.st)}</td>
                            <td>
                              ${
                                b.st == 'menunggu'
                                  ? /* HTML */ `
                                      <button
                                        class="btn bad sm"
                                        onclick="setBk(${b.id},'dibatalkan')"
                                      >
                                        Batalkan
                                      </button>
                                    `
                                  : ''
                              }
                            </td>
                          </tr>
                        `,
                      )
                      .join('')}
                  </table>
                </div>
              `
            : '<div class="empty">Belum ada sesi. Cari tutor di beranda untuk mulai.</div>'
        }
      </div>
      <p><button class="btn" onclick="go()">Cari tutor</button></p>
    `;
  }
  if (m.role == 'mentor') {
    const l = D.bk.filter((b) => b.m == m.id);
    h += /* HTML */ `
      <div class="card row sp">
        <div>
          <b>${m.ok ? 'Akun terverifikasi' : 'Menunggu verifikasi admin'}</b>
          <div class="mut">
            ${m.ok ? 'Profilmu tampil di beranda.' : 'Profilmu belum tampil di beranda.'}
          </div>
        </div>
        <button class="btn ghost" onclick="U(${m.id}).on=!U(${m.id}).on;save();dashboard()">
          ${m.on ? 'Tandai penuh' : 'Buka jadwal'}
        </button>
      </div>
      <h2>Permintaan sesi</h2>
      <div class="card">
        ${
          l.length
            ? /* HTML */ `
                <div class="scroll">
                  <table class="tbl">
                    <tr>
                      <th>Siswa</th>
                      <th>Mapel</th>
                      <th>Jadwal</th>
                      <th>Catatan</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                    ${l
                      .map(
                        (b) => /* HTML */ `
                          <tr>
                            <td>${U(b.u).name}</td>
                            <td>${b.subj}</td>
                            <td>${b.date} ${b.t}</td>
                            <td>${b.note || '-'}</td>
                            <td>${bd(b.st)}</td>
                            <td>
                              ${
                                b.st == 'menunggu'
                                  ? /* HTML */ `
                                      <button class="btn ok sm" onclick="setBk(${b.id},'diterima')">
                                        Terima
                                      </button>
                                      <button class="btn bad sm" onclick="setBk(${b.id},'ditolak')">
                                        Tolak
                                      </button>
                                    `
                                  : b.st == 'diterima'
                                    ? /* HTML */ `
                                        <button class="btn sm" onclick="setBk(${b.id},'selesai')">
                                          Selesai
                                        </button>
                                      `
                                    : ''
                              }
                            </td>
                          </tr>
                        `,
                      )
                      .join('')}
                  </table>
                </div>
              `
            : '<div class="empty">Belum ada permintaan masuk.</div>'
        }
      </div>
    `;
  }
  if (m.role == 'admin') {
    const mt = D.users.filter((u) => u.role == 'mentor');
    h += /* HTML */ `
      <div class="stats">
        ${[
          ['Mentor', mt.length],
          ['Pengunjung', D.users.filter((u) => u.role == 'pengunjung').length],
          ['Total sesi', D.bk.length],
          ['Menunggu verifikasi', mt.filter((u) => !u.ok).length],
        ]
          .map(
            (s) => /* HTML */ `
              <div class="card stat">
                <b>${s[1]}</b>
                <span class="mut">${s[0]}</span>
              </div>
            `,
          )
          .join('')}
      </div>
      <h2>Kelola mentor</h2>
      <div class="card scroll">
        <table class="tbl">
          <tr>
            <th>Nama</th>
            <th>Mapel</th>
            <th>Status</th>
            <th></th>
          </tr>
          ${mt
            .map(
              (u) => /* HTML */ `
                <tr>
                  <td>${u.name}</td>
                  <td>${u.subj.join(', ')}</td>
                  <td>
                    ${u.ok ? '<span class="badge b-ok">terverifikasi</span>' : '<span class="badge b-wait">menunggu</span>'}
                  </td>
                  <td>
                    <button
                      class="btn ${u.ok ? 'bad' : 'ok'} sm"
                      onclick="U(${u.id}).ok=!U(${u.id}).ok;save();dashboard()"
                    >
                      ${u.ok ? 'Cabut' : 'Verifikasi'}
                    </button>
                  </td>
                </tr>
              `,
            )
            .join('')}
        </table>
      </div>
      <h2>Semua pengguna</h2>
      <div class="card scroll">
        <table class="tbl">
          <tr>
            <th>Nama</th>
            <th>Peran</th>
            <th></th>
          </tr>
          ${D.users
            .filter((u) => u.role != 'admin')
            .map(
              (u) => /* HTML */ `
                <tr>
                  <td>${u.name}</td>
                  <td>${u.role}</td>
                  <td><button class="btn bad sm" onclick="delU(${u.id})">Hapus</button></td>
                </tr>
              `,
            )
            .join('')}
        </table>
      </div>
      <h2>Semua sesi</h2>
      <div class="card scroll">
        <table class="tbl">
          <tr>
            <th>Siswa</th>
            <th>Tutor</th>
            <th>Jadwal</th>
            <th>Status</th>
          </tr>
          ${D.bk
            .map(
              (b) => /* HTML */ `
                <tr>
                  <td>${U(b.u)?.name || '-'}</td>
                  <td>${U(b.m)?.name || '-'}</td>
                  <td>${b.date} ${b.t}</td>
                  <td>${bd(b.st)}</td>
                </tr>
              `,
            )
            .join('')}
        </table>
      </div>
    `;
  }
  $('#app').innerHTML = `<div class="wrap pg">${h}</div>`;
  labelTables();
}
function delU(id) {
  if (!confirm('Hapus pengguna ini?')) return;
  D.users = D.users.filter((u) => u.id != id);
  D.bk = D.bk.filter((b) => b.u != id && b.m != id);
  save();
  dashboard();
}
// ===== Jalankan aplikasi =====
S.view = 'home';
render();