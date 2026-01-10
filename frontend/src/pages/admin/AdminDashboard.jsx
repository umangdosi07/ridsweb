import React, { useEffect, useState } from 'react';
import {
  Mail,
  Users,
  Heart,
  Trash2,
  Menu,
  LogOut,
  Download,
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

import {
  inquiriesAPI,
  volunteersAPI,
  donationsAPI,
  exportAPI,
} from '../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('donations');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

  const loadDonations = async () => {
    setLoading(true);
    try {
      const data = await donationsAPI.getAll();
      setDonations(data);
    } catch {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'donations') loadDonations();
  }, [activeTab]);

  /* ================= EXPORT ================= */

  const exportDonationsCSV = async () => {
    try {
      const res = await exportAPI.donationsCSV();

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'donations.csv';
      link.click();

      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen flex bg-stone-100">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300
        ${sidebarOpen ? 'w-64' : 'w-16'} hidden md:block`}
      >
        <div className="p-4 font-bold text-lg">RIDS Admin</div>

        <nav className="space-y-1 p-2">
          <button
            onClick={() => setActiveTab('donations')}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded
            ${activeTab === 'donations'
              ? 'bg-terracotta-100 text-terracotta-700'
              : 'hover:bg-stone-100'}`}
          >
            <Heart size={18} />
            {sidebarOpen && 'Donations'}
          </button>
        </nav>

        <div className="p-2">
          <Button
            variant="destructive"
            className="w-full flex gap-2"
            onClick={logout}
          >
            <LogOut size={16} />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-4 md:p-6 space-y-6">

        {/* Mobile Header */}
        <div className="flex items-center gap-3 md:hidden">
          <Button size="icon" variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={18} />
          </Button>
          <h1 className="font-bold">Donations</h1>
        </div>

        {/* ================= DONATIONS ================= */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle>Donations</CardTitle>

            <Button
              onClick={exportDonationsCSV}
              className="flex gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white"
            >
              <Download size={16} />
              Export CSV
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading && <p>Loading...</p>}

            {donations.map((d) => (
              <div
                key={d.id}
                className="border rounded-lg p-4 space-y-1"
              >
                <p className="font-semibold">{d.name}</p>
                <p className="text-sm">{d.email} | {d.phone}</p>
                <p className="text-sm">
                  ₹{d.amount} — {d.type}
                </p>
                <Badge>{d.status}</Badge>
              </div>
            ))}

            {donations.length === 0 && !loading && (
              <p className="text-stone-500">No donations found</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
