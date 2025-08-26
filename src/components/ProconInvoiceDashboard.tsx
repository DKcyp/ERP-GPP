import React, { useState, useEffect } from 'react';
import { Clock, PlusCircle, Edit, Trash2, Save, ReceiptText } from 'lucide-react'; // Changed FileInvoice to ReceiptText

interface Invoice {
  id: number;
  noInvoice: string;
  project: string;
  soTurunan: string;
  nominal: string;
  status: 'Pending' | 'Paid' | 'Draft';
}

interface Project {
  id: string;
  name: string;
  soTurunan: { id: string; name: string; nominal: number }[];
}

const dummyProjects: Project[] = [
  {
    id: 'P001',
    name: 'Proyek Pembangunan Gedung A',
    soTurunan: [
      { id: 'SO-A-001', name: 'Pekerjaan Pondasi', nominal: 150000000 },
      { id: 'SO-A-002', name: 'Pekerjaan Struktur', nominal: 300000000 },
      { id: 'SO-A-003', name: 'Pekerjaan Finishing', nominal: 200000000 },
    ],
  },
  {
    id: 'P002',
    name: 'Proyek Renovasi Kantor B',
    soTurunan: [
      { id: 'SO-B-001', name: 'Pembongkaran', nominal: 50000000 },
      { id: 'SO-B-002', name: 'Instalasi Listrik', nominal: 80000000 },
      { id: 'SO-B-003', name: 'Pengecatan', nominal: 60000000 },
    ],
  },
  {
    id: 'P003',
    name: 'Proyek Infrastruktur C',
    soTurunan: [
      { id: 'SO-C-001', name: 'Penggalian Tanah', nominal: 100000000 },
      { id: 'SO-C-002', name: 'Pemasangan Pipa', nominal: 250000000 },
    ],
  },
];

const ProconInvoiceDashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 1, noInvoice: 'INV-2024001', project: 'Proyek Pembangunan Gedung A', soTurunan: 'Pekerjaan Pondasi', nominal: 'Rp 150.000.000', status: 'Pending' },
    { id: 2, noInvoice: 'INV-2024002', project: 'Proyek Renovasi Kantor B', soTurunan: 'Pembongkaran', nominal: 'Rp 50.000.000', status: 'Paid' },
    { id: 3, noInvoice: 'INV-2024003', project: 'Proyek Pembangunan Gedung A', soTurunan: 'Pekerjaan Struktur', nominal: 'Rp 300.000.000', status: 'Draft' },
    { id: 4, noInvoice: 'INV-2024004', project: 'Proyek Infrastruktur C', soTurunan: 'Penggalian Tanah', nominal: 'Rp 100.000.000', status: 'Pending' },
    { id: 5, noInvoice: 'INV-2024005', project: 'Proyek Renovasi Kantor B', soTurunan: 'Instalasi Listrik', nominal: 'Rp 80.000.000', status: 'Paid' },
    { id: 6, noInvoice: 'INV-2024006', project: 'Proyek Pembangunan Gedung A', soTurunan: 'Pekerjaan Finishing', nominal: 'Rp 200.000.000', status: 'Draft' },
    { id: 7, noInvoice: 'INV-2024007', project: 'Proyek Infrastruktur C', soTurunan: 'Pemasangan Pipa', nominal: 'Rp 250.000.000', status: 'Pending' },
    { id: 8, noInvoice: 'INV-2024008', project: 'Proyek Renovasi Kantor B', soTurunan: 'Pengecatan', nominal: 'Rp 60.000.000', status: 'Paid' },
  ]);

  const [newInvoice, setNewInvoice] = useState({
    noInvoice: '',
    projectId: '',
    soTurunanId: '',
    nominal: '',
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [nextInvoiceId, setNextInvoiceId] = useState(invoices.length + 1);

  useEffect(() => {
    generateAutoInvoiceNumber();
  }, [invoices]);

  const generateAutoInvoiceNumber = () => {
    const latestId = invoices.length > 0 ? Math.max(...invoices.map(inv => parseInt(inv.noInvoice.split('-')[1].substring(4)))) : 0;
    const newId = latestId + 1;
    const formattedId = String(newId).padStart(3, '0');
    setNewInvoice(prev => ({ ...prev, noInvoice: `INV-2024${formattedId}` }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value;
    const project = dummyProjects.find(p => p.id === projectId);
    setSelectedProject(project || null);
    setNewInvoice(prev => ({ ...prev, projectId, soTurunanId: '', nominal: '' }));
  };

  const handleSOTurunanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const soTurunanId = e.target.value;
    const so = selectedProject?.soTurunan.find(s => s.id === soTurunanId);
    setNewInvoice(prev => ({
      ...prev,
      soTurunanId,
      nominal: so ? `Rp ${Intl.NumberFormat('id-ID').format(so.nominal)}` : '',
    }));
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.projectId || !newInvoice.soTurunanId || !newInvoice.nominal) {
      alert('Please fill all invoice details.');
      return;
    }

    const project = dummyProjects.find(p => p.id === newInvoice.projectId);
    const soTurunan = project?.soTurunan.find(s => s.id === newInvoice.soTurunanId);

    if (project && soTurunan) {
      const newEntry: Invoice = {
        id: invoices.length + 1,
        noInvoice: newInvoice.noInvoice,
        project: project.name,
        soTurunan: soTurunan.name,
        nominal: newInvoice.nominal,
        status: 'Draft', // Default status for new invoices
      };
      setInvoices([...invoices, newEntry]);
      setNewInvoice({ noInvoice: '', projectId: '', soTurunanId: '', nominal: '' });
      setSelectedProject(null);
      setNextInvoiceId(prev => prev + 1);
    }
  };

  const handleEdit = (id: number) => {
    alert(`Edit invoice with ID: ${id}`);
    // Implement edit logic here
  };

  const handleDelete = (id: number) => {
    if (window.confirm(`Are you sure you want to delete invoice with ID: ${id}?`)) {
      setInvoices(invoices.filter(invoice => invoice.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                INVOICE MANAGEMENT
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Procon</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Invoice</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Form Tambah Invoice */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <PlusCircle className="h-6 w-6 text-blue-600" />
            <span>Tambah Invoice Baru</span>
          </h3>
          <form onSubmit={handleSaveInvoice} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="noInvoice" className="block text-sm font-medium text-gray-700 mb-1">
                  No Invoice
                </label>
                <input
                  id="noInvoice"
                  name="noInvoice"
                  type="text"
                  value={newInvoice.noInvoice}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                  Pilihan Project
                </label>
                <select
                  id="project"
                  name="project"
                  value={newInvoice.projectId}
                  onChange={handleProjectChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Pilih Project</option>
                  {dummyProjects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="soTurunan" className="block text-sm font-medium text-gray-700 mb-1">
                  Pilihan SO Turunan
                </label>
                <select
                  id="soTurunan"
                  name="soTurunan"
                  value={newInvoice.soTurunanId}
                  onChange={handleSOTurunanChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={!selectedProject}
                  required
                >
                  <option value="">Pilih SO Turunan</option>
                  {selectedProject?.soTurunan.map(so => (
                    <option key={so.id} value={so.id}>{so.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="nominal" className="block text-sm font-medium text-gray-700 mb-1">
                  Nominal
                </label>
                <input
                  id="nominal"
                  name="nominal"
                  type="text"
                  value={newInvoice.nominal}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Simpan Invoice</span>
              </button>
            </div>
          </form>
        </div>

        {/* Tabel List Invoice */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <ReceiptText className="h-6 w-6 text-purple-600" /> {/* Changed FileInvoice to ReceiptText */}
            <span>Daftar Invoice</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Invoice</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SO Turunan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.noInvoice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.project}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.soTurunan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nominal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 flex items-center space-x-1 mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProconInvoiceDashboard;
