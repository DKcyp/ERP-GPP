import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, Lock, Unlock, CalendarDays } from 'lucide-react';

interface TutupBukuEntry {
  id: string;
  tanggalTutup: string;
  periodeBulan: string;
  periodeTahun: number;
  status: 'Closed' | 'Open';
}

const TutupBukuDashboard: React.FC = () => {
  const today = new Date();
  const [tanggalTutup, setTanggalTutup] = useState<Date | null>(today);
  const [bulan, setBulan] = useState<string>((today.getMonth() + 1).toString());
  const [tahun, setTahun] = useState<string>(today.getFullYear().toString());

  const dummyData: TutupBukuEntry[] = [
    { id: '1', tanggalTutup: '2024-06-30', periodeBulan: 'Juni', periodeTahun: 2024, status: 'Closed' },
    { id: '2', tanggalTutup: '2024-05-31', periodeBulan: 'Mei', periodeTahun: 2024, status: 'Closed' },
    { id: '3', tanggalTutup: '2024-04-30', periodeBulan: 'April', periodeTahun: 2024, status: 'Closed' },
    { id: '4', tanggalTutup: '2024-03-31', periodeBulan: 'Maret', periodeTahun: 2024, status: 'Closed' },
    { id: '5', tanggalTutup: '2024-02-29', periodeBulan: 'Februari', periodeTahun: 2024, status: 'Closed' },
    { id: '6', tanggalTutup: '2024-01-31', periodeBulan: 'Januari', periodeTahun: 2024, status: 'Closed' },
  ];

  const months = [
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => (today.getFullYear() - i).toString());

  const handleTutupBuku = () => {
    const selectedMonthLabel = months.find(m => m.value === bulan)?.label;
    alert(`Melakukan Tutup Buku untuk periode ${selectedMonthLabel} ${tahun} pada tanggal ${tanggalTutup?.toLocaleDateString('id-ID')}`);
    // Implement actual tutup buku logic here
  };

  const handleBukaTutupBuku = (id: string) => {
    if (confirm(`Apakah Anda yakin ingin membuka kembali buku untuk entri ${id}?`)) {
      alert(`Membuka kembali buku untuk entri: ${id}`);
      // Implement actual buka tutup buku logic here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                TUTUP BUKU
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Tutup Buku</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Form Tutup Buku</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label htmlFor="tanggalTutup" className="block text-sm font-medium text-gray-700 mb-2">Tanggal Tutup Buku</label>
              <DatePicker
                selected={tanggalTutup}
                onChange={(date: Date | null) => setTanggalTutup(date)}
                dateFormat="dd/MM/yyyy"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="bulan" className="block text-sm font-medium text-gray-700 mb-2">Pilih Bulan</label>
              <select
                id="bulan"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tahun" className="block text-sm font-medium text-gray-700 mb-2">Pilih Tahun</label>
              <select
                id="tahun"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleTutupBuku}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Lock className="h-5 w-5 mr-2" /> Tutup Buku
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <h3 className="text-2xl font-bold text-gray-900 p-8 pb-4">Daftar Tutup Buku Sebelumnya</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Tutup
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode Bulan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode Tahun
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyData.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(entry.tanggalTutup).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.periodeBulan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.periodeTahun}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.status === 'Closed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleBukaTutupBuku(entry.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <Unlock className="h-4 w-4 mr-1" /> Buka Tutup Buku
                      </button>
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

export default TutupBukuDashboard;
