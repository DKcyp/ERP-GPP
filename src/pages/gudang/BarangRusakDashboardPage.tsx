import React, { useState } from 'react';
import { Eye, FileDown, Search, Trash2, Wrench, X, Calendar, User, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';

// Mock Data for Damaged Goods
const damagedGoodsData = [
  {
    id: 'BR-001',
    itemName: 'Kabel HDMI 2m',
    itemCode: 'HDMI-002',
    quantity: 5,
    reportDate: '2023-10-26',
    status: 'Rusak Berat',
    cause: 'Terlindas forklift',
    reporter: 'Andi',
  },
  {
    id: 'BR-002',
    itemName: 'Mouse Wireless Logitech',
    itemCode: 'LOGI-M185',
    quantity: 2,
    reportDate: '2023-10-25',
    status: 'Rusak Ringan',
    cause: 'Tombol klik kiri macet',
    reporter: 'Budi',
  },
  {
    id: 'BR-003',
    itemName: 'Monitor Samsung 24 inch',
    itemCode: 'SM-LF24T350',
    quantity: 1,
    reportDate: '2023-10-25',
    status: 'Perlu Dibuang',
    cause: 'Layar pecah saat pemindahan',
    reporter: 'Citra',
  },
  {
    id: 'BR-004',
    itemName: 'Keyboard Mechanical',
    itemCode: 'KEY-MCH-01',
    quantity: 3,
    reportDate: '2023-10-24',
    status: 'Menunggu Perbaikan',
    cause: 'Konektor USB patah',
    reporter: 'Doni',
  },
];

// Helper to determine status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Rusak Berat':
      return 'bg-red-100 text-red-800';
    case 'Perlu Dibuang':
      return 'bg-gray-100 text-gray-800';
    case 'Rusak Ringan':
      return 'bg-yellow-100 text-yellow-800';
    case 'Menunggu Perbaikan':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const BarangRusakDashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [isBAModalOpen, setIsBAModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [baForm, setBAForm] = useState({
    nomorBA: '',
    tanggalBA: new Date().toISOString().split('T')[0],
    penanggungJawab: '',
    tindakLanjut: '',
    keterangan: '',
    estimasiBiaya: ''
  });

  // Generate nomor BA otomatis
  const generateNomorBA = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `BA-BR-${year}${month}-${sequence}`;
  };

  // Handle buka modal BA
  const handleOpenBAModal = (item: any) => {
    setSelectedItem(item);
    setBAForm({
      ...baForm,
      nomorBA: generateNomorBA()
    });
    setIsBAModalOpen(true);
  };

  // Handle buka modal detail
  const handleOpenDetailModal = (item: any) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  // Handle generate BA dengan download
  const handleGenerateBA = () => {
    // Generate BA document content
    const baContent = generateBADocument(selectedItem, baForm);
    
    // Create and download file
    const blob = new Blob([baContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BA_${baForm.nomorBA}_${selectedItem.itemName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Reset form dan tutup modal
    setIsBAModalOpen(false);
    setSelectedItem(null);
    setBAForm({
      nomorBA: '',
      tanggalBA: new Date().toISOString().split('T')[0],
      penanggungJawab: '',
      tindakLanjut: '',
      keterangan: '',
      estimasiBiaya: ''
    });
    
    alert('Berita Acara berhasil digenerate dan didownload!');
  };

  // Generate BA document content
  const generateBADocument = (item: any, baData: any) => {
    const currentDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
=================================================================
                    BERITA ACARA BARANG RUSAK
=================================================================

Nomor BA        : ${baData.nomorBA}
Tanggal         : ${currentDate}
Penanggung Jawab: ${baData.penanggungJawab}

-----------------------------------------------------------------
                    INFORMASI BARANG RUSAK
-----------------------------------------------------------------

ID Laporan      : ${item.id}
Nama Barang     : ${item.itemName}
Kode Barang     : ${item.itemCode}
Jumlah Rusak    : ${item.quantity} unit
Tanggal Lapor   : ${item.reportDate}
Status Kerusakan: ${item.status}
Penyebab        : ${item.cause}
Pelapor         : ${item.reporter}

-----------------------------------------------------------------
                    TINDAK LANJUT
-----------------------------------------------------------------

Tindak Lanjut   : ${baData.tindakLanjut}
Estimasi Biaya  : Rp ${parseInt(baData.estimasiBiaya || '0').toLocaleString('id-ID')}

Keterangan:
${baData.keterangan || 'Tidak ada keterangan tambahan'}

-----------------------------------------------------------------

Dibuat pada: ${new Date().toLocaleString('id-ID')}


Tanda Tangan:


_____________________        _____________________
   Penanggung Jawab              Kepala Gudang


=================================================================
                    PT. NAMA PERUSAHAAN
=================================================================
    `;
  };

  const filteredData = damagedGoodsData.filter(
    (item) =>
      (item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'Semua' || item.status === filterStatus)
  );

  const summaryCards = [
    { title: 'Total Laporan', value: damagedGoodsData.length, color: 'text-blue-500' },
    {
      title: 'Rusak Berat',
      value: damagedGoodsData.filter((i) => i.status === 'Rusak Berat').length,
      color: 'text-red-500',
    },
    {
      title: 'Rusak Ringan',
      value: damagedGoodsData.filter((i) => i.status === 'Rusak Ringan').length,
      color: 'text-yellow-500',
    },
    {
      title: 'Menunggu Perbaikan',
      value: damagedGoodsData.filter((i) => i.status === 'Menunggu Perbaikan').length,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Monitoring Barang Rusak</h1>
        <div className="flex items-center space-x-2">
          <button className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-100 transition-colors">
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-gray-500 font-medium">{card.title}</h3>
            <p className={`text-4xl font-bold mt-2 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters and Table Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        {/* Filter and Search */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama atau kode barang..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>Semua</option>
              <option>Rusak Berat</option>
              <option>Rusak Ringan</option>
              <option>Menunggu Perbaikan</option>
              <option>Perlu Dibuang</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">ID Laporan</th>
                <th className="p-4 font-semibold text-gray-600">Nama Barang</th>
                <th className="p-4 font-semibold text-gray-600">Jumlah</th>
                <th className="p-4 font-semibold text-gray-600">Tanggal Lapor</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-800 font-medium">{item.id}</td>
                  <td className="p-4 text-gray-800">
                    <div>{item.itemName}</div>
                    <div className="text-sm text-gray-500">{item.itemCode}</div>
                  </td>
                  <td className="p-4 text-gray-800">{item.quantity}</td>
                  <td className="p-4 text-gray-800">{item.reportDate}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleOpenDetailModal(item)}
                        title="Lihat Detail"
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 transition-colors rounded-lg text-xs font-medium"
                        onClick={() => handleOpenBAModal(item)}
                        title="Generate Berita Acara"
                      >
                        <Wrench size={16} />
                        <span>Generate BA</span>
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Barang Rusak */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Eye className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Detail Barang Rusak</h2>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Info Barang */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Informasi Barang</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">ID Laporan</label>
                    <p className="text-sm text-blue-900 font-medium">{selectedItem.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Nama Barang</label>
                    <p className="text-sm text-blue-900 font-medium">{selectedItem.itemName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Kode Barang</label>
                    <p className="text-sm text-blue-900 font-medium">{selectedItem.itemCode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Jumlah Rusak</label>
                    <p className="text-sm text-blue-900 font-medium">{selectedItem.quantity} unit</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Tanggal Lapor</label>
                    <p className="text-sm text-blue-900 font-medium">{selectedItem.reportDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Pelapor</label>
                    <p className="text-sm text-blue-900 font-medium">{selectedItem.reporter}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-700 mb-1">Status Kerusakan</label>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-700 mb-1">Penyebab Kerusakan</label>
                    <p className="text-sm text-blue-900 bg-white p-3 rounded-lg border">{selectedItem.cause}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors duration-200 text-sm shadow-md"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenBAModal(selectedItem);
                }}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 text-sm shadow-md"
              >
                <Wrench className="h-4 w-4" />
                <span>Generate BA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Generate Berita Acara */}
      {isBAModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Generate Berita Acara Barang Rusak</h2>
              </div>
              <button
                onClick={() => setIsBAModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Info Barang Rusak */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Informasi Barang Rusak</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">ID Laporan</label>
                    <p className="text-sm text-red-900 font-medium">{selectedItem.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">Nama Barang</label>
                    <p className="text-sm text-red-900 font-medium">{selectedItem.itemName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">Kode Barang</label>
                    <p className="text-sm text-red-900 font-medium">{selectedItem.itemCode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">Jumlah Rusak</label>
                    <p className="text-sm text-red-900 font-medium">{selectedItem.quantity} unit</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">Status Kerusakan</label>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">Penyebab Kerusakan</label>
                    <p className="text-sm text-red-900">{selectedItem.cause}</p>
                  </div>
                </div>
              </div>

              {/* Form BA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-1" />
                    Nomor Berita Acara
                  </label>
                  <input
                    type="text"
                    value={baForm.nomorBA}
                    onChange={(e) => setBAForm({...baForm, nomorBA: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Tanggal BA
                  </label>
                  <input
                    type="date"
                    value={baForm.tanggalBA}
                    onChange={(e) => setBAForm({...baForm, tanggalBA: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    value={baForm.penanggungJawab}
                    onChange={(e) => setBAForm({...baForm, penanggungJawab: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nama penanggung jawab"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tindak Lanjut</label>
                  <select
                    value={baForm.tindakLanjut}
                    onChange={(e) => setBAForm({...baForm, tindakLanjut: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Pilih Tindak Lanjut --</option>
                    <option value="Perbaikan">Perbaikan</option>
                    <option value="Penggantian">Penggantian</option>
                    <option value="Pemusnahan">Pemusnahan</option>
                    <option value="Penjualan">Penjualan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Biaya (Rp)</label>
                  <input
                    type="number"
                    value={baForm.estimasiBiaya}
                    onChange={(e) => setBAForm({...baForm, estimasiBiaya: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan Tambahan</label>
                  <textarea
                    value={baForm.keterangan}
                    onChange={(e) => setBAForm({...baForm, keterangan: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Keterangan tambahan mengenai kerusakan dan tindak lanjut..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsBAModalOpen(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors duration-200 text-sm shadow-md"
              >
                Batal
              </button>
              <button
                onClick={handleGenerateBA}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm shadow-md"
              >
                <Download className="h-4 w-4" />
                <span>Generate BA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarangRusakDashboardPage;
