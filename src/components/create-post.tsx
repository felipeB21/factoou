"use server";
import Image from "next/image";
import { auth } from "../../auth";
import TextArea from "./text-area";
import Link from "next/link";

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
                <p className="font-medium">{username}</p>
              </div>
            </Link>
            <TextArea />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
