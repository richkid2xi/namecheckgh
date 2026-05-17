import type { BusinessRecord } from '../types';
import { getDisplayType } from '../utils/typeMapper';

interface ResultCardProps {
  record: BusinessRecord;
  index: number;
}

export default function ResultCard({ record, index }: ResultCardProps) {
  const delay = Math.min(index, 5) * 60;

  return (
    <div
      className="card p-5 flex items-center justify-between gap-4 hover:-translate-y-0.5 hover:border-[#363636] hover:shadow-lg opacity-0"
      style={{
        animationName: 'fadeInUp',
        animationDuration: '0.4s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Business Name */}
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-text-primary text-[15px] sm:text-[16px] leading-snug tracking-tight truncate">
          {record.name}
        </h3>
      </div>

      {/* Business Type Badge */}
      <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold bg-accent/5 border border-accent/20 text-accent uppercase tracking-wider flex-shrink-0">
        {getDisplayType(record.type)}
      </span>
    </div>
  );
}
