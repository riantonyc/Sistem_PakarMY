# LAPORAN MASTER SISTEM PAKAR KESIAPAN ATLET MUAYTHAI
## Evaluasi Kesiapan Atlet Berbasis Fuzzy AHP – TOPSIS – Certainty Factor – AI Narrative Layer (9Router)
### Pengurus Kota Muaythai Kota Pontianak • Standar Regulasi Resmi IFMA (Rules 2024–2026)

---

## DAFTAR ISI
1. [BAB I: GAMBARAN UMUM SISTEM & LINGKUP REGULASI](#bab-i-gambaran-umum-sistem--lingkup-regulasi)
   - 1.1 Profil Sistem & Mandat Pengkot Muaythai Pontianak
   - 1.2 Standar Regulasi Internasional IFMA & *Duty of Care*
   - 1.3 Masalah Nyata Olahraga Beladiri & Tujuan Ilmiah
   - 1.4 Profil Pemangku Kepentingan (*Stakeholders*)
2. [BAB II: SPESIFIKASI KEBUTUHAN SISTEM (SRS)](#bab-ii-spesifikasi-kebutuhan-sistem-srs)
   - 2.1 Kebutuhan Fungsional Lengkap (FR-01 s/d FR-38)
   - 2.2 Kebutuhan Non-Fungsional (NFR-01 s/d NFR-10)
   - 2.3 Aturan Bisnis & Protokol Gerbang Keselamatan (*Hard Gates*)
3. [BAB III: ARSITEKTUR TEKNOLOGI & DATA ENGINEERING](#bab-iii-arsitektur-teknologi--data-engineering)
   - 3.1 Diagram Arsitektur Multi-Tier
   - 3.2 Diagram Alir Keputusan (*Decision Tree Flowchart*)
   - 3.3 Skema Basis Data Relasional (ERD & Prisma Models)
   - 3.4 Tumpukan Teknologi (*Tech Stack Breakdown*)
4. [BAB IV: ALGORITMA KOMPUTASI & FORMULASI MATEMATIKA LENGKAP](#bab-iv-algoritma-komputasi--formulasi-matematika-lengkap)
   - 4.1 Tahap 1: Fuzzy AHP (Chang 1996 + Zhu $\epsilon$-Floor Smoothing + Saaty CR)
   - 4.2 Tahap 2: TOPSIS (Normalisasi Vektor Euclidean, Solusi Ideal $A^+/A^-$, Indeks $C_i$)
   - 4.3 Tahap 3: Certainty Factor MYCIN (Kaidah Heuristik & Resolusi Konflik Bukti)
   - 4.4 Tahap 4: Deterministic Decision Engine (Kaidah K-01 s/d K-10, Hard Gate K-06, K-07, K-10)
   - 4.5 Tahap 5: AI Narrative Layer (9Router Gateway, Model MyCodeDec, Skema JSON RFC 8259)
5. [BAB V: CONTOH DATA INPUT & PERHITUNGAN LENGKAP 5 KASUS ATLET (SEMUA KEMUNGKINAN)](#bab-v-contoh-data-input--perhitungan-lengkap-5-kasus-atlet-semua-kemungkinan)
   - 5.1 Parameter Masukan 5 Profil Atlet (Kasus 1 s/d Kasus 5)
   - 5.2 Matriks Keputusan Mentah & Normalisasi Vektor Euclidean
   - 5.3 Matriks Ternormalisasi Terbobot ($V$)
   - 5.4 Solusi Ideal Positif ($A^+$) & Solusi Ideal Negatif ($A^-$)
   - 5.5 Jarak Euclidean ($D^+, D^-$) & Skor Kedekatan TOPSIS ($C_i$)
   - 5.6 Perhitungan Bukti Empiris & Kombinasi Certainty Factor ($CF$)
   - 5.7 Evaluasi Kaidah IFMA & Penetapan Kategori Akhir
   - 5.8 Sampel Output JSON RFC 8259 dari AI Narrative Layer
6. [BAB VI: TABEL PENGETESAN MENYELURUH SEMUA KEMUNGKINAN DATA & OUTPUT](#bab-vi-tabel-pengetesan-menyeluruh-semua-kemungkinan-data--output)
   - 6.1 Analisis Nilai Batas (*Boundary Value Analysis*)
   - 6.2 Partisi Ekivalensi (*Equivalence Partitioning*)
   - 6.3 Pengujian Skenario Ekstrem, Anomali & Pemulihan (*Fault Injection*)
   - 6.4 Matriks Hasil Uji 10 Kasus Uji Lengkap (TC-01 s/d TC-10)
7. [BAB VII: CHECKLIST & VERIFIKASI FITUR SISTEM](#bab-vii-checklist--verifikasi-fitur-sistem)
   - 7.1 Checklist Fitur Manajemen Data Atlet (CRUD)
   - 7.2 Checklist Fitur Live LLM Connection Checker (`/api/ai-status`)
   - 7.3 Checklist Fitur Tema Gelap & Terang (*Dark/Light Mode*)
   - 7.4 Checklist Fitur Logo Resmi IFMA Berbingkai (*Bordered Emblem*)
   - 7.5 Checklist Fitur Dwi-Mode Tampilan AI (Mode Kartu & RAW JSON)
8. [BAB VIII: MATRIKS KETERLACAKAN KEBUTUHAN (RTM)](#bab-viii-matriks-keterlacakan-kebutuhan-rtm)
9. [BAB IX: PANDUAN INSTALASI, KONFIGURASI 9ROUTER & DEPLOYMENT](#bab-ix-panduan-instalasi-konfigurasi-9router--deployment)

---

## BAB I: GAMBARAN UMUM SISTEM & LINGKUP REGULASI

### 1.1 Profil Sistem & Mandat Pengkot Muaythai Pontianak
*Sistem Pakar Penilaian Kesiapan Atlet Muaythai Kota Pontianak* adalah instrumen seleksi dan evaluasi kelaikan tanding atlet beladiri berbasis web (*web-based expert system*) yang dikembangkan untuk mendukung **Pengurus Kota (Pengkot) Muaythai Kota Pontianak**. Sistem ini menjadi dasar penentuan kuota atlet yang berhak mewakili Kota Pontianak pada ajang resmi seperti Pekan Olahraga Provinsi (Porprov) Kalimantan Barat, Kejuaraan Provinsi (Kejurprov), Pra-PON, hingga Seleksi Nasional.

Sistem menggabungkan metode multi-kriteria modern dengan kecerdasan buatan terstruktur:
1. **Fuzzy Analytic Hierarchy Process (FAHP)**: Menghitung bobot kepentingan kriteria penilaian secara objektif dengan mengatasi ambiguitas penilaian manusia menggunakan Bilangan Fuzzy Segitiga (*Triangular Fuzzy Numbers / TFN*).
2. **Technique for Order Preference by Similarity to Ideal Solution (TOPSIS)**: Menghitung jarak geometris kondisi fisik atlet terhadap profil atlet juara ideal (*Positive Ideal Solution*).
3. **Certainty Factor (CF)**: Mengkuantifikasi tingkat kepastian terhadap bukti-bukti empiris lapangan (disiplin kehadiran pemusatan latihan, riwayat bertanding, dan rekam medis cedera).
4. **AI Narrative Layer (9Router Gateway)**: Menerjemahkan angka-angka komputasi menjadi laporan analisis komprehensif berstandar **JSON RFC 8259** tanpa mengubah vonis matematis (*read-only non-binding narrative*).

### 1.2 Standar Regulasi Internasional IFMA & *Duty of Care*
Muaythai adalah olahraga beladiri kontak penuh (*full contact combat sport*) yang menggunakan delapan titik kontak tubuh (*Art of Eight Limbs*: pukulan, tendangan, lutut, dan siku). Regulasi resmi **International Federation of Muaythai Associations (IFMA Rules 2024–2026)** dan hukum olahraga mewajibkan penyelenggara menerapkan prinsip *Duty of Care* (kewajiban melindungi keselamatan atlet).

Batasan ketat regulasi IFMA yang diintegrasikan ke dalam sistem:
1. **IFMA Rule 29 (Technical Competence)**: Atlet wajib menguasai teknik dasar pertahanan (*guarding, parrying, clinching*) sebelum diizinkan bertanding di atas ring. Atlet dengan teknik di bawah ambang minimal dilarang bertanding demi keselamatan (*Hard Gate*).
2. **IFMA Medical Rules & Safety**: Atlet yang sedang dalam masa cedera aktif dilarang bertanding tanpa izin tertulis resmi (*medical clearance*) dari dokter spesialis olahraga yang ditunjuk.
3. **Weight Class Regulations**: Atlet wajib mematuhi batas timbang badan resmi kelas tanding. Selisih berat badan aktual terhadap batas kelas dipantau secara ketat untuk mencegah dehidrasi ekstrem (*rapid weight cutting*) yang berisiko fatal.

### 1.3 Masalah Nyata Olahraga Beladiri & Tujuan Ilmiah
Sistem ini hadir untuk menyelesaikan permasalahan kronis dalam manajemen kontingen olahraga:
- **Menghilangkan Subjektivitas & Nepotisme**: Menghapus penunjukan atlet berdasarkan kedekatan personal pelatih/pengurus melalui penerapan skor matematis terverifikasi.
- **Mengatasi Kelemahan Matematika Chang (1996)**: Menggunakan algoritma *$\epsilon$-floor smoothing* (Zhu et al., 1999) dengan $\epsilon = 0.05$ sehingga kriteria pengalaman tanding (C4) dan kedisiplinan (C5) tidak bernilai bobot 0%.
- **Pencegahan Risiko Kematian / Cedera Fatal**: Mengunci status kelaikan tanding jika terdeteksi cedera akut melalui kaidah keselamatan K-10.

### 1.4 Profil Pemangku Kepentingan (*Stakeholders*)
| Peran (*Stakeholder*) | Tanggung Jawab Operasional | Akses & Kebutuhan Fitur |
| :--- | :--- | :--- |
| **Ketua Pengkot / Bidang Binpres** | Pengambil keputusan final skuad kontingen resmi. | Melihat papan klasemen divisi, validasi kuota kelas tanding, mengunduh laporan kesimpulan resmi. |
| **Kepala Pelatih (*Head Coach*)** | Penilai parameter fisik dan teknik di sasana. | Menginput data metrik C1–C5, mengevaluasi rekomendasi latihan teknis dari sistem pakar dan AI. |
| **Dokter Kontingen / Fisioterapis** | Penanggung jawab kelaikan medis dan cedera. | Mengaudit status cedera aktif, mengisi catatan medis, memberikan rekomendasi rehabilitasi atlet. |
| **Administrator Sistem** | Pemelihara infrastruktur server dan basis data. | Memantau status koneksi gateway 9Router, mengelola basis data PostgreSQL, memelihara konfigurasi `.env`. |

---

## BAB II: SPESIFIKASI KEBUTUHAN SISTEM (SRS)

### 2.1 Kebutuhan Fungsional (Functional Requirements)

#### Modul 1: Manajemen Kriteria & Pembobotan (FAHP)
- **FR-01**: Sistem wajib mengelola 5 kriteria standar kesiapan atlet:
  - **C1**: Daya Anaerobik Relatif ($\text{W/kg}$, *Benefit*)
  - **C2**: Penguasaan Teknik Dasar Muaythai (Skala 1.0 - 5.0, *Benefit, Kriteria Wajib Hard Gate $\ge 3.0$*)
  - **C3**: Kapasitas Kardiorespirasi $\text{VO}_2\text{max}$ ($\text{ml/kg/min}$, *Benefit*)
  - **C4**: Pengalaman Bertanding Resmi (Jumlah Partai, *Benefit*)
  - **C5**: Kedisiplinan Kehadiran TC ($\%$, *Benefit*)
- **FR-02**: Sistem wajib menghitung nilai sintesis fuzzy ($S_i$) dari matriks perbandingan berpasangan TFN.
- **FR-03**: Sistem wajib menerapkan perataan bobot *$\epsilon$-floor smoothing* ($\epsilon = 0.05$) untuk mencegah anomali bobot nol.
- **FR-04**: Sistem wajib memverifikasi Rasio Konsistensi Saaty ($CR$) dan memastikan nilai $CR < 0.10$.

#### Modul 2: Manajemen Atlet & Roster Divisi (CRUD)
- **FR-05**: Sistem wajib menyediakan formulir input atlet: nama, sasana, kelas tanding resmi IFMA, berat aktual ($\text{kg}$), persentase kehadiran TC ($\%$), status cedera aktif (*boolean*), catatan cedera (*text*), serta skor C1–C5.
- **FR-06**: Sistem wajib menyediakan fitur *Quick Preset Loader* (Atlet Siap, Atlet Cedera, Atlet Belum Siap, dan Reset Form).
- **FR-07**: Sistem memungkinkan penambahan atlet baru ke tabel divisi (*Create*).
- **FR-08**: Sistem menampilkan tabel klasemen terurut berdasarkan skor kedekatan TOPSIS ($C_i$) (*Read*).
- **FR-09**: Sistem menyediakan tombol edit untuk memuat data atlet kembali ke formulir evaluasi (*Update*).
- **FR-10**: Sistem menyediakan tombol hapus atlet yang dilengkapi modal konfirmasi keamanan dialog (*Delete*).

#### Modul 3: Mesin Geometris (TOPSIS)
- **FR-11**: Sistem melakukan normalisasi vektor Euclidean pada alternatif satu divisi berat yang sama.
- **FR-12**: Sistem mengalikan matriks ternormalisasi dengan bobot normalisasi FAHP ($v_{ij} = w_j \cdot r_{ij}$).
- **FR-13**: Sistem menentukan Solusi Ideal Positif ($A^+$) dan Solusi Ideal Negatif ($A^-$) secara dinamis.
- **FR-14**: Sistem menghitung jarak Euclidean positif ($D_i^+$) dan jarak Euclidean negatif ($D_i^-$).
- **FR-15**: Sistem menghitung nilai kedekatan relatif ($C_i = \frac{D_i^-}{D_i^+ + D_i^-}$) dalam rentang $[0.0000, 1.0000]$.

#### Modul 4: Mesin Faktor Keyakinan (Certainty Factor MYCIN)
- **FR-16**: Sistem mengevaluasi kaidah heuristik pakar: presensi TC tinggi ($\ge 80\% \implies CF = +0.6$), presensi rendah ($< 60\% \implies CF = -0.5$), cedera aktif ($CF = -0.7$), daya anaerobik tinggi ($\ge 14\text{ W/kg} \implies CF = +0.55$), anaerobik rendah ($< 10\text{ W/kg} \implies CF = -0.6$), teknik tinggi ($\ge 4.0 \implies CF = +0.5$), VO2max tinggi ($\ge 52 \implies CF = +0.45$), jam terbang tanding ($\ge 5\text{ partai} \implies CF = +0.4$).
- **FR-17**: Sistem menerapkan formula kombinasi bukti positif: $CF_{\text{comb}} = CF_1 + CF_2(1 - CF_1)$.
- **FR-18**: Sistem menerapkan formula kombinasi bukti negatif: $CF_{\text{comb}} = CF_1 + CF_2(1 + CF_1)$.
- **FR-19**: Sistem menerapkan formula resolusi konflik bukti berlawanan tanda: $CF_{\text{comb}} = \frac{CF_1 + CF_2}{1 - \min(|CF_1|, |CF_2|)}$.
- **FR-20**: Nilai akhir $CF_{\text{total}}$ berada dalam rentang valid $[-1.0000, +1.0000]$.

#### Modul 5: Mesin Keputusan Deterministik (Decision Engine)
- **FR-21**: Sistem mengklasifikasikan atlet ke dalam salah satu dari 3 kategori: **SIAP**, **SIAP DENGAN CATATAN**, atau **BELUM SIAP**.
- **FR-22 (Rule K-01 - Kesiapan Penuh)**: Atlet dinyatakan *SIAP* jika $C_i \ge 0.70 \land CF \ge 0.40 \land \text{Bebas Cedera}$.
- **FR-23 (Rule K-02 - Kesiapan Bersyarat)**: Atlet dinyatakan *SIAP DENGAN CATATAN* jika $C_i \ge 0.45 \land CF \ge 0.00$.
- **FR-24 (Rule K-03 - Ketidaksiapan)**: Atlet dinyatakan *BELUM SIAP* jika $C_i < 0.45 \lor CF < 0.00$.
- **FR-25 (Hard Gate K-06 - Diskualifikasi Wajib)**: Jika skor C2 (Teknik) $< 3.0$, status atlet diturunkan mutlak menjadi *BELUM SIAP* tanpa memandang skor fisik lainnya.
- **FR-26 (Conservative Demotion K-07)**: Jika atlet berpotensi siap namun memiliki $CF \le -0.50$, kategori diturunkan satu tingkat ke *SIAP DENGAN CATATAN* atau *BELUM SIAP*.
- **FR-27 (Medical Safety Alert K-10)**: Jika atlet memiliki cedera aktif, status kesiapan otomatis didemosi ke *SIAP DENGAN CATATAN*, memicu lencana peringatan medis, dan mewajibkan rekomendasi medis tertulis dokter spesialis.

#### Modul 6: Lapisan Narasi AI & Integrasi 9Router
- **FR-28**: Sistem menyediakan endpoint live status koneksi LLM: `/api/ai-status` untuk mendeteksi ketersediaan port 9Router (`http://localhost:20128/v1`).
- **FR-29**: Permintaan analisis naratif menggunakan model combo **`MyCodeDec`** (Round-Robin).
- **FR-30**: Sistem mem-parsing respon 9Router baik dalam format JSON envelope tunggal maupun aliran Server-Sent Events (SSE `data: {"id": ...}`).
- **FR-31**: Sistem mengonversi respon menjadi format **JSON RFC 8259** terstruktur yang mencakup: `keputusanFinal`, `ringkasanEksekutif`, `analisisKriteria`, `analisisSistemPakar`, `auditMedisDanBeratBadan`, `rekomendasiPelatih`, `instruksiOperasional`, dan `kesimpulan`.
- **FR-32**: Field `kesimpulan` memuat uraian deskriptif multi-kalimat mendalam yang mencakup justifikasi regulasi IFMA, profil kebugaran, mitigasi risiko medis, dan arahan manajerial pelatih.
- **FR-33 (Guardrail FR-35)**: LLM dilarang mengubah kategori keputusan final. Jika terjadi inkonsistensi, backend otomatis menimpa field `keputusanFinal` dengan nilai deterministik sistem pakar.
- **FR-34 (Fallback Otomatis FR-37)**: Jika 9Router timeout (>25 detik) atau offline, sistem seketika menghasilkan template terstruktur identik berbasis generator deterministik tanpa jeda error.
- **FR-35**: Antarmuka menyediakan tombol alih tampilan antara **Mode Kartu Terstruktur** dan **Mode JSON RAW**.
- **FR-36**: Antarmuka menyediakan tombol 1-klik **Salin JSON** ke clipboard.
- **FR-37**: Antarmuka menyediakan toggle pemilih **Tema Gelap (*Combat Ring*)** dan **Tema Terang (*Athletic Arena*)** dengan penyimpanan pilihan di `localStorage`.
- **FR-38**: Antarmuka menyematkan logo resmi **IFMA** di dalam bingkai ganda beraksen emas (*bordered emblem*) pada header aplikasi.

---

### 2.2 Kebutuhan Non-Fungsional (Non-Functional Requirements)
| Kode | Dimensi | Spesifikasi Kebutuhan Non-Fungsional |
| :--- | :--- | :--- |
| **NFR-01** | **Determinisme & Auditabilitas** | Perhitungan FAHP, TOPSIS, dan CF 100% deterministik dan dapat dibuktikan manual tanpa deviasi angka desimal. |
| **NFR-02** | **Latensi Komputasi** | Eksekusi perhitungan hibrida matematis untuk seluruh atlet selesai dalam waktu kurang dari **50 milidetik**. |
| **NFR-03** | **Batas Waktu Tunggu AI** | Pemanggilan gateway 9Router dibatasi timeout **25 detik per percobaan** dengan mekanisme rotasi 2 kali percobaan sebelum mengaktifkan fallback instan. |
| **NFR-04** | **Keamanan Kredensial** | Kunci API rahasia dan koneksi basis data diisolasi dalam file `.env` (terdaftar di `.gitignore`), aman dari kebocoran di sisi klien atau repositori publik. |
| **NFR-05** | **Desain Antarmuka Anti-Slop** | Menerapkan estetika beladiri taktis: warna dasar `#090A0D` dan `#111318`, garis pembatas hairline `#262B36`, aksen emas `#F5A623` dan merah `#E61E4D`, serta angka tabel monospace tabular. |
| **NFR-06** | **Ketersediaan (*Reliability*)** | Sistem tetap berfungsi 100% melayani evaluasi kesiapan atlet meskipun jaringan internet terputus atau service LLM 9Router mati. |
| **NFR-07** | **Kompatibilitas Peramban** | Mendukung peramban modern: Google Chrome (v110+), Mozilla Firefox (v110+), Microsoft Edge (v110+), dan Safari (v16+). |
| **NFR-08** | **Integritas Skema Data** | Validasi tipe data ketat pada antarmuka (TypeScript 5.8) dan basis data (Prisma 6.19). |
| **NFR-09** | **Portabilitas Serverless** | Siap di-deploy tanpa server (*zero-config*) di Vercel dengan edge region terdekat (`sin1` Singapura). |
| **NFR-10** | **Kemudahan Pemahaman** | Menyediakan panel panduan bahasa sederhana (*plain-language guide*) untuk pelatih dan juri tanpa latar belakang matematika formal. |

---

### 2.3 Aturan Bisnis & Protokol Gerbang Keselamatan (*Hard Gates*)

```mermaid
flowchart TD
    Start["Input Nilai Evaluasi Atlet (C1-C5, Berat, Presensi, Cedera)"] --> CheckC2{"Apakah C2 (Teknik) < 3.0?"}
    
    CheckC2 -- YA --> HardGate["HARD GATE (Rule K-06)<br/>Diskualifikasi Mutlak Keselamatan IFMA"]
    HardGate --> StatusBelumSiap["Kategori Final:<br/>[BELUM SIAP]"]
    
    CheckC2 -- TIDAK --> CalcMath["Hitung Skor Kedekatan TOPSIS (Ci)<br/>dan Certainty Factor Lapangan (CF)"]
    CalcMath --> CheckPrima{"Apakah Ci >= 0.70<br/>DAN CF >= 0.40?"}
    
    CheckPrima -- YA --> CheckInjury{"Apakah Bebas Cedera<br/>DAN Presensi TC >= 80%?"}
    CheckInjury -- YA --> StatusSiap["Kategori Final:<br/>[SIAP / PRIMA]"]
    CheckInjury -- TIDAK --> MedicalOrDemo{"Apakah Cedera Aktif?"}
    MedicalOrDemo -- YA --> StatusMedical["Kategori Final:<br/>[SIAP DENGAN CATATAN]<br/>+ MEDICAL SAFETY ALERT (Rule K-10)"]
    MedicalOrDemo -- TIDAK --> StatusDemoted["Kategori Final:<br/>[SIAP DENGAN CATATAN]<br/>(Rule K-07 Demosi Presensi)"]
    
    CheckPrima -- TIDAK --> CheckCond{"Apakah Ci >= 0.45<br/>DAN CF >= 0.00?"}
    CheckCond -- YA --> StatusKondisional["Kategori Final:<br/>[SIAP DENGAN CATATAN]<br/>(Rule K-02 Kapasitas Menengah)"]
    CheckCond -- TIDAK --> StatusLow["Kategori Final:<br/>[BELUM SIAP]<br/>(Rule K-03 Under-Preparedness)"]
```

---

## BAB III: ARSITEKTUR TEKNOLOGI & DATA ENGINEERING

### 3.1 Diagram Arsitektur Multi-Tier

```
+-------------------------------------------------------------------------------------------------+
|                                     TIER 1: PRESENTATION LAYER                                  |
|   Next.js 15 App Router • React 19 Client Components • Tailwind CSS • Lucide Icons             |
|   - Header.tsx (Logo IFMA Berbingkai, Live LLM Checker /api/ai-status, Theme Switcher Gelap/Terang) |
|   - IndividualAthleteEvaluator.tsx (Form CRUD, Presets, Real-Time Engine, Dual-Mode AI Viewer)  |
|   - AthleteTable.tsx (Klasemen Divisi, Inline Edit, Confirm Delete Modal)                       |
|   - BeginnerFriendlyGuide.tsx (Penjelasan Bahasa Sederhana untuk Pelatih & Wasit)              |
|   - FuzzyAhpPanel.tsx & MathBreakdownModal.tsx (Audit Matriks TFN & Dekomposisi Vektor)        |
+-------------------------------------------------------------------------------------------------+
                                                  |
                                                  | HTTP / JSON Payload
                                                  v
+-------------------------------------------------------------------------------------------------+
|                                   TIER 2: COMPUTATIONAL ENGINE LAYER                            |
|   Next.js Route Handlers (/api/evaluate, /api/explain, /api/ai-status) • Pure TypeScript Native  |
|   +-----------------------+ +-----------------------+ +-----------------------+                 |
|   |   fuzzy-ahp.ts        | |   topsis.ts           | |  certainty-factor.ts  |                 |
|   | - Extent Analysis TFN | | - Euclidean Vector    | | - MYCIN Rules         |                 |
|   | - Epsilon Smoothing   | | - Weighted Matrix     | | - Conflict Resolution |                 |
|   | - Saaty Consistency CR| | - Ideal Closeness Ci  | | - Combined Evidence   |                 |
|   +-----------------------+ +-----------------------+ +-----------------------+                 |
|                                       |                                                         |
|                                       v                                                         |
|   +-----------------------------------------------------------------------------------------+   |
|   | decision-engine.ts: Rules K-01..K-10, Hard Gate K-06, Demotion K-07, Medical Safety K-10|   |
|   +-----------------------------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------------------------+
                     |                                                           |
                     | Prisma ORM (v6.19)                                        | HTTP REST Client
                     v                                                           v
+-----------------------------------------+         +---------------------------------------------+
|        TIER 3: PERSISTENCE LAYER        |         |             TIER 4: AI GATEWAY              |
|   PostgreSQL Database (Neon / Supabase) |         |   9Router Local Service (Port 20128)        |
|   - Athlete (Biodata & Raw Scores)      |         |   - Model Combo: MyCodeDec (Round Robin)    |
|   - Criterion (Weights & Thresholds)    |         |   - Dual Parser (JSON Envelope + SSE Stream)|
|   - EvaluationResult (Scores & Audit)   |         |   - RFC 8259 Structured Output Builder      |
+-----------------------------------------+         +---------------------------------------------+
```

### 3.2 Diagram Entitas Relasional Basis Data (ERD)

```mermaid
erDiagram
    ATHLETE ||--o{ EVALUATION_RESULT : "has evaluations"
    
    ATHLETE {
        string id PK "UUID / String (e.g. ATH-001)"
        string name "Nama Lengkap Atlet"
        string campName "Nama Sasana / Camp Asal"
        string weightClass "Kelas Tanding Resmi IFMA"
        float weightKg "Berat Badan Aktual (kg)"
        float attendanceRate "Presensi Pemusatan Latihan TC (%)"
        boolean hasActiveInjury "Status Cedera Aktif"
        string injuryNotes "Catatan Medis Cedera"
        json rawScores "Metrik Skor Mentah C1 s/d C5"
        datetime createdAt "Waktu Didaftarkan"
        datetime updatedAt "Waktu Terakhir Diperbarui"
    }
    
    EVALUATION_RESULT {
        string id PK "UUID"
        string athleteId FK "Relasi ke Athlete"
        float topsisCloseness "Skor Kedekatan Fisik (Ci)"
        float certaintyFactor "Faktor Keyakinan Lapangan (CF)"
        string category "SIAP / SIAP_DENGAN_CATATAN / BELUM_SIAP"
        json activeRules "Daftar Kaidah IFMA yang Aktif"
        json mandatoryViolated "Daftar Pelanggaran Kriteria Wajib"
        boolean medicalAlert "Lencana Peringatan Medis Aktif"
        json structuredJson "Payload Output JSON RFC 8259"
        datetime createdAt "Waktu Evaluasi Dilakukan"
    }

    CRITERION {
        string id PK "Kode Kriteria (C1-C5)"
        string name "Nama Kriteria Metrik"
        string category "FISIK / TEKNIK / DISIPLIN / PENGALAMAN"
        string unit "W/kg, Skala 1-5, ml/kg/min, Partai, %"
        string type "BENEFIT / COST"
        float weight "Bobot Normalisasi FAHP (wj)"
        boolean isMandatory "Status Kriteria Wajib (Hard Gate)"
        float minThreshold "Ambang Batas Minimum Kelayakan"
    }
```

### 3.3 Tumpukan Teknologi (*Tech Stack Breakdown*)
| Komponen | Pustaka / Alat | Versi | Peran Teknis & Justifikasi Arsitektur |
| :--- | :--- | :--- | :--- |
| **Framework Fullstack** | **Next.js** | `15.5.29` | Mendukung App Router dengan *Hybrid Rendering* (Server Components untuk initial render cepat, Client Components untuk form reaktif). |
| **Pustaka Antarmuka** | **React** | `19.0.0` | Menangani *state management* formulir dan rendering instan tanpa jeda input. |
| **Bahasa Pemrograman** | **TypeScript** | `5.8.x` | Menjamin kepatuhan tipe data (*type safety*) 100% pada seluruh komputasi matriks dan struktur output JSON RFC 8259. |
| **Styling & Theme** | **Tailwind CSS** | `3.4.1` | Desain antarmuka taktis dengan variabel CSS `rgb(var(--...) / <alpha>)` yang mendukung perpindahan instan antara tema gelap dan terang. |
| **Ikonografi** | **Lucide React** | `0.475.x` | Ikon SVG berbobot ringan untuk status kesiapan (`Cpu`, `Sun`, `Moon`, `RefreshCw`, `CheckCircle2`, `AlertTriangle`). |
| **Basis Data** | **PostgreSQL** | `15+ / 16` | Penyimpanan persisten dengan keandalan transaksi ACID penuh dan kolom tipe JSONB. |
| **ORM** | **Prisma** | `6.19.3` | Deklarasi skema relasional terpusat (`schema.prisma`) dan pembuatan klien bertipe aman otomatis saat build. |
| **Mesin Komputasi** | **Native TypeScript** | Native | **Nol dependensi matematika eksternal (*zero-dependency*)** untuk menjamin transparansi audit dan kecepatan komputasi $< 50\text{ ms}$. |
| **Gateway AI** | **9Router** | Port 20128 | OpenAI-compatible proxy gateway lokal yang mengelola model combo **`MyCodeDec`** (Round-Robin). |
| **Hosting & CI/CD** | **Vercel** | Serverless `sin1` | Deployment serverless di region Singapura (latensi transmisi $< 40\text{ ms}$ ke Pontianak). |

---

## BAB IV: ALGORITMA KOMPUTASI & FORMULASI MATEMATIKA LENGKAP

### 4.1 Tahap 1: Fuzzy AHP (Extent Analysis Chang 1996 + Zhu Smoothing)

#### 1. Pembentukan Matriks Perbandingan Berpasangan Fuzzy (TFN)
Skala perbandingan didefinisikan menggunakan Bilangan Fuzzy Segitiga $M = (l, m, u)$:
- Sama penting: $(1, 1, 1)$
- Sedikit lebih penting: $(2, 3, 4)$
- Jelas lebih penting: $(4, 5, 6)$
- Sangat jelas lebih penting: $(6, 7, 8)$
- Mutlak lebih penting: $(8, 9, 10)$
- Nilai resiprokal (kebalikan): $(l, m, u)^{-1} = (1/u, 1/m, 1/l)$

Matriks perbandingan pakar Muaythai Pontianak ($5 \times 5$):
$$
\tilde{A} = \begin{bmatrix}
(1,1,1) & (1/2,1,2) & (2,3,4) & (3,4,5) & (3,4,5) \\
(1/2,1,2) & (1,1,1) & (2,3,4) & (3,4,5) & (3,4,5) \\
(1/4,1/3,1/2) & (1/4,1/3,1/2) & (1,1,1) & (1,2,3) & (1,2,3) \\
(1/5,1/4,1/3) & (1/5,1/4,1/3) & (1/3,1/2,1) & (1,1,1) & (1/2,1,2) \\
(1/5,1/4,1/3) & (1/5,1/4,1/3) & (1/3,1/2,1) & (1/2,1,2) & (1,1,1)
\end{bmatrix}
$$

#### 2. Perhitungan Nilai Sintesis Fuzzy ($S_i$)
Rumus nilai sintesis fuzzy untuk baris ke-$i$:
$$S_i = \sum_{j=1}^m M_{ij} \otimes \left[ \sum_{i=1}^n \sum_{j=1}^m M_{ij} \right]^{-1}$$

Total jumlahan seluruh elemen matriks:
$$\sum_{i=1}^5 \sum_{j=1}^5 M_{ij} = (26.9667, 34.1667, 44.5000)$$
Kebalikan dari total jumlahan:
$$\left[ \sum_{i=1}^5 \sum_{j=1}^5 M_{ij} \right]^{-1} = \left( \frac{1}{44.5000}, \frac{1}{34.1667}, \frac{1}{26.9667} \right) = (0.02247, 0.02927, 0.03708)$$

Hasil sintesis fuzzy ($S_i$):
- **C1 (Daya Anaerobik)**: $(9.5000, 13.0000, 17.0000) \otimes (0.02247, 0.02927, 0.03708) = (0.1851, 0.3451, 0.6304)$
- **C2 (Teknik Dasar)**: $(9.5000, 13.0000, 17.0000) \otimes (0.02247, 0.02927, 0.03708) = (0.1851, 0.3451, 0.6304)$
- **C3 (VO2max)**: $(3.5000, 5.6667, 8.0000) \otimes (0.02247, 0.02927, 0.03708) = (0.0682, 0.1504, 0.2967)$
- **C4 (Pengalaman)**: $(2.2333, 3.0000, 4.6667) \otimes (0.02247, 0.02927, 0.03708) = (0.0435, 0.0796, 0.1731)$
- **C5 (Kedisiplinan)**: $(2.2333, 3.0000, 4.6667) \otimes (0.02247, 0.02927, 0.03708) = (0.0435, 0.0796, 0.1731)$

#### 3. Derajat Kemungkinan (*Degree of Possibility*)
Derajat kemungkinan $V(M_1 \ge M_2)$ dihitung dengan:
$$V(M_1 \ge M_2) = \begin{cases} 
1, & \text{jika } m_1 \ge m_2 \\
0, & \text{jika } l_2 \ge u_1 \\
\frac{l_2 - u_1}{(m_1 - u_1) - (m_2 - l_2)}, & \text{lainnya}
\end{cases}$$

Bobot vektor belum ternormalisasi:
$$d'(A_i) = \min_{k \ne i} V(S_i \ge S_k)$$

#### 4. Penerapan Perataan $\epsilon$-Floor Smoothing (Zhu et al., 1999)
Pada metode Chang murni, derajat kemungkinan $V(S_4 \ge S_1)$ menghasilkan nilai 0 sehingga kriteria C4 dan C5 memiliki bobot 0.00%. Sistem ini menerapkan batas bawah perataan $\epsilon = 0.05$:
$$d^*(A_i) = \max(d'(A_i), \epsilon)$$
$$w_i = \frac{d^*(A_i)}{\sum_{k=1}^n d^*(A_k)}$$

Hasil bobot normalisasi akhir ($w$):
- **C1 (Daya Anaerobik Relatif)**: $w_1 = 0.4058$ ($40.58\%$)
- **C2 (Penguasaan Teknik Dasar)**: $w_2 = 0.4058$ ($40.58\%$)
- **C3 (Daya Tahan Kardiorespirasi)**: $w_3 = 0.1479$ ($14.79\%$)
- **C4 (Pengalaman Bertanding)**: $w_4 = 0.0203$ ($2.03\%$)
- **C5 (Kedisiplinan Kehadiran TC)**: $w_5 = 0.0203$ ($2.03\%$)

#### 5. Uji Konsistensi Saaty (CR)
Nilai eigen terbesar $\lambda_{\max} = 5.0264$, Indeks Konsistensi $CI = \frac{5.0264 - 5}{5 - 1} = 0.0066$. Dengan Random Index ($RI$) untuk matriks $5 \times 5$ sebesar $1.12$:
$$CR = \frac{CI}{RI} = \frac{0.0066}{1.12} = 0.0059$$
Karena $CR = 0.0059 < 0.10$, matriks perbandingan **terbukti konsisten secara matematis**.

---

### 4.2 Tahap 2: TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)

#### 1. Pembentukan Matriks Keputusan ($X$)
Matriks berukuran $m \times n$ di mana $m$ adalah jumlah atlet dan $n = 5$ kriteria.

#### 2. Normalisasi Vektor Euclidean ($R$)
Setiap elemen dinormalisasi dengan membaginya terhadap akar kuadrat jumlahan kuadrat seluruh alternatif pada kriteria yang bersangkutan:
$$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{k=1}^m x_{kj}^2}}$$

#### 3. Matriks Ternormalisasi Terbobot ($V$)
Setiap elemen dikalikan dengan bobot kriteria hasil Fuzzy AHP:
$$v_{ij} = w_j \cdot r_{ij}$$

#### 4. Menentukan Solusi Ideal Positif ($A^+$) dan Solusi Ideal Negatif ($A^-$)
Karena seluruh kriteria C1 s/d C5 bertipe *Benefit*:
$$A^+ = \{ \max_i(v_{i1}), \max_i(v_{i2}), \max_i(v_{i3}), \max_i(v_{i4}), \max_i(v_{i5}) \}$$
$$A^- = \{ \min_i(v_{i1}), \min_i(v_{i2}), \min_i(v_{i3}), \min_i(v_{i4}), \min_i(v_{i5}) \}$$

#### 5. Menghitung Jarak Euclidean ($D_i^+$ dan $D_i^-$)
Jarak terhadap Solusi Ideal Positif:
$$D_i^+ = \sqrt{\sum_{j=1}^n (v_{ij} - v_j^+)^2}$$
Jarak terhadap Solusi Ideal Negatif:
$$D_i^- = \sqrt{\sum_{j=1}^n (v_{ij} - v_j^-)^2}$$

#### 6. Menghitung Nilai Kedekatan Relatif ($C_i$)
$$C_i = \frac{D_i^-}{D_i^+ + D_i^-}$$
Nilai $C_i$ berada pada rentang $[0.0000, 1.0000]$. Nilai $C_i \to 1.0000$ menandakan profil atlet semakin mendekati profil juara ideal.

---

### 4.3 Tahap 3: Certainty Factor MYCIN (Shortliffe & Buchanan 1975)

Faktor keyakinan terhadap suatu hipotesis berdasarkan bukti empiris:
$$CF(H, E) = MB(H, E) - MD(H, E)$$
Setiap aturan heuristik dievaluasi dengan:
$$CF(E) = CF_{\text{user}} \times CF_{\text{pakar}}$$

Kombinasi dua bukti independen ($CF_1$ dan $CF_2$):
1. **Kasus 1: Kedua Bukti Bernilai Positif ($CF_1 > 0 \land CF_2 > 0$)**:
   $$CF_{\text{comb}} = CF_1 + CF_2 \cdot (1 - CF_1)$$
2. **Kasus 2: Kedua Bukti Bernilai Negatif ($CF_1 < 0 \land CF_2 < 0$)**:
   $$CF_{\text{comb}} = CF_1 + CF_2 \cdot (1 + CF_1)$$
3. **Kasus 3: Bukti Berlawanan Tanda ($CF_1 \cdot CF_2 < 0$)**:
   $$CF_{\text{comb}} = \frac{CF_1 + CF_2}{1 - \min(|CF_1|, |CF_2|)}$$

---

### 4.4 Tahap 4: Deterministic Decision Engine (Rules K-01 s/d K-10)

Sistem pakar mengintegrasikan skor geometris TOPSIS ($C_i$), bukti empiris CF ($CF$), dan aturan keselamatan beladiri IFMA:

| Kode Kaidah | Kondisi Logika (*Antecedent*) | Konsekuensi Keputusan (*Consequent*) |
| :--- | :--- | :--- |
| **K-01** | $C_i \ge 0.70 \land CF \ge 0.40 \land \text{Presensi} \ge 80\% \land \text{Bebas Cedera}$ | **SIAP** (Kelayakan Penuh) |
| **K-02** | $C_i \ge 0.45 \land CF \ge 0.00$ | **SIAP DENGAN CATATAN** (Kapasitas Menengah) |
| **K-03** | $C_i < 0.45 \lor CF < 0.00$ | **BELUM SIAP** (Under-preparedness) |
| **K-06 (Hard Gate)** | Skor C2 (Penguasaan Teknik Dasar) $< 3.0$ | **BELUM SIAP MUTLAK** (Diskualifikasi Wajib Keselamatan IFMA Rule 29) |
| **K-07 (Demotion)** | $CF \le -0.50$ (Bukti negatif kuat) | Demosi satu tingkat: $\text{SIAP} \to \text{BERSYARAT}$ atau $\text{BERSYARAT} \to \text{BELUM SIAP}$ |
| **K-10 (Medical)** | Status Cedera Aktif = `true` | **SIAP DENGAN CATATAN + MEDICAL SAFETY ALERT** (Wajib *medical clearance*) |

---

### 4.5 Tahap 5: AI Narrative Layer & Skema JSON RFC 8259

Sistem memanggil gateway 9Router lokal (`http://localhost:20128/v1`) dengan model combo **`MyCodeDec`** (Round-Robin). Respon diurai secara ketat menghasilkan struktur **JSON RFC 8259**:

```json
{
  "keputusanFinal": "SIAP | SIAP_DENGAN_CATATAN | BELUM_SIAP",
  "ringkasanEksekutif": "Ringkasan formal profil atlet...",
  "analisisKriteria": {
    "c1Anaerobik": { "nilai": 15.2, "satuan": "W/kg", "evaluasi": "...", "status": "BAIK" },
    "c2Teknik": { "nilai": 4.5, "satuan": "Skala 1-5", "skalaMaksimal": 5.0, "syaratMinimum": 3.0, "evaluasi": "...", "status": "BAIK" },
    "c3Vo2max": { "nilai": 56.0, "satuan": "ml/kg/min", "evaluasi": "...", "status": "BAIK" },
    "c4Pengalaman": { "nilai": 8, "satuan": "Partai", "evaluasi": "...", "status": "MATANG" },
    "kedisiplinanKehadiran": { "persentase": 94.0, "evaluasi": "...", "status": "DISIPLIN_TINGGI" }
  },
  "analisisSistemPakar": {
    "skorTopsisCi": 1.0000,
    "interpretasiTopsis": "...",
    "certaintyFactorCf": 0.9703,
    "interpretasiCf": "...",
    "aturanAktif": ["RULE-01: ..."]
  },
  "auditMedisDanBeratBadan": {
    "statusCedera": "Bebas Cedera",
    "catatanCedera": "Tidak ada riwayat cedera",
    "analisisBerat": "Berat 63.4 kg ideal pada batas kelas 63.5 kg",
    "peringatanMedis": false
  },
  "rekomendasiPelatih": ["..."],
  "instruksiOperasional": ["..."],
  "kesimpulan": "Uraian deskriptif komprehensif 4-6 kalimat yang mencakup justifikasi regulasi IFMA, profil fisik/teknik, mitigasi risiko medis, dan arahan manajerial Pengkot Muaythai Pontianak."
}
```

> [!IMPORTANT]
> **Pemberlakuan Guardrail FR-35**:
> Backend secara otomatis menimpa field `keputusanFinal` dengan nilai deterministik sistem pakar jika model LLM menghasilkan inkonsistensi narasi. Hal ini menjamin bahwa sistem pakar tetap 100% patuh pada aturan deterministik resmi.

---

## BAB V: CONTOH DATA INPUT & PERHITUNGAN LENGKAP 5 KASUS ATLET (SEMUA KEMUNGKINAN)

Untuk membuktikan determinisme sistem secara matematis, dilakukan simulasi pengujian pada kohort 5 atlet divisi **Light Welterweight (63.5 kg)** yang merepresentasikan seluruh cabang keputusan (*all possible branches*):

### 5.1 Parameter Masukan 5 Profil Atlet

| Kode Atlet | Nama Lengkap Atlet | Sasana / Camp | Berat Aktual | Presensi TC | Cedera Aktif & Catatan Medis | C1 (Anaerobik) | C2 (Teknik) | C3 (VO2max) | C4 (Partai) | C5 (Disiplin) | Skenario Pengujian |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **ATH-001** | **Rian Ardiansyah** | Khatulistiwa Camp | 63.4 kg | 94.0% | `false` (Bebas Cedera) | 15.2 W/kg | 4.5 / 5.0 | 56.0 ml/kg/min | 8 Partai | 94.0% | **Kasus 1: Kesiapan Prima (Rule K-01)** |
| **ATH-002** | **Bagus Pratama** | Pontianak Fight Club | 63.1 kg | 88.0% | `true` (Sprain ankle kanan derajat 1) | 13.8 W/kg | 4.0 / 5.0 | 51.5 ml/kg/min | 4 Partai | 88.0% | **Kasus 2: Medical Alert (Rule K-10 & K-02)** |
| **ATH-003** | **Doni Saputra** | Equator Muaythai | 63.5 kg | 76.0% | `false` (Bebas Cedera) | 12.2 W/kg | 3.8 / 5.0 | 48.0 ml/kg/min | 3 Partai | 76.0% | **Kasus 3: Kapasitas Menengah (Rule K-02)** |
| **ATH-004** | **Dedi Kusnadi** | Borneo Combat | 63.5 kg | 90.0% | `false` (Bebas Cedera) | 14.5 W/kg | **2.8 / 5.0** | 52.0 ml/kg/min | 2 Partai | 90.0% | **Kasus 4: Hard Gate Teknik (Rule K-06)** |
| **ATH-005** | **Eko Wahyudi** | Garasi Sasana | 65.2 kg | 52.0% | `false` (Bebas Cedera) | 9.2 W/kg | 3.1 / 5.0 | 42.0 ml/kg/min | 1 Partai | 52.0% | **Kasus 5: Under-Preparedness (Rule K-03)** |

---

### 5.2 Matriks Keputusan Mentah & Normalisasi Vektor Euclidean

#### 1. Matriks Keputusan ($X$)
$$
X = \begin{bmatrix}
15.2 & 4.5 & 56.0 & 8 & 94.0 \\
13.8 & 4.0 & 51.5 & 4 & 88.0 \\
12.2 & 3.8 & 48.0 & 3 & 76.0 \\
14.5 & 2.8 & 52.0 & 2 & 90.0 \\
9.2  & 3.1 & 42.0 & 1 & 52.0
\end{bmatrix}
$$

#### 2. Pembagi Euclidean Per Kolom ($\sqrt{\sum x_{kj}^2}$)
- **C1**: $\sqrt{15.2^2 + 13.8^2 + 12.2^2 + 14.5^2 + 9.2^2} = \sqrt{231.04 + 190.44 + 148.84 + 210.25 + 84.64} = \sqrt{865.21} = \mathbf{29.4145}$
- **C2**: $\sqrt{4.5^2 + 4.0^2 + 3.8^2 + 2.8^2 + 3.1^2} = \sqrt{20.25 + 16.00 + 14.44 + 7.84 + 9.61} = \sqrt{68.14} = \mathbf{8.2547}$
- **C3**: $\sqrt{56.0^2 + 51.5^2 + 48.0^2 + 52.0^2 + 42.0^2} = \sqrt{3136 + 2652.25 + 2304 + 2704 + 1764} = \sqrt{12560.25} = \mathbf{112.0725}$
- **C4**: $\sqrt{8^2 + 4^2 + 3^2 + 2^2 + 1^2} = \sqrt{64 + 16 + 9 + 4 + 1} = \sqrt{94} = \mathbf{9.6954}$
- **C5**: $\sqrt{94.0^2 + 88.0^2 + 76.0^2 + 90.0^2 + 52.0^2} = \sqrt{8836 + 7744 + 5776 + 8100 + 2704} = \sqrt{33160} = \mathbf{182.1000}$

#### 3. Matriks Ternormalisasi ($R$)
$$
R = \begin{bmatrix}
0.51675 & 0.54514 & 0.49968 & 0.82514 & 0.51620 \\
0.46916 & 0.48457 & 0.45952 & 0.41257 & 0.48325 \\
0.41476 & 0.46034 & 0.42830 & 0.30943 & 0.41735 \\
0.49295 & 0.33920 & 0.46399 & 0.20628 & 0.49423 \\
0.31277 & 0.37554 & 0.37476 & 0.10314 & 0.28556
\end{bmatrix}
$$

---

### 5.3 Matriks Ternormalisasi Terbobot ($V$)

Dikalikan bobot FAHP: $w = [0.4058, 0.4058, 0.1479, 0.0203, 0.0203]$:

$$
V = \begin{bmatrix}
0.20970 & 0.22122 & 0.07390 & 0.01675 & 0.01048 \\
0.19039 & 0.19664 & 0.06796 & 0.00838 & 0.00981 \\
0.16831 & 0.18681 & 0.06335 & 0.00628 & 0.00847 \\
0.20004 & 0.13765 & 0.06862 & 0.00419 & 0.01003 \\
0.12692 & 0.15240 & 0.05543 & 0.00209 & 0.00580
\end{bmatrix}
$$

---

### 5.4 Solusi Ideal Positif ($A^+$) & Solusi Ideal Negatif ($A^-$)

- **Solusi Ideal Positif ($A^+$)**:
  $$A^+ = \{ \max(v_1), \max(v_2), \max(v_3), \max(v_4), \max(v_5) \}$$
  $$A^+ = \{ 0.20970, 0.22122, 0.07390, 0.01675, 0.01048 \}$$
- **Solusi Ideal Negatif ($A^-$)**:
  $$A^- = \{ \min(v_1), \min(v_2), \min(v_3), \min(v_4), \min(v_5) \}$$
  $$A^- = \{ 0.12692, 0.13765, 0.05543, 0.00209, 0.00580 \}$$

---

### 5.5 Jarak Euclidean ($D^+, D^-$) & Skor Kedekatan TOPSIS ($C_i$)

| Peringkat | Atlet | Jarak Positif ($D_i^+$) | Jarak Negatif ($D_i^-$) | Skor Kedekatan ($C_i$) | Interpretasi Geometris |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **1** | **Rian Ardiansyah** | $0.0000$ | $0.1201$ | **$1.0000$** | Identik 100% dengan profil juara ideal ($A^+$). |
| **2** | **Bagus Pratama** | $0.0329$ | $0.0879$ | **$0.7275$** | Sangat dekat dengan solusi ideal positif ($C_i > 0.70$). |
| **3** | **Doni Saputra** | $0.0559$ | $0.0649$ | **$0.5375$** | Berada di zona tengah/kondisional ($0.45 \le C_i < 0.70$). |
| **4** | **Dedi Kusnadi** | $0.0852$ | $0.0745$ | **$0.4663$** | Fisik cukup ($C_i \ge 0.45$), namun terbentur syarat wajib. |
| **5** | **Eko Wahyudi** | $0.1103$ | $0.0148$ | **$0.1180$** | Sangat dekat dengan solusi ideal negatif ($A^-$). |

---

### 5.6 Perhitungan Bukti Empiris & Kombinasi Certainty Factor ($CF$)

#### 1. ATH-001 (Rian Ardiansyah):
- Aturan aktif: CF-R01 ($+0.60$), CF-R04 ($+0.55$), CF-R06 ($+0.50$), CF-R07 ($+0.45$), CF-R08 ($+0.40$).
- Kombinasi berantai positif:
  - $CF_{1,2} = 0.60 + 0.55(1 - 0.60) = 0.8200$
  - $CF_{1,2,3} = 0.82 + 0.50(1 - 0.82) = 0.9100$
  - $CF_{1,2,3,4} = 0.91 + 0.45(1 - 0.91) = 0.9505$
  - $CF_{\text{akhir}} = 0.9505 + 0.40(1 - 0.9505) = \mathbf{+0.9703}$

#### 2. ATH-002 (Bagus Pratama):
- Bukti positif: CF-R01 (presensi 88% $\implies +0.60$), CF-R06 (teknik 4.0 $\implies +0.50$).
  - $CF_{\text{pos}} = 0.60 + 0.50(1 - 0.60) = \mathbf{+0.8000}$
- Bukti negatif: CF-R03 (cedera aktif sprain ankle $\implies \mathbf{-0.7000}$).
- Kombinasi tanda berlawanan:
  $$CF_{\text{akhir}} = \frac{0.8000 + (-0.7000)}{1 - \min(|0.8000|, |-0.7000|)} = \frac{0.1000}{1 - 0.7000} = \frac{0.1000}{0.3000} = \mathbf{+0.3333}$$

#### 3. ATH-003 (Doni Saputra):
- Parameter berada di zona tengah (tidak memicu aturan ekstrem):
  - Presensi 76% (di bawah 80%, di atas 60% $\implies$ neutral)
  - C1 = 12.2 (di bawah 14, di atas 10 $\implies$ neutral)
  - C2 = 3.8 (di bawah 4.0 $\implies$ neutral)
  - C3 = 48.0 (di bawah 52 $\implies$ neutral)
  - C4 = 3 partai (di bawah 5 partai $\implies$ neutral)
  - Bebas cedera
- $CF_{\text{akhir}} = \mathbf{0.0000}$ (Netral).

#### 4. ATH-004 (Dedi Kusnadi):
- Aturan aktif: CF-R01 (presensi 90% $\implies +0.60$), CF-R04 (C1 = 14.5 $\implies +0.55$), CF-R07 (C3 = 52.0 $\implies +0.45$).
- Kombinasi berantai positif:
  - $CF_{1,2} = 0.60 + 0.55(1 - 0.60) = 0.8200$
  - $CF_{\text{akhir}} = 0.82 + 0.45(1 - 0.82) = \mathbf{+0.9010}$
  - Catatan: Meskipun $CF = +0.9010$, atlet gagal pada kriteria wajib C2.

#### 5. ATH-005 (Eko Wahyudi):
- Bukti negatif: CF-R02 (presensi 52% $< 60\% \implies -0.50$), CF-R05 (anaerobik 9.2 W/kg $< 10 \implies -0.60$).
- Kombinasi berantai negatif:
  $$CF_{\text{akhir}} = -0.50 + (-0.60) \cdot (1 + (-0.50)) = -0.50 - 0.30 = \mathbf{-0.8000}$$

---

### 5.7 Evaluasi Kaidah IFMA & Penetapan Kategori Akhir

| Atlet | $C_i$ | $CF$ | C2 (Teknik) | Status Cedera | Kaidah Keputusan Aktif | Kategori Final Sistem Pakar | Lencana / Catatan Khusus |
| :--- | :---: | :---: | :---: | :---: | :--- | :---: | :--- |
| **Rian Ardiansyah** | $1.0000$ | $+0.9703$ | $4.5 \ge 3.0$ | Bebas | **Rule K-01** ($C_i \ge 0.70 \land CF \ge 0.40$) | **SIAP** | **Juara Ideal Divisi** |
| **Bagus Pratama** | $0.7275$ | $+0.3333$ | $4.0 \ge 3.0$ | **Cedera Aktif** | **Rule K-02** & **Rule K-10** (Safety Alert) | **SIAP DENGAN CATATAN** | **Lencana Peringatan Medis** |
| **Doni Saputra** | $0.5375$ | $0.0000$ | $3.8 \ge 3.0$ | Bebas | **Rule K-02** ($0.45 \le C_i < 0.70 \land CF \ge 0.0$) | **SIAP DENGAN CATATAN** | **Kapasitas Menengah** |
| **Dedi Kusnadi** | $0.4663$ | $+0.9010$ | **$2.8 < 3.0$** | Bebas | **Hard Gate K-06** (Pelanggaran Syarat Wajib) | **BELUM SIAP** | **Diskualifikasi Wajib IFMA** |
| **Eko Wahyudi** | $0.1180$ | $-0.8000$ | $3.1 \ge 3.0$ | Bebas | **Rule K-03** ($C_i < 0.45 \lor CF < 0.0$) | **BELUM SIAP** | **Under-Preparedness** |

---

### 5.8 Sampel Output JSON RFC 8259 dari AI Narrative Layer (Kasus 2 - Bagus Pratama)

```json
{
  "keputusanFinal": "SIAP_DENGAN_CATATAN",
  "ringkasanEksekutif": "Atlet Bagus Pratama memiliki profil kebugaran fisik dan penguasaan teknik yang sangat kompetitif (TOPSIS Ci = 0.7275), namun wajib menjalani observasi medis ketat akibat sprain ankle kanan derajat 1 yang masih dalam tahap pemulihan.",
  "analisisKriteria": {
    "c1Anaerobik": {
      "nilai": 13.8,
      "satuan": "W/kg",
      "evaluasi": "Daya ledak pukulan dan tendangan sangat baik, mendekati batas eksplosif prima 14 W/kg.",
      "status": "BAIK"
    },
    "c2Teknik": {
      "nilai": 4.0,
      "satuan": "Skala 1-5",
      "skalaMaksimal": 5.0,
      "syaratMinimum": 3.0,
      "evaluasi": "Penguasaan teknik delapan organ tubuh sangat solid dan mematuhi IFMA Rule 29.",
      "status": "BAIK"
    },
    "c3Vo2max": {
      "nilai": 51.5,
      "satuan": "ml/kg/min",
      "evaluasi": "Kapasitas kardiorespirasi mencukupi untuk mempertahankan tempo 3 ronde.",
      "status": "BAIK"
    },
    "c4Pengalaman": {
      "nilai": 4,
      "satuan": "Partai",
      "evaluasi": "Memiliki jam terbang tanding regional yang memadai.",
      "status": "MENENGAH"
    },
    "kedisiplinanKehadiran": {
      "persentase": 88.0,
      "evaluasi": "Kehadiran TC 88% membuktikan komitmen disiplin latihan yang tinggi.",
      "status": "DISIPLIN_TINGGI"
    }
  },
  "analisisSistemPakar": {
    "skorTopsisCi": 0.7275,
    "interpretasiTopsis": "Profil fisik atlet memiliki kedekatan 72.75% terhadap profil atlet juara ideal.",
    "certaintyFactorCf": 0.3333,
    "interpretasiCf": "Tingkat keyakinan positif moderat karena tereduksi oleh penalti cedera aktif (CF -0.70).",
    "aturanAktif": [
      "RULE-02: Ci (0.728) >= 0.45 AND CF (0.333) >= 0.0",
      "RULE-INJURY-SAFETY (K-10): Terdeteksi cedera aktif (Sprain ankle kanan derajat 1). Wajib rujukan medis formal."
    ]
  },
  "auditMedisDanBeratBadan": {
    "statusCedera": "CEDERA AKTIF (Dalam Rehabilitasi)",
    "catatanCedera": "Sprain ankle kanan derajat 1 (masih masa rehabilitasi)",
    "analisisBerat": "Berat badan riil 63.1 kg berada pada zona aman kelas Light Welterweight (63.5 kg), bebas risiko dehidrasi akut.",
    "peringatanMedis": true
  },
  "rekomendasiPelatih": [
    "Batasi porsi latihan sparring kontak penuh pada tumpuan kaki kanan selama 7 hari ke depan.",
    "Fokuskan sesi latihan pada penguatan upper-body boxing dan taktik clinch tanpa bantingan keras.",
    "Lakukan fisioterapi ankle strengthening dan latihan proprioseptif setiap pagi."
  ],
  "instruksiOperasional": [
    "Wajib memperoleh surat izin bertanding tertulis (medical clearance) dari dokter kontingen sebelum timbang badan.",
    "Pantau stabilitas ligamen ankle kanan pada uji timbang badan resmi IFMA."
  ],
  "kesimpulan": "Berdasarkan evaluasi regulasi resmi IFMA dan komputasi hibrida sistem pakar, atlet Bagus Pratama ditetapkan berstatus SIAP DENGAN CATATAN. Kapasitas kardiorespirasi dan teknik delapan organ atlet telah memenuhi standar kejuaraan, namun cedera sprain ankle kanan derajat 1 berpotensi mengalami re-injury jika dipaksakan bertanding tanpa proteksi medis. Tim pelatih dan tim medis Pengkot Muaythai Kota Pontianak diinstruksikan untuk membatasi latihan impak tumpuan kaki dan mewajibkan izin tertulis dokter spesialis sebelum atlet diberangkatkan ke kejuaraan resmi."
}
```

---

## BAB VI: TABEL PENGETESAN MENYELURUH SEMUA KEMUNGKINAN DATA & OUTPUT

Untuk memastikan keandalan sistem terhadap variasi data masukan, dilakukan pengujian perangkat lunak berbasis metode rekayasa perangkat lunak standar:

### 6.1 Analisis Nilai Batas (*Boundary Value Analysis / BVA*)

| Parameter Diuji | Nilai Batas Ambang | Nilai Input Uji | Output Keputusan Sistem | Status Evaluasi | Justifikasi Regulasi IFMA |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Kriteria Wajib C2 (Teknik)** | $3.00$ | $2.99$ | **BELUM SIAP** | **LULUS (Passed)** | Memicu Hard Gate K-06, dilarang tanding demi keselamatan. |
| **Kriteria Wajib C2 (Teknik)** | $3.00$ | $3.00$ | **SIAP DENGAN CATATAN** | **LULUS (Passed)** | Tepat memenuhi batas minimum syarat wajib IFMA Rule 29. |
| **Ambang Kesiapan TOPSIS ($C_i$)** | $0.700$ | $0.699$ | **SIAP DENGAN CATATAN** | **LULUS (Passed)** | Berada di zona batas (*borderline*), memicu Rule K-02. |
| **Ambang Kesiapan TOPSIS ($C_i$)** | $0.700$ | $0.700$ | **SIAP** | **LULUS (Passed)** | Memenuhi ambang batas kesiapan prima Rule K-01. |
| **Ambang Minimum TOPSIS ($C_i$)** | $0.450$ | $0.449$ | **BELUM SIAP** | **LULUS (Passed)** | Masuk zona ketidaksiapan fisik Rule K-03. |
| **Ambang Minimum TOPSIS ($C_i$)** | $0.450$ | $0.450$ | **SIAP DENGAN CATATAN** | **LULUS (Passed)** | Tepat di batas bawah kelaikan bersyarat. |
| **Presensi Latihan TC (Disiplin)** | $80.0\%$ | $79.9\%$ | **CF-R01 Inaktif** | **LULUS (Passed)** | Tidak memperoleh poin keyakinan disiplin $+0.60$. |
| **Presensi Latihan TC (Disiplin)** | $80.0\%$ | $80.0\%$ | **CF-R01 Aktif** | **LULUS (Passed)** | Memicu bukti empiris disiplin tinggi ($CF = +0.60$). |
| **Presensi Latihan Ekstrem Rendah** | $60.0\%$ | $59.9\%$ | **CF-R02 Aktif** | **LULUS (Passed)** | Memicu penalti indisipliner berat ($CF = -0.50$). |

---

### 6.2 Partisi Ekivalensi (*Equivalence Partitioning*)

| Partisi Kelas Input | Rentang Nilai Parameter | Respon Sistem yang Diharapkan | Hasil Uji Nyata | Kesimpulan |
| :--- | :--- | :--- | :--- | :---: |
| **Kelas Siap Penuh** | $C_i \ge 0.70, CF \ge 0.40, \text{Bebas Cedera}$ | Status `SIAP`, badge hijau, tanpa peringatan medis. | Status `SIAP`, hijau | **VALID** |
| **Kelas Bersyarat Medis** | $C_i \ge 0.45, CF \ge 0.00, \text{Cedera Aktif}$ | Status `SIAP DENGAN CATATAN`, memicu lencana `Peringatan Medis`. | Status `SIAP DENGAN CATATAN`, badge medis aktif | **VALID** |
| **Kelas Bersyarat Fisik** | $0.45 \le C_i < 0.70, CF \ge 0.00, \text{Bebas Cedera}$ | Status `SIAP DENGAN CATATAN`, badge kuning, kapasitas menengah. | Status `SIAP DENGAN CATATAN`, kuning | **VALID** |
| **Kelas Gagal Hard Gate** | $C_i \ge 0.70, C2 < 3.00$ | Diturunkan mutlak ke `BELUM SIAP` (Hard Gate K-06). | Status `BELUM SIAP`, merah | **VALID** |
| **Kelas Ketidaksiapan Total** | $C_i < 0.45 \lor CF < 0.00$ | Status `BELUM SIAP`, badge merah, rekomendasi TC ulang. | Status `BELUM SIAP`, merah | **VALID** |

---

### 6.3 Pengujian Skenario Ekstrem, Anomali & Pemulihan (*Fault Injection*)

| Kasus Uji | Skenario Pengujian | Perilaku Sistem (*Observed Behavior*) | Mekanisme Pemulihan / Toleransi | Status |
| :---: | :--- | :--- | :--- | :---: |
| **ST-01** | Gateway 9Router offline / mati saat tombol "Generate AI" diklik. | Menangkap error fetch koneksi, langsung mengaktifkan `generateDeterministicStructuredExplanation()`. | Respon instan $< 20\text{ ms}$, format JSON 100% identik tanpa error di UI. | **PASSED** |
| **ST-02** | Gateway 9Router lambat / menggantung (*hang*) $> 25\text{ detik}$. | Signal `AbortController` memutus permintaan pada detik ke-25, melakukan 1x rotasi, lalu fallback. | Menghindari UI *freezing*, fallback deterministik otomatis ditampilkan. | **PASSED** |
| **ST-03** | Model LLM mengembalikan respon dalam aliran Server-Sent Events (`data: {"id": ...}`). | Parser SSE mengurai potongan token `delta.content` dan menyusun ulang string JSON utuh. | JSON berhasil diurai tanpa error sintaks `Unexpected token 'd'`. | **PASSED** |
| **ST-04** | Model reasoning (Nemotron/DeepSeek) menghabiskan kuota token pada `reasoning_content`. | Parser memeriksa keberadaan field `reasoning_content` jika `content` kosong, atau rotasi ke model berikutnya. | Ekstraksi JSON dari blok markdown berhasil. | **PASSED** |
| **ST-05** | Model LLM mencoba memvonis `SIAP` padahal atlet memiliki $C2 < 3.0$. | Backend menerapkan Guardrail FR-35 yang menimpa `keputusanFinal` menjadi `BELUM_SIAP`. | Kedaulatan deterministik sistem pakar terjaga 100%. | **PASSED** |

---

### 6.4 Matriks Hasil Uji 10 Kasus Uji Lengkap (TC-01 s/d TC-10)

| ID Uji | Modul Diuji | Kondisi Pengujian Masukan | Ekspektasi Output | Hasil Aktual | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | FAHP Engine | Matriks TFN berpasangan $5 \times 5$ | Bobot $w$, $CR = 0.0059 < 0.10$ | $w = [0.4058, 0.4058, 0.1479, 0.0203, 0.0203]$ | **PASS** |
| **TC-02** | TOPSIS Engine | Kohort 5 atlet divisi 63.5 kg | $C_i \in [0.0000, 1.0000]$ terurut | $C_1=1.0000, C_2=0.7275, C_3=0.5375, C_4=0.4663, C_5=0.1180$ | **PASS** |
| **TC-03** | CF Engine | Atlet dengan presensi 94% + C1 tinggi | $CF \in [-1.0, +1.0]$, bukti positif terakumulasi | $CF = +0.9703$ | **PASS** |
| **TC-04** | CF Engine | Atlet dengan cedera aktif (sprain ankle) | Penalti $CF = -0.70$ mereduksi bukti positif | $CF = +0.3333$ | **PASS** |
| **TC-05** | Decision Engine | Atlet skor tinggi tapi $C2 = 2.8$ | Diskualifikasi wajib menjadi `BELUM_SIAP` | Vonis `BELUM_SIAP` (Hard Gate K-06 aktif) | **PASS** |
| **TC-06** | Decision Engine | Atlet $C_i = 0.7275$ dengan cedera aktif | Demosi ke `SIAP_DENGAN_CATATAN` + Lencana Medis | Vonis `SIAP_DENGAN_CATATAN`, Medical Alert: TRUE | **PASS** |
| **TC-07** | CRUD Form | Tambah atlet baru melalui form | Atlet muncul di tabel klasemen dan terhitung | Klasemen bertambah, perankingan real-time | **PASS** |
| **TC-08** | CRUD Form | Klik tombol edit pada baris atlet | Data termuat di form, scroll mulus | Form terisi nilai atlet yang dipilih | **PASS** |
| **TC-09** | CRUD Form | Klik tombol hapus atlet | Dialog konfirmasi muncul, atlet terhapus | Atlet terhapus dari tabel dan memori | **PASS** |
| **TC-10** | Live LLM Checker | Cek endpoint `/api/ai-status` | Respon JSON koneksi model `MyCodeDec` | Respon `connected: true, model: MyCodeDec, 520ms` | **PASS** |

---

## BAB VII: CHECKLIST & VERIFIKASI FITUR SISTEM

| No | Modul / Fitur Antarmuka | Lokasi Komponen Kode | Kondisi & Verifikasi Teknis | Status Fitur |
| :---: | :--- | :--- | :--- | :---: |
| **1** | **Header Resmi & Logo IFMA Berbingkai** | [`Header.tsx`](file:///d:/Sistem_PakarMY/src/components/layout/Header.tsx) | Logo IFMA melingkar disematkan di dalam bingkai emas (`border-2 border-accent-gold/80 shadow-gold-glow`). Teks divisi statis dan AHP CR telah dibersihkan. | **VERIFIED** |
| **2** | **Live LLM Connection Status** | [`Header.tsx`](file:///d:/Sistem_PakarMY/src/components/layout/Header.tsx)<br>[`/api/ai-status`](file:///d:/Sistem_PakarMY/src/app/api/ai-status/route.ts) | Ping otomatis setiap 30 detik ke port 20128. Menampilkan titik hijau berdenyut jika `MyCodeDec` online beserta latensi milidetik, atau merah jika offline. Dilengkapi tombol refresh manual. | **VERIFIED** |
| **3** | **Tema Gelap & Terang (*Dark/Light Mode*)** | [`Header.tsx`](file:///d:/Sistem_PakarMY/src/components/layout/Header.tsx)<br>[`globals.css`](file:///d:/Sistem_PakarMY/src/app/globals.css) | Tombol toggle Sun/Moon dengan transisi warna halus. State tema tersimpan di `localStorage` dan diproteksi dari FOUC via inline script di `layout.tsx`. | **VERIFIED** |
| **4** | **Formulir Evaluasi Atlet & Preset** | [`IndividualAthleteEvaluator.tsx`](file:///d:/Sistem_PakarMY/src/components/dashboard/IndividualAthleteEvaluator.tsx) | Form lengkap metrik C1–C5, berat aktual, status cedera, catatan medis, tombol Quick Preset (Siap, Cedera, Belum Siap, Reset). | **VERIFIED** |
| **5** | **Tabel Klasemen Roster Divisi (CRUD)** | [`AthleteTable.tsx`](file:///d:/Sistem_PakarMY/src/components/dashboard/AthleteTable.tsx) | Tabel klasemen terurut berdasarkan skor $C_i$ TOPSIS. Tombol inline Edit (muat ke form) dan Hapus dengan modal konfirmasi dialog. | **VERIFIED** |
| **6** | **Audit Matematis & Dekomposisi Vektor** | [`FuzzyAhpPanel.tsx`](file:///d:/Sistem_PakarMY/src/components/dashboard/FuzzyAhpPanel.tsx)<br>[`MathBreakdownModal.tsx`](file:///d:/Sistem_PakarMY/src/components/dashboard/MathBreakdownModal.tsx) | Modal pop-up yang menampilkan matriks perbandingan berpasangan, nilai sintesis TFN, derajat kemungkinan, jarak $D^+/D^-$, dan verifikasi konsistensi $CR = 0.0059$. | **VERIFIED** |
| **7** | **Dwi-Mode Penampil Narasi AI** | [`IndividualAthleteEvaluator.tsx`](file:///d:/Sistem_PakarMY/src/components/dashboard/IndividualAthleteEvaluator.tsx) | Pilihan tampilan: **Mode Kartu Terstruktur** (kartu eksekutif berbingkai emas) dan **Mode JSON RAW** (blok kode monospace). | **VERIFIED** |
| **8** | **Salin JSON 1-Klik** | [`IndividualAthleteEvaluator.tsx`](file:///d:/Sistem_PakarMY/src/components/dashboard/IndividualAthleteEvaluator.tsx) | Tombol copy to clipboard dengan feedback visual ("TERSALIN!") untuk memudahkan integrasi data laporan. | **VERIFIED** |
| **9** | **Panduan Bahasa Sederhana** | [`BeginnerFriendlyGuide.tsx`](file:///d:/Sistem_PakarMY/src/components/dashboard/BeginnerFriendlyGuide.tsx) | Panel penjelasan arti output matematika (TOPSIS, Certainty Factor, bobot kriteria) dalam analogi beladiri yang mudah dipahami pelatih non-teknis. | **VERIFIED** |

---

## BAB VIII: MATRIKS KETERLACAKAN KEBUTUHAN (RTM)

| Kode Kebutuhan | Deskripsi Kebutuhan Sistem | File Implementasi Kode Program | Status Pengujian |
| :--- | :--- | :--- | :---: |
| **FR-01 s/d FR-04** | Kriteria, Fuzzy AHP (Chang + Zhu), Uji Konsistensi CR | [`src/lib/engine/fuzzy-ahp.ts`](file:///d:/Sistem_PakarMY/src/lib/engine/fuzzy-ahp.ts) | **PASSED** ($CR = 0.0059$) |
| **FR-05 s/d FR-10** | Formulir Atlet & Operasi CRUD Roster Divisi | [`IndividualAthleteEvaluator.tsx`](file:///d:/Sistem_PakarMY/src/components/dashboard/IndividualAthleteEvaluator.tsx)<br>[`AthleteTable.tsx`](file:///d:/Sistem_PakarMY/src/components/dashboard/AthleteTable.tsx) | **PASSED** (Live CRUD) |
| **FR-11 s/d FR-15** | Normalisasi Vektor Euclidean & TOPSIS ($A^+, A^-, C_i$) | [`src/lib/engine/topsis.ts`](file:///d:/Sistem_PakarMY/src/lib/engine/topsis.ts) | **PASSED** ($C_i \in [0, 1]$) |
| **FR-16 s/d FR-20** | Kaidah Heuristik & Kombinasi Certainty Factor MYCIN | [`src/lib/engine/certainty-factor.ts`](file:///d:/Sistem_PakarMY/src/lib/engine/certainty-factor.ts) | **PASSED** ($CF \in [-1, +1]$) |
| **FR-21 s/d FR-27** | Decision Engine, Hard Gate K-06, K-07, Medical Alert K-10 | [`src/lib/engine/decision-engine.ts`](file:///d:/Sistem_PakarMY/src/lib/engine/decision-engine.ts) | **PASSED** (Semua Aturan) |
| **FR-28** | Live LLM Connection Checker Gateway 9Router | [`src/app/api/ai-status/route.ts`](file:///d:/Sistem_PakarMY/src/app/api/ai-status/route.ts) | **PASSED** (HTTP 200) |
| **FR-29 s/d FR-34** | AI Explanation Service, Model MyCodeDec, Guardrail FR-35 | [`src/lib/services/ai-explanation.ts`](file:///d:/Sistem_PakarMY/src/lib/services/ai-explanation.ts)<br>[`src/app/api/explain/route.ts`](file:///d:/Sistem_PakarMY/src/app/api/explain/route.ts) | **PASSED** (RFC 8259) |
| **FR-35 s/d FR-36** | Dwi-Mode Kartu/RAW JSON & Tombol Salin 1-Klik | [`IndividualAthleteEvaluator.tsx`](file:///d:/Sistem_PakarMY/src/components/dashboard/IndividualAthleteEvaluator.tsx) | **PASSED** |
| **FR-37 s/d FR-38** | Toggle Tema Gelap/Terang & Logo Resmi IFMA Berbingkai | [`Header.tsx`](file:///d:/Sistem_PakarMY/src/components/layout/Header.tsx)<br>[`globals.css`](file:///d:/Sistem_PakarMY/src/app/globals.css) | **PASSED** |
| **NFR-01** | Determinisme Komputasi & Verifikasi Audit | [`src/lib/engine/test-simulation.ts`](file:///d:/Sistem_PakarMY/src/lib/engine/test-simulation.ts) | **VERIFIED 100%** |
| **NFR-04** | Perlindungan Kredensial & Sanitasi Privasi | [`.gitignore`](file:///d:/Sistem_PakarMY/.gitignore) • [`.env.example`](file:///d:/Sistem_PakarMY/.env.example) | **AUDITED SECURE** |
| **NFR-05** | Desain Antarmuka Taktis Beladiri Anti-Slop | [`SKILL.md`](file:///d:/Sistem_PakarMY/SKILL.md) • [`globals.css`](file:///d:/Sistem_PakarMY/src/app/globals.css) | **COMPLIANT** |
| **NFR-09** | Konfigurasi Deployment Serverless Vercel | [`vercel.json`](file:///d:/Sistem_PakarMY/vercel.json) | **READY (sin1)** |

---

## BAB IX: PANDUAN INSTALASI, KONFIGURASI 9ROUTER & DEPLOYMENT

### 9.1 Petunjuk Menjalankan di Lingkungan Lokal
1. **Klon Repositori**:
   ```bash
   git clone https://github.com/riantonyc/Sistem_PakarMY.git
   cd Sistem_PakarMY
   ```
2. **Instalasi Dependensi**:
   ```bash
   npm install
   ```
3. **Konfigurasi Variabel Lingkungan (`.env`)**:
   Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:
   ```env
   # Basis Data PostgreSQL
   DATABASE_URL="postgresql://postgres:password@localhost:5432/muaythai_db?schema=public"

   # AI Gateway (9Router Lokal)
   NINE_ROUTER_ENDPOINT="http://localhost:20128/v1"
   AI_EXPLANATION_MODEL="MyCodeDec"
   AI_GATEWAY_API_KEY="" # Kosongkan jika tanpa auth atau isi token 9Router Anda
   ```
4. **Inisialisasi Prisma & Build**:
   ```bash
   npx prisma generate
   npm run build
   ```
5. **Menjalankan Server**:
   ```bash
   npm run start -p 3001
   # atau untuk mode pengembangan:
   npm run dev -p 3001
   ```
   Aplikasi dapat diakses melalui peramban web pada alamat: `http://localhost:3001`.

### 9.2 Konfigurasi 9Router Gateway & Model Combo MyCodeDec
1. Pastikan aplikasi desktop 9Router aktif pada port default `20128`.
2. Pada tab **Combos**, buat atau pastikan combo **`MyCodeDec`** terdaftar dengan strategi **Round Robin**.
3. Pastikan pool model mencakup Claude Haiku, Gemini Flash, Nemotron, atau DeepSeek.
4. Header aplikasi akan otomatis menampilkan indikator hijau `LLM: MyCodeDec (TERHUBUNG)` saat gateway aktif.

### 9.3 Prosedur Deployment Serverless ke Vercel (Region `sin1`)
Aplikasi telah dilengkapi dengan berkas konfigurasi [`vercel.json`](file:///d:/Sistem_PakarMY/vercel.json):
```json
{
  "buildCommand": "prisma generate && next build",
  "regions": ["sin1"]
}
```
Langkah deploy di dashboard Vercel:
1. Impor repositori `https://github.com/riantonyc/Sistem_PakarMY.git`.
2. Masukkan Environment Variables:
   - `DATABASE_URL`: URI koneksi PostgreSQL (misal Neon Serverless Postgres).
   - `NINE_ROUTER_ENDPOINT`: URL tunnel publik gateway 9Router jika ingin menghubungkan AI secara remote, atau biarkan kosong untuk menggunakan fallback deterministik resmi (FR-37).
3. Klik **Deploy**. Aplikasi akan live dalam hitungan detik dengan latensi ultra rendah di kawasan Asia Tenggara.

---

**PENGURUS KOTA MUAYTHAI KOTA PONTIANAK**  
*Komisi Pembinaan Prestasi, Litbang & Pertandingan Resmi — Tahun Anggaran 2026*  
*Dokumen Master Terpadu Sistem Pakar Kesiapan Atlet Muaythai (IFMA Rules)*
