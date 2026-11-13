# Sistem Pakar Hibrida Kesiapan Atlet Muaythai (Pengkot Pontianak)
### Multi-Criteria Decision & Expert System: Fuzzy AHP – TOPSIS – Certainty Factor

Aplikasi ini merupakan implementasi sistem pakar hibrida untuk menilai dan memeringkat kesiapan atlet Muaythai Pengurus Kota (Pengkot) Kota Pontianak menjelang kejuaraan resmi berbasis regulasi **IFMA (International Federation of Muaythai Associations)**.

Sistem dirancang dengan estetika antarmuka **Tactical Combat Sports Broadcast UI** sesuai spesifikasi ketat dokumen `@SKILL.md` (Anti-AI Slop, Dark-Mode First, Hairline Borders, Strict Red Corner Left vs Blue Corner Right).

---

## 1. Arsitektur Komputasi Hibrida

Sistem menggabungkan 4 lapis kecerdasan komputasi terstruktur:
1. **Fuzzy AHP (Extent Analysis Chang 1996 & Zhu et al. 1999):** Menghitung bobot prioritas kriteria definit ($w_j$) dengan memodelkan ketidakpastian linguistik pakar menggunakan Bilangan Fuzzy Segitiga (*Triangular Fuzzy Numbers* / TFN). Dilengkapi verifikasi rasio konsistensi Saaty ($CR < 0.10$).
2. **TOPSIS (Hwang & Yoon 1981):** Memeringkat alternatif atlet berdasarkan kedekatan relatif ($C_i$) terhadap Solusi Ideal Positif ($A^+$) dan Solusi Ideal Negatif ($A^-$) pada kelompok divisi berat yang sama (memakai daya anaerobik relatif $W/\text{kg}$).
3. **Certainty Factor (MYCIN Model Shortliffe & Buchanan):** Mengukur tingkat keyakinan atas kesiapan atlet berdasarkan bukti-bukti heuristik lapangan (kehadiran latihan, jam terbang tanding, dan status cedera fisik).
4. **Deterministic Decision Engine:** Menghasilkan kategori kesiapan (**SIAP**, **SIAP DENGAN CATATAN**, **BELUM SIAP**) secara 100% deterministik dan dapat diaudit tanpa risiko manipulasi / halusinasi model generatif.
5. **LLM Explanation Layer (Non-Binding):** Model bahasa (via 9Router / Google Gemini) hanya digunakan untuk menyusun narasi bahasa manusia; dilarang keras mengubah kategori atau skor yang sudah dihitung.

Rincian rumus, formulasi matematis, spesifikasi kebutuhan (SRS), serta simulasi numerik tersedia lengkap pada berkas:
👉 **[`LAPORAN_LENGKAP_SISTEM_PAKAR_KESIAPAN_ATLET_MUAYTHAI.md`](./LAPORAN_LENGKAP_SISTEM_PAKAR_KESIAPAN_ATLET_MUAYTHAI.md)**
👉 **[`DOKUMEN_MATEMATIS_DAN_CARA_KERJA_SISTEM.md`](./DOKUMEN_MATEMATIS_DAN_CARA_KERJA_SISTEM.md)**

---

## 2. Struktur Folder Proyek

```
d:/Sistem_PakarMY/
├── prisma/
│   └── schema.prisma                  # Skema database PostgreSQL (Prisma ORM)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── evaluate/
│   │   │       └── route.ts           # Route API evaluasi kesiapan (REST)
│   │   ├── globals.css                # Style Tailwind & CSS variables IFMA
│   │   ├── layout.tsx                 # Root layout & Google Athletic Fonts
│   │   └── page.tsx                   # Dashboard Operasi Ringside Utama
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AthleteTable.tsx       # Tabel telemetri klasemen divisi
│   │   │   ├── FighterCompareHud.tsx  # HUD Komparasi Red Corner (Kiri) vs Blue (Kanan)
│   │   │   ├── FuzzyAhpPanel.tsx      # Panel inspeksi bobot & Konsistensi AHP
│   │   │   └── MathBreakdownModal.tsx # Modal audit perhitungan matematis lengkap
│   │   └── layout/
│   │       └── Header.tsx             # Broadcast telemetry header
│   └── lib/
│       ├── db.ts                      # Prisma client singleton (PostgreSQL)
│       └── engine/
│           ├── certainty-factor.ts    # Engine Certainty Factor (MYCIN formula)
│           ├── decision-engine.ts     # Engine Keputusan Deterministik & Guardrails
│           ├── fuzzy-ahp.ts           # Engine Fuzzy AHP Chang (1996)
│           ├── topsis.ts              # Engine TOPSIS (vektor & Euclidean distance)
│           ├── types.ts               # Tipe data TypeScript untuk sistem pakar
│           └── test-simulation.ts     # Skrip simulasi & verifikasi numerik
├── .env.example                       # Contoh konfigurasi environment
├── Catatan_Pakar_Berbasis_Literatur_Aturan_Keputusan_DRAFT.md
├── DOKUMEN_MATEMATIS_DAN_CARA_KERJA_SISTEM.md # Dokumen matematis komprehensif
├── Requirement_Laporan_Sistem_Pakar_Kesiapan_Atlet_Muaythai.md
├── SKILL.md                           # Aturan UI Anti-Slop Combat Sport
├── package.json                       # Dependensi proyek
├── postcss.config.mjs
├── tailwind.config.ts                 # Konfigurasi token warna & font IFMA
├── tsconfig.json
└── vercel.json                        # Konfigurasi deployment Vercel
```hanya 

---

## 3. Desain UI Anti-Slop (Sesuai `SKILL.md`)

- **Palet Warna IFMA RIngside (Dark-Mode First):**
  - Kanvas Utama: `#090A0D` (*Ring Mat Black*)
  - Permukaan Panel: `#111318` (*Carbon Corner*)
  - Hairline Border: `1px solid #262B36` (*No blurry drop-shadow soup*)
  - Sudut Merah (**Red Corner - Kiri**): `#E61E4D`
  - Sudut Biru (**Blue Corner - Kanan**): `#008ED6`
  - Aksen Emas (*Mongkhon Amber*): `#F5A623`
  - Aksen Hijau (*Ring Emerald / Valid Strike / Siap*): `#009E52`
- **Tipografi Atletik:**
  - Display / Header: `Barlow Condensed` (tight tracking, uppercase, bold).
  - Angka Skor / Telemetri / Bobot: `JetBrains Mono` dengan `tabular-nums` anti-layout shift.
  - Body UI: `Plus Jakarta Sans`.
- **Target Sentuh Ringside:** Seluruh kontrol aksi memenuhi standar minimal 48px untuk kemudahan operasional tablet juri dan pelatih.

---

## 4. Persyaratan & Setup Database (PostgreSQL)

Proyek ini menggunakan **Prisma ORM** yang kompatibel dengan database PostgreSQL:
- **Penyedia yang didukung:** Neon Serverless Postgres, Supabase, Vercel Postgres, atau PostgreSQL lokal.

### Langkah Konfigurasi:
1. Buat database baru di penyedia pilihan (misal: Neon / Supabase).
2. Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
3. Atur URL koneksi pada berkas `.env`:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
   ```
4. Jalankan migrasi Prisma untuk membuat seluruh tabel:
   ```bash
   npx prisma db push
   ```

---

## 5. Menjalankan Aplikasi Secara Lokal

1. **Instal dependensi:**
   ```bash
   npm install
   ```

2. **Jalankan pengujian simulasi matematis:**
   ```bash
   npx tsx src/lib/engine/test-simulation.ts
   ```

3. **Jalankan server pengembangan (Next.js):**
   ```bash
   npm run dev
   ```
   Buka peramban pada `http://localhost:3000`.

---

## 6. Panduan Deployment ke Vercel

Proyek ini telah dikonfigurasi penuh untuk deployment di Vercel:

1. **Push repositori ke GitHub/GitLab.**
2. **Impor proyek di Vercel Dashboard.**
3. **Environment Variables di Vercel:**
   - Masukkan `DATABASE_URL` (dari Neon / Supabase / Vercel Postgres).
   - Masukkan `NODE_ENV=production`.
   - Masukkan `NEXTAUTH_SECRET` (string acak aman).
4. **Build & Output Settings:**
   - Framework Preset: `Next.js`
   - Build Command: `prisma generate && next build` (sudah tercantum di `package.json` dan `vercel.json`).
   - Install Command: `npm install`
5. **Domain:**
   - Setelah deployment selesai, tambahkan custom domain yang diinginkan di menu *Settings > Domains* di dashboard Vercel.

---

## 7. Lisensi & Hak Cipta
Dikembangkan untuk keperluan penelitian dan operasional atletik Pengurus Kota Muaythai Kota Pontianak.

