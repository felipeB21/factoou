import Image from "next/image";
import Link from "next/link";
import { Home, Flame, Stars } from "lucide-react";
import Search from "./search";
import Session from "./session";

const NAV_LINKS = [
  { name: "Home", href: "/", icon: <Home className="h-8 w-8 p-2" /> },
  {
    name: "Popular",
    href: "/popular",
    icon: <Flame className="h-8 w-8 p-2" />,
  },
  {
    name: "Pricing",
    href: "/pricing",
    icon: <Stars className="h-8 w-8 p-2" />,
  },
];

export default function Header() {
  return (
    <header className="py-3 fixed top-0 w-full z-50 shadow bg-stone-50 bg-[linear-gradient(to_bottom, rgba(255,255,255,1), rgba(255,255,150,0.2))]">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-10">
        <div className="flex items-center gap-10">
          <Link href={"/"}>
            <Image
              priority
              className="w-auto h-auto rounded"
              src={"/factou.png"}
              alt="logo"
              width={100}
              height={100}
            />
          </Link>
          <nav>
            <ul className="flex items-center gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    className="flex items-center text-sm text-stone-600 hover:text-black hover:bg-neutral-200/50 rounded-full"
                    href={link.href}
                  >
                    {link.icon}
                    <p className="pr-2 ">{link.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Search />
        <Session />
      </div>
    </header>
  );
}
