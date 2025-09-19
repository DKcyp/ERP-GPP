# Template Cetakan Proforma Invoice - ERP GPP

## 📋 Deskripsi
Template cetakan untuk Proforma Invoice yang dapat diakses melalui menu **Procon > Proforma Invoice > Pembuatan PI**. Template ini menyediakan format profesional untuk mencetak dokumen Proforma Invoice dengan layout yang rapi dan informasi lengkap.

## 🚀 Cara Menggunakan

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

## 📄 Komponen Template

### File yang Dibuat/Dimodifikasi:

1. **`/src/components/ProformaInvoicePrintTemplate.tsx`** (BARU)
   - Komponen React untuk template cetakan
   - Layout profesional dengan header perusahaan
   - Tabel rincian layanan dan ringkasan pembayaran

2. **`/src/styles/print.css`** (BARU)
   - CSS khusus untuk optimasi print
   - Media query untuk format A4
   - Styling yang printer-friendly

3. **`/src/components/ProconPembuatanPIDashboard.tsx`** (DIMODIFIKASI)
   - Integrasi template cetakan
   - Handler untuk print functionality
   - State management untuk print modal

## 🎨 Fitur Template

### Layout Profesional
- **Header Perusahaan**: Logo dan informasi kontak PT. Global Prima Perkasa
- **Judul Dokumen**: "PROFORMA INVOICE" yang prominent
- **Informasi Invoice**: Nomor, tanggal, sales, jatuh tempo, pajak
- **Informasi Client**: Nama client, SO Induk/Turunan, nomor kontrak

### Rincian Layanan
- **Tabel Terstruktur**: No, Deskripsi, Qty, Harga Satuan, Total
- **Perhitungan Otomatis**: Subtotal, PPN (jika applicable), Total akhir
- **Format Rupiah**: Formatting currency Indonesia yang proper

### Informasi Pembayaran
- **Rekening Bank**: Informasi transfer bank
- **Ketentuan Pembayaran**: Terms dan kondisi
- **Tanggal Jatuh Tempo**: Deadline pembayaran

### Footer Profesional
- **Tanda Tangan**: Area untuk sales representative
- **Timestamp**: Tanggal cetak dokumen
- **Catatan**: Informasi tambahan dan disclaimer

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

### Test Scenario
1. **Login Test**: Login sebagai user `procon`
2. **Navigation Test**: Akses menu Proforma Invoice > Pembuatan PI
3. **Data Test**: Pastikan ada data sample di tabel
4. **Print Test**: Klik tombol printer pada salah satu row
5. **Preview Test**: Verifikasi template muncul dengan data yang benar
6. **Print Test**: Test actual printing functionality

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

### Template Tidak Muncul
- Pastikan data PI ada di tabel
- Check console browser untuk error
- Verifikasi import CSS print berhasil

### Print Tidak Sesuai Format
- Check printer settings (A4, Portrait)
- Pastikan browser print preview aktif
- Verifikasi CSS print media query

### Data Tidak Lengkap
- Check mapping data di interface PIEntry
- Verifikasi data sample di localStorage
- Update form input jika ada field baru

## 📞 Support
Untuk pertanyaan atau issue terkait template cetakan ini, silakan check:
1. Console browser untuk error messages
2. Network tab untuk failed requests
3. File structure untuk missing components
