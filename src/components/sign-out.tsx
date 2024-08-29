import { signOut } from "../../auth";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        className="hover:bg-slate-200/60 py-1.5 px-3 w-full text-start"
        type="submit"
      >
        Sign Out
      </button>
    </form>
  );
}
