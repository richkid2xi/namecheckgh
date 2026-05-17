export default function DisclaimerBanner() {
  return (
    <div className="max-w-content mx-auto px-6 lg:px-10 mb-4">
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4 sm:px-5 flex items-start gap-3">
        <span className="material-icons text-[#737373] text-[18px] mt-0.5 flex-shrink-0">info</span>
        <p className="text-[13px] text-[#737373] leading-relaxed">
          NameCheck GH is a free, independent student project by EliTech Creative. All data is sourced directly from the Office of the Registrar of Companies Ghana (ORC). This site is not affiliated with, endorsed by, or officially connected to the ORC or any government body. Data accuracy depends on the ORC live registry. Use for informational purposes only.{' '}
          <a
            href="https://rgdonline.gegov.gov.gh/orc-app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5b5bd6] hover:underline inline-flex items-center gap-1 font-medium ml-1"
          >
            Visit official ORC site <span className="material-icons text-[14px] leading-none">arrow_forward</span>
          </a>
        </p>
      </div>
    </div>
  );
}
