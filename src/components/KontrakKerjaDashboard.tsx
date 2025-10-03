import React, { useState, useEffect } from "react";
import KontrakKerjaModal, { KontrakKerjaFormData } from "./KontrakKerjaModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { KontrakKerjaData } from "../types";
import {
  Search,
  Plus,
  FileSpreadsheet,
  FileText,
  File,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  CheckCircle, // New icon for Approve
} from "lucide-react";

interface KontrakKerjaDashboardProps {
  role?: string; // Add role prop
}

const KontrakKerjaDashboard: React.FC<KontrakKerjaDashboardProps> = ({
  role,
}) => {
  const [searchNoKontrak, setSearchNoKontrak] = useState("");
  const [searchPenerimaKontrak, setSearchPenerimaKontrak] = useState("");
  const [dateFrom, setDateFrom] = useState("03/03/2025");
  const [dateTo, setDateTo] = useState("03/03/2025");
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<KontrakKerjaData | null>(
    null
  );
  const [sortField, setSortField] = useState<keyof KontrakKerjaData | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sample data matching the image
  const [kontrakKerjaData, setKontrakKerjaData] = useState<KontrakKerjaData[]>([
    {
      id: "1",
      no: 1,
      noKontrak: "KO-001",
      penerimaKontrak: "Michael Scott",
      periodeKontrak: "01-01-2000 s.d 01-01-2030",
      tunjangan: ["Transport", "Makan", "Bonus", "Kesehatan", "Asuransi"],
    },
    {
      id: "2",
      no: 2,
      noKontrak: "KO-002",
      penerimaKontrak: "Pam Beesly",
      periodeKontrak: "15-06-2005 s.d 15-06-2035",
      tunjangan: ["Makan", "Transport", "Bonus"],
    },
    {
      id: "3",
      no: 3,
      noKontrak: "KO-003",
      penerimaKontrak: "Jim Halpert",
      periodeKontrak: "10-09-2010 s.d 10-09-2040",
      tunjangan: ["Kesehatan", "Asuransi", "Transport"],
    },
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  // Add this useEffect to log the role
  useEffect(() => {
    console.log("Current role in KontrakKerjaDashboard:", role);
  }, [role]); // Re-run when role changes

  const handleAddKontrakKerja = (formData: KontrakKerjaFormData) => {
    const newKontrakKerja: KontrakKerjaData = {
      id: (kontrakKerjaData.length + 1).toString(),
      no: kontrakKerjaData.length + 1,
      noKontrak: formData.nomorKontrak,
      penerimaKontrak: formData.penerimaKontrak,
      periodeKontrak: `${new Date(
        formData.periodeKontrakStart
      ).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })} s.d ${new Date(formData.periodeKontrakEnd).toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      )}`,
      tunjangan: formData.tunjangan
        .map((t) => t.namaTunjangan)
        .filter((name) => name.trim() !== ""),
    };

    setKontrakKerjaData((prev) => [
      newKontrakKerja,
      ...prev.map((k) => ({ ...k, no: k.no + 1 })),
    ]);
  };

  const handleSort = (field: keyof KontrakKerjaData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteClick = (kontrak: KontrakKerjaData) => {
    setItemToDelete(kontrak);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setKontrakKerjaData((prev) =>
        prev.filter((k) => k.id !== itemToDelete.id)
      );
      setItemToDelete(null);
    }
  };

  // Filter data based on search criteria
  const filteredData = kontrakKerjaData.filter((item) => {
    const matchesNoKontrak = item.noKontrak
      .toLowerCase()
      .includes(searchNoKontrak.toLowerCase());
    const matchesPenerimaKontrak = item.penerimaKontrak
      .toLowerCase()
      .includes(searchPenerimaKontrak.toLowerCase());

    return matchesNoKontrak && matchesPenerimaKontrak;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">KONTRAK KERJA</h1>
          </div>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Search Inputs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Search No Kontrak */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari No Kontrak
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNoKontrak}
                    onChange={(e) => setSearchNoKontrak(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="KO-001"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search Penerima Kontrak */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Penerima Kontrak
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchPenerimaKontrak}
                    onChange={(e) => setSearchPenerimaKontrak(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Muhammad Kasim"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Date Range and Search Button Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="03/03/2025"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="text"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="03/03/2025"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 opacity-0">
                  Search
                </label>
                <button
                  onClick={handleSearch}
                  className="w-full px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end space-x-2 mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <File className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Show entries control */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("no")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No</span>
                      {sortField === "no" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("noKontrak")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No Kontrak</span>
                      {sortField === "noKontrak" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("penerimaKontrak")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Penerima Kontrak</span>
                      {sortField === "penerimaKontrak" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("periodeKontrak")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Periode Kontrak</span>
                      {sortField === "periodeKontrak" && (
                        <ArrowUp
                          className={`h-3 w-3 transition-transform ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Tunjangan
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
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
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.no}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {item.noKontrak}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.penerimaKontrak}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.periodeKontrak}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {item.tunjangan.map((tunjangan, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                          >
                            {tunjangan}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        {role === "management" ? (
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-all duration-200 hover:scale-110"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setIsModalOpen(true)}
                              className="p-2 text-cyan-600 hover:bg-cyan-50 rounded transition-all duration-200 hover:scale-110"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setIsModalOpen(true)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 hover:scale-110"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredData.length)} of{" "}
                {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <button
                  onClick={() => handlePageChange(1)}
                  className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                    currentPage === 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  1
                </button>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kontrak Kerja Modal */}
      <KontrakKerjaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddKontrakKerja}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.penerimaKontrak}
      />
    </div>
  );
};

export default KontrakKerjaDashboard;
