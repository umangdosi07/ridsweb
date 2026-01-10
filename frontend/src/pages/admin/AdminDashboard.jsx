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
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

import {
  inquiriesAPI,
  volunteersAPI,
  donationsAPI,
} from '../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [inquiries, setInquiries] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [donations, setDonations] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

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
    toast.success('Inquiry updated');
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
    toast.success('Volunteer updated');
    loadVolunteers();
  };

  const deleteVolunteer = async (id) => {
    if (!confirm('Delete volunteer application?')) return;
    await volunteersAPI.delete(id);
    toast.success('Volunteer deleted');
    loadVolunteers();
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/admin/login';
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex bg-stone-100">

      {/* ===== SIDEBAR ===== */}
      <aside className={`bg-white shadow-lg transition-all duration-300 hidden md:block ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 font-bold text-lg">RIDS Admin</div>

        {[
          { id: 'inquiries', label: 'Inquiries', icon: Mail },
          { id: 'volunteers', label: 'Volunteers', icon: Users },
          { id: 'donations', label: 'Donations', icon: Heart },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded
              ${activeTab === item.id ? 'bg-terracotta-100 text-terracotta-700' : 'hover:bg-stone-100'}`}
          >
            <item.icon size={18} />
            {sidebarOpen && item.label}
          </button>
        ))}

        <div className="p-4">
          <Button variant="destructive" className="w-full" onClick={logout}>
            <LogOut size={16} className="mr-2" /> {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="flex-1 p-4 md:p-6 space-y-6">

        {/* Mobile Header */}
        <div className="flex items-center gap-3 md:hidden">
          <Button size="icon" variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={18} />
          </Button>
          <h1 className="font-bold capitalize">{activeTab}</h1>
        </div>

        {/* ===== INQUIRIES ===== */}
        {activeTab === 'inquiries' && (
          <Card>
            <CardHeader><CardTitle>Contact Inquiries</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {loading && <p>Loading...</p>}
              {inquiries.map(i => (
                <div key={i.id} className="border rounded-lg p-4 space-y-2">
                  <p className="font-semibold">{i.name}</p>
                  <p className="text-sm">{i.email}</p>
                  <p className="text-sm">{i.subject}</p>
                  <p className="text-sm">{i.message}</p>
                  <Badge>{i.status}</Badge>

                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" onClick={() => updateInquiryStatus(i.id, 'replied')}>Replied</Button>
                    <Button size="sm" variant="outline" onClick={() => updateInquiryStatus(i.id, 'closed')}>Closed</Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteInquiry(i.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* ===== VOLUNTEERS ===== */}
        {activeTab === 'volunteers' && (
          <Card>
            <CardHeader><CardTitle>Volunteer Applications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {volunteers.map(v => (
                <div key={v.id} className="border rounded-lg p-4 space-y-2">
                  <p className="font-semibold">{v.name}</p>
                  <p className="text-sm">{v.email} | {v.phone}</p>
                  <p className="text-sm">{v.city}</p>
                  <p className="text-sm">{v.message}</p>
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

        {/* ===== DONATIONS ===== */}
        {activeTab === 'donations' && (
          <Card>
            <CardHeader><CardTitle>Donations</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {donations.length === 0 && <p className="text-stone-500">No donations yet.</p>}
              {donations.map(d => (
                <div key={d.id} className="border rounded-lg p-4 space-y-1">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm">{d.email} | {d.phone}</p>
                  <p className="text-sm">₹{d.amount} • {d.type}</p>
                  <p className="text-xs">Order: {d.razorpay_order_id || '—'}</p>
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
