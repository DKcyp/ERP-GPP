import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { EmployeeDetail } from './PendebtanDashboard';

interface MasterPegawai {
  nama: string;
  bank: string;
  rekening: string;
  departemen: string;
}

interface PendebtanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { periode: string; employees: EmployeeDetail[] }) => void;
  initialPeriode?: string;
  initialEmployees?: EmployeeDetail[];
  masterPegawai: MasterPegawai[];
}

const PendebtanModal: React.FC<PendebtanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPeriode,
  initialEmployees,
  masterPegawai,
}) => {
  const [periode, setPeriode] = useState<string>('');
  const [employees, setEmployees] = useState<EmployeeDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Prefill when opening if initial values are provided
  useEffect(() => {
    if (isOpen) {
      if (initialPeriode) setPeriode(initialPeriode);
      if (initialEmployees && initialEmployees.length > 0) {
        setEmployees(initialEmployees);
      }
    }
  }, [isOpen, initialPeriode, initialEmployees]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPeriode('');
      setEmployees([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Build employee rows when periode changes
  useEffect(() => {
    if (!periode) {
      setEmployees([]);
      return;
    }
    // If initialEmployees are provided (prefill), do not override them
    if (initialEmployees && initialEmployees.length > 0) return;

    // Generate keterangan based on periode
    const periodeDate = new Date(periode + '-01');
    const keterangan = `Gaji ${periodeDate.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    })}`;

    const initial: EmployeeDetail[] = masterPegawai.map((pegawai, index) => ({
      id: index + 1,
      namaPegawai: pegawai.nama,
      bank: pegawai.bank,
      rekening: pegawai.rekening,
      nominal: 0,
      departemen: pegawai.departemen,
      keterangan: keterangan,
    }));
    setEmployees(initial);
  }, [periode, initialEmployees, masterPegawai]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const parseCurrency = (value: string): number => {
    return parseInt(value.replace(/[^\d]/g, '') || '0', 10);
  };

  const updateEmployee = (idx: number, field: keyof EmployeeDetail, value: string | number) => {
    setEmployees((prev) =>
      prev.map((emp, i) => {
        if (i !== idx) return emp;
        if (field === 'nominal') {
          const numValue = typeof value === 'string' ? parseCurrency(value) : value;
          return { ...emp, [field]: numValue };
        }
        return { ...emp, [field]: value };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periode) {
      alert('Pilih periode terlebih dahulu');
      return;
    }
    
    // Filter only employees with nominal > 0
    const employeesWithNominal = employees.filter(emp => emp.nominal > 0);
    
    if (employeesWithNominal.length === 0) {
      alert('Minimal harus ada 1 pegawai dengan nominal > 0');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSave({ periode, employees: employeesWithNominal });
    setIsLoading(false);
    setPeriode('');
    setEmployees([]);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialPeriode ? 'Edit Pendebetan Gaji' : 'Tambah Pendebetan Gaji'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Periode Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode (Bulan - Tahun)
              </label>
              <input
                type="month"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-200"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Pilih bulan dan tahun untuk menampilkan daftar pegawai.
              </p>
            </div>

            {/* Employee Table */}
            {periode && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Daftar Pegawai - Periode{' '}
                      {new Date(periode + '-01').toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Input nominal untuk setiap pegawai. Bank dan rekening diambil dari master data.
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Nama Pegawai
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Bank
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Rekening
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">
                          Nominal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Departemen
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Keterangan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {employees.map((emp, idx) => (
                        <tr
                          key={emp.id}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {emp.namaPegawai}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {emp.bank}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {emp.rekening}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={emp.nominal > 0 ? formatCurrency(emp.nominal) : ''}
                              onChange={(e) =>
                                updateEmployee(idx, 'nominal', e.target.value)
                              }
                              className="w-48 text-right px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp 0"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {emp.departemen}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {emp.keterangan}
                          </td>
                        </tr>
                      ))}
                      {employees.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            Tidak ada data pegawai
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {employees.length > 0 && (
                      <tfoot>
                        <tr className="bg-gradient-to-r from-blue-50 to-gray-50 border-t-2 border-blue-200">
                          <td
                            colSpan={4}
                            className="px-4 py-3 text-sm font-bold text-gray-900 text-right"
                          >
                            TOTAL:
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                            {formatCurrency(
                              employees.reduce((sum, emp) => sum + emp.nominal, 0)
                            )}
                          </td>
                          <td colSpan={2} className="px-4 py-3"></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !periode}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendebtanModal;
