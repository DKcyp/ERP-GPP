import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  Search, 
  PlusCircle, 
  Download, 
  Pencil, 
  Trash2,
  FileText,
  Calendar,
  MapPin,
  User,
  Building,
  Clock
} from 'lucide-react';

interface KameraData {
  id: string;
  noSeri: string;
  merk: string;
  tipe: string;
  lokasi: string;
  lokasiPemanfaatan: string; // otomatis
  vendor: string;
  tanggalPembelian: string;
  tanggalKalibrasi: string;
  masaBerlakuKalibrasi: string;
  personilPenanggungJawab: string;
  status: 'Aktif' | 'Maintenance' | 'Rusak';
  keterangan?: string;
}

const KameraDashboard: React.FC = () => {
  const [data, setData] = useState<KameraData[]>([
    {
      id: '1',
      noSeri: 'CAM001',
      merk: 'YXLON',
      tipe: 'Y.Cougar',
      lokasi: 'Workshop A',
      lokasiPemanfaatan: 'Area Fabrikasi', // otomatis berdasarkan lokasi
      vendor: 'PT. Radiography Indonesia',
      tanggalPembelian: '2023-01-15',
      tanggalKalibrasi: '2024-01-15',
      masaBerlakuKalibrasi: '2025-01-15',
      personilPenanggungJawab: 'Ahmad Radiographer',
      status: 'Aktif',
      keterangan: 'Kondisi baik'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<KameraData | null>(null);
  const [formData, setFormData] = useState<Partial<KameraData>>({});

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.noSeri.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item: KameraData) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setData(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...formData } : item
      ));
    } else {
      const newItem: KameraData = {
        id: Date.now().toString(),
        noSeri: formData.noSeri || '',
        merk: formData.merk || '',
        tipe: formData.tipe || '',
        lokasi: formData.lokasi || '',
        lokasiPemanfaatan: getLokasiPemanfaatan(formData.lokasi || ''),
        vendor: formData.vendor || '',
        tanggalPembelian: formData.tanggalPembelian || '',
        tanggalKalibrasi: formData.tanggalKalibrasi || '',
        masaBerlakuKalibrasi: formData.masaBerlakuKalibrasi || '',
        personilPenanggungJawab: formData.personilPenanggungJawab || '',
        status: formData.status || 'Aktif',
        keterangan: formData.keterangan
      };
      setData(prev => [...prev, newItem]);
    }
    setShowModal(false);
  };

  const getLokasiPemanfaatan = (lokasi: string): string => {
    // Logic otomatis untuk menentukan lokasi pemanfaatan
    const mapping: { [key: string]: string } = {
      'Workshop A': 'Area Fabrikasi',
      'Workshop B': 'Area Assembly',
      'Field Office': 'Area Konstruksi',
      'Lab': 'Area Testing'
    };
    return mapping[lokasi] || 'Area Umum';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kamera</h1>
              <nav className="text-sm text-gray-600 mt-1">
                <span>QHSE</span> › <span className="text-blue-600">Kamera</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan No. Seri, Merk, atau Lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAdd}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Tambah Kamera</span>
              </button>
              <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Seri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merk/Tipe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kalibrasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.noSeri}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{item.merk}</div>
                        <div className="text-gray-500">{item.tipe}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{item.lokasi}</div>
                        <div className="text-gray-500 text-xs">{item.lokasiPemanfaatan}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="text-xs text-gray-500">Terakhir: {new Date(item.tanggalKalibrasi).toLocaleDateString('id-ID')}</div>
                        <div className="text-xs text-gray-500">Berlaku: {new Date(item.masaBerlakuKalibrasi).toLocaleDateString('id-ID')}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.personilPenanggungJawab}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Aktif' ? 'bg-green-100 text-green-800' :
                        item.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="h-4 w-4" />
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Kamera' : 'Tambah Kamera'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Seri</label>
                <input
                  type="text"
                  value={formData.noSeri || ''}
                  onChange={(e) => setFormData({...formData, noSeri: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Merk</label>
                <input
                  type="text"
                  value={formData.merk || ''}
                  onChange={(e) => setFormData({...formData, merk: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                <input
                  type="text"
                  value={formData.tipe || ''}
                  onChange={(e) => setFormData({...formData, tipe: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <select
                  value={formData.lokasi || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    lokasi: e.target.value,
                    lokasiPemanfaatan: getLokasiPemanfaatan(e.target.value)
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Lokasi</option>
                  <option value="Workshop A">Workshop A</option>
                  <option value="Workshop B">Workshop B</option>
                  <option value="Field Office">Field Office</option>
                  <option value="Lab">Lab</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <input
                  type="text"
                  value={formData.vendor || ''}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pembelian</label>
                <input
                  type="date"
                  value={formData.tanggalPembelian || ''}
                  onChange={(e) => setFormData({...formData, tanggalPembelian: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personil Penanggung Jawab</label>
                <input
                  type="text"
                  value={formData.personilPenanggungJawab || ''}
                  onChange={(e) => setFormData({...formData, personilPenanggungJawab: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status || 'Aktif'}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Rusak">Rusak</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <textarea
                rows={3}
                value={formData.keterangan || ''}
                onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KameraDashboard;
