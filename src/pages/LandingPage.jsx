import { useNavigate } from 'react-router-dom';
import ScrollFloat from '../components/ScrollFloat';
import GlareHover from '../components/GlareHover';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 focus:outline-none">
            <span className="text-lg md:text-2xl font-bold text-slate-800">TrialGuard AI</span>
          </button>
          <div className="hidden md:flex items-center gap-3">
            <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold">Demo mode</span>
            <button onClick={() => navigate('/login')} className="px-3 py-1 text-gray-700 hover:text-gray-900 font-medium">Login</button>
            <button onClick={() => navigate('/login')} className="px-3 py-1 text-gray-700 hover:text-gray-900 font-medium">Clinic</button>
            <button onClick={() => navigate('/login')} className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm">Manager</button>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => navigate('/login')} className="px-3 py-2 bg-blue-600 text-white rounded-md">Menu</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <ScrollFloat>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Premium staff-only portal
            </div>
            <h2 className="text-3xl md:text-6xl font-extrabold leading-tight mb-6">
              Accelerate your trials with an{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
                AI-powered workspace
              </span>
            </h2>
            <p className="text-base md:text-xl text-gray-600 mb-8 leading-relaxed">
              Monitor clinical sites, detect delays & safety risks, and get AI-assisted explanations in one 
              sleek interface. Responsive dashboards keep every action reachable on any device.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Register as Manager
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-3 md:px-8 md:py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Register as Clinic
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-3 md:px-8 md:py-4 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 rounded-xl font-bold text-base md:text-lg transition-all"
              >
                Login
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-4xl font-bold text-gray-900">120+</div>
                <div className="text-sm text-gray-600 mt-1">Clinics onboarded</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">4.5k</div>
                <div className="text-sm text-gray-600 mt-1">Site approvals</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">68k</div>
                <div className="text-sm text-gray-600 mt-1">Updates tracked</div>
              </div>
            </div>
          </div>
        </ScrollFloat>

        <ScrollFloat delay={200}>
          <GlareHover>
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Live monitoring snapshot</p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">Clinic Site #23 • Trial CTM-2025</h3>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">On Track</span>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg Compliance</p>
                  <p className="text-4xl font-bold text-gray-900">92%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Data Completion</p>
                  <p className="text-4xl font-bold text-gray-900">88%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pending alerts</p>
                  <p className="text-4xl font-bold text-gray-900">3</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Reports submitted</p>
                  <p className="text-4xl font-bold text-gray-900">46</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-900 italic">
                  "Managers detect risks in real-time and respond within minutes via AI-powered insights."
                </p>
              </div>
            </div>
          </GlareHover>
        </ScrollFloat>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-5xl font-bold text-center mb-4">
            Your all-in-one{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              monitoring companion
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <ScrollFloat delay={0}>
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Real-time Analytics</h3>
                <p className="text-gray-600 text-sm">Auto-generated insights from clinical trial data across sites</p>
              </div>
            </ScrollFloat>
            <ScrollFloat delay={100}>
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-3xl">🧪</span>
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Smart Monitoring</h3>
                <p className="text-gray-600 text-sm">Site-specific structured tracking of adverse events and compliance</p>
              </div>
            </ScrollFloat>
            <ScrollFloat delay={200}>
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-xl font-bold text-purple-600 mb-2">Quick Alerts</h3>
                <p className="text-gray-600 text-sm">AI-generated risk summaries for delayed or abnormal patterns</p>
              </div>
            </ScrollFloat>
            <ScrollFloat delay={300}>
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-100 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-orange-600 mb-2">Risk Detection</h3>
                <p className="text-gray-600 text-sm">Instant anomaly detection with LOW/MEDIUM/HIGH risk scoring</p>
              </div>
            </ScrollFloat>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
            Get started in{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollFloat delay={0}>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl">🏥</span>
                </div>
                <div className="text-pink-500 font-bold text-sm mb-2">01</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Register as Manager</h3>
                <p className="text-gray-600">Create your trial account in seconds</p>
              </div>
            </ScrollFloat>
            <ScrollFloat delay={100}>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl">✅</span>
                </div>
                <div className="text-pink-500 font-bold text-sm mb-2">02</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Invite & Monitor Sites</h3>
                <p className="text-gray-600">Clinics sign up, you review and approve</p>
              </div>
            </ScrollFloat>
            <ScrollFloat delay={200}>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl">📈</span>
                </div>
                <div className="text-pink-500 font-bold text-sm mb-2">03</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Track & Get Insights</h3>
                <p className="text-gray-600">Monitor compliance, track progress real-time</p>
              </div>
            </ScrollFloat>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Why trials choose us</h2>
          <p className="text-center text-gray-600 mb-12">
            Staff-only portal with AI-powered tools that make clinical trial management and monitoring seamless.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100">
              <span className="text-3xl mb-2 block">⚡</span>
              <h4 className="font-bold text-gray-900 mb-1">Instant detection workflows</h4>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
              <span className="text-3xl mb-2 block">📊</span>
              <h4 className="font-bold text-gray-900 mb-1">Real-time insights</h4>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
              <span className="text-3xl mb-2 block">🤖</span>
              <h4 className="font-bold text-gray-900 mb-1">AI alert generation</h4>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-6 border border-yellow-100">
              <span className="text-3xl mb-2 block">💡</span>
              <h4 className="font-bold text-gray-900 mb-1">24/7 risk monitoring</h4>
            </div>
          </div>
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-yellow-700">4.9 rating from 120+ trials</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-6">About this platform</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-6">
            This web portal is exclusively for clinical trial staff—managers and site coordinators. Use it to manage 
            approvals, monitor site progress, and access trial-level insights. Patient data submission happens through 
            regulated EDC systems.
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-blue-600 font-semibold">Staff-only access</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-3xl shadow-2xl p-16 text-center text-white">
          <h2 className="text-5xl font-extrabold mb-6">Ready for a premium trial monitoring portal?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join 120+ trials that trust our platform for site management, approvals, and safety insights.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Start as Manager
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">© 2026 TrialGuard AI. Demo platform for hackathon presentation.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
