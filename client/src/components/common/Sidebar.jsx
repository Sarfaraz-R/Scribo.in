import React, { useState, useEffect } from 'react';
import {
  Code2,
  ChevronLeft,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  LayoutDashboard,
  ClipboardList,
  Send,
  BarChart2,
  Trophy,
  Menu,
  X,
  User,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLogout } from '../../hooks/useLogout';

const navLinks = [
  {
    id: 'home',
    icon: LayoutDashboard,
    label: 'Home',
    path: '/student/dashboard',
  },
  { id: 'practice', icon: Code2, label: 'Practice', path: '/student/practice' },
  {
    id: 'tests',
    icon: ClipboardList,
    label: 'My Tests',
    path: '/student/tests',
  },
  {
    id: 'submissions',
    icon: Send,
    label: 'Submissions',
    path: '/student/submissions',
  },
];

const exploreLinks = [
  {
    id: 'analytics',
    icon: BarChart2,
    label: 'Analytics',
    path: '/student/analytics',
  },
  {
    id: 'leaderboard',
    icon: Trophy,
    label: 'Leaderboard',
    path: '/student/leaderboard',
  },
];

const SIDEBAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@400;500;600;700&display=swap');

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #070709; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #f97316; }

  .sidebar {
    width: 240px;
    height: 100vh;
    background: #070709;
    border-right: 1px solid rgba(255,255,255,0.04);
    display: flex;
    
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    transition: width 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s ease;
    z-index: 200;
    font-family: 'DM Sans', sans-serif;
  }
  .sidebar.collapsed { width: 68px; }

  @media (max-width: 1024px) {
    .sidebar { transform: translateX(-100%); width: 260px !important; }
    .sidebar.mobile-open { transform: translateX(0); box-shadow: 10px 0 50px rgba(0,0,0,0.8); }
    .sidebar-toggle { display: none !important; }
  }

  .compact-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 48px;
    background: #0d1117;
    border-bottom: 1px solid #1e2d3d;
    z-index: 250;
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap:20px;
  }

  .sidebar-logo { padding: 32px 24px 20px; position: relative; flex-shrink: 0; }
  .sidebar.collapsed .logo-text, 
  .sidebar.collapsed .nav-text, 
  .sidebar.collapsed .user-info, 
  .sidebar.collapsed .nav-label,
  .sidebar.collapsed .plan-card {
    opacity: 0; pointer-events: none; width: 0;
  }

  .sidebar-toggle {
    position: absolute;
    right: -10px; top: 36px;
    width: 20px; height: 20px;
    background: #070709;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #fff; cursor: pointer; z-index: 10;
  }

  .nav-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 12px;
    border-radius: 8px; color: rgba(255,255,255,0.4); text-decoration: none;
    font-size: 13px; font-weight: 500; transition: all 0.2s; margin-bottom: 2px;
  }
  .nav-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
  .nav-item.active { background: rgba(249,115,22,0.1); color: #f97316; }

  .syne { font-family: 'Syne', sans-serif; }
  .sidebar-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    z-index: 190; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
  }
  .sidebar-backdrop.visible { opacity: 1; pointer-events: auto; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
`;

const Sidebar = ({ collapsed, setCollapsed, compact = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const user = useSelector((s) => s.auth.user.name);
  const isActive = (path) => location.pathname.startsWith(path);
  const shortName = user.charAt(0);
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* ── RENDER COMPACT (Horizontal) ── */
  if (compact) {
    const allLinks = [...navLinks, ...exploreLinks];
    return (
      <>
        <style>{SIDEBAR_STYLES}</style>
        <nav className="compact-nav font-['DM_Sans'] px-4">
          <button
            onClick={() => navigate('/student/practice')}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-all text-xs mr-4 shrink-0"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <div className="flex flex-col mr-6 shrink-0">
            <span className="text-white text-sm font-bold syne leading-none">
              Scribo
            </span>
            <span className="text-[#f97316] text-[8px] font-bold tracking-widest uppercase">
              Every Line Counts
            </span>
          </div>
          <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {allLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${isActive(link.path) ? 'bg-[#161e28] text-white' : 'text-gray-500 hover:text-white'}`}
              >
                <link.icon
                  size={13}
                  className={isActive(link.path) ? 'text-[#f97316]' : ''}
                />
                <span className="hidden lg:inline">{link.label}</span>
              </Link>
            ))}
          </div>
          <button
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="w-7 h-7 rounded-full bg-[#f97316] flex items-center justify-center text-white text-xs font-bold ml-4 ring-2 ring-orange-500/20 hover:ring-orange-500/40 transition-all"
          >
            AS
          </button>
        </nav>
      </>
    );
  }

  /* ── RENDER DEFAULT (Vertical) ── */
  return (
    <>
      <style>{SIDEBAR_STYLES}</style>

      <div className="lg:hidden w-full h-16 bg-[#070709] border-b border-white/5 flex items-center justify-between px-4 fixed top-0 left-0 z-[180]">
        <div className="flex flex-col">
          <h1 className="text-white text-lg font-bold syne leading-none text-left">
            Scribo
          </h1>
          <p className="text-[#f97316] text-[10px] font-bold uppercase tracking-wider text-left">
            Every Line Counts
          </p>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <div
        className={`sidebar-backdrop ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      >
        <div className="sidebar-logo">
          <div className="logo-text text-left">
            <div
              className="syne"
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              Scribo
            </div>
            <div
              style={{
                color: '#f97316',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              Every Line counts
            </div>
          </div>
          {/* <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            {/* <ChevronLeft
              size={12}
              style={{
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            /> */}
          {/* </button> */}
        </div>

        <div className="sidebar-user mx-3 mb-4 p-3 bg-white/[0.02] rounded-xl flex items-center gap-3 overflow-hidden">
          <div className="avatar shrink-0">RS</div>
          <div className="user-info flex-1 min-w-0 text-left">
            <div className="text-white text-xs font-semibold truncate">
              {user}
            </div>
            <div className="text-white/20 text-[9px] truncate">
              1RN22CS087 · Student
            </div>
          </div>
        </div>

        <div className="flex-1 px-3 overflow-y-auto no-scrollbar">
          {/* Navigation Section */}
          <div className="nav-label text-[9px] text-white/20 uppercase font-bold tracking-widest mb-2 px-3 text-left">
            Navigation
          </div>
          <div className="mb-6">
            {navLinks.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <item.icon size={15} className="shrink-0" />
                <span className="nav-text truncate">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Explore Section */}
          <div className="nav-label text-[9px] text-white/20 uppercase font-bold tracking-widest mb-2 px-3 text-left">
            Explore
          </div>
          <div>
            {exploreLinks.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <item.icon size={15} className="shrink-0" />
                <span className="nav-text truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-white/5">
          <Link
            to="/student/settings"
            className={`nav-item ${isActive('/student/settings') ? 'active' : ''}`}
          >
            <Settings size={15} /> <span className="nav-text">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="nav-item w-full text-red-500/40 hover:text-red-500 transition-colors"
          >
            <LogOut size={15} /> <span className="nav-text">Logout</span>
          </button>

          <div className="mt-3 p-3 bg-gradient-to-tr from-orange-500/10 to-transparent border border-orange-500/10 rounded-xl plan-card text-left">
            <div className="flex items-center gap-1.5 mb-1 text-[#f97316]">
              <GraduationCap size={12} />{' '}
              <span className="text-[9px] font-bold uppercase tracking-widest">
                Student Plan
              </span>
            </div>
            <div className="text-[10px] text-white/20">
              4 tests completed · 7 streak 🔥
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
