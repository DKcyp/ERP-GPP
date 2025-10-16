import React, { useState } from "react";
import {
  Plus,
  Search,
  ArrowUpDown,
  Pencil,
  Trash2,
  X,
  Scale,
  Clock,
} from "lucide-react";

// Modal for adding a new unit
const TambahSatuanModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newSatuan: {
    id: number;
    namaSatuan: string;
    status: string;
  }) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [namaSatuan, setNamaSatuan] = useState("");
  const [status, setStatus] = useState("Aktif");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (namaSatuan.trim()) {
      onAdd({ id: Date.now(), namaSatuan, status });
      setNamaSatuan("");
      setStatus("Aktif");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Tambah Satuan Baru
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="namaSatuan"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Satuan
              </label>
              <input
                type="text"
                id="namaSatuan"
                value={namaSatuan}
                onChange={(e) => setNamaSatuan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="statusSatuan"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="statusSatuan"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Aktif">Aktif</option>
                <option value="Non Aktif">Non Aktif</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for editing an existing unit
const EditSatuanModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedSatuan: {
    id: number;
    namaSatuan: string;
    status: string;
  }) => void;
  satuan: { id: number; namaSatuan: string; status: string } | null;
}> = ({ isOpen, onClose, onSave, satuan }) => {
  const [namaSatuan, setNamaSatuan] = useState(satuan?.namaSatuan || "");
  const [status, setStatus] = useState(satuan?.status || "Aktif");

  React.useEffect(() => {
    if (satuan) {
      setNamaSatuan(satuan.namaSatuan);
      setStatus(satuan.status);
    }
  }, [satuan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (satuan && namaSatuan.trim()) {
      onSave({ ...satuan, namaSatuan, status });
      onClose();
    }
  };

  if (!isOpen || !satuan) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Edit Satuan</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="editNamaSatuan"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Satuan
              </label>
              <input
                type="text"
                id="editNamaSatuan"
                value={namaSatuan}
                onChange={(e) => setNamaSatuan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="editStatusSatuan"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="editStatusSatuan"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Aktif">Aktif</option>
                <option value="Non Aktif">Non Aktif</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for deleting a unit
const DeleteSatuanModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  satuan: { id: number; namaSatuan: string; status: string } | null;
}> = ({ isOpen, onClose, onConfirm, satuan }) => {
  if (!isOpen || !satuan) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Konfirmasi Hapus
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Apakah Anda yakin ingin menghapus satuan{" "}
            <strong>{satuan.namaSatuan}</strong>? Tindakan ini tidak dapat
            dibatalkan.
          </p>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MasterSatuan: React.FC = () => {
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSatuan, setSelectedSatuan] = useState<any>(null);

  const [satuanData, setSatuanData] = useState([
    { id: 1, namaSatuan: "Pcs", status: "Aktif" },
    { id: 2, namaSatuan: "Buah", status: "Aktif" },
    { id: 3, namaSatuan: "Unit", status: "Non Aktif" },
    { id: 4, namaSatuan: "Box", status: "Aktif" },
  ]);

  const [filters, setFilters] = useState({
    namaSatuan: "",
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState(""); // New state for search input
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData = satuanData.filter((item) => {
    return (
      item.namaSatuan
        .toLowerCase()
        .includes(filters.namaSatuan.toLowerCase()) &&
      (filters.status === "" ||
        item.status.toLowerCase() === filters.status.toLowerCase())
    );
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "aktif":
        return "bg-green-100 text-green-800";
      case "non aktif":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddSatuan = (newSatuan: {
    id: number;
    namaSatuan: string;
    status: string;
  }) => {
    setSatuanData((prev) => [...prev, newSatuan]);
  };

  const handleEditSatuan = (editedSatuan: {
    id: number;
    namaSatuan: string;
    status: string;
  }) => {
    setSatuanData((prev) =>
      prev.map((item) => (item.id === editedSatuan.id ? editedSatuan : item))
    );
    setSelectedSatuan(null);
  };

  const handleDeleteSatuan = (satuanToDelete: any) => {
    setSelectedSatuan(satuanToDelete);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSatuan) {
      setSatuanData((prev) =>
        prev.filter((item) => item.id !== selectedSatuan.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedSatuan(null);
    }
  };

  const handleOpenEditModal = (satuan: any) => {
    setSelectedSatuan(satuan);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MASTER SATUAN
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Accounting
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Master
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master Satuan</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="relative">
              <label htmlFor="namaSatuan" className="sr-only">
                Cari Nama Satuan
              </label>
              <input
                type="text"
                id="namaSatuan"
                name="namaSatuan"
                value={searchTerm} // Use searchTerm here
                onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on change
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                placeholder="Cari Nama Satuan"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, namaSatuan: searchTerm }))
                }
                className="flex-none px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Cari
              </button>
              <div className="flex-grow">
                <label htmlFor="status" className="sr-only">
                  Status Satuan
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  <option value="">--Pilih Status--</option>
                  <option value="aktif">Aktif</option>
                  <option value="non aktif">Non Aktif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setIsTambahModalOpen(true)}
              className="flex items-center px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" /> Satuan
            </button>
          </div>

          {/* Active Filters Indicator */}
          {(filters.namaSatuan || filters.status) && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm font-medium text-blue-800">
                  Filter Aktif:
                </span>
                {filters.namaSatuan && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Nama Satuan: {filters.namaSatuan}
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, namaSatuan: "" }))
                      }
                      className="ml-2 text-gray-600 hover:text-gray-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.status && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Status: {filters.status}
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, status: "" }))
                      }
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => setFilters({ namaSatuan: "", status: "" })}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="overflow-x-auto bg-gray-50 rounded-xl border border-gray-100 shadow-sm mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Nama Satuan{" "}
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Status{" "}
                      <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEntries.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1 + indexOfFirstEntry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.namaSatuan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 text-yellow-600 bg-yellow-100 rounded-full hover:bg-yellow-200 hover:text-yellow-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSatuan(item)}
                          className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 hover:text-red-800 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
              <span>entries</span>
            </div>
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstEntry + 1} to{" "}
              {Math.min(indexOfLastEntry, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Tambah Satuan Modal */}
      <TambahSatuanModal
        isOpen={isTambahModalOpen}
        onClose={() => setIsTambahModalOpen(false)}
        onAdd={handleAddSatuan}
      />

      {/* Edit Satuan Modal */}
      <EditSatuanModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSatuan}
        satuan={selectedSatuan}
      />

      {/* Delete Confirmation Modal */}
      <DeleteSatuanModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        satuan={selectedSatuan}
      />
    </div>
  );
};

export default MasterSatuan;
