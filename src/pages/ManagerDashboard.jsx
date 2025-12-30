import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { managerAPI } from '../services/api';
import { getUser, logout } from '../services/auth';
import ScrollFloat from '../components/ScrollFloat';
import GlareHover from '../components/GlareHover';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <ScrollFloat>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Manager Dashboard
            </h1>
          </ScrollFloat>
          <div className="flex gap-4 items-center">
            <span className="text-gray-700 font-semibold">Manager: {user?.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <ScrollFloat>
            <GlareHover>
              <div className="glass rounded-xl p-4">
                <div className="text-gray-700 text-sm font-medium">Total Clinics</div>
                <div className="text-3xl font-bold text-gray-800">{analytics?.totalClinics || 0}</div>
              </div>
            </GlareHover>
          </ScrollFloat>
          <ScrollFloat>
            <GlareHover>
              <div className="glass rounded-xl p-4">
                <div className="text-gray-700 text-sm font-medium">Delayed Clinics</div>
                <div className="text-3xl font-bold text-red-600">
                  {analytics?.delayedClinics || 0}
                </div>
              </div>
            </GlareHover>
          </ScrollFloat>
          <ScrollFloat>
            <GlareHover>
              <div className="glass rounded-xl p-4">
                <div className="text-gray-700 text-sm font-medium">Active Alerts</div>
                <div className="text-3xl font-bold text-yellow-600">{alerts.length}</div>
              </div>
            </GlareHover>
          </ScrollFloat>
          <ScrollFloat>
            <GlareHover>
              <div className="glass rounded-xl p-4">
                <div className="text-gray-700 text-sm font-medium">Global Avg Fever</div>
                <div className="text-3xl font-bold text-gray-800">
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
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
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
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Clinics by Risk Level</h2>
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
            <div className="glass rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Average Fever Trends (Multi-Clinic)</h2>
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
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Clinics</h2>
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
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Active Alerts</h2>
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

