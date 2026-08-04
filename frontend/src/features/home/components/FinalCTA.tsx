import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-black relative overflow-hidden border-t border-zinc-900">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to start coding?
        </h2>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Join thousands of developers collaborating, learning, and interviewing on CodeHive today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white border border-zinc-800 font-semibold rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
