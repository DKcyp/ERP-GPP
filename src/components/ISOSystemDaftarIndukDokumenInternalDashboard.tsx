import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FolderOpen,
  Lock,
  Unlock,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DokumenInternal {
  id: number;
  no: number;
  namaDokumen: string;
  nomorDokumen: string;
  jenisDokumen: "Company Manual" | "Prosedur" | "Instruksi Kerja" | "Formulir" | "SOP";
  tglDibuat: string;
  noRevisi: string;
  tglRevisi: string;
  tglBerlaku: string;
  masaBerlaku: string;
  lokasiPenyimpananFisik: string;
  lokasiPenyimpananElectronic: string;
  uploadDokumen: string;
  statusAkses: "View Only" | "Request Approval";
  approvalStatus: "Pending" | "Approved" | "Rejected";
  requestedBy?: string;
  approvedBy?: string;
  approvalDate?: string;
}

const ISOSystemDaftarIndukDokumenInternalDashboard: React.FC = () => {
  const [dokumenData, setDokumenData] = useState<DokumenInternal[]>([
    {
      id: 1,
      no: 1,
      namaDokumen: "Manual Sistem Manajemen Mutu",
      nomorDokumen: "DOC-QMS-001",
      jenisDokumen: "Company Manual",
      tglDibuat: "2024-01-15",
      noRevisi: "Rev-03",
      tglRevisi: "2024-06-15",
      tglBerlaku: "2024-07-01",
      masaBerlaku: "2029-07-01",
      lokasiPenyimpananFisik: "Lemari Arsip A-1, Lantai 2",
      lokasiPenyimpananElectronic: "/server/qms/manuals/",
      uploadDokumen: "qms-manual-v3.pdf",
      statusAkses: "View Only",
      approvalStatus: "Approved",
    },
    {
      id: 2,
      no: 2,
      namaDokumen: "Prosedur Pengendalian Dokumen",
      nomorDokumen: "DOC-QMS-002",
      jenisDokumen: "Prosedur",
      tglDibuat: "2024-02-01",
      noRevisi: "Rev-02",
      tglRevisi: "2024-08-01",
      tglBerlaku: "2024-08-15",
      masaBerlaku: "2029-08-15",
      lokasiPenyimpananFisik: "Lemari Arsip B-2, Lantai 2",
      lokasiPenyimpananElectronic: "/server/qms/procedures/",
      uploadDokumen: "doc-control-proc-v2.pdf",
      statusAkses: "Request Approval",
      approvalStatus: "Pending",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedDokumen, setSelectedDokumen] = useState<DokumenInternal | null>(null);

  const calculateMasaBerlaku = (tglBerlaku: string): string => {
    const berlaku = new Date(tglBerlaku);
    berlaku.setFullYear(berlaku.getFullYear() + 5);
    return berlaku.toISOString().split('T')[0];
  };

  const getExpiryStatus = (masaBerlaku: string) => {
    const today = new Date();
    const expiry = new Date(masaBerlaku);
    const sixMonthsBefore = new Date(expiry);
    sixMonthsBefore.setMonth(sixMonthsBefore.getMonth() - 6);

    if (expiry < today) {
      return { status: "expired", color: "text-red-600", bgColor: "bg-red-100" };
    } else if (today >= sixMonthsBefore) {
      return { status: "warning", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    }
    return { status: "valid", color: "text-green-600", bgColor: "bg-green-100" };
  };

  const filteredData = dokumenData.filter((item) => {
    const matchesSearch = 
      item.namaDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorDokumen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJenis = !filterJenis || item.jenisDokumen === filterJenis;
    const matchesStatus = !filterStatus || item.statusAkses === filterStatus;
    return matchesSearch && matchesJenis && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: dokumenData.length,
    companyManual: dokumenData.filter(d => d.jenisDokumen === "Company Manual").length,
    prosedur: dokumenData.filter(d => d.jenisDokumen === "Prosedur").length,
    instruksiKerja: dokumenData.filter(d => d.jenisDokumen === "Instruksi Kerja").length,
    formulir: dokumenData.filter(d => d.jenisDokumen === "Formulir").length,
    sop: dokumenData.filter(d => d.jenisDokumen === "SOP").length,
    needingApproval: dokumenData.filter(d => d.approvalStatus === "Pending").length,
    expiringSoon: dokumenData.filter(d => getExpiryStatus(d.masaBerlaku).status === "warning").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                ISO SYSTEM - DAFTAR INDUK DOKUMEN INTERNAL
              </h1>
              <nav className="text-sm text-gray-600">
                <span>QHSE</span> <span className="mx-2">›</span>
                <span>ISO System</span> <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Daftar Induk Dokumen Internal</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Dokumen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Company Manual</p>
                <p className="text-2xl font-bold text-gray-900">{stats.companyManual}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Perlu Approval</p>
                <p className="text-2xl font-bold text-gray-900">{stats.needingApproval}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mendekati Expired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari nama atau nomor dokumen..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
            >
              <option value="">Semua Jenis Dokumen</option>
              <option value="Company Manual">Company Manual</option>
              <option value="Prosedur">Prosedur</option>
              <option value="Instruksi Kerja">Instruksi Kerja</option>
              <option value="Formulir">Formulir</option>
              <option value="SOP">SOP</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Semua Status Akses</option>
              <option value="View Only">View Only</option>
              <option value="Request Approval">Request Approval</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Dokumen
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa Berlaku</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Akses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((dokumen) => {
                  const expiryStatus = getExpiryStatus(dokumen.masaBerlaku);
                  return (
                    <tr key={dokumen.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dokumen.no}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{dokumen.namaDokumen}</div>
                          <div className="text-sm text-gray-500">{dokumen.nomorDokumen}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {dokumen.jenisDokumen}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{dokumen.noRevisi}</div>
                        <div className="text-sm text-gray-500">{new Date(dokumen.tglRevisi).toLocaleDateString('id-ID')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${expiryStatus.bgColor} ${expiryStatus.color}`}>
                          {new Date(dokumen.masaBerlaku).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {dokumen.statusAkses === "View Only" ? (
                            <Lock className="h-4 w-4 text-red-500 mr-1" />
                          ) : (
                            <Unlock className="h-4 w-4 text-green-500 mr-1" />
                          )}
                          <span className="text-sm text-gray-900">{dokumen.statusAkses}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedDokumen(dokumen);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDokumen(dokumen);
                              setShowAccessModal(true);
                            }}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of{" "}
                  <span className="font-medium">{filteredData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISOSystemDaftarIndukDokumenInternalDashboard;
