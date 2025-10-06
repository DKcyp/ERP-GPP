import React, { useState, useMemo } from "react";
import { 
  Search, 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Clock,
  FileSpreadsheet,
  Download,
  FileText,
  RefreshCw,
  X,
  Save,
} from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface NoSuratItem {
  id: string;
  noSurat: string;
  keterangan: string;
  documentPath?: string; // Add this line
}

const initialData: NoSuratItem[] = [
  {
    id: "1",
    noSurat: "001/HRD/I/2024",
    keterangan: "Surat Keterangan Kerja",
    documentPath: "/Folder/cetakprovorma.pdf",
  },
  {
    id: "2",
    noSurat: "002/HRD/I/2024",
    keterangan: "Surat Peringatan Pertama",
    documentPath: "/Folder/cetakprovorma2.pdf",
  },
  { id: "3", noSurat: "003/HRD/I/2024", keterangan: "Surat Cuti Tahunan" },
  { id: "4", noSurat: "004/HRD/I/2024", keterangan: "Surat Izin Bekerja" },
  { id: "5", noSurat: "005/HRD/I/2024", keterangan: "Surat Kontrak Kerja" },
  { id: "6", noSurat: "006/HRD/I/2024", keterangan: "Surat Penugasan" },
  { id: "7", noSurat: "007/HRD/I/2024", keterangan: "Surat Mutasi Karyawan" },
  { id: "8", noSurat: "008/HRD/I/2024", keterangan: "Surat Rekomendasi" },
];

const MonitoringNoSuratDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<NoSuratItem[]>(initialData);
  const [showEntries, setShowEntries] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<NoSuratItem>>({});
  const [itemToDelete, setItemToDelete] = useState<NoSuratItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // New state for file

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.noSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keterangan.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const pagedData = useMemo(() => {
    return filteredData.slice(0, showEntries);
  }, [filteredData, showEntries]);

  const handleAddClick = () => {
    setIsEditMode(false);
    setFormData({});
    setErrors({});
    setIsModalOpen(true);
    setSelectedFile(null); // Clear selected file
  };

  const handleEditClick = (item: NoSuratItem) => {
    setIsEditMode(true);
    setFormData(item);
    setErrors({});
    setIsModalOpen(true);
    setSelectedFile(null); // Clear selected file
  };

  const handleDeleteClick = (item: NoSuratItem) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(data.filter((item) => item.id !== itemToDelete.id));
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "documentUpload" && files && files.length > 0) {
      setSelectedFile(files[0]);
      setFormData((prev) => ({
        ...prev,
        documentPath: `/Folder/${files[0].name}`,
      })); // Simulate path
    } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.noSurat?.trim()) newErrors.noSurat = "No. Surat harus diisi";
    if (!formData.keterangan?.trim())
      newErrors.keterangan = "Keterangan harus diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isEditMode) {
      setData(
        data.map((item) =>
          item.id === formData.id ? (formData as NoSuratItem) : item
        )
      );
    } else {
      const newId = (
        data.length > 0
          ? Math.max(...data.map((item) => parseInt(item.id))) + 1
          : 1
      ).toString();
      setData([...data, { ...formData, id: newId } as NoSuratItem]);
    }
    setIsModalOpen(false);
    setFormData({});
    setErrors({});
    setSelectedFile(null); // Clear selected file on submit
  };

  const handleCloseModal = () => {
    setFormData({});
    setErrors({});
    setIsModalOpen(false);
    setSelectedFile(null); // Clear selected file on close
  };

  const handleExport = (type: string) => {
    alert(`Exporting ${type} (dummy)`);
  };

  const handleRefresh = () => {
    setData([...initialData]);
    setSearchTerm("");
  };

  const handleDownloadDocument = (documentPath: string) => {
    // In a real application, this would trigger a download of the file
    alert(`Downloading document from: ${documentPath}`);
    window.open(documentPath, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MONITORING NO. SURAT
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  HRD
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Monitoring
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">
                  Monitoring No. Surat
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pencarian
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari No. Surat atau Keterangan..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm flex items-center justify-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Table controls */}
          <div className="p-0 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                className="border border-gray-300 rounded-md px-2 py-1"
                value={showEntries}
                onChange={(e) => setShowEntries(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 text-xs"
                onClick={handleAddClick}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Tambah</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg shadow-sm hover:bg-gray-700 text-xs"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 text-xs"
                onClick={() => handleExport("Excel")}
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 text-xs"
                onClick={() => handleExport("CSV")}
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 text-xs"
                onClick={() => handleExport("PDF")}
              >
                <FileText className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Surat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keterangan
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dokumen
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.noSurat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.keterangan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {item.documentPath ? (
                        <button
                          onClick={() =>
                            handleDownloadDocument(item.documentPath!)
                          }
                          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg p-2 transition-all duration-200"
                          title="Unduh Dokumen"
                        >
                          <Download className="h-4 w-4" />
                          <span>Unduh</span>
                        </button>
                      ) : (
                        <span className="text-gray-500">Tidak Ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer: simple pagination placeholder */}
          <div className="p-4 flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing 1 to {Math.min(filteredData.length, showEntries)} of{" "}
              {filteredData.length} entries
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 border border-primary bg-primary text-white rounded-md">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditMode ? "Edit No. Surat" : "Tambah No. Surat Baru"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
              <form onSubmit={handleModalSubmit} className="p-6">
                <div className="space-y-6">
                  {/* No. Surat */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. Surat <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="noSurat"
                      value={formData.noSurat || ""}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.noSurat
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                      placeholder="Contoh: 001/HRD/I/2024"
                    />
                    {errors.noSurat && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.noSurat}
                      </p>
                    )}
                  </div>

                  {/* Keterangan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keterangan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="keterangan"
                      value={formData.keterangan || ""}
                      onChange={handleFormChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                        errors.keterangan
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                      placeholder="Masukkan keterangan surat..."
                    />
                    {errors.keterangan && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.keterangan}
                      </p>
                    )}
                  </div>

                  {/* Document Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dokumen (PDF)
                    </label>
                    <input
                      type="file"
                      name="documentUpload"
                      accept=".pdf"
                      onChange={handleFormChange}
                      className="w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                      "
                    />
                    {formData.documentPath && !selectedFile && (
                      <p className="mt-2 text-sm text-gray-500">
                        Dokumen saat ini:
                        <a
                          href={formData.documentPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-1"
                        >
                          {formData.documentPath.split("/").pop()}
                        </a>
                      </p>
                    )}
                    {selectedFile && (
                      <p className="mt-2 text-sm text-gray-500">
                        File dipilih: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isEditMode ? "Simpan Perubahan" : "Tambah"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && itemToDelete && (
        <ConfirmDeleteModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          itemName={itemToDelete.noSurat}
        />
      )}
    </div>
  );
};

export default MonitoringNoSuratDashboard;
