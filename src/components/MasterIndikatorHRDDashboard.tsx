import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import IndikatorTambahModal from './IndikatorTambahModal'; // Import the new modal component

// Dummy data for the table
const dummyIndikatorData = [
  { id: 1, departemen: 'Finance', atasan: 'Staff Finance' },
  { id: 2, departemen: 'Marketing', atasan: 'Staff Marketing' },
  { id: 3, departemen: 'HRD', atasan: 'HR Manager' },
  { id: 4, departemen: 'Operational', atasan: 'Operational Lead' },
  { id: 5, departemen: 'IT', atasan: 'IT Manager' },
];

const MasterIndikatorHRDDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredData = dummyIndikatorData.filter(item =>
    item.departemen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.atasan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Master Indikator</h1>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            {/* Show entries dropdown */}
            <div className="flex items-center space-x-2">
              <label htmlFor="showEntries" className="text-gray-700">Show</label>
              <select
                id="showEntries"
                className="px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-gray-700">entries</span>
            </div>

            {/* Search and Tambah button */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={handleOpenModal}
                className="w-full md:w-auto px-6 py-2 bg-cyan-500 text-white font-medium rounded-xl shadow-md hover:bg-cyan-600 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      No
                      <div className="ml-1 flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronDown className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Departemen
                      <div className="ml-1 flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronDown className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Atasan
                      <div className="ml-1 flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronDown className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Aksi
                      <div className="ml-1 flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        <ChevronDown className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEntries.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {indexOfFirstEntry + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.departemen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.atasan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200 shadow-md">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No entries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredData.length)} of {filteredData.length} entries
            </div>
            <nav className="flex space-x-2" aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors duration-300 ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Indikator Tambah Modal */}
      <IndikatorTambahModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MasterIndikatorHRDDashboard;
