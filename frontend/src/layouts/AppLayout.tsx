import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useLogout } from '../features/auth/hooks/useLogout';
import { NotificationBell } from '../features/notifications/components/NotificationBell';
import { UserRole } from '../shared/constants/auth';
import {
  LayoutGrid,
  TerminalSquare,
  Calendar,
  MessageSquare,
  Wallet,
  Crown,
  Settings,
  CircleUser,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

import { SubscriptionBanner } from '../features/subscription/components/SubscriptionBanner';

export default function AppLayout() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    '/sessions': location.pathname.startsWith('/sessions'),
    '/qna': location.pathname.startsWith('/qna'),
  });

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { logOut, user } = useLogout();

  useEffect(() => {
    if (location.pathname.startsWith('/qna')) {
      setOpenSubMenus(prev => ({ ...prev, '/qna': true }));
    }
    if (location.pathname.startsWith('/sessions')) {
      setOpenSubMenus(prev => ({ ...prev, '/sessions': true }));
    }
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logOut();
  };

  const toggleSubMenu = (path: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenSubMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
    if (!isExpanded && !openSubMenus[path]) {
      setIsExpanded(true);
    }
  };

  const topNavItems = [
    { name: 'Home', path: '/home', icon: LayoutGrid },
    { 
      name: 'Rooms', 
      path: '/rooms', 
      icon: TerminalSquare
    },
    { 
      name: 'Sessions', 
      path: '/sessions', 
      icon: Calendar,
      subItems: [
        { name: 'Discover', path: '/sessions/discover' },
        { name: 'My Sessions', path: '/sessions/my-sessions' },
        { name: 'Hosted', path: '/sessions/hosting', role: UserRole.MENTOR },
        { name: 'Availability', path: '/sessions/availability', role: UserRole.MENTOR }
      ]
    },
    { 
      name: 'Community', 
      path: '/qna', 
      icon: MessageSquare,
      subItems: [
        { name: 'Questions', path: '/qna' },
        { name: 'AI Assist', path: '/qna/ai-assist' },
        { name: 'Saved', path: '/qna/saved' },
        { name: 'My Questions', path: '/qna/my-questions' },
        { name: 'Answered by Me', path: '/qna/answered-by-me' },
      ]
    },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { 
      name: 'Subscription', 
      path: '/pricing', 
      icon: Crown,
      isHighlighted: true
    },
    { name: 'Profile', path: '/profile', icon: CircleUser },
  ];

  const renderNavItem = (item: any, forceExpanded: boolean = false) => {
    const expanded = forceExpanded || isExpanded;
    const Icon = item.icon;
    const isActive = item.path ? location.pathname.startsWith(item.path) : false;
    const hasSubItems = !!item.subItems;
    const isSubMenuOpen = item.path ? openSubMenus[item.path] : false;

    const LinkContent = () => (
      <>
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          <Icon className={`w-5 h-5 ${
            item.isDanger 
              ? 'text-zinc-400 group-hover:text-red-400' 
              : item.isHighlighted
                ? 'text-amber-400 group-hover:text-amber-300'
                : isActive 
                  ? 'text-indigo-400' 
                  : 'text-zinc-400 group-hover:text-zinc-200'
          }`} />
        </div>
        
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap flex items-center justify-between ${
            expanded ? 'max-w-[200px] opacity-100 ml-3 flex-1' : 'max-w-0 opacity-0 ml-0'
          }`}
        >
          <span className={`text-sm font-medium ${item.isHighlighted ? 'text-amber-300 group-hover:text-amber-200' : ''}`}>
            {item.name}
          </span>
          
          {hasSubItems && (
            <div 
              onClick={(e) => toggleSubMenu(item.path, e)}
              className="p-1 rounded-md hover:bg-zinc-700/50 shrink-0 ml-2"
            >
              <ChevronDown 
                className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`} 
              />
            </div>
          )}
        </div>
      </>
    );

    return (
      <div key={item.name} className="px-2">
        <div className="relative group">
          {item.action ? (
            <button
              onClick={() => {
                item.action();
                if (forceExpanded) setIsMobileOpen(false);
              }}
              title={!expanded ? item.name : undefined}
              className={`w-full flex items-center rounded-lg transition-all duration-200 ${
                item.isDanger ? 'group-hover:bg-red-500/10 group-hover:text-red-400' : 'group-hover:bg-zinc-800/50 group-hover:text-zinc-200'
              } ${
                expanded ? 'px-3 h-10' : 'w-10 h-10 justify-center mx-auto'
              } text-zinc-400`}
            >
              <LinkContent />
            </button>
          ) : hasSubItems ? (
            <NavLink
              to={item.subItems[0].path}
              onClick={() => {
                toggleSubMenu(item.path);
              }}
              title={!expanded ? item.name : undefined}
              className={() =>
                `flex items-center rounded-lg transition-all duration-200 group-hover:bg-zinc-800/50 ${
                  expanded ? 'px-3 h-10' : 'w-10 h-10 justify-center mx-auto'
                } ${
                  isActive
                    ? 'bg-zinc-800 text-indigo-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`
              }
            >
              <LinkContent />
            </NavLink>
          ) : (
            <NavLink
              to={item.path}
              onClick={() => {
                if (forceExpanded) setIsMobileOpen(false);
              }}
              title={!expanded ? item.name : undefined}
              className={() =>
                `flex items-center rounded-lg transition-all duration-200 ${
                  expanded ? 'px-3 h-10' : 'w-10 h-10 justify-center mx-auto'
                } ${
                  item.isHighlighted
                    ? isActive
                      ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)] font-semibold'
                      : 'bg-gradient-to-r from-amber-500/10 to-yellow-500/5 text-amber-400 border border-amber-500/20 hover:border-amber-400/40 hover:from-amber-500/20 hover:to-yellow-500/15'
                    : isActive
                      ? 'bg-zinc-800 text-indigo-400 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`
              }
            >
              <LinkContent />
            </NavLink>
          )}
        </div>
        
        {/* Sub-items accordion */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expanded && isSubMenuOpen && hasSubItems ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="ml-9 space-y-1 pb-1">
            {item.subItems?.map((sub: any) => {
              if (sub.role && user?.role !== sub.role) return null;
              
              return (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  end={sub.path === item.path}
                  onClick={() => {
                    if (forceExpanded) setIsMobileOpen(false);
                  }}
                  className={({ isActive: isSubActive }) =>
                    `block px-3 py-1.5 text-sm rounded-md transition-colors ${
                      isSubActive
                        ? 'text-indigo-400 font-medium bg-indigo-500/10'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`
                  }
                >
                  {sub.name}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B0B0D] text-zinc-100 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <SubscriptionBanner />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile md:flex) */}
        <aside
          className={`hidden md:flex relative flex-col bg-[#0B0B0D] border-r border-white/5 transition-all duration-300 ease-in-out z-40 ${
            isExpanded ? 'w-[220px]' : 'w-[68px]'
          }`}
        >
          {/* Header/Logo */}
          <div className={`flex items-center h-12 border-b border-white/5 px-3 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
            <div
              className={`flex items-center overflow-hidden transition-all duration-300 ${
                isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'
              }`}
            >
              <Link to="/home" className="flex items-center shrink-0 ml-1">
                <span className="font-bold text-lg text-white tracking-tight">
                  CODE<span className="text-indigo-500">HIVE</span>
                </span>
              </Link>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
              title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-hide">
            <div className="space-y-1">
              {topNavItems.map((item) => renderNavItem(item, false))}
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Overlay (shown on mobile when hamburger is clicked) */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Drawer */}
            <aside className="relative flex flex-col w-[260px] max-w-[80vw] h-full bg-[#0B0B0D] border-r border-white/10 shadow-2xl z-50 animate-in slide-in-from-left duration-250">
              <div className="flex items-center justify-between h-14 border-b border-white/5 px-4">
                <Link to="/home" onClick={() => setIsMobileOpen(false)} className="flex items-center">
                  <span className="font-bold text-lg text-white tracking-tight">
                    CODE<span className="text-indigo-500">HIVE</span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                {topNavItems.map((item) => renderNavItem(item, true))}
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0B0B0D] relative">
          {/* Application Header */}
          <header className="h-12 border-b border-white/5 flex items-center justify-between md:justify-end px-4 sticky top-0 bg-[#0B0B0D]/80 backdrop-blur-xl z-30">
            {/* Mobile Header Left: Hamburger + Logo */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link to="/home" className="flex items-center">
                <span className="font-bold text-base text-white tracking-tight">
                  CODE<span className="text-indigo-500">HIVE</span>
                </span>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {user && <NotificationBell />}
              {user && (
                <div className="relative profile-dropdown-container">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ml-1 focus:outline-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm text-white font-medium text-xs">
                      {user.firstName?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#111214] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-white transition-colors"
                        >
                          <CircleUser className="w-4 h-4 mr-3 text-zinc-400" />
                          Profile
                        </Link>
                        <Link 
                          to="/settings" 
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-white transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-3 text-zinc-400" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-white/5 py-1">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
