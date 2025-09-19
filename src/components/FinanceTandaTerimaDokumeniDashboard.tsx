import React, { useMemo, useState } from 'react';
import { Clock, PlusCircle, FileSpreadsheet, FileDown, Edit, Trash2, Search } from 'lucide-react';
import FinanceTandaTerimaDokumeniModal, { TandaTerimaDokumeniFormData } from './FinanceTandaTerimaDokumeniModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface TTDRow {
  id: number;
  tanggal: string; // yyyy-mm-dd
  noTTD: string;
  divisi: string;
  penerima: string;
  pengirim: string;
  keterangan: string;
  jumlahBerkas: number;
  // New fields for TTPG display
  tglDiserahkanProcon?: string; // yyyy-mm-dd
  tglDiterimaAR?: string; // yyyy-mm-dd
  tglDiterimaCustomer?: string; // yyyy-mm-dd
  // New fields for Dokumen Penagihan requirements
  tanggalDokumen?: string; // yyyy-mm-dd
  uploadDokumen?: string; // file path or name
  noSO?: string; // SO number for document reference
}

const FinanceTandaTerimaDokumeniDashboard: React.FC = () => {
  const today = new Date();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Tambah Tanda Terima Dokumen');
  const [editingData, setEditingData] = useState<TandaTerimaDokumeniFormData | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<TTDRow | null>(null);

  const [searchNo, setSearchNo] = useState('');
  const [searchPengirim, setSearchPengirim] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [searchNoSO, setSearchNoSO] = useState('');

  const divisiOptions = ['Marketing','HRD','GA','Procurement','Project Control','Operasional','QHSE','Finance','Accounting','Tax','Gudang'];

  const [rows, setRows] = useState<TTDRow[]>([
    { 
      id: 1, 
      tanggal: '2025-09-08', 
      noTTD: 'TTPG-2025-09-001', 
      divisi: 'Finance', 
      penerima: 'Andi', 
      pengirim: 'Vendor A', 
      keterangan: 'Dokumen Invoice', 
      jumlahBerkas: 3, 
      tglDiserahkanProcon: '2025-09-09', 
      tglDiterimaAR: '2025-09-10', 
      tglDiterimaCustomer: '2025-09-12',
      tanggalDokumen: '2025-09-08',
      uploadDokumen: 'invoice_SO2025001.pdf',
      noSO: 'SO-2025-001'
    },
    { 
      id: 2, 
      tanggal: '2025-09-09', 
      noTTD: 'TTPG-2025-09-002', 
      divisi: 'Accounting', 
      penerima: 'Dewi', 
      pengirim: 'Kurir', 
      keterangan: 'BAST & Faktur', 
      jumlahBerkas: 2, 
      tglDiserahkanProcon: '2025-09-10', 
      tglDiterimaAR: '2025-09-11',
      tanggalDokumen: '2025-09-09',
      uploadDokumen: 'bast_faktur_SO2025002.pdf',
      noSO: 'SO-2025-002'
    },
  ]);

  const handleAdd = () => {
    setEditingData(null);
    setModalTitle('Tambah Tanda Terima Dokumen');
    setIsModalOpen(true);
  };

  const handleEdit = (row: TTDRow) => {
    const data: TandaTerimaDokumeniFormData = {
      id: row.id,
      noTTD: row.noTTD,
      tglTTD: new Date(row.tanggal),
      divisi: row.divisi,
      penerima: row.penerima,
      pengirim: row.pengirim,
      keteranganUmum: row.keterangan,
      detailItems: [{ id: 1, jenisDokumen: 'Invoice', noDokumen: 'INV-2025-0001', namaDokumen: 'Invoice Sept 2025', pengirim: row.pengirim, jumlahBerkas: row.jumlahBerkas, keterangan: 'Asli' }],
      // Include new fields for editing
      tanggalDokumen: row.tanggalDokumen ? new Date(row.tanggalDokumen) : null,
      uploadDokumen: null, // File objects can't be reconstructed, will show as empty
      noSO: row.noSO || '',
    };
    setEditingData(data);
    setModalTitle('Edit Tanda Terima Dokumen');
    setIsModalOpen(true);
  };

  const handleSave = (data: TandaTerimaDokumeniFormData) => {
    if (data.id) {
      // Update existing row
      setRows(prev => prev.map(r => r.id === data.id ? {
        ...r,
        id: data.id!,
        tanggal: data.tglTTD ? data.tglTTD.toISOString().split('T')[0] : r.tanggal,
        noTTD: data.noTTD,
        divisi: data.divisi,
        penerima: data.penerima,
        pengirim: data.pengirim,
        keterangan: data.keteranganUmum,
        jumlahBerkas: data.detailItems.reduce((s, d) => s + (d.jumlahBerkas || 0), 0),
        // Update new fields
        tanggalDokumen: data.tanggalDokumen ? data.tanggalDokumen.toISOString().split('T')[0] : r.tanggalDokumen,
        uploadDokumen: data.uploadDokumen ? data.uploadDokumen.name : r.uploadDokumen,
        noSO: data.noSO || r.noSO,
      } : r));
    } else {
      // Create new row
      const newId = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1;
      const newRow: TTDRow = {
        id: newId,
        tanggal: data.tglTTD ? data.tglTTD.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        noTTD: data.noTTD,
        divisi: data.divisi,
        penerima: data.penerima,
        pengirim: data.pengirim,
        keterangan: data.keteranganUmum,
        jumlahBerkas: data.detailItems.reduce((s, d) => s + (d.jumlahBerkas || 0), 0),
        // Add new fields
        tanggalDokumen: data.tanggalDokumen ? data.tanggalDokumen.toISOString().split('T')[0] : undefined,
        uploadDokumen: data.uploadDokumen ? data.uploadDokumen.name : undefined,
        noSO: data.noSO || undefined,
        // Default values for other fields
        tglDiserahkanProcon: undefined,
        tglDiterimaAR: undefined,
        tglDiterimaCustomer: undefined,
      };
      setRows(prev => [...prev, newRow]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (row: TTDRow) => { setRowToDelete(row); setIsConfirmOpen(true); };
  const confirmDelete = () => { if (rowToDelete) setRows(prev => prev.filter(r => r.id !== rowToDelete.id)); };

  const filtered = useMemo(() => rows.filter(r => {
    const okNo = searchNo ? r.noTTD.toLowerCase().includes(searchNo.toLowerCase()) : true;
    const okPengirim = searchPengirim ? r.pengirim.toLowerCase().includes(searchPengirim.toLowerCase()) : true;
    const okDiv = filterDivisi ? r.divisi === filterDivisi : true;
    const okSO = searchNoSO ? (r.noSO && r.noSO.toLowerCase().includes(searchNoSO.toLowerCase())) : true;
    return okNo && okPengirim && okDiv && okSO;
  }), [rows, searchNo, searchPengirim, filterDivisi, searchNoSO]);

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">Dokumen Penagihan</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Dokmmen Penagihan</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No TTD</label>
              <input type="text" value={searchNo} onChange={e => setSearchNo(e.target.value)} placeholder="TTD-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pengirim</label>
              <input type="text" value={searchPengirim} onChange={e => setSearchPengirim(e.target.value)} placeholder="Nama pengirim..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Divisi</label>
              <select value={filterDivisi} onChange={e => setFilterDivisi(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                <option value="">Semua Divisi</option>
                {divisiOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No SO</label>
              <input type="text" value={searchNoSO} onChange={e => setSearchNoSO(e.target.value)} placeholder="SO-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div className="flex items-end">
              <button onClick={() => { /* trigger memo */ }} className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Cari Data
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center space-y-3 md:space-y-0 md:space-x-3 mt-2">
            <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah TTD
            </button>
            <button onClick={exportExcel} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 w-full md:w-auto">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </button>
            <button onClick={exportPDF} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 w-full md:w-auto">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Dokumen Penagihan</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Dokumen</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Dokumen</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No SO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diserahkan oleh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diterima oleh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl diserahkan Procon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl di terima AR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl di terima Customer</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{row.noTTD}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tanggal).toLocaleDateString('id-ID')}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tanggalDokumen ? new Date(row.tanggalDokumen).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noSO || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.pengirim}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.penerima}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.uploadDokumen ? (
                        <a href="#" className="text-blue-600 hover:text-blue-800 underline" title={row.uploadDokumen}>
                          {row.uploadDokumen.length > 20 ? `${row.uploadDokumen.substring(0, 20)}...` : row.uploadDokumen}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglDiserahkanProcon ? new Date(row.tglDiserahkanProcon).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglDiterimaAR ? new Date(row.tglDiterimaAR).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tglDiterimaCustomer ? new Date(row.tglDiterimaCustomer).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-800 p-1" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(row)} className="text-red-600 hover:text-red-800 p-1" title="Hapus">
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

      <FinanceTandaTerimaDokumeniModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingData}
        title={modalTitle}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={rowToDelete?.noTTD}
        message="Apakah Anda yakin ingin menghapus Tanda Terima Dokumen ini?"
      />
    </div>
  );
};

export default FinanceTandaTerimaDokumeniDashboard;
