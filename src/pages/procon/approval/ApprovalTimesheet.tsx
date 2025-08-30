import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Check } from 'lucide-react';

// Mock Data for Timesheet Pegawai
interface TimesheetPegawai {
  id: string;
  name: string;
  mob: string;
  demob: string;
  project: string;
  client: string;
  jamKerja: string;
  jamKerjaValue: number; // Storing as number for easier manipulation
  tuntifikasi: 'Approve' | 'Reject';
  status: 'Approve' | 'Pending' | 'Rejected';
}

const mockPegawaiData: TimesheetPegawai[] = [
  { id: 'P001', name: 'Ahmad', mob: '01-01-2025', demob: '05-01-2025', project: 'Proyek Jembatan A Bail', client: 'Client A', jamKerja: '08:00 - 17:00', jamKerjaValue: 500000, tuntifikasi: 'Approve', status: 'Approve' },
  { id: 'P002', name: 'Budi', mob: '01-01-2025', demob: '06-01-2025', project: 'Proyek Jembatan A Bail', client: 'Client B', jamKerja: '07:00 - 15:00', jamKerjaValue: 300000, tuntifikasi: 'Approve', status: 'Pending' },
  { id: 'P003', name: 'Candra', mob: '01-01-2025', demob: '07-01-2025', project: 'Proyek Kenstruksi Sepinters', client: 'Client C', jamKerja: '09:00 - 17:00', jamKerjaValue: 400000, tuntifikasi: 'Reject', status: 'Rejected' },
  { id: 'P004', name: 'Dedi', mob: '01-01-2025', demob: '05-01-2025', project: 'Proyek Jembatan A Welder', client: 'Client D', jamKerja: '08:00 - 17:00', jamKerjaValue: 400000, tuntifikasi: 'Reject', status: 'Pending' },
];

// Mock Data for Timesheet Barang
interface TimesheetBarangItem {
  id: string;
  kodeBarang?: string;
  namaBarang: string;
  qty: string;
  estimasiCost: number;
  actualOty: string;
  actualCost: number;
  approved: boolean;
  isCategory?: boolean;
}

const mockBarangData: TimesheetBarangItem[] = [
  { id: 'B001', isCategory: true, namaBarang: 'Kogng Utama', qty: '', estimasiCost: 0, actualOty: '', actualCost: 0, approved: false },
  { id: 'B002', kodeBarang: 'CR001', namaBarang: 'Crane', qty: '5 pcs', estimasiCost: 125000000, actualOty: '5 pcs', actualCost: 155000, approved: false },
  { id: 'B003', kodeBarang: 'CR002', namaBarang: 'Excavator', qty: '3 pcs', estimasiCost: 30000000, actualOty: '90 pcs', actualCost: 1500000, approved: false },
  { id: 'B004', isCategory: true, namaBarang: 'Barang Penduku', qty: '', estimasiCost: 0, actualOty: '', actualCost: 0, approved: false },
  { id: 'B005', kodeBarang: 'SH001', namaBarang: 'Safety Helmet', qty: '10 pcs', estimasiCost: 1500000, actualOty: '30 pcs', actualCost: 3000000, approved: false },
  { id: 'B006', isCategory: true, namaBarang: 'Barang Lainnya', qty: '', estimasiCost: 0, actualOty: '', actualCost: 0, approved: false },
  { id: 'B007', kodeBarang: 'GN005', namaBarang: 'Generator', qty: '15 pcs', estimasiCost: 2000000, actualOty: '40 pcs', actualCost: 4000000, approved: false },
  { id: 'B008', kodeBarang: 'WM006', namaBarang: 'Welding Machine', qty: '2 pcs', estimasiCost: 30000000, actualOty: '40 pcs', actualCost: 4000000, approved: false },
  { id: 'B009', kodeBarang: 'WM007', namaBarang: 'Welding Machine', qty: '4 pcs', estimasiCost: 40000000, actualOty: '40 pcs', actualCost: 4000000, approved: false },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const ApprovalTimesheet: React.FC = () => {
  const [pegawaiData, setPegawaiData] = useState<TimesheetPegawai[]>(mockPegawaiData);
  const [barangData, setBarangData] = useState<TimesheetBarangItem[]>(mockBarangData);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Filtered Pegawai Data
  const filteredPegawaiData = useMemo(() => {
    let filtered = pegawaiData;
    if (searchTerm) {
      filtered = filtered.filter(pegawai =>
        pegawai.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pegawai.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pegawai.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== 'All') {
      filtered = filtered.filter(pegawai => pegawai.status === filterStatus);
    }
    return filtered;
  }, [pegawaiData, searchTerm, filterStatus]);

  // Filtered Barang Data (assuming search/filter applies to both sections)
  const filteredBarangData = useMemo(() => {
    let filtered = barangData;
    if (searchTerm) {
      filtered = filtered.filter(barang =>
        barang.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (barang.kodeBarang && barang.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    // No status filter for barang as per image, but can be added if needed
    return filtered;
  }, [barangData, searchTerm]);

  const handleApproveAllPegawai = () => {
    setPegawaiData(prev => prev.map(p => ({ ...p, status: 'Approve' })));
    alert('All Pegawai Timesheets Approved!');
  };

  const handleRejectAllPegawai = () => {
    setPegawaiData(prev => prev.map(p => ({ ...p, status: 'Rejected' })));
    alert('All Pegawai Timesheets Rejected!');
  };

  const handleApproveAllBarang = () => {
    setBarangData(prev => prev.map(b => (b.isCategory ? b : { ...b, approved: true })));
    alert('All Barang Timesheets Approved!');
  };

  const handleRejectAllBarang = () => {
    setBarangData(prev => prev.map(b => (b.isCategory ? b : { ...b, approved: false })));
    alert('All Barang Timesheets Rejected!');
  };

  const handleBarangCheckboxChange = (id: string) => {
    setBarangData(prev =>
      prev.map(b => (b.id === id ? { ...b, approved: !b.approved } : b))
    );
  };

  const handleClose = () => {
    alert('Close button clicked!');
    // In a real application, this would navigate away or close a modal
  };

  const handleApproveAllGlobal = () => {
    handleApproveAllPegawai();
    handleApproveAllBarang();
    alert('All Timesheets (Pegawai & Barang) Approved!');
  };

  const handleRejectAllGlobal = () => {
    handleRejectAllPegawai();
    handleRejectAllBarang();
    alert('All Timesheets (Pegawai & Barang) Rejected!');
  };

  return (
    <div className="min-h-screen bg-background text-text p-6 flex items-center justify-center">
      <div className="bg-surface rounded-xl shadow-2xl p-8 w-full max-w-6xl relative border border-border animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-border mb-6">
          <h1 className="text-3xl font-extrabold text-text flex items-center gap-3">
            Approval Timesheet Pegawai & Barang
          </h1>
          <button
            onClick={handleClose}
            className="text-textSecondary hover:text-accent transition-colors duration-200 p-2 rounded-full hover:bg-primary/10"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
            <input
              type="text"
              placeholder="Search by Name, Project, or Client..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text placeholder-textSecondary transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
            <select
              className="w-full md:w-48 pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text placeholder-textSecondary appearance-none cursor-pointer transition-all duration-200"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Approve">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-textSecondary">
              &#9662; {/* Dropdown arrow */}
            </span>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">MOB</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">DEMOB</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">Project</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">Jam Kerja</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">Jam Kerja</th> {/* Assuming this is the monetary value */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">Tuntifikasi</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warning uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {filteredPegawaiData.length > 0 ? (
                  filteredPegawaiData.map((pegawai) => (
                    <tr key={pegawai.id} className="hover:bg-background/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{pegawai.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{pegawai.mob}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{pegawai.demob}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{pegawai.project}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{pegawai.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{pegawai.jamKerja}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{formatCurrency(pegawai.jamKerjaValue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{pegawai.tuntifikasi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pegawai.status === 'Approve' ? 'bg-success/20 text-success' :
                          pegawai.status === 'Pending' ? 'bg-warning/20 text-warning' :
                          'bg-error/20 text-error'
                        }`}>
                          {pegawai.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-textSecondary">No matching pegawai timesheets found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-3">
              <button
                onClick={handleApproveAllPegawai}
                className="px-5 py-2 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                Approve All Pegawai
              </button>
              <button
                onClick={handleRejectAllPegawai}
                className="px-5 py-2 bg-error hover:bg-error/80 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                Reject All Pegawai
              </button>
            </div>
            <button
              onClick={handleApproveAllPegawai}
              className="px-5 py-2 bg-success hover:bg-success/80 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Approve All Pegawai
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">QTY</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Estimasi Cost</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actual OTY</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Actual Cost</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Approve</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {filteredBarangData.length > 0 ? (
                  filteredBarangData.map((barang) => (
                    <tr key={barang.id} className={`hover:bg-background/50 transition-colors duration-150 ${barang.isCategory ? 'bg-primary/10 font-semibold text-primary' : ''}`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${barang.isCategory ? 'col-span-full' : 'text-textSecondary'}`}>
                        {barang.isCategory ? (
                          <span className="text-primary font-bold">{barang.namaBarang}</span>
                        ) : (
                          barang.kodeBarang
                        )}
                      </td>
                      {!barang.isCategory && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text">{barang.namaBarang}</td>
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
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-textSecondary">No matching barang timesheets found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-3">
              <button
                onClick={handleApproveAllBarang}
                className="px-5 py-2 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                Approve All Barang
              </button>
              <button
                onClick={handleRejectAllBarang}
                className="px-5 py-2 bg-error hover:bg-error/80 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                Reject All Barang
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleApproveAllBarang}
                className="px-5 py-2 bg-success hover:bg-success/80 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                Approve All
              </button>
              <button
                onClick={handleRejectAllBarang}
                className="px-5 py-2 bg-error hover:bg-error/80 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                Reject All
              </button>
            </div>
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
          <div className="flex gap-3">
            <button
              onClick={handleApproveAllGlobal}
              className="px-6 py-2 bg-success hover:bg-success/80 text-white font-semibold rounded-lg shadow-md flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <Check size={20} /> Approve All
            </button>
            <button
              onClick={handleRejectAllGlobal}
              className="px-6 py-2 bg-error hover:bg-error/80 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Reject All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalTimesheet;
