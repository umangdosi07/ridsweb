import React, { useEffect, useState } from 'react';
import {
  Mail,
  Users,
  Heart,
  Trash2,
  CheckCircle,
  XCircle,
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
  const [activeTab, setActiveTab] = useState('inquiries');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [inquiries, setInquiries] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [donations, setDonations] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ================= LOADERS ================= */

  const loadInquiries = async () => {
    setLoading(true);
    try {
      setInquiries(await inquiriesAPI.getAll());
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const loadVolunteers = async () => {
    setLoading(true);
    try {
      setVolunteers(await volunteersAPI.getAll());
    } catch {
      toast.error('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  const loadDonations = async () => {
    setLoading(true);
    try {
      setDonations(await donationsAPI.getAll());
    } catch {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inquiries') loadInquiries();
    if (activeTab === 'volunteers') loadVolunteers();
    if (activeTab === 'donations') loadDonations();
  }, [activeTab]);

  /* ================= ACTIONS ================= */

  const updateInquiryStatus = async (id, status) => {
    await inquiriesAPI.updateStatus(id, status);
    toast.success('Status updated');
    loadInquiries();
  };

  const deleteInquiry = async (id) => {
    if (!confirm('Delete inquiry?')) return;
    await inquiriesAPI.delete(id);
    toast.success('Inquiry deleted');
    loadInquiries();
  };

  const updateVolunteerStatus = async (id, status) => {
    await volunteersAPI.updateStatus(id, status);
    toast.success('Status updated');
    loadVolunteers();
  };

  const deleteVolunteer = async (id) => {
    if (!confirm('Delete volunteer application?')) return;
    await volunteersAPI.delete(id);
    toast.success('Volunteer deleted');
    loadVolunteers();
  };

  const exportDonationsCSV = async () => {
    try {
      const res = await exportAPI.donationsCSV();
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'donations.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch {
      toast.error('Export failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex bg-stone-100">

      {/* SIDEBAR */}
      <aside className={`bg-white shadow-lg transition-all ${sidebarOpen ? 'w-64' : 'w-16'} hidden md:block`}>
        <div className="p-4 font-bold">RIDS Admin</div>

        <nav className="p-2 space-y-1">
          {[
            { id: 'inquiries', label: 'Inquiries', icon: Mail },
            { id: 'volunteers', label: 'Volunteers', icon: Users },
            { id: 'donations', label: 'Donations', icon: Heart },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded
              ${activeTab === item.id ? 'bg-terracotta-100 text-terracotta-700' : 'hover:bg-stone-100'}`}
            >
              <item.icon size={18} />
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>

        <div className="p-2">
          <Button variant="destructive" className="w-full" onClick={logout}>
            <LogOut size={16} className="mr-2" /> {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-6 space-y-6">

        {/* Mobile Header */}
        <div className="flex items-center gap-3 md:hidden">
          <Button size="icon" variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={18} />
          </Button>
          <h1 className="font-bold capitalize">{activeTab}</h1>
        </div>

        {/* INQUIRIES */}
        {activeTab === 'inquiries' && (
          <Card>
            <CardHeader><CardTitle>Contact Inquiries</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {inquiries.map(i => (
                <div key={i.id} className="border p-4 rounded space-y-2">
                  <p className="font-semibold">{i.name}</p>
                  <p className="text-sm">{i.email}</p>
                  <p><b>Subject:</b> {i.subject}</p>
                  <p>{i.message}</p>
                  <Badge>{i.status}</Badge>

                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" onClick={() => updateInquiryStatus(i.id, 'replied')}>
                      <CheckCircle size={14} className="mr-1" /> Replied
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateInquiryStatus(i.id, 'closed')}>
                      Close
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteInquiry(i.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* VOLUNTEERS */}
        {activeTab === 'volunteers' && (
          <Card>
            <CardHeader><CardTitle>Volunteer Applications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {volunteers.map(v => (
                <div key={v.id} className="border p-4 rounded space-y-2">
                  <p className="font-semibold">{v.name}</p>
                  <p>{v.email} | {v.phone}</p>
                  <p>{v.city}</p>
                  <p><b>Interest:</b> {v.interest}</p>
                  <p>{v.message}</p>
                  <Badge>{v.status}</Badge>

                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" onClick={() => updateVolunteerStatus(v.id, 'contacted')}>Contacted</Button>
                    <Button size="sm" onClick={() => updateVolunteerStatus(v.id, 'accepted')}>Accept</Button>
                    <Button size="sm" variant="outline" onClick={() => updateVolunteerStatus(v.id, 'rejected')}>Reject</Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteVolunteer(v.id)}>
                      <XCircle size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* DONATIONS */}
        {activeTab === 'donations' && (
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Donations</CardTitle>
              <Button onClick={exportDonationsCSV}>
                <Download size={16} className="mr-2" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {donations.map(d => (
                <div key={d.id} className="border p-3 rounded">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm">{d.email} | {d.phone}</p>
                  <p>₹{d.amount} — {d.type}</p>
                  <Badge>{d.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
