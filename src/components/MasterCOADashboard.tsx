import React, { useState } from 'react';
import { Clock, Search, PlusCircle, Edit, Trash2, Download } from 'lucide-react';

interface COAItem {
  id: string;
  kodeCOA: string;
  namaCOA: string;
  kategori: string;
}

const MasterCOADashboard: React.FC = () => {
  const today = new Date();

  const dummyData: COAItem[] = [
    { id: '1', kodeCOA: '1101', namaCOA: 'Kas Besar', kategori: 'Aset Lancar' },
    { id: '2', kodeCOA: '1102', namaCOA: 'Kas Kecil', kategori: 'Aset Lancar' },
    { id: '3', kodeCOA: '1110', namaCOA: 'Bank BCA', kategori: 'Aset Lancar' },
    { id: '4', kodeCOA: '1111', namaCOA: 'Bank Mandiri', kategori: 'Aset Lancar' },
    { id: '5', kodeCOA: '1201', namaCOA: 'Piutang Usaha', kategori: 'Aset Lancar' },
    { id: '6', kodeCOA: '1301', namaCOA: 'Persediaan Barang Dagang', kategori: 'Aset Lancar' },
    { id: '7', kodeCOA: '2101', namaCOA: 'Utang Usaha', kategori: 'Liabilitas Jangka Pendek' },
    { id: '8', kodeCOA: '2102', namaCOA: 'Utang Gaji', kategori: 'Liabilitas Jangka Pendek' },
    { id: '9', kodeCOA: '3101', namaCOA: 'Modal Disetor', kategori: 'Ekuitas' },
    { id: '10', kodeCOA: '4101', namaCOA: 'Pendapatan Penjualan', kategori: 'Pendapatan' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}, Kategori: ${filterKategori}`);
    // Implement actual search logic here
  };

  const handleAdd = () => {
    alert('Tambah COA');
    // Implement add logic here
  };

  const handleEdit = (id: string) => {
    alert(`Edit COA: ${id}`);
    // Implement edit logic here
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete COA ${id}?`)) {
      alert(`Delete COA: ${id}`);
      // Implement delete logic here
    }
  };

  const handleExport = (type: string) => {
    alert(`Exporting as ${type}`);
    // Implement export logic here
  };

  const filteredData = dummyData.filter(item => {
    const matchesSearch = item.kodeCOA.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.namaCOA.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKategori = filterKategori === '' || item.kategori === filterKategori;
    return matchesSearch && matchesKategori;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MASTER COA
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master COA</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">Cari Kode/Nama COA</label>
              <div className="relative">
                <input
                  type="text"
                  id="searchQuery"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Cari kode atau nama COA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="filterKategori" className="block text-sm font-medium text-gray-700 mb-2">Filter Kategori</label>
              <div className="relative">
                <select
                  id="filterKategori"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  <option value="Aset Lancar">Aset Lancar</option>
                  <option value="Liabilitas Jangka Pendek">Liabilitas Jangka Pendek</option>
                  <option value="Ekuitas">Ekuitas</option>
                  <option value="Pendapatan">Pendapatan</option>
                  {/* Add more categories as needed */}
                </select>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-180" /> {/* Chevron down */}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah COA
            </button>
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleExport('Excel')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> PDF
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode COA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama COA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((coa) => (
                  <tr key={coa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {coa.kodeCOA}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coa.namaCOA}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coa.kategori}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(coa.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coa.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
        </div>
      </div>
    </div>
  );
};

export default MasterCOADashboard;
