import React, { useState } from 'react';
import { 
  Users, BookOpen, CreditCard, Wrench, 
  BarChart3, CheckCircle, XCircle, AlertTriangle,
  ArrowRight, Eye, Plus, Download
} from 'lucide-react';

// Import the logbook components
import QHSELogBookRATDashboard from './QHSELogBookRATDashboard';
import QHSELogBookTKPKDashboard from './QHSELogBookTKPKDashboard';
import QHSELogBookTLDDashboard from './QHSELogBookTLDDashboard';

type ActiveTab = 'overview' | 'logbook-rat' | 'logbook-tkpk' | 'logbook-tld';

const QHSEMonitoringPersonilDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Mock statistics data
  const stats = {
    totalPersonnel: 45,
    activeProjects: 12,
    ratEntries: 28,
    tkpkEntries: 15,
    tldEntries: 22,
    pendingValidation: 8,
    completedThisMonth: 35,
    overdueReturns: 3
  };

  const recentActivities = [
    {
      id: 1,
      type: 'RAT',
      personnel: 'Ahmad Rizki',
      project: 'RT Inspection PHE ONWJ',
      action: 'Log Out',
      timestamp: '2024-01-20 08:00',
      status: 'completed'
    },
    {
      id: 2,
      type: 'TKPK',
      personnel: 'Budi Santoso',
      project: 'TKPK Inspection Medco',
      action: 'Log In',
      timestamp: '2024-01-20 07:30',
      status: 'pending'
    },
    {
      id: 3,
      type: 'TLD',
      personnel: 'Citra Dewi',
      project: 'RT Inspection ENI',
      action: 'Validation Required',
      timestamp: '2024-01-19 16:45',
      status: 'warning'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'warning': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-blue-500">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Personnel</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalPersonnel}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-green-500">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed This Month</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completedThisMonth}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-yellow-500">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Validation</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingValidation}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-red-500">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue Returns</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.overdueReturns}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logbook Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Logbook RAT</h3>
                  <p className="text-sm text-gray-500">Radiographic Testing</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{stats.ratEntries}</div>
                <div className="text-sm text-gray-500">Total Entries</div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setActiveTab('logbook-rat')}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Wrench className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Logbook TKPK</h3>
                  <p className="text-sm text-gray-500">Teknik Keselamatan Penanganan Konstruksi</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{stats.tkpkEntries}</div>
                <div className="text-sm text-gray-500">Total Entries</div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setActiveTab('logbook-tkpk')}
                className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
              >
                View Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Logbook TLD</h3>
                  <p className="text-sm text-gray-500">Thermoluminescent Dosimeter</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{stats.tldEntries}</div>
                <div className="text-sm text-gray-500">Total Entries</div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setActiveTab('logbook-tld')}
                className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500"
              >
                View Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activities</h3>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </button>
          </div>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivities.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(activity.status)}`}>
                          {activity.type === 'RAT' && <BookOpen className="h-4 w-4" />}
                          {activity.type === 'TKPK' && <Wrench className="h-4 w-4" />}
                          {activity.type === 'TLD' && <CreditCard className="h-4 w-4" />}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">{activity.personnel}</span> - {activity.action} for{' '}
                            <span className="font-medium text-gray-900">{activity.project}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.type} Logbook
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={activity.timestamp}>{activity.timestamp}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('logbook-rat')}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add RAT Entry
            </button>
            <button
              onClick={() => setActiveTab('logbook-tkpk')}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add TKPK Entry
            </button>
            <button
              onClick={() => setActiveTab('logbook-tld')}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add TLD Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'logbook-rat':
        return <QHSELogBookRATDashboard />;
      case 'logbook-tkpk':
        return <QHSELogBookTKPKDashboard />;
      case 'logbook-tld':
        return <QHSELogBookTLDDashboard />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Monitoring Personil</h1>
                <p className="mt-2 text-sm text-blue-100">
                  Sistem monitoring log in/out personil untuk berbagai jenis pekerjaan
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-100 bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('logbook-rat')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logbook-rat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Logbook RAT
              </div>
            </button>
            <button
              onClick={() => setActiveTab('logbook-tkpk')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logbook-tkpk'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Wrench className="h-4 w-4 mr-2" />
                Logbook TKPK
              </div>
            </button>
            <button
              onClick={() => setActiveTab('logbook-tld')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logbook-tld'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Logbook TLD
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default QHSEMonitoringPersonilDashboard;
