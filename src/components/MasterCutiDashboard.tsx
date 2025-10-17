import React, { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search, X, Clock } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal"; // Assuming ConfirmationModal exists

export interface LeaveQuota {
  id: string;
  nama: string;
  departemen: string;
  nomorSO?: string; // New field for Nomor SO
  limitTahunan: number; // Renamed from cutiTahunan
  usedTahunan: number; // New field for used annual leave
  limitPotong: number; // New field
  usedPotong: number; // New field
  limitProject: number; // New field
  usedProject: number; // New field
  limitSakit: number; // New field
  usedSakit: number; // New field
  limitIstimewa: number; // New field
  usedIstimewa: number; // New field
  limitKhusus: number; // New field
  usedKhusus: number; // New field
}

interface LeaveQuotaFormData {
  nama: string;
  departemen: string;
  nomorSO: string; // New field for Nomor SO
  limitTahunan: number;
  limitPotong: number;
  limitProject: number;
  limitSakit: number;
  limitIstimewa: number;
  limitKhusus: number;
}

export const initialLeaveQuotas: LeaveQuota[] = [
  {
    id: "LQ-001",
    nama: "Budi Santoso",
    departemen: "HRD",
    nomorSO: "SO-2025-001",
    limitTahunan: 12,
    usedTahunan: 2, // Example: Budi used 2 annual leaves
    limitPotong: 5,
    usedPotong: 0,
    limitProject: 3,
    usedProject: 1, // Example: Budi used 1 project leave
    limitSakit: 10,
    usedSakit: 0,
    limitIstimewa: 2,
    usedIstimewa: 0,
    limitKhusus: 1,
    usedKhusus: 0,
  },
  {
    id: "LQ-002",
    nama: "Siti Mawar",
    departemen: "Operational",
    nomorSO: "SO-2025-002",
    limitTahunan: 12,
    usedTahunan: 0,
    limitPotong: 5,
    usedPotong: 0,
    limitProject: 3,
    usedProject: 0,
    limitSakit: 10,
    usedSakit: 1, // Example: Siti used 1 sick leave
    limitIstimewa: 2,
    usedIstimewa: 0,
    limitKhusus: 1,
    usedKhusus: 0,
  },
  {
    id: "LQ-003",
    nama: "Agus Dharma",
    departemen: "Marketing",
    nomorSO: "SO-2025-003",
    limitTahunan: 12,
    usedTahunan: 4,
    limitPotong: 5,
    usedPotong: 0,
    limitProject: 3,
    usedProject: 0,
    limitSakit: 10,
    usedSakit: 0,
    limitIstimewa: 2,
    usedIstimewa: 1, // Example: Agus used 1 special leave
    limitKhusus: 1,
    usedKhusus: 0,
  },
];

const MasterCutiDashboard: React.FC = () => {
  const [leaveQuotas, setLeaveQuotas] =
    useState<LeaveQuota[]>(initialLeaveQuotas);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuota, setEditingQuota] = useState<LeaveQuota | null>(null);
  const [formData, setFormData] = useState<LeaveQuotaFormData>({
    nama: "",
    departemen: "",
    nomorSO: "", // New field for Nomor SO
    limitTahunan: 0,
    limitPotong: 0,
    limitProject: 0,
    limitSakit: 0,
    limitIstimewa: 0,
    limitKhusus: 0,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<LeaveQuota | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartemen, setFilterDepartemen] = useState("");

  const filteredLeaveQuotas = useMemo(() => {
    let filtered = leaveQuotas;

    if (searchQuery) {
      filtered = filtered.filter(
        (quota) =>
          quota.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (quota.nomorSO &&
            quota.nomorSO.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterDepartemen) {
      filtered = filtered.filter(
        (quota) => quota.departemen === filterDepartemen
      );
    }

    return filtered;
  }, [leaveQuotas, searchQuery, filterDepartemen]);

  const openAddModal = () => {
    setEditingQuota(null);
    setFormData({
      nama: "",
      departemen: "",
      nomorSO: "", // New field
      limitTahunan: 0,
      limitPotong: 0,
      limitProject: 0,
      limitSakit: 0,
      limitIstimewa: 0,
      limitKhusus: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (quota: LeaveQuota) => {
    setEditingQuota(quota);
    setFormData({
      nama: quota.nama,
      departemen: quota.departemen,
      nomorSO: quota.nomorSO || "", // New field
      limitTahunan: quota.limitTahunan,
      limitPotong: quota.limitPotong,
      limitProject: quota.limitProject,
      limitSakit: quota.limitSakit,
      limitIstimewa: quota.limitIstimewa,
      limitKhusus: quota.limitKhusus,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "limitTahunan",
        "limitPotong",
        "limitProject",
        "limitSakit",
        "limitIstimewa",
        "limitKhusus",
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSaveForm = () => {
    if (
      !formData.nama ||
      !formData.departemen ||
      !formData.nomorSO || // Validate new field
      formData.limitTahunan < 0 ||
      formData.limitPotong < 0 ||
      formData.limitProject < 0 ||
      formData.limitSakit < 0 ||
      formData.limitIstimewa < 0 ||
      formData.limitKhusus < 0
    ) {
      alert(
        "Nama, Departemen, Nomor SO, dan semua limit cuti tidak boleh kosong atau minus."
      );
      return;
    }

    if (editingQuota) {
      setLeaveQuotas((prev) =>
        prev.map((quota) =>
          quota.id === editingQuota.id
            ? {
                ...quota,
                ...formData,
                usedTahunan:
                  quota.usedTahunan +
                  (editingQuota.limitTahunan - formData.limitTahunan > 0
                    ? editingQuota.limitTahunan - formData.limitTahunan
                    : 0),
              }
            : quota
        )
      );
    } else {
      const newId = `LQ-${String(leaveQuotas.length + 1).padStart(3, "0")}`;
      const newQuota: LeaveQuota = {
        id: newId,
        ...formData,
        usedTahunan: 0, // Initialize used counts to 0 for new entries
        usedPotong: 0,
        usedProject: 0,
        usedSakit: 0,
        usedIstimewa: 0,
        usedKhusus: 0,
      };
      setLeaveQuotas((prev) => [...prev, newQuota]);
    }
    setIsModalOpen(false);
  };

  const openDeleteModal = (quota: LeaveQuota) => {
    setItemToDelete(quota);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setLeaveQuotas((prev) =>
        prev.filter((quota) => quota.id !== itemToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MASTER CUTI PEGAWAI
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  HRD
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master Cuti</span>
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
        <div className="flex justify-end">
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Tambah Cuti</span>
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="searchQuery"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cari Nama
            </label>
            <input
              type="text"
              id="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pegawai..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="filterDepartemen"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter Departemen
            </label>
            <select
              id="filterDepartemen"
              value={filterDepartemen}
              onChange={(e) => setFilterDepartemen(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Semua Departemen</option>
              <option value="HRD">HRD</option>
              <option value="Pengadaan">Pengadaan</option>
              <option value="Marketing">Marketing</option>
              <option value="Operational">Operational</option>
              <option value="Gudang">Gudang</option>
              <option value="QHSE">QHSE</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterDepartemen("");
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors shadow-sm"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Leave Quota Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Pegawai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departemen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor SO
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuti Tahunan
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuti Potong
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuti Project
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuti Sakit
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuti Istimewa
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuti Khusus
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeaveQuotas.map((quota) => (
                  <tr key={quota.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quota.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {quota.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {quota.departemen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {quota.nomorSO || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      {quota.usedTahunan} / {quota.limitTahunan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      {quota.usedPotong} / {quota.limitPotong}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      {quota.usedProject} / {quota.limitProject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      {quota.usedSakit} / {quota.limitSakit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      {quota.usedIstimewa} / {quota.limitIstimewa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      {quota.usedKhusus} / {quota.limitKhusus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditModal(quota)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(quota)}
                          className="text-red-600 hover:text-red-900"
                          title="Hapus"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredLeaveQuotas.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Tidak ada data cuti yang ditemukan.
            </p>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full m-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingQuota ? "Edit Kuota Cuti" : "Tambah Kuota Cuti"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nama"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Pegawai
                </label>
                <input
                  type="text"
                  name="nama"
                  id="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="departemen"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Departemen
                </label>
                <select
                  name="departemen"
                  id="departemen"
                  value={formData.departemen}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Pilih Departemen</option>
                  <option value="HRD">HRD</option>
                  <option value="Pengadaan">Pengadaan</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operational">Operational</option>
                  <option value="Gudang">Gudang</option>
                  <option value="QHSE">QHSE</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="nomorSO"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nomor SO
                </label>
                <input
                  type="text"
                  name="nomorSO"
                  id="nomorSO"
                  value={formData.nomorSO}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Contoh: SO-2025-001"
                />
              </div>
              <div>
                <label
                  htmlFor="limitTahunan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Limit Cuti Tahunan (Hari)
                </label>
                <input
                  type="number"
                  name="limitTahunan"
                  id="limitTahunan"
                  value={formData.limitTahunan}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="limitPotong"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Limit Cuti Potong (Hari)
                </label>
                <input
                  type="number"
                  name="limitPotong"
                  id="limitPotong"
                  value={formData.limitPotong}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="limitProject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Limit Cuti Project (Hari)
                </label>
                <input
                  type="number"
                  name="limitProject"
                  id="limitProject"
                  value={formData.limitProject}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="limitSakit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Limit Cuti Sakit (Hari)
                </label>
                <input
                  type="number"
                  name="limitSakit"
                  id="limitSakit"
                  value={formData.limitSakit}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="limitIstimewa"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Limit Cuti Istimewa (Hari)
                </label>
                <input
                  type="number"
                  name="limitIstimewa"
                  id="limitIstimewa"
                  value={formData.limitIstimewa}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="limitKhusus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Limit Cuti Khusus (Hari)
                </label>
                <input
                  type="number"
                  name="limitKhusus"
                  id="limitKhusus"
                  value={formData.limitKhusus}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveForm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-md"
              >
                {editingQuota ? "Simpan Perubahan" : "Tambah Kuota"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Kuota Cuti"
        message={`Apakah Anda yakin ingin menghapus kuota cuti untuk pegawai "${itemToDelete?.nama}" ini?`}
        confirmText="Hapus"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default MasterCutiDashboard;
