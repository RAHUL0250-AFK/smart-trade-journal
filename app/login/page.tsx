import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <h1 className="text-3xl font-bold">Login</h1>

        <div className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3"
          />

          <Link
            href="/dashboard"
            className="block w-full rounded-xl bg-emerald-500 py-3 text-center font-semibold text-black"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}