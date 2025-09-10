import React, { useState } from "react";
import { CalendarDays, Plus, Edit, Trash2, Save, Loader2 } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface CutiBersamaEntry {
  id: string;
  no: number;
  tanggal: string; // YYYY-MM-DD
  keterangan: string;
}

interface JadwalTahunanEntry {
  id: string;
  no: number;
  tanggalMulai: string; // YYYY-MM-DD
  tanggalSelesai: string; // YYYY-MM-DD
  judul: string;
  keterangan?: string;
}

const CalendarAbsensiDashboard: React.FC = () => {
  // Cuti Bersama (Input Awal Tahun)
  const [cutiBersama, setCutiBersama] = useState<CutiBersamaEntry[]>([{
    id: "1", no: 1, tanggal: `${new Date().getFullYear()}-01-02`, keterangan: "Cuti Bersama Tahun Baru"
  }]);
  const [cbTanggal, setCbTanggal] = useState("");
  const [cbKet, setCbKet] = useState("");
  const [cbSaving, setCbSaving] = useState(false);

  // Adjustment Cuti Berjalan
  const [adjTanggal, setAdjTanggal] = useState("");
  const [adjKet, setAdjKet] = useState("");
  const [adjSaving, setAdjSaving] = useState(false);

  // Jadwal Tahunan SaVa Group
  const [jadwal, setJadwal] = useState<JadwalTahunanEntry[]>([
    { id: "1", no: 1, tanggalMulai: `${new Date().getFullYear()}-03-10`, tanggalSelesai: `${new Date().getFullYear()}-03-12`, judul: "Raker SaVa Group", keterangan: "Rapat kerja tahunan" }
  ]);
  const [jdMulai, setJdMulai] = useState("");
  const [jdSelesai, setJdSelesai] = useState("");
  const [jdJudul, setJdJudul] = useState("");
  const [jdKet, setJdKet] = useState("");
  const [jdSaving, setJdSaving] = useState(false);

  // Delete modal (shared)
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ type: "cuti" | "jadwal"; id: string; name: string } | null>(null);

  const handleAddCuti = async () => {
    if (!cbTanggal) return;
    setCbSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setCutiBersama(prev => [{ id: (prev.length + 1).toString(), no: 1, tanggal: cbTanggal, keterangan: cbKet || "-" }, ...prev.map(x => ({ ...x, no: x.no + 1 }))]);
    setCbTanggal(""); setCbKet(""); setCbSaving(false);
  };

  const handleAdjCuti = async () => {
    if (!adjTanggal) return;
    setAdjSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setCutiBersama(prev => prev.map(x => x.tanggal === adjTanggal ? { ...x, keterangan: adjKet || x.keterangan } : x));
    setAdjTanggal(""); setAdjKet(""); setAdjSaving(false);
  };

  const handleAddJadwal = async () => {
    if (!jdMulai || !jdSelesai || !jdJudul) return;
    setJdSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setJadwal(prev => [{ id: (prev.length + 1).toString(), no: 1, tanggalMulai: jdMulai, tanggalSelesai: jdSelesai, judul: jdJudul, keterangan: jdKet || "-" }, ...prev.map(x => ({ ...x, no: x.no + 1 }))]);
    setJdMulai(""); setJdSelesai(""); setJdJudul(""); setJdKet(""); setJdSaving(false);
  };

  const requestDelete = (type: "cuti" | "jadwal", id: string, name: string) => {
    setDeleteItem({ type, id, name }); setDeleteOpen(true);
  };
  const confirmDelete = () => {
    if (!deleteItem) return;
    if (deleteItem.type === "cuti") {
      setCutiBersama(prev => prev.filter(x => x.id !== deleteItem.id).map((x, i) => ({ ...x, no: i + 1 })));
    } else {
      setJadwal(prev => prev.filter(x => x.id !== deleteItem.id).map((x, i) => ({ ...x, no: i + 1 })));
    }
    setDeleteOpen(false); setDeleteItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <CalendarDays className="h-7 w-7 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Kalender Absensi</h1>
        </div>

        {/* Input Cuti Bersama Awal Tahun */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Input Cuti Bersama (Awal Tahun)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
              <input type="date" value={cbTanggal} onChange={(e) => setCbTanggal(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
              <input type="text" value={cbKet} onChange={(e) => setCbKet(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contoh: Cuti Bersama Idul Fitri" />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button onClick={handleAddCuti} disabled={cbSaving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                {cbSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan
              </button>
            </div>
          </div>

          {/* Tabel Cuti Bersama */}
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cutiBersama.map((x) => (
                  <tr key={x.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{x.no}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{x.tanggal}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{x.keterangan}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setAdjTanggal(x.tanggal); setAdjKet(x.keterangan); }} className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => requestDelete("cuti", x.id, x.keterangan)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Adjustment Cuti Bersama Berjalan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Adjustment Cuti Bersama (Berjalan)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
              <input type="date" value={adjTanggal} onChange={(e) => setAdjTanggal(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
              <input type="text" value={adjKet} onChange={(e) => setAdjKet(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Perbarui keterangan apabila dibutuhkan" />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button onClick={handleAdjCuti} disabled={adjSaving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                {adjSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Perubahan
              </button>
            </div>
          </div>
        </div>

        {/* Jadwal Tahunan SaVa Group */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule Tahunan SaVa Group</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
              <input type="date" value={jdMulai} onChange={(e) => setJdMulai(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
              <input type="date" value={jdSelesai} onChange={(e) => setJdSelesai(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
              <input type="text" value={jdJudul} onChange={(e) => setJdJudul(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Contoh: Raker Tahunan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
              <input type="text" value={jdKet} onChange={(e) => setJdKet(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Opsional" />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button onClick={handleAddJadwal} disabled={jdSaving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                {jdSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Tambah Jadwal
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mulai</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selesai</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jadwal.map((x) => (
                  <tr key={x.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{x.no}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{x.tanggalMulai}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{x.tanggalSelesai}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{x.judul}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{x.keterangan || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setJdMulai(x.tanggalMulai); setJdSelesai(x.tanggalSelesai); setJdJudul(x.judul); setJdKet(x.keterangan || ""); }} className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => requestDelete("jadwal", x.id, x.judul)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Hapus */}
      <ConfirmDeleteModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} itemName={deleteItem?.name} />
    </div>
  );
};

export default CalendarAbsensiDashboard;
