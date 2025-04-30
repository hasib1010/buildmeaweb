'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalWebsites: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeSubscriptions: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Fetch admin dashboard data
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user || user.role !== 'admin') return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/admin/dashboard');
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch admin data');
        }

        setStats(data.stats);
        setRecentUsers(data.recentUsers);
        setRecentOrders(data.recentOrders);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin dashboard.</p>
          <Link href="/">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 min-h-screen fixed">
          <div className="p-6">
            <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
          </div>
          <nav className="mt-6">
            <div className={`px-6 py-3 cursor-pointer ${activeTab === 'overview' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} onClick={() => setActiveTab('overview')}>
              <span>Overview</span>
            </div>
            <div className={`px-6 py-3 cursor-pointer ${activeTab === 'users' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} onClick={() => setActiveTab('users')}>
              <span>Users</span>
            </div>
            <div className={`px-6 py-3 cursor-pointer ${activeTab === 'orders' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} onClick={() => setActiveTab('orders')}>
              <span>Orders</span>
            </div>
            <div className={`px-6 py-3 cursor-pointer ${activeTab === 'websites' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} onClick={() => setActiveTab('websites')}>
              <span>Websites</span>
            </div>
            <div className={`px-6 py-3 cursor-pointer ${activeTab === 'subscriptions' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} onClick={() => setActiveTab('subscriptions')}>
              <span>Subscriptions</span>
            </div>
            <div className={`px-6 py-3 cursor-pointer ${activeTab === 'settings' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} onClick={() => setActiveTab('settings')}>
              <span>Settings</span>
            </div>
          </nav>
          <div className="absolute bottom-0 w-full p-6">
            <Link href="/">
              <div className="px-4 py-3 bg-gray-800 text-gray-400 hover:text-white rounded-lg flex items-center">
                <span>Back to Website</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'websites' && 'Website Management'}
              {activeTab === 'subscriptions' && 'Subscription Management'}
              {activeTab === 'settings' && 'Platform Settings'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <div className="relative">
                <button className="bg-white p-2 rounded-full shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Error message if any */}
          {error && (
            <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error loading data:</p>
              <p>{error}</p>
              <button
                className="mt-2 px-4 py-1 bg-red-500 text-white rounded text-sm font-medium"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  {/* Metrics Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-sm font-medium text-gray-600">Total Users</h2>
                          <p className="text-2xl font-bold">{stats.totalUsers}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-sm font-medium text-gray-600">Total Orders</h2>
                          <p className="text-2xl font-bold">{stats.totalOrders}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-sm font-medium text-gray-600">Total Websites</h2>
                          <p className="text-2xl font-bold">{stats.totalWebsites}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-sm font-medium text-gray-600">Total Revenue</h2>
                          <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-sm font-medium text-gray-600">Pending Orders</h2>
                          <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="bg-red-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h2 className="text-sm font-medium text-gray-600">Active Subscriptions</h2>
                          <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activities Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow">
                      <div className="border-b p-4 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Recent Users</h2>
                        <button className="text-blue-600 text-sm" onClick={() => setActiveTab('users')}>View All</button>
                      </div>
                      <div className="p-4">
                        {recentUsers.length > 0 ? (
                          <div className="divide-y">
                            {recentUsers.map(user => (
                              <div key={user.id} className="py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="ml-3">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                  </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${user.subscription.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                                  }`}>
                                  {user.subscription.status === 'active'
                                    ? user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)
                                    : 'No Plan'}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-gray-500">No recent users found</div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                      <div className="border-b p-4 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Recent Orders</h2>
                        <button className="text-blue-600 text-sm" onClick={() => setActiveTab('orders')}>View All</button>
                      </div>
                      <div className="p-4">
                        {recentOrders.length > 0 ? (
                          <div className="divide-y">
                            {recentOrders.map(order => (
                              <div key={order.id} className="py-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{order.websiteName}</p>
                                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'cancelled'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </div>
                                <div className="mt-2 flex justify-between">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Plan:</span> {order.plan.charAt(0).toUpperCase() + order.plan.slice(1)}
                                  </p>
                                  <p className="text-sm font-medium">{formatCurrency(order.price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-gray-500">No recent orders found</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">User Management</h2>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Add New User
                    </button>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-500 mb-4">This section will allow you to manage users, view their details, edit their information, and control their access.</p>
                    <div className="flex justify-between mb-4">
                      <div className="flex space-x-2">
                        <select className="border rounded-lg p-2">
                          <option>All Roles</option>
                          <option>Admin</option>
                          <option>User</option>
                        </select>
                        <select className="border rounded-lg p-2">
                          <option>All Subscription Status</option>
                          <option>Active</option>
                          <option>Inactive</option>
                          <option>Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Search users..."
                          className="border rounded-lg p-2 w-64"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentUsers.map(user => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {user.isVerified ? 'Verified' : 'Unverified'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.subscription.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : user.subscription.status === 'inactive'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-red-100 text-red-800'
                                  }`}>
                                  {user.subscription.status === 'active'
                                    ? user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)
                                    : 'No Plan'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(user.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                <button className="text-red-600 hover:text-red-900">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{recentUsers.length}</span> of <span className="font-medium">{stats.totalUsers}</span> users
                      </div>
                      <div className="flex space-x-1">
                        <button className="px-3 py-1 border rounded-md">Previous</button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
                        <button className="px-3 py-1 border rounded-md">2</button>
                        <button className="px-3 py-1 border rounded-md">3</button>
                        <button className="px-3 py-1 border rounded-md">Next</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Order Management</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-500 mb-4">This section will allow you to manage orders, track their progress, update their status, and assign developers.</p>
                    <div className="flex justify-between mb-4">
                      <div className="flex space-x-2">
                        <select className="border rounded-lg p-2">
                          <option>All Statuses</option>
                          <option>Pending</option>
                          <option>Requirements</option>
                          <option>Design</option>
                          <option>Development</option>
                          <option>Revision</option>
                          <option>Completed</option>
                          <option>Cancelled</option>
                        </select>
                        <select className="border rounded-lg p-2">
                          <option>All Plans</option>
                          <option>Starter</option>
                          <option>Growth</option>
                          <option>Elite</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Search orders..."
                          className="border rounded-lg p-2 w-64"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentOrders.map(order => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                #{order.id.toString().slice(-6)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.websiteName}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.user?.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-500">{order.user?.email || ''}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.plan.charAt(0).toUpperCase() + order.plan.slice(1)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : order.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCurrency(order.price)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                <button className="text-indigo-600 hover:text-indigo-900">View</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{recentOrders.length}</span> of <span className="font-medium">{stats.totalOrders}</span> orders
                      </div>
                      <div className="flex space-x-1">
                        <button className="px-3 py-1 border rounded-md">Previous</button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
                        <button className="px-3 py-1 border rounded-md">2</button>
                        <button className="px-3 py-1 border rounded-md">3</button>
                        <button className="px-3 py-1 border rounded-md">Next</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Websites Tab */}
              {activeTab === 'websites' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Website Management</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-500 mb-4">This section will allow you to manage websites, preview them, monitor status, and manage domains.</p>

                    <div className="flex justify-between mb-4">
                      <div className="flex space-x-2">
                        <select className="border rounded-lg p-2">
                          <option>All Status</option>
                          <option>Published</option>
                          <option>Draft</option>
                        </select>
                        <select className="border rounded-lg p-2">
                          <option>All Templates</option>
                          <option>Personal</option>
                          <option>Business</option>
                          <option>E-commerce</option>
                          <option>Portfolio</option>
                          <option>Blog</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Search websites..."
                          className="border rounded-lg p-2 w-64"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Website Cards would go here */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="relative aspect-video bg-gray-100">
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                              Published
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-1">Portfolio Website</h3>
                          <p className="text-sm text-gray-500 mb-3">Template: Portfolio</p>
                          <p className="text-xs text-gray-500 mb-4">Last edited: 3 days ago</p>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Owner: John Smith</span>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 text-sm">View</button>
                              <button className="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="relative aspect-video bg-gray-100">
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                              Draft
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-1">Coffee Shop</h3>
                          <p className="text-sm text-gray-500 mb-3">Template: Business</p>
                          <p className="text-xs text-gray-500 mb-4">Last edited: 1 week ago</p>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Owner: Sarah Johnson</span>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 text-sm">View</button>
                              <button className="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="relative aspect-video bg-gray-100">
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                              Published
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-1">Tech Blog</h3>
                          <p className="text-sm text-gray-500 mb-3">Template: Blog</p>
                          <p className="text-xs text-gray-500 mb-4">Last edited: 2 days ago</p>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Owner: Mike Wilson</span>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 text-sm">View</button>
                              <button className="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">{stats.totalWebsites}</span> websites
                      </div>
                      <div className="flex space-x-1">
                        <button className="px-3 py-1 border rounded-md">Previous</button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
                        <button className="px-3 py-1 border rounded-md">2</button>
                        <button className="px-3 py-1 border rounded-md">3</button>
                        <button className="px-3 py-1 border rounded-md">Next</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscriptions Tab */}
              {activeTab === 'subscriptions' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Subscription Management</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-500 mb-4">This section will allow you to manage subscription plans, track active subscriptions, and view subscription history.</p>

                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-4">Subscription Plans</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border rounded-lg p-6">
                          <h4 className="text-xl font-bold mb-2">Starter</h4>
                          <p className="text-3xl font-bold mb-4">$19<span className="text-sm text-gray-500 font-normal">/month</span></p>
                          <ul className="mb-6 space-y-2">
                            <li className="flex items-center text-sm">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              1 Website
                            </li>
                            <li className="flex items-center text-sm">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              5 Pages
                            </li>
                            <li className="flex items-center text-sm">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Basic Support
                            </li>
                          </ul>
                          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Edit Plan
                          </button>
                        </div>

                        <div className="border rounded-lg p-6 bg-blue-50 border-blue-200">
                          <div className="absolute -mt-10 ml-24 bg-yellow-400 text-xs uppercase font-bold py-1 px-2 rounded-full">
                            Popular
                          </div>
                          <h4 className="text-xl font-bold mb-2">Growth</h4>
                          <p className="text-3xl font-bold mb-4">$49<span className="text-sm text-gray-500 font-normal">/month</span></p>
                          <ul className="mb-6 space-y-2">
                            <li className="flex items-center text-sm">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              5 Websites
                            </li>
                            <li className="flex items-center text-sm">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              20 Pages per website
                            </li>
                            <li className="flex items-center text-sm">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Priority Support
                            </li>
                          </ul>
                          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Edit Plan
                          </button>
                        </div>

                        <div className="border rounded-lg p-6">
                          <h4 className="text-xl font-bold mb-2">Elite</h4>
                          <p className="text-3xl font-bold mb-4">$99<span className="text-sm text-gray-500 font-normal">/month</span></p>
                          <ul className="mb-6 space-y-2">
                            <li className="flex items-center text-sm">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Unlimited Websites
                            </li>
                            <li className="flex items-center text-sm">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Unlimited Pages
                            </li>
                            <li className="flex items-center text-sm">
                              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              24/7 Dedicated Support
                            </li>
                          </ul>
                          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Edit Plan
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-4">Active Subscriptions</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {recentUsers.filter(user => user.subscription.status === 'active').map(user => (
                              <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                                      {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                      <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 capitalize">{user.subscription.plan}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(user.subscription.renewalDate ? new Date(user.subscription.renewalDate.getTime() - 30 * 24 * 60 * 60 * 1000) : new Date())}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(user.subscription.renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user.subscription.plan === 'starter' ? '$19.00' :
                                    user.subscription.plan === 'growth' ? '$49.00' :
                                      user.subscription.plan === 'elite' ? '$99.00' : '$0.00'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                  <button className="text-red-600 hover:text-red-900">Cancel</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Platform Settings</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-500 mb-6">Configure platform-wide settings, integrations, and appearance options.</p>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold mb-4">General Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Platform Name
                            </label>
                            <input
                              type="text"
                              className="border rounded-lg p-2 w-full md:w-1/2"
                              defaultValue="Website Builder X"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Support Email
                            </label>
                            <input
                              type="email"
                              className="border rounded-lg p-2 w-full md:w-1/2"
                              defaultValue="support@websitebuilderx.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Default Language
                            </label>
                            <select className="border rounded-lg p-2 w-full md:w-1/2">
                              <option>English</option>
                              <option>Spanish</option>
                              <option>French</option>
                              <option>German</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-4">Payment Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Payment Provider
                            </label>
                            <select className="border rounded-lg p-2 w-full md:w-1/2">
                              <option>Stripe</option>
                              <option>PayPal</option>
                              <option>Both</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Currency
                            </label>
                            <select className="border rounded-lg p-2 w-full md:w-1/2">
                              <option>USD ($)</option>
                              <option>EUR (€)</option>
                              <option>GBP (£)</option>
                              <option>JPY (¥)</option>
                            </select>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="tax"
                              className="h-4 w-4 text-blue-600 rounded"
                              defaultChecked={true}
                            />
                            <label htmlFor="tax" className="ml-2 block text-sm text-gray-700">
                              Enable tax calculations
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-4">Email Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="welcome"
                              className="h-4 w-4 text-blue-600 rounded"
                              defaultChecked={true}
                            />
                            <label htmlFor="welcome" className="ml-2 block text-sm text-gray-700">
                              Send welcome email to new users
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="order"
                              className="h-4 w-4 text-blue-600 rounded"
                              defaultChecked={true}
                            />
                            <label htmlFor="order" className="ml-2 block text-sm text-gray-700">
                              Send order confirmation emails
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="subscription"
                              className="h-4 w-4 text-blue-600 rounded"
                              defaultChecked={true}
                            />
                            <label htmlFor="subscription" className="ml-2 block text-sm text-gray-700">
                              Send subscription renewal reminders
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4">
                          Save Settings
                        </button>
                        <button className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}