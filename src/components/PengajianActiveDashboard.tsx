import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, ChevronDown, Search, FileText, FileDown, Printer, Plus, Eye, Edit, Trash2, CheckCircle } from 'lucide-react'; // Add CheckCircle

interface PenggajianEntry {
  no: number;
  kodePegawai: string;
  namaPegawai: string;
  jenisPegawai: string;
  tanggal: string;
  gaji: string;
  keterangan: string;
}

interface PengajianActiveDashboardProps {
  role?: string; // Add role prop
}

const PengajianActiveDashboard: React.FC<PengajianActiveDashboardProps> = ({ role }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const penggajianData: PenggajianEntry[] = [
    { no: 1, kodePegawai: 'EMP001', namaPegawai: 'Ahmad Fauzi', jenisPegawai: 'Tetap', tanggal: '2024-09-05', gaji: 'Rp 7.500.000', keterangan: 'Bonus' },
    { no: 2, kodePegawai: 'EMP002', namaPegawai: 'Siti Nurhaliza', jenisPegawai: 'Kontrak', tanggal: '2024-09-04', gaji: 'Rp 5.500.000', keterangan: 'Tunjangan' },
    { no: 3, kodePegawai: 'EMP003', namaPegawai: 'Budi Santoso', jenisPegawai: 'Magang', tanggal: '2024-09-03', gaji: 'Rp 2.000.000', keterangan: 'Penggajian Honorer' },
    { no: 4, kodePegawai: 'EMP004', namaPegawai: 'Dewi Lestari', jenisPegawai: 'Tetap', tanggal: '2024-09-02', gaji: 'Rp 8.000.000', keterangan: 'Cuti' },
    { no: 5, kodePegawai: 'EMP005', namaPegawai: 'Rizki Pratama', jenisPegawai: 'Kontrak', tanggal: '2024-09-01', gaji: 'Rp 6.200.000', keterangan: 'Tunjangan' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Penggajian</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Periode Filter */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Periode</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="tanggal-awal" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Awal</label>
                  <div className="relative">
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="dd/mm/yyyy"
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="tanggal-akhir" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
                  <div className="relative">
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => setEndDate(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="dd/mm/yyyy"
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Pegawai */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Pegawai</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="kode-pegawai" className="block text-sm font-medium text-gray-700 mb-1">Kode Pegawai</label>
                  <div className="relative">
                    <select
                      id="kode-pegawai"
                      className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Pilih Kode Pegawai</option>
                      <option>EMP001</option>
                      <option>EMP002</option>
                      <option>EMP003</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="nama-pegawai" className="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai</label>
                  <input
                    type="text"
                    id="nama-pegawai"
                    placeholder="Mr. White"
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons for Filters */}
          <div className="flex justify-end mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Search className="h-4 w-4 mr-2" />
              Cari Data
            </button>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Export and Add Buttons */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                <FileDown className="h-4 w-4 mr-2" />
                Cetak Excel
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                <FileText className="h-4 w-4 mr-2" />
                Cetak PDF
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                <Printer className="h-4 w-4 mr-2" />
                Cetak Semua Penggajian
              </button>
            </div>
            {role !== 'management' && ( // Only show Add button if not management role
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Tambah
              </button>
            )}
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Daftar Penggajian</h2>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Show</span>
              <div className="relative">
                <select className="block w-20 appearance-none bg-white border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              <span className="text-gray-700">entries</span>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="search-table" className="text-gray-700">Search:</label>
              <input
                type="text"
                id="search-table"
                className="border border-gray-300 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">No <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Kode Pegawai <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Nama Pegawai <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Jenis Pegawai <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Tanggal <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Gaji <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Keterangan <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Aksi <ChevronDown className="ml-1 h-3 w-3" /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {penggajianData.map((entry) => (
                  <tr key={entry.no}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.kodePegawai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.namaPegawai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.jenisPegawai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.tanggal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.gaji}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {role === 'management' ? (
                          <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" title="Approve">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        ) : (
                          <>
                            <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                              <Printer className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Showing 1 to {penggajianData.length} of {penggajianData.length} entries
            </div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengajianActiveDashboard;
