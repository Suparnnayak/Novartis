import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clinicAPI } from '../services/api';
import { getUser, logout } from '../services/auth';
import ScrollFloat from '../components/ScrollFloat';
import GlareHover from '../components/GlareHover';
import LoadingSpinner from '../components/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ClinicDashboard = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientCount: '',
    avgFever: '',
    sideEffects: '',
    notes: '',
  });

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'clinic') {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statusRes, updatesRes] = await Promise.all([
        clinicAPI.getMyStatus(),
        clinicAPI.getMyUpdates(),
      ]);
      setStatus(statusRes.data);
      setUpdates(updatesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const sideEffectsArray = formData.sideEffects
        ? formData.sideEffects.split(',').map(s => s.trim()).filter(s => s)
        : [];

      await clinicAPI.submitUpdate({
        patientCount: Number(formData.patientCount),
        avgFever: Number(formData.avgFever),
        sideEffects: sideEffectsArray,
        notes: formData.notes,
      });

      setFormData({
        patientCount: '',
        avgFever: '',
        sideEffects: '',
        notes: '',
      });

      await loadData();
      alert('Update submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit update');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const chartData = updates
    .slice()
    .reverse()
    .map(update => ({
      date: new Date(update.timestamp).toLocaleDateString(),
      fever: update.avgFever,
      patients: update.patientCount,
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center relative">
        <div className="bg-white rounded-3xl p-12 flex flex-col items-center gap-6 shadow-2xl">
          <LoadingSpinner size="lg" />
          <p className="text-xl font-semibold gradient-text">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -right-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
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
                <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Clinic Dashboard
                </h1>
                <p className="text-gray-700 font-medium">Welcome back, {user?.clinicId}</p>
              </div>
            </div>
          </ScrollFloat>
          <div className="flex gap-4 items-center">
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
              <span className="text-gray-800 font-semibold">🏥 {user?.clinicId}</span>
            </div>
            <button
              onClick={logout}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-semibold text-white hover:shadow-md transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Status Card */}
        <ScrollFloat>
          <GlareHover>
            <div className="bg-gradient-to-br from-white via-emerald-50/30 to-green-50/50 rounded-2xl p-8 mb-6 shadow-xl border border-green-100 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Current Status</h2>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full shadow-lg ${
                        status?.status === 'on-time' 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' 
                          : 'bg-gradient-to-r from-red-400 to-pink-500 animate-pulse'
                      }`}
                    />
                    <span className="text-2xl font-bold text-gray-900">
                      {status?.status === 'on-time' ? '🟢 On-time' : '🔴 Delayed'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 font-medium mb-1">Last Update</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {status?.lastUpdateTime ? formatDate(status.lastUpdateTime) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </GlareHover>
        </ScrollFloat>

        {/* Premium KPI Metrics */}
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl border border-blue-200/50 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📈 Trial Submission Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-gray-600 font-semibold">Total Submissions</p>
              <p className="text-3xl font-bold gradient-text mt-2">{updates.length}</p>
              <p className="text-xs text-gray-500 mt-2">Recorded updates</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-100">
              <p className="text-sm text-gray-600 font-semibold">Avg Participation</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {updates.length > 0 ? (updates.reduce((sum, u) => sum + u.patientCount, 0) / updates.length).toFixed(0) : '0'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Patients per update</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-pink-100">
              <p className="text-sm text-gray-600 font-semibold">Latest Fever</p>
              <p className="text-3xl font-bold text-pink-600 mt-2">
                {updates.length > 0 ? updates[updates.length - 1]?.avgFever || '0' : '0'}°C
              </p>
              <p className="text-xs text-gray-500 mt-2">Most recent reading</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Form */}
          <ScrollFloat>
            <GlareHover>
              <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl p-8 shadow-xl border border-blue-100 hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📝 Submit Daily Update</h2>
                  <div className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">Live Updates</div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">👥 Patient Count</label>
                    <input
                      type="number"
                      value={formData.patientCount}
                      onChange={(e) => setFormData({ ...formData, patientCount: e.target.value })}
                      className="w-full px-5 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all outline-none font-medium shadow-sm hover:shadow-md"
                      placeholder="Enter patient count"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">🌡️ Average Fever (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.avgFever}
                      onChange={(e) => setFormData({ ...formData, avgFever: e.target.value })}
                      className="w-full px-5 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none font-medium shadow-sm hover:shadow-md"
                      placeholder="Enter average fever"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">⚠️ Side Effects (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.sideEffects}
                      onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                      className="w-full px-5 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-pink-300 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all outline-none font-medium shadow-sm hover:shadow-md"
                      placeholder="nausea, headache, dizziness"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">📝 Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows="3"
                      className="w-full px-5 py-3 bg-gradient-to-r from-gray-50 to-purple-50 border-2 border-indigo-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all outline-none font-medium resize-none shadow-sm hover:shadow-md"
                      placeholder="Additional notes or observations..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <LoadingSpinner size="sm" />
                        <span>Submitting Update...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-xl">✓</span>
                        <span>Submit Daily Update</span>
                        <span className="text-xl">→</span>
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </GlareHover>
          </ScrollFloat>

          {/* Chart */}
          <ScrollFloat>
            <GlareHover>
              <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-2xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Symptom Trends</h2>
                  {chartData.length > 0 ? (
                    <div className="w-full h-64 md:h-[380px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
                      <Line
                        type="monotone"
                        dataKey="fever"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Avg Fever (°C)"
                        dot={{ fill: '#3b82f6', r: 6 }}
                        activeDot={{ r: 8 }}
                        isAnimationActive
                        animationDuration={500}
                      />
                      <Line
                        type="monotone"
                        dataKey="patients"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        name="Patient Count"
                        dot={{ fill: '#8b5cf6', r: 6 }}
                        activeDot={{ r: 8 }}
                        isAnimationActive
                        animationDuration={500}
                      />
                    </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 md:h-[380px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📊</div>
                      <p className="text-gray-700 font-medium text-lg">No data available yet</p>
                      <p className="text-gray-500 text-sm mt-2">Submit your first update to see trends!</p>
                    </div>
                  </div>
                )}
              </div>
            </GlareHover>
          </ScrollFloat>
        </div>

        {/* History Table */}
        <ScrollFloat>
          <GlareHover>
            <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl p-8 mt-6 shadow-xl border border-indigo-100 hover:shadow-2xl transition-all">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📋 Submission History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-indigo-200 bg-indigo-50/50">
                      <th className="text-left py-4 px-4 text-sm font-bold text-indigo-800 uppercase">Date</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-indigo-800 uppercase">Patients</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-indigo-800 uppercase">Avg Fever</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-indigo-800 uppercase">Side Effects</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-indigo-800 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updates.length > 0 ? (
                      updates.map((update, idx) => (
                        <tr
                          key={update._id}
                          className="border-b border-indigo-100 hover:bg-indigo-100/50 transition-colors"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <td className="py-4 px-4 font-medium text-gray-900 text-sm">{formatDate(update.timestamp)}</td>
                          <td className="py-4 px-4 font-semibold text-blue-600 bg-blue-50/50 rounded px-3">
                            {update.patientCount}
                          </td>
                          <td className="py-4 px-4 font-semibold text-purple-600 bg-purple-50/50 rounded px-3">
                            {update.avgFever}°C
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {update.sideEffects.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {update.sideEffects.map((effect, i) => (
                                  <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                                    {effect}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-green-600 font-semibold bg-green-50/50 px-3 py-1 rounded">None</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm max-w-xs truncate">{update.notes || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-gray-500 font-medium">
                          <div className="text-4xl mb-2">📊</div>
                          <p>No updates submitted yet. Submit your first update above!</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </GlareHover>
        </ScrollFloat>
      </div>
    </div>
  );
};

export default ClinicDashboard;

