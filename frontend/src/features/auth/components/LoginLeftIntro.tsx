export function LoginLeftIntro() {
  return (
    <section
      aria-label="CodeHive Platform Introduction"
      className="
        relative hidden h-[550px] w-full overflow-hidden
        rounded-2xl md:flex md:flex-col md:justify-between
        shadow-[0_8px_32px_rgba(0,0,0,0.8)]
        p-[60px]
        bg-[radial-gradient(ellipse_120%_38%_at_50%_-6%,rgba(255,255,255,0.45)_0%,rgba(216,180,254,0.38)_20%,rgba(148,110,230,0.25)_38%,transparent_58%),radial-gradient(ellipse_120%_85%_at_50%_112%,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.6)_45%,transparent_72%),linear-gradient(to_bottom,#A855F7_0%,#4C1D95_65%,#000000_100%)]
        bg-blend-screen
      "
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          background: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '2.5px 2.5px',
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center gap-2.5 mb-[60px]">
          <span className="text-[18px] leading-none">⬡</span>
          <span className="text-[14px] font-normal tracking-[1px] text-white/90">CodeHive</span>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="mb-8 text-[34px] font-normal leading-tight tracking-normal text-white">
            Where code meets
            <br />
            collaboration
          </h1>

          <p className="max-w-[380px] text-[12px] font-light leading-[1.6] text-white/50">
            A space where knowledge flows freely.
            <br />
            Where mentors guide and learners discover.
            <br />
            Where ideas transform into reality.
          </p>
        </div>

        <div />
      </div>
    </section>
  );
}
