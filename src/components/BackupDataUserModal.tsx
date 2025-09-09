import React, { useEffect, useState } from 'react';

export interface BackupDataUserForm {
  userName: string;
  department: string;
  deviceName: string;
  backupType: 'Full' | 'Incremental';
  backupDate: string; // yyyy-mm-dd
  storageLocation: string; // e.g., NAS-01 / Google Drive
  size: string; // e.g., 15 GB
  status: 'Scheduled' | 'Running' | 'Successful' | 'Failed';
  notes?: string;
}

interface BackupDataUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BackupDataUserForm) => void;
  initialData?: BackupDataUserForm | null;
  title?: string;
  submitLabel?: string;
}

const BackupDataUserModal: React.FC<BackupDataUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Backup User',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<BackupDataUserForm>({
    userName: '',
    department: '',
    deviceName: '',
    backupType: 'Full',
    backupDate: '',
    storageLocation: '',
    size: '',
    status: 'Scheduled',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          userName: '',
          department: '',
          deviceName: '',
          backupType: 'Full',
          backupDate: '',
          storageLocation: '',
          size: '',
          status: 'Scheduled',
          notes: '',
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
    if (!form.userName.trim() || !form.department.trim() || !form.deviceName.trim() || !form.backupDate) return;
    onSave({
      ...form,
      userName: form.userName.trim(),
      department: form.department.trim(),
      deviceName: form.deviceName.trim(),
      storageLocation: form.storageLocation.trim(),
      size: form.size.trim(),
      notes: form.notes?.trim(),
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
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <input name="userName" value={form.userName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nama User" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
              <input name="department" value={form.department} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Departemen" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Perangkat</label>
              <input name="deviceName" value={form.deviceName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Laptop-User01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Backup</label>
              <select name="backupType" value={form.backupType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Full">Full</option>
                <option value="Incremental">Incremental</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Backup</label>
              <input type="date" name="backupDate" value={form.backupDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Penyimpanan</label>
              <input name="storageLocation" value={form.storageLocation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="NAS-01 / Google Drive" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran</label>
              <input name="size" value={form.size} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="mis. 15 GB" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Scheduled">Scheduled</option>
                <option value="Running">Running</option>
                <option value="Successful">Successful</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Opsional" />
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

export default BackupDataUserModal;
