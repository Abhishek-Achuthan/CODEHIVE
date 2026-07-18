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
  Settings,
  CircleUser,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Menu
} from 'lucide-react';

export default function AppLayout() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    '/sessions': true,
    '/qna': false,
  });
  
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const { logOut, user } = useLogout();
  const location = useLocation();

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
    // Also expand sidebar if we are opening a submenu
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
      icon: MessageSquare
    },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Profile', path: '/profile', icon: CircleUser },
  ];

  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    // For actions like logout, path might be undefined
    const isActive = item.path ? location.pathname.startsWith(item.path) : false;
    const hasSubItems = !!item.subItems;
    const isSubMenuOpen = item.path ? openSubMenus[item.path] : false;

    const LinkContent = () => (
      <>
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          <Icon className={`w-5 h-5 ${
            item.isDanger 
              ? 'text-zinc-400 group-hover:text-red-400' 
              : isActive 
                ? 'text-indigo-400' 
                : 'text-zinc-400 group-hover:text-zinc-200'
          }`} />
        </div>
        
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap flex items-center justify-between ${
            isExpanded ? 'max-w-[200px] opacity-100 ml-3 flex-1' : 'max-w-0 opacity-0 ml-0'
          }`}
        >
          <span className="text-sm font-medium">{item.name}</span>
          
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
              onClick={item.action}
              title={!isExpanded ? item.name : undefined}
              className={`w-full flex items-center rounded-lg transition-all duration-200 ${
                item.isDanger ? 'group-hover:bg-red-500/10 group-hover:text-red-400' : 'group-hover:bg-zinc-800/50 group-hover:text-zinc-200'
              } ${
                isExpanded ? 'px-3 h-10' : 'w-10 h-10 justify-center mx-auto'
              } text-zinc-400`}
            >
              <LinkContent />
            </button>
          ) : hasSubItems ? (
            <NavLink
              to={item.subItems[0].path}
              onClick={() => toggleSubMenu(item.path)}
              title={!isExpanded ? item.name : undefined}
              className={() =>
                `flex items-center rounded-lg transition-all duration-200 group-hover:bg-zinc-800/50 ${
                  isExpanded ? 'px-3 h-10' : 'w-10 h-10 justify-center mx-auto'
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
              title={!isExpanded ? item.name : undefined}
              className={() =>
                `flex items-center rounded-lg transition-all duration-200 group-hover:bg-zinc-800/50 ${
                  isExpanded ? 'px-3 h-10' : 'w-10 h-10 justify-center mx-auto'
                } ${
                  isActive
                    ? 'bg-zinc-800 text-indigo-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
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
            isExpanded && isSubMenuOpen && hasSubItems ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'
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
    <div className="flex h-screen bg-[#0B0B0D] text-zinc-100 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col bg-[#0B0B0D] border-r border-white/5 transition-all duration-300 ease-in-out z-40 ${
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
            {topNavItems.map(renderNavItem)}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0B0B0D] relative">
        {/* Application Header */}
        <header className="h-12 border-b border-white/5 flex items-center justify-end px-4 sticky top-0 bg-[#0B0B0D]/80 backdrop-blur-xl z-30">
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
  );
}
