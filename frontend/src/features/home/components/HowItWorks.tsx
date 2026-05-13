import { motion } from 'framer-motion';
import { UserPlus, Search, Laptop, Trophy } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus className="w-6 h-6 text-blue-400" />,
    title: 'Create your profile',
    description: 'Sign up and set your goals. Whether you want to learn, mentor, or prepare for interviews, CodeHive adapts to you.',
  },
  {
    icon: <Search className="w-6 h-6 text-indigo-400" />,
    title: 'Find a Mentor or Peer',
    description: 'Browse our directory of experienced developers or join public rooms to find peers working on similar problems.',
  },
  {
    icon: <Laptop className="w-6 h-6 text-purple-400" />,
    title: 'Collaborate in Real-time',
    description: 'Jump into a room. Code, draw, and talk seamlessly. No setup required, just pure collaboration.',
  },
  {
    icon: <Trophy className="w-6 h-6 text-green-400" />,
    title: 'Achieve your goals',
    description: 'Nail that interview, ship that feature, or learn that new framework with the help of the community.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            How it <span className="text-blue-500">Works</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Get started in minutes and experience a new way of technical collaboration.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-zinc-800 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-black border-2 border-zinc-800 flex items-center justify-center mb-6 group-hover:border-blue-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
