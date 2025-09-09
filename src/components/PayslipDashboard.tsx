import React, { useEffect, useState } from "react";
import { Calendar, ChevronDown, Search, FileText, FileDown, Printer, Plus, Edit, Trash2 } from "lucide-react";
import PayslipModal, { PayslipFormData } from "./PayslipModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface PayslipEntry {
  id: string;
  no: number;
  kodePegawai: string;
  namaPegawai: string;
  jenisPegawai: string;
  periode: string; // YYYY-MM
  totalIncome: string;
  totalDeduct: string;
  gajiBersih: string;
  keterangan?: string;
}

const toISO = (d: string) => d || "";

const PayslipDashboard: React.FC = () => {
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<PayslipEntry | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PayslipEntry | null>(null);
  const [kodePegawai, setKodePegawai] = useState("");
  const [namaPegawai, setNamaPegawai] = useState("");

  const kodePegawaiOptions = ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005"];

  const [data, setData] = useState<PayslipEntry[]>([
    { id: "1", no: 1, kodePegawai: "EMP001", namaPegawai: "Ahmad Fauzi", jenisPegawai: "Tetap", periode: "2025-09", totalIncome: "Rp 6.750.000", totalDeduct: "Rp 850.000", gajiBersih: "Rp 5.900.000", keterangan: "-" },
    { id: "2", no: 2, kodePegawai: "EMP002", namaPegawai: "Siti Nurhaliza", jenisPegawai: "Kontrak", periode: "2025-09", totalIncome: "Rp 5.800.000", totalDeduct: "Rp 600.000", gajiBersih: "Rp 5.200.000", keterangan: "-" },
  ]);

  useEffect(() => {
    // placeholder for any init animation
  }, []);

  const handleOpenAdd = () => { setEditing(null); setIsModalOpen(true); };
  const handleOpenEdit = (row: PayslipEntry) => { setEditing(row); setIsModalOpen(true); };

  const filtered = data.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === "" ||
      item.kodePegawai.toLowerCase().includes(q) ||
      item.namaPegawai.toLowerCase().includes(q) ||
      item.periode.includes(q) ||
      item.gajiBersih.toLowerCase().includes(q);
    const matchesKode = kodePegawai ? item.kodePegawai === kodePegawai : true;
    const matchesNama = namaPegawai === "" || item.namaPegawai.toLowerCase().includes(namaPegawai.toLowerCase());
    const s = toISO(tanggalAwal);
    const e = toISO(tanggalAkhir);
    const itemDate = `${item.periode}-01`;
    const within = (!s || itemDate >= s) && (!e || itemDate <= e);
    return matchesSearch && matchesKode && matchesNama && within;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = filtered.slice(startIndex, endIndex);

  const handleSave = (f: PayslipFormData) => {
    if (editing) {
      setData(prev => prev.map(r => r.id === editing.id ? { id: editing.id, no: r.no, kodePegawai: f.kodePegawai, namaPegawai: f.namaPegawai, jenisPegawai: f.jenisPegawai, periode: f.periode, totalIncome: f.totalIncome, totalDeduct: f.totalDeduct, gajiBersih: f.gajiBersih, keterangan: f.keterangan } : r));
    } else {
      const newId = (data.length + 1).toString();
      const newRow: PayslipEntry = { id: newId, no: 1, kodePegawai: f.kodePegawai, namaPegawai: f.namaPegawai, jenisPegawai: f.jenisPegawai, periode: f.periode, totalIncome: f.totalIncome, totalDeduct: f.totalDeduct, gajiBersih: f.gajiBersih, keterangan: f.keterangan };
      setData(prev => [newRow, ...prev.map(r => ({ ...r, no: r.no + 1 }))]);
    }
    setIsModalOpen(false);
    setEditing(null);
  };

  const requestDelete = (row: PayslipEntry) => { setItemToDelete(row); setDeleteModalOpen(true); };
  const confirmDelete = () => {
    if (!itemToDelete) return;
    setData(prev => prev.filter(r => r.id !== itemToDelete.id).map((r, idx) => ({ ...r, no: idx + 1 })));
    setItemToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleExportExcel = () => {/* TODO: export */};
  const handleExportPDF = () => {/* TODO: export */};

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Payslip</h1>

        {/* Filter Section (Match Deduct/Pengurangan) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Periode Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Periode</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Awal</label>
                  <div className="relative">
                    <input type="date" value={tanggalAwal} onChange={(e) => setTanggalAwal(e.target.value)} className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="dd/mm/yyyy" />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
                  <div className="relative">
                    <input type="date" value={tanggalAkhir} onChange={(e) => setTanggalAkhir(e.target.value)} className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="dd/mm/yyyy" />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Pegawai Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Pegawai</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kode Pegawai</label>
                  <select value={kodePegawai} onChange={(e) => setKodePegawai(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                    <option value="">Pilih Kode Pegawai</option>
                    {kodePegawaiOptions.map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pegawai</label>
                  <input type="text" value={namaPegawai} onChange={(e) => setNamaPegawai(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Mr. White" />
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setCurrentPage(1)} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Cari Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Export and Add */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-3">
              <button onClick={handleExportExcel} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"><FileDown className="h-4 w-4 mr-2" />Cetak Excel</button>
              <button onClick={handleExportPDF} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"><FileText className="h-4 w-4 mr-2" />Cetak PDF</button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"><Printer className="h-4 w-4 mr-2" />Cetak Semua</button>
            </div>
            <button onClick={handleOpenAdd} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"><Plus className="h-4 w-4 mr-2" />Tambah</button>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Show</span>
              <div className="relative">
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="block w-20 appearance-none bg-white border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ChevronDown className="h-4 w-4" /></div>
              </div>
              <span className="text-gray-700">entries</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Pegawai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pegawai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Income</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deduct</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gaji Bersih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.kodePegawai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.namaPegawai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.jenisPegawai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.periode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.totalIncome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.totalDeduct}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.gajiBersih}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.keterangan || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleOpenEdit(row)} className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => requestDelete(row)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} entries</div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">{currentPage}</button>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PayslipModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditing(null); }} onSave={handleSave} initialData={editing ? { id: editing.id, kodePegawai: editing.kodePegawai, namaPegawai: editing.namaPegawai, jenisPegawai: editing.jenisPegawai, periode: editing.periode, totalIncome: editing.totalIncome, totalDeduct: editing.totalDeduct, gajiBersih: editing.gajiBersih, keterangan: editing.keterangan } : null} />
      <ConfirmDeleteModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={itemToDelete?.namaPegawai} />
    </div>
  );
};

export default PayslipDashboard;
