import React, { useMemo, useState } from "react";
import {
  Clock,
  PlusCircle,
  Edit,
  Trash2,
  Upload,
  FileSpreadsheet,
  FileDown,
} from "lucide-react";

type ItemJenis = "jasa" | "barang";

type TresuriRow = {
  id: number;
  jenis: ItemJenis; // jasa/barang
  noDokumen: string; // No dokumen utama (Invoice/BA/DO)
  noPO: string; // No. PO - field baru
  vendor: string;
  tanggalPembuatan: string; // Tanggal Pembuatan - field baru
  laporanHarian?: string; // Laporan Harian - field baru
  laporanLainnya?: string; // Upload Laporan Lainnya - field baru
  invoice?: string;
  fakturPajak?: string;
  ba?: string; // untuk jasa
  do?: string; // untuk barang
  timesheet?: string; // jasa
  lpb?: string; // barang
  report?: string; // jasa opsional
  rfi?: string; // barang opsional
  catatan?: string;
};

const FinanceAPTresuriDashboard: React.FC = () => {
  const today = new Date();
  const [rows, setRows] = useState<TresuriRow[]>([
    {
      id: 1,
      jenis: "jasa",
      noDokumen: "INV-001",
      noPO: "PO-2025-001",
      vendor: "PT Jasa Prima",
      tanggalPembuatan: "2025-01-15",
      laporanHarian: "LH-001.pdf",
      laporanLainnya: "LL-001.pdf",
      invoice: "INV-001.pdf",
      fakturPajak: "FP-001.pdf",
      ba: "BA-001.pdf",
      timesheet: "TS-001.pdf",
      report: "RPT-001.pdf",
    },
    {
      id: 2,
      jenis: "barang",
      noDokumen: "INV-002",
      noPO: "PO-2025-002",
      vendor: "CV Sukses",
      tanggalPembuatan: "2025-01-16",
      laporanHarian: "LH-002.pdf",
      invoice: "INV-002.pdf",
      fakturPajak: "FP-002.pdf",
      do: "DO-110.pdf",
      lpb: "LPB-110.pdf",
      rfi: "RFI-110.pdf",
    },
  ]);
  const [filter, setFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState<string>("");
  const [tanggalFilter, setTanggalFilter] = useState(""); // Filter tanggal pembuatan
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TresuriRow | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const textHit = [r.noDokumen, r.vendor, r.noPO]
          .join(" ")
          .toLowerCase()
          .includes(filter.toLowerCase());
        const jenisHit = jenisFilter
          ? r.jenis === (jenisFilter as ItemJenis)
          : true;
        const tanggalHit = tanggalFilter
          ? r.tanggalPembuatan === tanggalFilter
          : true;
        return textHit && jenisHit && tanggalHit;
      }),
    [rows, filter, jenisFilter, tanggalFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  const startAdd = () => {
    const today = new Date().toISOString().slice(0, 10);
    setEditing({ 
      id: 0, 
      jenis: "jasa", 
      noDokumen: "", 
      noPO: "",
      vendor: "",
      tanggalPembuatan: today
    });
    setFormOpen(true);
  };
  const startEdit = (row: TresuriRow) => {
    setEditing(row);
    setFormOpen(true);
  };
  const remove = (id: number) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const onSave = (data: TresuriRow) => {
    // Ketika BA sudah diupload, status BA di Purchase Request terupdate (catatan: placeholder)
    if (data.id && rows.some((r) => r.id === data.id)) {
      setRows((prev) => prev.map((r) => (r.id === data.id ? data : r)));
    } else {
      const newId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
      setRows((prev) => [{ ...data, id: newId }, ...prev]);
    }
    setFormOpen(false);
    setEditing(null);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-wide mb-2">
                AP - TRESURI
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Finance
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">AP / Tresuri</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari
              </label>
              <input
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="No Dokumen / Vendor / No PO"
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis
              </label>
              <select
                value={jenisFilter}
                onChange={(e) => {
                  setJenisFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none"
              >
                <option value="">Semua</option>
                <option value="jasa">Jasa</option>
                <option value="barang">Barang</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Pembuatan
              </label>
              <input
                type="date"
                value={tanggalFilter}
                onChange={(e) => {
                  setTanggalFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="hidden md:block"></div>
            <div className="flex items-end justify-end gap-2">
              <button
                onClick={startAdd}
                className="inline-flex items-center px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Tambah
              </button>
              <button className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700">
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
              </button>
              <button className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700">
                <FileDown className="h-4 w-4 mr-2" /> Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    Jenis
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    No Dokumen
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    No. PO
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    Vendor
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    Tanggal Pembuatan
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    Laporan Harian
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    Invoice
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    Faktur Pajak
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    BA / DO
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    Timesheet / LPB
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    Report / RFI
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                    Laporan Lainnya
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paged.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/60 transition-colors"
                  >
                    <td className="px-4 py-2 text-sm text-gray-900 uppercase">
                      {row.jenis}
                    </td>
                    <td className="px-4 py-2 text-sm">{row.noDokumen}</td>
                    <td className="px-4 py-2 text-sm">{row.noPO}</td>
                    <td className="px-4 py-2 text-sm">{row.vendor}</td>
                    <td className="px-4 py-2 text-sm">{row.tanggalPembuatan}</td>
                    <td className="px-4 py-2 text-sm">{row.laporanHarian || "-"}</td>
                    <td className="px-4 py-2 text-sm">{row.invoice || "-"}</td>
                    <td className="px-4 py-2 text-sm">
                      {row.fakturPajak || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {row.jenis === "jasa" ? row.ba || "-" : row.do || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {row.jenis === "jasa"
                        ? row.timesheet || "-"
                        : row.lpb || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {row.jenis === "jasa"
                        ? row.report || "-"
                        : row.rfi || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm">{row.laporanLainnya || "-"}</td>
                    <td className="px-4 py-2 text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => startEdit(row)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(row.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
          <div>
            Menampilkan {filtered.length ? (page - 1) * pageSize + 1 : 0} -{" "}
            {Math.min(page * pageSize, filtered.length)} dari {filtered.length}{" "}
            data
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`px-2 py-1 rounded border ${
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                Prev
              </button>
              <span>
                Hal {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={`px-2 py-1 rounded border ${
                  page === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span>Per halaman</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {formOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-sm font-semibold">
                {editing.id ? "Edit" : "Tambah"} Tresuri
              </h3>
              <button
                onClick={() => {
                  setFormOpen(false);
                  setEditing(null);
                }}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Jenis
                  </label>
                  <select
                    value={editing.jenis}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        jenis: e.target.value as ItemJenis,
                      })
                    }
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  >
                    <option value="jasa">Jasa</option>
                    <option value="barang">Barang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    No. PO
                  </label>
                  <input
                    type="text"
                    value={editing.noPO}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        noPO: e.target.value,
                      })
                    }
                    placeholder="Masukkan No. PO"
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    No Dokumen
                  </label>
                  <input
                    type="text"
                    value={editing.noDokumen}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        noDokumen: e.target.value,
                      })
                    }
                    placeholder="Masukkan No Dokumen"
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Vendor
                  </label>
                  <input
                    type="text"
                    value={editing.vendor}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        vendor: e.target.value,
                      })
                    }
                    placeholder="Masukkan Nama Vendor"
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tanggal Pembuatan
                  </label>
                  <input
                    type="date"
                    value={editing.tanggalPembuatan}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        tanggalPembuatan: e.target.value,
                      })
                    }
                    className="w-full border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Laporan Harian
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          laporanHarian: e.target.files?.[0]?.name || "",
                        })
                      }
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                    <button className="inline-flex items-center px-2 py-1 text-xs border rounded">
                      <Upload className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Upload Laporan Lainnya
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          laporanLainnya: e.target.files?.[0]?.name || "",
                        })
                      }
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                    <button className="inline-flex items-center px-2 py-1 text-xs border rounded">
                      <Upload className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Invoice
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          invoice: e.target.files?.[0]?.name || "",
                        })
                      }
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                    <button className="inline-flex items-center px-2 py-1 text-xs border rounded">
                      <Upload className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Faktur Pajak
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          fakturPajak: e.target.files?.[0]?.name || "",
                        })
                      }
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                    <button className="inline-flex items-center px-2 py-1 text-xs border rounded">
                      <Upload className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {editing.jenis === "jasa" ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        BA
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              ba: e.target.files?.[0]?.name || "",
                            })
                          }
                          className="w-full border rounded px-2 py-1.5 text-sm"
                        />
                        <button className="inline-flex items-center px-2 py-1 text-xs border rounded">
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Timesheet
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              timesheet: e.target.files?.[0]?.name || "",
                            })
                          }
                          className="w-full border rounded px-2 py-1.5 text-sm"
                        />
                        <button className="inline-flex items-center px-2 py-1 text-xs border rounded">
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Report
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              report: e.target.files?.[0]?.name || "",
                            })
                          }
                          className="w-full border rounded px-2 py-1.5 text-sm"
                        />
                        <button className="inline-flex items-center px-2 py-1 text-xs border rounded">
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        DO
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              do: e.target.files?.[0]?.name || "",
                            })
                          }
                          className="w-full border rounded px-2 py-1.5 text-sm"
                        />
                        <button className="inline-flex items-center px-2 py-1 text-xs border rounded">
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        LPB
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              lpb: e.target.files?.[0]?.name || "",
                            })
                          }
                          className="w-full border rounded px-2 py-1.5 text-sm"
                        />
                        <button className="inline-flex items-center px-2 py-1 text-xs border rounded">
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        RFI
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              rfi: e.target.files?.[0]?.name || "",
                            })
                          }
                          className="w-full border rounded px-2 py-1.5 text-sm"
                        />
                        <button className="inline-flex items-center px-2 py-1 text-xs border rounded">
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <button
                onClick={() => {
                  setFormOpen(false);
                  setEditing(null);
                }}
                className="px-3 py-1.5 text-xs rounded-md border"
              >
                Batal
              </button>
              <button
                onClick={() => editing && onSave(editing)}
                className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceAPTresuriDashboard;
