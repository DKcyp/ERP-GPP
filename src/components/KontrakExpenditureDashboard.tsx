import React, { useEffect, useMemo, useState } from "react";
import { Clock, Plus, Search, X } from "lucide-react";

interface KontrakRow {
  id: string;
  clientName: string;
  soInduk: string;
  soTurunan: string;
  contractStart: string; // dd/MM/yyyy
  contractEnd: string; // dd/MM/yyyy
  nilaiKontrak: number;
  absorbKontrak: number;
  remainingKontrak: number;
  nextEstimasiTagihan: number; // amount
  delayPenagihan: number; // days
  paidDate: string; // dd/MM/yyyy or '-'
  keterangan: string;
}

const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

// Form data interface
interface KontrakFormData {
  clientName: string;
  soInduk: string;
  soTurunan: string;
  contractStart: string;
  contractEnd: string;
  nilaiKontrak: string;
  nextEstimasiTagihan: string;
  keterangan: string;
}

const KontrakExpenditureDashboard: React.FC = () => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<KontrakFormData>({
    clientName: '',
    soInduk: '',
    soTurunan: '',
    contractStart: '',
    contractEnd: '',
    nilaiKontrak: '',
    nextEstimasiTagihan: '',
    keterangan: ''
  });

  // Filters (simple)
  const [qClient, setQClient] = useState("");
  const [qSOInduk, setQSOInduk] = useState("");
  const [qSOTurunan, setQSOTurunan] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [animateRows, setAnimateRows] = useState(false);

  // Dummy data sesuai gambar
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create new row data
      const newRow: KontrakRow = {
        id: (rows.length + 1).toString(),
        clientName: formData.clientName,
        soInduk: formData.soInduk,
        soTurunan: formData.soTurunan,
        contractStart: formData.contractStart,
        contractEnd: formData.contractEnd,
        nilaiKontrak: parseFloat(formData.nilaiKontrak.replace(/[^0-9]/g, '')),
        absorbKontrak: 0, // Will be calculated
        remainingKontrak: parseFloat(formData.nilaiKontrak.replace(/[^0-9]/g, '')), // Same as nilaiKontrak initially
        nextEstimasiTagihan: parseFloat(formData.nextEstimasiTagihan.replace(/[^0-9]/g, '')),
        delayPenagihan: 0, // Default value
        paidDate: '-', // Default value
        keterangan: formData.keterangan
      };
      
      // Update rows state
      setRows(prev => [newRow, ...prev]);
      
      // Reset form and close modal
      setFormData({
        clientName: '',
        soInduk: '',
        soTurunan: '',
        contractStart: '',
        contractEnd: '',
        nilaiKontrak: '',
        nextEstimasiTagihan: '',
        keterangan: ''
      });
      
      setIsSubmitting(false);
      setIsModalOpen(false);
    }, 1000);
  };

  // Format currency input
  const formatCurrency = (value: string, name: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Format as currency
    const formattedValue = numericValue
      ? new Intl.NumberFormat('id-ID').format(parseInt(numericValue))
      : '';
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // Format date to dd/MM/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [rows, setRows] = useState<KontrakRow[]>([
    {
      id: "1",
      clientName: "PT. ABC Sejahtera",
      soInduk: "SO-IND-001",
      soTurunan: "SO-TRN-001-A",
      contractStart: "01/02/2025",
      contractEnd: "31/07/2025",
      nilaiKontrak: 125000000,
      absorbKontrak: 105000000,
      remainingKontrak: 60000000,
      nextEstimasiTagihan: 980000000,
      delayPenagihan: 0,
      paidDate: "-",
      keterangan: "Implementasi sistem modul A",
    },
    {
      id: "2",
      clientName: "PT. XYZ Mandiri",
      soInduk: "SO-IND-002",
      soTurunan: "SO-TRN-002-B",
      contractStart: "10/01/2025",
      contractEnd: "10/10/2025",
      nilaiKontrak: 98500000,
      absorbKontrak: 85000000,
      remainingKontrak: 48500000,
      nextEstimasiTagihan: 1200000000,
      delayPenagihan: 7,
      paidDate: "05/08/2025",
      keterangan: "Pengembangan integrasi API",
    },
  ]);

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchClient = r.clientName
        .toLowerCase()
        .includes(qClient.toLowerCase());
      const matchSOInduk = r.soInduk
        .toLowerCase()
        .includes(qSOInduk.toLowerCase());
      const matchSOTurunan = r.soTurunan
        .toLowerCase()
        .includes(qSOTurunan.toLowerCase());
      return matchClient && matchSOInduk && matchSOTurunan;
    });
  }, [rows, qClient, qSOInduk, qSOTurunan]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = () => setCurrentPage(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Kontrak Expenditure
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Procon
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">
                  Kontrak Expenditure
                </span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Nama Client
              </label>
              <div className="relative">
                <input
                  value={qClient}
                  onChange={(e) => setQClient(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Cari nama client..."
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Nomor SO Induk
              </label>
              <input
                value={qSOInduk}
                onChange={(e) => setQSOInduk(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                placeholder="Cari SO Induk..."
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                SO Turunan
              </label>
              <input
                value={qSOTurunan}
                onChange={(e) => setQSOTurunan(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                placeholder="Cari SO Turunan..."
              />
            </div>
            <div className="flex items-end">
                <div className="flex flex-col space-y-2 w-full">
                  <button
                    onClick={handleSearch}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 text-xs flex items-center gap-2 justify-center"
                  >
                    <Search className="h-4 w-4" />
                    Terapkan Filter
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 text-xs flex items-center gap-2 justify-center"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Data
                  </button>
                </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Nama Client
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Nomor SO Induk & SO Turunan
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Durasi Kontrak (Tanggal awal - akhir kontrak)
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Nilai Kontrak
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Absorb Kontrak
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Remaining Kontrak
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Next Estimasi Tagihan
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Delay Penagihan
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Paid Date
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Keterangan pekerjaan project
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 ${
                      animateRows
                        ? "animate-in fade-in slide-in-from-bottom-2"
                        : "opacity-0"
                    }`}
                    style={{
                      animationDelay: animateRows ? `${idx * 80}ms` : "0ms",
                      animationFillMode: "forwards",
                    }}
                  >
                    <td className="px-3 py-2 text-gray-900 font-medium">
                      {row.clientName}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">
                          {row.soInduk}
                        </span>
                        <span className="text-gray-500">{row.soTurunan}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-700">
                      {row.contractStart} - {row.contractEnd}
                    </td>
                    <td className="px-3 py-2 text-gray-900 font-medium">
                      {formatRupiah(row.nilaiKontrak)}
                    </td>
                    <td className="px-3 py-2 text-gray-900 font-medium">
                      {formatRupiah(row.absorbKontrak)}
                    </td>
                    <td className="px-3 py-2 text-gray-900 font-medium">
                      {formatRupiah(row.remainingKontrak)}
                    </td>
                    <td className="px-3 py-2 text-gray-900 font-medium">
                      {formatRupiah(row.nextEstimasiTagihan)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 inline-flex text-[10px] leading-5 font-semibold rounded-full ${
                          row.delayPenagihan <= 0
                            ? "bg-green-100 text-green-800"
                            : row.delayPenagihan <= 7
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {row.delayPenagihan > 0
                          ? `${row.delayPenagihan} hari`
                          : "On time"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{row.paidDate}</td>
                    <td className="px-3 py-2 text-gray-700">
                      {row.keterangan}
                    </td>
                  </tr>
                ))}
                {currentData.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-3 py-6 text-center text-gray-500"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-700">
            <div>
              Menampilkan {filtered.length === 0 ? 0 : startIndex + 1} -{" "}
              {Math.min(startIndex + itemsPerPage, filtered.length)} dari{" "}
              {filtered.length} data
            </div>
            <div className="flex items-center gap-2">
              <span>Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-200 rounded bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <div className="ml-2 flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-2 py-1 rounded ${
                        currentPage === p
                          ? "bg-blue-600 text-white"
                          : "hover:bg-white text-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Data Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Tambah Data Kontrak</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nama Client <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama client"
                    required
                  />
                </div>

                {/* SO Induk */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nomor SO Induk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="soInduk"
                    value={formData.soInduk}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: SO-IND-001"
                    required
                  />
                </div>

                {/* SO Turunan */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nomor SO Turunan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="soTurunan"
                    value={formData.soTurunan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: SO-TRN-001-A"
                    required
                  />
                </div>

                {/* Contract Start Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal Mulai Kontrak <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="contractStart"
                    value={formData.contractStart}
                    onChange={(e) => {
                      const formattedDate = e.target.value ? formatDate(e.target.value) : '';
                      setFormData(prev => ({
                        ...prev,
                        contractStart: formattedDate
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Contract End Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal Berakhir Kontrak <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="contractEnd"
                    value={formData.contractEnd}
                    onChange={(e) => {
                      const formattedDate = e.target.value ? formatDate(e.target.value) : '';
                      setFormData(prev => ({
                        ...prev,
                        contractEnd: formattedDate
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Nilai Kontrak */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nilai Kontrak <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                    <input
                      type="text"
                      name="nilaiKontrak"
                      value={formData.nilaiKontrak}
                      onChange={(e) => formatCurrency(e.target.value, 'nilaiKontrak')}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Next Estimasi Tagihan */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Next Estimasi Tagihan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                    <input
                      type="text"
                      name="nextEstimasiTagihan"
                      value={formData.nextEstimasiTagihan}
                      onChange={(e) => formatCurrency(e.target.value, 'nextEstimasiTagihan')}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Keterangan */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Keterangan Pekerjaan Project
                  </label>
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Deskripsi singkat tentang pekerjaan project"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Data'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KontrakExpenditureDashboard;
