export interface PesertaData {
  no: number;
  namaPegawai: string;
  nip: string;
  departemen: string;
  kualifikasi: string;
}

export interface POTrainingDetailData {
  id: string;
  no: number;
  noSO: string;
  soTurunan: string;
  noTraining: string;
  jenisTraining: string;
  tanggalPelatihanStart: string;
  tanggalPelatihanEnd: string;
  vendor: string;
  budget: number;
  keterangan: string;
  status: "Pending" | "Approved" | "Rejected";
  approver: string;
  peserta: PesertaData[];
}

export interface ApprovalPOTrainingActionData {
  poTrainingId: string;
  action: "approve" | "reject";
  keterangan: string;
}

export interface PerizinanAlatEntry {
  id: string;
  no: number;
  kodeBarang: string;
  namaAlat: string;
  noSeri: string; // Tetap ada untuk logika internal/modal
  jenisPerizinan: string; // Tetap ada untuk logika internal/modal
  status:
    | "Belum Berizin"
    | "Menunggu Persetujuan"
    | "Disetujui"
    | "Izin Tersedia"
    | "Aktif"; // Tetap ada untuk logika internal/modal
  tanggalAwalIzin: string; // Kolom baru
  tanggalAkhirIzin: string; // Kolom baru
  dokumen: string; // Kolom baru
}

export interface AjukanIzinFormData {
  kodeBarang: string;
  namaAlat: string;
  noSeri: string;
  jenisPerizinan: string;
}

export interface DetailIzinAlatFormData {
  kodeBarang: string;
  namaAlat: string;
  noSeri: string;
  jenisPerizinan: string;
  dokumen: string; // Diubah dari noDokumen
  tanggalAwalIzin: string; // Diubah dari tanggalMulaiBerlaku
  tanggalAkhirIzin: string; // Diubah dari tanggalBerakhir
}

export interface PerpanjangIzinFormData {
  namaAlat: string;
  kodeBarang: string;
  noSeri: string;
  jenisPerizinan: string;
}

// New type for Proses Pengajuan Training form data
export interface ProsesPengajuanTrainingFormData {
  namaPersonil: string;
  jenisPelatihan: string;
  lokasiPelatihan: string;
  tanggalPelaksanaan: string; // ISO date
  pid: "PID" | "TIDAK";
  noSO?: string;
  soTurunan?: string;
  noTraining?: string;
  karyawan?: string;
  dataPegawai?: any[];
  tanggalPelatihanStart?: string;
  tanggalPelatihanEnd?: string;
  jenisTraining?: "New Training" | "Re-Training";
  budget?: string;
  keterangan?: string;
  lampiran?: File[];
}

// New type for Realisasi Document Upload form data
export interface RealisasiDocumentUploadFormData {
  noTraining: string;
  documentName: string;
  documentFile: File | null;
  keterangan: string;
}

// ================= Penawaran Detail (Marketing) =================
export interface PenawaranDetailData {
  kategoriPajak: string;
  noRefReq: string;
  kodeCustomer: string;
  namaCustomer: string;
  pajak: string;
  noPenawaran: string;
  tanggalPenawaran: string;
  tanggalPenawaranEnd: string;
  tanggalKirim: string;
  tanggalKirimEnd: string;
  statusDok: string;
  namaDivisi: string;
  jenisPenawaran: string;
  kodeBarang: string;
  statusSO: string;
  statusPenawaran: string;
  jenisPekerjaan: string;
  statusKOM: string;
}

// ================= Generic Update Status Modal =================
export interface UpdateStatusFormData {
  status: "Pending" | "Accepted" | "Rejected" | "Interview" | "Hired";
  keterangan: string;
}

export interface LamaranData {
  id: string;
  status: UpdateStatusFormData["status"];
  keterangan: string;
}

// ================= Tax (PPh) Data Types =================
export interface PPh21Data {
  id: number;
  namaPegawai: string;
  npwp: string;
  tanggal: string; // ISO date
  pph21: number;
}

export interface PPh23Data {
  id: number;
  namaPihak: string;
  npwp: string;
  tanggal: string; // ISO date
  keteranganTransaksi: string; // Keterangan Transaksi
  dpp: number; // Dasar Pengenaan Pajak
  persentase: number; // Persentase pajak (dalam desimal, misal 0.02 untuk 2%)
  pph23: number;
}

export interface PPh4Ayat2Data {
  id: number;
  namaPihak: string;
  npwp: string;
  tanggal: string; // ISO date
  dpp: number; // Dasar Pengenaan Pajak
  persentase: number; // Persentase pajak (dalam desimal, misal 0.02 untuk 2%)
  pph4Ayat2: number;
}

export interface PPh22Data {
  id: number;
  namaPihak: string;
  npwp: string;
  tanggal: string; // ISO date
  pph22: number;
}

export interface PPh29Data {
  id: number;
  namaPihak: string;
  npwp: string;
  tanggal: string; // ISO date
  pph29: number;
}

export interface PPh25Data {
  id: number;
  namaPihak: string;
  npwp: string;
  tanggal: string; // ISO date
  pph25: number;
}

export interface SKPKBData {
  id: number;
  namaPihak: string;
  npwp: string;
  tanggal: string; // ISO date
  skpkb: number;
}

export interface SP2DKData {
  id: number;
  namaPihak: string;
  npwp: string;
  tanggal: string; // ISO date
  sp2dk: number;
}

export interface STPData {
  id: number;
  namaPihak: string;
  npwp: string;
  tanggal: string; // ISO date
  stp: number;
}

export interface VoucherData {
  id: number;
  nomorVoucher: string;
  namaPihak: string;
  npwp: string;
  tanggal: string; // ISO date
  nilai: number;
  keterangan?: string;
}

export interface MonitoringVoucherData {
  id: number;
  nomorVoucher: string;
  status: "Draft" | "Dikirim" | "Disetujui" | "Ditolak";
  tanggal: string; // ISO date
  nilai: number;
  keterangan?: string;
}

// ================= Evaluasi Vendor =================
export type YaTidak = "Ya" | "Tidak";
export type MutuKategori = "Baik" | "Cukup" | "Kurang";

export interface EvaluasiVendorData {
  id: string;
  no: number;
  namaVendor: string;
  onTime: YaTidak;
  sesuaiSpesifikasi: YaTidak;
  jumlahBarangSesuaiPO: number;
  tanggalEvaluasi: string;
  mutu: MutuKategori;
  k3: YaTidak;
  // After Sales fields
  tanggalGaransi?: string;
  keteranganAdministrasiVendor?: string;
}

export interface EvaluasiVendorFormData {
  namaVendor: string;
  barangOnTime: YaTidak;
  sesuaiSpesifikasi: YaTidak;
  jumlahBarangSesuaiPO: string; // keep as string for input, parse to number on save
  mutu: MutuKategori;
  k3: YaTidak;
  // After Sales fields
  tanggalGaransi?: string;
  keteranganAdministrasiVendor?: string;
}

// ================= App Shared Types (Auth + Menu) =================
export interface User {
  username: string;
  role: string; // e.g., marketing, operational, hrd, ga, etc.
  fullName: string;
  profilePicture: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface MenuItem {
  title: string;
  icon: string; // lucide icon name
  path: string;
}

export interface MenuSubSection {
  title: string;
  icon: string;
  items: MenuItem[];
}

export interface MenuSection {
  title: string;
  icon: string;
  items?: MenuItem[];
  subSections?: MenuSubSection[];
  directPath?: string; // if present, clicking section goes directly to this path
}

// ================= PO Barang Types =================
export interface POBarangItemEntry {
  id: string;
  namaBarang: string;
  kodeBarang: string;
  qty: string; // keep as string in form, parse as needed when saving
  satuan: string;
  hargaSatuan: string;
  pajakItem: string;
  discRp: string;
  jumlah: string;
  keterangan: string;
  sertifikat?: boolean; // new: require certificate checkbox
}

export interface EntryPOBarangFormData {
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
  uangMukaNominal?: string; // new: uang muka nominal (rupiah)
  termOfPayment?: string; // new: free text term of payment
  ongkosKirim: string;
  grandTotal: string;
  // New fields for dashboard requirements
  grossUp?: boolean; // pilihan gross up atau tidak
  pphSummary?: string; // pilihan PPh ringkas (misal: 'Tidak', 'PPh 21', 'PPh 23')
  biayaLainLain?: string;
  biayaMaterai?: string;
  estimasiKedatangan?: string; // optional manual entry if needed
}

export interface POBarangData {
  id: number;
  noPr: string;
  periodePr: string;
  divisi: string;
  kodeSupplier: string;
  namaSupplier: string;
  noPo: string;
  tanggalPo: string;
  tanggalPengiriman: string;
  status: "Paid" | "Pending" | "Unpaid";
  noSO?: string;
  metodePembayaran?: string;
  kodeVendor?: string;
  departemen?: string;
  vendor?: string;
  pajak?: string;
  tandaBuktiUrl?: string;
  daftarFileUrls: string[];
  items: POBarangItemEntry[];
  total?: string;
  discAkhir?: string;
  subTotal?: string;
  ppn?: string;
  ongkosKirim?: string;
  grandTotal?: string;
  // New summary fields
  grossUp?: boolean; // pilihan gross up atau tidak
  pph?: string; // pilihan pph (misal: 'PPh 21', 'PPh 23', 'Tidak')
  biayaLainLain?: string; // biaya lain-lain
  biayaMaterai?: string; // biaya materai
}

export interface ApprovalPOBarangFormData {
  poId: number;
  action: "approve" | "reject";
  keterangan: string;
}

// ================= PO Jasa Types =================
export interface EntryPOJasaItem {
  id: string;
  namaJasa: string;
  kodeJasa: string;
  qty: string; // keep as string in form, parse as needed when saving
  satuan: string;
  hargaSatuan: string;
  pajakItem?: string;
  discRp?: string;
  jumlah: string;
  keterangan: string;
  sertifikat?: boolean;
}

export interface EntryPOJasaFormData {
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
  items: EntryPOJasaItem[];
  total: string;
  discAkhir: string;
  subTotal: string;
  ppn: string;
  uangMukaNominal?: string; // new: uang muka nominal (rupiah)
  termOfPayment?: string; // new: free text term of payment
  ongkosKirim: string;
  grandTotal: string;
  // New fields for dashboard requirements
  grossUp?: boolean; // pilihan gross up atau tidak
  pphSummary?: string; // pilihan PPh ringkas (misal: 'Tidak', 'PPh 21', 'PPh 23')
  biayaLainLain?: string;
  biayaMaterai?: string;
  estimasiKedatangan?: string; // optional manual entry if needed
}

// ================= Penerimaan Barang Manual Types =================
export interface PenerimaanBarangManualData {
  id: string;
  no: number;
  tanggalPenerimaan: string;
  noDokumen: string;
  namaBarang: string;
  kodeBarang: string;
  serialNumber: string;
  qty: number;
  satuan: string;
  kondisiBarang: "Baik" | "Rusak" | "Expired";
  tanggalExpired?: string;
  alasanManual: string;
  keterangan?: string;
  statusPersetujuan: "Pending" | "Disetujui" | "Ditolak";
  disetujuiOleh?: string;
  tanggalPersetujuan?: string;
}

export interface PenerimaanBarangManualFormData {
  noDokumen: string;
  namaBarang: string;
  kodeBarang: string;
  serialNumber: string;
  qty: string; // keep as string for input
  satuan: string;
  kondisiBarang: "Baik" | "Rusak" | "Expired";
  tanggalExpired?: string;
  alasanManual: string;
  keterangan?: string;
}
