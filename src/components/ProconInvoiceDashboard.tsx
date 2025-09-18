import React, { useEffect, useMemo, useState } from 'react';
import { Clock, ReceiptText, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PIEntry {
  id: string;
  clientName: string;
  soInduk: string;
  soTurunan: string;
  contractStart: string;
  contractEnd: string;
  nilaiKontrak: number;
  absorbKontrak: number;
  remainingKontrak: number;
}

const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

const ProconInvoiceDashboard: React.FC = () => {
  const [data, setData] = useState<PIEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('procon_pi_entries');
      const yr = new Date().getFullYear();
      const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

      const makeEntry = (m: number, idx: number): PIEntry => {
        const base = 50_000_000 + (m * 10_000_000) + (idx % 3) * 5_000_000; // varying amount
        const absorb = Math.round(base * (0.5 + 0.1 * ((idx + m) % 3)));
        const remaining = Math.max(0, base - absorb);
        return {
          id: `PI-${yr}-${String(m+1).padStart(2,'0')}-${cryptoRandomId()}`,
          clientName: `Client ${monthNames[m]} ${idx+1}`,
          soInduk: `SO-${yr}-${String(m+1).padStart(2,'0')}-${100+m}${idx}`,
          soTurunan: `TRN-${yr}-${String(m+1).padStart(2,'0')}-${idx+1}`,
          contractStart: `${yr}-${String(m+1).padStart(2,'0')}-${idx % 2 === 0 ? '10' : '20'}`,
          contractEnd: `${yr}-${String(Math.min(12, m+2)).padStart(2,'0')}-28`,
          nilaiKontrak: base,
          absorbKontrak: absorb,
          remainingKontrak: remaining,
        };
      };

      const ensureAtLeastFifteen = (arr: PIEntry[]): PIEntry[] => {
        const result = [...arr];
        // Ensure at least one per month for current year
        const hasMonth: boolean[] = Array(12).fill(false);
        for (const r of result) {
          const d = new Date(r.contractStart);
          if (!isNaN(d.getTime()) && d.getFullYear() === yr) {
            hasMonth[d.getMonth()] = true;
          }
        }
        for (let m = 0; m < 12; m++) {
          if (!hasMonth[m]) {
            result.push(makeEntry(m, 0));
          }
        }
        // Fill up to 15 entries
        let idx = 1;
        while (result.length < 15) {
          const m = (idx - 1) % 12;
          result.push(makeEntry(m, idx));
          idx++;
        }
        return result;
      };

      if (raw) {
        const parsed: PIEntry[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const ensured = ensureAtLeastFifteen(parsed);
          if (ensured.length !== parsed.length) {
            localStorage.setItem('procon_pi_entries', JSON.stringify(ensured));
          }
          setData(ensured);
          return;
        }
      }

      // Seed exactly 15 entries distributed across months
      const seeded: PIEntry[] = ensureAtLeastFifteen([]).slice(0, 15);
      localStorage.setItem('procon_pi_entries', JSON.stringify(seeded));
      setData(seeded);
    } catch (e) {
      console.warn('Failed to load procon_pi_entries', e);
    }
  }, []);

  // simple random id without crypto dep
  const cryptoRandomId = () => Math.random().toString(36).slice(2, 8);

  // Removed totals card computation (no longer used in UI)

  const currentYear = new Date().getFullYear();
  const totalNilaiTahun = useMemo(() => {
    return data
      .filter((r) => {
        const d = new Date(r.contractStart);
        return !isNaN(d.getTime()) && d.getFullYear() === currentYear;
      })
      .reduce((s, r) => s + (r.nilaiKontrak || 0), 0);
  }, [data, currentYear]);

  const monthlyTotals = useMemo(() => {
    const init = Array.from({ length: 12 }, (_, i) => ({ month: i, amount: 0 }));
    for (const r of data) {
      const d = new Date(r.contractStart);
      if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
        const m = d.getMonth();
        init[m].amount += r.nilaiKontrak || 0;
      }
    }
    const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return init.map((it) => ({ label: monthNames[it.month], amount: it.amount }));
  }, [data, currentYear]);

  const handleBarClick = () => {
    navigate('/procon/proforma-invoice/pembuatan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">PROFORMA INVOICE DASHBOARD</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Procon</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Proforma Invoice</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Top Box: Total Nominal PI per Tahun */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Nominal Proforma Invoice {currentYear}</p>
              <p className="text-3xl md:text-4xl font-bold text-gray-900">{formatRupiah(totalNilaiTahun)}</p>
            </div>
            <ReceiptText className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        {/* Chart: Total Nominal PI per Bulan */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-blue-600" />
            <span>Total Nominal PI per Bulan - {currentYear}</span>
          </h3>
          <div className="h-64 flex items-end justify-center gap-3 md:gap-4">
            {monthlyTotals.map((m) => (
              <div key={m.label} className="flex flex-col items-center space-y-1">
                <div
                  className="w-8 md:w-10 bg-blue-500/80 hover:bg-blue-600 rounded-t-lg transition-all duration-300 cursor-pointer"
                  style={{ height: `${(m.amount / 1_000_000) * 0.6}px` }}
                  title={`${m.label}: ${formatRupiah(m.amount)}`}
                  onClick={handleBarClick}
                />
                <span className="text-[10px] md:text-xs text-gray-600">{m.label}</span>
                <span className="text-[10px] md:text-xs text-gray-400">{(m.amount/1_000_000).toFixed(0)} jt</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table removed as requested */}
      </div>
    </div>
  );
};

export default ProconInvoiceDashboard;
