import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import LikeButton from "./like-button";
import { auth } from "../../auth";
import PostMenu from "./post-menu";

interface User {
  id: string;
  username: string;
  image: string;
}

interface Post {
  id: string;
  body: string;
  createdAt: string;
  user: User;
  _count: {
    likes: number;
    comments: number;
  };
  likedByCurrentUser: boolean;
}

async function fetchPosts(): Promise<Post[] | null> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Id": userId || "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return null;
  }
}

function formatDate(dateString: string) {
  const postDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - postDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""}`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
  } else {
    return postDate.toLocaleDateString("en-US", options);
  }
}

export default async function GetPosts() {
  const posts = await fetchPosts();

  if (!posts) {
    return <div>Error: Failed to load posts</div>;
  }

  if (posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div className="w-[40dvw] xl:w-auto">
      <ul className="border-t">
        {posts.map((post) => (
          <li
            className="border-x border-b p-5 flex items-start w-[40dvw] xl:w-auto"
            key={post.id}
          >
            <Link
              href={`/profile/${post.user.username}`}
              className="flex-shrink-0"
            >
              <Image
                src={post.user.image}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </Link>
            <div className="flex flex-col flex-1 ml-2">
              <div className="flex items-center justify-between pr-10">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/profile/${post.user.username}`}
                    className="font-medium"
                  >
                    @{post.user.username}
                  </Link>
                  <p className="text-sm text-stone-300">|</p>
                  <p className="text-sm">{formatDate(post.createdAt)}</p>
                </div>
                <PostMenu post={post} />
              </div>
              <div className="overflow-hidden mt-0.5">
                <p className="text-stone-800 break-words w-[35dvw] xl:w-[25dvw] pr-10">
                  {post.body}
                </p>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <LikeButton
                  postId={post.id}
                  initialLikes={post._count.likes}
                  initialLikedByUser={post.likedByCurrentUser}
                />
                <button className="text-sm text-neutral-600 hover:text-yellow-500 flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {post._count.comments}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
