import React, { useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface IncomeEntry {
  id: string;
  no: number;
  namaIncome: string;
}

const MasterIncomeDashboard: React.FC = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<IncomeEntry | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IncomeEntry | null>(null);
  const [formData, setFormData] = useState({ namaIncome: "" });

  const [data, setData] = useState<IncomeEntry[]>([
    { id: "1", no: 1, namaIncome: "Gaji Pokok" },
    { id: "2", no: 2, namaIncome: "Tunjangan Jabatan" },
    { id: "3", no: 3, namaIncome: "Tunjangan Transport" },
    { id: "4", no: 4, namaIncome: "Bonus Kinerja" },
    { id: "5", no: 5, namaIncome: "Tunjangan Makan" },
  ]);

  const handleOpenAdd = () => {
    setFormData({ namaIncome: "" });
    setEditing(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: IncomeEntry) => {
    setFormData({ namaIncome: row.namaIncome });
    setEditing(row);
    setIsModalOpen(true);
  };

  const filtered = data.filter(item => {
    const q = searchQuery.toLowerCase();
    return q === "" || item.namaIncome.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = filtered.slice(startIndex, endIndex);

  const handleSave = () => {
    if (!formData.namaIncome.trim()) return;

    if (editing) {
      setData(prev => prev.map(r => r.id === editing.id ? { ...r, namaIncome: formData.namaIncome } : r));
    } else {
      const newId = (Math.max(...data.map(d => parseInt(d.id))) + 1).toString();
      const newRow: IncomeEntry = {
        id: newId,
        no: data.length + 1,
        namaIncome: formData.namaIncome
      };
      setData(prev => [...prev, newRow]);
    }
    setIsModalOpen(false);
    setEditing(null);
    setFormData({ namaIncome: "" });
  };

  const requestDelete = (row: IncomeEntry) => {
    setItemToDelete(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(prev => prev.filter(r => r.id !== itemToDelete.id).map((r, i) => ({ ...r, no: i + 1 })));
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Master Income</h1>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Header with Add Button and Search */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari nama income..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Income</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaIncome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleOpenEdit(row)} className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => requestDelete(row)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} entries</div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">{currentPage}</button>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
            </nav>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editing ? "Edit Income" : "Tambah Income"}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Income
                </label>
                <input
                  type="text"
                  value={formData.namaIncome}
                  onChange={(e) => setFormData({ namaIncome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama income"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditing(null);
                    setFormData({ namaIncome: "" });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={itemToDelete?.namaIncome} />
    </div>
  );
};

export default MasterIncomeDashboard;
