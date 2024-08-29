"use client";
import Image from "next/image";
import UsernameModal from "./username-modal";
import { format } from "date-fns";
import { Cake } from "lucide-react";

interface User {
  id: string;
  username: string | null;
  image: string | null;
  createdAt: string;
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
        <p>This user doesn`t exist anymore</p>
      </div>
    );
  }

  const formattedDate = format(new Date(initialUser.createdAt), "MMMM d, yyyy");

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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold">{initialUser.username}</h3>
          {isHisProfile ? <UsernameModal /> : <></>}
        </div>
        <p className="text-sm font-medium text-neutral-600 flex items-center gap-1">
          <Cake className="w-5 h-5" />
          Joined on {formattedDate}
        </p>
      </div>
    </div>
  );
}
