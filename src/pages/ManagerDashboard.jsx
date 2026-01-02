import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { managerAPI } from '../services/api';
import { getUser, logout } from '../services/auth';
import ScrollFloat from '../components/ScrollFloat';
import GlareHover from '../components/GlareHover';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444'];

const ManagerDashboard = () => {
  const [user, setUser] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'manager') {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [clinicsRes, analyticsRes, alertsRes] = await Promise.all([
        managerAPI.getAllClinics(),
        managerAPI.getAnalytics(),
        managerAPI.getAlerts(),
      ]);
      setClinics(clinicsRes.data);
      setAnalytics(analyticsRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await managerAPI.resolveAlert(alertId);
      await loadData();
    } catch (error) {
      alert('Failed to resolve alert');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    return status === 'on-time' ? 'text-green-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="glass-premium rounded-3xl p-12 flex flex-col items-center gap-6">
          <LoadingSpinner size="lg" />
          <p className="text-xl font-semibold gradient-text">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const delayBarData = analytics?.delayData || [];
  const riskPieData = analytics?.riskDistribution
    ? [
        { name: 'Low Risk', value: analytics.riskDistribution.low },
        { name: 'Medium Risk', value: analytics.riskDistribution.medium },
        { name: 'High Risk', value: analytics.riskDistribution.high },
      ]
    : [];

  // Prepare fever trends data
  const feverTrendsData = [];
  if (analytics?.feverTrends) {
    const allDates = new Set();
    Object.values(analytics.feverTrends).forEach((trend) => {
      trend.forEach((point) => {
        allDates.add(new Date(point.date).toLocaleDateString());
      });
    });

    const datesArray = Array.from(allDates).sort();
    datesArray.forEach((date) => {
      const dataPoint = { date };
      Object.keys(analytics.feverTrends).forEach((clinicId) => {
        const point = analytics.feverTrends[clinicId].find(
          (p) => new Date(p.date).toLocaleDateString() === date
        );
        dataPoint[clinicId] = point ? point.fever : null;
      });
      feverTrendsData.push(dataPoint);
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <ScrollFloat>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Home</span>
              </button>
              <div>
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Manager Dashboard
                </h1>
                <p className="text-gray-700 font-medium">Welcome back, {user?.email}</p>
              </div>
            </div>
          </ScrollFloat>
          <div className="flex gap-4 items-center">
            <div className="bg-white rounded-xl px-4 py-2 shadow-md border border-gray-200">
              <span className="text-gray-800 font-semibold">👨‍💼 Manager</span>
            </div>
            <button
              onClick={logout}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-semibold text-white hover:shadow-lg transition-all transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Premium Stats Cards with Enhanced Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ScrollFloat>
            <GlareHover>
              <div className="group relative bg-gradient-to-br from-white via-blue-50/50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:border-blue-300 overflow-hidden hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-700">Total Clinics</div>
                    <div className="text-3xl group-hover:scale-110 transition-transform">🏥</div>
                  </div>
                  <div className="text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    {analytics?.totalClinics || 0}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-semibold">●</span>
                    <span className="text-gray-600 font-medium">All Active</span>
                  </div>
                </div>
              </div>
            </GlareHover>
          </ScrollFloat>
          
          <ScrollFloat>
            <GlareHover>
              <div className="group relative bg-gradient-to-br from-white via-red-50/50 to-orange-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-100 hover:border-red-300 overflow-hidden hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-red-700">Delayed</div>
                    <div className="text-3xl animate-pulse group-hover:scale-110 transition-transform">⚠️</div>
                  </div>
                  <div className="text-6xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-red-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    {analytics?.delayedClinics || 0}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-red-600 font-semibold animate-pulse">●</span>
                    <span className="text-gray-600 font-medium">Needs Attention</span>
                  </div>
                </div>
              </div>
            </GlareHover>
          </ScrollFloat>
          
          <ScrollFloat>
            <GlareHover>
              <div className="group relative bg-gradient-to-br from-white via-yellow-50/50 to-amber-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-100 hover:border-yellow-300 overflow-hidden hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-amber-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-yellow-700">Active Alerts</div>
                    <div className="text-3xl group-hover:rotate-12 transition-transform">🚨</div>
                  </div>
                  <div className="text-6xl font-black bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    {alerts.length}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-600 font-semibold">●</span>
                    <span className="text-gray-600 font-medium">Pending Review</span>
                  </div>
                </div>
              </div>
            </GlareHover>
          </ScrollFloat>
          
          <ScrollFloat>
            <GlareHover>
              <div className="group relative bg-gradient-to-br from-white via-purple-50/50 to-pink-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300 overflow-hidden hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-700">Avg Fever</div>
                    <div className="text-3xl group-hover:scale-110 transition-transform">🌡️</div>
                  </div>
                  <div className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    {analytics?.globalAvgFever?.toFixed(2) || '0.00'}°C
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-semibold">●</span>
                    <span className="text-gray-600 font-medium">Normal Range</span>
                  </div>
                </div>
              </div>
            </GlareHover>
          </ScrollFloat>
        </div>

        {/* Charts Row 1 */}
        {/* Premium KPI Insights Section */}
        <div className="mb-8 p-8 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl border border-indigo-200/50 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">📊 Key Performance Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-gray-600 font-semibold">Compliance Rate</p>
              <p className="text-3xl font-bold gradient-text mt-2">{Math.round((((analytics?.totalClinics || 1) - (analytics?.delayedClinics || 0)) / (analytics?.totalClinics || 1)) * 100)}%</p>
              <p className="text-xs text-gray-500 mt-2">Clinics on schedule</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-100">
              <p className="text-sm text-gray-600 font-semibold">Average Response</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{(analytics?.globalAvgFever?.toFixed(1) || '0')}°C</p>
              <p className="text-xs text-gray-500 mt-2">Current system average</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-pink-100">
              <p className="text-sm text-gray-600 font-semibold">Risk Status</p>
              <p className="text-3xl font-bold text-pink-600 mt-2">{analytics?.riskDistribution?.high || 0} High</p>
              <p className="text-xs text-gray-500 mt-2">Clinics requiring attention</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Delay Bar Chart */}
          <ScrollFloat>
            <GlareHover>
              <div className="bg-gradient-to-br from-white to-red-50/50 rounded-2xl p-8 shadow-xl border border-red-100 hover:shadow-2xl transition-all">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Clinic Delay Status (Hours)
                </h2>
                {delayBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={delayBarData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="rgba(200, 200, 200, 0.2)" />
                      <XAxis dataKey="clinicId" stroke="#64748b" style={{ fontSize: '13px', fontWeight: '600' }} />
                      <YAxis stroke="#64748b" style={{ fontSize: '13px', fontWeight: '600' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.98)',
                          border: '2px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '12px',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                          padding: '12px',
                        }}
                        formatter={(value) => [`${value} hours`, 'Delay']}
                        labelStyle={{ color: '#1a1a1a', fontWeight: '600' }}
                      />
                      <Bar dataKey="delayHours" fill="url(#delayGradient)" name="Delay (hours)" radius={[12, 12, 0, 0]} isAnimationActive animationDuration={500} />
                      <defs>
                        <linearGradient id="delayGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                          <stop offset="100%" stopColor="#f97316" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[350px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📊</div>
                      <p className="text-gray-700 font-medium text-lg">No delay data available</p>
                      <p className="text-gray-500 text-sm mt-2">Clinic updates will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </GlareHover>
          </ScrollFloat>

          {/* Risk Pie Chart */}
          <ScrollFloat>
            <GlareHover>
              <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Clinics by Risk Level</h2>
                {riskPieData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <Pie
                        data={riskPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={500}
                      >
                        {riskPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.98)',
                          border: '2px solid rgba(168, 85, 247, 0.3)',
                          borderRadius: '12px',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[350px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📈</div>
                      <p className="text-gray-700 font-medium text-lg">No risk data available</p>
                      <p className="text-gray-500 text-sm mt-2">Risk analysis will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </GlareHover>
          </ScrollFloat>
        </div>

        {/* Fever Trends Line Chart */}
        <ScrollFloat>
          <GlareHover>
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-2xl p-8 mb-6 shadow-xl border border-blue-100 hover:shadow-2xl transition-all">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Average Fever Trends (Multi-Clinic)</h2>
              {feverTrendsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={420}>
                  <LineChart data={feverTrendsData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(200, 200, 200, 0.2)" />
                    <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '13px', fontWeight: '600' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '13px', fontWeight: '600' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        border: '2px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                        padding: '12px',
                      }}
                      labelStyle={{ color: '#1a1a1a', fontWeight: '600' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px', fontWeight: '600', paddingTop: '16px' }} />
                    {Object.keys(analytics?.feverTrends || {}).map((clinicId, index) => (
                      <Line
                        key={clinicId}
                        type="monotone"
                        dataKey={clinicId}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={3}
                        name={`Clinic ${clinicId}`}
                        dot={{ fill: COLORS[index % COLORS.length], r: 5 }}
                        activeDot={{ r: 8 }}
                        isAnimationActive
                        animationDuration={500}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[420px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🌡️</div>
                    <p className="text-gray-700 font-medium text-lg">No fever trend data available</p>
                    <p className="text-gray-500 text-sm mt-2">Temperature trends will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </GlareHover>
        </ScrollFloat>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clinics Table */}
          <ScrollFloat>
            <GlareHover>
              <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-8 shadow-xl border border-green-100 hover:shadow-2xl transition-all">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">🏥 All Clinics</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-green-200 bg-green-50/50">
                        <th className="text-left py-4 px-4 text-sm font-bold text-green-800 uppercase">Clinic ID</th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-green-800 uppercase">Status</th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-green-800 uppercase">Last Update</th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-green-800 uppercase">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clinics.length > 0 ? (
                        clinics.map((clinic, idx) => (
                          <tr
                            key={clinic.clinicId}
                            className="border-b border-green-100 hover:bg-green-100/50 transition-colors"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            <td className="py-4 px-4 font-bold text-gray-900">{clinic.clinicId}</td>
                            <td className={`py-4 px-4 font-semibold ${getStatusColor(clinic.status)}`}>
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${clinic.status === 'on-time' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {clinic.status === 'on-time' ? '🟢 On-time' : '🔴 Delayed'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-700 font-medium text-sm">
                              {formatDate(clinic.lastUpdateTime)}
                            </td>
                            <td className={`py-3 px-4 font-semibold ${getRiskColor(clinic.riskLevel)}`}>
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                clinic.riskLevel === 'low' 
                                  ? 'bg-green-100 text-green-700'
                                  : clinic.riskLevel === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {clinic.riskLevel.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-12 text-center text-gray-700 font-medium">
                            No clinics found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </GlareHover>
          </ScrollFloat>

          {/* Alerts Panel */}
          <ScrollFloat>
            <GlareHover>
              <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-8 shadow-xl border border-amber-100 hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">🔔 Active Alerts</h2>
                  <span className="bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-bold">{alerts.length} Active</span>
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map((alert, idx) => (
                      <div
                        key={alert._id}
                        className={`bg-white border-l-4 rounded-xl p-4 shadow-md hover:shadow-lg hover:translate-x-1 transition-all ${
                          alert.severity === 'high'
                            ? 'border-red-400 bg-red-50/50'
                            : alert.severity === 'medium'
                            ? 'border-yellow-400 bg-yellow-50/50'
                            : 'border-blue-400 bg-blue-50/50'
                        }`}
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  alert.severity === 'high'
                                    ? 'bg-red-200 text-red-800'
                                    : alert.severity === 'medium'
                                    ? 'bg-yellow-200 text-yellow-800'
                                    : 'bg-blue-200 text-blue-800'
                                }`}
                              >
                                {alert.severity.toUpperCase()}
                              </span>
                              <span className="text-sm font-bold text-gray-800 bg-white/60 px-2 py-1 rounded">
                                {alert.clinicId}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 font-semibold">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-2 font-medium">
                              {formatDate(alert.timestamp)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleResolveAlert(alert._id)}
                            className="ml-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
                          >
                            ✓ Resolve
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-700 font-medium py-12">
                      <div className="text-4xl mb-2">✨</div>
                      <p>No active alerts - System running smoothly!</p>
                    </div>
                  )}
                </div>
              </div>
            </GlareHover>
          </ScrollFloat>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

