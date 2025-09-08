import React, { useEffect, useState } from 'react';

export interface ATKStockForm {
  namaBarang: string;
  kategori: 'Kertas' | 'Alat Tulis' | 'Printer' | 'Lainnya';
  satuan: string; // pcs, rim, box, dll
  stok: string; // numeric string
  minimalStok: string; // numeric string
  lokasi: string;
  status: 'Aman' | 'Menipis' | 'Habis';
  lastUpdate: string; // yyyy-mm-dd
  keterangan?: string;
}

interface ATKStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ATKStockForm) => void;
  initialData?: ATKStockForm | null;
  title?: string;
  submitLabel?: string;
}

const ATKStockModal: React.FC<ATKStockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Stok ATK',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<ATKStockForm>({
    namaBarang: '',
    kategori: 'Lainnya',
    satuan: '',
    stok: '',
    minimalStok: '',
    lokasi: '',
    status: 'Aman',
    lastUpdate: '',
    keterangan: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          namaBarang: '',
          kategori: 'Lainnya',
          satuan: '',
          stok: '',
          minimalStok: '',
          lokasi: '',
          status: 'Aman',
          lastUpdate: '',
          keterangan: '',
        }
      );
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.namaBarang.trim() || !form.satuan.trim() || !form.stok || !form.minimalStok || !form.lastUpdate) return;
    onSave({
      ...form,
      namaBarang: form.namaBarang.trim(),
      satuan: form.satuan.trim(),
      lokasi: form.lokasi.trim(),
      stok: form.stok.trim(),
      minimalStok: form.minimalStok.trim(),
      keterangan: form.keterangan?.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
              <input
                name="namaBarang"
                value={form.namaBarang}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Kertas A4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Kertas">Kertas</option>
                <option value="Alat Tulis">Alat Tulis</option>
                <option value="Printer">Printer</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
              <input
                name="satuan"
                value={form.satuan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="pcs / rim / box"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
              <input
                name="stok"
                value={form.stok}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mis. 120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimal Stok</label>
              <input
                name="minimalStok"
                value={form.minimalStok}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mis. 20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Gudang A / Kantor Pusat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Aman">Aman</option>
                <option value="Menipis">Menipis</option>
                <option value="Habis">Habis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terakhir Update</label>
              <input
                type="date"
                name="lastUpdate"
                value={form.lastUpdate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
            <textarea
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Opsional"
            />
          </div>
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Batal</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ATKStockModal;
