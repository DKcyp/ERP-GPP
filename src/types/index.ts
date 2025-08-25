export type UserRole = 'marketing' | 'operational' | 'hrd' | 'pengadaan';

export interface User {
  username: string;
  role: UserRole;
  fullName: string;
  profilePicture: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface MenuSection {
  title: string;
  icon: string;
  items: MenuItem[];
  directPath?: string;
}

export interface MenuItem {
  title: string;
  icon: string;
  path: string;
}

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

export interface ManPowerFormData {
  // Step 1: Data Pemohon
  untukKebutuhanSOTurunan: string;
  namaPemohon: string;
  mob: string;
  demob: string;
  jabatan: string;
  departemen: string;
  
  // Step 2: Permintaan Tenaga Kerja
  penggantian: 'Ya' | 'Tidak';
  penambahan: 'Ya' | 'Tidak';
  headHunter: 'Ya' | 'Tidak';
  perluHasilMedicalCheckUp: 'Ya' | 'Tidak';
  statusKepegawaian: 'Tetap' | 'Kontrak' | 'Magang';
  
  // Step 3: Kebutuhan Tenaga Kerja
  tanggalMulaiKerja: string;
  lokasiKerja: string;
  kebutuhanTenagaKerja: Array<{
    jabatan: string;
    level: string;
    jumlahKebutuhan: string;
    rateKualifikasi: string;
    gajiPokok: string;
    tunjanganJabatan: string;
    tunjanganLain: string;
  }>;
  
  // Step 4: Jabatan Tenaga Kerja
  deskripsiJabatan: string;
  
  // Step 5: Kualifikasi Tenaga Kerja
  usiaMin: string;
  usiaMax: string;
  status: 'Menikah' | 'Lajang';
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  pendidikan: 'SMA/SMK' | 'D3' | 'S1';
  keahlian: string;
  kemampuanLainnya: string;
}

export interface ManPowerDetailData {
  soNumber: string;
  namaProyek: string;
  lokasi: string;
  kualifikasi: string[];
  estimasiRate: string;
  mob: string;
  demob: string;
  totalOrang: string;
  catatanTambahan: string;
}

export interface ManPowerPlanDetailData {
  id: string;
  kodePegawai: string;
  namaPegawai: string;
  noSO: string;
  soTurunan: string;
  namaProyek: string;
  lokasi: string;
  kualifikasi: string;
  ratePerHari: string;
  mob: string;
  demob: string;
  durasi: string;
  total: string;
  // Data Pemohon
  nama: string;
  tanggalMulaiKerja: string;
  jabatan: string;
  departemen: string;
  // Data Pegawai
  kodePegawaiDetail: string;
  namaPegawaiDetail: string;
  level: string;
  lokasiKerja: string;
  // Kompensasi
  gaji: string;
  tunjanganTransport: string;
  tunjanganJabatan: string;
  tunjanganMakan: string;
  tunjanganLainnya: string;
  hariKerja: string;
  jamKerja: string;
  // Deskripsi Jabatan
  deskripsiJabatan: string;
  // Kualifikasi
  usia: string;
  status: string;
  jenisKelamin: string;
  pendidikan: string;
  // Lampiran Dokumen
  mcu: string;
  sertifikasi: string;
}

export interface PegawaiData {
  id: string;
  no: number;
  namaNIK: string;
  nama: string;
  wilayah: string;
  jenisGaji: 'Bulanan' | 'Harian' | 'Proyek';
  jenisKontrak: 'Tetap' | 'Freelancer';
  gajiPokok: string;
}

export interface PegawaiFormData {
  namaPegawai: string;
  noKTP: string;
  jabatan: string;
  wilayahKerja: string;
  jenisKontrak: 'Tetap' | 'Freelancer';
  jenisGaji: 'Bulanan' | 'Harian' | 'Proyek';
  gajiPokok: string;
}

export interface KontrakKerjaData {
  id: string;
  no: number;
  noKontrak: string;
  penerimaKontrak: string;
  periodeKontrak: string;
  tunjangan: string[];
}

export interface TunjanganItem {
  namaTunjangan: string;
  nominal: string;
}

export interface KontrakKerjaFormData {
  nomorKontrak: string;
  penerimaKontrak: string;
  periodeKontrakStart: string;
  periodeKontrakEnd: string;
  keterangan: string;
  uploadSuratLamaran: File | null;
  uploadCV: File | null;
  uploadFotoDiri: File | null;
  uploadSertifikasi: File | null;
  tunjangan: TunjanganItem[];
}

export interface PotonganGajiData {
  id: string;
  no: number;
  kodePegawai: string;
  namaPegawai: string;
  jenisPegawai: string;
  tanggal: string;
  potongan: string;
  keterangan: string;
}

export interface PotonganGajiFormData {
  kodePegawai: string;
  namaPegawai: string;
  jenisPegawai: string;
  periode: string;
  keterangan: string;
  potonganItems: Array<{
    namaPotongan: string;
    nominal: string;
  }>;
}

export interface GajiData {
  id: string;
  no: number;
  namaPegawai: string;
  gajiPokok: string;
  tunjangan: string;
  pph21: string;
  potonganMess: string;
  gajiBersih: string;
}

export interface GajiFormData {
  namaPegawai: string;
  gajiPokok: string;
  tunjangan: string;
  pph21: string;
  potonganMess: string;
  bpjs: string;
  gajiBersih: string;
}

export interface AbsensiTeknisiData {
  id: string;
  no: number;
  namaTeknisi: string;
  tanggalAbsensi: string;
  zonaKerja: string;
  statusAbsensi: 'DL' | 'H' | 'CT' | 'CP' | 'TM';
  lampiran: string;
  statusApprove: 'Approved' | 'Process' | 'Rejected';
}

export interface ApprovalTimesheetPegawaiData {
  id: string;
  no: number;
  nama: string;
  kualifikasi: string;
  mob: string;
  demob: string;
  durasi: string;
  noSO: string;
  noHPP: string;
  lokasi: string;
  jenisPekerjaan: 'On Call' | 'Tender';
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface ApproveTimesheetFormData {
  nama: string;
  mob: string;
  demob: string;
  durasi: string;
  namaProject: string;
  noSO: string;
  noHPP: string;
  lokasi: string;
  namaClient: string;
  jenisPekerjaan: 'On Call' | 'Tender';
  kualifikasi: string[];
  tunjangan: Array<{
    namaTunjangan: string;
    rateTunjangan: string;
    overtime: string;
  }>;
}
