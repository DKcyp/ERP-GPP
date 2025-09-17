import React, { useState } from "react";
import {
  FileText,
  Upload,
  Users,
  Settings,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Download,
  Shield,
  Building,
  UserCheck,
  FileCheck,
  Trash2,
  Send,
  Bell,
} from "lucide-react";

interface UsulanPerubahan {
  id: number;
  no: number;
  jenis: "Prosedur ISO" | "Formulir" | "Instruksi Kerja" | "Prosedur Inspeksi";
  tipe: "Baru" | "Revisi";
  namaDokumen: string;
  nomorDokumen: string;
  alasanPerubahan: string;
  uploadFile: string;
  tanggalUsulan: string;
  pengusul: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  approvalDate?: string;
  keterangan?: string;
}

interface DistribusiDokumen {
  id: number;
  no: number;
  jenis: "Pemusnahan" | "Permintaan Dokumen";
  kategoriDokumen: "Prosedur ISO" | "Formulir" | "Instruksi Kerja" | "Prosedur Inspeksi" | "Sertifikat Alat" | "Dokumen Lain";
  namaDokumen: string;
  nomorDokumen: string;
  pemohon: string;
  tanggalPermintaan: string;
  alasan: string;
  uploadFile?: string;
  status: "Pending" | "Approved" | "Rejected" | "Distributed";
  approvedBy?: string;
  labelControlled: boolean;
}

interface AksesDepartemen {
  id: number;
  no: number;
  departemenPemohon: string;
  departemenTujuan: "Purchasing" | "Marketing" | "Operasional" | "Finance" | "HRD";
  jenisAkses: string;
  alasanPermintaan: string;
  tanggalPermintaan: string;
  pemohon: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  approvalDate?: string;
}

const QHSEGeneralISOSystemDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"usulan" | "distribusi" | "akses">("usulan");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample data
  const [usulanData, setUsulanData] = useState<UsulanPerubahan[]>([
    {
      id: 1,
      no: 1,
      jenis: "Prosedur ISO",
      tipe: "Revisi",
      namaDokumen: "Prosedur Pengendalian Dokumen",
      nomorDokumen: "ISO-DOC-001",
      alasanPerubahan: "Update sesuai ISO 9001:2015",
      uploadFile: "prosedur-doc-control-v2.pdf",
      tanggalUsulan: "2024-01-15",
      pengusul: "Ahmad Rizki",
      status: "Pending",
    },
  ]);

  const [distribusiData, setDistribusiData] = useState<DistribusiDokumen[]>([
    {
      id: 1,
      no: 1,
      jenis: "Permintaan Dokumen",
      kategoriDokumen: "Prosedur ISO",
      namaDokumen: "Manual Sistem Manajemen Mutu",
      nomorDokumen: "QMS-001",
      pemohon: "Siti Nurhaliza",
      tanggalPermintaan: "2024-01-20",
      alasan: "Untuk training karyawan baru",
      status: "Approved",
      approvedBy: "Document Control",
      labelControlled: true,
    },
  ]);

  const [aksesData, setAksesData] = useState<AksesDepartemen[]>([
    {
      id: 1,
      no: 1,
      departemenPemohon: "Finance",
      departemenTujuan: "HRD",
      jenisAkses: "Data Pegawai",
      alasanPermintaan: "Untuk proses payroll",
      tanggalPermintaan: "2024-01-18",
      pemohon: "Budi Santoso",
      status: "Approved",
      approvedBy: "Manager HRD",
      approvalDate: "2024-01-19",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Distributed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    totalUsulan: usulanData.length,
    usulanPending: usulanData.filter(u => u.status === "Pending").length,
    totalDistribusi: distribusiData.length,
    distribusiPending: distribusiData.filter(d => d.status === "Pending").length,
    totalAkses: aksesData.length,
    aksesPending: aksesData.filter(a => a.status === "Pending").length,
  };

  const renderUsulanTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokumen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis/Tipe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengusul</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usulanData.map((usulan) => (
                <tr key={usulan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usulan.no}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{usulan.namaDokumen}</div>
                      <div className="text-sm text-gray-500">{usulan.nomorDokumen}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {usulan.jenis}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{usulan.tipe}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{usulan.pengusul}</div>
                    <div className="text-sm text-gray-500">{new Date(usulan.tanggalUsulan).toLocaleDateString('id-ID')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(usulan.status)}`}>
                      {usulan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDistribusiTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokumen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pemohon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {distribusiData.map((distribusi) => (
                <tr key={distribusi.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{distribusi.no}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{distribusi.namaDokumen}</div>
                      <div className="text-sm text-gray-500">{distribusi.nomorDokumen}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {distribusi.jenis}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{distribusi.pemohon}</div>
                    <div className="text-sm text-gray-500">{new Date(distribusi.tanggalPermintaan).toLocaleDateString('id-ID')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(distribusi.status)}`}>
                      {distribusi.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {distribusi.labelControlled && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Document Controlled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAksesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departemen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Akses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pemohon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {aksesData.map((akses) => (
                <tr key={akses.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{akses.no}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{akses.departemenPemohon} → {akses.departemenTujuan}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {akses.jenisAkses}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{akses.pemohon}</div>
                    <div className="text-sm text-gray-500">{new Date(akses.tanggalPermintaan).toLocaleDateString('id-ID')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(akses.status)}`}>
                      {akses.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                GENERAL - ISO SYSTEM
              </h1>
              <nav className="text-sm text-gray-600">
                <span>QHSE</span> <span className="mx-2">›</span>
                <span>General</span> <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">ISO System</span>
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usulan Perubahan</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsulan}</p>
                <p className="text-xs text-yellow-600">{stats.usulanPending} Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Distribusi Dokumen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDistribusi}</p>
                <p className="text-xs text-yellow-600">{stats.distribusiPending} Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Akses Departemen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAkses}</p>
                <p className="text-xs text-yellow-600">{stats.aksesPending} Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("usulan")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "usulan"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Usulan Perubahan Dokumen
              </button>
              <button
                onClick={() => setActiveTab("distribusi")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "distribusi"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Send className="h-4 w-4 inline mr-2" />
                Distribusi Dokumen
              </button>
              <button
                onClick={() => setActiveTab("akses")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "akses"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <UserCheck className="h-4 w-4 inline mr-2" />
                Minta Buka Akses Dept Lain
              </button>
            </nav>
          </div>

          {/* Search and Filter Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari dokumen atau pemohon..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Distributed">Distributed</option>
              </select>

              <div></div>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah {activeTab === "usulan" ? "Usulan" : activeTab === "distribusi" ? "Distribusi" : "Akses"}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "usulan" && renderUsulanTab()}
            {activeTab === "distribusi" && renderDistribusiTab()}
            {activeTab === "akses" && renderAksesTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QHSEGeneralISOSystemDashboard;
