import React, { useMemo, useState } from 'react';
import { Clock, Search, PlusCircle, Download, FileText, Pencil, Trash2, AlertTriangle, TrendingUp, ExternalLink, Shield, Users } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface PerformanceItem {
  id: string;
  bulan: string; // e.g., "Januari"
  tahun: number; // e.g., 2025
  lagging: string; // text/score
  leading: string; // text/score
  document?: string; // url or filename
}

interface LaggingIndicators {
  fatality: number;
  rwc: number;
  fac: number;
  mtc: number;
  lwdc: number;
  propertyDamage: number;
  environment: number;
  motorVehicleAccident: number;
  occupationalIllness: number;
  nearMiss: number;
}

const BULAN_OPTIONS = [
  'Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'
];

const TAHUN_OPTIONS = (() => {
  const now = new Date().getFullYear();
  const arr: number[] = [];
  for (let t = now - 3; t <= now + 1; t++) arr.push(t);
  return arr;
})();

const initialData: PerformanceItem[] = [
  { id: '1', bulan: 'Januari', tahun: 2025, lagging: '0 incident', leading: '5 toolbox meeting', document: 'qhse-perf-jan25.pdf' },
  { id: '2', bulan: 'Februari', tahun: 2025, lagging: '1 incident', leading: '4 toolbox meeting', document: undefined },
];

const QHSEPerformanceDashboard: React.FC = () => {
  // table state
  const [rows, setRows] = useState<PerformanceItem[]>(initialData);

  // filters
  const [bulan, setBulan] = useState<string>('');
  const [tahun, setTahun] = useState<string>('');

  // table controls
  const [showEntries, setShowEntries] = useState('10');
  const [page, setPage] = useState(1);

  // modal state
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<'add'|'edit'>('add');
  const [form, setForm] = useState<Partial<PerformanceItem & { laggingIndicators: LaggingIndicators; notes: string }>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const m = !bulan || r.bulan === bulan;
      const y = !tahun || String(r.tahun) === tahun;
      return m && y;
    });
  }, [rows, bulan, tahun]);

  const perPage = Math.max(1, parseInt(showEntries, 10));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const openAdd = () => {
    setMode('add');
    setForm({ bulan: '', tahun: new Date().getFullYear(), laggingIndicators: { fatality: 0, rwc: 0, fac: 0, mtc: 0, lwdc: 0, propertyDamage: 0, environment: 0, motorVehicleAccident: 0, occupationalIllness: 0, nearMiss: 0 }, notes: '' });
    setShowForm(true);
  };

  const openEdit = (r: PerformanceItem) => {
    setMode('edit');
    setForm({ ...r, laggingIndicators: { fatality: 0, rwc: 0, fac: 0, mtc: 0, lwdc: 0, propertyDamage: 0, environment: 0, motorVehicleAccident: 0, occupationalIllness: 0, nearMiss: 0 }, notes: '' });
    setShowForm(true);
  };

  const saveForm = () => {
    if (!form.bulan || !form.tahun || !form.laggingIndicators) return;
    if (mode === 'add') {
      const newItem: PerformanceItem = {
        id: String(Date.now()),
        bulan: form.bulan as string,
        tahun: Number(form.tahun),
        lagging: '',
        leading: '',
        document: '',
      };
      setRows(prev => [newItem, ...prev]);
    } else if (mode === 'edit' && form.id) {
      setRows(prev => prev.map(p => p.id === form.id ? ({
        id: form.id as string,
        bulan: form.bulan as string,
        tahun: Number(form.tahun),
        lagging: '',
        leading: '',
        document: '',
      }) : p));
    }
    setShowForm(false);
  };

  const confirmDelete = () => {
    if (confirmId) setRows(prev => prev.filter(p => p.id !== confirmId));
    setConfirmId(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">QHSE PERFORMANCE</h1>
                <nav className="text-sm text-gray-600">
                  <span>Dashboard</span> <span className="mx-2">›</span> <span>QHSE</span> <span className="mx-2">›</span> <span className="text-blue-600">Performance</span>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={openAdd}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Tambah Data
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu Pencarian</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
                <select
                  value={bulan}
                  onChange={e => setBulan(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Semua Bulan</option>
                  {BULAN_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                <select
                  value={tahun}
                  onChange={e => setTahun(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Semua Tahun</option>
                  {TAHUN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Performance Data Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Lagging Indicators Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Lagging Indicators
                </h3>
                <span className="text-sm text-gray-500">Monitoring & Input Manual</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Fatality</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Restricted Work Case (RWC)</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">First Aid Case (FAC)</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Medical Treatment Case (MTC)</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Lost Work Day Case (LWDC)</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Property Damage</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Environment</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Motor Vehicle Accident</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Occupational Illness</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Near Miss</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
              </div>
            </div>

            {/* Leading Indicators Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Leading Indicators
                </h3>
                <span className="text-sm text-gray-500">Monitoring & Input Manual</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">HSE Audit (Internal)</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">HSE Audit (Eksternal)</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-gray-700">Medical Check Up</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-blue-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">PPE Inspection</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Fire Extinguisher Inspection</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">First Aid Inspection</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">HSE Meeting</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">HSE Induction</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Management Visit</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Vehicle Inspection</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Emergency Drill</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Hazard Observation</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Healthy Week</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">HSE Bulletin</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Training & Manhours Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Safety Training Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Safety Training
                </h3>
                <span className="text-sm text-gray-500">Link dari Matrik Training Inspector</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-gray-700">Sea Survival Training</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-blue-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-gray-700">Fire Fighting Training</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-blue-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-gray-700">First Aid Training</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-blue-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-gray-700">Confined Space Entry Other</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-blue-500 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Manhours Worker Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Manhours Worker
                </h3>
                <span className="text-sm text-gray-500">Link dengan Absen</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-medium text-gray-700">Office</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-purple-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-medium text-gray-700">PHE ONWJ</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-purple-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-medium text-gray-700">Medco Corridor</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-purple-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-medium text-gray-700">PHM</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-purple-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-medium text-gray-700">Medco Indonesia (SSB)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-purple-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-medium text-gray-700">ENI Muara Bakau</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-purple-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-medium text-gray-700">PHE OSES</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">0</span>
                    <ExternalLink className="h-4 w-4 text-purple-500 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Plus Kolam Tambahan</span>
                  <span className="text-sm text-gray-600">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-6">{mode === 'add' ? 'Tambah Data QHSE Performance' : 'Edit Data QHSE Performance'}</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
                  <select
                    value={form.bulan || ''}
                    onChange={e => setForm(f => ({ ...f, bulan: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Pilih Bulan</option>
                    {BULAN_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                  <select
                    value={form.tahun?.toString() || ''}
                    onChange={e => setForm(f => ({ ...f, tahun: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Pilih Tahun</option>
                    {TAHUN_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Lagging Indicators */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Lagging Indicators
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fatality</label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.fatality || 0}
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        laggingIndicators: { 
                          ...f.laggingIndicators as LaggingIndicators, 
                          fatality: Number(e.target.value) 
                        } 
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restricted Work Case (RWC)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.rwc || 0}
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        laggingIndicators: { 
                          ...f.laggingIndicators as LaggingIndicators, 
                          rwc: Number(e.target.value) 
                        } 
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Aid Case (FAC)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.fac || 0}
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        laggingIndicators: { 
                          ...f.laggingIndicators as LaggingIndicators, 
                          fac: Number(e.target.value) 
                        } 
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Treatment Case (MTC)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.mtc || 0}
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        laggingIndicators: { 
                          ...f.laggingIndicators as LaggingIndicators, 
                          mtc: Number(e.target.value) 
                        } 
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lost Work Day Case (LWDC)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.lwdc || 0}
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        laggingIndicators: { 
                          ...f.laggingIndicators as LaggingIndicators, 
                          lwdc: Number(e.target.value) 
                        } 
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Damage</label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.propertyDamage || 0}
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        laggingIndicators: { 
                          ...f.laggingIndicators as LaggingIndicators, 
                          propertyDamage: Number(e.target.value) 
                        } 
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.environment || 0}
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        laggingIndicators: { 
                          ...f.laggingIndicators as LaggingIndicators, 
                          environment: Number(e.target.value) 
                        } 
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motor Vehicle Accident</label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.motorVehicleAccident || 0}
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        laggingIndicators: { 
                          ...f.laggingIndicators as LaggingIndicators, 
                          motorVehicleAccident: Number(e.target.value) 
                        } 
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupational Illness</label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.occupationalIllness || 0}
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        laggingIndicators: { 
                          ...f.laggingIndicators as LaggingIndicators, 
                          occupationalIllness: Number(e.target.value) 
                        } 
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Near Miss</label>
                    <input
                      type="number"
                      min="0"
                      value={form.laggingIndicators?.nearMiss || 0}
                      onChange={e => setForm(f => ({ 
                        ...f, 
                        laggingIndicators: { 
                          ...f.laggingIndicators as LaggingIndicators, 
                          nearMiss: Number(e.target.value) 
                        } 
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (opsional)</label>
                <textarea
                  value={form.notes || ''}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Catatan tambahan untuk data performance ini..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowForm(false)} 
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={saveForm} 
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus data performance ini?"
        itemName={confirmId ? (() => { const i = rows.find(r => r.id === confirmId); return i ? `${i.bulan} ${i.tahun}` : undefined; })() : undefined}
      />
    </>
  );
};

export default QHSEPerformanceDashboard;
