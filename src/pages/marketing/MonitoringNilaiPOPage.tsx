import React, { useState, useMemo } from "react";
import { Search, Pencil, Trash2, PlusCircle, Upload, X, FileText } from "lucide-react";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";


interface POItem {
  id: string;
  so: string;
  project: string;
  pekerjaan: string;
  siteLokasi: string;
  noWbs: string; // Changed from noUbs to noWbs
  wo: string; // Renamed from noWbsWo
  pr: string;
  ro: string;
  poSap: string; // Combined PO and SAP
  cro: string;
  tanggalRelease: string;
  commencementStartDate: string;
  commencementFinishDate: string;
  jumlahNilaiSO?: string;
  absorv?: string; // Will be calculated automatically
  pengembalianNilaiKontrak?: string;
  reminder?: string;
  poAttachment?: {
    fileName: string;
    fileSize: string;
    uploadDate: string;
  };
}

const initialData: POItem[] = [
  {
    id: "1",
    so: "SO-001",
    project: "Project A",
    pekerjaan: "Pekerjaan 1",
    siteLokasi: "Jakarta",
    noWbs: "WBS-001",
    wo: "WO-001",
    pr: "PR-001",
    ro: "RO-001",
    poSap: "PO-001 / SAP-001",
    cro: "CRO-001",
    tanggalRelease: "2022-12-15",
    commencementStartDate: "2023-01-01",
    commencementFinishDate: "2024-12-31",
    jumlahNilaiSO: "Rp 1.800.000.000",
    absorv: "Rp 2.500.000.000",
    pengembalianNilaiKontrak: "Rp 15.000.000",
    reminder: "-",
  },
  {
    id: "2",
    so: "SO-002",
    project: "Project B",
    pekerjaan: "Pekerjaan 2",
    siteLokasi: "Surabaya",
    noWbs: "WBS-002",
    wo: "WO-002",
    pr: "PR-002",
    ro: "RO-002",
    poSap: "PO-002 / SAP-002",
    cro: "CRO-002",
    tanggalRelease: "2023-03-20",
    commencementStartDate: "2023-04-01",
    commencementFinishDate: "2024-06-30",
    jumlahNilaiSO: "Rp 2.300.000.000",
    absorv: "Rp 2.500.000.000",
    pengembalianNilaiKontrak: "Rp 8.000.000",
    reminder: "-",
  },
  {
    id: "3",
    so: "SO-003",
    project: "Project C",
    pekerjaan: "Pekerjaan 3",
    siteLokasi: "Bandung",
    noWbs: "WBS-003",
    wo: "WO-003",
    pr: "PR-003",
    ro: "RO-003",
    poSap: "PO-003 / SAP-003",
    cro: "CRO-003",
    tanggalRelease: "2023-06-10",
    commencementStartDate: "2023-07-01",
    commencementFinishDate: "2024-09-30",
    jumlahNilaiSO: "Rp 1.950.000.000",
    absorv: "Rp 2.500.000.000",
    pengembalianNilaiKontrak: "Rp 20.000.000",
    reminder: "-",
  },
  {
    id: "4",
    so: "SO-004",
    project: "Project D",
    pekerjaan: "Pekerjaan 4",
    siteLokasi: "Semarang",
    noWbs: "WBS-004",
    wo: "WO-004",
    pr: "PR-004",
    ro: "RO-004",
    poSap: "PO-004 / SAP-004",
    cro: "CRO-004",
    tanggalRelease: "2023-09-15",
    commencementStartDate: "2023-10-01",
    commencementFinishDate: "2024-03-31",
    jumlahNilaiSO: "Rp 1.650.000.000",
    absorv: "Rp 1.800.000.000",
    pengembalianNilaiKontrak: "Rp 8.000.000",
    reminder: "Upcoming",
  },
  {
    id: "5",
    so: "SO-005",
    project: "Project E",
    pekerjaan: "Pekerjaan 5",
    siteLokasi: "Yogyakarta",
    noWbs: "WBS-005",
    wo: "WO-005",
    pr: "PR-005",
    ro: "RO-005",
    poSap: "PO-005 / SAP-005",
    cro: "CRO-005",
    tanggalRelease: "2023-12-20",
    commencementStartDate: "2024-01-01",
    commencementFinishDate: "2024-03-31",
    jumlahNilaiSO: "Rp 2.100.000.000",
    absorv: "Rp 3.200.000.000",
    pengembalianNilaiKontrak: "Rp 7.500.000",
    reminder: "Due in 5 days",
  },
];
const MonitoringNilaiPOPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<POItem[]>(initialData);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPO, setCurrentPO] = useState<Partial<POItem>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [poToDelete, setPoToDelete] = useState<POItem | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);


  // Function to calculate reminder based on commencement finish date
  const calculateReminder = (commencementFinishDate: string): string => {
    if (!commencementFinishDate) return "No date set";

    const finishDate = new Date(commencementFinishDate);
    const currentDate = new Date();
    const timeDiff = finishDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return `Overdue by ${Math.abs(daysDiff)} days`;
    } else if (daysDiff === 0) {
      return "Due today";
    } else if (daysDiff <= 30) {
      return `Due in ${daysDiff} days`;
    } else {
      return "On schedule";
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.so.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pekerjaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.poSap.toLowerCase().includes(searchTerm.toLowerCase()) // Updated filter for combined PO/SAP
    );
  }, [data, searchTerm]);

  const handleAddPO = () => {
    setIsEditing(false);
    setCurrentPO({});
    setUploadedFile(null);
    setShowAddEditModal(true);
  };

  const handleEditPO = (item: POItem) => {
    setIsEditing(true);
    setCurrentPO(item);
    setUploadedFile(null);
    setShowAddEditModal(true);
  };

  const handleDeletePO = (item: POItem) => {
    setPoToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (poToDelete) {
      setData(data.filter((item) => item.id !== poToDelete.id));
      setShowDeleteConfirm(false);
      setPoToDelete(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Format file tidak didukung. Harap upload PDF, DOC, DOCX, XLS, XLSX, JPG, atau PNG.');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 10MB.');
        return;
      }
      
      setUploadedFile(file);
      
      // Create attachment info
      const fileSize = (file.size / 1024).toFixed(2) + ' KB';
      if (file.size > 1024 * 1024) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        setCurrentPO({
          ...currentPO,
          poAttachment: {
            fileName: file.name,
            fileSize: fileSizeMB,
            uploadDate: new Date().toISOString().split('T')[0]
          }
        });
      } else {
        setCurrentPO({
          ...currentPO,
          poAttachment: {
            fileName: file.name,
            fileSize: fileSize,
            uploadDate: new Date().toISOString().split('T')[0]
          }
        });
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setCurrentPO({
      ...currentPO,
      poAttachment: undefined
    });
  };

  const handleSavePO = () => {
    if (
      !currentPO.so ||
      !currentPO.project ||
      !currentPO.pekerjaan ||
      !currentPO.poSap
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isEditing) {
      setData(
        data.map((item) =>
          item.id === currentPO.id ? (currentPO as POItem) : item
        )
      );
    } else {
      const newPO: POItem = {
        id: Date.now().toString(),
        so: currentPO.so,
        project: currentPO.project,
        pekerjaan: currentPO.pekerjaan,
        siteLokasi: currentPO.siteLokasi || "",
        noWbs: currentPO.noWbs || "",
        wo: currentPO.wo || "",
        pr: currentPO.pr || "",
        ro: currentPO.ro || "",
        poSap: currentPO.poSap,
        cro: currentPO.cro || "",
        tanggalRelease: currentPO.tanggalRelease || "",
        commencementStartDate: currentPO.commencementStartDate || "",
        commencementFinishDate: currentPO.commencementFinishDate || "",
        jumlahNilaiSO: currentPO.jumlahNilaiSO || "",
        absorv: currentPO.absorv || "",
        pengembalianNilaiKontrak: currentPO.pengembalianNilaiKontrak || "",
        poAttachment: currentPO.poAttachment,
      };
      setData([...data, newPO]);
    }
    setShowAddEditModal(false);
    setUploadedFile(null);
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Monitoring Nilai PO
      </h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari PO..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddPO}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah PO
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pekerjaan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SITE/Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. WBS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  WO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PO SAP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CRO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Release
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Commencement Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Nilai SO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absorv
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengembalian Nilai Kontrak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reminder
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Finish
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.so}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.pekerjaan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.siteLokasi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.noWbs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.wo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.pr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.ro}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.poSap}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.cro}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.tanggalRelease}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.commencementStartDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.commencementFinishDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">
                    {item.jumlahNilaiSO || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">
                    {item.absorv || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.pengembalianNilaiKontrak}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.reminder ||
                      calculateReminder(item.commencementFinishDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPO(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePO(item)}
                        className="text-red-600 hover:text-red-900"
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
      </div>

      {/* Add/Edit Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit PO" : "Tambah PO Baru"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nomor SO
                </label>
                <input
                  type="text"
                  value={currentPO.so || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, so: e.target.value })
                  }
                  placeholder="Masukkan nomor SO (contoh: SO-001)"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project
                </label>
                <input
                  type="text"
                  value={currentPO.project || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, project: e.target.value })
                  }
                  placeholder="Masukkan nama project"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pekerjaan
                </label>
                <input
                  type="text"
                  value={currentPO.pekerjaan || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, pekerjaan: e.target.value })
                  }
                  placeholder="Masukkan jenis pekerjaan"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SITE/Lokasi
                </label>
                <input
                  type="text"
                  value={currentPO.siteLokasi || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, siteLokasi: e.target.value })
                  }
                  placeholder="Masukkan lokasi site (contoh: Jakarta)"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  No. WBS
                </label>
                <input
                  type="text"
                  value={currentPO.noWbs || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, noWbs: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  WO
                </label>
                <input
                  type="text"
                  value={currentPO.wo || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, wo: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  PR
                </label>
                <input
                  type="text"
                  value={currentPO.pr || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, pr: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  RO
                </label>
                <input
                  type="text"
                  value={currentPO.ro || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, ro: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  PO SAP
                </label>
                <input
                  type="text"
                  value={currentPO.poSap || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, poSap: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CRO
                </label>
                <input
                  type="text"
                  value={currentPO.cro || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, cro: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal Release
                </label>
                <input
                  type="date"
                  value={currentPO.tanggalRelease || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, tanggalRelease: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Commencement Start Date
                </label>
                <input
                  type="date"
                  value={currentPO.commencementStartDate || ""}
                  onChange={(e) =>
                    setCurrentPO({
                      ...currentPO,
                      commencementStartDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Commencement Finish Date
                </label>
                <input
                  type="date"
                  value={currentPO.commencementFinishDate || ""}
                  onChange={(e) =>
                    setCurrentPO({
                      ...currentPO,
                      commencementFinishDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jumlah Nilai SO
                </label>
                <input
                  type="text"
                  value={currentPO.jumlahNilaiSO || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, jumlahNilaiSO: e.target.value })
                  }
                  placeholder="Contoh: Rp 1.800.000.000"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Absorv
                </label>
                <input
                  type="text"
                  value={currentPO.absorv || ""}
                  onChange={(e) =>
                    setCurrentPO({ ...currentPO, absorv: e.target.value })
                  }
                  placeholder="Contoh: Rp 2.500.000.000"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pengembalian Nilai Kontrak
                </label>
                <input
                  type="text"
                  value={currentPO.pengembalianNilaiKontrak || ""}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                  readOnly
                />
              </div>
              
              {/* Upload PO Attachment */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PO / Attachment
                </label>
                
                {!uploadedFile && !currentPO.poAttachment ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      id="po-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="po-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 mb-1">
                        Klik untuk upload atau drag & drop
                      </span>
                      <span className="text-xs text-gray-500">
                        PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {uploadedFile?.name || currentPO.poAttachment?.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {uploadedFile
                              ? `${(uploadedFile.size / 1024).toFixed(2)} KB`
                              : currentPO.poAttachment?.fileSize}
                            {currentPO.poAttachment?.uploadDate && (
                              <span> • Uploaded: {currentPO.poAttachment.uploadDate}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  * Upload dokumen PO untuk referensi dan dokumentasi
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddEditModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleSavePO}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditing ? "Simpan Perubahan" : "Tambah PO"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && poToDelete && (
        <ConfirmDeleteModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          itemName={poToDelete.poSap}
        />
      )}
    </div>
  );
};

export default MonitoringNilaiPOPage;
