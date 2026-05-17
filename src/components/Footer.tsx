export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1e1e1e] bg-[#0d0d0d] py-10">
      <div className="max-w-content mx-auto px-6 lg:px-10 flex flex-col items-center justify-center gap-2.5 text-center">
        <p className="text-[14px] font-semibold text-text-primary">
          Designed & Built by{' '}
          <span className="text-accent">EliTech Creative</span>
        </p>
        <p className="text-[12px] text-[#737373] leading-relaxed tracking-wide">
          Data source: ORC Ghana · Not affiliated with any government body · © {currentYear}
        </p>
      </div>
    </footer>
  );
}
