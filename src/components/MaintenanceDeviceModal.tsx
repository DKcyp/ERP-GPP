import React, { useEffect, useState } from 'react';

export interface MaintenanceDeviceForm {
  deviceName: string;
  assetTag: string;
  userName: string;
  department: string;
  kategori: 'Laptop' | 'PC' | 'Printer' | 'Network' | 'Server' | 'Lainnya';
  jenisPekerjaan: string; // Maintenance berkala / Perbaikan / Upgrade
  tanggal: string; // yyyy-mm-dd
  vendor: string;
  status: 'Scheduled' | 'In Progress' | 'Done' | 'Overdue';
  biaya: string; // currency text
  hasil?: string; // hasil/notes
}

interface MaintenanceDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MaintenanceDeviceForm) => void;
  initialData?: MaintenanceDeviceForm | null;
  title?: string;
  submitLabel?: string;
}

const MaintenanceDeviceModal: React.FC<MaintenanceDeviceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Maintenance Perangkat',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<MaintenanceDeviceForm>({
    deviceName: '',
    assetTag: '',
    userName: '',
    department: '',
    kategori: 'Lainnya',
    jenisPekerjaan: '',
    tanggal: '',
    vendor: '',
    status: 'Scheduled',
    biaya: '',
    hasil: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          deviceName: '',
          assetTag: '',
          userName: '',
          department: '',
          kategori: 'Lainnya',
          jenisPekerjaan: '',
          tanggal: '',
          vendor: '',
          status: 'Scheduled',
          biaya: '',
          hasil: '',
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
    if (!form.deviceName.trim() || !form.userName.trim() || !form.department.trim() || !form.jenisPekerjaan.trim() || !form.tanggal) return;
    onSave({
      ...form,
      deviceName: form.deviceName.trim(),
      assetTag: form.assetTag.trim(),
      userName: form.userName.trim(),
      department: form.department.trim(),
      jenisPekerjaan: form.jenisPekerjaan.trim(),
      vendor: form.vendor.trim(),
      biaya: form.biaya.trim(),
      hasil: form.hasil?.trim(),
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perangkat</label>
              <input name="deviceName" value={form.deviceName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Laptop-User01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag</label>
              <input name="assetTag" value={form.assetTag} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="ASSET-000123" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <input name="userName" value={form.userName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nama User" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
              <input name="department" value={form.department} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Departemen" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select name="kategori" value={form.kategori} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Laptop">Laptop</option>
                <option value="PC">PC</option>
                <option value="Printer">Printer</option>
                <option value="Network">Network</option>
                <option value="Server">Server</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pekerjaan</label>
              <input name="jenisPekerjaan" value={form.jenisPekerjaan} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Maintenance berkala / Perbaikan / Upgrade" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input name="vendor" value={form.vendor} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nama Vendor" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biaya (Rp)</label>
              <input name="biaya" value={form.biaya} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="mis. 1.500.000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasil / Catatan</label>
            <textarea name="hasil" value={form.hasil} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Opsional" />
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

export default MaintenanceDeviceModal;
