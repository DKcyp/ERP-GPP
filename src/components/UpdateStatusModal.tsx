import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";

export interface UpdateStatusFormData {
  status:
    | "Minat"
    | "Register"
    | "Pra-kualifikasi"
    | "Evaluasi"
    | "Tender"
    | "Deal"
    | "Cancel"
    | "";
  keterangan: string;
}

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateStatusFormData) => void;
  currentItem: {
    id: string;
    namaClient: string;
    statusPenawaran:
      | "Minat"
      | "Register"
      | "Pra-kualifikasi"
      | "Evaluasi"
      | "Tender"
      | "Deal"
      | "Cancel";
  } | null;
}

const statusOptions: Array<NonNullable<UpdateStatusFormData["status"]>> = [
  "Minat",
  "Register",
  "Pra-kualifikasi",
  "Evaluasi",
  "Tender",
  "Deal",
  "Cancel",
];

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentItem,
}) => {
  const [formData, setFormData] = useState<UpdateStatusFormData>({
    status: "",
    keterangan: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentItem) {
      setFormData({
        status: currentItem.statusPenawaran,
        keterangan: "",
      });
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        status: "",
        keterangan: "",
      });
    }

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
  }, [isOpen, onClose, currentItem]);

  const handleInputChange = (field: keyof UpdateStatusFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

    onSave(formData);

    setIsLoading(false);
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Update Status</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Status Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Penawaran
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleInputChange(
                    "status",
                    e.target.value as UpdateStatusFormData["status"]
                  )
                }
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Pilih Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keterangan
              </label>
              <textarea
                value={formData.keterangan}
                onChange={(e) =>
                  handleInputChange("keterangan", e.target.value)
                }
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Tambahkan keterangan..."
              ></textarea>
            </div>
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

export default UpdateStatusModal;
