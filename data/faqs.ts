import type { FAQItem } from "@/types"

export const dummyFAQs: FAQItem[] = [
  {
    id: "1",
    question: "Bagaimana cara reset password?",
    answer:
      'Untuk reset password, silakan hubungi administrator sistem atau gunakan fitur "Lupa Password" di halaman login.',
    type: "text",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    question: "Bagaimana cara membuat laporan baru?",
    answer: 'Login ke sistem, pilih menu "Buat Laporan", isi form dengan lengkap, dan klik submit.',
    type: "text",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    question: "Panduan Penggunaan Sistem E-Helpdesk",
    answer: "Panduan lengkap penggunaan sistem untuk semua role pengguna.",
    content: `
# Panduan Penggunaan E-Helpdesk

## Untuk Staff
1. **Login** - Gunakan akun yang telah diberikan oleh administrator
2. **Dashboard** - Lihat ringkasan laporan dan notifikasi terbaru
3. **Buat Laporan** - Klik menu "Buat Laporan" untuk membuat laporan baru
4. **Pantau Status** - Cek status laporan di dashboard atau menu laporan
5. **Chat** - Gunakan fitur chat untuk komunikasi dengan admin/master

## Untuk Admin
1. **Kelola Laporan** - Review dan proses laporan yang masuk
2. **Assign Laporan** - Tugaskan laporan ke staff yang tepat
3. **Update Status** - Ubah status laporan sesuai progress
4. **Kelola User** - Tambah, edit, atau hapus user staff
5. **Kelola FAQ** - Manage frequently asked questions

## Untuk Master
1. **Akses Penuh** - Akses ke semua fitur sistem
2. **Kelola Admin** - Tambah, edit, atau hapus user admin dan staff
3. **Monitor Statistik** - Lihat statistik dan analytics sistem
4. **Konfigurasi** - Setting dan konfigurasi sistem
5. **Backup Data** - Kelola backup dan restore data

## Tips Penggunaan
- Selalu logout setelah selesai menggunakan sistem
- Update status laporan secara berkala
- Gunakan fitur search untuk mencari laporan dengan cepat
- Manfaatkan fitur chat untuk komunikasi yang lebih efektif
    `,
    type: "article",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    question: "Template Laporan dan Formulir",
    answer: "Download template dan formulir yang diperlukan untuk membuat laporan yang sesuai standar.",
    type: "file",
    attachments: [
      {
        name: "Template_Laporan_IT.docx",
        url: "/templates/template-laporan-it.docx",
        size: "245 KB",
      },
      {
        name: "Formulir_Permintaan_Akses.pdf",
        url: "/templates/formulir-akses.pdf",
        size: "180 KB",
      },
      {
        name: "Checklist_Hardware.xlsx",
        url: "/templates/checklist-hardware.xlsx",
        size: "156 KB",
      },
    ],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    question: "Troubleshooting Koneksi Internet",
    answer: "Langkah-langkah untuk mengatasi masalah koneksi internet yang sering terjadi.",
    content: `
# Troubleshooting Koneksi Internet

## Langkah Dasar
1. **Cek Kabel** - Pastikan semua kabel terhubung dengan baik
2. **Restart Router** - Matikan router selama 30 detik, lalu nyalakan kembali
3. **Cek Indikator** - Perhatikan lampu indikator pada router/modem
4. **Test Koneksi** - Coba akses website sederhana seperti google.com

## Langkah Lanjutan
1. **Flush DNS** - Buka Command Prompt, ketik: ipconfig /flushdns
2. **Reset Network** - Buka Network Settings > Network Reset
3. **Update Driver** - Update driver network adapter
4. **Scan Malware** - Jalankan antivirus scan

## Kapan Hubungi IT Support
- Masalah berlangsung lebih dari 1 jam
- Tidak ada indikator hidup pada router
- Error message yang tidak dimengerti
- Kecepatan internet sangat lambat secara konsisten

## Informasi yang Perlu Disiapkan
- Lokasi/ruangan yang bermasalah
- Waktu mulai terjadi masalah
- Pesan error (jika ada)
- Langkah yang sudah dicoba
    `,
    type: "article",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]
