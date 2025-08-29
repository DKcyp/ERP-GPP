import React, { useState } from 'react';
import { Clock, Plus, Edit, Trash2, ReceiptText, Printer } from 'lucide-react'; // Import Printer icon
import ProconInvoiceModal from './ProconInvoiceModal'; // Import the new modal
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Import ConfirmDeleteModal
import { Project, ProconInvoiceFormInput, Invoice, SOTurunan } from '../types'; // Import the new types

// Moved dummyProjects to be consistent with types.ts
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

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Invoice | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);

  const getNextInvoiceNumber = (currentInvoices: Invoice[]): string => {
    const currentYear = new Date().getFullYear();
    const prefix = `INV-${currentYear}`;
    
    const latestSequentialNum = currentInvoices
      .filter(inv => inv.noInvoice.startsWith(prefix))
      .map(inv => {
        const parts = inv.noInvoice.split('-');
        if (parts.length === 2 && parts[0] === 'INV' && parts[1].startsWith(String(currentYear))) {
          const numPart = parts[1].substring(4); // e.g., "001" from "2024001"
          return parseInt(numPart);
        }
        return 0;
      })
      .filter(num => !isNaN(num))
      .reduce((max, current) => Math.max(max, current), 0);

    const newSequentialNum = latestSequentialNum + 1;
    const formattedSequentialNum = String(newSequentialNum).padStart(3, '0');

    return `${prefix}${formattedSequentialNum}`;
  };

  const handleAddClick = () => {
    setItemToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditClick = (id: number) => {
    const invoiceToEdit = invoices.find(inv => inv.id === id);
    if (invoiceToEdit) {
      setItemToEdit(invoiceToEdit);
      setIsAddEditModalOpen(true);
    }
  };

  const handleDeleteClick = (id: number) => {
    setItemToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDeleteId !== null) {
      setInvoices(invoices.filter(invoice => invoice.id !== itemToDeleteId));
      setItemToDeleteId(null);
      setIsConfirmDeleteModalOpen(false);
    }
  };

  const handlePrintClick = (id: number) => {
    const invoiceToPrint = invoices.find(inv => inv.id === id);
    if (invoiceToPrint) {
      alert(`Mencetak Invoice: ${invoiceToPrint.noInvoice} untuk Project: ${invoiceToPrint.project}`);
      // Implement actual print logic here (e.g., open a new window with invoice details, trigger browser print)
    }
  };

  const handleSaveInvoice = (formData: ProconInvoiceFormInput) => {
    const project = dummyProjects.find(p => p.id === formData.projectId);
    const soTurunan = project?.soTurunan.find(s => s.id === formData.soTurunanId);

    if (!project || !soTurunan) {
      console.error("Project or SO Turunan not found.");
      return;
    }

    // Ensure nominal is formatted consistently
    const formattedNominal = formData.nominal.startsWith('Rp ') ? formData.nominal : `Rp ${Intl.NumberFormat('id-ID').format(parseFloat(formData.nominal.replace(/[^0-9,-]+/g, "").replace(",", ".")))}`;

    if (itemToEdit) {
      // Edit existing invoice
      setInvoices(invoices.map(inv =>
        inv.id === itemToEdit.id
          ? {
              ...inv,
              noInvoice: formData.noInvoice,
              project: project.name,
              soTurunan: soTurunan.name,
              nominal: formattedNominal,
              status: formData.status || inv.status, // Use status from form if provided, else keep existing
            }
          : inv
      ));
      setItemToEdit(null); // Clear itemToEdit after saving
    } else {
      // Add new invoice
      const newEntry: Invoice = {
        id: invoices.length > 0 ? Math.max(...invoices.map(inv => inv.id)) + 1 : 1, // Robust ID generation
        noInvoice: formData.noInvoice,
        project: project.name,
        soTurunan: soTurunan.name,
        nominal: formattedNominal,
        status: 'Draft', // Default status for new invoices
      };
      setInvoices([...invoices, newEntry]);
    }
    setIsAddEditModalOpen(false);
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
        {/* Tabel List Invoice */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <ReceiptText className="h-6 w-6 text-purple-600" />
              <span>Daftar Invoice</span>
            </h3>
            <button
              onClick={handleAddClick}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Tambah Invoice</span>
            </button>
          </div>
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
                      {item.status === 'Draft' && (
                        <>
                          <button
                            onClick={() => handleEditClick(item.id)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="text-red-600 hover:text-red-900 flex items-center space-x-1 mt-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Hapus</span>
                          </button>
                        </>
                      )}
                      {item.status === 'Pending' && (
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Hapus</span>
                        </button>
                      )}
                      {item.status === 'Paid' && (
                        <button
                          onClick={() => handlePrintClick(item.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <Printer className="h-4 w-4" />
                          <span>Print</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Procon Invoice Modal */}
      <ProconInvoiceModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveInvoice}
        dummyProjects={dummyProjects}
        itemToEdit={itemToEdit}
        initialNoInvoice={getNextInvoiceNumber(invoices)}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDeleteId ? invoices.find(inv => inv.id === itemToDeleteId)?.noInvoice : ''}
      />
    </div>
  );
};

export default ProconInvoiceDashboard;
