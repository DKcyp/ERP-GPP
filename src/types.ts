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
  status: 'Pending' | 'Approved' | 'Rejected';
  approver: string;
  peserta: PesertaData[];
}

export interface ApprovalPOTrainingActionData {
  poTrainingId: string;
  action: 'approve' | 'reject';
  keterangan: string;
}

export interface PerizinanAlatEntry {
  id: string;
  no: number;
  kodeBarang: string;
  namaAlat: string;
  noSeri: string; // Tetap ada untuk logika internal/modal
  jenisPerizinan: string; // Tetap ada untuk logika internal/modal
  status: 'Belum Berizin' | 'Menunggu Persetujuan' | 'Disetujui' | 'Izin Tersedia' | 'Aktif'; // Tetap ada untuk logika internal/modal
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
  noTraining: string;
  noSO: string;
  soTurunan: string;
  karyawan: string;
  jenisTraining: 'New Training' | 'Re-Training';
  tanggalPelatihanStart: string;
  tanggalPelatihanEnd: string;
  budget: string;
  keterangan: string;
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
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Interview' | 'Hired';
  keterangan: string;
}

export interface LamaranData {
  id: string;
  status: UpdateStatusFormData['status'];
  keterangan: string;
}
