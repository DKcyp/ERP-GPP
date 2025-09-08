import React, { useEffect, useState } from 'react';

export interface TroubleshootSaranaKerjaForm {
  tanggal: string; // yyyy-mm-dd
  pelapor: string;
  lokasi: string; // area/ruangan
  aset: string; // aset/perangkat terkait
  kategori: 'Listrik' | 'AC' | 'Infrastruktur' | 'Fasilitas' | 'Lainnya';
  deskripsi: string;
  prioritas: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  penangan: string; // PIC
  solusi?: string;
}

interface TroubleshootSaranaKerjaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TroubleshootSaranaKerjaForm) => void;
  initialData?: TroubleshootSaranaKerjaForm | null;
  title?: string;
  submitLabel?: string;
}

const TroubleshootSaranaKerjaModal: React.FC<TroubleshootSaranaKerjaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Ticket Troubleshoot Sarana Kerja',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<TroubleshootSaranaKerjaForm>({
    tanggal: '',
    pelapor: '',
    lokasi: '',
    aset: '',
    kategori: 'Lainnya',
    deskripsi: '',
    prioritas: 'Medium',
    status: 'Open',
    penangan: '',
    solusi: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          tanggal: '',
          pelapor: '',
          lokasi: '',
          aset: '',
          kategori: 'Lainnya',
          deskripsi: '',
          prioritas: 'Medium',
          status: 'Open',
          penangan: '',
          solusi: '',
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
    if (!form.tanggal || !form.pelapor.trim() || !form.lokasi.trim() || !form.aset.trim() || !form.deskripsi.trim() || !form.penangan.trim()) return;
    onSave({
      ...form,
      pelapor: form.pelapor.trim(),
      lokasi: form.lokasi.trim(),
      aset: form.aset.trim(),
      deskripsi: form.deskripsi.trim(),
      penangan: form.penangan.trim(),
      solusi: form.solusi?.trim(),
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Pelapor</label>
              <input name="pelapor" value={form.pelapor} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nama Pelapor" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input name="lokasi" value={form.lokasi} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Area/Ruangan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aset/Perangkat</label>
              <input name="aset" value={form.aset} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contoh: AC-2F / Genset-01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="kategori" value={form.kategori} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Listrik">Listrik</option>
                <option value="AC">AC</option>
                <option value="Infrastruktur">Infrastruktur</option>
                <option value="Fasilitas">Fasilitas</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
              <select name="prioritas" value={form.prioritas} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Keluhan atau masalah yang terjadi" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Solusi</label>
            <textarea name="solusi" value={form.solusi} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Diisi setelah penanganan" />
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

export default TroubleshootSaranaKerjaModal;
