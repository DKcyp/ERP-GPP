import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, PlusCircle, Save, Trash2 } from 'lucide-react';

interface DetailItem {
  id: number;
  coa: string;
  nominal: number;
  keterangan: string;
}

const KasKeluarDashboard: React.FC = () => {
  const today = new Date();
  const [nomorJurnal, setNomorJurnal] = useState('KK-2024-07-001');
  const [tanggal, setTanggal] = useState<Date | null>(today);
  const [kasAccount, setKasAccount] = useState('Kas Besar');
  const [keteranganHeader, setKeteranganHeader] = useState('');
  const [detailItems, setDetailItems] = useState<DetailItem[]>([
    { id: 1, coa: '5101 - Beban Gaji', nominal: 0, keterangan: '' },
  ]);

  const coaOptions = [
    '5101 - Beban Gaji',
    '5102 - Beban Sewa',
    '6101 - Beban Listrik',
    '1301 - Persediaan Barang Dagang',
    '2101 - Utang Usaha',
  ];

  const kasOptions = [
    'Kas Besar',
    'Kas Kecil',
  ];

  const handleAddDetailRow = () => {
    setDetailItems([...detailItems, { id: detailItems.length + 1, coa: '', nominal: 0, keterangan: '' }]);
  };

  const handleRemoveDetailRow = (id: number) => {
    setDetailItems(detailItems.filter(item => item.id !== id));
  };

  const handleDetailChange = (id: number, field: keyof DetailItem, value: any) => {
    setDetailItems(detailItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return detailItems.reduce((sum, item) => sum + item.nominal, 0);
  };

  const handleSave = () => {
    const dataToSave = {
      nomorJurnal,
      tanggal: tanggal?.toISOString().split('T')[0],
      kasAccount,
      keteranganHeader,
      detailItems,
      total: calculateTotal(),
    };
    alert('Data Kas Keluar Disimpan:\n' + JSON.stringify(dataToSave, null, 2));
    console.log(dataToSave);
    // Implement actual save logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                KAS KELUAR
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Kas Keluar</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Form Kas Keluar</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="nomorJurnal" className="block text-sm font-medium text-gray-700 mb-2">Nomor Jurnal</label>
              <input
                type="text"
                id="nomorJurnal"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                value={nomorJurnal}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
              <DatePicker
                selected={tanggal}
                onChange={(date: Date | null) => setTanggal(date)}
                dateFormat="dd/MM/yyyy"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="kasAccount" className="block text-sm font-medium text-gray-700 mb-2">Kas</label>
              <select
                id="kasAccount"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={kasAccount}
                onChange={(e) => setKasAccount(e.target.value)}
              >
                {kasOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="keteranganHeader" className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
              <textarea
                id="keteranganHeader"
                rows={3}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={keteranganHeader}
                onChange={(e) => setKeteranganHeader(e.target.value)}
                placeholder="Masukkan keterangan jurnal..."
              ></textarea>
            </div>
          </div>

          <h4 className="text-xl font-bold text-gray-800 mb-4">Detail Transaksi</h4>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    COA
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nominal
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keterangan
                  </th>
                  <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {detailItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <select
                        value={item.coa}
                        onChange={(e) => handleDetailChange(item.id, 'coa', e.target.value)}
                        className="block w-full border border-gray-300 rounded-lg py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Pilih COA</option>
                        {coaOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="number"
                        value={item.nominal}
                        onChange={(e) => handleDetailChange(item.id, 'nominal', parseFloat(e.target.value) || 0)}
                        className="block w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="text"
                        value={item.keterangan}
                        onChange={(e) => handleDetailChange(item.id, 'keterangan', e.target.value)}
                        className="block w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleRemoveDetailRow(item.id)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleAddDetailRow}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Baris
            </button>
            <div className="text-lg font-bold text-gray-900">
              Total: Rp {calculateTotal().toLocaleString('id-ID')}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Save className="h-5 w-5 mr-2" /> Simpan Jurnal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KasKeluarDashboard;
