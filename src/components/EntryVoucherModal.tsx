import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, Calendar, UploadCloud } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// Ensure that the app element is set for accessibility
Modal.setAppElement('#root'); // Assuming your root element has id="root"

interface EntryVoucherModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

// Sample employee data with account numbers
const employeeData = [
  { name: "Andi Pratama", accountNumber: "1234567890" },
  { name: "Siti Nurhaliza", accountNumber: "2345678901" },
  { name: "Rudi Hermawan", accountNumber: "3456789012" },
  { name: "Maya Sari", accountNumber: "4567890123" },
  { name: "Budi Santoso", accountNumber: "5678901234" },
];

const EntryVoucherModal: React.FC<EntryVoucherModalProps> = ({ isOpen, onRequestClose }) => {
  const [noVoucher, setNoVoucher] = useState('');
  const [kodeAkun, setKodeAkun] = useState('');
  const [noSO, setNoSO] = useState('');
  const [namaAkun, setNamaAkun] = useState('');
  const [noSOTurunan, setNoSOTurunan] = useState('');
  const [kodeBiaya, setKodeBiaya] = useState('');
  const [tanggalMulaiVoucher, setTanggalMulaiVoucher] = useState<Date | null>(null);
  const [namaBiaya, setNamaBiaya] = useState('');
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [namaPenerima, setNamaPenerima] = useState('');
  const [noRekening, setNoRekening] = useState('');
  const [isKaryawan, setIsKaryawan] = useState(false);

  // Handler for Nama Penerima change to auto-fill account number if employee
  const handleNamaPenerimaChange = (value: string, isEmployeeSelected: boolean = false) => {
    setNamaPenerima(value);
    if (isEmployeeSelected) {
      const employee = employeeData.find(emp => emp.name === value);
      if (employee) {
        setNoRekening(employee.accountNumber);
      }
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setAttachment(event.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachment(event.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      noVoucher, kodeAkun, noSO, namaAkun, noSOTurunan, kodeBiaya,
      tanggalMulaiVoucher, namaBiaya, nominal, keterangan, attachment,
      namaPenerima, noRekening, isKaryawan
    });
    // Add logic to save data
    onRequestClose(); // Close modal after submission
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const selectClass = "w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none";

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Entry Voucher</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="noVoucher" className={labelClass}>No Voucher</label>
              <input
                type="text"
                id="noVoucher"
                className={inputClass}
                value={noVoucher}
                onChange={(e) => setNoVoucher(e.target.value)}
                placeholder="No Voucher"
              />
            </div>
            <div>
              <label htmlFor="noSO" className={labelClass}>No SO</label>
              <select
                id="noSO"
                className={selectClass}
                value={noSO}
                onChange={(e) => setNoSO(e.target.value)}
              >
                <option value="">Pilih No SO</option>
                <option value="SO12345">SO12345</option>
                <option value="SO12346">SO12346</option>
              </select>
            </div>
            <div>
              <label htmlFor="noSOTurunan" className={labelClass}>No SO Turunan</label>
              <select
                id="noSOTurunan"
                className={selectClass}
                value={noSOTurunan}
                onChange={(e) => setNoSOTurunan(e.target.value)}
              >
                <option value="">Pilih No SO Turunan</option>
                <option value="SOT001">SOT001</option>
                <option value="SOT002">SOT002</option>
              </select>
            </div>
            <div>
              <label htmlFor="tanggalMulaiVoucher" className={labelClass}>Tanggal Mulai Voucher</label>
              <div className="relative">
                <DatePicker
                  id="tanggalMulaiVoucher"
                  selected={tanggalMulaiVoucher}
                  onChange={(date: Date | null) => setTanggalMulaiVoucher(date)}
                  dateFormat="dd/MM/yyyy"
                  className={inputClass}
                  placeholderText="dd/mm/yyyy"
                  calendarClassName="shadow-lg rounded-lg"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="nominal" className={labelClass}>Nominal</label>
              <input
                type="text"
                id="nominal"
                className={inputClass}
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="Nominal"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label htmlFor="kodeAkun" className={labelClass}>Kode Akun</label>
              <select
                id="kodeAkun"
                className={selectClass}
                value={kodeAkun}
                onChange={(e) => setKodeAkun(e.target.value)}
              >
                <option value="">Pilih Kode Akun</option>
                <option value="KA001">KA001</option>
                <option value="KA002">KA002</option>
              </select>
            </div>
            <div>
              <label htmlFor="namaAkun" className={labelClass}>Nama Akun</label>
              <input
                type="text"
                id="namaAkun"
                className={inputClass}
                value={namaAkun}
                onChange={(e) => setNamaAkun(e.target.value)}
                placeholder="Nama Akun"
                readOnly // Assuming this is auto-filled
              />
            </div>
            <div>
              <label htmlFor="kodeBiaya" className={labelClass}>Kode Biaya</label>
              <select
                id="kodeBiaya"
                className={selectClass}
                value={kodeBiaya}
                onChange={(e) => setKodeBiaya(e.target.value)}
              >
                <option value="">Pilih Kode Biaya</option>
                <option value="KB001">KB001</option>
                <option value="KB002">KB002</option>
              </select>
            </div>
            <div>
              <label htmlFor="namaBiaya" className={labelClass}>Nama Biaya</label>
              <input
                type="text"
                id="namaBiaya"
                className={inputClass}
                value={namaBiaya}
                onChange={(e) => setNamaBiaya(e.target.value)}
                placeholder="Nama Biaya"
                readOnly // Assuming this is auto-filled
              />
            </div>
            <div>
              <label htmlFor="keterangan" className={labelClass}>Keterangan</label>
              <textarea
                id="keterangan"
                className={twMerge(inputClass, "min-h-[100px] resize-y")}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Keterangan"
              ></textarea>
            </div>
          </div>

          {/* Additional Fields - Full Width */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div>
              <label className={labelClass}>Tipe Penerima</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipePenerima"
                    value="karyawan"
                    checked={isKaryawan}
                    onChange={() => {
                      setIsKaryawan(true);
                      setNamaPenerima('');
                      setNoRekening('');
                    }}
                    className="mr-2"
                  />
                  Karyawan
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipePenerima"
                    value="lainnya"
                    checked={!isKaryawan}
                    onChange={() => {
                      setIsKaryawan(false);
                      setNamaPenerima('');
                      setNoRekening('');
                    }}
                    className="mr-2"
                  />
                  Lainnya
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="namaPenerima" className={labelClass}>Nama Penerima</label>
              {isKaryawan ? (
                <select
                  id="namaPenerima"
                  className={selectClass}
                  value={namaPenerima}
                  onChange={(e) => handleNamaPenerimaChange(e.target.value, true)}
                >
                  <option value="">Pilih Karyawan</option>
                  {employeeData.map((emp) => (
                    <option key={emp.name} value={emp.name}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="namaPenerima"
                  className={inputClass}
                  value={namaPenerima}
                  onChange={(e) => handleNamaPenerimaChange(e.target.value, false)}
                  placeholder="Masukkan nama penerima"
                />
              )}
            </div>
            <div>
              <label htmlFor="noRekening" className={labelClass}>No. Rekening</label>
              <input
                type="text"
                id="noRekening"
                className={inputClass}
                value={noRekening}
                onChange={(e) => setNoRekening(e.target.value)}
                placeholder={isKaryawan ? 'Otomatis terisi saat pilih karyawan' : 'Masukkan nomor rekening'}
                readOnly={isKaryawan && namaPenerima !== ''}
              />
            </div>
          </div>

          {/* Attachment Section - Full Width */}
          <div className="md:col-span-2 mt-4">
            <label className={labelClass}>Attachment</label>
            <div
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-600">Drag & Drop your files or <span className="text-blue-600 font-medium">Browse</span></p>
              {attachment && <p className="text-sm text-gray-500 mt-2">File selected: {attachment.name}</p>}
              <input
                id="file-upload-input"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end mt-8">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EntryVoucherModal;
