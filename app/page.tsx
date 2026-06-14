import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">
            SMART TRADE JOURNAL
          </h1>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-zinc-700 px-5 py-2 text-sm text-zinc-300 hover:border-zinc-500"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-4 rounded-full border border-emerald-500/30 px-4 py-2 text-sm text-emerald-400">
            Automated MT5 Trading Analytics
          </p>

          <h2 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Track every trade.
            <br />
            Analyze every mistake.
            <br />
            Grow like a pro.
          </h2>

          <p className="mt-6 max-w-2xl text-lg text-zinc-400">
            Smart Trade Journal connects with your MT5 account, imports old
            trading history, syncs new trades, and gives you powerful
            performance analytics.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-emerald-500 px-7 py-3 font-semibold text-black hover:bg-emerald-400"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-zinc-700 px-7 py-3 font-semibold text-zinc-300 hover:border-zinc-500"
            >
              Login
            </Link>
          </div>

          <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-4">
            {[
              ["Total P&L", "$0.00"],
              ["Win Rate", "0%"],
              ["Total Trades", "0"],
              ["Connected Accounts", "0"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-left"
              >
                <p className="text-sm text-zinc-500">{label}</p>
                <p className="mt-3 text-3xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}