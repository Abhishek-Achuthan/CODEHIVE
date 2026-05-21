import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Video, 
  ArrowRight, 
  Home, 
  CalendarPlus, 
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Header from '../../../shared/ui/Header';
import Footer from '../../../shared/ui/Footer';
import SuccessIcon from '../components/SuccessIcon';
import BookingTimeline from '../components/BookingTimeline';

interface BookingSuccessState {
  sessionId: string;
  mentorName: string;
  mentorAvatar?: string;
  topic: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  category?: string;
}

const BookingSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as BookingSuccessState | null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl text-center p-12">
            <h2 className="text-2xl font-bold text-white mb-4">Session Details Not Found</h2>
            <p className="text-zinc-400 mb-8">We couldn't retrieve your booking information. Please check your sessions list.</p>
            <button 
              onClick={() => navigate('/sessions/my-sessions')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 px-8 rounded-xl transition-colors"
            >
              View My Sessions
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const {
    sessionId,
    mentorName,
    mentorAvatar,
    topic,
    date,
    startTime,
    endTime,
    duration,
    category
  } = state;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        {/* Top Success Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <SuccessIcon />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
          >
            Session Booked <span className="text-emerald-500">Successfully</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-zinc-400 text-lg max-w-lg"
          >
            Your collaborative room will become available before the session begins.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Main Content Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/20 bg-zinc-800 flex items-center justify-center">
                      {mentorAvatar ? (
                        <img src={mentorAvatar} alt={mentorName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-white">{mentorName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{mentorName}</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full px-3 py-0.5 text-[10px] uppercase tracking-wider font-bold">
                          Mentor
                        </span>
                        {category && (
                          <span className="bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-full px-3 py-0.5 text-[10px] uppercase tracking-wider font-bold">
                            {category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-4 py-2 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">Room Pending</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Session Topic</h4>
                    <p className="text-2xl font-bold text-white leading-tight">{topic}</p>
                  </div>

                  <hr className="border-zinc-800 my-6" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-xl bg-zinc-800/50 text-indigo-400">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Date</h5>
                        <p className="text-sm font-semibold text-zinc-200">{formattedDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-xl bg-zinc-800/50 text-indigo-400">
                        <Clock size={18} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Time</h5>
                        <p className="text-sm font-semibold text-zinc-200">{startTime} - {endTime}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">{duration}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-xl bg-zinc-800/50 text-indigo-400">
                        <Video size={18} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Type</h5>
                        <p className="text-sm font-semibold text-zinc-200">1-on-1 Live Session</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-xl bg-zinc-800/50 text-indigo-400">
                        <ExternalLink size={18} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Booking ID</h5>
                        <p className="text-sm font-mono text-zinc-300">#{sessionId.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Availability Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group/room"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16 transition-opacity group-hover/room:opacity-100 opacity-50" />
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
                  <Info size={24} />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">About your workspace</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      The collaborative room will open <span className="text-indigo-400 font-bold">15 minutes</span> before the scheduled session time. You'll receive a notification and an email link.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      disabled 
                      className="w-full h-12 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-500 font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                    >
                      Join Room
                      <ChevronRight size={18} />
                    </button>
                    <p className="text-[10px] text-zinc-500 text-center font-medium italic">
                      Join access will automatically unlock when the room becomes active.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar / Timeline / Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl shadow-xl backdrop-blur-sm p-6">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Next Steps</h4>
                <BookingTimeline />
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col gap-3"
            >
              <button 
                onClick={() => navigate('/sessions/my-sessions')}
                className="group h-14 bg-white hover:bg-zinc-100 text-black border-none rounded-2xl font-black text-sm flex items-center justify-between px-6 transition-all active:scale-[0.98] shadow-lg shadow-white/5"
              >
                <span>VIEW MY SESSIONS</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/home')}
                className="h-14 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <Home size={20} />
                <span>GO TO HOMEPAGE</span>
              </button>

              <button 
                className="h-14 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <CalendarPlus size={20} />
                <span>ADD TO CALENDAR</span>
              </button>
            </motion.div>

            {/* Help text */}
            <div className="p-4 text-center">
              <p className="text-xs text-zinc-600 font-medium">
                Need help? <a href="#" className="text-indigo-500 hover:underline">Contact Support</a> or check our <a href="#" className="text-indigo-500 hover:underline">FAQ</a>.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingSuccessPage;
