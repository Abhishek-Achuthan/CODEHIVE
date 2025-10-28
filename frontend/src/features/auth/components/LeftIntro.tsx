export function LeftIntro() {
  const features = [
    { id: 1, title: 'Start Coding Together', desc: 'Write and share code in real-time', primary: true },
    { id: 2, title: 'Chat & Video Call', desc: 'Communicate with your team instantly', primary: false },
    { id: 3, title: 'Share Screens & Whiteboards', desc: 'Visual collaboration made easy', primary: false },
  ];

  return (
    <section
      aria-label="Join CodeHive Platform"
      className="
        relative hidden w-full overflow-hidden rounded-[28px]
        ring-1 ring-white/10
        bg-[radial-gradient(100%_80%_at_50%_120%,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0)_60%),radial-gradient(120%_60%_at_50%_-10%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.15)_35%,transparent_60%),linear-gradient(180deg,#8B5CF6_0%,#3A1F5F_45%,#0B0B0F_80%)]
        p-8 shadow-2xl md:block md:h-[640px]
      "
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          background: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '2.5px 2.5px',
        }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-sm flex-col items-center justify-center text-center text-white">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-[18px] leading-none">⬡</span>
          <span className="text-sm font-medium tracking-wide text-white/90">CODEHIVE</span>
        </div>

        <h2 className="mb-3 text-3xl md:text-4xl font-semibold tracking-tight text-pretty">
          Code. Connect.
          <span className="block text-white/90">Collaborate.</span>
        </h2>

        <p className="mb-8 max-w-xs text-sm/6 text-white/80">
          A real-time platform where developers work and learn together. Write code, chat, share screens, and build
          amazing projects as a team.
        </p>

        <div className="space-y-4 w-full">
          {features.map(({ id, title, desc, primary }) => (
            <div
              key={id}
              className={`mx-3 rounded-2xl ${primary ? 'bg-white text-gray-900 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)]' : 'bg-white/10 ring-1 ring-white/15 backdrop-blur'}`}
            >
              <div className="flex items-center gap-3 px-4 py-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${primary ? 'bg-gray-900 text-white font-bold' : 'bg-white/15 text-white font-medium'}`}>
                  {id}
                </div>
                <div>
                  <span className={`block text-sm ${primary ? 'font-semibold' : 'font-medium text-white/90'}`}>{title}</span>
                  <span className={`text-xs ${primary ? 'text-gray-600' : 'text-white/70'}`}>{desc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs text-white/60">
          <div className="flex -space-x-2">
            <div className="h-6 w-6 rounded-full bg-linear-to-r from-blue-400 to-purple-500 ring-2 ring-white/20" />
            <div className="h-6 w-6 rounded-full bg-linear-to-r from-green-400 to-blue-500 ring-2 ring-white/20" />
            <div className="h-6 w-6 rounded-full bg-linear-to-r from-yellow-400 to-red-500 ring-2 ring-white/20" />
          </div>
          <span>Join developers practicing, learning & building together</span>
        </div>
      </div>
    </section>
  );
}
