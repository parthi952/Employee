import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Search, UserPlus, LogOut, Bell, Settings } from 'lucide-react';

interface NavbarProps {
  title: string;
  onOpenAddModal: () => void;
  onOpenMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  title, 
  onOpenAddModal, 
  onOpenMobileSidebar 
}) => {
  const { user, logout } = useAuth();
  const [globalSearch, setGlobalSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <header className="h-16 shrink-0 bg-white border-b border-[#e2e8f0] sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 text-[#64748b] hover:text-[#0f172a] rounded-lg hover:bg-[#f1f5f9] cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-lg md:text-xl font-bold text-[#0f172a] tracking-tight font-display">{title}</h2>
      </div>

      {/* Center: Top bar Quick Search */}
      <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center max-w-xs w-full">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Quick search employee..."
            className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-1.5 pl-9 pr-3 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:border-[#0256c4] focus:bg-white focus:outline-none transition"
          />
        </div>
      </form>

      {/* Right: Admin Pill, Bell & Settings Icons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenAddModal}
          className="md:hidden flex items-center gap-1 bg-[#0256c4] hover:bg-[#0145a3] text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Add
        </button>

        {/* Admin Pill */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] text-xs text-[#64748b]">
          <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse"></span>
          <span>Logged in: <strong className="text-[#0f172a] font-semibold">{user?.name || user?.email || 'Admin User'}</strong></span>
          <span className="px-2 py-0.5 rounded bg-[#dbeafe] text-[#1e40af] text-[10px] font-extrabold uppercase tracking-wider">
            ADMIN
          </span>
        </div>

        {/* Action Header Icons */}
        <button
          className="hidden sm:flex p-2 text-[#64748b] hover:text-[#0f172a] rounded-xl border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        <button
          className="hidden sm:flex p-2 text-[#64748b] hover:text-[#0f172a] rounded-xl border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] transition cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Mobile Logout */}
        <button
          onClick={logout}
          className="md:hidden p-2 text-[#64748b] hover:text-[#e11d48] hover:bg-[#ffe4e6] rounded-lg transition"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
