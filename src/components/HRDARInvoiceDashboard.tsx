import React, { useEffect, useMemo, useState } from 'react';
import { Clock, PlusCircle, FileSpreadsheet, FileDown, Edit, Trash2, Search } from 'lucide-react';
import Modal from 'react-modal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface ARInvoiceRow {
  id: number;
  noInvoice: string;
  tglInvoice: string; // yyyy-mm-dd
  kodeCustomer: string;
  namaCustomer: string;
  noNpwpNik: string;
  noFakturPajak: string;
  mataUang: string; // e.g., IDR, USD
  pajak: string; // e.g., PPN 11%
  noSO: string;
  noPI: string;
  tglJatuhTempo: string; // yyyy-mm-dd
  kodeBank: string;
  kodeBarang: string;
  namaBarang: string;
  qty: number;
  subtotal: number;
  ppn: number;
  total: number;
}

interface InvoiceFormData extends Omit<ARInvoiceRow, 'id' | 'total'> {
  id?: number;
}

const emptyForm: InvoiceFormData = {
  noInvoice: '',
  tglInvoice: '',
  kodeCustomer: '',
  namaCustomer: '',
  noNpwpNik: '',
  noFakturPajak: '',
  mataUang: 'IDR',
  pajak: 'PPN 11%',
  noSO: '',
  noPI: '',
  tglJatuhTempo: '',
  kodeBank: '',
  kodeBarang: '',
  namaBarang: '',
  qty: 1,
  subtotal: 0,
  ppn: 0,
};

const HRDARInvoiceDashboard: React.FC = () => {
  const today = new Date();

  // filters
  const [searchNoInv, setSearchNoInv] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [periodeDari, setPeriodeDari] = useState<string>('');
  const [periodeSampai, setPeriodeSampai] = useState<string>('');

  // data
  const [rows, setRows] = useState<ARInvoiceRow[]>([
    {
      id: 1,
      noInvoice: 'INV-AR-0001',
      tglInvoice: '2025-09-01',
      kodeCustomer: 'CUST-001',
      namaCustomer: 'PT Nusantara Sejahtera',
      noNpwpNik: '01.234.567.8-910.000',
      noFakturPajak: '010.001-23.12345678',
      mataUang: 'IDR',
      pajak: 'PPN 11%',
      noSO: 'SO-001',
      noPI: 'PI-001',
      tglJatuhTempo: '2025-09-30',
      kodeBank: 'BCA',
      kodeBarang: 'BRG-001',
      namaBarang: 'Jasa Konsultasi',
      qty: 2,
      subtotal: 20000000,
      ppn: 2200000,
      total: 22200000,
    },
  ]);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Tambah Invoice');
  const [form, setForm] = useState<InvoiceFormData>(emptyForm);

  // delete state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ARInvoiceRow | null>(null);

  useEffect(() => {
    try { Modal.setAppElement('#root'); } catch {}
  }, []);

  const filtered = useMemo(() => rows.filter(r => {
    const okInv = searchNoInv ? r.noInvoice.toLowerCase().includes(searchNoInv.toLowerCase()) : true;
    const okCust = searchCustomer ? r.namaCustomer.toLowerCase().includes(searchCustomer.toLowerCase()) : true;
    const okFrom = periodeDari ? new Date(r.tglInvoice) >= new Date(`${periodeDari}T00:00:00`) : true;
    const okTo = periodeSampai ? new Date(r.tglInvoice) <= new Date(`${periodeSampai}T23:59:59`) : true;
    return okInv && okCust && okFrom && okTo;
  }), [rows, searchNoInv, searchCustomer, periodeDari, periodeSampai]);

  const handleAdd = () => {
    setForm(emptyForm);
    setModalTitle('Tambah Invoice');
    setIsModalOpen(true);
  };

  const handleEdit = (r: ARInvoiceRow) => {
    const { id, total, ...rest } = r;
    setForm({ id, ...rest });
    setModalTitle('Edit Invoice');
    setIsModalOpen(true);
  };

  const handleDelete = (r: ARInvoiceRow) => {
    setRowToDelete(r);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      setRows(prev => prev.filter(x => x.id !== rowToDelete.id));
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'qty' || name === 'subtotal' || name === 'ppn' ? Number(value) : value,
    }));
  };

  const computeTotal = (sub: number, ppn: number) => sub + ppn;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const total = computeTotal(form.subtotal || 0, form.ppn || 0);
    if (form.id) {
      setRows(prev => prev.map(r => r.id === form.id ? { id: form.id!, total, ...form } as ARInvoiceRow : r));
    } else {
      const newId = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1;
      setRows(prev => [{ id: newId, total, ...form } as ARInvoiceRow, ...prev]);
    }
    closeModal();
  };

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">LOGIN HRD AR - INVOICE</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">HRD</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">AR</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Invoice</span>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. Invoice</label>
              <input name="noInvoice" value={searchNoInv} onChange={e => setSearchNoInv(e.target.value)} placeholder="INV-..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Customer</label>
              <input name="namaCustomer" value={searchCustomer} onChange={e => setSearchCustomer(e.target.value)} placeholder="PT ..." className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode (Tgl Invoice) Dari</label>
              <input type="date" value={periodeDari} onChange={e => setPeriodeDari(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode (Tgl Invoice) Sampai</label>
              <input type="date" value={periodeSampai} onChange={e => setPeriodeSampai(e.target.value)} className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
            </div>
            <div className="flex items-end">
              <button className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none h-[42px]">
                <Search className="h-4 w-4 mr-2" /> Cari
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center space-y-3 md:space-y-0 md:space-x-3 mt-6">
            <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Invoice
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Invoice</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Invoice (….... s/d …...)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No NPWP / No.NIK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Faktur Pajak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mata Uang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pajak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No SO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No PI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl JT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode bank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PPN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{row.noInvoice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglInvoice).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.kodeCustomer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaCustomer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noNpwpNik}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noFakturPajak}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.mataUang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.pajak}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noSO}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.noPI}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(row.tglJatuhTempo).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.kodeBank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.kodeBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {row.subtotal.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {row.ppn.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Rp {row.total.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(row)} className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50" title="Hapus">
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

      {/* Modal Tambah/Edit */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={modalTitle}
        className="max-w-3xl w-[95%] mx-auto mt-20 bg-white rounded-xl shadow-xl p-6 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{modalTitle}</h3>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No.Invoice</label>
            <input name="noInvoice" value={form.noInvoice} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Invoice</label>
            <input type="date" name="tglInvoice" value={form.tglInvoice} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode Customer</label>
            <input name="kodeCustomer" value={form.kodeCustomer} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Customer</label>
            <input name="namaCustomer" value={form.namaCustomer} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No NPWP / No.NIK</label>
            <input name="noNpwpNik" value={form.noNpwpNik} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No Faktur Pajak</label>
            <input name="noFakturPajak" value={form.noFakturPajak} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Uang</label>
            <select name="mataUang" value={form.mataUang} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pajak</label>
            <select name="pajak" value={form.pajak} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="PPN 11%">PPN 11%</option>
              <option value="Non PPN">Non PPN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No SO</label>
            <input name="noSO" value={form.noSO} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No PI</label>
            <input name="noPI" value={form.noPI} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tgl JT</label>
            <input type="date" name="tglJatuhTempo" value={form.tglJatuhTempo} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode bank</label>
            <input name="kodeBank" value={form.kodeBank} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode barang</label>
            <input name="kodeBarang" value={form.kodeBarang} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
            <input name="namaBarang" value={form.namaBarang} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
            <input type="number" min={0} name="qty" value={form.qty} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
            <input type="number" min={0} name="subtotal" value={form.subtotal} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PPN</label>
            <input type="number" min={0} name="ppn" value={form.ppn} onChange={handleFormChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        itemName={rowToDelete?.noInvoice}
        message="Apakah Anda yakin ingin menghapus invoice ini?"
      />
    </div>
  );
};

export default HRDARInvoiceDashboard;
