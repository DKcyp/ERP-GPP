import React from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const GeneralPurchasingRequestDashboard: React.FC = () => {
  const urgentData = [
    { no: 1, divisi: 'Divisi Inspeksi', tglPembuatan: '05-02-2024', noPR: 'PR001', namaUser: 'Zakaria', namaBarang: ['helm safety', 'sarung tangan safety', 'sepatu safety'], namaJasa: [] },
    { no: 2, divisi: 'Divisi Pelatihan', tglPembuatan: '07-02-2024', noPR: 'PR002', namaUser: 'Budi Santoso', namaBarang: [], namaJasa: ['Jasa Penginapan', 'transportasi untuk peserta Pelatihan'] },
    { no: 3, divisi: 'Divisi Konsultasi', tglPembuatan: '09-02-2024', noPR: 'PR003', namaUser: 'Cahyo Widodo', namaBarang: [], namaJasa: ['Jasa riset', 'pengumpulan data'] },
    { no: 4, divisi: 'Divisi Sertifikasi', tglPembuatan: '10-02-2024', noPR: 'PR004', namaUser: 'Dewi Lestari', namaBarang: ['Peralatan pendukung administrasi'], namaJasa: [] },
  ];

  const teamPurchasingData = [
    { no: 1, teamPurchasing: 'Team A', divisi: 'Divisi Sertifikasi', tglPembuatan: '10-02-2025', noPR: 'PR0023', namaUser: 'Karim', namaBarang: ['Boiler', 'benjana tekan', 'tangki penyimpanan'], namaJasa: [] },
    { no: 2, teamPurchasing: 'Team B', divisi: 'Divisi Konsultasi', tglPembuatan: '11-02-2025', noPR: 'PR0024', namaUser: 'Rina', namaBarang: [], namaJasa: ['Jasa Layanan Konsultasi'] },
    { no: 3, teamPurchasing: 'Team C', divisi: 'Divisi Pelatihan', tglPembuatan: '12-02-2025', noPR: 'PR0025', namaUser: 'Budi', namaBarang: [], namaJasa: ['Pelatihan Rope Access'] },
    { no: 4, teamPurchasing: 'Team D', divisi: 'Divisi Inspeksi', tglPembuatan: '13-02-2025', noPR: 'PR0026', namaUser: 'Siti', namaBarang: [], namaJasa: ['Jasa pengelasan', 'Inspeksi korosi'] },
  ];

  const renderTable = (data: any[], title: string, includeTeamPurchasing: boolean = false) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 text-gray-600 text-sm">
          <span>Show</span>
          <select className="form-select rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>entries</span>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor={`search-${title.replace(/\s/g, '-')}`} className="sr-only">Search:</label>
          <input
            type="text"
            id={`search-${title.replace(/\s/g, '-')}`}
            placeholder="Search:"
            className="form-input rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 w-48"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">No <ChevronUp className="ml-1 h-3 w-3 text-gray-400" /></div>
              </th>
              {includeTeamPurchasing && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">Nama Team Purchasing <ChevronUp className="ml-1 h-3 w-3 text-gray-400" /></div>
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">Nama Devisi <ChevronUp className="ml-1 h-3 w-3 text-gray-400" /></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">Tgl Pembuatan PR <ChevronUp className="ml-1 h-3 w-3 text-gray-400" /></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">No PR <ChevronUp className="ml-1 h-3 w-3 text-gray-400" /></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">Nama User <ChevronUp className="ml-1 h-3 w-3 text-gray-400" /></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">Nama Barang <ChevronUp className="ml-1 h-3 w-3 text-gray-400" /></div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">Nama Jasa <ChevronUp className="ml-1 h-3 w-3 text-gray-400" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.no}</td>
                {includeTeamPurchasing && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.teamPurchasing}</td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.divisi}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.tglPembuatan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.noPR}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.namaUser}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.namaBarang && item.namaBarang.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {item.namaBarang.map((barang: string, i: number) => (
                        <li key={i}>{barang}</li>
                      ))}
                    </ul>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.namaJasa && item.namaJasa.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {item.namaJasa.map((jasa: string, i: number) => (
                        <li key={i}>{jasa}</li>
                      ))}
                    </ul>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>Showing 1 to {data.length} of {data.length} entries</span>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">Previous</button>
          <button className="px-3 py-1 border border-blue-500 bg-blue-500 text-white rounded-md">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">DASHBOARD PURCHASING REQUEST</h1>

        {renderTable(urgentData, 'Urgent Dalam Periode 1 Minggu')}
        {renderTable(teamPurchasingData, 'Daftar PR dari masing-masing team Purchasing', true)}
      </div>
    </div>
  );
};

export default GeneralPurchasingRequestDashboard;
