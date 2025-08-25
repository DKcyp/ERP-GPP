import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CalendarDays, Clock, Save, FileUp } from 'lucide-react';

interface EntryStockOpnameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BarangItem {
  id: number;
  kodeBarang: string;
  namaBarang: string;
  stokTercatat: number | '';
  stokSebenarnya: number | '';
  selisih: number | '';
  keterangan: string;
}

const EntryStockOpnameModal: React.FC<EntryStockOpnameModalProps> = ({ isOpen, onClose }) => {
  const [periodeTahun, setPeriodeTahun] = useState('2025');
  const [periodeBulan, setPeriodeBulan] = useState('Januari');
  const [tanggalOpname, setTanggalOpname] = useState('');
  const [waktuOpname, setWaktuOpname] = useState('');
  const [gudang, setGudang] = useState('Gudang Proyek A');
  const [keterangan, setKeterangan] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [barangItems, setBarangItems] = useState<BarangItem[]>([]);
  const [nextItemId, setNextItemId] = useState(1);

  useEffect(() => {
    if (isOpen) {
      // Set current time when modal opens
      const now = new Date();
      setWaktuOpname(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      // Reset other fields if needed, or load existing data
      setBarangItems([]); // Start with an empty list of items
      setNextItemId(1);
    }
  }, [isOpen]);

  const handleAddBarang = () => {
    setBarangItems([...barangItems, {
      id: nextItemId,
      kodeBarang: '',
      namaBarang: '',
      stokTercatat: '',
      stokSebenarnya: '',
      selisih: '',
      keterangan: ''
    }]);
    setNextItemId(nextItemId + 1);
  };

  const handleRemoveBarang = (id: number) => {
    setBarangItems(barangItems.filter(item => item.id !== id));
  };

  const handleBarangChange = (id: number, field: keyof BarangItem, value: any) => {
    setBarangItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'stokTercatat' || field === 'stokSebenarnya') {
            const tercatat = typeof updatedItem.stokTercatat === 'number' ? updatedItem.stokTercatat : parseFloat(String(updatedItem.stokTercatat));
            const sebenarnya = typeof updatedItem.stokSebenarnya === 'number' ? updatedItem.stokSebenarnya : parseFloat(String(updatedItem.stokSebenarnya));
            if (!isNaN(tercatat) && !isNaN(sebenarnya)) {
              updatedItem.selisih = sebenarnya - tercatat;
            } else {
              updatedItem.selisih = '';
            }
          }
          // Dummy logic for namaBarang based on kodeBarang
          if (field === 'kodeBarang') {
            updatedItem.namaBarang = value === 'KB001' ? 'Barang A' : value === 'KB002' ? 'Barang B' : '';
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSave = () => {
    console.log({
      periodeTahun,
      periodeBulan,
      tanggalOpname,
      waktuOpname,
      gudang,
      keterangan,
      file,
      barangItems,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Entry Stock Opname</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="periodeTahun" className="block text-sm font-medium text-gray-700 mb-1">Periode Tahun</label>
              <select
                id="periodeTahun"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={periodeTahun}
                onChange={(e) => setPeriodeTahun(e.target.value)}
              >
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            <div>
              <label htmlFor="periodeBulan" className="block text-sm font-medium text-gray-700 mb-1">Periode Bulan</label>
              <select
                id="periodeBulan"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={periodeBulan}
                onChange={(e) => setPeriodeBulan(e.target.value)}
              >
                <option>Januari</option>
                <option>Februari</option>
                <option>Maret</option>
                <option>April</option>
                <option>Mei</option>
                <option>Juni</option>
                <option>Juli</option>
                <option>Agustus</option>
                <option>September</option>
                <option>Oktober</option>
                <option>November</option>
                <option>Desember</option>
              </select>
            </div>
            <div className="relative">
              <label htmlFor="tanggalOpname" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Opname</label>
              <input
                type="date"
                id="tanggalOpname"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={tanggalOpname}
                onChange={(e) => setTanggalOpname(e.target.value)}
              />
              <CalendarDays className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div className="relative">
              <label htmlFor="waktuOpname" className="block text-sm font-medium text-gray-700 mb-1">Waktu Opname</label>
              <input
                type="text"
                id="waktuOpname"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full bg-gray-50 cursor-not-allowed"
                value={waktuOpname}
                readOnly
              />
              <Clock className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div>
              <label htmlFor="gudang" className="block text-sm font-medium text-gray-700 mb-1">Gudang</label>
              <select
                id="gudang"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={gudang}
                onChange={(e) => setGudang(e.target.value)}
              >
                <option>Gudang Proyek A</option>
                <option>Gudang Proyek B</option>
                <option>Gudang Proyek C</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-1">
              <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <textarea
                id="keterangan"
                rows={3}
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Import Section */}
          <div className="mt-6">
            <label htmlFor="importFile" className="block text-sm font-medium text-gray-700 mb-2">Import Data Stok Opname</label>
            <div className="flex items-center space-x-3">
              <label htmlFor="importFile" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm flex items-center space-x-2 shadow-md">
                <FileUp className="h-4 w-4" />
                <span>Choose File</span>
              </label>
              <input
                type="file"
                id="importFile"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-gray-600 text-sm">{file ? file.name : 'No file chosen'}</span>
            </div>
          </div>

          {/* Barang Items Table */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Barang</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Tercatat</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Sebenarnya</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selisih</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {barangItems.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <select
                          className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                          value={item.kodeBarang}
                          onChange={(e) => handleBarangChange(item.id, 'kodeBarang', e.target.value)}
                        >
                          <option value="">Pilih Kode Barang</option>
                          <option value="KB001">KB001</option>
                          <option value="KB002">KB002</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg px-2 py-1 w-full bg-gray-50 cursor-not-allowed"
                          value={item.namaBarang}
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="number"
                          className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                          value={item.stokTercatat}
                          onChange={(e) => handleBarangChange(item.id, 'stokTercatat', parseFloat(e.target.value) || '')}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            className="border border-gray-300 rounded-lg px-2 py-1 w-2/3"
                            value={item.stokSebenarnya}
                            onChange={(e) => handleBarangChange(item.id, 'stokSebenarnya', parseFloat(e.target.value) || '')}
                          />
                          <select className="border border-gray-300 rounded-lg px-1 py-1 w-1/3">
                            <option>Pcs</option>
                            <option>Kg</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg px-2 py-1 w-full bg-gray-50 cursor-not-allowed"
                          value={item.selisih}
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                          value={item.keterangan}
                          onChange={(e) => handleBarangChange(item.id, 'keterangan', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveBarang(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleAddBarang}
              className="mt-4 flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Barang</span>
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors duration-200 text-sm shadow-md"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm shadow-md flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Simpan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryStockOpnameModal;
