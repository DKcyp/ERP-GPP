import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, PlusCircle, Save, Trash2, Loader2 } from 'lucide-react';

export interface BKKDetailItem {
  id: number;
  kodeKas: string;
  namaKas: string;
  nominal: number;
}

export interface BKKKeluarFormData {
  id?: number;
  noBKK: string;
  tglBKK: Date | null;
  namaDivisi: string;
  jenisTransaksi: string;
  noDokumen: string;
  bayarKepada: string;
  keterangan: string;
  detailItems: BKKDetailItem[];
  total: number;
}

interface FinanceBuktiKasKeluarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BKKKeluarFormData) => void;
  initialData?: BKKKeluarFormData | null;
  title: string;
}

const FinanceBuktiKasKeluarModal: React.FC<FinanceBuktiKasKeluarModalProps> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const today = new Date();

  const initialEmpty: BKKKeluarFormData = {
    noBKK: `BKK-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-001`,
    tglBKK: today,
    namaDivisi: '',
    jenisTransaksi: '',
    noDokumen: '',
    bayarKepada: '',
    keterangan: '',
    detailItems: [{ id: 1, kodeKas: '', namaKas: '', nominal: 0 }],
    total: 0,
  };

  const [formData, setFormData] = useState<BKKKeluarFormData>(initialEmpty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const divisiOptions = [
    'Marketing', 'HRD', 'GA', 'Procurement', 'Project Control', 'Operasional', 'QHSE', 'Finance', 'Accounting', 'Tax', 'Gudang',
  ];

  const jenisTransaksiOptions = [
    'Bayar Uang Muka', 'Pembelian Barang', 'Pelunasan Hutang', 'Pengeluaran Akun', 'Kurang Bayar', 'Pinjaman', 'Lain-Lain',
  ];

  const namaKasOptions = [
    'Kas HealthyWeek', 'Kas Marketing', 'Kas Operasional', 'Kas Kantor', 'Kas Pengajian', 'Kas Tampungan',
  ];

  const namaKasToKode = (nama: string): string => {
    switch (nama) {
      case 'Kas HealthyWeek': return 'KAS-HW';
      case 'Kas Marketing': return 'KAS-MKT';
      case 'Kas Operasional': return 'KAS-OPS';
      case 'Kas Kantor': return 'KAS-KTR';
      case 'Kas Pengajian': return 'KAS-PGJ';
      case 'Kas Tampungan': return 'KAS-TMP';
      default: return '';
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setFormData(initialData ? { ...initialData, tglBKK: initialData.tglBKK ? new Date(initialData.tglBKK) : today, total: calcTotal(initialData.detailItems) } : initialEmpty);
      setErrors({});
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      setFormData(initialEmpty);
      setErrors({});
    };
  }, [isOpen, onClose, initialData]);

  const calcTotal = (items: BKKDetailItem[]) => items.reduce((sum, it) => sum + (Number(it.nominal) || 0), 0);

  const handleAddRow = () => setFormData(prev => ({ ...prev, detailItems: [...prev.detailItems, { id: prev.detailItems.length + 1, kodeKas: '', namaKas: '', nominal: 0 }] }));

  const handleRemoveRow = (id: number) => {
    setFormData(prev => { const updated = prev.detailItems.filter(it => it.id !== id); return { ...prev, detailItems: updated, total: calcTotal(updated) }; });
  };

  const handleDetailChange = (id: number, field: keyof BKKDetailItem, value: any) => {
    setFormData(prev => { const updated = prev.detailItems.map(it => (it.id === id ? { ...it, [field]: value } : it)); return { ...prev, detailItems: updated, total: calcTotal(updated) }; });
  };

  const handleNamaKasChange = (id: number, namaKas: string) => {
    setFormData(prev => { const updated = prev.detailItems.map(it => it.id === id ? { ...it, namaKas, kodeKas: namaKasToKode(namaKas) } : it); return { ...prev, detailItems: updated, total: calcTotal(updated) }; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.noBKK.trim()) e.noBKK = 'No BKK wajib diisi';
    if (!formData.tglBKK) e.tglBKK = 'Tanggal BKK wajib diisi';
    if (!formData.namaDivisi.trim()) e.namaDivisi = 'Nama divisi wajib dipilih';
    if (!formData.jenisTransaksi.trim()) e.jenisTransaksi = 'Jenis transaksi wajib dipilih';
    if (!formData.noDokumen.trim()) e.noDokumen = 'No dokumen wajib diisi';
    if (!formData.bayarKepada.trim()) e.bayarKepada = 'Bayar kepada wajib diisi';
    if (!formData.keterangan.trim()) e.keterangan = 'Keterangan wajib diisi';
    if (formData.detailItems.length === 0) e.detailItems = 'Minimal satu baris detail diperlukan';
    else formData.detailItems.forEach((it, idx) => {
      if (!it.kodeKas.trim()) e[`detailItems[${idx}].kodeKas`] = 'Kode kas wajib diisi';
      if (!it.namaKas.trim()) e[`detailItems[${idx}].namaKas`] = 'Nama kas wajib diisi';
      if (!it.nominal || it.nominal <= 0) e[`detailItems[${idx}].nominal`] = 'Nominal harus > 0';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    onSave({ ...formData, total: calcTotal(formData.detailItems) });
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No BKK <span className="text-red-500">*</span></label>
                <input type="text" value={formData.noBKK} onChange={e => setFormData(prev => ({ ...prev, noBKK: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.noBKK ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.noBKK && <p className="mt-1 text-sm text-red-600">{errors.noBKK}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tgl BKK <span className="text-red-500">*</span></label>
                <DatePicker selected={formData.tglBKK} onChange={(date: Date | null) => setFormData(prev => ({ ...prev, tglBKK: date }))} dateFormat="dd/MM/yyyy" className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.tglBKK ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.tglBKK && <p className="mt-1 text-sm text-red-600">{errors.tglBKK}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Divisi <span className="text-red-500">*</span></label>
                <select value={formData.namaDivisi} onChange={e => setFormData(prev => ({ ...prev, namaDivisi: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm appearance-none ${errors.namaDivisi ? 'border-red-300' : 'border-gray-300'}`}>
                  <option value="">Pilih Divisi</option>
                  {divisiOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
                {errors.namaDivisi && <p className="mt-1 text-sm text-red-600">{errors.namaDivisi}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi <span className="text-red-500">*</span></label>
                <select value={formData.jenisTransaksi} onChange={e => setFormData(prev => ({ ...prev, jenisTransaksi: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm appearance-none ${errors.jenisTransaksi ? 'border-red-300' : 'border-gray-300'}`}>
                  <option value="">Pilih Jenis</option>
                  {jenisTransaksiOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
                {errors.jenisTransaksi && <p className="mt-1 text-sm text-red-600">{errors.jenisTransaksi}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No Dokumen <span className="text-red-500">*</span></label>
                <input type="text" value={formData.noDokumen} onChange={e => setFormData(prev => ({ ...prev, noDokumen: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.noDokumen ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.noDokumen && <p className="mt-1 text-sm text-red-600">{errors.noDokumen}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bayar Kepada <span className="text-red-500">*</span></label>
                <input type="text" value={formData.bayarKepada} onChange={e => setFormData(prev => ({ ...prev, bayarKepada: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.bayarKepada ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.bayarKepada && <p className="mt-1 text-sm text-red-600">{errors.bayarKepada}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan <span className="text-red-500">*</span></label>
                <textarea rows={3} value={formData.keterangan} onChange={e => setFormData(prev => ({ ...prev, keterangan: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.keterangan ? 'border-red-300' : 'border-gray-300'}`} placeholder="Masukkan keterangan..."></textarea>
                {errors.keterangan && <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>}
              </div>
            </div>

            <h4 className="text-xl font-bold text-gray-800">Detail Kas</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kode Kas <span className="text-red-500">*</span></th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Kas <span className="text-red-500">*</span></th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nominal <span className="text-red-500">*</span></th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.detailItems.map((it, idx) => (
                    <tr key={it.id}>
                      <td className="px-4 py-2">
                        <input type="text" value={it.kodeKas} readOnly className={`block w-full border rounded-lg px-2 py-1.5 text-sm bg-gray-50 ${errors[`detailItems[${idx}].kodeKas`] ? 'border-red-300' : 'border-gray-300'}`} placeholder="Kode Kas" />
                        {errors[`detailItems[${idx}].kodeKas`] && <p className="mt-1 text-xs text-red-600">{errors[`detailItems[${idx}].kodeKas`]}</p>}
                      </td>
                      <td className="px-4 py-2">
                        <select value={it.namaKas} onChange={e => handleNamaKasChange(it.id, e.target.value)} className={`block w-full border rounded-lg py-1.5 text-sm ${errors[`detailItems[${idx}].namaKas`] ? 'border-red-300' : 'border-gray-300'}`}>
                          <option value="">Pilih Nama Kas</option>
                          {namaKasOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                        </select>
                        {errors[`detailItems[${idx}].namaKas`] && <p className="mt-1 text-xs text-red-600">{errors[`detailItems[${idx}].namaKas`]}</p>}
                      </td>
                      <td className="px-4 py-2">
                        <input type="number" value={it.nominal} onChange={e => handleDetailChange(it.id, 'nominal', parseFloat(e.target.value) || 0)} className={`block w-full border rounded-lg px-2 py-1.5 text-sm ${errors[`detailItems[${idx}].nominal`] ? 'border-red-300' : 'border-gray-300'}`} placeholder="0" />
                        {errors[`detailItems[${idx}].nominal`] && <p className="mt-1 text-xs text-red-600">{errors[`detailItems[${idx}].nominal`]}</p>}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button type="button" onClick={() => handleRemoveRow(it.id)} className="inline-flex items-center px-2 py-1 text-xs text-white bg-red-600 rounded-md hover:bg-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center">
              <button type="button" onClick={handleAddRow} className="inline-flex items-center px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700">
                <PlusCircle className="h-5 w-5 mr-2" /> Tambah Baris
              </button>
              <div className="text-lg font-bold text-gray-900">Total: Rp {formData.total.toLocaleString('id-ID')}</div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Tutup</button>
          <button type="submit" onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm inline-flex items-center">
            {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" /> Menyimpan...</>) : (<><Save className="h-4 w-4 mr-2" /> Simpan</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceBuktiKasKeluarModal;
