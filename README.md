# Studika - Academic Companion Web App

Aplikasi web pendamping akademik cerdas untuk mahasiswa, dirancang untuk mendukung fokus belajar, pengelolaan jadwal & tugas, vault materi berkas (PDF & foto catatan papan tulis), serta interaksi dengan Tutor AI Akademik etis.

Implementasi antarmuka ini mengadopsi sistem desain **Warm Editorial Focus** dari **Google Stitch** (Project: *Academic Companion Web App*, ID: `17481662600757458564`).

---

## 🎨 Layar & Navigasi (5 Screens)

| # | Halaman | Route | Deskripsi |
|---|---|---|---|
| 1 | **Login Studika** | `/login` | Form autentikasi dengan deteksi domain institusi (`.ac.id`, `.edu`), indikator kekuatan kata sandi dinamis, opsi Remember Me, SSO Google Education, dan jaminan keamanan data ISO/IEC 27001. |
| 2 | **Beranda Dashboard** | `/beranda` / `/` | Sapaan personal ("Halo, Maya! ☀️"), progress bar target belajar harian terintegrasi checklist, aksi cepat (Tanya AI, Upload Catatan, Timer Fokus Pomodoro), rekomendasi sintesis AI, widget hitung mundur ujian (H-2 Fisika, H-5 Matematika), jadwal sesi hari ini, checklist tugas prioritas interaktif, dan kartu tips mindful. |
| 3 | **Materi & Vault Berkas** | `/materi` | Pusat vault materi dengan dropzone upload (drag & drop berkas PDF/foto catatan, progress bar 100%), filter koleksi (Semua, PDF Modul, Foto Catatan, Rangkuman AI, Rumus Praktis), pembaca dokumen, kartu identifikasi formula OCR AI, serta floating button scan kamera cepat. |
| 4 | **Tutor AI Akademik** | `/tutor-ai` | Antarmuka obrolan tutor 24/7 dengan inspirasi prompt siap pakai, thread percakapan dengan lampiran dokumen, respons terstruktur (poin ringkasan, tabel komparasi, rumus hafalan PMAT), aksi cepat (Buat Flashcard, Simpan ke Catatan, Tanya Lebih Dalam), input teks, lampiran berkas, perekam suara, dan notifikasi toast. |
| 5 | **Jadwal & Tugas** | `/jadwal` | Switcher tampilan (Jadwal Mingguan vs Tugas & Ulangan), kalender strip tanggal Oktober, kartu ulangan/ujian mendesak dengan hitung mundur jam:menit:detik, timeline jadwal kelas hari Senin lengkap dengan pengajar & ruang, checklist tugas mingguan dengan kotak pengumpulan draf/berkas, serta FAB tombol aksi cepat (+). |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan design tokens *Warm Editorial Focus*
- **Typography**: `Plus Jakarta Sans` (Display/Headlines/Body/Labels) & `JetBrains Mono` (Code/Timers) via `next/font/google`
- **Icons**: Google Material Symbols Outlined
- **Data Access Layer**: `src/lib/data/*` (mengekspos fungsi async yang siap dialihkan ke Supabase pada issue #2 tanpa merombak komponen UI)

---

## 📁 Struktur Direktori

```
d:/APK AKADEMIK/
├── design/
│   └── stitch/                # Aset ekspor Stitch (screenshot & code.html acuan)
│       ├── 01-login/
│       ├── 02-beranda/
│       ├── 03-materi-vault/
│       ├── 04-tutor-ai/
│       ├── 05-jadwal-tugas/
│       └── DESIGN.md
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Google Fonts & metadata)
│   │   ├── globals.css        # Tailwind v4 theme & typography tokens
│   │   ├── page.tsx           # Redirect ke /beranda
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx # Layar Login
│   │   │   └── error.tsx
│   │   └── (app)/
│   │       ├── layout.tsx     # AppShell (Header + BottomNav + Container)
│   │       ├── loading.tsx    # Skeleton loader
│   │       ├── error.tsx      # Error boundary
│   │       ├── beranda/page.tsx
│   │       ├── materi/page.tsx
│   │       ├── tutor-ai/page.tsx
│   │       └── jadwal/page.tsx
│   ├── components/
│   │   └── layout/
│   │       ├── AppHeader.tsx  # Header dengan logo Studika & avatar
│   │       ├── BottomNav.tsx  # Navigasi bawah 5 menu dengan highlight aktif
│   │       └── AppShell.tsx   # Wrapper responsif (mobile-first & centered desktop)
│   ├── lib/
│   │   ├── data/              # Data Access Layer (async data getters)
│   │   │   ├── chat.ts
│   │   │   ├── exams.ts
│   │   │   ├── files.ts
│   │   │   ├── profile.ts
│   │   │   ├── schedules.ts
│   │   │   └── tasks.ts
│   │   └── mock/              # Data tiruan sesuai mock Stitch
│   │       └── index.ts
│   └── types/                 # Definisi tipe domain TypeScript
│       └── index.ts
├── package.json
└── tsconfig.json
```

---

## 🚀 Panduan Menjalankan Proyek

### 1. Instalasi Dependensi
Pastikan [Node.js](https://nodejs.org/) (versi 20 atau 24 LTS) sudah terpasang di komputer Anda.

```bash
npm install
```

### 2. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000). Aplikasi akan otomatis mengarahkan ke `/beranda`. Anda juga dapat langsung mengakses `/login`, `/materi`, `/tutor-ai`, atau `/jadwal`.

### 3. Membangun untuk Produksi (Build)
```bash
npm run build
```

### 4. Memeriksa Kualitas Kode (Linting)
```bash
npm run lint
```
