import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Trash2 } from 'lucide-react';

interface Kontrak {
  id: string;
  no: number;
  namaOrang: string;
  kualifikasi: string;
  projectName: string;
  mob: string;
  demob: string;
  durasi: string;
}

interface MPPEntry {
  id: number;
  namaOrang: string;
  kualifikasi: string;
  projectName: string;
  mob: string;
  demob: string;
  durasi: string;
}

interface MPPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { kontrakId: string; entries: MPPEntry[] }) => void;
  kontrak: Kontrak | null;
}

const MPPModal: React.FC<MPPModalProps> = ({
  isOpen,
  onClose,
  onSave,
  kontrak,
}) => {
  const [entries, setEntries] = useState<MPPEntry[]>([]);
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

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEntries([]);
      setIsLoading(false);
    } else {
      // Initialize with data from kontrak (auto-filled)
      if (kontrak) {
        // Helper function to convert DD-MM-YYYY to YYYY-MM-DD
        const convertDateFormat = (dateStr: string): string => {
          if (!dateStr || dateStr === '-') return '';
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };

        setEntries([
          {
            id: 1,
            namaOrang: kontrak.namaOrang || '',
            kualifikasi: kontrak.kualifikasi || '',
            projectName: kontrak.projectName || '',
            mob: convertDateFormat(kontrak.mob) || '',
            demob: convertDateFormat(kontrak.demob) || '',
            durasi: kontrak.durasi || '',
          },
        ]);
      } else {
        // Fallback to empty entry if no kontrak data
        setEntries([
          {
            id: 1,
            namaOrang: '',
            kualifikasi: '',
            projectName: '',
            mob: '',
            demob: '',
            durasi: '',
          },
        ]);
      }
    }
  }, [isOpen, kontrak]);

  const removeEntry = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (id: number, field: keyof MPPEntry, value: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // Calculate durasi when mob and demob change
  const calculateDurasi = (mob: string, demob: string): string => {
    if (!mob || !demob) return '';
    
    try {
      const mobDate = new Date(mob);
      const demobDate = new Date(demob);
      
      if (mobDate && demobDate && demobDate >= mobDate) {
        const diffTime = Math.abs(demobDate.getTime() - mobDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} Hari`;
      }
    } catch (error) {
      return '';
    }
    
    return '';
  };

  const handleMobChange = (id: number, value: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      const durasi = calculateDurasi(value, entry.demob);
      setEntries(
        entries.map((e) =>
          e.id === id ? { ...e, mob: value, durasi } : e
        )
      );
    }
  };

  const handleDemobChange = (id: number, value: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      const durasi = calculateDurasi(entry.mob, value);
      setEntries(
        entries.map((e) =>
          e.id === id ? { ...e, demob: value, durasi } : e
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!kontrak) {
      alert('Data kontrak tidak ditemukan');
      return;
    }

    // Validate entries
    const invalidEntries = entries.filter(
      (entry) =>
        !entry.namaOrang ||
        !entry.kualifikasi ||
        !entry.projectName ||
        !entry.mob ||
        !entry.demob
    );

    if (invalidEntries.length > 0) {
      alert('Harap lengkapi semua field yang wajib diisi');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSave({ kontrakId: kontrak.id, entries });
    setIsLoading(false);
    setEntries([]);
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              MPP (Manpower Planning)
            </h2>
            {kontrak && (
              <p className="text-sm text-gray-600 mt-1">
                Project: <span className="font-semibold">{kontrak.projectName}</span>
              </p>
            )}
          </div>
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
            {/* Entries Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        Nama Orang <span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        Kualifikasi <span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        Project Name <span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        MOB <span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        DEMOB <span className="text-red-500">*</span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        Durasi
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {entries.map((entry, idx) => (
                      <tr
                        key={entry.id}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={entry.namaOrang}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                            placeholder="Masukkan nama"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={entry.kualifikasi}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                            placeholder="Contoh: Engineer, Supervisor"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={entry.projectName}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                            placeholder="Nama project"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="date"
                            value={entry.mob}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="date"
                            value={entry.demob}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {entry.durasi || '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeEntry(entry.id)}
                            disabled={entries.length === 1}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {entries.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-6 text-center text-sm text-gray-500"
                        >
                          Belum ada data. Klik "Tambah Orang" untuk menambah.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-xs text-gray-500 italic">
              <span className="text-red-500">*</span> Field wajib diisi
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
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || entries.length === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Simpan MPP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MPPModal;
