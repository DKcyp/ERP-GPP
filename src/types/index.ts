import { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'marketing' | 'operational' | 'hrd' | 'pengadaan' | 'finance' | 'gudang' | 'management' | 'qhse' | 'accounting' | 'tax' | 'procon';
}

export interface MenuSection {
  title: string;
  icon: string; // Name of the Lucide icon
  items?: MenuItem[];
  subSections?: MenuSubSection[];
  directPath?: string; // For sections that are directly clickable
}

export interface MenuSubSection {
  title: string;
  icon: string; // Name of the Lucide icon
  items: MenuItem[];
}

export interface MenuItem {
  title: string;
  icon: string; // Name of the Lucide icon
  path: string;
}

export interface ApprovalActionData {
  invoiceId: string;
  action: 'approve' | 'reject';
  keterangan: string;
}

export interface PenggajianDetailItem {
  no: number;
  tanggalPenggajian: string;
  gajiPokok: number;
  potonganPPH21: number;
  potonganBPJS: number;
  potonganMess: number;
  uangTunjangan: number;
  totalGaji: number;
}

export interface PenggajianDetailData {
  id: string;
  noPenggajian: string;
  periode: string;
  noPegawai: string;
  namaPegawai: string;
  nipPegawai: string;
  keterangan: string;
  bonusKinerja: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approver: string;
  items: PenggajianDetailItem[];
}

export interface ApprovalPenggajianActionData {
  penggajianId: string;
  action: 'approve' | 'reject';
  keterangan: string;
}

// NEW: SPK Data Types
export interface SPKData {
  id: string;
  noSPK: string;
  tanggalSPK: string;
  namaPegawai: string;
  jabatan: string;
  departemen: string;
  jenisPekerjaan: string;
  lokasiKerja: string;
  periodeAwal: string;
  periodeAkhir: string;
  statusSPK: 'Pending' | 'Aktif' | 'Selesai' | 'Batal' | 'Approved'; // Added Pending and Approved
}

// NEW: Employee Data Type for dropdowns
export interface EmployeeData {
  id: string;
  name: string;
  position: string;
  department: string;
}

// PO Jasa Types
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
  status: 'Paid' | 'Unpaid'; // Status can be 'Paid' or 'Unpaid'
  items: EntryPOJasaItem[];
}

// NEW: PO Barang Types
export interface POBarangItemEntry { // Used for EntryPOBarangModal
  id: string;
  namaBarang: string;
  kodeBarang: string;
  qty: string;
  satuan: string;
  hargaSatuan: string;
  pajakItem: string;
  discRp: string;
  jumlah: string;
  keterangan: string;
}

export interface EntryPOBarangFormData { // Used for EntryPOBarangModal
  noPR: string;
  noSO: string;
  metodePembayaran: string;
  tanggalPO: string;
  kodeVendor: string;
  tanggalPengiriman: string;
  noPO: string;
  departemen: string;
  vendor: string;
  pajak: string;
  tandaBukti: File | null;
  daftarFile: File[];
  items: POBarangItemEntry[];
  total: string;
  discAkhir: string;
  subTotal: string;
  ppn: string;
  ongkosKirim: string;
  grandTotal: string;
}

export interface POBarangItem { // Used for POBarangData and ApprovePOBarangModal
  id: string;
  namaBarang: string;
  kodeBarang: string;
  qty: string;
  satuan: string;
  hargaSatuan: string;
  pajakItem: string;
  discRp: string;
  jumlah: string;
  keterangan: string;
}

export interface POBarangData { // Full PO Barang data for display/approval
  id: number;
  noPr: string;
  periodePr: string;
  divisi: string;
  kodeSupplier: string;
  namaSupplier: string;
  noPo: string;
  tanggalPo: string;
  tanggalPengiriman: string;
  status: 'Paid' | 'Unpaid' | 'Pending'; // Added 'Pending' status
  noSO?: string;
  metodePembayaran?: string;
  kodeVendor?: string;
  departemen?: string;
  vendor?: string;
  pajak?: string;
  tandaBuktiUrl?: string; // Assuming file is uploaded and a URL is stored
  daftarFileUrls?: string[]; // Assuming files are uploaded and URLs are stored
  items: POBarangItem[];
  total?: string;
  discAkhir?: string;
  subTotal?: string;
  ppn?: string;
  ongkosKirim?: string;
  grandTotal?: string;
}

export interface ApprovalPOBarangFormData {
  poId: number;
  action: 'approve' | 'reject';
  keterangan?: string; // Optional for approval/rejection notes
}
