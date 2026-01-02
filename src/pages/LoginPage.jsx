import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, setUser } from '../services/auth';
import ScrollFloat from '../components/ScrollFloat';
import GlareHover from '../components/GlareHover';

const LoginPage = () => {
  const [role, setRole] = useState('clinic');
  const [clinicId, setClinicId] = useState('clinic1');
  const navigate = useNavigate();

  const handleQuickLogin = () => {
    // Auto-login without password validation
    if (role === 'clinic') {
      const user = { id: clinicId, clinicId, role: 'clinic', email: `${clinicId}@demo.com` };
      setAuthToken(`demo_token_${clinicId}`);
      setUser(user);
      navigate('/clinic');
    } else {
      const user = { id: 'manager1', role: 'manager', email: 'manager@demo.com' };
      setAuthToken('demo_token_manager');
      setUser(user);
      navigate('/manager');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-5xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <ScrollFloat>
            <div className="text-center lg:text-left">
              <div className="inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-all">
                  <span className="text-5xl">🏥</span>
                </div>
              </div>
              <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Clinical Trial Monitor
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Real-time safety monitoring and compliance tracking for clinical trials
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold text-gray-700">120+ Active Trials</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-semibold text-gray-700">4.9 Rating</span>
                </div>
              </div>
            </div>
          </ScrollFloat>

          {/* Right side - Login Form */}
          <ScrollFloat delay={200}>
            <GlareHover>
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500">
                <div className="text-center mb-8">
                  <div className="inline-block mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                      <span className="text-3xl">🏥</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Access Dashboard</h2>
                  <p className="text-gray-600 font-medium">Select your role to continue</p>
                </div>

                {/* Premium Role Selector */}
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('clinic')}
                      className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                        role === 'clinic'
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 shadow-2xl scale-105 ring-4 ring-blue-100'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-xl hover:scale-102'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-5xl mb-3 transition-all duration-500 ${role === 'clinic' ? 'scale-125 animate-bounce' : 'group-hover:scale-110'}`}>
                          🏥
                        </div>
                        <div className={`font-bold text-lg ${role === 'clinic' ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}`}>
                          Clinic Site
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">Submit trial updates</div>
                      </div>
                      {role === 'clinic' && (
                        <div className="absolute -top-2 -right-2 animate-bounce">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('manager')}
                      className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                        role === 'manager'
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 shadow-2xl scale-105 ring-4 ring-purple-100'
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-xl hover:scale-102'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-5xl mb-3 transition-all duration-500 ${role === 'manager' ? 'scale-125 animate-bounce' : 'group-hover:scale-110'}`}>
                          👨‍💼
                        </div>
                        <div className={`font-bold text-lg ${role === 'manager' ? 'text-purple-600' : 'text-gray-700 group-hover:text-purple-600'}`}>
                          Manager
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">Monitor all trials</div>
                      </div>
                      {role === 'manager' && (
                        <div className="absolute -top-2 -right-2 animate-bounce">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Clinic Selector (only for clinic role) */}
                {role === 'clinic' && (
                  <div className="mb-6 animate-float-up">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Select Your Clinic</label>
                    <div className="relative">
                      <select
                        value={clinicId}
                        onChange={(e) => setClinicId(e.target.value)}
                        className="w-full px-4 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-semibold text-gray-800 appearance-none cursor-pointer hover:border-blue-400 shadow-sm"
                      >
                        <option value="clinic1">🏥 Clinic 1 - Boston Medical Center</option>
                        <option value="clinic2">🏥 Clinic 2 - Stanford Health</option>
                        <option value="clinic3">🏥 Clinic 3 - Mayo Research</option>
                        <option value="clinic4">🏥 Clinic 4 - Johns Hopkins</option>
                        <option value="clinic5">🏥 Clinic 5 - Cleveland Clinic</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Access Button */}
                <button
                  onClick={handleQuickLogin}
                  className="group relative w-full py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {role === 'clinic' ? (
                      <>
                        <span className="text-2xl">🏥</span>
                        <span>Access Clinic Dashboard</span>
                        <span className="text-xl">→</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">👨‍💼</span>
                        <span>Access Manager Dashboard</span>
                        <span className="text-xl">→</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Info Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl p-5 border border-blue-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Demo Mode Active</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          No password required. Click above to access the dashboard instantly.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pt-3 border-t border-blue-200">
                      <span className="text-lg">🔐</span>
                      <div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          <span className="font-semibold text-gray-700">Note:</span> Authentication and authorization will be implemented in production with role-based access control, JWT tokens, and secure session management.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlareHover>
          </ScrollFloat>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
