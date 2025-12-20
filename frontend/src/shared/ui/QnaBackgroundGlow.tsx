export function QnaBackgroundGlow() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 50% 30%, oklch(0.35 0.15 280) 0%, oklch(0.15 0.08 275) 15%, oklch(0.08 0 0) 40%, oklch(0.08 0 0) 100%)",
        filter: "blur(120px)",
        opacity: 0.5,
        zIndex: -1,
      }}
    />
  );
}
