import React, { useState } from "react";

export interface PegawaiRow {
  id: string;
  nama: string;
  kualifikasi: string;
  zona: string;
  hargaAkhir: string;
  rate?: number;
  startKerja?: string; // ISO date-time string
  finishKerja?: string; // ISO date-time string
  overtime?: number; // in hours
  file?: File | null;
}

export interface BarangRow {
  id: string;
  namaBarang: string;
  kategori: string;
  ditagihkan: number;
  dikembalikan: number;
  selisih: number;
  file?: File | null;
}

export interface TimesheetFormData {
  noSO: string;
  noSOTurunan: string;
  namaProyek: string;
  nilaiTimesheet: string;
  mob: string;
  demob: string;
  pegawai: PegawaiRow[];
  barang: BarangRow[];
}

interface TimesheetBarangPegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TimesheetFormData) => void;
  initialData?: Partial<TimesheetFormData> | null;
  showOnlyBarang?: boolean;
}

const TimesheetBarangPegawaiModal: React.FC<
  TimesheetBarangPegawaiModalProps
> = ({ isOpen, onClose, onSave, initialData, showOnlyBarang }) => {
  // Options for No SO dropdown
  const noSOOptions = [
    "SO-2024-001",
    "SO-2024-002",
    "SO-2024-003",
    "SO-2024-004",
    "SO-2024-005",
    "SO-2024-006",
    "SO-2024-007",
    "SO-2024-008",
    "SO-2024-009",
    "SO-2024-010",
  ];

  // Options for No SO Turunan dropdown
  const noSOTurunanOptions = [
    "SOT-2024-001-A",
    "SOT-2024-001-B",
    "SOT-2024-002-A",
    "SOT-2024-002-B",
    "SOT-2024-003-A",
    "SOT-2024-003-B",
    "SOT-2024-004-A",
    "SOT-2024-004-B",
    "SOT-2024-005-A",
    "SOT-2024-005-B",
  ];

  // Options for Kategori Barang dropdown
  const kategoriBarangOptions = [
    "Alat Kerja",
    "Material",
    "Peralatan Safety",
    "Elektronik",
    "Consumable",
    "Spare Part",
    "Tools",
    "Equipment",
  ];

  const [form, setForm] = useState<TimesheetFormData>({
    noSO: initialData?.noSO || "",
    noSOTurunan: initialData?.noSOTurunan || "",
    namaProyek: initialData?.namaProyek || "",
    nilaiTimesheet: initialData?.nilaiTimesheet || "",
    mob: initialData?.mob || "",
    demob: initialData?.demob || "",
    pegawai: initialData?.pegawai || [],
    barang: initialData?.barang || [],
  });

  const addPegawai = () => {
    setForm((prev) => ({
      ...prev,
      pegawai: [
        ...prev.pegawai,
        {
          id: crypto.randomUUID(),
          nama: "",
          kualifikasi: "",
          zona: "",
          hargaAkhir: "",
          rate: undefined,
          startKerja: "",
          finishKerja: "",
          overtime: undefined,
          file: null,
        },
      ],
    }));
  };

  const removePegawai = (id: string) => {
    setForm((prev) => ({
      ...prev,
      pegawai: prev.pegawai.filter((p) => p.id !== id),
    }));
  };

  const updatePegawai = (id: string, key: keyof PegawaiRow, value: any) => {
    setForm((prev) => ({
      ...prev,
      pegawai: prev.pegawai.map((p) =>
        p.id === id ? { ...p, [key]: value } : p
      ),
    }));
  };

  const addBarang = () => {
    setForm((prev) => ({
      ...prev,
      barang: [
        ...prev.barang,
        {
          id: crypto.randomUUID(),
          namaBarang: "",
          kategori: "",
          ditagihkan: 0,
          dikembalikan: 0,
          selisih: 0,
          file: null,
        },
      ],
    }));
  };

  const removeBarang = (id: string) => {
    setForm((prev) => ({
      ...prev,
      barang: prev.barang.filter((b) => b.id !== id),
    }));
  };

  const updateBarang = (id: string, key: keyof BarangRow, value: any) => {
    setForm((prev) => ({
      ...prev,
      barang: prev.barang.map((b) =>
        b.id === id
          ? {
              ...b,
              [key]:
                key === "ditagihkan" ||
                key === "dikembalikan" ||
                key === "selisih"
                  ? Number(value)
                  : value,
            }
          : b
      ),
    }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-screen-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900">
            Tambah Timesheet Barang/Pegawai
          </h3>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                No SO
              </label>
              <select
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                value={form.noSO}
                onChange={(e) => setForm({ ...form, noSO: e.target.value })}
              >
                <option value="">Pilih No SO</option>
                {noSOOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                No SO Turunan
              </label>
              <select
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                value={form.noSOTurunan}
                onChange={(e) =>
                  setForm({ ...form, noSOTurunan: e.target.value })
                }
              >
                <option value="">Pilih No SO Turunan</option>
                {noSOTurunanOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Nama Proyek
              </label>
              <input
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
                value={form.namaProyek}
                onChange={(e) =>
                  setForm({ ...form, namaProyek: e.target.value })
                }
                placeholder="Nama Proyek"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Nilai Timesheet
              </label>
              <input
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
                value={form.nilaiTimesheet}
                onChange={(e) =>
                  setForm({ ...form, nilaiTimesheet: e.target.value })
                }
                placeholder="Rp 0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                MOB
              </label>
              <input
                type="date"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
                value={form.mob}
                onChange={(e) => setForm({ ...form, mob: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                DEMOB
              </label>
              <input
                type="date"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
                value={form.demob}
                onChange={(e) => setForm({ ...form, demob: e.target.value })}
              />
            </div>
          </div>

          {!showOnlyBarang && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">
                  List Pegawai
                </h4>
                <button
                  onClick={addPegawai}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                >
                  Tambah Pegawai
                </button>
              </div>
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left min-w-[150px]">Nama</th>
                      <th className="px-3 py-2 text-left min-w-[150px]">Kualifikasi</th>
                      <th className="px-3 py-2 text-left min-w-[100px]">Zona</th>
                      <th className="px-3 py-2 text-left min-w-[100px]">Durasi</th>
                      <th className="px-3 py-2 text-left min-w-[100px]">Actual</th>
                      <th className="px-3 py-2 text-left min-w-[100px]">Rate</th>
                      <th className="px-3 py-2 text-left min-w-[200px]">Start Kerja</th>
                      <th className="px-3 py-2 text-left min-w-[200px]">Finish Kerja</th>
                      <th className="px-3 py-2 text-left min-w-[100px]">Overtime</th>
                      <th className="px-3 py-2 text-left min-w-[150px]">Upload</th>
                      <th className="px-3 py-2 text-center min-w-[80px]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {form.pegawai.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 min-w-[150px]">
                          <input
                            className="w-full px-3 py-2 border rounded-lg"
                            value={row.nama}
                            onChange={(e) =>
                              updatePegawai(row.id, "nama", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-3 py-2 min-w-[150px]">
                          <input
                            className="w-full px-3 py-2 border rounded-lg"
                            value={row.kualifikasi}
                            onChange={(e) =>
                              updatePegawai(
                                row.id,
                                "kualifikasi",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2 min-w-[100px]">
                          <input
                            className="w-full px-3 py-2 border rounded-lg"
                            value={row.zona}
                            onChange={(e) =>
                              updatePegawai(row.id, "zona", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-3 py-2 min-w-[100px]">
                          <input
                            className="w-full px-3 py-2 border rounded-lg"
                            value={row.hargaAkhir}
                            onChange={(e) =>
                              updatePegawai(
                                row.id,
                                "hargaAkhir",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2 min-w-[100px]">
                          <input className="w-full px-3 py-2 border rounded-lg" />
                        </td>
                        <td className="px-3 py-2 min-w-[100px]">
                          <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg text-right"
                            value={row.rate ?? ""}
                            onChange={(e) =>
                              updatePegawai(
                                row.id,
                                "rate",
                                e.target.value === "" ? undefined : Number(e.target.value)
                              )
                            }
                            placeholder="0"
                          />
                        </td>
                        <td className="px-3 py-2 min-w-[200px]">
                          <input
                            type="datetime-local"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={row.startKerja ?? ""}
                            onChange={(e) =>
                              updatePegawai(row.id, "startKerja", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-3 py-2 min-w-[200px]">
                          <input
                            type="datetime-local"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={row.finishKerja ?? ""}
                            onChange={(e) =>
                              updatePegawai(row.id, "finishKerja", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-3 py-2 min-w-[100px]">
                          <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg text-right"
                            value={row.overtime ?? ""}
                            onChange={(e) =>
                              updatePegawai(
                                row.id,
                                "overtime",
                                e.target.value === "" ? undefined : Number(e.target.value)
                              )
                            }
                            placeholder="0"
                          />
                        </td>
                        <td className="px-3 py-2 min-w-[150px]">
                          <input
                            type="file"
                            onChange={(e) =>
                              updatePegawai(
                                row.id,
                                "file",
                                e.target.files?.[0] || null
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2 text-center min-w-[80px]">
                          <button
                            onClick={() => removePegawai(row.id)}
                            className="px-2 py-1 bg-rose-600 text-white rounded-lg"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-xs bg-gray-200 hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-2 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimesheetBarangPegawaiModal;
