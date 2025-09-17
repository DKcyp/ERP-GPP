import React, { useState } from "react";
import {
  TestTube,
  Search,
  Plus,
  Edit,
  Eye,
  Upload,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Camera,
  Atom,
  FileText,
  Download,
  Bell,
} from "lucide-react";

interface PersonilData {
  id: string;
  namaPersonil: string;
  noSIB: string;
  expSIB: string;
  statusSIB: "Valid" | "Mendekati Expired" | "Expired";
}

interface DosimeterData {
  id: string;
  noDosimeter: string;
  periode: string;
  nilaiDosis: string;
  statusDosimeter: "Valid" | "Mendekati Expired" | "Expired";
}

interface CertData {
  id: string;
  noCert: string;
  jenisCert: string;
  expCert: string;
  statusCert: "Valid" | "Mendekati Expired" | "Expired";
}

interface UjiUsapLogBook {
  id: string;
  no: number;
  noKTUN: string;
  masaBerlakuKTUN: string;
  statusKTUN: "Valid" | "Mendekati Expired" | "Expired";
  namaZRA: string;
  tipeZRA: string;
  noSeriZRA: string;
  aktivitasCi: number;
  merkKamera: string;
  tipeKamera: string;
  noSeriKamera: string;
  posisiKamera: "PHE ONWJ" | "MEDCO EPG" | "MEDCO CORRIDOR" | "OFFICE" | "PROJECT";
  lokasiPemanfaatan: string[];
  tanggalPengambilanSampel: string;
  noSertifikat: string;
  hasilUjiKebocoran: string;
  statusUji: "Valid" | "Mendekati Expired" | "Expired";
  keterangan: "Baru" | "Perpanjang" | "Off";
  expired: string;
  personilData: PersonilData[];
  dosimeterData: DosimeterData[];
  certData: CertData[];
  catatanProses?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Valid":
      return "text-green-600 bg-green-100";
    case "Mendekati Expired":
      return "text-yellow-600 bg-yellow-100";
    case "Expired":
      return "text-red-600 bg-red-100";
    default:
      return "";
  }
};

const getPosisiKameraColor = (posisiKamera: string) => {
  switch (posisiKamera) {
    case "PHE ONWJ":
      return "bg-blue-100 text-blue-600";
    case "MEDCO EPG":
      return "bg-blue-100 text-blue-600";
    case "MEDCO CORRIDOR":
      return "bg-green-100 text-green-600";
    case "OFFICE":
      return "bg-yellow-100 text-yellow-600";
    case "PROJECT":
      return "bg-red-100 text-red-600";
    default:
      return "";
  }
};

const getKeteranganColor = (keterangan: string) => {
  switch (keterangan) {
    case "Baru":
      return "bg-green-100 text-green-600";
    case "Perpanjang":
      return "bg-yellow-100 text-yellow-600";
    case "Off":
      return "bg-red-100 text-red-600";
    default:
      return "";
  }
};

const QHSEUjiUsapKameraDashboard: React.FC = () => {
  const [ujiUsapData, setUjiUsapData] = useState<UjiUsapLogBook[]>([
    {
      id: "1",
      no: 1,
      noKTUN: "106869.19.11.10521",
      masaBerlakuKTUN: "10/05/2023",
      statusKTUN: "Valid",
      namaZRA: "ZRA IR-192",
      tipeZRA: "IR 100",
      noSeriZRA: "YY104",
      aktivitasCi: 57.6,
      merkKamera: "Sentinel 880",
      tipeKamera: "Delta",
      noSeriKamera: "D12499",
      posisiKamera: "PHE ONWJ",
      lokasiPemanfaatan: ["Lokasi 1", "Lokasi 2"],
      tanggalPengambilanSampel: "3 Juni 2021",
      noSertifikat: "158/KN 02 01/KMR 4.1/VII/2021",
      hasilUjiKebocoran: "Baik",
      statusUji: "Valid",
      keterangan: "Baru",
      expired: "",
      personilData: [
        {
          id: "1",
          namaPersonil: "Personil 1",
          noSIB: "SIB123",
          expSIB: "10/05/2023",
          statusSIB: "Valid",
        },
      ],
      dosimeterData: [
        {
          id: "1",
          noDosimeter: "Dosimeter123",
          periode: "Periode 1",
          nilaiDosis: "Nilai Dosis 1",
          statusDosimeter: "Valid",
        },
      ],
      certData: [
        {
          id: "1",
          noCert: "Cert123",
          jenisCert: "Jenis Cert 1",
          expCert: "10/05/2023",
          statusCert: "Valid",
        },
      ],
    },
    // Add more data here...
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedData, setSelectedData] = useState<UjiUsapLogBook | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<UjiUsapLogBook>>({
    noKTUN: "",
    masaBerlakuKTUN: "",
    statusKTUN: "Valid",
    namaZRA: "",
    tipeZRA: "",
    noSeriZRA: "",
    aktivitasCi: 0,
    merkKamera: "",
    tipeKamera: "",
    noSeriKamera: "",
    posisiKamera: "PHE ONWJ",
    lokasiPemanfaatan: [],
    tanggalPengambilanSampel: "",
    noSertifikat: "",
    hasilUjiKebocoran: "",
    statusUji: "Valid",
    keterangan: "Baru",
    expired: "",
    personilData: [],
    dosimeterData: [],
    certData: [],
  });

  // Filter data
  const filteredData = ujiUsapData.filter((item) => {
    const matchesSearch =
      item.noKTUN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaZRA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noSeriZRA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.merkKamera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noSeriKamera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noSertifikat.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Statistics
  const stats = {
    total: ujiUsapData.length,
    baik: ujiUsapData.filter((u) => u.hasilUjiKebocoran === "Baik").length,
    expired: ujiUsapData.filter((u) => u.expired !== "").length,
    thisMonth: ujiUsapData.filter((u) => {
      const sampleDate = new Date(u.tanggalPengambilanSampel);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return sampleDate.getMonth() === currentMonth && sampleDate.getFullYear() === currentYear;
    }).length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const closeModal = () => {
    setShowModal(false);
    setModalMode("add");
    setSelectedData(null);
    setFormData({
      noKTUN: "",
      masaBerlakuKTUN: "",
      statusKTUN: "Valid",
      namaZRA: "",
      tipeZRA: "",
      noSeriZRA: "",
      aktivitasCi: 0,
      merkKamera: "",
      tipeKamera: "",
      noSeriKamera: "",
      posisiKamera: "PHE ONWJ",
      lokasiPemanfaatan: [],
      tanggalPengambilanSampel: "",
      noSertifikat: "",
      hasilUjiKebocoran: "",
      statusUji: "Valid",
      keterangan: "Baru",
      expired: "",
      personilData: [],
      dosimeterData: [],
      certData: [],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSave = () => {
    if (modalMode === "add") {
      const newData = { id: String(ujiUsapData.length + 1), ...formData };
      setUjiUsapData((prevData) => [...prevData, newData]);
    } else if (modalMode === "edit") {
      const updatedData = ujiUsapData.map((item) => {
        if (item.id === selectedData?.id) {
          return { ...item, ...formData };
        }
        return item;
      });
      setUjiUsapData(updatedData);
    }
    closeModal();
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updatedData = ujiUsapData.filter((item) => item.id !== deleteId);
      setUjiUsapData(updatedData);
    }
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TestTube className="h-8 w-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                  LOG BOOK UJI USAP ZAT RADIOAKTIF
                </h1>
              </div>
              <nav className="text-sm text-gray-600">
                <span>QHSE</span> <span className="mx-2">›</span>
                <span>RADIOGRAPHY</span> <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Uji Usap</span>
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
        

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan No KTUN, ZRA, Kamera, atau Sertifikat..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowModal(true);
                    setModalMode("add");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Data
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    No
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    No KTUN
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Masa<br/>Berlaku<br/>KTUN
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" colSpan={4}>
                    Data ZRA
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" colSpan={3}>
                    Data Kamera
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Tanggal<br/>Pengambilan<br/>Sampel
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" colSpan={2}>
                    Hasil Uji Kebocoran
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    expired
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
                <tr>
                  <th className="border-r border-gray-200"></th>
                  <th className="border-r border-gray-200"></th>
                  <th className="border-r border-gray-200"></th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Nama ZRA
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Tipe
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    No Seri
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Aktivitas<br/>(Ci)
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Merk
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Tipe
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    No Seri
                  </th>
                  <th className="border-r border-gray-200"></th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    No. Sertifikat
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Hasil Uji<br/>Kebocoran
                  </th>
                  <th className="border-r border-gray-200"></th>
                  <th className="border-r border-gray-200"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.no}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.noKTUN}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.masaBerlakuKTUN}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.namaZRA}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.tipeZRA}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.noSeriZRA}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.aktivitasCi}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.merkKamera}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.tipeKamera}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.noSeriKamera}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.tanggalPengambilanSampel}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.noSertifikat}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.hasilUjiKebocoran}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.expired || ""}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setShowModal(true);
                            setModalMode("edit");
                            setSelectedData(item);
                            setFormData(item);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(true);
                            setDeleteId(item.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPerPage, filteredData.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredData.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === "add" && "Tambah Data Uji Usap Kamera"}
                  {modalMode === "edit" && "Edit Data Uji Usap Kamera"}
                  {modalMode === "view" && "Detail Data Uji Usap Kamera"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="mt-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 border-b pb-2">Informasi Dasar</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">No KTUN</label>
                      <input
                        type="text"
                        name="noKTUN"
                        value={formData.noKTUN || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        placeholder="Masukkan No KTUN"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Masa Berlaku KTUN</label>
                      <input
                        type="date"
                        name="masaBerlakuKTUN"
                        value={formData.masaBerlakuKTUN || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status KTUN</label>
                      <select
                        name="statusKTUN"
                        value={formData.statusKTUN || "Valid"}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      >
                        <option value="Valid">Valid</option>
                        <option value="Mendekati Expired">Mendekati Expired</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tanggal Pengambilan Sampel</label>
                      <input
                        type="date"
                        name="tanggalPengambilanSampel"
                        value={formData.tanggalPengambilanSampel || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* ZRA Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 border-b pb-2">Data ZRA</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama ZRA</label>
                      <input
                        type="text"
                        name="namaZRA"
                        value={formData.namaZRA || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        placeholder="Masukkan Nama ZRA"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipe ZRA</label>
                      <input
                        type="text"
                        name="tipeZRA"
                        value={formData.tipeZRA || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        placeholder="Masukkan Tipe ZRA"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">No Seri ZRA</label>
                      <input
                        type="text"
                        name="noSeriZRA"
                        value={formData.noSeriZRA || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        placeholder="Masukkan No Seri ZRA"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Aktivitas (Ci)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="aktivitasCi"
                        value={formData.aktivitasCi || 0}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        placeholder="Masukkan Aktivitas"
                      />
                    </div>
                  </div>

                  {/* Camera Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 border-b pb-2">Data Kamera</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Merk Kamera</label>
                      <input
                        type="text"
                        name="merkKamera"
                        value={formData.merkKamera || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        placeholder="Masukkan Merk Kamera"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipe Kamera</label>
                      <input
                        type="text"
                        name="tipeKamera"
                        value={formData.tipeKamera || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        placeholder="Masukkan Tipe Kamera"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">No Seri Kamera</label>
                      <input
                        type="text"
                        name="noSeriKamera"
                        value={formData.noSeriKamera || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        placeholder="Masukkan No Seri Kamera"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Posisi Kamera</label>
                      <select
                        name="posisiKamera"
                        value={formData.posisiKamera || "PHE ONWJ"}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      >
                        <option value="PHE ONWJ">PHE ONWJ</option>
                        <option value="MEDCO EPG">MEDCO EPG</option>
                        <option value="MEDCO CORRIDOR">MEDCO CORRIDOR</option>
                        <option value="OFFICE">OFFICE</option>
                        <option value="PROJECT">PROJECT</option>
                      </select>
                    </div>
                  </div>

                  {/* Test Results */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 border-b pb-2">Hasil Uji</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">No. Sertifikat</label>
                      <input
                        type="text"
                        name="noSertifikat"
                        value={formData.noSertifikat || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        placeholder="Masukkan No. Sertifikat"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hasil Uji Kebocoran</label>
                      <input
                        type="text"
                        name="hasilUjiKebocoran"
                        value={formData.hasilUjiKebocoran || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        placeholder="Masukkan Hasil Uji"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status Uji</label>
                      <select
                        name="statusUji"
                        value={formData.statusUji || "Valid"}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      >
                        <option value="Valid">Valid</option>
                        <option value="Mendekati Expired">Mendekati Expired</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                      <select
                        name="keterangan"
                        value={formData.keterangan || "Baru"}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      >
                        <option value="Baru">Baru</option>
                        <option value="Perpanjang">Perpanjang</option>
                        <option value="Off">Off</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expired</label>
                      <input
                        type="text"
                        name="expired"
                        value={formData.expired || ""}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        placeholder="Status Expired"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end pt-4 border-t space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Batal
                </button>
                {modalMode !== "view" && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {modalMode === "add" ? "Tambah" : "Simpan"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Konfirmasi Hapus</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex items-center justify-center pt-4 space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEUjiUsapKameraDashboard;
