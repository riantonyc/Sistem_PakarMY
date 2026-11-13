---
name: anti-slop-combat-sport-ui
description: Enforce high-craft, broadcast-grade Combat Sports / Muaythai UI engineering. Strictly eliminates generic AI UI slop and enforces IFMA standards tailored for Pengkot Muaythai Pontianak.
---

# Anti-Slop Combat Sport UI Engineering Rules
### Official Design System & UI Specification for SPK Muaythai Pengkot Pontianak

Dokumen skill ini menjadi acuan mutlak bagi seluruh agen AI dan pengembang front-end dalam merancang, menulis kode, dan mereview komponen antarmuka pada aplikasi **Sistem Penilaian dan Pendukung Keputusan (SPK) Pertandingan Muaythai Pengkot Pontianak** berbasis regulasi resmi **IFMA (International Federation of Muaythai Associations)**.

Skill ini dirancang untuk melenyapkan **AI UI Slop** (desain generik SaaS, gradien ungu, kartu terlalu membulat, bayangan kabur, dan teks placeholder tanpa konteks) dan menggantikannya dengan estetika **Broadcast-Grade Tactical Combat Sports UI**.

---

## 1. STRICT BANS (Anti-AI Slop Guardrails)

Setiap implementasi UI wajib mematuhi larangan keras berikut:

1. **NO Generic AI Gradients:**
   - DILARANG menggunakan gradien ungu-ke-sian (`from-indigo-500 to-cyan-400`), ambient neon mesh blobs, atau background pastel SaaS.
   - Kanvas wajib bernuansa *solid dark matte* terstruktur: `#090A0D` (Ring Mat Black) dan `#111318` (Carbon Corner).
2. **NO Over-Rounded SaaS Cards:**
   - DILARANG menggunakan `rounded-2xl` atau `rounded-3xl` pada panel data, kartu penilaian, tabel, atau kontainer skor.
   - Wajib menggunakan sudut tegas: `rounded-none`, `rounded-sm` (2px–4px), atau *tactical chamfered corners*.
3. **NO Drop-Shadow Soup:**
   - DILARANG menggunakan `shadow-lg`, `shadow-xl`, atau `shadow-2xl` untuk memisahkan lapisan konten.
   - Hirarki dan elevasi visual DIBENTUK melalui:
     - **1px hairline structural borders** (`border-[#262B36]`).
     - **Tingkatan luminansi permukaan** (`#090A0D` -> `#111318` -> `#191D24`).
     - **Tipografi kontras tinggi**.
4. **NO Placeholder Fluff:**
   - DILARANG menggunakan teks generik seperti "Welcome back to your dashboard", copy hero marketing, atau lencana hiasan tanpa fungsi.
   - Setiap elemen antarmuka wajib membawa informasi telemetri atletik, status pertandingan riil, atau kontrol operasional juri/operator yang fungsional.
5. **NO Default System Fonts:**
   - DILARANG membiarkan font default sistem atau generic sans-serif (`Inter`, `Arial`) menjadi display header.
   - Wajib memasangkan condensed athletic display font (`Barlow Condensed` / `Teko`) dengan tabular monospace font (`JetBrains Mono`) untuk seluruh angka, timer, poin, dan kelas berat.

---

## 2. Visual Direction: IFMA Broadcast & Tactical Ring Aesthetic

### 2.1 Surface Hierarchy (Dark Mode First)
Aplikasi didesain *Dark-Mode First* untuk mengoptimalkan keterbacaan di tepi ring (*ringside*) dalam kondisi pencahayaan arena yang kontras:

| Token Name | Hex Code | Peran & Penggunaan Utama |
| :--- | :--- | :--- |
| `--bg-canvas` | `#090A0D` | Base Canvas / Latar belakang utama aplikasi (*Deep Ring Black*) |
| `--bg-surface` | `#111318` | Latar belakang panel, scorecard, tabel, dan sidebar (*Carbon Corner*) |
| `--bg-elevated` | `#191D24` | Status hover, menu dropdown, kartu dialog, dan baris tabel aktif |
| `--border-grid` | `#262B36` | Garis pemisah struktural 1px (*Hairline Structural Grid*) |
| `--border-focus`| `#3F4756` | Garis penanda fokus aktif dan batas kartu terseleksi |
| `--text-primary`| `#F4F6F8` | Teks utama, nama atlet, dan angka skor (*High-Contrast White*) |
| `--text-muted`  | `#8A94A6` | Label metrik, keterangan ronde, dan metadata (*Steel Silver*) |

### 2.2 IFMA Corner Accents & Telemetry Colors
Selaras dengan identitas IFMA dan tradisi Muaythai internasional:

| Token Name | Hex Code | Makna & Penggunaan Wajib |
| :--- | :--- | :--- |
| `--accent-red` | `#E61E4D` | **Sudut Merah (Red Corner)**: HUD atlet merah (SELALU DI SISI KIRI), tombol aksi utama, indikator ronde LIVE, status bahaya/peringatan. |
| `--accent-blue` | `#008ED6` | **Sudut Biru (Blue Corner)**: HUD atlet biru (SELALU DI SISI KANAN), status aktif navigasi, telemetri sudut biru. |
| `--accent-gold` | `#F5A623` | **Championship Gold (Mongkhon Amber)**: Pemenang pertandingan, medali emas, ronde aktif, badge ranking, dan trofi kejuaraan. |
| `--accent-green`| `#009E52` | **Valid Strike / Go (Ring Emerald)**: Serangan sah terverifikasi, scorecard tersimpan (*submitted/locked*), sesi selesai. |

### 2.3 The 90/10 Color Discipline
- **90% Viewport:** Tetap berada pada spektrum netral gelap (`#090A0D` dan `#111318`) dengan tipografi `#F4F6F8`.
- **10% Accent:** Empat warna aksen IFMA (`#E61E4D`, `#008ED6`, `#F5A623`, `#009E52`) HANYA berfungsi sebagai sinyal telemetri berdaya kontras tinggi (indikator status, border aktif, badge, nilai skor, dan tombol aksi tegas). **DILARANG menjadikannya latar belakang blok penuh yang menyilaukan mata.**

---

## 3. Typography & Telemetry Rules

1. **Display & Headings (Athletic Condensed):**
   - Font: `Barlow Condensed` atau `Teko`.
   - Gaya: Uppercase, tight tracking (`tracking-tight` atau `-0.02em`), font-weight `700` atau `800`.
   - Contoh: `BOUT #04 — SENIOR MALE 63.5 KG`, `ROUND 2 OF 3`.
2. **Body & UI Controls (Clean Geometric):**
   - Font: `Plus Jakarta Sans` atau `DM Sans`.
   - Gaya: Regular/Medium (`400` / `500`), tracking normal, ukuran minimal 14px untuk label ringside.
3. **Scores, Timers, Stats & Weight Classes (Tabular Monospace):**
   - Font: `JetBrains Mono`.
   - Wajib menambahkan properti CSS: `font-variant-numeric: tabular-nums` (`font-mono tabular-nums`).
   - Mencegah angka "bergetar" (*layout shift*) saat countdown timer berjalan atau skor bertambah secara real-time.

---

## 4. Required Tech Stack (Anti-Slop Primitives)

Agen AI dilarang menulis primitif custom rapuh jika sudah didukung pustaka resmi:

- **Styling:** `tailwindcss` (v3.4+ / v4) dengan konfigurasi token IFMA di `tailwind.config.ts`.
- **Primitives:** `shadcn/ui` + `@radix-ui/react-*` yang dimodifikasi ke `rounded-sm` dan border `1px solid #262B36`.
- **Variant Engine:** `class-variance-authority` (CVA) + `clsx` + `tailwind-merge` untuk menangani varian Red/Blue/Neutral.
- **Data Tables:** `@tanstack/react-table` untuk roster atlet, klasemen, dan konsensus juri.
- **Charts & Radar:** `recharts` untuk visualisasi radar kriteria AHP-SAW (C1–C7) dan telemetri strike Red vs Blue.
- **Motion:** `framer-motion` khusus untuk micro-transitions snappy (`duration: 0.15`, ease `[0.2, 0, 0, 1]`). Dilarang animasi pantul melayang (*bouncy spring*).

---

## 5. Domain Rules & Screen Mapping (SPK Muaythai Pontianak)

Seluruh rancangan antarmuka wajib memenuhi kebutuhan spesifik dari dokumen **SRS SPK Muaythai Pengkot Pontianak**:

### 5.1 Strict Ring Spatial Layout (Red Left vs Blue Right)
- **Sudut Merah (`#E61E4D`) SELALU berada di sisi KIRI**.
- **Sudut Biru (`#008ED6`) SELALU berada di sisi KANAN**.
- Hal ini mengikuti sudut pandang juri dan wasit resmi di tepi ring serta standar siaran internasional IFMA.

### 5.2 Pemisahan Mutlak: Skor Resmi vs Analisis SPK (BR-009, FR-048, FR-052)
- **Penilaian Resmi (Score Card RbR Ten-Point Must):** Bagian utama keputusan juri. Input nilai 10-9, 10-8, 10-7, 10-10, caution, warning, KD, dan hasil keputusan (W.P, W.O, Disq., Ret., K.O, R.S.C).
- **Analisis SPK (Hierarki IFMA Rule 29 & AHP-SAW):** Wajib ditempatkan pada kontainer terpisah berlabel jelas `"ANALISIS SPK / PENDUKUNG KEPUTUSAN (NON-BINDING)"`.
- **Larangan Keras:** Sistem DILARANG secara otomatis memaksakan skor resmi atau menimpa input juri berdasarkan output SPK.

### 5.3 Pemetaan Layar (SRS Section 9):
- **UI-001 Login:** Form taktis berkeamanan tinggi dengan input peran (Admin, Operator, Juri, Pengawas).
- **UI-002 Dashboard Admin:** Matriks pengelolaan Atlet, Juri, Wasit, Kejuaraan, Ring, dan Divisi.
- **UI-008 Dashboard Operator:** Kontrol pertandingan, status input juri (Draft, Submitted, Locked), kontrol ronde & timer.
- **UI-009 Halaman Juri:** Daftar jadwal pertandingan yang ditugaskan kepada juri tertentu.
- **UI-010 Input Score Card Juri:** Touch-first interface untuk memasukkan skor 10-Point Must per ronde dengan tombol tap cepat (10-9, 10-8, 10-7) dan dialog konfirmasi penguncian.
- **UI-011 Input SPK Juri:** 
  - **C1 (Scoring Muaythai Skills):** Counter terpisah untuk *Punches*, *Kicks*, *Knees*, dan *Elbows* sah Red vs Blue.
  - **C2 (Forcefulness):** Evaluasi dampak tenaga serangan (skala 1–5).
  - **C3–C7 (Kriteria Tambahan):** Exhaustion/Bruising, Offensive Initiative, Defence, Muaythai Style, Rule Compliance (skala 1–5).
  - **Hierarchical Guidance Indicator:** Menampilkan margin selisih skill (0: Seri, 1–7: Small margin / 10-9, 8–14: Large margin / 10-8, 15+: Total domination / 10-7).
- **UI-012 Input Strike by Strike (SbS):** Reaction HUD cepat dengan indikator jendela konsensus mayoritas (minimal 3 dari 5 juri dalam 1 detik).
- **UI-013 Dashboard Pengawas / Chief of Jury:** Matriks konsensus 3 atau 5 juri secara simultan, verifikasi hasil, dan tombol pengesahan resmi.
- **UI-014 Rekapitulasi & Hasil:** Tabel agregasi skor resmi per juri, total poin, dan deklarasi pemenang.
- **UI-015 Detail Analisis SPK (AHP-SAW):** Radar chart C1–C7, normalisasi SAW benefit/cost, dan nilai akhir $V_i$.
- **UI-016 & UI-017 Laporan & Pratinjau PDF:** Cetak dokumen resmi Score Card dan Jury Decision sesuai formulir fisik Pengkot Pontianak dengan kontras tinggi.
- **UI-018 Audit Log:** Tabel telemetri monospaced padat mencatat setiap perubahan data, waktu, aktor, nilai sebelum, dan nilai sesudah.

---

## 6. Ringside Tablet Ergonomics

1. **Touch Target Size:** Seluruh tombol input skor, counter serangan sah, dan navigasi ronde wajib memiliki tinggi minimal `48px` (disarankan `56px`–`64px` pada tablet juri) untuk mencegah salah sentuh (*fat-finger error*).
2. **Network Resilience & Save State (NFR-011, NFR-012):**
   - Setiap kartu input skor wajib menampilkan indikator sinkronisasi real-time:
     - `SAVED` (Ikon centang hijau `#009E52`).
     - `SAVING...` (Indikator loading kuning `#F5A623`).
     - `OFFLINE / RETRYING` (Badge merah `#E61E4D`).
3. **Locking Mechanism:** Begitu juri menekan tombol "SUBMIT ROUND SCORE", antarmuka harus meminta konfirmasi singkat dan segera mengunci (*lock*) input untuk mencegah manipulasi tidak sengaja.

---

## 7. Referensi Dokumen & Contoh Komponen

Untuk implementasi mendalam, pelajari berkas panduan di sub-direktori:
- **Dokumen Kebutuhan SRS:** [Requirement SPK Muaythai Pengkot Pontianak](../../../docs/requirements/Requirement_Aplikasi_SPK_Muaythai_Pengkot_Pontianak.md)
- [Color Tokens & Theme Specs](./references/color-tokens.md)
- [Screen Architecture & SRS Mapping](./references/screens-spk-muaythai.md)
- [Tailwind Configuration Setup](./references/tailwind-config.ts)
- [Example: Juri Scorecard & SPK Input Component](./examples/ScorecardHud.tsx)
- [Example: Operator Jury Matrix Monitor](./examples/JuryMatrixOperator.tsx)
