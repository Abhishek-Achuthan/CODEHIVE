import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../shared/hooks/storeHooks';
import { useMyRooms } from '../../room/hooks/useMyRooms';
import { useFetchSessions } from '../../session/hooks/useFetchSessions';
import { useQuestionsList } from '../../qna/hooks/useListQuestions';
import {
  ArrowRight,
  Calendar,
  Layout,
  MessageSquare,
  Users,
  TerminalSquare,
  Sparkles,
  Clock,
  Play
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  
  const { rooms, isLoading: roomsLoading } = useMyRooms(true);
  const { sessions } = useFetchSessions({ limit: 3 });
  const { questions, loading: questionsLoading } = useQuestionsList();

  const activeRooms = rooms?.items?.slice(0, 4) || [];
  const upcomingSessions = sessions?.slice(0, 3) || [];
  const recentQuestions = questions?.slice(0, 4) || [];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 lg:p-8 space-y-8 bg-[#0B0B0D] min-h-full">
      {/* Header */}
      <section className="flex flex-col gap-1">
        <p className="text-zinc-400 text-sm">What do you want to do today?</p>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Welcome back, {user?.firstName || 'Developer'}
        </h1>
      </section>

      {/* Primary Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          to="/rooms" 
          className="group flex items-center gap-4 p-4 rounded-[16px] bg-[#111214] border border-white/5 hover:border-indigo-500/30 hover:bg-[#17181C] transition-all duration-300 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform duration-300">
            <TerminalSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white">Create Room</h2>
            <p className="text-xs text-zinc-500">Start a coding workspace</p>
          </div>
        </Link>

        <Link 
          to="/sessions/discover" 
          className="group flex items-center gap-4 p-4 rounded-[16px] bg-[#111214] border border-white/5 hover:border-purple-500/30 hover:bg-[#17181C] transition-all duration-300 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform duration-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white">Discover Mentors</h2>
            <p className="text-xs text-zinc-500">Book a 1-on-1 session</p>
          </div>
        </Link>

        <Link 
          to="/qna" 
          className="group flex items-center gap-4 p-4 rounded-[16px] bg-[#111214] border border-white/5 hover:border-emerald-500/30 hover:bg-[#17181C] transition-all duration-300 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform duration-300">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white">Ask Question</h2>
            <p className="text-xs text-zinc-500">Get community help</p>
          </div>
        </Link>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (roughly 66%) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Continue Working */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium text-white">
                Continue Working
              </h2>
              <Link to="/rooms" className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            {roomsLoading ? (
              <div className="h-24 rounded-[16px] bg-white/5 animate-pulse border border-white/5" />
            ) : activeRooms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeRooms.map((room) => (
                  <div 
                    key={room.id} 
                    className="flex flex-col p-4 rounded-[16px] bg-[#111214] border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-medium text-white truncate pr-4">{room.title}</h3>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-1 pr-4">{room.description || 'No description'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-medium uppercase tracking-wider shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active
                      </div>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(room.createdAt))}</span>
                      </div>
                      <Link 
                        to={`/rooms/${room.id}`}
                        className="flex items-center gap-1.5 text-xs font-medium text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Join <Play className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-[16px] bg-[#111214] border border-white/5 text-center flex flex-col items-center justify-center min-h-[140px]">
                <Layout className="w-6 h-6 text-zinc-600 mb-2" />
                <h3 className="text-sm text-zinc-300 font-medium mb-1">No active workspace</h3>
                <p className="text-xs text-zinc-500 mb-3">You haven't joined any active rooms recently.</p>
                <Link to="/rooms" className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-lg transition-colors">
                  Create Room
                </Link>
              </div>
            )}
          </section>

          {/* Community Snapshot */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Community
              </h2>
              <Link to="/qna" className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                Browse all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            {questionsLoading ? (
              <div className="h-32 rounded-[16px] bg-white/5 animate-pulse border border-white/5" />
            ) : recentQuestions.length > 0 ? (
              <div className="rounded-[16px] bg-[#111214] border border-white/5 divide-y divide-white/5">
                {recentQuestions.map((q) => (
                  <Link 
                    to={`/qna/${q.id}`} 
                    key={q.id}
                    className="flex items-start justify-between p-4 hover:bg-[#17181C] transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-zinc-200 mb-1.5 line-clamp-1">{q.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        {q.tags?.[0] && (
                          <span className="px-2 py-0.5 rounded-md bg-white/5">{q.tags[0]}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{q.answerCount || 0}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-[16px] bg-[#111214] border border-white/5 text-center flex flex-col items-center justify-center min-h-[140px]">
                <MessageSquare className="w-6 h-6 text-zinc-600 mb-2" />
                <h3 className="text-sm text-zinc-300 font-medium mb-1">No recent activity</h3>
                <p className="text-xs text-zinc-500">Be the first to ask a question.</p>
              </div>
            )}
          </section>

        </div>

        {/* Right Column (roughly 33%) */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* Upcoming Sessions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Upcoming Sessions
              </h2>
              <Link to="/sessions/my-sessions" className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.map((session) => {
                  const startTime = new Date(session.startTime);
                  return (
                    <div 
                      key={session.id}
                      className="p-4 rounded-[16px] bg-[#111214] border border-white/5"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white line-clamp-1">{session.mentor?.firstName || 'Mentor'}</h4>
                            <p className="text-xs text-zinc-500">1-on-1 Session</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-xs text-white font-medium">{format(startTime, 'h:mm a')}</span>
                          <span className="text-[10px] text-zinc-500 uppercase">{formatDistanceToNow(startTime, { addSuffix: true })}</span>
                        </div>
                        <button className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-medium rounded-lg transition-colors">
                          Join Call
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-[16px] bg-[#111214] border border-white/5 flex flex-col items-center justify-center min-h-[140px] text-center">
                <Calendar className="w-6 h-6 text-zinc-600 mb-2" />
                <h3 className="text-sm font-medium text-zinc-300 mb-1">No sessions</h3>
                <p className="text-xs text-zinc-500">Your schedule is clear.</p>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
