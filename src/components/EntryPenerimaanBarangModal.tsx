import React, { useState } from "react";
import { X, Trash2, Plus } from "lucide-react";

type Mode = "create" | "view" | "edit";

interface HeaderData {
  noInvoice?: string;
  noPo?: string;
  namaSupplier?: string;
  tanggalPenerimaan?: string; // yyyy-mm-dd
  catatan?: string;
  noRFI?: string;
}

interface ItemData {
  kode: string;
  nama: string;
  kategori: string;
  satuan: string;
  diminta: number;
  diterima: number;
  hargaSatuan: string;
  hargaTotal: string;
  kondisi: string;
  tglExp: string; // yyyy-mm-dd
}

interface EntryPenerimaanBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: Mode;
  headerData?: HeaderData;
  itemsData?: ItemData[];
}

// Data master PO-Supplier untuk auto-select
const masterPoSupplier = [
  { noPo: 'PO001', namaSupplier: 'Supplier A' },
  { noPo: 'PO002', namaSupplier: 'Supplier B' },
  { noPo: 'PO003', namaSupplier: 'Supplier C' },
  { noPo: 'PO004', namaSupplier: 'Supplier D' },
  { noPo: 'PO005', namaSupplier: 'Supplier E' },
];

// Fungsi untuk generate No. RFI otomatis
const generateRFINumber = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RFI-${year}${month}${day}-${random}`;
};

const EntryPenerimaanBarangModal: React.FC<EntryPenerimaanBarangModalProps> = ({
  isOpen,
  onClose,
  mode = "create",
  headerData,
  itemsData,
}) => {
  const [headerForm, setHeaderForm] = useState<HeaderData>(() => {
    const defaultData = {
      noInvoice: "",
      noPo: "",
      namaSupplier: "",
      tanggalPenerimaan: new Date().toISOString().split("T")[0],
      catatan: "",
      noRFI: mode === "create" ? generateRFINumber() : "",
    };
    
    return headerData ? { ...defaultData, ...headerData } : defaultData;
  });

  const [items, setItems] = useState<ItemData[]>(itemsData ?? [
    {
      kode: "BRG001",
      nama: "Besi Beton",
      kategori: "Material Konstruksi",
      satuan: "Batang",
      diminta: 5,
      diterima: 5,
      hargaSatuan: "15,000",
      hargaTotal: "75,000",
      kondisi: "Baik",
      tglExp: "2025-12-31",
    },
    {
      kode: "BRG002",
      nama: "Semen Portland",
      kategori: "Material Konstruksi",
      satuan: "Sak",
      diminta: 2,
      diterima: 2,
      hargaSatuan: "65,000",
      hargaTotal: "130,000",
      kondisi: "Baik",
      tglExp: "2025-06-30",
    },
  ]);

  if (!isOpen) return null;

  const isReadOnly = mode === "view";

  const addNewRow = () => {
    const newItem: ItemData = {
      kode: "",
      nama: "",
      kategori: "",
      satuan: "",
      diminta: 0,
      diterima: 0,
      hargaSatuan: "",
      hargaTotal: "",
      kondisi: "Baik",
      tglExp: "",
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeRow = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ItemData, value: any) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handlePoChange = (noPo: string) => {
    const selectedSupplier = masterPoSupplier.find(item => item.noPo === noPo);
    setHeaderForm(prev => ({
      ...prev,
      noPo: noPo,
      namaSupplier: selectedSupplier ? selectedSupplier.namaSupplier : ""
    }));
  };

  const resolvedTanggal =
    headerData?.tanggalPenerimaan ?? new Date().toISOString().split("T")[0];
  const title =
    mode === "view"
      ? "Detail Penerimaan Barang"
      : mode === "edit"
      ? "Edit Penerimaan Barang"
      : "Entry Penerimaan Barang";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="noInvoice"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                No Invoice
              </label>
              <input
                type="text"
                id="noInvoice"
                className={`px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs ${
                  isReadOnly ? "bg-gray-50" : "bg-white"
                }`}
                defaultValue={headerData?.noInvoice ?? "INV-60"}
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <label
                htmlFor="noRFI"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                No RFI
              </label>
              <input
                type="text"
                id="noRFI"
                className="px-3 py-1.5 border border-gray-300 rounded-lg w-full bg-gray-50 text-xs font-medium text-blue-600"
                value={headerForm.noRFI}
                placeholder="Auto Generated"
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="noPo"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                No PO
              </label>
              <select
                id="noPo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                value={headerForm.noPo}
                onChange={(e) => handlePoChange(e.target.value)}
                disabled={isReadOnly}
              >
                <option value="">--Pilih No PO--</option>
                {masterPoSupplier.map(item => (
                  <option key={item.noPo} value={item.noPo}>{item.noPo} - {item.namaSupplier}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="namaSupplier"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Nama Supplier
              </label>
              <input
                type="text"
                id="namaSupplier"
                className="px-3 py-1.5 border border-gray-300 rounded-lg w-full bg-gray-50 text-xs"
                value={headerForm.namaSupplier}
                placeholder="Akan terisi otomatis saat memilih No PO"
                readOnly
              />
            </div>
            <div className="relative">
              <label
                htmlFor="tanggalPenerimaan"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Tanggal Penerimaan
              </label>
              <input
                type="date"
                id="tanggalPenerimaan"
                className="px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs"
                defaultValue={resolvedTanggal}
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="catatan"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Catatan
              </label>
              <textarea
                id="catatan"
                rows={3}
                className={`px-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs ${
                  isReadOnly ? "bg-gray-50" : "bg-white"
                }`}
                placeholder="Tambahkan catatan..."
                defaultValue={headerData?.catatan ?? ""}
                readOnly={isReadOnly}
                disabled={isReadOnly}
              ></textarea>
            </div>
            {/* Upload Dokumen */}
            <div className="md:col-span-4">
              <label
                htmlFor="dokumenPenerimaan"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Upload Dokumen (PO, Surat Jalan, Faktur)
              </label>
              <input
                type="file"
                id="dokumenPenerimaan"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className={`px-3 py-1.5 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-xs ${
                  isReadOnly ? "bg-gray-50" : "bg-white"
                }`}
                disabled={isReadOnly}
              />
              <p className="mt-1 text:[11px] text-gray-500">
                Maks 10MB per file. Format yang didukung: PDF, JPG, PNG.
              </p>
            </div>
          </div>

          {/* Barang Table */}
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Detail Barang</h3>
            {!isReadOnly && (
              <button
                onClick={addNewRow}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Baris
              </button>
            )}
          </div>
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Kode barang
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    SN
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Kategori Barang
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Satuan Barang
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Barang Diminta
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Barang Diterima
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Kondisi
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Exp
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item: ItemData, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                      {item.kode}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                      {item.nama}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                      03234
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                      {item.kategori}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                      {item.satuan}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                      {item.diminta}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                      <input
                        type="number"
                        defaultValue={item.diterima}
                        className="w-16 border border-gray-300 rounded-md px-2 py-1 text-xs"
                        readOnly={isReadOnly}
                        disabled={isReadOnly}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                        defaultValue={item.kondisi}
                        disabled={isReadOnly}
                      >
                        <option>Baik</option>
                        <option>Rusak</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                      <input
                        type="date"
                        defaultValue={item.tglExp}
                        className="w-28 border border-gray-300 rounded-md px-2 py-1 text-xs"
                        readOnly={isReadOnly}
                        disabled={isReadOnly}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                      {!isReadOnly && (
                        <button 
                          onClick={() => removeRow(index)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-100"
                          title="Hapus Baris"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end p-5 border-t border-gray-200 space-x-2.5">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200 text-xs shadow-sm"
          >
            Kembali
          </button>
          {mode !== "view" && (
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs shadow-sm">
              Simpan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryPenerimaanBarangModal;
