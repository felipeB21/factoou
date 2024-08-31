"use server";
import Image from "next/image";
import { auth } from "../../auth";
import TextArea from "./text-area";
import Link from "next/link";
import SignInModal from "./modal";

export default async function CreatePost() {
  const session = await auth();

  const avatarSrc = session?.user.image || "/default-avatar.png";
  const username = session?.user.username || "Anonymous";

  return (
    <>
      {session ? (
        <div>
          <div className="flex flex-col gap-2">
            <Link className="w-max" href={`/profile/${session.user.username}`}>
              <div className="flex items-center gap-2">
                <Image
                  className="rounded-full"
                  src={avatarSrc}
                  alt="avatar"
                  width={32}
                  height={32}
                />
                <p className="font-medium">@{username}</p>
              </div>
            </Link>
            <TextArea />
          </div>
        </div>
      ) : (
        <div className="flex flex-col place-items-center gap-2">
          <h5>
            You are not logged in to send <strong>Factoou`s</strong>
          </h5>
          <SignInModal />
        </div>
      )}
    </>
  );
}
