"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BarChart3,
  BookOpen,
  Link2,
  Settings,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function Dashboard() {
  const equityData = [
    { day: "Mon", balance: 1000 },
    { day: "Tue", balance: 1040 },
    { day: "Wed", balance: 1015 },
    { day: "Thu", balance: 1080 },
    { day: "Fri", balance: 1125 },
    { day: "Sat", balance: 1110 },
    { day: "Sun", balance: 1180 },
  ];

  const stats = [
    ["Account Balance", "$0.00", "+0.00%", Wallet],
    ["Today P&L", "$0.00", "+0.00%", TrendingUp],
    ["Weekly P&L", "$0.00", "+0.00%", BarChart3],
    ["Win Rate", "0%", "0 trades", Activity],
  ];

  const trades = [
    ["XAUUSD", "Buy", "0.01", "Closed", "+$0.00"],
    ["BTCUSD", "Sell", "0.01", "Closed", "+$0.00"],
    ["US30", "Buy", "0.01", "Closed", "+$0.00"],
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex">
        <aside className="min-h-screen w-64 border-r border-zinc-800 bg-zinc-950 p-6">
          <h1 className="text-xl font-bold leading-tight">
            SMART TRADE
            <br />
            JOURNAL
          </h1>

          <nav className="mt-10 space-y-2 text-sm text-zinc-400">
            <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 px-4 py-3 text-emerald-400">
              <BarChart3 size={18} />
              Dashboard
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <TrendingUp size={18} />
              Trades
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Activity size={18} />
              Analytics
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <BookOpen size={18} />
              Journal Notes
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Link2 size={18} />
              MT5 Accounts
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Settings size={18} />
              Settings
            </div>
          </nav>
        </aside>

        <section className="flex-1 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Dashboard</h2>
              <p className="mt-1 text-zinc-400">
                TradeZella style MT5 analytics dashboard.
              </p>
            </div>

            <button className="rounded-full bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400">
              Connect MT5
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            {stats.map(([label, value, change, Icon]) => (
              <div
                key={label as string}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-500">{label as string}</p>
                  <Icon size={20} className="text-emerald-400" />
                </div>
                <p className="mt-4 text-3xl font-bold">{value as string}</p>
                <p className="mt-2 text-sm text-emerald-400">
                  {change as string}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Equity Curve</h3>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                  Demo data
                </span>
              </div>

              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityData}>
                    <defs>
                      <linearGradient id="equity" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" stroke="#71717a" />
                    <YAxis stroke="#71717a" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#09090b",
                        border: "1px solid #27272a",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#10b981"
                      fill="url(#equity)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <h3 className="text-lg font-semibold">Risk Metrics</h3>

              <div className="mt-6 space-y-5">
                <Metric title="Max Drawdown" value="0%" />
                <Metric title="Average Win" value="$0.00" green />
                <Metric title="Average Loss" value="$0.00" red />
                <Metric title="Risk Reward" value="0.00" />
                <Metric title="Profit Factor" value="0.00" />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <h3 className="text-lg font-semibold">Best Trade</h3>
              <div className="mt-6 flex items-center gap-3">
                <TrendingUp className="text-emerald-400" />
                <div>
                  <p className="font-bold">No trade yet</p>
                  <p className="text-sm text-zinc-500">Will update after sync</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <h3 className="text-lg font-semibold">Worst Trade</h3>
              <div className="mt-6 flex items-center gap-3">
                <TrendingDown className="text-red-400" />
                <div>
                  <p className="font-bold">No trade yet</p>
                  <p className="text-sm text-zinc-500">Will update after sync</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <h3 className="text-lg font-semibold">MT5 Account</h3>
              <p className="mt-6 text-zinc-500">No account connected</p>
              <button className="mt-5 w-full rounded-xl bg-emerald-500 py-3 font-semibold text-black">
                Add MT5 Account
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Trades</h3>
              <button className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
                View All
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 text-zinc-400">
                  <tr>
                    <th className="p-4">Symbol</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Lot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">P&L</th>
                  </tr>
                </thead>

                <tbody>
                  {trades.map(([symbol, type, lot, status, pnl]) => (
                    <tr key={symbol} className="border-t border-zinc-800">
                      <td className="p-4 font-semibold">{symbol}</td>
                      <td className="p-4 text-zinc-400">{type}</td>
                      <td className="p-4 text-zinc-400">{lot}</td>
                      <td className="p-4 text-zinc-400">{status}</td>
                      <td className="p-4 text-emerald-400">{pnl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
  green,
  red,
}: {
  title: string;
  value: string;
  green?: boolean;
  red?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-zinc-500">{title}</p>
      <p
        className={`mt-1 text-2xl font-bold ${
          green ? "text-emerald-400" : red ? "text-red-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}