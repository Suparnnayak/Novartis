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
    <div className="min-h-screen p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <ScrollFloat>
            <div>
              <h1 className="text-5xl font-extrabold gradient-text mb-2">
                Manager Dashboard
              </h1>
              <p className="text-gray-700 font-medium">Welcome back, {user?.email}</p>
            </div>
          </ScrollFloat>
          <div className="flex gap-4 items-center">
            <div className="glass rounded-xl px-4 py-2">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ScrollFloat>
            <GlareHover>
              <div className="glass-premium rounded-2xl p-6 card-premium">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-700 text-sm font-semibold uppercase tracking-wide">Total Clinics</div>
                  <div className="text-2xl">🏥</div>
                </div>
                <div className="text-4xl font-extrabold gradient-text">{analytics?.totalClinics || 0}</div>
              </div>
            </GlareHover>
          </ScrollFloat>
          <ScrollFloat>
            <GlareHover>
              <div className="glass-premium rounded-2xl p-6 card-premium">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-700 text-sm font-semibold uppercase tracking-wide">Delayed</div>
                  <div className="text-2xl">⚠️</div>
                </div>
                <div className="text-4xl font-extrabold text-red-600">
                  {analytics?.delayedClinics || 0}
                </div>
              </div>
            </GlareHover>
          </ScrollFloat>
          <ScrollFloat>
            <GlareHover>
              <div className="glass-premium rounded-2xl p-6 card-premium">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-700 text-sm font-semibold uppercase tracking-wide">Alerts</div>
                  <div className="text-2xl">🚨</div>
                </div>
                <div className="text-4xl font-extrabold text-yellow-600">{alerts.length}</div>
              </div>
            </GlareHover>
          </ScrollFloat>
          <ScrollFloat>
            <GlareHover>
              <div className="glass-premium rounded-2xl p-6 card-premium">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-700 text-sm font-semibold uppercase tracking-wide">Avg Fever</div>
                  <div className="text-2xl">🌡️</div>
                </div>
                <div className="text-4xl font-extrabold gradient-text">
                  {analytics?.globalAvgFever?.toFixed(2) || '0.00'}°C
                </div>
              </div>
            </GlareHover>
          </ScrollFloat>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Delay Bar Chart */}
          <ScrollFloat>
            <GlareHover>
              <div className="glass-premium rounded-2xl p-8 card-premium">
                <h2 className="text-3xl font-bold mb-6 gradient-text">
                  Clinic vs Last Update Delay (Hours)
                </h2>
                {delayBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={delayBarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.3)" />
                      <XAxis dataKey="clinicId" stroke="#4A5568" />
                      <YAxis stroke="#4A5568" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.5)',
                          borderRadius: '8px',
                          color: '#1a1a1a',
                        }}
                      />
                      <Bar dataKey="delayHours" fill="#ef4444" name="Delay (hours)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-700 font-medium">
                    No delay data available
                  </div>
                )}
              </div>
            </GlareHover>
          </ScrollFloat>

          {/* Risk Pie Chart */}
          <ScrollFloat>
            <GlareHover>
              <div className="glass-premium rounded-2xl p-8 card-premium">
                <h2 className="text-3xl font-bold mb-6 gradient-text">Clinics by Risk Level</h2>
                {riskPieData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.5)',
                          borderRadius: '8px',
                          color: '#1a1a1a',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-700 font-medium">
                    No risk data available
                  </div>
                )}
              </div>
            </GlareHover>
          </ScrollFloat>
        </div>

        {/* Fever Trends Line Chart */}
        <ScrollFloat>
          <GlareHover>
            <div className="glass-premium rounded-2xl p-8 mb-6 card-premium">
              <h2 className="text-3xl font-bold mb-6 gradient-text">Average Fever Trends (Multi-Clinic)</h2>
              {feverTrendsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={feverTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.3)" />
                    <XAxis dataKey="date" stroke="#4A5568" />
                    <YAxis stroke="#4A5568" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '8px',
                        color: '#1a1a1a',
                      }}
                    />
                    <Legend />
                    {Object.keys(analytics?.feverTrends || {}).map((clinicId, index) => (
                      <Line
                        key={clinicId}
                        type="monotone"
                        dataKey={clinicId}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        name={`Clinic ${clinicId}`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-gray-700 font-medium">
                  No fever trend data available
                </div>
              )}
            </div>
          </GlareHover>
        </ScrollFloat>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clinics Table */}
          <ScrollFloat>
            <GlareHover>
              <div className="glass-premium rounded-2xl p-8 card-premium">
                <h2 className="text-3xl font-bold mb-6 gradient-text">All Clinics</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/30">
                        <th className="text-left py-3 px-4">Clinic ID</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Last Update</th>
                        <th className="text-left py-3 px-4">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clinics.length > 0 ? (
                        clinics.map((clinic) => (
                          <tr
                            key={clinic.clinicId}
                            className="border-b border-white/30 hover:bg-white/20 transition-colors"
                          >
                            <td className="py-3 px-4 font-semibold">{clinic.clinicId}</td>
                            <td className={`py-3 px-4 ${getStatusColor(clinic.status)}`}>
                              {clinic.status === 'on-time' ? '🟢 On-time' : '🔴 Delayed'}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {formatDate(clinic.lastUpdateTime)}
                            </td>
                            <td className={`py-3 px-4 font-semibold ${getRiskColor(clinic.riskLevel)}`}>
                              {clinic.riskLevel.toUpperCase()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-gray-700 font-medium">
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
              <div className="glass-premium rounded-2xl p-8 card-premium">
                <h2 className="text-3xl font-bold mb-6 gradient-text">Active Alerts</h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <div
                        key={alert._id}
                        className="bg-white/30 border border-white/40 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  alert.severity === 'high'
                                    ? 'bg-red-500/20 text-red-400'
                                    : alert.severity === 'medium'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}
                              >
                                {alert.type.replace('_', ' ').toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-700 font-medium">
                                Clinic {alert.clinicId}
                              </span>
                            </div>
                            <p className="text-sm">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(alert.timestamp)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleResolveAlert(alert._id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-all"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-700 font-medium py-8">No active alerts</div>
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

