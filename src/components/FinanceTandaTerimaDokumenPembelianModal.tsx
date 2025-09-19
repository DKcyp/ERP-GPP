import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface TTDPBDetailItem {
  id: number;
  jenisDokumen: string;
  noDokumen: string;
  namaDokumen: string;
  pengirim: string;
  jumlahBerkas: number;
  keterangan: string;
}

export interface TandaTerimaDokumenPembelianFormData {
  id?: number;
  noTTPB: string;
  tglTTPB: Date | null;
  divisi: string;
  diserahkanOleh: string;
  diterimaOleh: string;
  keteranganUmum: string;
  detailItems: TTDPBDetailItem[];
  // New fields for Dokumen Pembelian requirements
  tanggalDiterima?: Date | null;
  uploadDokumen?: File | null;
}

interface FinanceTandaTerimaDokumenPembelianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TandaTerimaDokumenPembelianFormData) => void;
  title: string;
  initialData?: TandaTerimaDokumenPembelianFormData;
}

const FinanceTandaTerimaDokumenPembelianModal: React.FC<FinanceTandaTerimaDokumenPembelianModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  initialData
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = new Date();
  const divisiOptions = ['Marketing', 'HRD', 'GA', 'Procurement', 'Project Control', 'Operasional', 'QHSE', 'Finance', 'Accounting', 'Tax', 'Gudang'];
  const jenisDokumenOptions = ['Invoice', 'Purchase Order', 'Delivery Order', 'Surat Jalan', 'Faktur Pajak', 'Kontrak', 'SPK', 'Lainnya'];

  const initialEmpty: TandaTerimaDokumenPembelianFormData = {
    noTTPB: `TTPB-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-001`,
    tglTTPB: today,
    divisi: '',
    diserahkanOleh: '',
    diterimaOleh: '',
    keteranganUmum: '',
    detailItems: [{ id: 1, jenisDokumen: '', noDokumen: '', namaDokumen: '', pengirim: '', jumlahBerkas: 1, keterangan: '' }],
    // New fields for Dokumen Pembelian requirements
    tanggalDiterima: null,
    uploadDokumen: null,
  };

  const [formData, setFormData] = useState<TandaTerimaDokumenPembelianFormData>(initialEmpty);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || initialEmpty);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.noTTPB.trim()) newErrors.noTTPB = 'No TTPB harus diisi';
    if (!formData.tglTTPB) newErrors.tglTTPB = 'Tanggal harus diisi';
    if (!formData.divisi) newErrors.divisi = 'Divisi harus dipilih';
    if (!formData.diserahkanOleh.trim()) newErrors.diserahkanOleh = 'Diserahkan oleh harus diisi';
    if (!formData.diterimaOleh.trim()) newErrors.diterimaOleh = 'Diterima oleh harus diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailChange = (id: number, field: keyof TTDPBDetailItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      detailItems: prev.detailItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addDetailRow = () => {
    const newId = Math.max(...formData.detailItems.map(item => item.id)) + 1;
    setFormData(prev => ({
      ...prev,
      detailItems: [...prev.detailItems, { 
        id: newId, 
        jenisDokumen: '', 
        noDokumen: '', 
        namaDokumen: '', 
        pengirim: '', 
        jumlahBerkas: 1, 
        keterangan: '' 
      }]
    }));
  };

  const removeDetailRow = (id: number) => {
    if (formData.detailItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        detailItems: prev.detailItems.filter(item => item.id !== id)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
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
                <label className="block text-sm font-medium text-gray-700 mb-2">No TTPB <span className="text-red-500">*</span></label>
                <input type="text" value={formData.noTTPB} onChange={e => setFormData(prev => ({ ...prev, noTTPB: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.noTTPB ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.noTTPB && <p className="mt-1 text-sm text-red-600">{errors.noTTPB}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal <span className="text-red-500">*</span></label>
                <DatePicker selected={formData.tglTTPB} onChange={(date: Date | null) => setFormData(prev => ({ ...prev, tglTTPB: date }))} dateFormat="dd/MM/yyyy" className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.tglTTPB ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.tglTTPB && <p className="mt-1 text-sm text-red-600">{errors.tglTTPB}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Diserahkan Oleh <span className="text-red-500">*</span></label>
                <input type="text" value={formData.diserahkanOleh} onChange={e => setFormData(prev => ({ ...prev, diserahkanOleh: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.diserahkanOleh ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.diserahkanOleh && <p className="mt-1 text-sm text-red-600">{errors.diserahkanOleh}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diterima Oleh <span className="text-red-500">*</span></label>
                <input type="text" value={formData.diterimaOleh} onChange={e => setFormData(prev => ({ ...prev, diterimaOleh: e.target.value }))} className={`block w-full border rounded-lg px-4 py-2 text-sm ${errors.diterimaOleh ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.diterimaOleh && <p className="mt-1 text-sm text-red-600">{errors.diterimaOleh}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                <textarea rows={3} value={formData.keteranganUmum} onChange={e => setFormData(prev => ({ ...prev, keteranganUmum: e.target.value }))} className="block w-full border rounded-lg px-4 py-2 text-sm" placeholder="Keterangan umum..."></textarea>
              </div>
            </div>

            {/* New fields for Dokumen Pembelian requirements */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Informasi Dokumen Pembelian</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Diterima</label>
                  <DatePicker 
                    selected={formData.tanggalDiterima} 
                    onChange={(date: Date | null) => setFormData(prev => ({ ...prev, tanggalDiterima: date }))} 
                    dateFormat="dd/MM/yyyy" 
                    className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
                    placeholderText="Pilih tanggal diterima"
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
                          <option value="">Pilih</option>
                          {jenisDokumenOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={it.noDokumen} onChange={e => handleDetailChange(it.id, 'noDokumen', e.target.value)} className="block w-full border rounded-lg py-1.5 text-sm" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={it.namaDokumen} onChange={e => handleDetailChange(it.id, 'namaDokumen', e.target.value)} className="block w-full border rounded-lg py-1.5 text-sm" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={it.pengirim} onChange={e => handleDetailChange(it.id, 'pengirim', e.target.value)} className="block w-full border rounded-lg py-1.5 text-sm" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="number" min="1" value={it.jumlahBerkas} onChange={e => handleDetailChange(it.id, 'jumlahBerkas', parseInt(e.target.value) || 1)} className="block w-full border rounded-lg py-1.5 text-sm text-right" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="text" value={it.keterangan} onChange={e => handleDetailChange(it.id, 'keterangan', e.target.value)} className="block w-full border rounded-lg py-1.5 text-sm" />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button type="button" onClick={() => removeDetailRow(it.id)} disabled={formData.detailItems.length <= 1} className="text-red-600 hover:text-red-800 disabled:text-gray-400 text-sm">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <button type="button" onClick={addDetailRow} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  + Tambah Baris
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Batal
              </button>
              <button type="submit" disabled={isLoading} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FinanceTandaTerimaDokumenPembelianModal;
