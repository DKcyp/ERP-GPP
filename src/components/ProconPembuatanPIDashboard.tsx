import React, { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Plus,
  Search,
  X,
  Edit,
  Trash2,
  Printer,
  UploadCloud,
  FileText,
} from "lucide-react";
import HPPDetailTabs from "./HPPDetailTabs";
// ProformaInvoicePrintTemplate removed as it's no longer used for printing.

interface PIEntry {
  id: string;
  noPI?: string; // New field for Proforma Invoice Number
  // Existing fields (kept for linkage)
  clientName: string;
  soInduk: string;
  soTurunan: string;
  // New required fields per request
  documentDate: string; // Tanggal dokumen (dd/MM/yyyy)
  salesName: string; // Nama sales
  item: string; // Item apa saja (ringkas)
  taxType: "PPN" | "Non PPN"; // pajak
  dueDate: string; // Due pembayaran (dd/MM/yyyy)
  dueDays?: number; // Jumlah hari jatuh tempo dari tanggal dokumen
  contractOrPO: string; // nomor kontrak / PO
  bankCode: string; // Kode Bank
  newInputField?: string; // New field added after bankCode
  attachmentTugas?: File; // File attachment
  attachmentFileName?: string; // Store filename for display
  attachmentFileSize?: number; // Store file size
  // Legacy fields (optional)
  contractStart?: string; // dd/MM/yyyy
  contractEnd?: string; // dd/MM/yyyy
  nilaiKontrak?: number;
  absorbKontrak?: number;
  remainingKontrak?: number;
  totalPI?: number; // New field for Total PI
}

// formatRupiah removed (no longer used)

// Helper: compute due date from document date (dd/MM/yyyy) + days
const computeDueDate = (documentDate: string, days: number): string => {
  try {
    if (!documentDate) return "";
    const [dd, mm, yyyy] = documentDate.split("/").map((v) => parseInt(v, 10));
    if (!dd || !mm || !yyyy) return "";
    const d = new Date(yyyy, mm - 1, dd);
    if (isNaN(d.getTime())) return "";
    d.setDate(d.getDate() + (Number.isFinite(days) ? days : 0));
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch {
    return "";
  }
};

const ProconPembuatanPIDashboard: React.FC = () => {
  // Master options (Client -> SO Induk -> SO Turunan)
  const masterOptions = useMemo(
    () => [
      {
        clientName: "PT. ABC Sejahtera",
        soInduk: [
          {
            id: "SO-IND-001",
            soTurunan: [
              {
                id: "SO-TRN-001-A",
                nilaiKontrak: 125000000,
                contractStart: "01/02/2025",
                contractEnd: "31/07/2025",
              },
              {
                id: "SO-TRN-001-B",
                nilaiKontrak: 50000000,
                contractStart: "15/02/2025",
                contractEnd: "30/06/2025",
              },
            ],
          },
        ],
      },
      {
        clientName: "PT. XYZ Mandiri",
        soInduk: [
          {
            id: "SO-IND-002",
            soTurunan: [
              {
                id: "SO-TRN-002-A",
                nilaiKontrak: 98500000,
                contractStart: "10/01/2025",
                contractEnd: "10/10/2025",
              },
            ],
          },
        ],
      },
    ],
    []
  );
  // Filters
  const [qClient, setQClient] = useState("");
  const [qSOInduk, setQSOInduk] = useState("");
  const [qSOTurunan, setQSOTurunan] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Data
  const [data, setData] = useState<PIEntry[]>([
    {
      id: "1",
      clientName: "PT. ABC Sejahtera",
      soInduk: "SO-IND-001",
      soTurunan: "SO-TRN-001-A",
      documentDate: "01/02/2025",
      salesName: "Budi",
      item: "Implementasi modul A",
      taxType: "PPN",
      dueDate: "15/03/2025",
      contractOrPO: "PO-001/ABC/2025",
      bankCode: "BCA-123",
      contractStart: "01/02/2025",
      contractEnd: "31/07/2025",
      nilaiKontrak: 125000000,
      absorbKontrak: 65000000,
      remainingKontrak: 60000000,
      totalPI: 150000000, // Dummy data for Total PI
    },
    {
      id: "2",
      clientName: "PT. XYZ Mandiri",
      soInduk: "SO-IND-002",
      soTurunan: "SO-TRN-002-B",
      documentDate: "10/01/2025",
      salesName: "Sari",
      item: "Integrasi API",
      taxType: "Non PPN",
      dueDate: "25/02/2025",
      contractOrPO: "KTR-XYZ-2025-02",
      bankCode: "MANDIRI-456",
      contractStart: "10/01/2025",
      contractEnd: "10/10/2025",
      nilaiKontrak: 98500000,
      absorbKontrak: 50000000,
      remainingKontrak: 48500000,
      totalPI: 100000000, // Dummy data for Total PI
    },
  ]);

  // Helper: generate PI number
  const generatePINumber = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const currentMaxNo = data.filter((item) =>
      item.noPI?.startsWith(`PI/${year}${month}${day}`)
    ).length;
    const nextNo = String(currentMaxNo + 1).padStart(3, "0");
    return `PI/${year}${month}${day}/${nextNo}`;
  };

  // Load from localStorage on init
  useEffect(() => {
    try {
      const raw = localStorage.getItem("procon_pi_entries");
      if (raw) {
        const parsed: any[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Backward compatibility mapping for entries without new fields
          const mapped: PIEntry[] = parsed.map((r, idx) => ({
            id: r.id ?? String(Date.now()) + "-" + idx,
            clientName: r.clientName ?? "",
            soInduk: r.soInduk ?? "",
            soTurunan: r.soTurunan ?? "",
            documentDate: r.documentDate ?? (r.contractStart || ""),
            salesName: r.salesName ?? "",
            item: r.item ?? "",
            taxType: (r.taxType as any) ?? "PPN",
            dueDate: r.dueDate ?? (r.contractEnd || ""),
            dueDays: r.dueDays ?? undefined,
            contractOrPO: r.contractOrPO ?? "",
            bankCode: r.bankCode ?? "",
            contractStart: r.contractStart,
            contractEnd: r.contractEnd,
            nilaiKontrak: r.nilaiKontrak,
            absorbKontrak: r.absorbKontrak,
            remainingKontrak: r.remainingKontrak,
            noPI: r.noPI ?? "", // Include noPI in mapping
            totalPI: r.totalPI ?? 0, // Include totalPI in mapping
          }));
          setData(mapped);
        }
      }
    } catch (e) {
      console.warn("Failed to load procon_pi_entries", e);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem("procon_pi_entries", JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to save procon_pi_entries", e);
    }
  }, [data]);

  // Add Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<PIEntry, "id">>({
    clientName: "",
    soInduk: "",
    soTurunan: "",
    documentDate: "",
    salesName: "",
    item: "",
    taxType: "PPN",
    dueDate: "",
    dueDays: 0,
    contractOrPO: "",
    bankCode: "",
    contractStart: "",
    contractEnd: "",
    nilaiKontrak: 0,
    absorbKontrak: 0,
    remainingKontrak: 0,
    attachmentTugas: undefined,
    attachmentFileName: "",
    attachmentFileSize: 0,
    noPI: "", // Initialize noPI
    newInputField: "", // Initialize newInputField
    totalPI: 0, // Initialize totalPI
  });

  // New: Estimasi Nilai Kontrak field (tab content uses shared HPPDetailTabs)
  const [estimasiNilaiKontrak, setEstimasiNilaiKontrak] = useState<number>(0);

  // Print-related state and component have been removed as per new requirements.

  const filtered = useMemo(() => {
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    if (fromDate) fromDate.setHours(0, 0, 0, 0);
    if (toDate) toDate.setHours(23, 59, 59, 999);

    return data.filter((r) => {
      if (!r.documentDate) return false;
      const [day, month, year] = r.documentDate.split("/").map(Number);
      const itemDate = new Date(year, month - 1, day);

      const dateMatch =
        !fromDate || !toDate || (itemDate >= fromDate && itemDate <= toDate);

      return (
        dateMatch &&
        r.clientName.toLowerCase().includes(qClient.toLowerCase()) &&
        r.soInduk.toLowerCase().includes(qSOInduk.toLowerCase()) &&
        r.soTurunan.toLowerCase().includes(qSOTurunan.toLowerCase())
      );
    });
  }, [data, qClient, qSOInduk, qSOTurunan, dateFrom, dateTo]);

  const handleOpenAdd = () => {
    setForm({
      clientName: "",
      soInduk: "",
      soTurunan: "",
      documentDate: "",
      salesName: "",
      item: "",
      taxType: "PPN",
      dueDate: "",
      dueDays: 0,
      contractOrPO: "",
      bankCode: "",
      contractStart: "",
      contractEnd: "",
      nilaiKontrak: 0,
      absorbKontrak: 0,
      remainingKontrak: 0,
      attachmentTugas: undefined,
      attachmentFileName: "",
      attachmentFileSize: 0,
      noPI: generatePINumber(), // Generate No. PI for new entries
      newInputField: "", // Initialize newInputField for new entries
      totalPI: 0, // Initialize totalPI for new entries
    });
    setEditId(null);
    setIsAddOpen(true);
  };

  // Helper: compute number of days between documentDate and dueDate (both dd/MM/yyyy)
  const computeDueDays = (documentDate?: string, dueDate?: string): number => {
    try {
      if (!documentDate || !dueDate) return 0;
      const [dd1, mm1, yy1] = documentDate
        .split("/")
        .map((v) => parseInt(v, 10));
      const [dd2, mm2, yy2] = dueDate.split("/").map((v) => parseInt(v, 10));
      if (!dd1 || !mm1 || !yy1 || !dd2 || !mm2 || !yy2) return 0;
      const d1 = new Date(yy1, mm1 - 1, dd1).getTime();
      const d2 = new Date(yy2, mm2 - 1, dd2).getTime();
      if (!Number.isFinite(d1) || !Number.isFinite(d2)) return 0;
      const msPerDay = 24 * 60 * 60 * 1000;
      return Math.max(0, Math.round((d2 - d1) / msPerDay));
    } catch {
      return 0;
    }
  };

  const handleSave = () => {
    if (editId) {
      setData((prev) =>
        prev.map((it) =>
          it.id === editId ? ({ id: editId, ...form } as PIEntry) : it
        )
      );
    } else {
      const newItem: PIEntry = {
        id: Date.now().toString(),
        ...form,
        noPI: form.noPI || generatePINumber(),
      }; // Ensure noPI is set on save
      setData((prev) => [newItem, ...prev]);
    }
    setIsAddOpen(false);
    setEditId(null);
  };

  const handleEdit = (id: string) => {
    const found = data.find((d) => d.id === id);
    if (!found) return;
    setForm({
      clientName: found.clientName,
      soInduk: found.soInduk,
      soTurunan: found.soTurunan,
      documentDate: found.documentDate || "",
      salesName: found.salesName || "",
      item: found.item || "",
      taxType: (found.taxType as any) || "PPN",
      dueDate: found.dueDate || "",
      dueDays: computeDueDays(found.documentDate, found.dueDate),
      contractOrPO: found.contractOrPO || "",
      bankCode: found.bankCode || "",
      contractStart: found.contractStart || "",
      contractEnd: found.contractEnd || "",
      nilaiKontrak: found.nilaiKontrak || 0,
      absorbKontrak: found.absorbKontrak || 0,
      remainingKontrak: found.remainingKontrak || 0,
      attachmentTugas: found.attachmentTugas,
      attachmentFileName: found.attachmentFileName || "",
      attachmentFileSize: found.attachmentFileSize || 0,
      noPI: found.noPI || "", // Load noPI when editing
      newInputField: found.newInputField || "", // Load newInputField when editing
      totalPI: found.totalPI || 0, // Load totalPI when editing
    });
    setEditId(id);
    setIsAddOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  const handlePrint = () => {
    const link = document.createElement("a");
    // Assuming the '.folder' directory is in your public assets folder
    link.href = "/folder/cetakprovorma.pdf";
    link.setAttribute("download", "Proforma-Invoice.pdf"); // Sets the downloaded file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dependent select handlers
  const onClientChange = (clientName: string) => {
    setForm((prev) => ({
      ...prev,
      clientName,
      soInduk: "",
      soTurunan: "",
      contractStart: "",
      contractEnd: "",
      nilaiKontrak: 0,
      remainingKontrak: 0,
      // keep absorb as is
    }));
  };

  const onSOIndukChange = (soInduk: string) => {
    setForm((prev) => ({
      ...prev,
      soInduk,
      soTurunan: "",
      contractStart: "",
      contractEnd: "",
      nilaiKontrak: 0,
      remainingKontrak: 0,
    }));
  };

  const onSOTurunanChange = (soTurunan: string) => {
    // Find nilaiKontrak and kontrak dates from master
    const client = masterOptions.find((c) => c.clientName === form.clientName);
    const soIndukObj = client?.soInduk.find((s) => s.id === form.soInduk);
    const st = soIndukObj?.soTurunan.find((x) => x.id === soTurunan);
    const nilai = st?.nilaiKontrak ?? 0;
    const start = st?.contractStart ?? "";
    const end = st?.contractEnd ?? "";
    setForm((prev) => ({
      ...prev,
      soTurunan,
      nilaiKontrak: nilai,
      contractStart: start,
      contractEnd: end,
      remainingKontrak: Math.max(0, nilai - (prev.absorbKontrak || 0)),
    }));
  };

  // onAbsorbChange removed (legacy, no longer used in modal)

  // File handling functions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Maksimal 10MB.");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(
          "Tipe file tidak didukung. Gunakan PDF, DOC, DOCX, XLS, XLSX, JPG, atau PNG."
        );
        return;
      }

      setForm((prev) => ({
        ...prev,
        attachmentTugas: file,
        attachmentFileName: file.name,
        attachmentFileSize: file.size,
      }));
    }
  };

  const handleRemoveFile = () => {
    setForm((prev) => ({
      ...prev,
      attachmentTugas: undefined,
      attachmentFileName: "",
      attachmentFileSize: 0,
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                PEMBUATAN PROFORMA INVOICE
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Procon
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-semibold">
                  Pembuatan PI
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
        {/* Filters + Add */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Nama Client */}
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
            {/* SO Induk */}
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
            {/* SO Turunan */}
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
            {/* Periode Dari */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode Dari
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
              />
            </div>
            {/* Periode Sampai */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Periode Sampai
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
              />
            </div>
            {/* Add Button */}
            <div className="flex items-end">
              <button
                onClick={handleOpenAdd}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 text-xs flex items-center gap-2 justify-center"
              >
                <Plus className="h-4 w-4" />
                Tambah PI
              </button>
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
                    Tanggal Dokumen
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    No. SO / SO Turunan
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Nama Sales
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Pajak
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Due Pembayaran
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    No. Kontrak / PO
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Kode Bank
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Total PI
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-900">
                    Lampiran
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-900">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900 font-medium">
                      {row.documentDate}
                    </td>
                    <td className="px-3 py-2 text-gray-900 font-medium">
                      {row.soInduk} / {row.soTurunan}
                    </td>
                    <td className="px-3 py-2 text-gray-900 font-medium">
                      {row.salesName}
                    </td>
                    <td className="px-3 py-2 text-gray-700">{row.taxType}</td>
                    <td className="px-3 py-2 text-gray-700">{row.dueDate}</td>
                    <td className="px-3 py-2 text-gray-700">
                      {row.contractOrPO}
                    </td>
                    <td className="px-3 py-2 text-gray-700">{row.bankCode}</td>
                    <td className="px-3 py-2 text-gray-700">{row.totalPI}</td>
                    <td className="px-3 py-2 text-gray-700">
                      {row.attachmentFileName ? (
                        <div className="flex items-center gap-1">
                          {getFileIcon(row.attachmentFileName)}
                          <span
                            className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer truncate max-w-[100px]"
                            title={row.attachmentFileName}
                          >
                            {row.attachmentFileName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Tidak ada</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          className="text-blue-600 hover:text-blue-700"
                          onClick={handlePrint}
                          title="Cetak"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          className="text-yellow-600 hover:text-yellow-700"
                          onClick={() => handleEdit(row.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(row.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-3 py-6 text-center text-gray-500"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsAddOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {editId ? "Edit" : "Tambah"} Proforma Invoice
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* No. PI */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  No. PI
                </label>
                <input
                  type="text"
                  value={form.noPI}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
                />
              </div>
              {/* Tanggal Dokumen */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tanggal Dokumen
                </label>
                <input
                  type="text"
                  placeholder="dd/MM/yyyy"
                  value={form.documentDate}
                  onChange={(e) => {
                    const documentDate = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      documentDate,
                      dueDate: computeDueDate(documentDate, prev.dueDays ?? 0),
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              {/* Select Client (helper for SO options) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Pilih Client (untuk SO)
                </label>
                <select
                  value={form.clientName}
                  onChange={(e) => onClientChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Pilih Client</option>
                  {masterOptions.map((c) => (
                    <option key={c.clientName} value={c.clientName}>
                      {c.clientName}
                    </option>
                  ))}
                </select>
              </div>
              {/* Select SO Induk */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nomor SO Induk
                </label>
                <select
                  value={form.soInduk}
                  onChange={(e) => onSOIndukChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  disabled={!form.clientName}
                >
                  <option value="">Pilih SO Induk</option>
                  {masterOptions
                    .find((c) => c.clientName === form.clientName)
                    ?.soInduk.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id}
                      </option>
                    ))}
                </select>
              </div>
              {/* Select SO Turunan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  SO Turunan
                </label>
                <select
                  value={form.soTurunan}
                  onChange={(e) => onSOTurunanChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  disabled={!form.soInduk}
                >
                  <option value="">Pilih SO Turunan</option>
                  {masterOptions
                    .find((c) => c.clientName === form.clientName)
                    ?.soInduk.find((s) => s.id === form.soInduk)
                    ?.soTurunan.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.id}
                      </option>
                    ))}
                </select>
              </div>
              {/* Nama Sales */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nama Sales
                </label>
                <input
                  type="text"
                  value={form.salesName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, salesName: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              {/* Pajak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Pajak
                </label>
                <select
                  value={form.taxType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      taxType: e.target.value as "PPN" | "Non PPN",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="PPN">PPN</option>
                  <option value="Non PPN">Non PPN</option>
                </select>
              </div>
              {/* Due Pembayaran (hari) & Tanggal Jatuh Tempo */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Due Pembayaran (hari)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.dueDays ?? 0}
                  onChange={(e) => {
                    const days = Number(e.target.value || 0);
                    setForm((prev) => ({
                      ...prev,
                      dueDays: days,
                      dueDate: computeDueDate(prev.documentDate, days),
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tanggal Jatuh Tempo:{" "}
                  <span className="font-medium">{form.dueDate || "-"}</span>
                </p>
              </div>
              {/* No. Kontrak / PO */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  No. Kontrak / PO
                </label>
                <input
                  type="text"
                  value={form.contractOrPO}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      contractOrPO: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              {/* Kode Bank */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Kode Bank
                </label>
                <input
                  type="text"
                  value={form.bankCode}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, bankCode: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              {/* New Input Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  New Field
                </label>
                <input
                  type="text"
                  value={form.newInputField}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      newInputField: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Lampiran
                </label>
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer w-fit">
                  <UploadCloud className="h-4 w-4" />
                  <span className="text-xs">Upload file</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {/* File Upload Section */}
            {/* <div className="mt-6 border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Lampiran File</h4>
               */}
            {/* File Upload Area */}
            {/* <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Klik untuk upload file atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Mendukung: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max: 10MB)
                    </p>
                  </label>
                </div>

                {/* File Preview */}
            {form.attachmentFileName && (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(form.attachmentFileName)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {form.attachmentFileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(form.attachmentFileSize || 0)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Hapus file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            {/* </div>            */}
            {/* </div> */}

            {/* HPP Detail Tabs (shared across modules) */}
            <div className="mt-4">
              <HPPDetailTabs
                onTotalChange={(total) => setEstimasiNilaiKontrak(total)}
              />
            </div>
            {/* Nilai HPP (moved to bottom) */}
            <div className="mt-6">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nilai HPP
              </label>
              <input
                type="number"
                placeholder="Rp 0"
                value={estimasiNilaiKontrak}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg border"
                onClick={() => setIsAddOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                onClick={handleSave}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {/* The print template component has been removed. */}
    </div>
  );
};

export default ProconPembuatanPIDashboard;
