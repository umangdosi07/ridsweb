import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, Mail, Trash2, Eye, Menu, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';
import { inquiriesAPI } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('inquiries');

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  /* ================= FETCH INQUIRIES ================= */

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await inquiriesAPI.getAll();
      setInquiries(data);
    } catch (err) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inquiries') fetchInquiries();
  }, [activeTab]);

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-stone-100">

      {/* SIDEBAR */}
      <aside className={`bg-white shadow-xl p-4 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu />
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className="mt-6 flex items-center gap-2 text-stone-700"
        >
          <Mail /> {sidebarOpen && 'Inquiries'}
        </button>

        <button
          onClick={logout}
          className="mt-10 flex items-center gap-2 text-red-500"
        >
          <LogOut /> {sidebarOpen && 'Logout'}
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">

        {activeTab === 'inquiries' && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Contact Inquiries</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 text-center">Loading…</div>
              ) : inquiries.length === 0 ? (
                <div className="p-6 text-center text-stone-500">
                  No inquiries yet
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Subject</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((i) => (
                      <tr key={i.id} className="border-b">
                        <td className="p-3">{i.name}</td>
                        <td className="p-3">{i.email}</td>
                        <td className="p-3">{i.subject}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 text-xs rounded bg-terracotta-100 text-terracotta-700">
                            {i.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toast.info(i.message)}
                          >
                            <Eye size={16} />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500"
                            onClick={async () => {
                              if (!confirm('Delete inquiry?')) return;
                              await inquiriesAPI.delete(i.id);
                              fetchInquiries();
                              toast.success('Deleted');
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
