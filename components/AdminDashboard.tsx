import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Search,
  Bell,
  FileText,
  CheckCircle,
  Clock,
  MoreVertical,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Filter,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Lead } from '../types';
import { COMPANY_NAME } from '../constants';

interface AdminDashboardProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: Lead['status']) => void;
  onLogout: () => void;
}

type TabType = 'dashboard' | 'leads' | 'settings';
type FilterStatus = 'all' | Lead['status'];

const ITEMS_PER_PAGE = 10;

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  leads,
  onUpdateStatus,
  onLogout,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loginError, setLoginError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Nieuwe aanvraag van Jan Peeters', time: '5 min geleden', read: false },
    { id: 2, message: 'Offerte verzonden naar Sofie Dubois', time: '1 uur geleden', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Trim whitespace and check credentials
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    
    if (trimmedUsername === 'admin' && trimmedPassword === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
      // Store authentication in sessionStorage to persist across page refreshes
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      setLoginError('Ongeldige gebruikersnaam of wachtwoord');
    }
  };

  // Check if already authenticated on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle logout with sessionStorage cleanup
  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    onLogout();
  };

  // Filtered and searched leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.project.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [leads, searchQuery, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const stats = useMemo(() => {
    const newLeads = leads.filter((l) => l.status === 'Nieuw').length;
    const processing = leads.filter((l) =>
      ['Contact Gehad', 'Offerte Verzonden'].includes(l.status)
    ).length;
    const completed = leads.filter((l) => l.status === 'Afgerond').length;
    const total = leads.length;
    const conversionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { newLeads, processing, completed, total, conversionRate };
  }, [leads]);

  const exportToCSV = () => {
    const headers = ['Naam', 'Email', 'Telefoon', 'Project', 'Datum', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map((lead) =>
        [lead.name, lead.email, lead.phone, lead.project, lead.date, lead.status].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `yannova-leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'Nieuw': return 'bg-blue-100 text-blue-700';
      case 'Contact Gehad': return 'bg-yellow-100 text-yellow-700';
      case 'Offerte Verzonden': return 'bg-purple-100 text-purple-700';
      case 'Afgerond': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-dark to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-brand-dark">
              {COMPANY_NAME}<span className="text-brand-accent">.</span>
            </h1>
            <p className="text-gray-500 mt-2">Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Gebruikersnaam
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
                placeholder="Voer gebruikersnaam in"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-accent hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Inloggen
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-brand-accent transition-colors"
              >
                ← Terug naar website
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
            <p className="font-medium text-gray-700 mb-1">Demo credentials:</p>
            <p>Gebruiker: admin | Wachtwoord: admin123</p>
          </div>
        </div>
      </div>
    );
  }

  // Lead Detail Modal
  const LeadDetailModal = () => {
    if (!selectedLead) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-brand-dark">Lead Details</h3>
            <button
              onClick={() => setSelectedLead(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent text-2xl font-bold">
                {selectedLead.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-brand-dark">{selectedLead.name}</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedLead.status)}`}>
                  {selectedLead.status}
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href={`mailto:${selectedLead.email}`} className="text-brand-dark hover:text-brand-accent">
                    {selectedLead.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Telefoon</p>
                  <a href={`tel:${selectedLead.phone}`} className="text-brand-dark hover:text-brand-accent">
                    {selectedLead.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Aanvraagdatum</p>
                  <p className="text-brand-dark">{selectedLead.date}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Project</p>
                <p className="text-brand-dark">{selectedLead.project}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status wijzigen</label>
              <select
                value={selectedLead.status}
                onChange={(e) => {
                  onUpdateStatus(selectedLead.id, e.target.value as Lead['status']);
                  setSelectedLead({ ...selectedLead, status: e.target.value as Lead['status'] });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none"
              >
                <option value="Nieuw">Nieuw</option>
                <option value="Contact Gehad">Contact Gehad</option>
                <option value="Offerte Verzonden">Offerte Verzonden</option>
                <option value="Afgerond">Afgerond</option>
              </select>
            </div>

            <div className="flex gap-3">
              <a
                href={`mailto:${selectedLead.email}`}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-accent hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                <Mail size={18} /> Email sturen
              </a>
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-dark hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors"
              >
                <Phone size={18} /> Bellen
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">{COMPANY_NAME}<span className="text-brand-accent">.</span></h2>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'leads' ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <Users size={20} />
            Leads
            {stats.newLeads > 0 && <span className="ml-auto bg-brand-accent text-white hover:bg-brand-accent/80 text-xs px-2 py-0.5 rounded-full">{stats.newLeads}</span>}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <Settings size={20} />
            Instellingen
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-brand-dark">{COMPANY_NAME}<span className="text-brand-accent">.</span></h2>
          <button onClick={handleLogout} className="p-2 text-gray-600">
            <LogOut size={24} />
          </button>
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">
              {activeTab === 'dashboard' ? 'Dashboard Overzicht' :
                activeTab === 'leads' ? 'Leads Beheer' : 'Instellingen'}
            </h1>
            <p className="text-gray-500">Welkom terug, Admin</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100 font-semibold">Notificaties</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                        <p className="text-sm text-gray-800">{n.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Totaal Leads</p>
                    <h3 className="text-2xl font-bold text-brand-dark mt-1">{stats.total}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Users size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+12%</span>
                  <span className="text-gray-400 ml-1">vs vorige maand</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Nieuwe Aanvragen</p>
                    <h3 className="text-2xl font-bold text-brand-dark mt-1">{stats.newLeads}</h3>
                  </div>
                  <div className="p-3 bg-brand-accent/10 rounded-lg text-brand-accent">
                    <AlertCircle size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-1" />
                  <span>Actie vereist</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">Conversie Rate</p>
                    <h3 className="text-2xl font-bold text-brand-dark mt-1">{stats.conversionRate}%</h3>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-green-600">
                    <CheckCircle size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span>+2.4%</span>
                  <span className="text-gray-400 ml-1">kwartaal</span>
                </div>
              </div>
            </div>

            {/* Recent Activity / Simplified List for Dash */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-brand-dark">Recente Leads</h3>
                <button onClick={() => setActiveTab('leads')} className="text-brand-accent text-sm hover:underline">Bekijk alles</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Naam</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Datum</th>
                      <th className="px-6 py-4 font-medium text-right">Actie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLeads.slice(0, 5).map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-brand-dark">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.project}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{lead.date}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedLead(lead)} className="text-gray-400 hover:text-brand-accent">
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Zoeken naar naam, email of project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
                >
                  <option value="all">Alle Status</option>
                  <option value="Nieuw">Nieuw</option>
                  <option value="Contact Gehad">Contact Gehad</option>
                  <option value="Offerte Verzonden">Offerte Verzonden</option>
                  <option value="Afgerond">Afgerond</option>
                </select>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <Download size={20} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Naam / Contact</th>
                      <th className="px-6 py-4 font-medium">Project</th>
                      <th className="px-6 py-4 font-medium">Status & Datum</th>
                      <th className="px-6 py-4 font-medium text-right">Acties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-brand-dark">{lead.name}</div>
                          <div className="flex flex-col text-sm text-gray-500 mt-1 gap-1">
                            <span className="flex items-center gap-1"><Mail size={12} /> {lead.email}</span>
                            <span className="flex items-center gap-1"><Phone size={12} /> {lead.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {lead.project}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                          <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <Clock size={12} /> {lead.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setSelectedLead(lead)} className="p-2 text-gray-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors">
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                  <span className="text-sm text-gray-500">
                    Pagina {currentPage} van {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-white"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-white"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <Settings size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Instellingen</h3>
            <p className="text-gray-500">Deze functionaliteit is momenteel in ontwikkeling.</p>
          </div>
        )}
      </main>

      <LeadDetailModal />
    </div>
  );
};

export default AdminDashboard;
