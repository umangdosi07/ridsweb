import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Image, Users, Heart, Mail, Calendar, Settings, LogOut, Menu, X, Bell, ChevronDown, Plus, Eye, Edit, Trash2, Search, Filter, MoreVertical, TrendingUp, DollarSign, UserPlus, Activity, UserCog, Shield
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ngoInfo, impactStats, programs, newsArticles, donationTiers, successStories, volunteerOpportunities } from '../../data/mock';
import { toast } from 'sonner';
import { usersAPI, dashboardAPI, programsAPI, storiesAPI, inquiriesAPI, volunteersAPI, donationsAPI } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  
  // Data states
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [creatingUser, setCreatingUser] = useState(false);
  
  // Dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [programsData, setPrograms] = useState([]);
  const [storiesData, setStories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Fetch dashboard data
    fetchDashboardData();
  }, [navigate]);
  
  const fetchDashboardData = async () => {
    try {
      const [stats, recent, progs, stories] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentActivity(),
        programsAPI.getAll(),
        storiesAPI.getAll()
      ]);
      setDashboardData(stats);
      setRecentActivity(recent);
      setPrograms(progs);
      setStories(stories);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
  
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const users = await usersAPI.getAll();
      setAdminUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };
  
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);
  
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill all fields');
      return;
    }
    
    setCreatingUser(true);
    try {
      await usersAPI.create(newUser);
      toast.success('User created successfully!');
      setShowCreateUserModal(false);
      setNewUser({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.detail || 'Failed to create user');
    } finally {
      setCreatingUser(false);
    }
  };
  
  const handleDeleteUser = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to delete ${userEmail}?`)) return;
    
    try {
      await usersAPI.delete(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'programs', label: 'Programs', icon: FileText },
    { id: 'donations', label: 'Donations', icon: Heart },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'stories', label: 'Impact Stories', icon: Activity },
    { id: 'news', label: 'News & Blog', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'inquiries', label: 'Inquiries', icon: Mail },
    { id: 'users', label: 'User Management', icon: UserCog },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Mock data for dashboard
  const dashboardStats = [
    { label: 'Total Donations', value: dashboardData?.donations?.total_amount ? `₹${(dashboardData.donations.total_amount / 100000).toFixed(1)}L` : '₹0', change: `${dashboardData?.donations?.total_count || 0} total`, icon: DollarSign, color: 'bg-terracotta-500' },
    { label: 'Volunteers', value: dashboardData?.volunteers?.total || '0', change: `${dashboardData?.volunteers?.new || 0} new`, icon: Users, color: 'bg-sage-500' },
    { label: 'Inquiries', value: dashboardData?.inquiries?.total || '0', change: `${dashboardData?.inquiries?.new || 0} new`, icon: Mail, color: 'bg-ochre-500' },
    { label: 'Programs', value: dashboardData?.programs?.total || '0', change: `${dashboardData?.programs?.active || 0} active`, icon: Activity, color: 'bg-stone-600' },
  ];

  const recentDonations = recentActivity?.donations || [];

  const recentInquiries = recentActivity?.inquiries || [];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-stone-500 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-stone-800">{stat.value}</p>
                        <p className="text-sm text-sage-600 mt-1">{stat.change} this month</p>
                      </div>
                      <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="text-white" size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Donations */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-heading">Recent Donations</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('donations')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDonations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                        <div>
                          <p className="font-medium text-stone-800">{donation.name}</p>
                          <p className="text-sm text-stone-500">{donation.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-terracotta-600">₹{donation.amount.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${donation.status === 'completed' ? 'bg-sage-100 text-sage-700' : 'bg-ochre-100 text-ochre-700'}`}>
                            {donation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Inquiries */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-heading">Recent Inquiries</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('inquiries')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                        <div>
                          <p className="font-medium text-stone-800">{inquiry.name}</p>
                          <p className="text-sm text-stone-500">{inquiry.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-stone-500">{inquiry.date}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${inquiry.status === 'new' ? 'bg-terracotta-100 text-terracotta-700' : 'bg-stone-100 text-stone-600'}`}>
                            {inquiry.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Add Program', icon: Plus, color: 'bg-terracotta-100 text-terracotta-600' },
                    { label: 'New Blog Post', icon: FileText, color: 'bg-sage-100 text-sage-600' },
                    { label: 'Upload Gallery', icon: Image, color: 'bg-ochre-100 text-ochre-600' },
                    { label: 'Add Story', icon: Heart, color: 'bg-stone-100 text-stone-600' },
                  ].map((action, index) => (
                    <button
                      key={index}
                      className={`p-4 rounded-xl ${action.color} hover:opacity-80 transition-opacity flex flex-col items-center gap-2`}
                    >
                      <action.icon size={24} />
                      <span className="text-sm font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'programs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-stone-800">Programs Management</h2>
              <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white">
                <Plus className="mr-2" size={18} />
                Add Program
              </Button>
            </div>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-stone-50 border-b border-stone-100">
                      <tr>
                        <th className="text-left p-4 font-medium text-stone-600">Program</th>
                        <th className="text-left p-4 font-medium text-stone-600">Category</th>
                        <th className="text-left p-4 font-medium text-stone-600">Beneficiaries</th>
                        <th className="text-left p-4 font-medium text-stone-600">Status</th>
                        <th className="text-left p-4 font-medium text-stone-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map((program) => (
                        <tr key={program.id} className="border-b border-stone-50 hover:bg-stone-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={program.image} alt={program.title} className="w-12 h-12 rounded-lg object-cover" />
                              <span className="font-medium text-stone-800">{program.title}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-sm">
                              {program.category}
                            </span>
                          </td>
                          <td className="p-4 text-stone-600">{program.beneficiaries.toLocaleString()}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm">Active</span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon"><Eye size={16} /></Button>
                              <Button variant="ghost" size="icon"><Edit size={16} /></Button>
                              <Button variant="ghost" size="icon" className="text-red-500"><Trash2 size={16} /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'donations':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-stone-800">Donations</h2>
              <Button variant="outline">
                <Filter className="mr-2" size={18} />
                Filter
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-white">
                <CardContent className="p-6">
                  <p className="text-terracotta-100">Total Collected</p>
                  <p className="text-4xl font-bold mt-2">₹12,50,000</p>
                  <p className="text-terracotta-100 text-sm mt-2">This year</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-sage-500 to-sage-600 text-white">
                <CardContent className="p-6">
                  <p className="text-sage-100">Monthly Donors</p>
                  <p className="text-4xl font-bold mt-2">45</p>
                  <p className="text-sage-100 text-sm mt-2">Recurring</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-ochre-500 to-ochre-600 text-white">
                <CardContent className="p-6">
                  <p className="text-ochre-100">Average Donation</p>
                  <p className="text-4xl font-bold mt-2">₹2,500</p>
                  <p className="text-ochre-100 text-sm mt-2">Per donor</p>
                </CardContent>
              </Card>
            </div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>All Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-500 text-center py-8">Donation records will appear here when integrated with payment gateway</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'volunteers':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-stone-800">Volunteer Applications</h2>
            </div>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="text-stone-500 text-center py-8">Volunteer applications will appear here</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'stories':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-stone-800">Impact Stories</h2>
              <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white">
                <Plus className="mr-2" size={18} />
                Add Story
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story) => (
                <Card key={story.id} className="border-0 shadow-lg overflow-hidden">
                  <img src={story.image} alt={story.name} className="w-full h-40 object-cover" />
                  <CardContent className="p-4">
                    <h3 className="font-bold text-stone-800">{story.name}</h3>
                    <p className="text-sm text-stone-500">{story.location}</p>
                    <p className="text-sm text-stone-600 mt-2 line-clamp-2">{story.story}</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm"><Edit size={14} className="mr-1" /> Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-500"><Trash2 size={14} /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-stone-800">News & Blog</h2>
              <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white">
                <Plus className="mr-2" size={18} />
                New Post
              </Button>
            </div>
            <div className="grid gap-4">
              {newsArticles.map((article) => (
                <Card key={article.id} className="border-0 shadow-lg">
                  <CardContent className="p-4 flex items-center gap-4">
                    <img src={article.image} alt={article.title} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-bold text-stone-800">{article.title}</h3>
                      <p className="text-sm text-stone-500">{article.date} • {article.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon"><Eye size={16} /></Button>
                      <Button variant="ghost" size="icon"><Edit size={16} /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500"><Trash2 size={16} /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-stone-800">Gallery Management</h2>
              <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white">
                <Plus className="mr-2" size={18} />
                Upload Images
              </Button>
            </div>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="text-stone-500 text-center py-8">Gallery images will be manageable here</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'inquiries':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-stone-800">Contact Inquiries</h2>
            </div>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="text-stone-500 text-center py-8">Contact form submissions will appear here</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-bold text-stone-800">User Management</h2>
              <Button 
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white"
                onClick={() => setShowCreateUserModal(true)}
              >
                <Plus className="mr-2" size={18} />
                Add New User
              </Button>
            </div>
            
            {/* Create User Modal */}
            {showCreateUserModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md mx-4 border-0 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus size={20} />
                      Create New Admin User
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName">Full Name *</Label>
                        <Input
                          id="userName"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userEmail">Email Address *</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userPassword">Password *</Label>
                        <Input
                          id="userPassword"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          placeholder="Enter password"
                          required
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setShowCreateUserModal(false);
                            setNewUser({ name: '', email: '', password: '' });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-terracotta-600 hover:bg-terracotta-700 text-white"
                          disabled={creatingUser}
                        >
                          {creatingUser ? 'Creating...' : 'Create User'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Users List */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                {loadingUsers ? (
                  <div className="p-8 text-center text-stone-500">Loading users...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-stone-50 border-b border-stone-100">
                        <tr>
                          <th className="text-left p-4 font-medium text-stone-600">User</th>
                          <th className="text-left p-4 font-medium text-stone-600">Email</th>
                          <th className="text-left p-4 font-medium text-stone-600">Role</th>
                          <th className="text-left p-4 font-medium text-stone-600">Created</th>
                          <th className="text-left p-4 font-medium text-stone-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-stone-500">
                              No users found. Click "Add New User" to create one.
                            </td>
                          </tr>
                        ) : (
                          adminUsers.map((adminUser) => (
                            <tr key={adminUser.id} className="border-b border-stone-50 hover:bg-stone-50">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center">
                                    <span className="text-terracotta-600 font-medium">
                                      {adminUser.name?.charAt(0).toUpperCase() || 'A'}
                                    </span>
                                  </div>
                                  <span className="font-medium text-stone-800">{adminUser.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-stone-600">{adminUser.email}</td>
                              <td className="p-4">
                                <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm flex items-center gap-1 w-fit">
                                  <Shield size={12} />
                                  {adminUser.role}
                                </span>
                              </td>
                              <td className="p-4 text-stone-500 text-sm">
                                {adminUser.created_at ? new Date(adminUser.created_at).toLocaleDateString() : '-'}
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(adminUser.id, adminUser.email)}
                                    title="Delete user"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-stone-50 to-sage-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="text-sage-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-stone-800 mb-1">Admin Access</h3>
                    <p className="text-stone-600 text-sm">
                      All admin users have full access to manage content, view donations, handle inquiries, 
                      and manage volunteer applications. Be careful when granting admin access.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-stone-800">Settings</h2>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="text-stone-500 text-center py-8">Settings panel coming soon</p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-xl transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20'
      }`}>
        {/* Logo */}
        <div className="p-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-terracotta-500 to-ochre-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-heading font-bold text-stone-800">RIDS</h2>
                <p className="text-xs text-stone-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-terracotta-50 text-terracotta-600'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-stone-100"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="font-heading font-bold text-stone-800 capitalize">{activeTab}</h1>
                <p className="text-sm text-stone-500">Manage your NGO dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-stone-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-terracotta-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-50">
                <div className="w-8 h-8 rounded-full bg-terracotta-200 flex items-center justify-center">
                  <span className="text-terracotta-600 font-medium text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="text-sm font-medium text-stone-700">{user?.email || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
