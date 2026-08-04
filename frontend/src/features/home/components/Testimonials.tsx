const Testimonials = () => {
  const testimonials = [
    {
      quote: "CodeHive completely changed how I prepare for interviews. The mock sessions felt exactly like the real thing, and the real-time editor is flawless.",
      author: "Sarah J.",
      role: "Frontend Engineer at TechCorp",
      initials: "SJ",
      color: "bg-blue-500",
    },
    {
      quote: "As a mentor, I used to juggle Zoom, Google Docs, and an IDE. Now I do everything in one place. My students love the integrated whiteboard.",
      author: "Michael T.",
      role: "Senior Staff Engineer",
      initials: "MT",
      color: "bg-purple-500",
    },
    {
      quote: "The Q&A integration right into the collaboration environment is a game-changer. I get help exactly when and where I need it.",
      author: "Elena R.",
      role: "Computer Science Student",
      initials: "ER",
      color: "bg-green-500",
    }
  ];

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Loved by developers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col justify-between">
              <p className="text-zinc-300 text-lg italic mb-8">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{t.author}</h4>
                  <p className="text-zinc-500 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
