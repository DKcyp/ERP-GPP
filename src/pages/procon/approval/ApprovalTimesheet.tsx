import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Check, CalendarDays } from 'lucide-react';

// --- NEW: Interface for Sales Order (Main Page) ---
interface SalesOrder {
  id: string;
  noSo: string;
  noSoTurunan: string;
  tanggalMob: string;
  tanggalDemob: string;
  namaProject: string; // Added for detail view
  client: string; // Added for detail view
}

// --- NEW: Mock Data for Sales Orders (Main Page) ---
const mockSoData: SalesOrder[] = [
  { id: 'SO001', noSo: 'SO-2025-001', noSoTurunan: 'SO-T-001A', tanggalMob: '01-01-2025', tanggalDemob: '05-01-2025', namaProject: 'Proyek Jembatan A Bail', client: 'Client A' },
  { id: 'SO002', noSo: 'SO-2025-002', noSoTurunan: 'SO-T-002B', tanggalMob: '03-01-2025', tanggalDemob: '08-01-2025', namaProject: 'Proyek Konstruksi Sepinters', client: 'Client B' },
  { id: 'SO003', noSo: 'SO-2025-003', noSoTurunan: 'SO-T-003C', tanggalMob: '05-01-2025', tanggalDemob: '10-01-2025', namaProject: 'Proyek Pembangunan Gedung', client: 'Client C' },
  { id: 'SO004', noSo: 'SO-2025-004', noSoTurunan: 'SO-T-004D', tanggalMob: '07-01-2025', tanggalDemob: '12-01-2025', namaProject: 'Proyek Jembatan A Welder', client: 'Client D' },
];

// --- UPDATED: Interface for Timesheet Pegawai (Detail Page) ---
interface TimesheetPegawai {
  id: string;
  name: string;
  akumulasiJamKerja: string; // New column
  tunjangan: number; // New column
  estimasiCost: number; // New column
  approved: boolean; // New checkbox column
}

// --- UPDATED: Mock Data for Timesheet Pegawai (Detail Page) ---
const mockPegawaiData: TimesheetPegawai[] = [
  { id: 'P001', name: 'Ahmad', akumulasiJamKerja: '160 Jam', tunjangan: 1500000, estimasiCost: 5000000, approved: false },
  { id: 'P002', name: 'Budi', akumulasiJamKerja: '150 Jam', tunjangan: 1200000, estimasiCost: 4500000, approved: false },
  { id: 'P003', name: 'Candra', akumulasiJamKerja: '170 Jam', tunjangan: 1800000, estimasiCost: 5500000, approved: false },
  { id: 'P004', name: 'Dedi', akumulasiJamKerja: '140 Jam', tunjangan: 1000000, estimasiCost: 4000000, approved: false },
];

// --- UPDATED: Interface for Timesheet Barang (Detail Page) ---
interface TimesheetBarangItem {
  id: string;
  kodeBarang?: string;
  namaBarang: string;
  unitCost?: number; // New column
  qty: string;
  estimasiCost: number;
  actualOty: string;
  actualCost: number;
  approved: boolean;
  isCategory?: boolean;
}

// --- UPDATED: Mock Data for Timesheet Barang (Detail Page) ---
const mockBarangData: TimesheetBarangItem[] = [
  { id: 'B001', isCategory: true, namaBarang: 'Barang Utama', qty: '', estimasiCost: 0, actualOty: '', actualCost: 0, approved: false },
  { id: 'B002', kodeBarang: 'CR001', namaBarang: 'Crane', unitCost: 25000000, qty: '5 pcs', estimasiCost: 125000000, actualOty: '5 pcs', actualCost: 155000000, approved: false },
  { id: 'B003', kodeBarang: 'EX001', namaBarang: 'Excavator', unitCost: 10000000, qty: '3 pcs', estimasiCost: 30000000, actualOty: '3 pcs', actualCost: 35000000, approved: false },
  { id: 'B004', isCategory: true, namaBarang: 'Barang Pendukung', qty: '', estimasiCost: 0, actualOty: '', actualCost: 0, approved: false },
  { id: 'B005', kodeBarang: 'SH001', namaBarang: 'Safety Helmet', unitCost: 150000, qty: '10 pcs', estimasiCost: 1500000, actualOty: '10 pcs', actualCost: 1800000, approved: false },
  { id: 'B006', isCategory: true, namaBarang: 'Barang Lainnya', qty: '', estimasiCost: 0, actualOty: '', actualCost: 0, approved: false },
  { id: 'B007', kodeBarang: 'GN005', namaBarang: 'Generator', unitCost: 200000, qty: '15 pcs', estimasiCost: 3000000, actualOty: '15 pcs', actualCost: 3200000, approved: false },
  { id: 'B008', kodeBarang: 'WM006', namaBarang: 'Welding Machine', unitCost: 3000000, qty: '2 pcs', estimasiCost: 6000000, actualOty: '2 pcs', actualCost: 6500000, approved: false },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const ApprovalTimesheet: React.FC = () => {
  const [selectedSo, setSelectedSo] = useState<SalesOrder | null>(null); // State to manage main vs detail view

  // --- Main Page States ---
  const [soData, setSoData] = useState<SalesOrder[]>(mockSoData);
  const [soSearchTerm, setSoSearchTerm] = useState<string>('');
  const [mobDateFilter, setMobDateFilter] = useState<string>('');
  const [demobDateFilter, setDemobDateFilter] = useState<string>('');

  // --- Detail Page States ---
  const [pegawaiData, setPegawaiData] = useState<TimesheetPegawai[]>(mockPegawaiData);
  const [barangData, setBarangData] = useState<TimesheetBarangItem[]>(mockBarangData);

  // Filtered SO Data for Main Page
  const filteredSoData = useMemo(() => {
    let filtered = soData;
    if (soSearchTerm) {
      filtered = filtered.filter(so =>
        so.noSo.toLowerCase().includes(soSearchTerm.toLowerCase()) ||
        so.noSoTurunan.toLowerCase().includes(soSearchTerm.toLowerCase())
      );
    }
    if (mobDateFilter) {
      filtered = filtered.filter(so => so.tanggalMob === mobDateFilter); // Simple string match for mock
    }
    if (demobDateFilter) {
      filtered = filtered.filter(so => so.tanggalDemob === demobDateFilter); // Simple string match for mock
    }
    return filtered;
  }, [soData, soSearchTerm, mobDateFilter, demobDateFilter]);

  // Handlers for Detail Page
  const handlePegawaiCheckboxChange = (id: string) => {
    setPegawaiData(prev =>
      prev.map(p => (p.id === id ? { ...p, approved: !p.approved } : p))
    );
  };

  const handleApproveAllPegawai = () => {
    setPegawaiData(prev => prev.map(p => ({ ...p, approved: true })));
    alert('All Pegawai Timesheets Approved!');
  };

  const handleBarangCheckboxChange = (id: string) => {
    setBarangData(prev =>
      prev.map(b => (b.id === id ? { ...b, approved: !b.approved } : b))
    );
  };

  const handleApproveAllBarang = () => {
    setBarangData(prev => prev.map(b => (b.isCategory ? b : { ...b, approved: true })));
    alert('All Barang Timesheets Approved!');
  };

  const handleSimpan = () => {
    alert('Data Timesheet berhasil disimpan!');
    // In a real application, this would send data to the backend
    setSelectedSo(null); // Go back to main page after saving
  };

  const handleClose = () => {
    alert('Close button clicked!');
    setSelectedSo(null); // Go back to main page
  };

  if (!selectedSo) {
    // --- Main Page View ---
    return (
      <div className="min-h-screen bg-background text-text p-6 flex items-center justify-center">
        <div className="bg-surface rounded-xl shadow-2xl p-8 w-full max-w-6xl relative border border-border animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center pb-6 border-b border-border mb-6">
            <h1 className="text-3xl font-extrabold text-text flex items-center gap-3">
              Approval Timesheet
            </h1>
            <button
              onClick={handleClose}
              className="text-textSecondary hover:text-accent transition-colors duration-200 p-2 rounded-full hover:bg-primary/10"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Filters for Main Page */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
              <input
                type="text"
                placeholder="Search by No SO or No SO Turunan..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text placeholder-textSecondary transition-all duration-200"
                value={soSearchTerm}
                onChange={(e) => setSoSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
              <input
                type="text" // Using text for simplicity, could be type="date"
                placeholder="Periode MOB (DD-MM-YYYY)"
                className="w-full md:w-48 pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text placeholder-textSecondary transition-all duration-200"
                value={mobDateFilter}
                onChange={(e) => setMobDateFilter(e.target.value)}
              />
            </div>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
              <input
                type="text" // Using text for simplicity, could be type="date"
                placeholder="Periode DEMOB (DD-MM-YYYY)"
                className="w-full md:w-48 pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text placeholder-textSecondary transition-all duration-200"
                value={demobDateFilter}
                onChange={(e) => setDemobDateFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Main Page Table: List of Sales Orders */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-text mb-4">Daftar Sales Order</h2>
            <div className="overflow-x-auto rounded-lg border border-border shadow-md">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-primary/20">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">No SO</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">No SO Turunan</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Tanggal MOB</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Tanggal DMOB</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {filteredSoData.length > 0 ? (
                    filteredSoData.map((so) => (
                      <tr key={so.id} className="hover:bg-background/50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{so.noSo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{so.noSoTurunan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{so.tanggalMob}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{so.tanggalDemob}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedSo(so)}
                            className="px-4 py-2 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-textSecondary">No matching Sales Orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Detail Approval Page View ---
  return (
    <div className="min-h-screen bg-background text-text p-6 flex items-center justify-center">
      <div className="bg-surface rounded-xl shadow-2xl p-8 w-full max-w-6xl relative border border-border animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-border mb-6">
          <h1 className="text-3xl font-extrabold text-text flex items-center gap-3">
            Detail Approval Timesheet
          </h1>
          <button
            onClick={handleClose}
            className="text-textSecondary hover:text-accent transition-colors duration-200 p-2 rounded-full hover:bg-primary/10"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Detail Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 p-4 bg-background rounded-lg border border-border">
          <div>
            <p className="text-textSecondary text-sm">No SO:</p>
            <p className="text-text font-medium">{selectedSo.noSo}</p>
          </div>
          <div>
            <p className="text-textSecondary text-sm">SO Turunan:</p>
            <p className="text-text font-medium">{selectedSo.noSoTurunan}</p>
          </div>
          <div>
            <p className="text-textSecondary text-sm">Nama Project:</p>
            <p className="text-text font-medium">{selectedSo.namaProject}</p>
          </div>
          <div>
            <p className="text-textSecondary text-sm">Client:</p>
            <p className="text-text font-medium">{selectedSo.client}</p>
          </div>
          <div>
            <p className="text-textSecondary text-sm">Tanggal MOB:</p>
            <p className="text-text font-medium">{selectedSo.tanggalMob}</p>
          </div>
          <div>
            <p className="text-textSecondary text-sm">Tanggal DMOB:</p>
            <p className="text-text font-medium">{selectedSo.tanggalDemob}</p>
          </div>
        </div>

        {/* Timesheet Pegawai Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-text mb-4">Timesheet Pegawai</h2>
          <div className="overflow-x-auto rounded-lg border border-border shadow-md">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-warning/20">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">Nama</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">Akumulasi Jam Kerja</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">Tunjangan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">Estimasi Cost</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">Approve</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {pegawaiData.length > 0 ? (
                  pegawaiData.map((pegawai) => (
                    <tr key={pegawai.id} className="hover:bg-background/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{pegawai.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{pegawai.akumulasiJamKerja}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{formatCurrency(pegawai.tunjangan)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{formatCurrency(pegawai.estimasiCost)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-primary rounded border-border bg-background focus:ring-primary cursor-pointer"
                          checked={pegawai.approved}
                          onChange={() => handlePegawaiCheckboxChange(pegawai.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-textSecondary">No pegawai timesheets found for this SO.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center mt-6">
            <button
              onClick={handleApproveAllPegawai}
              className="px-5 py-2 bg-success hover:bg-success/80 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Approve
            </button>
          </div>
        </div>

        {/* Timesheet Barang Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-text mb-4">Timesheet Barang</h2>
          <div className="overflow-x-auto rounded-lg border border-border shadow-md">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary/20">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Kode Barang</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Nama Barang</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Unit Cost</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">QTY</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Estimasi Cost</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actual QTY</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actual Cost</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Approve</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {barangData.length > 0 ? (
                  barangData.map((barang) => (
                    <tr key={barang.id} className={`hover:bg-background/50 transition-colors duration-150 ${barang.isCategory ? 'bg-primary/10 font-semibold text-primary' : ''}`}>
                      {barang.isCategory ? (
                        <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
                          {barang.namaBarang}
                        </td>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{barang.kodeBarang}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text">{barang.namaBarang}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{formatCurrency(barang.unitCost || 0)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{barang.qty}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{formatCurrency(barang.estimasiCost)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{barang.actualOty}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{formatCurrency(barang.actualCost)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-primary rounded border-border bg-background focus:ring-primary cursor-pointer"
                              checked={barang.approved}
                              onChange={() => handleBarangCheckboxChange(barang.id)}
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-textSecondary">No barang timesheets found for this SO.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center mt-6">
            <button
              onClick={handleApproveAllBarang}
              className="px-5 py-2 bg-success hover:bg-success/80 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Approve
            </button>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-border mt-6">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-textSecondary/20 hover:bg-textSecondary/30 text-text font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
          >
            Close
          </button>
          <button
            onClick={handleSimpan}
            className="px-6 py-2 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg shadow-md flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
          >
            <Check size={20} /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalTimesheet;
