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
