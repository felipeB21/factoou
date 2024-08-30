"use client";
import Image from "next/image";
import UsernameModal from "./username-modal";
import { format, formatDistanceToNow } from "date-fns";
import { Cake } from "lucide-react";
import { Text } from "@chakra-ui/react";
import Link from "next/link";

interface User {
  id: string;
  username: string | null;
  image: string | null;
  createdAt: string;
}

interface Post {
  id: string;
  body: string;
  createdAt: string;
  user: User;
}

export default function ProfileComponent({
  initialUser,
  isHisProfile,
  userPosts,
}: {
  initialUser: User | null;
  isHisProfile: boolean;
  userPosts: Post[] | null;
}) {
  if (!initialUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[60dvh]">
        <p className="text-4xl font-bold">User not found!</p>
        <p>This user doesn`t exist anymore</p>
      </div>
    );
  }

  const formattedJoinDate = format(
    new Date(initialUser.createdAt),
    "MMMM d, yyyy",
  );

  function formatPostDate(dateString: string) {
    const postDate = new Date(dateString);
    if (isNaN(postDate.getTime())) {
      console.error(`Invalid Date: ${dateString}`);
      return "Invalid date";
    }
    return formatDistanceToNow(postDate, { addSuffix: true });
  }

  return (
    <div>
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
            {isHisProfile && <UsernameModal />}
          </div>
          <p className="text-sm font-medium text-neutral-600 flex items-center gap-1">
            <Cake className="w-5 h-5" />
            Joined on {formattedJoinDate}
          </p>
        </div>
      </div>
      <div>
        <ul className="border-t">
          {userPosts && userPosts.length > 0 ? (
            userPosts.map((post) => (
              <li
                className="border-x border-b px-5 py-8 flex items-start"
                key={post.id}
              >
                <Link
                  href={`/profile/${post.user.username}`}
                  className="flex-shrink-0"
                >
                  <Image
                    src={post.user.image as string}
                    alt={`${post.user.username}'s avatar`}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                </Link>
                <div className="flex flex-col flex-1 ml-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${post.user.username}`}
                      className="font-medium"
                    >
                      {post.user.username}
                    </Link>
                    <p className="text-sm text-stone-300">|</p>
                    <p className="text-sm">{formatPostDate(post.createdAt)}</p>
                  </div>
                  <div className="overflow-hidden mt-0.5">
                    <p className="text-stone-800 break-words w-[40dvw] pr-10">
                      {post.body}
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <Text>No posts available</Text>
          )}
        </ul>
      </div>
    </div>
  );
}
