# Catatan Pakar Berbasis Literatur: Aturan Keputusan Kesiapan Atlet Muaythai

**Sistem:** Perancangan Sistem Pakar Hibrida Fuzzy AHP–TOPSIS–CF untuk Kesiapan Atlet Pengkot Muaythai Pontianak
**Status:** **DRAF — BUKAN HASIL KESEPAKATAN PAKAR MANUSIA.**
Catatan ini disusun oleh asisten AI berdasarkan literatur yang ditelusuri. Catatan ini belum mewakili, dan tidak boleh dicatat sebagai persetujuan, tiga pakar atau pelatih mana pun. Pengesahan hanya sah setelah pakar memberi persetujuan tertulis (lihat Bagian 7).

---

## 1. Cara Membaca Catatan Ini

Setiap keputusan diberi label tingkat bukti:

| Label | Arti |
|---|---|
| **A: Didukung literatur langsung** | Ada sumber yang menyatakan hal serupa pada konteks olahraga atau sistem pakar yang relevan. |
| **B: Didukung prinsip metode** | Keputusan mengikuti aturan metode (Fuzzy AHP, TOPSIS, CF) dan bukan angka empiris. |
| **C: Penilaian pakar (belum ada bukti)** | Angka atau ambang belum ditemukan dalam literatur. Harus diuji dengan data dan pakar sebenarnya. |

Literatur dibatasi pada sumber yang berhasil dibuka saat penelusuran. Sumber yang belum dibuka langsung ditandai.

---

## 2. Catatan Keputusan per Aturan

### K-01. Pemilihan kriteria kesiapan fisik

**Keputusan:** Kriteria yang dipakai mencakup kekuatan, daya ledak (*power*), kecepatan, ketahanan, dan kelincahan.

**Dasar:**
- Kinerja Muaythai ditentukan oleh kebugaran fisik selain keterampilan teknis. Penelitian Kılınç dan Kahraman (2021) menunjukkan bahwa daya anaerob (*peak power* dan *average power*) menjadi penentu kinerja atlet Muaythai.
- Komponen kebugaran yang dinilai penting mencakup kekuatan otot, ketahanan otot, dan kecepatan. Gronek dkk. (2014) dikutip dalam artikel Thailand (TCI-ThaiJo) sebagai dasar kebugaran motorik pada olahraga beladiri.
- Penelitian pada atlet Muaythai dan Brazilian Jiu-Jitsu membandingkan profil kebugaran fisik dan menemukan perbedaan menurut pengalaman latihan (IJERPH, 2022).

**Label:** A

**Tautan:**
- Kılınç & Kahraman (2021): https://dergipark.org.tr/en/download/article-file/4043730
- Profil kebugaran Muaythai vs BJJ (IJERPH 2022): https://doi.org/10.3390/ijerph19148451
- Profil potensi kebugaran atlet Muaythai junior Gresik (2026): https://journal.unesa.ac.id/index.php/sportiva/article/view/47225

---

### K-02. Penggunaan daya relatif (W/kg) dan pengelompokan per kelas berat

**Keputusan:** Kriteria daya dan kecepatan dinormalisasi per kelas berat badan, bukan dibandingkan langsung antaratlet.

**Dasar:** Penelitian pada 42 atlet Muaythai elite (kelas 60, 70, dan 80 kg) menemukan bahwa daya absolut meningkat seiring massa tubuh, sementara daya relatif (W/kg) lebih tinggi pada kelas ringan. Kesimpulannya, performa anaerob bervariasi menurut kelas berat.

**Implikasi desain:** Jika atlet dari kelas berat berbeda dibandingkan tanpa normalisasi, sistem akan bias ke atlet berat. Nilai daya harus dinyatakan dalam W/kg dan TOPSIS dihitung dalam kelompok kelas berat yang sama.

**Label:** A

**Tautan:** https://dergipark.org.tr/en/download/article-file/4756055

---

### K-03. Penggunaan TOPSIS untuk perankingan

**Keputusan:** Nilai kedekatan Ci (0–1) dipakai sebagai ukuran kesiapan utama.

**Dasar:** TOPSIS (Hwang & Yoon, 1981) mengukur jarak setiap alternatif terhadap solusi ideal positif dan negatif. Metode ini sudah umum dipakai dalam pemilihan dan perankingan berbasis kriteria. Dokumen ini belum memverifikasi tautan sumber asli Hwang & Yoon.

**Catatan kehati-hatian:** Nilai Ci bersifat relatif terhadap kelompok yang dibandingkan. Ci 0,70 pada kelompok yang sangat kuat tidak sama artinya dengan Ci 0,70 pada kelompok yang lebih lemah. Nilai ambang harus diuji pada beberapa periode penilaian.

**Label:** B

---

### K-04. Penggunaan Fuzzy AHP (extent analysis) untuk bobot

**Keputusan:** Bobot kriteria dihitung dengan extent analysis Chang (1996) menggunakan bilangan fuzzy segitiga (l, m, u).

**Dasar:**
- Chang (1996) memperkenalkan extent analysis untuk Fuzzy AHP dengan bilangan fuzzy segitiga sebagai skala perbandingan. Artikel ini diterbitkan di *European Journal of Operational Research* 95(3), 649–655.
- Zhu, Jing, dan Chang (1999) mencatat bahwa model Chang 1996 memiliki masalah komputasi, seperti pembagian dengan nol dan nilai di luar rentang, dan mengusulkan perbaikan.
- Studi lanjutan menunjukkan bahwa metode LGP dapat memberikan bobot fuzzy yang lebih masuk akal dibanding extent analysis pada beberapa kasus (Fuzzy Optimization and Decision Making, 2025).

**Implikasi desain:** Implementasi harus memakai rumus yang sudah diperbaiki, memeriksa pembagian dengan nol, dan membandingkan hasilnya dengan perhitungan manual pada data uji.

**Label:** A

**Tautan:**
- Chang (1996), DOI: https://doi.org/10.1016/0377-2217(95)00300-2
- Zhu, Jing & Chang (1999), DOI: https://doi.org/10.1016/s0377-2217(98)00331-2
- Kajian lanjutan (2025), DOI: https://doi.org/10.1007/s10700-025-09463-z

---

### K-05. Kombinasi Certainty Factor dan aturan tanda

**Keputusan:** Kombinasi CF mengikuti model MYCIN:
- Dua nilai positif: CF = X + Y − XY
- Dua nilai negatif: CF = X + Y + XY
- Tanda berbeda: CF = (X + Y) / (1 − min(|X|, |Y|))

**Dasar:** Aturan ini berasal dari model CF Shortliffe dan Buchanan (1975) untuk MYCIN. Dokumen requirement sebelumnya menulis rumus yang sama dalam bentuk yang setara, yaitu CF1 + CF2(1 − CF1) untuk dua positif dan CF1 + CF2(1 + CF1) untuk dua negatif.

**Catatan:** Heckerman menunjukkan bahwa CF tidak sama dengan probabilitas dan asumsi independensi di balik rumus ini cukup kuat. Oleh karena itu, nilai CF dalam sistem ini harus diperlakukan sebagai ukuran keyakinan heuristik, bukan probabilitas kesiapan.

**Label:** A

**Tautan:**
- Heckerman, *The Certainty-Factor Model* (Microsoft Research): https://www.microsoft.com/en-us/research/uploads/prod/2016/11/The-Certainty-Factor-Model.pdf
- Heckerman (2013), *Probabilistic Interpretations for MYCIN's Certainty Factors*: https://arxiv.org/pdf/1304.3419
- Ringkasan MYCIN: https://en.wikipedia.org/wiki/Mycin

---

### K-06. Penimpa kriteria wajib menggunakan nilai minimum

**Keputusan:** Jika kriteria wajib lemah, batas kategori diterapkan (aturan C2–C4 pada dokumen aturan).

**Dasar:** Dalam model CF, kondisi konjungsi (AND) diwakili oleh nilai minimum dari bukti-bukti penyusunnya, sedangkan disjungsi (OR) diwakili oleh nilai maksimum (Heckerman, CF Model). Pendekatan ini mendukung gagasan bahwa kelemahan terkecil menentukan batas hasil, bukan rata-rata.

**Label:** A (prinsip metode CF). Nilai "wajib = 2 atau 1" dan batas kategori tergolong C.

**Tautan:** https://www.microsoft.com/en-us/research/uploads/prod/2016/11/The-Certainty-Factor-Model.pdf

---

### K-07. Modifikasi CF hanya menurunkan kategori

**Keputusan:** CF negatif kuat (≤ −0,50) menurunkan kategori satu tingkat. CF positif tidak menaikkan kategori.

**Dasar:** Dalam MYCIN, CF negatif menunjukkan bukti yang menentang hipotesis. Desain yang hanya memperbolehkan penurunan membuat sistem lebih konservatif.

**Label:** B (keputusan desain). Ambang −0,50 tergolong C.

**Catatan:** Desain ini perlu dikaji. Jika sistem tidak pernah menaikkan kategori, bukti positif tidak berpengaruh, sehingga CF berfungsi hanya sebagai penahan. Pakar perlu menentukan apakah ini yang diinginkan.

---

### K-08. Ambang Ci 0,70 dan 0,45

**Keputusan:** Ambang Siap (≥ 0,70) dan Siap dengan Catatan (≥ 0,45) ditetapkan sebagai usulan awal.

**Dasar:** Tidak ditemukan sumber yang menetapkan ambang Ci untuk kesiapan atlet Muaythai atau pada olahraga beladiri secara umum.

**Label:** C. Ambang ini harus dikalibrasi dengan data penilaian pakar dan data periode nyata.

---

### K-09. Bukti kehadiran latihan ≥ 80% (CF +0,60)

**Keputusan:** Kehadiran di atas 80% dinilai sebagai bukti positif kuat.

**Dasar:** Tidak ditemukan sumber yang menyebut persentase kehadiran tertentu sebagai penanda kesiapan kompetisi. Kebijakan kehadiran di pengkot atau sekolah latihan lain perlu diperiksa sebagai pembanding.

**Label:** C

---

### K-10. Laporan cedera aktif (CF −0,70)

**Keputusan:** Laporan cedera aktif diberi CF negatif kuat dan memicu pesan rujukan kepada tenaga kesehatan.

**Dasar:**
- Sistem tidak mendiagnosis cedera. Penilaian medis menjadi kewenangan tenaga kesehatan.
- Cedera dan performa atlet beladiri terkait. Suryaningrum dan Shapie (2025) membahas tren cedera pada pencak silat yang dipengaruhi perubahan aturan. Studi ini tidak membahas Muaythai.

**Label:** B untuk prinsip keselamatan. Nilai −0,70 tergolong C.

**Tautan:** Suryaningrum & Shapie (2025), DOI: https://doi.org/10.56003/sei.v1i1.511

---

## 3. Ringkasan Keputusan dan Tingkat Bukti

| ID | Keputusan | Label | Perlu validasi pakar |
|---|---|---|---|
| K-01 | Kriteria kebugaran fisik | A | Ya (daftar final) |
| K-02 | Normalisasi per kelas berat (W/kg) | A | Ya (cara pengelompokan) |
| K-03 | TOPSIS untuk perankingan | B | Ya (kalibrasi Ci) |
| K-04 | Fuzzy AHP extent analysis | A | Ya (matriks perbandingan) |
| K-05 | Kombinasi CF model MYCIN | A | Tidak (prinsip metode) |
| K-06 | Nilai minimum untuk kriteria wajib | A/C | Ya (nilai batas) |
| K-07 | CF hanya menurunkan kategori | B/C | Ya (kebijakan desain) |
| K-08 | Ambang Ci 0,70 dan 0,45 | C | Ya, wajib |
| K-09 | Kehadiran ≥ 80% (+0,60) | C | Ya, wajib |
| K-10 | Cedera aktif (−0,70) | B/C | Ya, bersama tenaga kesehatan |

**Kesimpulan jujur:** Dari sepuluh keputusan, hanya sebagian yang didukung literatur langsung. Ambang angka (K-08, K-09) dan nilai CF per bukti (K-09, K-10) belum memiliki dasar empiris. Angka-angka tersebut hanya bisa dipertanggungjawabkan setelah pakar menyepakatinya dan data uji dikumpulkan.

---

## 4. Keterbatasan Literatur yang Ditemukan

- Penelitian kebugaran Muaythai yang ditemukan umumnya berskala kecil (satu atlet, 22 atlet, 30 atlet, atau 42 atlet).
- Belum ditemukan studi yang menetapkan kriteria kesiapan kompetisi Muaythai secara kuantitatif.
- Belum ditemukan studi yang memvalidasi sistem pakar hibrida Fuzzy AHP–TOPSIS–CF untuk olahraga beladiri.

---

## 5. Rekomendasi Validasi untuk Tiga Pakar

1. **Putaran 1 (Delphi):** Setiap pakar memberi penilaian terhadap K-01 sampai K-10 dengan skala setuju, ragu, atau tidak setuju, disertai alasan tertulis.
2. **Putaran 2:** Pakar meninjau ulang butir yang masih berbeda pendapat, khususnya K-08, K-09, dan K-10.
3. **Penetapan:** Ambang dan nilai CF yang disepakati dicatat dalam tabel konfigurasi, lengkap dengan tanggal dan tanda tangan.
4. **Uji data:** Bandingkan keputusan sistem dengan keputusan tertulis pakar pada minimal 30 atlet.

---

## 6. Daftar Pustaka yang Berhasil Dibuka

1. Chang, D.-Y. (1996). Applications of the extent analysis method on fuzzy AHP. *European Journal of Operational Research*, 95(3), 649–655. https://doi.org/10.1016/0377-2217(95)00300-2
2. Zhu, K.-J., Jing, Y., & Chang, D.-Y. (1999). A discussion on extent analysis method and applications of fuzzy AHP. *European Journal of Operational Research*. https://doi.org/10.1016/s0377-2217(98)00331-2
3. Heckerman, D. The Certainty-Factor Model. Microsoft Research. https://www.microsoft.com/en-us/research/uploads/prod/2016/11/The-Certainty-Factor-Model.pdf
4. Heckerman, D. (2013). Probabilistic Interpretations for MYCIN's Certainty Factors. arXiv:1304.3419. https://arxiv.org/pdf/1304.3419
5. Shortliffe, E. H., & Buchanan, B. G. (1975). A model of inexact reasoning in medicine. *Mathematical Biosciences*, 23(3–4), 351–379. https://doi.org/10.1016/0025-5564(75)90047-4
6. Kılınç, F., & Kahraman, Y. (2021). Effects of intensive combined training on performance level based on multifaceted performance analysis of elite athlete preparing for Muay Thai championship. *Uluslararası Bozok Spor Bilimleri Dergisi*, 2(3), 13–24. https://dergipark.org.tr/en/download/article-file/4043730
7. Muay Thai anaerobic power by weight class (42 elite athletes). https://dergipark.org.tr/en/download/article-file/4756055
8. Comparison of the Physical Fitness Profile of Muay Thai and Brazilian Jiu-Jitsu Athletes with Reference to Training Experience. *International Journal of Environmental Research and Public Health*, 19(14), 8451. https://doi.org/10.3390/ijerph19148451
9. Azzahwa, N., dkk. (2026). Karakteristik Kebugaran Fisik Atlet Muaythai Junior: Bukti dari Kabupaten Gresik. *Journal of Sport Inclusivity, Value and Activity*, 1(1), 1–8. https://journal.unesa.ac.id/index.php/sportiva/article/view/47225
10. Suryaningrum, J. A., & Shapie, M. N. M. (2025). Injury trends in Pencak Silat: Impact of regulation changes on sparring athletes. *Sport, Exercise, and Injury*, 1(1), 15–26. https://doi.org/10.56003/sei.v1i1.511
11. Fuzzy Optimization and Decision Making (2025). https://doi.org/10.1007/s10700-025-09463-z

**Sumber yang belum diverifikasi tautannya:** Hwang & Yoon (1981) tentang TOPSIS, dan Gronek dkk. (2014) yang dikutip dalam artikel Thailand. Verifikasi sebelum dikutip dalam laporan.

---

## 7. Pengesahan Pakar (Belum Diisi)

Bagian ini hanya diisi oleh pakar yang memberi persetujuan langsung.

| Pakar | Latar belakang | Tanggal | Tanda tangan |
|---|---|---|---|
| Pakar 1 | ........ | ........ | ........ |
| Pakar 2 | ........ | ........ | ........ |
| Pakar 3 | ........ | ........ | ........ |

---

*Catatan ini dibuat oleh asisten AI sebagai bahan diskusi. Keputusan akhir ada pada ketiga pakar dan pembimbing penelitian.*
