export default function IllustrationCard() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid-sm opacity-40 rounded-xl" />

      {/* Floating shapes */}
      <div className="animate-float absolute top-8 right-10 w-12 h-12 rounded-xl border border-accent/30 bg-accent/5 flex items-center justify-center">
        <span className="material-icons text-accent text-[20px]">business</span>
      </div>
      <div className="animate-float-delayed absolute top-24 right-32 w-8 h-8 rounded-full border border-accent/20 bg-accent/5" />
      <div className="animate-float-delayed-2 absolute bottom-20 right-16 w-10 h-10 rounded-lg border border-[#363636] bg-surface rotate-12" />
      <div className="animate-float absolute bottom-32 right-40 w-6 h-6 rounded-full bg-accent/10 border border-accent/20" />

      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-accent/40 rounded-tl" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-accent/40 rounded-br" />
    </div>
  );
}
