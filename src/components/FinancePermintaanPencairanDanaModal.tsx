import React, { useEffect, useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

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

  const initialEmpty: PermintaanPencairanDanaFormData = {
    noPPD: `DOC-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-001`,
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
  const [nominalDPP, setNominalDPP] = useState<number>(0);
  const [nominalPPN, setNominalPPN] = useState<number>(0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setFormData(initialData ? { ...initialData, tglPPD: initialData.tglPPD ? new Date(initialData.tglPPD) : today, total: calcTotal(initialData.detailItems) } : initialEmpty);
      // initialize DPP/PPN from existing total if any (assume DPP=total, PPN=0 as default)
      if (initialData && initialData.total) {
        setNominalDPP(initialData.total);
        setNominalPPN(0);
      } else {
        setNominalDPP(0);
        setNominalPPN(0);
      }
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.noPPD.trim()) e.noPPD = 'No. Dokumen wajib diisi';
    if (!formData.keperluanUmum.trim()) e.keperluanUmum = 'Keterangan wajib diisi';
    if ((Number(nominalDPP) || 0) + (Number(nominalPPN) || 0) <= 0) e.total = 'Nominal tidak boleh 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const subTotal = (Number(nominalDPP) || 0) + (Number(nominalPPN) || 0);
    const payload: PermintaanPencairanDanaFormData = {
      ...formData,
      detailItems: [{ id: 1, kodeBank: '', namaBank: formData.detailItems[0]?.namaBank || '', norek: '', alamat: '', nominal: subTotal, keterangan: formData.keperluanUmum }],
      total: subTotal,
    };
    onSave(payload);
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">No. Dokumen <span className="text-red-500">*</span></label>
                <input type="text" value={formData.noPPD} onChange={e => setFormData(prev => ({ ...prev, noPPD: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.noPPD ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.noPPD && <p className="mt-1 text-sm text-red-600">{errors.noPPD}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan <span className="text-red-500">*</span></label>
                <textarea rows={3} value={formData.keperluanUmum} onChange={e => setFormData(prev => ({ ...prev, keperluanUmum: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.keperluanUmum ? 'border-red-300' : 'border-gray-300'}`} placeholder="Tuliskan keterangan..."></textarea>
                {errors.keperluanUmum && <p className="mt-1 text-sm text-red-600">{errors.keperluanUmum}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nominal DPP</label>
                <input type="number" value={nominalDPP} onChange={e => setNominalDPP(parseFloat(e.target.value) || 0)} className="block w-full border rounded-lg px-4 py-2 text-sm border-gray-300" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nominal PPN</label>
                <input type="number" value={nominalPPN} onChange={e => setNominalPPN(parseFloat(e.target.value) || 0)} className="block w-full border rounded-lg px-4 py-2 text-sm border-gray-300" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SubTotal</label>
                <input type="text" readOnly value={`Rp ${((nominalDPP || 0) + (nominalPPN || 0)).toLocaleString('id-ID')}`} className="block w-full border rounded-lg px-4 py-2 text-sm bg-gray-50 border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Pembayaran</label>
                <input type="text" readOnly value={`Rp ${((nominalDPP || 0) + (nominalPPN || 0)).toLocaleString('id-ID')}`} className="block w-full border rounded-lg px-4 py-2 text-sm bg-gray-50 border-gray-300" />
              </div>
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
