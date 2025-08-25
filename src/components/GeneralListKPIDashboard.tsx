import React, { useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import KPITambahModal from './KPITambahModal'; // Import the new modal component

interface KPIEntry {
  no: number;
  namaPegawai: string;
  posisiPegawai: string;
  atasanLangsung: string;
  posisiAtasan: string;
  periode: string;
}

const GeneralListKPIDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const kpiData: KPIEntry[] = [
    { no: 1, namaPegawai: 'Kasim', posisiPegawai: 'Operation Manager', atasanLangsung: 'Andi Setiawan', posisiAtasan: 'General Manager', periode: 'Januari 2025' },
    { no: 2, namaPegawai: 'Rina Sari', posisiPegawai: 'Operation Manager', atasanLangsung: 'Arief Nugroho', posisiAtasan: 'General Manager', periode: 'Januari 2025' },
    { no: 3, namaPegawai: 'Budi Santoso', posisiPegawai: 'Operation Manager', atasanLangsung: 'Siti Rahma', posisiAtasan: 'General Manager', periode: 'Januari 2025' },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">KPI List</h1>

        {/* KPI List Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">KPI List</h2>
            <button
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-xl shadow-md hover:bg-green-700 transition-colors duration-300"
            >
              <Plus className="h-4 w-4 mr-2" /> Tambah
            </button>
          </div>

          {/* KPI Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">No</th>
                  <th className="px-4 py-3 text-left">Nama Pegawai</th>
                  <th className="px-4 py-3 text-left">Posisi Pegawai</th>
                  <th className="px-4 py-3 text-left">Atasan Langsung</th>
                  <th className="px-4 py-3 text-left">Posisi Atasan</th>
                  <th className="px-4 py-3 text-left">Periode</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kpiData.map((entry) => (
                  <tr key={entry.no} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.no}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.namaPegawai}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.posisiPegawai}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.atasanLangsung}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.posisiAtasan}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{entry.periode}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <KPITambahModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default GeneralListKPIDashboard;
