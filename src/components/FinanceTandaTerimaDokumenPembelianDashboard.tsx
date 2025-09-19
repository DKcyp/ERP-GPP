import React, { useMemo, useState } from 'react';
import { Clock, Search, FileSpreadsheet, FileDown, Plus, Edit, Trash2 } from 'lucide-react';
import FinanceTandaTerimaDokumenPembelianModal, { TandaTerimaDokumenPembelianFormData } from './FinanceTandaTerimaDokumenPembelianModal';

interface TTPBRow {
  id: number;
  noTTPB: string;
  tglTTPB: string; // yyyy-mm-dd
  diserahkanOleh: string;
  diterimaOleh: string;
  namaDivisi: string;
  tglDiserahkanPurchasing?: string; // yyyy-mm-dd
  tglDiterimaKeuangan?: string; // yyyy-mm-dd
  // New fields for Dokumen Pembelian requirements
  tanggalDiterima?: string; // yyyy-mm-dd
  uploadDokumen?: string; // file path or name
}

const FinanceTandaTerimaDokumenPembelianDashboard: React.FC = () => {
  const today = new Date();

  // Filters
  const [searchNo, setSearchNo] = useState('');
  const [divisi, setDivisi] = useState('');
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingData, setEditingData] = useState<TandaTerimaDokumenPembelianFormData | undefined>();
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const divisiOptions = ['Marketing','HRD','GA','Procurement','Project Control','Operasional','QHSE','Finance','Accounting','Tax','Gudang'];

  // State for managing rows data with full CRUD operations
  const [rows, setRows] = useState<TTPBRow[]>([
    {
      id: 1,
      noTTPB: 'TTPB-2025-09-001',
      tglTTPB: '2025-09-09',
      diserahkanOleh: 'Purchasing - Rina',
      diterimaOleh: 'Keuangan - Andi',
      namaDivisi: 'Procurement',
      tglDiserahkanPurchasing: '2025-09-10',
      tglDiterimaKeuangan: '2025-09-11',
      tanggalDiterima: '2025-09-11',
      uploadDokumen: 'po_invoice_2025001.pdf'
    },
    {
      id: 2,
      noTTPB: 'TTPB-2025-09-002',
      tglTTPB: '2025-09-11',
      diserahkanOleh: 'Purchasing - Dewa',
      diterimaOleh: 'Keuangan - Sinta',
      namaDivisi: 'Finance',
      tglDiserahkanPurchasing: '2025-09-11',
      tglDiterimaKeuangan: '2025-09-12',
      tanggalDiterima: '2025-09-12',
      uploadDokumen: 'purchase_docs_2025002.pdf'
    },
    {
      id: 3,
      noTTPB: 'TTPB-2025-09-003',
      tglTTPB: '2025-09-12',
      diserahkanOleh: 'Purchasing - Maya',
      diterimaOleh: 'Keuangan - Budi',
      namaDivisi: 'Marketing',
      tglDiserahkanPurchasing: '2025-09-13',
      tglDiterimaKeuangan: '2025-09-14',
      tanggalDiterima: '2025-09-14',
      uploadDokumen: 'marketing_purchase_docs.pdf'
    },
  ]);

  const filtered = useMemo(() => rows.filter(r => {
    const okNo = searchNo ? r.noTTPB.toLowerCase().includes(searchNo.toLowerCase()) : true;
    const okDiv = divisi ? r.namaDivisi === divisi : true;
    const okFrom = dari ? new Date(r.tglTTPB) >= new Date(`${dari}T00:00:00`) : true;
    const okTo = sampai ? new Date(r.tglTTPB) <= new Date(`${sampai}T23:59:59`) : true;
    return okNo && okDiv && okFrom && okTo;
  }), [rows, searchNo, divisi, dari, sampai]);

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  // Generate next TTPB number
  const generateNextTTPBNumber = (): string => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const existingNumbers = rows
      .map(row => {
        const match = row.noTTPB.match(/TTPB-(\d{4})-(\d{2})-(\d{3})/);
        return match ? parseInt(match[3]) : 0;
      })
      .filter(num => num > 0);
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `TTPB-${year}-${month}-${nextNumber.toString().padStart(3, '0')}`;
  };

  // Modal handlers
  const handleAdd = () => {
    setModalTitle('Tambah Dokumen Pembelian');
    setEditingData(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (row: TTPBRow) => {
    setModalTitle('Edit Dokumen Pembelian');
    // Convert TTPBRow to TandaTerimaDokumenPembelianFormData format
    const formData: TandaTerimaDokumenPembelianFormData = {
      id: row.id,
      noTTPB: row.noTTPB,
      tglTTPB: new Date(row.tglTTPB),
      divisi: row.namaDivisi,
      diserahkanOleh: row.diserahkanOleh,
      diterimaOleh: row.diterimaOleh,
      keteranganUmum: 'Dokumen pembelian untuk ' + row.namaDivisi,
      detailItems: [{ 
        id: 1, 
        jenisDokumen: 'Purchase Order', 
        noDokumen: 'PO-2025-001', 
        namaDokumen: 'Purchase Order Sept 2025', 
        pengirim: row.diserahkanOleh, 
        jumlahBerkas: 1, 
        keterangan: 'Asli' 
      }],
      tanggalDiterima: row.tanggalDiterima ? new Date(row.tanggalDiterima) : null,
      uploadDokumen: null, // File objects can't be reconstructed, will show as empty
    };
    setEditingData(formData);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setRows(prevRows => prevRows.filter(row => row.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleSave = (data: TandaTerimaDokumenPembelianFormData) => {
    if (data.id) {
      // Update existing row
      setRows(prevRows => prevRows.map(row => 
        row.id === data.id ? {
          ...row,
          noTTPB: data.noTTPB,
          tglTTPB: data.tglTTPB ? data.tglTTPB.toISOString().split('T')[0] : row.tglTTPB,
          diserahkanOleh: data.diserahkanOleh,
          diterimaOleh: data.diterimaOleh,
          namaDivisi: data.divisi,
          tanggalDiterima: data.tanggalDiterima ? data.tanggalDiterima.toISOString().split('T')[0] : undefined,
          uploadDokumen: data.uploadDokumen ? data.uploadDokumen.name : row.uploadDokumen,
        } : row
      ));
    } else {
      // Add new row
      const newId = Math.max(...rows.map(r => r.id)) + 1;
      const newRow: TTPBRow = {
        id: newId,
        noTTPB: data.noTTPB || generateNextTTPBNumber(),
        tglTTPB: data.tglTTPB ? data.tglTTPB.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        diserahkanOleh: data.diserahkanOleh,
        diterimaOleh: data.diterimaOleh,
        namaDivisi: data.divisi,
        tglDiserahkanPurchasing: new Date().toISOString().split('T')[0],
        tglDiterimaKeuangan: new Date().toISOString().split('T')[0],
        tanggalDiterima: data.tanggalDiterima ? data.tanggalDiterima.toISOString().split('T')[0] : undefined,
        uploadDokumen: data.uploadDokumen ? data.uploadDokumen.name : undefined,
      };
      setRows(prevRows => [...prevRows, newRow]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">TANDA TERIMA DOKUMEN PEMBELIAN (TTPB)</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">TTPB</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter TTPB</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. TTPB</label>
              <input type="text" value={searchNo} onChange={e => setSearchNo(e.target.value)} placeholder="TTPB-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Divisi</label>
              <select value={divisi} onChange={e => setDivisi(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua</option>
                {divisiOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl TTPB Dari</label>
              <input type="date" value={dari} onChange={e => setDari(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tgl TTPB Sampai</label>
              <input type="date" value={sampai} onChange={e => setSampai(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
            </div>
            <div className="flex items-end">
              <button className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Cari
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" /> Tambah
            </button>
            <div className="flex space-x-4">
              <button onClick={exportExcel} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700">
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
              </button>
              <button onClick={exportPDF} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700">
                <FileDown className="h-4 w-4 mr-2" /> Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar TTPB</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. TTPB</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl TTPB  (….... s/d…...)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Diterima</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diserahkan oleh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diterima oleh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Divisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl diserahkan Purchasing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl di terima Keuangan</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{row.noTTPB}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglTTPB).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tanggalDiterima ? new Date(row.tanggalDiterima).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.diserahkanOleh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.diterimaOleh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaDivisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.uploadDokumen ? (
                        <a href="#" className="text-blue-600 hover:text-blue-800 underline" title={row.uploadDokumen}>
                          {row.uploadDokumen.length > 20 ? `${row.uploadDokumen.substring(0, 20)}...` : row.uploadDokumen}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglDiserahkanPurchasing ? new Date(row.tglDiserahkanPurchasing).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglDiterimaKeuangan ? new Date(row.tglDiterimaKeuangan).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-800 p-1" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-800 p-1" title="Hapus">
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

      {/* Modal Component */}
      <FinanceTandaTerimaDokumenPembelianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={modalTitle}
        initialData={editingData}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus dokumen pembelian ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
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

export default FinanceTandaTerimaDokumenPembelianDashboard;
