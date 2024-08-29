import Image from "next/image";
import UsernameModal from "./username-modal";

interface User {
  id: string;
  username: string | null;
  image: string | null;
}

export default function ProfileComponent({
  initialUser,
  isHisProfile,
}: {
  initialUser: User | null;
  isHisProfile: boolean;
}) {
  if (!initialUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[60dvh]">
        <p className="text-4xl font-bold">User not found!</p>
        <p>This user doesn't exist anymore</p>
      </div>
    );
  }

  return (
    <div className="flex gap-5">
      <Image
        priority
        src={initialUser.image as string}
        alt={`${initialUser.username}'s profile picture`}
        width={128}
        height={128}
        className="rounded-full w-auto h-auto object-cover"
      />
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-bold">{initialUser.username}</h3>
        {isHisProfile ? <UsernameModal /> : <></>}
      </div>
    </div>
  );
}
