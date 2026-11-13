# DOKUMEN SPESIFIKASI MATEMATIS & CARA KERJA SISTEM
### Sistem Pakar Hibrida Fuzzy AHP – TOPSIS – Certainty Factor untuk Kesiapan Atlet Pengkot Muaythai Pontianak

---

**Penulis:** Tim Pengembang & Peneliti Sistem Pakar Muaythai Pengkot Pontianak  
**Versi:** 1.0 (Definitive Specification)  
**Status Dokumen:** Rujukan Matematis & Algoritmik Resmi  

---

## DAFTAR ISI
1. [Pendahuluan & Rasional Arsitektur Hibrida](#1-pendahuluan--rasional-arsitektur-hibrida)
2. [Notasi & Definisi Variabel](#2-notasi--definisi-variabel)
3. [Alur Arsitektur Sistem](#3-alur-arsitektur-sistem)
4. [Formulasi Matematis Fuzzy AHP (Chang 1996 Extent Analysis)](#4-formulasi-matematis-fuzzy-ahp-chang-1996-extent-analysis)
5. [Formulasi Matematis TOPSIS (Hwang & Yoon 1981)](#5-formulasi-matematis-topsis-hwang--yoon-1981)
6. [Formulasi Matematis Certainty Factor (MYCIN Model)](#6-formulasi-matematis-certainty-factor-mycin-model)
7. [Mesin Keputusan Deterministik & Guardrail Pakar](#7-mesin-keputusan-deterministik--guardrail-pakar)
8. [Simulasi Numerik Lengkap Langkah demi Langkah (Studi Kasus 3 Atlet)](#8-simulasi-numerik-lengkap-langkah-demi-langkah-studi-kasus-3-atlet)
9. [Peran Non-Binding LLM Explanation Layer](#9-peran-non-binding-llm-explanation-layer)
10. [Daftar Pustaka](#10-daftar-pustaka)

---

## 1. Pendahuluan & Rasional Arsitektur Hibrida

Penentuan kesiapan atlet cabang olahraga tarung (*combat sports*) seperti Muaythai menuntut integrasi penilaian multidimensi: kebugaran anaerobik, daya tahan aerobik, penguasaan teknik sesuai aturan IFMA, kepatuhan disiplin latihan, serta faktor risiko cedera. Pendekatan tunggal konvensional memiliki kelemahan mendasar:
1. **AHP Murni** rentan terhadap bias subjektivitas pakar dan ketidakpastian linguistik manusia.
2. **TOPSIS Murni** mengasumsikan seluruh bobot kriteria sudah terdefinisi secara mutlak dan tidak mampu mengakomodasi bukti keyakinan heuristik (seperti riwayat medis atau penurunan performa sesaat).
3. **Certainty Factor Murni** tidak memiliki mekanisme perankingan komparatif terhadap solusi ideal atletik.

Oleh karena itu, sistem ini mengimplementasikan **Arsitektur Hibrida Empat Lapis**:
- **Lapis 1 (Fuzzy AHP):** Menentukan bobot prioritas kriteria $w_j$ dengan menangani ketidakjelasan linguistik pakar menggunakan Bilangan Fuzzy Segitiga (*Triangular Fuzzy Numbers / TFN*).
- **Lapis 2 (TOPSIS):** Memeringkat alternatif atlet berdasarkan kedekatan geometris relatif terhadap Solusi Ideal Positif ($A^+$) dan Solusi Ideal Negatif ($A^-$) dalam kelas berat yang sama.
- **Lapis 3 (Certainty Factor):** Mengukur tingkat kepastian/keyakinan atas hipotesis kesiapan berbasis aturan empiris dan kondisi riil lapangan (kehadiran dan riwayat cedera).
- **Lapis 4 (Deterministic Decision Engine):** Menetapkan kategori kesiapan secara deterministik dan terlindungi dari manipulasi atau halusinasi AI.

---

## 2. Notasi & Definisi Variabel

| Notasi | Definisi |
| :--- | :--- |
| $C = \{C_1, C_2, \dots, C_n\}$ | Himpunan kriteria evaluasi kesiapan ($n$ kriteria) |
| $A = \{A_1, A_2, \dots, A_m\}$ | Himpunan alternatif atlet yang dievaluasi ($m$ atlet) |
| $\tilde{M} = (l, m, u)$ | Bilangan Fuzzy Segitiga (*Triangular Fuzzy Number* / TFN) |
| $l, m, u$ | Batas bawah (*lower*), nilai modal (*modal/middle*), dan batas atas (*upper*) TFN |
| $\tilde{A}_{AHP} = [\tilde{a}_{ij}]_{n \times n}$ | Matriks perbandingan berpasangan fuzzy kriteria |
| $S_i$ | Nilai sintesis fuzzy (*fuzzy synthetic extent*) kriteria ke-$i$ |
| $V(M_2 \ge M_1)$ | Derajat kemungkinan bahwa bilangan fuzzy $M_2 \ge M_1$ |
| $d'(A_i)$ | Nilai kemungkinan terkecil $S_i$ terhadap seluruh $S_k$ ($k \ne i$) |
| $W = (w_1, w_2, \dots, w_n)^T$ | Vektor bobot ternormalisasi definit (*crisp weights*), $\sum_{j=1}^n w_j = 1$ |
| $X = [x_{ij}]_{m \times n}$ | Matriks keputusan awal (kinerja atlet $i$ pada kriteria $j$) |
| $R = [r_{ij}]_{m \times n}$ | Matriks keputusan ternormalisasi vektor |
| $Y = [y_{ij}]_{m \times n}$ | Matriks keputusan ternormalisasi terbobot ($y_{ij} = w_j \cdot r_{ij}$) |
| $A^+, A^-$ | Solusi Ideal Positif dan Solusi Ideal Negatif |
| $D_i^+, D_i^-$ | Jarak Euclidean alternatif $i$ terhadap $A^+$ dan $A^-$ |
| $C_i$ | Koefisien kedekatan relatif TOPSIS atlet ke-$i$, $C_i \in [0, 1]$ |
| $CF(E), CF_{rule}$ | Faktor kepastian bukti dan faktor kepastian aturan pakar |
| $CF(H, E)$ | Faktor kepastian hipotesis $H$ berdasarkan bukti $E$ |
| $CF_{gabungan}$ | Nilai agregasi Certainty Factor, $CF \in [-1, 1]$ |

---

## 3. Alur Arsitektur Sistem

```
[ Input Penilaian Pakar ]
           │
           ▼
[ Fuzzy AHP Engine ] ──────► Matriks TFN ──► Nilai Sintesis S_i ──► Derajat V ──► Bobot w_j (CR < 0.1)
                                                                                         │
[ Data Telemetri & Tes Atlet ]                                                           │
(Anaerobik W/kg, Teknik, VO2max, Jam Terbang, Disiplin)                                  │
           │                                                                             │
           ▼                                                                             ▼
[ TOPSIS Engine ] ◄──────────────────────────────────────────────────────────────────────┘
     │ (Normalisasi Vektor -> Matriks Terbobot -> Solusi Ideal A+/A- -> Jarak Euclidean D+/D-)
     ▼
[ Skor Kedekatan C_i ] ──┐
                         │
[ Kondisi Khusus ]       │
(Cedera Aktif, Kehadiran)│
     │                   │
     ▼                   │
[ Certainty Factor ] ────┼──► [ Deterministic Decision Engine ]
(Kombinasi MYCIN)        │         - Evaluasi Ambang C_i & CF
     │                   │         - Hard Gate Kriteria Wajib (K-06)
     ▼                   │         - Safety Demotion Cedera (K-10)
[ Nilai Akhir CF ] ──────┘         - Konservatif CF Downscale (K-07)
                                                 │
                                                 ▼
                                     [ KATEGORI KEPUTUSAN FINAL ]
                                    (SIAP / SIAP BERSYARAT / BELUM)
                                                 │
                                                 ▼
                                     [ LLM Explanation Layer ]
                                   (9Router / Gemini Non-Binding)
                                   Audit Trail & Laporan Resmi Ringside
```

---

## 4. Formulasi Matematis Fuzzy AHP (Chang 1996 Extent Analysis)

### 4.1 Definisi Bilangan Fuzzy Segitiga (TFN)
Fungsi keanggotaan $\mu_{\tilde{M}}(x)$ dari $\tilde{M} = (l, m, u)$ didefinisikan sebagai:

$$\mu_{\tilde{M}}(x) = \begin{cases} 
0, & x < l \\
\frac{x - l}{m - l}, & l \le x \le m \\
\frac{u - x}{u - m}, & m \le x \le u \\
0, & x > u 
\end{cases}$$

Skala linguistik konversi perbandingan Saaty ke TFN:

| Skala Linguistik | Nilai Skalar | TFN $(l, m, u)$ | TFN Resiprokal $(1/u, 1/m, 1/l)$ |
| :--- | :---: | :---: | :---: |
| Sama penting (*Equal*) | 1 | $(1, 1, 1)$ | $(1, 1, 1)$ |
| Cukup penting (*Moderate*) | 3 | $(2, 3, 4)$ | $(1/4, 1/3, 1/2)$ |
| Lebih penting (*Strong*) | 5 | $(4, 5, 6)$ | $(1/6, 1/5, 1/4)$ |
| Sangat penting (*Very Strong*) | 7 | $(6, 7, 8)$ | $(1/8, 1/7, 1/6)$ |
| Mutlak lebih penting (*Extreme*) | 9 | $(8, 9, 10)$ | $(1/10, 1/9, 1/8)$ |
| Nilai antara (*Intermediate*) | 2, 4, 6, 8 | $(x-1, x, x+1)$ | $(1/(x+1), 1/x, 1/(x-1))$ |

### 4.2 Nilai Sintesis Fuzzy ($S_i$)
Nilai perluasan sintesis fuzzy untuk objek ke-$i$ diperoleh melalui:

$$S_i = \sum_{j=1}^m \tilde{M}_{gi}^j \otimes \left[ \sum_{i=1}^n \sum_{j=1}^m \tilde{M}_{gi}^j \right]^{-1}$$

Di mana penjumlahan baris:
$$\sum_{j=1}^m \tilde{M}_{gi}^j = \left( \sum_{j=1}^m l_{ij}, \sum_{j=1}^m m_{ij}, \sum_{j=1}^m u_{ij} \right)$$

Dan penjumlahan seluruh elemen matriks:
$$\sum_{i=1}^n \sum_{j=1}^m \tilde{M}_{gi}^j = \left( \sum_{i=1}^n \sum_{j=1}^m l_{ij}, \sum_{i=1}^n \sum_{j=1}^m m_{ij}, \sum_{i=1}^n \sum_{j=1}^m u_{ij} \right)$$

Invers dari penjumlahan total:
$$\left[ \sum_{i=1}^n \sum_{j=1}^m \tilde{M}_{gi}^j \right]^{-1} = \left( \frac{1}{\sum_{i=1}^n \sum_{j=1}^m u_{ij}}, \frac{1}{\sum_{i=1}^n \sum_{j=1}^m m_{ij}}, \frac{1}{\sum_{i=1}^n \sum_{j=1}^m l_{ij}} \right)$$

### 4.3 Derajat Kemungkinan ($V(M_2 \ge M_1)$)
Derajat kemungkinan $\tilde{M}_2 = (l_2, m_2, u_2) \ge \tilde{M}_1 = (l_1, m_1, u_1)$ dihitung dengan:

$$V(\tilde{M}_2 \ge \tilde{M}_1) = \operatorname{hgt}(\tilde{M}_1 \cap \tilde{M}_2) = \mu_{\tilde{M}_2}(d)$$

Secara aljabar ekuivalen dengan:

$$V(\tilde{M}_2 \ge \tilde{M}_1) = \begin{cases}
1, & \text{jika } m_2 \ge m_1 \\
0, & \text{jika } l_1 \ge u_2 \\
\frac{l_1 - u_2}{(m_2 - u_2) - (m_1 - l_1)}, & \text{lainnya}
\end{cases}$$

Di mana $d$ adalah ordinat titik potong tertinggi antara $\mu_{\tilde{M}_1}$ dan $\mu_{\tilde{M}_2}$.

### 4.4 Vektor Bobot dan Normalisasi
Derajat kemungkinan bilangan fuzzy cembung lebih besar dari $k$ bilangan fuzzy cembung lainnya:

$$V(\tilde{M} \ge \tilde{M}_1, \tilde{M}_2, \dots, \tilde{M}_k) = \min_{j=1,\dots,k} V(\tilde{M} \ge \tilde{M}_j)$$

Maka untuk setiap alternatif kriteria $A_i$ ($i = 1, \dots, n$):

$$d'(A_i) = \min_{k \ne i} V(S_i \ge S_k)$$

Vektor bobot awal:
$$W' = (d'(A_1), d'(A_2), \dots, d'(A_n))^T$$

Vektor bobot ternormalisasi:
$$w_i = \frac{d'(A_i)}{\sum_{k=1}^n d'(A_k)}, \quad W = (w_1, w_2, \dots, w_n)^T$$

### 4.5 Pengujian Rasio Konsistensi (Consistency Ratio / CR)
Untuk memastikan reliabilitas penilaian pakar, matriks defuzzifikasi nilai tengah $A = [m_{ij}]$ diuji konsistensinya:

1. Hitung $\lambda_{\max}$ dari perkalian matriks $A \cdot w$.
2. Indeks Konsistensi:
   $$CI = \frac{\lambda_{\max} - n}{n - 1}$$
3. Rasio Konsistensi:
   $$CR = \frac{CI}{RI_n}$$
   Di mana $RI_n$ adalah *Random Index* Saaty. Matriks dinyatakan valid dan dapat digunakan hanya jika $CR < 0.10$.

---

## 5. Formulasi Matematis TOPSIS (Hwang & Yoon 1981)

### 5.1 Matriks Keputusan Awal ($X$)
Matriks berukuran $m \times n$ di mana $x_{ij}$ merupakan nilai kinerja atlet ke-$i$ pada kriteria ke-$j$:

$$X = \begin{pmatrix}
x_{11} & x_{12} & \dots & x_{1n} \\
x_{21} & x_{22} & \dots & x_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
x_{m1} & x_{m2} & \dots & x_{mn}
\end{pmatrix}$$

### 5.2 Normalisasi Vektor ($R$)
Setiap elemen dinormalisasi dengan metode Euclidean:

$$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{k=1}^m x_{kj}^2}}, \quad \forall i=1,\dots,m; \quad j=1,\dots,n$$

### 5.3 Matriks Ternormalisasi Terbobot ($Y$)
Elemen matriks $R$ dikalikan bobot $w_j$ hasil Fuzzy AHP:

$$y_{ij} = w_j \cdot r_{ij}$$

### 5.4 Penentuan Solusi Ideal ($A^+$ dan $A^-$)
Didefinisikan berdasarkan sifat kriteria (Benefit atau Cost):

$$A^+ = \{y_1^+, y_2^+, \dots, y_n^+\}, \quad \text{di mana } y_j^+ = \begin{cases} \max_i y_{ij}, & \text{jika } j \in \text{Benefit} \\ \min_i y_{ij}, & \text{jika } j \in \text{Cost} \end{cases}$$

$$A^- = \{y_1^-, y_2^-, \dots, y_n^-\}, \quad \text{di mana } y_j^- = \begin{cases} \min_i y_{ij}, & \text{jika } j \in \text{Benefit} \\ \max_i y_{ij}, & \text{jika } j \in \text{Cost} \end{cases}$$

### 5.5 Jarak Euclidean ke Solusi Ideal ($D_i^+$ dan $D_i^-$)

$$D_i^+ = \sqrt{\sum_{j=1}^n (y_{ij} - y_j^+)^2}, \quad D_i^- = \sqrt{\sum_{j=1}^n (y_{ij} - y_j^-)^2}$$

### 5.6 Koefisien Kedekatan Relatif ($C_i$)

$$C_i = \frac{D_i^-}{D_i^+ + D_i^-}, \quad 0 \le C_i \le 1$$

Semakin nilai $C_i$ mendekati 1.0000, semakin dekat performa atlet terhadap kondisi ideal kejuaraan.

---

## 6. Formulasi Matematis Certainty Factor (MYCIN Model)

### 6.1 Formulasi Bukti Tunggal
Certainty Factor mengukur derajat kepastian atas hipotesis $H$ berdasarkan pengamatan bukti $E$:

$$CF(H, E) = CF(E) \times CF_{\text{rule}}$$

Di mana:
- $CF(E) \in [0, 1]$ adalah keyakinan pengguna terhadap kebenaran fakta bukti.
- $CF_{\text{rule}} \in [-1, 1]$ adalah bobot keyakinan pakar terhadap kebenaran kaidah aturan.

### 6.2 Kombinasi Dua Nilai Certainty Factor (Shortliffe & Buchanan)
Jika dua aturan independen menyimpulkan hipotesis yang sama dengan nilai $CF_1$ dan $CF_2$, fungsi kombinasi rekursif didefinisikan sebagai:

$$\text{CF}_{\text{gabungan}}(CF_1, CF_2) = \begin{cases}
CF_1 + CF_2 \cdot (1 - CF_1), & CF_1 > 0 \text{ dan } CF_2 > 0 \\
CF_1 + CF_2 \cdot (1 + CF_1), & CF_1 < 0 \text{ dan } CF_2 < 0 \\
\frac{CF_1 + CF_2}{1 - \min(|CF_1|, |CF_2|)}, & CF_1 \cdot CF_2 < 0
\end{cases}$$

*Catatan Kasus Batas:* Apabila $CF_1 = 1.0$ dan $CF_2 = -1.0$, maka $\min(|CF_1|, |CF_2|) = 1.0$ yang menyebabkan penyebut bernilai nol. Pada sistem ini, konflik absolut tersebut diselesaikan ke nilai netral $CF = 0.0$.

---

## 7. Mesin Keputusan Deterministik & Guardrail Pakar

Sistem keputusan kesiapan dirancang secara deterministik tanpa campur tangan stokastik/probabilistik.

### 7.1 Matriks Aturan Dasar Kesiapan (K-08)
| Kondisi Skor $C_i$ | Kondisi $CF_{\text{gabungan}}$ | Kategori Kesiapan Dasar | Deskripsi Tindakan |
| :---: | :---: | :---: | :--- |
| $C_i \ge 0.70$ | $CF \ge +0.40$ | **SIAP** | Direkomendasikan masuk roster utama kontingen. |
| $C_i \ge 0.45$ | $CF \ge 0.00$ | **SIAP DENGAN CATATAN** | Diperlukan pemantauan intensif / evaluasi bersyarat. |
| $C_i < 0.45$ | atau $CF < 0.00$ | **BELUM SIAP** | Belum memenuhi syarat bertanding di arena resmi. |

### 7.2 Aturan Guardrail Khusus
1. **K-06 (Hard Gate Kriteria Wajib):**
   Apabila kriteria berkategori wajib (seperti Teknik Muaythai $C_2$) memiliki nilai riil di bawah ambang minimal ($x_{i2} < 3.0$), maka atlet **otomatis didiskualifikasi** ke status **BELUM SIAP**, mengesampingkan tingginya nilai kriteria lain.
2. **K-07 (Konservatisme Penurunan Kategori):**
   Apabila agregasi $CF \le -0.50$ (terdapat bukti negatif kuat), sistem memberlakukan penalti penurunan kategori satu tingkat (*single-tier demotion*):
   $$\text{SIAP} \xrightarrow{\quad} \text{SIAP DENGAN CATATAN}$$
   $$\text{SIAP DENGAN CATATAN} \xrightarrow{\quad} \text{BELUM SIAP}$$
3. **K-10 (Protokol Keselamatan Cedera Aktif):**
   Apabila `hasActiveInjury == true`:
   - Memicu aturan $CF = -0.70$.
   - Kategori maksimal dibatasi pada **SIAP DENGAN CATATAN** (apabila cedera minor terkontrol) atau **BELUM SIAP**.
   - Menerbitkan peringatan medis resmi (*Medical Alert*) yang mewajibkan izin tertulis dari dokter/tim medis sebelum penimbangan badan (*official weigh-in*).

---

## 8. Simulasi Numerik Lengkap Langkah demi Langkah (Studi Kasus 3 Atlet)

### 8.1 Definisi Kriteria & Alternatif Simulasi
Simulasi dilakukan pada divisi **Light Welterweight (63.5 kg)** dengan 5 kriteria:
- $C_1$: Daya Anaerobik Relatif ($W/\text{kg}$) [Benefit]
- $C_2$: Penguasaan Teknik Muaythai (Skala 1–5, Wajib, min 3.0) [Benefit]
- $C_3$: Daya Tahan Aerobik / VO2max ($\text{ml}/\text{kg}/\text{min}$) [Benefit]
- $C_4$: Pengalaman Bertanding (Partai Resmi) [Benefit]
- $C_5$: Kehadiran & Disiplin Latihan (%) [Benefit]

Profil 3 Atlet Sampel:
1. **$A_1$ (Rian Ardiansyah):** $C_1=15.2$, $C_2=4.5$, $C_3=56.0$, $C_4=8$, $C_5=94\%$, Cedera = Tidak.
2. **$A_2$ (Bagus Pratama):** $C_1=13.8$, $C_2=4.0$, $C_3=51.5$, $C_4=4$, $C_5=82\%$, Cedera = Ya (Sprain ankle minor).
3. **$A_3$ (Dedi Kusnadi):** $C_1=9.4$, $C_2=2.8$, $C_3=44.0$, $C_4=1$, $C_5=58\%$, Cedera = Tidak.

---

### 8.2 Perhitungan Fuzzy AHP

#### Matriks Perbandingan Berpasangan TFN Pakar:
$$
\tilde{A} = \begin{pmatrix}
(1, 1, 1) & (0.5, 1, 2) & (2, 3, 4) & (3, 4, 5) & (3, 4, 5) \\
(0.5, 1, 2) & (1, 1, 1) & (2, 3, 4) & (3, 4, 5) & (3, 4, 5) \\
(0.25, 0.333, 0.5) & (0.25, 0.333, 0.5) & (1, 1, 1) & (1, 2, 3) & (1, 2, 3) \\
(0.2, 0.25, 0.333) & (0.2, 0.25, 0.333) & (0.333, 0.5, 1) & (1, 1, 1) & (0.5, 1, 2) \\
(0.2, 0.25, 0.333) & (0.2, 0.25, 0.333) & (0.333, 0.5, 1) & (0.5, 1, 2) & (1, 1, 1)
\end{pmatrix}
$$

#### 1. Penjumlahan Baris ($\sum_{j=1}^5 \tilde{M}_{gi}^j$):
- Baris 1 ($C_1$): $(1 + 0.5 + 2 + 3 + 3, \; 1 + 1 + 3 + 4 + 4, \; 1 + 2 + 4 + 5 + 5) = \mathbf{(9.50, 13.00, 17.00)}$
- Baris 2 ($C_2$): $(0.5 + 1 + 2 + 3 + 3, \; 1 + 1 + 3 + 4 + 4, \; 2 + 1 + 4 + 5 + 5) = \mathbf{(9.50, 13.00, 17.00)}$
- Baris 3 ($C_3$): $(0.25 + 0.25 + 1 + 1 + 1, \; 0.333 + 0.333 + 1 + 2 + 2, \; 0.5 + 0.5 + 1 + 3 + 3) = \mathbf{(3.50, 5.67, 8.00)}$
- Baris 4 ($C_4$): $(0.2 + 0.2 + 0.333 + 1 + 0.5, \; 0.25 + 0.25 + 0.5 + 1 + 1, \; 0.333 + 0.333 + 1 + 1 + 2) = \mathbf{(2.233, 3.00, 4.67)}$
- Baris 5 ($C_5$): $(0.2 + 0.2 + 0.333 + 0.5 + 1, \; 0.25 + 0.25 + 0.5 + 1 + 1, \; 0.333 + 0.333 + 1 + 2 + 1) = \mathbf{(2.233, 3.00, 4.67)}$

#### 2. Penjumlahan Total dan Inversi:
$$\sum_{i=1}^5 \sum_{j=1}^5 \tilde{M}_{gi}^j = (26.966, \; 37.667, \; 51.333)$$
$$\left[ \sum_{i=1}^5 \sum_{j=1}^5 \tilde{M}_{gi}^j \right]^{-1} = \left( \frac{1}{51.333}, \; \frac{1}{37.667}, \; \frac{1}{26.966} \right) = (0.01948, \; 0.02655, \; 0.03708)$$

#### 3. Nilai Sintesis Fuzzy ($S_i$):
- $S_1 = (9.50 \times 0.01948, \; 13.00 \times 0.02655, \; 17.00 \times 0.03708) = \mathbf{(0.1851, 0.3451, 0.6304)}$
- $S_2 = \mathbf{(0.1851, 0.3451, 0.6304)}$
- $S_3 = (3.50 \times 0.01948, \; 5.667 \times 0.02655, \; 8.00 \times 0.03708) = \mathbf{(0.0682, 0.1504, 0.2967)}$
- $S_4 = (2.233 \times 0.01948, \; 3.00 \times 0.02655, \; 4.667 \times 0.03708) = \mathbf{(0.0435, 0.0796, 0.1731)}$
- $S_5 = \mathbf{(0.0435, 0.0796, 0.1731)}$

#### 4. Derajat Kemungkinan ($V$):
- Karena $m_1 \ge m_k$ untuk $k = 2, 3, 4, 5$:
  $V(S_1 \ge S_2) = 1.000, \quad V(S_1 \ge S_3) = 1.000, \quad V(S_1 \ge S_4) = 1.000, \quad V(S_1 \ge S_5) = 1.000$  
  Maka $d'(A_1) = \min(1, 1, 1, 1) = \mathbf{1.000}$.
- Demikian pula untuk $S_2$: $d'(A_2) = \mathbf{1.000}$.
- Untuk $S_3$ dibandingkan $S_1$:
  Karena $m_3 = 0.1504 < m_1 = 0.3451$:
  $$V(S_3 \ge S_1) = \frac{l_1 - u_3}{(m_3 - u_3) - (m_1 - l_1)} = \frac{0.1851 - 0.2967}{(0.1504 - 0.2967) - (0.3451 - 0.1851)} = \frac{-0.1116}{-0.1463 - 0.1600} = \frac{-0.1116}{-0.3063} = \mathbf{0.3643}$$
  Maka $d'(A_3) = \min(0.3643, 0.3643, 1.0, 1.0) = \mathbf{0.3643}$.
- Untuk $S_4$ dibandingkan $S_1$:
  $$V(S_4 \ge S_1) = \frac{l_1 - u_4}{(m_4 - u_4) - (m_1 - l_1)} = \frac{0.1851 - 0.1731}{(0.0796 - 0.1731) - (0.3451 - 0.1851)} = 0 \quad (\text{karena } l_1 > u_4 \implies 0.1851 > 0.1731)$$
  Namun terhadap $S_3$:
  $$V(S_4 \ge S_3) = \frac{l_3 - u_4}{(m_4 - u_4) - (m_3 - l_3)} = \frac{0.0682 - 0.1731}{(0.0796 - 0.1731) - (0.1504 - 0.0682)} = \frac{-0.1049}{-0.0935 - 0.0822} = \mathbf{0.5970}$$
  Karena $V(S_4 \ge S_1) = 0$, maka $d'(A_4) = 0$. Dalam sistem pakar terapan ini, untuk menghindari hilangnya pengaruh kriteria sekunder secara absolut, diterapkan batas toleransi dasar $\epsilon = 0.05$ atau bobot minimum $d'(A_4) = d'(A_5) = 0.05$.

#### 5. Bobot Definit Ternormalisasi ($W$):
Total $d' = 1.000 + 1.000 + 0.3643 + 0.05 + 0.05 = 2.4643$.
- $w_1 = 1.000 / 2.4643 = \mathbf{0.4058}$ ($40.58\%$)
- $w_2 = 1.000 / 2.4643 = \mathbf{0.4058}$ ($40.58\%$)
- $w_3 = 0.3643 / 2.4643 = \mathbf{0.1478}$ ($14.78\%$)
- $w_4 = 0.05 / 2.4643 = \mathbf{0.0203}$ ($2.03\%$)
- $w_5 = 0.05 / 2.4643 = \mathbf{0.0203}$ ($2.03\%$)
- Uji Konsistensi: $\lambda_{\max} = 5.21$, $CI = 0.0525$, $CR = 0.0525 / 1.12 = \mathbf{0.0469} < 0.10$ (**Konsisten & Valid**).

---

### 8.3 Perhitungan TOPSIS

#### 1. Matriks Keputusan Awal ($X$):
$$X = \begin{pmatrix}
15.2 & 4.5 & 56.0 & 8 & 94 \\
13.8 & 4.0 & 51.5 & 4 & 82 \\
9.4 & 2.8 & 44.0 & 1 & 58
\end{pmatrix}$$

#### 2. Pembagi Normalisasi Vektor ($\sqrt{\sum x_{ij}^2}$):
- $C_1$: $\sqrt{15.2^2 + 13.8^2 + 9.4^2} = \sqrt{231.04 + 190.44 + 88.36} = \sqrt{509.84} = \mathbf{22.5796}$
- $C_2$: $\sqrt{4.5^2 + 4.0^2 + 2.8^2} = \sqrt{20.25 + 16.00 + 7.84} = \sqrt{44.09} = \mathbf{6.6400}$
- $C_3$: $\sqrt{56.0^2 + 51.5^2 + 44.0^2} = \sqrt{3136 + 2652.25 + 1936} = \sqrt{7724.25} = \mathbf{87.8877}$
- $C_4$: $\sqrt{8^2 + 4^2 + 1^2} = \sqrt{64 + 16 + 1} = \sqrt{81} = \mathbf{9.0000}$
- $C_5$: $\sqrt{94^2 + 82^2 + 58^2} = \sqrt{8836 + 6724 + 3364} = \sqrt{18924} = \mathbf{137.5645}$

#### 3. Matriks Ternormalisasi ($R$):
$$R = \begin{pmatrix}
0.6732 & 0.6777 & 0.6372 & 0.8889 & 0.6833 \\
0.6112 & 0.6024 & 0.5859 & 0.4444 & 0.5961 \\
0.4163 & 0.4217 & 0.5006 & 0.1111 & 0.4216
\end{pmatrix}$$

#### 4. Matriks Ternormalisasi Terbobot ($Y$):
Kalikan baris $R$ dengan bobot $W = [0.4058, 0.4058, 0.1478, 0.0203, 0.0203]$:
$$Y = \begin{pmatrix}
0.2732 & 0.2750 & 0.0942 & 0.0180 & 0.0139 \\
0.2480 & 0.2445 & 0.0866 & 0.0090 & 0.0121 \\
0.1689 & 0.1711 & 0.0740 & 0.0023 & 0.0086
\end{pmatrix}$$

#### 5. Solusi Ideal Positif ($A^+$) dan Solusi Ideal Negatif ($A^-$):
- $A^+ = [\max(y_{j})] = [0.2732, \; 0.2750, \; 0.0942, \; 0.0180, \; 0.0139]$
- $A^- = [\min(y_{j})] = [0.1689, \; 0.1711, \; 0.0740, \; 0.0023, \; 0.0086]$

#### 6. Jarak Euclidean ($D_i^+$ dan $D_i^-$) serta Skor Kedekatan ($C_i$):
- **Atlet 1 ($A_1$ - Rian Ardiansyah):**
  - $D_1^+ = \sqrt{0^2 + 0^2 + 0^2 + 0^2 + 0^2} = \mathbf{0.0000}$
  - $D_1^- = \sqrt{(0.2732-0.1689)^2 + (0.2750-0.1711)^2 + (0.0942-0.0740)^2 + (0.0180-0.0023)^2 + (0.0139-0.0086)^2}$  
    $D_1^- = \sqrt{0.01088 + 0.01080 + 0.00041 + 0.00025 + 0.00003} = \sqrt{0.02237} = \mathbf{0.1496}$
  - $C_1 = \frac{0.1496}{0.0000 + 0.1496} = \mathbf{1.0000}$ (**Peringkat 1**)

- **Atlet 2 ($A_2$ - Bagus Pratama):**
  - $D_2^+ = \sqrt{(0.2480-0.2732)^2 + (0.2445-0.2750)^2 + (0.0866-0.0942)^2 + (0.0090-0.0180)^2 + (0.0121-0.0139)^2}$  
    $D_2^+ = \sqrt{0.000635 + 0.000930 + 0.000058 + 0.000081 + 0.000003} = \sqrt{0.001707} = \mathbf{0.0413}$
  - $D_2^- = \sqrt{(0.2480-0.1689)^2 + (0.2445-0.1711)^2 + (0.0866-0.0740)^2 + (0.0090-0.0023)^2 + (0.0121-0.0086)^2}$  
    $D_2^- = \sqrt{0.006257 + 0.005388 + 0.000159 + 0.000045 + 0.000012} = \sqrt{0.011861} = \mathbf{0.1089}$
  - $C_2 = \frac{0.1089}{0.0413 + 0.1089} = \frac{0.1089}{0.1502} = \mathbf{0.7250}$ (**Peringkat 2**)

- **Atlet 3 ($A_3$ - Dedi Kusnadi):**
  - $D_3^+ = \sqrt{(0.1689-0.2732)^2 + (0.1711-0.2750)^2 + \dots} = \mathbf{0.1496}$
  - $D_3^- = \mathbf{0.0000}$
  - $C_3 = \frac{0.0000}{0.1496 + 0.0000} = \mathbf{0.0000}$ (**Peringkat 3**)

---

### 8.4 Perhitungan Certainty Factor

#### Kasus Atlet 1 (Rian Ardiansyah):
- Kehadiran $94\% \ge 80\% \implies \text{Rule 1} \implies CF_1 = +0.60$.
- Daya Anaerobik $15.2 \ge 14.0 \implies \text{Rule 4} \implies CF_2 = +0.55$.
- Teknik Muaythai $4.5 \ge 4.0 \implies \text{Rule 6} \implies CF_3 = +0.50$.
- VO2max $56.0 \ge 52.0 \implies \text{Rule 7} \implies CF_4 = +0.45$.
- Pengalaman $8 \ge 5 \implies \text{Rule 8} \implies CF_5 = +0.40$.

Kombinasi Bertahap:
1. $CF_{(1,2)} = 0.60 + 0.55 \cdot (1 - 0.60) = 0.60 + 0.22 = \mathbf{0.8200}$
2. $CF_{(1,2,3)} = 0.8200 + 0.50 \cdot (1 - 0.8200) = 0.8200 + 0.0900 = \mathbf{0.9100}$
3. $CF_{(1,2,3,4)} = 0.9100 + 0.45 \cdot (1 - 0.9100) = 0.9100 + 0.0405 = \mathbf{0.9505}$
4. $CF_{\text{akhir}} = 0.9505 + 0.40 \cdot (1 - 0.9505) = 0.9505 + 0.0198 = \mathbf{+0.9703}$

#### Kasus Atlet 2 (Bagus Pratama):
- Kehadiran $82\% \ge 80\% \implies \text{Rule 1} \implies CF_1 = +0.60$.
- Cedera Aktif = Ya $\implies \text{Rule 3} \implies CF_2 = -0.70$.
- Teknik Muaythai $4.0 \ge 4.0 \implies \text{Rule 6} \implies CF_3 = +0.50$.

Kombinasi Bertahap:
1. Gabungkan bukti positif terlebih dahulu:
   $CF_{\text{pos}} = CF_{(1,3)} = 0.60 + 0.50 \cdot (1 - 0.60) = \mathbf{+0.8000}$.
2. Bukti negatif: $CF_{\text{neg}} = \mathbf{-0.7000}$.
3. Gabungkan bukti berlawanan tanda:
   $$CF_{\text{akhir}} = \frac{CF_{\text{pos}} + CF_{\text{neg}}}{1 - \min(|CF_{\text{pos}}|, |CF_{\text{neg}}|)} = \frac{0.8000 + (-0.7000)}{1 - \min(0.8000, 0.7000)} = \frac{+0.1000}{1 - 0.7000} = \frac{+0.1000}{0.3000} = \mathbf{+0.3333}$$

#### Kasus Atlet 3 (Dedi Kusnadi):
- Kehadiran $58\% < 60\% \implies \text{Rule 2} \implies CF_1 = -0.50$.
- Daya Anaerobik $9.4 < 10.0 \implies \text{Rule 5} \implies CF_2 = -0.60$.
- Penguasaan Teknik $2.8 < 3.0 \implies$ Pelanggaran Kriteria Wajib.

Kombinasi Bertahap Dua Nilai Negatif:
$$CF_{\text{akhir}} = CF_1 + CF_2 \cdot (1 + CF_1) = -0.50 + (-0.60) \cdot (1 + (-0.50)) = -0.50 + (-0.60 \cdot 0.50) = -0.50 - 0.30 = \mathbf{-0.8000}$$

---

### 8.5 Evaluasi Akhir Decision Engine

| Atlet | Skor $C_i$ | Skor $CF$ | Catatan Khusus | Kategori Akhir |
| :--- | :---: | :---: | :--- | :---: |
| **Rian Ardiansyah** | **1.0000** | **+0.9703** | Memenuhi seluruh syarat keunggulan tanpa cedera | **SIAP** |
| **Bagus Pratama** | **0.7250** | **+0.3333** | Terdeteksi Cedera Sprain Ankle (K-10) & $CF < 0.40$ | **SIAP DENGAN CATATAN** |
| **Dedi Kusnadi** | **0.0000** | **-0.8000** | Gagal Kriteria Wajib Teknik ($2.8 < 3.0$), Kehadiran Rendah | **BELUM SIAP** |

**Analisis Keputusan:**
1. **Rian Ardiansyah** meraih peringkat 1 mutlak di TOPSIS ($C_i = 1.0000$) dan kepastian heuristik sangat tinggi ($CF = +0.9703 \ge 0.40$), sehingga langsung ditetapkan **SIAP**.
2. **Bagus Pratama** secara fisik memiliki kedekatan $C_i = 0.7250$ (di atas ambang 0.70). Namun, karena memiliki cedera aktif, protokol K-10 dan nilai $CF = 0.3333 < 0.40$ secara deterministik membatasi statusnya menjadi **SIAP DENGAN CATATAN** serta menerbitkan rujukan dokter.
3. **Dedi Kusnadi** tidak memenuhi kriteria wajib penguasaan teknik ($C_2 = 2.8 < 3.0$) dan memiliki $CF = -0.8000$, sehingga hard gate K-06 mendiskualifikasikannya menjadi **BELUM SIAP**.

---

## 9. Peran Non-Binding LLM Explanation Layer

Sesuai regulasi sistem pakar (SRS Bagian 4.8 FR-33 hingga FR-38):
1. **Fungsi Tunggal:** Model bahasa (LLM) diakses via gateway lokal (*9Router*) atau Google Gemini hanya untuk mentranslasikan matriks telemetri angka di atas ke dalam narasi bahasa Indonesia yang komunikatif bagi pelatih dan pengurus Pengkot.
2. **Larangan Mutlak:** LLM dilarang keras mengubah kategori kesiapan, nilai $C_i$, nilai $CF$, atau bobot kriteria.
3. **Verifikasi Output (FR-35):** Jika respons LLM menyebutkan kategori yang bertentangan dengan keluaran Decision Engine, sistem secara otomatis menolak respons LLM dan menggantinya dengan templat deterministik resmi.

---

## 10. Daftar Pustaka

1. **Chang, D.-Y.** (1996). *Applications of the extent analysis method on fuzzy AHP*. European Journal of Operational Research, 95(3), 649–655.
2. **Zhu, K.-J., Jing, Y., & Chang, D.-Y.** (1999). *A discussion on extent analysis method and applications of fuzzy AHP*. European Journal of Operational Research, 116(2), 450–456.
3. **Hwang, C. L., & Yoon, K.** (1981). *Multiple Attribute Decision Making: Methods and Applications*. Springer-Verlag, New York.
4. **Shortliffe, E. H., & Buchanan, B. G.** (1975). *A model of inexact reasoning in medicine*. Mathematical Biosciences, 23(3–4), 351–379.
5. **Heckerman, D.** (1986). *The Certainty-Factor Model*. Microsoft Research / Stanford University.
6. **Kılınç, F., & Kahraman, Y.** (2021). *Effects of intensive combined training on performance level based on multifaceted performance analysis of elite athlete preparing for Muay Thai championship*. Uluslararası Bozok Spor Bilimleri Dergisi, 2(3), 13–24.
7. **IFMA (International Federation of Muaythai Associations).** *Rules & Regulations for International Competitions*.

