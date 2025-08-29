import { type } from "os";

// Existing types (if any)
// ...

// New types for SeleksiSupplierDashboard modals
export interface BiddingItemDetail {
  namaBarang: string;
  qty: number;
  namaVendor: string;
  harga: string;
  diskon: string;
  jumlah: string;
  ppnNonPpn: string;
  lamaPengiriman: string;
  garansi: string;
  metodeBayar: string;
  keterangan: string;
  status: 'Approve' | 'Rejected' | 'Pending';
}

export interface DetailedBiddingEntry {
  id: number;
  noBidding: string;
  tanggalBidding: string;
  noPr: string;
  departemen: string;
  vendorOfferings: BiddingItemDetail[];
}

// Type for DaftarSeleksiSupplierBiddingDashboard
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

// Types for Kas Masuk
export interface DetailItem {
  id: number;
  coa: string;
  nominal: number;
  keterangan: string;
  client: string;
}

export interface KasMasukFormData {
  id?: number; // Optional for new entries, required for edits
  nomorJurnal: string;
  tanggal: Date | null;
  kasAccount: string;
  keteranganHeader: string;
  detailItems: DetailItem[];
  total: number;
}

// Types for Kas Keluar
export interface KasKeluarFormData {
  id?: number; // Optional for new entries, required for edits
  nomorJurnal: string;
  tanggal: Date | null;
  kasAccount: string; // Can be 'Kas Besar', 'Kas Kecil', 'Bank BCA', etc.
  keteranganHeader: string;
  detailItems: DetailItem[];
  total: number;
}

// Types for Bank Masuk
export interface BankMasukFormData {
  id?: number; // Optional for new entries, required for edits
  nomorJurnal: string;
  tanggal: Date | null;
  bankAccount: string;
  keteranganHeader: string;
  detailItems: DetailItem[];
  total: number;
}

// Types for Bank Keluar
export interface BankKeluarFormData {
  id?: number; // Optional for new entries, required for edits
  nomorJurnal: string;
  tanggal: Date | null;
  bankAccount: string;
  keteranganHeader: string;
  detailItems: DetailItem[];
  total: number;
}

export interface RecentTransaction {
  id: number;
  tanggal: string;
  nomorJurnal: string;
  coa: string;
  keterangan: string;
  nominal: number;
  client: string;
}

// Types for PO Jasa
export interface EntryPOJasaItem {
  id: string;
  namaJasa: string;
  kodeJasa: string;
  qty: number;
  satuan: string;
  hargaSatuan: number;
  disc: number;
  jumlah: number;
  keterangan: string;
}

export interface EntryPOJasaFormData {
  noPr: string;
  periodePr: string;
  divisi: string;
  kodeSupplier: string;
  namaSupplier: string;
  noPo: string;
  tanggalPo: string;
  tanggalPengiriman: string;
  status: 'Paid' | 'Unpaid';
  items: EntryPOJasaItem[];
}

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
  items: EntryPOJasaItem[];
}

// Type for PPh21Data
export interface PPh21Data {
  id: number;
  namaPegawai: string;
  npwp: string;
  tanggal: string;
  pph21: number;
}

export interface AlertItem {
  id: string;
  message: string;
  type: 'primary' | 'success' | 'error' | 'info';
  actionText?: string;
  onAction?: () => void;
}

// Types for Procon Invoice
export interface SOTurunan {
  id: string;
  name: string;
  nominal: number;
}

export interface Project {
  id: string;
  name: string;
  soTurunan: SOTurunan[];
}

export interface Invoice {
  id: number;
  noInvoice: string;
  project: string; // Project name
  soTurunan: string; // SO Turunan name
  nominal: string; // Formatted string like "Rp 150.000.000"
  status: 'Pending' | 'Paid' | 'Draft';
}

export interface ProconInvoiceFormInput {
  noInvoice: string;
  projectId: string; // Project ID
  soTurunanId: string; // SO Turunan ID
  nominal: string; // Formatted string or raw number, let's keep it string for now as it's read-only in modal
  status?: 'Pending' | 'Paid' | 'Draft'; // Optional, mainly for edit mode
}
