import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface GajiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { period: string; rows: GajiRow[] }) => void;
}

export interface GajiRow {
  namaPegawai: string;
  totalIncome: string; // formatted Rp
  totalDeduct: string; // formatted Rp
  potonganLain: string; // formatted Rp
  gajiBersih: string; // formatted Rp
}

const GajiModal: React.FC<GajiModalProps> = ({ isOpen, onClose, onSave }) => {
  // Periode input (month-year)
  const [period, setPeriod] = useState<string>(''); // format: YYYY-MM from <input type="month" />
  const [rows, setRows] = useState<GajiRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pegawaiOptions = [
    'Ahmad Fauzi',
    'Siti Nurhaliza',
    'Budi Santoso',
    'Rina Setiawati',
    'Wahyudi Hidayat',
    'Siti Aminah',
    'Dedi Kurniawan',
    'Lina Marlina'
  ];

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

  // Helpers: format Rupiah and parsing
  const toNumber = (rp: string) => parseFloat(rp.replace(/[^\d]/g, '')) || 0;
  const formatRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  const formatCurrencyInput = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    const num = parseInt(numericValue || '0', 10);
    return formatRp(num);
  };

  // Build table rows when period changes (mock data based on pegawai list)
  useEffect(() => {
    if (!period) {
      setRows([]);
      return;
    }
    const initial: GajiRow[] = pegawaiOptions.map((nama) => ({
      namaPegawai: nama,
      totalIncome: formatRp(0),
      totalDeduct: formatRp(0),
      potonganLain: formatRp(0),
      gajiBersih: formatRp(0),
    }));
    setRows(initial);
  }, [period]);

  const updateRow = (idx: number, field: keyof GajiRow, value: string) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        // Only currency fields are editable
        const formatted = formatCurrencyInput(value);
        return { ...r, [field]: formatted } as GajiRow;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!period) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave({ period, rows });
    setIsLoading(false);
    // Reset
    setPeriod('');
    setRows([]);
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Entry Gaji Per Periode</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Periode Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode (Bulan - Tahun)
              </label>
              <input
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-200"
              />
              <p className="mt-1 text-xs text-gray-500">Pilih bulan dan tahun untuk menampilkan tabel.</p>
            </div>

            {/* Tabel muncul setelah periode dipilih */}
            {period && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Rekap Gaji Periode {new Date(period + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
                    <p className="text-xs text-gray-500">Daftar pegawai berikut adalah template tampilan. Nilai default 0.</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Pegawai</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Total Income</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Total Deduct</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Potongan lain lain</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Gaji bersih</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rows.map((r, idx) => (
                        <tr key={r.namaPegawai} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                          <td className="px-4 py-3 text-sm text-gray-900">{idx + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{r.namaPegawai}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={r.totalIncome}
                              onChange={(e) => updateRow(idx, 'totalIncome', e.target.value)}
                              className="w-full text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp 0"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={r.totalDeduct}
                              onChange={(e) => updateRow(idx, 'totalDeduct', e.target.value)}
                              className="w-full text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp 0"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={r.potonganLain}
                              onChange={(e) => updateRow(idx, 'potonganLain', e.target.value)}
                              className="w-full text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp 0"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={r.gajiBersih}
                              onChange={(e) => updateRow(idx, 'gajiBersih', e.target.value)}
                              className="w-full text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp 0"
                            />
                          </td>
                        </tr>
                      ))}
                      {rows.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">Tidak ada data</td>
                        </tr>
                      )}
                    </tbody>
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
            Close
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GajiModal;
