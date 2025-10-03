import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

interface KPIDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    nama: string;
    posisi: string;
    atasan: string;
    departemen: string;
    masaKerja: string;
    kpi: { month: string; value: number; healthyWeek: number }[];
  } | null;
  onSave: (
    kpiId: string,
    updatedKpi: { month: string; value: number; healthyWeek: number }[]
  ) => void;
}

const KPIDetailModal: React.FC<KPIDetailModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [editingKpi, setEditingKpi] = useState<
    { month: string; value: number; healthyWeek: number }[]
  >([]);

  // Initialize with all 12 months
  const initializeMonthlyData = () => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    return months.map(month => {
      const existingData = data?.kpi.find(k => k.month === month);
      return {
        month,
        value: existingData?.value || 0,
        healthyWeek: existingData?.healthyWeek || 0
      };
    });
  };

  useEffect(() => {
    if (isOpen && data) {
      setEditingKpi(initializeMonthlyData());
    } else {
      setEditingKpi([]);
    }
  }, [isOpen, data]);

  const handleKpiChange = (
    month: string,
    field: "value" | "healthyWeek",
    newValue: string
  ) => {
    const numValue = parseFloat(newValue) || 0;
    setEditingKpi((prev) =>
      prev.map((k) =>
        k.month === month ? { ...k, [field]: numValue } : k
      )
    );
  };

  const handleSave = () => {
    if (data) {
      onSave(data.id, editingKpi);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              📊 KPI Detail - {data?.nama}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {data?.posisi} • {data?.departemen} • Masa Kerja: {data?.masaKerja}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              📅 Data KPI & Healthy Week Bulanan
            </h4>
            <p className="text-sm text-gray-600">
              Edit nilai KPI dan Healthy Week untuk setiap bulan. Nilai berkisar 0-100.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Bulan
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    📈 KPI Score
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                    💪 Healthy Week Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {editingKpi.map((k, index) => (
                  <tr 
                    key={k.month} 
                    className={`hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 border-r border-gray-200">
                      {k.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center border-r border-gray-200">
                      <input
                        type="number"
                        value={k.value}
                        onChange={(e) =>
                          handleKpiChange(k.month, "value", e.target.value)
                        }
                        className="w-24 border-2 border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="number"
                        value={k.healthyWeek}
                        onChange={(e) =>
                          handleKpiChange(
                            k.month,
                            "healthyWeek",
                            e.target.value
                          )
                        }
                        className="w-24 border-2 border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-2">📊 KPI Summary</h5>
              <div className="text-sm text-blue-700">
                <p>Rata-rata: {(editingKpi.reduce((sum, k) => sum + k.value, 0) / 12).toFixed(1)}</p>
                <p>Tertinggi: {Math.max(...editingKpi.map(k => k.value))}</p>
                <p>Terendah: {Math.min(...editingKpi.map(k => k.value))}</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h5 className="font-semibold text-green-800 mb-2">💪 Healthy Week Summary</h5>
              <div className="text-sm text-green-700">
                <p>Rata-rata: {(editingKpi.reduce((sum, k) => sum + k.healthyWeek, 0) / 12).toFixed(1)}</p>
                <p>Tertinggi: {Math.max(...editingKpi.map(k => k.healthyWeek))}</p>
                <p>Terendah: {Math.min(...editingKpi.map(k => k.healthyWeek))}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KPIDetailModal;
