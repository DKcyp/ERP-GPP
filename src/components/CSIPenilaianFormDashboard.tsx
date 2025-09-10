import React, { useState } from "react";
import { Save, Send } from "lucide-react";

interface FormValues {
  customer: string;
  proyek: string;
  tanggal: string; // YYYY-MM-DD
  penilai: string;
  q1: number; // 1-5
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  catatan: string;
}

const CSIPenilaianFormDashboard: React.FC = () => {
  const [values, setValues] = useState<FormValues>({
    customer: "",
    proyek: "",
    tanggal: "",
    penilai: "",
    q1: 3,
    q2: 3,
    q3: 3,
    q4: 3,
    q5: 3,
    catatan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: name.startsWith("q") ? Number(value) : value }));
  };

  const totalSkor = values.q1 + values.q2 + values.q3 + values.q4 + values.q5;
  const skorPersen = Math.round((totalSkor / (5 * 5)) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit to API
    alert("Form penilaian berhasil disimpan (mock)");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Penilaian Kepuasan Pelanggan (CSI)</h1>
          <p className="text-sm text-gray-600">Isi kuesioner berikut untuk menilai kepuasan pelanggan pada proyek terkait.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identitas */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Identitas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <input
                  type="text"
                  name="customer"
                  value={values.customer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Nama Customer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Proyek</label>
                <input
                  type="text"
                  name="proyek"
                  value={values.proyek}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Nama Proyek"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                <input
                  type="date"
                  name="tanggal"
                  value={values.tanggal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Penilai</label>
                <input
                  type="text"
                  name="penilai"
                  value={values.penilai}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Nama Penilai"
                />
              </div>
            </div>
          </div>

          {/* Penilaian */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Penilaian</h2>
            <div className="space-y-4">
              {[
                { key: "q1", label: "Kualitas Pekerjaan" },
                { key: "q2", label: "Ketepatan Waktu" },
                { key: "q3", label: "Komunikasi & Respons" },
                { key: "q4", label: "Kepatuhan K3/QHSE" },
                { key: "q5", label: "Harga & Nilai" },
              ].map((q) => (
                <div key={q.key} className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                  <label className="text-sm text-gray-800">{q.label}</label>
                  <select
                    name={q.key}
                    value={(values as any)[q.key]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  >
                    <option value={1}>1 - Sangat Tidak Puas</option>
                    <option value={2}>2 - Tidak Puas</option>
                    <option value={3}>3 - Cukup</option>
                    <option value={4}>4 - Puas</option>
                    <option value={5}>5 - Sangat Puas</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 border rounded text-sm text-gray-700">
              Total Skor: <span className="font-semibold">{totalSkor}</span> | Indeks CSI: <span className="font-semibold">{skorPersen}%</span>
            </div>
          </div>

          {/* Catatan */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Catatan</h2>
            <textarea
              name="catatan"
              value={values.catatan}
              onChange={handleChange}
              className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              placeholder="Masukkan masukan/perbaikan dari pelanggan"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button type="button" className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm flex items-center gap-2">
              <Save className="h-4 w-4" /> Simpan Draft
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center gap-2">
              <Send className="h-4 w-4" /> Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CSIPenilaianFormDashboard;
