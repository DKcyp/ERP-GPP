import React, { useMemo, useState, useEffect } from "react";
import termsPdf from "../../Folder/term&condition.pdf";
import { FileSpreadsheet, FileText, Plus, Search, ChevronLeft, ChevronRight, Clock, Info, X } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface Customer {
  id: string;
  namaPerusahaan: string;
  alamat: string;
  pic: string;
  email: string;
  noTelp: string;
  keterangan?: string;
  npwp?: string;
  nik?: string;
  passport?: string;
  npwpFileName?: string; // stored as file name for preview/logging
  nikFileName?: string;
  passportFileName?: string;
}

const mockData: Customer[] = [
  {
    id: "1",
    namaPerusahaan: "PT Maju Jaya",
    alamat: "Jl. Merdeka No. 10, Jakarta Pusat",
    pic: "Budi Santoso",
    email: "contact@majujaya.co.id",
    noTelp: "021-555-1234",
    keterangan: "Existing client",
  },
  {
    id: "2",
    namaPerusahaan: "CV Sejahtera Abadi",
    alamat: "Jl. Melati No. 2, Bogor",
    pic: "Sari Purnama",
    email: "admin@sejahteraabadi.id",
    noTelp: "0251-888-7766",
    keterangan: "Prospective",
  },
];

const MasterDataCustomerDashboard: React.FC = () => {
  // Data state
  const [data, setData] = useState<Customer[]>(mockData);

  // Filters & UI state (match Penawaran On Call structure)
  const [searchNama, setSearchNama] = useState("");
  const [searchPIC, setSearchPIC] = useState("");
  const [searchAlamat, setSearchAlamat] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [animateRows, setAnimateRows] = useState(false);

  // Add/Edit modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<Omit<Customer, "id">>({
    namaPerusahaan: "",
    alamat: "",
    pic: "",
    email: "",
    noTelp: "",
    keterangan: "",
    npwp: "",
    nik: "",
    passport: "",
    npwpFileName: "",
    nikFileName: "",
    passportFileName: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Customer, "id">, string>>>({});

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimateRows(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const termNama = searchNama.toLowerCase();
    const termPIC = searchPIC.toLowerCase();
    const termAlamat = searchAlamat.toLowerCase();
    return data.filter(
      (c) =>
        c.namaPerusahaan.toLowerCase().includes(termNama) &&
        c.pic.toLowerCase().includes(termPIC) &&
        c.alamat.toLowerCase().includes(termAlamat)
    );
  }, [searchNama, searchPIC, searchAlamat, data]);

  // derive pagination later to avoid duplicate declarations

  const handleExportCSV = () => {
    const headers = ["Nama Perusahaan", "Alamat", "PIC", "Email", "No. Telp", "Keterangan"]; 
    const rows = filtered.map((c) => [c.namaPerusahaan, c.alamat, c.pic, c.email, c.noTelp, c.keterangan ?? ""]);
    const csv = [headers, ...rows].map((r) => r.map((x) => `"${(x || "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "master_data_customer.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const link = document.createElement("a");
    link.href = termsPdf;
    link.setAttribute("download", "term&condition.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSearch = () => {
    setPage(1);
  };

  // Add/Edit/Delete Handlers
  const openAddModal = () => {
    setEditing(null);
    setForm({ namaPerusahaan: "", alamat: "", pic: "", email: "", noTelp: "", keterangan: "", npwp: "", nik: "", passport: "", npwpFileName: "", nikFileName: "", passportFileName: "" });
    setErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (c: Customer) => {
    setEditing(c);
    setForm({
      namaPerusahaan: c.namaPerusahaan,
      alamat: c.alamat,
      pic: c.pic,
      email: c.email,
      noTelp: c.noTelp,
      keterangan: c.keterangan || "",
      npwp: c.npwp || "",
      nik: c.nik || "",
      passport: c.passport || "",
      npwpFileName: c.npwpFileName || "",
      nikFileName: c.nikFileName || "",
      passportFileName: c.passportFileName || "",
    });
    setErrors({});
    setShowFormModal(true);
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof Omit<Customer, "id">, string>> = {};
    if (!form.namaPerusahaan.trim()) e.namaPerusahaan = "Nama perusahaan wajib diisi";
    if (!form.alamat.trim()) e.alamat = "Alamat wajib diisi";
    if (!form.pic.trim()) e.pic = "PIC wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    if (!form.noTelp.trim()) e.noTelp = "No. Telp wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      // update
      setData((prev) => prev.map((c) => (c.id === editing.id ? { ...editing, ...form } : c)));
    } else {
      // add
      const newId = String(Math.floor(100000 + Math.random() * 900000));
      const newItem: Customer = { id: newId, ...form } as Customer;
      setData((prev) => [newItem, ...prev]);
    }
    setShowFormModal(false);
    setEditing(null);
  };

  const askDelete = (c: Customer) => {
    setDeleteTarget(c);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setData((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
    setShowDeleteModal(false);
  };

  // Derived for pagination bar (match layout from Penawaran On Call)
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentData = filtered.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-sm">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-wide mb-1">
                MASTER DATA CUSTOMER
              </h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Master</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Master Data Customer</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-10 -mt-10"></div>

          {/* Filters grid (aligned to Penawaran On Call) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Cari Nama Perusahaan */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari Nama Perusahaan</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNama}
                  onChange={(e) => setSearchNama(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan nama perusahaan..."
                />
              </div>
            </div>

            {/* Cari PIC */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari PIC</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchPIC}
                  onChange={(e) => setSearchPIC(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan nama PIC..."
                />
              </div>
            </div>

            {/* Cari Alamat */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">Cari Alamat</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchAlamat}
                  onChange={(e) => setSearchAlamat(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Masukkan alamat..."
                />
              </div>
            </div>

            {/* Cari Button */}
            <div className="space-y-2 flex items-end">
              <button
                onClick={handleSearch}
                className="w-full h-[38px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 flex items-center justify-center space-x-2 text-sm"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button 
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Customer</span>
            </button>
            <button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export Excel</span>
            </button>
            <button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-2 text-sm">
              <FileText className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Nama Perusahaan</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Alamat</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">PIC</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No. Telp</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((c, index) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ 
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-1.5 w-1.5 bg-blue-500 rounded-full flex-shrink-0">
                          <Info className="h-1.5 w-1.5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{startIndex + index + 1}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900">{c.namaPerusahaan}</td>
                    <td className="px-3 py-2 text-gray-600">{c.alamat}</td>
                    <td className="px-3 py-2 text-gray-600">{c.pic}</td>
                    <td className="px-3 py-2 text-gray-600">{c.email}</td>
                    <td className="px-3 py-2 text-gray-600">{c.noTelp}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <button className="text-yellow-700 hover:underline" onClick={() => openEditModal(c)}>View</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-blue-700 hover:underline" onClick={() => openEditModal(c)}>Edit</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-red-700 hover:underline" onClick={() => askDelete(c)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                      page === p
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-gray-700 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showFormModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.currentTarget === e.target) setShowFormModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Customer' : 'Tambah Customer'}</h3>
              <button onClick={() => setShowFormModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto text-sm">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Nama Perusahaan <span className="text-red-500">*</span></label>
                <input value={form.namaPerusahaan} onChange={(e)=>{ setForm(f=>({...f,namaPerusahaan:e.target.value})); if(errors.namaPerusahaan) setErrors(prev=>({...prev,namaPerusahaan:undefined})); }} className={`w-full px-3 py-2 border rounded-lg ${errors.namaPerusahaan ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Masukkan nama perusahaan" />
                {errors.namaPerusahaan && <p className="text-xs text-red-600 mt-1">{errors.namaPerusahaan}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Alamat <span className="text-red-500">*</span></label>
                <textarea value={form.alamat} onChange={(e)=>{ setForm(f=>({...f,alamat:e.target.value})); if(errors.alamat) setErrors(prev=>({...prev,alamat:undefined})); }} rows={3} className={`w-full px-3 py-2 border rounded-lg ${errors.alamat ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Masukkan alamat" />
                {errors.alamat && <p className="text-xs text-red-600 mt-1">{errors.alamat}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">PIC <span className="text-red-500">*</span></label>
                  <input value={form.pic} onChange={(e)=>{ setForm(f=>({...f,pic:e.target.value})); if(errors.pic) setErrors(prev=>({...prev,pic:undefined})); }} className={`w-full px-3 py-2 border rounded-lg ${errors.pic ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="Masukkan PIC" />
                  {errors.pic && <p className="text-xs text-red-600 mt-1">{errors.pic}</p>}
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" value={form.email} onChange={(e)=>{ setForm(f=>({...f,email:e.target.value})); if(errors.email) setErrors(prev=>({...prev,email:undefined})); }} className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="nama@perusahaan.com" />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">No. Telp <span className="text-red-500">*</span></label>
                  <input value={form.noTelp} onChange={(e)=>{ setForm(f=>({...f,noTelp:e.target.value})); if(errors.noTelp) setErrors(prev=>({...prev,noTelp:undefined})); }} className={`w-full px-3 py-2 border rounded-lg ${errors.noTelp ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} placeholder="08xx / 021xxxx" />
                  {errors.noTelp && <p className="text-xs text-red-600 mt-1">{errors.noTelp}</p>}
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Keterangan</label>
                  <input value={form.keterangan || ""} onChange={(e)=> setForm(f=>({...f,keterangan:e.target.value}))} className="w-full px-3 py-2 border rounded-lg border-gray-200" placeholder="Opsional" />
                </div>
              </div>

              {/* NPWP / NIK / Passport */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">NPWP</label>
                  <input value={form.npwp || ""} onChange={(e)=> setForm(f=>({...f,npwp:e.target.value}))} className="w-full px-3 py-2 border rounded-lg border-gray-200" placeholder="Masukkan NPWP" />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Upload NPWP</label>
                  <input type="file" accept="image/*,.pdf" onChange={(e)=> setForm(f=>({...f, npwpFileName: e.target.files && e.target.files[0] ? e.target.files[0].name : ""}))} className="w-full px-3 py-2 border rounded-lg border-gray-200" />
                  {form.npwpFileName && <p className="text-[11px] text-gray-500 mt-1">File: {form.npwpFileName}</p>}
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">NIK</label>
                  <input value={form.nik || ""} onChange={(e)=> setForm(f=>({...f,nik:e.target.value}))} className="w-full px-3 py-2 border rounded-lg border-gray-200" placeholder="Masukkan NIK" />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Upload NIK</label>
                  <input type="file" accept="image/*,.pdf" onChange={(e)=> setForm(f=>({...f, nikFileName: e.target.files && e.target.files[0] ? e.target.files[0].name : ""}))} className="w-full px-3 py-2 border rounded-lg border-gray-200" />
                  {form.nikFileName && <p className="text-[11px] text-gray-500 mt-1">File: {form.nikFileName}</p>}
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Passport</label>
                  <input value={form.passport || ""} onChange={(e)=> setForm(f=>({...f,passport:e.target.value}))} className="w-full px-3 py-2 border rounded-lg border-gray-200" placeholder="Masukkan Passport" />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Upload Passport</label>
                  <input type="file" accept="image/*,.pdf" onChange={(e)=> setForm(f=>({...f, passportFileName: e.target.files && e.target.files[0] ? e.target.files[0].name : ""}))} className="w-full px-3 py-2 border rounded-lg border-gray-200" />
                  {form.passportFileName && <p className="text-[11px] text-gray-500 mt-1">File: {form.passportFileName}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-3 border-t border-gray-200 bg-gray-50">
              <button onClick={()=>{ setShowFormModal(false); setEditing(null); }} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Batal</button>
              <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus Customer"
        message="Apakah Anda yakin ingin menghapus data customer ini?"
        itemName={deleteTarget ? `${deleteTarget.namaPerusahaan} (${deleteTarget.pic})` : undefined}
      />
    </div>
  );
};

export default MasterDataCustomerDashboard;
