import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../../shared/ui/Header';
import Footer from '../../../shared/ui/Footer';
import { SessionsSidebar } from './SessionsSidebar';

const SessionsLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-white selection:bg-indigo-500/30">
            <Header />
            
            <div className="flex flex-1">
                <SessionsSidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full p-6">
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default SessionsLayout;
