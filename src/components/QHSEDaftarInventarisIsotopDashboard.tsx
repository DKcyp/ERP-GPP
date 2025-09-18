import React, { useMemo, useState } from "react";
import { Plus, Search, Filter, Eye, Pencil, Trash2, X, Save, Upload, ChevronLeft, ChevronRight } from "lucide-react";

// Data model for Isotope Inventory
export interface IsotopeInventoryItem {
  id: string; // uuid
  no: number; // row number
  namaIsotop: string; // e.g. Ir-192, Se-75
  tipeIsotop: string; // e.g. 880, 740, etc.
  serialNumber: string; // SN Isotop
  tanggalMulaiAktivitas: string; // ISO date string
  aktivitasAwalCi?: number; // Optional: initial activity in curie
  izinPemanfaatanNo: string; // permit number
  masaBerlakuIzin: string; // ISO date string (expiry)
  supplier: string;
  nomorBAST: string;
  lokasiIzin: {
    office: boolean;
    medcoCorridor: boolean;
    medcoSSB: boolean;
    pheONWJ: boolean;
    eniMuaraBakau: boolean;
  };
  statusProses: "Pemesanan" | "Pelimbahan" | "Penghentian Izin" | "Permohonan Izin" | "Selesai";
  dokumenSertifikatUrl?: string; // uploaded file URL (dummy for now)
  keterangan?: string;
}

const sampleData: IsotopeInventoryItem[] = [
  {
    id: "1",
    no: 1,
    namaIsotop: "Ir-192",
    tipeIsotop: "880",
    serialNumber: "IR192-880-001",
    tanggalMulaiAktivitas: "2025-01-05",
    aktivitasAwalCi: 80,
    izinPemanfaatanNo: "12/XXI/PI-RAD/2025",
    masaBerlakuIzin: "2026-01-05",
    supplier: "PT Rad Source Nusantara",
    nomorBAST: "BAST/IR/001/2025",
    lokasiIzin: { office: true, medcoCorridor: true, medcoSSB: false, pheONWJ: true, eniMuaraBakau: false },
    statusProses: "Selesai",
    dokumenSertifikatUrl: "",
    keterangan: "Aktif digunakan",
  },
  {
    id: "2",
    no: 2,
    namaIsotop: "Se-75",
    tipeIsotop: "740",
    serialNumber: "SE75-740-003",
    tanggalMulaiAktivitas: "2024-10-15",
    aktivitasAwalCi: 25,
    izinPemanfaatanNo: "05/X/PI-RAD/2024",
    masaBerlakuIzin: "2025-10-15",
    supplier: "PT Gamma Indo",
    nomorBAST: "BAST/SE/010/2024",
    lokasiIzin: { office: true, medcoCorridor: false, medcoSSB: true, pheONWJ: false, eniMuaraBakau: true },
    statusProses: "Permohonan Izin",
    dokumenSertifikatUrl: "",
    keterangan: "Proses perpanjangan izin",
  },
];

type ModalMode = "add" | "edit" | "view";

const QHSEDaftarInventarisIsotopDashboard: React.FC = () => {
  const [data, setData] = useState<IsotopeInventoryItem[]>(sampleData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [selected, setSelected] = useState<IsotopeInventoryItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data
      .filter((d) =>
        statusFilter === "ALL" ? true : d.statusProses === (statusFilter as IsotopeInventoryItem["statusProses"]) 
      )
      .filter((d) =>
        [
          d.no.toString(),
          d.namaIsotop,
          d.tipeIsotop,
          d.serialNumber,
          d.izinPemanfaatanNo,
          d.supplier,
          d.nomorBAST,
          d.keterangan ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .sort((a, b) => a.no - b.no);
  }, [data, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openAdd = () => {
    setModalMode("add");
    setSelected({
      id: crypto.randomUUID(),
      no: data.length + 1,
      namaIsotop: "",
      tipeIsotop: "",
      serialNumber: "",
      tanggalMulaiAktivitas: new Date().toISOString().slice(0, 10),
      aktivitasAwalCi: undefined,
      izinPemanfaatanNo: "",
      masaBerlakuIzin: new Date().toISOString().slice(0, 10),
      supplier: "",
      nomorBAST: "",
      lokasiIzin: { office: false, medcoCorridor: false, medcoSSB: false, pheONWJ: false, eniMuaraBakau: false },
      statusProses: "Pemesanan",
      dokumenSertifikatUrl: "",
      keterangan: "",
    });
    setShowModal(true);
  };

  const openEdit = (item: IsotopeInventoryItem) => {
    setModalMode("edit");
    setSelected({ ...item });
    setShowModal(true);
  };

  const openView = (item: IsotopeInventoryItem) => {
    setModalMode("view");
    setSelected({ ...item });
    setShowModal(true);
  };

  const openDelete = (item: IsotopeInventoryItem) => {
    setSelected(item);
    setShowDeleteConfirm(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  const saveForm = () => {
    if (!selected) return;
    if (modalMode === "add") {
      setData((prev) => [...prev, selected].map((d, i) => ({ ...d, no: i + 1 })));
    } else if (modalMode === "edit") {
      setData((prev) => prev.map((d) => (d.id === selected.id ? { ...selected } : d)));
    }
    closeModal();
  };

  const confirmDelete = () => {
    if (!selected) return;
    setData((prev) => prev.filter((d) => d.id !== selected.id).map((d, i) => ({ ...d, no: i + 1 })));
    setShowDeleteConfirm(false);
    setSelected(null);
  };

  const isNearExpired = (dateStr: string) => {
    const now = new Date();
    const target = new Date(dateStr);
    const diff = (target.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diff <= 60 && diff >= 0; // H-60 reminder
  };

  const isExpired = (dateStr: string) => new Date(dateStr).getTime() < new Date().getTime();

  const StatusBadge: React.FC<{ status: IsotopeInventoryItem["statusProses"] }> = ({ status }) => {
    const color =
      status === "Selesai"
        ? "bg-green-100 text-green-700 border-green-300"
        : status === "Permohonan Izin"
        ? "bg-blue-100 text-blue-700 border-blue-300"
        : status === "Pelimbahan"
        ? "bg-orange-100 text-orange-700 border-orange-300"
        : status === "Penghentian Izin"
        ? "bg-red-100 text-red-700 border-red-300"
        : "bg-gray-100 text-gray-700 border-gray-300"; // Pemesanan
    return <span className={`px-2 py-0.5 text-xs rounded border ${color}`}>{status}</span>;
  };

  const ExpiryPill: React.FC<{ date: string }> = ({ date }) => {
    const expired = isExpired(date);
    const near = isNearExpired(date);
    const color = expired ? "bg-red-100 text-red-700" : near ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700";
    const label = expired ? "Expired" : near ? "Mendekati Expired" : "Valid";
    return <span className={`px-2 py-0.5 text-xs rounded ${color}`}>{label}</span>;
  };

  const handleInputChange = (field: keyof IsotopeInventoryItem, value: any) => {
    if (!selected) return;
    setSelected({ ...selected, [field]: value });
  };

  const handleLokasiChange = (key: keyof IsotopeInventoryItem["lokasiIzin"], value: boolean) => {
    if (!selected) return;
    setSelected({ ...selected, lokasiIzin: { ...selected.lokasiIzin, [key]: value } });
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Daftar Inventaris Isotop</h1>
        <p className="text-sm text-gray-600">Radiography • Inventaris isotop, izin pemanfaatan, masa berlaku, dan dokumen sertifikat.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              className="pl-8 pr-3 py-2 border rounded w-full text-sm"
              placeholder="Cari (Nama Isotop/SN/Supplier/No Izin)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="border rounded px-2 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Semua Status</option>
              <option value="Pemesanan">Pemesanan</option>
              <option value="Permohonan Izin">Permohonan Izin</option>
              <option value="Pelimbahan">Pelimbahan</option>
              <option value="Penghentian Izin">Penghentian Izin</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded text-sm">
          <Plus className="h-4 w-4" /> Tambah Data
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded">
        <table className="min-w-[1200px] w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-700">
              <th className="px-3 py-2 border">No</th>
              <th className="px-3 py-2 border">Nama Isotop</th>
              <th className="px-3 py-2 border">Tipe</th>
              <th className="px-3 py-2 border">SN Isotop</th>
              <th className="px-3 py-2 border">Tgl Mulai Aktivitas</th>
              <th className="px-3 py-2 border">Aktivitas Awal (Ci)</th>
              <th className="px-3 py-2 border">No Izin Pemanfaatan</th>
              <th className="px-3 py-2 border">Masa Berlaku Izin</th>
              <th className="px-3 py-2 border">Supplier</th>
              <th className="px-3 py-2 border">No BAST</th>
              <th className="px-3 py-2 border">Lokasi Izin</th>
              <th className="px-3 py-2 border">Status Proses</th>
              <th className="px-3 py-2 border">Dok. Sertifikat</th>
              <th className="px-3 py-2 border">Keterangan</th>
              <th className="px-3 py-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} className="even:bg-white odd:bg-slate-50">
                <td className="px-3 py-2 border text-center">{row.no}</td>
                <td className="px-3 py-2 border font-medium">{row.namaIsotop}</td>
                <td className="px-3 py-2 border">{row.tipeIsotop}</td>
                <td className="px-3 py-2 border">{row.serialNumber}</td>
                <td className="px-3 py-2 border">{new Date(row.tanggalMulaiAktivitas).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td className="px-3 py-2 border text-right">{row.aktivitasAwalCi ?? "-"}</td>
                <td className="px-3 py-2 border">{row.izinPemanfaatanNo}</td>
                <td className="px-3 py-2 border"><div className="flex items-center gap-2"><span>{new Date(row.masaBerlakuIzin).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span><ExpiryPill date={row.masaBerlakuIzin} /></div></td>
                <td className="px-3 py-2 border">{row.supplier}</td>
                <td className="px-3 py-2 border">{row.nomorBAST}</td>
                <td className="px-3 py-2 border">
                  <div className="flex flex-wrap gap-1 text-xs">
                    {row.lokasiIzin.office && <span className="px-2 py-0.5 rounded bg-slate-100">Office</span>}
                    {row.lokasiIzin.medcoCorridor && <span className="px-2 py-0.5 rounded bg-emerald-100">Medco Corridor</span>}
                    {row.lokasiIzin.medcoSSB && <span className="px-2 py-0.5 rounded bg-indigo-100">Medco SSB</span>}
                    {row.lokasiIzin.pheONWJ && <span className="px-2 py-0.5 rounded bg-orange-100">PHE ONWJ</span>}
                    {row.lokasiIzin.eniMuaraBakau && <span className="px-2 py-0.5 rounded bg-pink-100">ENI Muara Bakau</span>}
                  </div>
                </td>
                <td className="px-3 py-2 border"><StatusBadge status={row.statusProses} /></td>
                <td className="px-3 py-2 border">
                  {row.dokumenSertifikatUrl ? (
                    <a className="text-blue-600 hover:underline" href={row.dokumenSertifikatUrl} target="_blank" rel="noreferrer">Lihat File</a>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="px-3 py-2 border">{row.keterangan ?? "-"}</td>
                <td className="px-3 py-2 border">
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded bg-blue-50 hover:bg-blue-100" onClick={() => openView(row)} title="Lihat"><Eye className="h-4 w-4 text-blue-600" /></button>
                    <button className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100" onClick={() => openEdit(row)} title="Edit"><Pencil className="h-4 w-4 text-emerald-600" /></button>
                    <button className="p-1.5 rounded bg-rose-50 hover:bg-rose-100" onClick={() => openDelete(row)} title="Hapus"><Trash2 className="h-4 w-4 text-rose-600" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td className="px-3 py-6 border text-center text-slate-500" colSpan={15}>Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-3">
        <div className="text-sm text-slate-600">Menampilkan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length} data</div>
        <div className="flex items-center gap-2">
          <select className="border rounded px-2 py-2 text-sm" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <div className="flex items-center gap-1">
            <button className="p-2 border rounded disabled:opacity-50" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}><ChevronLeft className="h-4 w-4" /></button>
            <span className="text-sm">{currentPage} / {totalPages}</span>
            <button className="p-2 border rounded disabled:opacity-50" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit/View */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-[95%] max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-3 border-b flex items-center justify-between">
              <h2 className="font-semibold">{modalMode === "add" ? "Tambah" : modalMode === "edit" ? "Edit" : "Detail"} Isotop</h2>
              <button className="p-1" onClick={closeModal}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Nama Isotop</label>
                <input className="w-full border rounded px-2 py-2" value={selected.namaIsotop} disabled={modalMode === "view"} onChange={(e) => handleInputChange("namaIsotop", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Tipe Isotop</label>
                <input className="w-full border rounded px-2 py-2" value={selected.tipeIsotop} disabled={modalMode === "view"} onChange={(e) => handleInputChange("tipeIsotop", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">SN Isotop</label>
                <input className="w-full border rounded px-2 py-2" value={selected.serialNumber} disabled={modalMode === "view"} onChange={(e) => handleInputChange("serialNumber", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Tanggal Mulai Aktivitas</label>
                <input type="date" className="w-full border rounded px-2 py-2" value={selected.tanggalMulaiAktivitas} disabled={modalMode === "view"} onChange={(e) => handleInputChange("tanggalMulaiAktivitas", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Aktivitas Awal (Ci)</label>
                <input type="number" step="0.01" className="w-full border rounded px-2 py-2" value={selected.aktivitasAwalCi ?? ""} disabled={modalMode === "view"} onChange={(e) => handleInputChange("aktivitasAwalCi", e.target.value ? Number(e.target.value) : undefined)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">No Izin Pemanfaatan</label>
                <input className="w-full border rounded px-2 py-2" value={selected.izinPemanfaatanNo} disabled={modalMode === "view"} onChange={(e) => handleInputChange("izinPemanfaatanNo", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Masa Berlaku Izin</label>
                <input type="date" className="w-full border rounded px-2 py-2" value={selected.masaBerlakuIzin} disabled={modalMode === "view"} onChange={(e) => handleInputChange("masaBerlakuIzin", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Supplier</label>
                <input className="w-full border rounded px-2 py-2" value={selected.supplier} disabled={modalMode === "view"} onChange={(e) => handleInputChange("supplier", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">No BAST</label>
                <input className="w-full border rounded px-2 py-2" value={selected.nomorBAST} disabled={modalMode === "view"} onChange={(e) => handleInputChange("nomorBAST", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">Lokasi Izin</label>
                <div className="flex flex-wrap gap-3 text-sm">
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={selected.lokasiIzin.office} disabled={modalMode === "view"} onChange={(e) => handleLokasiChange("office", e.target.checked)} /> Office</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={selected.lokasiIzin.medcoCorridor} disabled={modalMode === "view"} onChange={(e) => handleLokasiChange("medcoCorridor", e.target.checked)} /> Medco Corridor</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={selected.lokasiIzin.medcoSSB} disabled={modalMode === "view"} onChange={(e) => handleLokasiChange("medcoSSB", e.target.checked)} /> Medco SSB</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={selected.lokasiIzin.pheONWJ} disabled={modalMode === "view"} onChange={(e) => handleLokasiChange("pheONWJ", e.target.checked)} /> PHE ONWJ</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={selected.lokasiIzin.eniMuaraBakau} disabled={modalMode === "view"} onChange={(e) => handleLokasiChange("eniMuaraBakau", e.target.checked)} /> ENI Muara Bakau</label>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Status Proses</label>
                <select className="w-full border rounded px-2 py-2" value={selected.statusProses} disabled={modalMode === "view"} onChange={(e) => handleInputChange("statusProses", e.target.value)}>
                  <option value="Pemesanan">Pemesanan</option>
                  <option value="Permohonan Izin">Permohonan Izin</option>
                  <option value="Pelimbahan">Pelimbahan</option>
                  <option value="Penghentian Izin">Penghentian Izin</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Dokumen Sertifikat</label>
                {modalMode === "view" ? (
                  selected.dokumenSertifikatUrl ? (
                    <a className="text-blue-600 hover:underline" href={selected.dokumenSertifikatUrl} target="_blank" rel="noreferrer">Lihat File</a>
                  ) : (
                    <div className="text-slate-400">Tidak ada file</div>
                  )
                ) : (
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer hover:bg-slate-50">
                      <Upload className="h-4 w-4" />
                      <span>Pilih File</span>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Note: In real app, upload and get URL. Here we just store file name.
                            handleInputChange("dokumenSertifikatUrl", URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                    {selected.dokumenSertifikatUrl && (
                      <a className="text-blue-600 hover:underline" href={selected.dokumenSertifikatUrl} target="_blank" rel="noreferrer">Preview</a>
                    )}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">Keterangan</label>
                <textarea className="w-full border rounded px-2 py-2" rows={3} value={selected.keterangan ?? ""} disabled={modalMode === "view"} onChange={(e) => handleInputChange("keterangan", e.target.value)} />
              </div>
            </div>
            <div className="p-3 border-t flex items-center justify-end gap-2">
              <button className="px-3 py-2 border rounded text-sm" onClick={closeModal}>Tutup</button>
              {modalMode !== "view" && (
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm" onClick={saveForm}>
                  <Save className="h-4 w-4" /> Simpan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-[95%] max-w-lg">
            <div className="p-4 border-b font-semibold">Hapus Data Isotop</div>
            <div className="p-4 text-sm text-slate-700">
              Apakah Anda yakin ingin menghapus data isotop <span className="font-semibold">{selected.namaIsotop}</span> (SN: {selected.serialNumber})?
            </div>
            <div className="p-3 border-t flex items-center justify-end gap-2">
              <button className="px-3 py-2 border rounded text-sm" onClick={() => setShowDeleteConfirm(false)}>Batal</button>
              <button className="px-3 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white text-sm" onClick={confirmDelete}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QHSEDaftarInventarisIsotopDashboard;
