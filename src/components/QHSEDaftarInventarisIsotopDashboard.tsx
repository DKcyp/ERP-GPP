import React, { useMemo, useState } from "react";
import { Plus, Search, Filter, X, Save, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";

// Data model for Isotope Inventory - matching image structure
export interface IsotopeInventoryItem {
  id: string; // uuid
  no: number; // row number
  // ISOTOP column group
  tipe: string; // e.g. A424-9
  sn: string; // Serial Number e.g. 94727G
  supplier: string; // e.g. PT. NDT Instruments Indonesia
  // KTUN PEMANFAATAN
  ktunPemanfaatan: string; // e.g. 094654.019.33.170720
  // KTUN TRANSPORT  
  ktunTransport: string; // e.g. 2100969.069.11.050321
  // STATUS (multi-line)
  status: string; // e.g. "Dikembalikan ke Supplier No BAST 023/NDTII-ADM/III/2021"
}

const sampleData: IsotopeInventoryItem[] = [
  {
    id: "1",
    no: 1,
    tipe: "A424-9",
    sn: "94727G",
    supplier: "PT. NDT Instruments Indonesia",
    ktunPemanfaatan: "094654.019.33.170720",
    ktunTransport: "2100969.069.11.050321",
    status: "Dikembalikan ke Supplier No BAST 023/NDTII-ADM/III/2021",
  },
  {
    id: "2",
    no: 2,
    tipe: "A424-9",
    sn: "95862G",
    supplier: "PT. NDT Instruments Indonesia",
    ktunPemanfaatan: "095771.019.11.220420",
    ktunTransport: "2100852.065.11.270221",
    status: "Dikembalikan ke Supplier No BAST 023/NDTII-ADM/III/2021",
  },
  {
    id: "3",
    no: 3,
    tipe: "A424-9",
    sn: "92514G",
    supplier: "PT. NDT Instruments Indonesia",
    ktunPemanfaatan: "092622.019.11.290120",
    ktunTransport: "2100975.069.11.050321",
    status: "Dikembalikan ke Supplier No BAST 025/NDTII-ADM/III/2021",
  },
  {
    id: "4",
    no: 4,
    tipe: "A424-9",
    sn: "97950G",
    supplier: "PT. NDT Instruments Indonesia",
    ktunPemanfaatan: "097763.019.11.200720",
    ktunTransport: "2102117.069.11.070521",
    status: "Dikembalikan ke Supplier No BAST 042/NDTII-ADM/IV/2021",
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<IsotopeInventoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data
      .filter((d) =>
        statusFilter === "ALL" ? true : d.status.toLowerCase().includes(statusFilter.toLowerCase())
      )
      .filter((d) =>
        [
          d.no.toString(),
          d.tipe,
          d.sn,
          d.supplier,
          d.ktunPemanfaatan,
          d.ktunTransport,
          d.status,
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
      tipe: "",
      sn: "",
      supplier: "",
      ktunPemanfaatan: "",
      ktunTransport: "",
      status: "",
    });
    setShowModal(true);
  };

  const openEdit = (item: IsotopeInventoryItem) => {
    setModalMode("edit");
    setSelected(item);
    setShowModal(true);
  };

  const openView = (item: IsotopeInventoryItem) => {
    setModalMode("view");
    setSelected(item);
    setShowModal(true);
  };

  const openDelete = (item: IsotopeInventoryItem) => {
    setDeleteItem(item);
    setShowDeleteModal(true);
  };



  const handleSave = () => {
    if (!selected) return;
    if (modalMode === "add") {
      setData([...data, selected]);
    } else if (modalMode === "edit") {
      setData(data.map((item) => (item.id === selected.id ? selected : item)));
    }
    setShowModal(false);
    setSelected(null);
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setData(data.filter((item) => item.id !== deleteItem.id));
    setShowDeleteModal(false);
    setDeleteItem(null);
  };

  const handleInputChange = (field: keyof IsotopeInventoryItem, value: any) => {
    setSelected((prev) => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">📋</div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                  Daftar Inventaris Isotop
                </h1>
              </div>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  QHSE
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Daftar Inventaris Isotop</span>
              </nav>
              <p className="text-gray-600 mt-2">Kelola data inventaris isotop radiografi</p>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">✓</div>
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Toolbar */}
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari isotop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="Dikembalikan">Dikembalikan ke Supplier</option>
              <option value="BAST">BAST</option>
            </select>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah Isotop
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded">
        <table className="min-w-[1200px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th rowSpan={2} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                NO
              </th>
              <th colSpan={3} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                ISOTOP
              </th>
              <th rowSpan={2} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                KTUN PEMANFAATAN
              </th>
              <th rowSpan={2} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                KTUN TRANSPORT
              </th>
              <th rowSpan={2} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                STATUS
              </th>
              <th rowSpan={2} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                AKSI
              </th>
            </tr>
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                Tipe
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                SN
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                Supplier
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300 text-center">{row.no}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300 text-center">{row.tipe}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300 text-center">{row.sn}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                  <div className="text-blue-600 font-medium">{row.supplier}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300 text-center">{row.ktunPemanfaatan}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300 text-center">{row.ktunTransport}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                  <div className="text-center text-xs leading-tight">
                    {row.status}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => openView(row)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(row)}
                      className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDelete(row)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td className="px-4 py-6 border text-center text-slate-500" colSpan={8}>Tidak ada data</td>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {modalMode === "add" ? "Tambah" : modalMode === "edit" ? "Edit" : "Detail"} Isotop
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Tipe</label>
                <input className="w-full border rounded px-2 py-2" value={selected.tipe} disabled={modalMode === "view"} onChange={(e) => handleInputChange("tipe", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">SN</label>
                <input className="w-full border rounded px-2 py-2" value={selected.sn} disabled={modalMode === "view"} onChange={(e) => handleInputChange("sn", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Supplier</label>
                <input className="w-full border rounded px-2 py-2" value={selected.supplier} disabled={modalMode === "view"} onChange={(e) => handleInputChange("supplier", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">KTUN Pemanfaatan</label>
                <input className="w-full border rounded px-2 py-2" value={selected.ktunPemanfaatan} disabled={modalMode === "view"} onChange={(e) => handleInputChange("ktunPemanfaatan", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">KTUN Transport</label>
                <input className="w-full border rounded px-2 py-2" value={selected.ktunTransport} disabled={modalMode === "view"} onChange={(e) => handleInputChange("ktunTransport", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">Status</label>
                <textarea className="w-full border rounded px-2 py-2" rows={3} value={selected.status} disabled={modalMode === "view"} onChange={(e) => handleInputChange("status", e.target.value)} />
              </div>
            </div>
            <div className="p-3 border-t flex items-center justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-2 border rounded text-sm hover:bg-slate-50">Batal</button>
              {modalMode !== "view" && (
                <button onClick={handleSave} className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                  <Save className="h-4 w-4" /> Simpan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteModal && deleteItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Konfirmasi Hapus</h3>
              <p className="text-sm text-gray-600 mb-4">
                Apakah Anda yakin ingin menghapus isotop <strong>{deleteItem.tipe} ({deleteItem.sn})</strong>?
              </p>
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setShowDeleteModal(false)} className="px-3 py-2 border rounded text-sm hover:bg-slate-50">Batal</button>
                <button onClick={handleDelete} className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default QHSEDaftarInventarisIsotopDashboard;
