import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";

interface StatusDokumenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: string) => void;
  alurDokumen: string;
  currentStatus: string;
}

// Define status options for each alur dokumen
const statusOptions: Record<string, string[]> = {
  "Project PHE ONWJ": [
    "SUBMIT & AFTER REVISI REPORT",
    "PREPARE TIDMS",
    "SCAN DAN BURNING FILM",
    "BAP",
    "BAP AFTER REVISI",
    "PREPARE & SUBMIT PI",
    "PREPARE SP3",
    "PREPARE INVOICE",
  ],
  "Project Medco Gresik": [
    "SUBMIT REPORT",
    "VERIFIKASI REPORT BA",
    "PI SUBMISSION",
    "PROSES INVOICE",
    "LOKET TERM",
    "PLAN SO MINUS",
  ],
  "Pertamina Hulu Mahakam": [
    "Approval SES, BAST & SP3",
    "SUBMIT DRAFT PBR",
    "REVIEW REPORT",
    "APPROVAL PBR",
    "SUBMIT BAST & SP3 VENDOR LIST",
    "REQUEST NO INV/KWI/FP",
    "SUBMIT COMPILED INVOICE TO LIKET PHM FOR VERIFICATION",
    "LOKET PHM",
  ],
};

const StatusDokumenModal: React.FC<StatusDokumenModalProps> = ({
  isOpen,
  onClose,
  onSave,
  alurDokumen,
  currentStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedStatus);
    onClose();
  };

  const availableStatuses = statusOptions[alurDokumen] || [];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600">
          <h2 className="text-2xl font-bold text-white">
            Update Status Dokumen
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Alur Dokumen Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900">
              Alur Dokumen: <span className="font-bold">{alurDokumen}</span>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Status Saat Ini: <span className="font-semibold">{currentStatus}</span>
            </p>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pilih Status Dokumen Baru
            </label>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableStatuses.map((status, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedStatus(status)}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedStatus === status
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                        selectedStatus === status
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedStatus === status && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          selectedStatus === status
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          selectedStatus === status
                            ? "text-blue-900"
                            : "text-gray-700"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors duration-200 text-sm shadow-md font-medium"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm shadow-md flex items-center space-x-2 font-medium"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Simpan Status</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusDokumenModal;
