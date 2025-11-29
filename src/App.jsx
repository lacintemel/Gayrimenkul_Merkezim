import React, { useState, useEffect } from 'react';
import { Home, Wrench, DollarSign, Bell, FileText, MessageSquare, User, LogOut, Menu, X, Loader2 } from 'lucide-react';

// Mock API services (replace with actual API calls)
const mockAuthService = {
  login: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const user = {
        id: 1,
        name: 'John Doe',
        email: email,
        role: 'resident',
        unitNumber: '4B'
      };
      const accessToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, accessToken };
    }
    throw new Error('Invalid credentials');
  },
  
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('Not authenticated');
    return JSON.parse(userStr);
  }
};

const mockMaintenanceService = {
  getRequests: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { id: 1, title: 'Leaky Faucet', status: 'In Progress', date: 'Nov 20', category: 'Plumbing', description: 'Kitchen sink is dripping' },
      { id: 2, title: 'AC Not Working', status: 'Pending', date: 'Nov 23', category: 'HVAC', description: 'AC unit not cooling properly' },
    ];
  },
  
  createRequest: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now(),
      ...data,
      status: 'Pending',
      date: new Date().toLocaleDateString()
    };
  }
};

const mockPaymentService = {
  getPayments: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { id: 1, amount: 1200, date: '2024-11-01', type: 'Rent', status: 'Paid', method: 'Bank Transfer', receiptUrl: null },
      { id: 2, amount: 1200, date: '2024-10-01', type: 'Rent', status: 'Paid', method: 'Cash', receiptUrl: 'receipt-oct.pdf' },
      { id: 3, amount: 1200, date: '2024-09-01', type: 'Rent', status: 'Paid', method: 'Bank Transfer', receiptUrl: null },
      { id: 4, amount: 150, date: '2024-08-15', type: 'Utilities', status: 'Paid', method: 'Cash', receiptUrl: null },
    ];
  },
  
  getUpcomingPayments: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      { id: 5, amount: 1200, dueDate: '2024-12-01', type: 'Rent', status: 'Pending' },
    ];
  },
  
  uploadReceipt: async (paymentId, file) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      receiptUrl: `receipt-${paymentId}-${Date.now()}.pdf`,
      uploadedAt: new Date().toISOString()
    };
  }
};

const mockAnnouncementService = {
  getAnnouncements: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      {
        id: 1,
        title: 'Pool Maintenance Scheduled',
        date: '2 days ago',
        content: 'The pool will be closed for maintenance on Dec 1-3. We apologize for any inconvenience.',
        author: 'Property Management',
        priority: 'medium',
        createdAt: '2024-11-26'
      },
      {
        id: 2,
        title: 'Holiday Office Hours',
        date: '5 days ago',
        content: 'Office will be closed on Thanksgiving Day. Emergency maintenance can be reached at (555) 123-4567.',
        author: 'Property Management',
        priority: 'high',
        createdAt: '2024-11-23'
      },
      {
        id: 3,
        title: 'New Parking Rules',
        date: '1 week ago',
        content: 'Starting December 1st, all vehicles must display a parking permit. Please contact the office to obtain yours.',
        author: 'Property Management',
        priority: 'high',
        createdAt: '2024-11-21'
      },
      {
        id: 4,
        title: 'Community Event - Holiday Party',
        date: '2 weeks ago',
        content: 'Join us for our annual holiday party on December 15th at 6 PM in the community room. RSVP by December 10th.',
        author: 'Property Management',
        priority: 'low',
        createdAt: '2024-11-14'
      },
    ];
  }
};

const mockDocumentService = {
  getDocuments: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return [
      {
        id: 1,
        name: 'Lease Agreement 2024.pdf',
        type: 'Lease Agreement',
        size: '2.4 MB',
        uploadedBy: 'Property Management',
        uploadedAt: '2024-01-15',
        fileType: 'pdf'
      },
      {
        id: 2,
        name: 'Building Rules and Regulations.pdf',
        type: 'Policy Document',
        size: '1.8 MB',
        uploadedBy: 'Property Management',
        uploadedAt: '2024-01-15',
        fileType: 'pdf'
      },
      {
        id: 3,
        name: 'Parking Permit Application.pdf',
        type: 'Form',
        size: '512 KB',
        uploadedBy: 'Property Management',
        uploadedAt: '2024-11-20',
        fileType: 'pdf'
      },
      {
        id: 4,
        name: 'Payment Receipt November.pdf',
        type: 'Receipt',
        size: '256 KB',
        uploadedBy: 'John Doe',
        uploadedAt: '2024-11-05',
        fileType: 'pdf'
      },
      {
        id: 5,
        name: 'Move-in Inspection Checklist.pdf',
        type: 'Inspection',
        size: '1.2 MB',
        uploadedBy: 'Property Management',
        uploadedAt: '2024-01-10',
        fileType: 'pdf'
      },
    ];
  },
  
  uploadDocument: async (file, metadata) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      id: Date.now(),
      name: file.name,
      type: metadata.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: 'John Doe',
      uploadedAt: new Date().toISOString().split('T')[0],
      fileType: file.name.split('.').pop()
    };
  },
  
  deleteDocument: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

const mockMessageService = {
  getConversations: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      {
        id: 1,
        participant: {
          id: 2,
          name: 'Property Manager',
          role: 'manager',
          avatar: null
        },
        lastMessage: 'I\'ll send someone to check on that tomorrow.',
        lastMessageTime: '2024-11-28T10:30:00',
        unreadCount: 2
      },
      {
        id: 2,
        participant: {
          id: 3,
          name: 'Maintenance Team',
          role: 'manager',
          avatar: null
        },
        lastMessage: 'We\'ve completed the repair in your unit.',
        lastMessageTime: '2024-11-27T15:45:00',
        unreadCount: 0
      },
    ];
  },
  
  getMessages: async (conversationId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const messageData = {
      1: [
        {
          id: 1,
          senderId: 1,
          senderName: 'John Doe',
          content: 'Hi, I have a question about the parking policy.',
          timestamp: '2024-11-27T09:00:00',
          isRead: true
        },
        {
          id: 2,
          senderId: 2,
          senderName: 'Property Manager',
          content: 'Of course! What would you like to know?',
          timestamp: '2024-11-27T09:15:00',
          isRead: true
        },
        {
          id: 3,
          senderId: 1,
          senderName: 'John Doe',
          content: 'Can I get a second parking permit for my spouse?',
          timestamp: '2024-11-27T09:20:00',
          isRead: true
        },
        {
          id: 4,
          senderId: 2,
          senderName: 'Property Manager',
          content: 'Yes, you can request an additional permit. Please fill out the form in the Documents section.',
          timestamp: '2024-11-28T10:00:00',
          isRead: true
        },
        {
          id: 5,
          senderId: 1,
          senderName: 'John Doe',
          content: 'Great! Also, could you check on the heating in unit 4B? It seems to not be working properly.',
          timestamp: '2024-11-28T10:15:00',
          isRead: true
        },
        {
          id: 6,
          senderId: 2,
          senderName: 'Property Manager',
          content: 'I\'ll send someone to check on that tomorrow.',
          timestamp: '2024-11-28T10:30:00',
          isRead: false
        },
      ],
      2: [
        {
          id: 7,
          senderId: 1,
          senderName: 'John Doe',
          content: 'Thank you for fixing the leak!',
          timestamp: '2024-11-27T15:30:00',
          isRead: true
        },
        {
          id: 8,
          senderId: 3,
          senderName: 'Maintenance Team',
          content: 'We\'ve completed the repair in your unit.',
          timestamp: '2024-11-27T15:45:00',
          isRead: true
        },
      ]
    };
    
    return messageData[conversationId] || [];
  },
  
  sendMessage: async (conversationId, content) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: Date.now(),
      senderId: 1,
      senderName: 'John Doe',
      content: content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
  }
};

const mockUserService = {
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      unitNumber: '4B',
      building: 'Sunset Apartments',
      moveInDate: '2024-01-15',
      leaseEndDate: '2025-01-14',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '(555) 987-6543',
        relationship: 'Spouse'
      }
    };
  },
  
  updateProfile: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, ...data };
  },
  
  changePassword: async (currentPassword, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (currentPassword === 'wrong') {
      throw new Error('Current password is incorrect');
    }
    return { success: true };
  }
};

// Auth Store Hook
const useAuthStore = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const currentUser = await mockAuthService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email, password) => {
    try {
      const { user: loggedInUser } = await mockAuthService.login(email, password);
      setUser(loggedInUser);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await mockAuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return { user, loading, login, logout };
};

// Login Component
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await onLogin(email, password);
    } catch (err) {
      setError('Invalid credentials. Try any email/password to demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Resident Center</h1>
          <p className="text-gray-600 mt-2">Welcome back! Please login to your account.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ currentPage, onNavigate, onLogout, isMobile, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'maintenance', icon: Wrench, label: 'Maintenance' },
    { id: 'payments', icon: DollarSign, label: 'Payments' },
    { id: 'announcements', icon: Bell, label: 'Announcements' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center">
              <Home className="text-white" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Resident</h2>
              <p className="text-xs text-gray-500">Center</p>
            </div>
          </div>
          {isMobile && (
            <button onClick={onClose} className="lg:hidden">
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              if (isMobile) onClose();
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              currentPage === item.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      {sidebarContent}
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [announcementsData, requestsData] = await Promise.all([
          mockAnnouncementService.getAnnouncements(),
          mockMaintenanceService.getRequests()
        ]);
        setAnnouncements(announcementsData);
        setRequests(requestsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: 'Open Requests', value: requests.filter(r => r.status !== 'Completed').length, color: 'bg-orange-100 text-orange-600' },
    { label: 'Pending Payments', value: '$1,200', color: 'bg-red-100 text-red-600' },
    { label: 'New Messages', value: '3', color: 'bg-blue-100 text-blue-600' },
    { label: 'Documents', value: '8', color: 'bg-green-100 text-green-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 mt-1">Unit {user.unitNumber} • Here's what's happening today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.color} mb-4`}>
              <span className="text-xl font-bold">{stat.value}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Announcements</h2>
            <Bell className="text-indigo-600" size={20} />
          </div>
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No announcements yet</p>
            ) : (
              announcements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-indigo-600 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{announcement.date}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Maintenance Requests */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Maintenance Requests</h2>
            <Wrench className="text-indigo-600" size={20} />
          </div>
          <div className="space-y-3">
            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No maintenance requests</p>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.title}</h3>
                    <p className="text-xs text-gray-500">{request.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700'
                        : request.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            + New Request
          </button>
        </div>
      </div>
    </div>
  );
};

// Profile Page
const ProfilePage = ({ user: currentUser }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await mockUserService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User size={48} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
            <p className="text-indigo-100 mb-1">{profile.email}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Unit {profile.unitNumber}
              </span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {profile.building}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-1">
            {['personal', 'unit', 'security'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition border-b-2 ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'personal' && (
            <PersonalInfoTab 
              profile={profile} 
              editMode={editMode}
              setEditMode={setEditMode}
              setProfile={setProfile}
            />
          )}
          {activeTab === 'unit' && <UnitInfoTab profile={profile} />}
          {activeTab === 'security' && (
            <SecurityTab onChangePassword={() => setShowPasswordModal(true)} />
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

// Personal Info Tab
const PersonalInfoTab = ({ profile, editMode, setEditMode, setProfile }) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    emergencyContactName: profile.emergencyContact.name,
    emergencyContactPhone: profile.emergencyContact.phone,
    emergencyContactRelationship: profile.emergencyContact.relationship
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await mockUserService.updateProfile(formData);
      setProfile({
        ...profile,
        ...formData,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        }
      });
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditMode(false);
                setFormData({
                  name: profile.name,
                  email: profile.email,
                  phone: profile.phone,
                  emergencyContactName: profile.emergencyContact.name,
                  emergencyContactPhone: profile.emergencyContact.phone,
                  emergencyContactRelationship: profile.emergencyContact.relationship
                });
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!editMode}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!editMode}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!editMode}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Emergency Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              disabled={!editMode}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
              disabled={!editMode}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
            <input
              type="text"
              value={formData.emergencyContactRelationship}
              onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
              disabled={!editMode}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Unit Info Tab
const UnitInfoTab = ({ profile }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Unit Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Home className="text-indigo-600" size={24} />
            <h4 className="font-semibold text-gray-900">Unit Details</h4>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Unit Number</p>
              <p className="text-lg font-semibold text-gray-900">{profile.unitNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Building</p>
              <p className="text-sm font-medium text-gray-900">{profile.building}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-indigo-600" size={24} />
            <h4 className="font-semibold text-gray-900">Lease Information</h4>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Move-in Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(profile.moveInDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Lease End Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(profile.leaseEndDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Bell className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Lease Renewal</p>
            <p className="text-sm text-blue-700">
              Your lease expires in {Math.ceil((new Date(profile.leaseEndDate) - new Date()) / (1000 * 60 * 60 * 24))} days. 
              Contact property management to discuss renewal options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Security Tab
const SecurityTab = ({ onChangePassword }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Password</h4>
              <p className="text-sm text-gray-600">Last changed 3 months ago</p>
            </div>
          </div>
          <button
            onClick={onChangePassword}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-900 mb-1">Security Tip</p>
            <p className="text-sm text-yellow-700">
              Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Change Password Modal
const ChangePasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      await mockUserService.changePassword(formData.currentPassword, formData.newPassword);
      alert('Password changed successfully!');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Confirm new password"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Saving...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
const MessagesPage = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await mockMessageService.getConversations();
      setConversations(data);
      if (data.length > 0) {
        setSelectedConversation(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const data = await mockMessageService.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const sentMessage = await mockMessageService.sendMessage(selectedConversation.id, newMessage);
      setMessages([...messages, sentMessage]);
      setNewMessage('');
      
      // Update last message in conversation
      setConversations(conversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage, lastMessageTime: sentMessage.timestamp }
          : conv
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversations List */}
      <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="mr-2" size={24} />
            Messages
          </h2>
          <p className="text-sm text-gray-600 mt-1">{conversations.length} conversations</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="mx-auto text-gray-400 mb-3" size={40} />
              <p className="text-sm text-gray-600">No conversations yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                    selectedConversation?.id === conv.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="text-indigo-600" size={24} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conv.participant.name}
                        </h3>
                        {conv.unreadCount > 0 && (
                          <span className="bg-indigo-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatMessageTime(conv.lastMessageTime)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{selectedConversation.participant.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{selectedConversation.participant.role}</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600">No messages yet. Start a conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwnMessage = message.senderId === user.id;
                const showDateDivider = index === 0 || 
                  new Date(messages[index - 1].timestamp).toDateString() !== new Date(message.timestamp).toDateString();

                return (
                  <div key={message.id}>
                    {showDateDivider && (
                      <div className="flex items-center justify-center my-4">
                        <span className="bg-white px-4 py-1 rounded-full text-xs text-gray-500 border border-gray-200">
                          {new Date(message.timestamp).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        {!isOwnMessage && (
                          <p className="text-xs text-gray-500 mb-1 px-1">{message.senderName}</p>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            isOwnMessage
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        <p className={`text-xs text-gray-400 mt-1 px-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                disabled={sending}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {sending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Send
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};
const DocumentsPage = ({ user }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await mockDocumentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file, metadata) => {
    try {
      const newDoc = await mockDocumentService.uploadDocument(file, metadata);
      setDocuments([newDoc, ...documents]);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Failed to upload document:', error);
      alert('Failed to upload document');
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await mockDocumentService.deleteDocument(docId);
      setDocuments(documents.filter(doc => doc.id !== docId));
      setSelectedDocument(null);
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.type === filter;
  });

  const documentTypes = ['all', ...new Set(documents.map(doc => doc.type))];

  const getFileIcon = (fileType) => {
    const iconClass = "w-12 h-12";
    switch (fileType) {
      case 'pdf':
        return <div className={`${iconClass} bg-red-100 rounded-lg flex items-center justify-center`}>
          <FileText className="text-red-600" size={24} />
        </div>;
      case 'doc':
      case 'docx':
        return <div className={`${iconClass} bg-blue-100 rounded-lg flex items-center justify-center`}>
          <FileText className="text-blue-600" size={24} />
        </div>;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <div className={`${iconClass} bg-purple-100 rounded-lg flex items-center justify-center`}>
          <FileText className="text-purple-600" size={24} />
        </div>;
      default:
        return <div className={`${iconClass} bg-gray-100 rounded-lg flex items-center justify-center`}>
          <FileText className="text-gray-600" size={24} />
        </div>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Access and manage your important documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg flex items-center"
        >
          <FileText size={20} className="mr-2" />
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{documents.length}</p>
            </div>
            <FileText className="text-indigo-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lease Documents</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {documents.filter(d => d.type === 'Lease Agreement').length}
              </p>
            </div>
            <Home className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receipts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {documents.filter(d => d.type === 'Receipt').length}
              </p>
            </div>
            <DollarSign className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {documents.reduce((sum, doc) => sum + parseFloat(doc.size), 0).toFixed(1)} MB
              </p>
            </div>
            <FileText className="text-orange-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {documentTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                filter === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type === 'all' ? 'All Documents' : type}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition ${
              viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Documents Grid/List */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-6">Upload your first document to get started</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Upload Document
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map(doc => (
            <div
              key={doc.id}
              onClick={() => setSelectedDocument(doc)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                {getFileIcon(doc.fileType)}
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {doc.type}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                {doc.name}
              </h3>
              
              <div className="space-y-1 text-xs text-gray-500">
                <p className="flex items-center gap-1">
                  <User size={12} />
                  {doc.uploadedBy}
                </p>
                <p>{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Document</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Size</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Uploaded By</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.fileType)}
                      <span className="font-medium text-gray-900 text-sm">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.size}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadedBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedDocument(doc)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadDocumentModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}

      {/* Document Details Modal */}
      {selectedDocument && (
        <DocumentDetailsModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

// Upload Document Modal
const UploadDocumentModal = ({ onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('Receipt');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const documentTypes = ['Receipt', 'Lease Agreement', 'Policy Document', 'Form', 'Inspection', 'Other'];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      await onUpload(file, { type: documentType });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
            }`}
          >
            {file ? (
              <div className="space-y-4">
                <FileText className="mx-auto text-indigo-600" size={48} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-sm text-gray-600 mb-2">Drag and drop your document here, or</p>
                <label className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 cursor-pointer transition">
                  Browse Files
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-400 mt-2">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
              </>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Uploading...
              </>
            ) : (
              'Upload Document'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Document Details Modal
const DocumentDetailsModal = ({ document, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Document Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {document.fileType === 'pdf' ? (
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-red-600" size={32} />
                </div>
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600" size={32} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{document.name}</h3>
              <span className="inline-block text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {document.type}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">File Size</p>
              <p className="text-sm font-medium text-gray-900">{document.size}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">File Type</p>
              <p className="text-sm font-medium text-gray-900 uppercase">{document.fileType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Uploaded By</p>
              <p className="text-sm font-medium text-gray-900">{document.uploadedBy}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Upload Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(document.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={() => onDelete(document.id)}
            className="px-6 py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
          >
            Delete
          </button>
          <button
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
const AnnouncementsPage = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await mockAnnouncementService.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'all') return true;
    return announcement.priority === filter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Stay updated with the latest news from property management</p>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg">
          <Bell size={20} className="inline mr-2" />
          <span className="font-semibold">{announcements.length} Total</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'high', 'medium', 'low'].map(priority => (
          <button
            key={priority}
            onClick={() => setFilter(priority)}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              filter === priority
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {priority !== 'all' && <span>{getPriorityIcon(priority)}</span>}
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">Check back later for updates from property management</p>
          </div>
        ) : (
          filteredAnnouncements.map(announcement => (
            <div
              key={announcement.id}
              onClick={() => setSelectedAnnouncement(announcement)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer overflow-hidden"
            >
              <div className={`h-2 ${
                announcement.priority === 'high' ? 'bg-red-500' :
                announcement.priority === 'medium' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <User size={14} />
                      {announcement.author} • {announcement.date}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{announcement.content}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                    Read more
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Announcement Details Modal */}
      {selectedAnnouncement && (
        <AnnouncementDetailsModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </div>
  );
};

// Announcement Details Modal
const AnnouncementDetailsModal = ({ announcement, onClose }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`h-3 ${
          announcement.priority === 'high' ? 'bg-red-500' :
          announcement.priority === 'medium' ? 'bg-yellow-500' :
          'bg-blue-500'
        }`} />
        
        <div className="p-6 border-b border-gray-200 flex items-start justify-between sticky top-0 bg-white">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{announcement.title}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                {announcement.priority.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <User size={14} />
              {announcement.author}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Bell size={16} />
              <span>Posted {announcement.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(announcement.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {announcement.content}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Need more information?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Contact property management if you have any questions about this announcement.
            </p>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
              <MessageSquare size={16} className="mr-2" />
              Send a message
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
const PaymentsPage = ({ user }) => {
  const [payments, setPayments] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const [paymentsData, upcomingData] = await Promise.all([
        mockPaymentService.getPayments(),
        mockPaymentService.getUpcomingPayments()
      ]);
      setPayments(paymentsData);
      setUpcomingPayments(upcomingData);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadReceipt = async (paymentId, file) => {
    try {
      const result = await mockPaymentService.uploadReceipt(paymentId, file);
      setPayments(payments.map(p => 
        p.id === paymentId ? { ...p, receiptUrl: result.receiptUrl, status: 'Under Review' } : p
      ));
      setShowUploadModal(false);
    } catch (error) {
      console.error('Failed to upload receipt:', error);
      alert('Failed to upload receipt');
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status.toLowerCase() === filter;
  });

  const totalPaid = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-1">Track your payment history and upcoming dues</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={32} />
            <span className="text-green-100 text-sm">Total Paid</span>
          </div>
          <p className="text-3xl font-bold">${totalPaid.toLocaleString()}</p>
          <p className="text-green-100 text-sm mt-1">This year</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Bell size={32} />
            <span className="text-orange-100 text-sm">Upcoming</span>
          </div>
          <p className="text-3xl font-bold">${upcomingPayments.reduce((sum, p) => sum + p.amount, 0)}</p>
          <p className="text-orange-100 text-sm mt-1">Due this month</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <FileText size={32} />
            <span className="text-blue-100 text-sm">Receipts</span>
          </div>
          <p className="text-3xl font-bold">{payments.filter(p => p.receiptUrl).length}</p>
          <p className="text-blue-100 text-sm mt-1">Uploaded</p>
        </div>
      </div>

      {/* Upcoming Payments */}
      {upcomingPayments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Bell className="mr-2 text-orange-500" size={24} />
              Upcoming Payments
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <h3 className="font-semibold text-gray-900">{payment.type}</h3>
                  <p className="text-sm text-gray-600">Due: {new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${payment.amount}</p>
                  <button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowUploadModal(true);
                    }}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Upload Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
        <div className="flex gap-2">
          {['all', 'paid', 'pending'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedPayment(payment)}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{payment.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">${payment.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.method}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'Under Review'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {payment.receiptUrl ? (
                        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                          <FileText size={16} className="mr-1" />
                          View
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPayment(payment);
                            setShowUploadModal(true);
                          }}
                          className="text-gray-400 hover:text-indigo-600 text-sm font-medium"
                        >
                          Upload
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Receipt Modal */}
      {showUploadModal && selectedPayment && (
        <UploadReceiptModal
          payment={selectedPayment}
          onClose={() => {
            setShowUploadModal(false);
            setSelectedPayment(null);
          }}
          onUpload={handleUploadReceipt}
        />
      )}

      {/* Payment Details Modal */}
      {selectedPayment && !showUploadModal && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};

// Upload Receipt Modal
const UploadReceiptModal = ({ payment, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      await onUpload(payment.id, file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Upload Receipt</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Payment Type:</span>
              <span className="text-sm font-semibold text-gray-900">{payment.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="text-sm font-semibold text-gray-900">${payment.amount}</span>
            </div>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
            }`}
          >
            {file ? (
              <div className="space-y-4">
                <FileText className="mx-auto text-indigo-600" size={48} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-sm text-gray-600 mb-2">Drag and drop your receipt here, or</p>
                <label className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 cursor-pointer transition">
                  Browse Files
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG up to 10MB</p>
              </>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Uploading...
              </>
            ) : (
              'Upload Receipt'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Payment Details Modal
const PaymentDetailsModal = ({ payment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">${payment.amount}</h3>
              <p className="text-sm text-gray-600 mt-1">{payment.type}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              payment.status === 'Paid'
                ? 'bg-green-100 text-green-700'
                : payment.status === 'Under Review'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {payment.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Payment Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(payment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="text-sm font-medium text-gray-900">{payment.method}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment ID</p>
              <p className="text-sm font-medium text-gray-900">#{payment.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Receipt</p>
              {payment.receiptUrl ? (
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  View Receipt
                </button>
              ) : (
                <p className="text-sm font-medium text-gray-400">Not uploaded</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
const MaintenancePage = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await mockMaintenanceService.getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (newRequest) => {
    try {
      const created = await mockMaintenanceService.createRequest(newRequest);
      setRequests([created, ...requests]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status.toLowerCase().replace(' ', '-') === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-600 mt-1">Track and manage your maintenance requests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg flex items-center"
        >
          <Wrench size={20} className="mr-2" />
          New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'in-progress', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRequests.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl shadow-sm p-12 text-center">
            <Wrench className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600 mb-6">Create your first maintenance request to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Create Request
            </button>
          </div>
        ) : (
          filteredRequests.map(request => (
            <div
              key={request.id}
              onClick={() => setSelectedRequest(request)}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{request.title}</h3>
                  <p className="text-sm text-gray-500">{request.category}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-700'
                      : request.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {request.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{request.description}</p>
              <div className="text-xs text-gray-400">Submitted on {request.date}</div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateRequestModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRequest}
        />
      )}

      {/* View Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

// Create Request Modal
const CreateRequestModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Plumbing',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural', 'Other'];

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await onCreate(formData);
    } catch (error) {
      alert('Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">New Maintenance Request</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="e.g., Leaky kitchen faucet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              placeholder="Please describe the issue in detail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition cursor-pointer">
              <FileText className="mx-auto text-gray-400 mb-2" size={40} />
              <p className="text-sm text-gray-600">Click to upload photos</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Creating...
              </>
            ) : (
              'Create Request'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Request Details Modal
const RequestDetailsModal = ({ request, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{request.title}</h3>
              <p className="text-sm text-gray-500">{request.category}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                request.status === 'In Progress'
                  ? 'bg-blue-100 text-blue-700'
                  : request.status === 'Completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {request.status}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700">{request.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Submitted</p>
              <p className="text-sm font-medium text-gray-900">{request.date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Request ID</p>
              <p className="text-sm font-medium text-gray-900">#{request.id}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Activity</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Request submitted</p>
                  <p className="text-xs text-gray-500">{request.date}</p>
                </div>
              </div>
              {request.status !== 'Pending' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Status changed to {request.status}</p>
                    <p className="text-xs text-gray-500">{request.date}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { user, loading, login, logout } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={logout}
        isMobile={true}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={logout}
        isMobile={false}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="font-bold text-gray-900">Resident Center</h1>
            <div className="w-6" />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {currentPage === 'dashboard' && <Dashboard user={user} />}
          {currentPage === 'maintenance' && <MaintenancePage user={user} />}
          {currentPage === 'payments' && <PaymentsPage user={user} />}
          {currentPage === 'announcements' && <AnnouncementsPage user={user} />}
          {currentPage === 'documents' && <DocumentsPage user={user} />}
          {currentPage === 'messages' && <MessagesPage user={user} />}
          {currentPage === 'profile' && <ProfilePage user={user} />}
        </main>
      </div>
    </div>
  );
};

export default App;