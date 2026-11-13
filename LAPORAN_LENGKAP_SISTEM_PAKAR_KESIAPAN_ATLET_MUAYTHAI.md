# LAPORAN KOMPREHENSIF SISTEM PAKAR KESIAPAN ATLET MUAYTHAI
## PENGURUS KOTA MUAYTHAI KOTA PONTIANAK
### Berbasis Standar Regulasi IFMA & Metode Hibrida Fuzzy AHP – TOPSIS – Certainty Factor

---

## DAFTAR ISI
1. [BAB I: PENDAHULUAN & LATAR BELAKANG](#bab-i-pendahuluan--latar-belakang)
2. [BAB II: SPESIFIKASI KEBUTUHAN SISTEM (SRS)](#bab-ii-spesifikasi-kebutuhan-sistem-srs)
   - 2.1 Kebutuhan Fungsional (Functional Requirements)
   - 2.2 Kebutuhan Non-Fungsional (Non-Functional Requirements)
   - 2.3 Spesifikasi Lingkungan Perangkat Keras & Lunak
   - 2.4 Arsitektur Basis Data (PostgreSQL & Prisma Schema)
3. [BAB III: LANDASAN TEORI & FORMULASI MATEMATIS METODE HIBRIDA](#bab-iii-landasan-teori--formulasi-matematis-metode-hibrida)
   - 3.1 Tahap 1: Fuzzy Analytic Hierarchy Process (FAHP) Chang (1996)
   - 3.2 Resolusi Anomali Bobot Nol (Zhu et al., 1999)
   - 3.3 Uji Konsistensi Matriks Saaty (Consistency Ratio)
   - 3.4 Tahap 2: TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution)
   - 3.5 Tahap 3: Certainty Factor (Shortliffe & Buchanan / MYCIN)
   - 3.6 Tahap 4: Decision Engine & Kaidah Produksi (IFMA Production Rules)
4. [BAB IV: SIMULASI PERHITUNGAN NUMERIK STEP-BY-STEP](#bab-iv-simulasi-perhitungan-numerik-step-by-step)
   - 4.1 Data Mentah Kohort Atlet Uji
   - 4.2 Eksekusi FAHP & Bobot Kriteria
   - 4.3 Matriks Ternormalisasi & Solusi Ideal TOPSIS
   - 4.4 Perhitungan Certainty Factor Tiap Atlet
   - 4.5 Klasifikasi Akhir & Audit Keselamatan
5. [BAB V: INTEGRASI AI GATEWAY 9ROUTER & TEMPLATE JSON RFC 8259](#bab-v-integrasi-ai-gateway-9router--template-json-rfc-8259)
6. [BAB VI: PANDUAN INSTALASI, PENGUJIAN & DEPLOYMENT VERCEL](#bab-vi-panduan-instalasi-pengujian--deployment-vercel)
7. [BAB VII: KESIMPULAN & REKOMENDASI MANAJERIAL](#bab-vii-kesimpulan--rekomendasi-manajerial)

---

## BAB I: PENDAHULUAN & LATAR BELAKANG

### 1.1 Latar Belakang Masalah
Muaythai merupakan cabang olahraga beladiri kontak penuh (*full contact combat sport*) yang diatur secara global oleh **International Federation of Muaythai Associations (IFMA)**. Karakteristik pertandingan Muaythai menuntut kesiapan menyeluruh yang melibatkan aspek daya ledak anaerobik (kekuatan pukulan, tendangan, dorongan *teep*, bantingan), daya tahan aerobik ($\text{VO}_2\text{max}$ untuk mempertahankan ritme intensitas tinggi sepanjang 3 ronde $\times$ 3 menit), kematangan penguasaan teknik dasar delapan organ tubuh (*clinch, knee, elbow, kicks, punches*), jam terbang tanding resmi, serta kedisiplinan dan status bebas cedera aktif.

Sebelum dikembangkannya sistem ini, penentuan kelayakan tanding atlet di lingkungan Pengkot Muaythai Kota Pontianak menghadapi kendala utama:
1. **Subjektivitas Penilaian Pelatih**: Penentuan atlet siap bertanding seringkali didominasi intuisi atau kedekatan emosional, tanpa standarisasi kuantitatif yang objektif.
2. **Ketiadaan Pembobotan Ilmiah**: Kriteria fisik (daya anaerobik) dan kriteria keselamatan teknik diperlakukan setara tanpa memperhitungkan tingkat kepentingannya terhadap regulasi ring.
3. **Risiko Keselamatan Atlet (Medical Danger)**: Pengabaian cedera aktif atau penurunan berat badan ekstrem (*weight cut crash*) membahayakan nyawa atlet dan melanggar prinsip *Duty of Care* IFMA.
4. **Ketidakpastian Data Lapangan**: Fluktuasi kehadiran latihan pemusatan (*training camp*) dan riwayat medis membutuhkan kalkulasi faktor keyakinan (*certainty*) yang dapat dipertanggungjawabkan dalam sidang arbitrase olahraga.

### 1.2 Tujuan Pembangunan Sistem
Sistem Pakar ini dirancang sebagai platform pendukung keputusan berbasis web (*web-based expert system*) dengan arsitektur **hibrida tiga lapis**:
1. **Fuzzy AHP (Chang 1996 + Zhu et al. 1999)**: Menghitung bobot prioritas kriteria secara objektif dan menyelesaikan ambiguitas preferensi pakar tanpa anomali bobot nol.
2. **TOPSIS (Hwang & Yoon 1981)**: Menilai kedekatan fisik atlet secara geometris terhadap profil atlet juara ideal ($A^+$) dan atlet terburuk ($A^-$).
3. **Certainty Factor (Shortliffe & Buchanan 1975)**: Mengakomodasi tingkat keyakinan terhadap fakta empiris lapangan (absen TC, rekam cedera, performa tanding).
4. **Decision Engine & Production Rules**: Menetapkan vonis kelayakan (*SIAP*, *SIAP DENGAN CATATAN*, *BELUM SIAP*) dengan penguncian gerbang wajib (*Hard Gates*) dan protokol keselamatan medis.
5. **LLM Structured Narrative (9Router / MyCodeDec)**: Menyajikan narasi laporan eksekutif dan rekomendasi taktis bagi pelatih dalam format terstruktur **JSON RFC 8259** tanpa mengubah ketetapan sistem deterministik (SRS FR-33 s/d FR-38).

---

## BAB II: SPESIFIKASI KEBUTUHAN SISTEM (SRS)

### 2.1 Kebutuhan Fungsional (Functional Requirements)
- **FR-01 (Kriteria Baku)**: Sistem menyediakan 5 kriteria standar: C1 (Daya Anaerobik Relatif W/kg), C2 (Teknik Muaythai Skala 1-5, kriteria wajib $\ge 3.0$), C3 (VO2max ml/kg/min), C4 (Pengalaman Tanding Partai), C5 (Kedisiplinan Kehadiran TC %).
- **FR-02 (Pembobotan FAHP)**: Sistem menghitung bobot kriteria melalui Extent Analysis Chang (1996) dilengkapi perataan $\epsilon$-smoothing (Zhu et al., 1999) dan memverifikasi Konsistensi Saaty ($CR < 0.10$).
- **FR-03 (Manajemen Atlet / CRUD)**: Sistem menyediakan formulir input atlet individu: nama, sasana, kelas tanding resmi IFMA, berat aktual, presensi latihan, status & catatan cedera, serta metrik C1-C5 dengan fitur Simpan, Edit, dan Hapus (lengkap modal konfirmasi).
- **FR-04 (Evaluasi TOPSIS)**: Sistem secara otomatis menormalisasi matriks kohort kelas tanding, menghitung jarak Euclidean $D^+$ dan $D^-$, serta menetapkan skor kedekatan relatif $C_i \in [0, 1]$.
- **FR-05 (Kalkulasi Certainty Factor)**: Sistem memicu kaidah pakar berbasis fakta lapangan dan mengombinasikan bukti positif, negatif, dan bertentangan menggunakan formula MYCIN Shortliffe & Buchanan.
- **FR-06 (Kaidah Keputusan Utama)**:
  - **K-01 (SIAP)**: $C_i \ge 0.70 \land CF \ge 0.40 \land \text{Presensi} \ge 85\% \land \text{Bebas Cedera}$.
  - **K-02 (SIAP DENGAN CATATAN)**: $C_i \ge 0.45 \land CF \ge 0.00 \lor \text{Kasus Batas (Borderline)} \lor \text{Cedera Aktif Ringan}$.
  - **K-03 (BELUM SIAP)**: $C_i < 0.45 \lor CF < 0.00$.
- **FR-07 (Hard Gate Diskualifikasi K-06)**: Kegagalan pada kriteria wajib (C2 Teknik $< 3.0$) mendiskualifikasi kategori atlet secara mutlak menjadi *BELUM SIAP*.
- **FR-08 (Conservative Demotion K-07)**: Presensi latihan $< 85\%$ otomatis menurunkan kategori *SIAP* menjadi *SIAP DENGAN CATATAN*.
- **FR-09 (Medical Injury Safety K-10)**: Keberadaan cedera aktif memicu lencana *Peringatan Medis* dan mewajibkan surat rekomendasi dokter (*medical clearance*) sebelum diizinkan tanding.
- **FR-10 (Lapisan Narasi AI Non-Binding 9Router)**: Sistem menyediakan tombol pemanggilan LLM via 9Router gateway (model `MyCodeDec`). Respon wajib berformat JSON terstruktur dan dijamin tidak dapat merevisi kategori keputusan sistem pakar (FR-35).

### 2.2 Kebutuhan Non-Fungsional (Non-Functional Requirements)
- **NFR-01 (Integritas Determinisme)**: Seluruh perhitungan matematis (FAHP, TOPSIS, CF) bersifat deterministik 100% dan dapat diaudit secara ilmiah (*audit-proof*).
- **NFR-02 (Kecepatan Respon)**: Komputasi matematis hibrida selesai dalam waktu $< 50$ ms. Pemanggilan lapisan AI 9Router dibatasi *timeout* 25 detik dengan *fallback* otomatis (FR-37).
- **NFR-03 (Desain Antarmuka Combat Sport)**: Antarmuka mematuhi standar *Dark Mode* olahraga beladiri (`#090A0D`/`#111318`), hairline borders (`#262B36`), tipografi display tebal untuk vonis, dan angka tabel monospace tabular.
- **NFR-04 (Keamanan Kredensial)**: API key 9Router dan kredensial database tidak boleh terekspos di sisi klien atau repositori publik git.

### 2.3 Arsitektur Basis Data (PostgreSQL Prisma Schema)
Model data dirancang menggunakan Prisma ORM dengan relasi entitas:
- `Athlete`: Menyimpan biodata atlet, kelas berat, presensi, status cedera, dan nilai metrik C1-C5.
- `Criterion`: Menyimpan definisi kriteria, bobot hasil FAHP, batas ambang wajib (*minThreshold*), dan tipe atribut (*BENEFIT*/*COST*).
- `EvaluationResult`: Menyimpan histori evaluasi matematis: skor $C_i$, $CF$, kategori vonis, dan payload JSON narasi laporan.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Athlete {
  id                String             @id @default(uuid())
  name              String
  campName          String?
  weightClass       String
  weightKg          Float
  attendanceRate    Float
  hasActiveInjury   Boolean            @default(false)
  injuryNotes       String?
  rawScores         Json               // { C1: 15.2, C2: 4.2, C3: 54.0, C4: 6, C5: 88 }
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  evaluations       EvaluationResult[]
}

model EvaluationResult {
  id                String   @id @default(uuid())
  athleteId         String
  athlete           Athlete  @relation(fields: [athleteId], references: [id], onDelete: Cascade)
  topsisCloseness   Float
  certaintyFactor   Float
  category          String   // "SIAP" | "SIAP_DENGAN_CATATAN" | "BELUM_SIAP"
  activeRules       Json     // string[]
  mandatoryViolated Json     // string[]
  medicalAlert      Boolean  @default(false)
  structuredJson    Json     // RFC 8259 Structured Output
  createdAt         DateTime @default(now())
}
```

---

## BAB III: LANDASAN TEORI & FORMULASI MATEMATIS METODE HIBRIDA

```
+---------------------------------------------------------------------------------+
|                                 INPUT DATA ATLET                                |
| (Nama, Sasana, Kelas Tanding, Berat, Presensi TC, Status Cedera, Metrik C1-C5)  |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                        TAHAP 1: FUZZY AHP (Chang 1996)                          |
| - Matriks Perbandingan Berpasangan Skala TFN [l, m, u]                          |
| - Nilai Sintesis Fuzzy (Synthetic Extent Si)                                    |
| - Derajat Kemungkinan V(S_i >= S_k) & Epsilon Smoothing (Zhu et al. 1999)      |
| - Normalisasi Bobot Kriteria W = [w1, w2, w3, w4, w5] (CR Saaty < 0.10)        |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                            TAHAP 2: TOPSIS ENGINE                               |
| - Normalisasi Vektor Euclidean (r_ij)                                           |
| - Matriks Ternormalisasi Terbobot (v_ij = w_j * r_ij)                           |
| - Solusi Ideal Positif (A+) & Solusi Ideal Negatif (A-)                         |
| - Jarak Euclidean (D+ dan D-) -> Skor Kedekatan Relatif C_i in [0, 1]           |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                     TAHAP 3: CERTAINTY FACTOR (MYCIN FORMULA)                   |
| - Evaluasi Kaidah Pakar: CF(H,E) = CF(E) * CF(Rule)                             |
| - Kombinasi Bukti Positif, Negatif, & Bertentangan -> CF_total in [-1.0, +1.0]  |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                        TAHAP 4: DETERMINISTIC DECISION ENGINE                   |
| - Evaluasi Kaidah K-01 (SIAP), K-02 (BERSYARAT), K-03 (BELUM SIAP)              |
| - Hard Gate K-06: Diskualifikasi Otomatis jika C2 Teknik < 3.0                  |
| - Conservative Demotion K-07: Penurunan Kategori jika Presensi < 85%            |
| - Medical Safety Alert K-10: Peringatan Cedera Aktif Wajib Clearance Dokter     |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                 TAHAP 5: LAPISAN NARASI RESMI & LLM (9ROUTER)                   |
| - Output Terstruktur JSON RFC 8259                                              |
| - Guardrail FR-35: Penguncian Mutlak Kategori Keputusan (Read-Only)             |
| - Fallback Deterministik Otomatis jika Jaringan/LLM Timeout (FR-37)             |
+---------------------------------------------------------------------------------+
```

### 3.1 Tahap 1: Fuzzy Analytic Hierarchy Process (FAHP)
Fuzzy AHP menggunakan Bilangan Fuzzy Segitiga (*Triangular Fuzzy Number* / TFN) $M = (l, m, u)$ di mana $l \le m \le u$.

#### 1. Matriks Perbandingan Berpasangan Fuzzy
Didefinisikan matriks $\tilde{A} = [\tilde{a}_{ij}]_{n \times n}$:

$$\tilde{a}_{ij} = (l_{ij}, m_{ij}, u_{ij}), \quad \tilde{a}_{ji} = \tilde{a}_{ij}^{-1} = \left(\frac{1}{u_{ij}}, \frac{1}{m_{ij}}, \frac{1}{l_{ij}}\right)$$

Tabel Definisi Skala Kepentingan Kriteria Muaythai:
- **C1 (Daya Anaerobik Relatif)**: $(1, 1, 1)$ vs C2, $(2, 3, 4)$ vs C3, $(4, 5, 6)$ vs C4, $(4, 5, 6)$ vs C5.
- **C2 (Penguasaan Teknik)**: $(1, 1, 1)$ vs C1, $(2, 3, 4)$ vs C3, $(4, 5, 6)$ vs C4, $(4, 5, 6)$ vs C5.
- **C3 (VO2max Aerobik)**: $(1/4, 1/3, 1/2)$ vs C1 & C2, $(1, 2, 3)$ vs C4 & C5.
- **C4 (Pengalaman Tanding)**: $(1/6, 1/5, 1/4)$ vs C1 & C2, $(1/3, 1/2, 1)$ vs C3, $(1, 1, 1)$ vs C5.
- **C5 (Kedisiplinan Kehadiran)**: $(1/6, 1/5, 1/4)$ vs C1 & C2, $(1/3, 1/2, 1)$ vs C3, $(1, 1, 1)$ vs C4.

#### 2. Sintesis Fuzzy (*Fuzzy Synthetic Extent*)
Nilai sintesis fuzzy $S_i$ untuk baris ke-$i$ dihitung dengan:

$$S_i = \sum_{j=1}^m M_{ij} \odot \left[ \sum_{i=1}^n \sum_{j=1}^m M_{ij} \right]^{-1}$$

Di mana:
$$\sum_{j=1}^m M_{ij} = \left( \sum_{j=1}^m l_{ij}, \sum_{j=1}^m m_{ij}, \sum_{j=1}^m u_{ij} \right)$$

$$\left[ \sum_{i=1}^n \sum_{j=1}^m M_{ij} \right]^{-1} = \left( \frac{1}{\sum_{i=1}^n u_i}, \frac{1}{\sum_{i=1}^n m_i}, \frac{1}{\sum_{i=1}^n l_i} \right)$$

#### 3. Derajat Kemungkinan (*Degree of Possibility*)
Derajat kemungkinan $M_2 = (l_2, m_2, u_2) \ge M_1 = (l_1, m_1, u_1)$ dirumuskan:

$$V(M_2 \ge M_1) = \begin{cases} 
1, & \text{jika } m_2 \ge m_1 \\ 
0, & \text{jika } l_1 \ge u_2 \\ 
\frac{l_1 - u_2}{(m_2 - u_2) - (m_1 - l_1)}, & \text{lainnya} 
\end{cases}$$

Bobot sebelum normalisasi dihitung sebagai nilai minimum kemungkinan terhadap kriteria lain:

$$d'(A_i) = \min_{k \ne i} V(S_i \ge S_k)$$

### 3.2 Resolusi Anomali Bobot Nol (Zhu, Jing, & Chang, 1999)
Pada metode Chang (1996) murni, jika nilai puncak suatu kriteria berada di bawah batas bawah kriteria dominan ($u_2 < l_1$), maka $V(S_2 \ge S_1) = 0$. Hal ini menyebabkan bobot kriteria non-dominan bernilai $0\%$, yang melanggar prinsip AHP bahwa kriteria yang dimasukkan dalam perbandingan tetap memiliki signifikansi.

Untuk mengatasi anomali tersebut, diterapkan **$\epsilon$-Floor Smoothing** (Zhu et al., 1999):

$$d(A_i) = \max\left( \min_{k \ne i} V(S_i \ge S_k), \epsilon \right), \quad \epsilon = 0.05$$

Bobot ternormalisasi akhir:

$$w_i = \frac{d(A_i)}{\sum_{j=1}^n d(A_j)}$$

### 3.3 Uji Konsistensi Saaty (Consistency Ratio)
Matriks defuzzifikasi Centroid: $A_{\text{crisp}} = \frac{l + 4m + u}{6}$.
- Nilai eigen maksimum: $\lambda_{\max} = \frac{1}{n} \sum_{i=1}^n \frac{(A \cdot W)_i}{w_i}$.
- Indeks Konsistensi: $CI = \frac{\lambda_{\max} - n}{n - 1}$.
- Rasio Konsistensi: $CR = \frac{CI}{RI}$. Untuk $n = 5$, $RI = 1.12$.
- Syarat mutlak: $CR < 0.10$ (Terbukti: $CR = 0.0059 < 0.10 \implies \text{KONSISTEN}$).

---

### 3.4 Tahap 2: TOPSIS Engine
1. **Normalisasi Vektor**:
   $$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{k=1}^m x_{kj}^2}}$$
2. **Matriks Ternormalisasi Terbobot**:
   $$v_{ij} = w_j \cdot r_{ij}$$
3. **Solusi Ideal Positif ($A^+$) & Solusi Ideal Negatif ($A^-$)**:
   $$A^+ = \{ v_1^+, v_2^+, \dots, v_n^+ \}, \quad v_j^+ = \max_i(v_{ij})$$
   $$A^- = \{ v_1^-, v_2^-, \dots, v_n^- \}, \quad v_j^- = \min_i(v_{ij})$$
4. **Jarak Euclidean**:
   $$D_i^+ = \sqrt{\sum_{j=1}^n (v_{ij} - v_j^+)^2}, \quad D_i^- = \sqrt{\sum_{j=1}^n (v_{ij} - v_j^-)^2}$$
5. **Skor Kedekatan Relatif ($C_i$)**:
   $$C_i = \frac{D_i^-}{D_i^+ + D_i^-}, \quad C_i \in [0, 1]$$

---

### 3.5 Tahap 3: Certainty Factor (MYCIN Shortliffe & Buchanan)
Faktor keyakinan fakta tunggal:
$$CF(H, E) = CF(E) \cdot CF(\text{Expert})$$

Kombinasi bukti berulang secara berurutan:
1. **Dua Bukti Positif ($CF_1 > 0 \land CF_2 > 0$)**:
   $$CF_{\text{comb}} = CF_1 + CF_2 \cdot (1 - CF_1)$$
2. **Dua Bukti Negatif ($CF_1 < 0 \land CF_2 < 0$)**:
   $$CF_{\text{comb}} = CF_1 + CF_2 \cdot (1 + CF_1)$$
3. **Bukti Bertentangan ($CF_1 \cdot CF_2 < 0$)**:
   $$CF_{\text{comb}} = \frac{CF_1 + CF_2}{1 - \min(|CF_1|, |CF_2|)}$$

---

### 3.6 Tahap 4: Decision Engine & Aturan IFMA
- **K-01 (Kesiapan Utama)**: IF $C_i \ge 0.70 \land CF \ge 0.40 \land \text{Presensi} \ge 85\% \land \text{Bebas Cedera}$ THEN **SIAP**.
- **K-02 (Kesiapan Bersyarat)**: IF $C_i \ge 0.45 \land CF \ge 0.00 \lor \text{Borderline}$ THEN **SIAP DENGAN CATATAN**.
- **K-03 (Ketidaksiapan)**: IF $C_i < 0.45 \lor CF < 0.00$ THEN **BELUM SIAP**.
- **K-06 (Hard Gate Diskualifikasi)**: IF $C_2 < 3.0$ THEN Kategori otomatis diturunkan menjadi **BELUM SIAP**.
- **K-07 (Conservative Demotion)**: IF Kategori = *SIAP* $\land \text{Presensi} < 85\%$ THEN Kategori didemosi menjadi **SIAP DENGAN CATATAN**.
- **K-10 (Medical Injury Safety)**: IF $\text{Cedera Aktif} = \text{true}$ THEN Kategori didemosi ke **SIAP DENGAN CATATAN** dan memicu *Medical Alert*.

---

## BAB IV: SIMULASI PERHITUNGAN NUMERIK STEP-BY-STEP

### 4.1 Data Mentah Kohort Atlet (Kelas Light Welterweight 63.5 kg)
| ID | Nama Atlet | C1 (Daya Anaerobik) | C2 (Teknik Dasar) | C3 (VO2max) | C4 (Pengalaman) | C5 (Presensi TC) | Status Cedera |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **A1** | Reza Pratama | 15.5 W/kg | 4.8 / 5.0 | 57.0 ml/kg/min | 9 Partai | 95.0% | Bebas Cedera |
| **A2** | Bagus Pratama | 13.9 W/kg | 4.0 / 5.0 | 51.0 ml/kg/min | 4 Partai | 84.0% | Cedera Sprain Ankle Derajat 1 |
| **A3** | Dedi Kusnadi | 9.6 W/kg | 2.8 / 5.0 | 44.8 ml/kg/min | 1 Partai | 58.7% | Bebas Cedera |

### 4.2 Hasil Perhitungan FAHP
1. Nilai Sintesis Fuzzy ($S_i$):
   - $S_1 = (0.1851, 0.3451, 0.6304)$
   - $S_2 = (0.1851, 0.3451, 0.6304)$
   - $S_3 = (0.0682, 0.1504, 0.2967)$
   - $S_4 = (0.0435, 0.0796, 0.1731)$
   - $S_5 = (0.0435, 0.0796, 0.1731)$
2. Bobot Kriteria Ternormalisasi ($W$):
   $$\mathbf{W} = [C1: 0.4058, \; C2: 0.4058, \; C3: 0.1479, \; C4: 0.0203, \; C5: 0.0203]^T$$
3. Uji Konsistensi: $\lambda_{\max} = 5.0264$, $CI = 0.0066$, $CR = 0.0059 < 0.10$ (**Valid & Konsisten**).

### 4.3 Hasil Perhitungan TOPSIS
1. Solusi Ideal Positif ($A^+$):
   $$A^+ = \{ C1: 0.27317, \; C2: 0.27501, \; C3: 0.09424, \; C4: 0.01804, \; C5: 0.01387 \}$$
2. Solusi Ideal Negatif ($A^-$):
   $$A^- = \{ C1: 0.16894, \; C2: 0.17112, \; C3: 0.07404, \; C4: 0.00226, \; C5: 0.00856 \}$$
3. Jarak Euclidean & Kedekatan Relatif ($C_i$):
   - **Reza Pratama**: $D^+ = 0.0000$, $D^- = 0.1495$, $\mathbf{C_i = 1.0000}$ (Peringkat 1)
   - **Bagus Pratama**: $D^+ = 0.0413$, $D^- = 0.1089$, $\mathbf{C_i = 0.7248}$ (Peringkat 2)
   - **Dedi Kusnadi**: $D^+ = 0.1495$, $D^- = 0.0000$, $\mathbf{C_i = 0.0000}$ (Peringkat 3)

### 4.4 Hasil Perhitungan Certainty Factor
- **Reza Pratama**: Presensi 95% ($CF = +0.8$), Bebas Cedera ($CF = +0.8$), Pengalaman $\ge 5$ partai ($CF = +0.6$).
  $$CF_{\text{total}} = 0.9703$$
- **Bagus Pratama**: Presensi 84% ($CF = +0.5$), Pengalaman 4 partai ($CF = +0.6$), Cedera Aktif ($CF = -0.7$).
  Kombinasi bertentangan:
  $$CF_{\text{total}} = +0.3333$$
- **Dedi Kusnadi**: Presensi 58.7% ($CF = -0.8$).
  $$CF_{\text{total}} = -0.8000$$

### 4.5 Vonis Akhir Decision Engine
1. **Reza Pratama**:
   - $C_i = 1.0000 \ge 0.70$, $CF = 0.9703 \ge 0.40$, Presensi $95\% \ge 85\%$, Bebas Cedera.
   - **KATEGORI AKHIR: [SIAP]**
2. **Bagus Pratama**:
   - $C_i = 0.7248 \ge 0.45$, $CF = 0.3333 \ge 0.00$, Terdeteksi Cedera Aktif (Sprain Ankle).
   - Memicu Rule K-10 (*Medical Injury Safety*).
   - **KATEGORI AKHIR: [SIAP DENGAN CATATAN]** (Wajib *medical clearance*).
3. **Dedi Kusnadi**:
   - $C_i = 0.0000 < 0.45$, $CF = -0.8000 < 0.00$.
   - Memicu Rule K-06 (*Hard Gate* C2 Teknik $2.8 < 3.0$).
   - **KATEGORI AKHIR: [BELUM SIAP]** (Diskualifikasi mutlak demi keselamatan).

---

## BAB V: INTEGRASI AI GATEWAY 9ROUTER & TEMPLATE JSON RFC 8259

Sistem mengintegrasikan gateway lokal 9Router (`http://localhost:20128/v1`) menggunakan model combo **`MyCodeDec`**. Sesuai regulasi SRS FR-33 s/d FR-38:
1. **Non-Binding & Read-Only**: AI tidak dapat merevisi atau mendemosi hasil kategori keputusan yang telah ditetapkan secara deterministik oleh sistem pakar.
2. **Dual-Mode Response Parser**: Sistem menangani baik respon tunggal JSON maupun chunked streaming SSE (`data: {"id": ...}`).
3. **Round-Robin Resilience Retry**: Jika salah satu model pool dalam 9Router mengembalikan respon kosong atau timeout, sistem secara otomatis melakukan rotasi ke model berikutnya dalam pool sebelum mengaktifkan fallback deterministik.
4. **Template JSON RFC 8259 Terstruktur**: Output JSON memuat ringkasan eksekutif, evaluasi per kriteria (C1-C5), audit TOPSIS-CF, audit medis/berat badan, rekomendasi pelatih, instruksi operasional, dan kesimpulan mendalam.

---

## BAB VI: PANDUAN INSTALASI, PENGUJIAN & DEPLOYMENT VERCEL

### 6.1 Kebutuhan Lingkungan Sistem
- Node.js versi 18.x atau 20.x ke atas.
- PostgreSQL Database (Neon / Supabase / Vercel Postgres).
- 9Router Service aktif pada port `20128` (opsional untuk fitur narasi AI).

### 6.2 Langkah Instalasi Lokal
```bash
# 1. Clone repositori
git clone https://github.com/riantonyc/Sistem_PakarMY.git
cd Sistem_PakarMY

# 2. Pasang dependensi
npm install

# 3. Konfigurasi file environment
cp .env.example .env
# Sesuaikan DATABASE_URL dan AI_GATEWAY_API_KEY di dalam .env

# 4. Generate Prisma Client & Migrasi Database
npx prisma generate
npx prisma db push

# 5. Jalankan aplikasi pada mode development
npm run dev -- -p 3001
```

### 6.3 Deployment ke Vercel
Proyek telah dilengkapi file konfigurasi [`vercel.json`](file:///d:/Sistem_PakarMY/vercel.json):
```json
{
  "buildCommand": "prisma generate && next build",
  "regions": ["sin1"],
  "framework": "nextjs"
}
```
Langkah deploy di dashboard Vercel:
1. Impor repositori GitHub `riantonyc/Sistem_PakarMY`.
2. Masukkan Environment Variables di Vercel:
   - `DATABASE_URL`: URL PostgreSQL (contoh: Neon Serverless Postgres).
   - `AI_GATEWAY_API_KEY`: Kunci API gateway Anda.
   - `NINE_ROUTER_ENDPOINT`: Endpoint gateway AI Anda.
   - `AI_EXPLANATION_MODEL`: `MyCodeDec`.
3. Klik **Deploy**. Vercel akan otomatis mengeksekusi `prisma generate && next build` dan meluncurkan sistem pada region Singapura (`sin1`) dengan latensi terendah untuk pengguna di Pontianak, Kalimantan Barat.

---

## BAB VII: KESIMPULAN & REKOMENDASI MANAJERIAL

1. **Integritas Ilmiah Teruji**: Kombinasi metode Fuzzy AHP, TOPSIS, dan Certainty Factor berhasil memecahkan kelemahan metode konvensional, menghasilkan pembobotan objektif tanpa bobot nol, perankingan geometris presisi, serta mitigasi faktor ketidakpastian lapangan.
2. **Kepatuhan Regulasi IFMA**: Sistem menjamin bahwa keselamatan atlet adalah prioritas tertinggi melalui penerapan gerbang wajib (*Hard Gates*) pada kriteria teknik dasar dan peringatan medis cedera aktif.
3. **Kesiapan Produksi**: Sistem telah melalui verifikasi simulasi numerik 100% konsisten, dilengkapi audit data CRUD, arsitektur database PostgreSQL yang tangguh, serta antarmuka modern siap tanding.

---
**PENGURUS KOTA MUAYTHAI KOTA PONTIANAK**  
*Komisi Pembinaan Prestasi & Litbang Pertandingan*

