# Spesifikasi Kebutuhan Laporan (Requirement Specification)

**Judul Sistem:** Perancangan Sistem Pakar Hibrida Fuzzy AHP–TOPSIS–CF untuk Kesiapan Atlet Pengkot Muaythai Pontianak
**Objek Penelitian:** Pengurus Kota (Pengkot) Muaythai Kota Pontianak
**Versi Dokumen:** 1.0
**Status:** Draf untuk review pembimbing dan pakar

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen ini mendefinisikan kebutuhan fungsional dan non-fungsional sistem pakar hibrida untuk menilai tingkat kesiapan atlet Muaythai mengikuti kompetisi. Dokumen ini menjadi acuan bagi pengembang, pembimbing, dan pakar domain dalam menilai kelengkapan sistem.

### 1.2 Ruang Lingkup

Sistem ini:
- Menerima data kondisi atlet berdasarkan kriteria kesiapan yang telah ditetapkan.
- Mengolah data dengan metode Fuzzy AHP (penentuan bobot), TOPSIS (perankingan), dan Certainty Factor (CF, pengukuran keyakinan).
- Menghasilkan kategori kesiapan secara deterministik melalui *Decision Engine*.
- Menggunakan model bahasa (LLM) hanya untuk menjelaskan hasil keputusan dalam bahasa yang mudah dipahami.

Sistem ini **tidak**:
- Menggantikan keputusan pelatih, dokter, atau pengurus pengkot.
- Memberikan diagnosis medis.
- Menggunakan LLM untuk menentukan atau mengubah kategori kesiapan.

### 1.3 Definisi dan Singkatan

| Istilah | Keterangan |
|---|---|
| Fuzzy AHP | Analytical Hierarchy Process berbasis bilangan fuzzy segitiga, untuk menghitung bobot kriteria. |
| TOPSIS | Technique for Order Preference by Similarity to Ideal Solution, untuk menghitung kedekatan alternatif terhadap solusi ideal. |
| CF | Certainty Factor, ukuran keyakinan atas suatu kesimpulan berdasarkan bukti. |
| Decision Engine | Modul deterministik yang menentukan kategori kesiapan dari hasil perhitungan. |
| LLM Explanation Layer | Lapisan penjelasan berbasis model bahasa; tidak memiliki kewenangan mengubah keputusan. |
| 9Router | Gateway AI lokal open-source yang berfungsi sebagai perantara (router) antar model LLM. |
| Atlet | Peserta Muaythai yang terdaftar di Pengkot Muaythai Kota Pontianak. |
| Pelatih | Pengguna yang menginput data latihan dan kondisi atlet. |
| Pakar | Pelatih senior atau wasit yang menetapkan bobot awal dan ambang kategori. |

### 1.4 Referensi

- Dokumen peraturan pertandingan Muaythai yang berlaku (sumber resmi, disebutkan nama dan tahun).
- Literatur Fuzzy AHP (Chang, 1996, extent analysis) dan TOPSIS (Hwang & Yoon, 1981).
- Literatur Certainty Factor (Shortliffe & Buchanan, MYCIN).

---

## 2. Gambaran Umum Sistem

### 2.1 Alur Proses

```
Input data atlet
      ↓
Validasi dan normalisasi data
      ↓
Fuzzy AHP → bobot kriteria
      ↓
TOPSIS → skor kedekatan (Ci)
      ↓
Certainty Factor → tingkat keyakinan kategori
      ↓
Decision Engine → kategori kesiapan (deterministik)
      ↓
LLM Explanation Layer (via 9Router) → penjelasan naratif
      ↓
Output: hasil, penjelasan, dan laporan
```

### 2.2 Pembagian Tanggung Jawab Komponen

| Komponen | Tanggung jawab | Boleh mengubah hasil? |
|---|---|---|
| Input & validasi | Memastikan data lengkap dan dalam rentang valid | Tidak |
| Fuzzy AHP | Menghitung bobot kriteria | Tidak (bobot dihitung dari penilaian pakar) |
| TOPSIS | Menghitung skor dan peringkat | Tidak |
| CF | Menghitung tingkat keyakinan | Tidak |
| Decision Engine | Menetapkan kategori dari aturan tetap | **Ya (satu-satunya sumber keputusan)** |
| LLM Explanation Layer | Menjelaskan hasil kepada pengguna | **Tidak** |

---

## 3. Pengguna dan Peran

| Peran | Deskripsi | Hak akses utama |
|---|---|---|
| Admin Pengkot | Pengurus yang mengelola data atlet dan pengguna. | Kelola atlet, kelola pengguna, lihat seluruh laporan. |
| Pelatih | Pengguna yang menginput data kondisi atlet. | Input dan lihat data atlet binaannya. |
| Pakar | Penilai bobot dan ambang kategori. | Input penilaian perbandingan berpasangan, atur ambang kategori. |
| Atlet | Peserta yang dinilai. | Lihat hasil kesiapan dirinya sendiri (opsional, sesuai kebijakan pengkot). |

---

## 4. Kebutuhan Fungsional

### 4.1 Manajemen Pengguna dan Autentikasi

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-01 | Sistem menyediakan login dan logout untuk setiap peran. | Tinggi |
| FR-02 | Sistem membatasi akses data sesuai peran pengguna. | Tinggi |
| FR-03 | Admin dapat membuat, mengubah, dan menonaktifkan akun pengguna. | Sedang |

### 4.2 Manajemen Data Atlet

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-04 | Sistem menyimpan profil atlet (nama, usia, berat badan, kelas berat, riwayat kompetisi). | Tinggi |
| FR-05 | Sistem mencatat data kriteria kesiapan per atlet per periode penilaian. | Tinggi |
| FR-06 | Sistem menyimpan riwayat penilaian sehingga perubahan kesiapan dapat dilacak. | Sedang |
| FR-07 | Sistem memvalidasi input (rentang nilai, kelengkapan, tipe data). | Tinggi |

### 4.3 Kriteria Kesiapan

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-08 | Sistem menyediakan daftar kriteria kesiapan yang dapat dikonfigurasi (contoh: kebugaran aerobik, kekuatan, kecepatan, teknik, ketahanan, kedisiplinan latihan, pengalaman bertanding). | Tinggi |
| FR-09 | Setiap kriteria memiliki skala penilaian (numerik atau linguistik) dan rentang valid. | Tinggi |
| FR-10 | Sistem menyimpan daftar kriteria beserta versinya. | Sedang |

> **Catatan:** Daftar kriteria final ditetapkan bersama pakar dan dicantumkan pada bab metodologi laporan.

### 4.4 Fuzzy AHP (Penentuan Bobot)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-11 | Pakar dapat mengisi matriks perbandingan berpasangan antar kriteria menggunakan skala linguistik. | Tinggi |
| FR-12 | Sistem mengonversi skala linguistik menjadi bilangan fuzzy segitiga. | Tinggi |
| FR-13 | Sistem menghitung nilai sintetis fuzzy dan derajat kemungkinan menggunakan extent analysis (Chang, 1996). | Tinggi |
| FR-14 | Sistem menghitung bobot kriteria yang sudah dinormalisasi. | Tinggi |
| FR-15 | Sistem menghitung Consistency Ratio (CR) dan menolak matriks dengan CR ≥ 0,1, sambil menampilkan pesan perbaikan. | Tinggi |
| FR-16 | Sistem menyimpan bobot aktif beserta tanggal dan nama pakar yang menetapkannya. | Tinggi |

### 4.5 TOPSIS (Perankingan Kesiapan)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-17 | Sistem membentuk matriks keputusan dari data atlet dan kriteria. | Tinggi |
| FR-18 | Sistem melakukan normalisasi matriks keputusan. | Tinggi |
| FR-19 | Sistem mengalikan matriks ternormalisasi dengan bobot Fuzzy AHP. | Tinggi |
| FR-20 | Sistem menentukan solusi ideal positif (A+) dan negatif (A−) untuk setiap kriteria, termasuk arah kriteria (benefit atau cost). | Tinggi |
| FR-21 | Sistem menghitung jarak Euclidean setiap atlet ke A+ dan A−. | Tinggi |
| FR-22 | Sistem menghitung nilai kedekatan Ci = D− / (D+ + D−) dengan rentang 0 sampai 1. | Tinggi |
| FR-23 | Sistem menampilkan peringkat atlet berdasarkan Ci. | Sedang |

### 4.6 Certainty Factor (Tingkat Keyakinan)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-24 | Sistem menetapkan nilai CF untuk setiap bukti (misalnya setiap kriteria yang terpenuhi) berdasarkan aturan yang ditetapkan pakar. | Tinggi |
| FR-25 | Sistem menggabungkan beberapa nilai CF dengan rumus kombinasi CF bertahap. | Tinggi |
| FR-26 | Sistem menghasilkan nilai CF gabungan dengan rentang −1 sampai 1 untuk setiap kategori kesiapan. | Tinggi |
| FR-27 | Sistem menyimpan nilai CF beserta bukti yang mendasarinya agar dapat ditelusuri. | Sedang |

### 4.7 Decision Engine (Penentuan Kategori)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-28 | Decision Engine menentukan kategori kesiapan berdasarkan kombinasi Ci dan CF menggunakan aturan tetap (rule base). | Tinggi |
| FR-29 | Kategori kesiapan terdiri dari minimal tiga tingkat, misalnya: Siap, Siap dengan Catatan, Belum Siap. (Nama dan ambang ditetapkan pakar.) | Tinggi |
| FR-30 | Untuk input yang sama, Decision Engine harus selalu menghasilkan kategori yang sama (deterministik). | Tinggi |
| FR-31 | Sistem mencatat aturan mana yang aktif sehingga keputusan dapat diaudit. | Tinggi |
| FR-32 | Sistem menandai kasus batas (misalnya Ci berada di sekitar ambang) untuk ditinjau pelatih. | Sedang |

### 4.8 LLM Explanation Layer dan 9Router

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-33 | Sistem mengirim hasil terstruktur (kategori, Ci, CF, bobot, aturan aktif) ke LLM melalui 9Router untuk dijelaskan. | Tinggi |
| FR-34 | LLM hanya menerima data hasil yang sudah dihitung; LLM tidak menerima instruksi untuk mengubah kategori. | Tinggi |
| FR-35 | Sistem memvalidasi keluaran LLM: jika kategori yang disebut LLM berbeda dengan kategori dari Decision Engine, keluaran LLM ditolak dan penjelasan dibuat ulang dari template deterministik. | Tinggi |
| FR-36 | Sistem dapat memilih model LLM melalui 9Router tanpa mengubah kode inti sistem pakar. | Sedang |
| FR-37 | Jika LLM atau 9Router tidak tersedia, sistem tetap menampilkan hasil keputusan dan penjelasan template. | Tinggi |
| FR-38 | Sistem mencatat permintaan dan respons LLM (tanpa data identitas pribadi yang tidak perlu) untuk audit. | Sedang |

### 4.9 Laporan dan Visualisasi

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-39 | Sistem menghasilkan laporan kesiapan per atlet yang memuat data input, bobot, nilai Ci, nilai CF, kategori, dan penjelasan. | Tinggi |
| FR-40 | Sistem menghasilkan laporan rekapitulasi per kelas berat atau per periode. | Sedang |
| FR-41 | Laporan dapat diekspor ke PDF dan Excel. | Sedang |
| FR-42 | Sistem menampilkan grafik peringkat atlet dan perbandingan kriteria. | Rendah |

---

## 5. Kebutuhan Non-Fungsional

| ID | Kategori | Kebutuhan |
|---|---|---|
| NFR-01 | Akurasi perhitungan | Hasil perhitungan Fuzzy AHP, TOPSIS, dan CF harus sesuai dengan perhitungan manual pada data uji (toleransi 0,001). |
| NFR-02 | Determinisme | Dua eksekusi dengan input dan bobot yang sama harus menghasilkan kategori dan skor yang identik. |
| NFR-03 | Kinerja | Perhitungan satu atlet selesai kurang dari 2 detik; laporan rekapitulasi 100 atlet selesai kurang dari 10 detik. |
| NFR-04 | Ketersediaan | Fungsi inti sistem pakar tersedia saat LLM tidak aktif. |
| NFR-05 | Keamanan | Data atlet hanya dapat diakses sesuai peran; komunikasi menggunakan HTTPS. |
| NFR-06 | Privasi | Data pribadi atlet tidak dikirim ke LLM kecuali yang diperlukan untuk penjelasan (cukup nama samaran atau ID). |
| NFR-07 | Kegunaan | Pelatih dapat menginput data satu atlet dalam waktu kurang dari 5 menit. |
| NFR-08 | Bahasa | Antarmuka dan penjelasan menggunakan Bahasa Indonesia. |
| NFR-09 | Keterlacakan | Setiap keputusan dapat ditelusuri ke data input, bobot, nilai, dan aturan yang aktif. |
| NFR-10 | Pemeliharaan | Bobot, kriteria, dan ambang kategori dapat diubah tanpa mengubah kode program. |
| NFR-11 | Portabilitas | Sistem dapat dijalankan di browser modern (Chrome, Edge, Firefox) pada perangkat desktop dan mobile. |

---

## 6. Kebutuhan Data

### 6.1 Data Input

| Data | Tipe | Sumber | Keterangan |
|---|---|---|---|
| Profil atlet | Teks, angka, tanggal | Pengkot / pelatih | Nama, usia, berat badan, kelas berat. |
| Nilai kriteria | Numerik atau linguistik | Pelatih / tes lapangan | Sesuai skala pada FR-09. |
| Riwayat kompetisi | Daftar | Pengkot | Dipakai sebagai salah satu kriteria. |
| Penilaian perbandingan berpasangan | Skala linguistik | Pakar | Input untuk Fuzzy AHP. |
| Aturan CF | Pasangan bukti–nilai CF | Pakar | Input untuk CF. |

### 6.2 Data Hasil

| Data | Keterangan |
|---|---|
| Bobot kriteria | Hasil Fuzzy AHP. |
| Matriks TOPSIS dan nilai Ci | Hasil TOPSIS. |
| Nilai CF gabungan | Hasil Certainty Factor. |
| Kategori kesiapan | Keluaran Decision Engine. |
| Log aturan aktif | Untuk audit. |
| Penjelasan naratif | Keluaran LLM atau template. |

---

## 7. Kebutuhan Model dan Algoritma

### 7.1 Fuzzy AHP

- Skala linguistik dikonversi ke bilangan fuzzy segitiga (l, m, u).
- Perhitungan memakai extent analysis (Chang, 1996).
- Derajat kemungkinan dan normalisasi mengikuti rumus yang dicantumkan pada bab metodologi.
- Matriks dengan CR ≥ 0,1 harus diperbaiki sebelum bobot disimpan.

### 7.2 TOPSIS

- Normalisasi memakai metode vektor (Euclidean).
- Arah kriteria (benefit atau cost) harus ditetapkan untuk setiap kriteria.
- Jarak memakai Euclidean dan nilai Ci dihitung sesuai FR-22.

### 7.3 Certainty Factor

- Kombinasi dua nilai CF positif: CF = CF1 + CF2 × (1 − CF1).
- Kombinasi dua nilai CF negatif: CF = CF1 + CF2 × (1 + CF1).
- Kombinasi dengan tanda berbeda: CF = (CF1 + CF2) / (1 − min(|CF1|, |CF2|)).

### 7.4 Aturan Keputusan

Aturan ditulis dalam bentuk tabel keputusan atau pernyataan IF–THEN. Contoh format:

```
IF Ci ≥ [ambang_1] AND CF ≥ [ambang_cf_1] THEN Kategori = [Kategori A]
IF Ci ≥ [ambang_2] AND CF < [ambang_cf_1] THEN Kategori = [Kategori B]
...
```

Nilai ambang ditetapkan pakar dan dicatat dalam tabel konfigurasi.

---

## 8. Kebutuhan Antarmuka

| ID | Halaman | Kebutuhan |
|---|---|---|
| UI-01 | Login | Form login dengan validasi input. |
| UI-02 | Dashboard | Ringkasan jumlah atlet per kategori kesiapan dan atlet yang perlu ditinjau. |
| UI-03 | Input atlet | Form bertahap untuk profil dan nilai kriteria. |
| UI-04 | Konfigurasi bobot | Matriks perbandingan berpasangan dengan indikator CR secara real time. |
| UI-05 | Hasil atlet | Kategori, Ci, CF, grafik kriteria, dan penjelasan. |
| UI-06 | Rekapitulasi | Tabel peringkat dengan filter kelas berat dan periode. |
| UI-07 | Laporan | Pratinjau dan unduh PDF atau Excel. |

---

## 9. Kebutuhan Keamanan dan Etika

| ID | Kebutuhan |
|---|---|
| SE-01 | Sistem mencantumkan pernyataan bahwa hasil bersifat pendukung keputusan, bukan diagnosis medis atau keputusan final pengkot. |
| SE-02 | Data atlet disimpan dengan kontrol akses berbasis peran. |
| SE-03 | Sebelum data dikumpulkan, atlet atau wali memberikan persetujuan tertulis untuk penggunaan data penelitian. |
| SE-04 | Data penelitian dianonimkan pada tahap analisis dan publikasi. |
| SE-05 | API key 9Router dan OpenRouter disimpan sebagai variabel lingkungan, tidak di dalam kode sumber. |
| SE-06 | Sistem mencatat perubahan bobot, kriteria, dan ambang kategori beserta pengguna yang mengubahnya. |

---

## 10. Kebutuhan Pengujian dan Validasi

### 10.1 Pengujian Fungsional

- Pengujian unit untuk setiap fungsi perhitungan (Fuzzy AHP, TOPSIS, CF, Decision Engine).
- Pengujian integrasi dari input sampai laporan.
- Pengujian validasi input (nilai di luar rentang, data kosong).

### 10.2 Pengujian Perhitungan

- Bandingkan hasil sistem dengan perhitungan manual (spreadsheet) pada minimal 5 data uji.
- Uji determinisme dengan mengulang perhitungan dengan input sama.

### 10.3 Pengujian Validitas Sistem

- Bandingkan kategori sistem dengan penilaian pakar pada sejumlah atlet (kesesuaian dan Cohen's kappa).
- Pengujian kegunaan (usability) dengan pelatih menggunakan System Usability Scale (SUS).

### 10.4 Pengujian Keandalan Instrumen

- Hitung reliabilitas data penilaian kriteria jika menggunakan butir benar/salah (KR-20) atau koefisien yang sesuai untuk skala lain (Cronbach's alpha).

### 10.5 Pengujian LLM Layer

- Uji bahwa keluaran LLM tidak pernah mengubah kategori (target 0 kasus pada seluruh data uji).
- Uji fallback saat 9Router tidak tersedia.

### 10.6 Analisis Sensitivitas

- Ubah bobot kriteria sebesar ±10% dan catat perubahan kategori.
- Identifikasi kriteria yang paling sering menyebabkan perubahan kategori.

---

## 11. Kriteria Penerimaan

Sistem dinyatakan diterima apabila:

1. Seluruh kebutuhan fungsional berprioritas tinggi terpenuhi.
2. Hasil perhitungan sesuai dengan perhitungan manual pada data uji (NFR-01).
3. Decision Engine menghasilkan keputusan yang sama untuk input yang sama (NFR-02).
4. Keluaran LLM tidak pernah mengubah kategori (FR-35).
5. Sistem tetap berfungsi tanpa LLM (FR-37).
6. Kesesuaian kategori dengan penilaian pakar mencapai nilai yang disepakati bersama pembimbing (contoh: kappa ≥ 0,6).
7. Skor SUS mencapai minimal 68 (rata-rata kategori "baik").

---

## 12. Asumsi, Batasan, dan Risiko

### 12.1 Asumsi

- Pakar bersedia menetapkan matriks perbandingan dan aturan CF.
- Data kriteria dapat dikumpulkan secara rutin oleh pelatih atau pengkot.
- Atlet yang dinilai telah memberikan persetujuan.

### 12.2 Batasan

- Sistem hanya mencakup atlet Muaythai Pengkot Pontianak, sehingga hasilnya tidak untuk generalisasi.
- Kriteria dan bobot bersifat subjektif sesuai penilaian pakar.
- Validasi dilakukan pada data terbatas, sehingga kinerja sistem pada kondisi lain belum teruji.
- Sistem tidak mengukur kondisi medis atau cedera.

### 12.3 Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Jumlah pakar terbatas | Bobot kurang representatif | Libatkan minimal tiga pakar dan dokumentasikan kesepakatan. |
| Data atlet tidak lengkap | Hasil perhitungan tidak valid | Validasi input dan wajibkan kelengkapan kriteria. |
| LLM menghasilkan penjelasan yang salah | Kepercayaan pengguna menurun | Validasi kategori (FR-35) dan tampilkan hasil asli dari Decision Engine. |
| Ketergantungan pada layanan eksternal (9Router, OpenRouter) | Penjelasan tidak tersedia | Fallback ke template (FR-37). |
| Perubahan regulasi Muaythai | Kriteria perlu diperbarui | Versi kriteria dan aturan (FR-10). |

---

## 13. Ketertelusuran Kebutuhan (Traceability)

| Tujuan penelitian | Kebutuhan terkait |
|---|---|
| Menentukan bobot kriteria secara fuzzy dan konsisten | FR-11 sampai FR-16, NFR-01 |
| Memeringkat kesiapan atlet | FR-17 sampai FR-23 |
| Mengukur tingkat keyakinan kategori | FR-24 sampai FR-27 |
| Menghasilkan kategori yang dapat diaudit | FR-28 sampai FR-32, NFR-02, NFR-09 |
| Memberikan penjelasan yang mudah dipahami | FR-33 sampai FR-38, NFR-08 |
| Memvalidasi sistem terhadap penilaian pakar | Bagian 10.3 |

---

## 14. Struktur Laporan Penelitian yang Didukung Dokumen Ini

1. Pendahuluan: latar belakang, rumusan masalah, tujuan, manfaat.
2. Tinjauan pustaka: sistem pakar, Fuzzy AHP, TOPSIS, CF, dan kesiapan atlet.
3. Metodologi: desain sistem, pengumpulan data, metode perhitungan, pengujian.
4. Hasil dan pembahasan: bobot, peringkat, kategori, validasi, dan sensitivitas.
5. Penutup: kesimpulan, keterbatasan, dan saran.
6. Lampiran: matriks perbandingan, aturan CF, kuesioner, dan bukti persetujuan.

---

*Dokumen ini adalah draf awal. Nilai ambang, daftar kriteria, dan aturan CF perlu ditetapkan bersama pakar dan pembimbing sebelum implementasi.*
