import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, FileDown, Calendar, Receipt, AlertTriangle, CheckCircle, X, Save } from 'lucide-react';

interface PPh23Record {
  id: number;
  tanggal: string;
  noBukti: string;
  vendor: string;
  jenisJasa: string;
  dpp: number;
  tarifPPh: number;
  jumlahPPh: number;
  status: 'Draft' | 'Submitted' | 'Paid';
  keterangan?: string;
}

const PajakPPhPrepaid23Dashboard: React.FC = () => {
  const [records, setRecords] = useState<PPh23Record[]>([
    { id: 1, tanggal: '2025-09-15', noBukti: 'PPh23-001', vendor: 'PT Konsultan Prima', jenisJasa: 'Jasa Konsultasi', dpp: 10000000, tarifPPh: 2, jumlahPPh: 200000, status: 'Paid', keterangan: 'Konsultasi IT' },
    { id: 2, tanggal: '2025-09-18', noBukti: 'PPh23-002', vendor: 'CV Digital Solution', jenisJasa: 'Jasa Teknik', dpp: 15000000, tarifPPh: 2, jumlahPPh: 300000, status: 'Submitted', keterangan: 'Maintenance server' },
    { id: 3, tanggal: '2025-09-20', noBukti: 'PPh23-003', vendor: 'PT Arsitek Mandiri', jenisJasa: 'Jasa Arsitek', dpp: 25000000, tarifPPh: 4, jumlahPPh: 1000000, status: 'Draft', keterangan: 'Desain bangunan' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PPh23Record | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = record.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.noBukti.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.jenisJasa.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === '' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const handleAdd = () => {
    setEditingRecord({
      id: 0,
      tanggal: new Date().toISOString().split('T')[0],
      noBukti: '',
      vendor: '',
      jenisJasa: '',
      dpp: 0,
      tarifPPh: 2,
      jumlahPPh: 0,
      status: 'Draft',
      keterangan: ''
    });
    setShowModal(true);
  };

  const handleEdit = (record: PPh23Record) => {
    setEditingRecord({ ...record });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setRecords(prev => prev.filter(r => r.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleSave = () => {
    if (!editingRecord) return;

    if (editingRecord.id === 0) {
      const newId = Math.max(...records.map(r => r.id)) + 1;
      setRecords(prev => [...prev, { ...editingRecord, id: newId }]);
    } else {
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? editingRecord : r));
    }
    
    setShowModal(false);
    setEditingRecord(null);
  };

  const handleInputChange = (field: keyof PPh23Record, value: any) => {
    if (!editingRecord) return;
    
    const updated = { ...editingRecord, [field]: value };
    
    if (field === 'dpp' || field === 'tarifPPh') {
      updated.jumlahPPh = (updated.dpp * updated.tarifPPh) / 100;
    }
    
    setEditingRecord(updated);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Draft: 'bg-gray-100 text-gray-800',
      Submitted: 'bg-yellow-100 text-yellow-800',
      Paid: 'bg-green-100 text-green-800'
    };
    return `px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`;
  };

  const totalDPP = filteredRecords.reduce((sum, record) => sum + record.dpp, 0);
  const totalPPh = filteredRecords.reduce((sum, record) => sum + record.jumlahPPh, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PAJAK PPh PREPAID 23
              </h1>
              <p className="text-gray-600 mt-2">Kelola pajak penghasilan pasal 23 yang dipotong di muka</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total DPP</p>
                <p className="text-lg font-bold text-blue-600">Rp {totalDPP.toLocaleString('id-ID')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total PPh 23</p>
                <p className="text-lg font-bold text-purple-600">Rp {totalPPh.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredRecords.filter(r => r.status === 'Draft').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredRecords.filter(r => r.status === 'Submitted').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredRecords.filter(r => r.status === 'Paid').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cari vendor, no bukti, atau jenis jasa..."
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Status</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            
            <div className="flex items-end gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md"
              >
                <Plus className="h-5 w-5 mr-2" />
                Tambah PPh 23
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <FileDown className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Bukti</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Jasa</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DPP</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarif %</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah PPh</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {record.noBukti}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.jenisJasa}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {record.dpp.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.tarifPPh}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">
                      Rp {record.jumlahPPh.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(record.status)}>{record.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Hapus"
                        >
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

      {/* Add/Edit Modal */}
      {showModal && editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingRecord.id === 0 ? 'Tambah PPh 23' : 'Edit PPh 23'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                  <input
                    type="date"
                    value={editingRecord.tanggal}
                    onChange={(e) => handleInputChange('tanggal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">No Bukti</label>
                  <input
                    type="text"
                    value={editingRecord.noBukti}
                    onChange={(e) => handleInputChange('noBukti', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="PPh23-001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                  <input
                    type="text"
                    value={editingRecord.vendor}
                    onChange={(e) => handleInputChange('vendor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nama vendor"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Jasa</label>
                  <select
                    value={editingRecord.jenisJasa}
                    onChange={(e) => handleInputChange('jenisJasa', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih jenis jasa</option>
                    <option value="Jasa Konsultasi">Jasa Konsultasi</option>
                    <option value="Jasa Teknik">Jasa Teknik</option>
                    <option value="Jasa Arsitek">Jasa Arsitek</option>
                    <option value="Jasa Manajemen">Jasa Manajemen</option>
                    <option value="Jasa Akuntansi">Jasa Akuntansi</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DPP</label>
                  <input
                    type="number"
                    value={editingRecord.dpp}
                    onChange={(e) => handleInputChange('dpp', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarif PPh (%)</label>
                  <select
                    value={editingRecord.tarifPPh}
                    onChange={(e) => handleInputChange('tarifPPh', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={2}>2%</option>
                    <option value={4}>4%</option>
                    <option value={6}>6%</option>
                    <option value={10}>10%</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah PPh</label>
                  <input
                    type="number"
                    value={editingRecord.jumlahPPh}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editingRecord.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                <textarea
                  value={editingRecord.keterangan || ''}
                  onChange={(e) => handleInputChange('keterangan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Keterangan tambahan..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingRecord.id === 0 ? 'Simpan' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Konfirmasi Hapus</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Apakah Anda yakin ingin menghapus record PPh 23 ini? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PajakPPhPrepaid23Dashboard;
