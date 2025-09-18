import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Search,
  Calendar,
  Plus,
  FileText,
  FileSpreadsheet,
  FileDown,
  Eye,
  History,
  Edit,
  Trash2,
  Upload,
  Paperclip,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

// Sample Data for the table
const initialCashAdvanceData = [
  {
    id: 1,
    no: 1,
    namaDepartemen: "Keuangan",
    noCA: "CA002",
    tanggal: "2025-01-15",
    noSO: "SO0001",
    noSOTurunan: "SO0001.1",
    namaProyek: "Proyek PHE ONWJ",
    namaPemohon: "Michael Johnson",
    nominal: "Rp 150,000",
    keperluan: "Pembelian alat tulis",
    tglPembayaran: "2025-01-16",
    tglLaporanExpense: "2025-01-15",
  },
  {
    id: 2,
    no: 2,
    namaDepartemen: "Operasional",
    noCA: "CA001",
    tanggal: "2025-01-16",
    noSO: "SO0002",
    noSOTurunan: "SO0002.1",
    namaProyek: "Proyek OSES",
    namaPemohon: "Emily Davis",
    nominal: "Rp 200,000",
    keperluan: "Transportasi kegiatan",
    tglPembayaran: "2025-01-17",
    tglLaporanExpense: "2025-01-16",
  },
  {
    id: 3,
    no: 3,
    namaDepartemen: "Pemasaran",
    noCA: "CA022",
    tanggal: "2025-01-17",
    noSO: "SO0003",
    noSOTurunan: "SO0003.1",
    namaProyek: "Proyek MEDCO",
    namaPemohon: "William Brown",
    nominal: "Rp 175,000",
    keperluan: "Pembelian bahan seminar",
    tglPembayaran: "2025-01-18",
    tglLaporanExpense: "2025-01-17",
  },
  {
    id: 4,
    no: 4,
    namaDepartemen: "HRD",
    noCA: "CA012",
    tanggal: "2025-01-18",
    noSO: "SO0004",
    noSOTurunan: "SO0004.1",
    namaProyek: "Proyek C",
    namaPemohon: "Olivia Martinez",
    nominal: "Rp 180,000",
    keperluan: "Biaya konsumsi",
    tglPembayaran: "2025-01-19",
    tglLaporanExpense: "2025-01-18",
  },
  {
    id: 5,
    no: 5,
    namaDepartemen: "Logistik",
    noCA: "CA005",
    tanggal: "2025-01-19",
    noSO: "SO0005",
    noSOTurunan: "SO0005.1",
    namaProyek: "Proyek A",
    namaPemohon: "James Wilson",
    nominal: "Rp 190,000",
    keperluan: "Penggantian barang",
    tglPembayaran: "2025-01-20",
    tglLaporanExpense: "2025-01-19",
  },
];

const GeneralProsesCashAdvance: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [data, setData] = useState(initialCashAdvanceData);
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form, setForm] = useState({
    namaDepartemen: "",
    noCA: "",
    tanggal: "",
    noSO: "",
    noSOTurunan: "",
    namaProyek: "",
    namaPemohon: "",
    nominal: "",
    keperluan: "",
    tglPembayaran: "",
    tglLaporanExpense: "",
    lampiranDokumen: null as File | null,
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState<any | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setForm({
      namaDepartemen: "",
      noCA: "",
      tanggal: "",
      noSO: "",
      noSOTurunan: "",
      namaProyek: "",
      namaPemohon: "",
      nominal: "",
      keperluan: "",
      tglPembayaran: "",
      tglLaporanExpense: "",
      lampiranDokumen: null,
    });
    setIsEntryOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      namaDepartemen: item.namaDepartemen,
      noCA: item.noCA,
      tanggal: item.tanggal,
      noSO: item.noSO,
      noSOTurunan: item.noSOTurunan,
      namaProyek: item.namaProyek,
      namaPemohon: item.namaPemohon,
      nominal: item.nominal,
      keperluan: item.keperluan,
      tglPembayaran: item.tglPembayaran,
      tglLaporanExpense: item.tglLaporanExpense,
      lampiranDokumen: item.lampiranDokumen,
    });
    setIsEntryOpen(true);
  };

  const saveForm = () => {
    if (editingItem) {
      setData((prev) =>
        prev.map((row: any) =>
          row.id === editingItem.id ? { ...row, ...form } : row
        )
      );
    } else {
      const newId =
        (data.reduce((max: number, r: any) => Math.max(max, r.id), 0) || 0) + 1;
      const newNo =
        (data.reduce((max: number, r: any) => Math.max(max, r.no), 0) || 0) + 1;
      setData((prev) => [...prev, { id: newId, no: newNo, ...form }]);
    }
    setIsEntryOpen(false);
    setEditingItem(null);
  };

  const openHistory = (item: any) => {
    setHistoryItem(item);
    setHistoryOpen(true);
  };

  const openDelete = (item: any) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((row: any) => row.id !== deleteItem.id));
      setDeleteItem(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setForm({ ...form, lampiranDokumen: event.target.files[0] });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Cash Advance</h1>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="noReimburse"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cari No Reimburse
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noReimburse"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="CA001"
                />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-600 bg-blue-100 rounded-r-lg hover:bg-blue-200 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="noSOTurunan"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cari No SO Turunan
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noSOTurunan"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="SO001.1"
                />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-600 bg-blue-100 rounded-r-lg hover:bg-blue-200 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="noSO"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cari No SO
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noSO"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="SO001"
                />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-600 bg-blue-100 rounded-r-lg hover:bg-blue-200 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="namaProject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cari Nama Project
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="namaProject"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="PHE ONWJ"
                />
                <button className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-600 bg-blue-100 rounded-r-lg hover:bg-blue-200 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Periode and Search Button */}
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Periode
              </label>
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  id="startDate"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-6 md:pt-0">
              <span className="text-gray-700 text-sm">s.d</span>
              <div className="relative flex-1">
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  id="endDate"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 w-full md:w-auto">
            Search
          </button>
        </div>
      </div>

      {/* Export Buttons + Tambah on the left */}
      <div className="flex justify-end space-x-3 mb-6">
        <button
          onClick={openAdd}
          className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-md hover:bg-emerald-600 transition-colors duration-200 text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah
        </button>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 text-sm">
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel
        </button>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 text-sm">
          <FileText className="w-4 h-4 mr-2" /> Export CSV
        </button>
        <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 text-sm">
          <FileDown className="w-4 h-4 mr-2" /> Export PDF
        </button>
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        {/* Table Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <span>Show</span>
            <select
              className="border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama Departemen
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  No CA
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  No SO
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  No SO Turunan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama Proyek
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama Pemohon
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nominal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Keperluan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tgl Pembayaran
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tgl Laporan Expense
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lampiran Dokumen
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.namaDepartemen}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.noCA}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.tanggal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.noSO}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.noSOTurunan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.namaProyek}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.namaPemohon}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.nominal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.keperluan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.tglPembayaran}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.tglLaporanExpense}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openHistory(item)}
                        className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors duration-200"
                        title="History"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDelete(item)}
                        className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing 1 to {data.length} of {data.length} entries
          </div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button
              aria-current="page"
              className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              1
            </button>
            <button className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>

      {/* Entry Modal (Tambah/Edit) */}
      {isEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsEntryOpen(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? "Edit Cash Advance" : "Tambah Cash Advance"}
              </h3>
              <button
                onClick={() => setIsEntryOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Nama Departemen
                  </label>
                  <input
                    value={form.namaDepartemen}
                    onChange={(e) =>
                      setForm({ ...form, namaDepartemen: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    No CA
                  </label>
                  <input
                    value={form.noCA}
                    onChange={(e) => setForm({ ...form, noCA: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={(e) =>
                      setForm({ ...form, tanggal: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    No SO
                  </label>
                  <input
                    value={form.noSO}
                    onChange={(e) => setForm({ ...form, noSO: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    No SO Turunan
                  </label>
                  <input
                    value={form.noSOTurunan}
                    onChange={(e) =>
                      setForm({ ...form, noSOTurunan: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Nama Proyek
                  </label>
                  <input
                    value={form.namaProyek}
                    onChange={(e) =>
                      setForm({ ...form, namaProyek: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Nama Pemohon
                  </label>
                  <input
                    value={form.namaPemohon}
                    onChange={(e) =>
                      setForm({ ...form, namaPemohon: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Nominal
                  </label>
                  <input
                    value={form.nominal}
                    onChange={(e) =>
                      setForm({ ...form, nominal: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Rp ..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Keperluan
                  </label>
                  <input
                    value={form.keperluan}
                    onChange={(e) =>
                      setForm({ ...form, keperluan: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tgl Pembayaran
                  </label>
                  <input
                    type="date"
                    value={form.tglPembayaran}
                    onChange={(e) =>
                      setForm({ ...form, tglPembayaran: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tgl Laporan Expense
                  </label>
                  <input
                    type="date"
                    value={form.tglLaporanExpense}
                    onChange={(e) =>
                      setForm({ ...form, tglLaporanExpense: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    <Paperclip className="inline h-4 w-4 mr-1" />
                    Lampiran Dokumen
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                        <div className="text-sm text-gray-600">
                          {form.lampiranDokumen ? (
                            <span className="text-blue-600 font-medium">
                              {form.lampiranDokumen.name}
                            </span>
                          ) : (
                            <>
                              <span className="font-medium text-blue-600">
                                Klik untuk upload
                              </span>
                              <span className="text-gray-500"> atau drag & drop</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          PDF, DOC, JPG, PNG, XLSX (Max. 10MB)
                        </div>
                      </div>
                    </label>
                    {form.lampiranDokumen && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, lampiranDokumen: null })}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        title="Hapus file"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setIsEntryOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border"
              >
                Batal
              </button>
              <button
                onClick={saveForm}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyOpen && historyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setHistoryOpen(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                History Perubahan
              </h3>
              <button
                onClick={() => setHistoryOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500"></span>
                  <div>
                    <div className="text-gray-900">
                      Entry dibuat untuk CA {historyItem.noCA}
                    </div>
                    <div className="text-gray-500">
                      Oleh System • {new Date().toLocaleString("id-ID")}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-500"></span>
                  <div>
                    <div className="text-gray-900">
                      Terakhir diubah: Nominal/Keperluan
                    </div>
                    <div className="text-gray-500">
                      Oleh System • {new Date().toLocaleString("id-ID")}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setHistoryOpen(false)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={deleteItem?.noCA}
      />
    </div>
  );
};

export default GeneralProsesCashAdvance;
