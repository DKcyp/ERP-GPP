# Template Cetakan - ERP GPP

## 📋 Deskripsi
Dokumentasi untuk template cetakan yang tersedia di sistem ERP GPP. Saat ini tersedia 2 template cetakan:

1. **Proforma Invoice** - untuk menu Procon > Proforma Invoice > Pembuatan PI
2. **BA Serah Terima Asset** - untuk menu GA > BA Serah Terima Asset

Template-template ini menyediakan format profesional untuk mencetak dokumen dengan layout yang rapi dan informasi lengkap sesuai standar perusahaan.

## 🚀 Cara Menggunakan

---

# 📄 TEMPLATE 1: PROFORMA INVOICE

### 1. Login sebagai Procon
- Username: `procon`
- Password: `12345`

### 2. Navigasi ke Menu
- Klik menu **Proforma Invoice**
- Pilih submenu **Pembuatan PI**

### 3. Mencetak Proforma Invoice
1. Pada tabel data Proforma Invoice, klik tombol **Printer** (ikon printer) pada baris yang ingin dicetak
2. Template cetakan akan muncul dalam modal preview
3. Klik tombol **"Cetak"** untuk mencetak dokumen
4. Klik tombol **"Tutup"** untuk menutup preview

---

# 📋 TEMPLATE 2: BA SERAH TERIMA ASSET

### 1. Login sebagai GA
- Username: `ga`
- Password: `12345`

### 2. Navigasi ke Menu
- Klik menu **BA Serah Terima**
- Pilih submenu **BA Serah Terima Asset**

### 3. Mencetak BA Serah Terima
1. Pada tabel data BA Serah Terima, klik tombol **Printer** (ikon printer hijau) pada baris yang ingin dicetak
2. Template cetakan akan muncul dalam modal preview dengan format formulir resmi
3. Klik tombol **"Print"** untuk mencetak dokumen
4. Klik tombol **"Tutup"** untuk menutup preview

---

## 📄 Komponen Template

### File yang Dibuat/Dimodifikasi:

#### Template Proforma Invoice:
1. **`/src/components/ProformaInvoicePrintTemplate.tsx`** (BARU)
   - Komponen React untuk template cetakan PI
   - Layout profesional dengan header perusahaan
   - Tabel rincian layanan dan ringkasan pembayaran

2. **`/src/components/ProconPembuatanPIDashboard.tsx`** (DIMODIFIKASI)
   - Integrasi template cetakan PI
   - Handler untuk print functionality
   - State management untuk print modal

#### Template BA Serah Terima Asset:
3. **`/src/components/BASerahTerimaPrintTemplate.tsx`** (BARU)
   - Komponen React untuk template cetakan BA Serah Terima
   - Format formulir resmi sesuai standar perusahaan
   - Layout dengan logo GBP dan tabel asset

4. **`/src/components/GABASerahTerimaAssetDashboard.tsx`** (DIMODIFIKASI)
   - Integrasi template cetakan BA
   - Tombol print hijau pada setiap row
   - Handler untuk print functionality

#### Shared Components:
5. **`/src/styles/print.css`** (DIMODIFIKASI)
   - CSS khusus untuk optimasi print kedua template
   - Media query untuk format A4
   - Styling yang printer-friendly untuk semua template

6. **`/src/main.tsx`** (DIMODIFIKASI)
   - Import CSS print untuk global styling

## 🎨 Fitur Template

---

### 📄 TEMPLATE PROFORMA INVOICE

#### Layout Profesional
- **Header Perusahaan**: Logo dan informasi kontak PT. Global Prima Perkasa
- **Judul Dokumen**: "PROFORMA INVOICE" yang prominent
- **Informasi Invoice**: Nomor, tanggal, sales, jatuh tempo, pajak
- **Informasi Client**: Nama client, SO Induk/Turunan, nomor kontrak

#### Rincian Layanan
- **Tabel Terstruktur**: No, Deskripsi, Qty, Harga Satuan, Total
- **Perhitungan Otomatis**: Subtotal, PPN (jika applicable), Total akhir
- **Format Rupiah**: Formatting currency Indonesia yang proper

#### Informasi Pembayaran
- **Rekening Bank**: Informasi transfer bank
- **Ketentuan Pembayaran**: Terms dan kondisi
- **Tanggal Jatuh Tempo**: Deadline pembayaran

#### Footer Profesional
- **Tanda Tangan**: Area untuk sales representative
- **Timestamp**: Tanggal cetak dokumen
- **Catatan**: Informasi tambahan dan disclaimer

---

### 📋 TEMPLATE BA SERAH TERIMA ASSET

#### Header Formulir
- **Logo GBP**: Logo perusahaan dengan background kuning
- **Judul Formulir**: "FORMULIR TANDA TERIMA ASET PERUSAHAAN"
- **Informasi Dokumen**: Nomor dokumen, revisi, tanggal revisi, halaman
- **Copyright**: © Perusahaan/ Rev. 00 / 22 Agustus 2019

#### Informasi Karyawan
- **Data Penerima**: Nama karyawan, departemen, jabatan
- **Informasi Form**: Nomor form, tanggal serah terima
- **Alamat Serah Terima**: Bapak/Ibu yang menerima

#### Tabel Asset
- **Kolom Terstruktur**: No, Nama Asset, Kode Asset, Jumlah, Keterangan
- **Data Asset**: Informasi lengkap asset yang diserahkan
- **Kondisi Asset**: Status kondisi (Baik/Rusak/Perlu Perbaikan)

#### Pernyataan dan Tanda Tangan
- **Pernyataan Tanggung Jawab**: Text formal tentang tanggung jawab penerima
- **Area Tanda Tangan**: Yang menyerahkan dan yang menerima
- **Lokasi dan Tanggal**: Jakarta dengan tanggal serah terima

---

## 🖨️ Optimasi Print

### CSS Print Media Query
```css
@media print {
  @page {
    size: A4;
    margin: 1cm;
  }
}
```

### Fitur Print-Friendly
- **Hide Controls**: Tombol dan navigasi disembunyikan saat print
- **Black & White**: Optimasi untuk printer monochrome
- **Page Breaks**: Kontrol pemisahan halaman
- **Font Sizing**: Ukuran font yang optimal untuk print

## 💻 Implementasi Teknis

### State Management
```typescript
const [showPrintTemplate, setShowPrintTemplate] = useState(false);
const [printData, setPrintData] = useState<PIEntry | null>(null);
```

### Print Handler
```typescript
const handlePrint = (id: string) => {
  const item = data.find(d => d.id === id);
  if (!item) return;
  setPrintData(item);
  setShowPrintTemplate(true);
};
```

### Template Component
```typescript
<ProformaInvoicePrintTemplate
  data={printData}
  onClose={handleClosePrint}
  onPrint={handlePrintComplete}
/>
```

## 📊 Data yang Ditampilkan

### Informasi Utama
- No. Invoice (auto-generated: PI-{id}-{year})
- Tanggal Dokumen
- Nama Sales
- Tanggal Jatuh Tempo
- Jenis Pajak (PPN/Non PPN)

### Data Client
- Nama Client/Perusahaan
- Nomor SO Induk
- SO Turunan
- Nomor Kontrak/PO

### Rincian Finansial
- Nilai Kontrak
- Perhitungan PPN (11% jika applicable)
- Total Akhir
- Informasi Bank Transfer

## 🔧 Kustomisasi

### Mengubah Header Perusahaan
Edit file `ProformaInvoicePrintTemplate.tsx`:
```typescript
<h1 className="text-2xl font-bold mb-2">PT. GLOBAL PRIMA PERKASA</h1>
<p className="text-sm text-gray-600">
  Jl. Contoh Alamat No. 123, Jakarta 12345<br/>
  Telp: (021) 1234-5678 | Email: info@gpp.co.id
</p>
```

### Mengubah Format Currency
```typescript
const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};
```

### Menambah Field Baru
1. Update interface `PIEntry` di kedua file
2. Tambah field di template layout
3. Update form input di dashboard

## 🎯 Testing

### Test Scenario - Proforma Invoice
1. **Login Test**: Login sebagai user `procon`
2. **Navigation Test**: Akses menu Proforma Invoice > Pembuatan PI
3. **Data Test**: Pastikan ada data sample di tabel
4. **Print Test**: Klik tombol printer pada salah satu row
5. **Preview Test**: Verifikasi template muncul dengan data yang benar
6. **Print Test**: Test actual printing functionality

### Test Scenario - BA Serah Terima Asset
1. **Login Test**: Login sebagai user `ga`
2. **Navigation Test**: Akses menu BA Serah Terima > BA Serah Terima Asset
3. **Data Test**: Pastikan ada data sample BA di tabel
4. **Print Test**: Klik tombol printer hijau pada salah satu row
5. **Preview Test**: Verifikasi template formulir muncul dengan:
   - Logo GBP dengan background kuning
   - Data karyawan penerima yang benar
   - Informasi asset yang sesuai
   - Format tabel yang rapi
6. **Print Test**: Test actual printing dengan format A4

### Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### Print Test
- ✅ Print Preview
- ✅ PDF Export
- ✅ Physical Printer
- ✅ A4 Paper Size

## 📝 Notes

### Limitasi Saat Ini
- Template menggunakan data mock untuk informasi perusahaan
- Nomor rekening bank adalah contoh
- Logo perusahaan belum diintegrasikan (bisa ditambah kemudian)

### Future Enhancements
- Integrasi logo perusahaan
- Template kustomisasi per client
- Export ke PDF otomatis
- Email integration untuk kirim PI
- Digital signature integration

## 🆘 Troubleshooting

### Template Proforma Invoice Tidak Muncul
- Pastikan data PI ada di tabel
- Check console browser untuk error
- Verifikasi import CSS print berhasil

### Template BA Serah Terima Tidak Muncul
- Pastikan login sebagai user `ga`
- Verifikasi data BA ada di tabel
- Check console browser untuk error React
- Pastikan import `BASerahTerimaPrintTemplate` berhasil

### Print Tidak Sesuai Format
- Check printer settings (A4, Portrait)
- Pastikan browser print preview aktif
- Verifikasi CSS print media query
- Untuk BA Serah Terima: pastikan logo GBP muncul dengan background kuning

### Data Tidak Lengkap
- **Proforma Invoice**: Check mapping data di interface PIEntry
- **BA Serah Terima**: Check interface BASerahTerimaItem
- Verifikasi data sample di komponen
- Update form input jika ada field baru

### Logo atau Styling Tidak Muncul
- Pastikan CSS print sudah diimport di main.tsx
- Check browser developer tools untuk CSS conflicts
- Verifikasi print-color-adjust property untuk background colors

## 📞 Support
Untuk pertanyaan atau issue terkait template cetakan ini, silakan check:
1. Console browser untuk error messages
2. Network tab untuk failed requests
3. File structure untuk missing components
