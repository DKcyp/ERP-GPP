export interface ApprovalTimesheetPegawaiData {
  id: string;
  no: number;
  nama: string;
  kualifikasi: string[]; // Changed to array for better representation in modal
  mob: string;
  demob: string;
  durasi: string;
  noSO: string;
  noHPP: string; // Corresponds to 'No SO Turunan'
  lokasi: string;
  jenisPekerjaan: 'On Call' | 'Tender';
  status: 'Approved' | 'Pending' | 'Rejected';
  // New fields for the detail modal
  namaProject: string;
  namaClient: string;
  jamAwalKerja: string;
  jamSelesaiKerja: string;
  overtime: string;
  tunjangan: Array<{
    namaTunjangan: string;
    rateTunjangan: string;
    overtime: string; // Can be empty if no overtime
  }>;
}

// New interfaces for Proses Pengajuan Training Modal
export interface EmployeeData {
  id: string;
  kodePegawai: string;
  namaPegawai: string;
  departemen: string;
  nip: string;
  tanggalLahir: string;
  kualifikasi: string;
}

export interface ProsesPengajuanTrainingFormData {
  noSO: string;
  soTurunan: string;
  noTraining: string;
  karyawan: string; // Assuming this is a single selected employee or a general category
  dataPegawai: EmployeeData[]; // For the dynamic table
  tanggalPelatihanStart: string;
  tanggalPelatihanEnd: string;
  jenisTraining: 'New Training' | 'Re-Training';
  budget: string;
  keterangan: string;
  lampiran: File[]; // For file uploads
}

// New interface for Approval Resign Modal
export interface ApprovalResignFormData {
  nama: string;
  jabatan: string;
  tanggalResign: string;
  alasanResign: string;
  lampiranSurat: File[];
  jangkaWaktuApproval: string;
}

// Interface for List Lamaran (Rekrutmen)
export interface LamaranData {
  id: string;
  no: number;
  namaPelamar: string;
  noTelp: string;
  email: string;
  kualifikasi: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Interview' | 'Hired'; // Added status
  keterangan: string; // Added keterangan for the modal
}

// Interface for Update Status Modal
export interface UpdateStatusFormData {
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Interview' | 'Hired';
  keterangan: string;
}

// New interface for Entry Penilaian Modal - KPI Tab
export interface KPIPerspective {
  id: string;
  perspektif: string;
  indicator: string;
  responsibility: string;
  bobot: string;
  target: string;
  realisasi: string;
  polaritas: 'Positive' | 'Negative' | 'Neutral';
  finalScore: string;
}

// New interface for Invoice Dashboard table data
export interface InvoiceDashboardData {
  id: string; // Unique ID for keying and potential future operations
  no: number;
  noPO: string;
  tanggalPO: string;
  namaVendor: string;
  nilaiInvoice: string;
  penerimaInvoice: string;
  statusVerifikasi: 'Pending' | 'Approved' | 'Rejected'; // Added for verifikasi status
}

// New interface for Invoice Form Modal
export interface InvoiceFormInput {
  noPO: string;
  tanggalPO: string;
  namaVendor: string;
  nilaiInvoice: string;
  penerimaInvoice: string;
}

// New interfaces for Procon Invoice Dashboard
export interface Project {
  id: string;
  name: string;
  soTurunan: { id: string; name: string; nominal: number }[];
}

export interface ProconInvoiceFormInput {
  noInvoice: string;
  projectId: string;
  soTurunanId: string;
  nominal: string; // Formatted string
}

// New interface for Invoice Detail Modal (existing, kept for context)
export interface InvoiceDetailData {
  id: string;
  noSO: string;
  namaProject: string;
  hppSO: // Corresponds to 'SO Turunan'
  string;
  noInvoice: string;
  tanggalInvoice: string;
  jumlah: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  approver: string;
  keterangan: string;
  items: Array<{
    no: number;
    kodeBarang: string;
    namaBarang: string;
    jumlah: number;
    satuan: string;
    harga: number;
  }>;
}

// New interface for Approval Action Modal
export interface ApprovalActionData {
  invoiceId: string;
  action: 'approve' | 'reject';
  keterangan: string;
}

// New interfaces for Approval Penggajian Modal
export interface PenggajianDetailData {
  id: string;
  noPenggajian: string;
  periode: string;
  noPegawai: string;
  namaPegawai: string;
  nipPegawai: string;
  keterangan: string;
  bonusKinerja: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  approver: string;
  items: Array<{
    no: number;
    tanggalPenggajian: string;
    gajiPokok: number;
    potonganPPH21: number;
    potonganBPJS: number;
    potonganMess: number;
    uangTunjangan: number;
    totalGaji: number;
  }>;
}

export interface ApprovalPenggajianActionData {
  penggajianId: string;
  action: 'approve' | 'reject';
  keterangan: string;
}

// New interfaces for Approval PO Training Modal
export interface POTrainingDetailData {
  id: string;
  no: number;
  noSO: string;
  soTurunan: string; // Added for detail
  noTraining: string; // Added for detail
  jenisTraining: string;
  tanggalPelatihanStart: string; // Split for detail
  tanggalPelatihanEnd: string; // Split for detail
  vendor: string;
  budget: number;
  keterangan: string; // Added for detail
  status: 'Approved' | 'Pending' | 'Rejected';
  approver: string; // Added for detail
  peserta: Array<{
    no: number;
    namaPegawai: string;
    nip: string;
    departemen: string;
    kualifikasi: string;
  }>;
}

export interface ApprovalPOTrainingActionData {
  poTrainingId: string;
  action: 'approve' | 'reject';
  keterangan: string;
}

// New interfaces for Approval Voucher Modal
export interface VoucherEmployee {
  no: number;
  kodePegawai: string;
  namaPegawai: string;
  departemen: string;
  nip: string;
}

export interface VoucherTicketDetail {
  keberangkatan: {
    tanggal: string;
    tujuan: string;
    jam: string;
    maskapai: string;
    harga: number;
    jenisTiket: string;
  };
  kepulangan: {
    tanggal: string;
    tujuan: string;
    jam: string;
    maskapai: string;
    hargaTotal: number; // This seems to be the total for return, not individual ticket price
    jenisTiket: string;
  };
  ditagihkanKe: 'Client' | 'Perusahaan';
  note: string;
}

export interface VoucherHotelDetail {
  // Structure for hotel details, not shown in image but for completeness
  namaHotel: string;
  checkIn: string;
  checkOut: string;
  jumlahMalam: number;
  hargaPerMalam: number;
  totalHarga: number;
  ditagihkanKe: 'Client' | 'Perusahaan';
  note: string;
}

export interface VoucherTravelDetail {
  // Structure for general travel expenses, not shown in image but for completeness
  jenisBiaya: string;
  deskripsi: string;
  jumlah: number;
  satuan: string;
  totalHarga: number;
  ditagihkanKe: 'Client' | 'Perusahaan';
  note: string;
}

export interface ApprovalVoucherDetailData {
  id: string;
  noVoucher: string;
  tanggalPengajuan: string;
  noSO: string;
  jumlahNominal: number;
  dataPegawai: VoucherEmployee[];
  keterangan: string;
  pemesananTiketPesawat?: VoucherTicketDetail;
  pemesananHotel?: VoucherHotelDetail;
  biayaTravel?: VoucherTravelDetail;
  status: 'Approved' | 'Pending' | 'Rejected'; // Assuming status for dashboard table
}
