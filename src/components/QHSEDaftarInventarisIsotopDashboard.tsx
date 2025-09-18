import React, { useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, FileUp, Filter } from "lucide-react";

// Data types
export type LokasiIzinArea =
  | "Office"
  | "Project"
  | "Medco Corridor"
  | "Medco SSB"
  | "PHE ONWJ";

export type StatusProsesIsotop =
  | "Pemesanan Isotop Baru"
  | "Pelimbahan Isotop Lama"
  | "Penghentian Ijin Isotop Lama"
  | "Permohonan Ijin Isotop Baru"
  | "Selesai";

export interface InventarisIsotopItem {
  id: string;
  no: number;
  namaIsotop: string; // Co-60, Ir-192, dsb
  tipeIsotop: string; // Type/Model
  nomorSeriIsotop: string; // SN Isotop
  tglMulaiAktivitas: string; // ISO date string
  izinPemanfaatanNo: string; // No Izin Pemanfaatan
  masaBerlakuIzin: string; // ISO date string
  supplier: string;
  nomorBAST: string; // Berita Acara Serah Terima
  lokasiIzin: LokasiIzinArea[]; // 5 area izin
  dokumenSertifikat?: string; // file name or url placeholder
  statusProses: StatusProsesIsotop;
  keterangan?: string;
}

const initialData: InventarisIsotopItem[] = [
  {
    id: "iso-1",
    no: 1,
    namaIsotop: "Ir-192",
    tipeIsotop: "Gammamat SE",
    nomorSeriIsotop: "IR192-GB-001",
    tglMulaiAktivitas: "2025-01-10",
    izinPemanfaatanNo: "12/IR192/QHSE/2025",
    masaBerlakuIzin: "2026-01-10",
    supplier: "PT Isotop Nusantara",
    nomorBAST: "BAST/IR192/001/2025",
    lokasiIzin: ["Office", "PHE ONWJ", "Medco Corridor", "Medco SSB", "Project"],
    dokumenSertifikat: "sertifikat_ir192_001.pdf",
    statusProses: "Permohonan Ijin Isotop Baru",
    keterangan: "Proses verifikasi dokumen di BAPETEN",
  },
  {
    id: "iso-2",
    no: 2,
    namaIsotop: "Co-60",
    tipeIsotop: "Sentinel 880",
    nomorSeriIsotop: "CO60-GB-002",
    tglMulaiAktivitas: "2024-09-05",
    izinPemanfaatanNo: "09/CO60/QHSE/2024",
    masaBerlakuIzin: "2025-09-05",
    supplier: "PT Gamma Supplier",
    nomorBAST: "BAST/CO60/010/2024",
    lokasiIzin: ["Office", "PHE ONWJ", "Medco SSB"],
    dokumenSertifikat: "sertifikat_co60_010.pdf",
    statusProses: "Selesai",
    keterangan: "Aktif digunakan untuk operasi radiografi",
  },
  {
    id: "iso-3",
    no: 3,
    namaIsotop: "Ir-192",
    tipeIsotop: "SPEC 150",
    nomorSeriIsotop: "IR192-GB-003",
    tglMulaiAktivitas: "2023-07-20",
    izinPemanfaatanNo: "18/IR192/QHSE/2023",
    masaBerlakuIzin: "2025-07-20",
    supplier: "PT Rad Source Indo",
    nomorBAST: "BAST/IR192/018/2023",
    lokasiIzin: ["Office", "Project"],
    dokumenSertifikat: "sertifikat_ir192_018.pdf",
    statusProses: "Pelimbahan Isotop Lama",
    keterangan: "Menunggu jadwal pelimbahan ke fasilitas terpadu",
  },
];

interface FormState extends Omit<InventarisIsotopItem, "no"> {}

type ModalMode = "view" | "edit" | "add";

const statusColor: Record<StatusProsesIsotop, string> = {
  "Pemesanan Isotop Baru": "bg-blue-100 text-blue-700 border-blue-300",
  "Pelimbahan Isotop Lama": "bg-amber-100 text-amber-700 border-amber-300",
  "Penghentian Ijin Isotop Lama": "bg-rose-100 text-rose-700 border-rose-300",
  "Permohonan Ijin Isotop Baru": "bg-indigo-100 text-indigo-700 border-indigo-300",
  Selesai: "bg-green-100 text-green-700 border-green-300",
};

const QHSEDaftarInventarisIsotopDashboard: React.FC = () => {
  const [items, setItems] = useState<InventarisIsotopItem[]>(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | StatusProsesIsotop>("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("view");
  const [selected, setSelected] = useState<InventarisIsotopItem | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filtered = useMemo(() => {
    let data = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.namaIsotop.toLowerCase().includes(q) ||
          d.tipeIsotop.toLowerCase().includes(q) ||
          d.nomorSeriIsotop.toLowerCase().includes(q) ||
          d.izinPemanfaatanNo.toLowerCase().includes(q) ||
          d.supplier.toLowerCase().includes(q) ||
          d.nomorBAST.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") {
      data = data.filter((d) => d.statusProses === statusFilter);
    }
    return data.sort((a, b) => a.no - b.no);
  }, [items, search, statusFilter]);

  const openView = (item: InventarisIsotopItem) => {
    setSelected(item);
    setModalMode("view");
    setForm({ ...item });
    setShowModal(true);
  };

  const openEdit = (item: InventarisIsotopItem) => {
    setSelected(item);
    setModalMode("edit");
    setForm({ ...item });
    setShowModal(true);
  };

  const openAdd = () => {
    setSelected(null);
    setModalMode("add");
    setForm({
      id: crypto.randomUUID(),
      namaIsotop: "",
      tipeIsotop: "",
      nomorSeriIsotop: "",
      tglMulaiAktivitas: new Date().toISOString().slice(0, 10),
      izinPemanfaatanNo: "",
      masaBerlakuIzin: new Date().toISOString().slice(0, 10),
      supplier: "",
      nomorBAST: "",
      lokasiIzin: [],
      dokumenSertifikat: undefined,
      statusProses: "Permohonan Ijin Isotop Baru",
      keterangan: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(null);
    setSelected(null);
  };

  const saveForm = () => {
    if (!form) return;
    if (modalMode === "add") {
      const nextNo = (items[items.length - 1]?.no || 0) + 1;
      const newItem: InventarisIsotopItem = { no: nextNo, ...form } as InventarisIsotopItem;
      setItems((prev) => [...prev, newItem]);
    } else if (modalMode === "edit" && selected) {
      setItems((prev) => prev.map((it) => (it.id === selected.id ? ({ no: it.no, ...form } as InventarisIsotopItem) : it)));
    }
    closeModal();
  };

  const confirmDelete = (item: InventarisIsotopItem) => {
    setSelected(item);
    setShowDeleteConfirm(true);
  };

  const doDelete = () => {
    if (selected) {
      setItems((prev) => prev.filter((it) => it.id !== selected.id));
    }
    setShowDeleteConfirm(false);
    setSelected(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm({ ...form, [name]: value } as FormState);
  };

  const toggleLokasi = (area: LokasiIzinArea) => {
    if (!form) return;
    const exists = form.lokasiIzin.includes(area);
    const lokasiIzin = exists
      ? form.lokasiIzin.filter((a) => a !== area)
      : [...form.lokasiIzin, area];
    setForm({ ...form, lokasiIzin });
  };

  const areas: LokasiIzinArea[] = [
    "Office",
    "Project",
    "Medco Corridor",
    "Medco SSB",
    "PHE ONWJ",
  ];

  const statusOptions: StatusProsesIsotop[] = [
    "Pemesanan Isotop Baru",
    "Pelimbahan Isotop Lama",
    "Penghentian Ijin Isotop Lama",
    "Permohonan Ijin Isotop Baru",
    "Selesai",
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Daftar Inventaris Isotop</h1>
            <p className="text-white/80 text-sm">Monitoring persediaan isotop, izin pemanfaatan, masa berlaku, dan proses perizinan</p>
          </div>
          <div className="flex gap-2">
            <button onClick={openAdd} className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded shadow">
              <Plus size={18} />
              <span className="text-sm font-semibold">Tambah</span>
            </button>
            <button className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/25 px-3 py-2 rounded">
              <FileUp size={18} />
              <span className="text-sm">Upload Dokumen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari: Nama Isotop / Tipe / SN / No Izin / Supplier / No BAST"
              className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            className="border rounded px-2 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="All">Semua Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="min-w-[1200px] w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-3 py-2 text-left border">No</th>
              <th className="px-3 py-2 text-left border">Nama Isotop</th>
              <th className="px-3 py-2 text-left border">Tipe/Model</th>
              <th className="px-3 py-2 text-left border">SN Isotop</th>
              <th className="px-3 py-2 text-left border">Tgl Mulai Aktivitas</th>
              <th className="px-3 py-2 text-left border">No Izin Pemanfaatan</th>
              <th className="px-3 py-2 text-left border">Masa Berlaku Izin</th>
              <th className="px-3 py-2 text-left border">Supplier</th>
              <th className="px-3 py-2 text-left border">No BAST</th>
              <th className="px-3 py-2 text-left border">Lokasi Izin (5 Area)</th>
              <th className="px-3 py-2 text-left border">Dokumen Sertifikat</th>
              <th className="px-3 py-2 text-left border">Status Proses</th>
              <th className="px-3 py-2 text-left border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 border">{row.no}</td>
                <td className="px-3 py-2 border font-medium">{row.namaIsotop}</td>
                <td className="px-3 py-2 border">{row.tipeIsotop}</td>
                <td className="px-3 py-2 border">{row.nomorSeriIsotop}</td>
                <td className="px-3 py-2 border">{new Date(row.tglMulaiAktivitas).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td className="px-3 py-2 border">{row.izinPemanfaatanNo}</td>
                <td className="px-3 py-2 border">{new Date(row.masaBerlakuIzin).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td className="px-3 py-2 border">{row.supplier}</td>
                <td className="px-3 py-2 border">{row.nomorBAST}</td>
                <td className="px-3 py-2 border">
                  <div className="flex flex-wrap gap-1">
                    {row.lokasiIzin.map((a) => (
                      <span key={a} className="px-2 py-0.5 text-xs rounded bg-gray-100 border text-gray-700">
                        {a}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 border">
                  {row.dokumenSertifikat ? (
                    <a href="#" className="text-indigo-600 hover:underline">
                      {row.dokumenSertifikat}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">-</span>
                  )}
                </td>
                <td className="px-3 py-2 border">
                  <span className={`px-2 py-1 text-xs rounded border inline-block ${statusColor[row.statusProses]}`}>
                    {row.statusProses}
                  </span>
                </td>
                <td className="px-3 py-2 border">
                  <div className="flex gap-2">
                    <button onClick={() => openView(row)} className="p-1.5 rounded border text-blue-600 hover:bg-blue-50" title="Lihat">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => openEdit(row)} className="p-1.5 rounded border text-green-600 hover:bg-green-50" title="Ubah">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => confirmDelete(row)} className="p-1.5 rounded border text-rose-600 hover:bg-rose-50" title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit/View */}
      {showModal && form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h2 className="font-semibold">
                {modalMode === "add" && "Tambah Isotop"}
                {modalMode === "edit" && "Ubah Isotop"}
                {modalMode === "view" && "Detail Isotop"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nama Isotop</label>
                <input
                  name="namaIsotop"
                  value={form.namaIsotop}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Tipe/Model</label>
                <input
                  name="tipeIsotop"
                  value={form.tipeIsotop}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">SN Isotop</label>
                <input
                  name="nomorSeriIsotop"
                  value={form.nomorSeriIsotop}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Tgl Mulai Aktivitas</label>
                <input
                  type="date"
                  name="tglMulaiAktivitas"
                  value={form.tglMulaiAktivitas}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">No Izin Pemanfaatan</label>
                <input
                  name="izinPemanfaatanNo"
                  value={form.izinPemanfaatanNo}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Masa Berlaku Izin</label>
                <input
                  type="date"
                  name="masaBerlakuIzin"
                  value={form.masaBerlakuIzin}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Supplier</label>
                <input
                  name="supplier"
                  value={form.supplier}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">No BAST</label>
                <input
                  name="nomorBAST"
                  value={form.nomorBAST}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Lokasi Izin (5 Area)</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {areas.map((a) => {
                    const active = form.lokasiIzin.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleLokasi(a)}
                        disabled={modalMode === "view"}
                        className={`px-3 py-1 rounded border text-sm ${
                          active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700"
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Status Proses</label>
                <select
                  name="statusProses"
                  value={form.statusProses}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  className="w-full border rounded px-3 py-2"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Keterangan</label>
                <textarea
                  name="keterangan"
                  value={form.keterangan || ""}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
            </div>

            <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
              <button onClick={closeModal} className="px-3 py-2 rounded border">Tutup</button>
              {modalMode !== "view" && (
                <button
                  onClick={saveForm}
                  className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Simpan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
            <div className="px-4 py-3 border-b">
              <h3 className="font-semibold">Hapus Data</h3>
            </div>
            <div className="p-4 text-sm text-gray-700">
              Yakin ingin menghapus Isotop <span className="font-semibold">{selected.namaIsotop}</span> dengan SN <span className="font-semibold">{selected.nomorSeriIsotop}</span>?
            </div>
            <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-2 rounded border">Batal</button>
              <button onClick={doDelete} className="px-3 py-2 rounded bg-rose-600 text-white hover:bg-rose-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEDaftarInventarisIsotopDashboard;
