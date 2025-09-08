import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  FileDown,
  Clock,
} from "lucide-react";
import EntryPajakKeluaranModal from "./EntryPajakKeluaranModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface PajakKeluaranData {
  id: number;
  namaProject: string;
  tanggal: string;
  customer: string;
  ppn: string;
  nilaiProject: number;
}

const initialDummyData: PajakKeluaranData[] = [
  {
    id: 1,
    namaProject: "Pengembangan Aplikasi Mobile",
    tanggal: "2024-01-20",
    customer: "PT Global Solusi",
    ppn: "11%",
    nilaiProject: 30000000,
  },
  {
    id: 2,
    namaProject: "Implementasi Sistem ERP",
    tanggal: "2024-02-10",
    customer: "CV Usaha Bersama",
    ppn: "11%",
    nilaiProject: 50000000,
  },
  {
    id: 3,
    namaProject: "Desain Ulang Website",
    tanggal: "2024-02-28",
    customer: "UD Kreatif Digital",
    ppn: "11%",
    nilaiProject: 10000000,
  },
  {
    id: 4,
    namaProject: "Maintenance Jaringan",
    tanggal: "2024-03-15",
    customer: "PT Infrastruktur",
    ppn: "11%",
    nilaiProject: 8000000,
  },
  {
    id: 5,
    namaProject: "Penyediaan Jasa Cloud",
    tanggal: "2024-03-30",
    customer: "Koperasi Maju",
    ppn: "11%",
    nilaiProject: 18000000,
  },
  {
    id: 6,
    namaProject: "Pelatihan Karyawan",
    tanggal: "2024-04-10",
    customer: "PT Sumber Daya",
    ppn: "11%",
    nilaiProject: 7000000,
  },
  {
    id: 7,
    namaProject: "Audit Keuangan Tahunan",
    tanggal: "2024-04-25",
    customer: "Firma Akuntan",
    ppn: "11%",
    nilaiProject: 15000000,
  },
  {
    id: 8,
    namaProject: "Pengadaan Hardware Server",
    tanggal: "2024-05-05",
    customer: "PT Data Center",
    ppn: "11%",
    nilaiProject: 40000000,
  },
  {
    id: 9,
    namaProject: "Jasa Pemasangan CCTV",
    tanggal: "2024-05-12",
    customer: "Rumah Sakit Sehat",
    ppn: "11%",
    nilaiProject: 9000000,
  },
  {
    id: 10,
    namaProject: "Konsultasi Hukum Bisnis",
    tanggal: "2024-05-28",
    customer: "Kantor Hukum Adil",
    ppn: "11%",
    nilaiProject: 11000000,
  },
];

const PajakKeluaranDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<PajakKeluaranData[]>(initialDummyData);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<PajakKeluaranData | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState<PajakKeluaranData | null>(
    null
  );

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.namaProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAddClick = () => {
    setItemToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditClick = (item: PajakKeluaranData) => {
    setItemToEdit(item);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteClick = (item: PajakKeluaranData) => {
    setItemToDelete(item);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleSaveItem = (newItem: PajakKeluaranData) => {
    if (itemToEdit) {
      // Update existing item
      setData(data.map((item) => (item.id === newItem.id ? newItem : item)));
    } else {
      // Add new item
      setData([...data, { ...newItem, id: Date.now() }]); // Ensure unique ID for new items
    }
    setIsAddEditModalOpen(false);
    setItemToEdit(null);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setData(data.filter((item) => item.id !== itemToDelete.id));
      setIsConfirmDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Pajak Keluaran
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Tax
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Pajak Keluaran
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari project atau customer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handleAddClick}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama Project
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tanggal
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    PPN
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nilai Project
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.namaProject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.tanggal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.ppn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(item.nilaiProject)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150 p-1 rounded-full hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-150 p-1 rounded-full hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Tidak ada data Pajak Keluaran yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EntryPajakKeluaranModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaProject || ""}
        message="Apakah Anda yakin ingin menghapus data Pajak Keluaran ini?"
      />
    </div>
  );
};

export default PajakKeluaranDashboard;
