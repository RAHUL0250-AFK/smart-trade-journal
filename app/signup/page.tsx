import Link from "next/link";

export default function SignupPage() {
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
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 outline-none focus:border-emerald-500"
          />

          <Link
            href="/dashboard"
            className="block w-full rounded-xl bg-emerald-500 py-3 text-center font-semibold text-black hover:bg-emerald-400"
          >
            Create Account
          </Link>
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