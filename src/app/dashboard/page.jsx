'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { gsap } from 'gsap';
import Navbar from '@/components/ui/Navbar';

// Sample website data
const sampleWebsites = [
  {
    id: 'web1',
    name: 'Portfolio Site',
    template: 'Personal',
    status: 'published',
    lastEdited: '2023-11-15T14:23:00Z',
    url: 'portfolio-example.com',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: 'web2',
    name: 'Coffee Shop',
    template: 'Business',
    status: 'draft',
    lastEdited: '2023-11-10T09:15:00Z',
    url: 'coffee-example.com',
    thumbnail: '/api/placeholder/300/200'
  }
];

// Sample orders data
const sampleOrders = [
  {
    id: 'order1',
    name: 'E-Commerce Website',
    plan: 'Elite',
    status: 'in-progress',
    progress: 65,
    orderedDate: '2023-11-01T10:30:00Z',
    deliveryDate: '2023-12-10T10:30:00Z',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: 'order2',
    name: 'Photography Portfolio',
    plan: 'Growth',
    status: 'pending',
    progress: 20,
    orderedDate: '2023-11-12T14:45:00Z',
    deliveryDate: '2023-12-02T14:45:00Z',
    thumbnail: '/api/placeholder/300/200'
  }
];

// Sample meetings data
const sampleMeetings = [
  {
    id: 'meeting1',
    title: 'Website Design Review',
    date: '2023-11-20T15:00:00Z',
    duration: 45, // minutes
    developer: 'Alex Johnson',
    status: 'scheduled'
  },
  {
    id: 'meeting2',
    title: 'Requirements Gathering',
    date: '2023-11-25T11:00:00Z',
    duration: 60, // minutes
    developer: 'Sarah Williams',
    status: 'scheduled'
  }
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('websites');
  const [websites, setWebsites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);
  
  // Fetch data
  useEffect(() => {
    // In a real app, you would fetch data from the API
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 800));
        setWebsites(sampleWebsites);
        setOrders(sampleOrders);
        setMeetings(sampleMeetings);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);
  
  // GSAP animations
  useEffect(() => {
    if (!isLoading) {
      // Animate dashboard elements
      gsap.from('.dashboard-header', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
      
      gsap.from('.dashboard-stats', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power3.out'
      });
      
      gsap.from('.tabs', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power3.out'
      });
      
      gsap.from('.card-item', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power3.out'
      });
    }
  }, [isLoading, activeTab]);
  
  // Format date display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time display
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };
  
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Dashboard Header */}
        <div className="dashboard-header flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-300">
              Manage your websites, orders, and meetings in one place
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <button 
              className="px-5 py-2.5 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition-colors shadow-lg"
              onClick={() => setShowScheduleModal(true)}
            >
              Schedule Meeting
            </button>
            <button 
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-colors shadow-lg"
              onClick={() => router.push('/order-website')}
            >
              Order Website
            </button>
          </div>
        </div>
        
        {/* Dashboard Stats */}
        <div className="dashboard-stats grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-400 mb-1">Websites</h3>
            <p className="text-3xl font-bold">{websites.length}</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-400 mb-1">Active Orders</h3>
            <p className="text-3xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-400 mb-1">Upcoming Meetings</h3>
            <p className="text-3xl font-bold">{meetings.length}</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-400 mb-1">Subscription</h3>
            <p className="text-3xl font-bold">{user.subscription?.plan || 'None'}</p>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="tabs flex border-b border-gray-700 mb-8">
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'websites' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('websites')}
          >
            My Websites
          </button>
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'orders' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('orders')}
          >
            Order Status
          </button>
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'meetings' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('meetings')}
          >
            Meetings
          </button>
        </div>
        
        {/* Content Section */}
        <div className="mb-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Websites Tab */}
              {activeTab === 'websites' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Websites</h2>
                    <button 
                      className="text-sm px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
                      onClick={() => router.push('/order-website')}
                    >
                      + Create New
                    </button>
                  </div>
                  
                  {websites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {websites.map((website) => (
                        <div 
                          key={website.id} 
                          className="card-item bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="relative aspect-video">
                            <img 
                              src={website.thumbnail} 
                              alt={website.name} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                website.status === 'published' 
                                  ? 'bg-green-500 bg-opacity-90' 
                                  : 'bg-yellow-500 bg-opacity-90'
                              }`}>
                                {website.status === 'published' ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-xl font-bold mb-1">{website.name}</h3>
                            <p className="text-gray-400 text-sm mb-3">
                              Template: {website.template}
                            </p>
                            <p className="text-gray-400 text-xs mb-4">
                              Last edited: {formatDate(website.lastEdited)}
                            </p>
                            <div className="flex space-x-2">
                              <Link href={`/editor/${website.id}`}>
                                <button className="flex-1 px-3 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors text-sm">
                                  Edit
                                </button>
                              </Link>
                              <Link href={`/preview/${website.id}`}>
                                <button className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white font-medium hover:bg-gray-600 transition-colors text-sm">
                                  Preview
                                </button>
                              </Link>
                              <div className="relative group">
                                <button className="px-3 py-2 bg-gray-700 rounded-lg text-white font-medium hover:bg-gray-600 transition-colors text-sm">
                                  ⋮
                                </button>
                                {/* Dropdown menu */}
                                <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md overflow-hidden shadow-xl z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                                  <div className="py-1">
                                    <button className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
                                      Duplicate
                                    </button>
                                    <button className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
                                      {website.status === 'published' ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700">
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Create New Website Card */}
                      <div 
                        className="card-item bg-gray-800 bg-opacity-30 rounded-xl border border-gray-700 border-dashed overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center cursor-pointer h-72"
                        onClick={() => router.push('/create-website')}
                      >
                        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-300">Create New Website</h3>
                        <p className="text-gray-400 text-sm mt-2">
                          Start building your next project
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <h3 className="text-2xl font-bold mb-2">No websites yet</h3>
                      <p className="text-gray-400 mb-6">
                        Create your first website to get started with our platform.
                      </p>
                      <button 
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-colors shadow-lg"
                        onClick={() => router.push('/create-website')}
                      >
                        Create Your First Website
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Orders</h2>
                    <button 
                      className="text-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
                      onClick={() => router.push('/order-website')}
                    >
                      + New Order
                    </button>
                  </div>
                  
                  {orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div 
                          key={order.id} 
                          className="card-item bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 overflow-hidden shadow-lg"
                        >
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                              <div>
                                <div className="flex items-center mb-2">
                                  <h3 className="text-xl font-bold mr-3">{order.name}</h3>
                                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                    order.status === 'in-progress' 
                                      ? 'bg-blue-500 bg-opacity-90' 
                                      : order.status === 'completed'
                                        ? 'bg-green-500 bg-opacity-90'
                                        : 'bg-yellow-500 bg-opacity-90'
                                  }`}>
                                    {order.status === 'in-progress' 
                                      ? 'In Progress' 
                                      : order.status === 'completed'
                                        ? 'Completed'
                                        : 'Pending'}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                  Plan: <span className="font-medium text-white">{order.plan}</span>
                                </p>
                              </div>
                              <div className="mt-4 md:mt-0">
                                <div className="flex items-center text-sm">
                                  <div className="text-right mr-4">
                                    <p className="text-gray-400">Ordered on</p>
                                    <p className="font-medium">{formatDate(order.orderedDate)}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-gray-400">Delivery by</p>
                                    <p className="font-medium">{formatDate(order.deliveryDate)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Progress</span>
                                <span className="text-sm font-medium">{order.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" style={{ width: `${order.progress}%` }}></div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-3">
                              <button className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors text-sm">
                                View Details
                              </button>
                              <button className="px-4 py-2 bg-gray-700 rounded-lg text-white font-medium hover:bg-gray-600 transition-colors text-sm">
                                Contact Developer
                              </button>
                              {order.status === 'in-progress' && (
                                <button className="px-4 py-2 bg-gray-700 rounded-lg text-white font-medium hover:bg-gray-600 transition-colors text-sm">
                                  Request Changes
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 className="text-2xl font-bold mb-2">No orders yet</h3>
                      <p className="text-gray-400 mb-6">
                        Place your first website order to get started.
                      </p>
                      <button 
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-colors shadow-lg"
                        onClick={() => router.push('/order-website')}
                      >
                        Order Your First Website
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {/* Meetings Tab */}
              {activeTab === 'meetings' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Meetings</h2>
                    <button 
                      className="text-sm px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
                      onClick={() => setShowScheduleModal(true)}
                    >
                      + Schedule Meeting
                    </button>
                  </div>
                  
                  {meetings.length > 0 ? (
                    <div className="space-y-4">
                      {meetings.map((meeting) => {
                        const meetingDate = new Date(meeting.date);
                        const isUpcoming = meetingDate > new Date();
                        
                        return (
                          <div 
                            key={meeting.id} 
                            className="card-item bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 overflow-hidden shadow-lg p-6"
                          >
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <div className="flex items-center mb-2">
                                  <h3 className="text-xl font-bold mr-3">{meeting.title}</h3>
                                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                    isUpcoming ? 'bg-green-500 bg-opacity-90' : 'bg-gray-500 bg-opacity-90'
                                  }`}>
                                    {isUpcoming ? 'Upcoming' : 'Past'}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-1">
                                  Date: <span className="font-medium text-white">{formatDate(meeting.date)}</span>
                                </p>
                                <p className="text-gray-400 text-sm mb-1">
                                  Time: <span className="font-medium text-white">{formatTime(meeting.date)}</span>
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Duration: <span className="font-medium text-white">{meeting.duration} minutes</span>
                                </p>
                              </div>
                              <div className="flex flex-col justify-between mt-4 md:mt-0">
                                <div className="text-right">
                                  <p className="text-gray-400 text-sm">Developer</p>
                                  <p className="font-medium">{meeting.developer}</p>
                                </div>
                                
                                <div className="flex space-x-3 mt-4 md:mt-0 md:justify-end">
                                  {isUpcoming && (
                                    <>
                                      <button className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors text-sm">
                                        Join Meeting
                                      </button>
                                      <button className="px-4 py-2 bg-gray-700 rounded-lg text-white font-medium hover:bg-gray-600 transition-colors text-sm">
                                        Reschedule
                                      </button>
                                    </>
                                  )}
                                  {!isUpcoming && (
                                    <button className="px-4 py-2 bg-gray-700 rounded-lg text-white font-medium hover:bg-gray-600 transition-colors text-sm">
                                      View Notes
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-2xl font-bold mb-2">No meetings scheduled</h3>
                      <p className="text-gray-400 mb-6">
                        Schedule your first meeting with our developers.
                      </p>
                      <button 
                        className="px-6 py-3 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition-colors shadow-lg"
                        onClick={() => setShowScheduleModal(true)}
                      >
                        Schedule a Meeting
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-2xl font-bold mb-4">Schedule a Meeting</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Meeting Topic</label>
                <input type="text" className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. Design Review" />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Date</label>
                <input type="date" className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Time</label>
                <input type="time" className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Duration</label>
                <select className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Developer Preference</label>
                <select className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">No preference</option>
                  <option value="alex">Alex Johnson</option>
                  <option value="sarah">Sarah Williams</option>
                  <option value="mike">Mike Thompson</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Notes</label>
                <textarea className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32" placeholder="Describe what you'd like to discuss..."></textarea>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-3 px-4 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-semibold"
                  onClick={() => {
                    // In a real app, this would submit the form
                    setShowScheduleModal(false);
                    // Show success notification
                    alert('Meeting scheduled successfully!');
                  }}
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}