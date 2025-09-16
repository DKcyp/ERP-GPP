import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  Search, 
  PlusCircle, 
  Download, 
  Pencil, 
  Trash2,
  Calendar,
  Camera,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface SIBPersonilData {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  departemen: string;
  noSIB: string;
  tanggalTerbit: string;
  masaBerlaku: string;
  kameraMapping: string[]; // mapping ke kamera yang boleh dioperasikan
  status: 'Aktif' | 'Expired' | 'Suspended';
  keterangan?: string;
}

const SIBPersonilDashboard: React.FC = () => {
  const [data, setData] = useState<SIBPersonilData[]>([
    {
      id: '1',
      nama: 'Ahmad Radiographer',
      nip: 'EMP001',
      jabatan: 'Senior Radiographer',
      departemen: 'QHSE',
      noSIB: 'SIB-2024-001',
      tanggalTerbit: '2024-01-15',
      masaBerlaku: '2025-01-15',
      kameraMapping: ['CAM001', 'CAM002'],
      status: 'Aktif',
      keterangan: 'Level II Radiographer'
    },
    {
      id: '2',
      nama: 'Budi Operator',
      nip: 'EMP002',
      jabatan: 'Radiographer',
      departemen: 'QHSE',
      noSIB: 'SIB-2024-002',
      tanggalTerbit: '2024-03-01',
      masaBerlaku: '2024-12-01',
      kameraMapping: ['CAM001'],
      status: 'Aktif',
      keterangan: 'Level I Radiographer'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SIBPersonilData | null>(null);
  const [formData, setFormData] = useState<Partial<SIBPersonilData>>({});

  // Available cameras for mapping
  const availableCameras = ['CAM001', 'CAM002', 'CAM003', 'CAM004'];

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noSIB.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const getDaysUntilExpiry = (masaBerlaku: string): number => {
    const today = new Date();
    const expiryDate = new Date(masaBerlaku);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ kameraMapping: [] });
    setShowModal(true);
  };

  const handleEdit = (item: SIBPersonilData) => {
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
      const newItem: SIBPersonilData = {
        id: Date.now().toString(),
        nama: formData.nama || '',
        nip: formData.nip || '',
        jabatan: formData.jabatan || '',
        departemen: formData.departemen || '',
        noSIB: formData.noSIB || '',
        tanggalTerbit: formData.tanggalTerbit || '',
        masaBerlaku: formData.masaBerlaku || '',
        kameraMapping: formData.kameraMapping || [],
        status: formData.status || 'Aktif',
        keterangan: formData.keterangan
      };
      setData(prev => [...prev, newItem]);
    }
    setShowModal(false);
  };

  const handleCameraMappingChange = (cameraId: string, checked: boolean) => {
    const currentMapping = formData.kameraMapping || [];
    if (checked) {
      setFormData({
        ...formData,
        kameraMapping: [...currentMapping, cameraId]
      });
    } else {
      setFormData({
        ...formData,
        kameraMapping: currentMapping.filter(id => id !== cameraId)
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SIB Personil</h1>
              <nav className="text-sm text-gray-600 mt-1">
                <span>QHSE</span> › <span className="text-blue-600">SIB Personil</span>
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
                  placeholder="Cari berdasarkan Nama, NIP, atau No. SIB..."
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
                <span>Tambah Personil</span>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. SIB</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa Berlaku</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kamera Mapping</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => {
                  const daysUntilExpiry = getDaysUntilExpiry(item.masaBerlaku);
                  const isExpiringSoon = daysUntilExpiry <= 90 && daysUntilExpiry > 0;
                  const isExpired = daysUntilExpiry <= 0;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                          <div className="text-sm text-gray-500">{item.nip} • {item.jabatan}</div>
                          <div className="text-xs text-gray-400">{item.departemen}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{item.noSIB}</div>
                        <div className="text-xs text-gray-500">
                          Terbit: {new Date(item.tanggalTerbit).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <div>
                            <div className="font-medium">
                              {new Date(item.masaBerlaku).toLocaleDateString('id-ID')}
                            </div>
                            <div className={`text-xs ${
                              isExpired ? 'text-red-600' :
                              isExpiringSoon ? 'text-yellow-600' :
                              'text-gray-500'
                            }`}>
                              {isExpired ? 'Expired' :
                               isExpiringSoon ? `${daysUntilExpiry} hari lagi` :
                               `${daysUntilExpiry} hari lagi`}
                            </div>
                          </div>
                          {(isExpired || isExpiringSoon) && (
                            <AlertTriangle className={`h-4 w-4 ${
                              isExpired ? 'text-red-500' : 'text-yellow-500'
                            }`} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-wrap gap-1">
                          {item.kameraMapping.map((camera) => (
                            <span
                              key={camera}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <Camera className="h-3 w-3 mr-1" />
                              {camera}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'Aktif' ? 'bg-green-100 text-green-800' :
                          item.status === 'Expired' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit SIB Personil' : 'Tambah SIB Personil'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={formData.nama || ''}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                <input
                  type="text"
                  value={formData.nip || ''}
                  onChange={(e) => setFormData({...formData, nip: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                <input
                  type="text"
                  value={formData.jabatan || ''}
                  onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
                <input
                  type="text"
                  value={formData.departemen || ''}
                  onChange={(e) => setFormData({...formData, departemen: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. SIB</label>
                <input
                  type="text"
                  value={formData.noSIB || ''}
                  onChange={(e) => setFormData({...formData, noSIB: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Terbit</label>
                <input
                  type="date"
                  value={formData.tanggalTerbit || ''}
                  onChange={(e) => setFormData({...formData, tanggalTerbit: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Masa Berlaku</label>
                <input
                  type="date"
                  value={formData.masaBerlaku || ''}
                  onChange={(e) => setFormData({...formData, masaBerlaku: e.target.value})}
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
                  <option value="Expired">Expired</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            
            {/* Kamera Mapping */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kamera Mapping</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableCameras.map((camera) => (
                  <label key={camera} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(formData.kameraMapping || []).includes(camera)}
                      onChange={(e) => handleCameraMappingChange(camera, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{camera}</span>
                  </label>
                ))}
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

export default SIBPersonilDashboard;
