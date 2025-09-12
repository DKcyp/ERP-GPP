import React, { useState } from "react";

export interface PegawaiRow {
  id: string;
  nama: string;
  kualifikasi: string;
  zona: string;
  hargaAkhir: string;
  file?: File | null;
}

export interface BarangRow {
  id: string;
  namaBarang: string;
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
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
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
              <input
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
                value={form.noSO}
                onChange={(e) => setForm({ ...form, noSO: e.target.value })}
                placeholder="SO001"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                No SO Turunan
              </label>
              <input
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
                value={form.noSOTurunan}
                onChange={(e) =>
                  setForm({ ...form, noSOTurunan: e.target.value })
                }
                placeholder="SO001.01"
              />
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
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Nama</th>
                      <th className="px-3 py-2 text-left">Kualifikasi</th>
                      <th className="px-3 py-2 text-left">Zona</th>
                      <th className="px-3 py-2 text-left">Actual</th>
                      <th className="px-3 py-2 text-left">Durasi</th>
                      <th className="px-3 py-2 text-left">Upload</th>
                      <th className="px-3 py-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {form.pegawai.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <input
                            className="w-full px-2 py-1 border rounded-lg"
                            value={row.nama}
                            onChange={(e) =>
                              updatePegawai(row.id, "nama", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full px-2 py-1 border rounded-lg"
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
                        <td className="px-3 py-2">
                          <input
                            className="w-full px-2 py-1 border rounded-lg"
                            value={row.zona}
                            onChange={(e) =>
                              updatePegawai(row.id, "zona", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full px-2 py-1 border rounded-lg"
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
                        <td className="px-3 py-2">
                          <input className="w-full px-2 py-1 border rounded-lg" />
                        </td>
                        <td className="px-3 py-2">
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
                        <td className="px-3 py-2 text-center">
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">
                List Barang
              </h4>
              <button
                onClick={addBarang}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
              >
                Tambah Barang
              </button>
            </div>
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Nama Barang</th>
                    <th className="px-3 py-2 text-left">QTY</th>
                    <th className="px-3 py-2 text-left">Ditagihkan</th>
                    <th className="px-3 py-2 text-left">Dikembalikan</th>
                    <th className="px-3 py-2 text-left">Selisih</th>
                    <th className="px-3 py-2 text-left">Upload</th>
                    <th className="px-3 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {form.barang.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input
                          className="w-full px-2 py-1 border rounded-lg"
                          value={row.namaBarang}
                          onChange={(e) =>
                            updateBarang(row.id, "namaBarang", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className="w-full px-2 py-1 border rounded-lg"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className="w-full px-2 py-1 border rounded-lg"
                          value={row.ditagihkan}
                          onChange={(e) =>
                            updateBarang(row.id, "ditagihkan", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className="w-full px-2 py-1 border rounded-lg"
                          value={row.dikembalikan}
                          onChange={(e) =>
                            updateBarang(row.id, "dikembalikan", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className="w-full px-2 py-1 border rounded-lg"
                          value={row.selisih}
                          onChange={(e) =>
                            updateBarang(row.id, "selisih", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="file"
                          onChange={(e) =>
                            updateBarang(
                              row.id,
                              "file",
                              e.target.files?.[0] || null
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => removeBarang(row.id)}
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
