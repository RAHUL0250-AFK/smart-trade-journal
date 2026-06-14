"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpen,
  Link2,
  LogOut,
  Plus,
  Settings,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Broker = {
  id: string;
  user_id: string;
  broker_name: string;
  account_number: string;
  server_name: string;
  created_at: string;
};

type Trade = {
  id: string;
  user_id: string;
  symbol: string;
  type: string;
  lot: number;
  open_price: number;
  close_price: number;
  profit: number;
  open_time: string | null;
  close_time: string | null;
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [showBrokerModal, setShowBrokerModal] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [serverName, setServerName] = useState("");
  const [brokerMessage, setBrokerMessage] = useState("");
  const [savingBroker, setSavingBroker] = useState(false);
  const [connectedBroker, setConnectedBroker] = useState<Broker | null>(null);

  const [trades, setTrades] = useState<Trade[]>([]);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeSymbol, setTradeSymbol] = useState("");
  const [tradeType, setTradeType] = useState("Buy");
  const [tradeLot, setTradeLot] = useState("");
  const [openPrice, setOpenPrice] = useState("");
  const [closePrice, setClosePrice] = useState("");
  const [profit, setProfit] = useState("");
  const [tradeMessage, setTradeMessage] = useState("");
  const [savingTrade, setSavingTrade] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession();

      if (!data.session?.user) {
        router.replace("/login");
        return;
      }

      const currentUserId = data.session.user.id;

      setUserId(currentUserId);
      setUserEmail(data.session.user.email || "");

      await loadBroker(currentUserId);
      await loadTrades(currentUserId);

      setChecking(false);
    }

    checkUser();
  }, [router]);

  async function loadBroker(currentUserId: string) {
    const { data } = await supabase
      .from("brokers")
      .select("*")
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) setConnectedBroker(data as Broker);
  }

  async function loadTrades(currentUserId: string) {
    const { data } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false });

    setTrades((data || []) as Trade[]);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function saveBroker() {
    setBrokerMessage("");

    if (!selectedBroker || !accountNumber || !serverName) {
      setBrokerMessage("Please fill all broker details.");
      return;
    }

    setSavingBroker(true);

    const { data, error } = await supabase
      .from("brokers")
      .insert({
        user_id: userId,
        broker_name: selectedBroker,
        account_number: accountNumber,
        server_name: serverName,
      })
      .select()
      .single();

    setSavingBroker(false);

    if (error) {
      setBrokerMessage(error.message);
      return;
    }

    setConnectedBroker(data as Broker);
    setShowBrokerModal(false);
    setSelectedBroker("");
    setAccountNumber("");
    setServerName("");
  }

  async function saveManualTrade() {
    setTradeMessage("");

    if (
      !tradeSymbol ||
      !tradeType ||
      !tradeLot ||
      !openPrice ||
      !closePrice ||
      !profit
    ) {
      setTradeMessage("Please fill all trade details.");
      return;
    }

    setSavingTrade(true);

    const { data, error } = await supabase
      .from("trades")
      .insert({
        user_id: userId,
        symbol: tradeSymbol.toUpperCase(),
        type: tradeType,
        lot: Number(tradeLot),
        open_price: Number(openPrice),
        close_price: Number(closePrice),
        profit: Number(profit),
        open_time: new Date().toISOString(),
        close_time: new Date().toISOString(),
      })
      .select()
      .single();

    setSavingTrade(false);

    if (error) {
      setTradeMessage(error.message);
      return;
    }

    setTrades((prev) => [data as Trade, ...prev]);
    setShowTradeModal(false);
    setTradeSymbol("");
    setTradeType("Buy");
    setTradeLot("");
    setOpenPrice("");
    setClosePrice("");
    setProfit("");
  }

  async function deleteTrade(id: string) {
    const confirmDelete = window.confirm("Are you sure you want to delete this trade?");

    if (!confirmDelete) return;

    const { error } = await supabase.from("trades").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setTrades((prev) => prev.filter((trade) => trade.id !== id));
  }

  const totalProfit = useMemo(() => {
    return trades.reduce((sum, trade) => sum + Number(trade.profit || 0), 0);
  }, [trades]);

  const winTrades = useMemo(() => {
    return trades.filter((trade) => Number(trade.profit) > 0).length;
  }, [trades]);

  const winRate =
    trades.length > 0 ? Math.round((winTrades / trades.length) * 100) : 0;

  const todayProfit = useMemo(() => {
    const today = new Date().toDateString();

    return trades
      .filter((trade) => new Date(trade.created_at).toDateString() === today)
      .reduce((sum, trade) => sum + Number(trade.profit || 0), 0);
  }, [trades]);

  const stats = [
    ["Account Balance", `$${totalProfit.toFixed(2)}`, `${trades.length} trades`, Wallet],
    ["Today P&L", `$${todayProfit.toFixed(2)}`, "Manual trades", TrendingUp],
    ["Total Trades", `${trades.length}`, "Saved trades", BarChart3],
    ["Win Rate", `${winRate}%`, `${winTrades} wins`, Activity],
  ];

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Checking login...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex">
        <aside className="min-h-screen w-64 border-r border-zinc-800 bg-zinc-950 p-6">
          <h1 className="text-xl font-bold leading-tight">
            SMART TRADE
            <br />
            JOURNAL
          </h1>

          <p className="mt-6 break-all text-xs text-zinc-500">{userEmail}</p>

          <nav className="mt-8 space-y-2 text-sm text-zinc-400">
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

          <button
            onClick={handleLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 py-3 text-sm text-zinc-300 hover:border-red-500 hover:text-red-400"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <section className="flex-1 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Dashboard</h2>
              <p className="mt-1 text-zinc-400">
                Manual and MT5 analytics dashboard.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTradeModal(true)}
                className="flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-3 font-semibold text-white hover:bg-zinc-800"
              >
                <Plus size={18} />
                Add Manual Trade
              </button>

              <button
                onClick={() => setShowBrokerModal(true)}
                className="rounded-full bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400"
              >
                Connect Broker
              </button>
            </div>
          </div>

          {connectedBroker && (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <p className="text-sm text-emerald-400">Connected Broker</p>
              <h3 className="mt-1 text-xl font-bold">
                {connectedBroker.broker_name}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                Account: {connectedBroker.account_number}
              </p>
              <p className="text-sm text-zinc-400">
                Server: {connectedBroker.server_name}
              </p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            {stats.map(([label, value, change, Icon]: any) => (
              <div
                key={label}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-500">{label}</p>
                  <Icon size={20} className="text-emerald-400" />
                </div>
                <p
                  className={`mt-4 text-3xl font-bold ${
                    Number(String(value).replace("$", "")) < 0
                      ? "text-red-400"
                      : "text-white"
                  }`}
                >
                  {value}
                </p>
                <p className="mt-2 text-sm text-emerald-400">{change}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-lg font-semibold">Recent Trades</h3>

            <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 text-zinc-400">
                  <tr>
                    <th className="p-4">Symbol</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Lot</th>
                    <th className="p-4">Open</th>
                    <th className="p-4">Close</th>
                    <th className="p-4">P&L</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {trades.length === 0 && (
                    <tr className="border-t border-zinc-800">
                      <td className="p-4 text-zinc-500" colSpan={7}>
                        No trades added yet.
                      </td>
                    </tr>
                  )}

                  {trades.map((trade) => (
                    <tr key={trade.id} className="border-t border-zinc-800">
                      <td className="p-4 font-semibold">{trade.symbol}</td>
                      <td className="p-4 text-zinc-400">{trade.type}</td>
                      <td className="p-4 text-zinc-400">{trade.lot}</td>
                      <td className="p-4 text-zinc-400">{trade.open_price}</td>
                      <td className="p-4 text-zinc-400">{trade.close_price}</td>
                      <td
                        className={`p-4 ${
                          Number(trade.profit) >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        ${Number(trade.profit).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteTrade(trade.id)}
                          className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {showTradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Add Manual Trade</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Add your trade manually.
                </p>
              </div>

              <button
                onClick={() => setShowTradeModal(false)}
                className="rounded-full border border-zinc-800 p-2 text-zinc-400 hover:border-red-500 hover:text-red-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Symbol e.g. XAUUSD"
                value={tradeSymbol}
                onChange={(e) => setTradeSymbol(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
              />

              <select
                value={tradeType}
                onChange={(e) => setTradeType(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
              >
                <option>Buy</option>
                <option>Sell</option>
              </select>

              <input
                type="number"
                placeholder="Lot size e.g. 0.01"
                value={tradeLot}
                onChange={(e) => setTradeLot(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
              />

              <input
                type="number"
                placeholder="Open price"
                value={openPrice}
                onChange={(e) => setOpenPrice(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
              />

              <input
                type="number"
                placeholder="Close price"
                value={closePrice}
                onChange={(e) => setClosePrice(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
              />

              <input
                type="number"
                placeholder="Profit / Loss e.g. -12.50"
                value={profit}
                onChange={(e) => setProfit(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
              />

              {tradeMessage && (
                <p className="rounded-xl border border-zinc-800 bg-black p-3 text-sm text-zinc-300">
                  {tradeMessage}
                </p>
              )}

              <button
                onClick={saveManualTrade}
                disabled={savingTrade}
                className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
              >
                {savingTrade ? "Saving..." : "Save Trade"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBrokerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Connect Broker</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Select broker and add MT5 account details.
                </p>
              </div>

              <button
                onClick={() => setShowBrokerModal(false)}
                className="rounded-full border border-zinc-800 p-2 text-zinc-400 hover:border-red-500 hover:text-red-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={() => setSelectedBroker("XM")}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  selectedBroker === "XM"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-zinc-800 bg-black hover:border-emerald-500"
                }`}
              >
                <h3 className="text-lg font-bold">XM</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Connect your XM MT5 trading account.
                </p>
              </button>

              {selectedBroker && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="MT5 Login ID / Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
                  />

                  <input
                    type="text"
                    placeholder="Server Name e.g. XMGlobal-MT5"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
                  />

                  {brokerMessage && (
                    <p className="rounded-xl border border-zinc-800 bg-black p-3 text-sm text-zinc-300">
                      {brokerMessage}
                    </p>
                  )}

                  <button
                    onClick={saveBroker}
                    disabled={savingBroker}
                    className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
                  >
                    {savingBroker ? "Saving..." : "Save Broker Account"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}