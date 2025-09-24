import React, { useState } from "react";
import {
  Clock,
  Search,
  Plus,
  FileText,
  FileBarChart,
  FileSpreadsheet,
  Edit,
  Trash2,
} from "lucide-react";
import TambahSatuanBarangModal from "./TambahSatuanBarangModal";

interface SatuanBarang {
  no: number;
  nama: string;
  deskripsi: string;
  satuanDasar: string;
  satuanKonversi: string;
  faktorKonversi: number;
}

const SatuanBarangDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [satuanBarang, setSatuanBarang] = useState<SatuanBarang[]>([
    {
      no: 1,
      nama: "KG",
      deskripsi: "Kilogram",
      satuanDasar: "G",
      satuanKonversi: "KG",
      faktorKonversi: 1000,
    },
    {
      no: 2,
      nama: "G",
      deskripsi: "Gram",
      satuanDasar: "G",
      satuanKonversi: "G",
      faktorKonversi: 1,
    },
    {
      no: 3,
      nama: "Kardus",
      deskripsi: "Kardus/Box",
      satuanDasar: "Pcs",
      satuanKonversi: "Kardus",
      faktorKonversi: 12,
    },
    {
      no: 4,
      nama: "Lusin",
      deskripsi: "Lusin",
      satuanDasar: "Pcs",
      satuanKonversi: "Lusin",
      faktorKonversi: 12,
    },
    {
      no: 5,
      nama: "Pcs",
      deskripsi: "Pieces/Buah",
      satuanDasar: "Pcs",
      satuanKonversi: "Pcs",
      faktorKonversi: 1,
    },
    {
      no: 6,
      nama: "Pack",
      deskripsi: "Pack/Kemasan",
      satuanDasar: "Pcs",
      satuanKonversi: "Pack",
      faktorKonversi: 6,
    },
    {
      no: 7,
      nama: "L",
      deskripsi: "Liter",
      satuanDasar: "ML",
      satuanKonversi: "L",
      faktorKonversi: 1000,
    },
    {
      no: 8,
      nama: "ML",
      deskripsi: "Mililiter",
      satuanDasar: "ML",
      satuanKonversi: "ML",
      faktorKonversi: 1,
    },
    {
      no: 9,
      nama: "M",
      deskripsi: "Meter",
      satuanDasar: "CM",
      satuanKonversi: "M",
      faktorKonversi: 100,
    },
    {
      no: 10,
      nama: "CM",
      deskripsi: "Centimeter",
      satuanDasar: "CM",
      satuanKonversi: "CM",
      faktorKonversi: 1,
    },
    {
      no: 11,
      nama: "Roll",
      deskripsi: "Roll/Gulungan",
      satuanDasar: "M",
      satuanKonversi: "Roll",
      faktorKonversi: 50,
    },
    {
      no: 12,
      nama: "Rim",
      deskripsi: "Rim Kertas",
      satuanDasar: "Lembar",
      satuanKonversi: "Rim",
      faktorKonversi: 500,
    },
  ]);
  const [editingUnit, setEditingUnit] = useState<SatuanBarang | null>(null); // New state for editing unit

  const handleOpenModal = () => {
    setEditingUnit(null); // Reset for new entry
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveSatuan = (
    nama: string,
    deskripsi: string,
    satuanDasar: string,
    satuanKonversi: string,
    faktorKonversi: number
  ) => {
    if (editingUnit) {
      // Update existing unit
      setSatuanBarang((prev) =>
        prev.map((s) =>
          s.no === editingUnit.no
            ? {
                ...s,
                nama,
                deskripsi,
                satuanDasar,
                satuanKonversi,
                faktorKonversi,
              }
            : s
        )
      );
    } else {
      // Add new unit
      const newNo =
        satuanBarang.length > 0
          ? Math.max(...satuanBarang.map((s) => s.no)) + 1
          : 1;
      setSatuanBarang((prev) => [
        ...prev,
        {
          no: newNo,
          nama,
          deskripsi,
          satuanDasar,
          satuanKonversi,
          faktorKonversi,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSatuan = (no: number) => {
    setSatuanBarang((prev) => prev.filter((s) => s.no !== no));
  };

  const handleEditClick = (unit: SatuanBarang) => {
    setEditingUnit(unit);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                SATUAN BARANG
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Gudang
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Barang
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Satuan Barang</span>
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
          {/* Filter and Add Button Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Cari Nama Satuan"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Cari Nama Deskripsi"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-md"
            >
              <Plus className="h-5 w-5" />
              <span>Satuan Barang</span>
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end space-x-3 mb-6">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm">
              <FileText className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm">
              <FileBarChart className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Satuan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satuan Dasar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satuan Konversi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faktor Konversi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {satuanBarang.map((unit) => (
                  <tr
                    key={unit.no}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold text-blue-600">
                        {unit.nama}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.deskripsi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.satuanDasar}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.satuanKonversi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.faktorKonversi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditClick(unit)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSatuan(unit.no)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
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

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing 1 to {satuanBarang.length} of {satuanBarang.length}{" "}
              entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Previous
              </button>
              <button className="px-4 py-2 border border-blue-500 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <TambahSatuanBarangModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSatuan}
        editingUnit={editingUnit}
      />
    </div>
  );
};

export default SatuanBarangDashboard;
