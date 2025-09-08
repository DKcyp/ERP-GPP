import React, { useEffect, useState } from 'react';

export interface UtilityForm {
  jenis: 'Listrik' | 'Air' | 'Internet' | 'Telepon' | 'Gas' | 'Lainnya';
  lokasi: string;
  periode: string; // yyyy-mm
  pemakaian: string; // kWh/m3/GB/dll
  biaya: string; // currency text
  status: 'Belum Bayar' | 'Proses' | 'Lunas' | 'Terlambat';
  jatuhTempo: string; // yyyy-mm-dd
  keterangan?: string;
}

interface UtilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UtilityForm) => void;
  initialData?: UtilityForm | null;
  title?: string;
  submitLabel?: string;
}

const UtilityModal: React.FC<UtilityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Utility',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<UtilityForm>({
    jenis: 'Lainnya',
    lokasi: '',
    periode: '',
    pemakaian: '',
    biaya: '',
    status: 'Belum Bayar',
    jatuhTempo: '',
    keterangan: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          jenis: 'Lainnya',
          lokasi: '',
          periode: '',
          pemakaian: '',
          biaya: '',
          status: 'Belum Bayar',
          jatuhTempo: '',
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
    if (!form.lokasi.trim() || !form.periode || !form.jatuhTempo || !form.jenis) return;
    onSave({
      ...form,
      lokasi: form.lokasi.trim(),
      pemakaian: form.pemakaian.trim(),
      biaya: form.biaya.trim(),
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
              <select
                name="jenis"
                value={form.jenis}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Listrik">Listrik</option>
                <option value="Air">Air</option>
                <option value="Internet">Internet</option>
                <option value="Telepon">Telepon</option>
                <option value="Gas">Gas</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kantor Pusat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <input
                type="month"
                name="periode"
                value={form.periode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pemakaian</label>
              <input
                name="pemakaian"
                value={form.pemakaian}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mis. 1.250 kWh / 30 m3 / 100 GB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biaya (Rp)</label>
              <input
                name="biaya"
                value={form.biaya}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mis. 5.250.000"
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
                <option value="Belum Bayar">Belum Bayar</option>
                <option value="Proses">Proses</option>
                <option value="Lunas">Lunas</option>
                <option value="Terlambat">Terlambat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jatuh Tempo</label>
              <input
                type="date"
                name="jatuhTempo"
                value={form.jatuhTempo}
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

export default UtilityModal;
