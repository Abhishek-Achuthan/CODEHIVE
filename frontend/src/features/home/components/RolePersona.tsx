import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GraduationCap, Briefcase } from 'lucide-react';

const personas = [
  {
    id: 'learners',
    label: 'For Learners',
    icon: <BookOpen className="w-5 h-5" />,
    title: 'Accelerate your growth',
    description: 'Stop getting stuck on bugs for hours. Connect with mentors instantly, ask questions in the community Q&A, and learn by pairing on real code.',
    highlights: ['Instant help when stuck', 'Pair programming sessions', 'Learn best practices directly from pros'],
  },
  {
    id: 'mentors',
    label: 'For Mentors',
    icon: <GraduationCap className="w-5 h-5" />,
    title: 'Share knowledge, build your brand',
    description: 'Host sessions, answer community questions, and build a reputation as a technical leader. Monetize your expertise through paid 1-on-1s.',
    highlights: ['Flexible scheduling', 'Built-in payment processing', 'Interactive teaching tools (Whiteboard, Polls)'],
  },
  {
    id: 'interviews',
    label: 'For Interview Prep',
    icon: <Briefcase className="w-5 h-5" />,
    title: 'Nail the technical interview',
    description: 'Practice data structures, algorithms, and system design with peers or experienced interviewers in an environment that mimics real company interviews.',
    highlights: ['Mock interviews with real engineers', 'System design whiteboard', 'Private notes for feedback'],
  },
];

const RolePersona = () => {
  const [activeTab, setActiveTab] = useState(personas[0].id);

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider text-sm">
            Built for everyone
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Whether you are learning to code or a senior engineer, CodeHive adapts to your needs.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
          {/* Tabs */}
          <div className="w-full md:w-1/3 flex flex-col gap-2">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => setActiveTab(persona.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl text-left transition-all ${
                  activeTab === persona.id
                    ? 'bg-zinc-800 text-white shadow-lg border border-zinc-700'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <span className={activeTab === persona.id ? 'text-blue-400' : 'text-zinc-500'}>
                  {persona.icon}
                </span>
                <span className="font-medium text-lg">{persona.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="w-full md:w-2/3 relative min-h-[350px]">
            <AnimatePresence mode="wait">
              {personas.map(
                (persona) =>
                  activeTab === persona.id && (
                    <motion.div
                      key={persona.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 lg:p-12"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                        {persona.icon}
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4">
                        {persona.title}
                      </h3>
                      <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                        {persona.description}
                      </p>
                      
                      <ul className="space-y-4">
                        {persona.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-zinc-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RolePersona;
