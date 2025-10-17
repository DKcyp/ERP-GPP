import React, { useState } from "react";
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal"; // Assuming this component exists

// Interfaces
interface StatusDokumen {
  id: string;
  namaStatus: string;
  keterangan: string;
}

interface AlurDokumen {
  id: string;
  namaAlur: string;
  deskripsi: string;
  statusDokumen: StatusDokumen[];
}

interface AlurDokumenFormData {
  namaAlur: string;
  deskripsi: string;
}

interface StatusDokumenFormData {
  namaStatus: string;
  keterangan: string;
}

const MasterAlurDokumenDashboard: React.FC = () => {
  const [alurDokumenData, setAlurDokumenData] = useState<AlurDokumen[]>([
    {
      id: "1",
      namaAlur: "Pengajuan Proyek Baru",
      deskripsi: "Alur untuk pengajuan proyek baru dari tim marketing",
      statusDokumen: [
        {
          id: "1-1",
          namaStatus: "Draft Pengajuan",
          keterangan: "Dokumen awal disiapkan",
        },
        {
          id: "1-2",
          namaStatus: "Review Manajer",
          keterangan: "Menunggu review dari manajer",
        },
        {
          id: "1-3",
          namaStatus: "Approved",
          keterangan: "Pengajuan disetujui",
        },
        { id: "1-4", namaStatus: "Rejected", keterangan: "Pengajuan ditolak" },
      ],
    },
    {
      id: "2",
      namaAlur: "Proses Produksi",
      deskripsi: "Alur untuk tahapan produksi suatu proyek",
      statusDokumen: [
        {
          id: "2-1",
          namaStatus: "Perencanaan",
          keterangan: "Tahap perencanaan produksi",
        },
        {
          id: "2-2",
          namaStatus: "Pelaksanaan",
          keterangan: "Proses produksi berjalan",
        },
        { id: "2-3", namaStatus: "Selesai", keterangan: "Produksi selesai" },
      ],
    },
  ]);

  const [expandedAlurId, setExpandedAlurId] = useState<string | null>(null);

  // State for Add/Edit Alur Dokumen Modal
  const [isAlurModalOpen, setIsAlurModalOpen] = useState(false);
  const [editingAlur, setEditingAlur] = useState<AlurDokumen | null>(null);
  const [alurFormData, setAlurFormData] = useState<AlurDokumenFormData>({
    namaAlur: "",
    deskripsi: "",
  });

  // State for Add/Edit Status Dokumen Modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<StatusDokumen | null>(
    null
  );
  const [statusFormData, setStatusFormData] = useState<StatusDokumenFormData>({
    namaStatus: "",
    keterangan: "",
  });
  const [parentAlurIdForStatus, setParentAlurIdForStatus] = useState<
    string | null
  >(null);

  // State for Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "alur" | "status";
    id: string;
    parentId?: string;
  } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedAlurId(expandedAlurId === id ? null : id);
  };

  // Alur Dokumen Handlers
  const openAddAlurModal = () => {
    setEditingAlur(null);
    setAlurFormData({ namaAlur: "", deskripsi: "" });
    setIsAlurModalOpen(true);
  };

  const openEditAlurModal = (alur: AlurDokumen) => {
    setEditingAlur(alur);
    setAlurFormData({ namaAlur: alur.namaAlur, deskripsi: alur.deskripsi });
    setIsAlurModalOpen(true);
  };

  const handleAlurFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAlurFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAlur = () => {
    if (editingAlur) {
      setAlurDokumenData((prev) =>
        prev.map((alur) =>
          alur.id === editingAlur.id
            ? {
                ...alur,
                namaAlur: alurFormData.namaAlur,
                deskripsi: alurFormData.deskripsi,
              }
            : alur
        )
      );
    } else {
      const newAlur: AlurDokumen = {
        id: (alurDokumenData.length + 1).toString(),
        namaAlur: alurFormData.namaAlur,
        deskripsi: alurFormData.deskripsi,
        statusDokumen: [],
      };
      setAlurDokumenData((prev) => [...prev, newAlur]);
    }
    setIsAlurModalOpen(false);
  };

  const handleDeleteAlurClick = (alur: AlurDokumen) => {
    setItemToDelete({ type: "alur", id: alur.id });
    setIsDeleteModalOpen(true);
  };

  // Status Dokumen Handlers
  const openAddStatusModal = (alurId: string) => {
    setEditingStatus(null);
    setStatusFormData({ namaStatus: "", keterangan: "" });
    setParentAlurIdForStatus(alurId);
    setIsStatusModalOpen(true);
  };

  const openEditStatusModal = (status: StatusDokumen, parentAlurId: string) => {
    setEditingStatus(status);
    setStatusFormData({
      namaStatus: status.namaStatus,
      keterangan: status.keterangan,
    });
    setParentAlurIdForStatus(parentAlurId);
    setIsStatusModalOpen(true);
  };

  const handleStatusFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStatusFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveStatus = () => {
    if (!parentAlurIdForStatus) return;

    setAlurDokumenData((prevAlurData) =>
      prevAlurData.map((alur) => {
        if (alur.id === parentAlurIdForStatus) {
          if (editingStatus) {
            return {
              ...alur,
              statusDokumen: alur.statusDokumen.map((status) =>
                status.id === editingStatus.id
                  ? {
                      ...status,
                      namaStatus: statusFormData.namaStatus,
                      keterangan: statusFormData.keterangan,
                    }
                  : status
              ),
            };
          } else {
            const newStatus: StatusDokumen = {
              id: `${alur.id}-${alur.statusDokumen.length + 1}`,
              namaStatus: statusFormData.namaStatus,
              keterangan: statusFormData.keterangan,
            };
            return {
              ...alur,
              statusDokumen: [...alur.statusDokumen, newStatus],
            };
          }
        }
        return alur;
      })
    );
    setIsStatusModalOpen(false);
  };

  const handleDeleteStatusClick = (
    status: StatusDokumen,
    parentAlurId: string
  ) => {
    setItemToDelete({ type: "status", id: status.id, parentId: parentAlurId });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "alur") {
      setAlurDokumenData((prev) =>
        prev.filter((alur) => alur.id !== itemToDelete.id)
      );
    } else if (itemToDelete.type === "status" && itemToDelete.parentId) {
      setAlurDokumenData((prevAlurData) =>
        prevAlurData.map((alur) =>
          alur.id === itemToDelete.parentId
            ? {
                ...alur,
                statusDokumen: alur.statusDokumen.filter(
                  (status) => status.id !== itemToDelete.id
                ),
              }
            : alur
        )
      );
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MASTER ALUR DOKUMEN
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Operational
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Master Alur Dokumen
                </span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Add Alur Dokumen Button */}
        <div className="flex justify-end">
          <button
            onClick={openAddAlurModal}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Tambah Alur Dokumen</span>
          </button>
        </div>

        {/* Alur Dokumen Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Alur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alurDokumenData.map((alur) => (
                  <React.Fragment key={alur.id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleExpand(alur.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {expandedAlurId === alur.id ? (
                            <ChevronDown className="h-4 w-4 mr-2" />
                          ) : (
                            <ChevronRight className="h-4 w-4 mr-2" />
                          )}
                          {alur.namaAlur}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {alur.deskripsi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditAlurModal(alur);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Alur Dokumen"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAlurClick(alur);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Hapus Alur Dokumen"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedAlurId === alur.id && (
                      <tr>
                        <td colSpan={3} className="p-0">
                          <div className="bg-gray-50 p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-semibold text-gray-800">
                                Status Dokumen untuk "{alur.namaAlur}"
                              </h4>
                              <button
                                onClick={() => openAddStatusModal(alur.id)}
                                className="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors shadow-sm"
                              >
                                <Plus className="h-4 w-4" />
                                <span>Tambah Status Dokumen</span>
                              </button>
                            </div>
                            {alur.statusDokumen.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                                  <thead className="bg-white">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama Status
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Keterangan
                                      </th>
                                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-100">
                                    {alur.statusDokumen.map((status) => (
                                      <tr
                                        key={status.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {status.namaStatus}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                          {status.keterangan}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                          <div className="flex items-center justify-center space-x-2">
                                            <button
                                              onClick={() =>
                                                openEditStatusModal(
                                                  status,
                                                  alur.id
                                                )
                                              }
                                              className="text-blue-600 hover:text-blue-900"
                                              title="Edit Status Dokumen"
                                            >
                                              <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleDeleteStatusClick(
                                                  status,
                                                  alur.id
                                                )
                                              }
                                              className="text-red-600 hover:text-red-900"
                                              title="Hapus Status Dokumen"
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
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-4">
                                Belum ada status dokumen untuk alur ini.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alur Dokumen Modal */}
      {isAlurModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full m-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingAlur ? "Edit Alur Dokumen" : "Tambah Alur Dokumen"}
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="namaAlur"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Alur
                </label>
                <input
                  type="text"
                  name="namaAlur"
                  id="namaAlur"
                  value={alurFormData.namaAlur}
                  onChange={handleAlurFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="deskripsi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi"
                  id="deskripsi"
                  rows={3}
                  value={alurFormData.deskripsi}
                  onChange={handleAlurFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsAlurModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveAlur}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-md"
              >
                {editingAlur ? "Simpan Perubahan" : "Tambah Alur"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Dokumen Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full m-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingStatus ? "Edit Status Dokumen" : "Tambah Status Dokumen"}
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="namaStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Status
                </label>
                <input
                  type="text"
                  name="namaStatus"
                  id="namaStatus"
                  value={statusFormData.namaStatus}
                  onChange={handleStatusFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="keterangan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  id="keterangan"
                  rows={3}
                  value={statusFormData.keterangan}
                  onChange={handleStatusFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-md"
              >
                {editingStatus ? "Simpan Perubahan" : "Tambah Status"}
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
        title={`Hapus ${
          itemToDelete?.type === "alur" ? "Alur Dokumen" : "Status Dokumen"
        }`}
        message={`Apakah Anda yakin ingin menghapus ${
          itemToDelete?.type === "alur" ? "alur dokumen" : "status dokumen"
        } "${
          itemToDelete?.type === "alur"
            ? alurDokumenData.find((a) => a.id === itemToDelete.id)?.namaAlur
            : alurDokumenData
                .find((a) => a.id === itemToDelete?.parentId)
                ?.statusDokumen.find((s) => s.id === itemToDelete.id)
                ?.namaStatus
        }" ini?`}
        confirmText="Hapus"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default MasterAlurDokumenDashboard;
