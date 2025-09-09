import React, { useEffect, useState } from 'react';

export interface ServiceKendaraanForm {
  platNomor: string;
  merek: string;
  jenisService: string;
  tanggalService: string; // yyyy-mm-dd
  kilometer: string;
  biaya: string; // currency text
  vendor: string;
  status: 'Scheduled' | 'In Progress' | 'Done' | 'Overdue';
  keterangan?: string;
}

interface ServiceKendaraanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceKendaraanForm) => void;
  initialData?: ServiceKendaraanForm | null;
  title?: string;
  submitLabel?: string;
}

const ServiceKendaraanModal: React.FC<ServiceKendaraanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = 'Tambah Service Kendaraan',
  submitLabel = 'Simpan',
}) => {
  const [form, setForm] = useState<ServiceKendaraanForm>({
    platNomor: '',
    merek: '',
    jenisService: '',
    tanggalService: '',
    kilometer: '',
    biaya: '',
    vendor: '',
    status: 'Scheduled',
    keterangan: '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData ?? {
          platNomor: '',
          merek: '',
          jenisService: '',
          tanggalService: '',
          kilometer: '',
          biaya: '',
          vendor: '',
          status: 'Scheduled',
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
    if (!form.platNomor.trim() || !form.merek.trim() || !form.jenisService.trim() || !form.tanggalService) return;
    onSave({
      ...form,
      platNomor: form.platNomor.trim().toUpperCase(),
      merek: form.merek.trim(),
      jenisService: form.jenisService.trim(),
      vendor: form.vendor.trim(),
      biaya: form.biaya.trim(),
      kilometer: form.kilometer.trim(),
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
              <input
                name="platNomor"
                value={form.platNomor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="B 1875 ROB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
              <input
                name="merek"
                value={form.merek}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Expander"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Service</label>
              <input
                name="jenisService"
                value={form.jenisService}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ganti Oli / Tune Up"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Service</label>
              <input
                type="date"
                name="tanggalService"
                value={form.tanggalService}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilometer</label>
              <input
                name="kilometer"
                value={form.kilometer}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mis. 45.000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biaya (Rp)</label>
              <input
                name="biaya"
                value={form.biaya}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mis. 1.500.000"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Bengkel</label>
              <input
                name="vendor"
                value={form.vendor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama Bengkel"
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
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Overdue">Overdue</option>
              </select>
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

export default ServiceKendaraanModal;
