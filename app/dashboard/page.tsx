"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpen,
  Link2,
  LogOut,
  Settings,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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

  const [connectedBroker, setConnectedBroker] = useState<any>(null);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession();

      if (!data.session?.user) {
        router.replace("/login");
        return;
      }

      setUserId(data.session.user.id);
      setUserEmail(data.session.user.email || "");

      const { data: brokerData } = await supabase
        .from("brokers")
        .select("*")
        .eq("user_id", data.session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (brokerData) {
        setConnectedBroker(brokerData);
      }

      setChecking(false);
    }

    checkUser();
  }, [router]);

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

    setConnectedBroker(data);
    setBrokerMessage("Broker account saved successfully.");
    setShowBrokerModal(false);
    setSelectedBroker("");
    setAccountNumber("");
    setServerName("");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Checking login...
      </main>
    );
  }

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
                TradeZella style MT5 analytics dashboard.
              </p>
            </div>

            <button
              onClick={() => setShowBrokerModal(true)}
              className="rounded-full bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400"
            >
              Connect Broker
            </button>
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
                <p className="mt-4 text-3xl font-bold">{value}</p>
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