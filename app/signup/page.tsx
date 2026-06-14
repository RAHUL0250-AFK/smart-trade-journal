"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setMessage("");

    if (!fullName || !email || !password || !confirmPassword) {
      setMessage("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Password and confirm password do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created successfully. Now login.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="mt-2 text-zinc-400">
          Start tracking your trades like a professional.
        </p>

        <div className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
          />

          {message && (
            <p className="rounded-xl border border-zinc-800 bg-black p-3 text-sm text-zinc-300">
              {message}
            </p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 py-3 text-center font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}