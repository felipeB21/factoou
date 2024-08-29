import React from "react";

export default function Search() {
  return (
    <div>
      <form>
        <input
          className="text-sm rounded-md bg-stone-200 p-2 min-w-[25dvw]"
          type="text"
          name="search"
          placeholder="Search..."
          autoComplete="off"
        />
      </form>
    </div>
  );
}
