import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';

interface BASerahTerimaItem {
  id: string;
  nomorBA: string;
  tanggalBA: string;
  penyerah: string;
  penerima: string;
  namaAsset: string;
  nomorAsset: string;
  kondisi: 'Baik' | 'Rusak' | 'Perlu Perbaikan';
  status: 'Draft' | 'Selesai' | 'Pending';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<BASerahTerimaItem>) => void;
  mode: 'create' | 'edit' | 'view';
  data: BASerahTerimaItem | null;
}

const BASerahTerimaModal: React.FC<Props> = ({ isOpen, onClose, onSave, mode, data }) => {
  const [formData, setFormData] = useState<Partial<BASerahTerimaItem>>({
    nomorBA: '', tanggalBA: '', penyerah: '', penerima: '',
    namaAsset: '', nomorAsset: '', kondisi: 'Baik', status: 'Draft'
  });

  useEffect(() => {
    if (data && (mode === 'edit' || mode === 'view')) {
      setFormData(data);
    } else {
      setFormData({
        nomorBA: '', tanggalBA: new Date().toISOString().split('T')[0],
        penyerah: '', penerima: '', namaAsset: '', nomorAsset: '',
        kondisi: 'Baik', status: 'Draft'
      });
    }
  }, [data, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-medium">
                {mode === 'create' ? 'Tambah' : mode === 'edit' ? 'Edit' : 'Detail'} BA Serah Terima
              </h3>
            </div>
            <button onClick={onClose}><X className="h-6 w-6" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nomor BA *</label>
                <input type="text" name="nomorBA" value={formData.nomorBA || ''} onChange={handleChange}
                  disabled={mode === 'view'} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal *</label>
                <input type="date" name="tanggalBA" value={formData.tanggalBA || ''} onChange={handleChange}
                  disabled={mode === 'view'} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Penyerah *</label>
                <input type="text" name="penyerah" value={formData.penyerah || ''} onChange={handleChange}
                  disabled={mode === 'view'} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Penerima *</label>
                <input type="text" name="penerima" value={formData.penerima || ''} onChange={handleChange}
                  disabled={mode === 'view'} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Asset *</label>
                <input type="text" name="namaAsset" value={formData.namaAsset || ''} onChange={handleChange}
                  disabled={mode === 'view'} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nomor Asset *</label>
                <input type="text" name="nomorAsset" value={formData.nomorAsset || ''} onChange={handleChange}
                  disabled={mode === 'view'} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kondisi *</label>
                <select name="kondisi" value={formData.kondisi || 'Baik'} onChange={handleChange}
                  disabled={mode === 'view'} className="w-full px-3 py-2 border rounded-lg">
                  <option value="Baik">Baik</option>
                  <option value="Rusak">Rusak</option>
                  <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status *</label>
                <select name="status" value={formData.status || 'Draft'} onChange={handleChange}
                  disabled={mode === 'view'} className="w-full px-3 py-2 border rounded-lg">
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>

            {mode !== 'view' && (
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} 
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Batal
                </button>
                <button type="submit" 
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  {mode === 'create' ? 'Simpan' : 'Update'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BASerahTerimaModal;
