import React, { useEffect, useState } from 'react';

export interface TroubleShootForm {
  tanggal: string; // yyyy-mm-dd
  pelapor: string;
  departemen: string;
  perangkat: string; // e.g., LAP-OPS-01 / Printer-2F
  kategori: 'Perangkat' | 'Jaringan' | 'Aplikasi' | 'Email' | 'Lainnya';
  deskripsi: string;
  prioritas: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  penangan: string; // PIC IT
  solusi?: string;
}

interface TroubleShootModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TroubleShootForm) => void;
  initialData?: TroubleShootForm | null;
  title?: string;
  submitLabel?: string;
}

const TroubleShootModal: React.FC<TroubleShootModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Ticket Trouble Shoot',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<TroubleShootForm>({
    tanggal: '',
    pelapor: '',
    departemen: '',
    perangkat: '',
    kategori: 'Lainnya',
    deskripsi: '',
    prioritas: 'Low',
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
          departemen: '',
          perangkat: '',
          kategori: 'Lainnya',
          deskripsi: '',
          prioritas: 'Low',
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
    if (!form.tanggal || !form.pelapor.trim() || !form.departemen.trim() || !form.perangkat.trim() || !form.deskripsi.trim() || !form.penangan.trim()) return;
    onSave({
      ...form,
      pelapor: form.pelapor.trim(),
      departemen: form.departemen.trim(),
      perangkat: form.perangkat.trim(),
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
              <input name="departemen" value={form.departemen} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Departemen" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Perangkat</label>
              <input name="perangkat" value={form.perangkat} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="LAP-OPS-01 / Printer-2F" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="kategori" value={form.kategori} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Perangkat">Perangkat</option>
                <option value="Jaringan">Jaringan</option>
                <option value="Aplikasi">Aplikasi</option>
                <option value="Email">Email</option>
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

export default TroubleShootModal;
