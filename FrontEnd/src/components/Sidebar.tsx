import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UserPlus, 
  LogOut, 
  Building2, 
  X,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  onOpenAddModal: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onOpenAddModal, 
  isOpenMobile = false, 
  onCloseMobile 
}) => {
  const { user, logout } = useAuth();

  const content = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0256c4] text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[#0f172a] tracking-tight font-display">WorkPulse</h1>
              <p className="text-[10px] text-[#0256c4] font-extrabold uppercase tracking-widest">Enterprise HR</p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-[#64748b] hover:text-[#0f172a] rounded-lg hover:bg-[#e2e8f0]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Action Button */}
        <div className="px-4 py-5">
          <button
            onClick={() => {
              onOpenAddModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#0256c4] hover:bg-[#0145a3] text-white font-bold text-xs tracking-wider py-3 px-4 rounded-xl shadow-md shadow-blue-600/20 transition duration-200 cursor-pointer border border-[#0256c4] uppercase"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          <NavLink
            to="/"
            end
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wide transition ${
                isActive
                  ? 'bg-[#0256c4] text-white shadow-md shadow-blue-500/20'
                  : 'text-[#64748b] hover:bg-[#e2e8f0]/70 hover:text-[#0f172a]'
              }`
            }
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span>Dashboard</span>
          </NavLink>
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-[#e2e8f0]">
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#e2e8f0]/50 border border-[#cbd5e1]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#0f172a] truncate">{user?.name || 'Admin User'}</p>
              <span className="text-[10px] text-[#0284c7] flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3 text-[#0284c7]" /> System Admin
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 text-[#64748b] hover:text-[#e11d48] hover:bg-[#ffe4e6] rounded-lg transition cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="w-64 bg-[#f8fafc] border-r border-[#e2e8f0] hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 z-20">
        {content}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative w-64 bg-[#f8fafc] border-r border-[#e2e8f0] flex flex-col justify-between h-full z-10 animate-in slide-in-from-left">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
