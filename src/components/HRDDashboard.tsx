import React, { useState, useEffect } from "react";
import {
  Users,
  BarChart3,
  FileText,
  Wrench,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";

interface ProgramKerjaAktif {
  no: number;
  namaProgram: string;
  durasiPlan: string;
  durasiActual: string;
  status: "Track" | "Delay" | "On Progress" | "Selesai";
}

interface KomposisiBiayaGaji {
  no: number;
  namaKaryawan: string;
  project: string;
  gaji: string;
  tunjangan: string;
}

interface PerformanceReview {
  no: number;
  nama: string;
  jabatan: string;
  tanggalReview: string;
  periode: string;
  score: number;
  status: "Excellent" | "Good" | "Average" | "Needs Improvement";
}

interface ActiveProject {
  no: number;
  namaProyek: string;
  noSO: string;
  client: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "On Track" | "Delay" | "Completed" | "On Hold";
  manpowerCount: number;
}

interface ManpowerStandby {
  no: number;
  nama: string;
  kualifikasi: string;
  zona: string;
  statusStandby: "Available" | "On Project" | "Training" | "Leave";
  lastProject: string;
  standbyDuration: string;
  monthlyBaseSalary: number;
}

interface HRDDashboardProps {
  setCurrentPage?: (page: string) => void;
}

const HRDDashboard: React.FC<HRDDashboardProps> = ({ setCurrentPage }) => {
  const [animateCards, setAnimateCards] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);

  // Debug log to check if setCurrentPage is received
  console.log("HRDDashboard received setCurrentPage:", !!setCurrentPage);

  // Sample data for Program Kerja Aktif
  const programKerjaData: ProgramKerjaAktif[] = [
    {
      no: 1,
      namaProgram: "Proyek Infrastruktur Kota",
      durasiPlan: "01-02-2025",
      durasiActual: "01-08-2025",
      status: "Track",
    },
    {
      no: 2,
      namaProgram: "Pengembangan Aplikasi ERP",
      durasiPlan: "15-03-2025",
      durasiActual: "30-09-2025",
      status: "Delay",
    },
    {
      no: 3,
      namaProgram: "Implementasi Smart Factory",
      durasiPlan: "01-04-2025",
      durasiActual: "01-09-2025",
      status: "On Progress",
    },
    {
      no: 4,
      namaProgram: "Modernisasi Jaringan IT",
      durasiPlan: "10-05-2025",
      durasiActual: "10-11-2025",
      status: "Selesai",
    },
  ];

  // Sample data for Komposisi Biaya Gaji
  const komposisiBiayaGajiData: KomposisiBiayaGaji[] = [
    {
      no: 1,
      namaKaryawan: "Andi",
      project: "Proyek Infrastruktur Kota",
      gaji: "Rp 15.000.000",
      tunjangan: "Rp 1.500.000",
    },
    {
      no: 2,
      namaKaryawan: "Siti",
      project: "Pengembangan Aplikasi ERP",
      gaji: "Rp 13.500.000",
      tunjangan: "Rp 1.200.000",
    },
  ];

  // Sample data for Active Projects (mirrored from Operation)
  const activeProjectsData: ActiveProject[] = [
    {
      no: 1,
      namaProyek: "Proyek Infrastruktur Kota",
      noSO: "SO-001",
      client: "PT Pembangunan Nasional",
      startDate: "01-01-2025",
      endDate: "30-06-2025",
      progress: 75,
      status: "On Track",
      manpowerCount: 25,
    },
    {
      no: 2,
      namaProyek: "Pengembangan Aplikasi ERP",
      noSO: "SO-002",
      client: "PT Teknologi Maju",
      startDate: "15-02-2025",
      endDate: "15-08-2025",
      progress: 45,
      status: "Delay",
      manpowerCount: 18,
    },
    {
      no: 3,
      namaProyek: "Implementasi Smart Factory",
      noSO: "SO-003",
      client: "CV Industri Sejahtera",
      startDate: "01-03-2025",
      endDate: "31-12-2025",
      progress: 30,
      status: "On Track",
      manpowerCount: 35,
    },
  ];

  // Sample data for Manpower Standby Teknisi
  const manpowerStandbyData: ManpowerStandby[] = [
    {
      no: 1,
      nama: "Ahmad Rizki",
      kualifikasi: "Welder Level 2",
      zona: "Jakarta",
      statusStandby: "Available",
      lastProject: "SO-001",
      standbyDuration: "5 hari",
      monthlyBaseSalary: 7000000,
    },
    {
      no: 2,
      nama: "Budi Santoso",
      kualifikasi: "Electrician",
      zona: "Surabaya",
      statusStandby: "Available",
      lastProject: "SO-002",
      standbyDuration: "3 hari",
      monthlyBaseSalary: 6500000,
    },
    {
      no: 3,
      nama: "Charlie Wijaya",
      kualifikasi: "Fitter",
      zona: "Bandung",
      statusStandby: "Training",
      lastProject: "SO-003",
      standbyDuration: "1 hari",
      monthlyBaseSalary: 6000000,
    },
    {
      no: 4,
      nama: "Dewi Kartika",
      kualifikasi: "Supervisor",
      zona: "Jakarta",
      statusStandby: "Available",
      lastProject: "SO-001",
      standbyDuration: "7 hari",
      monthlyBaseSalary: 8500000,
    },
  ];

  const gajiStaff = 1200000000;
  const gajiDireksi = 500000000; // Placeholder value, adjust as needed
  const gajiTeknisiReguler = 800000000; // Placeholder value, adjust as needed
  const gajiFreelance = 300000000; // Placeholder value, adjust as needed

  const calculateTotalGajiBulanBerjalan = () => {
    return gajiStaff + gajiDireksi + gajiTeknisiReguler + gajiFreelance;
  };

  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Sample data for Performance Review
  const performanceReviewData: PerformanceReview[] = [
    {
      no: 1,
      nama: "Ahmad Rizki",
      jabatan: "Senior Engineer",
      tanggalReview: "15-01-2025",
      periode: "Q4 2024",
      score: 92,
      status: "Excellent",
    },
    {
      no: 2,
      nama: "Sari Indah",
      jabatan: "Project Manager",
      tanggalReview: "20-01-2025",
      periode: "Q4 2024",
      score: 85,
      status: "Good",
    },
    {
      no: 3,
      nama: "Budi Hartono",
      jabatan: "Technician",
      tanggalReview: "25-01-2025",
      periode: "Q4 2024",
      score: 78,
      status: "Good",
    },
    {
      no: 4,
      nama: "Maya Sari",
      jabatan: "Admin Staff",
      tanggalReview: "30-01-2025",
      periode: "Q4 2024",
      score: 65,
      status: "Average",
    },
  ];

  useEffect(() => {
    // Trigger animations on component mount
    setTimeout(() => setAnimateCards(true), 100);
    setTimeout(() => setAnimateChart(true), 500);
  }, []);

  // Navigation function to DaftarPegawaiDashboard with filters
  const navigateToStaffList = (staffType: string, contractType: string) => {
    if (setCurrentPage) {
      // Navigate to DaftarPegawaiDashboard following MenuBar pattern
      const url = `/hrd/pegawai/daftar`;
      console.log(
        "HRDDashboard: Setting currentPage to:",
        url,
        "with filters:",
        { staffType, contractType }
      );
      setCurrentPage(url);
    } else {
      console.log("setCurrentPage is not available"); // Debug log
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Track":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delay":
        return "bg-red-100 text-red-800 border-red-200";
      case "On Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Selesai":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Track":
        return <CheckCircle className="h-4 w-4" />;
      case "Delay":
        return <XCircle className="h-4 w-4" />;
      case "On Progress":
        return <Clock className="h-4 w-4" />;
      case "Selesai":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPerformanceStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "Good":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Average":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Needs Improvement":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800 border-green-200";
      case "Delay":
        return "bg-red-100 text-red-800 border-red-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStandbyStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 border-green-200";
      case "On Project":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Training":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Leave":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // (Removed chart data; using tables instead)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                HRD DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  HRD
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Dashboard</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="w-full">
          {/* KPI Boxes aligned to the right */}
          <div className="flex flex-col lg:flex-row justify-end gap-6">
            {/* Staf (PKWT) */}
            <div
              className={`bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                animateCards
                  ? "animate-in slide-in-from-left-5 fade-in-0"
                  : "opacity-0"
              }`}
              onClick={() => navigateToStaffList("staf", "pkwt")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Wrench className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Staf (PKWT)</h3>
                  </div>
                  <p className="text-3xl font-bold">85</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Staf (PKWTT) */}
            <div
              className={`bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                animateCards
                  ? "animate-in slide-in-from-left-5 fade-in-0"
                  : "opacity-0"
              }`}
              style={{ animationDelay: "200ms" }}
              onClick={() => navigateToStaffList("staf", "pkwtt")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Staf (PKWTT)</h3>
                  </div>
                  <p className="text-3xl font-bold">60</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Teknisi (PKWT) */}
            <div
              className={`bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                animateCards
                  ? "animate-in slide-in-from-left-5 fade-in-0"
                  : "opacity-0"
              }`}
              style={{ animationDelay: "400ms" }}
              onClick={() => navigateToStaffList("teknisi", "pkwt")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Teknisi (PKWT)</h3>
                  </div>
                  <p className="text-3xl font-bold">140</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Teknisi (PKWTT) */}
            <div
              className={`bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                animateCards
                  ? "animate-in slide-in-from-left-5 fade-in-0"
                  : "opacity-0"
              }`}
              style={{ animationDelay: "600ms" }}
              onClick={() => navigateToStaffList("teknisi", "pkwtt")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">Teknisi (PKWTT)</h3>
                  </div>
                  <p className="text-3xl font-bold">110</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>

            {/* Teknisi (Freelance) */}
            <div
              className={`bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                animateCards
                  ? "animate-in slide-in-from-left-5 fade-in-0"
                  : "opacity-0"
              }`}
              style={{ animationDelay: "800ms" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      Teknisi (Freelance)
                    </h3>
                  </div>
                  <p className="text-3xl font-bold">95</p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>
          </div>

          {/* Center/Right columns removed as requested; tables moved below */}
        </div>

        {/* Tables Section (Below Boxes) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Monitoring Kontrak Habis H-3 Bulan */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">
                Monitoring Kontrak Habis H-3 Bulan
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Jabatan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Kontrak Habis
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Sisa Hari
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Budi Santoso
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">Teknisi</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      10-12-2025
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      75
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">
                        H-3 Bulan
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-gray-25">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Siti Aminah
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">Staf</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      02-11-2025
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      36
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
                        H-3 Bulan
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Joko Susilo
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">Teknisi</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      20-02-2026
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      130
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                        H &gt; 3 Bulan
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Turn Over Rate */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">
                Turn Over Rate
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Bulan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Masuk
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Keluar
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Turn Over Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Jan 2025
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">18</td>
                    <td className="px-4 py-3 text-sm text-gray-900">12</td>
                    <td className="px-4 py-3 text-sm text-gray-900">530</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      2.3%
                    </td>
                  </tr>
                  <tr className="bg-gray-25">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Feb 2025
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">22</td>
                    <td className="px-4 py-3 text-sm text-gray-900">15</td>
                    <td className="px-4 py-3 text-sm text-gray-900">537</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      2.8%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Mar 2025
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">20</td>
                    <td className="px-4 py-3 text-sm text-gray-900">17</td>
                    <td className="px-4 py-3 text-sm text-gray-900">540</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      2.6%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Performance Review Section */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">
                Performance Review
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Jabatan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tanggal Review
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Periode
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {performanceReviewData.map((review, index) => (
                    <tr
                      key={review.no}
                      className={index % 2 === 1 ? "bg-gray-25" : ""}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {review.no}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {review.nama}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {review.jabatan}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {review.tanggalReview}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {review.periode}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-bold">
                        {review.score}/100
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPerformanceStatusColor(
                            review.status
                          )}`}
                        >
                          {review.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* New Sections: Manpower Standby & Active Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Manpower Standby untuk Teknisi */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">
                Manpower Standby untuk Teknisi
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Kualifikasi
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Zona
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Standby Duration
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      STANDBY COST
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {manpowerStandbyData.map((standby, index) => (
                    <tr
                      key={standby.no}
                      className={index % 2 === 1 ? "bg-gray-25" : ""}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {standby.no}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {standby.nama}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {standby.kualifikasi}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {standby.zona}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStandbyStatusColor(
                            standby.statusStandby
                          )}`}
                        >
                          {standby.statusStandby}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {standby.standbyDuration}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 font-bold">
                        {(() => {
                          const days =
                            parseInt(
                              standby.standbyDuration.replace(/[^0-9]/g, "")
                            ) || 0;
                          const dailySalary = gajiTeknisiReguler / 20;
                          const standbyCost = dailySalary * days;
                          return formatRupiah(Math.round(standbyCost));
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Projects (mirrored from Operation) */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
              <h3 className="text-xl font-bold text-gray-900">
                Active Projects
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Nama Proyek
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      No SO
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Progress
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Manpower
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeProjectsData.map((project, index) => (
                    <tr
                      key={project.no}
                      className={index % 2 === 1 ? "bg-gray-25" : ""}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {project.no}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {project.namaProyek}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {project.noSO}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {project.client}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-bold">
                        {project.progress}%
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getProjectStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {project.manpowerCount} orang
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Gaji Bulan Berjalan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Total Gaji Bulan Berjalan
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {formatRupiah(calculateTotalGajiBulanBerjalan())}
                </p>
                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Gaji Staff</span>
                    <span className="font-semibold">
                      {formatRupiah(gajiStaff)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gaji Direksi</span>
                    <span className="font-semibold">
                      {formatRupiah(gajiDireksi)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gaji Teknisi Reguler</span>
                    <span className="font-semibold">
                      {formatRupiah(gajiTeknisiReguler)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gaji Freelance</span>
                    <span className="font-semibold">
                      {formatRupiah(gajiFreelance)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Karyawan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Karyawan</p>
                <p className="text-2xl font-bold text-gray-900">525</p>
              </div>
            </div>
          </div>

          {/* Karyawan Aktif */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Karyawan Aktif</p>
                <p className="text-2xl font-bold text-gray-900">475</p>
              </div>
            </div>
          </div>

          {/* Cuti Hari Ini */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cuti Hari Ini</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          {/* Training Bulan Ini */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Training Bulan Ini</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>2025 © HRD Management System</p>
          <p className="mt-1">
            Crafted with <span className="text-red-500">♥</span> by{" "}
            <span className="text-blue-600">Enterprise Team</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HRDDashboard;
