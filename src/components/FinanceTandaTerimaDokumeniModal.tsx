import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, PlusCircle, Save, Trash2, Loader2 } from 'lucide-react';

interface TTDDetailItem {
  id: number;
  jenisDokumen: string;
  noDokumen: string;
  namaDokumen: string;
  pengirim: string;
  jumlahBerkas: number;
  keterangan: string;
}

export interface TandaTerimaDokumeniFormData {
  id?: number;
  noTTD: string;
  tglTTD: Date | null;
  divisi: string;
  penerima: string;
  pengirim: string;
  keteranganUmum: string;
  detailItems: TTDDetailItem[];
  // New fields for Dokumen Penagihan requirements
  tanggalDokumen?: Date | null;
  uploadDokumen?: File | null;
  noSO?: string;
}

interface FinanceTandaTerimaDokumeniModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TandaTerimaDokumeniFormData) => void;
  initialData?: TandaTerimaDokumeniFormData | null;
  title: string;
}

const FinanceTandaTerimaDokumeniModal: React.FC<FinanceTandaTerimaDokumeniModalProps> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const today = new Date();
  const divisiOptions = ['Marketing','HRD','GA','Procurement','Project Control','Operasional','QHSE','Finance','Accounting','Tax','Gudang'];
  const jenisOptions = ['PO/SPK/Kontrak', 'Invoice', 'Faktur Pajak', 'BAST', 'Surat Jalan', 'Lain-lain'];

  const initialEmpty: TandaTerimaDokumeniFormData = {
    noTTD: `TTD-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-001`,
    tglTTD: today,
    divisi: '',
    penerima: '',
    pengirim: '',
    keteranganUmum: '',
    detailItems: [{ id: 1, jenisDokumen: '', noDokumen: '', namaDokumen: '', pengirim: '', jumlahBerkas: 1, keterangan: '' }],
    // New fields for Dokumen Penagihan requirements
    tanggalDokumen: null,
    uploadDokumen: null,
    noSO: '',
  };

  const [formData, setFormData] = useState<TandaTerimaDokumeniFormData>(initialEmpty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setFormData(initialData ? { ...initialData, tglTTD: initialData.tglTTD ? new Date(initialData.tglTTD) : today } : initialEmpty);
      setErrors({});
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      setFormData(initialEmpty);
      setErrors({});
    };
  }, [isOpen, onClose, initialData]);

  const handleAddRow = () => setFormData(prev => ({ ...prev, detailItems: [...prev.detailItems, { id: prev.detailItems.length + 1, jenisDokumen: '', noDokumen: '', namaDokumen: '', pengirim: '', jumlahBerkas: 1, keterangan: '' }] }));
  const handleRemoveRow = (id: number) => setFormData(prev => ({ ...prev, detailItems: prev.detailItems.filter(it => it.id !== id) }));
  const handleDetailChange = (id: number, field: keyof TTDDetailItem, value: any) => setFormData(prev => ({ ...prev, detailItems: prev.detailItems.map(it => it.id === id ? { ...it, [field]: value } : it) }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.noTTD.trim()) e.noTTD = 'No TTD wajib diisi';
    if (!formData.tglTTD) e.tglTTD = 'Tanggal wajib diisi';
    if (!formData.divisi.trim()) e.divisi = 'Divisi wajib dipilih';
    if (!formData.penerima.trim()) e.penerima = 'Penerima wajib diisi';
    if (!formData.pengirim.trim()) e.pengirim = 'Pengirim wajib diisi';
    if (formData.detailItems.length === 0) e.detailItems = 'Minimal satu baris detail diperlukan';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 300));
    onSave(formData);
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
                <label className="block text-sm font-medium text-gray-700 mb-2">No TTD <span className="text-red-500">*</span></label>
                <input type="text" value={formData.noTTD} onChange={e => setFormData(prev => ({ ...prev, noTTD: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.noTTD ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.noTTD && <p className="mt-1 text-sm text-red-600">{errors.noTTD}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal <span className="text-red-500">*</span></label>
                <DatePicker selected={formData.tglTTD} onChange={(date: Date | null) => setFormData(prev => ({ ...prev, tglTTD: date }))} dateFormat="dd/MM/yyyy" className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.tglTTD ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.tglTTD && <p className="mt-1 text-sm text-red-600">{errors.tglTTD}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Penerima <span className="text-red-500">*</span></label>
                <input type="text" value={formData.penerima} onChange={e => setFormData(prev => ({ ...prev, penerima: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.penerima ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.penerima && <p className="mt-1 text-sm text-red-600">{errors.penerima}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pengirim <span className="text-red-500">*</span></label>
                <input type="text" value={formData.pengirim} onChange={e => setFormData(prev => ({ ...prev, pengirim: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.pengirim ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.pengirim && <p className="mt-1 text-sm text-red-600">{errors.pengirim}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                <textarea rows={3} value={formData.keteranganUmum} onChange={e => setFormData(prev => ({ ...prev, keteranganUmum: e.target.value }))} className="block w-full border rounded-lg px-4 py-2 text-sm" placeholder="Keterangan umum..."></textarea>
              </div>
            </div>

            {/* New fields for Dokumen Penagihan requirements */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Informasi Dokumen (Berdasarkan SO)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">No SO</label>
                  <input 
                    type="text" 
                    value={formData.noSO || ''} 
                    onChange={e => setFormData(prev => ({ ...prev, noSO: e.target.value }))} 
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="SO-2025-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Dokumen</label>
                  <DatePicker 
                    selected={formData.tanggalDokumen} 
                    onChange={(date: Date | null) => setFormData(prev => ({ ...prev, tanggalDokumen: date }))} 
                    dateFormat="dd/MM/yyyy" 
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
                    placeholderText="Pilih tanggal dokumen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Dokumen</label>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                    onChange={e => setFormData(prev => ({ ...prev, uploadDokumen: e.target.files?.[0] || null }))} 
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.uploadDokumen && (
                    <p className="mt-1 text-sm text-green-600">File terpilih: {formData.uploadDokumen.name}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Format: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                </div>
              </div>
            </div>

            <h4 className="text-xl font-bold text-gray-800">Detail Dokumen</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jenis Dokumen</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No Dokumen</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Dokumen</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pengirim</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah Berkas</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.detailItems.map((it) => (
                    <tr key={it.id}>
                      <td className="px-4 py-2">
                        <select value={it.jenisDokumen} onChange={e => handleDetailChange(it.id, 'jenisDokumen', e.target.value)} className="block w-full border rounded-lg py-1.5 text-sm">
                          <option value="">Pilih Jenis</option>
                          {jenisOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={it.noDokumen} onChange={e => handleDetailChange(it.id, 'noDokumen', e.target.value)} className="block w-full border rounded-lg px-2 py-1.5 text-sm" placeholder="No dokumen" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={it.namaDokumen} onChange={e => handleDetailChange(it.id, 'namaDokumen', e.target.value)} className="block w-full border rounded-lg px-2 py-1.5 text-sm" placeholder="Nama dokumen" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={it.pengirim} onChange={e => handleDetailChange(it.id, 'pengirim', e.target.value)} className="block w-full border rounded-lg px-2 py-1.5 text-sm" placeholder="Nama pengirim" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="number" min={1} value={it.jumlahBerkas} onChange={e => handleDetailChange(it.id, 'jumlahBerkas', parseInt(e.target.value || '1', 10))} className="block w-full border rounded-lg px-2 py-1.5 text-sm text-right" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={it.keterangan} onChange={e => handleDetailChange(it.id, 'keterangan', e.target.value)} className="block w-full border rounded-lg px-2 py-1.5 text-sm" placeholder="Keterangan" />
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
              <div className="text-sm text-gray-600">Total Dokumen: {formData.detailItems.length} berkas</div>
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

export default FinanceTandaTerimaDokumeniModal;
