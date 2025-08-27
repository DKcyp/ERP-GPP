import React, { useState } from 'react';
import { CalendarDays, Search, Plus, Edit, Trash2 } from 'lucide-react';
import KPITambahModal from './KPITambahModal'; // Import the modal component

// Dummy data for KPI cards
const dummyKpiData = [
  {
    id: 1,
    perspektif: 'Financial',
    indicator: 'Efisiensi penyerapan kebutuhan budget departemen',
    responsibility: 'Control Budget departemen 10%',
    bobot: '10%',
    target: '10%',
  },
  {
    id: 2,
    perspektif: 'Customer',
    indicator: 'Melakukan survey penilaian kepuasan terhadap kinerja AP minimal 10%',
    responsibility: 'Melakukan survey penilaian kepuasan terhadap kinerja AP minimal 10%',
    bobot: '10%',
    target: '10%',
  },
  {
    id: 3,
    perspektif: 'Internal Business Process',
    indicator: 'Peningkatan efisiensi operasional melalui otomatisasi proses',
    responsibility: 'Otomatisasi 30% proses manual dalam 6 bulan',
    bobot: '15%',
    target: '30%',
  },
  {
    id: 4,
    perspektif: 'Learning and Growth',
    indicator: 'Pengembangan kompetensi karyawan melalui program pelatihan',
    responsibility: 'Setiap karyawan mengikuti minimal 2 pelatihan per tahun',
    bobot: '15%',
    target: '2 pelatihan',
  },
];

const MasterKPIHRDDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Master KPI HRD</h1>

        {/* Periode Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Periode</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Tanggal Awal */}
            <div>
              <label htmlFor="tanggalAwal" className="block text-sm font-medium text-gray-700 mb-2">Tanggal Awal</label>
              <div className="relative">
                <input
                  type="text"
                  id="tanggalAwal"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                  placeholder="dd/mm/yyyy"
                />
                <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* Tanggal Akhir */}
            <div>
              <label htmlFor="tanggalAkhir" className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
              <div className="relative">
                <input
                  type="text"
                  id="tanggalAkhir"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                  placeholder="dd/mm/yyyy"
                />
                <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* Cari Button */}
            <div>
              <button className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Cari</span>
              </button>
            </div>
          </div>
        </div>

        {/* Daftar KPI Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Daftar KPI</h2>
            <button
              onClick={handleOpenModal}
              className="px-6 py-2 bg-cyan-500 text-white font-medium rounded-xl shadow-md hover:bg-cyan-600 transition-colors duration-300 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Tambah</span>
            </button>
          </div>

          {/* KPI Cards List */}
          <div className="space-y-6">
            {dummyKpiData.map((kpi) => (
              <div key={kpi.id} className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow duration-200">
                <p className="text-lg font-bold text-gray-900 mb-2">Perspektif: {kpi.perspektif}</p>
                <p className="text-gray-700 mb-1"><strong>Indicator:</strong> {kpi.indicator}</p>
                <p className="text-gray-700 mb-1"><strong>Responsibility:</strong> {kpi.responsibility}</p>
                <p className="text-gray-700 mb-1"><strong>Bobot:</strong> {kpi.bobot}</p>
                <p className="text-gray-700"><strong>Target:</strong> {kpi.target}</p>

                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200 shadow-md">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Tambah Modal */}
      <KPITambahModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MasterKPIHRDDashboard;
