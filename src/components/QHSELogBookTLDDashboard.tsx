import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Calendar,
  User,
  Building,
  Hash,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  X,
  Users,
} from "lucide-react";

interface LogBookTLDEntry {
  id: string;
  no: number;
  namaPersonil: string;
  namaProject: string;
  noSO: string;
  periodeTLD: string; // Changed from jenisLogBook
  tglKeluar: string;
  tglMasuk: string;
  status: "Sudah Kembali" | "Belum Kembali";
  qhseValidationKeluar: boolean;
  qhseValidationMasuk: boolean;
  mobDemobId?: string;
  createdAt: string;
  updatedAt: string;
}

const QHSELogBookTLDDashboard: React.FC = () => {
  const [entries, setEntries] = useState<LogBookTLDEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<LogBookTLDEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [editingEntry, setEditingEntry] = useState<LogBookTLDEntry | null>(
    null
  );
  const [deletingEntry, setDeletingEntry] = useState<LogBookTLDEntry | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<LogBookTLDEntry>>({});
  const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10); // Removed as it was unused

  // Mock data
  useEffect(() => {
    const mockData: LogBookTLDEntry[] = [
      {
        id: "1",
        no: 1,
        namaPersonil: "Ahmad Rizki",
        namaProject: "TLD Training PHE ONWJ",
        noSO: "SO-2024-TLD-001",
        periodeTLD: "Operator",
        tglKeluar: "2024-01-15",
        tglMasuk: "2024-01-20",
        status: "Sudah Kembali",
        qhseValidationKeluar: true,
        qhseValidationMasuk: true,
        mobDemobId: "TLD-001",
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-20T17:00:00Z",
      },
      {
        id: "2",
        no: 2,
        namaPersonil: "Budi Santoso",
        namaProject: "TLD Training Medco Corridor",
        noSO: "SO-2024-TLD-002",
        periodeTLD: "Trainer",
        tglKeluar: "2024-01-18",
        tglMasuk: "",
        status: "Belum Kembali",
        qhseValidationKeluar: true,
        qhseValidationMasuk: false,
        mobDemobId: "TLD-002",
        createdAt: "2024-01-18T07:30:00Z",
        updatedAt: "2024-01-18T07:30:00Z",
      },
      {
        id: "3",
        no: 3,
        namaPersonil: "Citra Dewi",
        namaProject: "TLD Training ENI Muara Bakau",
        noSO: "SO-2024-TLD-003",
        periodeTLD: "Operator",
        tglKeluar: "2024-02-01",
        tglMasuk: "2024-02-05",
        status: "Sudah Kembali",
        qhseValidationKeluar: true,
        qhseValidationMasuk: true,
        mobDemobId: "TLD-003",
        createdAt: "2024-02-01T09:00:00Z",
        updatedAt: "2024-02-05T16:30:00Z",
      },
    ];
    setEntries(mockData);
    setFilteredEntries(mockData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = entries.filter((entry) => {
      const matchesSearch =
        entry.namaPersonil.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.no.toString().includes(searchTerm) ||
        entry.namaProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.noSO.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || entry.status === filterStatus;
      const matchesProject =
        filterProject === "all" || entry.namaProject.includes(filterProject);

      return matchesSearch && matchesStatus && matchesProject;
    });

    setFilteredEntries(filtered);
    setCurrentPage(1);
  }, [entries, searchTerm, filterStatus, filterProject]);

  // Statistics
  const stats = {
    total: entries.length,
    sudahKembali: entries.filter((e) => e.status === "Sudah Kembali").length,
    belumKembali: entries.filter((e) => e.status === "Belum Kembali").length,
    needValidation: entries.filter(
      (e) => !e.qhseValidationKeluar || !e.qhseValidationMasuk
    ).length,
  };

  // Get unique projects for filter
  const uniqueProjects = [
    ...new Set(entries.map((e) => e.namaProject.split(" ")[0])),
  ];

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / 10); // Assuming 10 items per page
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentEntries = filteredEntries.slice(startIndex, endIndex);

  // CRUD Handlers
  const handleAddEntry = () => {
    setModalMode("add");
    setEditingEntry(null);
    setFormData({
      namaPersonil: "",
      namaProject: "",
      noSO: "",
      periodeTLD: "Operator",
      tglKeluar: "",
      tglMasuk: "",
      qhseValidationKeluar: false,
      qhseValidationMasuk: false,
      mobDemobId: "",
    });
    setShowModal(true);
  };

  const handleEditEntry = (entry: LogBookTLDEntry) => {
    setModalMode("edit");
    setEditingEntry(entry);
    setFormData(entry);
    setShowModal(true);
  };

  const handleViewEntry = (entry: LogBookTLDEntry) => {
    setModalMode("view");
    setEditingEntry(entry);
    setFormData(entry);
    setShowModal(true);
  };

  const handleDeleteEntry = (entry: LogBookTLDEntry) => {
    setDeletingEntry(entry);
    setShowDeleteModal(true);
  };

  const handleSaveEntry = () => {
    if (modalMode === "add") {
      const newEntry: LogBookTLDEntry = {
        id: Date.now().toString(),
        no: entries.length + 1,
        namaPersonil: formData.namaPersonil || "",
        namaProject: formData.namaProject || "",
        noSO: formData.noSO || "",
        periodeTLD: formData.periodeTLD || "Operator",
        tglKeluar: formData.tglKeluar || "",
        tglMasuk: formData.tglMasuk || "",
        status: formData.tglMasuk ? "Sudah Kembali" : "Belum Kembali",
        qhseValidationKeluar: formData.qhseValidationKeluar || false,
        qhseValidationMasuk: formData.qhseValidationMasuk || false,
        mobDemobId: formData.mobDemobId || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setEntries((prev) => [...prev, newEntry]);
    } else if (modalMode === "edit" && editingEntry) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingEntry.id
            ? {
                ...entry,
                namaPersonil: formData.namaPersonil || entry.namaPersonil,
                namaProject: formData.namaProject || entry.namaProject,
                noSO: formData.noSO || entry.noSO,
                periodeTLD: formData.periodeTLD || entry.periodeTLD,
                tglKeluar: formData.tglKeluar || entry.tglKeluar,
                tglMasuk: formData.tglMasuk || entry.tglMasuk,
                status: formData.tglMasuk ? "Sudah Kembali" : "Belum Kembali",
                qhseValidationKeluar:
                  formData.qhseValidationKeluar ?? entry.qhseValidationKeluar,
                qhseValidationMasuk:
                  formData.qhseValidationMasuk ?? entry.qhseValidationMasuk,
                mobDemobId: formData.mobDemobId || entry.mobDemobId,
                updatedAt: new Date().toISOString(),
              }
            : entry
        )
      );
    }
    setShowModal(false);
    setFormData({});
  };

  const handleConfirmDelete = () => {
    if (deletingEntry) {
      setEntries((prev) =>
        prev.filter((entry) => entry.id !== deletingEntry.id)
      );
      setShowDeleteModal(false);
      setDeletingEntry(null);
    }
  };

  const handleInputChange = (field: keyof LogBookTLDEntry, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQHSEValidation = (entryId: string, type: "keluar" | "masuk") => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              [type === "keluar"
                ? "qhseValidationKeluar"
                : "qhseValidationMasuk"]: true,
              updatedAt: new Date().toISOString(),
            }
          : entry
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Sudah Kembali":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Sudah Kembali
          </span>
        );
      case "Belum Kembali":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Belum Kembali
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                  Log In Log Out TLD
                </h1>
              </div>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  QHSE
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Log Book TLD</span>
              </nav>
              <p className="text-gray-600 mt-2">
                Monitoring log book TLD personil dengan integrasi Mob-Demob dan
                validasi QHSE
              </p>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Log Book TLD
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Sudah Kembali
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.sudahKembali}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Belum Kembali
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.belumKembali}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Perlu Validasi
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.needValidation}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan No / Nama Personil / Project / No SO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="Sudah Kembali">Sudah Kembali</option>
                <option value="Belum Kembali">Belum Kembali</option>
              </select>

              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Project</option>
                {uniqueProjects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddEntry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambah Log Book TLD
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 text-gray-400 mr-2" />
                      No
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      Nama Personil
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-400 mr-2" />
                      Project
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 text-gray-400 mr-2" />
                      No SO
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      Periode TLD
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      Tgl Keluar
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      Tgl Masuk
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                      Status
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                      QHSE Validation
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Edit className="h-4 w-4 text-gray-400 mr-2" />
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {entry.namaPersonil}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {entry.namaProject}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {entry.noSO}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {entry.periodeTLD}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {new Date(entry.tglKeluar).toLocaleDateString(
                            "id-ID"
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {entry.tglMasuk
                            ? new Date(entry.tglMasuk).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(entry.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-1">
                            Out:
                          </span>
                          {entry.qhseValidationKeluar ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <button
                              onClick={() =>
                                handleQHSEValidation(entry.id, "keluar")
                              }
                              className="h-4 w-4 text-red-500 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-1">
                            In:
                          </span>
                          {entry.qhseValidationMasuk ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <button
                              onClick={() =>
                                handleQHSEValidation(entry.id, "masuk")
                              }
                              className="h-4 w-4 text-red-500 hover:text-red-700"
                              disabled={!entry.tglMasuk}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewEntry(entry)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, filteredEntries.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredEntries.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
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
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit/View Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === "add"
                    ? "Tambah Entry Baru"
                    : modalMode === "edit"
                    ? "Edit Entry"
                    : "Detail Entry"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Personil
                  </label>
                  <input
                    type="text"
                    value={formData.namaPersonil || ""}
                    onChange={(e) =>
                      handleInputChange("namaPersonil", e.target.value)
                    }
                    disabled={modalMode === "view"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Masukkan nama personil"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Project
                  </label>
                  <input
                    type="text"
                    value={formData.namaProject || ""}
                    onChange={(e) =>
                      handleInputChange("namaProject", e.target.value)
                    }
                    disabled={modalMode === "view"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Masukkan nama project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No SO
                  </label>
                  <input
                    type="text"
                    value={formData.noSO || ""}
                    onChange={(e) => handleInputChange("noSO", e.target.value)}
                    disabled={modalMode === "view"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Masukkan nomor SO"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Periode TLD
                  </label>
                  <input
                    type="text"
                    value={formData.periodeTLD || ""}
                    onChange={(e) =>
                      handleInputChange("periodeTLD", e.target.value)
                    }
                    disabled={modalMode === "view"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Masukkan Periode TLD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Keluar
                  </label>
                  <input
                    type="date"
                    value={formData.tglKeluar || ""}
                    onChange={(e) =>
                      handleInputChange("tglKeluar", e.target.value)
                    }
                    disabled={modalMode === "view"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Masuk
                  </label>
                  <input
                    type="date"
                    value={formData.tglMasuk || ""}
                    onChange={(e) =>
                      handleInputChange("tglMasuk", e.target.value)
                    }
                    disabled={modalMode === "view"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mob-Demob ID
                  </label>
                  <input
                    type="text"
                    value={formData.mobDemobId || ""}
                    onChange={(e) =>
                      handleInputChange("mobDemobId", e.target.value)
                    }
                    disabled={modalMode === "view"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Masukkan Mob-Demob ID"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QHSE Validation
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.qhseValidationKeluar || false}
                        onChange={(e) =>
                          handleInputChange(
                            "qhseValidationKeluar",
                            e.target.checked
                          )
                        }
                        disabled={modalMode === "view"}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        Validasi Keluar
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.qhseValidationMasuk || false}
                        onChange={(e) =>
                          handleInputChange(
                            "qhseValidationMasuk",
                            e.target.checked
                          )
                        }
                        disabled={modalMode === "view"}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        Validasi Masuk
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {modalMode === "view" ? "Tutup" : "Batal"}
                </button>
                {modalMode !== "view" && (
                  <button
                    onClick={handleSaveEntry}
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
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
      {showDeleteModal && deletingEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">
                Hapus Entry
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus entry untuk{" "}
                  <strong>{deletingEntry.namaPersonil}</strong>?
                </p>
                <div className="mt-3 text-left bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">
                    Project: {deletingEntry.namaProject}
                  </p>
                  <p className="text-xs text-gray-600">
                    No SO: {deletingEntry.noSO}
                  </p>
                  <p className="text-xs text-gray-600">
                    Jenis: {deletingEntry.periodeTLD}
                  </p>
                </div>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
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

export default QHSELogBookTLDDashboard;
