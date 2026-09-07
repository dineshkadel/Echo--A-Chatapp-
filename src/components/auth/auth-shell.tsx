import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08111f] px-4 py-10 text-slate-100">
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <section className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
        <Link href="/" className="mb-8 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-300">
          <span className="flex size-9 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
            <MessageCircle className="size-5" />
          </span>
          Echo
        </Link>
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Account recovery</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
        </div>
        {children}
        <div className="mt-7 text-center text-sm text-slate-400">{footer}</div>
      </section>
    </main>
  );
}