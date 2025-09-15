import React, { useState, useEffect, useRef } from "react";
import { X, Save, Loader2 } from "lucide-react";

interface GajiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { period: string; rows: GajiRow[] }) => void;
  initialPeriod?: string;
  initialRows?: GajiRow[];
  showStages?: boolean; // when true, show Tahap 1/2/3 and Outstanding columns
}

export interface GajiRow {
  namaPegawai: string;
  totalIncome: string; // formatted Rp
  totalDeduct: string; // formatted Rp
  potonganLain: string; // formatted Rp
  gajiBersih: string; // formatted Rp
  // Optional stage breakdowns
  tahap1?: string; // formatted Rp
  tahap2?: string; // formatted Rp
  tahap3?: string; // formatted Rp
  outstanding?: string; // formatted Rp
}

const GajiModal: React.FC<GajiModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPeriod,
  initialRows,
  showStages,
}) => {
  // Periode input (month-year)
  const [period, setPeriod] = useState<string>(""); // format: YYYY-MM from <input type="month" />
  const [rows, setRows] = useState<GajiRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const topScrollRef = useRef<HTMLDivElement | null>(null);
  const bottomScrollRef = useRef<HTMLDivElement | null>(null);

  const handleTopScroll = () => {
    const top = topScrollRef.current;
    const bottom = bottomScrollRef.current;
    if (top && bottom && bottom.scrollLeft !== top.scrollLeft) {
      bottom.scrollLeft = top.scrollLeft;
    }
  };

  const handleBottomScroll = () => {
    const top = topScrollRef.current;
    const bottom = bottomScrollRef.current;
    if (top && bottom && top.scrollLeft !== bottom.scrollLeft) {
      top.scrollLeft = bottom.scrollLeft;
    }
  };

  const pegawaiOptions = [
    "Ahmad Fauzi",
    "Siti Nurhaliza",
    "Budi Santoso",
    "Rina Setiawati",
    "Wahyudi Hidayat",
    "Siti Aminah",
    "Dedi Kurniawan",
    "Lina Marlina",
  ];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Prefill when opening if initial values are provided
  useEffect(() => {
    if (isOpen) {
      if (initialPeriod) setPeriod(initialPeriod);
      if (initialRows && initialRows.length > 0) setRows(initialRows);
    }
  }, [isOpen, initialPeriod, initialRows]);

  // Reset when modal closes (so next open Tambah is clean)
  useEffect(() => {
    if (!isOpen) {
      setPeriod("");
      setRows([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Helpers: format Rupiah and parsing
  const toNumber = (rp: string) => parseFloat(rp.replace(/[^\d]/g, "")) || 0;
  const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const formatCurrencyInput = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    const num = parseInt(numericValue || "0", 10);
    return formatRp(num);
  };

  // Build table rows when period changes (mock data based on pegawai list)
  useEffect(() => {
    if (!period) {
      setRows([]);
      return;
    }
    // If initialRows are provided (prefill), do not override them
    if (initialRows && initialRows.length > 0) return;
    const initial: GajiRow[] = pegawaiOptions.map((nama) => ({
      namaPegawai: nama,
      totalIncome: formatRp(0),
      totalDeduct: formatRp(0),
      potonganLain: formatRp(0),
      gajiBersih: formatRp(0),
      tahap1: formatRp(0),
      tahap2: formatRp(0),
      tahap3: formatRp(0),
      outstanding: formatRp(0),
    }));
    setRows(initial);
  }, [period, initialRows]);

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
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSave({ period, rows });
    setIsLoading(false);
    // Reset
    setPeriod("");
    setRows([]);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Download a simple text payslip for the given row (Detail mode)
  const handleDownloadPayslip = (row: GajiRow) => {
    const lines = [
      `Payslip`,
      `Periode: ${period}`,
      `Nama Pegawai: ${row.namaPegawai}`,
      `Total Income: ${row.totalIncome}`,
      `Total Deduct: ${row.totalDeduct}`,
      `Potongan lain lain: ${row.potonganLain}`,
      ...(showStages
        ? [
            `Tahap 1: ${row.tahap1 ?? 'Rp 0'}`,
            `Tahap 2: ${row.tahap2 ?? 'Rp 0'}`,
            `Tahap 3: ${row.tahap3 ?? 'Rp 0'}`,
            `Outstanding: ${row.outstanding ?? 'Rp 0'}`,
          ]
        : []),
      `Gaji bersih: ${row.gajiBersih}`,
    ];
    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safePeriod = period.replace(/\//g, '-');
    a.href = url;
    a.download = `Payslip_${row.namaPegawai.replace(/\s+/g, '_')}_${safePeriod}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">
            Entry Gaji Per Periode
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto overflow-x-auto max-h-[calc(90vh-160px)]">
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
              <p className="mt-1 text-xs text-gray-500">
                Pilih bulan dan tahun untuk menampilkan tabel.
              </p>
            </div>

            {/* Tabel muncul setelah periode dipilih */}
            {period && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Rekap Gaji Periode{" "}
                      {new Date(period + "-01").toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Daftar pegawai berikut adalah template tampilan. Nilai
                      default 0.
                    </p>
                  </div>
                </div>
                {/* Top synchronized horizontal scrollbar */}
                <div
                  ref={topScrollRef}
                  onScroll={handleTopScroll}
                  className="overflow-x-auto"
                >
                  <div className="min-w-[1400px] h-4" />
                </div>
                <div
                  ref={bottomScrollRef}
                  onScroll={handleBottomScroll}
                  className="overflow-x-auto"
                >
                  <table className="min-w-[1400px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          No
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Nama Pegawai
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Total Income
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Total Deduct
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Potongan lain lain
                        </th>
                        {showStages && (
                          <>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                              Tahap 1
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                              Tahap 2
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                              Tahap 3
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                              Outstanding
                            </th>
                          </>
                        )}
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Gaji bersih
                        </th>
                        {showStages && (
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                            Payslip
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rows.map((r, idx) => (
                        <tr
                          key={r.namaPegawai}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-25"}
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {r.namaPegawai}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={r.totalIncome}
                              onChange={(e) =>
                                updateRow(idx, "totalIncome", e.target.value)
                              }
                              className="w-40 text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp 0"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={r.totalDeduct}
                              onChange={(e) =>
                                updateRow(idx, "totalDeduct", e.target.value)
                              }
                              className="w-40 text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp 0"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={r.potonganLain}
                              onChange={(e) =>
                                updateRow(idx, "potonganLain", e.target.value)
                              }
                              className="w-40 text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp 0"
                            />
                          </td>
                          {showStages && (
                            <>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={r.tahap1 ?? "Rp 0"}
                                  onChange={(e) =>
                                    updateRow(idx, "tahap1", e.target.value)
                                  }
                                  className="w-40 text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Rp 0"
                                />
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={r.tahap2 ?? "Rp 0"}
                                  onChange={(e) =>
                                    updateRow(idx, "tahap2", e.target.value)
                                  }
                                  className="w-40 text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Rp 0"
                                />
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={r.tahap3 ?? "Rp 0"}
                                  onChange={(e) =>
                                    updateRow(idx, "tahap3", e.target.value)
                                  }
                                  className="w-40 text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Rp 0"
                                />
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={r.outstanding ?? "Rp 0"}
                                  onChange={(e) =>
                                    updateRow(
                                      idx,
                                      "outstanding",
                                      e.target.value
                                    )
                                  }
                                  className="w-40 text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Rp 0"
                                />
                              </td>
                            </>
                          )}
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={r.gajiBersih}
                              onChange={(e) =>
                                updateRow(idx, "gajiBersih", e.target.value)
                              }
                              className="w-40 text-right px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp 0"
                            />
                          </td>
                          {showStages && (
                            <td className="px-4 py-2 text-sm text-center">
                              <button
                                type="button"
                                onClick={() => handleDownloadPayslip(r)}
                                className="px-3 py-1 rounded-md border border-gray-300 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                title="Download payslip"
                              >
                                Download
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {rows.length === 0 && (
                        <tr>
                          <td
                            colSpan={showStages ? 11 : 6}
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            Tidak ada data
                          </td>
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
