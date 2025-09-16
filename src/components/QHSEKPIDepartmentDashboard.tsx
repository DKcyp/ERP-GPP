import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, FileText, BarChart3, Target, TrendingUp } from 'lucide-react';

interface KPIMaster {
  id: string;
  kodeKPI: string;
  namaKPI: string;
  kategori: 'Safety' | 'Health' | 'Environment' | 'Quality';
  unitPengukuran: string;
  targetBulanan: number;
  targetTahunan: number;
  formulaPerhitungan: string;
  departemenPenanggung: string;
  statusAktif: boolean;
  keterangan: string;
}

interface KPIData {
  id: string;
  kpiMasterId: string;
  bulan: string;
  tahun: number;
  nilaiAktual: number;
  nilaiTarget: number;
  persentaseCapaian: number;
  status: 'Tercapai' | 'Tidak Tercapai' | 'Melebihi Target';
  keterangan: string;
  tanggalInput: string;
  inputBy: string;
}

const QHSEKPIDepartmentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'master' | 'list'>('master');
  const [kpiMasterList, setKpiMasterList] = useState<KPIMaster[]>([]);
  const [kpiDataList, setKpiDataList] = useState<KPIData[]>([]);
  const [filteredMaster, setFilteredMaster] = useState<KPIMaster[]>([]);
  const [filteredData, setFilteredData] = useState<KPIData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sample data
  useEffect(() => {
    const sampleMaster: KPIMaster[] = [
      {
        id: '1',
        kodeKPI: 'KPI-SAF-001',
        namaKPI: 'Lost Time Injury Frequency Rate (LTIFR)',
        kategori: 'Safety',
        unitPengukuran: 'Per 1 Juta Jam Kerja',
        targetBulanan: 0.5,
        targetTahunan: 6,
        formulaPerhitungan: '(Jumlah LTI / Total Jam Kerja) x 1,000,000',
        departemenPenanggung: 'QHSE',
        statusAktif: true,
        keterangan: 'Tingkat frekuensi cedera hilang waktu kerja'
      },
      {
        id: '2',
        kodeKPI: 'KPI-ENV-001',
        namaKPI: 'Environmental Incident Rate',
        kategori: 'Environment',
        unitPengukuran: 'Jumlah Insiden',
        targetBulanan: 0,
        targetTahunan: 0,
        formulaPerhitungan: 'Total Environmental Incident per bulan',
        departemenPenanggung: 'QHSE',
        statusAktif: true,
        keterangan: 'Jumlah insiden lingkungan per periode'
      }
    ];

    const sampleData: KPIData[] = [
      {
        id: '1',
        kpiMasterId: '1',
        bulan: 'Januari',
        tahun: 2024,
        nilaiAktual: 0.3,
        nilaiTarget: 0.5,
        persentaseCapaian: 160,
        status: 'Tercapai',
        keterangan: 'Target tercapai dengan baik',
        tanggalInput: '2024-01-31',
        inputBy: 'Ahmad Rizki'
      },
      {
        id: '2',
        kpiMasterId: '2',
        bulan: 'Januari',
        tahun: 2024,
        nilaiAktual: 0,
        nilaiTarget: 0,
        persentaseCapaian: 100,
        status: 'Tercapai',
        keterangan: 'Tidak ada insiden lingkungan',
        tanggalInput: '2024-01-31',
        inputBy: 'Siti Nurhaliza'
      }
    ];

    setKpiMasterList(sampleMaster);
    setKpiDataList(sampleData);
    setFilteredMaster(sampleMaster);
    setFilteredData(sampleData);
  }, []);

  // Filter logic for master
  useEffect(() => {
    let filtered = kpiMasterList.filter(item => {
      const matchesSearch = item.namaKPI.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.kodeKPI.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesKategori = filterKategori === '' || item.kategori === filterKategori;
      return matchesSearch && matchesKategori;
    });
    setFilteredMaster(filtered);
  }, [searchTerm, filterKategori, kpiMasterList]);

  // Filter logic for data
  useEffect(() => {
    let filtered = kpiDataList.filter(item => {
      const kpiMaster = kpiMasterList.find(master => master.id === item.kpiMasterId);
      const matchesSearch = kpiMaster?.namaKPI.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          kpiMaster?.kodeKPI.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBulan = filterBulan === '' || item.bulan === filterBulan;
      const matchesTahun = filterTahun === '' || item.tahun.toString() === filterTahun;
      return matchesSearch && matchesBulan && matchesTahun;
    });
    setFilteredData(filtered);
  }, [searchTerm, filterBulan, filterTahun, kpiDataList, kpiMasterList]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tercapai': return 'bg-green-100 text-green-800';
      case 'Tidak Tercapai': return 'bg-red-100 text-red-800';
      case 'Melebihi Target': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKPIMasterByData = (kpiMasterId: string) => {
    return kpiMasterList.find(master => master.id === kpiMasterId);
  };

  // Pagination
  const currentList = activeTab === 'master' ? filteredMaster : filteredData;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = currentList.slice(startIndex, endIndex);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">KPI Department Dashboard</h1>
        <p className="text-gray-600">Kelola KPI Master dan monitoring pencapaian KPI departemen</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('master')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'master'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              KPI Master
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              List KPI
            </button>
          </nav>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari KPI..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {activeTab === 'master' && (
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  <option value="Safety">Safety</option>
                  <option value="Health">Health</option>
                  <option value="Environment">Environment</option>
                  <option value="Quality">Quality</option>
                </select>
              )}

              {activeTab === 'list' && (
                <>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filterBulan}
                    onChange={(e) => setFilterBulan(e.target.value)}
                  >
                    <option value="">Semua Bulan</option>
                    <option value="Januari">Januari</option>
                    <option value="Februari">Februari</option>
                    <option value="Maret">Maret</option>
                    <option value="April">April</option>
                    <option value="Mei">Mei</option>
                    <option value="Juni">Juni</option>
                    <option value="Juli">Juli</option>
                    <option value="Agustus">Agustus</option>
                    <option value="September">September</option>
                    <option value="Oktober">Oktober</option>
                    <option value="November">November</option>
                    <option value="Desember">Desember</option>
                  </select>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filterTahun}
                    onChange={(e) => setFilterTahun(e.target.value)}
                  >
                    <option value="">Semua Tahun</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {activeTab === 'master' ? 'Tambah KPI Master' : 'Input Data KPI'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'master' ? (
        /* KPI Master Table */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode KPI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama KPI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Bulanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Tahunan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item: KPIMaster) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.kodeKPI}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaKPI}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unitPengukuran}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.targetBulanan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.targetTahunan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.departemenPenanggung}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.statusAktif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.statusAktif ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
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
      ) : (
        /* KPI Data List Table */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KPI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capaian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item: KPIData) => {
                  const kpiMaster = getKPIMasterByData(item.kpiMasterId);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{kpiMaster?.namaKPI}</div>
                          <div className="text-gray-500">{kpiMaster?.kodeKPI}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.bulan} {item.tahun}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nilaiTarget}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nilaiAktual}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          {item.persentaseCapaian}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.inputBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, currentList.length)}</span> of{' '}
              <span className="font-medium">{currentList.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QHSEKPIDepartmentDashboard;
