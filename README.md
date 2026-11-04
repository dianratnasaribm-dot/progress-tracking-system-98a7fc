# Progress Palace - Sistem Tracking Progres & Manajemen Akses

Progress Palace adalah platform web modern untuk manajemen portofolio proyek digital, pelacakan progres butir tugas harian, dan pengelolaan hak akses email berbasis peran (Administrator dan Anggota Tim).

Aplikasi ini dapat digunakan secara langsung oleh berbagai tim dan organisasi (*multi-workspace*), baik menggunakan dataset inisiatif Bank Mega DGBS bawaan maupun membuat workspace tim baru.

## Fitur Utama

- **Multi-Workspace & Tim Mandiri**: Setiap departemen atau organisasi dapat membuat ruang kerja (*workspace*) mereka sendiri dengan proyek, tugas, dan anggota terpisah.
- **Ringkasan Eksekutif (Overview)**: 4 KPI metrik utama (Total Proyek, Total Tugas, Rata-rata Progres, Anggota Aktif), filter multi-kategori, dan pembaruan cepat progres tugas.
- **Portofolio Proyek & Roadmap**: Manajemen inisiatif strategis dengan checklist milestone interaktif, pelacakan anggaran, dan penugasan PIC.
- **Papan Tugas (Table & Kanban)**: Tampilan daftar tabel lengkap (No, Job Distribution, Sub-Job, Area, Frekuensi, PIC, Target ETA, Prioritas, Status) dan Kanban board interaktif.
- **Pembaruan Progres Cepat**: Slider persentase penyelesaian (0-100%), tombol preset (25%, 50%, 75%, 100%), status otomatis, dan catatan riwayat log.
- **Manajemen Hak Akses & Whitelist Email**:
  - Alur pendaftaran mandiri dengan formulir permohonan akses.
  - Antrean persetujuan (Approve/Reject) khusus Administrator.
  - Undangan langsung ke whitelist email.
  - Pengubahan peran secara langsung (Admin <-> Anggota) dan pencabutan hak akses.
- **Laporan & Analitik Kinerja**: Visualisasi beban kerja per anggota tim, rasio penyelesaian tugas, dan statistik prioritas.
- **Impor & Ekspor Data**:
  - Impor massal butir tugas via unggah file CSV atau tempel teks dengan pratinjau otomatis.
  - Ekspor seluruh laporan tugas tim ke file CSV dalam satu klik.
- **Persistensi Data**: Terintegrasi dengan Netlify Database (Postgres terkelola) via Drizzle ORM dan sinkronisasi lokal (*offline-first*).

## Teknologi yang Digunakan

- **Frontend**: TanStack Start, React 19, Tailwind CSS v4, Lucide React
- **Backend**: Netlify Functions (`api.mts`)
- **Database & ORM**: Netlify Database (Managed Postgres), Drizzle ORM (`drizzle-orm@beta`), Drizzle Kit (`drizzle-kit@beta`)
- **Hosting & Platform**: Netlify

## Menjalankan Secara Lokal

1. **Clone repository dan masuk ke direktori**:
   ```bash
   git clone <repo-url>
   cd progress-tracking-system
   ```

2. **Install dependensi**:
   ```bash
   pnpm install
   ```

3. **Jalankan development server**:
   ```bash
   # Menggunakan Netlify CLI (direkomendasikan untuk emulasi database & functions):
   netlify dev --port 8889

   # Atau jalankan Vite dev server:
   pnpm dev
   ```

4. Buka peramban di `http://localhost:8889` (atau port yang ditampilkan).
