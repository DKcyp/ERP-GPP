import React, { useState, useEffect } from 'react';
import { X, Save, PlusCircle } from 'lucide-react';
import { Project, ProconInvoiceFormInput, Invoice } from '../types'; // Import Invoice type

interface ProconInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: ProconInvoiceFormInput) => void;
  dummyProjects: Project[];
  itemToEdit: Invoice | null; // New prop for edit mode
  initialNoInvoice: string;
}

const ProconInvoiceModal: React.FC<ProconInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dummyProjects,
  itemToEdit, // Destructure itemToEdit
  initialNoInvoice,
}) => {
  const [formData, setFormData] = useState<ProconInvoiceFormInput>({
    noInvoice: '',
    projectId: '',
    soTurunanId: '',
    nominal: '',
    status: 'Draft', // Add status for edit mode
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        // Edit mode: pre-fill form
        const project = dummyProjects.find(p => p.name === itemToEdit.project);
        const soTurunan = project?.soTurunan.find(s => s.name === itemToEdit.soTurunan);

        setFormData({
          noInvoice: itemToEdit.noInvoice,
          projectId: project?.id || '',
          soTurunanId: soTurunan?.id || '',
          nominal: itemToEdit.nominal,
          status: itemToEdit.status,
        });
        setSelectedProject(project || null);
      } else {
        // Add mode: reset form
        setFormData({
          noInvoice: initialNoInvoice,
          projectId: '',
          soTurunanId: '',
          nominal: '',
          status: 'Draft',
        });
        setSelectedProject(null);
      }
    }
  }, [isOpen, itemToEdit, initialNoInvoice, dummyProjects]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value;
    const project = dummyProjects.find(p => p.id === projectId);
    setSelectedProject(project || null);
    setFormData(prev => ({ ...prev, projectId, soTurunanId: '', nominal: '' }));
  };

  const handleSOTurunanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const soTurunanId = e.target.value;
    const so = selectedProject?.soTurunan.find(s => s.id === soTurunanId);
    setFormData(prev => ({
      ...prev,
      soTurunanId,
      nominal: so ? `Rp ${Intl.NumberFormat('id-ID').format(so.nominal)}` : '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId || !formData.soTurunanId || !formData.nominal) {
      alert('Please fill all invoice details.');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 ease-out scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          title="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4 flex items-center space-x-2">
          <PlusCircle className="h-7 w-7 text-blue-600" />
          <span>{itemToEdit ? 'Edit Invoice' : 'Tambah Invoice Baru'}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* No Invoice */}
          <div>
            <label htmlFor="noInvoice" className="block text-sm font-medium text-gray-700 mb-1">
              No Invoice
            </label>
            <input
              id="noInvoice"
              name="noInvoice"
              type="text"
              value={formData.noInvoice}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Pilihan Project */}
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
              Pilihan Project
            </label>
            <select
              id="project"
              name="project"
              value={formData.projectId}
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

          {/* Pilihan SO Turunan */}
          <div>
            <label htmlFor="soTurunan" className="block text-sm font-medium text-gray-700 mb-1">
              Pilihan SO Turunan
            </label>
            <select
              id="soTurunan"
              name="soTurunan"
              value={formData.soTurunanId}
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

          {/* Nominal */}
          <div>
            <label htmlFor="nominal" className="block text-sm font-medium text-gray-700 mb-1">
              Nominal
            </label>
            <input
              id="nominal"
              name="nominal"
              type="text"
              value={formData.nominal}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Status (only for edit mode) */}
          {itemToEdit && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Pending' | 'Paid' | 'Draft' }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors shadow-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProconInvoiceModal;
