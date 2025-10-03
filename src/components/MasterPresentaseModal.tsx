import React, { useState } from "react";
import { X, Plus, Edit, Trash2, Percent } from "lucide-react";

interface PresentaseItem {
  id: string;
  kpi: string;
  healthyWeek: number;
}

interface MasterPresentaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MasterPresentaseModal: React.FC<MasterPresentaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [presentaseData, setPresentaseData] = useState<PresentaseItem[]>([
    { id: "p1", kpi: "Komunikasi", healthyWeek: 20 },
    { id: "p2", kpi: "Kepemimpinan", healthyWeek: 25 },
    { id: "p3", kpi: "Kedisiplinan", healthyWeek: 15 },
    { id: "p4", kpi: "Keselamatan Kerja", healthyWeek: 20 },
    { id: "p5", kpi: "Produktivitas", healthyWeek: 20 },
    { id: "p6", kpi: "Keterlambatan", healthyWeek: 10 },
    { id: "p7", kpi: "Mengaji", healthyWeek: 15 },
    { id: "p8", kpi: "Kajian", healthyWeek: 12 },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PresentaseItem>({
    id: "",
    kpi: "",
    healthyWeek: 0,
  });

  const handleAdd = () => {
    if (formData.kpi && formData.healthyWeek > 0) {
      setPresentaseData((prev) => [
        { ...formData, id: Date.now().toString() },
        ...prev,
      ]);
      setFormData({ id: "", kpi: "", healthyWeek: 0 });
    }
  };

  const handleEdit = (item: PresentaseItem) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleUpdate = () => {
    if (editingId && formData.kpi && formData.healthyWeek > 0) {
      setPresentaseData((prev) =>
        prev.map((item) =>
          item.id === editingId ? formData : item
        )
      );
      setEditingId(null);
      setFormData({ id: "", kpi: "", healthyWeek: 0 });
    }
  };

  const handleDelete = (id: string) => {
    setPresentaseData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ id: "", kpi: "", healthyWeek: 0 });
  };

  const totalPercentage = presentaseData.reduce((sum, item) => sum + item.healthyWeek, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-green-50 to-white">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Percent className="h-6 w-6 text-green-600" />
              <span>Master Presentase KPI</span>
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Atur presentase untuk setiap indikator KPI dan Healthy Week
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
        <div className="p-6">
          {/* Form Input */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">
              {editingId ? "Edit Presentase" : "Tambah Presentase Baru"}
            </h4>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama KPI
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Komunikasi"
                  value={formData.kpi}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, kpi: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Healthy Week (%)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.healthyWeek}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      healthyWeek: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
              <div className="flex gap-2">
                {editingId ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                Total Presentase: {totalPercentage}%
              </span>
              <span className={`text-sm font-bold ${
                totalPercentage === 100 
                  ? 'text-green-600' 
                  : totalPercentage > 100 
                    ? 'text-red-600' 
                    : 'text-orange-600'
              }`}>
                {totalPercentage === 100 
                  ? '✅ Perfect!' 
                  : totalPercentage > 100 
                    ? '⚠️ Over 100%' 
                    : '⚠️ Under 100%'}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    KPI
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Healthy Week (%)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {presentaseData.map((item, index) => (
                  <tr 
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.kpi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                        {item.healthyWeek}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 text-xs font-medium transition-colors"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-medium transition-colors"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {presentaseData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Percent className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada data presentase KPI</p>
              <p className="text-sm">Tambahkan data menggunakan form di atas</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterPresentaseModal;
