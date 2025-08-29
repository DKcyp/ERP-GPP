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
