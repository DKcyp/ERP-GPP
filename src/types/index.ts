// Existing types from MonitoringIzinAlatDashboard.tsx
export interface IzinAlatData {
  id: string;
  no: number;
  kodeBarang: string;
  namaAlat: string;
  noSeri: string;
  jenisPerizinan: string;
  tanggalBerlaku: string;
  tanggalExp: string;
  status: 'Aktif' | 'Segera Habis' | 'Expired' | 'Menunggu Persetujuan' | 'Disetujui' | 'Izin Tersedia';
}

export interface HistoryIzinEntry {
  no: number;
  tanggalPerpanjang: string;
  tanggalExp: string;
  dokumenUrl: string;
  catatan?: string;
}

// Updated PerpanjangIzinFormData
export interface PerpanjangIzinFormData {
  namaAlat: string;
  kodeBarang: string;
  noSeri: string;
  jenisPerizinan: string;
  alasan?: string; // Added 'alasan' based on image
}

// Updated DetailIzinAlatFormData
export interface DetailIzinAlatFormData {
  kodeBarang: string;
  namaAlat: string;
  noSeri: string;
  jenisPerizinan: string;
  noDokumen: string;
  tanggalMulaiBerlaku: string;
  tanggalBerakhir: string;
  uploadDokumen?: File | null; // Added for file upload
}

// New type for PerizinanAlatDashboard table
export interface PerizinanAlatEntry {
  id: string;
  no: number;
  kodeBarang: string;
  namaAlat: string;
  noSeri: string;
  jenisPerizinan: string;
  status: 'Belum Berizin' | 'Menunggu Persetujuan' | 'Disetujui' | 'Izin Tersedia' | 'Aktif';
}

// New type for AjukanIzinModal
export interface AjukanIzinFormData {
  kodeBarang: string;
  namaAlat: string;
  noSeri: string;
  jenisPerizinan: string;
  catatan?: string;
}

// New type for Dashboard Alerts
export interface AlertItem {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
  actionText?: string;
}

// New type for EntrySupplierBiddingModal (keeping it for now, though not used in this dashboard directly)
export interface EntrySupplierBiddingFormData {
  noBidding: string;
  tanggalBidding: string;
  noPR: string;
  departemen: string;
  itemBarangJasa: string[];
  qty: number;
  namaVendor: string[];
  namaPemenang?: string;
}

// New type for Daftar Seleksi Supplier / Bidding Dashboard table
export interface SeleksiSupplierBiddingData {
  no: number;
  noBidding: string;
  tglPendaftaranVendor: string;
  namaVendor: string;
  namaPIC: string;
  noTelp: string;
  noPR: string;
  vendorTerpilih: 'Accept' | 'Rejected';
}

// New types for PO Barang Dashboard Modals
export interface POApprovalHistory {
  managerPPIC: 'Approve' | 'Pending';
  gudangManajer: 'Approve' | 'Pending';
  direkturOPS: 'Approve' | 'Pending';
  direkturUtama: 'Approve' | 'Pending';
}

export interface DetailPOBarangItem {
  kodeBarang: string;
  namaBarang: string;
  beliSatuan: string;
  jumlahBeli: number;
  hargaSatuan: number;
  disc: number;
  jumlah: number;
}

export interface DetailPOBarangData {
  noPr: string;
  vendor: string;
  ppn: string; // Assuming PPN is a string like "11%"
  noPoBarang: string;
  tanggalPo: string;
  items: DetailPOBarangItem[];
}

// New type for EntryPOBarangModal
export interface EntryPOBarangFormData {
  noPr: string;
  periodePr: string;
  divisi: string;
  kodeSupplier: string;
  namaSupplier: string;
  noPo: string;
  tanggalPo: string;
  tanggalPengiriman: string;
  status: 'Paid' | 'Unpaid';
}

// New types for Entry PO Jasa Modal
export interface EntryPOJasaItem {
  id: string; // Unique ID for each item in the table
  namaJasa: string;
  kodeJasa: string;
  qty: number;
  satuan: string;
  hargaSatuan: number;
  disc: number; // Assuming percentage for now
  jumlah: number; // Calculated field
  keterangan: string;
}

export interface EntryPOJasaFormData {
  noPr: string;
  tanggalPo: string; // Date string
  noPo: string;
  vendor: string;
  noSo: string;
  kodeVendor: string;
  departemen: string;
  pajak: string; // e.g., "PPN 11%"
  metodePembayaran: string;
  items: EntryPOJasaItem[];
  daftarFile: File | null; // For file upload
}

// New type for PO Jasa Data in the dashboard table
export interface POJasaData {
  id: number;
  noPr: string;
  periodePr: string;
  divisi: string;
  kodeSupplier: string;
  namaSupplier: string;
  noPo: string;
  tanggalPo: string;
  tanggalPengiriman: string;
  status: 'Paid' | 'Unpaid';
  items: EntryPOJasaItem[]; // Added for edit functionality
}

// New types for Gudang Penerimaan Dashboard
export interface TandaTerimaPODariGudangData {
  id: string;
  no: number;
  noPO: string;
  noFaktur: string;
  tglFaktur: string;
  vendor: string;
  penerima: string;
  verifikasi: boolean;
}

export interface TandaTerimaGudangItem {
  kodeBarang: string;
  namaBarang: string;
  jumlah: number;
  diterima: number;
  satuan: string;
  hargaSatuan: number;
  hargaGross: number;
}

export interface TandaTerimaGudangDetailData {
  noPO: string;
  noFaktur: string;
  tglFaktur: string;
  penerima: string;
  tanggalVerifikasi: string; // dd/mm/yyyy
  namaVerifikasi: string;
  unduhDokumen: string; // filename or URL
  items: TandaTerimaGudangItem[];
  grandTotal: number;
}

// New type for Invoice Dashboard
export interface InvoiceDashboardData {
  id: string;
  no: number;
  noPO: string;
  tanggalPO: string; // Tanggal PO
  namaVendor: string;
  nilaiInvoice: string; // Nilai Invoice
  penerimaInvoice: string; // Penerima Invoice
  statusVerifikasi: 'Pending' | 'Approved' | 'Rejected';
  unduhInvoice: string; // URL or filename for invoice download
  tanggalVerifikasi: string; // dd/mm/yyyy
}

// New type for Invoice Form Input
export interface InvoiceFormInput {
  noPO: string;
  tanggalPO: string;
  namaVendor: string;
  nilaiInvoice: string;
  penerimaInvoice: string;
}

// New type for the data displayed in the Tanda Terima Invoice Modal
export interface TandaTerimaInvoiceDetail {
  id: string;
  tanggalPO: string;
  noPO: string;
  namaVendor: string;
  nilaiInvoice: string;
  penerimaInvoice: string;
  unduhInvoice: string; // URL or filename
  tanggalVerifikasi: string; // dd/mm/yyyy
}

// Existing type for DetailInvoiceModal (from context buffer)
export interface InvoiceDetailItem {
  no: number;
  kodeBarang: string;
  namaBarang: string;
  jumlah: number;
  satuan: string;
  harga: number;
}

export interface InvoiceDetailData {
  noSO: string;
  namaProject: string;
  hppSO: string;
  noInvoice: string;
  items: InvoiceDetailItem[];
}
