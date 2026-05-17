import { useState } from 'react';

const STATUS_ITEMS = [
  { cls: 'status-active',    dot: 'bg-status-active',    label: 'Active',     desc: 'Currently registered & trading' },
  { cls: 'status-inactive',  dot: 'bg-status-inactive',  label: 'Inactive',   desc: 'Registered but not trading' },
  { cls: 'status-struck',    dot: 'bg-status-struck',    label: 'Struck Off', desc: 'Removed from registry' },
  { cls: 'status-dissolved', dot: 'bg-status-dissolved', label: 'Dissolved',  desc: 'Formally wound up' },
];

export default function StatusKey() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        id="status-key-toggle"
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost w-fit"
      >
        <span className="material-icons text-[16px]">info</span>
        Status Key
        <span className="material-icons text-[16px] transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          expand_more
        </span>
      </button>

      {open && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          {STATUS_ITEMS.map((item) => (
            <div key={item.label} className="card p-3 flex flex-col gap-2">
              <div className={`status-badge w-fit ${item.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                {item.label}
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
