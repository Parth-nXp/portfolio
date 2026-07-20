import Link from "next/link";
import { ArrowLeft, ArrowRight, History } from "lucide-react";

type PaperLink = {
  href: string;
  title: string;
  year: number;
};

export default function PaperTimelineNav({
  older,
  newer
}: {
  older?: PaperLink;
  newer?: PaperLink;
}) {
  return (
    <nav aria-label="Paper timeline" className="mt-14 overflow-hidden rounded-2xl border border-slate-800 bg-[#101722]">
      <div className="grid md:grid-cols-2">
        {older ? (
          <Link
            href={older.href}
            className="group flex min-h-28 items-center gap-4 border-b border-slate-800 p-5 transition-colors hover:bg-white/[0.025] md:border-b-0 md:border-r sm:p-6"
          >
            <ArrowLeft className="shrink-0 text-slate-600 transition-transform group-hover:-translate-x-1 group-hover:text-sky-300" size={20} />
            <span className="min-w-0">
              <span className="block font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Previous / older</span>
              <span className="mt-2 block text-base font-black text-slate-200 group-hover:text-white">{older.title}</span>
              <span className="mt-1 block font-mono text-xs text-sky-300">{older.year}</span>
            </span>
          </Link>
        ) : (
          <div className="flex min-h-28 items-center gap-4 border-b border-slate-800 p-5 md:border-b-0 md:border-r sm:p-6">
            <History className="shrink-0 text-slate-700" size={20} />
            <span>
              <span className="block font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">Timeline start</span>
              <span className="mt-2 block text-sm font-bold text-slate-500">No older paper</span>
            </span>
          </div>
        )}

        {newer ? (
          <Link
            href={newer.href}
            className="group flex min-h-28 items-center justify-end gap-4 p-5 text-right transition-colors hover:bg-white/[0.025] sm:p-6"
          >
            <span className="min-w-0">
              <span className="block font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Next / newer</span>
              <span className="mt-2 block text-base font-black text-slate-200 group-hover:text-white">{newer.title}</span>
              <span className="mt-1 block font-mono text-xs text-sky-300">{newer.year}</span>
            </span>
            <ArrowRight className="shrink-0 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-sky-300" size={20} />
          </Link>
        ) : (
          <div className="flex min-h-28 items-center justify-end gap-4 p-5 text-right sm:p-6">
            <span>
              <span className="block font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">Latest entry</span>
              <span className="mt-2 block text-sm font-bold text-slate-500">No newer paper</span>
            </span>
            <History className="shrink-0 text-slate-700" size={20} />
          </div>
        )}
      </div>
    </nav>
  );
}
