import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { CalendarDays } from "lucide-react";
import { EntryPurchasingRequestFormData, PRDetailItem } from "../types/index";

interface EntryPurchasingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EntryPurchasingRequestFormData) => void;
}

const EntryPurchasingRequestModal: React.FC<
  EntryPurchasingRequestModalProps
> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EntryPurchasingRequestFormData>({
    tanggalPR: "",
    noPR: "",
    noSO: "",
    noSistemACTS: "",
    noPBG: "",
    customer: "", // New field
    noPo: "", // New field
    jenis: "Barang", // Changed from kategori to jenis
    detailItems: [
      {
        id: crypto.randomUUID(),
        namaItem: "",
        qty: 1,
        satuan: "",
        keterangan: "",
      },
    ],
  });

  // Preset options for No SO selection (can be wired to API later)
  const soOptions = [
    "SO001.22",
    "SO002.12",
    "SO003.33",
    "SO004.90",
    "SO005.55",
  ];

  // Auto-generate No PR when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => {
        // If already filled (e.g., re-open), keep existing number
        if (prev.noPR && prev.noPR.trim() !== "") return prev;

        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        const y = now.getFullYear();
        const m = pad(now.getMonth() + 1);
        const d = pad(now.getDate());
        const hh = pad(now.getHours());
        const mm = pad(now.getMinutes());
        const ss = pad(now.getSeconds());
        const genNoPR = `PR-${y}${m}${d}-${hh}${mm}${ss}`;
        return { ...prev, noPR: genNoPR };
      });
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form after submission
    setFormData({
      tanggalPR: "",
      noPR: "",
      noSO: "",
      noSistemACTS: "",
      noPBG: "",
      customer: "",
      noPo: "",
      jenis: "Barang",
      detailItems: [
        {
          id: crypto.randomUUID(),
          namaItem: "",
          qty: 1,
          satuan: "",
          keterangan: "",
        },
      ],
    });
    onClose();
  };

  const addDetailRow = () => {
    setFormData((prev) => ({
      ...prev,
      detailItems: [
        ...prev.detailItems,
        {
          id: crypto.randomUUID(),
          namaItem: "",
          qty: 1,
          satuan: "",
          keterangan: "",
        },
      ],
    }));
  };

  const removeDetailRow = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      detailItems:
        prev.detailItems.length > 1
          ? prev.detailItems.filter((it) => it.id !== id)
          : prev.detailItems,
    }));
  };

  const updateDetail = (
    id: string,
    field: keyof PRDetailItem,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      detailItems: prev.detailItems.map((it) =>
        it.id === id ? { ...it, [field]: value } : it
      ),
    }));
  };

  const firstColLabel = "Nama Pekerjaan";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Entry Purchasing Request"
      size="6xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tanggal PR */}
          <div>
            <label
              htmlFor="tanggalPR"
              className="block text-sm font-medium text-textSecondary mb-1"
            >
              Tanggal PR
            </label>
            <div className="relative">
              <input
                type="date"
                id="tanggalPR"
                name="tanggalPR"
                value={formData.tanggalPR}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm pr-8"
              />
              <CalendarDays className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
            </div>
          </div>

          {/* No PR (Auto-generated) */}
          <div>
            <label
              htmlFor="noPR"
              className="block text-sm font-medium text-textSecondary mb-1"
            >
              No PR
            </label>
            <input
              type="text"
              id="noPR"
              name="noPR"
              value={formData.noPR}
              readOnly
              className="w-full px-3 py-2 border border-border rounded-md bg-gray-100 text-text text-sm"
              placeholder="Auto"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* No SO (Selectable) */}
          <div>
            <label
              htmlFor="noSO"
              className="block text-sm font-medium text-textSecondary mb-1"
            >
              No SO
            </label>
            <select
              id="noSO"
              name="noSO"
              value={formData.noSO}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
            >
              <option value="">-- Pilih SO --</option>
              {soOptions.map((so) => (
                <option key={so} value={so}>
                  {so}
                </option>
              ))}
            </select>
          </div>

          {/* No. Sistem ACTS */}
          <div>
            <label
              htmlFor="noSistemACTS"
              className="block text-sm font-medium text-textSecondary mb-1"
            >
              No. Sistem ACTS
            </label>
            <input
              type="text"
              id="noSistemACTS"
              name="noSistemACTS"
              value={formData.noSistemACTS}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
              placeholder="PPE-GBP/2025/XX/XXX"
            />
          </div>

          {/* No PBG */}
          <div>
            <label
              htmlFor="noPBG"
              className="block text-sm font-medium text-textSecondary mb-1"
            >
              No. PBG
            </label>
            <input
              type="text"
              id="noPBG"
              name="noPBG"
              value={formData.noPBG}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
              placeholder="Masukkan No. PBG"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer */}
          <div>
            <label
              htmlFor="customer"
              className="block text-sm font-medium text-textSecondary mb-1"
            >
              Customer
            </label>
            <input
              type="text"
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
              placeholder="Nama Customer"
            />
          </div>

          {/* No. PO */}
          <div>
            <label
              htmlFor="noPo"
              className="block text-sm font-medium text-textSecondary mb-1"
            >
              No. PO
            </label>
            <input
              type="text"
              id="noPo"
              name="noPo"
              value={formData.noPo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
              placeholder="Nomor PO"
            />
          </div>
        </div>

        {/* Jenis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="jenis"
              className="block text-sm font-medium text-textSecondary mb-1"
            >
              Jenis
            </label>
            <select
              id="jenis"
              name="jenis"
              value={formData.jenis}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface text-text text-sm"
            >
              <option value="Barang">Barang</option>
              <option value="Jasa">Jasa</option>
            </select>
          </div>
        </div>

        {/* Detail Items Table at Bottom */}
        <div className="border border-border rounded-md">
          <div className="px-3 py-2 border-b text-sm font-medium">
            Deskripsi Pekerjaan
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">{firstColLabel}</th>
                  <th className="px-3 py-2 text-left">Qty</th>
                  <th className="px-3 py-2 text-left">Satuan</th>
                  <th className="px-3 py-2 text-left">Keterangan</th>
                  <th className="px-3 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {formData.detailItems.map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-2">
                      <input
                        value={row.namaItem}
                        onChange={(e) =>
                          updateDetail(row.id, "namaItem", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-border rounded-md"
                        placeholder={firstColLabel}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={row.qty}
                        onChange={(e) =>
                          updateDetail(row.id, "qty", Number(e.target.value))
                        }
                        className="w-24 px-2 py-1 border border-border rounded-md"
                        min={1}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={row.satuan}
                        onChange={(e) =>
                          updateDetail(row.id, "satuan", e.target.value)
                        }
                        className="w-28 px-2 py-1 border border-border rounded-md"
                        placeholder="Unit"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={row.keterangan || ""}
                        onChange={(e) =>
                          updateDetail(row.id, "keterangan", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-border rounded-md"
                        placeholder="Keterangan"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeDetailRow(row.id)}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded-md"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-2">
            <button
              type="button"
              onClick={addDetailRow}
              className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md"
            >
              Tambah Baris
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-textSecondary/20 text-textSecondary rounded-md hover:bg-textSecondary/30 transition-colors text-sm font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors text-sm font-medium"
          >
            Simpan PR
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EntryPurchasingRequestModal;
