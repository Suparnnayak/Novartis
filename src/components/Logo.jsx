import React from 'react';

export default function Logo({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#1a6ea8" />
          <stop offset="100%" stopColor="#36c7b1" />
        </linearGradient>
      </defs>
      <rect x="2" y="6" width="60" height="52" rx="8" fill="url(#g1)" opacity="0.96" />
      <path d="M18 36c5-6 12-8 18-4s10 2 12 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95" />
      <circle cx="20" cy="24" r="3" fill="#fff" opacity="0.95" />
    </svg>
  );
}
