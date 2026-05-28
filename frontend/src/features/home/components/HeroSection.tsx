import { motion } from 'framer-motion';
import { Code2, Users, MonitorPlay } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateRoomButton } from '../../room/components/CreateRoomButton';

interface HeroSectionProps {
  onOpenModal: () => void;
}

const HeroSection = ({ onOpenModal }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-black pt-24 pb-32">
      {/* Background gradients/glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-8 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Introducing CodeHive Collaborative Rooms
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 max-w-4xl"
        >
          Code Together, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            Learn Together.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed"
        >
          The ultimate platform for collaborative coding, technical interviews, and mentorship. Build projects in real-time with an integrated editor, whiteboard, and voice rooms.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <CreateRoomButton onClick={onOpenModal} />
          <button
            onClick={() => navigate('/sessions/discover')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white border border-zinc-800 font-semibold rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Find a Mentor
          </button>
        </motion.div>

        {/* Mock UI Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 w-full max-w-5xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl" />
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Mock Header */}
            <div className="flex items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto flex gap-4 text-xs text-zinc-500 font-mono">
                <span className="flex items-center gap-1"><Code2 className="w-3 h-3" /> index.ts</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 3 connected</span>
                <span className="flex items-center gap-1"><MonitorPlay className="w-3 h-3" /> Voice active</span>
              </div>
            </div>
            {/* Mock Content area */}
            <div className="flex h-[400px]">
              {/* Sidebar */}
              <div className="w-48 border-r border-zinc-800 bg-zinc-900/30 p-4 hidden md:block">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-zinc-800/50 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-zinc-800/50 rounded animate-pulse" />
                </div>
              </div>
              {/* Editor */}
              <div className="flex-1 p-6 font-mono text-sm">
                <div className="text-blue-400">import <span className="text-zinc-300">&#123; Collaboration &#125;</span> from <span className="text-green-400">'@codehive/core'</span>;</div>
                <div className="mt-4"><span className="text-purple-400">const</span> <span className="text-blue-300">room</span> = <span className="text-purple-400">new</span> <span className="text-yellow-300">Collaboration</span>();</div>
                <div className="mt-2 text-zinc-500">// Real-time cursors active</div>
                <div className="mt-1"><span className="text-blue-300">room</span>.<span className="text-yellow-300">on</span>(<span className="text-green-400">'join'</span>, (<span className="text-orange-300">user</span>) <span className="text-purple-400">=&gt;</span> &#123;</div>
                <div className="ml-4 mt-1"><span className="text-blue-300">console</span>.<span className="text-yellow-300">log</span>(<span className="text-green-400">\`$&#123;user.name&#125; joined the session\`</span>);</div>
                <div className="mt-1">&#125;);</div>
                
                {/* Cursor mock */}
                <div className="mt-2 flex items-center">
                  <div className="w-[2px] h-4 bg-blue-500 animate-pulse" />
                  <div className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-blue-500 text-white font-sans">Alex</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
