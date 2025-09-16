import React, { useMemo, useState } from "react";
import { X, FileSpreadsheet, FileText } from "lucide-react";

export interface VendorPODetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: { id: string; namaVendor: string; kodeVendor: string } | null;
}

interface POItem {
  id: string;
  noPO: string;
  tanggal: string; // DD-MM-YYYY
  barang: string;
  qty: number;
  satuan: string;
  harga: number; // per unit
  status: "Draft" | "Dipesan" | "Diterima" | "Selesai";
}

// Mock database of POs keyed by vendor id
const samplePODb: Record<string, POItem[]> = {
  "1": [
    {
      id: "po-1-1",
      noPO: "PO-001/2025",
      tanggal: "03-08-2025",
      barang: "Peralatan Inspeksi",
      qty: 3,
      satuan: "unit",
      harga: 12500000,
      status: "Selesai",
    },
    {
      id: "po-1-2",
      noPO: "PO-017/2025",
      tanggal: "21-08-2025",
      barang: "Alat keselamatan kerja",
      qty: 15,
      satuan: "paket",
      harga: 850000,
      status: "Diterima",
    },
  ],
  "2": [
    {
      id: "po-2-1",
      noPO: "PO-004/2025",
      tanggal: "11-07-2025",
      barang: "Peralatan peraga pelatihan",
      qty: 8,
      satuan: "set",
      harga: 2250000,
      status: "Dipesan",
    },
  ],
  "3": [
    {
      id: "po-3-1",
      noPO: "PO-010/2025",
      tanggal: "02-06-2025",
      barang: "Dokumen sertifikasi",
      qty: 20,
      satuan: "paket",
      harga: 350000,
      status: "Selesai",
    },
    {
      id: "po-3-2",
      noPO: "PO-019/2025",
      tanggal: "30-08-2025",
      barang: "Stiker/Segel",
      qty: 200,
      satuan: "lembar",
      harga: 4500,
      status: "Dipesan",
    },
  ],
  "4": [
    {
      id: "po-4-1",
      noPO: "PO-022/2025",
      tanggal: "05-09-2025",
      barang: "Suku cadang",
      qty: 12,
      satuan: "unit",
      harga: 1750000,
      status: "Draft",
    },
  ],
};

const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

const VendorPODetailModal: React.FC<VendorPODetailModalProps> = ({ isOpen, onClose, vendor }) => {
  const [searchBarang, setSearchBarang] = useState("");

  const poList = samplePODb[vendor?.id ?? ""] ?? [];

  const filtered = useMemo(
    () =>
      poList.filter((p) => p.barang.toLowerCase().includes(searchBarang.toLowerCase())),
    [poList, searchBarang]
  );

  if (!isOpen || !vendor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <div>
            <h3 className="text-sm font-semibold">Detail PO - {vendor.namaVendor}</h3>
            <p className="text-xs text-gray-500">Kode: {vendor.kodeVendor}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 justify-between">
            <input
              type="text"
              value={searchBarang}
              onChange={(e) => setSearchBarang(e.target.value)}
              placeholder="Filter Barang/Jasa"
              className="w-64 px-3 py-2 border rounded text-xs"
            />
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center px-2.5 py-1.5 text-xs rounded bg-green-600 text-white hover:bg-green-700">
                <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
              </button>
              <button className="inline-flex items-center px-2.5 py-1.5 text-xs rounded bg-red-600 text-white hover:bg-red-700">
                <FileText className="h-4 w-4 mr-1" /> PDF
              </button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs text-gray-600">No PO</th>
                    <th className="px-3 py-2 text-left text-xs text-gray-600">Tanggal</th>
                    <th className="px-3 py-2 text-left text-xs text-gray-600">Barang/Jasa</th>
                    <th className="px-3 py-2 text-right text-xs text-gray-600">Qty</th>
                    <th className="px-3 py-2 text-left text-xs text-gray-600">Satuan</th>
                    <th className="px-3 py-2 text-right text-xs text-gray-600">Harga</th>
                    <th className="px-3 py-2 text-center text-xs text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((po) => (
                    <tr key={po.id} className="odd:bg-white even:bg-gray-50">
                      <td className="px-3 py-2 text-xs">{po.noPO}</td>
                      <td className="px-3 py-2 text-xs">{po.tanggal}</td>
                      <td className="px-3 py-2 text-xs">{po.barang}</td>
                      <td className="px-3 py-2 text-xs text-right">{po.qty.toLocaleString("id-ID")}</td>
                      <td className="px-3 py-2 text-xs">{po.satuan}</td>
                      <td className="px-3 py-2 text-xs text-right">{currency(po.harga)}</td>
                      <td className="px-3 py-2 text-xs text-center">
                        <span
                          className={
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] " +
                            (po.status === "Selesai"
                              ? "bg-green-100 text-green-700"
                              : po.status === "Diterima"
                              ? "bg-blue-100 text-blue-700"
                              : po.status === "Dipesan"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-200 text-gray-700")
                          }
                        >
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-xs text-gray-500">
                        Tidak ada data PO
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorPODetailModal;
