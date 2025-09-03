import React, { useMemo, useState } from 'react';
import { Search, Calendar, FileDown, Eye, X } from 'lucide-react';

const poDashboardData = [
  {
    id: 1,
    tglPembuatan: '01-02-2025',
    noPo: 'PO001',
    namaDivisi: 'Divisi Sertifikasi',
    namaVendor: 'PT. Permata Buana',
    namaBarang: ['Dokumen', 'formulir sertifikasi'],
    namaJasa: '-',
    nominalPo: 'Rp 150.000.000',
    status: 'Open',
  },
  {
    id: 2,
    tglPembuatan: '03-02-2025',
    noPo: 'PO002',
    namaDivisi: 'Divisi Konsultasi',
    namaVendor: 'CV. Maju Jaya',
    namaBarang: '-',
    namaJasa: ['Jasa riset', 'Jasa transportasi'],
    nominalPo: 'Rp 85.000.000',
    status: 'Close',
  },
  {
    id: 3,
    tglPembuatan: '05-02-2025',
    noPo: 'PO003',
    namaDivisi: 'Devisi Pelatihan',
    namaVendor: 'UD. Cahaya Abadi',
    namaBarang: ['Peralatan pelatihan rope access'],
    namaJasa: '-',
    nominalPo: 'Rp 25.000.000',
    status: 'Open',
  },
  {
    id: 4,
    tglPembuatan: '07-02-2025',
    noPo: 'PO004',
    namaDivisi: 'Divisi Inspeksi',
    namaVendor: 'PT. Teknologi Sejahtera',
    namaBarang: ['Kalibrasi Peralatan Inspeksi'],
    namaJasa: '-',
    nominalPo: 'Rp 10.000.000',
    status: 'Close',
  },
];

const PODashboard: React.FC = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<typeof poDashboardData[number] | null>(null);

  const barangData = useMemo(() =>
    poDashboardData.filter((d) => Array.isArray(d.namaBarang) ? d.namaBarang.length > 0 : d.namaBarang !== '-'),
  []);
  const jasaData = useMemo(() =>
    poDashboardData.filter((d) => Array.isArray(d.namaJasa) ? d.namaJasa.length > 0 : d.namaJasa !== '-'),
  []);

  const openDetail = (item: typeof poDashboardData[number]) => {
    setSelectedPO(item);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedPO(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans text-xs">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">DASHBOARD PO</h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-5 rounded-xl shadow-md mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            {/* Cari No PO */}
            <div>
              <label htmlFor="noPo" className="block text-sm font-medium text-gray-700 mb-1">Cari No PO</label>
              <div className="relative">
                <input type="text" id="noPo" defaultValue="PO001" className="w-full pl-2 pr-8 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs" />
                <button className="absolute inset-y-0 right-0 flex items-center px-2 bg-cyan-500 text-white rounded-r-md hover:bg-cyan-600">
                  <Search size={14} />
                </button>
              </div>
            </div>

            {/* Cari Devisi */}
            <div>
              <label htmlFor="devisi" className="block text-sm font-medium text-gray-700 mb-1">Cari Devisi</label>
              <div className="relative">
                <input type="text" id="devisi" defaultValue="Divisi Sertifikasi" className="w-full pl-2 pr-8 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs" />
                <button className="absolute inset-y-0 right-0 flex items-center px-2 bg-cyan-500 text-white rounded-r-md hover:bg-cyan-600">
                  <Search size={14} />
                </button>
              </div>
            </div>

            {/* Cari Nama Vendor */}
            <div>
              <label htmlFor="namaVendor" className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Vendor</label>
              <div className="relative">
                <input type="text" id="namaVendor" defaultValue="PT. Permata Buana" className="w-full pl-2 pr-8 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs" />
                <button className="absolute inset-y-0 right-0 flex items-center px-2 bg-cyan-500 text-white rounded-r-md hover:bg-cyan-600">
                  <Search size={14} />
                </button>
              </div>
            </div>

            {/* Periode */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input type="text" defaultValue="03/03/2025" className="w-full pl-2 pr-8 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs" />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <Calendar size={14} className="text-gray-400" />
                  </span>
                </div>
                <span className="text-gray-600">s.d</span>
                <div className="relative flex-1">
                  <input type="text" defaultValue="03/03/2025" className="w-full pl-2 pr-8 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs" />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <Calendar size={14} className="text-gray-400" />
                  </span>
                </div>
              </div>
            </div>
            
            {/* Search Button */}
            <div className="flex justify-end">
                <button className="w-full md:w-auto px-4 py-1.5 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-sm text-xs">
                    Search
                </button>
            </div>
          </div>
        </div>

        {/* Table Section: Pengadaan Barang */}
        <div className="bg-white p-5 rounded-xl shadow-md mb-5">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-800">Pengadaan Barang</h2>
            </div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                {/* Show Entries */}
                <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span>Show</span>
                    <select className="border border-gray-300 rounded-md px-2 py-1 text-xs">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                    <span>entries</span>
                </div>
                {/* Export Buttons */}
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 text-xs px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        <FileDown size={14} />
                        <span>Export Excel</span>
                    </button>
                    <button className="flex items-center gap-2 text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <FileDown size={14} />
                        <span>Export CSV</span>
                    </button>
                    <button className="flex items-center gap-2 text-xs px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        <FileDown size={14} />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            {/* Table Barang */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase text-[10px]">
                  <tr>
                    <th scope="col" className="px-3 py-2">No</th>
                    <th scope="col" className="px-3 py-2">Tgl Pembuatan PO</th>
                    <th scope="col" className="px-3 py-2">No PO</th>
                    <th scope="col" className="px-3 py-2">Nama Divisi</th>
                    <th scope="col" className="px-3 py-2">Nama Vendor</th>
                    <th scope="col" className="px-3 py-2">Nama Barang</th>
                    <th scope="col" className="px-3 py-2">Nominal PO</th>
                    <th scope="col" className="px-3 py-2">Status</th>
                    <th scope="col" className="px-3 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {barangData.map((item, index) => (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">{item.tglPembuatan}</td>
                      <td className="px-3 py-2 font-medium text-gray-900">{item.noPo}</td>
                      <td className="px-3 py-2">{item.namaDivisi}</td>
                      <td className="px-3 py-2">{item.namaVendor}</td>
                      <td className="px-3 py-2">
                        {Array.isArray(item.namaBarang) ? (
                          <ul className="list-disc list-inside text-gray-800">
                            {item.namaBarang.map((barang, i) => <li key={i}>{barang}</li>)}
                          </ul>
                        ) : (
                          item.namaBarang
                        )}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900">{item.nominalPo}</td>
                      <td className="px-3 py-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-md text-white ${
                          item.status === 'Open' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <button onClick={() => openDetail(item)} className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          <Eye size={12} /> Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             {/* Pagination */}
            <div className="flex justify-between items-center mt-3 text-xs text-gray-700">
                <span>Showing 1 to {barangData.length} of {barangData.length} entries</span>
                <div className="flex">
                    <button className="px-2.5 py-1.5 border rounded-l-md hover:bg-gray-100">Previous</button>
                    <button className="px-2.5 py-1.5 border bg-blue-600 text-white">1</button>
                    <button className="px-2.5 py-1.5 border rounded-r-md hover:bg-gray-100">Next</button>
                </div>
            </div>
        </div>

        {/* Table Section: Pengadaan Jasa */}
        <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-800">Pengadaan Jasa</h2>
            </div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                {/* Show Entries */}
                <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span>Show</span>
                    <select className="border border-gray-300 rounded-md px-2 py-1 text-xs">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                    <span>entries</span>
                </div>
                {/* Export Buttons */}
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 text-xs px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        <FileDown size={14} />
                        <span>Export Excel</span>
                    </button>
                    <button className="flex items-center gap-2 text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <FileDown size={14} />
                        <span>Export CSV</span>
                    </button>
                    <button className="flex items-center gap-2 text-xs px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        <FileDown size={14} />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            {/* Table Jasa */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase text-[10px]">
                  <tr>
                    <th scope="col" className="px-3 py-2">No</th>
                    <th scope="col" className="px-3 py-2">Tgl Pembuatan PO</th>
                    <th scope="col" className="px-3 py-2">No PO</th>
                    <th scope="col" className="px-3 py-2">Nama Divisi</th>
                    <th scope="col" className="px-3 py-2">Nama Vendor</th>
                    <th scope="col" className="px-3 py-2">Nama Jasa</th>
                    <th scope="col" className="px-3 py-2">Nominal PO</th>
                    <th scope="col" className="px-3 py-2">Status</th>
                    <th scope="col" className="px-3 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {jasaData.map((item, index) => (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">{item.tglPembuatan}</td>
                      <td className="px-3 py-2 font-medium text-gray-900">{item.noPo}</td>
                      <td className="px-3 py-2">{item.namaDivisi}</td>
                      <td className="px-3 py-2">{item.namaVendor}</td>
                      <td className="px-3 py-2">
                        {Array.isArray(item.namaJasa) ? (
                          <ul className="list-disc list-inside text-gray-800">
                            {item.namaJasa.map((jasa, i) => <li key={i}>{jasa}</li>)}
                          </ul>
                        ) : (
                          item.namaJasa
                        )}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900">{item.nominalPo}</td>
                      <td className="px-3 py-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-md text-white ${
                          item.status === 'Open' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <button onClick={() => openDetail(item)} className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          <Eye size={12} /> Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             {/* Pagination */}
            <div className="flex justify-between items-center mt-3 text-xs text-gray-700">
                <span>Showing 1 to {jasaData.length} of {jasaData.length} entries</span>
                <div className="flex">
                    <button className="px-2.5 py-1.5 border rounded-l-md hover:bg-gray-100">Previous</button>
                    <button className="px-2.5 py-1.5 border bg-blue-600 text-white">1</button>
                    <button className="px-2.5 py-1.5 border rounded-r-md hover:bg-gray-100">Next</button>
                </div>
            </div>
        </div>
      </div>
      {/* Detail Modal */}
      {isDetailOpen && selectedPO && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Detail PO - {selectedPO.noPo}</h3>
              <button onClick={closeDetail} className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 text-sm text-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-gray-500">Tanggal Pembuatan</div>
                  <div className="font-medium">{selectedPO.tglPembuatan}</div>
                </div>
                <div>
                  <div className="text-gray-500">No PO</div>
                  <div className="font-medium">{selectedPO.noPo}</div>
                </div>
                <div>
                  <div className="text-gray-500">Divisi</div>
                  <div className="font-medium">{selectedPO.namaDivisi}</div>
                </div>
                <div>
                  <div className="text-gray-500">Vendor</div>
                  <div className="font-medium">{selectedPO.namaVendor}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-gray-500">Barang</div>
                  <div className="font-medium">
                    {Array.isArray(selectedPO.namaBarang) ? (
                      <ul className="list-disc list-inside">
                        {selectedPO.namaBarang.map((b, i) => (<li key={i}>{b}</li>))}
                      </ul>
                    ) : (
                      selectedPO.namaBarang
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-gray-500">Jasa</div>
                  <div className="font-medium">
                    {Array.isArray(selectedPO.namaJasa) ? (
                      <ul className="list-disc list-inside">
                        {selectedPO.namaJasa.map((j, i) => (<li key={i}>{j}</li>))}
                      </ul>
                    ) : (
                      selectedPO.namaJasa
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Nominal</div>
                  <div className="font-medium">{selectedPO.nominalPo}</div>
                </div>
                <div>
                  <div className="text-gray-500">Status</div>
                  <div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-md text-white ${
                      selectedPO.status === 'Open' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {selectedPO.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button onClick={closeDetail} className="px-3 py-1.5 text-xs rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PODashboard;
