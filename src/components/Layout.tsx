import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b141a] text-white">
      <nav className="p-4 border-b border-white/10 flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/voice-booth">Voice Booth</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};
