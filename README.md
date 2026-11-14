# Sistem Pakar Hibrida Kesiapan Atlet Muaythai (Pengkot Pontianak)
### Multi-Criteria Decision & Expert System: Fuzzy AHP – TOPSIS – Certainty Factor – AI Narrative Layer (9Router)

Aplikasi ini merupakan implementasi sistem pakar cerdas berbasis web (*web-based expert system*) untuk mengevaluasi, memeringkat, dan menetapkan kelaikan tanding atlet Muaythai **Pengurus Kota (Pengkot) Muaythai Kota Pontianak** menjelang kejuaraan resmi berbasis regulasi resmi **IFMA (International Federation of Muaythai Associations Rules 2024–2026)**.

Sistem dirancang dengan estetika antarmuka **Tactical Combat Sports Broadcast UI** (Anti-AI Slop, Dark-Mode First & Light-Mode Arena, Hairline Borders, Bordered IFMA Emblem, Live LLM Connection Checker).

---

## 1. DOKUMENTASI MASTER RESMI
Seluruh penjelasan cara kerja sistem, formulasi matematika lengkap dari input hingga output, contoh data input, simulasi 5 skenario atlet, tabel pengetesan menyeluruh semua kemungkinan data dan output, checklist fitur, serta matriks keterlacakan kebutuhan (RTM) telah disatukan secara terpadu dalam satu dokumen master tunggal:

👉 **[`LAPORAN_LENGKAP_SISTEM_PAKAR_KESIAPAN_ATLET_MUAYTHAI.md`](./LAPORAN_LENGKAP_SISTEM_PAKAR_KESIAPAN_ATLET_MUAYTHAI.md)**

---

## 2. Arsitektur Komputasi Hibrida Terstruktur

Sistem menggabungkan 5 lapis komputasi terstruktur:
1. **Fuzzy AHP (Extent Analysis Chang 1996 & Zhu et al. 1999):** Menghitung bobot kriteria prioritas ($w_j$) dengan memodelkan ketidakpastian linguistik pakar menggunakan Bilangan Fuzzy Segitiga (*Triangular Fuzzy Numbers* / TFN). Dilengkapi perataan *$\epsilon$-floor smoothing* ($\epsilon=0.05$) untuk mencegah anomali bobot nol pada C4 & C5 serta verifikasi rasio konsistensi Saaty ($CR = 0.0059 < 0.10$).
2. **TOPSIS (Hwang & Yoon 1981):** Memeringkat alternatif atlet berdasarkan kedekatan relatif ($C_i$) terhadap Solusi Ideal Positif ($A^+$) dan Solusi Ideal Negatif ($A^-$) pada divisi berat resmi IFMA (memakai daya anaerobik relatif $\text{W/kg}$).
3. **Certainty Factor (MYCIN Model Shortliffe & Buchanan 1975):** Mengukur tingkat keyakinan atas kesiapan atlet berdasarkan bukti heuristik lapangan (presensi latihan TC, riwayat jam terbang tanding, dan status cedera fisik).
4. **Deterministic Decision Engine:** Menghasilkan kategori kesiapan (**SIAP**, **SIAP DENGAN CATATAN**, **BELUM SIAP**) secara 100% deterministik dan dapat diaudit tanpa risiko manipulasi generatif, serta menegakkan gerbang keselamatan IFMA: **Hard Gate K-06** (Teknik C2 $< 3.0 \implies$ *BELUM SIAP* mutlak), **Conservative Demotion K-07**, dan **Medical Safety Alert K-10**.
5. **AI Narrative Layer (9Router / MyCodeDec):** Model bahasa generatif lokal (Port 20128) yang beroperasi secara *read-only non-binding* untuk menghasilkan narasi analisis berstandar **JSON RFC 8259**, dengan **Guardrail FR-35** dan generator fallback deterministik instan (FR-37).

---

## 3. Struktur Direktori Proyek

```
d:/Sistem_PakarMY/
├── prisma/
│   └── schema.prisma                  # Skema database PostgreSQL (Prisma ORM 6.19)
├── public/
│   └── images/
│       └── ifma-logo.jpg              # Logo resmi IFMA berbingkai emas
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-status/
│   │   │   │   └── route.ts           # Endpoint live status koneksi 9Router
│   │   │   ├── evaluate/
│   │   │   │   └── route.ts           # Route API evaluasi kesiapan atlet
│   │   │   └── explain/
│   │   │       └── route.ts           # Route API narasi AI terstruktur
│   │   ├── globals.css                # CSS Variables tema Gelap & Terang
│   │   ├── layout.tsx                 # Root layout & Athletic Fonts
│   │   └── page.tsx                   # Dashboard Operasi Ringside Utama
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AthleteTable.tsx       # Tabel telemetri klasemen divisi & CRUD
│   │   │   ├── BeginnerFriendlyGuide.tsx # Panduan bahasa sederhana untuk pelatih
│   │   │   ├── FighterCompareHud.tsx  # HUD Komparasi atlet
│   │   │   ├── FuzzyAhpPanel.tsx      # Panel audit bobot & Konsistensi AHP
│   │   │   ├── IndividualAthleteEvaluator.tsx # Form evaluasi, preset & dual-mode AI viewer
│   │   │   └── MathBreakdownModal.tsx # Modal dekomposisi vektor matematis lengkap
│   │   └── layout/
│   │       └── Header.tsx             # Header resmi IFMA, LLM checker & theme toggle
│   └── lib/
│       ├── db.ts                      # Prisma client singleton (PostgreSQL)
│       ├── engine/
│       │   ├── certainty-factor.ts    # Engine Certainty Factor (MYCIN formula)
│       │   ├── decision-engine.ts     # Engine Keputusan Deterministik & Guardrails
│       │   ├── fuzzy-ahp.ts           # Engine Fuzzy AHP Chang (1996) + Zhu smoothing
│       │   ├── topsis.ts              # Engine TOPSIS (vektor & Euclidean distance)
│       │   ├── types.ts               # Tipe data TypeScript sistem pakar
│       │   └── test-simulation.ts     # Skrip simulasi 5 skenario kemungkinan atlet
│       └── services/
│           └── ai-explanation.ts      # 9Router AI Gateway & Fallback Deterministik
├── .env.example                       # Contoh konfigurasi environment
├── LAPORAN_LENGKAP_SISTEM_PAKAR_KESIAPAN_ATLET_MUAYTHAI.md # DOKUMEN MASTER TERPADU
├── SKILL.md                           # Aturan UI Anti-Slop Combat Sport
├── package.json                       # Dependensi proyek
├── tailwind.config.ts                 # Konfigurasi token warna dinamis IFMA
├── tsconfig.json
└── vercel.json                        # Konfigurasi deployment serverless Vercel
```

---

## 4. Persyaratan & Setup Database (PostgreSQL)

Proyek ini menggunakan **Prisma ORM** yang kompatibel dengan basis data PostgreSQL:
- **Penyedia yang didukung:** Neon Serverless Postgres, Supabase, Vercel Postgres, atau PostgreSQL lokal.

### Langkah Konfigurasi:
1. Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
2. Atur URL koneksi pada berkas `.env`:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/muaythai_db?schema=public"
   NINE_ROUTER_ENDPOINT="http://localhost:20128/v1"
   AI_EXPLANATION_MODEL="MyCodeDec"
   AI_GATEWAY_API_KEY=""
   ```
3. Sinkronisasikan skema Prisma ke database:
   ```bash
   npx prisma db push
   ```

---

## 5. Menjalankan Aplikasi Secara Lokal

1. **Instal dependensi:**
   ```bash
   npm install
   ```

2. **Jalankan pengujian simulasi matematis 5 atlet:**
   ```bash
   npx tsx src/lib/engine/test-simulation.ts
   ```

3. **Jalankan aplikasi (Production Build):**
   ```bash
   npm run build
   npm run start -p 3001
   ```
   Atau untuk mode pengembangan:
   ```bash
   npm run dev -p 3001
   ```
   Aplikasi dapat diakses pada `http://localhost:3001`.

---

## 6. Fitur Unggulan Antarmuka
- **Live LLM Connection Status:** Header memantau konektivitas gateway 9Router lokal port 20128 secara real-time dengan latensi round-trip.
- **Tema Gelap & Terang:** Transisi satu klik antara mode malam (*Carbon Corner Black*) dan mode siang (*Athletic Arena Day*) dengan persistensi `localStorage`.
- **Logo Resmi IFMA Berbingkai Emas:** Terpampang resmi pada header aplikasi sesuai standar kejuaraan internasional.
- **Dwi-Mode Narasi AI:** Pilihan tampilan antara **Mode Kartu Terstruktur** dan **Mode JSON RAW** lengkap dengan tombol 1-klik **Salin JSON**.
- **Audit-Proof Transparency:** Tombol "Lihat Audit Perhitungan" menyajikan pembuktian numerik matriks dan dekomposisi vektor secara transparan.

---

## 7. Deployment ke Vercel Serverless (Region `sin1`)
Aplikasi telah teruji dan siap deploy langsung di Vercel:
1. Impor repositori GitHub `https://github.com/riantonyc/Sistem_PakarMY.git`.
2. Masukkan environment variable `DATABASE_URL`.
3. Vercel akan otomatis menjalankan perintah build `prisma generate && next build` dan meng-host aplikasi di edge region Singapura (`sin1`).

---

**PENGURUS KOTA MUAYTHAI KOTA PONTIANAK**  
*Komisi Pembinaan Prestasi & Litbang Pertandingan*
