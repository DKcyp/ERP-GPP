export interface PTJDetailItem {
  deskripsi: string;
  nominal: number;
}

export interface VoucherEntry {
  no: number;
  noVoucher: string;
  noSO: string;
  noSOTurunan: string;
  namaProject: string;
  namaPemohon: string;
  tglPengajuanVoucher: string;
  tglPembayaranVoucher: string;
  tglExpired: string;
  tglLaporanExpense: string;
  nominal: string;
  keterangan: string;
  ptjNominal?: string; // e.g. "Rp 5,000,000"
  ptjDetails?: PTJDetailItem[];
}

export interface ReimburseDetailItem {
  id: string; // For unique key in list
  keperluan: string;
  nominal: number;
  namaAkunCoa: string;
}

export interface PertanggungJawabanEntryData {
  noReimburse: string;
  noSO: string;
  noSOTurunan: string;
  namaPemohon: string;
  namaDepartemen: string;
  lampiranFiles: File[];
  detailItems: ReimburseDetailItem[];
}

export interface EntryPurchasingRequestFormData {
  tanggalPR: string;
  noPR: string;
  noSO: string;
  departemen: string;
  keterangan: string;
  kategori: 'Barang' | 'Jasa';
  detailItems: PRDetailItem[];
}

export interface PRDetailItem {
  id: string; // unique key
  namaItem: string;
  qty: number;
  satuan: string;
  keterangan?: string;
}

export interface PayVoucherFormData {
  voucherNo: string;
  jenisBayar: string;
  nominal: number;
}

export interface AbsensiTeknisiData {
  id: string;
  no: number;
  namaTeknisi: string;
  tanggalAbsensi: string;
  zonaKerja: string;
  statusAbsensi: string;
  lampiran: string;
}

export interface KontrakKerjaData {
  id: string;
  no: number;
  noKontrak: string;
  penerimaKontrak: string;
  periodeKontrak: string;
  jenisKontrak: string;
  tunjangan: string[];
}

export interface TunjanganItem {
  namaTunjangan: string;
  nominal: string;
}
