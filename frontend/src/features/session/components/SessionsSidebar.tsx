import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Calendar, Video, Clock } from 'lucide-react';
import { useAppSelector } from '../../../shared/hooks/storeHooks';

export const SessionsSidebar: React.FC = () => {
    const user = useAppSelector((state) => state.auth.user);
    const isMentor = user?.mentorStatus === 'approved';

    const navItems = [
        {
            title: 'Discover Sessions',
            path: '/sessions/discover',
            icon: <Compass className="h-5 w-5" />,
            show: true
        },
        {
            title: 'My Sessions',
            path: '/sessions/my-sessions',
            icon: <Calendar className="h-5 w-5" />,
            show: true
        },
        {
            title: 'Hosted Sessions',
            path: '/sessions/hosting',
            icon: <Video className="h-5 w-5" />,
            show: isMentor
        },
        {
            title: 'Availability',
            path: '/sessions/availability',
            icon: <Clock className="h-5 w-5" />,
            show: isMentor
        }
    ];

    return (
        <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl h-[calc(100vh-64px)] sticky top-16 flex flex-col">
            <nav className="flex-1 space-y-1 px-3 py-6">
                {navItems.filter(item => item.show).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${isActive
                                ? 'bg-indigo-500/10 text-indigo-400'
                                : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                )}
                                <span className={`transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                    {item.icon}
                                </span>
                                {item.title}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="rounded-xl bg-linear-to-br from-indigo-500/5 to-purple-500/5 p-4 border border-white/5 shadow-inner">
                    <p className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest mb-1.5">Account Status</p>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isMentor ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-gray-600'}`} />
                        <p className="text-xs font-medium text-gray-300">{isMentor ? 'Mentor Profile Active' : 'Student Account'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
