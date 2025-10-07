import React, { useEffect, useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

export interface PengajianEntryFormData {
  namaPegawai: string;
  absenGapok: string;
  umUt: string;
  tunjanganJabatan: string;
  tunjanganLainnya: string;
  tunjanganBpjs: string;
  tunjanganProyek: string;
  totalTahap1: string;
  totalTahap2: string;
  totalTunjanganProyek: string;
  gajiPokokTeknisi: string;
  gajiPokokStaff: string;
}

interface PengajianEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PengajianEntryFormData) => void;
}

const PengajianEntryModal: React.FC<PengajianEntryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<PengajianEntryFormData>({
    namaPegawai: '',
    absenGapok: '',
    umUt: '',
    tunjanganJabatan: '',
    tunjanganLainnya: '',
    tunjanganBpjs: '',
    tunjanganProyek: '',
    totalTahap1: '',
    totalTahap2: '',
    totalTunjanganProyek: '',
    gajiPokokTeknisi: '',
    gajiPokokStaff: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PengajianEntryFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const formatRp = (value: string) => {
    const numeric = value.replace(/[^\d]/g, '');
    return numeric ? `Rp ${parseInt(numeric, 10).toLocaleString('id-ID')}` : '';
  };

  const handleChange = (key: keyof PengajianEntryFormData) => (value: string) => {
    const formatted = formatRp(value);
    setForm(prev => ({ ...prev, [key]: formatted }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const req: (keyof PengajianEntryFormData)[] = [
      'absenGapok',
      'umUt',
      'tunjanganJabatan',
      'tunjanganLainnya',
      'tunjanganBpjs',
      'tunjanganProyek',
    ];
    const e: Partial<Record<keyof PengajianEntryFormData, string>> = {};
    req.forEach(k => { if (!form[k]?.trim()) e[k] = 'Wajib diisi'; });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onSave(form);
    setIsLoading(false);
    setForm({ 
      namaPegawai: '', 
      absenGapok: '', 
      umUt: '', 
      tunjanganJabatan: '', 
      tunjanganLainnya: '', 
      tunjanganBpjs: '', 
      tunjanganProyek: '',
      totalTahap1: '',
      totalTahap2: '',
      totalTunjanganProyek: '',
      gajiPokokTeknisi: '',
      gajiPokokStaff: ''
    });
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Entry Penggajian</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(85vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai <span className="text-red-500">*</span></label>
              <input type="text" value={form.namaPegawai} onChange={(e) => handleChange('namaPegawai')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.namaPegawai ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Masukkan nama pegawai" />
              {errors.namaPegawai && <p className="text-sm text-red-600 mt-1">{errors.namaPegawai}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Absen (Gapok) <span className="text-red-500">*</span></label>
                <input type="text" value={form.absenGapok} onChange={(e) => handleChange('absenGapok')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.absenGapok ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                {errors.absenGapok && <p className="text-sm text-red-600 mt-1">{errors.absenGapok}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UM/UT <span className="text-red-500">*</span></label>
                <input type="text" value={form.umUt} onChange={(e) => handleChange('umUt')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.umUt ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                {errors.umUt && <p className="text-sm text-red-600 mt-1">{errors.umUt}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tunjangan Jabatan <span className="text-red-500">*</span></label>
                <input type="text" value={form.tunjanganJabatan} onChange={(e) => handleChange('tunjanganJabatan')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tunjanganJabatan ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                {errors.tunjanganJabatan && <p className="text-sm text-red-600 mt-1">{errors.tunjanganJabatan}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tunjangan Lainnya <span className="text-red-500">*</span></label>
                <input type="text" value={form.tunjanganLainnya} onChange={(e) => handleChange('tunjanganLainnya')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tunjanganLainnya ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                {errors.tunjanganLainnya && <p className="text-sm text-red-600 mt-1">{errors.tunjanganLainnya}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tunjangan BPJS <span className="text-red-500">*</span></label>
                <input type="text" value={form.tunjanganBpjs} onChange={(e) => handleChange('tunjanganBpjs')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tunjanganBpjs ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                {errors.tunjanganBpjs && <p className="text-sm text-red-600 mt-1">{errors.tunjanganBpjs}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tunjangan Proyek <span className="text-red-500">*</span></label>
                <input type="text" value={form.tunjanganProyek} onChange={(e) => handleChange('tunjanganProyek')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tunjanganProyek ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                {errors.tunjanganProyek && <p className="text-sm text-red-600 mt-1">{errors.tunjanganProyek}</p>}
              </div>
            </div>
            
            {/* New Fields Section */}
            <div className="border-t border-gray-200 pt-5 mt-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Total & Gaji Pokok</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Tahap 1</label>
                  <input type="text" value={form.totalTahap1} onChange={(e) => handleChange('totalTahap1')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.totalTahap1 ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                  {errors.totalTahap1 && <p className="text-sm text-red-600 mt-1">{errors.totalTahap1}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Tahap 2</label>
                  <input type="text" value={form.totalTahap2} onChange={(e) => handleChange('totalTahap2')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.totalTahap2 ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                  {errors.totalTahap2 && <p className="text-sm text-red-600 mt-1">{errors.totalTahap2}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Tunjangan Proyek</label>
                  <input type="text" value={form.totalTunjanganProyek} onChange={(e) => handleChange('totalTunjanganProyek')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.totalTunjanganProyek ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                  {errors.totalTunjanganProyek && <p className="text-sm text-red-600 mt-1">{errors.totalTunjanganProyek}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gaji Pokok Teknisi</label>
                  <input type="text" value={form.gajiPokokTeknisi} onChange={(e) => handleChange('gajiPokokTeknisi')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.gajiPokokTeknisi ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                  {errors.gajiPokokTeknisi && <p className="text-sm text-red-600 mt-1">{errors.gajiPokokTeknisi}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gaji Pokok Staff</label>
                  <input type="text" value={form.gajiPokokStaff} onChange={(e) => handleChange('gajiPokokStaff')(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.gajiPokokStaff ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Rp 0" />
                  {errors.gajiPokokStaff && <p className="text-sm text-red-600 mt-1">{errors.gajiPokokStaff}</p>}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm">Close</button>
          <button type="submit" onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 text-sm">
            {isLoading ? (<><Loader2 className="h-3.5 w-3.5 animate-spin" /><span>Saving...</span></>) : (<><Save className="h-3.5 w-3.5" /><span>Simpan</span></>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengajianEntryModal;
