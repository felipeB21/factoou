"use client";

import { signInWithGoogle } from "@/app/actions/auth";

export default function GoogleAuth() {
  return (
    <form action={signInWithGoogle}>
      <button className="bg-stone-100 p-2 rounded w-full" type="submit">
        Sign in with Google
      </button>
    </form>
  );
}
