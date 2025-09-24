import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Clock,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  CheckSquare,
} from "lucide-react";
import Modal from "./Modal"; // Import the Modal component

interface JurnalDetail {
  coa: string;
  keterangan: string;
  debit: number;
  kredit: number;
}

interface JurnalEntry {
  id: string;
  noJurnal: string;
  tanggal: string;
  user: string;
  keterangan: string;
  details: JurnalDetail[];
  isPosted: boolean;
}

const PostingJurnalDashboard: React.FC = () => {
  const today = new Date();

  const [dummyData, setDummyData] = useState<JurnalEntry[]>([
    {
      id: "JRN001",
      noJurnal: "KM-2024-07-001",
      tanggal: "2024-07-01",
      user: "accounting",
      keterangan: "Penerimaan Pembayaran Proyek Alpha",
      details: [
        {
          coa: "1101 - Kas Besar",
          keterangan: "Penerimaan kas",
          debit: 25000000,
          kredit: 0,
        },
        {
          coa: "4101 - Pendapatan Penjualan",
          keterangan: "Pendapatan proyek",
          debit: 0,
          kredit: 25000000,
        },
      ],
      isPosted: false,
    },
    {
      id: "JRN002",
      noJurnal: "BK-2024-06-005",
      tanggal: "2024-06-30",
      user: "accounting",
      keterangan: "Pembayaran Gaji Karyawan Juni",
      details: [
        {
          coa: "5101 - Beban Gaji",
          keterangan: "Beban gaji",
          debit: 15000000,
          kredit: 0,
        },
        {
          coa: "1110 - Bank BCA",
          keterangan: "Pembayaran via bank",
          debit: 0,
          kredit: 15000000,
        },
      ],
      isPosted: true,
    },
    {
      id: "JRN003",
      noJurnal: "KK-2024-06-010",
      tanggal: "2024-06-29",
      user: "accounting",
      keterangan: "Pembelian Perlengkapan Kantor",
      details: [
        {
          coa: "1305 - Perlengkapan Kantor",
          keterangan: "Pembelian ATK",
          debit: 1200000,
          kredit: 0,
        },
        {
          coa: "1102 - Kas Kecil",
          keterangan: "Pembayaran tunai",
          debit: 0,
          kredit: 1200000,
        },
      ],
      isPosted: false,
    },
    {
      id: "JRN004",
      noJurnal: "BM-2024-06-003",
      tanggal: "2024-06-28",
      user: "accounting",
      keterangan: "Transfer dari Klien Beta",
      details: [
        {
          coa: "1111 - Bank Mandiri",
          keterangan: "Penerimaan transfer",
          debit: 50000000,
          kredit: 0,
        },
        {
          coa: "1201 - Piutang Usaha",
          keterangan: "Pelunasan piutang",
          debit: 0,
          kredit: 50000000,
        },
      ],
      isPosted: false,
    },
    {
      id: "JRN005",
      noJurnal: "KM-2024-07-002",
      tanggal: "2024-07-02",
      user: "accounting",
      keterangan: "Penerimaan Uang Muka Proyek Gamma",
      details: [
        {
          coa: "1101 - Kas Besar",
          keterangan: "Uang muka",
          debit: 10000000,
          kredit: 0,
        },
        {
          coa: "2105 - Pendapatan Diterima Dimuka",
          keterangan: "Uang muka proyek",
          debit: 0,
          kredit: 10000000,
        },
      ],
      isPosted: false,
    },
    {
      id: "JRN006",
      noJurnal: "BK-2024-07-001",
      tanggal: "2024-07-03",
      user: "accounting",
      keterangan: "Pembayaran Tagihan Listrik",
      details: [
        {
          coa: "6101 - Beban Listrik",
          keterangan: "Tagihan PLN",
          debit: 800000,
          kredit: 0,
        },
        {
          coa: "1110 - Bank BCA",
          keterangan: "Pembayaran via bank",
          debit: 0,
          kredit: 800000,
        },
      ],
      isPosted: false,
    },
  ]);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedJurnals, setSelectedJurnals] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showEntries, setShowEntries] = useState("10");

  // State for Posting Confirmation Modal
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  // State for Unposting Confirmation Modal
  const [isUnpostingModalOpen, setIsUnpostingModalOpen] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectJurnal = (id: string) => {
    setSelectedJurnals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePostingJurnal = () => {
    if (selectedJurnals.size === 0) {
      alert("Pilih setidaknya satu jurnal untuk diposting.");
      return;
    }
    setIsPostingModalOpen(true); // Open the posting confirmation modal
  };

  const handleConfirmPosting = () => {
    // Filter out already posted journals from the selection
    const jurnalsToPost = Array.from(selectedJurnals).filter((id) => {
      const entry = dummyData.find((j) => j.id === id);
      return entry && !entry.isPosted;
    });

    if (jurnalsToPost.length === 0) {
      alert("Tidak ada jurnal yang valid untuk diposting.");
      setIsPostingModalOpen(false);
      return;
    }

    // Simulate posting logic
    setDummyData((prevData) =>
      prevData.map((entry) =>
        jurnalsToPost.includes(entry.id) ? { ...entry, isPosted: true } : entry
      )
    );

    alert(`Berhasil memposting jurnal dengan ID: ${jurnalsToPost.join(", ")}`);
    setSelectedJurnals(new Set()); // Clear selection after posting
    setIsPostingModalOpen(false); // Close the modal
  };

  const handleUnpostingJurnal = () => {
    if (selectedJurnals.size === 0) {
      alert("Pilih setidaknya satu jurnal untuk diunposting.");
      return;
    }
    setIsUnpostingModalOpen(true); // Open the unposting confirmation modal
  };

  const handleConfirmUnposting = () => {
    // Filter out already unposted journals from the selection
    const jurnalsToUnpost = Array.from(selectedJurnals).filter((id) => {
      const entry = dummyData.find((j) => j.id === id);
      return entry && entry.isPosted; // Only unpost if it's currently posted
    });

    if (jurnalsToUnpost.length === 0) {
      alert("Tidak ada jurnal yang valid untuk diunposting.");
      setIsUnpostingModalOpen(false);
      return;
    }

    // Simulate unposting logic
    setDummyData((prevData) =>
      prevData.map((entry) =>
        jurnalsToUnpost.includes(entry.id)
          ? { ...entry, isPosted: false }
          : entry
      )
    );

    alert(
      `Berhasil meng-unposting jurnal dengan ID: ${jurnalsToUnpost.join(", ")}`
    );
    setSelectedJurnals(new Set()); // Clear selection after unposting
    setIsUnpostingModalOpen(false); // Close the modal
  };

  const handleSearch = () => {
    alert(
      `Searching for: ${searchQuery}, Start Date: ${startDate?.toLocaleDateString()}, End Date: ${endDate?.toLocaleDateString()}`
    );
    // Implement actual search logic here
  };

  const handleExport = (type: string) => {
    alert(`Exporting as ${type}`);
    // Implement export logic here
  };

  const filteredData = dummyData.filter((entry) => {
    const matchesSearch =
      entry.noJurnal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchQuery.toLowerCase());
    const entryDate = new Date(entry.tanggal);
    const matchesDate =
      (!startDate || entryDate >= startDate) &&
      (!endDate || entryDate <= endDate);
    return matchesSearch && matchesDate;
  });

  const selectedJurnalEntries = filteredData.filter((entry) =>
    selectedJurnals.has(entry.id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                POSTING JURNAL
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Accounting
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Posting Jurnal
                </span>
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
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label
                htmlFor="searchQuery"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cari Jurnal
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="searchQuery"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Cari nomor jurnal, keterangan, user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="periode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Periode Jurnal
              </label>
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="relative flex-1">
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleExport("Excel")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button
              onClick={() => handleExport("CSV")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button
              onClick={() => handleExport("PDF")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> PDF
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedJurnals(
                            new Set(
                              filteredData
                                .filter((j) => !j.isPosted)
                                .map((j) => j.id)
                            )
                          );
                        } else {
                          setSelectedJurnals(new Set());
                        }
                      }}
                      checked={
                        selectedJurnals.size > 0 &&
                        filteredData
                          .filter((j) => !j.isPosted)
                          .every((j) => selectedJurnals.has(j.id))
                      }
                      disabled={
                        filteredData.filter((j) => !j.isPosted).length === 0
                      }
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No. Jurnal
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
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Keterangan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((entry) => (
                  <React.Fragment key={entry.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 focus:ring-blue-500"
                          checked={selectedJurnals.has(entry.id)}
                          onChange={() => toggleSelectJurnal(entry.id)}
                          disabled={entry.isPosted}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.noJurnal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.keterangan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            entry.isPosted
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {entry.isPosted ? "Posted" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => toggleExpand(entry.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {expandedRows.has(entry.id) ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedRows.has(entry.id) && (
                      <tr>
                        <td colSpan={7} className="p-4 bg-gray-50">
                          <div className="ml-8 border-l-2 border-blue-200 pl-4">
                            <h5 className="text-md font-semibold text-gray-800 mb-2">
                              Detail Jurnal:
                            </h5>
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                    COA
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                    Keterangan
                                  </th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">
                                    Debit
                                  </th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">
                                    Kredit
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {entry.details.map((detail, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {detail.coa}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                      {detail.keterangan}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                      {detail.debit > 0
                                        ? `Rp ${detail.debit.toLocaleString(
                                            "id-ID"
                                          )}`
                                        : "-"}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                      {detail.kredit > 0
                                        ? `Rp ${detail.kredit.toLocaleString(
                                            "id-ID"
                                          )}`
                                        : "-"}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="font-bold bg-gray-50">
                                  <td
                                    colSpan={2}
                                    className="px-4 py-2 text-right text-sm text-gray-900"
                                  >
                                    Total
                                  </td>
                                  <td className="px-4 py-2 text-right text-sm text-gray-900">
                                    Rp{" "}
                                    {entry.details
                                      .reduce((sum, d) => sum + d.debit, 0)
                                      .toLocaleString("id-ID")}
                                  </td>
                                  <td className="px-4 py-2 text-right text-sm text-gray-900">
                                    Rp{" "}
                                    {entry.details
                                      .reduce((sum, d) => sum + d.kredit, 0)
                                      .toLocaleString("id-ID")}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      <div className="flex justify-end space-x-3 mb-8">
          <button
            onClick={handleUnpostingJurnal}
            disabled={
              selectedJurnals.size === 0 ||
              selectedJurnalEntries.some((entry) => !entry.isPosted)
            }
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              selectedJurnals.size > 0 &&
              selectedJurnalEntries.every((entry) => entry.isPosted)
                ? "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                : "bg-gray-400 cursor-not-allowed"
            } transition-colors`}
          >
            <CheckSquare className="h-5 w-5 mr-2" /> Unposting Jurnal (
            {selectedJurnals.size})
          </button>
          <button
            onClick={handlePostingJurnal}
            disabled={selectedJurnals.size === 0}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              selectedJurnals.size > 0
                ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                : "bg-gray-400 cursor-not-allowed"
            } transition-colors`}
          >
            <CheckSquare className="h-5 w-5 mr-2" /> Posting Jurnal (
            {selectedJurnals.size})
          </button>
        </div>

      {/* Posting Confirmation Modal */}
      <Modal
        isOpen={isPostingModalOpen}
        onClose={() => setIsPostingModalOpen(false)}
        title="Konfirmasi Posting Jurnal"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-textSecondary">
            Anda akan memposting jurnal-jurnal berikut. Pastikan semua data
            sudah benar.
          </p>
          <div className="max-h-60 overflow-y-auto border border-border rounded-lg p-3 bg-surface">
            {selectedJurnalEntries.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-text">
                {selectedJurnalEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      <span className="font-semibold">{entry.noJurnal}</span> -{" "}
                      {entry.keterangan}
                    </span>
                    {entry.isPosted && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 ml-2">
                        Sudah Diposting
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-textSecondary text-sm italic">
                Tidak ada jurnal yang dipilih untuk diposting.
              </p>
            )}
          </div>
          <p className="text-sm text-red-500">
            Perhatian: Jurnal yang sudah diposting tidak dapat diubah atau
            dihapus.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsPostingModalOpen(false)}
              className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md shadow-sm text-textSecondary bg-surface hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmPosting}
              disabled={
                selectedJurnalEntries.filter((j) => !j.isPosted).length === 0
              }
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                selectedJurnalEntries.filter((j) => !j.isPosted).length > 0
                  ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  : "bg-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              <CheckSquare className="h-5 w-5 mr-2" /> Konfirmasi Posting
            </button>
          </div>
        </div>
      </Modal>

      {/* Unposting Confirmation Modal */}
      <Modal
        isOpen={isUnpostingModalOpen}
        onClose={() => setIsUnpostingModalOpen(false)}
        title="Konfirmasi Unposting Jurnal"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-textSecondary">
            Anda akan meng-unposting jurnal-jurnal berikut. Pastikan semua data
            sudah benar.
          </p>
          <div className="max-h-60 overflow-y-auto border border-border rounded-lg p-3 bg-surface">
            {selectedJurnalEntries.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-text">
                {selectedJurnalEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      <span className="font-semibold">{entry.noJurnal}</span> -{" "}
                      {entry.keterangan}
                    </span>
                    {entry.isPosted && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 ml-2">
                        Sudah Diposting
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-textSecondary text-sm italic">
                Tidak ada jurnal yang dipilih untuk diunposting.
              </p>
            )}
          </div>
          <p className="text-sm text-red-500">
            Perhatian: Jurnal yang sudah diunposting tidak dapat dikembalikan ke
            status posted.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsUnpostingModalOpen(false)}
              className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md shadow-sm text-textSecondary bg-surface hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmUnposting}
              disabled={
                selectedJurnalEntries.filter((j) => j.isPosted).length === 0
              }
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                selectedJurnalEntries.filter((j) => j.isPosted).length > 0
                  ? "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  : "bg-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              <CheckSquare className="h-5 w-5 mr-2" /> Konfirmasi Unposting
            </button>
          </div>
        </div>
      </Modal>
    </div>
    </div>
  );
};

export default PostingJurnalDashboard;
