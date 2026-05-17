interface AvailableCardProps {
  query: string;
}

export default function AvailableCard({ query }: AvailableCardProps) {
  return (
    <div className="card p-8 flex flex-col items-center text-center gap-5 border-accent/20 bg-accent/3 animate-fade-in-up">
      <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
        <span className="material-icons text-accent text-[32px]">check_circle</span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-text-primary">
          "<span className="text-accent">{query}</span>" appears to be available!
        </h3>
        <p className="text-text-secondary text-sm max-w-md">
          No exact match was found in the public registry. This name may be available for registration — but always verify officially before filing.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="https://www.orc.gov.gh/service/name-search/"
          target="_blank"
          rel="noopener noreferrer"
          id="available-verify-link"
          className="btn-primary"
        >
          <span className="material-icons text-[18px]">open_in_new</span>
          Verify Officially
        </a>
        <p className="text-xs text-text-muted self-center">
          at orc.gov.gh
        </p>
      </div>
    </div>
  );
}
