import React, { useState, useEffect } from "react";

interface SatuanBarang {
  no: number;
  nama: string;
  deskripsi: string;
  satuanDasar: string;
  satuanKonversi: string;
  faktorKonversi: number;
}

interface TambahSatuanBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    nama: string,
    deskripsi: string,
    satuanDasar: string,
    satuanKonversi: string,
    faktorKonversi: number
  ) => void; // New onSave prop
  editingUnit: SatuanBarang | null; // New prop for editing existing unit
}

const TambahSatuanBarangModal: React.FC<TambahSatuanBarangModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingUnit, // Destructure new prop
}) => {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [satuanDasar, setSatuanDasar] = useState("");
  const [satuanKonversi, setSatuanKonversi] = useState("");
  const [faktorKonversi, setFaktorKonversi] = useState<number | "">("");

  useEffect(() => {
    if (isOpen) {
      if (editingUnit) {
        setNama(editingUnit.nama);
        setDeskripsi(editingUnit.deskripsi);
        setSatuanDasar(editingUnit.satuanDasar);
        setSatuanKonversi(editingUnit.satuanKonversi);
        setFaktorKonversi(editingUnit.faktorKonversi);
      } else {
        setNama("");
        setDeskripsi("");
        setSatuanDasar("");
        setSatuanKonversi("");
        setFaktorKonversi("");
      }
    }
  }, [isOpen, editingUnit]);

  const handleSave = () => {
    onSave(
      nama,
      deskripsi,
      satuanDasar,
      satuanKonversi,
      typeof faktorKonversi === "number" ? faktorKonversi : 0
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 transform transition-all duration-300 scale-95">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Entry Satuan Barang
        </h3>
        <div className="space-y-5">
          <div>
            <label
              htmlFor="namaSatuan"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nama Satuan
            </label>
            <input
              type="text"
              id="namaSatuan"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Masukkan Nama Satuan"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="deskripsi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deskripsi
            </label>
            <input
              type="text"
              id="deskripsi"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Masukkan Deskripsi Satuan"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="satuanDasar"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Satuan Dasar
            </label>
            <input
              type="text"
              id="satuanDasar"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Contoh: Pcs"
              value={satuanDasar}
              onChange={(e) => setSatuanDasar(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="satuanKonversi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Satuan Konversi
            </label>
            <input
              type="text"
              id="satuanKonversi"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Contoh: Kardus"
              value={satuanKonversi}
              onChange={(e) => setSatuanKonversi(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="faktorKonversi"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Faktor Konversi
            </label>
            <input
              type="number"
              id="faktorKonversi"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Contoh: 12 (untuk 1 kardus = 12 pcs)"
              value={faktorKonversi}
              onChange={(e) =>
                setFaktorKonversi(parseFloat(e.target.value) || "")
              }
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TambahSatuanBarangModal;
