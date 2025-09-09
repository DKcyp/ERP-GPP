import React, { useState, useEffect } from "react";
import ProspectModal, { ProspectFormData } from "./ProspectModal";
import HistoryProspectModal from "./HistoryProspectModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  Search,
  Plus,
  FileSpreadsheet,
  FileText,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Calendar,
  Clock,
} from "lucide-react";

interface Prospect {
  id: string;
  no: number;
  namaPerusahaan: string;
  pic: string;
  jabatan: string;
  noTelp: string;
  deadlineProspect: string; // DD-MM-YYYY
  alamat: string;
  email: string;
  keterangan: string;
  tanggalUpdate: string; // DD-MM-YYYY
  status: "Cold" | "Warm" | "Hot";
}

const ProspectDashboard: React.FC = () => {
  const [searchNama, setSearchNama] = useState("");
  const [searchPIC, setSearchPIC] = useState("");
  const [searchJenisPekerjaan, setSearchJenisPekerjaan] = useState(""); // New state for 'Cari Jenis Pekerjaan'
  const [searchLokasiKerja, setSearchLokasiKerja] = useState(""); // New state for 'Cari Lokasi Kerja'
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Prospect | null>(null);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null); // New state for editing
  const [modalTitle, setModalTitle] = useState("Entry Prospect"); // New state for modal title
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProspect, setViewProspect] = useState<Prospect | null>(null);

  // Sample data matching the image
  const [prospects, setProspects] = useState<Prospect[]>([
    {
      id: "1",
      no: 1,
      namaPerusahaan: "PT Maju Jaya",
      pic: "Budi Santoso",
      jabatan: "Direktur",
      noTelp: "081234567890",
      deadlineProspect: "31-01-2025",
      alamat: "Jakarta Pusat",
      email: "ptmajujaya2025@gmail.com",
      keterangan: "Perusahaan manufaktur, membutuhkan solusi ERP",
      tanggalUpdate: "01-01-2025",
      status: "Cold",
    },
    {
      id: "2",
      no: 2,
      namaPerusahaan: "PT Makmur Sentosa",
      pic: "Ani Lestari",
      jabatan: "Owner",
      noTelp: "021555444433",
      deadlineProspect: "31-02-2025",
      alamat: "Jakarta Selatan",
      email: "ptmakmursentosa2022@gmail.com",
      keterangan: "PT retail, tertarik dengan produk baru kami",
      tanggalUpdate: "02-01-2025",
      status: "Hot",
    },
    {
      id: "3",
      no: 3,
      namaPerusahaan: "CV Sejahtera",
      pic: "Andi Ahmad",
      jabatan: "CEO",
      noTelp: "085799988877",
      deadlineProspect: "31-03-2025",
      alamat: "Bogor",
      email: "cvsejahtera2020@gmail.com",
      keterangan: "Perusahaan jasa konsultan, potensial menjadi partner",
      tanggalUpdate: "02-01-2025",
      status: "Warm",
    },
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSaveProspect = (formData: ProspectFormData) => {
    const formattedDeadline = new Date(
      formData.deadlineProspect
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTanggalUpdate = new Date(
      formData.tanggalUpdate
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (editingProspect) {
      // Update existing prospect
      setProspects((prev) =>
        prev.map((p) =>
          p.id === editingProspect.id
            ? {
                ...p,
                namaPerusahaan: formData.namaPerusahaan,
                pic: formData.pic,
                noTelp: formData.noTelp,
                deadlineProspect: formattedDeadline,
                email: formData.email,
                keterangan:
                  formData.keterangan || formData.catatan || "Data diupdate",
                tanggalUpdate: formattedTanggalUpdate,
                status: formData.status,
                // Assuming other fields like jabatan, alamat might not be directly editable via this modal
              }
            : p
        )
      );
    } else {
      // Add new prospect
      const newProspect: Prospect = {
        id: (prospects.length + 1).toString(),
        no: prospects.length + 1,
        namaPerusahaan: formData.namaPerusahaan,
        pic: formData.pic,
        jabatan: "Staff", // Default jabatan
        noTelp: formData.noTelp,
        deadlineProspect: formattedDeadline,
        alamat: "Alamat akan diupdate", // Default alamat
        email: formData.email,
        keterangan:
          formData.keterangan || formData.catatan || "Data baru ditambahkan",
        tanggalUpdate: formattedTanggalUpdate,
        status: formData.status,
      };
      setProspects((prev) => [
        newProspect,
        ...prev.map((p) => ({ ...p, no: p.no + 1 })),
      ]);
    }
    setIsModalOpen(false);
    setEditingProspect(null); // Clear editing state
    setModalTitle("Entry Prospect"); // Reset title
  };

  const handleEditClick = (prospect: Prospect) => {
    // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD' for date inputs
    const deadlineParts = prospect.deadlineProspect.split("-");
    const formattedDeadline = `${deadlineParts[2]}-${deadlineParts[1]}-${deadlineParts[0]}`;

    const updateDateParts = prospect.tanggalUpdate.split("-");
    const formattedUpdateDate = `${updateDateParts[2]}-${updateDateParts[1]}-${updateDateParts[0]}`;

    setEditingProspect({
      ...prospect,
      deadlineProspect: formattedDeadline,
      tanggalUpdate: formattedUpdateDate,
    });
    setModalTitle("Edit Prospect");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (prospect: Prospect) => {
    setItemToDelete(prospect);
    setDeleteModalOpen(true);
  };

  const handleViewClick = (prospect: Prospect) => {
    setViewProspect(prospect);
    setIsViewModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setProspects((prev) => prev.filter((p) => p.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  // Handlers extracted from inline JSX to avoid any parsing ambiguity
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProspect(null); // Clear editing state on close
    setModalTitle("Entry Prospect"); // Reset title on close
  };

  const handleHistoryClose = () => setIsHistoryModalOpen(false);
  const handleDeleteClose = () => setDeleteModalOpen(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot":
        return "bg-red-500 text-white";
      case "Warm":
        return "bg-yellow-500 text-white";
      case "Cold":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = ["Cold", "Warm", "Hot"];

  // Filter prospects based on search criteria
  const filteredProspects = prospects.filter((prospect) => {
    const matchesNama = prospect.namaPerusahaan
      .toLowerCase()
      .includes(searchNama.toLowerCase());
    const matchesPIC = prospect.pic
      .toLowerCase()
      .includes(searchPIC.toLowerCase());
    // Using 'keterangan' as a placeholder for 'Jenis Pekerjaan' and 'alamat' for 'Lokasi Kerja'
    const matchesJenisPekerjaan = searchJenisPekerjaan
      ? prospect.keterangan
          .toLowerCase()
          .includes(searchJenisPekerjaan.toLowerCase())
      : true;
    const matchesLokasiKerja = searchLokasiKerja
      ? prospect.alamat.toLowerCase().includes(searchLokasiKerja.toLowerCase())
      : true;
    const matchesStatus = selectedStatus
      ? prospect.status === selectedStatus
      : true;

    // Date filtering (assuming deadlineProspect is 'DD-MM-YYYY')
    const prospectDeadline = prospect.deadlineProspect
      .split("-")
      .reverse()
      .join("-"); // Convert to YYYY-MM-DD for comparison
    const matchesDateFrom = dateFrom ? prospectDeadline >= dateFrom : true;
    const matchesDateTo = dateTo ? prospectDeadline <= dateTo : true;

    return (
      matchesNama &&
      matchesPIC &&
      matchesJenisPekerjaan &&
      matchesLokasiKerja &&
      matchesStatus &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProspects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProspects = filteredProspects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  // Precompute initial data for edit modal to avoid inline object in JSX
  const initialFormData: ProspectFormData | null = editingProspect
    ? {
        namaPerusahaan: editingProspect!.namaPerusahaan,
        pic: editingProspect!.pic,
        email: editingProspect!.email,
        noTelp: editingProspect!.noTelp,
        deadlineProspect: editingProspect!.deadlineProspect,
        topikPembicaraan: editingProspect!.keterangan,
        tindakLanjut: "",
        hasil: "",
        catatan: editingProspect!.keterangan,
        keterangan: editingProspect!.keterangan,
        tanggalUpdate: editingProspect!.tanggalUpdate,
        status: editingProspect!.status,
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR PROSPECT
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Marketing
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Prospect
                </span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16"></div>

          {/* Filter Inputs Grid + Actions Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
            {/* Cari Nama Perusahaan (equivalent to Cari No SPK) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Nama Perusahaan
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNama}
                  onChange={(e) => setSearchNama(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari Nama Perusahaan..."
                />
              </div>
            </div>

            {/* Cari PIC (equivalent to Cari Nama Pegawai) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari PIC
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchPIC}
                  onChange={(e) => setSearchPIC(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari PIC..."
                />
              </div>
            </div>

            {/* Cari Jenis Pekerjaan */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Jenis Pekerjaan
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchJenisPekerjaan}
                  onChange={(e) => setSearchJenisPekerjaan(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari Jenis Pekerjaan..."
                />
              </div>
            </div>

            {/* Cari Lokasi Kerja */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Cari Lokasi Kerja
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchLokasiKerja}
                  onChange={(e) => setSearchLokasiKerja(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari Lokasi Kerja..."
                />
              </div>
            </div>

            {/* Pilih Status (equivalent to Pilih Status SPK) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Pilih Status
              </label>
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white"
                >
                  <span
                    className={
                      selectedStatus ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {selectedStatus || "Semua Status"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      statusDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedStatus("");
                        setStatusDropdownOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-gray-50 transition-colors text-gray-500"
                    >
                      Semua Status
                    </button>
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setStatusDropdownOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span
                          className={`w-3 h-3 rounded-full ${
                            status === "Hot"
                              ? "bg-red-500"
                              : status === "Warm"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        ></span>
                        <span>{status}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Periode Awal */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode Awal
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Akhir */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode Akhir
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Tombol Cari sejajar dengan Periode Akhir */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-transparent">
                Cari
              </label>
              <button
                onClick={handleSearch}
                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>

            {/* Actions Bar: single row for all buttons */}
            <div className="lg:col-span-4 flex flex-wrap items-center gap-3 lg:justify-end">
              <button
                onClick={() => {
                  setEditingProspect(null);
                  setModalTitle("Entry Prospect");
                  setIsModalOpen(true);
                }}
                className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-600/25 flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>

              <button className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-600/25 flex items-center justify-center space-x-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </button>

              <button className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-600/25 flex items-center justify-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="uppercase">PDF</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                  No
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                  Nama Perusahaan
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                  PIC
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                  Jabatan
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                  No Telp
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                  Deadline Prospect
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                  Alamat
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                  Email
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                  Keterangan
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                  Tanggal Update
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 whitespace-nowrap">
                  Status
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900 whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProspects.map((prospect, index) => (
                <tr
                  key={prospect.id}
                  className={`hover:bg-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  } ${
                    animateRows
                      ? "animate-in fade-in slide-in-from-bottom-2"
                      : "opacity-0"
                  }`}
                  style={{
                    animationDelay: animateRows ? `${index * 100}ms` : "0ms",
                    animationFillMode: "forwards",
                  }}
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="font-medium text-gray-900">
                      {prospect.no}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                    {prospect.namaPerusahaan}
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                    {prospect.pic}
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                    {prospect.jabatan}
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                    {prospect.noTelp}
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span>{prospect.deadlineProspect}</span>
                      <div className="w-4 h-4 bg-yellow-400 rounded flex items-center justify-center">
                        <span className="text-xs text-white">!</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                    {prospect.alamat}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <a
                      href={`mailto:${prospect.email}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {prospect.email}
                    </a>
                  </td>
                  <td
                    className="px-3 py-2 text-gray-600 max-w-xs truncate whitespace-nowrap"
                    title={prospect.keterangan}
                  >
                    {prospect.keterangan}
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                    {prospect.tanggalUpdate}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        prospect.status
                      )}`}
                    >
                      {prospect.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => handleEditClick(prospect)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 hover:scale-110"
                        title="Edit"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(prospect)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all duration-200 hover:scale-110"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleViewClick(prospect)}
                        className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-all duration-200 hover:scale-110"
                        title="View"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setIsHistoryModalOpen(true)}
                        className="p-1.5 text-teal-600 hover:bg-teal-50 rounded transition-all duration-200 hover:scale-110"
                        title="History"
                      >
                        <Clock className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-700">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredProspects.length)} of{" "}
              {filteredProspects.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                          : "text-gray-700 hover:bg-white hover:text-blue-600"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProspectModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveProspect}
        initialData={initialFormData}
        title={modalTitle}
      />

      <HistoryProspectModal
        isOpen={isHistoryModalOpen}
        onClose={handleHistoryClose}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaPerusahaan}
      />

      {/* View Details Modal */}
      {isViewModalOpen && viewProspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsViewModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Detail Prospect
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Nama Perusahaan</div>
                <div className="font-medium text-gray-900">
                  {viewProspect.namaPerusahaan}
                </div>
              </div>
              <div>
                <div className="text-gray-500">PIC</div>
                <div className="font-medium text-gray-900">
                  {viewProspect.pic}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Jabatan</div>
                <div className="font-medium text-gray-900">
                  {viewProspect.jabatan}
                </div>
              </div>
              <div>
                <div className="text-gray-500">No Telp</div>
                <div className="font-medium text-gray-900">
                  {viewProspect.noTelp}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Deadline Prospect</div>
                <div className="font-medium text-gray-900">
                  {viewProspect.deadlineProspect}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Tanggal Update</div>
                <div className="font-medium text-gray-900">
                  {viewProspect.tanggalUpdate}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-gray-500">Alamat</div>
                <div className="font-medium text-gray-900">
                  {viewProspect.alamat}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-gray-500">Email</div>
                <div className="font-medium text-blue-600">
                  {viewProspect.email}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-gray-500">Keterangan</div>
                <div className="font-medium text-gray-900">
                  {viewProspect.keterangan}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Status</div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    viewProspect.status
                  )}`}
                >
                  {viewProspect.status}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProspectDashboard;
