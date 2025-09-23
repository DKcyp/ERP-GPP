import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { PenerimaanBarangManualFormData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PenerimaanBarangManualFormData) => void;
}

const PenerimaanBarangManualModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<PenerimaanBarangManualFormData>({
    noDokumen: '', namaBarang: '', kodeBarang: '', qty: '', satuan: '',
    kondisiBarang: 'Expired', tanggalExpired: '', alasanManual: '', keterangan: ''
  });

  // Data master barang untuk auto-select
  const masterBarang = [
    { kode: 'SMN-001', nama: 'Semen Portland', satuan: 'Sak' },
    { kode: 'CAT-002', nama: 'Cat Tembok', satuan: 'Kaleng' },
    { kode: 'BSI-003', nama: 'Besi Beton 12mm', satuan: 'Batang' },
    { kode: 'KBL-004', nama: 'Kabel UTP Cat6', satuan: 'Meter' },
    { kode: 'PLT-005', nama: 'Pipa PVC 4 inch', satuan: 'Batang' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleKodeBarangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKode = e.target.value;
    const selectedBarang = masterBarang.find(item => item.kode === selectedKode);
    
    if (selectedBarang) {
      setFormData(prev => ({
        ...prev,
        kodeBarang: selectedKode,
        namaBarang: selectedBarang.nama,
        satuan: selectedBarang.satuan
      }));
    } else {
      setFormData(prev => ({ ...prev, kodeBarang: selectedKode }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      noDokumen: '', namaBarang: '', kodeBarang: '', qty: '', satuan: '',
      kondisiBarang: 'Expired', tanggalExpired: '', alasanManual: '', keterangan: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-medium">Tambah Penerimaan Barang Manual</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">No. Dokumen *</label>
                <input type="text" name="noDokumen" value={formData.noDokumen} onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="DOK-2025-001" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kode Barang *</label>
                <select name="kodeBarang" value={formData.kodeBarang} onChange={handleKodeBarangChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Pilih Kode Barang</option>
                  {masterBarang.map(item => (
                    <option key={item.kode} value={item.kode}>{item.kode} - {item.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nama Barang *</label>
              <input type="text" name="namaBarang" value={formData.namaBarang} readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-700" 
                placeholder="Akan terisi otomatis saat memilih kode barang" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Qty *</label>
                <input type="number" name="qty" value={formData.qty} onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Satuan *</label>
                <input type="text" name="satuan" value={formData.satuan} readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-700"
                  placeholder="Akan terisi otomatis" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kondisi *</label>
                <select name="kondisiBarang" value={formData.kondisiBarang} onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="Expired">Expired</option>
                  <option value="Rusak">Rusak</option>
                  <option value="Baik">Baik</option>
                </select>
              </div>
            </div>

            {formData.kondisiBarang === 'Expired' && (
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal Expired</label>
                <input type="date" name="tanggalExpired" value={formData.tanggalExpired} onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Alasan Manual *</label>
              <textarea name="alasanManual" value={formData.alasanManual} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows={3}
                placeholder="Jelaskan mengapa barang ini tetap diterima..." required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Keterangan</label>
              <textarea name="keterangan" value={formData.keterangan} onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows={2}
                placeholder="Keterangan tambahan (opsional)" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                Batal
              </button>
              <button type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PenerimaanBarangManualModal;
