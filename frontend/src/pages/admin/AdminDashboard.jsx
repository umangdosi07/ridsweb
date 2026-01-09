import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Mail,
  Users,
  LogOut,
  Menu,
  Shield,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';

import {
  inquiriesAPI,
  volunteersAPI,
} from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [inquiries, setInquiries] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  /* ================= LOADERS ================= */

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await inquiriesAPI.getAll();
      setInquiries(data);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const loadVolunteers = async () => {
    setLoading(true);
    try {
      const data = await volunteersAPI.getAll();
      setVolunteers(data);
    } catch {
      toast.error('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inquiries') loadInquiries();
    if (activeTab === 'volunteers') loadVolunteers();
  }, [activeTab]);

  /* ================= ACTIONS ================= */

  const logout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  /* ================= SIDEBAR ================= */

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inquiries', label: 'Inquiries', icon: Mail },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
  ];

  /* ================= RENDER ================= */

  const renderContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Inquiries</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {inquiries.length}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Volunteers</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {volunteers.length}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'inquiries') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Contact Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <p className="text-center">Loading…</p>
            ) : inquiries.length === 0 ? (
              <p className="text-center text-stone-500">No inquiries yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Subject</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((i) => (
                    <tr key={i.id} className="border-b">
                      <td className="p-2">{i.name}</td>
                      <td className="p-2">{i.subject}</td>
                      <td className="p-2 capitalize">{i.status}</td>
                      <td className="p-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            inquiriesAPI
                              .updateStatus(i.id, 'replied')
                              .then(loadInquiries)
                          }
                        >
                          Replied
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            inquiriesAPI
                              .delete(i.id)
                              .then(loadInquiries)
                          }
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      );
    }

    if (activeTab === 'volunteers') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Applications</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <p className="text-center">Loading…</p>
            ) : volunteers.length === 0 ? (
              <p className="text-center text-stone-500">No applications</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">City</th>
                    <th className="p-2 text-left">Interest</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((v) => (
                    <tr key={v.id} className="border-b">
                      <td className="p-2">{v.name}</td>
                      <td className="p-2">{v.city}</td>
                      <td className="p-2">{v.interest}</td>
                      <td className="p-2 capitalize">{v.status}</td>
                      <td className="p-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            volunteersAPI
                              .updateStatus(v.id, 'accepted')
                              .then(loadVolunteers)
                          }
                        >
                          <CheckCircle size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            volunteersAPI
                              .delete(v.id)
                              .then(loadVolunteers)
                          }
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg ${sidebarOpen ? 'w-64' : 'w-16'} transition-all`}>
        <div className="p-4 flex items-center gap-2">
          <Shield />
          {sidebarOpen && <span className="font-bold">Admin</span>}
        </div>

        <nav className="p-2 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-2 p-2 rounded ${
                activeTab === t.id
                  ? 'bg-terracotta-100 text-terracotta-700'
                  : 'hover:bg-stone-100'
              }`}
            >
              <t.icon size={18} />
              {sidebarOpen && t.label}
            </button>
          ))}
        </nav>

        <div className="p-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <LogOut size={18} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="bg-white shadow p-4 flex justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </button>
          <span className="font-medium capitalize">{activeTab}</span>
        </header>

        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
