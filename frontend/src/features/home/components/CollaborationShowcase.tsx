import { motion } from 'framer-motion';
import { Play, CheckCircle2, MessageSquare, Mic } from 'lucide-react';

const CollaborationShowcase = () => {
  return (
    <section className="py-24 bg-zinc-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-blue-500/5 mix-blend-screen pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">true collaboration</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              We've built a workspace that feels like you're sitting right next to your pair. With zero-latency cursor syncing and integrated voice, you can focus on the code, not the setup.
            </p>

            <ul className="space-y-6">
              {[
                { icon: <CheckCircle2 className="text-green-400 w-6 h-6" />, text: 'Multiplayer Monaco Editor with Yjs' },
                { icon: <Mic className="text-blue-400 w-6 h-6" />, text: 'High-quality WebRTC Audio Rooms' },
                { icon: <MessageSquare className="text-purple-400 w-6 h-6" />, text: 'Context-aware Chat and Presence' }
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-4 text-zinc-300 font-medium"
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  {item.text}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Visual Showcase */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-2"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-2xl -z-10" />
              
              {/* Fake Video Player or Dashboard Preview */}
              <div className="aspect-video bg-black rounded-xl overflow-hidden relative group">
                {/* Overlay Image / Mockup */}
                <div className="absolute inset-0 flex flex-col">
                  {/* Top bar */}
                  <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-xs text-zinc-500 font-mono">React Hooks Refactoring</div>
                  </div>
                  {/* Fake Code / Video Area */}
                  <div className="flex-1 bg-zinc-950 p-6 font-mono text-sm text-zinc-300 relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <div className="w-8 h-8 rounded bg-blue-600 border border-blue-500 flex items-center justify-center text-xs">Me</div>
                      <div className="w-8 h-8 rounded bg-purple-600 border border-purple-500 flex items-center justify-center text-xs">SJ</div>
                    </div>
                    <div className="text-blue-400">function <span className="text-yellow-300">useData</span>() &#123;</div>
                    <div className="ml-4 mt-2">const [data, setData] = <span className="text-blue-300">useState</span>(null);</div>
                    <div className="ml-4 mt-2 text-zinc-600">// SJ is typing...</div>
                    <div className="mt-4">&#125;</div>
                  </div>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaborationShowcase;
