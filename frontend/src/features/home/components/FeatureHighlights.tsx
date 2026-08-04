import { motion } from 'framer-motion';
import { MonitorPlay, Code2, Presentation, MessageSquare, Calendar, PenTool, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: <Code2 className="w-6 h-6 text-blue-400" />,
    title: 'Real-time Editor',
    description: 'Collaborative code editor powered by Monaco and Yjs. Write code together with sub-millisecond sync.',
    colSpan: 'md:col-span-2',
  },
  {
    icon: <MonitorPlay className="w-6 h-6 text-indigo-400" />,
    title: 'Voice & Video',
    description: 'Integrated WebRTC rooms so you never have to leave the platform to communicate.',
    colSpan: 'md:col-span-1',
  },
  {
    icon: <Presentation className="w-6 h-6 text-purple-400" />,
    title: 'Interactive Whiteboard',
    description: 'Draw architecture diagrams, explain concepts visually, and brainstorm with your team.',
    colSpan: 'md:col-span-1',
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-green-400" />,
    title: 'Developer Q&A',
    description: 'A built-in stack-overflow style Q&A system for asynchronous learning and mentorship.',
    colSpan: 'md:col-span-2',
  },
  {
    icon: <Calendar className="w-6 h-6 text-yellow-400" />,
    title: 'Session Booking',
    description: 'Schedule 1-on-1 mentorship sessions with top developers around the world.',
    colSpan: 'md:col-span-1',
  },
  {
    icon: <PenTool className="w-6 h-6 text-red-400" />,
    title: 'Private Notes',
    description: 'Keep track of interview feedback, learning goals, and session notes securely.',
    colSpan: 'md:col-span-1',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-teal-400" />,
    title: 'Live Polls',
    description: 'Gauge understanding instantly during large mentoring sessions or workshops.',
    colSpan: 'md:col-span-1',
  },
];

const FeatureHighlights = () => {
  return (
    <section className="py-24 bg-black relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything you need to <span className="text-zinc-500">build</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            A complete suite of tools designed specifically for developer collaboration, technical interviews, and paired programming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/80 transition-all group ${feature.colSpan}`}
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
