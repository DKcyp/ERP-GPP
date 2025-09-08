import React, { useEffect, useState } from 'react';

export interface ATKRequestForm {
  tanggal: string; // yyyy-mm-dd
  pemohon: string;
  departemen: string;
  namaBarang: string;
  kategori: 'Kertas' | 'Alat Tulis' | 'Printer' | 'Lainnya';
  jumlah: string; // numeric string
  satuan: string; // pcs/rim/box
  status: 'Draft' | 'Diajukan' | 'Disetujui' | 'Ditolak' | 'Selesai';
  keterangan?: string;
}

interface ATKRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ATKRequestForm) => void;
  initialData?: ATKRequestForm | null;
  title?: string;
  submitLabel?: string;
}

const ATKRequestModal: React.FC<ATKRequestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Pengajuan ATK',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<ATKRequestForm>({
    tanggal: '',
    pemohon: '',
    departemen: '',
    namaBarang: '',
    kategori: 'Lainnya',
    jumlah: '',
    satuan: '',
    status: 'Draft',
    keterangan: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          tanggal: '',
          pemohon: '',
          departemen: '',
          namaBarang: '',
          kategori: 'Lainnya',
          jumlah: '',
          satuan: '',
          status: 'Draft',
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
    if (!form.tanggal || !form.pemohon.trim() || !form.departemen.trim() || !form.namaBarang.trim() || !form.jumlah.trim() || !form.satuan.trim()) return;
    onSave({
      ...form,
      pemohon: form.pemohon.trim(),
      departemen: form.departemen.trim(),
      namaBarang: form.namaBarang.trim(),
      jumlah: form.jumlah.trim(),
      satuan: form.satuan.trim(),
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pemohon</label>
              <input name="pemohon" value={form.pemohon} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nama Pemohon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
              <input name="departemen" value={form.departemen} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Departemen" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
              <input name="namaBarang" value={form.namaBarang} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contoh: Kertas A4 / Ballpoint" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="kategori" value={form.kategori} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Kertas">Kertas</option>
                <option value="Alat Tulis">Alat Tulis</option>
                <option value="Printer">Printer</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
              <input name="jumlah" value={form.jumlah} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="mis. 2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
              <input name="satuan" value={form.satuan} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="pcs / rim / box" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Draft">Draft</option>
                <option value="Diajukan">Diajukan</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
            <textarea name="keterangan" value={form.keterangan} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Opsional" />
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

export default ATKRequestModal;
