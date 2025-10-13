import React, { useState } from "react";
import {
  Clock,
  Search,
  Plus,
  FileText,
  FileBarChart,
  FileSpreadsheet,
  FileUp,
  Eye,
  Edit,
  Trash2,
  Printer,
  CalendarDays,
} from "lucide-react";
import EntryStockOpnameModal from "./EntryStockOpnameModal"; // Import the new modal
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface StockOpnameItem {
  no: number;
  periodeTahun: number;
  periodeBulan: string;
  gudang: string;
  tanggalOpname: string;
  waktuOpname: string;
  jumlahItem: number;
  status: string;
  namaPegawai: string;
}

const StockOpnameDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "detail">("add");
  const [selectedItem, setSelectedItem] = useState<StockOpnameItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<StockOpnameItem | null>(null);

  const [stockOpnameItems, setStockOpnameItems] = useState<StockOpnameItem[]>([
    {
      no: 1,
      periodeTahun: 2025,
      periodeBulan: "Maret",
      gudang: "Gudang Proyek MEDCO",
      tanggalOpname: "10-03-2025",
      waktuOpname: "13:00:21",
      jumlahItem: 120,
      status: "Selesai",
      namaPegawai: "Budi Santoso",
    },
    {
      no: 2,
      periodeTahun: 2025,
      periodeBulan: "Februari",
      gudang: "Gudang Proyek SSB",
      tanggalOpname: "10-02-2025",
      waktuOpname: "13:00:00",
      jumlahItem: 120,
      status: "Proses",
      namaPegawai: "Siti Aminah",
    },
  ]);

  // Handler untuk tombol Detail
  const handleDetail = (item: StockOpnameItem) => {
    setSelectedItem(item);
    setModalMode("detail");
    setIsModalOpen(true);
  };

  // Handler untuk tombol Edit
  const handleEdit = (item: StockOpnameItem) => {
    setSelectedItem(item);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Handler untuk tombol Hapus
  const handleDelete = (item: StockOpnameItem) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  // Konfirmasi hapus
  const confirmDelete = () => {
    if (itemToDelete) {
      setStockOpnameItems(stockOpnameItems.filter((item) => item.no !== itemToDelete.no));
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  // Handler untuk tombol Tambah
  const handleAdd = () => {
    setSelectedItem(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalMode("add");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Selesai":
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Selesai
          </span>
        );
      case "Proses":
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Proses
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            -
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                STOCK OPNAME
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Gudang
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Stock Opname
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Stock Opname</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="relative">
              <label
                htmlFor="namaGudang"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cari Nama Gudang
              </label>
              <input
                type="text"
                id="namaGudang"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Gudang Proyek A"
              />
              <Search className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pilih Status
              </label>
              <select
                id="status"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>--Pilih Status--</option>
                <option>Selesai</option>
                <option>Proses</option>
              </select>
            </div>
            <div className="flex justify-end items-end">
              <button
                onClick={handleAdd}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Periode and Search Button */}
          <div className="flex items-end space-x-4 mb-6">
            <div className="relative flex-1">
              <label
                htmlFor="periodeStart"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Periode
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative w-1/2">
                  <input
                    type="date"
                    id="periodeStart"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    defaultValue="2025-03-03"
                  />
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                <span className="text-gray-500">s.d</span>
                <div className="relative w-1/2">
                  <input
                    type="date"
                    id="periodeEnd"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    defaultValue="2025-03-03"
                  />
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md">
              Search
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end items-center mb-6 space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md">
              <FileUp className="h-4 w-4" />
              <span>Template Import</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm shadow-md">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md">
              <FileText className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm shadow-md">
              <FileBarChart className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Show</span>
                <select className="border border-gray-300 rounded-md px-2 py-1">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span>entries</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search:"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode Tahun
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode Bulan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gudang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Pegawai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Opname
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waktu Opname
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockOpnameItems.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.periodeTahun}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.periodeBulan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.gudang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.namaPegawai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.tanggalOpname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.waktuOpname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.jumlahItem}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                      <button 
                        onClick={() => handleDetail(item)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Detail"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-800 transition-colors" title="Print">
                        <Printer className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing 1 to {stockOpnameItems.length} of{" "}
              {stockOpnameItems.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm">
                Previous
              </button>
              <button className="px-4 py-2 border border-blue-500 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500 flex justify-between items-center">
        <span>2023 © Mazer</span>
        <span>
          Crafted with <span className="text-red-500">❤️</span> by Saugi
        </span>
      </footer>

      <EntryStockOpnameModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        selectedItem={selectedItem}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && itemToDelete && (
        <ConfirmDeleteModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          itemName={`Stock Opname ${itemToDelete.gudang} - ${itemToDelete.periodeBulan} ${itemToDelete.periodeTahun}`}
        />
      )}
    </div>
  );
};

export default StockOpnameDashboard;
