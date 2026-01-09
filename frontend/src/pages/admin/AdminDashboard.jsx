import React, { useEffect, useState } from 'react';
import { Mail, Users, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

import { inquiriesAPI, volunteersAPI } from '../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */

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
    activeTab === 'inquiries' ? loadInquiries() : loadVolunteers();
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

  /* ================= UI ================= */

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'inquiries' ? 'default' : 'outline'}
          onClick={() => setActiveTab('inquiries')}
        >
          <Mail className="mr-2" size={16} /> Inquiries
        </Button>
        <Button
          variant={activeTab === 'volunteers' ? 'default' : 'outline'}
          onClick={() => setActiveTab('volunteers')}
        >
          <Users className="mr-2" size={16} /> Volunteers
        </Button>
      </div>

      {/* ================= INQUIRIES ================= */}
      {activeTab === 'inquiries' && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p>Loading...</p>}

            {inquiries.map((i) => (
              <div
                key={i.id}
                className="border rounded-lg p-4 space-y-2 flex flex-col md:flex-row md:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-semibold">{i.name}</p>
                  <p className="text-sm text-stone-600">{i.email}</p>
                  <p className="text-sm"><b>Subject:</b> {i.subject}</p>
                  <p className="text-sm text-stone-700">{i.message}</p>
                  <Badge>{i.status}</Badge>
                </div>

                <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                  <Button size="sm" onClick={() => updateInquiryStatus(i.id, 'replied')}>
                    <CheckCircle size={14} className="mr-1" /> Replied
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateInquiryStatus(i.id, 'closed')}>
                    Close
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteInquiry(i.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ================= VOLUNTEERS ================= */}
      {activeTab === 'volunteers' && (
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && <p>Loading...</p>}

            {volunteers.map((v) => (
              <div
                key={v.id}
                className="border rounded-lg p-4 space-y-2 flex flex-col md:flex-row md:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-semibold">{v.name}</p>
                  <p className="text-sm">{v.email} | {v.phone}</p>
                  <p className="text-sm">{v.city}</p>
                  <p className="text-sm"><b>Interest:</b> {v.interest}</p>
                  <p className="text-sm"><b>Availability:</b> {v.availability}</p>
                  <p className="text-sm">{v.experience}</p>
                  <p className="text-sm text-stone-700">{v.message}</p>
                  <Badge>{v.status}</Badge>
                </div>

                <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                  <Button size="sm" onClick={() => updateVolunteerStatus(v.id, 'contacted')}>
                    Contacted
                  </Button>
                  <Button size="sm" onClick={() => updateVolunteerStatus(v.id, 'accepted')}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateVolunteerStatus(v.id, 'rejected')}>
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteVolunteer(v.id)}
                  >
                    <XCircle size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
