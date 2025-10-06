import React, { useState } from "react";
import {
  Search,
  CheckCircle,
  X,
  Calendar,
  FileText,
  Printer,
  Clock,
} from "lucide-react";

interface PIData {
  id: number;
  noPi: string;
  tanggal: string;
  supplier: string;
  totalAmount: number;
  status: "Pending" | "Approved" | "Rejected";
  description: string;
}

interface ApprovalModalData {
  pi: PIData;
  formatCetakan: string;
  jatuhTempo: number;
}

const FinanceApprovePIDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPI, setSelectedPI] = useState<PIData | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approvalData, setApprovalData] = useState<ApprovalModalData>({
    pi: {} as PIData,
    formatCetakan: "",
    jatuhTempo: 30,
  });

  // Sample PI data
  const [piData, setPiData] = useState<PIData[]>([
    {
      id: 1,
      noPi: "PI-2025-001",
      tanggal: "2025-01-15",
      supplier: "PT. Supplier ABC",
      totalAmount: 15000000,
      status: "Pending",
      description: "Pembelian material konstruksi",
    },
    {
      id: 2,
      noPi: "PI-2025-002",
      tanggal: "2025-01-16",
      supplier: "CV. Mitra Jaya",
      totalAmount: 8500000,
      status: "Pending",
      description: "Pengadaan alat keselamatan kerja",
    },
    {
      id: 3,
      noPi: "PI-2025-003",
      tanggal: "2025-01-17",
      supplier: "PT. Teknologi Maju",
      totalAmount: 25000000,
      status: "Approved",
      description: "Pembelian perangkat IT",
    },
    {
      id: 4,
      noPi: "PI-2025-004",
      tanggal: "2025-01-18",
      supplier: "UD. Sumber Rejeki",
      totalAmount: 12000000,
      status: "Pending",
      description: "Pembelian bahan baku produksi",
    },
    {
      id: 5,
      noPi: "PI-2025-005",
      tanggal: "2025-01-19",
      supplier: "PT. Global Solutions",
      totalAmount: 18500000,
      status: "Rejected",
      description: "Pengadaan software lisensi",
    },
  ]);

  const formatCetakanOptions = [
    "Format A4 - Standard",
    "Format A4 - Detailed",
    "Format A3 - Landscape",
    "Format Letter - Compact",
    "Format Legal - Extended",
  ];

  const filteredData = piData.filter((item) => {
    const matchesSearch =
      item.noPi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (pi: PIData) => {
    setSelectedPI(pi);
    setApprovalData({
      pi: pi,
      formatCetakan: formatCetakanOptions[0],
      jatuhTempo: 30,
    });
    setShowApprovalModal(true);
  };

  const handleReject = (pi: PIData) => {
    setSelectedPI(pi);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (selectedPI && rejectReason.trim()) {
      setPiData((prev) =>
        prev.map((item) =>
          item.id === selectedPI.id
            ? { ...item, status: "Rejected" as const }
            : item
        )
      );

      // Log rejection details (in real implementation, this would be sent to backend)
      console.log("PI Rejected:", {
        piNumber: selectedPI.noPi,
        reason: rejectReason,
        rejectedAt: new Date().toISOString(),
      });

      alert(`PI ${selectedPI.noPi} berhasil ditolak!\nAlasan: ${rejectReason}`);
      setShowRejectModal(false);
      setSelectedPI(null);
      setRejectReason("");
    }
  };

  const confirmApproval = () => {
    if (selectedPI) {
      setPiData((prev) =>
        prev.map((item) =>
          item.id === selectedPI.id
            ? { ...item, status: "Approved" as const }
            : item
        )
      );

      // Log approval details (in real implementation, this would be sent to backend)
      console.log("PI Approved:", {
        piNumber: selectedPI.noPi,
        formatCetakan: approvalData.formatCetakan,
        jatuhTempo: approvalData.jatuhTempo,
        approvedAt: new Date().toISOString(),
      });

      alert(
        `PI ${selectedPI.noPi} berhasil disetujui!\nFormat Cetakan: ${approvalData.formatCetakan}\nJatuh Tempo: ${approvalData.jatuhTempo} hari`
      );
    }
    setShowApprovalModal(false);
    setSelectedPI(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "Approved":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Approve PI</h1>
          <p className="text-gray-600">
            Kelola persetujuan Purchase Invoice dengan format cetakan dan jatuh
            tempo
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cari PI
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="No PI, Supplier, atau Deskripsi"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter Status
              </label>
              <select
                id="status"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* PI Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Daftar Proforma Invoice
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No PI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((pi) => (
                  <tr key={pi.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pi.noPi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(pi.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {pi.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(pi.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {pi.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(pi.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {pi.status === "Pending" && (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleApprove(pi)}
                            className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(pi)}
                            className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                      {pi.status !== "Pending" && (
                        <span className="text-gray-400 text-xs">No action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Tidak ada data PI
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tidak ada Purchase Invoice yang sesuai dengan filter.
              </p>
            </div>
          )}
        </div>

        {/* Approval Modal */}
        {showApprovalModal && selectedPI && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Approve Purchase Invoice
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  PI: {selectedPI.noPi}
                </p>
              </div>

              <div className="px-6 py-4 space-y-4">
                {/* PI Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Detail PI</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Supplier:</span>{" "}
                      {selectedPI.supplier}
                    </p>
                    <p>
                      <span className="font-medium">Total:</span>{" "}
                      {formatCurrency(selectedPI.totalAmount)}
                    </p>
                    <p>
                      <span className="font-medium">Deskripsi:</span>{" "}
                      {selectedPI.description}
                    </p>
                  </div>
                </div>

                {/* Format Cetakan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Printer className="inline h-4 w-4 mr-1" />
                    Format Cetakan
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={approvalData.formatCetakan}
                    onChange={(e) =>
                      setApprovalData((prev) => ({
                        ...prev,
                        formatCetakan: e.target.value,
                      }))
                    }
                  >
                    {formatCetakanOptions.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jatuh Tempo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Jatuh Tempo (Hari)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={approvalData.jatuhTempo}
                    onChange={(e) =>
                      setApprovalData((prev) => ({
                        ...prev,
                        jatuhTempo: parseInt(e.target.value) || 30,
                      }))
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Jatuh tempo:{" "}
                    {new Date(
                      Date.now() + approvalData.jatuhTempo * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={confirmApproval}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Approve PI
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedPI && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reject Purchase Invoice
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  PI: {selectedPI.noPi}
                </p>
              </div>

              <div className="px-6 py-4 space-y-4">
                {/* PI Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Detail PI</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Supplier:</span>{" "}
                      {selectedPI.supplier}
                    </p>
                    <p>
                      <span className="font-medium">Total:</span>{" "}
                      {formatCurrency(selectedPI.totalAmount)}
                    </p>
                    <p>
                      <span className="font-medium">Deskripsi:</span>{" "}
                      {selectedPI.description}
                    </p>
                  </div>
                </div>

                {/* Rejection Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <X className="inline h-4 w-4 mr-1" />
                    Alasan Penolakan *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 resize-none"
                    rows={4}
                    placeholder="Masukkan alasan penolakan PI ini..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Alasan penolakan wajib diisi untuk dokumentasi
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedPI(null);
                    setRejectReason("");
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={confirmReject}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Reject PI
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceApprovePIDashboard;
