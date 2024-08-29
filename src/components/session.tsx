import { auth } from "../../auth";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { SignOut } from "./sign-out";
import SignInModal from "./modal";
import { Bell } from "lucide-react";

export default async function Session() {
  const session = await auth();
  return (
    <div>
      {session ? (
        <div className="flex items-center gap-5">
          <Link href={"/notifications"}>
            <Bell className="w-8 h-8 text-neutral-600 hover:text-black p-2 hover:bg-neutral-200/50 rounded-full" />
          </Link>
          <Menu>
            <MenuButton>
              <Image
                priority
                className="rounded-full"
                src={session.user.image as string}
                alt="User Avatar"
                width={32}
                height={32}
              />
            </MenuButton>
            <MenuList>
              <MenuGroup title="Profile">
                <MenuItem as={Link} href={`/profile/${session.user.username}`}>
                  My Profile
                </MenuItem>
                <SignOut />
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Help">
                <MenuItem>Docs</MenuItem>
                <MenuItem>FAQ</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </div>
      ) : (
        <div>
          <SignInModal />
        </div>
      )}
    </div>
  );
}
