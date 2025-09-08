import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface BarangDibuangItemInput {
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  satuan: string;
  jumlah: number;
  sumber: string;
  tanggalDibuang: string; // yyyy-mm-dd
  catatan: string;
}

type Mode = 'create' | 'view' | 'edit';

interface EntryBarangDibuangModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BarangDibuangItemInput) => void;
  mode?: Mode;
  initialData?: Partial<BarangDibuangItemInput>;
}

const EntryBarangDibuangModal: React.FC<EntryBarangDibuangModalProps> = ({ isOpen, onClose, onSave, mode = 'create', initialData }) => {
  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState<BarangDibuangItemInput>({
    kodeBarang: initialData?.kodeBarang ?? '',
    namaBarang: initialData?.namaBarang ?? '',
    kategori: initialData?.kategori ?? 'APD',
    satuan: initialData?.satuan ?? 'Unit',
    jumlah: initialData?.jumlah ?? 1,
    sumber: initialData?.sumber ?? 'Timesheet',
    tanggalDibuang: initialData?.tanggalDibuang ?? today,
    catatan: initialData?.catatan ?? '',
  });

  useEffect(() => {
    // Refill when initialData or mode changes
    setForm({
      kodeBarang: initialData?.kodeBarang ?? '',
      namaBarang: initialData?.namaBarang ?? '',
      kategori: initialData?.kategori ?? 'APD',
      satuan: initialData?.satuan ?? 'Unit',
      jumlah: initialData?.jumlah ?? 1,
      sumber: initialData?.sumber ?? 'Timesheet',
      tanggalDibuang: initialData?.tanggalDibuang ?? today,
      catatan: initialData?.catatan ?? '',
    });
  }, [initialData, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: id === 'jumlah' ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'view' ? 'Detail Barang Dibuang' : mode === 'edit' ? 'Edit Barang Dibuang' : 'Tambah Barang Dibuang';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="kodeBarang" className="block text-xs font-medium text-gray-700 mb-1">Kode Barang</label>
              <input id="kodeBarang" type="text" value={form.kodeBarang} onChange={handleChange} readOnly={isReadOnly} disabled={isReadOnly} className={`px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs ${isReadOnly ? 'bg-gray-50' : 'bg-white'}`} placeholder="BRG001" />
            </div>
            <div>
              <label htmlFor="namaBarang" className="block text-xs font-medium text-gray-700 mb-1">Nama Barang</label>
              <input id="namaBarang" type="text" value={form.namaBarang} onChange={handleChange} readOnly={isReadOnly} disabled={isReadOnly} className={`px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs ${isReadOnly ? 'bg-gray-50' : 'bg-white'}`} placeholder="Helm Proyek" />
            </div>
            <div>
              <label htmlFor="kategori" className="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
              <select id="kategori" value={form.kategori} onChange={handleChange} disabled={isReadOnly} className="px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs">
                <option>APD</option>
                <option>Chemical</option>
                <option>B3</option>
              </select>
            </div>
            <div>
              <label htmlFor="satuan" className="block text-xs font-medium text-gray-700 mb-1">Satuan</label>
              <input id="satuan" type="text" value={form.satuan} onChange={handleChange} readOnly={isReadOnly} disabled={isReadOnly} className={`px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs ${isReadOnly ? 'bg-gray-50' : 'bg-white'}`} placeholder="Unit / Liter / Pcs" />
            </div>
            <div>
              <label htmlFor="jumlah" className="block text-xs font-medium text-gray-700 mb-1">Jumlah</label>
              <input id="jumlah" type="number" min={1} value={form.jumlah} onChange={handleChange} readOnly={isReadOnly} disabled={isReadOnly} className="px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs" />
            </div>
            <div>
              <label htmlFor="sumber" className="block text-xs font-medium text-gray-700 mb-1">Sumber</label>
              <select id="sumber" value={form.sumber} onChange={handleChange} disabled={isReadOnly} className="px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs">
                <option>Timesheet</option>
                <option>Karantina</option>
                <option>Pengembalian Barang</option>
              </select>
            </div>
            <div>
              <label htmlFor="tanggalDibuang" className="block text-xs font-medium text-gray-700 mb-1">Tanggal Dibuang</label>
              <input id="tanggalDibuang" type="date" value={form.tanggalDibuang} onChange={handleChange} readOnly={isReadOnly} disabled={isReadOnly} className="px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="catatan" className="block text-xs font-medium text-gray-700 mb-1">Catatan</label>
              <textarea id="catatan" rows={3} value={form.catatan} onChange={handleChange} readOnly={isReadOnly} disabled={isReadOnly} className={`px-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs ${isReadOnly ? 'bg-gray-50' : 'bg-white'}`} placeholder="Tambahkan catatan..." />
            </div>
          </div>
        </div>
        <div className="flex justify-end p-5 border-t border-gray-200 space-x-2.5">
          <button onClick={onClose} className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200 text-xs shadow-sm">Kembali</button>
          {mode !== 'view' && (
            <button onClick={handleSubmit} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs shadow-sm">Simpan</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryBarangDibuangModal;
