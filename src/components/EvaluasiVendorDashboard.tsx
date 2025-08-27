import React, { useState } from 'react';
import { Search, Plus, FileSpreadsheet, FileText, FileDown, CalendarDays } from 'lucide-react';
import EvaluasiVendorModal from './EvaluasiVendorModal';
import { EvaluasiVendorData, EvaluasiVendorFormData } from '../types';

const EvaluasiVendorDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('03/03/2025');
  const [endDate, setEndDate] = useState('03/03/2025');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [evaluations, setEvaluations] = useState<EvaluasiVendorData[]>([
    { id: '1', no: 1, namaVendor: 'Vendor A', onTime: 'Ya', sesuaiSpesifikasi: 'Tidak', jumlahBarangSesuaiPO: 95, tanggalEvaluasi: '20/02/2025' },
    { id: '2', no: 2, namaVendor: 'Vendor B', onTime: 'Tidak', sesuaiSpesifikasi: 'Ya', jumlahBarangSesuaiPO: 100, tanggalEvaluasi: '19/02/2025' },
    { id: '3', no: 3, namaVendor: 'Vendor C', onTime: 'Ya', sesuaiSpesifikasi: 'Ya', jumlahBarangSesuaiPO: 80, tanggalEvaluasi: '21/02/2025' },
    { id: '4', no: 4, namaVendor: 'Vendor D', onTime: 'Ya', sesuaiSpesifikasi: 'Tidak', jumlahBarangSesuaiPO: 110, tanggalEvaluasi: '22/02/2025' },
    { id: '5', no: 5, namaVendor: 'Vendor E', onTime: 'Tidak', sesuaiSpesifikasi: 'Ya', jumlahBarangSesuaiPO: 90, tanggalEvaluasi: '23/02/2025' },
    { id: '6', no: 6, namaVendor: 'Vendor F', onTime: 'Ya', sesuaiSpesifikasi: 'Ya', jumlahBarangSesuaiPO: 105, tanggalEvaluasi: '24/02/2025' },
    { id: '7', no: 7, namaVendor: 'Vendor G', onTime: 'Tidak', sesuaiSpesifikasi: 'Tidak', jumlahBarangSesuaiPO: 75, tanggalEvaluasi: '25/02/2025' },
    { id: '8', no: 8, namaVendor: 'Vendor H', onTime: 'Ya', sesuaiSpesifikasi: 'Ya', jumlahBarangSesuaiPO: 120, tanggalEvaluasi: '26/02/2025' },
    { id: '9', no: 9, namaVendor: 'Vendor I', onTime: 'Ya', sesuaiSpesifikasi: 'Tidak', jumlahBarangSesuaiPO: 88, tanggalEvaluasi: '27/02/2025' },
    { id: '10', no: 10, namaVendor: 'Vendor J', onTime: 'Tidak', sesuaiSpesifikasi: 'Ya', jumlahBarangSesuaiPO: 98, tanggalEvaluasi: '28/02/2025' },
    { id: '11', no: 11, namaVendor: 'Vendor K', onTime: 'Ya', sesuaiSpesifikasi: 'Ya', jumlahBarangSesuaiPO: 115, tanggalEvaluasi: '01/03/2025' },
    { id: '12', no: 12, namaVendor: 'Vendor L', onTime: 'Tidak', sesuaiSpesifikasi: 'Tidak', jumlahBarangSesuaiPO: 82, tanggalEvaluasi: '02/03/2025' },
  ]);

  const filteredEvaluations = evaluations.filter(evalItem =>
    evalItem.namaVendor.toLowerCase().includes(searchTerm.toLowerCase())
    // Add date range filtering logic here if needed
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvaluations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleAddEvaluation = (formData: EvaluasiVendorFormData) => {
    const newId = (evaluations.length + 1).toString();
    const newEvaluation: EvaluasiVendorData = {
      id: newId,
      no: evaluations.length + 1,
      namaVendor: formData.namaVendor,
      onTime: formData.barangOnTime,
      sesuaiSpesifikasi: formData.sesuaiSpesifikasi,
      jumlahBarangSesuaiPO: parseInt(formData.jumlahBarangSesuaiPO),
      tanggalEvaluasi: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    };
    setEvaluations((prev) => [...prev, newEvaluation]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu Evaluasi Kerja Vendor</h1>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
          <div className="md:col-span-1">
            <label htmlFor="searchVendor" className="block text-sm font-medium text-gray-700 mb-1">
              Cari Nama Vendor
            </label>
            <div className="relative">
              <input
                type="text"
                id="searchVendor"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="PT Maju Jaya"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col md:flex-row items-end md:items-center gap-4">
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Periode
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text" // Changed to text for custom date format display
                    id="startDate"
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <span className="text-gray-500">s.d</span>
                <div className="relative flex-1">
                  <input
                    type="text" // Changed to text for custom date format display
                    id="endDate"
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Plus size={18} className="mr-2" /> Tambah
          </button>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              <FileSpreadsheet size={18} className="mr-2" /> Export Excel
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <FileText size={18} className="mr-2" /> Export CSV
            </button>
            <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              <FileDown size={18} className="mr-2" /> Export PDF
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>entries</span>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Vendor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sesuai Spesifikasi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Barang Sesuai PO
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Evaluasi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.no}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.namaVendor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.onTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.sesuaiSpesifikasi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.jumlahBarangSesuaiPO}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.tanggalEvaluasi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEvaluations.length)} of {filteredEvaluations.length} entries
          </div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      <EvaluasiVendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvaluation}
      />
    </div>
  );
};

export default EvaluasiVendorDashboard;
