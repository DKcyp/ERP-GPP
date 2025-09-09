import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, PlusCircle, Save, Trash2, Loader2 } from 'lucide-react';

interface PPDDetailItem {
  id: number;
  kodeBank: string;
  namaBank: string; // display label: Nama Bank (norek - alamat)
  norek: string;
  alamat: string;
  nominal: number;
  keterangan: string;
}

export interface PermintaanPencairanDanaFormData {
  id?: number;
  noPPD: string;
  tglPPD: Date | null;
  divisi: string;
  pemohon: string;
  keperluanUmum: string;
  detailItems: PPDDetailItem[];
  total: number;
}

interface FinancePermintaanPencairanDanaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PermintaanPencairanDanaFormData) => void;
  initialData?: PermintaanPencairanDanaFormData | null;
  title: string;
}

const bankMeta: Record<string, { kode: string; norek: string; alamat: string }> = {
  'Bank Muamalat': { kode: 'MUAMALAT', norek: '1234567890', alamat: 'Jl. Jend. Sudirman No. 1, Jakarta' },
  'Bank Mandiri Gaji': { kode: 'MANDIRI-GAJI', norek: '1400012345678', alamat: 'KCP Mandiri Gaji, Jl. Gatot Subroto, Jakarta' },
  'Bank Mandiri Operasional': { kode: 'MANDIRI-OPS', norek: '1400098765432', alamat: 'KCP Mandiri Operasional, Jl. MH Thamrin, Jakarta' },
  'Bank Mandiri Tabungan': { kode: 'MANDIRI-TAB', norek: '1400076543210', alamat: 'KCP Mandiri Tabungan, Jl. Asia Afrika, Bandung' },
  'Bank Mandiri PPN': { kode: 'MANDIRI-PPN', norek: '1400055512345', alamat: 'KCP Mandiri Pajak, Jl. Jend. Sudirman, Jakarta' },
  'Bank Mandiri Vendor': { kode: 'MANDIRI-VENDOR', norek: '1400033345678', alamat: 'KCP Mandiri Vendor, Jl. Pemuda, Jakarta' },
  'Bank Mandiri Kesejahteraan': { kode: 'MANDIRI-KES', norek: '1400022245678', alamat: 'KCP Mandiri Kesejahteraan, Jl. Diponegoro, Surabaya' },
  'Bank Mandiri Zakat': { kode: 'MANDIRI-ZKT', norek: '1400099912345', alamat: 'KCP Mandiri Zakat, Jl. Asia Afrika, Bandung' },
  'Bank BCA': { kode: 'BCA', norek: '8888888888', alamat: 'KCU BCA, Jl. Jend. Sudirman, Jakarta' },
};

const formatBankOption = (base: string) => {
  const m = bankMeta[base];
  return m ? `${base} (${m.norek} - ${m.alamat})` : base;
};
const parseBaseBankName = (label: string) => label.split(' (')[0];
const namaBankOptions = Object.keys(bankMeta).map(formatBankOption);

const FinancePermintaanPencairanDanaModal: React.FC<FinancePermintaanPencairanDanaModalProps> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const today = new Date();
  const divisiOptions = ['Marketing','HRD','GA','Procurement','Project Control','Operasional','QHSE','Finance','Accounting','Tax','Gudang'];

  const initialEmpty: PermintaanPencairanDanaFormData = {
    noPPD: `PPD-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-001`,
    tglPPD: today,
    divisi: '',
    pemohon: '',
    keperluanUmum: '',
    detailItems: [{ id: 1, kodeBank: '', namaBank: '', norek: '', alamat: '', nominal: 0, keterangan: '' }],
    total: 0,
  };

  const [formData, setFormData] = useState<PermintaanPencairanDanaFormData>(initialEmpty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setFormData(initialData ? { ...initialData, tglPPD: initialData.tglPPD ? new Date(initialData.tglPPD) : today, total: calcTotal(initialData.detailItems) } : initialEmpty);
      setErrors({});
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      setFormData(initialEmpty);
      setErrors({});
    };
  }, [isOpen, onClose, initialData]);

  const calcTotal = (items: PPDDetailItem[]) => items.reduce((sum, it) => sum + (Number(it.nominal) || 0), 0);

  const handleAddRow = () => setFormData(prev => ({ ...prev, detailItems: [...prev.detailItems, { id: prev.detailItems.length + 1, kodeBank: '', namaBank: '', norek: '', alamat: '', nominal: 0, keterangan: '' }] }));
  const handleRemoveRow = (id: number) => setFormData(prev => { const updated = prev.detailItems.filter(it => it.id !== id); return { ...prev, detailItems: updated, total: calcTotal(updated) }; });

  const handleDetailChange = (id: number, field: keyof PPDDetailItem, value: any) => {
    setFormData(prev => { const updated = prev.detailItems.map(it => (it.id === id ? { ...it, [field]: value } : it)); return { ...prev, detailItems: updated, total: calcTotal(updated) }; });
  };
  const handleNamaBankChange = (id: number, namaBankLabel: string) => {
    setFormData(prev => {
      const base = parseBaseBankName(namaBankLabel);
      const meta = bankMeta[base] || { kode: '', norek: '', alamat: '' };
      const display = formatBankOption(base);
      const updated = prev.detailItems.map(it => it.id === id ? { ...it, namaBank: display, kodeBank: meta.kode, norek: meta.norek, alamat: meta.alamat } : it);
      return { ...prev, detailItems: updated, total: calcTotal(updated) };
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.noPPD.trim()) e.noPPD = 'No PPD wajib diisi';
    if (!formData.tglPPD) e.tglPPD = 'Tanggal wajib diisi';
    if (!formData.divisi.trim()) e.divisi = 'Divisi wajib dipilih';
    if (!formData.pemohon.trim()) e.pemohon = 'Pemohon wajib diisi';
    if (formData.detailItems.length === 0) e.detailItems = 'Minimal satu baris detail diperlukan';
    else formData.detailItems.forEach((it, idx) => {
      if (!it.kodeBank.trim()) e[`detailItems[${idx}].kodeBank`] = 'Kode bank wajib diisi';
      if (!it.namaBank.trim()) e[`detailItems[${idx}].namaBank`] = 'Nama bank wajib diisi';
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">No PPD <span className="text-red-500">*</span></label>
                <input type="text" value={formData.noPPD} onChange={e => setFormData(prev => ({ ...prev, noPPD: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.noPPD ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.noPPD && <p className="mt-1 text-sm text-red-600">{errors.noPPD}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal <span className="text-red-500">*</span></label>
                <DatePicker selected={formData.tglPPD} onChange={(date: Date | null) => setFormData(prev => ({ ...prev, tglPPD: date }))} dateFormat="dd/MM/yyyy" className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.tglPPD ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.tglPPD && <p className="mt-1 text-sm text-red-600">{errors.tglPPD}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Divisi <span className="text-red-500">*</span></label>
                <select value={formData.divisi} onChange={e => setFormData(prev => ({ ...prev, divisi: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm appearance-none ${errors.divisi ? 'border-red-300' : 'border-gray-300'}`}>
                  <option value="">Pilih Divisi</option>
                  {divisiOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
                {errors.divisi && <p className="mt-1 text-sm text-red-600">{errors.divisi}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pemohon <span className="text-red-500">*</span></label>
                <input type="text" value={formData.pemohon} onChange={e => setFormData(prev => ({ ...prev, pemohon: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.pemohon ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.pemohon && <p className="mt-1 text-sm text-red-600">{errors.pemohon}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Keperluan</label>
                <textarea rows={3} value={formData.keperluanUmum} onChange={e => setFormData(prev => ({ ...prev, keperluanUmum: e.target.value }))} className="block w-full border rounded-lg px-4 py-2 text-sm" placeholder="Tuliskan keperluan pencairan dana..."></textarea>
              </div>
            </div>

            <h4 className="text-xl font-bold text-gray-800">Detail Pencairan</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kode Bank</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Bank (norek - alamat)</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Nominal</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.detailItems.map((it, idx) => (
                    <tr key={it.id}>
                      <td className="px-4 py-2">
                        <input type="text" value={it.kodeBank} readOnly className="block w-full border rounded-lg px-2 py-1.5 text-sm bg-gray-50" placeholder="Kode Bank" />
                      </td>
                      <td className="px-4 py-2">
                        <select value={it.namaBank} onChange={e => handleNamaBankChange(it.id, e.target.value)} className={`block w-full border rounded-lg py-1.5 text-sm ${errors[`detailItems[${idx}].namaBank`] ? 'border-red-300' : 'border-gray-300'}`}>
                          <option value="">Pilih Nama Bank</option>
                          {namaBankOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                        </select>
                        {errors[`detailItems[${idx}].namaBank`] && <p className="mt-1 text-xs text-red-600">{errors[`detailItems[${idx}].namaBank`]}</p>}
                      </td>
                      <td className="px-4 py-2">
                        <input type="number" value={it.nominal} onChange={e => handleDetailChange(it.id, 'nominal', parseFloat(e.target.value) || 0)} className={`block w-full border rounded-lg px-2 py-1.5 text-sm ${errors[`detailItems[${idx}].nominal`] ? 'border-red-300' : 'border-gray-300'}`} placeholder="0" />
                        {errors[`detailItems[${idx}].nominal`] && <p className="mt-1 text-xs text-red-600">{errors[`detailItems[${idx}].nominal`]}</p>}
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={it.keterangan} onChange={e => handleDetailChange(it.id, 'keterangan', e.target.value)} className="block w-full border rounded-lg px-2 py-1.5 text-sm border-gray-300" placeholder="Keterangan detail" />
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

export default FinancePermintaanPencairanDanaModal;
