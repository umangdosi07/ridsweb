import React, { useEffect, useState } from 'react';
import {
  Mail,
  Users,
  Heart,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

import {
  inquiriesAPI,
  volunteersAPI,
  donationsAPI
} from '../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [loading, setLoading] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [donations, setDonations] = useState([]);

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

  const deleteItem = async (type, id) => {
    if (!confirm('Are you sure?')) return;

    try {
      if (type === 'inquiry') await inquiriesAPI.delete(id);
      if (type === 'volunteer') await volunteersAPI.delete(id);
      if (type === 'donation') await donationsAPI.delete(id);

      toast.success('Deleted successfully');

      if (type === 'inquiry') loadInquiries();
      if (type === 'volunteer') loadVolunteers();
      if (type === 'donation') loadDonations();
    } catch {
      toast.error('Delete failed');
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeTab === 'inquiries' ? 'default' : 'outline'}
          onClick={() => setActiveTab('inquiries')}
        >
          <Mail size={16} className="mr-2" /> Inquiries
        </Button>

        <Button
          variant={activeTab === 'volunteers' ? 'default' : 'outline'}
          onClick={() => setActiveTab('volunteers')}
        >
          <Users size={16} className="mr-2" /> Volunteers
        </Button>

        <Button
          variant={activeTab === 'donations' ? 'default' : 'outline'}
          onClick={() => setActiveTab('donations')}
        >
          <Heart size={16} className="mr-2" /> Donations
        </Button>
      </div>

      {/* ================= INQUIRIES ================= */}
      {activeTab === 'inquiries' && (
        <Card>
          <CardHeader><CardTitle>Contact Inquiries</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loading && <p>Loading...</p>}

            {inquiries.map(i => (
              <div key={i.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <p className="font-semibold">{i.name}</p>
                  <p className="text-sm">{i.email}</p>
                  <p className="text-sm"><b>Subject:</b> {i.subject}</p>
                  <p className="text-sm">{i.message}</p>
                  <Badge>{i.status}</Badge>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteItem('inquiry', i.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ================= VOLUNTEERS ================= */}
      {activeTab === 'volunteers' && (
        <Card>
          <CardHeader><CardTitle>Volunteer Applications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loading && <p>Loading...</p>}

            {volunteers.map(v => (
              <div key={v.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <p className="font-semibold">{v.name}</p>
                  <p className="text-sm">{v.email} | {v.phone}</p>
                  <p className="text-sm">{v.city}</p>
                  <p className="text-sm"><b>Interest:</b> {v.interest}</p>
                  <p className="text-sm">{v.message}</p>
                  <Badge>{v.status}</Badge>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteItem('volunteer', v.id)}
                >
                  <XCircle size={14} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ================= DONATIONS ================= */}
      {activeTab === 'donations' && (
        <Card>
          <CardHeader><CardTitle>Donations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loading && <p>Loading...</p>}

            {donations.map(d => (
              <div key={d.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm">{d.email}</p>
                  <p className="text-sm"><b>Amount:</b> ₹{d.amount}</p>
                  <p className="text-sm"><b>Program:</b> {d.program}</p>
                  <Badge>{d.status}</Badge>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteItem('donation', d.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
