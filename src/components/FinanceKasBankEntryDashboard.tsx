import React, { useMemo, useState } from "react";
import { Edit, Trash2, Printer, Plus, X } from "lucide-react";

// Interface matching the exact table structure from the image
interface KasBankEntry {
  id: number;
  tanggal: string; // DD-MM-YYYY format as shown in image
  nomorBukti: string; // Nomor Bukti column
  keterangan: string; // Keterangan column
  jumlah: number; // Jumlah column (always shows Rp0 in image)
  namaPenerima: string; // Nama Penerima column
  namaPengguna: string; // Nama Pengguna column
  entriRealTime: string; // Entri Real Time column
}

// Interface for the Tambah Kas Bank form
interface TambahKasBankForm {
  kasBank: string; // Kas / Bank field
  noPTJ: string; // No PTJ field
  tanggalTransaksi: string; // Tanggal Transaksi field
  diberikanKepada: string; // Diberikan Kepada field
  keterangan: string; // Keterangan field
}

// Interface for detailed transaction form
interface DetailTransactionForm {
  noTransaksi: string;
  tanggalTransaksi: string;
  diberikanKepada: string;
  keterangan: string;
  lineItems: TransactionLineItem[];
}

// Interface for transaction line items
interface TransactionLineItem {
  id: number;
  kodeUT: string;
  kode: string;
  namaAkun: string;
  keterangan: string;
  debet: number;
  kredit: number;
}

const FinanceKasBankEntryDashboard: React.FC = () => {
  // Filter states matching the image
  const [periodeTanggalAwal, setPeriodeTanggalAwal] = useState("2025-09-19");
  const [periodeTanggalAkhir, setPeriodeTanggalAkhir] = useState("2025-09-19");
  const [nomorBukti, setNomorBukti] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal and form states
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KasBankEntry | null>(null);
  const [showEditLineItemModal, setShowEditLineItemModal] = useState(false);
  const [editingLineItem, setEditingLineItem] =
    useState<TransactionLineItem | null>(null);
  const [formData, setFormData] = useState<TambahKasBankForm>({
    kasBank: "",
    noPTJ: "",
    tanggalTransaksi: "2025-09-19",
    diberikanKepada: "",
    keterangan: "",
  });
  const [detailFormData, setDetailFormData] = useState<DetailTransactionForm>({
    noTransaksi: "APBk-2025090001",
    tanggalTransaksi: "2025-09-01",
    diberikanKepada: "I GEDE RYANTA PUTRA ARSANA",
    keterangan:
      "Jurnal Penyeimbang Pertanggungjawaban dengan No Dokumen PT.AFMA-2025/1158 dan No Jurnal AFMA-2025090001",
    lineItems: [
      {
        id: 1,
        kodeUT: "05",
        kode: "95",
        namaAkun: "UANG MUKA DAN BEBAN DIBAYAR",
        keterangan: "VPS F.AM MOBILE BULAN AGUSTUS",
        debet: 100000,
        kredit: 0,
      },
      {
        id: 2,
        kodeUT: "05",
        kode: "95",
        namaAkun: "UTANG USAHA PIHAK KETIGA",
        keterangan: "VPS F.AM MOBILE BULAN AGUSTUS",
        debet: 0,
        kredit: 100000,
      },
    ],
  });

  // Sample data matching the exact structure from the image
  const [entries, setEntries] = useState<KasBankEntry[]>([
    {
      id: 1,
      tanggal: "29-08-2025",
      nomorBukti: "APBk-2025080307",
      keterangan: "Peralatan pembukaan pekerjaan ONM CSU Agustus 2025",
      jumlah: 0,
      namaPenerima: "I GEDE RYANTA PUTRA ARSANA",
      namaPengguna: "ARIO SETYO N",
      entriRealTime: "2025-09-02 09:08:01",
    },
    {
      id: 2,
      tanggal: "29-08-2025",
      nomorBukti: "APBk-2025080031",
      keterangan: "Beban Pembelian barang pekerjaan AC Agustus 2025",
      jumlah: 0,
      namaPenerima: "SITI NURHALIZA DEWI",
      namaPengguna: "ARIO SETYO N",
      entriRealTime: "2025-09-02 09:06:58",
    },
    {
      id: 3,
      tanggal: "28-08-2025",
      nomorBukti: "APBk-2025080307",
      keterangan:
        "Beban peralatan pembukaan pekerjaan HK Pekanbaru Agustus 2025",
      jumlah: 0,
      namaPenerima: "BUDI SANTOSO WIJAYA",
      namaPengguna: "ARIO SETYO N",
      entriRealTime: "2025-09-02 09:06:31",
    },
    {
      id: 4,
      tanggal: "28-08-2025",
      nomorBukti: "APBK-2025080030",
      keterangan: "Beban Pembelian barang pekerjaan HK Pekanbaru Agustus 2025",
      jumlah: 0,
      namaPenerima: "AHMAD RIZKI PRATAMA",
      namaPengguna: "ARIO SETYO N",
      entriRealTime: "2025-09-02 09:06:15",
    },
    {
      id: 5,
      tanggal: "28-08-2025",
      nomorBukti: "APBK-2025080029",
      keterangan: "Beban Pembelian barang pekerjaan HK Pekanbaru Agustus 2025",
      jumlah: 0,
      namaPenerima: "DEWI SARTIKA PUTRI",
      namaPengguna: "ARIO SETYO N",
      entriRealTime: "2025-09-02 09:05:58",
    },
  ]);

  // Filter entries based on search and filter criteria
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesNomorBukti =
        !nomorBukti ||
        entry.nomorBukti.toLowerCase().includes(nomorBukti.toLowerCase());
      const matchesSearch =
        !searchTerm ||
        entry.nomorBukti.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.namaPenerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.namaPengguna.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesNomorBukti && matchesSearch;
    });
  }, [entries, nomorBukti, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEntries, currentPage, itemsPerPage]);

  // Event handlers
  const handleLanjut = () => {
    // Filter logic implementation
    console.log("Filter applied:", {
      periodeTanggalAwal,
      periodeTanggalAkhir,
      nomorBukti,
    });
  };

  const handleTambah = () => {
    setShowTambahModal(true);
  };

  const handleCloseModal = () => {
    setShowTambahModal(false);
    // Reset form data
    setFormData({
      kasBank: "",
      noPTJ: "",
      tanggalTransaksi: "2025-09-19",
      diberikanKepada: "",
      keterangan: "",
    });
  };

  const handleFormSubmit = () => {
    // Process form submission and open detailed transaction modal
    console.log("Form submitted:", formData);

    // Update detailed form with data from first modal
    setDetailFormData((prev) => ({
      ...prev,
      tanggalTransaksi: formData.tanggalTransaksi,
      diberikanKepada: formData.diberikanKepada,
      keterangan: formData.keterangan,
    }));

    // Close first modal and open detailed modal
    setShowTambahModal(false);
    setShowDetailModal(true);
  };

  const handleInputChange = (field: keyof TambahKasBankForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setIsEditMode(false);
    setEditingEntry(null);
    // Reset both modals
    handleCloseModal();
  };

  const handleDetailFormSubmit = () => {
    if (isEditMode && editingEntry) {
      // Update existing entry
      const updatedEntry: KasBankEntry = {
        ...editingEntry,
        tanggal: detailFormData.tanggalTransaksi.split("-").reverse().join("-"), // Convert to DD-MM-YYYY
        nomorBukti: detailFormData.noTransaksi,
        keterangan: detailFormData.keterangan,
        jumlah: detailFormData.lineItems.reduce(
          (sum, item) => sum + item.debet + item.kredit,
          0
        ),
        entriRealTime: new Date().toLocaleString("sv-SE").replace("T", " "), // Update timestamp
      };

      // Update entry in the list
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingEntry.id ? updatedEntry : entry
        )
      );

      alert("Transaksi berhasil diperbarui!");
    } else {
      // Create new entry
      const newEntry: KasBankEntry = {
        id: entries.length + 1,
        tanggal: detailFormData.tanggalTransaksi.split("-").reverse().join("-"), // Convert to DD-MM-YYYY
        nomorBukti: detailFormData.noTransaksi,
        keterangan: detailFormData.keterangan,
        jumlah: detailFormData.lineItems.reduce(
          (sum, item) => sum + item.debet + item.kredit,
          0
        ),
        namaPenerima: detailFormData.diberikanKepada,
        namaPengguna: "Current User", // In real app, this would come from auth context
        entriRealTime: new Date().toLocaleString("sv-SE").replace("T", " "), // Current timestamp
      };

      // Add new entry to the list
      setEntries((prev) => [newEntry, ...prev]);

      alert("Transaksi berhasil disimpan!");
    }

    // Close modal and reset
    handleCloseDetailModal();
  };

  const handleDetailInputChange = (
    field: keyof DetailTransactionForm,
    value: string
  ) => {
    setDetailFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateTotals = () => {
    const totalDebet = detailFormData.lineItems.reduce(
      (sum, item) => sum + item.debet,
      0
    );
    const totalKredit = detailFormData.lineItems.reduce(
      (sum, item) => sum + item.kredit,
      0
    );
    return { totalDebet, totalKredit };
  };

  const handleDeleteLineItem = (itemId: number) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus item ini?"
    );
    if (confirmDelete) {
      setDetailFormData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.filter((item) => item.id !== itemId),
      }));
    }
  };

  const handleEditLineItem = (itemId: number) => {
    const item = detailFormData.lineItems.find((item) => item.id === itemId);
    if (item) {
      setEditingLineItem({ ...item });
      setShowEditLineItemModal(true);
    }
  };

  const handleSaveLineItemEdit = () => {
    if (editingLineItem) {
      setDetailFormData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.map((lineItem) =>
          lineItem.id === editingLineItem.id ? { ...editingLineItem } : lineItem
        ),
      }));
      setShowEditLineItemModal(false);
      setEditingLineItem(null);
    }
  };

  const handleCloseEditLineItemModal = () => {
    setShowEditLineItemModal(false);
    setEditingLineItem(null);
  };

  const handleEditLineItemChange = (
    field: keyof TransactionLineItem,
    value: string | number
  ) => {
    if (editingLineItem) {
      setEditingLineItem({
        ...editingLineItem,
        [field]: value,
      });
    }
  };

  const handleEdit = (entry: KasBankEntry) => {
    setIsEditMode(true);
    setEditingEntry(entry);

    // Populate form with existing data
    setFormData({
      kasBank: "kas", // Default value, in real app this would come from entry data
      noPTJ: "",
      tanggalTransaksi: entry.tanggal.split("-").reverse().join("-"), // Convert DD-MM-YYYY to YYYY-MM-DD
      diberikanKepada: entry.namaPenerima, // Use the actual recipient name from entry
      keterangan: entry.keterangan,
    });

    // Populate detailed form
    setDetailFormData((prev) => ({
      ...prev,
      noTransaksi: entry.nomorBukti,
      tanggalTransaksi: entry.tanggal.split("-").reverse().join("-"),
      diberikanKepada: entry.namaPenerima,
      keterangan: entry.keterangan,
    }));

    // Open the detailed modal directly for editing
    setShowDetailModal(true);
  };

  const handleDelete = (id: number) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handlePrint = (entry: KasBankEntry) => {
    // Create print content
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 30px;">BUKTI TRANSAKSI KAS/BANK</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nomor Bukti:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              entry.nomorBukti
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Tanggal:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              entry.tanggal
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Keterangan:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              entry.keterangan
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Jumlah:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formatCurrency(
              entry.jumlah
            )}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nama Penerima:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              entry.namaPenerima
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nama Pengguna:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              entry.namaPengguna
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Waktu Entry:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              entry.entriRealTime
            }</td>
          </tr>
        </table>
        <div style="margin-top: 50px; text-align: right;">
          <p>Dicetak pada: ${new Date().toLocaleString("id-ID")}</p>
        </div>
      </div>
    `;

    // Open print window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleUnpost = (entry: KasBankEntry) => {
    const confirmUnpost = window.confirm(
      `Apakah Anda yakin ingin melakukan unpost untuk transaksi:\n\n` +
        `Nomor Bukti: ${entry.nomorBukti}\n` +
        `Tanggal: ${entry.tanggal}\n` +
        `Jumlah: ${formatCurrency(entry.jumlah)}\n\n` +
        `Proses unpost akan membatalkan posting transaksi ini.`
    );

    if (confirmUnpost) {
      // In a real app, this would call an API to unpost the transaction
      alert(`Transaksi ${entry.nomorBukti} berhasil di-unpost!`);
      console.log("Unpost entry:", entry);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rp${amount.toLocaleString("id-ID")}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                KAS BANK ENTRY
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Finance
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Kas Bank Entry
                </span>
              </nav>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filter Section */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Periode Tanggal Awal
                </label>
                <input
                  type="date"
                  value={periodeTanggalAwal}
                  onChange={(e) => setPeriodeTanggalAwal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Periode Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={periodeTanggalAkhir}
                  onChange={(e) => setPeriodeTanggalAkhir(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Bukti
                </label>
                <input
                  type="text"
                  value={nomorBukti}
                  onChange={(e) => setNomorBukti(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nomor Bukti"
                />
              </div>
              <div>
                <button
                  onClick={handleLanjut}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Lanjut
                </button>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleTambah}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Tambah</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search..."
              />
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Hapus
                  </th>
                  {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Unposting
                </th> */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Cetak
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Edit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Nomor Bukti
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Keterangan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Jumlah
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Nama Penerima
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Nama Pengguna
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Entri Real Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                    {/* <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleUnpost(entry)}
                      className="text-orange-600 hover:text-orange-800 p-1"
                      title="Unposting"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </td> */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handlePrint(entry)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Cetak"
                      >
                        <Printer size={16} />
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {entry.tanggal}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {entry.nomorBukti}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate"
                      title={entry.keterangan}
                    >
                      {entry.keterangan}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(entry.jumlah)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {entry.namaPenerima}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {entry.namaPengguna}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {entry.entriRealTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredEntries.length)}{" "}
                of {filteredEntries.length} entries
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Tambah Kas Bank Modal */}
        {showTambahModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Transaksi Kas / Bank Entry
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {/* Kas / Bank Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kas / Bank
                    </label>
                    <select
                      value={formData.kasBank}
                      onChange={(e) =>
                        handleInputChange("kasBank", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">[Pilih Kas / Bank]</option>
                      <option value="kas">Kas</option>
                      <option value="bank">Bank</option>
                    </select>
                  </div>

                  {/* Tanggal Transaksi Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Transaksi
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalTransaksi}
                      onChange={(e) =>
                        handleInputChange("tanggalTransaksi", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Diberikan Kepada Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User
                    </label>
                    <input
                      type="text"
                      value={formData.diberikanKepada}
                      onChange={(e) =>
                        handleInputChange("diberikanKepada", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nama penerima"
                    />
                  </div>

                  {/* Keterangan Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keterangan
                    </label>
                    <textarea
                      value={formData.keterangan}
                      onChange={(e) =>
                        handleInputChange("keterangan", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Keterangan transaksi"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-start space-x-3">
                <button
                  onClick={handleFormSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Lanjut
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Transaction Modal */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Transaksi Kas / Bank Entry
                </h2>
                <button
                  onClick={handleCloseDetailModal}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {/* Transaction Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        No Transaksi
                      </label>
                      <input
                        type="text"
                        value={detailFormData.noTransaksi}
                        onChange={(e) =>
                          handleDetailInputChange("noTransaksi", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Transaksi
                      </label>
                      <input
                        type="date"
                        value={detailFormData.tanggalTransaksi}
                        onChange={(e) =>
                          handleDetailInputChange(
                            "tanggalTransaksi",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User
                    </label>
                    <input
                      type="text"
                      value={detailFormData.diberikanKepada}
                      onChange={(e) =>
                        handleDetailInputChange(
                          "diberikanKepada",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keterangan
                    </label>
                    <textarea
                      value={detailFormData.keterangan}
                      onChange={(e) =>
                        handleDetailInputChange("keterangan", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Transaction Line Items Table */}
                  <div className="mt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-300">
                        <thead className="bg-gray-50 a">
                          <tr>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                              Hapus
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                              Edit
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                              Kode Akun
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                              Nama Akun
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                              Keterangan
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-300">
                              Debet
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Kredit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailFormData.lineItems.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-gray-200"
                            >
                              <td className="px-2 py-2 border-r border-gray-300">
                                <button
                                  onClick={() => handleDeleteLineItem(item.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Hapus item"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                              <td className="px-2 py-2 border-r border-gray-300">
                                <button
                                  onClick={() => handleEditLineItem(item.id)}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="Edit item"
                                >
                                  <Edit size={14} />
                                </button>
                              </td>
                              <td className="px-2 py-2 text-sm border-r border-gray-300">
                                {item.kode}
                              </td>
                              <td className="px-2 py-2 text-sm border-r border-gray-300">
                                {item.namaAkun}
                              </td>
                              <td className="px-2 py-2 text-sm border-r border-gray-300">
                                {item.keterangan}
                              </td>
                              <td className="px-2 py-2 text-sm text-right border-r border-gray-300">
                                {formatCurrency(item.debet)}
                              </td>
                              <td className="px-2 py-2 text-sm text-right">
                                {formatCurrency(item.kredit)}
                              </td>
                            </tr>
                          ))}
                          {/* Total Row */}
                          <tr className="bg-gray-50 font-semibold">
                            <td
                              colSpan={5}
                              className="px-2 py-2 text-right border-r border-gray-300"
                            >
                              Total
                            </td>
                            <td className="px-2 py-2 text-right border-r border-gray-300">
                              {formatCurrency(calculateTotals().totalDebet)}
                            </td>
                            <td className="px-2 py-2 text-right">
                              {formatCurrency(calculateTotals().totalKredit)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Akun Section */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Akun
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Cari Akun</option>
                          <option value="Akun1">Akun 1</option>
                          <option value="Akun2">Akun 2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jumlah
                        </label>
                        <input
                          type="text"
                          defaultValue="Rp09.750"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipe
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="debet">Debet</option>
                          <option value="kredit">Kredit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Keterangan
                        </label>
                        <input
                          type="text"
                          defaultValue="Jurnal Penyeimbang Pertanggungj"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-end">
                        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          Masukkan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-start space-x-3">
                <button
                  onClick={handleDetailFormSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Simpan
                </button>
                <button
                  onClick={handleCloseDetailModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Line Item Modal */}
        {showEditLineItemModal && editingLineItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Line Item
                </h3>
                <button
                  onClick={handleCloseEditLineItemModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Akun
                  </label>
                  <input
                    type="text"
                    value={editingLineItem.kode}
                    onChange={(e) =>
                      handleEditLineItemChange("kode", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Akun
                  </label>
                  <input
                    type="text"
                    value={editingLineItem.namaAkun}
                    onChange={(e) =>
                      handleEditLineItemChange("namaAkun", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value={editingLineItem.keterangan}
                    onChange={(e) =>
                      handleEditLineItemChange("keterangan", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Debet
                    </label>
                    <input
                      type="number"
                      value={editingLineItem.debet}
                      onChange={(e) =>
                        handleEditLineItemChange(
                          "debet",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kredit
                    </label>
                    <input
                      type="number"
                      value={editingLineItem.kredit}
                      onChange={(e) =>
                        handleEditLineItemChange(
                          "kredit",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseEditLineItemModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveLineItemEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceKasBankEntryDashboard;
