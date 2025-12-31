import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clinicAPI } from '../services/api';
import { getUser, logout } from '../services/auth';
import ScrollFloat from '../components/ScrollFloat';
import GlareHover from '../components/GlareHover';
import LoadingSpinner from '../components/LoadingSpinner';
import FloatingLabelInput from '../components/FloatingLabelInput';
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
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="glass-premium rounded-3xl p-12 flex flex-col items-center gap-6">
          <LoadingSpinner size="lg" />
          <p className="text-xl font-semibold gradient-text">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <ScrollFloat>
            <div>
              <h1 className="text-5xl font-extrabold gradient-text mb-2">
                Clinic Dashboard
              </h1>
              <p className="text-gray-700 font-medium">Welcome back, {user?.clinicId}</p>
            </div>
          </ScrollFloat>
          <div className="flex gap-4 items-center">
            <div className="glass rounded-xl px-4 py-2">
              <span className="text-gray-800 font-semibold">🏥 {user?.clinicId}</span>
            </div>
            <button
              onClick={logout}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-semibold text-white hover:shadow-lg transition-all transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Status Card */}
        <ScrollFloat>
          <GlareHover>
            <div className="glass-premium rounded-2xl p-8 mb-6 card-premium">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-4 gradient-text">Current Status</h2>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full shadow-lg ${
                        status?.status === 'on-time' 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse-slow' 
                          : 'bg-gradient-to-r from-red-400 to-pink-500 animate-pulse-slow'
                      }`}
                    />
                    <span className="text-2xl font-bold">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Form */}
          <ScrollFloat>
            <GlareHover>
              <div className="glass-premium rounded-2xl p-8 card-premium">
                <h2 className="text-3xl font-bold mb-6 gradient-text">Submit Daily Update</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FloatingLabelInput
                    label="Patient Count"
                    type="number"
                    value={formData.patientCount}
                    onChange={(e) => setFormData({ ...formData, patientCount: e.target.value })}
                    placeholder="Enter patient count"
                    required
                    min="0"
                  />

                  <FloatingLabelInput
                    label="Average Fever (°C)"
                    type="number"
                    step="0.1"
                    value={formData.avgFever}
                    onChange={(e) => setFormData({ ...formData, avgFever: e.target.value })}
                    placeholder="Enter average fever"
                    required
                    min="0"
                  />

                  <FloatingLabelInput
                    label="Side Effects (comma-separated)"
                    type="text"
                    value={formData.sideEffects}
                    onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                    placeholder="nausea, headache, dizziness"
                  />

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-800">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows="3"
                      className="input-premium w-full px-4 pt-4 pb-2 rounded-xl text-gray-800 placeholder-gray-500 resize-none"
                      placeholder="Additional notes..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-premium w-full py-4 rounded-xl font-bold text-lg text-white relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <LoadingSpinner size="sm" />
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      <span className="relative z-10">Submit Update →</span>
                    )}
                  </button>
                </form>
              </div>
            </GlareHover>
          </ScrollFloat>

          {/* Chart */}
          <ScrollFloat>
            <GlareHover>
              <div className="glass-premium rounded-2xl p-8 card-premium">
                <h2 className="text-3xl font-bold mb-6 gradient-text">Symptom Trends</h2>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
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
                      <Line
                        type="monotone"
                        dataKey="fever"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Avg Fever (°C)"
                      />
                      <Line
                        type="monotone"
                        dataKey="patients"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="Patient Count"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-700 font-medium">
                    No data available yet
                  </div>
                )}
              </div>
            </GlareHover>
          </ScrollFloat>
        </div>

        {/* History Table */}
        <ScrollFloat>
          <GlareHover>
            <div className="glass-premium rounded-2xl p-8 mt-6 card-premium">
              <h2 className="text-3xl font-bold mb-6 gradient-text">Submission History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/30">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Patients</th>
                      <th className="text-left py-3 px-4">Avg Fever</th>
                      <th className="text-left py-3 px-4">Side Effects</th>
                      <th className="text-left py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updates.length > 0 ? (
                      updates.map((update) => (
                        <tr
                          key={update._id}
                          className="border-b border-white/30 hover:bg-white/20 transition-colors"
                        >
                          <td className="py-3 px-4">{formatDate(update.timestamp)}</td>
                          <td className="py-3 px-4">{update.patientCount}</td>
                          <td className="py-3 px-4">{update.avgFever}°C</td>
                          <td className="py-3 px-4">
                            {update.sideEffects.length > 0
                              ? update.sideEffects.join(', ')
                              : 'None'}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {update.notes || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-700 font-medium">
                          No submissions yet
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

