import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setAuthToken, setUser } from '../services/auth';
import ScrollFloat from '../components/ScrollFloat';
import DarkVeil from '../components/DarkVeil';
import GlareHover from '../components/GlareHover';

const LoginPage = () => {
  const [role, setRole] = useState('clinic');
  const [clinicId, setClinicId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginData = role === 'clinic' 
        ? { clinicId, password, role }
        : { email, password, role };

      const response = await authAPI.login(loginData);
      
      setAuthToken(response.data.token);
      setUser(response.data.user);
      
      if (response.data.user.role === 'clinic') {
        navigate('/clinic');
      } else {
        navigate('/manager');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <DarkVeil />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <ScrollFloat animationDuration={1}>
          <GlareHover>
            <div className="glass rounded-2xl p-8 shadow-2xl">
              <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Clinical Trial Monitor
              </h1>
              <p className="text-gray-700 text-center mb-8 font-medium">Sign in to continue</p>

              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setRole('clinic')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                      role === 'clinic'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/30 text-gray-700 hover:bg-white/40'
                    }`}
                  >
                    Clinic
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('manager')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                      role === 'manager'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/30 text-gray-700 hover:bg-white/40'
                    }`}
                  >
                    Manager
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {role === 'clinic' ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">Clinic ID</label>
                    <input
                      type="text"
                      value={clinicId}
                      onChange={(e) => setClinicId(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/40 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-600"
                      placeholder="Enter Clinic ID"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/40 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-600"
                      placeholder="manager@example.com"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                      className="w-full px-4 py-3 bg-white/40 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-600"
                      placeholder="Enter password"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-700 font-medium">
                <p>Demo Credentials:</p>
                <p className="mt-2">Clinic: clinic1 / password123</p>
                <p>Manager: manager@demo.com / manager123</p>
              </div>
            </div>
          </GlareHover>
        </ScrollFloat>
      </div>
    </div>
  );
};

export default LoginPage;

