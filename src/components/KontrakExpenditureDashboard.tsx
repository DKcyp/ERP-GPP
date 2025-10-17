import React, { useState, useEffect } from "react";
import {
  Clock,
  Search,
  Plus,
  Download,
  FileText,
  Edit,
  Trash,
} from "lucide-react";
import KontrakExpenditureModal from "./KontrakExpenditureModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface KontrakExpenditureItem {
  id: string;
  noSO: string;
  noKontrak: string;
  jenisPekerjaan: string;
  client: string;
  periodeDari: string;
  periodeSampai: string;
}

const KontrakExpenditureDashboard: React.FC = () => {
  const [searchTermSO, setSearchTermSO] = useState("");
  const [searchTermKontrak, setSearchTermKontrak] = useState("");
  const [selectedJenisPekerjaan, setSelectedJenisPekerjaan] = useState("");
  const [searchTermClient, setSearchTermClient] = useState("");
  const [periodeDari, setPeriodeDari] = useState("");
  const [periodeSampai, setPeriodeSampai] = useState("");
  const [data, setData] = useState<KontrakExpenditureItem[]>([
    {
      id: "1",
      noSO: "SO-001",
      noKontrak: "KTR-001",
      jenisPekerjaan: "Konstruksi",
      client: "PT ABC",
      periodeDari: "2023-01-01",
      periodeSampai: "2023-12-31",
    },
    {
      id: "2",
      noSO: "SO-002",
      noKontrak: "KTR-002",
      jenisPekerjaan: "Manufaktur",
      client: "PT DEF",
      periodeDari: "2023-02-01",
      periodeSampai: "2024-01-31",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<KontrakExpenditureItem | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);

  const handleAddEdit = (item: KontrakExpenditureItem) => {
    if (itemToEdit) {
      setData(data.map((d) => (d.id === item.id ? item : d)));
    } else {
      setData([...data, { ...item, id: `new-${Date.now()}` }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (itemToDeleteId) {
      setData(data.filter((d) => d.id !== itemToDeleteId));
      setIsDeleteModalOpen(false);
      setItemToDeleteId(null);
    }
  };

  const openAddModal = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: KontrakExpenditureItem) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setItemToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setItemToEdit(null);
    setItemToDeleteId(null);
  };

  const filteredData = data.filter((item) => {
    return (
      item.noSO.toLowerCase().includes(searchTermSO.toLowerCase()) &&
      item.noKontrak.toLowerCase().includes(searchTermKontrak.toLowerCase()) &&
      (selectedJenisPekerjaan === "" ||
        item.jenisPekerjaan === selectedJenisPekerjaan) &&
      item.client.toLowerCase().includes(searchTermClient.toLowerCase())
      // Add date filtering logic here if needed
    );
  });

  const jenisPekerjaanOptions = ["Konstruksi", "Manufaktur", "Jasa"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Kontrak Expenditure
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Procon
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">
                  Kontrak Expenditure
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
        {/* Filter Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Cari No SO */}
            <div>
              <label
                htmlFor="search-so"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cari No SO
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search-so"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cari No SO..."
                  value={searchTermSO}
                  onChange={(e) => setSearchTermSO(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Cari Nomor Kontrak */}
            <div>
              <label
                htmlFor="search-kontrak"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cari Nomor Kontrak
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search-kontrak"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cari Nomor Kontrak..."
                  value={searchTermKontrak}
                  onChange={(e) => setSearchTermKontrak(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Pilih Jenis Pekerjaan */}
            <div>
              <label
                htmlFor="jenis-pekerjaan"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pilih Jenis Pekerjaan
              </label>
              <select
                id="jenis-pekerjaan"
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={selectedJenisPekerjaan}
                onChange={(e) => setSelectedJenisPekerjaan(e.target.value)}
              >
                <option value="">Pilih jenis pekerjaan...</option>
                {jenisPekerjaanOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Cari Client */}
            <div>
              <label
                htmlFor="search-client"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cari Client
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search-client"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cari Client..."
                  value={searchTermClient}
                  onChange={(e) => setSearchTermClient(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Periode Dari */}
            <div>
              <label
                htmlFor="periode-dari"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Periode Dari
              </label>
              <input
                type="date"
                id="periode-dari"
                className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={periodeDari}
                onChange={(e) => setPeriodeDari(e.target.value)}
              />
            </div>

            {/* Periode Sampai */}
            <div>
              <label
                htmlFor="periode-sampai"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Periode Sampai
              </label>
              <input
                type="date"
                id="periode-sampai"
                className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={periodeSampai}
                onChange={(e) => setPeriodeSampai(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Search className="w-4 h-4 mr-2" />
              Cari
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mb-6">
          <button
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Kontrak
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </button>
          <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Data Kontrak Expenditure
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No SO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No Kontrak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis Pekerjaan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode Dari
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode Sampai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.noSO}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.noKontrak}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.jenisPekerjaan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.periodeDari}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.periodeSampai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(item.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <Trash className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <KontrakExpenditureModal
        isOpen={isModalOpen}
        onClose={closeModals}
        onSave={handleAddEdit}
        itemToEdit={itemToEdit}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus item ini?"
      />
    </div>
  );
};

export default KontrakExpenditureDashboard;
