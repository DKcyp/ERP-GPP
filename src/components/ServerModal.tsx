import React, { useEffect, useState } from 'react';

export interface ServerForm {
  serverName: string;
  ipAddress: string;
  location: string;
  os: string;
  role: 'Application' | 'Database' | 'Web' | 'File' | 'Backup' | 'Other';
  uptime: string; // e.g., 12 days
  cpu: string; // e.g., 35%
  memory: string; // e.g., 8/32 GB
  storage: string; // e.g., 500/1000 GB
  status: 'Online' | 'Degraded' | 'Offline' | 'Maintenance';
  lastChecked: string; // yyyy-mm-dd
  notes?: string;
}

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServerForm) => void;
  initialData?: ServerForm | null;
  title?: string;
  submitLabel?: string;
}

const ServerModal: React.FC<ServerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Server',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<ServerForm>({
    serverName: '',
    ipAddress: '',
    location: '',
    os: '',
    role: 'Other',
    uptime: '',
    cpu: '',
    memory: '',
    storage: '',
    status: 'Online',
    lastChecked: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          serverName: '',
          ipAddress: '',
          location: '',
          os: '',
          role: 'Other',
          uptime: '',
          cpu: '',
          memory: '',
          storage: '',
          status: 'Online',
          lastChecked: '',
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
    if (!form.serverName.trim() || !form.ipAddress.trim() || !form.location.trim() || !form.os.trim() || !form.lastChecked) return;
    onSave({
      ...form,
      serverName: form.serverName.trim(),
      ipAddress: form.ipAddress.trim(),
      location: form.location.trim(),
      os: form.os.trim(),
      uptime: form.uptime.trim(),
      cpu: form.cpu.trim(),
      memory: form.memory.trim(),
      storage: form.storage.trim(),
      notes: form.notes?.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Server</label>
              <input name="serverName" value={form.serverName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="SRV-APP-01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
              <input name="ipAddress" value={form.ipAddress} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="192.168.1.10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input name="location" value={form.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Data Center / Kantor" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OS</label>
              <input name="os" value={form.os} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ubuntu 22.04 / Windows Server" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Application">Application</option>
                <option value="Database">Database</option>
                <option value="Web">Web</option>
                <option value="File">File</option>
                <option value="Backup">Backup</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Uptime</label>
              <input name="uptime" value={form.uptime} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="mis. 12 days" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPU</label>
              <input name="cpu" value={form.cpu} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="mis. 35%" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Memory</label>
              <input name="memory" value={form.memory} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="mis. 8/32 GB" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage</label>
              <input name="storage" value={form.storage} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="mis. 500/1000 GB" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Online">Online</option>
                <option value="Degraded">Degraded</option>
                <option value="Offline">Offline</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terakhir Dicek</label>
              <input type="date" name="lastChecked" value={form.lastChecked} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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

export default ServerModal;
