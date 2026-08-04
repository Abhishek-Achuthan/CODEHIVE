import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';


const SessionsLayout: React.FC = () => {
    const location = useLocation();

    let title = "Discover Sessions";
    let description = "Find and book mentorship sessions with industry experts";

    if (location.pathname.includes('/sessions/my-sessions')) {
        title = "My Sessions";
        description = "Sessions you've booked as a user";
    } else if (location.pathname.includes('/sessions/hosting')) {
        title = "Hosted Sessions";
        description = "Sessions you're conducting as a mentor";
    } else if (location.pathname.includes('/sessions/reviews')) {
        title = "Student Reviews";
        description = "See what students are saying about your mentorship sessions";
    } else if (location.pathname.includes('/sessions/availability')) {
        title = "Availability";
        description = "Set up your schedule so students can book mentorship sessions with you";
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-6 lg:p-8 space-y-8 bg-app min-h-full">
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold text-white tracking-tight">
                        {title}
                    </h1>
                    <p className="text-[15px] text-zinc-400">
                        {description}
                    </p>
                </div>
            </section>
            
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default SessionsLayout;
