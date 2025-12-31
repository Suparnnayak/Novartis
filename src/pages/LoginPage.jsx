import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setAuthToken, setUser } from '../services/auth';
import ScrollFloat from '../components/ScrollFloat';
import DarkVeil from '../components/DarkVeil';
import GlareHover from '../components/GlareHover';
import FloatingLabelInput from '../components/FloatingLabelInput';
import LoadingSpinner from '../components/LoadingSpinner';

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
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 blur-xl animate-pulse-slow"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 w-full max-w-md px-6">
        <ScrollFloat animationDuration={1}>
          <GlareHover>
            <div className="glass-premium rounded-3xl p-10 shadow-2xl animate-float-up">
              {/* Logo/Title Section */}
              <div className="text-center mb-8">
                <div className="inline-block mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                    <span className="text-3xl">🏥</span>
                  </div>
                </div>
                <h1 className="text-5xl font-extrabold mb-3 gradient-text">
                  Clinical Trial Monitor
                </h1>
                <p className="text-gray-700 font-medium text-lg">Sign in to continue</p>
              </div>

              {/* Role Selector */}
              <div className="mb-8">
                <div className="flex gap-3 p-1 glass rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRole('clinic')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      role === 'clinic'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'bg-transparent text-gray-700 hover:bg-white/20'
                    }`}
                  >
                    🏥 Clinic
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('manager')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      role === 'manager'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'bg-transparent text-gray-700 hover:bg-white/20'
                    }`}
                  >
                    👨‍💼 Manager
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {role === 'clinic' ? (
                  <FloatingLabelInput
                    label="Clinic ID"
                    type="text"
                    value={clinicId}
                    onChange={(e) => setClinicId(e.target.value)}
                    placeholder="Enter Clinic ID"
                    required
                  />
                ) : (
                  <FloatingLabelInput
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@example.com"
                    required
                  />
                )}

                <FloatingLabelInput
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />

                {error && (
                  <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 text-red-700 font-medium text-sm animate-float-up backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium w-full py-4 rounded-xl font-bold text-lg text-white relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <LoadingSpinner size="sm" />
                      <span>Signing in...</span>
                    </span>
                  ) : (
                    <span className="relative z-10">Sign In →</span>
                  )}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-center text-sm text-gray-700 font-semibold mb-3">Demo Credentials</p>
                <div className="space-y-2 text-xs">
                  <div className="glass rounded-lg p-3 text-center">
                    <p className="font-semibold text-gray-800">Clinic:</p>
                    <p className="text-gray-600">clinic1 / password123</p>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <p className="font-semibold text-gray-800">Manager:</p>
                    <p className="text-gray-600">manager@demo.com / manager123</p>
                  </div>
                </div>
              </div>
            </div>
          </GlareHover>
        </ScrollFloat>
      </div>
    </div>
  );
};

export default LoginPage;
