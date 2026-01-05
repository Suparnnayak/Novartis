import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header role="navigation" aria-label="Main navigation" className="w-full bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 focus:outline-none" aria-label="Go home">
              <span className="text-lg md:text-xl font-bold text-slate-800">TrialGuard AI</span>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-4" aria-hidden={open ? 'true' : 'false'}>
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">Home</Link>
            <Link to="/login" className="px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">Login</Link>
            <Link to="/clinic" className="px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">Clinic</Link>
            <Link to="/manager" className="px-4 py-2 bg-gradient-to-r from-[#1a6ea8] to-[#36c7b1] text-white rounded-lg font-semibold">Manager</Link>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 border-t border-gray-100">
          <div className="px-4 pt-4 pb-4 space-y-1">
            <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Home</Link>
            <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Login</Link>
            <Link to="/clinic" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Clinic</Link>
            <Link to="/manager" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-[#1a6ea8] to-[#36c7b1] text-center rounded-lg">Manager</Link>
          </div>
        </div>
      )}
    </header>
  );
}
