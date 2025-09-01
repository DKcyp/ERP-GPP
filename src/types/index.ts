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
  statusPR: 'Approve' | 'Rejected' | 'Pending' | '';
  statusPO: 'PO' | '-' | '';
}

export interface PayVoucherFormData {
  voucherNo: string;
  jenisBayar: string;
  nominal: number;
}
