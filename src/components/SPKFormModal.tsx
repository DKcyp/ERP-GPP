import React, { useState, useEffect } from 'react';
import { X, Loader2, ThumbsUp } from 'lucide-react'; // Added ThumbsUp
import { SPKData, EmployeeData } from '../types';

interface SPKFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (spk: SPKData) => void;
  editingSPK: SPKData | null;
  isApprovalMode?: boolean; // New prop
}

const dummyEmployees: EmployeeData[] = [
  { id: 'emp-001', name: 'Budi Santoso', position: 'Teknisi Senior', department: 'Operasional' },
  { id: 'emp-002', name: 'Siti Aminah', position: 'Staf Administrasi', department: 'HRD' },
  { id: 'emp-003', name: 'Joko Susilo', position: 'Manajer Proyek', department: 'Proyek' },
  { id: 'emp-004', name: 'Dewi Lestari', position: 'Akuntan', department: 'Finance' },
  { id: 'emp-005', name: 'Rudi Hartono', position: 'Supervisor Gudang', department: 'Gudang' },
  { id: 'emp-006', name: 'Andi Wijaya', position: 'Analis Data', department: 'IT' },
  { id: 'emp-007', name: 'Maya Sari', position: 'Desainer Grafis', department: 'Marketing' },
];

const SPKFormModal: React.FC<SPKFormModalProps> = ({ isOpen, onClose, onSave, editingSPK, isApprovalMode }) => {
  const [spkForm, setSpkForm] = useState<Omit<SPKData, 'id'>>({
    noSPK: '',
    tanggalSPK: '',
    namaPegawai: '',
    jabatan: '',
    departemen: '',
    jenisPekerjaan: '',
    lokasiKerja: '',
    periodeAwal: '',
    periodeAkhir: '',
    statusSPK: 'Pending', // Default to Pending for new SPK
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (editingSPK) {
        setSpkForm(editingSPK);
      } else {
        // Generate new SPK number for new entry
        const newSPKNum = Math.floor(Math.random() * 1000) + 1;
        const formattedSPKNum = String(newSPKNum).padStart(3, '0');
        const currentYear = new Date().getFullYear();
        setSpkForm({
          noSPK: `SPK/HRD/${formattedSPKNum}/${currentYear}`,
          tanggalSPK: new Date().toISOString().split('T')[0], // Current date
          namaPegawai: '',
          jabatan: '',
          departemen: '',
          jenisPekerjaan: '',
          lokasiKerja: '',
          periodeAwal: '',
          periodeAkhir: '',
          statusSPK: 'Pending', // Default to Pending
        });
      }
      setErrors({});
    }
  }, [isOpen, editingSPK]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSpkForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'namaPegawai') {
      const selectedEmployee = dummyEmployees.find(emp => emp.name === value);
      if (selectedEmployee) {
        setSpkForm((prev) => ({
          ...prev,
          jabatan: selectedEmployee.position,
          departemen: selectedEmployee.department,
        }));
      } else {
        setSpkForm((prev) => ({
          ...prev,
          jabatan: '',
          departemen: '',
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!spkForm.namaPegawai) newErrors.namaPegawai = 'Nama Pegawai wajib diisi.';
    if (!spkForm.jenisPekerjaan) newErrors.jenisPekerjaan = 'Jenis Pekerjaan wajib diisi.';
    if (!spkForm.lokasiKerja) newErrors.lokasiKerja = 'Lokasi Kerja wajib diisi.';
    if (!spkForm.periodeAwal) newErrors.periodeAwal = 'Periode Awal wajib diisi.';
    if (!spkForm.periodeAkhir) newErrors.periodeAkhir = 'Periode Akhir wajib diisi.';

    if (spkForm.periodeAwal && spkForm.periodeAkhir) {
      const start = new Date(spkForm.periodeAwal);
      const end = new Date(spkForm.periodeAkhir);
      if (start > end) {
        newErrors.periodeAkhir = 'Periode Akhir tidak boleh sebelum Periode Awal.';
      }

      const threeMonthsLater = new Date(start);
      threeMonthsLater.setMonth(start.getMonth() + 3);
      if (end > threeMonthsLater) {
        newErrors.periodeAkhir = 'Periode Kerja maksimal 3 bulan.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newSPK: SPKData = {
      id: editingSPK ? editingSPK.id : `SPK-${Date.now()}`, // Use existing ID or generate new
      ...spkForm,
    };
    onSave(newSPK);
    setIsLoading(false);
    onClose();
  };

  const handleApprove = async () => {
    if (!validateForm()) return; // Validate before approving

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const approvedSPK: SPKData = {
      ...(editingSPK || spkForm),
      statusSPK: 'Aktif', // Change status to Aktif upon approval
    };
    onSave(approvedSPK);
    setIsLoading(false);
    onClose();
    alert('SPK berhasil di-approve!');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-2xl font-bold text-text">
            {isApprovalMode ? 'Approve SPK' : (editingSPK ? 'Edit SPK' : 'Tambah SPK Baru')}
          </h3>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-text transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="noSPK" className="block text-sm font-medium text-textSecondary mb-1">
                Nomor SPK
              </label>
              <input
                type="text"
                id="noSPK"
                name="noSPK"
                value={spkForm.noSPK}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="tanggalSPK" className="block text-sm font-medium text-textSecondary mb-1">
                Tanggal SPK
              </label>
              <input
                type="date"
                id="tanggalSPK"
                name="tanggalSPK"
                value={spkForm.tanggalSPK}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="namaPegawai" className="block text-sm font-medium text-textSecondary mb-1">
                Nama Pegawai
              </label>
              <select
                id="namaPegawai"
                name="namaPegawai"
                value={spkForm.namaPegawai}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Pilih Pegawai</option>
                {dummyEmployees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>
              {errors.namaPegawai && <p className="text-error text-xs mt-1">{errors.namaPegawai}</p>}
            </div>
            <div>
              <label htmlFor="jabatan" className="block text-sm font-medium text-textSecondary mb-1">
                Jabatan
              </label>
              <input
                type="text"
                id="jabatan"
                name="jabatan"
                value={spkForm.jabatan}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary cursor-not-allowed"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="departemen" className="block text-sm font-medium text-textSecondary mb-1">
                Departemen / Divisi
              </label>
              <input
                type="text"
                id="departemen"
                name="departemen"
                value={spkForm.departemen}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="lokasiKerja" className="block text-sm font-medium text-textSecondary mb-1">
                Lokasi Kerja / Proyek
              </label>
              <input
                type="text"
                id="lokasiKerja"
                name="lokasiKerja"
                value={spkForm.lokasiKerja}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary"
                placeholder="Contoh: Proyek Gedung A"
                required
              />
              {errors.lokasiKerja && <p className="text-error text-xs mt-1">{errors.lokasiKerja}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="jenisPekerjaan" className="block text-sm font-medium text-textSecondary mb-1">
              Jenis Pekerjaan
            </label>
            <textarea
              id="jenisPekerjaan"
              name="jenisPekerjaan"
              rows={3}
              value={spkForm.jenisPekerjaan}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary resize-y"
              placeholder="Deskripsi pekerjaan..."
              required
            ></textarea>
            {errors.jenisPekerjaan && <p className="text-error text-xs mt-1">{errors.jenisPekerjaan}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="periodeAwal" className="block text-sm font-medium text-textSecondary mb-1">
                Periode Kerja Awal
              </label>
              <input
                type="date"
                id="periodeAwal"
                name="periodeAwal"
                value={spkForm.periodeAwal}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary"
                required
              />
              {errors.periodeAwal && <p className="text-error text-xs mt-1">{errors.periodeAwal}</p>}
            </div>
            <div>
              <label htmlFor="periodeAkhir" className="block text-sm font-medium text-textSecondary mb-1">
                Periode Kerja Akhir
              </label>
              <input
                type="date"
                id="periodeAkhir"
                name="periodeAkhir"
                value={spkForm.periodeAkhir}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary"
                required
              />
              {errors.periodeAkhir && <p className="text-error text-xs mt-1">{errors.periodeAkhir}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="statusSPK" className="block text-sm font-medium text-textSecondary mb-1">
              Status SPK
            </label>
            <select
              id="statusSPK"
              name="statusSPK"
              value={spkForm.statusSPK}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Aktif">Aktif</option>
              <option value="Approved">Approved</option>
              <option value="Selesai">Selesai</option>
              <option value="Batal">Batal</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              disabled={isLoading}
            >
              Batal
            </button>
            {isApprovalMode ? (
              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2 bg-success text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Approving...
                  </>
                ) : (
                  <>
                    <ThumbsUp className="h-4 w-4 mr-2" /> Approve
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Menyimpan...
                  </>
                ) : (
                  'Simpan'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SPKFormModal;
